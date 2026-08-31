import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { NbToastrService, NbGlobalPosition } from '@nebular/theme';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Questionnaire } from '../questionnaire.model';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { QuestionnaireService } from '../questionnaire.service';

/**
 * Component used to render a questionnaire
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrl: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-questionnaire-renderer',
    templateUrl: './questionnaire-renderer.component.html',
    styleUrls: ['./questionnaire-renderer.component.scss'],
    standalone: false,
})
export class QuestionnaireRendererComponent implements OnInit, OnDestroy {
    /**
     * The form group used to store the questionnaire data
     */
    questionnaireForm: FormGroup;

    /**
     * The questionnaire to be rendered
     */
    @Input()
    questionnaire: Questionnaire;

    /**
     * The current questionnaire being rendered
     */
    currentQuestionnaire: any;

    /**
     * EventEmitter emitted when the questionnaire response changes
     */
    @Output()
    questionnaireResponseChange = new EventEmitter<any>();

    /**
     * EventEmitter emitted when the questionnaire is submitted successfully
     */
    @Output()
    submitSuccess = new EventEmitter<any>();

    /**
     * EventEmitter emitted when the questionnaire submission fails
     */
    @Output()
    submitError = new EventEmitter<any>();

    /**
     * Optional submission handler function that will be called when the form is submitted
     * If provided, the questionnaire component will handle submission internally
     * The function should return a Promise that resolves with the submission result
     */
    @Input()
    submitHandler: (response: any) => Promise<any>;

    /**
     * The questionnaire response
     */
    questionnaireResponse: any = null;

    /**
     * Subject used to handle component destruction
     */
    destroy$ = new Subject<void>();

    /**
     * Flag to track if the form is currently updating
     */
    isUpdating = false;

    /**
     * Flag to track if the form is currently submitting
     */
    @Input() submitting: boolean = false;

    /**
     * Flag to track if the form has been submitted
     */
    @Input() submitted: boolean = false;

    /**
     * Error object containing the submission error
     */
    @Input() submissionError: any = null;

    /**
     * Current step index in the multi-step form
     */
    currentStepIndex = 0;

    /**
     * Array of steps in the multi-step form
     */
    steps: any[] = [];

    /**
     * Object containing the validation status of each step
     */
    stepValidStatus: { [key: string]: boolean } = {};

    /**
     * ViewChild reference to the top of the form element
     */
    @ViewChild('topOfForm') topOfForm: ElementRef;

    /**
     * Constructor for the QuestionnaireRendererComponent
     * @param fb - The FormBuilder service
     * @param toastrService - The NbToastrService for displaying toasts
     * @param questionnaireService - The QuestionnaireService for handling questionnaire operations
     */
    constructor(
        private fb: FormBuilder,
        private toastrService: NbToastrService,
        private questionnaireService: QuestionnaireService
    ) {
        this.questionnaireForm = this.fb.group({});
    }

    /**
     * Lifecycle hook that is called after the component is initialized
     */
    ngOnInit() {
        // If a questionnaire is provided as input, use it
        if (this.questionnaire) {
            this.currentQuestionnaire = this.questionnaire;
            this.buildForm(this.currentQuestionnaire);
            this.setupFormValueChanges();

            // Initialize steps from questionnaire groups
            if (this.currentQuestionnaire && this.currentQuestionnaire.item) {
                this.steps = this.currentQuestionnaire.item;

                // Initialize step validation status
                this.steps.forEach(step => {
                    this.stepValidStatus[step.linkId] = true;
                });
            }
        }
    }

    /**
     * Sets up form value changes subscription
     */
    setupFormValueChanges() {
        this.questionnaireForm.valueChanges
            .pipe(debounceTime(100), takeUntil(this.destroy$))
            .subscribe({ next: this.setupValueChanges });
    }

    setupValueChanges = () => {
        if (!this.isUpdating) {
            this.isUpdating = true;
            try {
                this.questionnaireService.updateConditionalQuestions(
                    this.questionnaireForm,
                    this.currentQuestionnaire
                );
                this.questionnaireResponse =
                    this.questionnaireService.generateQuestionnaireResponse(
                        this.currentQuestionnaire,
                        this.questionnaireForm
                    );
                this.questionnaireResponseChange.emit(
                    this.questionnaireResponse
                );

                // Update step validation status
                this.updateStepValidationStatus();
            } finally {
                this.isUpdating = false;
            }
        }
    };

    /**
     * Update validation status for each step
     */
    updateStepValidationStatus() {
        this.steps.forEach(step => {
            const stepGroup = this.questionnaireForm.get(
                step.linkId
            ) as FormGroup;
            this.validateStepStatus(stepGroup, step);
        });
    }

    validateStepStatus(stepGroup, step) {
        if (stepGroup) {
            // Check if any visible required fields are empty
            let isValid = true;

            // Check each question in the step
            if (step.item) {
                step.item.forEach((question: any) => {
                    if (
                        question.required &&
                        this.shouldShowQuestion(question) &&
                        !this.isHiddenQuestion(question)
                    ) {
                        const control = stepGroup.get(question.linkId);
                        if (control && control.invalid) {
                            isValid = false;
                        }
                    }
                });
            }

            this.stepValidStatus[step.linkId] = isValid;
        }
    }

    /**
     * Lifecycle hook that is called when the component is destroyed
     */
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Build the form based on the questionnaire
     * @param questionnaire - The questionnaire to build the form for
     */
    buildForm(questionnaire: any) {
        const group: any = {};

        const processItems = (items: any[], parentGroup: any = group) => {
            items.forEach(item => {
                if (item.type === 'group') {
                    const subGroup: any = {};
                    if (item.item) {
                        processItems(item.item, subGroup);
                    }
                    parentGroup[item.linkId] = this.fb.group(subGroup);
                } else if (
                    item.type !== 'display' &&
                    !this.isHiddenQuestion(item)
                ) {
                    const validators = item.required
                        ? [Validators.required]
                        : [];

                    // Initialize as array for repeating questions, single value otherwise
                    const initialValue = item.repeats ? [] : null;
                    parentGroup[item.linkId] = [initialValue, validators];

                    this.handleNestedQuestions(item, parentGroup);
                }
            });
        };

        processItems(questionnaire.item);
        this.questionnaireForm = this.fb.group(group);
    }

    handleNestedQuestions(item, parentGroup) {
        // Handle nested items (like "Which Breast?" questions)
        if (item.item && item.item.length > 0) {
            item.item.forEach((nestedItem: any) => {
                this.handleNestedItem(nestedItem, parentGroup);
            });
        }
    }

    handleNestedItem(nestedItem, parentGroup) {
        if (
            nestedItem.type !== 'display' &&
            !this.isHiddenQuestion(nestedItem)
        ) {
            const nestedValidators = nestedItem.required
                ? [Validators.required]
                : [];
            const nestedInitialValue = nestedItem.repeats ? [] : null;
            parentGroup[nestedItem.linkId] = [
                nestedInitialValue,
                nestedValidators,
            ];
        }
    }

    /**
     * Check if a question should be hidden (calculated fields, etc.)
     * @param question - The question to check
     * @returns True if the question should be hidden, false otherwise
     */
    isHiddenQuestion(question: any): boolean {
        return this.questionnaireService.isHiddenQuestion(question);
    }

    /**
     * Get all questions including nested ones
     * @returns Array of all questions
     */
    getAllQuestions(): any[] {
        return this.questionnaireService.getAllQuestions(
            this.currentQuestionnaire
        );
    }

    /**
     * Calculate scores based on form values
     * @param scoreType - The type of score to calculate
     * @returns The calculated score
     */
    getCalculatedScore(scoreType: string): number {
        return this.questionnaireService.getCalculatedScore(
            scoreType,
            this.questionnaireForm
        );
    }

    /**
     * Generate FHIR QuestionnaireResponse
     * @returns The generated QuestionnaireResponse
     */
    generateQuestionnaireResponse(): any {
        return this.questionnaireService.generateQuestionnaireResponse(
            this.currentQuestionnaire,
            this.questionnaireForm
        );
    }

    /**
     * Updates conditional questions based on form values
     */
    updateConditionalQuestions() {
        this.questionnaireService.updateConditionalQuestions(
            this.questionnaireForm,
            this.currentQuestionnaire
        );
    }

    /**
     * Evaluate enableWhen conditions to determine if a question should be shown
     * @param enableWhenArray Array of enableWhen conditions
     * @param enableBehavior Behavior for multiple conditions ('any' or 'all')
     * @returns boolean indicating if the question should be shown
     */
    evaluateEnableWhen(
        enableWhenArray: any[],
        enableBehavior: string = 'any'
    ): boolean {
        return this.questionnaireService.evaluateEnableWhen(
            enableWhenArray,
            enableBehavior,
            this.questionnaireForm
        );
    }

    /**
     * Check if a question should be displayed based on enableWhen conditions
     * @param question The question to check
     * @returns boolean indicating if the question should be displayed
     */
    shouldShowQuestion(question: any): boolean {
        return this.questionnaireService.shouldShowQuestion(
            question,
            this.questionnaireForm
        );
    }

    /**
     * Method to select an option for single-select questions
     * @param questionLinkId The linkId of the question
     * @param optionValue The value of the option to select
     */
    selectOption(questionLinkId: string, optionValue: string) {
        const control = this.getFormControl(questionLinkId);
        this.setControlValue(control, optionValue);
    }

    setControlValue(control, optionValue) {
        if (control && !this.isUpdating) {
            control.setValue(optionValue);
            control.markAsTouched();
        }
    }

    /**
     * Method to handle multiple selections for coding questions
     * @param questionLinkId The linkId of the question
     * @param optionValue The value of the option to select
     */
    selectMultipleOption(questionLinkId: string, optionValue: string) {
        const control = this.getFormControl(questionLinkId);
        this.processMultipleOptions(control, optionValue);
    }

    processMultipleOptions(control, optionValue) {
        if (control && !this.isUpdating) {
            let currentValues = control.value;

            // Ensure it's an array
            if (!Array.isArray(currentValues)) {
                currentValues = currentValues ? [currentValues] : [];
            }

            // Toggle the option
            const index = currentValues.indexOf(optionValue);
            if (index > -1) {
                currentValues.splice(index, 1);
            } else {
                currentValues.push(optionValue);
            }

            control.setValue([...currentValues]);
            control.markAsTouched();
        }
    }

    /**
     * Method to check if an option is selected (single select)
     * @param questionLinkId The linkId of the question
     * @param optionValue The value of the option to check
     * @returns boolean indicating if the option is selected
     */
    isOptionSelected(questionLinkId: string, optionValue: string): boolean {
        const control = this.getFormControl(questionLinkId);
        return control ? control.value === optionValue : false;
    }

    /**
     * Method to check if an option is selected in multi-select
     * @param questionLinkId The linkId of the question
     * @param optionValue The value of the option to check
     * @returns boolean indicating if the option is selected
     */
    isMultipleOptionSelected(
        questionLinkId: string,
        optionValue: string
    ): boolean {
        const control = this.getFormControl(questionLinkId);
        if (!control || !control.value) return false;

        const values = Array.isArray(control.value)
            ? control.value
            : [control.value];
        return values.includes(optionValue);
    }

    /**
     * Helper method to get form control by linkId (handles nested groups)
     * @param linkId The linkId of the control to get
     * @returns The form control
     */
    getFormControl(linkId: string) {
        return this.questionnaireService.getFormControl(
            linkId,
            this.questionnaireForm
        );
    }

    /**
     * Method to check if a field has validation errors and is touched
     * @param questionLinkId The linkId of the question
     * @returns boolean indicating if the field has validation errors and is touched
     */
    hasError(questionLinkId: string): boolean {
        const control = this.getFormControl(questionLinkId);
        return control ? control.invalid && control.touched : false;
    }

    /**
     * Method to get error message for a field
     * @param questionLinkId The linkId of the question
     * @returns The error message for the field
     */
    getErrorMessage(questionLinkId: string): string {
        const control = this.getFormControl(questionLinkId);
        if (control && control.errors && control.touched) {
            if (control.errors['required']) {
                return 'This field is required';
            }
        }
        return '';
    }

    /**
     * Method to handle form submission
     */
    onSubmit() {
        this.markFormGroupTouched(this.questionnaireForm);

        // Update step validation status
        this.updateStepValidationStatus();

        if (!this.questionnaireForm.valid) {
            this.showToast(
                'danger',
                'Validation Error',
                'Please complete all required fields before submitting.'
            );
            return;
        }

        this.questionnaireResponse = this.generateQuestionnaireResponse();
        // Emit the response to parent components
        this.questionnaireResponseChange.emit(this.questionnaireResponse);

        this.handleSubmittedForm();
    }

    handleSubmittedForm() {
        // If a submit handler is provided, use it to submit the form
        if (this.submitHandler) {
            this.handleSubmission();
        }
    }

    /**
     * Handles form submission using the provided submitHandler function
     */
    handleSubmission() {
        if (!this.submitHandler) {
            return;
        }

        this.submitting = true;
        this.submitted = false;
        this.submissionError = null;

        // Call the submit handler function
        this.submitHandler(this.questionnaireResponse)
            .then(response => {
                this.submitting = false;
                this.submitted = true;
                this.submitSuccess.emit(response);
            })
            .catch(error => {
                this.submitting = false;
                this.submissionError = error;
                this.submitError.emit(error);
            });
    }

    /**
     * Shows a toast message
     * @param status The status of the toast (success, danger, warning, info)
     * @param title The title of the toast
     * @param message The message to display in the toast
     */
    showToast(status: string, title: string, message: string) {
        this.toastrService.show(message, title, {
            status: status,
            position: 'bottom-right' as NbGlobalPosition,
        });
    }

    /**
     * Mark all controls in a form group as touched
     */
    markFormGroupTouched(formGroup: FormGroup | FormArray) {
        this.questionnaireService.markFormGroupTouched(formGroup);
    }

    /**
     * Reset the form
     */
    resetForm() {
        this.questionnaireForm.reset();
        this.questionnaireResponse = null;
        this.currentStepIndex = 0;

        // Reset step validation status
        this.steps.forEach(step => {
            this.stepValidStatus[step.linkId] = true;
        });

        // Emit null to clear any previous response
        this.questionnaireResponseChange.emit(null);

        this.scrollToTop();
    }

    /**
     * Get the form data
     * @returns The form data
     */
    getFormData() {
        return this.questionnaireForm.value;
    }

    /**
     * Multi-step navigation methods
     */
    nextStep() {
        // Validate current step before proceeding
        const currentStep = this.steps[this.currentStepIndex];
        const stepGroup = this.questionnaireForm.get(
            currentStep.linkId
        ) as FormGroup;

        this.processNextStep(stepGroup);
    }

    processNextStep(stepGroup) {
        if (stepGroup) {
            this.markFormGroupTouched(stepGroup);

            if (stepGroup.valid) {
                if (this.currentStepIndex < this.steps.length - 1) {
                    this.currentStepIndex++;
                    this.scrollToTop();
                }
            }
        } else {
            // If no form group exists for this step (unlikely), just proceed
            if (this.currentStepIndex < this.steps.length - 1) {
                this.currentStepIndex++;
                this.scrollToTop();
            }
        }
    }

    /**
     * Go to the previous step
     */
    previousStep() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.scrollToTop();
        }
    }

    /**
     * Go to a specific step
     * @param index The index of the step to go to
     */
    goToStep(index: number) {
        if (index >= 0 && index < this.steps.length) {
            this.currentStepIndex = index;
            this.scrollToTop();
        }
    }

    /**
     * Check if the current step is the first step
     * @returns boolean indicating if the current step is the first step
     */
    isFirstStep(): boolean {
        return this.currentStepIndex === 0;
    }

    /**
     * Check if the current step is the last step
     * @returns boolean indicating if the current step is the last step
     */
    isLastStep(): boolean {
        return this.currentStepIndex === this.steps.length - 1;
    }

    /**
     * Get the progress percentage of the current step
     * @returns The progress percentage of the current step
     */
    getStepProgress(): number {
        return ((this.currentStepIndex + 1) / this.steps.length) * 100;
    }

    /**
     * Check if a step is valid
     * @param index The index of the step to check
     * @returns boolean indicating if the step is valid
     */
    isStepValid(index: number): boolean {
        if (index >= 0 && index < this.steps.length) {
            const step = this.steps[index];
            return this.stepValidStatus[step.linkId] === true;
        }
        return true;
    }

    /**
     * Check if a step has been visited
     * @param index The index of the step to check
     * @returns boolean indicating if the step has been visited
     */
    isStepVisited(index: number): boolean {
        return index <= this.currentStepIndex;
    }

    /**
     * Scroll to the top of the form
     */
    private scrollToTop() {
        if (this.topOfForm) {
            this.topOfForm.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormArray, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})

/**
 * Service for handling questionnaire operations
 */
export class QuestionnaireService {
    /**
     * Constructor for the QuestionnaireService
     * @param http - The HttpClient service
     */
    constructor(private http: HttpClient) {}

    /**
     * Generate FHIR QuestionnaireResponse from form data
     * @param questionnaire - The questionnaire data
     * @param questionnaireForm - The questionnaire form
     * @returns The generated QuestionnaireResponse
     */
    generateQuestionnaireResponse(
        questionnaire: any,
        questionnaireForm: FormGroup
    ): any {
        const response = {
            resourceType: 'QuestionnaireResponse',
            meta: {
                profile: [
                    'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaireresponse|2.7',
                ],
                tag: [
                    {
                        code: 'sghiFormsVersion: 1.0.0',
                    },
                ],
            },
            status: 'active',
            authored: new Date().toISOString(),
            item: [],
        };

        // Process each section
        questionnaire.item.forEach((section: any) => {
            const sectionResponse = this.processSectionForResponse(
                section,
                questionnaireForm
            );
            if (sectionResponse) {
                response.item.push(sectionResponse);
            }
        });

        return response;
    }

    /**
     * Process a section for the questionnaire response
     * @param section - The section data
     * @param questionnaireForm - The questionnaire form
     * @returns The processed section response
     */
    processSectionForResponse(section: any, questionnaireForm: FormGroup): any {
        const sectionGroup = questionnaireForm.get(section.linkId) as FormGroup;
        if (!sectionGroup) return null;

        const sectionResponse = {
            linkId: section.linkId,
            text: section.text,
            item: [],
        };

        // Process questions in this section
        if (section.item) {
            section.item.forEach((question: any) => {
                const questionResponse = this.processQuestionForResponse(
                    question,
                    sectionGroup
                );
                if (questionResponse) {
                    sectionResponse.item.push(questionResponse);
                }
            });
        }

        const response = this.evaluateResponseInfo(sectionResponse);

        return response;
    }

    evaluateResponseInfo(sectionResponse) {
        return sectionResponse.item.length > 0 ? sectionResponse : null;
    }

    /**
     * Process a question for the questionnaire response
     * @param question - The question data
     * @param formGroup - The form group
     * @returns The processed question response
     */
    processQuestionForResponse(question: any, formGroup: FormGroup): any {
        const control = formGroup.get(question.linkId);
        if (
            !control ||
            control.value === null ||
            control.value === undefined ||
            control.value === '' ||
            (Array.isArray(control.value) && control.value.length === 0)
        ) {
            // Check if this is a calculated score field
            if (
                this.isHiddenQuestion(question) &&
                question.linkId.includes('-score')
            ) {
                const scoreValue = this.getCalculatedScore(
                    question.linkId,
                    formGroup
                );
                return {
                    linkId: question.linkId,
                    text: question.text,
                    answer: [
                        {
                            valueInteger: scoreValue,
                        },
                    ],
                };
            }
            return null;
        }

        const questionResponse: any = {
            linkId: question.linkId,
            text: question.text,
            answer: [],
        };

        // Handle multiple answers for repeating questions
        if (question.repeats && Array.isArray(control.value)) {
            control.value.forEach((value: any) => {
                const answerValue = this.createAnswerValue(question, value);
                questionResponse.answer.push(answerValue);
            });
        } else {
            // Single answer
            const answerValue = this.createAnswerValue(question, control.value);

            // Check for nested questions
            const nestedItems = this.processNestedItems(question, formGroup);
            if (nestedItems.length > 0) {
                answerValue.item = nestedItems;
            }

            questionResponse.answer.push(answerValue);
        }

        return questionResponse;
    }

    /**
     * Create an answer value based on question type
     * @param question - The question data
     * @param value - The value to create an answer for
     * @returns The created answer value
     */
    createAnswerValue(question: any, value: any): any {
        switch (question.type) {
            case 'choice':
            case 'boolean':
            case 'coding':
                return {
                    valueCoding: {
                        display: value,
                    },
                };
            case 'integer':
                return {
                    valueInteger: parseInt(value, 10),
                };
            case 'string':
            case 'text':
                return {
                    valueString: value,
                };
            default:
                return {
                    valueString: value.toString(),
                };
        }
    }

    /**
     * Process nested items for a question
     * @param question - The question data
     * @param formGroup - The form group
     * @returns The processed nested items
     */
    processNestedItems(question: any, formGroup: FormGroup): any[] {
        const nestedItems: any[] = [];

        if (question.item && question.item.length > 0) {
            question.item.forEach((nestedQuestion: any) => {
                const nestedControl = formGroup.get(nestedQuestion.linkId);
                if (
                    nestedControl &&
                    nestedControl.value !== null &&
                    nestedControl.value !== undefined &&
                    nestedControl.value !== ''
                ) {
                    let processedValue = nestedControl.value;
                    if (
                        Array.isArray(processedValue) &&
                        processedValue.length > 0
                    ) {
                        processedValue = processedValue[0];
                    } else if (
                        Array.isArray(processedValue) &&
                        processedValue.length === 0
                    ) {
                        return;
                    }

                    const nestedResponse = {
                        linkId: nestedQuestion.linkId,
                        text: nestedQuestion.text,
                        answer: [
                            this.createAnswerValue(
                                nestedQuestion,
                                processedValue
                            ),
                        ],
                    };
                    nestedItems.push(nestedResponse);
                }
            });
        }

        return nestedItems;
    }

    /**
     * Check if a question should be hidden (calculated fields, etc.)
     * @param question - The question data
     * @returns boolean indicating if the question should be hidden
     */
    isHiddenQuestion(question: any): boolean {
        if (!question.extension) {
            return false;
        }

        const hiddenExtension = question.extension.find(
            (ext: any) =>
                ext.url ===
                'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden'
        );

        if (hiddenExtension && hiddenExtension.valueBoolean === true) {
            return true;
        }

        const calculatedExtension = question.extension.find(
            (ext: any) =>
                ext.url ===
                'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression'
        );

        if (calculatedExtension) {
            return true;
        }

        if (question.linkId && question.linkId.includes('-score')) {
            return true;
        }

        return false;
    }

    /**
     * Get all questions including nested ones from a questionnaire
     * @param questionnaire - The questionnaire data
     * @returns Array of all questions
     */
    getAllQuestions(questionnaire: any): any[] {
        const allQuestions: any[] = [];

        const collectQuestions = (items: any[]) => {
            items.forEach(item => {
                if (item.type === 'group' && item.item) {
                    collectQuestions(item.item);
                } else if (item.type !== 'display') {
                    allQuestions.push(item);
                    // Add nested questions
                    if (item.item && item.item.length > 0) {
                        item.item.forEach(nestedItem => {
                            if (nestedItem.type !== 'display') {
                                allQuestions.push(nestedItem);
                            }
                        });
                    }
                }
            });
        };

        collectQuestions(questionnaire.item);
        return allQuestions;
    }

    /**
     * Calculate scores based on form values
     * @param scoreType - The type of score to calculate
     * @param questionnaireForm - The questionnaire form
     * @returns The calculated score
     */
    getCalculatedScore(
        scoreType: string,
        questionnaireForm: FormGroup
    ): number {
        let score = 0;

        switch (scoreType) {
            case 'family-history-score':
                score = this.calculateFamilyHistoryScore(questionnaireForm);
                break;
            case 'risk-factors-score':
            case 'risk-assessment-score':
                score = this.calculateRiskFactorsScore(questionnaireForm);
                break;
            case 'symptoms-score':
                score = this.calculateSymptomsScore(questionnaireForm);
                break;
        }

        return score;
    }

    /**
     * Calculate family history score
     * @param questionnaireForm - The questionnaire form
     * @returns The calculated family history score
     */
    calculateFamilyHistoryScore(questionnaireForm: FormGroup): number {
        const familyHistoryGroup = questionnaireForm.get('family-history');
        if (!familyHistoryGroup) return 0;

        let score = 0;
        const formValue = familyHistoryGroup.value;

        Object.keys(formValue).forEach(key => {
            if (formValue[key] === 'Yes') {
                score += 1;
            }
        });

        return score;
    }

    /**
     * Calculate risk factors score
     * @param questionnaireForm - The questionnaire form
     * @returns The calculated risk factors score
     */
    calculateRiskFactorsScore(questionnaireForm: FormGroup): number {
        const riskFactorsGroup =
            questionnaireForm.get('365201156140') ||
            questionnaireForm.get('risk-factors');
        if (!riskFactorsGroup) return 0;

        let score = 0;
        const formValue = riskFactorsGroup.value;

        Object.keys(formValue).forEach(key => {
            if (formValue[key] === 'Yes') {
                score += 1;
            }
        });

        return score;
    }

    /**
     * Calculate symptoms score
     * @param questionnaireForm - The questionnaire form
     * @returns The calculated symptoms score
     */
    calculateSymptomsScore(questionnaireForm: FormGroup): number {
        const symptomsGroup = questionnaireForm.get('symptoms');
        if (!symptomsGroup) return 0;

        let score = 0;
        const formValue = symptomsGroup.value;

        Object.keys(formValue).forEach(key => {
            if (formValue[key] === 'Yes') {
                score += 1;
            }
        });

        return score;
    }

    /**
     * Evaluate enableWhen conditions to determine if a question should be shown
     * @param enableWhenArray Array of enableWhen conditions
     * @param enableBehavior Behavior for multiple conditions ('any' or 'all')
     * @param questionnaireForm The form group containing the form controls
     * @returns boolean indicating if the question should be shown
     */
    evaluateEnableWhen(
        enableWhenArray: any[],
        enableBehavior: string = 'any',
        questionnaireForm: FormGroup
    ): boolean {
        if (!enableWhenArray || enableWhenArray.length === 0) {
            return true;
        }

        const results = enableWhenArray.map(condition => {
            const questionControl = this.getFormControl(
                condition.question,
                questionnaireForm
            );
            if (!questionControl) {
                return false;
            }

            const currentValue = questionControl.value;

            switch (condition.operator) {
                case '=':
                    if (condition.answerCoding) {
                        return currentValue === condition.answerCoding.display;
                    }
                    if (condition.answerBoolean !== undefined) {
                        return (
                            currentValue === condition.answerBoolean.toString()
                        );
                    }
                    return currentValue === condition.answerString;

                case '!=':
                    if (condition.answerCoding) {
                        return currentValue !== condition.answerCoding.display;
                    }
                    if (condition.answerBoolean !== undefined) {
                        return (
                            currentValue !== condition.answerBoolean.toString()
                        );
                    }
                    return currentValue !== condition.answerString;

                case 'exists':
                    return (
                        currentValue !== null &&
                        currentValue !== undefined &&
                        currentValue !== ''
                    );

                default:
                    return false;
            }
        });

        if (enableBehavior === 'all') {
            return results.every(result => result === true);
        } else {
            return results.some(result => result === true);
        }
    }

    /**
     * Check if a question should be displayed based on enableWhen conditions
     * @param question - The question data
     * @param questionnaireForm - The questionnaire form
     * @returns boolean indicating if the question should be displayed
     */
    shouldShowQuestion(question: any, questionnaireForm: FormGroup): boolean {
        if (!question.enableWhen || question.type === 'display') {
            return true;
        }
        return this.evaluateEnableWhen(
            question.enableWhen,
            question.enableBehavior,
            questionnaireForm
        );
    }

    /**
     * Helper method to get form control by linkId (handles nested groups)
     * @param linkId The linkId of the control to get
     * @returns The form control
     */
    getFormControl(linkId: string, formGroup: FormGroup) {
        let control = formGroup.get(linkId);

        if (!control) {
            // Search in all form groups recursively
            const searchInGroup = (group: FormGroup): any => {
                for (const key of Object.keys(group.controls)) {
                    const ctrl = group.get(key);
                    if (ctrl instanceof FormGroup) {
                        const found = ctrl.get(linkId) || searchInGroup(ctrl);
                        if (found) return found;
                    }
                }
                return null;
            };

            control = searchInGroup(formGroup);
        }

        return control;
    }

    /**
     * Mark all controls in a form group as touched
     * @param formGroup The form group to mark as touched
     */
    markFormGroupTouched(formGroup: FormGroup | FormArray) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup || control instanceof FormArray) {
                this.markFormGroupTouched(control);
            }
        });
    }

    /**
     * Updates conditional questions based on form values
     * @param questionnaireForm The questionnaire form
     * @param questionnaire The questionnaire data
     */
    updateConditionalQuestions(
        questionnaireForm: FormGroup,
        questionnaire: any
    ) {
        const allQuestions = this.getAllQuestions(questionnaire);

        allQuestions.forEach((question: any) => {
            if (
                question.enableWhen &&
                question.type !== 'display' &&
                !this.isHiddenQuestion(question)
            ) {
                const shouldShow = this.evaluateEnableWhen(
                    question.enableWhen,
                    question.enableBehavior,
                    questionnaireForm
                );
                const control = this.getFormControl(
                    question.linkId,
                    questionnaireForm
                );

                this.processControl(control, shouldShow, question);
            }
        });
    }

    /**
     * Process form control
     * @param control
     * @param shouldShow
     * @param question
     */
    processControl(control, shouldShow, question) {
        if (control) {
            if (!shouldShow) {
                const resetValue = question.repeats ? [] : null;
                if (control.value !== resetValue) {
                    control.setValue(resetValue, {
                        emitEvent: false,
                    });
                }
                control.clearValidators();
            } else {
                const validators = question.required
                    ? [Validators.required]
                    : [];
                control.setValidators(validators);
            }
            control.updateValueAndValidity({ emitEvent: false });
        }
    }
}

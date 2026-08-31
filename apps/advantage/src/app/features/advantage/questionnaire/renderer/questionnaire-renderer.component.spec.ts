import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { QuestionnaireRendererComponent } from './questionnaire-renderer.component';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { QuestionnaireService } from '../questionnaire.service';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class QuestionnaireServiceStub {
    updateConditionalQuestions() {
        return true;
    }
    generateQuestionnaireResponse() {
        return true;
    }
    getFormControl() {
        return true;
    }
    markFormGroupTouched() {
        return true;
    }
    isHiddenQuestion() {
        return true;
    }
    shouldShowQuestion() {
        return true;
    }
    getAllQuestions() {
        return true;
    }
    getCalculatedScore() {
        return true;
    }
    evaluateEnableWhen() {
        return true;
    }
}

describe('QuestionnaireRendererComponent', () => {
    let component: QuestionnaireRendererComponent;
    let fixture: ComponentFixture<QuestionnaireRendererComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [QuestionnaireRendererComponent],
            providers: [
                {
                    provide: QuestionnaireService,
                    useClass: QuestionnaireServiceStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(QuestionnaireRendererComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should emit submitSuccess when handleSubmission resolves', fakeAsync(() => {
        component.steps = [
            {
                id: 1,
                item: [
                    {
                        linkId: 'section',
                        type: 'group',
                        item: [
                            {
                                linkId: 'q1',
                                type: 'string',
                            },
                            {
                                linkId: 'q2',
                                type: 'string',
                                required: true,
                                enableWhen: [
                                    {
                                        question: 'q1',
                                        operator: '=',
                                        answerString: 'No',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            { id: 2 },
        ];
        component.updateStepValidationStatus();
        component.isHiddenQuestion(component.steps[0]);
        component.getAllQuestions();
        component.getCalculatedScore('21');
        component.generateQuestionnaireResponse();
        component.updateConditionalQuestions();
        const condition = [
            {
                question: 'q1',
                operator: '=',
                answerBoolean: true,
            },
        ];
        component.evaluateEnableWhen(condition, 'any');
        component.evaluateEnableWhen(condition, undefined);
        component.buildForm(component.steps[0]);
        component.submitHandler = () => Promise.resolve('success');
        spyOn(component.submitSuccess, 'emit');
        component.questionnaireResponse = {};
        component.currentStepIndex = 0;
        component.previousStep();
        component.nextStep();
        component.isStepValid(1);
        component.isStepValid(-1);
        component.isStepVisited(1);
        component.currentStepIndex = 1;
        component.previousStep();
        component.nextStep();
        component.processNextStep({ valid: true });
        component.currentStepIndex = 0;
        component.processNextStep({ valid: true });
        component.processNextStep(undefined);
        component.goToStep(1);
        component.isFirstStep();
        component.isLastStep();
        component.getStepProgress();
        component['handleSubmission']();
        tick();

        expect(component.submitSuccess.emit).toHaveBeenCalledWith('success');
    }));

    it('should emit submitError when handleSubmission rejects', fakeAsync(() => {
        component.steps = [
            {
                id: 1,
                item: [
                    {
                        linkId: 'section',
                        type: 'group',
                        item: [
                            {
                                linkId: 'q1',
                                type: 'string',
                            },
                            {
                                linkId: 'q2',
                                type: 'string',
                                required: true,
                                enableWhen: [
                                    {
                                        question: 'q1',
                                        operator: '=',
                                        answerString: 'No',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            { id: 2 },
        ];
        component.submitHandler = () => Promise.reject('error');
        spyOn(component.submitError, 'emit');
        component.questionnaireResponse = {};
        component.resetForm();
        component['handleSubmission']();
        tick();
        expect(component.submitError.emit).toHaveBeenCalledWith('error');
    }));

    it('should mark form group as touched', () => {
        const mockFormGroup = new FormGroup({
            name: new FormControl('John Doe', Validators.required),
            age: new FormControl(30, Validators.min(18)),
        });
        component.markFormGroupTouched(mockFormGroup);
        component.onSubmit();
        const item = {
            item: [],
        };
        component.handleNestedQuestions(item, []);
        const item2 = {
            item: [
                {
                    type: 'display',
                    required: true,
                    linkId: 1,
                },
            ],
        };
        component.handleNestedQuestions(item2, [{ id: 1 }]);
        const item3 = {
            item: [
                {
                    type: 'string',
                    required: true,
                    linkId: 1,
                },
            ],
        };
        const control = {
            setValue: () => {},
            markAsTouched: () => {},
            value: undefined,
        };
        spyOn(component, 'setControlValue').and.callThrough();
        component.setControlValue(control, true);
        component.setControlValue(control, false);
        component.handleNestedQuestions(item3, [{ id: 1 }]);
        expect(component.setControlValue).toHaveBeenCalled();
    });

    it('should scroll to top of form if topOfForm is defined', () => {
        const mockElement = jasmine.createSpyObj('nativeElement', [
            'scrollIntoView',
        ]);
        component.showToast('danger', 'Test Title', 'Test Message');
        component.topOfForm = new ElementRef(mockElement);
        component['scrollToTop']();
        const control = {
            setValue: () => {},
            markAsTouched: () => {},
            value: undefined,
        };
        component.processMultipleOptions(control, '123');
        component.processMultipleOptions(control, '123');
        component.processMultipleOptions(control, '123333');
        const control2 = {
            setValue: () => {},
            markAsTouched: () => {},
            value: ['asdfa', 'asdfasdf'],
        };
        component.processMultipleOptions(control2, '123');
        const control3 = {
            setValue: () => {},
            markAsTouched: () => {},
            value: ['123', '123212'],
        };
        component.processMultipleOptions(control3, '123');
        const control4 = {
            setValue: () => {},
            markAsTouched: () => {},
            value: '123',
        };
        component.processMultipleOptions(control4, '123');
        component.isMultipleOptionSelected('123', '123');
        const contrl: AbstractControl = new FormControl('test value');
        spyOn(component, 'getFormControl').and.returnValue(contrl);
        component.processMultipleOptions(control4, '123');
        component.isOptionSelected('21', '12');
        component.isMultipleOptionSelected('123', '123');
        expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
            behavior: 'smooth',
            block: 'start',
        });
    });

    it('should set isOptionSelected and hasError as false', () => {
        spyOn(component, 'getFormControl').and.returnValue(undefined);
        spyOn(component, 'isOptionSelected').and.callThrough();
        component.isOptionSelected('21', '12');
        component.hasError('21');
        expect(component.isOptionSelected).toHaveBeenCalled();
    });

    it('should set validators for required questions in buildForm', () => {
        spyOn(component, 'isHiddenQuestion').and.returnValue(false);
        const questionnaire = {
            item: [
                {
                    linkId: 'step1',
                    type: 'group',
                    item: [
                        {
                            linkId: 'q1',
                            type: 'string',
                            required: true,
                        },
                    ],
                },
            ],
        };
        component.buildForm(questionnaire);
        const questionnairefalse = {
            item: [
                {
                    linkId: 'step1',
                    type: 'group',
                    repeats: true,
                    item: [
                        {
                            linkId: 'q1',
                            type: 'string',
                            required: false,
                            repeats: true,
                        },
                    ],
                },
            ],
        };
        component.buildForm(questionnairefalse);
        const control = component.questionnaireForm.get('step1.q1');
        expect(control?.validator).toBeNull();
        const contrl: AbstractControl = new FormControl(['123', '123']);
        spyOn(component, 'getFormControl').and.returnValue(contrl);
        component.processMultipleOptions(contrl, '123');
        component.processMultipleOptions(contrl, undefined);
        const condition = [
            {
                question: 'q1',
                operator: '=',
                answerBoolean: true,
            },
        ];
        spyOn(component, 'evaluateEnableWhen').and.callThrough();
        component.evaluateEnableWhen(condition, 'all');
        expect(component.evaluateEnableWhen).toHaveBeenCalled();
    });

    it('should have null for the form control for processMultipleOptions', () => {
        const contrl: AbstractControl = new FormControl(undefined);
        spyOn(component, 'getFormControl').and.returnValue(contrl);
        spyOn(component, 'processMultipleOptions');
        component.processMultipleOptions(contrl, '123');
        component.isOptionSelected('123', '12');
        expect(component.processMultipleOptions).toHaveBeenCalled();
    });

    it('should have null for the form control for processMultipleOptions', () => {
        const contrl: AbstractControl = new FormControl(undefined);
        spyOn(component, 'getFormControl').and.returnValue(contrl);
        spyOn(component, 'processMultipleOptions');
        component.processMultipleOptions(contrl, '123');
        component.isOptionSelected('123', '12');
        expect(component.processMultipleOptions).toHaveBeenCalled();
    });

    it('should show toast if form is invalid on submit', () => {
        spyOn(component, 'showToast');
        component.questionnaireForm = new FormGroup({});
        spyOnProperty(
            component.questionnaireForm,
            'valid',
            'get'
        ).and.returnValue(false);
        component.onSubmit();
        expect(component.showToast).toHaveBeenCalledWith(
            'danger',
            'Validation Error',
            'Please complete all required fields before submitting.'
        );
    });

    it('should return correct step progress', () => {
        component.steps = [{}, {}, {}];
        component.currentStepIndex = 1;
        expect(component.getStepProgress()).toBeCloseTo(66.666, 1);
    });

    it('should return true for valid step in isStepValid', () => {
        component.steps = [{ linkId: 'a' }];
        component.stepValidStatus = { a: true };
        const item = {
            item: [
                {
                    linkId: 'section1',
                    text: 'Section 1',
                    required: true,
                    item: [
                        {
                            linkId: 'q1',
                            text: 'Question 1',
                            type: 'string',
                        },
                    ],
                },
            ],
        };
        const stepGroup = {
            get: () => {
                const control = { invalid: true };
                return control;
            },
        };
        component.validateStepStatus(stepGroup, item);
        spyOn(component, 'shouldShowQuestion').and.returnValue(true);
        spyOn(component, 'isHiddenQuestion').and.returnValue(false);
        component.validateStepStatus(stepGroup, item);
        component.questionnaire = {
            resourceType: '12',
            id: '12',
            title: '21',
            status: '12',
            item: [
                {
                    linkId: 'section1',
                    text: 'Section 1',
                    required: true,
                    item: [
                        {
                            linkId: 'q1',
                            text: 'Question 1',
                            type: 'string',
                        },
                    ],
                    type: 'string',
                },
            ],
        };
        component.ngOnInit();
        component.onSubmit();
        component.getFormData();
        expect(component.isStepValid(0)).toBeTrue();
    });

    it('should return true for visited steps', () => {
        component.currentStepIndex = 2;
        const nestedItem = {
            type: 'string',
            linkId: '12',
            repeats: true,
            required: true,
        };
        const parentGroup = { '12': { id: 1 } };
        component.handleNestedItem(nestedItem, parentGroup);
        spyOn(component, 'isHiddenQuestion').and.returnValue(false);
        component.handleNestedItem(nestedItem, parentGroup);
        component.setupFormValueChanges();
        component.isUpdating = true;
        component.setupValueChanges();
        component.isUpdating = false;
        component.setupValueChanges();
        expect(component.isStepVisited(1)).toBeTrue();
    });

    it('should return empty error message if no errors or untouched', () => {
        const control = new FormGroup({});
        spyOn(component, 'getFormControl').and.returnValue(control);
        expect(component.getErrorMessage('fakeLinkId')).toBe('');
    });

    it('should test isMultipleOptionSelected', () => {
        const contrl: AbstractControl = new FormControl(['2213', '123']);
        spyOn(component, 'getFormControl').and.returnValue(contrl);
        component.getFormControl('id');
        spyOn(component, 'isMultipleOptionSelected').and.callThrough();
        component.isMultipleOptionSelected('123', '123');
        expect(component.isMultipleOptionSelected).toHaveBeenCalled();
    });

    it('should test when there are errors', () => {
        const contrl: AbstractControl = new FormControl('123');
        contrl.setErrors({ required: true });
        contrl.markAsTouched();
        component.hasError('123');
        spyOn(component, 'getFormControl').and.returnValue(contrl);
        spyOn(component, 'getErrorMessage').and.callThrough();
        component.hasError('123');
        component.getErrorMessage('123');
        expect(component.getErrorMessage).toHaveBeenCalled();
    });

    it('should advance step even if stepGroup is undefined', () => {
        spyOn<any>(component, 'scrollToTop');
        component.steps = [{ linkId: 'a' }, { linkId: 'b' }];
        component.currentStepIndex = 0;
        component.processNextStep(undefined);
        expect(component.currentStepIndex).toBe(1);
    });

    it('should not scroll to top if topOfForm is not defined', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        component.topOfForm = undefined!;
        const question = {};
        component.shouldShowQuestion(question);
        spyOn(component, 'setControlValue');
        spyOn(component, 'processMultipleOptions');
        component.selectOption('21', '12');
        const control = {
            setValue: () => {},
            markAsTouched: () => {},
            value: undefined,
        };
        component.setControlValue(control, '21');
        component.processMultipleOptions(control, '123');
        control.value = ['123', '23123'];
        component.selectMultipleOption('12', '123');
        component.isOptionSelected('21', '12');
        component.getFormControl('12');
        component.hasError('12');
        component.getErrorMessage('12');
        expect(() => component['scrollToTop']()).not.toThrow();
    });

    it('should handleSubmission only if submitHandler exists', fakeAsync(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        component.submitHandler = undefined!;
        expect(() => component.handleSubmission()).not.toThrow();
    }));
});

describe('QuestionnaireRendererComponent submitHandler', () => {
    let component: QuestionnaireRendererComponent;
    let fixture: ComponentFixture<QuestionnaireRendererComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [QuestionnaireRendererComponent],
            providers: [
                {
                    provide: QuestionnaireService,
                    useClass: QuestionnaireServiceStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(QuestionnaireRendererComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('handleSubmittedForm', () => {
        it('should call handleSubmission when submitHandler is provided', () => {
            component.submitHandler = jasmine
                .createSpy('submitHandler')
                .and.returnValue(Promise.resolve());
            spyOn(component, 'handleSubmission').and.callThrough();
            component.getFormControl('123');
            component.handleSubmittedForm();
            expect(component.handleSubmission).toHaveBeenCalled();
        });

        it('should not call handleSubmission when submitHandler is not provided', () => {
            component.submitHandler = undefined;
            spyOn(component, 'handleSubmission');
            component.handleSubmittedForm();
            expect(component.handleSubmission).not.toHaveBeenCalled();
        });

        it('should handle the promise from submitHandler correctly', async () => {
            const mockResponse = { success: true };
            component.submitHandler = jasmine
                .createSpy('submitHandler')
                .and.returnValue(Promise.resolve(mockResponse));
            spyOn(component, 'handleSubmission').and.callThrough();
            await component.handleSubmittedForm();
            expect(component.submitHandler).toHaveBeenCalled();
        });
    });
});

import { TestBed } from '@angular/core/testing';
import { QuestionnaireService } from './questionnaire.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    ReactiveFormsModule,
} from '@angular/forms';

describe('QuestionnaireService', () => {
    let service: QuestionnaireService;
    let fb: FormBuilder;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ReactiveFormsModule],
            providers: [QuestionnaireService],
        });
        service = TestBed.inject(QuestionnaireService);
        fb = TestBed.inject(FormBuilder);
    });

    describe('generateQuestionnaireResponse', () => {
        it('should return valid QuestionnaireResponse with section and question answers', () => {
            const form = fb.group({
                section1: fb.group({
                    q1: ['Yes'],
                }),
            });

            const questionnaire = {
                item: [
                    {
                        linkId: 'section1',
                        text: 'Section 1',
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

            const result = service.generateQuestionnaireResponse(
                questionnaire,
                form
            );
            expect(result.resourceType).toBe('QuestionnaireResponse');
            expect(result.item.length).toBe(1);
            expect(result.item[0].linkId).toBe('section1');
            expect(result.item[0].item[0].linkId).toBe('q1');
            expect(result.item[0].item[0].answer[0].valueString).toBe('Yes');
        });
    });

    describe('getCalculatedScore', () => {
        it('should return score for family-history-score', () => {
            const form = fb.group({
                'family-history': fb.group({
                    a: ['Yes'],
                    b: ['No'],
                    c: ['Yes'],
                }),
            });

            expect(
                service.getCalculatedScore('family-history-score', form)
            ).toBe(2);
        });

        it('should return score for symptoms-score', () => {
            const form = fb.group({
                symptoms: fb.group({
                    fever: ['Yes'],
                    cough: ['No'],
                }),
            });

            expect(service.getCalculatedScore('symptoms-score', form)).toBe(1);
        });

        it('should return score for risk-factors-score', () => {
            const form = fb.group({
                'risk-factors': fb.group({
                    alcohol: ['Yes'],
                    tobacco: ['Yes'],
                    diet: ['No'],
                }),
            });

            expect(service.getCalculatedScore('risk-factors-score', form)).toBe(
                2
            );
        });

        it('should fallback to alt risk factor key', () => {
            const form = fb.group({
                '365201156140': fb.group({
                    alcohol: ['Yes'],
                }),
            });

            expect(service.getCalculatedScore('risk-factors-score', form)).toBe(
                1
            );
        });
    });

    describe('isHiddenQuestion', () => {
        it('should return true for hidden extension', () => {
            const question = {
                linkId: 'q1-score',
                extension: [
                    {
                        url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
                        valueBoolean: true,
                    },
                ],
            };

            expect(service.isHiddenQuestion(question)).toBeTrue();
            const question2 = {
                linkId: 'q1-score',
                extension: [
                    {
                        url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
                        valueBoolean: false,
                    },
                ],
            };
            expect(service.isHiddenQuestion(question2)).toBeTrue();
            const question3 = {
                linkId: 'q1-score',
                extension: [
                    {
                        url: 'http://hl7.org/fhir/questionnaire',
                        valueBoolean: false,
                    },
                ],
            };
            expect(service.isHiddenQuestion(question3)).toBeTrue();
            const question4 = {
                extension: [
                    {
                        url: 'http://hl7.org/fhir/questionnaire',
                        valueBoolean: false,
                    },
                ],
            };
            expect(service.isHiddenQuestion(question4)).toBeFalse();
        });

        it('should return true for calculated extension', () => {
            const question = {
                linkId: 'q1',
                extension: [
                    {
                        url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
                        valueString: 'expression',
                    },
                ],
            };

            expect(service.isHiddenQuestion(question)).toBeTrue();
        });

        it('should return true if linkId contains "-score"', () => {
            const question = { linkId: 'symptoms-score' };
            expect(service.isHiddenQuestion(question)).toBeFalse();
        });

        it('should return false if no matching extensions or linkId', () => {
            const question = { linkId: 'q1' };
            expect(service.isHiddenQuestion(question)).toBeFalse();
        });
    });

    describe('evaluateEnableWhen', () => {
        it('should evaluate "=" condition correctly', () => {
            const form = fb.group({ q1: ['Yes'] });
            const condition = [
                { question: 'q1', operator: '=', answerString: 'Yes' },
            ];

            expect(
                service.evaluateEnableWhen(condition, 'any', form)
            ).toBeTrue();
        });

        it('should evaluate "!=" condition correctly', () => {
            const form = fb.group({ q1: ['No'] });
            const condition = [
                { question: 'q1', operator: '!=', answerString: 'Yes' },
            ];

            expect(
                service.evaluateEnableWhen(condition, 'any', form)
            ).toBeTrue();
        });

        it('should evaluate "exists" condition correctly', () => {
            const form = fb.group({ q1: ['value'] });
            const condition = [{ question: 'q1', operator: 'exists' }];

            expect(
                service.evaluateEnableWhen(condition, 'any', form)
            ).toBeTrue();
        });

        it('should return false if no matching control', () => {
            const form = fb.group({});

            const questionnaire = [
                {
                    question: 'qX',
                    operator: '=',
                    answerString: 'A',
                    enableWhen: [
                        { question: 'q1', operator: '=', answerString: 'Yes' },
                    ],
                    enableBehavior: 'any',
                },
                {
                    question: 'qX',
                    operator: '=',
                    linkId: 'q1',
                    type: 'string',
                    answerString: 'A',
                    enableWhen: [
                        { question: 'q1', operator: '=', answerString: 'Yes' },
                    ],
                    enableBehavior: 'any',
                },
            ];

            const questions = {
                item: [
                    {
                        type: 'group',
                        item: [
                            {
                                linkId: 'q1',
                                type: 'string',
                                enableBehavior: 'any',
                                enableWhen: [
                                    {
                                        question: 'q1',
                                        operator: '=',
                                        answerString: 'Yes',
                                    },
                                ],
                                item: [
                                    {
                                        linkId: 'q2a',
                                        type: 'string',
                                        enableWhen: [
                                            {
                                                question: 'q1',
                                                operator: '=',
                                                answerString: 'Yes',
                                            },
                                        ],
                                        enableBehavior: 'any',
                                        item: [
                                            { linkId: 'q2a', type: 'string' },
                                            { linkId: 'q2b', type: 'display' },
                                        ],
                                    },
                                    { linkId: 'q2b', type: 'display' },
                                ],
                            },
                            {
                                linkId: 'q2',
                                type: 'group',
                                item: [
                                    { linkId: 'q2a', type: 'string' },
                                    { linkId: 'q2b', type: 'display' },
                                ],
                            },
                        ],
                    },
                ],
            };

            const control = {
                setValue: () => {},
                setValidators: () => {},
                clearValidators: () => {},
                updateValueAndValidity: () => {},
            };
            const question = { required: false };
            service.processControl(control, true, question);
            service.processControl(control, false, question);
            const question2 = { required: true };
            service.processControl(control, true, question2);
            const question3 = { required: false, repeats: true };
            service.processControl(control, false, question3);
            service.processControl(control, true, question3);
            service.updateConditionalQuestions(form, questions);
            service.processSectionForResponse(control, form);
            expect(
                service.evaluateEnableWhen(questionnaire, 'any', form)
            ).toBeFalse();
        });
    });

    describe('shouldShowQuestion', () => {
        it('should return true for display type', () => {
            const form = fb.group({});
            const question = { type: 'display' };

            expect(service.shouldShowQuestion(question, form)).toBeTrue();
        });

        it('should return true if enableWhen evaluates to true', () => {
            const form = fb.group({ q1: ['Yes'] });
            const question = {
                enableWhen: [
                    { question: 'q1', operator: '=', answerString: 'Yes' },
                ],
                enableBehavior: 'any',
                type: 'string',
            };

            expect(service.shouldShowQuestion(question, form)).toBeTrue();
        });
    });

    describe('getAllQuestions', () => {
        it('should flatten all questions including nested items', () => {
            const questionnaire = {
                item: [
                    {
                        type: 'group',
                        item: [
                            {
                                linkId: 'q1',
                                type: 'string',
                                item: [
                                    {
                                        linkId: 'q2a',
                                        type: 'string',
                                        item: [
                                            { linkId: 'q2a', type: 'string' },
                                            { linkId: 'q2b', type: 'display' },
                                        ],
                                    },
                                    { linkId: 'q2b', type: 'display' },
                                ],
                            },
                            {
                                linkId: 'q2',
                                type: 'group',
                                item: [
                                    { linkId: 'q2a', type: 'string' },
                                    { linkId: 'q2b', type: 'display' },
                                ],
                            },
                        ],
                    },
                ],
            };

            const result = service.getAllQuestions(questionnaire);
            const ids = result.map(q => q.linkId);
            const form = fb.group({
                section: fb.group({ q1: ['A'] }),
            });
            service.processSectionForResponse(questionnaire, form);
            service.calculateFamilyHistoryScore(form);
            const section = {
                item: [{ id: 1 }],
            };
            service.evaluateResponseInfo(section);
            const section2 = {
                item: [],
            };
            service.evaluateResponseInfo(section2);
            expect(ids).toContain('q1');
            expect(ids).toContain('q2a');
            expect(ids).not.toContain('q2b');
        });
    });

    describe('getFormControl', () => {
        it('should find control at root level', () => {
            const form = fb.group({ q1: ['A'] });
            expect(service.getFormControl('q1', form)).toBeTruthy();
        });

        it('should find nested control', () => {
            const form = fb.group({
                section: fb.group({ q1: ['A'] }),
            });
            expect(service.getFormControl('q1', form)).toBeTruthy();
        });
    });

    describe('markFormGroupTouched', () => {
        it('should mark all controls as touched', () => {
            const form = fb.group({
                a: [''],
                b: fb.group({ b1: [''] }),
                c: fb.array([fb.control('')]),
            });

            service.markFormGroupTouched(form);

            expect(form.get('a')?.touched).toBeTrue();
            expect((form.get('b') as FormGroup).get('b1')?.touched).toBeTrue();
            expect((form.get('c') as FormArray).at(0).touched).toBeTrue();
        });
    });

    describe('updateConditionalQuestions', () => {
        it('should update required validator and value based on enableWhen', () => {
            const form = fb.group({
                section: fb.group({
                    q1: ['Yes'],
                    q2: ['Value'],
                }),
            });

            const questionnaire = {
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
            };

            const questionnaire2 = {
                item: [
                    {
                        linkId: 'q1-score',
                        type: 'group',
                        item: [
                            {
                                linkId: 'q1-score',
                                type: 'string',
                            },
                            {
                                linkId: 'q2-score',
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
            };
            service.processNestedItems(questionnaire, form);
            service.processQuestionForResponse(questionnaire2, form);
            service.updateConditionalQuestions(form, questionnaire);

            const q2 = service.getFormControl('q2', form);
            expect(q2?.validator).toBeFalsy();
            expect(q2?.value).toBeNull();
        });
    });

    describe('processQuestionForResponse (advanced)', () => {
        it('should handle empty hidden score field with no control value', () => {
            const form = fb.group({
                section1: fb.group({}),
            });

            const question = {
                linkId: 'q1-score',
                text: 'Score field',
                type: 'integer',
                extension: [
                    {
                        url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
                        valueBoolean: true,
                    },
                ],
            };

            const questionnaire = {
                item: [
                    {
                        linkId: 'section1',
                        text: 'Section 1',
                        item: [question],
                    },
                ],
            };

            spyOn(service, 'getCalculatedScore').and.returnValue(7);

            const result = service.generateQuestionnaireResponse(
                questionnaire,
                form
            );
            const item = result.item[0].item[0];

            expect(item.linkId).toBe('q1-score');
            expect(item.answer[0].valueInteger).toBe(7);
        });

        it('should handle repeating question with multiple answers', () => {
            const form = fb.group({
                section1: fb.group({
                    q1: [['Option A', 'Option B']],
                }),
            });

            const question = {
                linkId: 'q1',
                text: 'Repeat question',
                type: 'choice',
                repeats: true,
            };

            const questionnaire = {
                item: [
                    {
                        linkId: 'section1',
                        text: 'Section 1',
                        item: [question],
                    },
                ],
            };

            const result = service.generateQuestionnaireResponse(
                questionnaire,
                form
            );
            expect(result.item[0].item[0].answer.length).toBe(2);
            expect(result.item[0].item[0].answer[0].valueCoding.display).toBe(
                'Option A'
            );
        });

        it('should assign nested items to answerValue.item', () => {
            const form = fb.group({
                section1: fb.group({
                    q1: ['Yes'],
                    q1a: ['Nested value'],
                }),
            });

            const question = {
                linkId: 'q1',
                text: 'Parent',
                type: 'string',
                item: [
                    {
                        linkId: 'q1a',
                        text: 'Nested',
                        type: 'string',
                    },
                ],
            };

            const questionnaire = {
                item: [
                    {
                        linkId: 'section1',
                        text: 'Section',
                        item: [question],
                    },
                ],
            };

            const result = service.generateQuestionnaireResponse(
                questionnaire,
                form
            );
            const nested = result.item[0].item[0].answer[0].item;

            expect(nested[0].linkId).toBe('q1a');
            expect(nested[0].answer[0].valueString).toBe('Nested value');
        });

        it('should skip item if processedValue is empty array', () => {
            const question = {
                item: [
                    {
                        linkId: 'nested2',
                        text: 'Nested Empty',
                    },
                ],
            };

            const formGroup = fb.group({
                nested2: [[]], // empty array
            });

            const result = service.processNestedItems(question, formGroup);

            expect(result.length).toBe(0); // Nothing pushed
        });

        it('should process array values and return the first item', () => {
            const question = {
                item: [
                    {
                        linkId: 'nested1',
                        text: 'Nested Question',
                    },
                ],
            };

            const formGroup = fb.group({
                nested1: [[{ code: 'value1' }]], // array with one value
            });

            const result = service.processNestedItems(question, formGroup);

            expect(result.length).toBe(1);
            expect(result[0].answer[0]).toBeDefined();
        });
    });

    describe('createAnswerValue', () => {
        it('should create valueCoding for coding type', () => {
            const result = (service as any).createAnswerValue(
                { type: 'coding' },
                'Option A'
            );
            expect(result.valueCoding.display).toBe('Option A');
        });

        it('should create valueInteger for integer type', () => {
            const result = (service as any).createAnswerValue(
                { type: 'integer' },
                '42'
            );
            expect(result.valueInteger).toBe(42);
        });

        it('should use fallback valueString for unknown types', () => {
            const result = (service as any).createAnswerValue(
                { type: 'unknown' },
                123
            );
            expect(result.valueString).toBe('123');
        });
    });

    describe('evaluateEnableWhen advanced', () => {
        it('should handle answerBoolean comparison', () => {
            const form = fb.group({
                q1: ['true'],
            });

            const condition = [
                {
                    question: 'q1',
                    operator: '=',
                    answerBoolean: true,
                },
            ];

            expect(
                service.evaluateEnableWhen(condition, 'any', form)
            ).toBeTrue();

            const condition2 = [];
            expect(
                service.evaluateEnableWhen(condition2, 'any', form)
            ).toBeTrue();

            const condition3 = undefined;
            expect(
                service.evaluateEnableWhen(condition3, 'any', form)
            ).toBeTrue();
        });

        it('should handle answerCoding comparison', () => {
            const form = fb.group({
                q1: ['Yes'],
            });

            const condition = [
                {
                    question: 'q1',
                    operator: '=',
                    answerCoding: { display: 'Yes' },
                },
            ];

            expect(
                service.evaluateEnableWhen(condition, 'any', form)
            ).toBeTrue();

            const condition2 = [
                {
                    question: 'q1',
                    operator: '!=',
                    answerBoolean: true,
                },
            ];

            expect(
                service.evaluateEnableWhen(condition2, 'any', form)
            ).toBeTrue();

            const condition3 = [
                {
                    question: 'q1',
                    operator: '!=',
                    answerCoding: { display: 'Yes' },
                },
            ];

            expect(
                service.evaluateEnableWhen(condition3, 'any', form)
            ).toBeFalse();
        });

        it('should return false for unknown operator', () => {
            const form = fb.group({ q1: ['value'] });

            const condition = [
                {
                    question: 'q1',
                    operator: '>',
                    answerString: 'value',
                },
            ];

            expect(
                service.evaluateEnableWhen(condition, 'any', form)
            ).toBeFalse();
        });

        it('should return false when "all" conditions not met', () => {
            const form = fb.group({
                q1: ['Yes'],
                q2: ['No'],
            });

            const conditions = [
                { question: 'q1', operator: '=', answerString: 'Yes' },
                { question: 'q2', operator: '=', answerString: 'Yes' },
            ];

            expect(
                service.evaluateEnableWhen(conditions, 'all', form)
            ).toBeFalse();
        });
    });

    describe('getCalculatedScore fallback', () => {
        it('should return 0 for unknown score type', () => {
            const form = fb.group({});
            expect(service.getCalculatedScore('unknown-score-type', form)).toBe(
                0
            );
        });

        it('should handle null riskFactor group gracefully', () => {
            const form = fb.group({});
            expect((service as any).calculateRiskFactorsScore(form)).toBe(0);
        });

        it('should handle null symptoms group gracefully', () => {
            const form = fb.group({});
            expect((service as any).calculateSymptomsScore(form)).toBe(0);
        });
    });

    describe('updateConditionalQuestions edge cases', () => {
        it('should skip if control is not found', () => {
            const form = fb.group({
                section: fb.group({
                    q1: ['Yes'],
                }),
            });

            const questionnaire = {
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
                                linkId: 'nonexistent',
                                type: 'string',
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
            };

            // Should not throw
            expect(() => {
                service.updateConditionalQuestions(form, questionnaire);
            }).not.toThrow();

            const form1 = fb.group({
                section1: fb.group({
                    q1: [''],
                }),
            });

            const questionnaire1 = {
                item: [
                    {
                        linkId: 'section1',
                        type: 'group',
                        item: [
                            {
                                linkId: 'q1',
                                type: 'string',
                                required: true, // triggers Validators.required
                                // no enableWhen
                            },
                        ],
                    },
                ],
            };

            service.updateConditionalQuestions(form1, questionnaire1);
        });
    });
});

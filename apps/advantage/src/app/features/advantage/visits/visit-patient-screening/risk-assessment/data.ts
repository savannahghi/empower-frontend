export const cervicalCancerFormDef = {
    resourceType: 'Questionnaire',
    id: 'eb37bf9f-4796-4b68-956f-dc52504259d2',
    name: 'Cervical Cancer Screening',
    title: 'Cervical Cancer Screening Form',
    status: 'active',
    description:
        'The "Cervical Cancer Screening Form" is a structured questionnaire designed to collect information related to cervical cancer screening. It includes sections such as "Symptoms" and "History Factors," each containing specific questions with answer options',
    purpose: 'To be used for cancer screening',
    item: [
        {
            type: 'group',
            linkId: 'family-history',
            text: 'Family History',
            required: true,
            repeats: false,
            readOnly: false,
            item: [
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '6645700458700',
                    text: 'Have any of your nuclear/extended family members been diagnosed with any cancer?',
                    required: true,
                    repeats: false,
                    readOnly: false,
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                },
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '1354421609263',
                    text: 'What was the sex of the person affected?',
                    enableWhen: [
                        {
                            question: '6645700458700',
                            operator: '=',
                            answerCoding: {
                                display: 'Yes',
                            },
                        },
                    ],
                    enableBehavior: 'all',
                    required: true,
                    repeats: false,
                    readOnly: false,
                    answerOption: [
                        {
                            valueCoding: {
                                display: 'Male',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'Female',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'Other',
                            },
                        },
                    ],
                },
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '9056132977843',
                    text: 'What is your relationship with the person who was diagnosed?',
                    enableWhen: [
                        {
                            question: '6645700458700',
                            operator: '=',
                            answerCoding: {
                                display: 'Yes',
                            },
                        },
                    ],
                    required: true,
                    repeats: false,
                    readOnly: false,
                    answerOption: [
                        {
                            valueCoding: {
                                display: 'Parent',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'Sibling',
                            },
                        },
                        {
                            valueCoding: {
                                display: '1st or 2nd degree relative',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'other',
                            },
                        },
                    ],
                },
                {
                    type: 'string',
                    linkId: '4182354463904',
                    text: 'Specify',
                    enableWhen: [
                        {
                            question: '9056132977843',
                            operator: '=',
                            answerCoding: {
                                display: 'other',
                            },
                        },
                    ],
                    required: false,
                    repeats: false,
                    readOnly: false,
                    item: [
                        {
                            text: 'Enter other family member type',
                            type: 'display',
                            linkId: '4182354463904_helpText',
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                                    valueCodeableConcept: {
                                        text: 'Help-Button',
                                        coding: [
                                            {
                                                code: 'help',
                                                display: 'Help-Button',
                                                system: 'http://hl7.org/fhir/questionnaire-item-control',
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    type: 'string',
                    linkId: '209396867012',
                    text: 'Which type of cancer was it?',
                    enableWhen: [
                        {
                            question: '6645700458700',
                            operator: '=',
                            answerCoding: {
                                display: 'Yes',
                            },
                        },
                    ],
                    repeats: false,
                },
                {
                    type: 'string',
                    linkId: '4061890488563',
                    text: 'At what age were they diagnosed with cancer(years)?',
                    enableWhen: [
                        {
                            question: '6645700458700',
                            operator: '=',
                            answerCoding: {
                                display: 'Yes',
                            },
                        },
                    ],
                },
                {
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
                            valueExpression: {
                                description: 'Total score',
                                language: 'text/fhirpath',
                                expression:
                                    "%resource.repeat(item).where(linkId='family-history').item.answer.valueCoding.where(display = 'Yes').count()",
                            },
                        },
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
                            valueBoolean: true,
                        },
                    ],
                    linkId: 'family-history-score',
                    text: 'Total Score: Family History Score',
                    type: 'integer',
                },
            ],
        },
        {
            item: [
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '3987282423176',
                    text: 'Have you ever had sexual intercourse?',
                    required: true,
                    repeats: false,
                    readOnly: false,
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                },
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '2777780732642',
                    text: 'Do you have or does your sexual partner have another sexual partner?',
                    enableWhen: [
                        {
                            question: '3987282423176',
                            operator: '=',
                            answerCoding: {
                                display: 'Yes',
                            },
                        },
                    ],
                    required: true,
                    repeats: false,
                    readOnly: false,
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                },
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'check-box',
                                        display: 'Check-box',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '9244263075867',
                    text: 'Do you have 2 or more children?',
                    enableWhen: [
                        {
                            question: '3987282423176',
                            operator: '=',
                            answerCoding: {
                                display: 'Yes',
                            },
                        },
                    ],
                    required: true,
                    repeats: false,
                    readOnly: false,
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                },
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '516080166980',
                    text: 'Do you use any tobacco product? (smoke, vape, patch)',
                    enableWhen: [
                        {
                            question: '3987282423176',
                            operator: '=',
                            answerCoding: {
                                display: 'Yes',
                            },
                        },
                    ],
                    required: true,
                    repeats: false,
                    readOnly: false,
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                },
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '1838373436237',
                    text: 'From your most recent HIV test, was your test result positive?',
                    enableWhen: [
                        {
                            question: '3987282423176',
                            operator: '=',
                            answerCoding: {
                                display: 'Yes',
                            },
                        },
                    ],
                    required: true,
                    repeats: false,
                    readOnly: false,
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                },
                {
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
                            valueExpression: {
                                description: 'Total score',
                                language: 'text/fhirpath',
                                expression:
                                    "%resource.repeat(item).where(linkId='risk-factors').item.answer.valueCoding.where(display = 'Yes').count()",
                            },
                        },
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
                            valueBoolean: true,
                        },
                    ],
                    linkId: 'risk-factors-score',
                    text: 'Total Score: Risk Factors Score',
                    type: 'integer',
                },
            ],
            type: 'group',
            linkId: 'risk-factors',
            text: 'Risk Factors',
            required: true,
            repeats: false,
            readOnly: false,
        },
        {
            type: 'group',
            linkId: 'symptoms',
            text: 'Symptoms',
            repeats: false,
            item: [
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '2670125340596',
                    text: 'Are you experiencing a discharge from your vagina?',
                    required: true,
                    repeats: false,
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                },
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '4426063653294',
                    text: 'Other than your menstrual period, are you experiencing any bleeding from your vagina?',
                    required: true,
                    repeats: false,
                    readOnly: false,
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                },
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '4554416010502',
                    text: 'Are you experiencing pain during sexual intercourse?',
                    required: true,
                    repeats: false,
                    readOnly: false,
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                },
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '5707042302579',
                    text: 'Are you experiencing bleeding after sexual intercourse?',
                    required: true,
                    repeats: false,
                    readOnly: false,
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                },
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '7735804005806',
                    text: 'Do you have any painful red or white swellings around your genital area?',
                    required: true,
                    readOnly: false,
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                },
                {
                    type: 'choice',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '9623379576021',
                    text: 'Are you experiencing pain during urination?',
                    required: true,
                    readOnly: false,
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                },
                {
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
                            valueExpression: {
                                description: 'Total score',
                                language: 'text/fhirpath',
                                expression:
                                    "%resource.repeat(item).where(linkId='symptoms').item.answer.valueCoding.where(display = 'Yes').count()",
                            },
                        },
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
                            valueBoolean: true,
                        },
                    ],
                    linkId: 'symptoms-score',
                    text: 'Total Score: Symptoms',
                    type: 'integer',
                },
            ],
        },
    ],
};

export const breastCancerFormDef = {
    id: '2d79345d-0fd7-429e-b500-e88e3995380d',
    item: [
        {
            item: [
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '3958894565482',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Has anyone in your family been diagnosed with breast or ovarian cancer?',
                    type: 'choice',
                },
                {
                    answerOption: [
                        {
                            valueCoding: {
                                display: 'Parent',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'Sibling',
                            },
                        },
                        {
                            valueCoding: {
                                display: '1st or 2nd degree relative',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'Other',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    enableBehavior: 'all',
                    enableWhen: [
                        {
                            answerCoding: {
                                display: 'Yes',
                            },
                            operator: '=',
                            question: '3958894565482',
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    item: [
                        {
                            enableBehavior: 'all',
                            enableWhen: [
                                {
                                    answerBoolean: true,
                                    operator: 'exists',
                                    question: '4035603850065',
                                },
                            ],
                            linkId: '1579302816408',
                            readOnly: false,
                            repeats: false,
                            required: true,
                            text: 'At what age were they diagnosed with cancer(years)?',
                            type: 'integer',
                        },
                    ],
                    linkId: '4035603850065',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'What is your relationship with the person who was diagnosed?',
                    type: 'choice',
                },
                {
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
                            valueExpression: {
                                description: 'Total score',
                                expression:
                                    "%resource.repeat(item).where(linkId='''family-history''').item.answer.valueCoding.where(display = '''Yes''').count()",
                                language: 'text/fhirpath',
                            },
                        },
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
                            valueBoolean: true,
                        },
                    ],
                    linkId: 'family-history-score',
                    text: 'Total score: Family History Score',
                    type: 'integer',
                },
            ],
            linkId: 'family-history',
            prefix: '1.',
            readOnly: true,
            repeats: false,
            required: false,
            text: 'Family History',
            type: 'group',
        },
        {
            item: [
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '6612952124236',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Have you ever had any radiation to your chest?',
                    type: 'choice',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '8550647208906',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Have you been diagnosed with breast cancer before?',
                    type: 'choice',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '6048843604934',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Have you had a previous abnormal breast biopsy',
                    type: 'choice',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '2250753200296',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Have you ever been diagnosed with ovarian cancer?',
                    type: 'choice',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '2114278031173',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Have you or anyone in your family ever tested positive for the BRCA gene?',
                    type: 'choice',
                },
            ],
            linkId: 'risk-assessment',
            prefix: '2.',
            readOnly: true,
            repeats: false,
            required: false,
            text: 'Risk Factors',
            type: 'group',
        },
        {
            item: [
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '416025964132',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Have you had a CBE performed by a healthcare provider before?',
                    type: 'choice',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    item: [
                        {
                            answerOption: [
                                {
                                    valueCoding: {
                                        display: 'Monthly',
                                    },
                                },
                                {
                                    valueCoding: {
                                        display: 'Quarterly',
                                    },
                                },
                                {
                                    valueCoding: {
                                        display: 'Other',
                                    },
                                },
                            ],
                            enableBehavior: 'all',
                            enableWhen: [
                                {
                                    answerCoding: {
                                        display: 'Yes',
                                    },
                                    operator: '=',
                                    question: '796698454820',
                                },
                            ],
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                                    valueCodeableConcept: {
                                        coding: [
                                            {
                                                code: 'radio-button',
                                                display: 'Radio Button',
                                                system: 'http://hl7.org/fhir/questionnaire-item-control',
                                            },
                                        ],
                                    },
                                },
                            ],
                            linkId: '510799399063',
                            readOnly: false,
                            repeats: false,
                            required: true,
                            text: 'How often do you perform SBE?',
                            type: 'choice',
                        },
                    ],
                    linkId: '796698454820',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Do you perform SBE?',
                    type: 'choice',
                },
                {
                    answerOption: [
                        {
                            valueCoding: {
                                display: 'Financial barriers',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'Access to health facility',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'Religion & Cultures',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'Lack of awareness about screening',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'Other',
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'drop-down',
                                        display: 'Drop down',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '207718516065',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Are there any barriers to screening?',
                    type: 'choice',
                },
            ],
            linkId: '170261317318',
            prefix: '3.',
            readOnly: true,
            repeats: false,
            required: false,
            text: 'Screening History',
            type: 'group',
        },
        {
            item: [
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    item: [
                        {
                            answerOption: [
                                {
                                    valueCoding: {
                                        display: 'Right',
                                    },
                                },
                                {
                                    valueCoding: {
                                        display: 'Left',
                                    },
                                },
                                {
                                    valueCoding: {
                                        display: 'Both',
                                    },
                                },
                            ],
                            enableBehavior: 'all',
                            enableWhen: [
                                {
                                    answerCoding: {
                                        display: 'Yes',
                                    },
                                    operator: '=',
                                    question: '4139153768223',
                                },
                            ],
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                                    valueCodeableConcept: {
                                        coding: [
                                            {
                                                code: 'radio-button',
                                                display: 'Radio Button',
                                                system: 'http://hl7.org/fhir/questionnaire-item-control',
                                            },
                                        ],
                                    },
                                },
                            ],
                            linkId: '181655300777',
                            readOnly: false,
                            repeats: false,
                            required: true,
                            text: 'Which Breast?',
                            type: 'choice',
                        },
                    ],
                    linkId: '4139153768223',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Do you feel a lump in the breast?',
                    type: 'choice',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    item: [
                        {
                            answerOption: [
                                {
                                    valueCoding: {
                                        display: 'Right',
                                    },
                                },
                                {
                                    valueCoding: {
                                        display: 'Left',
                                    },
                                },
                                {
                                    valueCoding: {
                                        display: 'Both',
                                    },
                                },
                            ],
                            enableBehavior: 'all',
                            enableWhen: [
                                {
                                    answerCoding: {
                                        display: 'Yes',
                                    },
                                    operator: '=',
                                    question: '143809991899',
                                },
                            ],
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                                    valueCodeableConcept: {
                                        coding: [
                                            {
                                                code: 'radio-button',
                                                display: 'Radio Button',
                                                system: 'http://hl7.org/fhir/questionnaire-item-control',
                                            },
                                        ],
                                    },
                                },
                            ],
                            linkId: '4401593523880',
                            readOnly: false,
                            repeats: false,
                            required: true,
                            text: 'Which Breast?',
                            type: 'choice',
                        },
                    ],
                    linkId: '143809991899',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Do you feel pain or soreness in the breast?',
                    type: 'choice',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    item: [
                        {
                            answerOption: [
                                {
                                    valueCoding: {
                                        display: 'Right',
                                    },
                                },
                                {
                                    valueCoding: {
                                        display: 'Left',
                                    },
                                },
                                {
                                    valueCoding: {
                                        display: 'Both',
                                    },
                                },
                            ],
                            enableBehavior: 'all',
                            enableWhen: [
                                {
                                    answerCoding: {
                                        display: 'Yes',
                                    },
                                    operator: '=',
                                    question: '9414682716402',
                                },
                            ],
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                                    valueCodeableConcept: {
                                        coding: [
                                            {
                                                code: 'radio-button',
                                                display: 'Radio Button',
                                                system: 'http://hl7.org/fhir/questionnaire-item-control',
                                            },
                                        ],
                                    },
                                },
                            ],
                            linkId: '9907186723016',
                            readOnly: false,
                            repeats: false,
                            required: true,
                            text: 'Which Breast?',
                            type: 'choice',
                        },
                    ],
                    linkId: '9414682716402',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Are you experiencing any bleeding from the nipples?',
                    type: 'choice',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    item: [
                        {
                            answerOption: [
                                {
                                    valueCoding: {
                                        display: 'Right',
                                    },
                                },
                                {
                                    valueCoding: {
                                        display: 'Left',
                                    },
                                },
                                {
                                    valueCoding: {
                                        display: 'Both',
                                    },
                                },
                            ],
                            enableBehavior: 'all',
                            enableWhen: [
                                {
                                    answerCoding: {
                                        display: 'Yes',
                                    },
                                    operator: '=',
                                    question: '9697934947869',
                                },
                            ],
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                                    valueCodeableConcept: {
                                        coding: [
                                            {
                                                code: 'radio-button',
                                                display: 'Radio Button',
                                                system: 'http://hl7.org/fhir/questionnaire-item-control',
                                            },
                                        ],
                                    },
                                },
                            ],
                            linkId: '4647548944573',
                            readOnly: false,
                            repeats: false,
                            required: true,
                            text: 'Which Breast?',
                            type: 'choice',
                        },
                    ],
                    linkId: '9697934947869',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Have you noticed any recent skin changes on your breast?',
                    type: 'choice',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            valueCoding: {
                                display: "I don'''t know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    item: [
                        {
                            answerOption: [
                                {
                                    valueCoding: {
                                        display: 'Right',
                                    },
                                },
                                {
                                    valueCoding: {
                                        display: 'Left',
                                    },
                                },
                                {
                                    valueCoding: {
                                        display: 'Both',
                                    },
                                },
                            ],
                            enableBehavior: 'all',
                            enableWhen: [
                                {
                                    answerCoding: {
                                        display: 'Yes',
                                    },
                                    operator: '=',
                                    question: '9566687969651',
                                },
                            ],
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                                    valueCodeableConcept: {
                                        coding: [
                                            {
                                                code: 'radio-button',
                                                display: 'Radio Button',
                                                system: 'http://hl7.org/fhir/questionnaire-item-control',
                                            },
                                        ],
                                    },
                                },
                            ],
                            linkId: '9994481399324',
                            readOnly: false,
                            repeats: false,
                            required: true,
                            text: 'Which Breast?',
                            type: 'choice',
                        },
                    ],
                    linkId: '9566687969651',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Have you noticed any discharge from your breast?',
                    type: 'choice',
                },
            ],
            linkId: 'symptoms',
            prefix: '4.',
            readOnly: true,
            required: false,
            text: 'Symptoms',
            type: 'group',
        },
    ],
    language: 'EN',
    resourceType: 'Questionnaire',
    status: 'active',
    title: 'Breast Cancer Screening',
};

export const prostateCancerFormDef = {
    resourceType: 'Questionnaire',
    id: '102838f6-74a0-49f1-9ccf-3c7e6648e745',
    language: 'EN',
    title: 'Prostate Cancer Screening',
    status: 'active',
    purpose: 'For Prostate Cancer Screening ',
    item: [
        {
            extension: [
                {
                    url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                    valueCodeableConcept: {
                        coding: [
                            {
                                code: 'header',
                                display: 'Header',
                                system: 'http://hl7.org/fhir/questionnaire-item-control',
                            },
                        ],
                    },
                },
            ],
            item: [
                {
                    linkId: '624819056084',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'How old are you?',
                    type: 'string',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: "I don't know",
                            },
                        },
                    ],
                    enableBehavior: 'all',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    item: [
                        {
                            enableBehavior: 'all',
                            enableWhen: [
                                {
                                    answerCoding: {
                                        display: 'Yes',
                                    },
                                    operator: '=',
                                    question: '594931797635',
                                },
                            ],
                            linkId: '522418773753',
                            readOnly: false,
                            repeats: false,
                            required: false,
                            text: 'Specify relationship and age of diagnosis',
                            type: 'string',
                        },
                    ],
                    linkId: '594931797635',
                    readOnly: false,
                    repeats: false,
                    required: true,
                    text: 'Family History Of Prostate Cancer?',
                    type: 'coding',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: "I don't know",
                            },
                        },
                    ],
                    enableBehavior: 'all',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    item: [
                        {
                            enableBehavior: 'all',
                            enableWhen: [
                                {
                                    answerCoding: {
                                        display: 'Yes',
                                    },
                                    operator: '=',
                                    question: '226381424402',
                                },
                            ],
                            linkId: '273835783953',
                            readOnly: false,
                            required: false,
                            text: 'Specify',
                            type: 'string',
                        },
                    ],
                    linkId: '226381424402',
                    required: true,
                    text: 'Family history of other cancers (breast, ovarian, colorectal, pancreatic, endometrial)',
                    type: 'coding',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                    enableBehavior: 'all',
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '535709372817',
                    text: 'Have you done Prostate Screening before?',
                    type: 'coding',
                },
                {
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
                            valueExpression: {
                                description: 'Total score',
                                expression:
                                    "%resource.repeat(item).where(linkId='family-history').item.answer.valueCoding.where(display = 'Yes').count()",
                                language: 'text/fhirpath',
                            },
                        },
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
                            valueBoolean: true,
                        },
                    ],
                    linkId: 'family-history-score',
                    text: 'Total Score: Family History Score',
                    type: 'integer',
                },
            ],
            linkId: 'family-history',
            readOnly: true,
            repeats: false,
            required: false,
            text: 'Family History',
            type: 'group',
        },
        {
            extension: [
                {
                    url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                    valueCodeableConcept: {
                        coding: [
                            {
                                code: 'header',
                                display: 'Header',
                                system: 'http://hl7.org/fhir/questionnaire-item-control',
                            },
                        ],
                    },
                },
            ],
            item: [
                {
                    answerOption: [
                        {
                            valueCoding: {
                                display:
                                    'Difficulty urinating or weak urine flow',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'Blood in urine or semen',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'Painful urination',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'Pain in the back, hips, or pelvis',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'Frequent urination at night',
                            },
                        },
                        {
                            valueCoding: {
                                display: 'None of the above',
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'check-box',
                                        display: 'Check-box',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '198243515564',
                    repeats: true,
                    required: true,
                    text: 'Do you have any of the following symptoms? (Check all that apply)',
                    type: 'coding',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '597461686365',
                    readOnly: false,
                    required: true,
                    text: 'Have you had a prostate biopsy in the last 6 months?',
                    type: 'coding',
                },
                {
                    answerOption: [
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 1,
                                },
                            ],
                            valueCoding: {
                                display: 'Yes',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: 'No',
                            },
                        },
                        {
                            extension: [
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/ordinalValue',
                                    valueDecimal: 0,
                                },
                            ],
                            valueCoding: {
                                display: "I don't know",
                            },
                        },
                    ],
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        code: 'radio-button',
                                        display: 'Radio Button',
                                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '268649527133',
                    readOnly: false,
                    required: true,
                    text: 'Are you currently taking any medications for prostate issues (e.g. finasteride and tamsulosin)?',
                    type: 'coding',
                },
                {
                    extension: [
                        {
                            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression',
                            valueExpression: {
                                description: 'Total score',
                                expression:
                                    "%resource.repeat(item).where(linkId='risk-factors').item.answer.valueCoding.where(display = 'Yes').count()",
                                language: 'text/fhirpath',
                            },
                        },
                        {
                            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
                            valueBoolean: true,
                        },
                    ],
                    linkId: 'risk-factors-score',
                    text: 'Total Score: Risk Factors Score',
                    type: 'integer',
                },
            ],
            linkId: '365201156140',
            readOnly: true,
            repeats: false,
            required: false,
            text: 'Risk assessment ',
            type: 'group',
        },
    ],
};

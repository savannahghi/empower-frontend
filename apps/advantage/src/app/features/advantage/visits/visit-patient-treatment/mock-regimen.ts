export const mockRegimen = [
    {
        id: 'dfc72a12-4547-4024-9c10-430dcc3299c4',
        meta: {
            versionId: '1',
            lastUpdated: '2025-05-30T09:21:44.744Z',
            source: '#ISw9UA4C1GUUlAaB',
        },
        language: 'EN',
        name: 'BreastCancerChemotherapy-AC-T Regimen',
        title: 'BreastCancerChemotherapy-AC-T Regimen',
        type: {
            coding: [
                {
                    system: 'http://terminology.hl7.org/CodeSystem/plan-definition-type',
                    code: 'order-set',
                    display: 'order-set',
                },
            ],
            text: 'order-set',
        },
        status: 'active',
        date: '2025-05-30T12:21:39+03:00',
        description:
            'Chemotherapy plan for early-stage breast cancer using the AC-T regimen with 3 AC cycles and nested medication days.',
        useContext: [
            {
                valueCodeableConcept: {
                    coding: [
                        {
                            system: 'http://terminology.hl7.org/CodeSystem/v2-0265',
                            code: 'CAN',
                            display: 'Cancer',
                        },
                    ],
                    text: 'Cancer',
                },
            },
        ],
        action: [
            {
                title: 'AC Phase - Cycle 1',
                description:
                    'Cycle 1: Adriamycin + Cyclophosphamide, Day 1 and Day 8',
                timingTiming: {
                    repeat: {
                        count: 0,
                        frequency: 1,
                        period: 2,
                        periodUnit: 'wk',
                        offset: 0,
                    },
                },
                action: [
                    {
                        title: 'Day 1',
                        description: 'Pre-medications',
                        timingTiming: {
                            repeat: {
                                count: 0,
                                frequency: 0,
                                period: 0,
                                offset: 0,
                            },
                        },
                        action: [
                            {
                                title: 'Alemtuzumab 10mg/ml (Lemtrada)',
                                definitionCanonical:
                                    'https://fhir.staging.slade360edi.com/fhir/ActivityDefinition/4f1fb58d-f446-4e78-a87a-009d3312f3fd',
                            },
                            {
                                title: 'Adcetris',
                                definitionCanonical:
                                    'https://fhir.staging.slade360edi.com/fhir/ActivityDefinition/90e471c9-307a-4665-b4fd-ec68233b5826',
                            },
                        ],
                    },
                    {
                        title: 'Day 8',
                        description: 'Supportive medications on Day 8',
                        timingTiming: {
                            repeat: {
                                count: 0,
                                frequency: 0,
                                period: 0,
                                offset: 7,
                            },
                        },
                        action: [
                            {
                                title: 'Adcetris',
                                definitionCanonical:
                                    'https://fhir.staging.slade360edi.com/fhir/ActivityDefinition/84740f6d-c7c6-4a48-9289-30533eb18299',
                            },
                        ],
                    },
                ],
            },
            {
                title: 'AC Phase - Cycle 2',
                description:
                    'Cycle 2: Adriamycin + Cyclophosphamide, Day 1 and Day 8',
                timingTiming: {
                    repeat: {
                        count: 0,
                        frequency: 1,
                        period: 2,
                        periodUnit: 'wk',
                        offset: 0,
                    },
                },
                action: [
                    {
                        title: 'Day 1',
                        description: 'AC medications administered on Day 1',
                        timingTiming: {
                            repeat: {
                                count: 0,
                                frequency: 0,
                                period: 0,
                                offset: 0,
                            },
                        },
                        action: [
                            {
                                title: 'Alemtuzumab 10mg/ml (Lemtrada)',
                                definitionCanonical:
                                    'https://fhir.staging.slade360edi.com/fhir/ActivityDefinition/f5f4c5e0-3c62-40b3-a2ff-1409aa519052',
                            },
                            {
                                title: 'Adcetris',
                                definitionCanonical:
                                    'https://fhir.staging.slade360edi.com/fhir/ActivityDefinition/e3c15c24-ced4-4497-96e8-3a0126955d22',
                            },
                        ],
                    },
                    {
                        title: 'Day 8',
                        description: 'Supportive medications on Day 8',
                        timingTiming: {
                            repeat: {
                                count: 0,
                                frequency: 0,
                                period: 0,
                                offset: 7,
                            },
                        },
                        action: [
                            {
                                title: 'Alemtuzumab 10mg/ml (Lemtrada)',
                                definitionCanonical:
                                    'https://fhir.staging.slade360edi.com/fhir/ActivityDefinition/5a9278f3-0c9e-40cb-8ecb-ee221905eec4',
                            },
                        ],
                    },
                ],
            },
            {
                title: 'AC Phase - Cycle 3',
                description:
                    'Cycle 3: Adriamycin + Cyclophosphamide, Day 1 and Day 8',
                timingTiming: {
                    repeat: {
                        count: 0,
                        frequency: 1,
                        period: 2,
                        periodUnit: 'wk',
                        offset: 0,
                    },
                },
                action: [
                    {
                        title: 'Day 1',
                        description: 'AC medications administered on Day 1',
                        timingTiming: {
                            repeat: {
                                count: 0,
                                frequency: 0,
                                period: 0,
                                offset: 0,
                            },
                        },
                        action: [
                            {
                                title: 'Alemtuzumab 10mg/ml (Lemtrada)',
                                definitionCanonical:
                                    'https://fhir.staging.slade360edi.com/fhir/ActivityDefinition041fd1b9-2cbe-4613-a10f-867e80023682',
                            },
                            {
                                title: 'Adcetris',
                                definitionCanonical:
                                    'https://fhir.staging.slade360edi.com/fhir/ActivityDefinition/e024c23f-38cf-4e20-b730-30cb956fd6fa',
                            },
                        ],
                    },
                    {
                        title: 'Day 8',
                        description: 'Supportive medications on Day 8',
                        timingTiming: {
                            repeat: {
                                count: 0,
                                frequency: 0,
                                period: 0,
                                offset: 7,
                            },
                        },
                        action: [
                            {
                                title: 'Adcetris',
                                definitionCanonical:
                                    'https://fhir.staging.slade360edi.com/fhir/ActivityDefinition/ceb13ec9-bfbc-421e-9ce7-96e4869f9b2d',
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

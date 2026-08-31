import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RiskStratificationComponent } from './risk-stratification.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { VisitService } from '../../visit.service';
import { of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

const visitServiceStub = {
    visitPatientDataEmitter: of({
        new_price: 18,
        amount: '18',
        product_name: 'Lipid',
        quantity: 1,
        id: 1,
    }),
    visitPatientScreeningDataEmitter: of({
        age: 40,
        gender: 'MALE',
    }),
};

const mockRiskAssessmentData = [
    {
        id: '917aecf4-feab-4ccd-a2e6-69de027b0282',
        prediction: [
            {
                qualitativeRisk: {
                    coding: [
                        {
                            system: 'https://CIELterminology.org',
                            code: '1064',
                            display: 'Negligible likelihood',
                        },
                    ],
                    text: 'Negligible likelihood',
                },
            },
        ],
        usageContext: 'CERVICAL_CANCER_SCREENING',
    },
    {
        id: 'e13cfabf-1fd1-4035-8b56-15ff3e20488b',
        prediction: [
            {
                qualitativeRisk: {
                    coding: [
                        {
                            system: 'https://CIELterminology.org',
                            code: '166675',
                            display: 'Moderate likelihood',
                        },
                    ],
                    text: 'Moderate likelihood',
                },
            },
        ],
        usageContext: 'BREAST_CANCER_SCREENING',
    },
    {
        id: 'f24dfabf-2fd1-4035-8b56-15ff3e20499c',
        prediction: [
            {
                qualitativeRisk: {
                    coding: [
                        {
                            system: 'https://CIELterminology.org',
                            code: '166676',
                            display: 'High likelihood',
                        },
                    ],
                    text: 'High likelihood',
                },
            },
        ],
        usageContext: 'PROSTATE_CANCER_SCREENING',
    },
];

describe('RiskStratificationComponent', () => {
    let component: RiskStratificationComponent;
    let fixture: ComponentFixture<RiskStratificationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [RiskStratificationComponent],
            imports: [mockPipe('titleCase')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
            ],
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(RiskStratificationComponent);
                component = fixture.componentInstance;
                fixture.detectChanges();
            });
    }));

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should set correct risk level for breast cancer', () => {
        component.cancerType = 'breast';
        component.riskAssessmentData = mockRiskAssessmentData[1];
        component.ngOnChanges();

        expect(component.riskLevel).toBe('average_risk');
        expect(component.riskData).toBeTruthy();
        expect(component.riskData.label).toBe('Average Risk');
    });

    it('should set correct risk level for cervical cancer', () => {
        component.cancerType = 'cervical';
        component.riskAssessmentData = mockRiskAssessmentData[0];
        component.ngOnChanges();

        expect(component.riskLevel).toBe('not_at_risk');
        expect(component.riskData).toBeTruthy();
        expect(component.riskData.label).toBe('Not At Risk');
    });

    it('should set correct risk level for prostate cancer', () => {
        component.cancerType = 'prostate';
        component.riskAssessmentData = mockRiskAssessmentData[2];
        component.ngOnChanges();

        expect(component.riskLevel).toBe('high_risk');
        expect(component.riskData).toBeTruthy();
        expect(component.riskData.label).toBe('High Risk');
    });

    it('should handle missing riskAssessmentData gracefully', () => {
        component.cancerType = 'breast';
        component.riskAssessmentData = null;
        component.ngOnChanges();

        expect(component.riskLevel).toBe('');
        expect(component.riskData).toBeNull();
        expect(component.loading).toBe(false);
    });

    it('should handle unknown cancer types', () => {
        component.cancerType = 'unknown';
        component.riskAssessmentData = mockRiskAssessmentData[0];
        component.ngOnChanges();

        expect(component.riskLevel).toBe('');
        expect(component.riskData).toBeNull();
    });

    it('should set loading to false after ngOnChanges', () => {
        component.cancerType = 'breast';
        component.riskAssessmentData = mockRiskAssessmentData[1];
        component.ngOnChanges();

        expect(component.loading).toBe(false);
    });

    describe('normalizeRiskLevel', () => {
        it('should handle empty input', () => {
            expect(component.normalizeRiskLevel('')).toBe('');
            expect(component.normalizeRiskLevel(null)).toBe('');
            expect(component.normalizeRiskLevel(undefined)).toBe('');
        });

        it('should normalize "Negligible likelihood" correctly for all cancer types', () => {
            component.cancerType = 'breast';
            expect(component.normalizeRiskLevel('Negligible likelihood')).toBe(
                'not_at_risk'
            );

            component.cancerType = 'cervical';
            expect(component.normalizeRiskLevel('Negligible likelihood')).toBe(
                'not_at_risk'
            );

            component.cancerType = 'prostate';
            expect(component.normalizeRiskLevel('Negligible likelihood')).toBe(
                'not_at_risk'
            );
        });

        it('should normalize "High likelihood" correctly for breast and prostate', () => {
            component.cancerType = 'breast';
            expect(component.normalizeRiskLevel('High likelihood')).toBe(
                'high_risk'
            );

            component.cancerType = 'prostate';
            expect(component.normalizeRiskLevel('High likelihood')).toBe(
                'high_risk'
            );
        });

        it('should normalize "Certain" correctly for cervical cancer', () => {
            component.cancerType = 'cervical';
            expect(component.normalizeRiskLevel('Certain')).toBe('at_risk');
        });

        it('should normalize "Moderate likelihood" correctly', () => {
            component.cancerType = 'breast';
            expect(component.normalizeRiskLevel('Moderate likelihood')).toBe(
                'average_risk'
            );

            component.cancerType = 'prostate';
            expect(component.normalizeRiskLevel('Moderate likelihood')).toBe(
                'average_risk'
            );

            component.cancerType = 'cervical';
            expect(component.normalizeRiskLevel('Moderate likelihood')).toBe(
                'average_risk'
            );
        });

        it('should normalize "Low likelihood" correctly', () => {
            component.cancerType = 'breast';
            expect(component.normalizeRiskLevel('Low likelihood')).toBe(
                'low_risk'
            );

            component.cancerType = 'prostate';
            expect(component.normalizeRiskLevel('Low likelihood')).toBe(
                'low_risk'
            );

            component.cancerType = 'cervical';
            expect(component.normalizeRiskLevel('Low likelihood')).toBe(
                'low_risk'
            );
        });

        it('should handle case insensitivity', () => {
            component.cancerType = 'breast';
            expect(component.normalizeRiskLevel('high likelihood')).toBe(
                'high_risk'
            );
            expect(component.normalizeRiskLevel('HIGH LIKELIHOOD')).toBe(
                'high_risk'
            );
            expect(component.normalizeRiskLevel('High Likelihood')).toBe(
                'high_risk'
            );
        });

        it('should return empty string for unrecognized risk text', () => {
            component.cancerType = 'breast';
            expect(component.normalizeRiskLevel('Unknown Risk')).toBe('');
        });
    });

    it('should have correct risk display data structure', () => {
        expect(component.riskDisplayData).toBeDefined();
        expect(component.riskDisplayData.breast).toBeDefined();
        expect(component.riskDisplayData.cervical).toBeDefined();
        expect(component.riskDisplayData.prostate).toBeDefined();

        expect(component.riskDisplayData.breast.high_risk).toBeDefined();
        expect(component.riskDisplayData.breast.high_risk.label).toBe(
            'High Risk'
        );
        expect(
            component.riskDisplayData.breast.high_risk.recommendations.length
        ).toBeGreaterThan(0);

        expect(component.riskDisplayData.cervical.not_at_risk).toBeDefined();
        expect(component.riskDisplayData.cervical.not_at_risk.label).toBe(
            'Not At Risk'
        );

        expect(
            component.riskDisplayData.prostate.high_risk.badgeStyle.color
        ).toBe('#DA0A15');
        expect(
            component.riskDisplayData.breast.low_risk.badgeStyle.backgroundColor
        ).toBe('#F6FFED');
    });
});

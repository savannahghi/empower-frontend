import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
    SimpleChange,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { of, throwError } from 'rxjs';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { PatientDetailsTimelineComponent } from './patient-details-timeline.component';
import { AnalyticsService } from '../../../../../@core/utils';
import { NbStatusService } from '@nebular/theme';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../../shared/cookies/cookie.service';
import { VisitService } from '../../../visits/visit.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';

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

class NbStatusServiceStub {
    isCustomStatus() {}
}

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.patients.detail.',
    },
    params() {
        return { appointment_id: 1 };
    },
};

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class AuthorizationStub {
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';

    getOrganisation() {
        return {};
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getWorkstation() {
        return {
            workstation__workstation_type: 'triage',
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'fsdfs09344mlw03434',
            clinical_org_id: 'asdkasdisefd832ksd',
        };
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transition() {
        return true;
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class SilStoresServiceStub {
    list() {
        return of({
            clinical_facility_id: '2348923403',
            clinical_org_id: '2348923403',
        });
    }

    listNested() {
        return of({
            conditions: [
                {
                    id: '94dff2f3-fa99-4e1e-8e79-9b3bb20c972e',
                    resourceType: 'Condition',
                    name: 'Cerebral ischaemic stroke due to cardiac embolism',
                    value: 'ACTIVE',
                    status: 'Encounter Diagnosis',
                    date: '2025-06-27',
                    timeRecorded: '2025-06-27T00:00:00Z',
                },
            ],
            allergies: [
                {
                    id: '73fe09b5-f256-4629-81c2-38ace725eee1',
                    resourceType: 'AllergyIntolerance',
                    name: 'Penicillin',
                    value: 'Severe allergic reaction',
                    date: '2025-06-27',
                    timeRecorded: '2025-06-27T00:00:00Z',
                },
            ],
            medications: [
                {
                    id: 'med-001',
                    resourceType: 'Medication',
                    name: 'Metformin 500mg',
                    value: 'Twice daily',
                    date: '2025-06-27',
                    timeRecorded: '2025-06-27T00:00:00Z',
                },
            ],
        });
    }
}

class ErrorHandlerServiceStub {
    handleError() {
        return {};
    }
}

const visitServiceStub = {
    visitPatientDataEmitter: of({
        new_price: 18,
        amount: '18',
        product_name: 'Lipid',
        quantity: 1,
        id: 1,
    }),
    pricelistDataEmitter: of({
        name: 'Default pricelist',
        id: 1,
    }),
    currenciesDataEmitter: of({
        results: {
            new_price: 18,
            amount: '18',
            product_name: 'Lipid',
            quantity: 1,
            id: 1,
        },
    }),
    patientChronicConditionEmitter: of('RECURRENCE'),
    sendToQueue: () => {},
    completeVisit: () => {},
    queuesDataEmitter: of([
        {
            id: 1,
        },
    ]),
    fetchVisit: () => {},
    addToQueue: () => {},
    visit: {
        id: 1,
        service_requests: [
            {
                invoice: {
                    amount_due: 100,
                    amount_paid: 100,
                    invoice_lines: [{ id: 1 }],
                },
            },
        ],
    },
};

describe('PatientDetailsTimelineComponent: ', () => {
    let component: PatientDetailsTimelineComponent;
    let fixture: ComponentFixture<PatientDetailsTimelineComponent>;
    let dataLayerService: SilStoresService;
    let errorHandlerService: ErrorHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                PatientDetailsTimelineComponent,
                mockPipe('titleCase'),
                mockPipe('featureFlag'),
                mockPipe('translate'),
                mockPipe('date'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientDetailsTimelineComponent);
        component = fixture.componentInstance;
        dataLayerService = TestBed.inject(SilStoresService);
        errorHandlerService = TestBed.inject(ErrorHandlerService);

        component.patientObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            clinical_id: '282828',
        });
        component.patient = {
            clinical_id: '334345345',
        };

        // Suppress console errors for this test
        spyOn(console, 'error').and.callFake(() => {});
        fixture.detectChanges();
    });

    it('should create component', () => {
        spyOn(component, 'isClinicalServicePoint').and.callThrough();
        component.isClinicalServicePoint();
        expect(component.isClinicalServicePoint).toHaveBeenCalled();
        expect(component).toBeTruthy();
    });

    it('should test ngOnInit without clinical ids', () => {
        localStorage.setItem('auth.config.clinicalIds', null);
        component.isClinicalIdsSaved = null;
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should test ngOnInit without facility id', () => {
        component.isClinicalIdsSaved = {
            clinical_facility_id: null,
            clinical_org_id: '2348923403',
        };
        component.checkClinicalIdsSaved();
        expect(component).toBeTruthy();
    });

    it('should test ngOnInit with clinical_facility_id and clinical_org_id', () => {
        component.isClinicalIdsSaved = {
            clinical_facility_id: '2348923403',
            clinical_org_id: '2348923403',
        };
        component.checkClinicalIdsSaved();
        expect(component).toBeTruthy();
    });

    it('should test ngOnChanges with patient having clinical_id', () => {
        component.ngOnChanges({
            patient: new SimpleChange(
                null,
                { id: 1, clinical_id: '123' },
                false
            ),
        });
        expect(component.patient.clinical_id).toBe('123');
    });

    it('should test ngOnChanges with patient without clinical_id', () => {
        component.ngOnChanges({
            patient: new SimpleChange(null, { id: 1, visit: 1 }, false),
        });
        expect(component.patient.id).toBe(1);
    });

    it('should get patient banner details successfully', () => {
        spyOn(dataLayerService, 'listNested').and.returnValue(
            of({
                conditions: [],
                allergies: [],
                medications: null,
            })
        );

        component.getPatientBannerDetails();

        expect(dataLayerService.listNested).toHaveBeenCalledWith(
            'clinical-patient',
            'banner',
            component.patient.clinical_id,
            null,
            true
        );
        expect(component.loading).toBeFalse();
        expect(component.patientBannerData).toBeDefined();
    });

    it('should handle error when getting patient banner details', () => {
        const error = new Error('API Error');
        spyOn(dataLayerService, 'listNested').and.returnValue(
            throwError(error)
        );
        spyOn(errorHandlerService, 'handleError');

        component.getPatientBannerDetails();

        expect(errorHandlerService.handleError).toHaveBeenCalledWith(
            error,
            component
        );
        expect(component.loading).toBeFalse();
    });

    it('should refetch clinical ids', () => {
        spyOn(dataLayerService, 'list').and.returnValue(
            of({
                clinical_facility_id: '123',
                clinical_org_id: '456',
            })
        );
        spyOn(component.authUrlConfig, 'setClinicalIds');
        spyOn(component, 'getPatientBannerDetails');

        component.refetchClinicalIds();

        expect(dataLayerService.list).toHaveBeenCalledWith('userProfile');
        expect(component.authUrlConfig.setClinicalIds).toHaveBeenCalled();
        expect(component.getPatientBannerDetails).toHaveBeenCalled();
    });

    describe('Display Text Methods - Basic Tests', () => {
        beforeEach(() => {
            component.patientBannerData = {
                conditions: [
                    {
                        id: '1',
                        resourceType: 'Condition',
                        name: 'Diabetes',
                        value: 'ACTIVE',
                        status: 'Active',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '2',
                        resourceType: 'Condition',
                        name: 'Hypertension',
                        value: 'ACTIVE',
                        status: 'Active',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                ],
                allergies: [
                    {
                        id: '1',
                        resourceType: 'AllergyIntolerance',
                        name: 'Penicillin',
                        value: 'Severe',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                ],
                medications: [
                    {
                        id: '1',
                        resourceType: 'Medication',
                        name: 'Metformin',
                        value: 'Daily',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '2',
                        resourceType: 'Medication',
                        name: 'Lisinopril',
                        value: 'Daily',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '3',
                        resourceType: 'Medication',
                        name: 'Aspirin',
                        value: 'Daily',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                ],
            };
        });

        it('should return correct conditions display text for multiple conditions', () => {
            const result = component.getConditionsDisplayText();
            expect(result).toBe('Diabetes and 1 other');
        });

        it('should return correct conditions display text for single condition', () => {
            component.patientBannerData.conditions = [
                component.patientBannerData.conditions[0],
            ];
            const result = component.getConditionsDisplayText();
            expect(result).toBe('Diabetes');
        });

        it('should return N/A for empty conditions', () => {
            component.patientBannerData.conditions = [];
            const result = component.getConditionsDisplayText();
            expect(result).toBe('N/A');
        });

        it('should return correct allergies display text for single allergy', () => {
            const result = component.getAllergiesDisplayText();
            expect(result).toBe('Penicillin');
        });

        it('should return correct medications display text for multiple medications', () => {
            const result = component.getMedicationsDisplayText();
            expect(result).toBe('Metformin and 2 others');
        });

        it('should return N/A for null medications', () => {
            component.patientBannerData.medications = null;
            const result = component.getMedicationsDisplayText();
            expect(result).toBe('N/A');
        });
    });

    describe('Multiple Items Check Methods', () => {
        beforeEach(() => {
            component.patientBannerData = {
                conditions: [
                    {
                        id: '1',
                        resourceType: 'Condition',
                        name: 'Diabetes',
                        value: 'ACTIVE',
                        status: 'Active',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '2',
                        resourceType: 'Condition',
                        name: 'Hypertension',
                        value: 'ACTIVE',
                        status: 'Active',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                ],
                allergies: [
                    {
                        id: '1',
                        resourceType: 'AllergyIntolerance',
                        name: 'Penicillin',
                        value: 'Severe',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                ],
                medications: [
                    {
                        id: '1',
                        resourceType: 'Medication',
                        name: 'Metformin',
                        value: 'Daily',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '2',
                        resourceType: 'Medication',
                        name: 'Lisinopril',
                        value: 'Daily',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                ],
            };
        });

        it('should return true for multiple conditions', () => {
            expect(component.hasMultipleConditions()).toBeTruthy();
        });

        it('should return false for single allergy', () => {
            expect(component.hasMultipleAllergies()).toBeFalsy();
        });

        it('should return true for multiple medications', () => {
            expect(component.hasMultipleMedications()).toBeTruthy();
        });

        it('should return false when no data exists', () => {
            component.patientBannerData = null;
            expect(component.hasMultipleConditions()).toBeFalsy();
            expect(component.hasMultipleAllergies()).toBeFalsy();
            expect(component.hasMultipleMedications()).toBeFalsy();
        });
    });

    // Additional tests for complete coverage of untested lines
    describe('getConditionsDisplayText - Complete Coverage', () => {
        it('should return correct text for multiple conditions with "s" suffix', () => {
            // Test the line: additionalCount > 1 ? 's' : ''
            component.patientBannerData = {
                conditions: [
                    {
                        id: '1',
                        resourceType: 'Condition',
                        name: 'Diabetes',
                        value: 'ACTIVE',
                        status: 'Active',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '2',
                        resourceType: 'Condition',
                        name: 'Hypertension',
                        value: 'ACTIVE',
                        status: 'Active',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '3',
                        resourceType: 'Condition',
                        name: 'Heart Disease',
                        value: 'ACTIVE',
                        status: 'Active',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                ],
                allergies: [],
                medications: null,
            };

            const result = component.getConditionsDisplayText();
            expect(result).toBe('Diabetes and 2 others'); // Tests the 's' suffix
        });

        it('should return correct text for exactly 2 conditions (no "s" suffix)', () => {
            // Test the line: additionalCount > 1 ? 's' : ''
            component.patientBannerData = {
                conditions: [
                    {
                        id: '1',
                        resourceType: 'Condition',
                        name: 'Diabetes',
                        value: 'ACTIVE',
                        status: 'Active',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '2',
                        resourceType: 'Condition',
                        name: 'Hypertension',
                        value: 'ACTIVE',
                        status: 'Active',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                ],
                allergies: [],
                medications: null,
            };

            const result = component.getConditionsDisplayText();
            expect(result).toBe('Diabetes and 1 other'); // Tests no 's' suffix
        });
    });

    describe('getAllergiesDisplayText - Complete Coverage', () => {
        it('should return N/A when patientBannerData.allergies is null/undefined', () => {
            // Test the line: return 'N/A';
            component.patientBannerData = {
                conditions: [],
                allergies: null as any, // Force null to test this path
                medications: null,
            };

            const result = component.getAllergiesDisplayText();
            expect(result).toBe('N/A');
        });

        it('should return correct text for multiple allergies with "s" suffix', () => {
            // Test the line: additionalCount > 1 ? 's' : ''
            component.patientBannerData = {
                conditions: [],
                allergies: [
                    {
                        id: '1',
                        resourceType: 'AllergyIntolerance',
                        name: 'Penicillin',
                        value: 'Severe',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '2',
                        resourceType: 'AllergyIntolerance',
                        name: 'Peanuts',
                        value: 'Moderate',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '3',
                        resourceType: 'AllergyIntolerance',
                        name: 'Shellfish',
                        value: 'Mild',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                ],
                medications: null,
            };

            const result = component.getAllergiesDisplayText();
            expect(result).toBe('Penicillin and 2 others'); // Tests the 's' suffix
        });

        it('should return correct text for exactly 2 allergies (no "s" suffix)', () => {
            // Test the line: additionalCount > 1 ? 's' : ''
            component.patientBannerData = {
                conditions: [],
                allergies: [
                    {
                        id: '1',
                        resourceType: 'AllergyIntolerance',
                        name: 'Penicillin',
                        value: 'Severe',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '2',
                        resourceType: 'AllergyIntolerance',
                        name: 'Peanuts',
                        value: 'Moderate',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                ],
                medications: null,
            };

            const result = component.getAllergiesDisplayText();
            expect(result).toBe('Penicillin and 1 other'); // Tests no 's' suffix
        });
    });

    describe('getMedicationsDisplayText - Complete Coverage', () => {
        it('should return N/A when patientBannerData.medications is null', () => {
            // Test the line: return 'N/A';
            component.patientBannerData = {
                conditions: [],
                allergies: [],
                medications: null,
            };

            const result = component.getMedicationsDisplayText();
            expect(result).toBe('N/A');
        });

        it('should return N/A when patientBannerData.medications is empty array', () => {
            // Test the line: return 'N/A';
            component.patientBannerData = {
                conditions: [],
                allergies: [],
                medications: [],
            };

            const result = component.getMedicationsDisplayText();
            expect(result).toBe('N/A');
        });

        it('should return single medication name when only one medication exists', () => {
            // Test the line: return medications[0].name;
            component.patientBannerData = {
                conditions: [],
                allergies: [],
                medications: [
                    {
                        id: '1',
                        resourceType: 'Medication',
                        name: 'Metformin',
                        value: 'Daily',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                ],
            };

            const result = component.getMedicationsDisplayText();
            expect(result).toBe('Metformin');
        });

        it('should return correct text for multiple medications with "s" suffix', () => {
            // Test the line: additionalCount > 1 ? 's' : ''
            component.patientBannerData = {
                conditions: [],
                allergies: [],
                medications: [
                    {
                        id: '1',
                        resourceType: 'Medication',
                        name: 'Metformin',
                        value: 'Daily',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '2',
                        resourceType: 'Medication',
                        name: 'Lisinopril',
                        value: 'Daily',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '3',
                        resourceType: 'Medication',
                        name: 'Aspirin',
                        value: 'Daily',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                ],
            };

            const result = component.getMedicationsDisplayText();
            expect(result).toBe('Metformin and 2 others'); // Tests the 's' suffix
        });

        it('should return correct text for exactly 2 medications (no "s" suffix)', () => {
            // Test the line: additionalCount > 1 ? 's' : ''
            component.patientBannerData = {
                conditions: [],
                allergies: [],
                medications: [
                    {
                        id: '1',
                        resourceType: 'Medication',
                        name: 'Metformin',
                        value: 'Daily',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '2',
                        resourceType: 'Medication',
                        name: 'Lisinopril',
                        value: 'Daily',
                        date: '2025-01-01',
                        timeRecorded: '2025-01-01T00:00:00Z',
                    },
                ],
            };

            const result = component.getMedicationsDisplayText();
            expect(result).toBe('Metformin and 1 other'); // Tests no 's' suffix
        });
    });

    describe('Edge Cases for Complete Coverage', () => {
        it('should handle undefined patientBannerData', () => {
            component.patientBannerData = undefined as any;

            expect(component.getConditionsDisplayText()).toBe('N/A');
            expect(component.getAllergiesDisplayText()).toBe('N/A');
            expect(component.getMedicationsDisplayText()).toBe('N/A');
        });

        it('should handle patientBannerData with undefined arrays', () => {
            component.patientBannerData = {
                conditions: undefined as any,
                allergies: undefined as any,
                medications: undefined as any,
            };

            expect(component.getConditionsDisplayText()).toBe('N/A');
            expect(component.getAllergiesDisplayText()).toBe('N/A');
            expect(component.getMedicationsDisplayText()).toBe('N/A');
        });
    });

    describe('Legacy Test Cases', () => {
        it('should test oninit without clinical ids', () => {
            localStorage.setItem('auth.config.clinicalIds', null);
            component.isClinicalIdsSaved = localStorage.setItem(
                'auth.config.clinicalIds',
                null
            );
            component.ngOnInit();
            component.isClinicalIdsSaved = null;
            component.checkClinicalIdsSaved();
            component.refetchClinicalIds();
            expect(component).toBeTruthy();
        });

        it('should test oninit without facility id', () => {
            component.isClinicalIdsSaved = localStorage.setItem(
                'auth.config.clinicalIds',
                JSON.stringify({
                    clinical_facility_id: null,
                    clinical_org_id: '2348923403',
                })
            );
            component.ngOnChanges({
                patient: new SimpleChange(null, { id: 1, visit: 1 }, false),
            });
            component.ngOnChanges({
                patient: new SimpleChange(
                    null,
                    { id: 1, clinical_id: 1 },
                    false
                ),
            });
            component.checkClinicalIdsSaved();
            expect(component).toBeTruthy();
        });

        it('should test oninit with clinical_facility_id and clinical_org_id', () => {
            component.isClinicalIdsSaved = {
                clinical_facility_id: '2348923403',
                clinical_org_id: '2348923403',
            };
            component.checkClinicalIdsSaved();
            expect(component).toBeTruthy();
        });
    });
});

import { VitalResultComponent } from './vital-result.component';
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { of, throwError } from 'rxjs';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { VisitService } from '../../visits/visit.service';
import { AnalyticsService } from 'app/@core/utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class AuthorizationConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
    loginUrl() {
        return of(() => {});
    }
    logout() {
        return of(() => {});
    }
    storeToken() {
        return true;
    }
    isLoggedIn() {
        return true;
    }

    setOrganisationSettings() {
        return of(() => {});
    }

    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: false,
            },
        ];
    }

    setOrganisation() {
        return of(() => {});
    }
    setOrganisationDetails() {
        return of({
            client_types: ['PRACTITIONER'],
        });
    }
    setUserDetails() {
        return of(() => {});
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }

    setUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }

    getUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getToken() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    setAdvantageOrganisation() {
        return {};
    }
    setAdvantageOrganisationDetails() {
        return of(() => {});
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: [{ workstation: '1' }],
        };
    }
    removeTokenData() {
        return {};
    }
}

class SilStoresServiceStub {
    create() {
        return of([]);
    }
    list() {
        return of([]);
    }
    update() {
        return of({});
    }
    get() {
        return of({});
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { appointment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

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
    reFetchChronicCondition(data) {
        return data;
    },
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

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    includes() {
        return true;
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

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('VitalResultComponent', () => {
    let component: VitalResultComponent;
    let fixture: ComponentFixture<VitalResultComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                BrowserAnimationsModule,
                mockPipe('translate'),
                mockPipe('titleCase'),
            ],
            declarations: [VitalResultComponent],
            providers: [
                { provide: VisitService, useValue: visitServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(VitalResultComponent);
        component = fixture.componentInstance;
        component.patient = {
            clinical_id: 1,
        };
        component.patient = {
            id: 1,
            person: { gender: 'MALE' },
            vitals_reference_ranges: {
                BMI: [{ display: 'Display', end: 16, start: 1 }],
                PULSE_RATE: [{ display: 'Display', end: 16, start: 1 }],
                RESPIRATION_RATE: [{ display: 'Display', end: 16, start: 1 }],
                SPO2: [{ display: 'Display', end: 16, start: 1 }],
                DIASTOLIC_BLOOD_PRESSURE: [
                    { display: 'display name', end: 16, start: 1 },
                ],
                SYSTOLIC_BLOOD_PRESSURE: [
                    { display: 'display name', end: 16, start: 1 },
                ],
                TEMPERATURE: [{ display: 'display name', end: 16, start: 1 }],
                MUAC: [{ display: 'display name', end: 16, start: 1 }],
                HEIGHT: [{ display: 'display name', end: 16, start: 1 }],
                WEIGHT: [{ display: 'display name', end: 16, start: 1 }],
            },
        };
        component.activeServiceRequest = {
            encounter_id: 1,
            status: 'WAITING',
        };

        // Suppress console errors for this test
        spyOn(console, 'error').and.callFake(() => {});
        localStorage.setItem(
            'auth.config.clinicalIds',
            JSON.stringify({
                clinical_facility_id: '2348923403',

                clinical_org_id: '2348923403',
            })
        );
        fixture.detectChanges();
    });

    it('should test various methods', fakeAsync(() => {
        component.toggleModal({ id: '1', name: 'heading' });
        const mockResponse = {
            data: {
                data: {
                    getPatientPulseRateEntries: {
                        id: '123',
                        value: '22.5',
                        timeRecorded: '2025-03-19T10:00:00Z',
                        totalCount: 1,
                        edges: [
                            {
                                totalCount: 1,
                                node: {
                                    id: 12,
                                    value: 30,
                                    timeRecorded: '2025-03-19T10:00:00Z',
                                },
                            },
                        ],
                    },
                },
                getPatientPulseRateEntries: {
                    id: '123',
                    value: '22.5',
                    timeRecorded: '2025-03-19T10:00:00Z',
                    totalCount: 1,
                    edges: [
                        {
                            totalCount: 1,
                            node: {
                                id: 12,
                                value: 30,
                                timeRecorded: '2025-03-19T10:00:00Z',
                            },
                        },
                    ],
                },
            },
            getPatientPulseRateEntries: {
                id: '123',
                value: '22.5',
                timeRecorded: '2025-03-19T10:00:00Z',
                totalCount: 1,
                edges: [
                    {
                        totalCount: 1,
                        node: {
                            id: 12,
                            value: 30,
                            timeRecorded: '2025-03-19T10:00:00Z',
                        },
                    },
                ],
            },
        };
        component.vital = {
            id: 'pulse',
            name: 'Pulse',
            units: 'BPM',
            nestedResponse: 'getPatientPulseRateEntries',
            vitalReference: 'PULSE_RATE',
        };
        component.patient = {
            id: 1,
            person: { gender: 'MALE' },
            vitals_reference_ranges: {
                BMI: [{ display: 'Display', end: 16, start: 1 }],
                PULSE_RATE: [{ display: 'Display', end: 16, start: 1 }],
                RESPIRATION_RATE: [{ display: 'Display', end: 16, start: 1 }],
                SPO2: [{ display: 'Display', end: 16, start: 1 }],
                DIASTOLIC_BLOOD_PRESSURE: [
                    { display: 'display name', end: 16, start: 1 },
                ],
                SYSTOLIC_BLOOD_PRESSURE: [
                    { display: 'display name', end: 16, start: 1 },
                ],
                TEMPERATURE: [{ display: 'display name', end: 16, start: 1 }],
                MUAC: [{ display: 'display name', end: 16, start: 1 }],
                HEIGHT: [{ display: 'display name', end: 16, start: '1' }],
                WEIGHT: [{ display: 'display name', end: 16, start: '1' }],
            },
        };
        component.result = {
            id: '1',
            value: '1',
            timeRecorded: undefined,
        };
        component.vital = {
            id: 'height',
            name: 'Height',
            units: 'BPM',
            concept: 'HEIGHT',
            nestedResponse: 'getPatientHeightEntries',
            vitalReference: 'HEIGHT',
        };

        component.vital = {
            id: 'weight',
            name: 'Weight',
            units: 'BPM',
            concept: 'WEIGHT',
            nestedResponse: 'getPatientWeightEntries',
            vitalReference: 'WEIGHT',
        };
        component.result = {
            id: '12312',
            value: '22.5',
            timeRecorded: '2025-03-19T10:00:00Z',
        };

        component.toggleModal({ id: '1', name: 'heading' });
        const context = {
            pulse: 'note',
            id: 1,
        };
        component.addToggleModal(context);
        component.updateToggleModal(context, {});
        component.emitToggleServicePointModal();
        const model = {
            pulse: 'note',
            id: 1,
        };
        component.vital = {
            id: 'pulse',
            name: 'Pulse',
            units: 'BPM',
            concept: 'PULSE_RATE',
            nestedResponse: 'getPatientPulseRateEntries',
            vitalReference: 'PULSE_RATE',
        };
        component.patient = {
            id: 1,
            person: { gender: 'MALE' },
            vitals_reference_ranges: {
                BMI: [{ display: 'Display', end: 16, start: 1 }],
                PULSE_RATE: [{ display: 'Display', end: 16, start: 1 }],
                RESPIRATION_RATE: [{ display: 'Display', end: 16, start: 1 }],
                SPO2: [{ display: 'Display', end: 16, start: 1 }],
                DIASTOLIC_BLOOD_PRESSURE: [
                    { display: 'display name', end: 16, start: 1 },
                ],
                SYSTOLIC_BLOOD_PRESSURE: [
                    { display: 'display name', end: 16, start: 1 },
                ],
                TEMPERATURE: [{ display: 'display name', end: 16, start: 1 }],
                MUAC: [{ display: 'display name', end: 16, start: 1 }],
                HEIGHT: [{ display: 'display name', end: 16, start: '1' }],
                WEIGHT: [{ display: 'display name', end: 16, start: '1' }],
            },
            clinical_id: '123',
        };
        component.resultSetFxn(mockResponse);
        component.addPatientVitalItem(model);
        component.editPatientVitalItem(model);
        const model1 = {
            s_bp: 's_bp',
            id: 1,
        };
        component.vital = {
            id: 's_bp',
        };
        component.addPatientVitalItem(model1);
        component.editPatientVitalItem(model1);
        const model2 = {
            d_bp: 'd_bp',
            id: 1,
        };
        component.vital = {
            id: 'd_bp',
        };
        component.addPatientVitalItem(model2);
        component.editPatientVitalItem(model2);
        const model3 = {
            temperature: 'temperature',
            id: 1,
        };
        component.vital = {
            id: 'temperature',
        };
        component.addPatientVitalItem(model3);
        component.editPatientVitalItem(model3);
        const model4 = {
            oxygenSaturation: 'oxygenSaturation',
            id: 1,
        };
        component.vital = {
            id: 'oxygenSaturation',
        };
        component.addPatientVitalItem(model4);
        component.editPatientVitalItem(model4);
        const model5 = {
            respirationRate: 'respirationRate',
            id: 1,
        };
        component.vital = {
            id: 'respirationRate',
        };
        component.addPatientVitalItem(model5);
        component.editPatientVitalItem(model5);
        const model6 = {
            weight: 'weight',
            id: 1,
        };
        component.vital = {
            id: 'weight',
        };
        component.addPatientVitalItem(model6);
        component.editPatientVitalItem(model6);
        const model7 = {
            height: 'height',
            id: 1,
        };
        component.vital = {
            id: 'height',
        };
        component.addPatientVitalItem(model7);
        component.editPatientVitalItem(model7);
        const model8 = {
            muac: 'muac',
            id: 1,
        };
        component.vital = {
            id: 'muac',
        };
        component.addPatientVitalItem(model8);
        component.editPatientVitalItem(model8);
        const model9 = {
            viralLoad: 'viralLoad',
            id: 1,
        };
        component.vital = {
            id: 'viralLoad',
        };
        component.addPatientVitalItem(model9);
        component.editPatientVitalItem(model9);
        const model10 = {
            bodyfat: 'bodyfat',
            id: 1,
        };
        component.vital = {
            id: 'bodyfat',
        };
        component.addPatientVitalItem(model10);
        component.editPatientVitalItem(model10);
        localStorage.setItem(
            'auth.config.clinicalIds',
            JSON.stringify({
                clinical_facility_id: '2348923403',
                clinical_org_id: '2348923403',
            })
        );
        component.checkClinicalIdsSaved();
        localStorage.removeItem('auth.config.clinicalIds');
        component.checkClinicalIdsSaved();
        component.determineVitalsForBmi(component.vital, 12, false);
        component.vital = { id: 'height' };
        component.determineVitalsForBmi(component.vital, 12, false);
        component.vital = { id: 'bmi' };
        spyOn(component, 'checkClinicalIdsSaved').and.returnValue(true);
        component.ngOnInit();
        component.vital = { id: 'pulse' };
        component.ngOnInit();
        component.vital.id = 'bmi';
        component.handleSaved(true);
        component.vital.id = 'muac';
        component.handleSaved(true);
        component.handleSaved(false);
        component.handleClinicalIdsSaved(null);
        component.handleClinicalIdsSaved({ clinical_facility_id: null });
        component.handleClinicalIdsSaved({ clinical_org_id: null });
        component.handleClinicalIdsSaved({
            clinical_facility_id: null,
            clinical_org_id: null,
        });
        component.handleClinicalIdsSaved([]);
        component.handleClinicalIdsSaved(undefined);
        component.handleClinicalIdsSaved({
            clinical_facility_id: '12',
            clinical_org_id: '12',
        });
        tick(2000);
        component.vital.vitalReference = 'MUAC';
        component.getPatientVitalReference({ value: 100 });
        component.getPatientVitalReference({ value: 0 });
        component.getPatientVitalReference({ value: 4 });
        expect(component).toBeTruthy();
    }));

    it('should test the handleObsError method', () => {
        component.loadingResult = true;
        const errorResponse = {
            error: 'Error',
            message: 'An error occurred',
        };

        spyOn(component, 'showToastError');
        component.handleObsError(errorResponse);
        expect(component.showToastError).toHaveBeenCalled();
        expect(component.loadingResult).toBeFalse();
    });

    it('should test the error response handling from addPatientVitalItem', () => {
        const model = {
            muac: 'muac',
            id: 1,
        };
        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => new Error('An error occurred'))
        );
        spyOn(component, 'handleObsError');
        component.addPatientVitalItem(model);
        expect(component.handleObsError).toHaveBeenCalled();
    });

    it('should test the error response handling from editPatientVitalItem', () => {
        component.vital = {
            id: 'muac',
        };
        const model = {
            muac: 12,
            id: 1,
        };
        spyOn(component.dataLayer, 'update').and.returnValue(
            throwError(() => new Error('An error occurred'))
        );
        spyOn(component, 'handleObsError');
        component.editPatientVitalItem(model);
        expect(component.handleObsError).toHaveBeenCalled();
    });

    it('should test the handleObsResponse function', () => {
        component.vital = {
            id: 'height',
            value: 300,
        };
        const payload = {
            id: 1,
            value: 23,
        };
        spyOn(component, 'getPatientVitalReference');
        spyOn(component, 'determineVitalsForBmi');
        component.handleObsResponse(payload);
        expect(component.getPatientVitalReference).toHaveBeenCalled();
        expect(component.determineVitalsForBmi).toHaveBeenCalled();
        expect(component.toggle).toEqual({});
        expect(component.showAddModal).toBeFalse;
        expect(component.loadingResult).toBeFalse;
    });

    it('should test the getResult function on success', () => {
        component.concept = 'WEIGHT';
        component.clinicalRecordsService.isClinicalIdsSaved = {
            clinical_facility_id: '2348923403',
            clinical_org_id: '2348923403',
        };
        const mockResponse = {
            totalCount: 1,
            edges: [
                {
                    node: {
                        id: 123,
                        value: '123',
                    },
                },
            ],
        };
        spyOn(component, 'handleObsResponse');
        spyOn(component.dataLayer, 'get').and.returnValue(of(mockResponse));
        component.getResult();
        expect(component.handleObsResponse).toHaveBeenCalledWith(
            mockResponse.edges[0].node
        );
        expect(component.loadingResult).toBeFalse();
    });

    it('should test the getResult function on error', () => {
        component.concept = 'WEIGHT';
        component.clinicalRecordsService.isClinicalIdsSaved = {
            clinical_facility_id: '2348923403',
            clinical_org_id: '2348923403',
        };
        spyOn(component.dataLayer, 'get').and.returnValue(
            throwError(() => new Error('Error'))
        );
        spyOn(component, 'handleObsError');
        component.getResult();
        expect(component.handleObsError).toHaveBeenCalled();
    });

    it('should test evaluateClinicalIds', () => {
        component.concept = 'WEIGHT';
        component.evaluateClinicalIds();
        expect(component).toBeTruthy();
    });

    it('should set loadingResult to false when no observations are found', () => {
        component.concept = 'WEIGHT';
        component.clinicalRecordsService.isClinicalIdsSaved = {
            clinical_facility_id: '123',
            clinical_org_id: '456',
        };
        component.activeServiceRequest = { encounter_id: '789' };

        const emptyResponse = { totalCount: 0, edges: [] };
        spyOn(component.dataLayer, 'get').and.returnValue(of(emptyResponse));

        component.getResult();

        expect(component.loadingResult).toBeFalse();
    });

    it('should show error toast when encounter_id is undefined in addPatientVitalItem', () => {
        component.activeServiceRequest = { encounter_id: undefined };
        const model = { pulse: '80' };
        spyOn(component, 'showToastError');

        component.addPatientVitalItem(model);

        expect(component.showToastError).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Error',
            'No active encounter found'
        );
    });

    it('should set patient with empty object when activeServiceRequest is undefined', () => {
        component.patient = { clinical_id: '123' };
        component.activeServiceRequest = undefined;
        spyOn(component.clinicalRecordsService, 'setPatient');
        spyOn(component, 'checkClinicalIdsSaved').and.returnValue(true);

        component.ngOnInit();

        expect(
            component.clinicalRecordsService.setPatient
        ).toHaveBeenCalledWith(component.patient, {});
    });

    it('should set loadingResult to false when evaluateClinicalIds returns false in setTimeout', fakeAsync(() => {
        spyOn(component, 'evaluateClinicalIds').and.returnValue(false);
        component.loadingResult = true;

        component.handleClinicalIdsSaved(null);
        tick(1000);

        expect(component.loadingResult).toBeFalse();
    }));

    it('should call getResult in else block when evaluateClinicalIds returns true', () => {
        spyOn(component, 'evaluateClinicalIds').and.returnValue(true);
        spyOn(component, 'getResult');

        component.handleClinicalIdsSaved({
            clinical_facility_id: '123',
            clinical_org_id: '456',
        });

        expect(component.getResult).toHaveBeenCalled();
    });

    it('should call getBMIRes when activeServiceRequest has encounter_id', () => {
        component.activeServiceRequest = { encounter_id: '123' };
        spyOn(component, 'evaluateClinicalIds').and.returnValue(true);
        spyOn(component.clinicalRecordsService, 'getBMIRes');

        component.handleClinicalIdsSaved({
            clinical_facility_id: '123',
            clinical_org_id: '456',
        });

        expect(component.clinicalRecordsService.getBMIRes).toHaveBeenCalledWith(
            '123'
        );
    });

    it('should set loadingResult to false when evaluateClinicalIds returns false in else block', () => {
        spyOn(component, 'evaluateClinicalIds').and.returnValue(false);
        component.loadingResult = true;

        component.handleClinicalIdsSaved({
            clinical_facility_id: '123',
            clinical_org_id: '456',
        });

        expect(component.loadingResult).toBeFalse();
    });

    it('should call getResult in setTimeout when evaluateClinicalIds returns true', fakeAsync(() => {
        spyOn(component, 'evaluateClinicalIds').and.returnValue(true);
        spyOn(component, 'getResult');

        component.handleClinicalIdsSaved(null);
        tick(1000);

        expect(component.getResult).toHaveBeenCalled();
    }));
});

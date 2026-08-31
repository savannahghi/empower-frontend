import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientDiagnosisComponent } from './patient-diagnosis.component';
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

describe('PatientDiagnosisComponent', () => {
    let component: PatientDiagnosisComponent;
    let fixture: ComponentFixture<PatientDiagnosisComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [BrowserAnimationsModule, mockPipe('translate')],
            declarations: [PatientDiagnosisComponent],
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

        fixture = TestBed.createComponent(PatientDiagnosisComponent);
        component = fixture.componentInstance;
        component.patient = {
            clinical_id: 1,
        };
        component.activeServiceRequest = {
            encounter_id: 1,
        };
        fixture.detectChanges();
    });

    it('should test various methods', () => {
        component.emitToggleServicePointModal();
        component.cancelAddDiagnosis();
        component.togglePreviewDiagnosisModal();
        component.togglePreviewDiagnosisModal({ diagnosis: 'common cold' });
        component.handleError({ message: 'errr' });
        component.toggleIsHidden('diagnosisForm');
        const model = {
            diagnosis: {
                system: 'ICD-10-WHO',
                code: 'J10',
                onset: '2025-10-04',
                name: 'Common Cold',
            },
            note: 'note',
            status: 'FINAL',
        };
        component.addPatientDiagnosisItem(model);
        const model2 = {
            diagnosis: {
                system: 'ICD-11-WHO',
                code: 'J10',
                onset: '2025-10-04',
                name: 'Common Cold',
            },
            note: 'note',
            status: 'FINAL',
        };
        component.addPatientDiagnosisItem(model2);

        const mockResponse = {
            data: {
                createCondition: {
                    id: '123',
                    value: '22.5',
                    timeRecorded: '2025-03-19T10:00:00Z',
                    totalCount: 1,
                    edges: [
                        {
                            node: {
                                id: 12,
                                value: 30,
                            },
                        },
                    ],
                },
                errors: [
                    {
                        message: 'error',
                    },
                ],
            },
        };
        component.responseFunction(mockResponse);
        expect(component).toBeTruthy();
    });

    it('should test the addPatientDiagnosis function on error', () => {
        const payload = {
            system: 'ICD-10-WHO',
            code: 'J10',
            onset: '2025-10-04',
            name: 'Common Cold',
            note: 'note',
            status: 'FINAL',
        };

        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => new Error('fail'))
        );
        spyOn(component, 'showToast');

        component.addPatientDiagnosis(payload);

        expect(component.loadingResult).toBeFalse();
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should handle fetchPatientDiagnosis successfull response', () => {
        component.activeServiceRequest.encounter_id = undefined;
        component.toggleModal({ id: '1', name: 'heading' });

        const mockResponse = {
            id: '123',
            value: '22.5',
            timeRecorded: '2025-03-19T10:00:00Z',
            totalCount: 1,
            edges: [
                {
                    node: {
                        id: 12,
                        value: 30,
                        category: 'encounter-diagnosis',
                        code: 'J10',
                        onsetDate: '2025-10-04',
                        recordedDate: '2025-10-04',
                        name: 'Common Cold',
                        section: [
                            {
                                title: 'diagnosis',
                            },
                        ],
                    },
                },
            ],
        };

        spyOn(component.dataLayer, 'list').and.returnValue(of(mockResponse));

        component.fetchPatientDiagnosis();
        expect(component.loadingResult).toBe(false);
    });

    it('should handle fetchPatientDiagnosis successfull response when there are no edges', () => {
        component.activeServiceRequest.encounter_id = undefined;
        component.toggleModal({ id: '1', name: 'heading' });
        const mockResponse2 = {
            id: '123',
            value: '22.5',
            timeRecorded: '2025-03-19T10:00:00Z',
            totalCount: 1,
            edges: [],
        };
        spyOn(component.dataLayer, 'list').and.returnValue(of(mockResponse2));
        component.fetchPatientDiagnosis();
        expect(component.loadingResult).toBe(false);
    });

    it('should handle fetchPatientDiagnosis and resolve error response', () => {
        const mockErrorResponse = {
            error: {
                message: 'server error',
            },
            status: 500,
        };

        spyOn(component.dataLayer, 'list').and.returnValue(
            throwError(() => mockErrorResponse)
        );
        spyOn(component, 'showToastError');

        component.fetchPatientDiagnosis();

        expect(component.showToastError).toHaveBeenCalled();
    });

    it('should handle fetchPatientDiagnosis with diagnoses', () => {
        const mockResponse = {
            totalCount: 2,
            edges: [
                {
                    node: {
                        category: 'encounter-diagnosis',
                        code: 'J10',
                        name: 'Common Cold',
                        system: 'ICD10',
                        status: 'active',
                        note: 'test note',
                        recordedDate: '2023-01-01',
                        onsetDate: '2023-01-01',
                    },
                },
                {
                    node: {
                        category: 'encounter-diagnosis',
                        code: 'J11',
                        name: 'Flu',
                        system: 'ICD10',
                        status: 'active',
                        note: 'test note 2',
                        recordedDate: '2023-01-02',
                        onsetDate: '2023-01-02',
                    },
                },
            ],
        };

        spyOn(component.dataLayer, 'list').and.returnValue(of(mockResponse));

        component.fetchPatientDiagnosis();

        expect(component.patientDiagnosisCount).toBe(2);
        expect(component.diagnosisFormIsHidden).toBeTrue();

        expect(component.loadingResult).toBeFalse();
    });

    it('should show error when no active encounter is found', () => {
        component.activeServiceRequest = { encounter_id: undefined };

        spyOn(component, 'showToastError');

        const model = {
            diagnosis: {
                system: 'ICD-10-WHO',
                code: 'J10',
                name: 'Common Cold',
            },
        };

        component.addPatientDiagnosisItem(model);

        expect(component.showToastError).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Error',
            'No active encounter found'
        );
    });

    it('should set loadingResult to false when patient or encounter ID is missing', () => {
        component.patient = { clinical_id: null };
        component.activeServiceRequest = { encounter_id: null };

        component.ngOnInit();

        expect(component.loadingResult).toBeFalse();
    });

    it('should correctly select fewer fields from node', () => {
        const mockNode = {
            node: {
                code: 'J10',
                name: 'Common Cold',
                system: 'ICD10',
                status: 'active',
                note: 'test note',
                recordedDate: '2023-01-01',
                onsetDate: '2023-01-01',
            },
        };

        const result = component.selectFewerFields(mockNode);

        expect(result.code).toBe('J10');
        expect(result.name).toBe('Common Cold');
        expect(result.system).toBe('ICD10');
        expect(result.status).toBe('active');
        expect(result.note).toBe('test note');
        expect(result.recordedDate).toBe('2023-01-01');
        expect(result.onsetDate).toBe('2023-01-01');
    });

    it('should set diagnosisFormIsHidden to false when there are no encounter diagnoses', () => {
        const mockResponse = {
            totalCount: 1,
            edges: [
                {
                    node: {
                        category: 'some-other-category',
                        code: 'J10',
                        name: 'Common Cold',
                        system: 'ICD10',
                        status: 'active',
                        note: 'test note',
                        recordedDate: '2023-01-01',
                        onsetDate: '2023-01-01',
                    },
                },
            ],
        };

        spyOn(component.dataLayer, 'list').and.returnValue(of(mockResponse));

        component.fetchPatientDiagnosis();

        expect(component.patientDiagnosisCount).toBe(1);
        expect(component.diagnosisFormIsHidden).toBeFalse();
    });
});

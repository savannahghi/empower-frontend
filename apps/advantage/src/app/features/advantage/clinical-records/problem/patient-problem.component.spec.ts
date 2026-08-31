import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientProblemComponent } from './patient-problem.component';
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
import { throwError, of } from 'rxjs';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { VisitService } from '../../visits/visit.service';
import { AnalyticsService } from 'app/@core/utils';

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

class SilStoreServiceStub {
    create() {
        return of({ id: '234' });
    }
    list() {
        return of({});
    }
}

describe('PatientProblemComponent', () => {
    let component: PatientProblemComponent;
    let fixture: ComponentFixture<PatientProblemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            declarations: [PatientProblemComponent],
            imports: [mockPipe('translate')],
            providers: [
                { provide: VisitService, useValue: visitServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: SilStoresService, useClass: SilStoreServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientProblemComponent);
        component = fixture.componentInstance;
        component.patient = {
            clinical_id: 1,
        };
        component.activeServiceRequest = {
            encounter_id: 1,
        };
        fixture.detectChanges();
    });

    it('should test various simple methods', () => {
        component.emitToggleServicePointModal();
        component.toggleProblemFormDrawer();
        component.toggleModal({ id: 1, name: 'Problem' });
        component.togglePreviewProblemModal();
        component.togglePreviewProblemModal({ id: 1, name: 'Problem' });
        const model = {
            condition: {
                system: 'ICD-10-WHO',
                code: 'J10',
                name: 'Commone Cold',
            },
        };
        component.addPatientProblemItem(model);

        const data = {
            condition: {
                system: 'ICD-11-WHO',
                code: 'J10',
                name: 'Commone Cold',
            },
        };
        component.addPatientProblemItem(data);
        expect(component).toBeTruthy();
    });

    it('should test the addPatientProblemItem function', () => {
        const model = {
            condition: {
                code: 'A01',
                system: 'ICD-10-WHO',
                name: 'Test Problem',
            },
            status: 'active',
            onset_date: '2024-01-01',
            notes: 'test',
            severity: 'mild',
        };
        spyOn(component, 'fetchPatientProblem');

        component.addPatientProblemItem(model);
        expect(component.patientProblems).toBeDefined();
        expect(component.loadingResult).toBeFalse();
        expect(component.fetchPatientProblem).toHaveBeenCalled();
    });

    it('should test the addPatientProblemItem function on Error', () => {
        const model = {
            condition: {
                code: 'A01',
                system: 'ICD-10-WHO',
                name: 'Test Problem',
            },
            status: 'active',
            onset_date: '2024-01-01',
            notes: 'test',
            severity: 'mild',
        };
        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => new Error('fail'))
        );
        spyOn(component, 'showToast');

        component.addPatientProblemItem(model);
        expect(component.showToast).toHaveBeenCalled();
        expect(component.loadingResult).toBeFalse();
    });

    it('should handle fetchPatientProblem successfull response', () => {
        component.activeServiceRequest.encounter_id = undefined;
        component.toggleModal({ id: '1', name: 'heading' });

        const mockResponse = {
            id: '123',
            value: '22.5',
            timeRecorded: '2025-03-19T10:00:00Z',
            TotalCount: 1,
            Edges: [
                {
                    Node: {
                        id: 12,
                        value: 30,
                        category: 'problem-list-item',
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

        component.fetchPatientProblem();
        expect(component.loadingResult).toBe(false);
    });

    it('should handle fetchPatientProblem successfull response when there are no edges', () => {
        component.activeServiceRequest.encounter_id = undefined;
        component.toggleModal({ id: '1', name: 'heading' });
        const mockResponse2 = {
            id: '123',
            value: '22.5',
            timeRecorded: '2025-03-19T10:00:00Z',
            TotalCount: 1,
            Edges: [],
        };
        spyOn(component.dataLayer, 'list').and.returnValue(of(mockResponse2));
        component.fetchPatientProblem();
        expect(component.loadingResult).toBe(false);
    });

    it('should handle fetchPatientProblem and resolve error response', () => {
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

        component.fetchPatientProblem();

        expect(component.showToastError).toHaveBeenCalled();
    });

    it('should handle fetchPatientProblem with problems', () => {
        const mockResponse = {
            TotalCount: 2,
            Edges: [
                {
                    Node: {
                        category: 'problem-list-item',
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
                    Node: {
                        category: 'problem-list-item',
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

        component.fetchPatientProblem();

        expect(component.patientProblems.length).toBe(2);
        expect(component.patientProblems[0].code).toBe('J10');
        expect(component.patientProblems[1].code).toBe('J11');
        expect(component.dataLayer.list).toHaveBeenCalledWith('condition', {
            patient_id: 1,
            encounter_id: 1,
            limit: 10,
        });
    });

    it('should set loadingResult to false when patient or encounter ID is missing', () => {
        component.patient = { clinical_id: null };
        component.activeServiceRequest = { encounter_id: null };

        component.ngOnInit();

        expect(component.loadingResult).toBeFalse();
    });

    it('should not call API when encounter_id is missing in fetchPatientProblem', () => {
        component.patient = { clinical_id: 1 };
        component.activeServiceRequest = { encounter_id: undefined };

        spyOn(component.dataLayer, 'list');

        component.fetchPatientProblem();

        expect(component.dataLayer.list).not.toHaveBeenCalled();
        expect(component.loadingResult).toBeFalse();
    });

    it('should not call API when patient clinical_id is missing in fetchPatientProblem', () => {
        component.patient = { clinical_id: undefined };
        component.activeServiceRequest = { encounter_id: 1 };

        spyOn(component.dataLayer, 'list');

        component.fetchPatientProblem();

        expect(component.dataLayer.list).not.toHaveBeenCalled();
        expect(component.loadingResult).toBeFalse();
    });

    it('should correctly select fewer fields from node', () => {
        const mockNode = {
            Node: {
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
});

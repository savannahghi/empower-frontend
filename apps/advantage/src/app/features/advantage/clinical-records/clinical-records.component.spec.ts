import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { GetConditionListFromOcl } from '../../services/clinical-ocl.service';
import { ClinicalRecordsComponent } from './clinical-records.component';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { VisitService } from '../visits/visit.service';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { PatientService } from '../patients/patient.service';

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

const results = [
    {
        uuid: '3200504',
        id: '112141',
        display_name: 'Tuberculosis',
        source: 'CIEL',
    },
];
class mockGetConditionList {
    getCondition() {
        return of(results);
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    setUser() {
        return {
            client_types: ['PROVIDER'],
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

const visitServiceStub = {
    visitPatientDataEmitter: of({
        new_price: 18,
        amount: '18',
        product_name: 'Lipid',
        quantity: 1,
        id: 1,
    }),
    visitDataEmitter: of({
        id: '123232',
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
    sendToQueue: () => {},
    completeVisit: () => {},
    queuesDataEmitter: of([
        {
            id: 1,
        },
    ]),
    fetchVisit: () => {},
    addToQueue: () => {},
    setVisitData: () => {},
    visit: {
        id: 1,
    },
};

const uIRouterGlobalsStub = {
    params: {
        page_size: '2',
    },
    $current: {
        params: {
            page_size: '2',
        },
        parent: {
            name: 'app.advantage.visits',
        },
    },
    current: {
        name: 'app.advantage.visits.detail',
    },
};

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class SilStoresServiceStub {
    get() {
        return of({
            document_number: '1231',
            made_by: 'John',
            invoice_date: '2022-11-12T12:53:07.850000+03:00',
            amount: 20,
            customer: '5190ffca-9bd0-4d98-b9c9-9b0f62368f46',
            person: {
                age: { years: 55, months: 0, weeks: 0, days: 0 },
                phone_number: '0723856342',
            },
            results: [
                {
                    document_number: '1231',
                    made_by: 'John',
                    invoice_date: '2022-11-12T12:53:07.850000+03:00',
                    amount: 20,
                    customer: '5190ffca-9bd0-4d98-b9c9-9b0f62368f46',
                },
            ],
        });
    }

    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '2' }],
        });
    }

    update() {
        return of({
            id: '4ed62h7281262h1',
            results: [
                {
                    id: '23234930423',
                },
            ],
        });
    }

    createNested() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    list() {
        return of({
            results: {
                patient: {
                    age: { years: 55, months: 0, weeks: 0, days: 0 },
                    phone_number: '0723856342',
                    gender: 'Male',
                },
                person: {
                    age: { years: 55, months: 0, weeks: 0, days: 0 },
                    phone_number: '0723856342',
                },
                new_price: 18,
                amount: '18',
                product_name: 'Lipid',
                quantity: 1,
                id: 1,
            },
        });
    }
}

const stateServiceStub = {
    reset() {
        return true;
    },
    go() {
        return true;
    },
    includes() {
        return true;
    },
    transitionTo() {
        return true;
    },
    param() {
        return true;
    },
};

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class PatientServiceStub {
    patientVisitDataEmitter() {
        return of({
            id: '143224',
        });
    }
}

describe('ClinicalRecordsComponent', () => {
    let component: ClinicalRecordsComponent;
    let fixture: ComponentFixture<ClinicalRecordsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate'), mockPipe('featureFlag')],
            declarations: [ClinicalRecordsComponent],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: GetConditionListFromOcl,
                    useClass: mockGetConditionList,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useValue: stateServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(ClinicalRecordsComponent);
        component = fixture.componentInstance;
        component.visitObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            service_requests: [
                { active: true, service: 'one' },
                { active: false, service: 'two' },
            ],
        });
        component.togglePTDrawer();
        component.querySubscription = of({
            id: 1,
            results: [{ data: { id: 1 } }],
            data: { id: 1 },
        });
        fixture.detectChanges();
    });

    it('should test component functions', () => {
        component.patient.clinical_id = '84aksldlsfd894';
        component.toggleIsHidden('vitals');
        component.toggleIsHidden('generalExamination');
        component.toggleIsHidden('treatment');
        component.toggleModal('pulse');
        expect(component).toBeTruthy();
    });

    it('should test toggleServicePointModal function', () => {
        spyOn(component, 'toggleServicePointModal').and.callThrough();
        component.toggleServicePointModal();
        component.visit = { id: '245' };
        component.selectedQueue = { id: '2' };
        component.getFilteredResponse({ id: 1 });
        component.showServicePointModal = true;
        component.sendToQueue();
        component.getQueues();
        component.refetchClinicalIds();
        expect(component.toggleServicePointModal).toHaveBeenCalled();
    });

    it('should test getVisitInfo method', () => {
        spyOn(component, 'getVisitInfo').and.callThrough();
        component.getVisitInfo();
        component.checkIfEncounteIdNull({ status: 'WAITING' });
        expect(component.getVisitInfo).toHaveBeenCalled();
    });

    it('should test patient transition To InProgress service request status', () => {
        component.activeServiceRequest = {
            encounter_id: '23423423',
            status: 'WAITING',
            isClinical: true,
        };
        spyOn(component, 'transitionToInProgress').and.callThrough();
        component.transitionToInProgress(component.activeServiceRequest);
        expect(component.transitionToInProgress).toHaveBeenCalled();
    });

    it('should test oninit without facility id', () => {
        component.isClinicalIdsSaved = localStorage.setItem(
            'auth.config.clinicalIds',
            JSON.stringify({
                clinical_facility_id: null,
                clinical_org_id: '2348923403',
            })
        );
        component.checkClinicalIdsSaved();
        expect(component).toBeTruthy();
    });

    it('should call checkClinicalIdsSaved', () => {
        localStorage.setItem(
            'auth.config.clinicalIds',
            JSON.stringify({
                clinical_facility_id: null,
                clinical_org_id: '2348923403',
            })
        );
        spyOn(component, 'checkClinicalIdsSaved'); // Spy on the method
        component.ngOnInit(); // Assuming this function is called during component initialization
        component.checkClinicalIdsSaved();
        expect(component.checkClinicalIdsSaved).toHaveBeenCalled(); // Expect the method to have been called
    });
    it('should test oninit with clinical_facility_id and clinical_org_id', () => {
        localStorage.setItem(
            'auth.config.clinicalIds',
            JSON.stringify({
                clinical_facility_id: null,
                clinical_org_id: '2348923403',
            })
        );
        component.isClinicalIdsSaved = {
            clinical_facility_id: '2348923403',
            clinical_org_id: '2348923403',
        };
        component.patient.clinical_id = 'ew9343234';
        component.checkClinicalIdsSaved();
        expect(component).toBeTruthy();
    });

    it('should test oninit without clinical ids', () => {
        localStorage.setItem('auth.config.clinicalIds', null);
        component.isClinicalIdsSaved = localStorage.setItem(
            'auth.config.clinicalIds',
            null
        );
        component.ngOnInit();
        component.isClinicalIdsSaved = null;
        component.isClinicalIdsSaved?.clinical_facility_id === 'null';
        component.isClinicalIdsSaved?.clinical_org_id === 'null';
        component.checkClinicalIdsSaved();
        component.refetchClinicalIds();
        expect(component).toBeTruthy();
    });

    it('should test the toggleAISummaryDrawer function', () => {
        component.showAISummaryDrawer = true;
        component.toggleAISummaryDrawer();
        expect(component.showAISummaryDrawer).toBeFalse();
    });
});

class SilStoresServiceStubError {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

const visitServiceErrorStub = {
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
    sendToQueue: () => {},
    completeVisit: () => {},
    queuesDataEmitter: of([
        {
            id: 1,
        },
    ]),
    fetchVisit: () => {},
    setVisitData: () => {},
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

describe('ClinicalRecordsComponent: visit data does not resolve', () => {
    let component: ClinicalRecordsComponent;
    let fixture: ComponentFixture<ClinicalRecordsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('featureFlag'), mockPipe('translate')],
            declarations: [ClinicalRecordsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useValue: stateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: VisitService,
                    useValue: visitServiceErrorStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
        fixture = TestBed.createComponent(ClinicalRecordsComponent);
        component = fixture.componentInstance;
        component.visit = '';
        component.selectedQueue = {};
        component.visitObservable = throwError(() => new Error('server error'));
        component.querySubscription = throwError(() => 'server error');
        fixture.detectChanges();
    });

    it('should test getVisitInfo method error', () => {
        spyOn(component, 'getVisitInfo').and.callThrough();
        component.getVisitInfo();
        component.getQueues();
        component.checkIfEncounteIdNull({ status: 'WAITING' });
        component.sendToQueue();
        expect(component.getVisitInfo).toHaveBeenCalled();
    });
});

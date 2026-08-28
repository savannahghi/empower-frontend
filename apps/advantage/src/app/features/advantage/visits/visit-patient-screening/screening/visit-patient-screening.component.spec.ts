import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitPatientScreeningComponent } from './visit-patient-screening.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { VisitService } from '../../visit.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';

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
        servicePoints: [
            {
                encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                queue_name: 'Breast Cancer Screening',
                status: 'COMPLETED',
                previous_point: 'Triage',
            },
            {
                encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                queue_name: 'Cervical Cancer Screening',
                status: 'IN_PROGRESS',
                previous_point: 'Billing',
            },
        ],
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

class NbToastrServiceStub {
    show() {
        return {};
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
                new_price: 18,
                amount: '18',
                product_name: 'Lipid',
                quantity: 1,
                id: 1,
            },
        });
    }
}
class SilStoresServiceStubError {
    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
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
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    getOrgSettings() {
        return [
            {
                id: '260bb4db-59b7-4f93-b2fd-fe88d3af21a3',
                default: 'APPOINTMENT BOOKING',
                description:
                    'Select the preferred patient scheduling method to use',
                setting_type: 'str',
                name: 'scheduling:preferred_patient_scheduling_method',
                value: 'CHECK-IN SCHEDULING',
            },
        ];
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
    transitionTo() {
        return true;
    }
    includes() {
        return true;
    }
}

describe('VisitPatientScreeningComponent', () => {
    let component: VisitPatientScreeningComponent;
    let fixture: ComponentFixture<VisitPatientScreeningComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [VisitPatientScreeningComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: VisitService, useValue: visitServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });
        fixture = TestBed.createComponent(VisitPatientScreeningComponent);
        component = fixture.componentInstance;

        component.visitObservable = of({
            id: 1,
            person: {
                gender: 'MALE',
                age: {
                    years: 30,
                },
            },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 50,
                        invoice_lines: [{}],
                    },
                },
            ],
        });

        component.screeningMappings = [
            {
                name: 'Cervical',
                encounterId: '',
                showFor: 'FEMALE',
            },
            {
                name: 'Breast',
                encounterId: '',
                showFor: 'ALL',
            },
            {
                name: 'Prostate',
                encounterId: '',
                showFor: 'MALE',
            },
        ];

        component.queues = [
            { id: 1, name: 'Cervical Cancer Screening', active_visits: [] },
            { id: 2, name: 'Breast Cancer Screening', active_visits: [] },
        ];
        fixture.detectChanges();
    });

    it('should test getServicePointDetails function', () => {
        const servicePoints = [
            {
                encounterID: 'ff8850da-090a-4f80-9aab-6bc581c472ea',
                queue_name: 'Cervical Cancer Screening',
                status: 'IN_PROGRESS',
                previous_point: null,
            },
        ];
        spyOn(component, 'getServicePointDetails').and.callThrough();
        component.getServicePointDetails(servicePoints, 'MALE');
        expect(component.getServicePointDetails).toHaveBeenCalled();
    });

    it('should test getServicePointDetails function if default Cancer Screening service point exists', () => {
        const servicePoints = [
            {
                encounterID: 'mm8850da-090a-4f80-9aab-6bc581c472ea',
                queue_name: 'Cancer Screening',
                status: 'IN_PROGRESS',
                previous_point: null,
            },
        ];
        spyOn(component, 'getServicePointDetails').and.callThrough();
        component.getServicePointDetails(servicePoints, 'MALE');
        expect(component.getServicePointDetails).toHaveBeenCalled();
    });

    it('should navigate to start visit page when "Start Visit" button is clicked', () => {
        component.isLoading = false;
        component.patientData = { patient_id: 'patient-abc-123' };
        component.cancerScreenings = [];

        spyOn(component, 'startNewVisit').and.callThrough();

        const stateService = TestBed.inject(StateService);
        spyOn(stateService, 'go').and.callThrough();

        fixture.detectChanges();

        const buttonElement: HTMLButtonElement =
            fixture.nativeElement.querySelector(
                'button[nbButton][status="primary"]'
            );

        expect(buttonElement).not.toBeNull(
            'The "Start Visit" button should be present in the DOM.'
        );
        expect(buttonElement.textContent).toContain('Start Visit');

        buttonElement.click();
        fixture.detectChanges();

        expect(component.startNewVisit).toHaveBeenCalled();
        expect(stateService.go).toHaveBeenCalledWith(
            'app.advantage.visits.start_visit',
            { id: 'patient-abc-123' }
        );
    });
});

describe('VisitPatientScreeningComponent: visit data does not resolve', () => {
    let component: VisitPatientScreeningComponent;
    let fixture: ComponentFixture<VisitPatientScreeningComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [VisitPatientScreeningComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: VisitService, useValue: visitServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });
        fixture = TestBed.createComponent(VisitPatientScreeningComponent);
        component = fixture.componentInstance;
        component.queues = [
            { id: 1, name: 'Cervical Cancer Screening', active_visits: [] },
            { id: 2, name: 'Breast Cancer Screening', active_visits: [] },
        ];
        component.screeningMappings = [
            {
                name: 'Cervical',
                encounterId: '',
                showFor: 'FEMALE',
            },
            {
                name: 'Breast',
                encounterId: '',
                showFor: 'ALL',
            },
            {
                name: 'Prostate',
                encounterId: '',
                showFor: 'MALE',
            },
        ];
        component.selectedQueue = { id: 1 };
        component.visitObservable = throwError(() => new Error('error'));
        fixture.detectChanges();
    });

    it('should test error part of observables', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.patientData = {
            gender: 'FEMALE',
            age: 66,
            visit_status: 'IN PROGRESS',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Breast Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
                {
                    encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'IN_PROGRESS',
                    previous_point: 'Billing',
                },
            ],
        };
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});

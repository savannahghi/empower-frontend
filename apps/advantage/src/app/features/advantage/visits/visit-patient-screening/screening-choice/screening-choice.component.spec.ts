import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';

import { ScreeningChoiceComponent } from './screening-choice.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { VisitService } from '../../visit.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { StateService } from '@uirouter/angular';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

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

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('ScreeningChoiceComponent', () => {
    let component: ScreeningChoiceComponent;
    let fixture: ComponentFixture<ScreeningChoiceComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ScreeningChoiceComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: VisitService, useValue: visitServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
        fixture = TestBed.createComponent(ScreeningChoiceComponent);
        component = fixture.componentInstance;
        component.textMaps = {
            PENDING: 'is pending',
            WAITING: 'is pending',
            IN_PROGRESS: 'is in progress',
            COMPLETED: 'has been done',
            ON_HOLD: 'is on hold',
            REVOKED: 'has been revoked',
        };
        component.defaultStyle = {
            fill1: '#F5F6F7',
            fill2: '#F0F0F0',
            fill3: '#E0E0E0',
            fillOpacity1: '0.5',
            fillOpacity2: '1',
        };
        component.activeStyle = {
            fill1: '#F4EBF4',
            fill2: '#8C3B8C',
            fill3: '#8C3B8C',
            fillOpacity1: '1',
            fillOpacity2: '0.3',
        };
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

        component.queues = [
            { id: 1, name: 'Cervical Cancer Screening', active_visits: [] },
            { id: 2, name: 'Breast Cancer Screening', active_visits: [] },
        ];
        fixture.detectChanges();
    });

    it('tests the setScreeningOption function if screening option is Cervical and age is > 64', () => {
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
        spyOn(component, 'setScreeningOption').and.callThrough();
        spyOn(component, 'checkEncounter').and.callThrough();

        component.setScreeningOption('CERVICAL');
        expect(component.setScreeningOption).toHaveBeenCalledWith('CERVICAL');
        expect(component.checkEncounter).toHaveBeenCalledWith();
    });

    it('tests the setScreeningOption function if screening option is Breast', () => {
        component.patientData = {
            gender: 'FEMALE',
            age: 66,
            visit_status: 'IN PROGRESS',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
            ],
        };
        spyOn(component, 'setScreeningOption').and.callThrough();
        spyOn(component, 'checkEncounter').and.callThrough();

        component.setScreeningOption('BREAST');
        expect(component.setScreeningOption).toHaveBeenCalledWith('BREAST');
        expect(component.checkEncounter).toHaveBeenCalledWith();
    });

    it('should test the checkScreeningStatus function', () => {
        const servicePoints = [
            {
                encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                queue_name: 'Cervical Cancer Screening',
                status: 'COMPLETED',
                previous_point: 'Triage',
            },
            {
                encounterID: 'd9b81873-00bf-469e-8f8a-1f74388903b1',
                queue_name: 'Breast Cancer Screening',
                status: 'IN_PROGRESS',
                previous_point: 'Triage',
            },
        ];

        component.screeningStatuses = {
            Breast: '',
            Cervical: '',
            Prostate: '',
        };
        spyOn(component, 'checkScreeningStatus').and.callThrough();
        component.checkScreeningStatus(servicePoints);
        expect(component.checkScreeningStatus).toHaveBeenCalled();
        expect(component.screeningStatuses.Breast).toBe(
            'Breast Cancer Screening is in progress'
        );
        expect(component.screeningStatuses.Cervical).toBe(
            'Cervical Cancer Screening has been done'
        );
    });

    it('tests the setScreeningOption function if screening option is Breast but encounter is undefined', () => {
        component.patientData = {
            gender: 'FEMALE',
            age: 66,
            visit_status: 'IN PROGRESS',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
            ],
        };
        spyOn(component, 'setScreeningOption').and.callThrough();
        spyOn(component, 'checkEncounter').and.callThrough();

        component.setScreeningOption('BREAST');
        expect(component.setScreeningOption).toHaveBeenCalledWith('BREAST');
        expect(component.checkEncounter).toHaveBeenCalled();
    });

    it('should test setInitialScreeningOption when screening status exists', () => {
        component.patientData = {
            gender: 'FEMALE',
            age: 36,
            visit_status: 'IN PROGRESS',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Breast Cancer Screening',
                    status: 'IN_PROGRESS',
                    previous_point: 'Triage',
                },
            ],
        };

        component.screeningStatuses = {
            Breast: 'Breast Cancer Screening is in progress',
            Cervical: '',
            Prostate: '',
        };

        spyOn(component, 'setInitialScreeningOption').and.callThrough();
        spyOn(component, 'checkEncounter').and.callThrough();

        component.setInitialScreeningOption();

        expect(component.setInitialScreeningOption).toHaveBeenCalled();
        expect(component.screeningOption).toBe('BREAST');
        expect(component.checkEncounter).toHaveBeenCalled();
    });

    it('tests the setScreeningOption function if visit is Cancelled', () => {
        component.patientData = {
            gender: 'FEMALE',
            age: 36,
            visit_status: 'CANCELLED',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
            ],
        };
        spyOn(component, 'setScreeningOption').and.callThrough();
        spyOn(component, 'checkEncounter').and.callThrough();

        component.setScreeningOption('CERVICAL');
        expect(component.setScreeningOption).toHaveBeenCalledWith('CERVICAL');
        expect(component.checkEncounter).toHaveBeenCalled();
    });

    it('tests the setColor function for active states', () => {
        spyOn(component, 'setColor').and.callThrough();
        component.setColor(true, 'fill1');
        expect(component.setColor).toHaveBeenCalledWith(true, 'fill1');
    });

    it('tests the setColor function for default states', () => {
        spyOn(component, 'setColor').and.callThrough();
        component.setColor(false, 'fill1');
        expect(component.setColor).toHaveBeenCalledWith(false, 'fill1');
    });

    it('tests the navigateToScreening function', fakeAsync(() => {
        spyOn(component, 'navigateToScreening').and.callThrough();
        component.patientData = {
            gender: 'FEMALE',
            age: 36,
            visit_status: 'CANCELLED',
            visit_id: '8',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Breast Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
            ],
        };
        component.screeningOption = 'CERVICAL';
        component.queues = [
            { id: 1, name: 'Cervical Cancer Screening', active_visits: [] },
        ];
        component.selectedQueue = { id: 1 };

        component.navigateToScreening();

        tick(3200);
        expect(component.navigateToScreening).toHaveBeenCalled();
    }));

    it('tests the navigateToScreening function if service Point exists', fakeAsync(() => {
        spyOn(component, 'navigateToScreening').and.callThrough();
        component.patientData = {
            gender: 'FEMALE',
            age: 36,
            visit_status: 'CANCELLED',
            visit_id: '8',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Breast Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
            ],
        };
        component.screeningOption = 'BREAST';
        component.queues = [
            { id: 1, name: 'Cervical Cancer Screening', active_visits: [] },
        ];
        component.selectedQueue = { id: 1 };

        component.navigateToScreening();
        tick(3200);
        expect(component.navigateToScreening).toHaveBeenCalled();
    }));
});

describe('ScreeningChoiceComponent: visit data does not resolve', () => {
    let component: ScreeningChoiceComponent;
    let fixture: ComponentFixture<ScreeningChoiceComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ScreeningChoiceComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: VisitService, useValue: visitServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });
        fixture = TestBed.createComponent(ScreeningChoiceComponent);
        component = fixture.componentInstance;
        component.queues = [
            { id: 1, name: 'Cervical Cancer Screening', active_visits: [] },
            { id: 2, name: 'Breast Cancer Screening', active_visits: [] },
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

    it('tests the navigateToScreening function if visit update function fails', () => {
        spyOn(component, 'navigateToScreening').and.callThrough();
        component.patientData = {
            gender: 'FEMALE',
            age: 36,
            visit_status: 'CANCELLED',
            visit_id: '8',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Breast Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
            ],
        };
        component.screeningOption = 'CERVICAL';
        component.queues = [
            { id: 1, name: 'Cervical Cancer Screening', active_visits: [] },
        ];
        component.selectedQueue = { id: 1 };

        component.navigateToScreening();

        expect(component.navigateToScreening).toHaveBeenCalled();
    });
});

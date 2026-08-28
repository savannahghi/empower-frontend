import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from '@angular/core/testing';

import { ExamDiagnosisComponent } from './exam-diagnosis.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { VisitService } from '../../../visit.service';
import { Authorization } from '../../../../../../@core/auth/services/authorization.service';
import { ErrorHandlerService } from '../../../../../../shared/sil-http-services/error-handler';
import { NbToastrService } from '@nebular/theme';
import { SilStoresService } from '../../../../../../shared/sil-http-services/sil_datalayer.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
class ErrorHandlerStub {
    handleError() {}
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
    error() {
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
        });
    }

    createNested() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    list() {
        return of({
            results: [
                {
                    id: 1,
                    name: 'Pharmacy',
                    type: 'PHARMACY',
                    active_visits: [],
                },
            ],
        });
    }
}
class SilStoresServiceStubError {
    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
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
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
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
    addToQueue: () => {},
    setVisitData: () => {},
    visit: {
        id: 1,
        service_requests: [
            {
                queue_type: 'PHARMACY',
                invoice: {
                    amount_due: 100,
                    amount_paid: 100,
                    invoice_lines: [{ id: 1 }],
                },
            },
        ],
    },
};

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

class AuthorizationConfigStub {
    logout() {
        return of(() => {});
    }
    getToken() {
        return {};
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            organisation_id: '511',
        };
    }
    getUser() {
        return { business_partner: '511' };
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('ExamDiagnosisComponent', () => {
    let component: ExamDiagnosisComponent;
    let fixture: ComponentFixture<ExamDiagnosisComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExamDiagnosisComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: ErrorHandlerService, useClass: ErrorHandlerStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ExamDiagnosisComponent);
        component = fixture.componentInstance;
        component.visitObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 50,
                        invoice_lines: [{}],
                    },
                    encounter_id: '7742',
                    queue: '82742',
                },
            ],
        });
        component.QUEUECONSTANTS = {
            test: {
                queueName: 'Laboratory',
                serviceRequestType: 'LAB',
            },
            medication: {
                queueName: 'Pharmacy',
                serviceRequestType: 'PHARMACY',
            },
        };
        fixture.detectChanges();
    });

    it('should toggle the value of the specified context in the toggle object', () => {
        const context = 'add-medication-drawer';
        spyOn(component, 'toggleDrawer').and.callThrough();
        component.toggleDrawer(context);
        expect(component.toggle[context]).toBeTrue();
    });

    it('tests the addItem function', fakeAsync(() => {
        spyOn(component, 'addItem').and.callThrough();
        component.visitPayload = {
            patientId: 1,
        };
        component.visit = {
            service_requests: [
                {
                    queue_type: 'PHARMACY',
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };
        component.queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];

        component.addItem('medication');

        tick(3200);
        expect(component.addItem).toHaveBeenCalled();
    }));

    it('tests the addItem function if service Point exists', fakeAsync(() => {
        spyOn(component, 'addItem').and.callThrough();
        component.visitPayload = {};
        component.queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];

        component.addItem('medication');
        tick(3200);
        expect(component.addItem).toHaveBeenCalled();
    }));

    it('should test the getServiceRequest function', () => {
        const visit = {
            service_requests: [
                {
                    queue_type: 'PHARMACY',
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };
        spyOn(component, 'getServiceRequest').and.callThrough();
        component.getServiceRequest(visit, 'test');
        expect(component.getServiceRequest).toHaveBeenCalled();
    });

    it('should test the data fetching functions', () => {
        spyOn(component, 'receiveDiagnosisData').and.callThrough();
        spyOn(component, 'fetchQueue').and.callThrough();
        spyOn(component, 'fetchDiagnosesDetails').and.callThrough();

        component.fetchDiagnosesDetails();
        component.fetchQueue('Pharmacy', 'medication');
        component.receiveDiagnosisData({});
        expect(component.receiveDiagnosisData).toHaveBeenCalled();
        expect(component.fetchQueue).toHaveBeenCalled();
        expect(component.fetchDiagnosesDetails).toHaveBeenCalled();
    });

    it('should test the processAction function', () => {
        spyOn(component, 'processAction').and.callThrough();
        component.queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];

        component.processAction('224', 'add-test-drawer');
        expect(component.processAction).toHaveBeenCalled();
    });

    it('should test the addServiceRequest function', fakeAsync(() => {
        spyOn(component, 'addServiceRequest').and.callThrough();
        const queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];
        component.visit = {
            service_requests: [
                {
                    queue_type: 'PHARMACY',
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };

        component.addServiceRequest(
            queues,
            'medication',
            'add-medication-drawer'
        );

        flush();

        expect(component.addServiceRequest).toHaveBeenCalled();
    }));

    it('tests the addItem function if service Point exists', fakeAsync(() => {
        spyOn(component, 'addServiceRequest').and.callThrough();
        component.visit = {
            service_requests: [
                {
                    queue_type: 'PHARMACY',
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };
        const queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];

        spyOn(component, 'getServiceRequest').and.returnValue({
            id: 1,
            queue_type: 'PHARMACY',
        });

        component.addServiceRequest(
            queues,
            'medication',
            'add-medication-drawer'
        );
        tick(3200);
        expect(component.addServiceRequest).toHaveBeenCalled();
    }));

    it('should test the addServiceRequest function', fakeAsync(() => {
        spyOn(component, 'addServiceRequest').and.callThrough();
        const queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];
        component.visit = {
            service_requests: [
                {
                    queue_type: 'PHARMACY',
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };

        component.addServiceRequest(queues, 'test', 'add-test-drawer');

        flush();

        expect(component.addServiceRequest).toHaveBeenCalled();
    }));
});

describe('ExamDiagnosisComponent fails', () => {
    let component: ExamDiagnosisComponent;
    let fixture: ComponentFixture<ExamDiagnosisComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExamDiagnosisComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: ErrorHandlerService, useClass: ErrorHandlerStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExamDiagnosisComponent);
        component = fixture.componentInstance;
        component.QUEUECONSTANTS = {
            test: {
                queueName: 'Laboratory',
                serviceRequestType: 'LAB',
            },
            medication: {
                queueName: 'Pharmacy',
                serviceRequestType: 'PHARMACY',
            },
        };
        component.visitObservable = throwError(() => new Error('error'));

        fixture.detectChanges();
    });

    it('tests the addItem function if visit update function fails', () => {
        spyOn(component, 'addItem').and.callThrough();
        component.visitPayload = {};
        component.queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];

        component.addItem('test');

        expect(component.addItem).toHaveBeenCalled();
    });

    it('tests the addTest function if visit update function fails', () => {
        spyOn(component, 'addItem').and.callThrough();
        component.visitPayload = {};
        component.queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];

        component.addItem('test');

        expect(component.addItem).toHaveBeenCalled();
    });

    it('should test the addServiceRequest function', fakeAsync(() => {
        spyOn(component, 'addServiceRequest').and.callThrough();
        const queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];

        component.addServiceRequest(
            queues,
            'medication',
            'add-medication-drawer'
        );

        flush();

        expect(component.addServiceRequest).toHaveBeenCalled();
    }));

    it('should test the fetchQueue function', () => {
        spyOn(component, 'fetchQueue').and.callThrough();

        component.fetchQueue('Pharmacy', 'medication');
        expect(component.fetchQueue).toHaveBeenCalled();
    });

    it('should test the errorhandler function', () => {
        spyOn(component, 'errorHandlerFxn').and.callThrough();
        component.fetchDiagnosesDetails();
        component.errorHandlerFxn({});
        expect(component.errorHandlerFxn).toHaveBeenCalled();
    });
});

const uIRouterGlobalsStub2 = {
    current: {
        name: 'app.advantage.queues.worklist',
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

describe('ExamDiagnosisComponent Service Request', () => {
    let component: ExamDiagnosisComponent;
    let fixture: ComponentFixture<ExamDiagnosisComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExamDiagnosisComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: ErrorHandlerService, useClass: ErrorHandlerStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(ExamDiagnosisComponent);
        component = fixture.componentInstance;
        spyOn(component.uiglobals.current.name, 'includes').and.returnValue(
            true
        );
        component.visitObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 50,
                        invoice_lines: [{}],
                    },
                    encounter_id: '7742',
                    queue: '82742',
                },
            ],
        });
        component.QUEUECONSTANTS = {
            test: {
                queueName: 'Laboratory',
                serviceRequestType: 'LAB',
            },
            medication: {
                queueName: 'Pharmacy',
                serviceRequestType: 'PHARMACY',
            },
        };
        fixture.detectChanges();
    });

    it('should test the addServiceRequest function', fakeAsync(() => {
        spyOn(component, 'addServiceRequest').and.callThrough();
        const queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];

        component.addServiceRequest(
            queues,
            'medication',
            'add-medication-drawer'
        );
        tick(800);
        flush();

        expect(component.addServiceRequest).toHaveBeenCalled();
    }));

    it('should test the addServiceRequest function', fakeAsync(() => {
        spyOn(component, 'addServiceRequest').and.callThrough();
        const queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];
        component.visit = {
            service_requests: [
                {
                    queue_type: 'PHARMACY',
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };

        component.addServiceRequest(
            queues,
            'medication',
            'add-medication-drawer'
        );

        tick(800);
        flush();

        expect(component.addServiceRequest).toHaveBeenCalled();
    }));
});

class SilStoresServiceStubNoResponse {
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
        return of(undefined);
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
            results: [
                {
                    id: 1,
                    name: 'Pharmacy',
                    type: 'PHARMACY',
                    active_visits: [],
                },
            ],
        });
    }
}

describe('ExamDiagnosisComponent Service Request no response', () => {
    let component: ExamDiagnosisComponent;
    let fixture: ComponentFixture<ExamDiagnosisComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExamDiagnosisComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: ErrorHandlerService, useClass: ErrorHandlerStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubNoResponse,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(ExamDiagnosisComponent);
        component = fixture.componentInstance;
        spyOn(component.uiglobals.current.name, 'includes').and.returnValue(
            true
        );
        component.visitObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 50,
                        invoice_lines: [{}],
                    },
                    encounter_id: '7742',
                    queue: '82742',
                },
            ],
        });
        component.QUEUECONSTANTS = {
            test: {
                queueName: 'Laboratory',
                serviceRequestType: 'LAB',
            },
            medication: {
                queueName: 'Pharmacy',
                serviceRequestType: 'PHARMACY',
            },
        };
        fixture.detectChanges();
    });

    it('should test the addServiceRequest function', fakeAsync(() => {
        spyOn(component, 'addServiceRequest').and.callThrough();
        const queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];

        component.addServiceRequest(
            queues,
            'medication',
            'add-medication-drawer'
        );
        tick(800);
        flush();

        expect(component.addServiceRequest).toHaveBeenCalled();
    }));

    it('should test the addServiceRequest function', fakeAsync(() => {
        spyOn(component, 'addServiceRequest').and.callThrough();
        const queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];
        component.visit = {
            service_requests: [
                {
                    queue_type: 'PHARMACY',
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };

        component.addServiceRequest(
            queues,
            'medication',
            'add-medication-drawer'
        );

        tick(800);
        flush();

        expect(component.addServiceRequest).toHaveBeenCalled();
    }));
});

describe('ExamDiagnosisComponent Service Request fails', () => {
    let component: ExamDiagnosisComponent;
    let fixture: ComponentFixture<ExamDiagnosisComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExamDiagnosisComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: ErrorHandlerService, useClass: ErrorHandlerStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExamDiagnosisComponent);
        component = fixture.componentInstance;
        component.QUEUECONSTANTS = {
            test: {
                queueName: 'Laboratory',
                serviceRequestType: 'LAB',
            },
            medication: {
                queueName: 'Pharmacy',
                serviceRequestType: 'PHARMACY',
            },
        };
        component.visitObservable = throwError(() => new Error('error'));
        spyOn(component.uiglobals.current.name, 'includes').and.returnValue(
            true
        );
        fixture.detectChanges();
    });

    it('should test the addServiceRequest function', fakeAsync(() => {
        spyOn(component, 'addServiceRequest').and.callThrough();
        const queues = [
            { id: 1, name: 'Pharmacy', type: 'PHARMACY', active_visits: [] },
        ];
        component.visit = {
            service_requests: [
                {
                    queue_type: 'PHARMACY',
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };

        component.addServiceRequest(
            queues,
            'medication',
            'add-medication-drawer'
        );

        tick(800);
        flush();

        expect(component.addServiceRequest).toHaveBeenCalled();
    }));
});

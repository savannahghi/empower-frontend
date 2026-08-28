import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
    SimpleChange,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { VisitBillingComponent } from './visit-billing.component';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
import { FeatureFlagService } from 'app/@core/utils/feature.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { VisitService } from '../visit.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

const uIRouterGlobalsStub = {
    params: {
        page_size: '2',
    },
    $current: {
        params: {
            page_size: '2',
            cancer_type: 'breast',
            patient_id: '1145',
            encounter_id: '32409',
        },
        parent: {
            name: 'app.advantage.visits',
        },
    },
    current: {
        name: 'app.advantage.visits.detail',
    },
};

class AuthenticationStub {
    checkPermission() {
        return true;
    }
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

class AuthorizationStub {
    getOrganisation() {
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
    getWorkstation() {
        return {
            workstation__name: 'Screening',
            workstation__workstation_type: 'screening',
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

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    reload() {
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

    downloadDocument() {
        return of({ response: {} });
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
class NbToastrServiceStub {
    show() {
        return {};
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class FeatureFlagServiceStub {
    isFeatureOn() {
        return true;
    }
}

const visitServiceStub = {
    visitPatientDataEmitter: of({
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
    }),
    printEntireInvoice() {},
    visitDataEmitter: of({
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

describe('VisitBillingComponent: parent state', () => {
    let component: VisitBillingComponent;
    let fixture: ComponentFixture<VisitBillingComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                BrowserAnimationsModule,
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('orderBy'),
                mockPipe('visitAmountDue'),
                mockPipe('statusColor'),
                mockPipe('statusDescription'),
                mockPipe('replaceWith'),
                mockPipe('featureFlag'),
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                mockPipe('healthIdFormatter'),
                mockPipe('variant'),
                mockPipe('silCurrency'),
            ],
            declarations: [VisitBillingComponent],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: TranslateService, useValue: TranslateServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitBillingComponent);
        component = fixture.componentInstance;
        component.serviceRequest = {
            invoice: {
                amount_paid: 100,
                amount_due: 10,
                invoice_lines: [
                    {
                        id: 1,
                    },
                ],
            },
        };
        const visit = {
            id: 1,
            service_requests: [
                {
                    id: '2',
                    invoice: {
                        amount_paid: 100,
                        amount_due: 10,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };
        component.visitService.visit = visit;
        fixture.detectChanges();
    });

    it('should test invoice methods', () => {
        spyOn(component, 'checkIfInvoiceLinesPresent').and.callThrough();
        const visit = {
            id: 1,
            service_requests: [
                {
                    id: '2',
                    queue: 'queue1',
                    invoice: {
                        amount_paid: 100,
                        amount_due: 10,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };
        component.visit = visit;
        const serviceRequest = {
            invoice: {
                invoice_lines: [{ id: 1 }],
            },
        };
        component.addedPayment();
        component.filterServiceRequest(true);
        component.checkIfInvoiceLinesPresent(visit);
        component.checInvoiceLength(serviceRequest);
        expect(component.checkIfInvoiceLinesPresent).toHaveBeenCalled();
        expect(component.showPrintEntireInvoiceOrReceipt).toBe(true);
    });

    it('should show print invoice button when any invoice lines are present', () => {
        const visit = {
            id: 1,
            service_requests: [
                {
                    id: '1',
                    queue: 'queue1',
                    invoice: {
                        amount_paid: 100,
                        amount_due: 10,
                        invoice_lines: [{ id: 1 }],
                    },
                },
                {
                    id: '2',
                    queue: 'queue2',
                    invoice: {
                        amount_paid: 200,
                        amount_due: 20,
                        invoice_lines: [{ id: 2 }],
                    },
                },
            ],
        };

        component.checkIfInvoiceLinesPresent(visit);
        expect(component.showPrintEntireInvoiceOrReceipt).toBe(true);
    });

    it('should show print invoice button for single service point with invoice lines', () => {
        const visit = {
            id: 1,
            service_requests: [
                {
                    id: '1',
                    queue: 'queue1',
                    invoice: {
                        amount_paid: 50,
                        amount_due: 10,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };

        component.checkIfInvoiceLinesPresent(visit);
        expect(component.showPrintEntireInvoiceOrReceipt).toBe(true);
    });

    it('should hide print invoice button when no invoice lines are present', () => {
        const visit = {
            id: 1,
            service_requests: [
                {
                    id: '1',
                    queue: 'queue1',
                    invoice: {
                        amount_paid: 100,
                        amount_due: 10,
                        invoice_lines: [],
                    },
                },
            ],
        };

        component.checkIfInvoiceLinesPresent(visit);
        expect(component.showPrintEntireInvoiceOrReceipt).toBe(false);
    });
});

const uIRouterGlobalsStub2 = {
    params: {
        page_size: '2',
        cancer_type: 'breast',
        patient_id: '1145',
    },
    $current: {
        params: {
            page_size: '2',
        },
        parent: 'app.advantage.visits.detail',
    },
    current: {
        name: 'app.advantage.visits.detail.billing',
    },
};

class BaseAuthorizationStub {
    getOrganisation() {
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

class AuthorizationStubTwo extends BaseAuthorizationStub {
    getWorkstation() {
        return {
            workstation__name: 'Consultation',
            workstation__workstation_type: 'consultation',
        };
    }
}

describe('VisitBillingComponent: child state', () => {
    let component: VisitBillingComponent;
    let fixture: ComponentFixture<VisitBillingComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('orderBy'),
                mockPipe('visitAmountDue'),
                mockPipe('statusColor'),
                mockPipe('statusDescription'),
                mockPipe('replaceWith'),
                mockPipe('featureFlag'),
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                mockPipe('healthIdFormatter'),
                mockPipe('variant'),
                mockPipe('silCurrency'),
            ],
            declarations: [VisitBillingComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStubTwo },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: TranslateService, useValue: TranslateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitBillingComponent);
        component = fixture.componentInstance;
        const visit = {
            id: 1,
            service_requests: [
                {
                    id: '2',
                    invoice: {
                        amount_paid: 100,
                        amount_due: 10,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
        };
        component.visitService.visit = visit;
        component.serviceRequest = {
            invoice: {
                amount_paid: 100,
                amount_due: 10,
                invoice_lines: [
                    {
                        id: 1,
                    },
                ],
            },
        };
        fixture.detectChanges();
    });

    it('should test showToast', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('position', 'status', 'msg', 'mesage');
        component.serviceRequestFromQueue = [{ id: 1 }];
        spyOn(component.$state, 'transitionTo');
        component.visitService.visitDataEmitter = new Subject();
        component.isVisit = false;
        const visit = {
            service_requests: [
                {
                    invoice: {
                        id: 1,
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [
                            {
                                amount: 100,
                                id: 1,
                            },
                        ],
                    },
                },
                {
                    invoice: {
                        id: 2,
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [
                            {
                                amount: 100,
                                id: 1,
                            },
                        ],
                    },
                },
            ],
        };
        component.visitService.visit = visit;
        component.visitObservable();
        component.serviceRequestFromQueue = [{ id: 1, name: 'test name' }];
        component.visitService.visitDataEmitter.next(visit);
        component.handleQueueTransition(visit);
        component.toggleModal('service_point');
        component.toggleModal('pay_full_amount');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the addPayment', () => {
        const visit = {
            service_requests: [
                {
                    invoice: {
                        id: 1,
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [
                            {
                                amount: 100,
                                id: 1,
                            },
                        ],
                    },
                },
                {
                    invoice: {
                        id: 2,
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [
                            {
                                amount: 100,
                                id: 1,
                            },
                        ],
                    },
                },
            ],
        };
        component.currencies = [{ id: 1 }];
        spyOn(component, 'addPayment').and.callThrough();
        component.serviceRequestFromQueue = [{ id: 1 }];
        component.visitService.visitDataEmitter = new Subject();
        component.isVisit = true;
        component.handleQueueTransition(visit);
        component.addPayment({
            payment_date: '1',
            paymentMethod: { id: 1, name: 'mpesa' },
        });
        component.ngOnInit();
        expect(component.addPayment).toHaveBeenCalled();
    });

    it('should test ngOnChanges method for model changes', () => {
        spyOn(component, 'ngOnChanges').and.callThrough();
        component.ngOnChanges({
            serviceRequest: new SimpleChange(
                { serviceRequest: { currentValue: { id: 1 } } },
                { serviceRequest: { currentValue: { id: 1 } } },
                false
            ),
        });
        component.ngOnChanges({
            serviceRequest: new SimpleChange(
                {},
                { serviceRequest: { currentValue: { id: 1 } } },
                false
            ),
        });
        expect(component.ngOnChanges).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
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

    downloadDocument() {
        return of({ response: {} });
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

    createNested() {
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

class StateServiceStub2 {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    reload() {
        return true;
    }
    transition() {
        return false;
    }
    transitionTo() {
        return true;
    }
    includes() {
        return false;
    }
}

class TransitionStub2 {
    params() {
        return { visit: 1 };
    }
}

describe('VisitBillingComponent: all calls fail visit resolves', () => {
    let component: VisitBillingComponent;
    let fixture: ComponentFixture<VisitBillingComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('orderBy'),
                mockPipe('visitAmountDue'),
                mockPipe('statusColor'),
                mockPipe('statusDescription'),
                mockPipe('replaceWith'),
                mockPipe('featureFlag'),
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                mockPipe('healthIdFormatter'),
                mockPipe('variant'),
                mockPipe('silCurrency'),
            ],
            declarations: [VisitBillingComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub2 },
                { provide: Transition, useClass: TransitionStub2 },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: TranslateService, useValue: TranslateServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitBillingComponent);
        component = fixture.componentInstance;
        component.serviceRequest = {
            invoice: {
                amount_paid: 100,
                amount_due: 10,
                invoice_lines: [
                    {
                        id: 1,
                    },
                ],
            },
        };
        fixture.detectChanges();
    });

    it('should test the addPayment method', () => {
        component.currencies = [{ id: 1 }];
        component.ngOnInit();
        component.toggleServicePointModal();
        component.changeQueue({});
        component.serviceRequestFromQueue = [{ id: 1 }];
        spyOn(component, 'addPayment').and.callThrough();
        component.sendToQueue();
        component.addToQueue('IN_PROGRESS');
        component.printEntireInvoice();
        component.getFilteredResponse('event');
        component.visitService.currenciesDataEmitter = new Subject();
        component.visitService.currenciesDataEmitter.next([{ id: 1 }]);
        component.currencies = [{ id: 1 }];
        component.addPayment({
            payment_date: '1',
            paymentMethod: { id: 1, name: 'mpesa' },
        });
        component.serviceRequest = null;
        component.ngOnInit();
        component.serviceRequest = {
            invoice: {
                amount_paid: 1,
                amount_due: 1,
                invoice_lines: [{ id: 1 }],
            },
        };
        component.ngOnInit();
        component.serviceRequest = {
            invoice: {
                amount_paid: null,
                amount_due: 1,
                invoice_lines: [{ id: 1 }],
            },
        };
        component.ngOnInit();
        component.serviceRequest = {
            invoice: {
                amount_paid: 0,
                amount_due: 1,
                invoice_lines: [{ id: 1 }],
            },
        };
        component.ngOnInit();
        expect(component.addPayment).toHaveBeenCalled();
    });
});

import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
    SimpleChange,
} from '@angular/core';
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { BehaviorSubject, of } from 'rxjs';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { VisitInvoiceComponent } from './visit-invoice.component';
import { VisitService } from '../visit.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
            instant() {}
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
        },
        name: 'app.advantage.visits.detail',
    },
    current: {
        name: 'app.advantage.visits.detail',
    },
};

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
    instant() {
        return true;
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
            workstation: {
                workstation: '86199c80cf17',
                workstation__name: 'Workstation 1',
                workstation__org_unit__name: 'Workstation One Department',
                workstation__org_unit: '98163bas',
                workstation__org_unit__parent__name: 'Workstation One Branch',
                workstation__org_unit__parent: '0b8f278bcafe',
            },
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
        return { appointment_id: 1, state: 'home', id: 1 };
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    href() {
        return `/12sadfasdf/`;
    }
    transition() {
        return true;
    }
    transitionTo() {
        return true;
    }
    reload() {
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
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
            results: [
                {
                    id: '143223',
                    appointment_status: 'BOOKED',
                    actor: 'FACILITY',
                    specialty: 'OTHER',
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
            service_requests: [{ id: '123' }, { id: '124' }],
        });
    }

    nestedTransition() {
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
                    id: '143223',
                    appointment_status: 'BOOKED',
                    actor: 'FACILITY',
                    specialty: 'OTHER',
                    new_price: 18,
                    amount: '18',
                    product_name: 'Lipid',
                    quantity: 1,
                },
            ],
        });
    }

    remove() {
        return of({
            success: true,
        });
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
    sendToQueue: () => {},
    addServiceRequest: () => {},
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

describe('VisitInvoiceComponent', () => {
    let component: VisitInvoiceComponent;
    let fixture: ComponentFixture<VisitInvoiceComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [VisitInvoiceComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                BrowserAnimationsModule,
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('split'),
                mockPipe('visitAmountDue'),
                mockPipe('variant'),
                mockPipe('statusColor'),
                mockPipe('statusDescription'),
                mockPipe('replaceWith'),
                mockPipe('featureFlag'),
                mockPipe('translate'),
                mockPipe('healthIdFormatter'),
            ],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(VisitInvoiceComponent);
        component = fixture.componentInstance;
        component.serviceRequest = {
            invoice: {
                sales_invoice_id: 1,
                id: 1,
                queue: 1,
                invoice_lines: [{}],
                refund_status: 'FULLY_REFUNDED',
                refunds: [
                    {
                        sales_credit_note_id: '123',
                        workflow_state: 'DRAFT',
                    },
                ],
            },
        };
        component.visit = {
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
        };
        component.navigateToQueue();
        component.currencies = [{ id: 1 }];
        component.erpUserDetails = {
            user_workstations: [
                {
                    workstation__org_unit: 1,
                },
            ],
        };
        fixture.detectChanges();
    });

    it('should test trivial functions', fakeAsync(() => {
        component.visit = {
            id: 1,
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                        refunds: [
                            {
                                id: 1,
                                workflow_state: 'PROCESSED',
                            },
                        ],
                    },
                },
            ],
        };
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('position', 'status', 'msg', 'mesage');
        component.currencies = [{ id: 1 }];
        component.addBillItem({ pricelist_products: { id: 1 } });
        component.addPayment({});
        component.selectInvoiceLines({ id: '12312321' });
        component.selectInvoiceLines({ id: '12312321' });
        component.selectedInvoiceLines = [{ id: '123123' }];
        component.partialRefund({ reason: 'waived' });
        component.fullRefund({ reason: 'missing' });
        component.submitRefund('SUBMITTED');
        component.processRefund('SUBMITTED');
        component.processedRefund();
        component.processedFullRefund();
        component.errorHandlerFxn('ds');
        tick(2000);
        component.toggleModal('payment');
        component.toggleModal('payment', { queue_type: 'LAB' });
        expect(component).toBeTruthy();
        component.completeVisit();
        component.changeQueue({ id: 1 });
        component.addToQueue('PENDING');
        component.navigateToTriage();
        component.visit = {
            status: 'COMPLETED',
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                        refunds: [
                            {
                                sales_credit_note_id: '123',
                                workflow_state: 'DRAFT',
                            },
                        ],
                    },
                },
            ],
        };
        component.actions[0].expression(undefined);
        component.actions[0].expression({ id: 1 });
        component.actions[1].expression(undefined);
        component.actions[1].expression({ id: 1 });
        component.actions[2].expression(undefined);
        component.actions[2].expression({ id: 1 });
        component.actions[3].expression(undefined);
        component.actions[3].expression({ id: 1 });
        component.serviceRequest = {
            invoice: {
                sales_invoice_id: 1,
                id: 1,
                queue: 1,
                invoice_lines: [{}],
                refunds: [
                    {
                        sales_credit_note_id: '123',
                        workflow_state: 'PROCESSED',
                    },
                ],
            },
        };
        component.actions[2].expression({ id: 1 });
        component.actions[3].expression({ id: 1 });
        component.toggleBookAppointment();
        expect(component.showToast).toHaveBeenCalled();
    }));

    it('should test ngOnChanges method', () => {
        component.ngOnChanges({
            serviceRequest: new SimpleChange(null, {}, false),
        });
        component.selectedQueue = [{ id: 1 }];
        spyOn(component, 'sendToQueue').and.callThrough();
        spyOn(component, 'addServiceRequest').and.callThrough();
        component.sendToQueue();
        component.addServiceRequest();
        expect(component.sendToQueue).toHaveBeenCalled();
        expect(component.addServiceRequest).toHaveBeenCalled();
    });

    it('should test printInvoice if sales invoice is available', () => {
        spyOn(component, 'printInvoice').and.callThrough();
        component.printInvoice();
        expect(component.printInvoice).toHaveBeenCalledWith();
    });

    it('should test previewDocument method for invoice', () => {
        spyOn(component, 'previewDocument').and.callThrough();
        component.previewDocument('invoice');
        expect(component.previewDocument).toHaveBeenCalled();
    });

    it('should test previewDocument method for credit note', () => {
        spyOn(component, 'previewDocument').and.callThrough();
        component.previewDocument('credit-note');
        expect(component.previewDocument).toHaveBeenCalled();
    });

    it('should test showSuccessSignedInvoiceMessage method', () => {
        spyOn(component, 'showSuccessSignedInvoiceMessage').and.callThrough();
        component.showSuccessSignedInvoiceMessage();
        expect(component.showSuccessSignedInvoiceMessage).toHaveBeenCalled();
    });

    it('should test getAttachment method', () => {
        spyOn(component, 'getAttachment').and.callThrough();
        component.getAttachment('invoice');
        expect(component.getAttachment).toHaveBeenCalled();
    });

    it('should test fetchERPInvoiceSignedStatus method', () => {
        component.variant = 'default';
        spyOn(component, 'fetchERPInvoiceSignedStatus').and.callThrough();
        component.ngOnInit();
        expect(component).toBeTruthy();
        expect(component.fetchERPInvoiceSignedStatus).toHaveBeenCalled();
    });

    it('should test addProduct', () => {
        const model = {
            product: {
                preferred_term: 'Consultation',
                slade_code: '123',
            },
            product_type: 'Service',
            product_category: {
                id: '123',
            },
            selling_price: '200',
            purchasing_price: '100',
            sales_taxes: '0',
            purchase_taxes: '0',
        };
        spyOn(component, 'addProduct').and.callThrough();
        component.addProduct(model);
        expect(component.addProduct).toHaveBeenCalledWith(model);
    });

    it('should add payment method successfully', fakeAsync(() => {
        // Arrange
        const model = {
            name: 'Test Payment Method',
            account_details: {
                id: 'someid',
            },
            description: 'Test Description',
        };
        const data = {
            name: model.name,
            account: model.account_details?.id,
            description: model.description,
        };
        spyOn(component.dataLayer, 'create').and.returnValue(of({}));
        spyOn(component, 'togglePaymentMethodForm');
        spyOn(component, 'showToast');

        // Act
        component.addPaymentMethod(model);
        tick();

        // Assert
        expect(component.loading).toBe(false);
        expect(component.dataLayer.create).toHaveBeenCalledWith(
            'payment-methods',
            data
        );
        expect(component.togglePaymentMethodForm).toHaveBeenCalled();
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Add Payment Method',
            'Payment Method Added Successfully'
        );
    }));

    it('should disable add payment button', () => {
        component.toggle['payment'] = true;
        component.serviceRequestSelected = {
            invoice: {},
        };
        component.toggleModal('payment');
        expect(component.disablePaymentButton).toBeTruthy();
    });

    it('should toggle payment method form', () => {
        spyOn(component, 'toggleModal');

        component.togglePaymentMethodForm();

        expect(component.toggleModal).toHaveBeenCalledWith('payment');
        expect(component.toggleModal).toHaveBeenCalledWith('paymentMethod');
    });
    it('should handle error when adding a payment method', fakeAsync(() => {
        // Arrange
        const model = {
            name: 'Test Payment Method',
            account_details: {
                id: 'someid',
            },
            description: 'Test Description',
        };
        const error = new Error('Failed to add payment method');
        spyOn(component.dataLayer, 'create').and.returnValue(throwError(error));
        spyOn(component['errorHandler'], 'handleError');
        // Act
        component.addPaymentMethod(model);
        tick();

        // Assert
        expect(component.loading).toBe(false);
        expect(component['errorHandler'].handleError).toHaveBeenCalledWith(
            error,
            component
        );
    }));
    it('should update service request status to IN_PROGRESS first, then update visit status', fakeAsync(() => {
        const visitId = 1;
        const serviceRequestId = 2;
        const payload = { status: 'IN_PROGRESS' };

        component.visit = { id: visitId };
        component.serviceRequest = { id: serviceRequestId };

        const updateSpy = spyOn(component.dataLayer, 'update').and.returnValue(
            of({})
        );
        spyOn(component.$state, 'reload');
        spyOn(component.analytics, 'logEvent');
        spyOn(component.visitService, 'fetchVisit');

        component.updateVisitStatusToInProgress();
        tick();

        expect(updateSpy.calls.argsFor(0)).toEqual([
            'service-requests',
            serviceRequestId,
            payload,
        ]);

        expect(updateSpy.calls.argsFor(1)).toEqual([
            'visits',
            visitId,
            payload,
        ]);

        expect(component.analytics.logEvent).toHaveBeenCalledWith(
            'service-request_completed'
        );
        expect(component.visitService.fetchVisit).toHaveBeenCalled();
        expect(component.$state.reload).toHaveBeenCalled();
    }));

    it('should update visit status to IN_PROGRESS and reload the state when triggered by an action', fakeAsync(() => {
        const visitId = 1;
        const payload = { status: 'IN_PROGRESS' };

        spyOn(component.dataLayer, 'update').and.returnValue(of({}));
        spyOn(component.$state, 'reload');
        component.visit = { id: visitId };

        component.updateVisitStatusToInProgress();
        tick();

        expect(component.dataLayer.update).toHaveBeenCalledWith(
            'visits',
            visitId,
            payload
        );
        expect(component.$state.reload).toHaveBeenCalled();
    }));

    it('should call updateVisitStatusToInProgress when adding a bill item', fakeAsync(() => {
        const mockBillItem = {
            pricelist_products: {
                product_id: 123,
                pricelist_product_id: 456,
                name: 'Test Product',
            },
            price: 100,
            quantity: 1,
            original_price: 100,
            allow_discount: true,
        };

        component.visit = { id: 789 };
        component.serviceRequest = {
            id: 101,
            invoice: { id: 202 },
        };

        spyOn(component.dataLayer, 'create').and.returnValue(of({}));
        spyOn(component.visitService, 'fetchVisit');
        spyOn(component, 'updateVisitStatusToInProgress').and.callThrough();
        spyOn(component.dataLayer, 'update').and.returnValue(of({}));
        spyOn(component, 'showToast');
        spyOn(component, 'toggleModal');

        component.addBillItem(mockBillItem);
        tick();
        expect(component.dataLayer.create).toHaveBeenCalledWith(
            'billable-items',
            jasmine.any(Object)
        );

        expect(component.visitService.fetchVisit).toHaveBeenCalled();

        expect(component.updateVisitStatusToInProgress).toHaveBeenCalled();

        expect(component.dataLayer.update).toHaveBeenCalledWith(
            'service-requests',
            101,
            { status: 'IN_PROGRESS' }
        );
        expect(component.dataLayer.update).toHaveBeenCalledWith('visits', 789, {
            status: 'IN_PROGRESS',
        });
        expect(component.showToast).toHaveBeenCalled();
        expect(component.toggleModal).toHaveBeenCalledWith('billing');
        expect(component.loading).toBe(false);
    }));

    it('should handle custom action by setting selected item and triggering SweetAlert', () => {
        const mockRow = { id: '123', name: 'Test Item', price: 100 };

        component.removeInvoiceItemSwal = {
            fire: jasmine.createSpy('fire'),
        } as any;

        component.handleCustomAction(mockRow);

        expect(component.selectedInvoiceItem).toEqual(mockRow);
        expect(component.removeInvoiceItemSwal.fire).toHaveBeenCalled();
    });

    it('should confirm and remove invoice item successfully', fakeAsync(() => {
        const mockItem = { id: '123', name: 'Test Item', price: 100 };
        component.selectedInvoiceItem = mockItem;

        spyOn(component.dataLayer, 'remove').and.returnValue(of({}));
        spyOn(component, 'showToast');
        spyOn(component.visitService, 'fetchVisit');

        component.confirmRemoveInvoiceItem();
        tick();

        expect(component.dataLayer.remove).toHaveBeenCalledWith(
            'billable-items',
            '123'
        );
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Item removed',
            'Invoice item has been removed successfully'
        );
        expect(component.visitService.fetchVisit).toHaveBeenCalled();
        expect(component.selectedInvoiceItem).toBeNull();
    }));

    it('should handle error when removing invoice item', fakeAsync(() => {
        const mockItem = { id: '123', name: 'Test Item', price: 100 };
        const error = new Error('Failed to remove item');
        component.selectedInvoiceItem = mockItem;

        spyOn(component.dataLayer, 'remove').and.returnValue(throwError(error));
        spyOn(component['errorHandler'], 'handleError');

        component.confirmRemoveInvoiceItem();
        tick();

        expect(component.dataLayer.remove).toHaveBeenCalledWith(
            'billable-items',
            '123'
        );
        expect(component['errorHandler'].handleError).toHaveBeenCalledWith(
            error,
            component
        );
        expect(component.selectedInvoiceItem).toBeNull();
    }));

    it('should not attempt to remove item if no selected invoice item', () => {
        component.selectedInvoiceItem = null;

        spyOn(component.dataLayer, 'remove');

        component.confirmRemoveInvoiceItem();

        expect(component.dataLayer.remove).not.toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    downloadDocument() {
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

    remove() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('VisitInvoiceComponent: all calls fail visit resolves', () => {
    let component: VisitInvoiceComponent;
    let fixture: ComponentFixture<VisitInvoiceComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [VisitInvoiceComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                BrowserAnimationsModule,
                mockPipe('titleCase'),
                mockPipe('statusColor'),
                mockPipe('replaceWith'),
                mockPipe('split'),
                mockPipe('variant'),
                mockPipe('visitAmountDue'),
                mockPipe('statusDescription'),
                mockPipe('age'),
                mockPipe('featureFlag'),
                mockPipe('translate'),
                mockPipe('healthIdFormatter'),
            ],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(VisitInvoiceComponent);
        component = fixture.componentInstance;
        component.serviceRequest = {
            invoice: {
                sales_invoice_id: 1,
                id: 1,
                invoice_lines: [{}],
                refund_status: 'PARTIALLY_REFUNDED',
                refunds: [
                    {
                        sales_credit_note_id: '123',
                        workflow_state: 'DRAFT',
                    },
                ],
            },
        };
        component.currencies = [{ id: 1 }];
        fixture.detectChanges();
    });

    it('should test fetchERPInvoiceSignedStatus method', () => {
        component.variant = 'default';
        spyOn(component, 'fetchERPInvoiceSignedStatus').and.callThrough();
        component.ngOnInit();
        expect(component).toBeTruthy();
        expect(component.fetchERPInvoiceSignedStatus).toHaveBeenCalled();
    });

    it('should test visitObservable method', () => {
        component.currencies = [{ id: 1 }];
        component.addBillItem({ pricelist_products: { id: 1 } });
        component.addPayment({});
        component.serviceRequest = {
            invoice: {
                sales_invoice_id: 1,
                id: 1,
                amount_paid: 0,
                invoice_lines: [{}],
                refunds: [
                    {
                        sales_credit_note_id: '123',
                        workflow_state: 'PROCESSED',
                    },
                ],
            },
        };
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should test visitObservable method when amount paid is greater than 0', () => {
        component.currencies = [{ id: 1 }];
        component.addBillItem({ pricelist_products: { id: 1 } });
        component.addPayment({});
        component.serviceRequest = {
            invoice: {
                sales_invoice_id: 1,
                id: 1,
                amount_paid: 50,
                invoice_lines: [{}],
                refunds: [
                    {
                        sales_credit_note_id: '123',
                        workflow_state: 'PROCESSED',
                    },
                ],
            },
        };
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should test pricelistObservable method', () => {
        spyOn(component, 'printInvoice').and.callThrough();
        component.printInvoice();
        component.currencies = [{ id: 1 }];
        component.addBillItem({ pricelist_products: { id: 1 } });
        component.addPayment({});
        component.serviceRequest = {
            invoice: {
                sales_invoice_id: 1,
                id: 1,
                amount_paid: 0,
                invoice_lines: [{}],
                refunds: [
                    {
                        sales_credit_note_id: '123',
                        workflow_state: 'PROCESSED',
                    },
                ],
            },
        };
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should test printInvoice if sales invoice is available', () => {
        spyOn(component, 'printInvoice').and.callThrough();
        component.printInvoice();
        expect(component.printInvoice).toHaveBeenCalledWith();
    });
    it('should test previewDocument if invoice', () => {
        spyOn(component, 'previewDocument').and.callThrough();
        component.previewDocument('invoice');
        expect(component.previewDocument).toHaveBeenCalledWith('invoice');
    });
    it('should test previewDocument if credit-note', () => {
        spyOn(component, 'previewDocument').and.callThrough();
        component.previewDocument('credit-note');
        expect(component.previewDocument).toHaveBeenCalledWith('credit-note');
    });
    it('should test forceInvoiceSign method', () => {
        spyOn(component, 'forceInvoiceSign').and.callThrough();
        component.forceInvoiceSign();
        expect(component.forceInvoiceSign).toHaveBeenCalledWith();
    });
    it('should test forceCreditNoteSign method', () => {
        spyOn(component, 'forceCreditNoteSign').and.callThrough();
        component.forceCreditNoteSign();
        expect(component.forceCreditNoteSign).toHaveBeenCalledWith();
    });
    it('should test getAttachment method error', () => {
        spyOn(component, 'getAttachment').and.callThrough();
        component.getAttachment('invoice');
        expect(component.getAttachment).toHaveBeenCalled();
    });

    it('should test addProduct error', () => {
        const model = {
            product: {
                preferred_term: 'Consultation',
                slade_code: '123',
            },
            product_type: 'Service',
            product_category: {
                id: '123',
            },
            selling_price: '200',
            purchasing_price: '100',
            sales_taxes: '0',
            purchase_taxes: '0',
        };
        spyOn(component, 'addProduct').and.callThrough();
        component.addProduct(model);
        expect(component.addProduct).toHaveBeenCalledWith(model);
    });
    it('should handle error when updating service request status to IN_PROGRESS', fakeAsync(() => {
        const serviceRequestId = 2;
        const error = new Error('Failed to update service request status');
        const payload = { status: 'IN_PROGRESS' };

        spyOn(component.dataLayer, 'update').and.returnValue(throwError(error));
        spyOn(component['errorHandler'], 'handleError');
        spyOn(component.$state, 'reload');
        spyOn(component.analytics, 'logEvent');

        component.serviceRequest = { id: serviceRequestId };

        component.updateVisitStatusToInProgress();
        tick();

        expect(component.dataLayer.update).toHaveBeenCalledWith(
            'service-requests',
            serviceRequestId,
            payload
        );
        expect(component['errorHandler'].handleError).toHaveBeenCalledWith(
            error,
            component
        );
        expect(component.analytics.logEvent).not.toHaveBeenCalled();
        expect(component.$state.reload).not.toHaveBeenCalled();
    }));

    it('should update visit status to IN_PROGRESS and reload the state when triggered by an action', fakeAsync(() => {
        const visitId = 1;
        const payload = { status: 'IN_PROGRESS' };

        spyOn(component.dataLayer, 'update').and.returnValue(of({}));
        spyOn(component.$state, 'reload');
        component.visit = { id: visitId };

        component.updateVisitStatusToInProgress();
        tick();

        expect(component.dataLayer.update).toHaveBeenCalledWith(
            'visits',
            visitId,
            payload
        );
        expect(component.$state.reload).toHaveBeenCalled();
    }));
    it('should handle errors when adding a bill item', fakeAsync(() => {
        const mockBillItem = {
            pricelist_products: {
                product_id: 123,
                pricelist_product_id: 456,
                name: 'Test Product',
            },
            price: 100,
            quantity: 1,
            original_price: 100,
            allow_discount: true,
        };

        const error = new Error('Failed to create billable item');
        component.serviceRequest = {
            invoice: { id: 202 },
        };

        spyOn(component.dataLayer, 'create').and.returnValue(throwError(error));
        spyOn(component['errorHandler'], 'handleError');
        spyOn(component, 'updateVisitStatusToInProgress');

        component.addBillItem(mockBillItem);
        tick();

        expect(component['errorHandler'].handleError).toHaveBeenCalledWith(
            error,
            component
        );

        expect(component.updateVisitStatusToInProgress).not.toHaveBeenCalled();

        expect(component.loading).toBe(false);
    }));

    it('should handle error when removing invoice item', fakeAsync(() => {
        const mockItem = { id: '123', name: 'Test Item', price: 100 };
        const error = new Error('Failed to remove billable item');
        component.selectedInvoiceItem = mockItem;

        spyOn(component.dataLayer, 'remove').and.returnValue(throwError(error));
        spyOn(component['errorHandler'], 'handleError');

        component.confirmRemoveInvoiceItem();
        tick();

        expect(component.dataLayer.remove).toHaveBeenCalledWith(
            'billable-items',
            '123'
        );
        expect(component['errorHandler'].handleError).toHaveBeenCalledWith(
            error,
            component
        );
        expect(component.selectedInvoiceItem).toBeNull();
    }));
});

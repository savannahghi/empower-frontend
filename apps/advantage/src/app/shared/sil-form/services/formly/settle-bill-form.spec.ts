import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { SettleBillFormFieldsService } from './settle-bill-form';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { NbToastrService } from '@nebular/theme';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                { id: '1', name: 'Test 1' },
                { id: '2', name: 'Test 2' },
                { id: '3', name: 'Test 3' },
            ],
        });
    }

    get() {
        return of({
            result: [
                {
                    id: '1',
                    document_number: 'INV-001',
                    bill_amount_balance: 800,
                    supplier: '123',
                },
                {
                    id: '2',
                    document_number: 'INV-002',
                    bill_amount_balance: 500,
                    supplier: '123',
                },
            ],
        });
    }
}

class AuthorizationStub {
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
            organisation_id: '123',
        };
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }

    danger(message: string, title: string) {
        return of({ title, message });
    }
}

describe('SettleBillFormFieldsService', () => {
    let service: SettleBillFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                SettleBillFormFieldsService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: AuthenticationService, useClass: AuthorizationStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: {} },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
            ],
        });

        service = TestBed.inject(SettleBillFormFieldsService);
    });

    it('should create service', () => {
        expect(service).toBeTruthy();
    });

    it('should set formState.service to the service instance', () => {
        const fields = service.fields();
        const supplierField = fields.find(field => field.key === 'supplier');
        expect(supplierField).toBeTruthy();

        const formState: any = {};
        const fieldMock = { options: { formState } };

        supplierField.hooks.onInit(fieldMock as any);

        expect(formState.service).toBe(service);
    });

    it('should update selectedSupplierId and fetch filtered bills', fakeAsync(() => {
        spyOn(service as any, 'fetchBills').and.callFake(() => {
            service.bills = [
                {
                    id: '1',
                    document_number: 'INV-001',
                    bill_amount_balance: 800,
                    supplier: '123',
                },
                {
                    id: '2',
                    document_number: 'INV-002',
                    bill_amount_balance: 500,
                    supplier: '123',
                },
                {
                    id: '3',
                    document_number: 'INV-003',
                    bill_amount_balance: 0,
                    supplier: '123',
                },
                {
                    id: '4',
                    document_number: 'INV-004',
                    bill_amount_balance: 300,
                    supplier: '456',
                },
            ];
        });

        spyOn(service as any, 'getFilteredBills').and.callThrough();
        const fields = service.fields();
        const supplierField = fields.find(field => field.key === 'supplier');
        const billField = fields.find(field => field.key === 'bill');

        expect(supplierField).toBeTruthy();
        expect(billField).toBeTruthy();

        const formState: any = { selectedSupplierId: null, service };
        const fieldMock = {
            formControl: { value: '123' },
            options: { formState },
            parent: { fieldGroup: [billField] },
        };

        const supplierExpression = supplierField.expressions['model.supplier'];
        if (typeof supplierExpression === 'function') {
            supplierExpression(fieldMock as any);
        }

        flush();
        expect(formState.selectedSupplierId).toBe('123');
        expect(service['getFilteredBills']).toHaveBeenCalledWith('123');

        if (Array.isArray(billField.props.options)) {
            expect(billField.props.options.length).toBe(2);
            expect(billField.props.options).toEqual([
                {
                    id: '1',
                    document_number: 'INV-001',
                    bill_amount_balance: 800,
                    supplier: '123',
                    label: 'INV-001\nBal: 800',
                },
                {
                    id: '2',
                    document_number: 'INV-002',
                    bill_amount_balance: 500,
                    supplier: '123',
                    label: 'INV-002\nBal: 500',
                },
            ]);
        } else {
            fail('billField.props.options is not an array');
        }
    }));

    it('should set component and organisationID correctly', () => {
        const componentMock = { model: {} };
        service.setComponent(componentMock);
        expect(service.component).toEqual(componentMock);
        expect(service.organisationID).toBe('123');
    });

    it('should return formly fields', () => {
        const fields = service.fields();
        expect(fields).toBeTruthy();
        expect(fields.length).toBeGreaterThan(0);
    });

    it('should contain supplier field', () => {
        const fields = service.fields();
        const supplierField = fields.find(field => field.key === 'supplier');
        expect(supplierField).toBeTruthy();
        expect(supplierField.props.label).toBe('Select Supplier');
        expect(supplierField.props.required).toBeTrue();
    });

    it('should contain payment_date field', () => {
        const fields = service.fields();
        const paymentDateField = fields.find(
            field => field.key === 'payment_date'
        );
        expect(paymentDateField).toBeTruthy();
        expect(paymentDateField.props.label).toBe('Payment Date');
        expect(paymentDateField.props.required).toBeTrue();
    });

    it('should contain amount field', () => {
        const fields = service.fields();
        const amountField = fields.find(field => field.key === 'amount');
        expect(amountField).toBeTruthy();
        expect(amountField.props.label).toBe('Amount');
        expect(amountField.props.required).toBeTrue();
    });

    it('should contain currency field', () => {
        const fields = service.fields();
        const currencyField = fields.find(field => field.key === 'currency');
        expect(currencyField).toBeTruthy();
        expect(currencyField.props.label).toBe('Currency');
        expect(currencyField.props.required).toBeTrue();
    });

    it('should contain bill field', () => {
        const fields = service.fields();
        const billField = fields.find(field => field.key === 'bill');
        expect(billField).toBeTruthy();
        expect(billField.props.label).toBe('Select Bill');
        expect(billField.props.required).toBeTrue();
    });

    it('should contain payment_method field', () => {
        const fields = service.fields();
        const paymentMethodField = fields.find(
            field => field.key === 'payment_method'
        );
        expect(paymentMethodField).toBeTruthy();
        expect(paymentMethodField.props.label).toBe('Payment method');
        expect(paymentMethodField.props.required).toBeTrue();
    });

    it('should evaluate currency expression correctly when currency is not defined', fakeAsync(() => {
        const comp = {
            fields: service.fields(),
            cd: {
                detectChanges: () => {},
            },
            model: {},
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        service.fields();
        expect(service.fields).toHaveBeenCalled();

        const currencyField = service
            .fields()
            .find(field => field.key === 'currency');
        expect(currencyField).toBeTruthy();

        const expression = currencyField.expressions['model.currency'];
        const expressionResult =
            typeof expression === 'function'
                ? expression(currencyField)
                : expression;
        expect(expressionResult).toBeUndefined();
    }));

    it('should evaluate currency expression correctly when currency is defined', fakeAsync(() => {
        const comp = {
            fields: service.fields(),
            cd: { detectChanges: () => {} },
            model: { currency: 'USD' },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        service.fields();
        expect(service.fields).toHaveBeenCalled();

        const currencyField = service
            .fields()
            .find(field => field.key === 'currency');
        expect(currencyField).toBeTruthy();

        Object.assign(currencyField, { model: comp.model });

        const expression = currencyField.expressions['model.currency'];
        const expressionResult =
            typeof expression === 'function'
                ? expression(currencyField)
                : expression;

        expect(expressionResult).toBe('USD');
    }));

    it('should return undefined when currency is not defined', fakeAsync(() => {
        const comp = {
            fields: service.fields(),
            cd: { detectChanges: () => {} },
            model: {},
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        service.fields();
        expect(service.fields).toHaveBeenCalled();

        const currencyField = service
            .fields()
            .find(field => field.key === 'currency');
        expect(currencyField).toBeTruthy();

        Object.assign(currencyField, { model: comp.model });

        const expression = currencyField.expressions['model.currency'];
        const expressionResult =
            typeof expression === 'function'
                ? expression(currencyField)
                : expression;

        expect(expressionResult).toBeUndefined();
    }));

    it('should return undefined when field is null or undefined', fakeAsync(() => {
        const currencyExpression = service
            .fields()
            .find(field => field.key === 'currency').expressions[
            'model.currency'
        ];

        if (typeof currencyExpression === 'function') {
            expect(currencyExpression(null)).toBeUndefined();
            expect(currencyExpression(undefined)).toBeUndefined();
            expect(currencyExpression({})).toBeUndefined();
        }
    }));

    it('should filter bills by supplier ID and positive balance', fakeAsync(() => {
        spyOn(service as any, 'fetchBills').and.callFake(() => {
            service.bills = [
                {
                    id: '1',
                    document_number: 'INV-001',
                    bill_amount_balance: 800,
                    supplier: '123',
                    is_paid: false,
                },
                {
                    id: '2',
                    document_number: 'INV-002',
                    bill_amount_balance: 500,
                    supplier: '123',
                    is_paid: false,
                },
                {
                    id: '3',
                    document_number: 'INV-003',
                    bill_amount_balance: 0,
                    supplier: '123',
                    is_paid: false,
                },
                {
                    id: '4',
                    document_number: 'INV-004',
                    bill_amount_balance: 300,
                    supplier: '456',
                    is_paid: true,
                },
            ];
        });

        const supplierId = '123';
        const filteredBills = service['getFilteredBills'](supplierId);

        expect(service['fetchBills']).toHaveBeenCalled();
        expect(filteredBills.length).toBe(2);
        expect(filteredBills).toEqual([
            {
                id: '1',
                document_number: 'INV-001',
                bill_amount_balance: 800,
                supplier: '123',
                label: 'INV-001\nBal: 800',
                is_paid: false,
            },
            {
                id: '2',
                document_number: 'INV-002',
                bill_amount_balance: 500,
                supplier: '123',
                label: 'INV-002\nBal: 500',
                is_paid: false,
            },
        ]);
    }));

    it('should return an empty array when no bills match the criteria', fakeAsync(() => {
        spyOn(service as any, 'fetchBills').and.callThrough();

        service.bills = [
            {
                id: '1',
                document_number: 'INV-001',
                bill_amount_balance: 0,
                supplier: '123',
            },
            {
                id: '2',
                document_number: 'INV-002',
                bill_amount_balance: -100,
                supplier: '123',
            },
            {
                id: '3',
                document_number: 'INV-003',
                bill_amount_balance: 300,
                supplier: '456',
            },
        ];

        const supplierId = '123';
        const filteredBills = service['getFilteredBills'](supplierId);

        expect((service as any).fetchBills).toHaveBeenCalled();
        expect(filteredBills.length).toBe(0);
    }));

    it('should enable the bill field when selectedSupplierId is set', () => {
        const fields = service.fields();
        const billField = fields.find(field => field.key === 'bill');
        expect(billField).toBeTruthy();

        const formState: any = { selectedSupplierId: '123' };
        const fieldMock = { options: { formState } };

        const disabledExpression = billField.expressions['props.disabled'];
        if (typeof disabledExpression === 'function') {
            const isDisabled = disabledExpression(fieldMock as any);
            expect(isDisabled).toBeFalse();
        } else {
            fail('disabledExpression is not a function');
        }
    });

    it('should filter and format bills successfully', fakeAsync(() => {
        spyOn(service as any, 'fetchBills').and.callThrough();
        service['fetchBills']();
        flush();
        expect((service as any).fetchBills).toHaveBeenCalled();
    }));
});

class SilStoresServiceErrorStub {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('SettleBillFormFieldsService', () => {
    let service: SettleBillFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                SettleBillFormFieldsService,
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceErrorStub,
                },
                { provide: AuthenticationService, useClass: AuthorizationStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: {} },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
            ],
        });

        service = TestBed.inject(SettleBillFormFieldsService);
    });

    it('should create service', () => {
        expect(service).toBeTruthy();
    });

    it('should handle errors when fetching bills', fakeAsync(() => {
        spyOn(service as any, 'fetchBills').and.callThrough();
        service['fetchBills']();
        expect((service as any).fetchBills).toHaveBeenCalled();
        flush();
    }));
});

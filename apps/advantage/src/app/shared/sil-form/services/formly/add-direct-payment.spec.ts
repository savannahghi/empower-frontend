import { TestBed, fakeAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AddDirectPaymentFieldsService } from './add-direct-payment';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('AddDirectPaymentFieldsService', () => {
    let service: AddDirectPaymentFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AddDirectPaymentFieldsService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AddDirectPaymentFieldsService);
    });

    it('should test fields', fakeAsync(() => {
        const comp = {
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
            secondaryData: { useInputForCustomersField: false },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();

        const fields = service.fields();

        const businessPartnerField = {
            model: {
                business_partner: '134',
            },
        };
        const paymentDateField = {
            model: {
                payment_date: 'JDNI2N3',
            },
        };
        const invoiceField = {
            model: {
                sales_invoice: '123',
            },
        };
        const paymentMethodField = {
            model: {
                payment_method: 'Test',
            },
        };
        const currencyField = {
            model: {
                currency: 'Test',
            },
        };

        const amountField = {
            model: {
                paid_amount: 1234,
            },
        };

        fields[0].expressions['model.payment_date'](paymentDateField);
        fields[2].expressions['model.business_partner'](businessPartnerField);
        fields[3].expressions['model.sales_invoice'](invoiceField);
        fields[4].expressions['model.payment_method'](paymentMethodField);
        fields[5].expressions['model.currency'](currencyField);
        fields[6].expressions['model.paid_amount'](amountField);

        service.fields();
        expect(service.fields).toHaveBeenCalled();
    }));

    it('should test fields when field type input is used for customer field', () => {
        const comp = {
            secondaryData: { useInputForCustomersField: true },
            fields: [{}],
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        const customerNameField = {
            model: {
                customer_name: 'Test Customer',
            },
        };
        fields[1].expressions['props.disabled'](customerNameField);
        expect(service.fields).toHaveBeenCalled();
    });
});

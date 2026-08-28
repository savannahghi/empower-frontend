import { TestBed, fakeAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DirectSalesInvoiceService } from './sales-invoice-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('DirectSalesInvoiceService', () => {
    let service: DirectSalesInvoiceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                DirectSalesInvoiceService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(DirectSalesInvoiceService);
    });

    it('should test fields', fakeAsync(() => {
        const comp = {
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const invoiceDateField = {
            model: {
                invoice_date: 'Monday',
            },
        };
        const customerField = {
            model: {
                customer: 'Test Customer',
            },
        };
        const salesTypeField = {
            model: {
                sales_type: 'Cash',
            },
        };

        fields[0].expressions['model.invoice_date'](invoiceDateField);
        fields[1].expressions['model.customer'](customerField);
        fields[2].expressions['model.sales_type'](salesTypeField);

        service.fields();
        expect(service.fields).toHaveBeenCalled();
    }));
});

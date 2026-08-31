import { TestBed, fakeAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DirectSalesInvoiceLinesService } from './direct-invoice-lines-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('DirectSalesInvoiceLinesService', () => {
    let service: DirectSalesInvoiceLinesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                DirectSalesInvoiceLinesService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(DirectSalesInvoiceLinesService);
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

        const productField = {
            model: {
                product: '1234',
            },
        };
        const quantityField = {
            model: {
                quantity: 5,
            },
        };
        const newPriceField = {
            model: {
                product: '1234',
                new_price: 400,
            },
            formControl: {
                setValue: () => {},
            },
        };
        const allowDiscountField = {
            model: {
                allow_discount: true,
            },
        };
        const pricelistProductField = {
            model: {
                pricelist_product: '12345',
            },
        };
        const productNameField = {
            model: {
                product_name: 'Test product',
            },
        };

        fields[0].expressions['model.product'](productField);
        fields[1].expressions['model.quantity'](quantityField);
        fields[2].expressions['model.new_price'](newPriceField);
        fields[3].expressions['model.allow_discount'](allowDiscountField);
        fields[4].expressions['model.pricelist_product'](pricelistProductField);
        fields[5].expressions['model.product_name'](productNameField);

        service.fields();
        expect(service.fields).toHaveBeenCalled();
    }));
});

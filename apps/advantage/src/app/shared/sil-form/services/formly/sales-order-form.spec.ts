import { TestBed, fakeAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DirectSalesOrderService } from './sales-order-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('DirectSalesOrderService', () => {
    let service: DirectSalesOrderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                DirectSalesOrderService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(DirectSalesOrderService);
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

        const requiredByField = {
            model: {
                required_by: 'Monday',
            },
        };
        const customerField = {
            model: {
                customer: 'Test Customer',
            },
        };
        const descriptionField = {
            model: {
                description: 'Order',
            },
        };

        fields[0].expressions['model.required_by'](requiredByField);
        fields[1].expressions['model.customer'](customerField);
        fields[2].expressions['model.description'](descriptionField);

        service.fields();
        expect(service.fields).toHaveBeenCalled();
    }));
});

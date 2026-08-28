import { TestBed, fakeAsync } from '@angular/core/testing';
import { DirectSalesOrderLinesService } from './sales-order-lines';
import { of } from 'rxjs';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                { id: 1, remaining_quantity: 0 },
                { id: 2, remaining_quantity: 5 },
                { id: 3, remaining_quantity: null },
            ],
        });
    }
}

describe('DirectSalesOrderLinesService', () => {
    let service: DirectSalesOrderLinesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DirectSalesOrderLinesService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
        });
        service = TestBed.inject(DirectSalesOrderLinesService);
        service.dataLayer = TestBed.inject(SilStoresService) as any;
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

        fields[0].expressions['model.product'](productField);
        fields[1].expressions['model.quantity'](quantityField);

        service.fields();
        expect(service.fields).toHaveBeenCalled();
    }));

    it('should map products response correctly', () => {
        const resp = {
            results: [
                { id: 1, remaining_quantity: 0 },
                { id: 2, remaining_quantity: 10 },
                { id: 3, remaining_quantity: null },
            ],
        };
        const result = service.productsResponseFunction(resp);

        expect(result[0].disabled).toBeTrue();
        expect(result[0].disabledText).toBe('No stock to dispense');

        expect(result[1].display_quantity).toBe(10);
        expect(result[1].disabled).toBeFalse();

        expect(result[2].display_quantity).toBe('Not Tracked');
        expect(result[2].disabled).toBeFalse();
    });

    it('should call getProducts and map response', done => {
        service.getProducts().subscribe(result => {
            expect(result.length).toBe(3);
            expect(result[0].disabled).toBeTrue();
            expect(result[1].display_quantity).toBe(5);
            done();
        });
    });

    it('should set loading to true and false in tap functions', () => {
        service.loading = false;
        service.tapFunction();
        expect(service.loading).toBeTrue();
        service.tapLoading();
        expect(service.loading).toBeFalse();
    });

    it('should return an observable of empty array from catchErrorFunction', done => {
        service.catchErrorFunction().subscribe(result => {
            expect(result).toEqual([]);
            done();
        });
    });

    it('should call switchMapProductFunction and handle success', done => {
        service.switchMapProductFunction().subscribe(result => {
            expect(Array.isArray(result)).toBeTrue();
            expect(result.length).toBe(3);
            done();
        });
    });

    it('should handle products with undefined remaining_quantity', () => {
        const resp = {
            results: [{ id: 4 }],
        };
        const result = service.productsResponseFunction(resp);

        expect(result[0].display_quantity).toBeUndefined();
        expect(result[0].disabled).toBeFalse();
        expect(result[0].disabledText).toBeUndefined();
    });
});

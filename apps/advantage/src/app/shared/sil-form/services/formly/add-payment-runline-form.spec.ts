import { TestBed, fakeAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AddPaymentRunLineService } from './add-payment-runline-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { of } from 'rxjs';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
}

describe('AddPaymentRunLineService', () => {
    let service: AddPaymentRunLineService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AddPaymentRunLineService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AddPaymentRunLineService);
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

        // test first branch payment_date
        const field1 = {
            model: {
                payment_date: '2022-12-12-',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: false,
            },
        };
        fields[0].expressions['model.payment_date'](field1);

        // test second branch payment_date
        const field2 = {
            payment_date: '2022-12-12-',
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            model: {
                payment_date: '2022-12-12-',
            },
            defaultValue: undefined,
        };
        fields[0].expressions['model.payment_date'](field2);

        // test third branch payment_date
        const field3 = {
            payment_date: '2022-12-12',
            formControl: {
                pristine: true,
                markAsPristine: () => {},
                touched: true,
            },
            model: {
                payment_date: '2022-12-12',
                formControl: {
                    pristine: false,
                    touched: false,
                },
            },
            defaultValue: undefined,
        };
        fields[0].expressions['model.payment_date'](field3);

        const currencyField = {
            model: {
                currency: 'Test Currency',
            },
        };
        fields[1].expressions['model.currency'](currencyField);

        const amountField = {
            model: {
                amount: 1000,
            },
        };
        fields[2].expressions['model.amount'](amountField);

        const paymentMethodField = {
            model: {
                payment_method: 'payment method',
            },
        };
        fields[3].expressions['model.payment_method'](paymentMethodField);

        service.fields();
        service.responseFunction(['results']);
        service.catchErrorFunction();
        expect(service.fields).toHaveBeenCalled();
    }));
});

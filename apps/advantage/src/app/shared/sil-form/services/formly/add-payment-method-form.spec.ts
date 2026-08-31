import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AddPaymentMethodService } from './add-payment-method-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
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

describe('AddPaymentMethodService', () => {
    let service: AddPaymentMethodService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AddPaymentMethodService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AddPaymentMethodService);
    });

    it('should test setComponent and fields functions', () => {
        const comp = {
            model: {
                business_partner: 1,
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        expect(fields).toBeInstanceOf(Array);
        service.catchErrorFunction();
        service.responseFunction({ results: [] });
        expect(service.fields).toHaveBeenCalled();
    });
});

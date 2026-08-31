import { CurrencyPipe } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { CreateSupplierPaymentRunFormService } from './supplier-payment-run-form';
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

describe('CreateSupplierPaymentRunFormService', () => {
    let service: CreateSupplierPaymentRunFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                CreateSupplierPaymentRunFormService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(CreateSupplierPaymentRunFormService);
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

        const partnerField = {
            model: {
                business_partner: 'Test Customer',
            },
        };
        fields[0].expressions['model.business_partner'](partnerField);

        service.selectedInvoice = '121';
        // test invoice field
        fields[1].expressions['model.invoice']();

        service.fields();
        service.invoicesResponseFunction({ results: [{ id: '121' }] });
        service.catchErrorFunction();
        service.tapFunction();
        service.tapLoading();

        expect(service.fields).toHaveBeenCalled();
    }));

    it('should test getInvoices method', () => {
        spyOn(service, 'getInvoices').and.callThrough();
        service.getInvoices();
        expect(service.getInvoices).toHaveBeenCalled();
    });

    it('should test switchMapInvoicesFunction method', () => {
        spyOn(service, 'switchMapInvoicesFunction').and.callThrough();
        service.switchMapInvoicesFunction();
        expect(service.switchMapInvoicesFunction).toHaveBeenCalled();
    });
});

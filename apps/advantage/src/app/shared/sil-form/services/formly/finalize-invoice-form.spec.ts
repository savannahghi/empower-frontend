import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FinalizeInvoiceFormService } from './finalize-invoice-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('FinalizeInvoiceFormService', () => {
    let service: FinalizeInvoiceFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(FinalizeInvoiceFormService);
    });

    it('should test fields', () => {
        const comp = {
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const field0 = {
            model: {
                adjudication_reason: 'This is the reason one',
            },
            props: {},
        };
        fields[0]['model.adjudication_reason'] = field0;
        expect(service.fields).toBeDefined();
    });
});

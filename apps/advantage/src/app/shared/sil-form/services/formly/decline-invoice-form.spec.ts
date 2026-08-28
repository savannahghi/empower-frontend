import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DeclineInvoiceFormService } from './decline-invoice-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('DeclineInvoiceFormService', () => {
    let service: DeclineInvoiceFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(DeclineInvoiceFormService);
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
                adjudication_reasons: 'This is the reason one',
            },
            props: {},
        };
        fields[0]['model.adjudication_reasons'] = field0;
        const field1 = {
            model: {
                adjudication_reason: 'This is the reason one',
            },
            props: {},
        };
        fields[1]['model.adjudication_reason'] = field1;
        expect(service.fields).toBeDefined();
    });
});

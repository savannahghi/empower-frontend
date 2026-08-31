import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SetupProviderPayerFormService } from './setup-provider-payer-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('SetupProviderPayerFormService', () => {
    let service: SetupProviderPayerFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(SetupProviderPayerFormService);
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
                payment_terms: 'Fixed rate',
            },
            props: {},
        };
        fields[0]['model.payment_terms'] = field0;

        const field1 = {
            model: {
                rate_amount: '222222222',
            },
            props: {},
        };
        fields[1]['model.rate_amount'] = field1;
        expect(service.fields).toBeDefined();
    });
});

import { TestBed, fakeAsync } from '@angular/core/testing';
import { LicensingService } from './payer-licensing-form';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('PayerLicensingForm', () => {
    let service: LicensingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                LicensingService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(LicensingService);
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
        service.fields();
        expect(service.fields).toHaveBeenCalled();
    }));
});

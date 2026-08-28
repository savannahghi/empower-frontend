import { TestBed, fakeAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MobileMoneySetupService } from './mobile-money-setup';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('MobileMoneySetupService', () => {
    let service: MobileMoneySetupService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                MobileMoneySetupService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(MobileMoneySetupService);
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

        const businessNumberField = {
            model: {
                business_number: '654332',
            },
        };
        const mobileMoneyTypeField = {
            model: {
                mobile_money_type: 'Test',
            },
        };
        const typeDescriptionField = {
            model: {
                type_description: 'Test Description',
            },
        };

        fields[0].expressions['model.business_number'](businessNumberField);
        fields[1].expressions['model.mobile_money_type'](mobileMoneyTypeField);
        fields[2].expressions['model.type_description'](typeDescriptionField);

        service.fields();
        expect(service.fields).toHaveBeenCalled();
    }));
});

import { TestBed, fakeAsync } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BankDetailsSetupService } from './bank-account-setup';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('BusinessDetailsRegistrationService', () => {
    let service: BankDetailsSetupService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                BankDetailsSetupService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(BankDetailsSetupService);
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

        const accountNameField = {
            model: {
                account_name: 'Test Name',
            },
        };
        const accountDescriptionField = {
            model: {
                account_description: 'Test Description',
            },
        };
        const bankNameField = {
            model: {
                bank_name: 'Test Bank',
            },
        };
        const branchField = {
            model: {
                branch: 'Test Branch',
            },
        };
        const accountNumberField = {
            model: {
                account_number: '123',
            },
        };

        fields[0].expressions['model.account_name'](accountNameField);
        fields[1].expressions['model.account_description'](
            accountDescriptionField
        );
        fields[2].expressions['model.bank_name'](bankNameField);
        fields[3].expressions['model.branch'](branchField);
        fields[4].expressions['model.account_number'](accountNumberField);

        service.fields();
        expect(service.fields).toHaveBeenCalled();
    }));
});

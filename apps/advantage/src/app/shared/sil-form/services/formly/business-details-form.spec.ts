import { TestBed, fakeAsync } from '@angular/core/testing';
import { BusinessDetailsRegistrationService } from './business-details-form';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('BusinessDetailsRegistrationService', () => {
    let service: BusinessDetailsRegistrationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                BusinessDetailsRegistrationService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(BusinessDetailsRegistrationService);
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

        const businessTypeField = {
            model: {
                business_type: 'LIMITED LIABILITY',
            },
        };
        const ownershipField = {
            model: {
                ownership: 'PUBLIC',
            },
        };
        const businessPartnerField = {
            model: {
                business_partner: '123',
            },
        };
        const bankNameField = {
            model: {
                bank_name: 'ABC',
            },
        };
        const bankBranchField = {
            model: {
                bank_branch: 'ABC',
            },
        };
        const accountNameField = {
            model: {
                account_name: 'ABC',
            },
        };
        const accountNumberField = {
            model: {
                account_number: '123',
            },
        };

        (fields[0].fieldGroup[0] as any).expressions['model.business_type'](
            businessTypeField
        );
        (fields[0].fieldGroup[1] as any).expressions['model.ownership'](
            ownershipField
        );
        (fields[0].fieldGroup[3] as any).expressions['model.business_partner'](
            businessPartnerField
        );
        (fields[2].fieldGroup[0] as any).expressions['model.bank_name'](
            bankNameField
        );
        (fields[2].fieldGroup[1] as any).expressions['model.bank_branch'](
            bankBranchField
        );
        (fields[2].fieldGroup[2] as any).expressions['model.account_name'](
            accountNameField
        );
        (fields[2].fieldGroup[3] as any).expressions['model.account_number'](
            accountNumberField
        );

        service.fields();
        expect(service.fields).toHaveBeenCalled();
    }));
});

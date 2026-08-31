import { TestBed } from '@angular/core/testing';
import { AddBankDetailsFormService } from './add-bank-details-form';

describe('AddBankDetailsFormService', () => {
    let service: AddBankDetailsFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AddBankDetailsFormService);
    });

    it('should test fields', () => {
        const comp = {
            model: {},
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };

        expect(service).toBeTruthy();
        service.setComponent(comp);

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const field0 = {
            model: {
                bank_name: 'KCB KENYA',
            },
            props: {},
        };
        fields[0]['model.bank_name'] = field0;

        const field1 = {
            model: {
                bank_branch: 'KISII',
            },
            props: {},
        };
        fields[1]['model.bank_branch'] = field1;

        const field2 = {
            model: {
                bank_account_name: 'Ritta',
            },
            props: {},
        };
        fields[2]['model.bank_account_name'] = field2;

        const field3 = {
            model: {
                account_number: 'KRA12345',
            },
            props: {},
        };
        fields[3]['model.account_number'] = field3;
    });
});

import { TestBed } from '@angular/core/testing';
import { AddBusinessDetailsFormService } from './add-business-details-form';

describe('AddBusinessDetailsFormService', () => {
    let service: AddBusinessDetailsFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AddBusinessDetailsFormService);
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
                legal_type: 'Partnership',
            },
            props: {},
        };
        fields[0]['model.legal_type'] = field0;

        const field1 = {
            model: {
                ownership_type: 'Private',
            },
            props: {},
        };
        fields[1]['model.ownership_type'] = field1;

        const field2 = {
            model: {
                legal_status: 'Partnership',
            },
            props: {},
        };
        fields[2]['model.legal_status'] = field2;

        const field3 = {
            model: {
                kra_pin: 'KRA12345',
            },
            props: {},
        };
        fields[3]['model.kra_pin'] = field3;
        expect(service.fields).toHaveBeenCalled();
    });
});

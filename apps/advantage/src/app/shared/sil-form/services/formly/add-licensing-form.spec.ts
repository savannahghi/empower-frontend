import { TestBed } from '@angular/core/testing';
import { AddLicensingFormService } from './add-licensing-form';

describe('AddLicensingFormService', () => {
    let service: AddLicensingFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AddLicensingFormService);
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
                license_type: 'Practitioner License',
            },
            props: {},
        };
        fields[0]['model.license_type'] = field0;

        const field1 = {
            model: {
                license_body: 'KMPDC',
            },
            props: {},
        };
        fields[1]['model.license_body'] = field1;

        const field2 = {
            model: {
                license_number: 'A1234',
            },
            props: {},
        };
        fields[2]['model.license_number'] = field2;

        const field3 = {
            model: {
                valid_from: '12 Jan 2017',
            },
            props: {},
        };
        fields[3]['model.valid_from'] = field3;

        const field4 = {
            model: {
                valid_to: '12 Jan 2017',
            },
            props: {},
        };
        fields[4]['model.valid_to'] = field4;
    });
});

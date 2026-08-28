import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AddPractitionerFormService } from './add-practitioner-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('AddPractitionerFormService', () => {
    let service: AddPractitionerFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AddPractitionerFormService);
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
                name: 'Dr. Muoki',
            },
            props: {},
        };
        fields[0]['model.name'] = field0;

        const field1 = {
            model: {
                specialty: 'Gynaecologist',
            },
            props: {},
        };
        fields[1]['model.specialty'] = field1;

        const field2 = {
            model: {
                id: '222222222',
            },
            props: {},
        };
        fields[2]['model.id'] = field2;

        const field3 = {
            model: {
                address: 'One Padmore Place',
            },
            props: {},
        };
        fields[3]['model.address'] = field3;

        const field4 = {
            model: {
                county: 'Nakuru',
            },
            props: {},
        };
        fields[4]['model.county'] = field4;

        const field5 = {
            model: {
                country: 'Kenya',
            },
            props: {},
        };
        fields[5]['model.country'] = field5;
        expect(fields).toBeDefined();
    });
});

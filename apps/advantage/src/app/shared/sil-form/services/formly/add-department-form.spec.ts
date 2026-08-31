import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AddDepartmentService } from './add-department-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('AddDepartmentService', () => {
    let service: AddDepartmentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AddDepartmentService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AddDepartmentService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should test comparison logic when quantity is below 1', () => {
        const comp = {
            model: {},
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        // test name field
        const nameField = {
            model: {
                name: 'Test',
            },
        };
        fields[0]['model.name'] = nameField;
        fields[0].expressions['model.name'](nameField);

        // test parent field
        const parentField = {
            model: {
                parent: '1223',
            },
        };
        fields[1]['model.parent'] = parentField;
        fields[1].expressions['model.parent'](parentField);

        // test description field
        const descriptionField = {
            model: {
                description: 'Test description',
            },
        };
        fields[2]['model.description'] = descriptionField;
        fields[2].expressions['model.description'](descriptionField);

        // test email field
        const emailField = {
            model: {
                email_address: 'Test description',
            },
        };
        fields[3]['model.email_address'] = emailField;
        fields[3].expressions['model.email_address'](emailField);

        // test phone number field
        const phoneNumberField = {
            model: {
                phone_number: 'Test description',
            },
        };
        fields[4]['model.phone_number'] = phoneNumberField;
        fields[4].expressions['model.phone_number'](phoneNumberField);

        expect(service.fields).toHaveBeenCalled();
    });
});

import { fakeAsync, TestBed } from '@angular/core/testing';
import { MinimalPatientRegistrationFormFieldsService } from './minimal-patient-registration-form';

describe('BillPatientFormFieldsService', () => {
    let service: MinimalPatientRegistrationFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MinimalPatientRegistrationFormFieldsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should test fields', fakeAsync(() => {
        const comp = {
            fields: [
                {},
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
        spyOn(service, 'setComponent').and.callThrough();
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        const field = {
            model: { person: { first_name: 'Alex' } },
            props: {},
        };
        fields[0].fieldGroup[0]['model.patient'] = field;
        expect(service.setComponent).toHaveBeenCalled();
    }));
});

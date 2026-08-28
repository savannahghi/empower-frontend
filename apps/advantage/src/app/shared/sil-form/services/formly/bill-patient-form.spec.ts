import { TestBed } from '@angular/core/testing';
import { BillPatientFormFieldsService } from './bill-patient-form';

describe('BillPatientFormFieldsService', () => {
    let service: BillPatientFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BillPatientFormFieldsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should test fields', () => {
        const comp = {
            fields: [
                {
                    props: {},
                },
                {},
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        expect(service).toBeTruthy();
        service.setComponent(comp);

        spyOn(service, 'fields').and.callThrough();

        const fields = service.fields();

        const field = {
            model: { patient: 'test' },
            props: {},
        };
        fields[0].props.buttonEvent();
        fields[0]['model.patient'] = field;
        fields[1]['model.queue'] = field;

        expect(service.fields).toHaveBeenCalled();
    });
});

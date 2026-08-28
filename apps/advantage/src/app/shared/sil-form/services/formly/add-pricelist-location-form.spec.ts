import { TestBed } from '@angular/core/testing';
import { AddPricelistLocationFormService } from './add-pricelist-location-form';
import { FormlyFieldConfig } from '@ngx-formly/core';

describe('AddPricelistLocationFormService', () => {
    let service: AddPricelistLocationFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AddPricelistLocationFormService],
        });
        service = TestBed.inject(AddPricelistLocationFormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the component instance', () => {
        const comp = {
            model: {},
            fields: [{}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        expect(service.component).toBe(comp);
    });

    it('should return correct formly fields', () => {
        const fields = service.fields();
        expect(Array.isArray(fields)).toBeTrue();
        expect(fields.length).toBe(1);

        const field: FormlyFieldConfig = fields[0];
        expect(field.key).toBe('location');
        expect(field.type).toBe('combobox');
        expect(field.className).toBe('col-12 mb-4');
        expect(field.props.label).toBe('Select Location');
        expect(field.props.placeholder).toBe('Select or type to search');
        expect(field.props.store).toBe('org-units');
        expect(field.props.responseKey).toBe('results');
        expect(field.props.extendParams).toEqual({
            active: true,
            orgunit_type: 'branch',
        });
        expect(field.props.bindLabel).toEqual([{ key: 'name', newline: true }]);
        expect(field.props.bindValue).toBe('id');
        expect(field.props.required).toBeTrue();
    });
});

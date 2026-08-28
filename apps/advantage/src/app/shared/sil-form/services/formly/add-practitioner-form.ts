import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import countries from './../../../../../assets/data/countries.json';
import specialties from './../../../../../assets/data/specialty.json';
import counties from '../../../../../../src/app/features/healthcrm/facilities/facility-list/counties.json';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines add transfer item form controls, methods
 */
export class AddPractitionerFormService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */

    fields() {
        return [
            {
                key: 'name',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Practitioner Name',
                    placeholder: 'Enter your full name',
                    required: true,
                },
            },
            {
                key: 'specialty',
                type: 'select',
                className: 'col-12',
                props: {
                    label: 'Specialty',
                    placeholder: 'Enter your specialty',
                    options: specialties,
                    bindValue: 'value',
                    bindLabel: 'name',
                    required: true,
                    closeOnSelect: true,
                },
            },
            {
                key: 'id',
                type: 'input',
                className: 'col-12',
                props: {
                    placeholder:
                        'Enter any of your identity card here i.e govt. ID',
                    label: 'National Identity',
                },
            },
            {
                key: 'address',
                type: 'input',
                className: 'col-6',
                props: {
                    label: 'Address',
                    placeholder: 'Enter location of your facility',
                    required: true,
                },
            },
            {
                key: 'county',
                type: 'select',
                className: 'ps-3 col-6',
                props: {
                    label: 'County',
                    placeholder: 'County',
                    required: true,
                    options: counties,
                    bindValue: 'value',
                    bindLabel: 'name',
                },
            },
            {
                key: 'country',
                type: 'select',
                className: 'col-12',
                props: {
                    label: 'Country',
                    placeholder: 'Select your country',
                    options: countries,
                    bindValue: 'code',
                    bindLabel: 'country',
                },
            },
        ];
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

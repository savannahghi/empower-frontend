import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines add transfer item form controls, methods
 */
export class AddLicensingFormService {
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
                key: 'license_type',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'License Type',
                    placeholder: 'Enter license type',
                    required: true,
                },
            },
            {
                key: 'license_body',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'License Body',
                    placeholder: 'Enter license body',
                    required: true,
                },
            },
            {
                key: 'license_number',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'License Number',
                    placeholder: 'Enter license number',
                    required: true,
                },
            },
            {
                key: 'valid_from',
                type: 'input',
                className: 'col-6',
                props: {
                    label: 'Valid from Date',
                    type: 'date',
                    required: true,
                },
            },
            {
                key: 'valid_to',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    label: 'Valid To date',
                    type: 'date',
                    required: true,
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

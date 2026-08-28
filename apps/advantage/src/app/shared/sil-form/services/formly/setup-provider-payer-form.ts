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
export class SetupProviderPayerFormService {
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
                key: 'payment_terms',
                type: 'select',
                className: 'col-12',
                props: {
                    placeholder: 'Enter payment terms',
                    label: 'Payment terms',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Fixed Rate',
                            value: 'fixed_rate',
                        },
                        {
                            title: 'Variable Rate',
                            value: 'variable_rate',
                        },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                    multiple: false,
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
                expressions: {},
            },
            {
                key: 'rate_amount',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Rate amount',
                    placeholder: 'Enter rate amount',
                    required: false,
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

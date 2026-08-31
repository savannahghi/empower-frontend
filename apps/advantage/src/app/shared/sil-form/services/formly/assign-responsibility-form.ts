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
export class AssignResponsibilityFormService {
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
                key: 'responsibility',
                type: 'select',
                className: 'col-12',
                props: {
                    placeholder: 'Select provider, payer or shared',
                    label: 'Assign responsibilities',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Payer',
                            value: 'PAYER',
                        },
                        {
                            title: 'Provider',
                            value: 'PROVIDER',
                        },
                        {
                            title: 'Shared',
                            value: 'SHARED',
                        },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                    multiple: false,
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

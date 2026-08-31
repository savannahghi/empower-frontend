import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the form registration service
 */
export class DirectSalesOrderService {
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     * Stores form data from api
     */
    model: any = {};

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'required_by',
                type: 'datepicker',
                className: 'col-12',
                props: {
                    label: 'Required By',
                    required: true,
                },
                expressions: {
                    'model.required_by': field => {
                        if (field?.model?.required_by) {
                            return field?.model?.required_by;
                        }
                    },
                },
            },

            {
                key: 'customer',
                type: 'combobox',
                className: 'col-12 me-2',
                props: {
                    placeholder: 'Enter customer...',
                    label: 'Search for customer',
                    store: 'customers',
                    responseKey: 'results',

                    bindLabel: [
                        {
                            key: 'partner_name',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    'model.customer': field => {
                        if (field?.model?.customer) {
                            return field?.model?.customer;
                        }
                    },
                },
            },

            {
                key: 'description',
                type: 'textarea',
                className: 'col-12',
                props: {
                    label: 'Description',
                    required: true,
                },
                expressions: {
                    'model.description': field => {
                        if (field?.model?.description) {
                            return field?.model?.description;
                        }
                    },
                },
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

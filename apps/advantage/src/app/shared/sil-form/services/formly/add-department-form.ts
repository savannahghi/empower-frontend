import { Injectable } from '@angular/core';

/**
 * Allows service to be injectable into formly commponent
 */
@Injectable({
    providedIn: 'root',
})

/** Class that definesform controls */
export class AddDepartmentService {
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
                    placeholder: 'Department',
                    label: 'Department Name',
                    required: true,
                },
                expressions: {
                    'model.name': field => {
                        if (field?.model?.name) {
                            return field?.model?.name;
                        }
                    },
                },
            },
            {
                key: 'parent',
                type: 'combobox',
                className: 'col-12',
                props: {
                    placeholder: 'Branch',
                    label: 'Branch',
                    store: 'branches',
                    responseKey: 'results',
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    'model.parent': field => {
                        if (field?.model?.parent) {
                            return field?.model?.parent;
                        }
                    },
                },
            },
            {
                key: 'description',
                type: 'textarea',
                className: 'col-12',

                props: {
                    placeholder: 'Description',
                    label: 'Description',
                },
                expressions: {
                    'model.description': field => {
                        if (field?.model?.description) {
                            return field?.model?.description;
                        }
                    },
                },
            },
            {
                key: 'email_address',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Email Address',
                    pattern: '.+@.+..+',
                    placeholder: 'Email address',
                    required: true,
                },

                expressions: {
                    'model.email_address': field => {
                        if (field?.model?.email_address) {
                            return field?.model?.email_address;
                        }
                    },
                },
            },
            {
                key: 'phone_number',
                type: 'phonenumber',
                className: 'col-12 col-sm-4 px-sm-2',
                props: {
                    label: 'Phone Number',
                    placeholder: 'Phone Number',
                    required: true,
                },
                expressions: {
                    'model.phone_number': field => {
                        if (field?.model?.phone_number) {
                            return field?.model?.phone_number;
                        }
                    },
                },
            },
            {
                key: 'orgunit_type',
                defaultValue: 'dept',
                className: 'hidden',
                type: 'input',
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

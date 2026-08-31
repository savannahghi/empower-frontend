import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class ClusterOrganisationUnitService {
    /**
     * Stores form data from api
     */
    model: Object;

    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     *
     * @param authConfig   Authorization service
     * @param datalayer datalayer service
     */

    constructor(
        public authConfig: Authorization,
        public auth: AuthenticationService
    ) {}

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
                    label: 'Name',
                    placeholder: 'Enter name of the cluster',
                    required: true,
                    minLength: 3,
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'description',
                type: 'textarea',
                className: 'col-12',
                props: {
                    label: 'Description',
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'phone_number',
                type: 'phonenumber',
                className: 'col-6',
                props: {
                    required: true,
                    label: 'Phone Number',
                },
            },
            {
                key: 'email_address',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    required: true,
                    type: 'email',
                    label: 'Email',
                },
            },
            {
                key: 'physical_address',
                type: 'input',
                className: 'col-6',
                props: {
                    required: true,
                    label: 'Physical Address',
                },
            },
            {
                key: 'postal_address',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    required: true,
                    label: 'Postal Address',
                },
            },
            {
                type: 'repeat',
                key: 'identifiers',
                className: 'row col-12 ms-0',
                fieldArray: {
                    props: {
                        btnText: 'Add Identifier',
                        hasIcon: true,
                        min: 1,
                        model: [],
                    },
                    fieldGroup: [
                        {
                            key: 'identifier_type',
                            type: 'input',
                            defaultValue: 'kraPIN',
                            className: 'col-6',
                            props: {
                                label: 'ID Type',
                                required: true,
                                closeOnSelect: true,
                            },
                            modelOptions: {
                                updateOn: 'blur',
                                debounce: {
                                    default: 100,
                                },
                            },
                        },
                        {
                            key: 'identifier_value',
                            className: 'ps-3 col-6',
                            type: 'input',
                            props: {
                                label: 'ID Number',
                                placeholder: 'Enter ID Number',
                                required: true,
                            },
                            modelOptions: {
                                updateOn: 'blur',
                                debounce: {
                                    default: 100,
                                },
                            },
                        },
                    ],
                },
            },
            {
                key: 'use_cluster_doc_details',
                type: 'checkbox',
                hideExpression: '!model.id',
                className: 'col-12 col-sm col-xs-12 ms-2 ps-sm-1 pe-sm-2',
                props: {
                    label: 'Would you like to use cluster details to send invoices?',
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}

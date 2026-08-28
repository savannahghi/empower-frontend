import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import countries from './../../../../../assets/data/countries.json';

@Injectable({
    providedIn: 'root',
})
export class UpdateOrganisationService {
    /**
     * Routing service
     */
    router: Router;

    /**
     * Stores form data from api
     */
    model: Object;

    /**
     * Stores user
     */
    user: Object;

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
     * @param _router  Router instance
     * @param datalayer datalayer service
     */

    constructor(
        public authConfig: Authorization,
        protected _router: Router,
        public auth: AuthenticationService
    ) {
        this.router = _router;
        this.user = this.authConfig.getUser();
    }

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'organisation_name',
                type: 'input',
                className: 'col-6',
                props: {
                    label: 'Organisation Name',
                    placeholder: 'Enter organisation name',
                    required: true,
                    minLength: 3,
                },
                validation: {
                    messages: {
                        minLength: 'Name is too short',
                    },
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'web_address',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    label: 'Website',
                    placeholder: 'Enter the url of the website',
                },
            },
            {
                key: 'organisation_phone_number',
                type: 'input',
                className: 'col-6',
                props: {
                    required: true,
                    label: 'Phone Number',
                },
            },
            {
                key: 'organisation_email_address',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    required: true,
                    type: 'email',
                    label: 'Email',
                },
            },
            {
                key: 'postal_address',
                type: 'input',
                className: 'col-6',
                props: {
                    label: 'Postal Address',
                },
            },
            {
                key: 'physical_address',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    label: 'Physical Address',
                    placeholder: 'Enter the physical address',
                },
            },
            {
                key: 'tax_office',
                type: 'combobox',
                className: 'col-6',
                props: {
                    label: 'Tax Office',
                    placeholder: 'Select the tax office the org belongs to',
                    store: 'tax-offices',
                    responseKey: 'results',
                    bindLabel: [
                        {
                            key: 'name',
                        },
                    ],
                    bindValue: 'id',
                },
            },
            {
                key: 'organisation_country',
                type: 'select',
                className: 'ps-3 col-6',
                props: {
                    label: 'Country',
                    placeholder: 'Select the country',
                    options: countries,
                    bindValue: 'code',
                    bindLabel: 'country',
                },
            },
            {
                className: 'p-0 col-12',
                expressionProperties: {
                    template: () => {
                        const template = `<div class="col-12">
                                    <div class="fw-semibold">
                                        Organisation Identifiers
                                    </div>
                                    <hr>
                                </div>
                            </div>`;
                        return template;
                    },
                },
            },
            {
                type: 'repeat',
                key: 'identifiers',
                className: 'row col-12 ms-0 col-sm-4 w-50',
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
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}

import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class UpdateOrgBranchBasicDetailsService {
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
                key: 'name',
                type: 'input',
                className: 'col-6',
                props: {
                    label: 'Branch Name',
                    placeholder: 'Enter branch name',
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
                key: 'parent_name',
                type: 'combobox',
                className: 'ps-3 col-6',
                props: {
                    label: 'Parent Cluster',
                    store: 'clusters',
                    responseKey: 'results',
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                        },
                        {
                            key: 'phone_number',
                            class: 'pe-1',
                            label: 'Phone',
                        },
                        {
                            key: 'email_address',
                            label: 'Email',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    'model.parent_name': field => {
                        return field?.model?.parent;
                    },
                },
            },
            {
                key: 'phone_number',
                type: 'input',
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
                    label: 'Physical Address',
                    placeholder: 'Enter the physical address',
                },
            },
            {
                key: 'postal_address',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    label: 'Postal Address',
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}

/**
 * List of import used in the injectable
 */
import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

/**
 * Allows service to be injectable into formly component
 */

@Injectable({
    providedIn: 'root',
})
export class AddMessageTemplateService {
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
        public dataLayer: SilStoresService,
        public auth: AuthenticationService
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */

    fields() {
        return [
            {
                className: 'row col-12 mt-3 ms-3',
                fieldGroup: [
                    {
                        key: 'name',
                        type: 'input',
                        className: 'col-12',
                        props: {
                            label: 'Name',
                            placeholder: 'Name your template',
                            required: true,
                            min: 3,
                            minLength: 3,
                        },
                        expressions: {
                            'model.name': field => {
                                this.model = field.model;
                                return field.model.name;
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
                        key: 'message_type',
                        defaultValue: 'SINGULAR',
                        type: 'select',
                        className: 'col-12',
                        props: {
                            label: 'Category',
                            bindLabel: 'label',
                            options: [
                                { label: 'SINGULAR', value: 'SINGULAR' },
                                { label: 'SEQUENCED', value: 'SEQUENCED' },
                            ],
                            required: true,
                            bindValue: 'value',
                            searchable: true,
                            closeOnSelect: true,
                        },
                        expressions: {
                            'model.message_type': field => {
                                this.model = field.model;
                                return field.model.message_type;
                            },
                        },
                    },
                    {
                        key: 'template',
                        type: 'textarea',
                        className: 'col-12',
                        props: {
                            label: 'Template',
                            placeholder:
                                'Good morning {first_name},we wish you good health.Remember to drink lots of water to hydrate yourself today',
                            required: true,
                            rows: 5,
                            minLength: 6,
                            max: 160,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                ],
            },
        ];
    }

    /**
     * Sets the form component
     */
    setComponent(component) {
        this.component = component;
    }
}

import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';

@Injectable({
    providedIn: 'root',
})
export class AddRecipientService {
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
                key: 'user',
                type: 'combobox',
                className: 'ps-3 col-12',
                props: {
                    label: 'Recipient',
                    placeholder: 'Select or type to search',
                    store: 'auth-erp-users',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        page_size: '10',
                    },
                    bindLabel: [
                        {
                            key: 'full_name',
                            newline: false,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
            },
            {
                key: 'location',
                type: 'combobox',
                className: 'ps-3 col-12',
                props: {
                    label: 'Location',
                    placeholder: 'Select or type to search',
                    store: 'inventory-locations',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        location_type: 'internal',
                    },
                    bindLabel: [
                        {
                            key: 'branch_name',
                            newline: true,
                        },
                    ],
                    bindValue: 'branch',
                    required: true,
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}

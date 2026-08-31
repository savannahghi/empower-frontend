import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';

@Injectable({
    providedIn: 'root',
})
export class RecordAdjustmentFormService {
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
     * @param datalayer datalayer service
     */

    constructor(
        public dataLayer: SilStoresService,
        public authConfig: Authorization,
        public auth: AuthenticationService
    ) {
        this.user = this.authConfig.getUser();
    }

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'inventory_reference',
                type: 'input',
                className: 'col-6',
                props: {
                    label: 'Adjustment Name',
                    placeholder: 'Please enter adjustment name',
                    required: true,
                },
            },
            {
                key: 'location',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    label: 'Location',
                    required: true,
                },
                expressions: {
                    'props.disabled': field => {
                        if (field?.model?.location) {
                            return field?.model?.location;
                        }
                    },
                },
            },
            {
                key: 'reason',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Adjustment Reason',
                    placeholder: 'Please enter adjustment reason',
                    required: true,
                },
            },
            {
                key: 'description',
                type: 'textarea',
                className: 'col-12',
                props: {
                    placeholder: 'Enter the description of the adjustment',
                    label: 'Description',
                },
            },
            {
                key: 'bulk_upload',
                type: 'checkbox',
                className: 'col-12',
                defaultValue: false,
                props: {
                    label: 'Record A Bulk Upload',
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}

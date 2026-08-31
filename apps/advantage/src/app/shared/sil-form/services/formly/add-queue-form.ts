import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';

@Injectable({
    providedIn: 'root',
})
export class AddQueueService {
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
                key: 'name',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Name of queue',
                    disabled: false,
                    required: false,
                },
            },
            {
                key: 'queue_type',
                type: 'select',
                className: 'col-12',
                props: {
                    label: 'Queue type',
                    bindLabel: 'label',
                    options: [
                        { label: 'Triage', value: 'TRIAGE' },
                        { label: 'Consulation', value: 'CONSULTATION' },
                        { label: 'Billing', value: 'BILLING' },
                        { label: 'Laboratory', value: 'LAB' },
                        { label: 'Pharmacy', value: 'PHARMACY' },
                        { label: 'Procedure', value: 'PROCEDURE' },
                        { label: 'Laboratory', value: 'LAB' },
                        { label: 'Imaging', value: 'IMAGING' },
                        { label: 'Optical', value: 'OPTICAL' },
                        {
                            label: 'Breast Cancer Screening',
                            value: 'BREAST CANCER SCREENING',
                        },
                        {
                            label: 'Cervical Cancer Screening',
                            value: 'CERVICAL CANCER SCREENING',
                        },
                        {
                            label: 'Cancer Screening',
                            value: 'CANCER SCREENING',
                        },
                    ],
                    multiple: false,
                    required: true,
                },
            },
            {
                key: 'active',
                type: 'checkbox',
                className: 'col-12',
                props: {
                    label: 'Set if active',
                    required: false,
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}

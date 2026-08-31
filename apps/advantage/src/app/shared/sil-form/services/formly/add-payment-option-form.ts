import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the app payment option service
 */
export class AddPaymentOption {
    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                className: 'w-100',
                fieldGroup: [
                    {
                        type: 'datepicker',
                        key: 'license_expiration_date',
                        className: 'w-75 m-auto',
                        templateOptions: {
                            label: 'License Expiration Date',
                            dateFormat: 'YYYY-MM-DD',
                            required: false,
                        },
                    },
                    {
                        type: 'file',
                        key: 'license_doc',
                        className: 'w-75 m-auto',
                        templateOptions: {
                            label: 'License from MOH',
                            required: true,
                        },
                    },
                ],
            },
        ];
    }

    /**
     * setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

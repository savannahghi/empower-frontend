import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class EtimsInitializeDeviceService {
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
                key: 'etims_web_address',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'VSCU URL',
                    placeholder: 'Enter your VSCU URL',
                },
            },
            {
                key: 'etims_branch_id',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'eTIMS Branch ID',
                    placeholder: 'Enter your eTIMS Branch ID',
                },
            },
            {
                key: 'etims_device_serial_no',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'eTIMS Device Serial Number',
                    placeholder: 'Enter your eTIMS Device Serial Number',
                },
            },
            {
                key: 'username',
                type: 'input',
                className: 'col-12',
                props: {
                    attributes: {
                        autocomplete: 'off',
                    },
                    label: 'Branch Username',
                    placeholder: 'Enter your branch username',
                },
            },
            {
                key: 'password',
                type: 'input',
                className: 'col-12',
                props: {
                    attributes: {
                        autocomplete: 'off',
                    },
                    type: 'password',
                    label: 'Branch Password',
                    placeholder: 'Enter your branch password',
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}

import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../sil-http-services/error-handler';
import countries from './../../../../../assets/data/countries.json';
import businessPartners from './../../../../../assets/data/businessPartners.json';

@Injectable({
    providedIn: 'root',
})
export class UpdateOrgBranchCustomerService {
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
     * Store business partners state
     */
    businessPartners: any;

    /**
     *
     * @param authConfig   Authorization service
     * @param _router  Router instance
     * @param datalayer datalayer service
     */

    constructor(
        public dataLayer: SilStoresService,
        public authConfig: Authorization,
        protected _router: Router,
        public auth: AuthenticationService,
        private errorHandler: ErrorHandlerService
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
                key: 'slade_code',
                type: 'input',
                className: 'col-12',
                props: {
                    required: false,
                    label: 'Slade Code',
                    placeholder: 'Enter Slade Code',
                },
            },
            {
                key: 'partner_name',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Customer Name',
                    placeholder: 'Please enter name of the customer',
                    required: true,
                    min: 3,
                    minLength: 3,
                },
            },
            {
                key: 'customer_type',
                type: 'select',
                className: 'col-12',
                props: {
                    placeholder: 'Please select the Customer Type',
                    label: 'Customer Type',
                    required: true,
                    options: businessPartners,
                    bindLabel: 'partnerName',
                    bindValue: 'partnerId',
                    closeOnSelect: true,
                },
            },
            {
                key: 'customer_tax_pin',
                type: 'input',
                className: 'col-12',
                props: {
                    required: false,
                    label: 'KRA PIN',
                    placeholder: 'Enter KRA PIN',
                    min: 11,
                    minLength: 11,
                },
            },
            {
                key: 'country',
                type: 'select',
                defaultValue: 'KEN',
                className: 'col-6',
                props: {
                    label: 'Country',
                    placeholder: 'Select the country',
                    options: countries,
                    bindValue: 'code',
                    bindLabel: 'country',
                    required: true,
                    closeOnSelect: true,
                },
            },
            {
                key: 'currency',
                type: 'combobox',
                className: 'ps-3 col-6',
                props: {
                    placeholder: 'Enter your currency',
                    label: 'Currency',
                    store: 'currencys',
                    responseKey: 'results',
                    useStateParamFilters: true,
                    bindLabel: [
                        {
                            key: 'name',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                    closeOnSelect: true,
                },
            },
            {
                key: 'phone_number',
                type: 'phonenumber',
                className: 'col-7',
                props: {
                    label: 'Phone Number',
                },
            },
            {
                key: 'email_address',
                type: 'input',
                className: 'ps-3 col-5',
                props: {
                    type: 'email',
                    label: 'Email',
                    placeholder: 'Enter your email address',
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}

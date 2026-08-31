import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { AsyncValidatorService } from '../../../component-services/async-validator.service';

@Injectable({
    providedIn: 'root',
})
export class NewSupplierFieldsService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Organisation ID
     */
    organisationID: string;

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public silCurrencyPipe: SilCurrencyPipe,
        public auth: AuthenticationService,
        public uiglobals: UIRouterGlobals,
        public authServ: Authorization,
        public asyncValidatorService: AsyncValidatorService
    ) {
        this.silCurrencyPipe = silCurrencyPipe;
    }

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */

    fields() {
        return [
            {
                key: 'partner_name',
                type: 'input',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2',
                props: {
                    placeholder: 'Enter the suppliers name',
                    label: 'Name',
                    searchable: false,
                    required: true,
                },

                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'supplier_type',
                type: 'select',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2',
                props: {
                    label: 'Business Partner Type',
                    placeholder: 'Select business partner type',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        { title: 'Lender', value: 'LENDER' },
                        { title: 'Catering', value: 'CATERING' },
                        { title: 'Employer', value: 'EMPLOYER' },
                        { title: 'Furniture', value: 'FURNITURE' },
                        {
                            title: 'Information Technology',
                            value: 'INFORMATION_TECHNOLOGY',
                        },
                        { title: 'Insurance', value: 'INSURANCE' },
                        { title: 'Legal', value: 'LEGAL' },
                        {
                            title: 'Medical Equipment',
                            value: 'MEDICAL_EQUIPMENT',
                        },
                        { title: 'Nutrition', value: 'NUTRITION' },
                        { title: 'Patient', value: 'PATIENT' },
                        { title: 'Pharmaceutical', value: 'PHARMACEUTICAL' },
                        { title: 'Stationery', value: 'STATIONERY' },
                        { title: 'Transport', value: 'TRANSPORT' },
                        {
                            title: 'Medical Service Provider',
                            value: 'PROVIDER',
                        },
                        { title: 'Rent', value: 'RENT' },
                        {
                            title: 'Statutory Deductions',
                            value: 'STATUTORY_DEDUCTIONS',
                        },
                        { title: 'Other', value: 'OTHER' },
                    ],
                    required: true,
                },
                expressions: {},
            },

            {
                key: 'country',
                type: 'select',
                defaultValue: 'KEN',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2',
                props: {
                    label: 'Country',
                    bindLabel: 'title',
                    bindValue: 'value',
                    placeholder: 'Select the country origin',
                    options: [
                        { title: 'Kenya', value: 'KEN' },
                        {
                            title: 'Argentina',
                            value: 'ARG',
                        },
                        {
                            title: 'Armenia',
                            value: 'ARM',
                        },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {},
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 100,
                    },
                },
            },
            {
                key: 'physical_address',
                type: 'input',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2',
                props: {
                    label: 'Postal/Physical Address',
                    placeholder: 'Enter physical address',
                    rows: 2,
                    required: false,
                    prefillFields: { name: 'physical_address' },
                },
            },
            {
                key: 'currency',
                type: 'combobox',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2',
                defaultValue: 'f6e049a0-10fd-4d9f-8470-571c9efa546c',
                props: {
                    label: 'Credit Limit',
                    placeholder: 'Select business partner type',
                    store: 'currencys',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                    },
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                            class: 'fw-semibold',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {},
            },
            {
                key: 'credit_limit',
                type: 'input',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2',
                props: {
                    placeholder: 'Enter credit limit',
                    label: 'Credit Limit',
                    searchable: false,
                },

                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'is_supplier',
                type: 'input',
                defaultValue: true,
                className: 'hidden',
                props: {
                    label: 'Is supplier available?',
                    inline: true,
                    required: false,
                    bindValue: 'value',
                    options: [
                        {
                            label: 'Yes',
                            value: true,
                        },
                        {
                            label: 'No',
                            value: false,
                        },
                    ],
                },
            },
            {
                key: 'is_customer',
                type: 'input',
                defaultValue: false,
                className: 'hidden',
                props: {
                    label: 'Is customer available?',
                    inline: true,
                    required: false,
                    bindValue: 'value',
                    options: [
                        {
                            label: 'Yes',
                            value: true,
                        },
                        {
                            label: 'No',
                            value: false,
                        },
                    ],
                },
            },
        ];
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;

        const erpOrg = this.authServ.getErpOrganisation();
        this.organisationID = erpOrg?.organisation_id;
    }
}

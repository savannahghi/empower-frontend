import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import type { NewSalesPricelistModel } from '../../../../features/advantage/models/NewSalesPricelist.model';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { AbstractControl } from '@angular/forms';
import moment from 'moment';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { AsyncValidatorService } from '../../../component-services/async-validator.service';

@Injectable({
    providedIn: 'root',
})
export class NewSalesPricelistFieldsService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: NewSalesPricelistModel;

    /**
     * Organisation ID
     */
    organisationID: string;

    pricelistDetails;

    /**
     * Duplicate pricelist name error message
     */
    duplicatePricelistMessage =
        'A Sales Pricelist by the same name already exists. Please create one with a different name and proceed.';

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
                key: 'pricelist_type',
                type: 'select',
                className: 'col-sm-12 col-12 pe-sm-1',
                props: {
                    placeholder: 'Select or type to search',
                    bindLabel: 'title',
                    bindValue: 'value',
                    label: 'Pricelist category',
                    options: [
                        {
                            title: 'Sales',
                            value: 'sales',
                        },
                        { title: 'Purchases', value: 'purchases' },
                    ],
                    searchable: true,
                    closeOnSelect: true,
                    required: true,
                    prefillFields: { name: 'pricelist_type' },
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'name',
                type: 'input',
                className: 'col-sm-12 col-12 pe-sm-1',
                props: {
                    placeholder: 'Enter Pricelist name',
                    label: 'Name',
                    required: true,
                    prefillFields: { name: 'name' },
                },
                asyncValidators: {
                    uniqueItem: {
                        expression: (control: AbstractControl) => {
                            const stateParamsID = this.uiglobals?.params?.id;
                            const term = control?.value;
                            const params = {
                                name: term,
                                organisation: this.organisationID,
                            };

                            return this.asyncValidatorService.validateUniquenessEditMode(
                                {
                                    store: 'pricelists',
                                    stateParamsID,
                                    params,
                                }
                            );
                        },
                        message: this.duplicatePricelistMessage,
                    },
                },

                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'effective_from',
                type: 'datepicker',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2',
                props: {
                    label: 'Valid from Date',
                    type: 'text',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                    required: true,
                    min: moment().startOf('day'),
                    prefillFields: { name: 'effective_from' },
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'effective_to',
                type: 'datepicker',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2',
                props: {
                    label: 'Valid To Date',
                    type: 'text',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                    required: true,
                    prefillFields: { name: 'effective_to' },
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
                expressions: {
                    'props.min': field => {
                        if (field?.model?.effective_from) {
                            return moment(field.model.effective_from);
                        }
                        return moment().add(1, 'days');
                    },
                },
            },
            {
                type: 'template',
                className: 'flex text-muted mb-4 fs-8 fw-light fst-italic',
                props: {
                    template:
                        "The validity period for this sales pricelist places constraints within which it is usable. Please make sure that the 'Valid From' date is quoted earlier than the 'Valid To' date.",
                },
            },
            {
                key: 'description',
                type: 'textarea',
                className: 'col-12',
                props: {
                    label: 'Description',
                    rows: 2,
                    required: false,
                    prefillFields: { name: 'description' },
                },
            },
            {
                key: 'is_internal_pricelist',
                type: 'checkbox',
                className: 'flex mb-3',
                props: {
                    label: 'Internal Pricelist',
                    required: false,
                    prefillFields: { name: 'is_internal_pricelist' },
                },
            },
            {
                key: 'pricelist_status',
                type: 'select',
                className: 'col-12 mb-4',
                props: {
                    placeholder: 'Select or type to search',
                    label: 'Select Pricelist Type',
                    bindLabel: 'title',
                    bindValue: 'value',
                    searchable: true,
                    closeOnSelect: true,
                    required: true,
                    prefillFields: { name: 'pricelist_status' },
                },
                expressions: {
                    'props.options': field => {
                        if (field.model.pricelist_type === 'sales') {
                            return [
                                {
                                    title: 'Default',
                                    value: 'default',
                                },
                                { title: 'Locational', value: 'locational' },
                                {
                                    title: 'Customer/Supplier',
                                    value: 'partner_specific',
                                },
                                {
                                    title: 'Promotional',
                                    value: 'promotional',
                                },
                                {
                                    title: 'Navigator',
                                    value: 'navigator',
                                },
                            ];
                        } else {
                            return [
                                {
                                    title: 'Default',
                                    value: 'default',
                                },
                                {
                                    title: 'Supplier',
                                    value: 'partner_specific',
                                },
                            ];
                        }
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
                type: 'template',
                className: 'flex text-muted mb-2 fs-8 fw-light fst-italic',
                props: {
                    template:
                        'Choose business partner type (Supplier or Customer).',
                },
                expressions: {
                    hide: field => {
                        return (
                            field.model.pricelist_status !==
                                'partner_specific' ||
                            field.model.pricelist_type === 'purchases'
                        );
                    },
                },
            },
            /**
             * Used to select business partner type ie. supplier or customer
             * NOTE: We may need to store the business partner type so that we inform the selection on the UI
             */
            {
                key: 'business_partner_type',
                type: 'select',
                className: 'col-12 mb-4',
                props: {
                    placeholder: 'Select business partner type',
                    label: 'Select Business Partner Type',
                    bindLabel: 'title',
                    options: [
                        {
                            title: 'Customer',
                            value: 'customer',
                        },
                        {
                            title: 'Supplier',
                            value: 'supplier',
                        },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
                expressions: {
                    hide: field => {
                        return (
                            field.model.pricelist_status !==
                                'partner_specific' ||
                            field.model.pricelist_type === 'purchases'
                        );
                    },
                },
            },

            /**
             *  Displays if business_partner_type is customer
             */
            {
                key: 'business_partner',
                type: 'combobox',
                className: 'col-12 mb-4',
                props: {
                    label: 'Select Customer',
                    placeholder: 'Select or type to search',
                    store: 'customers',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        fields: 'id,partner_name,town,country,physical_address',
                    },
                    bindLabel: [
                        {
                            key: 'partner_name',
                            newline: true,
                        },
                        {
                            key: 'country',
                        },
                    ],
                    prefillFields: { business_partner: 'partner_name' },
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    hide: field => {
                        return (
                            field.model.business_partner_type !== 'customer' ||
                            !field.model.business_partner_type
                        );
                    },
                },
            },
            /**
             *  Displays if business_partner_type is supplier
             */
            {
                key: 'business_partner',
                type: 'combobox',
                className: 'col-12 mb-4',
                props: {
                    label: 'Select Supplier',
                    placeholder: 'Select or type to search',
                    store: 'suppliers',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        fields: 'id,partner_name,town,country,physical_address',
                    },
                    bindLabel: [
                        {
                            key: 'partner_name',
                            newline: true,
                        },
                        {
                            key: 'country',
                            class: 'me-2',
                        },
                        {
                            key: 'physical_address',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    hide: field => {
                        return (
                            (field.model.pricelist_type === 'sales' &&
                                field.model.business_partner_type !==
                                    'supplier') ||
                            (field.model.pricelist_type === 'sales' &&
                                !field.model.business_partner_type) ||
                            (field.model.pricelist_type === 'purchases' &&
                                field.model.pricelist_status !==
                                    'partner_specific') ||
                            !field.model.pricelist_type
                        );
                    },
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

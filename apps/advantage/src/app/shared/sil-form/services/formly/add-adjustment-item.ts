import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { FeatureFlagService } from 'app/@core/utils/feature.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines add transfer item form controls, methods
 */
export class AddAdjustmentItemService {
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
    model: Object;

    /**
     * Used to tie pricelists to a certain branch
     */
    branch: any;

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public currencyPipe: CurrencyPipe,
        public silCurrencyPipe: SilCurrencyPipe,
        public auth: AuthenticationService,
        public authorization: Authorization,
        public flagService: FeatureFlagService
    ) {
        this.silCurrencyPipe = silCurrencyPipe;
        this.branch =
            this.authorization.getWorkstation()?.workstation__org_unit__parent;
    }

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */

    fields() {
        return [
            {
                key: 'product',
                type: 'combobox',
                className: 'col-12 mb-2',
                props: {
                    label: 'Product',
                    placeholder: 'Select or type to search',
                    store: 'price-list-products',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        pricelist_branch_id: this.branch,
                        price_list: 'sales',
                    },
                    bindLabel: [
                        {
                            key: 'product_name',
                            newline: true,
                        },
                        {
                            key: 'remaining_quantity',
                            label: 'Remaining Stock',
                            newline: true,
                            class: 'fs-9',
                        },
                    ],
                    bindValue: 'product_id',
                    required: true,
                    setSelectedItemToModel: true,
                },
            },
            {
                key: 'quantity',
                type: 'input',
                className: 'col-sm-12 col-12 pe-sm-1',
                props: {
                    placeholder: 'Enter Quantity',
                    label: 'New Quantity',
                    required: true,
                },
            },
            {
                key: 'purchase_price',
                type: 'input',
                className: 'col-sm-12 col-12 pe-sm-1',
                props: {
                    placeholder: 'Purchase price of the product',
                    label: 'Purchase Price',
                    required: this.flagService.getForcedValue(
                        'prov_purchasePriceInAdjustmentFormRequired'
                    ),
                    type: 'number',
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
    }
}

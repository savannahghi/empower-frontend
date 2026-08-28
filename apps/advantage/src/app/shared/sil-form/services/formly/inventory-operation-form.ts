import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import moment from 'moment';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { FeatureFlagService } from '../../../../@core/utils/feature.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines add transfer item form controls, methods
 */
export class InventoryOperationService {
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
    model: any;

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
    }

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */

    fields() {
        return [
            {
                key: 'product_name',
                type: 'input',
                className: 'col-12 mb-2',
                props: {
                    label: 'Product',
                    placeholder: 'Select or type to search',
                    readonly: true,
                    disabled: true,
                },
            },
            {
                key: 'quantity',
                type: 'input',
                className: 'col-sm-6 col-12 pe-sm-3',
                props: {
                    label: 'Quantity Expected',
                    readonly: true,
                    disabled: true,
                },
            },
            {
                key: 'quantity_confirmed',
                type: 'input',
                className: 'col-sm-6 col-12',
                props: {
                    label: 'Quantity Confirmed',
                    placeholder: 'Enter quantity',
                    required: true,
                    type: 'number',
                    min: 0,
                },
                validators: {
                    quantity_confirmed: {
                        expression: () => this.fieldValidator(),
                    },
                },
            },
            {
                key: 'quantity_confirmed',
                className: 'offset-sm-6 col-sm-6 col-12 pe-sm-1 mb-2',
                expressionProperties: {
                    template: control => {
                        const quantityConfirmed = control?.quantity_confirmed;
                        const initialQuantity = control?.quantity;

                        let template: string;

                        if (quantityConfirmed > initialQuantity) {
                            template = `<div class="text-start text-danger fw-semibold">Quantity Confirmed cannot be more than ${initialQuantity}.
                                          </div>`;
                            return template;
                        }
                    },
                },
            },
            {
                key: 'purchase_price',
                type: 'input',
                className: 'col-sm-12 col-12 pe-sm-1',
                hideExpression: !(
                    this.component.secondaryData.document_type === 'grn'
                ),
                props: {
                    placeholder: 'Purchase Price',
                    label: 'Purchase Price',
                    required: this.flagService.getForcedValue(
                        'prov_purchasePriceInInventoryFormRequired'
                    ),
                },
            },
            {
                key: 'batch_reference',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Batch Reference',
                    placeholder: 'Enter batch reference',
                },
            },
            {
                key: 'expiry_date',
                type: 'datepicker',
                className: 'col-12 mb-4',
                props: {
                    label: 'Batch Expiry Date',
                    type: 'text',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                    required: false,
                    min: moment().add(1, 'days'),
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

    fieldValidator = () => {
        // Ensure quantity confirmed is more than or equal to 1
        const ifPositive = this.component?.model?.quantity_confirmed >= 1;
        const quantityConfirmed = this.component?.model?.quantity_confirmed;
        const initialQuantity = this.component?.model?.quantity;
        // Ensure quantity confirmed is more initial quantity
        if (quantityConfirmed > initialQuantity) {
            return !quantityConfirmed;
        }

        // If it is not positive, return negative
        if (!ifPositive) {
            return ifPositive;
        }

        // If nothing else, return quantity confirmed
        return quantityConfirmed;
    };
}

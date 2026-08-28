import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines add transfer item form controls, methods
 */
export class AddTransferItemFormService {
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
        public authorization: Authorization
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
                key: 'product',
                type: 'combobox',
                className: 'col-12 mb-4',
                props: {
                    label: 'Product',
                    placeholder: 'Select or type to search',
                    store: 'products',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        product_type: 'sku',
                    },
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                        },
                        {
                            key: 'quantity_at_hand',
                            label: 'Remaining Stock',
                            newline: true,
                            class: 'fs-9',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                    setSelectedItemToModel: true,
                },
            },
            {
                key: 'quantity_confirmed',
                type: 'input',
                className: 'col-sm-12 col-12 pe-sm-1',
                props: {
                    placeholder: 'Enter Quantity',
                    label: 'Quantity confirmed',
                    required: true,
                },
                validators: {
                    quantity_confirmed: {
                        expression: c => this.fieldValidator(c),
                    },
                },
            },

            {
                key: 'quantity_confirmed',
                className: 'col-sm-12 col-12 pe-sm-1',
                expressionProperties: {
                    template: control => {
                        const input = parseInt(control?.quantity_confirmed, 10);
                        const quantityAtHand =
                            control?.selectedItem?.quantity_at_hand;

                        const productName = control?.selectedItem?.name;

                        let template: string;

                        if (input > quantityAtHand) {
                            template = `<div class="text-start text-danger fw-semibold">
                                You only have ${quantityAtHand} ${productName} left. This is the maximum you can transfer at the moment.
                            </div>`;
                            return template;
                        }
                        if (input === 0) {
                            template = `<div class="text-start text-danger fw-semibold">
                                You cannot transfer 0 items.
                            </div>`;
                            return template;
                        }
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
    }

    fieldValidator = control => {
        const ifPositive = control?.value >= 1;

        const input = parseInt(control?.value, 10);
        const quantityAtHand =
            this.component?.model?.selectedItem?.quantity_at_hand;

        if (input > quantityAtHand) {
            return !input;
        }
        if (!ifPositive) return ifPositive;

        return input;
    };
}

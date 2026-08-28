import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { Observable, Subject } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class NewPurchaseOrderFieldsService {
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
     * Organisation ID
     */
    organisationID: string;

    /**
     * Observable that loads the products
     */
    products$: Observable<any>;
    /**
     * Subject that checks the product search
     */
    productsInput$ = new Subject<string>();

    /**
     * Used to control loading for search
     */
    loading: boolean = false;

    /**
     * Displays different combobox based on organisation settings
     */
    multipleBillingPoints: boolean;

    /**
     * Contains pricelist to filter by
     */
    pricelist: any;

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
        public currencyPipe: CurrencyPipe
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
                    label: 'Product/Service',
                    placeholder: 'Select product or service',
                    store: 'price-list-products',
                    responseKey: 'results',
                    extendParams: {
                        pricelist: this.pricelist,
                        active: true,
                    },
                    bindLabel: [
                        {
                            key: 'product_name',
                            newline: true,
                        },
                        {
                            label: 'Purchase Price',
                            key: 'price_inclusive_tax',
                            type: 'currency',
                            newline: true,
                            class: 'fw-semibold',
                        },
                        {
                            key: 'remaining_quantity',
                            label: 'Remaining Stock',
                            newline: true,
                            class: 'fs-9',
                        },
                    ],
                    prefillFields: {
                        product_type: 'product_type',
                    },
                    bindValue: 'product_id',
                    required: true,
                },
                expressions: {},
            },
            {
                key: 'quantity',
                type: 'input',
                className: 'col-12 mb-4',
                props: {
                    label: 'Quantity',
                    type: 'number',
                    required: true,
                    placeholder: 'Add quantity',
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

        this.pricelist = this.uiglobals.params?.['pricelist'];
    }
}

import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';

@Injectable({
    providedIn: 'root',
})
export class AddDirectInvoiceItemsFieldsService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Organmisation ID
     */
    organisationID: string;

    /**
     * Stores form model data
     */
    model: {
        product_or_service: string;
        selectedItem: {
            price_inclusive_tax: string;
        };
        adjusted_price: string;
    };

    /**
     * Stores the selected product price
     */
    productPrice: number;

    constructor(
        public dataLayer: SilStoresService,
        public auth: AuthenticationService,
        public uiglobals: UIRouterGlobals,
        public authServ: Authorization
    ) {}

    fields() {
        return [
            {
                key: 'product_or_service',
                type: 'combobox',
                className: 'col-4 mb-4 pe-4',
                props: {
                    label: 'Product/Service',
                    store: 'price-list-products',
                    responseKey: 'results',
                    required: true,
                    extendParams: {
                        fields: 'id,pricelist_name,product_name,pricelist_name,remaining_quantity,product_id,historical_pricelist_product_prices,active,created,created_by,updated,updated_by,price_inclusive_tax,organisation,pricelist,product,currency',
                        orgunit_type: 'branch',
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
                            label: 'Pricelist',
                            key: 'pricelist_name',
                            newline: true,
                            class: 'fw-semibold',
                        },
                        {
                            label: 'Remaining Quantity',
                            key: 'remaining_quantity',
                            type: 'string',
                            newline: true,
                            class: 'fw-semibold',
                        },
                    ],
                    bindValue: 'id',
                    setSelectedItemToModel: true,
                },
                expressions: {
                    'model.adjusted_price': field => {
                        this.model = field.model;
                        const productOrService = this.model.selectedItem;
                        if (productOrService) {
                            return productOrService.price_inclusive_tax;
                        }
                        return;
                    },
                },
            },
            {
                key: 'adjusted_price',
                type: 'input',
                className: 'col-4 mb-4 pe-4',
                props: {
                    label: 'Adjusted Price',
                    required: false,
                },
                expressions: {},
            },
            {
                key: 'quantity',
                type: 'input',
                className: 'col-4 mb-4',
                props: {
                    label: 'Quantity',
                    type: 'number',
                    required: false,
                },
                expressions: {},
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        const erpOrg = this.authServ.getErpOrganisation();
        this.organisationID = erpOrg?.organisation_id;
    }
}

import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the form registration service
 */
export class DirectSalesInvoiceLinesService {
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     * Stores form data from api
     */
    model: any = {};

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'product',
                type: 'combobox',
                className: 'col-12',
                props: {
                    label: 'Product',
                    placeholder: 'Select or type to search',
                    store: 'price-list-products',
                    responseKey: 'results',
                    extendParams: {
                        price_list: 'sales',
                    },
                    prefillFields: {
                        product_type: 'product_type',
                        new_price: 'price_inclusive_tax',
                        pricelist_product: 'id',
                        product_name: 'product_name',
                    },
                    bindLabel: [
                        {
                            key: 'product_name',
                            newline: true,
                        },
                    ],
                    bindValue: 'product_id',
                    required: true,
                },
                expressions: {
                    'model.product': field => {
                        if (field?.model?.product) {
                            return field?.model?.product;
                        }
                    },
                },
            },

            {
                key: 'quantity',
                type: 'input',
                className: 'col-12 ',
                defaultValue: 1,
                props: {
                    type: 'number',
                    placeholder: 'Enter Quantity',
                    label: 'Quantity',
                    required: true,
                },
                expressions: {
                    'model.quantity': field => {
                        if (field?.model?.quantity) {
                            return field?.model?.quantity;
                        }
                    },
                },
            },

            {
                key: 'new_price',
                type: 'input',
                className: 'col-12',
                props: {
                    placeholder: 'Enter Price',
                    label: 'Unit Price',
                    required: false,
                },
                expressions: {
                    'model.new_price': field => {
                        if (field.model.product) {
                            field.formControl.setValue(field.model.new_price);
                        }

                        if (field?.model?.new_price) {
                            return field?.model?.new_price;
                        }
                    },
                },
            },

            {
                key: 'allow_discount',
                type: 'checkbox',
                className: 'col-12 row ms-1 mb-3 mt-2',
                defaultValue: false,
                props: {
                    label: 'Allow discount application?',
                },
                expressions: {
                    'model.allow_discount': field => {
                        return field.model.allow_discount;
                    },
                },
            },

            {
                key: 'pricelist_product',
                type: 'input',
                className: 'hidden',
                expressions: {
                    'model.pricelist_product': field => {
                        if (field?.model?.pricelist_product) {
                            return field?.model?.pricelist_product;
                        }
                    },
                },
            },
            {
                key: 'product_name',
                type: 'input',
                className: 'hidden',
                expressions: {
                    'model.product_name': field => {
                        if (field?.model?.product_name) {
                            return field?.model?.product_name;
                        }
                    },
                },
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

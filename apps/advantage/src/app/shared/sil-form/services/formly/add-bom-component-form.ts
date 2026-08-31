import { Injectable } from '@angular/core';

/**
 * Allows service to be injectable into formly commponent
 */
@Injectable({
    providedIn: 'root',
})

/** Class that definesform controls */
export class BomComponentService {
    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'raw_product',
                type: 'combobox',
                className: 'col-12',
                props: {
                    placeholder: 'Enter product...',
                    label: 'Search for product',
                    store: 'products',
                    responseKey: 'results',
                    extendParams: {
                        item_type: '1',
                    },
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    'model.raw_product': field => {
                        if (field?.model?.raw_product) {
                            return field?.model?.raw_product;
                        }
                    },
                },
            },
            {
                key: 'quantity',
                type: 'input',
                className: 'col-12',
                props: {
                    placeholder: 'Enter quantity..',
                    label: 'Quantity',
                    required: true,
                },
                validators: {
                    quantity: {
                        expression: c => this.fieldValidator(c),
                    },
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
                className: 'ms-1 mb-2 col-6',
                key: 'quantity',
                expressionProperties: {
                    template: control => {
                        const number = parseInt(control?.quantity, 10);

                        const ifPositive = number >= 1;
                        let template: string;

                        if (!ifPositive && control?.quantity) {
                            template = `<div class="text-start text-danger fw-semibold">
                                Quantity cannot be less than 1
                            </div>`;
                            return template;
                        }
                    },
                },
            },
        ];
    }

    fieldValidator = control => {
        const ifPositive = control?.value >= 1;

        if (!ifPositive) return ifPositive;
        return control?.value;
    };

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

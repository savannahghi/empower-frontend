import { Injectable } from '@angular/core';

/**
 * Allows service to be injectable into formly commponent
 */
@Injectable({
    providedIn: 'root',
})

/** Class that definesform controls */
export class BomOperationService {
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
                key: 'bom',
                type: 'combobox',
                className: 'col-12',
                props: {
                    label: 'Search for BOM',
                    store: 'bill-of-material',
                    responseKey: 'results',
                    useStateParamFilters: true,
                    bindLabel: [
                        {
                            key: 'final_product',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    'model.bom': field => {
                        if (field?.model?.bom) {
                            return field?.model?.bom;
                        }
                    },
                },
            },
            {
                key: 'quantity',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Quantity Assembled',
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

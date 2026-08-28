/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines billing form controls, methods
 */
export class RefundLineService {
    /**
     * Stores instance of the form component
     */
    component: any;

    loading: boolean = true;

    sCode: string;
    /**
     *  Constructor for the class
     * @param dataLayer injects the data layer service
     */
    constructor(private dataLayer: SilStoresService) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                className: 'col-12',
                expressionProperties: {
                    template: model => {
                        const { name, price, quantity, productId } = model;
                        const scu = this.getItemCode(productId);

                        if (scu !== undefined && !this.loading) {
                            const template = `
                        <div class="p-2 rounded formly-header-template">
                            <div class="ps-3 row mb-3">
                                <div class="col-6 col-lg-8 mb-3 d-flex align-items-center">
                                    <p class="fw-bold mb-0 me-2">Item Name:</p>
                                    <p class="fw-bold mb-0">${name}</p>
                                </div>
                                <div class="col-6 col-lg-4 mb-3 d-flex align-items-center">
                                    <p class="fw-bold mb-0 me-2">Unit Price:</p>
                                    <p class="fw-bold mb-0">${price}</p> 
                                </div>
                                <div class="col-6 col-lg-8 mb-3 d-flex align-items-center">
                                    <p class="fw-bold mb-0 me-2">Item Code:</p>
                                    <p class="fw-bold mb-0">${scu} </p>
                                </div>
                                <div class="col-6 col-lg-4 mb-3 d-flex align-items-center">
                                    <p class="fw-bold mb-0 me-2">Quantity:</p>
                                    <p class="fw-bold mb-0">${quantity}</p>
                                </div>
                            </div>
                        </div>`;

                            return template;
                        }
                    },
                },
            },

            {
                key: 'name',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Item',
                    disabled: true,
                    required: false,
                },
            },
            {
                key: 'price',
                type: 'input',
                className: 'pe-2 col-6',
                props: {
                    label: 'Unit Price',
                    disabled: false,
                    required: true,
                },
                validators: {
                    price: {
                        expression: c => this.fieldValidator(c),
                    },
                },
            },

            {
                key: 'quantity',
                type: 'input',
                className: 'col-6',
                props: {
                    label: 'Quantity',
                    disabled: false,
                    required: true,
                },

                validators: {
                    quantity: {
                        expression: c => this.fieldValidator(c),
                    },
                },
            },

            {
                className: 'mb-2 col-5',
                key: 'price',
                expressionProperties: {
                    template: model => {
                        const number = parseInt(model?.price, 10);
                        const ifPositive = number >= 1;
                        let template: string;

                        if (!ifPositive && model?.price) {
                            template = `<div class="text-start text-danger fw-semibold me-5">
                                Unit price cannot be less than 1
                            </div>`;
                            return template;
                        }
                        if (model?.price > model?.original_price) {
                            template = `<div class="text-start text-danger me-5 fw-semibold">
                                Unit price cannot exceed the initial value 
                            </div>`;
                            return template;
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
                        if (
                            control?.quantity >
                            this.component.form?.controls?.quantity
                                ?.defaultValue
                        ) {
                            template = `<div class="text-start text-danger fw-semibold">
                                Quantity cannot exceed the initial value 
                            </div>`;
                            return template;
                        }
                    },
                },
            },
            {
                key: 'kra_reason_code',
                type: 'select',
                className: 'col-12 mb-1',
                props: {
                    placeholder: 'Reason for refund',
                    label: 'Reason for refund',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Missing Quantity',
                            value: '01',
                        },
                        {
                            title: 'Missing Item',
                            value: '02',
                        },
                        {
                            title: 'Damaged',
                            value: '03',
                        },
                        {
                            title: 'Wasted',
                            value: '04',
                        },
                        {
                            title: 'Raw Material Shortage',
                            value: '05',
                        },
                        {
                            title: 'Refund',
                            value: '06',
                        },
                        {
                            title: 'Wrong Customer PIN',
                            value: '07',
                        },
                        {
                            title: 'Wrong Customer name',
                            value: '08',
                        },
                        {
                            title: 'Wrong Amount/price',
                            value: '09',
                        },
                        {
                            title: 'Wrong Quantity',
                            value: '10',
                        },
                        {
                            title: 'Wrong Item(s)',
                            value: '11',
                        },
                        {
                            title: 'Wrong tax type',
                            value: '12',
                        },
                        {
                            title: 'Other reason',
                            value: '13',
                        },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
            },
            {
                key: 'reason',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Additional Notes',
                    disabled: false,
                    required: false,
                },
            },
        ];
    }

    fieldValidator = control => {
        const ifPositive = control?.value >= 1;

        if (control?.value > control.defaultValue) {
            return !control?.value;
        }
        if (!ifPositive) return ifPositive;
        return control?.value;
    };

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }

    getItemCode(product_id): string {
        const params = {
            fields: 'scu_item_code',
        };
        this.loading = true;
        this.dataLayer.get('products', product_id, params).subscribe({
            next: (resp: any) => {
                this.sCode = resp.scu_item_code;
                this.loading = false;

                return resp.scu_item_code;
            },
        });
        this.loading = false;
        return this.sCode;
    }
}

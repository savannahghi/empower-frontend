/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines billing form controls, methods
 */
export class CreateRefundFieldsService {
    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    /**
     * Stores the invoice data
     */
    invoice: any;

    /**
     * Stores the disabled state
     */
    disableInput: boolean = true;

    /**
     *  Constructor for the class
     * @param dataLayer injects the data layer service
     */
    constructor() {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'amount',
                type: 'input',
                className: 'col-12',
                defaultValue: this.getInvoice(),
                props: {
                    label: 'Refund Amount',
                    disabled: true,
                    type: 'number',
                    required: true,
                    placeholder: 'Enter amount',
                },
                validators: {
                    amount: {
                        expression: control => {
                            const number = parseFloat(control.value);
                            const balance = this.getInvoice();
                            const ifPositive =
                                number > 0.0 && number <= balance;
                            return ifPositive;
                        },
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

    getInvoice() {
        if (this.component.secondaryData[1]?.invoice) {
            // Handle the refund process in a visit
            this.invoice =
                this.component.secondaryData[1]['invoice']['amount_paid'];
        } else {
            // Handle the refund process in a direct invoice
            this.invoice = this.component.secondaryData[0]['amount'];
            this.disableInput = false;
        }
        return this.invoice;
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

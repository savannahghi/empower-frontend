/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import moment from 'moment';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines billing form controls, methods
 */
export class AddDirectPaymentFieldsService {
    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    /**
     * Boolean to determine whether to display combobox or input field for customers
     */
    useInputForCustomersField: boolean = false;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'payment_date',
                type: 'datepicker',
                className: 'col-12',
                props: {
                    label: 'Payment Date',
                    placeholder: 'DD-MM-YYYY',
                    required: true,
                    max: moment().add(0, 'days'),
                },
                expressions: {
                    'model.payment_date': field => {
                        if (field?.model?.payment_date) {
                            return field?.model?.payment_date;
                        }
                    },
                },
            },
            {
                key: 'customer_name',
                hideExpression: !this.useInputForCustomersField,
                type: 'input',
                className: 'col-6 pe-1',
                props: {
                    label: 'Customer',
                    required: true,
                },
                expressions: {
                    'props.disabled': field => {
                        if (field?.model.customer_name) {
                            return field?.model.customer_name;
                        }
                    },
                },
            },
            {
                key: 'business_partner',
                type: 'combobox',
                hideExpression: this.useInputForCustomersField,
                className: 'col-6 pe-1',
                props: {
                    placeholder: 'Select customer...',
                    label: 'Customer',
                    store: 'customers',
                    responseKey: 'results',

                    bindLabel: [
                        {
                            key: 'partner_name',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    'model.business_partner': field => {
                        if (field?.model?.business_partner) {
                            return field?.model?.business_partner;
                        }
                    },
                },
            },

            {
                key: 'sales_invoice',
                type: 'input',
                className: 'hidden',
                expressions: {
                    'model.sales_invoice': field => {
                        if (field?.model?.sales_invoice) {
                            return field?.model?.sales_invoice;
                        }
                    },
                },
            },
            {
                key: 'payment_method',
                type: 'combobox',
                className: 'col-6',
                props: {
                    placeholder: 'Select payment method...',
                    label: 'Payment method',
                    store: 'payment-methods',
                    responseKey: 'results',

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
                    'model.payment_method': field => {
                        if (field?.model?.payment_method) {
                            return field?.model?.payment_method;
                        }
                    },
                },
            },
            {
                key: 'currency',
                type: 'combobox',
                className: 'col-6 pe-1',
                props: {
                    placeholder: 'Select currency...',
                    label: 'Currency',
                    store: 'currencys',
                    responseKey: 'results',

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
                    'model.currency': field => {
                        if (field?.model?.currency) {
                            return field?.model?.currency;
                        }
                    },
                },
            },

            {
                key: 'paid_amount',
                type: 'input',
                className: 'col-6',
                props: {
                    label: 'Amount',
                    placeholder: 'Enter amount...',
                    required: true,
                },
                expressions: {
                    'model.paid_amount': field => {
                        if (field?.model?.paid_amount) {
                            return field?.model?.paid_amount;
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
        this.useInputForCustomersField =
            this.component.secondaryData?.useInputForCustomersField;
    }
}

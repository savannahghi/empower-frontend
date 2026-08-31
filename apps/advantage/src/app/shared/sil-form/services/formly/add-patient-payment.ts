/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines billing form controls, methods
 */
export class AddPatientPaymentFieldsService {
    /**
     * Used to control loading for search
     */
    loading: boolean = false;

    /**
     * Stores the search term
     */
    term: string;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    /**
     *  Constructor for the class
     * @param dataLayer injects the data layer service
     */
    constructor(
        public dataLayer: SilStoresService,
        public silCurrencyPipe: SilCurrencyPipe
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
                type: 'datepicker',
                key: 'payment_date',
                className: 'col-12 col-sm-6 pe-sm-1',
                props: {
                    label: 'Select payment date',
                    required: false,
                },
            },
            {
                type: 'input',
                key: 'payment_reference',
                className: 'col-12 col-sm-6 ps-sm-1',
                props: {
                    type: 'text',
                    label: 'Payment reference',
                    required: false,
                },
            },

            {
                key: 'paymentMethod',
                type: 'combobox',
                className: 'col-12 col-sm-6 pe-sm-1',
                props: {
                    placeholder: 'Select payment method',
                    label: 'Payment method',
                    store: 'payment-methods',
                    extendParams: {
                        active: true,
                    },
                    responseKey: 'results',
                    bindLabel: [
                        {
                            key: 'name',
                            class: 'fw-semibold',
                            newline: true,
                        },
                        {
                            key: 'account_details',
                            class: 'fs-13px',
                            newline: true,
                        },
                        {
                            key: 'description',
                            class: 'fs-13px',
                        },
                    ],
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loading,
                    loadingText: 'Searching..',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                    modifyItemNotFound: true,
                    buttonText: 'Add payment method',
                    buttonEvent: () => {
                        this.component.refresh?.emit();
                    },
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'amount',
                type: 'input',
                className: 'col-12 col-sm-6 ps-sm-1 mb-2 b-2',
                props: {
                    label: 'Amount paid',
                    type: 'number',
                    required: true,
                    placeholder: 'Amount paid',
                },
                validators: {
                    amount: {
                        expression: control => {
                            const number = parseFloat(control.value);
                            const balance =
                                this.component.secondaryData['amount_due'] -
                                this.component.secondaryData['amount_paid'];
                            const ifPositive =
                                number > 0.0 && number <= balance;
                            return ifPositive;
                        },
                    },
                },
            },
            {
                className: 'mt-1 col-12',
                expressionProperties: {
                    template: model => {
                        if (!model.amount) {
                            return null;
                        } else if (
                            Number(model.amount) ===
                                this.component.secondaryData['amount_due'] ||
                            Number(model.amount) <=
                                this.component.secondaryData['amount_due'] -
                                    this.component.secondaryData['amount_paid']
                        ) {
                            return;
                        }
                        const template =
                            `<div class="text-end text-danger fw-semibold mb-3">
                Amount paid should not exceed the total cost: ` +
                            this.getAmountDue() +
                            `
                </div>`;
                        return template;
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

    getAmountDue() {
        const value =
            this.component.secondaryData['amount_due'] -
            this.component.secondaryData['amount_paid'];
        return this.silCurrencyPipe.transform(value);
    }
}

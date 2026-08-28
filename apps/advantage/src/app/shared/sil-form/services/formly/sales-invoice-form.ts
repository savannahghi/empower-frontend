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
export class DirectSalesInvoiceService {
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
                key: 'invoice_date',
                type: 'datepicker',
                className: 'col-12',
                props: {
                    label: 'Invoice Date',
                    required: true,
                },
                expressions: {
                    'model.invoice_date': field => {
                        if (field?.model?.invoice_date) {
                            return field?.model?.invoice_date;
                        }
                    },
                },
            },

            {
                key: 'customer',
                type: 'combobox',
                className: 'col-6 me-2',
                props: {
                    placeholder: 'Enter customer...',
                    label: 'Search for customer',
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
                    'model.customer': field => {
                        if (field?.model?.customer) {
                            return field?.model?.customer;
                        }
                    },
                },
            },
            {
                key: 'sales_type',
                type: 'select',
                className: 'col-5',
                props: {
                    label: 'Sales Type',
                    bindLabel: 'title',
                    bindValue: 'value',
                    placeholder: 'Select the sales type',
                    options: [
                        { title: 'Cash', value: 'cash' },
                        {
                            title: 'Credit',
                            value: 'credit',
                        },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.sales_type': field => {
                        if (field?.model?.sales_type) {
                            return field?.model?.sales_type;
                        }
                    },
                },
            },
            {
                key: 'reference_number',
                type: 'input',
                className: 'col-sm-12 col-12 pe-sm-1',
                props: {
                    placeholder: 'Enter Reference Number',
                    label: 'Reference Number',
                    required: false,
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

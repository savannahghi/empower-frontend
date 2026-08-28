import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import moment from 'moment';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})
export class FilterReconPaymentsService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    component: any;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'payment_date_gte',
                type: 'datepicker',
                className: 'col-6 pe-3',
                props: {
                    type: 'text',
                    label: 'Start Date',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                    required: true,
                },
            },
            {
                key: 'payment_date_lte',
                type: 'datepicker',
                className: 'col-6',
                props: {
                    type: 'text',
                    label: 'End Date',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                    required: true,
                },
                expressions: {
                    'props.min': field => {
                        if (field?.model?.payment_date_gte) {
                            return moment(field.model.payment_date_gte);
                        }
                        return moment().add(1, 'days');
                    },
                },
            },
            {
                type: 'template',
                className: 'col-12 mb-3',
                expressionProperties: {
                    'props.template': model => {
                        if (model.payment_date_gte > model.payment_date_lte) {
                            return `<div class="text-danger">
                                        End date must be after start date
                                    </div>`;
                        }
                        return '';
                    },
                },
            },
            {
                key: 'payment_method',
                type: 'select',
                className: 'col-12',
                props: {
                    label: 'Payment Method',
                    placeholder: 'Enter payment method (e.g. RTGS)',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'RTGS',
                            value: 'RTGS',
                        },
                        {
                            title: 'CASH',
                            value: 'CASH',
                        },
                        {
                            title: 'CREDIT',
                            value: 'CREDIT',
                        },
                    ],
                    searchable: false,
                    multiple: false,
                    closeOnSelect: true,
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}

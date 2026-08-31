import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import moment from 'moment';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})
export class FilterReconRequestInvoicesService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

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
                key: 'start_date',
                type: 'datepicker',
                className: 'col-6 pe-3',
                props: {
                    type: 'text',
                    label: 'Invoice Start Date',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                    required: true,
                },
            },
            {
                key: 'end_date',
                type: 'datepicker',
                className: 'col-6',
                props: {
                    type: 'text',
                    label: 'Invoice End Date',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                    required: true,
                },
                expressions: {
                    'props.min': field => {
                        if (field?.model?.start_date) {
                            return moment(field.model.start_date);
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
                        if (model.start_date > model.end_date) {
                            return `<div class="text-danger">
                                        End date must be after start date
                                    </div>`;
                        }
                        return '';
                    },
                },
            },
            {
                key: 'invoice_number__startswith',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Invoice number starts with',
                    placeholder: 'Enter prefix (e.g. 1510)',
                },
            },
            {
                key: 'ordering',
                type: 'select',
                className: 'col-12',
                props: {
                    label: 'Sort by Pending Amount',
                    placeholder: 'Select sorting order',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Highest to Lowest',
                            value: '-unpaid_amount',
                        },
                        {
                            title: 'Lowest to Highest',
                            value: 'unpaid_amount',
                        },
                    ],
                    closeOnSelect: true,
                },
            },
            {
                key: 'amount_option',
                type: 'radio',
                className: 'col-12 mb-4',
                props: {
                    defaultValue: 'exact',
                    label: 'Pending Amount',
                    options: [
                        {
                            value: 'exact',
                            label: 'Exact Amount',
                            checked: true,
                        },
                        { value: 'greater', label: 'Greater Than' },
                        { value: 'less', label: 'Less Than' },
                    ],
                },
            },
            {
                key: 'unpaid_amount',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Exact Pending Amount',
                    type: 'number',
                    placeholder: 'Enter exact pending amount (e.g. 4000)',
                },
                hideExpression: model => model.amount_option !== 'exact',
            },
            {
                key: 'unpaid_amount__gte',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Maximum Pending Amount',
                    type: 'number',
                    placeholder: 'Enter maximum pending amount (e.g. 8000)',
                },
                hideExpression: model => model.amount_option !== 'greater',
            },
            {
                key: 'unpaid_amount__lte',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Minimum Pending Amount',
                    type: 'number',
                    placeholder: 'Enter minimum pending amount (e.g. 2000)',
                },
                hideExpression: model => model.amount_option !== 'less',
            },
            {
                key: 'workflow_state',
                type: 'select',
                className: 'col-12',
                props: {
                    label: 'Workflow state',
                    placeholder: 'Select workflow state',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Not Loaded',
                            value: 'NOT_LOADED',
                        },
                        {
                            title: 'Loaded - Pending Assessment',
                            value: 'LOADED',
                        },
                        {
                            title: 'Open for Recon',
                            value: 'OPEN_FOR_RECON',
                        },
                        {
                            title: 'Inquiry',
                            value: 'INQUIRY',
                        },
                        {
                            title: 'Partially Reconciled',
                            value: 'PARTIALLY_RECONCILED',
                        },
                        {
                            title: 'Reconciled',
                            value: 'RECONCILED',
                        },
                    ],
                    closeOnSelect: true,
                },
            },
            {
                key: 'benefit_type',
                type: 'select',
                className: 'col-12',
                props: {
                    label: 'Benefit type',
                    placeholder: 'Select benefit type',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Outpatient',
                            value: 'OUTPATIENT',
                        },
                        {
                            title: 'Inpatient',
                            value: 'INPATIENT',
                        },
                        {
                            title: 'Dental',
                            value: 'DENTAL',
                        },
                        {
                            title: 'Optical',
                            value: 'OPTICAL',
                        },
                        {
                            title: 'Dental/Optical',
                            value: 'DENTAL_AND_OPTICAL',
                        },
                        {
                            title: 'Maternity',
                            value: 'MATERNITY',
                        },
                        {
                            title: 'HIV/AIDS & Covid',
                            value: 'HIV_AIDS_AND_COVID',
                        },
                        {
                            title: 'HIV/AIDS',
                            value: 'HIV_AIDS',
                        },
                        {
                            title: 'Covid-19',
                            value: 'COVID_19',
                        },
                        {
                            title: 'Vaccines',
                            value: 'VACCINES',
                        },
                        {
                            title: 'Health checkups',
                            value: 'HEALTH_CHECKUPS',
                        },
                        {
                            title: 'Other',
                            value: 'OTHER',
                        },
                    ],
                    closeOnSelect: true,
                },
            },
            {
                key: 'responsibility',
                type: 'select',
                className: 'col-12',
                props: {
                    label: 'Responsibility',
                    placeholder: 'Select responsibility',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Payer',
                            value: 'PAYER',
                        },
                        {
                            title: 'Provider',
                            value: 'PROVIDER',
                        },
                        {
                            title: 'Not Assigned',
                            value: 'NOT_ASSIGNED',
                        },
                        {
                            title: 'Shared',
                            value: 'SHARED',
                        },
                    ],
                    closeOnSelect: true,
                },
            },
            {
                key: 'recon_mode',
                type: 'select',
                className: 'col-12',
                props: {
                    label: 'Recon mode',
                    placeholder: 'Select recon mode',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Manual',
                            value: 'MANUAL',
                        },
                        {
                            title: 'Auto',
                            value: 'AUTO',
                        },
                        {
                            title: 'Not Adjudicated',
                            value: 'NOT_ADJUDICATED',
                        },
                    ],
                    closeOnSelect: true,
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}

import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import moment from 'moment';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})
export class FilterReconinvoicesService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    constructor(
        public uiglobals: UIRouterGlobals,
        public dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        private authConfig: Authorization
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        const workflowState = this.uiglobals.params.workflow_state;

        const paymentStatusOptions = {
            OPEN_FOR_RECON: [
                { title: 'Not Paid', value: 'NOT_PAID' },
                { title: 'Partially Paid', value: 'PARTIALLY_PAID' },
            ],
            RECONCILED: [
                { title: 'Not Paid', value: 'NOT_PAID' },
                { title: 'Partially Paid', value: 'PARTIALLY_PAID' },
                { title: 'Paid', value: 'PAID' },
            ],
            DEFAULT: [
                { title: 'Not Paid', value: 'NOT_PAID' },
                { title: 'Partially Paid', value: 'PARTIALLY_PAID' },
                { title: 'Paid', value: 'PAID' },
            ],
        };

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
                    label: 'Filter invoices by invoice no. prefix',
                    placeholder: 'Enter invoice number prefix',
                },
            },
            {
                key: 'payment_status',
                type: 'select',
                className: 'col-12',
                hideExpression:
                    workflowState === 'LOADED' ||
                    workflowState === 'PARTIALLY_RECONCILED',
                props: {
                    placeholder: 'Select Payment Status',
                    label: 'Payment Status',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options:
                        paymentStatusOptions[workflowState] ||
                        paymentStatusOptions.DEFAULT,
                    searchable: false,
                    multiple: false,
                    closeOnSelect: true,
                    required: false,
                },
            },
            {
                key: 'rejection_reason',
                type: 'select',
                className: 'col-12',
                hideExpression: !(
                    workflowState === 'OPEN_FOR_RECON' ||
                    workflowState === 'INQUIRY' ||
                    workflowState === 'PARTIALLY_RECONCILED' ||
                    workflowState == null
                ),
                props: {
                    serverSide: true,
                    placeholder: 'Please select rejection reason',
                    label: 'Rejection Reason',
                    options: [],
                    bindLabel: ['name'],
                    bindValue: 'name',
                    closeOnSelect: true,
                },
                hooks: {
                    onInit: field => this.getRejectionReasons(field),
                },
            },
            {
                key: 'payer_invoice_status',
                type: 'select',
                className: 'col-12',
                hideExpression: workflowState !== 'LOADED',
                props: {
                    placeholder: 'Select Invoice Status',
                    label: 'Invoice Status',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Declined',
                            value: 'Declined',
                        },
                        {
                            title: 'Duplicate',
                            value: 'Duplicate',
                        },
                        {
                            title: 'Loaded',
                            value: 'Loaded',
                        },
                        {
                            title: 'Paid',
                            value: 'Paid',
                        },
                        {
                            title: 'Paid Externally',
                            value: 'Paid Externally',
                        },
                        {
                            title: 'Paid To Zero',
                            value: 'Paid To Zero',
                        },
                        {
                            title: 'Partially Paid',
                            value: 'Partially Paid',
                        },
                        {
                            title: 'Pending Decline',
                            value: 'Pending Decline',
                        },
                        {
                            title: 'Pre-Processed',
                            value: 'Pre-Processed',
                        },
                        {
                            title: 'Processed',
                            value: 'Processed',
                        },
                        {
                            title: 'Processed - Suspended',
                            value: 'Processed - Suspended',
                        },
                        {
                            title: 'QA',
                            value: 'QA',
                        },
                        {
                            title: 'Rectification',
                            value: 'Rectification',
                        },
                        {
                            title: 'Under Investigation',
                            value: 'Under Investigation',
                        },
                        {
                            title: 'Waiting Approval',
                            value: 'Waiting Approval',
                        },
                    ],
                    searchable: false,
                    multiple: false,
                    closeOnSelect: true,
                    required: false,
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
                    label: 'Filter by Pending Amount',
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
                    label: 'Filter by Exact Pending Amount',
                    type: 'number',
                    placeholder: 'Enter exact pending amount',
                },
                hideExpression: model => model.amount_option !== 'exact',
            },
            {
                key: 'unpaid_amount__gte',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Filter by Maximum Pending Amount',
                    type: 'number',
                    placeholder: 'Enter maximum pending amount',
                },
                hideExpression: model => model.amount_option !== 'greater',
            },
            {
                key: 'unpaid_amount__lte',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Filter by Minimum Pending Amount',
                    type: 'number',
                    placeholder: 'Enter minimum pending amount',
                },
                hideExpression: model => model.amount_option !== 'less',
            },
            {
                key: 'benefit_type',
                type: 'select',
                className: 'col-12',
                props: {
                    label: 'Filter by benefit type',
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

    handleErrorFxn = (err: any) => {
        this.errorHandler.handleError(err, this);
    };

    getRejectionReasons(field?: FormlyFieldConfig) {
        const bp_type = this.authConfig.getUser().bp_type;

        const bpId = this.uiglobals.params.id;

        return this.dataLayer.get('recon-business-partners', bpId).subscribe({
            next: (response: any) => {
                const bpSladeCode = response.slade_code;

                const params: any = {};

                if (bp_type === 'PAYER') {
                    params.payer_slade_code =
                        this.authConfig.getAutoreconSettings()?.organisation_slade_code;
                    params.provider_slade_code = bpSladeCode;
                } else {
                    params.payer_slade_code = bpSladeCode;
                    params.provider_slade_code =
                        this.authConfig.getAutoreconSettings()?.organisation_slade_code;
                }

                this.dataLayer
                    .list('recon-invoice-rejection_reasons', params)
                    .subscribe({
                        next: (rejectionReasonsResponse: any) => {
                            const rejectionReasons =
                                rejectionReasonsResponse.map(item => ({
                                    name: item.name,
                                }));

                            if (field && field.props) {
                                field.props.options = rejectionReasons;
                                this.component.cd.detectChanges();
                            }
                        },
                        error: this.handleErrorFxn,
                    });
            },
            error: this.handleErrorFxn,
        });
    }

    setComponent(component) {
        this.component = component;
    }
}

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
export class FilterReconInvoiceLinesService {
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
        public dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        public uiglobals: UIRouterGlobals,
        private authConfig: Authorization
    ) {}

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
                key: 'rejection_reason',
                type: 'select',
                className: 'col-12',
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
                key: 'amount_option',
                type: 'radio',
                className: 'col-12 mb-4',
                props: {
                    name: 'amount_option',
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

import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import moment from 'moment';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { Authorization } from 'app/@core/auth/services/authorization.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines add transfer item form controls, methods
 */
export class NewReconRequestFormService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: any;

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
        return [
            {
                key: 'option',
                type: 'radio',
                className: 'col-12 mb-4',
                props: {
                    defaultValue: 'dates',
                    label: 'Select an option',
                    options: [
                        {
                            value: 'dates',
                            label: 'Select Dates and Rejection Reason',
                            checked: true,
                        },
                        { value: 'excel', label: 'Upload Excel File' },
                    ],
                },
            },
            {
                key: 'start_date',
                type: 'datepicker',
                className: 'col-6 pe-sm-2',
                props: {
                    placeholder: 'Select start date',
                    label: 'Start Date',
                    dateFormat: 'YYYY-MM-DD',
                    required: true,
                },
                hideExpression: model => model.option !== 'dates',
            },
            {
                key: 'end_date',
                type: 'datepicker',
                className: 'col-6 pe-sm-2',
                props: {
                    placeholder: 'Select end date',
                    label: 'End Date',
                    dateFormat: 'YYYY-MM-DD',
                    required: true,
                },
                hideExpression: model => model.option !== 'dates',
                validators: {
                    end_date: {
                        expression: (control, field) => {
                            const startDate =
                                field?.form?.get('start_date')?.value;
                            const endDate = control.value;
                            return (
                                !startDate ||
                                !endDate ||
                                new Date(endDate) >= new Date(startDate)
                            );
                        },
                    },
                },
            },
            {
                type: 'template',
                className: 'col-12 mb-3',
                expressionProperties: {
                    'props.template': model => {
                        if (
                            model.start_date &&
                            model.end_date &&
                            new Date(model.end_date) <
                                new Date(model.start_date)
                        ) {
                            return `<div class="text-danger">
                                        End date cannot be earlier than start date (${moment(
                                            model.start_date
                                        ).format('YYYY-MM-DD')}).
                                    </div>`;
                        }
                        return '';
                    },
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
                hideExpression: model => model.option !== 'dates',
                hooks: {
                    onInit: field => this.getRejectionReasons(field),
                },
            },
            {
                key: 'file',
                type: 'file',
                className: 'col-12',
                props: {
                    accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
                    label: 'Upload Excel File',
                    placeholder: 'Choose an Excel file(.xls, .xlsx) to upload',
                    required: true,
                    fileEvent: (eventfile, model) => {
                        const file = eventfile;
                        model.fileEvent = file;
                    },
                },
                hideExpression: model => model.option !== 'excel',
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

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

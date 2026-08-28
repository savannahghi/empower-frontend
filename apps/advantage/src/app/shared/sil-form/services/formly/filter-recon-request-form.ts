import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import moment from 'moment';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from 'app/@core/auth/services/authorization.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})
export class FilterReconRequestService {
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
                key: 'created',
                type: 'datepicker',
                className: 'col-12',
                props: {
                    type: 'text',
                    label: 'Created date',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                },
                expressions: {
                    'model.created': field => {
                        if (field.model.created) {
                            field.model.created = moment(
                                field.model.created
                            ).format('YYYY-MM-DD');
                        }
                    },
                },
            },
            {
                key: 'start_date',
                type: 'datepicker',
                className: 'col-12',
                props: {
                    type: 'text',
                    label: 'Start date',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                },
            },
            {
                key: 'workflow_state',
                type: 'select',
                className: 'col-12',
                props: {
                    placeholder: 'Select Workflow State',
                    label: 'Workflow State',
                    class: 'margin-t-10',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Pending',
                            value: 'PENDING',
                        },
                        {
                            title: 'Ready for review',
                            value: 'READY_FOR_REVIEW',
                        },
                        {
                            title: 'Inquiry',
                            value: 'INQUIRY',
                        },
                        {
                            title: 'Invalidated',
                            value: 'INVALIDATED',
                        },
                        {
                            title: 'Agreement Reached',
                            value: 'AGREEMENT_REACHED',
                        },
                        {
                            title: 'Finalized Provider',
                            value: 'FINALIZED_PROVIDER',
                        },
                        {
                            title: 'Finalized Payer',
                            value: 'FINALIZED_PAYER',
                        },
                        {
                            title: 'Processed',
                            value: 'PROCESSED',
                        },
                    ],
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

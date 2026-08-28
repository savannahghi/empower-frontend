import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines add transfer item form controls, methods
 */
export class NewSignoffFormService {
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
                key: 'start_date',
                type: 'datepicker',
                className: 'col-6 pe-sm-2',
                props: {
                    placeholder: 'Select start date',
                    label: 'Start Date',
                    dateFormat: 'YYYY-MM-DD',
                    required: true,
                },
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

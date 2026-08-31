import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';

@Component({
    selector: 'app-provider-details',
    templateUrl: './provider-details.component.html',
    styleUrl: './provider-details.component.scss',
    standalone: false,
})
export class ProviderDetailsComponent implements OnInit {
    /**
     * Contains organisation information resolved from the state
     */
    @Input() organisationObservable: any;

    /**
     * Used to determine duration of the toast time
     */
    toastTime = 7000;

    loading: boolean = false;

    /**
     * Used to display different toggle modals
     * Information in the table
     */
    toggle: Object = {};

    /**
     * Used to override default form configurations
     */
    formConfig: { checkExpressionOn: string };

    /** organisation information is stored in this variable */
    organisation: any;

    isAutoReconEnabledResponse: any;

    constructor(
        private errorHandler: ErrorHandlerService,
        public uiglobals: UIRouterGlobals,
        public dataLayer: SilStoresService,
        public toastrService: NbToastrService,
        public $state: StateService
    ) {}

    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    getOrganisationInfo() {
        this.organisationObservable.subscribe((response: any) => {
            this.organisation = response;
            this.checkIfOrgIsAutoreconEnabled();
        }, this.handleErrorFxn);
    }

    handleErrorFxn = (err: any) => {
        this.loading = false;

        this.errorHandler.handleError(err, this);
    };

    enableEtims() {
        const params = {
            id: this.uiglobals.params.id,
            view: 'create_etims_device_number',
        };

        this.dataLayer
            .createNested('erp-organisations', params.view, params.id)
            .subscribe({
                next: () => {
                    const msg = 'Device number created';
                    const context = 'eTIMS user enabled';
                    this.showToast('bottom-right', 'success', context, msg);
                    this.$state.reload();
                },
                error: this.handleErrorFxn,
            });
    }

    checkIfOrgIsAutoreconEnabled() {
        if (this.organisation) {
            this.loading = true;

            const payload = {
                slade_code: this.organisation?.slade_code,
                view: 'autorecon_enabled',
            };

            this.dataLayer
                .listNested(
                    'recon-organisations',
                    payload.view,
                    payload.slade_code
                )
                .subscribe({
                    next: (response: any) => {
                        this.isAutoReconEnabledResponse = response;
                        this.loading = false;
                    },
                    error: this.handleErrorFxn,
                });
        }
    }

    enabledAutoReconSuccessfully = () => {
        const msg = `AutoRecon for ${this.organisation?.name} enabled successfully`;
        const context = `Enable AutoRecon for ${this.organisation?.name}`;
        this.showToast('bottom-right', 'success', context, msg);

        this.loading = false;
    };

    enableAutoRecon() {
        if (this.organisation) {
            this.loading = true;

            if (!this.isAutoReconEnabledResponse?.exists) {
                const params = {
                    slade_code: this.organisation?.slade_code,
                    organisation_name: this.organisation?.organisation_name,
                    tax_pin: this.organisation?.tax_payer_pin,
                    org_type: this.organisation.client_types?.[0]?.client_type,
                };

                this.dataLayer.create('recon-organisations', params).subscribe({
                    next: this.enabledAutoReconSuccessfully,
                    error: this.handleErrorFxn,
                });
            } else {
                this.dataLayer
                    .createNested(
                        'recon-organisations',
                        'activate',
                        this.organisation?.slade_code
                    )
                    .subscribe({
                        next: this.enabledAutoReconSuccessfully,
                        error: this.handleErrorFxn,
                    });
            }
        }
    }

    disableAutoRecon() {
        if (this.organisation) {
            this.loading = true;

            this.dataLayer
                .createNested(
                    'recon-organisations',
                    'deactivate',
                    this.organisation?.slade_code
                )
                .subscribe({
                    next: () => {
                        const msg = `Disabled ${this.organisation.name} from using AutoRecon successfully`;
                        const context = `Disabled AutoRecon for ${this.organisation.name}`;
                        this.showToast('bottom-right', 'success', context, msg);

                        this.loading = false;

                        this.$state.reload();
                    },
                    error: this.handleErrorFxn,
                });
        }
    }

    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    ngOnInit() {
        this.getOrganisationInfo();

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'modelChange',
        };
    }
}

import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

@Component({
    selector: 'ngx-branch-details-banner',
    templateUrl: './branch-details-banner.component.html',
    styleUrls: ['./branch-details-banner.component.scss'],
    standalone: false,
})
export class BranchDetailsBannerComponent implements OnInit {
    /**
     * Defines loading state
     */
    loading: boolean = false;
    /**
     * Contains organisation data
     */
    orgData: any;

    /**
     * Contains branch data
     */
    branchData: any;
    /**
     * Constructor for the settings class component
     * @param dataLayer injects instance of the datalayer service
     * @param errorHandler injects instance of errorhandler service
     * @param toastrService injects instance of nebular toast service
     */

    /**
     * Used to override default form configurations
     */
    formConfig: any;
    /**
     * Contains the organisation details
     */
    branchDetails: any;
    /**
     * Branch Id parameter
     */
    branchId: string = '';
    /**
     * Contains the observable resolved from the state service
     */
    @Input() branchObservable: any;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * toggle to store modal status
     */
    toggle: {
        etims_initialize_device: boolean;
    } = {
        etims_initialize_device: false,
    };

    /**
     * Used to toggle the add branch customer modal
     */
    toggleModal(context: 'etims_initialize_device') {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Method used to reload page
     */
    pageReloader() {
        this.$state.reload();
    }
    /**
     * Reload function that reloads the state
     */
    fxnReload() {
        setTimeout(() => {
            this.pageReloader();
        }, 500);
    }

    /**
     * The component constructor
     * @param toastService Connects to the toast service
     * @param $state Connects to the state service
     * @param transition injects uirouter transition service
     * @param dataLayer Connects to the data layer service
     * @param errorHandler Connects to the error handler service
     */
    constructor(
        protected toastService: NbToastrService,
        public $state: StateService,
        public transition: Transition,
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        public authConfig: Authorization
    ) {
        this.authConfig = authConfig;
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    branchDataDetails = (response: any) => {
        if (response.results && response.results.length > 0) {
            const branch = response.results[0];
            this.branchData = {
                id: branch.id,
                name: branch.name,
                phone_number: branch.phone_number,
                email_address: branch.email_address,
                etims_branch_id: branch.etims_branch_id,
                etims_device_serial_no: branch.etims_device_serial_no,
                etims_web_address: branch.etims_web_address,
                branch_status: branch.branch_status,
                is_etims_verified: branch.is_etims_verified,
                organisation_tax_pin: branch.organisation_tax_pin,
                username: branch.username,
                password: branch.password,
            };
        } else {
            console.error('No branch data found');
        }
    };

    errorHandlerGetOrg = err => {
        this.errorHandler.handleError(err, this);
    };

    getOrgBranchInfo(orgData, branchId) {
        this.dataLayer
            .list('branches', {
                organisation: orgData?.organisation_id,
                id: branchId,
            })
            .subscribe({
                next: this.branchDataDetails,
                error: this.errorHandlerGetOrg,
            });
    }

    redirectAfterDeviceInitialized = () => {
        this.loading = false;
        const msg = 'Device has been initialized successfully';
        this.showToast(
            'bottom-right',
            'success',
            'eTIMS Device Initialization',
            msg
        );
        this.fxnReload();
    };

    errorHandlerInitializeDevice = err => {
        this.errorHandler.handleError(err, this);
        this.loading = false;
        this.fxnReload();
        this.toggleModal('etims_initialize_device');
    };

    /**
     * Initialize device - eTIMS
     */
    etimsInitializeDevice(model) {
        model.organisation_tax_pin = this.branchData.organisation_tax_pin;
        model.branch_id = this.branchId;
        this.loading = true;
        this.dataLayer.create('etims-initialize-device', model).subscribe({
            next: this.redirectAfterDeviceInitialized,
            error: this.errorHandlerInitializeDevice,
        });
    }

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
        this.orgData = this.authConfig.getErpOrganisation();
        this.branchId = this.transition.params().id;
        this.getOrgBranchInfo(this.orgData, this.branchId);
    }
}

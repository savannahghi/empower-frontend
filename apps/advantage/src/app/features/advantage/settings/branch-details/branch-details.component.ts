import { Component, Input, OnInit } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';

@Component({
    selector: 'ngx-branch-details',
    templateUrl: './branch-details.component.html',
    styleUrls: ['./branch-details.component.scss'],
    standalone: false,
})
export class BranchDetailsComponent implements OnInit {
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
    branchId: string = this.uiglobals.params.id;
    /**
     * Contains the observable resolved from the state service
     */
    @Input() branchObservable: any;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * Go back to the previous page
     */
    back(): void {
        this.$state.go('app.advantage.settings.orglevel.branches');
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
        public authConfig: Authorization,
        public uiglobals: UIRouterGlobals
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
                name: branch.name,
                parent: branch.parent,
                parent_name: branch.parent_name,
                phone_number: branch.phone_number,
                email_address: branch.email_address,
                physical_address: branch.physical_address,
                postal_address: branch.postal_address,
                etims_web_address: branch.etims_web_address,
                etims_branch_id: branch.etims_branch_id,
                etims_device_serial_no: branch.etims_device_serial_no,
                branch_status: branch.branch_status,
                is_etims_verified: branch.is_etims_verified,
                id: this.branchId,
                organisation: this.orgData.organisation_id,
            };
        } else {
            console.error('No branch data found');
        }
    };

    getOrgBranchInfo(orgData, branchId) {
        this.dataLayer
            .list('branches', {
                organisation: orgData?.organisation_id,
                id: branchId,
            })
            .subscribe({
                next: this.branchDataDetails,
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    redirectAfterBranchUpdate = data => {
        const msg = `${data?.['name']} has been updated`;
        this.showToast('bottom-right', 'success', 'Organisation Update', msg);
        this.fxnReload();
    };

    updateOrganisationBranch(model) {
        const payload = {
            ...model,
            /** The parent is the id of the Cluster, coming from the Clusters Table, the parent_name is the name of the cluster and the two have a relationship */
            parent: model?.parent_name,
        };
        this.dataLayer.update('branches', this.branchId, payload).subscribe({
            next: this.redirectAfterBranchUpdate,
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
        this.orgData = this.authConfig.getErpOrganisation();
        this.getOrgBranchInfo(this.orgData, this.branchId);
    }
}

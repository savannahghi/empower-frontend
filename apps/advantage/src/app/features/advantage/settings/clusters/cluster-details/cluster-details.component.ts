import { Component, Input, OnInit } from '@angular/core';
import { StateService } from '@uirouter/angular';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { NbToastrService } from '@nebular/theme';
import { BranchModel, ClusterModel } from '../../../models';

@Component({
    selector: 'ngx-cluster-details',
    templateUrl: './cluster-details.component.html',
    styleUrls: ['./cluster-details.component.scss'],
    standalone: false,
})
export class ClusterDetailsComponent implements OnInit {
    /**
     * Used to override default form configurations
     */
    formConfig: any;
    /**
     * Contains the observable resolved from the state service
     */
    @Input() clusterObservable: any;

    clusterDetails: ClusterModel<BranchModel>;

    /** Boolean used to tell when message has been submitted */
    submitted: boolean;

    /*
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    constructor(
        public $state: StateService,
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        public authConfig: Authorization,
        protected toastService: NbToastrService
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

    /** Observable that waits for cluster details data to be fetched */
    getClusterDetails = () => {
        this.clusterObservable.subscribe(
            (response: ClusterModel<BranchModel>) => {
                this.clusterDetails = response;
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    };

    /**
     * update cluster details
     * @param event contains cluster payload
     */
    updateOrganisationCluster = event => {
        this.loading = true;
        this.dataLayer
            .update('clusters', this.clusterDetails.id, event)
            .subscribe({
                next: () => {
                    const msg = `Cluster updated successfully`;
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Cluster Update',
                        msg
                    );
                    setTimeout(() => {
                        this.$state.reload();
                    }, 1000);
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
                complete: () => {
                    this.loading = false;
                },
            });
    };

    /**
     * Go back to the previous page
     */
    back(): void {
        this.$state.go('app.advantage.settings.orglevel.clusters');
    }

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
        this.getClusterDetails();
    }
}

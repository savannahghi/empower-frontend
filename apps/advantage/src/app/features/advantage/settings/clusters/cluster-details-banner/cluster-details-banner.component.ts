import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService } from '@uirouter/angular';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { BranchModel, ClusterModel } from '../../../models';

@Component({
    selector: 'ngx-cluster-details-banner',
    templateUrl: './cluster-details-banner.component.html',
    styleUrls: ['./cluster-details-banner.component.scss'],
    standalone: false,
})
export class ClusterDetailsBannerComponent implements OnInit {
    /**
     * Contains the observable resolved from the state service
     */
    @Input() clusterObservable: any;
    /**
     * Defines loading state
     */
    loading: boolean = false;
    /**
     * Used to override default form configurations
     */
    formConfig: any;
    /**
     * cluster Id parameter
     */
    clusterId: string = '';

    /** holds cluster kra data */
    clusterKraPin: string;

    /**
     * Contains the organisation cluster details
     */
    clusterDetails: ClusterModel<BranchModel>;

    /**
     * toggle to store modal status
     */
    toggle: {
        edit_cluster_logo: boolean;
    } = {
        edit_cluster_logo: false,
    };

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * The component constructor
     * @param toastService Connects to the toast service
     * @param $state Connects to the state service
     * @param dataLayer Connects to the data layer service
     * @param errorHandler Connects to the error handler service
     */
    constructor(
        protected toastrService: NbToastrService,
        public $state: StateService,
        private errorHandler: ErrorHandlerService,
        public authConfig: Authorization,
        private dataLayer: SilStoresService
    ) {
        this.authConfig = authConfig;
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    /** Observable that waits for cluster details data to be fetched */
    getClusterDetails = () => {
        this.loading = true;
        this.clusterObservable.subscribe(
            (response: ClusterModel<BranchModel>) => {
                this.clusterDetails = response;
                this.getKraPin(response);
                this.loading = false;
            },
            err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            }
        );
    };

    /**
     * Used to toggle the cluster logo modal
     */
    toggleClusterLogoModal(context: 'edit_cluster_logo') {
        this.toggle[context] = !this.toggle[context];
    }

    // Handle new file selection
    onNewFileSelected = event => {
        const input = event.target;
        if (input.files && input.files.length > 0) {
            this.loading = true;
            const file = input.files[0];
            this.uploadClusterLogo(file);
        }
    };

    /**
     * get clusters kra pin
     * @param res
     */
    getKraPin = res => {
        /** find identifier with kraPIN type */
        const identifier = res.identifiers?.find(
            i => i.identifier_type === 'kraPIN'
        );
        /**  identifier defined return identifier_value else Nil */
        return identifier
            ? (this.clusterKraPin = identifier.identifier_value)
            : (this.clusterKraPin = 'Nil');
    };

    /**
     * upload cluster logo
     * @param file
     */
    uploadClusterLogo(file) {
        const formData = new FormData();
        formData.append('data', file);
        formData.append('title', file.name);
        formData.append('size', file.size);
        formData.append('content_type', file.type);
        formData.append('organisation_unit', this.clusterDetails.id);

        this.dataLayer.create('cluster-logos', formData).subscribe({
            next: () => {
                const msg = `${this.clusterDetails.name}'s logo uploaded successfully`;
                this.showToast(
                    'bottom-right',
                    'success',
                    'Upload Cluster Logo',
                    msg
                );
                this.loading = false;
                this.getClusterDetails();
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    // Handle edit/existing file selection
    onFileSelected(event) {
        const input = event.target;
        if (input.files && input.files.length > 0) {
            this.loading = true;
            const file = input.files[0];
            this.updateClusterLogo(file);
        }
    }

    /**
     * update cluster logo
     * @param file
     */
    updateClusterLogo(file) {
        const formData = new FormData();
        formData.append('data', file);
        formData.append('file', file);
        formData.append('title', file.name);
        formData.append('content_type', file.type);
        formData.append('size', file.size);

        if (this.clusterDetails?.orgunit_logo?.id) {
            this.dataLayer
                .update(
                    'cluster-logos',
                    this.clusterDetails?.orgunit_logo?.id,
                    formData
                )
                .subscribe({
                    next: () => {
                        const msg = `${this.clusterDetails?.name}'s logo updated successfully`;
                        this.showToast(
                            'bottom-right',
                            'success',
                            'Update Cluster Logo',
                            msg
                        );
                        this.loading = false;
                        this.toggleClusterLogoModal('edit_cluster_logo');
                        this.getClusterDetails();
                    },
                    error: err => {
                        this.errorHandler.handleError(err, this);
                        this.loading = false;
                    },
                });
        }
    }

    /**
     * deletes cluster logo
     */
    removeLogo() {
        if (this.clusterDetails?.orgunit_logo?.id) {
            this.dataLayer
                .remove('cluster-logos', this.clusterDetails?.orgunit_logo?.id)
                .subscribe({
                    next: () => {
                        const msg = `${this.clusterDetails.name}'s logo deleted successfully`;
                        this.showToast(
                            'bottom-right',
                            'success',
                            'Delete Cluster Logo',
                            msg
                        );
                        this.loading = false;
                        this.toggleClusterLogoModal('edit_cluster_logo');
                        this.getClusterDetails();
                    },
                    error: err => {
                        this.errorHandler.handleError(err, this);
                    },
                });
        }
    }

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
        this.getClusterDetails();
    }
}

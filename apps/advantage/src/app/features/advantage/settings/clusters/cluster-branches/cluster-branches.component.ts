import { Component, Input, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { UIRouterGlobals } from '@uirouter/angular';
import { NbToastrService } from '@nebular/theme';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { BranchModel, ClusterModel } from '../../../models';

@Component({
    selector: 'ngx-cluster-branches',
    templateUrl: './cluster-branches.component.html',
    styleUrls: ['./cluster-branches.component.scss'],
    standalone: false,
})
export class ClusterBranchesComponent implements OnInit {
    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Contains the observable resolved from the state service
     */
    @Input() clusterObservable: any;

    /** should display branches if cluster has branches */
    hasBranches: boolean = false;

    showAddBranchModal: boolean = false;

    /**
     * holds cluster details
     */
    clusterDetails: ClusterModel<BranchModel>;

    /**
     * holds branch details
     */
    branchDetails: any;

    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Array used to define the actions of the datatable
     */
    actions: Array<any>;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * Component constructor
     * @param errorHandler Access instance of error handler service
     */
    constructor(
        private errorHandler: ErrorHandlerService,
        public uiglobals: UIRouterGlobals,
        private dataLayer: SilStoresService,
        protected toastService: NbToastrService
    ) {}

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

    /**
     * Used to toggle the add branch modal
     */
    toggleModal() {
        this.branchDetails = {
            orgunit_type: 'branch',
            parent: this.clusterDetails.id,
        };
        this.showAddBranchModal = !this.showAddBranchModal;
    }

    /** Observable that waits for cluster details data to be fetched */
    getClusterDetails = () => {
        this.clusterObservable.subscribe(
            (response: ClusterModel<BranchModel>) => {
                this.clusterDetails = response;
                this.hasBranches =
                    this.clusterDetails?.children?.length > 0 ? true : false;
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    };

    /**
     * add branch to a cluster
     * @param data
     */
    addBranchToCluster = data => {
        this.loading = true;
        if (data.parent !== this.uiglobals.params?.id) {
            this.addDifferentParentCluster();
        } else {
            this.saveBranchToCluster(data);
        }
    };

    /**
     * handles adding different parent cluster when creating a branch
     */
    addDifferentParentCluster = () => {
        const context = 'Error, wrong cluster selected';
        const msg =
            'Please leave the parent cluster unchanged when adding a new branch';
        this.errorHandler.showErrorToast(
            'bottom-right',
            'danger',
            context,
            msg
        );
        this.loading = false;
        this.toggleModal();
    };

    /**
     * save branch to cluster
     * @param data
     */
    saveBranchToCluster = data => {
        this.dataLayer.create('branches', data).subscribe({
            next: () => {
                const msg = `Branch created successfully`;
                this.showToast(
                    'bottom-right',
                    'success',
                    'Branch Created',
                    msg
                );
                this.toggleModal();
                this.getClusterDetails();
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
            complete: () => {
                this.loading = false;
            },
        });
    };

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
        this.getClusterDetails();
        /**
         * Set the table header data
         */
        this.tableHeader = [
            { text: 'Name' },
            { text: 'Phone number' },
            { text: 'Email address' },
            { text: 'Physical address' },
            { text: 'Postal address' },
        ];

        this.rows = [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'phone_number',
                type: 'string',
            },
            {
                key: 'email_address',
                type: 'string',
            },
            {
                key: 'physical_address',
                type: 'string',
            },
            {
                key: 'postal_address',
                type: 'string',
            },
        ];
    }
}

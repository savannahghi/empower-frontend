import { Component, Input, OnInit } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

@Component({
    selector: 'ngx-branch-customers',
    templateUrl: './branch-customers.component.html',
    styleUrls: ['./branch-customers.component.scss'],
    standalone: false,
})
export class BranchCustomersComponent implements OnInit {
    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Defines the header columns of the table
     */
    tableHeader: Array<any>;
    etimsTableHeader: Array<any>;

    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;

    /**
     * Defines the table's rows
     */
    rows: Array<any>;
    etimsRows: Array<any>;

    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    /**
     * Defines the table's actions
     */
    actions: Array<any>;

    /**
     * sets the filter used to query for data in the datatable
     * @param event contains the params used in the datatable
     */
    setFilter(event) {
        this.queryArg = event;
    }

    /** used to filter datatable params */
    filterParams: Object;

    /**
     * Contains extra params is_customer true
     */
    extraPayload = { is_customer: true };

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
     * Contains the observable resolved from the state service
     */
    @Input() branchObservable: any;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;

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
        public uiglobals: UIRouterGlobals,
        public auth: AuthenticationService
    ) {
        this.authConfig = authConfig;
    }

    /**
     * toggle to store modal status
     */
    toggle: {
        add_branch_customer: boolean;
    } = {
        add_branch_customer: false,
    };

    /**
     * Used to toggle the add branch customer modal
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
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

    setupDataFromState() {
        this.rows = this.auth.checkPermission('erp.perform_etims_operations')
            ? this.uiglobals.current?.data['etimsRows']
            : this.uiglobals.current?.data['rows'];
        this.tableHeader = this.auth.checkPermission(
            'erp.perform_etims_operations'
        )
            ? this.uiglobals.current?.data['etimsTableHeader']
            : this.uiglobals.current?.data['tableHeader'];
        this.actions = this.uiglobals.current?.data['actions'];
    }

    receiveAddCustomerDetails = () => {
        this.$state.reload();
        const msg = 'Added Branch Customer Successful';
        const context = 'Add Branch Customer';
        this.showToast('bottom-right', 'success', msg, context);
    };

    /** Error handler for add branch customer */
    errorHandlerAddCustomerDetails = err => {
        this.errorHandler.handleError(err, this);
        this.toggleModal('add_branch_customer');
        this.$state.reload();
    };

    /**
     * adds branch customer
     */
    addBranchCustomer(model) {
        // Assign extraPayload to the model
        Object.assign(model, this.extraPayload);
        this.dataLayer.create('customers', model).subscribe({
            next: this.receiveAddCustomerDetails,
            error: this.errorHandlerAddCustomerDetails,
        });
    }

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        const params = this.transition.params();
        this.filterParams = {};

        if (params.search) {
            this.filterParams['search'] = params.search;
        }

        if (params.page) {
            this.filterParams['page'] = params.page;
        }

        this.setupDataFromState();
    }
}

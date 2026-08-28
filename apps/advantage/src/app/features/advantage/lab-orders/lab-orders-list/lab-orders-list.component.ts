import { Component, OnInit, ViewChild } from '@angular/core';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { PatientService } from '../../patients/patient.service';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-lab-orders-list',
    templateUrl: './lab-orders-list.component.html',
    styleUrls: ['./lab-orders-list.component.scss'],
    standalone: false,
})
/**
 * This is the class definition of the component
 */
export class LabOrdersListComponent implements OnInit {
    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /** Used to filter datatable params */
    filterParams: Object;

    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;

    /**
     * Service Request Id
     */
    serviceRequestId: string;

    /**
     * Used to get a reference of siltable used in the template
     */
    statusFilters: Array<any>;

    // State params for tracking active filters
    stateParams: any;

    // Direction filters
    directionFilters: Array<any>;

    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;

    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Component constructor
     * @param transition - Connects to the transition service
     * @param $state - Connects to the state service
     * @param patientService Access instance of the patient service
     * @param errorHandler - Connects to the error handler service
     * @param dataLayer - Connects to the datalayer service
     */
    constructor(
        public transition: Transition,
        public $state: StateService,
        public patientService: PatientService,
        private errorHandler: ErrorHandlerService,
        private dataLayer: SilStoresService,
        public authConfig: Authorization,
        private uiglobals: UIRouterGlobals
    ) {}

    /**
     * Used to get the advantage organization
     */
    organization = this.authConfig.getAdvantageOrganisation();

    /** toggles screening report drawer */
    viewLabOrder($event) {
        this.serviceRequestId = $event?.node?.id;

        this.getVisitPatient($event?.node?.subject?.id);
    }
    /** Get the patient details from the clinical Id */
    getVisitPatient(clinical_id) {
        this.dataLayer
            .list('patients', { clinical_id: clinical_id })
            .subscribe({
                next: response => this.responseFunction(response),
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     * Function used to handle the next callback
     * @param response server response
     */
    responseFunction(response) {
        if (response?.results[0]?.id) {
            this.$state.go(
                'app.advantage.patients.detail.lab-order',
                {
                    id: response?.results[0]?.id,
                    serviceRequestId: this.serviceRequestId,
                },
                { reload: true }
            );
        }
        return;
    }

    /**
     * sets the filter used to query for data in the datatable
     * @param event contains the params used in the datatable
     */
    setFilter(event) {
        this.queryArg = event;
    }

    /**
     * Custom status color mapping for lab orders
     * @param status The status string
     * @returns Nebular status color
     */
    getLabOrderStatusColor(status: string): string {
        if (!status) return 'basic';

        const normalizedStatus = status.toLowerCase();

        switch (normalizedStatus) {
            case 'active':
                return 'warning';
            case 'completed':
            case 'complete':
                return 'success';
            case 'pending':
            case 'requested':
                return 'warning';
            case 'cancelled':
            case 'rejected':
                return 'danger';
            default:
                return 'basic';
        }
    }

    /**
     *  Method to set direction filter (Outbound/Inbound)
     */
    setDirectionFilter(facilityID: string) {
        const filterParams = {
            facilityID: facilityID,
            page: 1,
        };
        this.$state.transitionTo(this.uiglobals.current.name, filterParams, {
            reload: false,
            notify: true,
            inherit: false,
        });
    }

    ngOnInit() {
        // Filter params
        this.filterParams = {};

        this.stateParams = this.uiglobals.params;

        // Table headers
        this.tableHeader = [
            { text: 'Patient' },
            { text: 'Test' },
            { text: 'Referred To' },
            { text: 'Order On' },
            { text: 'Status' },
            { text: 'Action' },
        ];

        // Table rows
        this.rows = [
            {
                nested: [
                    {
                        type: 'nestedVal',
                        path: 'node.subject.display',
                    },
                    {
                        type: 'nestedHealthId',
                        path: 'node.subject.identifier.value',
                    },
                ],
            },
            {
                type: 'mineVal',
                path: 'node.orderDetails.name',
            },
            {
                type: 'mineVal',
                path: 'node.receivingFacility',
            },
            {
                type: 'dateUTC',
                path: 'node.date',
            },
            {
                type: 'labOrderStatus',
                path: 'node.status',
            },
        ];

        // View Report Action button with quick patch action from sil.datatable
        this.actions = this['actions'] = [
            {
                btnText: 'View',
                status: 'primary',
                action: 'custom',
                modalConf: {
                    customFxn: true,
                },
            },
        ];

        /**
         * Filters used by sil-datatable-filter component
         */
        this.directionFilters = [
            {
                display: 'Outbound',
                filter: {
                    facilityID: '',
                },
                active: true,
            },
            {
                display: 'Inbound',
                filter: {
                    facilityID: this.organization.clinical_org_id,
                },
            },
        ];

        this.statusFilters = [
            {
                display: 'Active',
                filter: {
                    status: 'active',
                },
                active: true,
            },
            {
                display: 'Completed',
                filter: {
                    status: 'completed',
                },
            },
        ];
    }
}

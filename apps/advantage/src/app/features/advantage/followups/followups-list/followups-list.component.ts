import { Component, OnInit, ViewChild } from '@angular/core';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-followups-list',
    templateUrl: './followups-list.component.html',
    styleUrls: ['./followups-list.component.scss'],
    standalone: false,
})
/**
 * This is the class definition of the component
 */
export class FollowupsListComponent implements OnInit {
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

    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;

    variant: string;
    /**
     * Sets filter parameters for the examinations table
     * @param filters The filter object containing search parameters to apply
     */
    setFilter(filters: any): void {
        this.queryArg = filters;
    }

    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Component constructor
     * @param transition - Connects to the transition service
     * @param $state - Connects to the state service
     * @param errorHandler - Connects to the error handler service
     * @param dataLayer - Connects to the datalayer service
     */
    constructor(
        public transition: Transition,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        public authConfig: Authorization
    ) {}

    /** view post screening follow up report */
    viewPostScreeningReport($event) {
        this.$state.transitionTo('app.advantage.followups.detail', {
            taskId: $event?.node?.id,
        });
    }

    /** when component mounts */
    ngOnInit() {
        // Filter params
        this.filterParams = {};

        // Table headers
        this.tableHeader = [
            { text: 'Follow Up Task' },
            { text: 'Patient Details' },
            { text: 'Created On' },
            { text: 'Due On' },
            { text: 'Status' },
            { text: 'Action' },
        ];

        // Table rows
        this.rows = [
            {
                type: 'mineValTitleCase',
                path: 'node.description',
            },
            {
                nested: [
                    {
                        path: 'node.subject.display',
                        type: 'nestedVal',
                    },
                    {
                        path: 'node.subject.identifier.value',
                        type: 'nestedVal',
                    },
                ],
            },
            {
                type: 'dateUTC',
                path: 'node.authoredOn',
            },
            {
                type: 'dateUTC',
                path: 'node.dueDate',
            },
            {
                type: 'mineValWithStatus',
                path: 'node.status',
            },
        ];

        // Actions for datatable
        this.actions = [
            {
                btnText: 'View',
                status: 'primary',
                action: 'custom',
                modalConf: {
                    customFxn: true,
                },
            },
            {
                btnText: 'Complete',
                status: 'success',
                action: 'modal',
                expression: (row: any) => {
                    if (!row) {
                        return;
                    } else {
                        return (
                            row.node.status?.toLowerCase() !== 'completed' &&
                            row.node.status?.toLowerCase() !== 'cancelled'
                        );
                    }
                },
                modalConf: {
                    openModal: true,
                    context: 'Complete Follow Up Task',
                    formConfig: {
                        checkExpressionOn: 'changeDetectionCheck',
                    },
                    store: 'completePostScreening',
                    isService: true,
                    action: 'quickPatch',
                    method: 'updateFollowUp',
                    data: {
                        status: 'completed',
                    },
                },
            },
        ];

        /**
         * Filters used by sil-datatable-filter component
         */
        this.statusFilters = [
            {
                display: 'Requested',
                filter: {
                    status: 'requested',
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

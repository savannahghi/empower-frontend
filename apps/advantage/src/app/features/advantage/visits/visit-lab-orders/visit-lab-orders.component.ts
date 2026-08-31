import { Component, OnInit } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'visit-lab-orders',
    templateUrl: './visit-lab-orders.component.html',
    styleUrls: ['./visit-lab-orders.component.scss'],
    standalone: false,
})
/**
 * Class that renders a Visit Lab Orders Component
 */
export class VisitLabOrdersComponent implements OnInit {
    /**
     * Component constructor
     * @param uiglobals - Connects to the uiglobals service
     */
    constructor(public uiglobals: UIRouterGlobals) {}
    /**
     * Defines visit data
     */
    visit: any;
    /**
     * Contains visit Id
     */
    visitId: string;

    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;
    /**
     * Used to get a reference of siltable used in the template
     */
    statusFilters: Array<any>;

    /**
     * Defines default filter params
     */
    filterParams: any;

    /**
     * Defines loading state
     */
    loading: boolean = false;
    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;

    /**
     * sets the filter used to query for data in the datatable
     * @param event contains the params used in the datatable
     */
    setFilter(event) {
        this.queryArg = event;
    }

    /** when component mounts */
    ngOnInit() {
        // Filter params
        this.filterParams = {
            visit_id: this.uiglobals.params.id,
        };

        // Table headers
        this.tableHeader = [
            { text: 'Name' },
            { text: 'Loinc Code' },
            { text: 'Diagnosis' },
            { text: 'Status' },
        ];

        // Table rows
        this.rows = [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'loinc_code',
                type: 'string',
            },
            {
                key: 'diagnosis_name',
                type: 'string',
            },

            {
                key: 'status',
                type: 'statusColor',
            },
        ];

        this.actions = [];

        /**
         * Filters used by sil-datatable-filter component
         */
        this.statusFilters = [
            {
                display: 'All',
                filter: {
                    status: 'clear',
                },
            },
            {
                display: 'Registered',
                filter: {
                    status: 'REGISTERED',
                },
            },
            {
                display: 'Final',
                filter: {
                    status: 'FINAL',
                },
            },
        ];
    }
}

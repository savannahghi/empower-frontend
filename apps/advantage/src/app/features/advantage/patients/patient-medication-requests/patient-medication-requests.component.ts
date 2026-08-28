import { Component, OnInit } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'patient-medication-requests',
    templateUrl: './patient-medication-requests.component.html',
    styleUrls: ['./patient-medication-requests.component.scss'],
    standalone: false,
})
/**
 * Class that renders a Patient's Medication Requests Component
 */
export class PatientMedicationRequestsComponent implements OnInit {
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

    /**
     * Component constructor
     * @param uiglobals - Connects to the uiglobals service
     */
    constructor(public uiglobals: UIRouterGlobals) {}

    /** when component mounts */
    ngOnInit() {
        // Filter params
        this.filterParams = {
            patient: this.uiglobals.params.id,
        };

        // Table headers
        this.tableHeader = [
            { text: 'Medication' },
            { text: 'Dose Unit' },
            { text: 'Dose Quantity' },
            { text: 'Condition' },
            { text: 'Status' },
        ];

        // Table rows
        this.rows = [
            {
                key: 'medication_name',
                type: 'string',
            },
            {
                path: 'dosage.0.dose_unit',
                type: 'mineVal',
            },
            {
                path: 'dosage.0.dose_quantity',
                type: 'mineVal',
            },
            {
                path: 'dosage.0.condition',
                type: 'mineVal',
            },
            {
                key: 'status',
                type: 'statusColor',
            },
        ];

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
                display: 'Active',
                filter: {
                    status: 'ACTIVE',
                },
            },
            {
                display: 'Completed',
                filter: {
                    status: 'COMPLETED',
                },
            },
        ];
    }
}

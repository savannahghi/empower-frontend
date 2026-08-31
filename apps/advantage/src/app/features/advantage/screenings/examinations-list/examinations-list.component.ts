import { Component, OnInit, ViewChild } from '@angular/core';
import { StateService } from '@uirouter/angular';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { NbToastrService } from '@nebular/theme';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';

/**
 * Component selector and template url
 */
@Component({
    selector: 'ngx-examinations-list',
    templateUrl: './examinations-list.component.html',
    styleUrls: ['./examinations-list.component.scss'],
    standalone: false,
})
/**
 * Class that defines examinations list controls, methods and lifecycle hooks
 */
export class ExaminationsListComponent implements OnInit {
    /**
     * Boolean used to display the examination report drawer
     */
    showExaminationReport: boolean = false;

    /**
     * Encounter selected (or the specific examination record for the report)
     */
    encounter: any;

    /** patient observations */
    observations: any[];

    /**
     * Stores the fetched data for the examination report
     */
    examinationReportData: any;

    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * Used to get a reference of siltable used in the template
     */
    statusFilters: Array<any>;

    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;

    /** Used to filter datatable params */
    filterParams: Object;

    /**
     * Used to get a reference to the SilDatatableComponent instance in the template
     */
    @ViewChild(SilDatatableComponent) siltable!: SilDatatableComponent;

    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;
    loading: boolean;

    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     * @param dataLayer - Connects to the datalayer service
     * @param $state - Connects to the state service
     * @param errorHandler - Connects to the error handler service
     */
    constructor(
        public $state: StateService,
        public errorHandler: ErrorHandlerService,
        public toastrService: NbToastrService,
        public dataLayer: SilStoresService
    ) {}

    /** when component mounts */
    ngOnInit(): void {
        // Table headers based on the 'observations' payload
        this.tableHeader = [
            { text: 'Name' },
            { text: 'Value' },
            { text: 'Status' },
            { text: 'Category' },
            { text: 'Time Recorded' },
            { text: 'Screening Type' },
            { text: 'Action', className: 'ms-2 text-center' },
        ];

        // Table rows based on the 'observations' payload
        this.rows = [
            {
                path: 'node.name',
                type: 'mineVal',
            },
            {
                path: 'node.value',
                type: 'mineVal',
            },
            {
                path: 'node.status',
                type: 'mineValTitleCase',
            },
            {
                path: 'node.category',
                type: 'mineVal',
            },
            {
                path: 'node.timeRecorded',
                type: 'dateUTC',
            },
            {
                path: 'node.usageContext',
                type: 'mineValTitleCase',
            },
        ];

        // Initialize actions available for each examination record
        this.actions = [
            {
                btnText: 'View Details',
                status: 'primary',
                action: 'custom',
                modalConf: {
                    customFxn: true,
                },
            },
        ];

        // Initialize default filter parameters
        this.filterParams = {
            use_context: 'SCREENING_EXAMINATIONS',
            _count: 20,
        };

        /**
         * Filters used by sil-datatable-filter component
         */
        this.statusFilters = [
            {
                display: 'Final',
                filter: {
                    status: 'final',
                },
                active: true,
            },
            {
                display: 'Preliminary',
                filter: {
                    status: 'preliminary',
                },
            },
        ];

        this.loading = true;
        this.dataLayer.list('observations', this.filterParams).subscribe({
            next: (response: { edges?: any[] }) => {
                if (response && response.edges && response.edges.length > 0) {
                    this.observations = response.edges;
                } else {
                    this.observations = [];
                }
                this.loading = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    /**
     * Sets filter parameters for the examinations table
     * @param filters The filter object containing search parameters to apply
     */
    setFilter(filters: any): void {
        this.queryArg = filters;
    }

    /**
     * Toggles the visibility of the examination report drawer
     */
    toggleReportDrawer(): void {
        this.showExaminationReport = !this.showExaminationReport;
        if (!this.showExaminationReport) {
            this.examinationReportData = null;
        }
    }

    /**
     * Navigate to examination details page
     * @param $event the data object for the selected row from sil-table
     */
    viewReport($event: any): void {
        if (!$event.node) {
            this.toastrService.danger(
                'Cannot view details: Missing observation ID',
                'Error'
            );
            return;
        }
        const observationId = $event.node.id;

        // Store encounter information
        this.encounter = {
            observationId: observationId,
            examinationType: $event.node.name,
            usageContext: $event.node.usageContext,
            patientId: $event.node.patientID,
            timeRecorded: $event.node.timeRecorded,
        };

        this.getObservationDetails(observationId);
    }

    /**
     * Get the observation details from the observation ID
     * @param observationId The observation ID from the examination record
     */
    getObservationDetails(observationId: string): void {
        if (!observationId) {
            this.toastrService.danger(
                'Cannot fetch details: Missing observation ID',
                'Error'
            );
            return;
        }

        this.dataLayer
            .list('observations', {
                id: observationId,
                use_context: 'SCREENING_EXAMINATIONS',
                limit: 1,
            })
            .subscribe({
                next: response => this.responseFunction(response),
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.toastrService.danger(
                        'Failed to fetch examination details.',
                        'Error'
                    );
                },
            });
    }

    /**
     * Function used to handle the observation lookup response and navigate to details
     * @param response server response containing observation data
     */
    responseFunction(response: any): void {
        let observationData = null;

        if (response?.edges && response.edges.length > 0) {
            observationData = response.edges[0].node;
        } else if (response?.Edges && response.Edges.length > 0) {
            observationData = response.Edges[0].Node;
        } else if (response?.results && response.results.length > 0) {
            observationData = response.results[0];
        }

        if (observationData) {
            sessionStorage.setItem(
                'currentObservationData',
                JSON.stringify(observationData)
            );

            this.$state.go(
                'app.advantage.screenings.examinations-details',
                {
                    observationId: this.encounter?.observationId,
                    examinationType: this.encounter?.examinationType,
                    timeRecorded: this.encounter?.timeRecorded,
                    patientId: this.encounter?.patientId,
                    usageContext: this.encounter?.usageContext,
                },
                { reload: true }
            );
        } else {
            this.toastrService.warning(
                'Examination details not found.',
                'Not Found'
            );
        }
    }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { StateService, Transition } from '@uirouter/angular';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';

/**
 * Component selector and template url
 */
@Component({
    selector: 'sil-screenings-list',
    templateUrl: './screenings-list.component.html',
    styleUrls: ['./screenings-list.component.scss'],
    standalone: false,
})

/**
 * Class that defines screenings list controls, methods and lifecycle hooks
 */
export class ScreeningsListComponent implements OnInit {
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
     * Boolean used to display the screening report
     */
    showScreeningReport: boolean = false;
    /** patient screenings */
    screenings: any[];

    /**
     * Encounter selected
     */
    encounter: any;

    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;

    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Used to get a reference of siltable used in the template
     */
    statusFilters: Array<any>;

    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;

    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     * @param dataLayer - Connects to the datalayer service
     * @param transition - Connects to the transition service
     * @param $state - Connects to the state service
     * @param errorHandler - Connects to the error handler service
     * @param swalTargets - Connects to the sweetalert service
     */
    constructor(
        public toastrService: NbToastrService,
        public transition: Transition,
        public $state: StateService,
        public readonly swalTargets: SwalPortalTargets,
        public errorHandler: ErrorHandlerService,
        public dataLayer: SilStoresService
    ) {}

    /**
     * toggle Report Drawer
     */
    toggleReportDrawer() {
        this.showScreeningReport = !this.showScreeningReport;
        this.encounter = {};
    }

    /**
     * sets the filter used to query for data in the datatable
     * @param event contains the params used in the datatable
     */
    setFilter(event) {
        this.queryArg = event;
    }

    /** toggles screening report drawer */
    viewReport($event) {
        this.encounter = {
            encounterID: $event?.node?.encounter.id,
            cancerType: $event?.node?.usageContext
                ?.toLowerCase()
                .replace(/ /g, '_')
                .split('_')[0],
        };

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
                'app.advantage.patients.detail.screening-report',
                {
                    id: response?.results[0]?.id,
                    cancerType: this.encounter?.cancerType,
                    encounterId: this.encounter?.encounterID,
                },
                { reload: true }
            );
        }
        return;
    }

    /** when component mounts */
    ngOnInit() {
        // Filter params
        this.filterParams = {};

        // Table headers
        this.tableHeader = [
            { text: 'Patient Details' },
            { text: 'Screening Details' },
            { text: 'Date' },
            { text: 'Action' },
        ];

        // Table rows
        this.rows = [
            {
                type: 'mineVal',
                path: 'node.subject.display',
            },
            {
                type: 'mineVal',
                path: 'node.usageContext',
            },
            {
                type: 'dateUTC',
                path: 'node.occurrenceDateTime',
            },
        ];

        // View Report Action button with quick patch action from sil.datatable
        this.actions = this['actions'] = [
            {
                btnText: 'View Report',
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
        this.statusFilters = [
            {
                display: 'All',
                filter: {
                    result: '',
                },
                active: true,
            },
            {
                display: 'High Risk',
                filter: {
                    result: 'High Risk',
                },
            },
            {
                display: 'Average Risk',
                filter: {
                    result: 'Average Risk',
                },
            },
            {
                display: 'Low Risk',
                filter: {
                    result: 'Low Risk',
                },
            },
            {
                display: 'Not At Risk',
                filter: {
                    result: 'Not At Risk',
                },
            },
        ];

        this.loading = true;
        this.dataLayer.list('screenings', this.filterParams).subscribe({
            next: (response: { edges?: any[] }) => {
                if (response && response.edges && response.edges.length > 0) {
                    this.screenings = response.edges;
                } else {
                    this.screenings = [];
                }
                this.loading = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }
}

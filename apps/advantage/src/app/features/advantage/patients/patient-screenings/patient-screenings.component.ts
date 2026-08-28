import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/core';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { PatientService } from '../patient.service';

@Component({
    selector: 'patient-screenings',
    templateUrl: './patient-screenings.component.html',
    styleUrls: ['./patient-screenings.component.scss'],
    standalone: false,
})
export class PatientScreeningsComponent implements OnInit {
    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /** patient screenings */
    screenings: any[];

    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;

    /**
     * Component loader for the patient observable
     */
    isPatientObservableLoaded: boolean = false;

    /**
     * Defines default filter params
     */
    filterParams: any;

    /**
     * Defines loading state
     */
    loading: boolean = false;
    /**
     * Boolean used to display the screening report
     */
    showScreeningReport: boolean = false;
    /**
     * Encounter selected
     */
    encounter: any;

    /**
     * Contains the observable resolved from the state service
     */
    @Input() patientObservable: any;

    /**
     * Contains patient information
     */
    patient: any;
    /**
     * toggle Report Drawer
     */
    toggleReportDrawer() {
        this.showScreeningReport = !this.showScreeningReport;
        this.encounter = {};
    }

    /** tNavigate to view screening report */
    viewReport($event) {
        this.encounter = {
            encounterID: $event?.node?.encounter.id,
            cancerType: $event?.node?.usageContext
                ?.toLowerCase()
                .replace(/ /g, '_')
                .split('_')[0],
        };
        this.$state.transitionTo(
            'app.advantage.patients.detail.screening-report',
            {
                id: this.uiglobals.params.id,
                cancerType: this.encounter?.cancerType,
                encounterId: this.encounter?.encounterID,
            },
            { reload: true }
        );
    }

    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     * @param transition - Connects to the transition service
     * @param $state - Connects to the state service
     * @param uiglobals - Connects to the uiglobals service
     * @param patientService Access instance of the patient service
     * @param errorHandler - Connects to the error handler service
     * @param swalTargets - Connects to the sweetalert service
     */
    constructor(
        protected toastrService: NbToastrService,
        public transition: Transition,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        public patientService: PatientService,
        private errorHandler: ErrorHandlerService,
        public readonly swalTargets: SwalPortalTargets
    ) {}

    getPatientInfo() {
        /** Resolved observable from the state */
        this.patientObservable.subscribe(
            (response: any) => {
                this.patient = response;
                this.filterParams = {
                    patientID: this.patient.clinical_id,
                };
                this.isPatientObservableLoaded = true;
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }

    /** when component mounts */
    ngOnInit() {
        // Table headers
        this.tableHeader = [
            { text: 'Screening Type' },
            { text: 'Perfomed On' },
            { text: 'Action' },
        ];

        // Table rows
        this.rows = [
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

        /** fetch screenings */
        this.getPatientInfo();
    }
}

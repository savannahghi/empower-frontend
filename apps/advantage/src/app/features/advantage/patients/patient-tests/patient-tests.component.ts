import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { PatientService } from '../patient.service';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/core';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';

@Component({
    selector: 'patient-tests',
    templateUrl: './patient-tests.component.html',
    styleUrls: ['./patient-tests.component.scss'],
    standalone: false,
})
export class PatientTestsComponent implements OnInit {
    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * Component loader for the patient observable
     */
    isPatientObservableLoaded: boolean = false;

    /** patient follow ups */
    follow_ups: any[];

    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;

    /**
     * Defines default filter params
     */
    filterParams: any;

    /**
     * Contains patient information
     */
    patient: any;
    @Input() patientObservable: any;

    /**
     * Defines loading state
     */
    loading: boolean = false;

    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     * @param dataLayer - Connects to the datalayer service
     * @param transition - Connects to the transition service
     * @param $state - Connects to the state service
     * @param uiglobals - Connects to the uiglobals service
     * @param patientService Access instance of the patient service
     * @param errorHandler - Connects to the error handler service
     */
    constructor(
        protected toastrService: NbToastrService,
        public transition: Transition,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        public patientService: PatientService,
        private errorHandler: ErrorHandlerService
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

    /** view post screening follow up report */
    viewLabOrder($event) {
        this.$state.transitionTo('app.advantage.patients.detail.lab-order', {
            id: this.uiglobals.params.id,
            serviceRequestId: $event?.node?.id,
        });
    }

    /** when component mounts */
    ngOnInit() {
        // Table headers
        this.tableHeader = [
            { text: 'Test' },
            { text: 'Ordered To' },
            { text: 'Ordered On' },
            { text: 'Status' },
            { text: 'Action' },
        ];

        // Table rows
        this.rows = [
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
                type: 'mineValWithStatus',
                path: 'node.status',
            },
        ];

        // View Action button with quick patch action from sil.datatable
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

        // fetch patient's follow ups
        this.getPatientInfo();
    }
}

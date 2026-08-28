import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageComponent } from '../../../../shared/page/page.component';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { AnalyticsService } from '../../../../@core/utils';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { Observable, Subject, Subscription } from 'rxjs';
import moment from 'moment';
import { fadeAnimation } from '../../../../shared/animations/if-animations';
import { VisitService } from '../../visits/visit.service';
import { DiagnosisInterface } from '../../models/ClinicalNotes';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

@Component({
    selector: 'patient-diagnosis',
    templateUrl: './patient-diagnosis.component.html',
    styleUrls: ['./patient-diagnosis.component.scss'],
    animations: [fadeAnimation],
    standalone: false,
})
export class PatientDiagnosisComponent extends PageComponent implements OnInit {
    /**
     *
     * @param toastrService
     * @param uiglobals
     * @param $state
     * @param analytics
     * @param errorHandler
     */
    constructor(
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public visitService: VisitService,
        public analytics: AnalyticsService,
        private errorHandler: ErrorHandlerService,
        public dataLayer: SilStoresService
    ) {
        super(toastrService, uiglobals, $state, analytics);
    }

    /** stores the active service request */
    @Input() activeServiceRequest: any;

    /** stores the patient's visit status */
    @Input() patientVisitStatus: any;

    /** holds patient info */
    @Input() patient: any;

    /** stores patient start visit date*/
    @Input() visitDate: any;

    @Input() isVisitDatePassed: boolean;

    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    /**
     * sends event to ClinicaRecords parent component to show/hide send patient to service point modal
     */
    @Output() toggleServicePointModalEvent: EventEmitter<any> =
        new EventEmitter<any>();

    /**
     * opens the template if note is already added, to prevent alot of clicks
     */
    @Output() toggleIsHiddenEvent?: EventEmitter<any> = new EventEmitter<any>();

    /** Diagnosis data */
    diagnosisData: any[] = [];

    /**
     * Used to control loading for search
     */
    loadingDiagnosis: boolean = false;

    /**
     * Observable that loads the conditions
     */
    conditions$: Observable<any>;
    /**
     * Subject that checks the search input
     */
    searchInput$ = new Subject<string>();
    /**
     * Stores the search term
     */
    term: string;

    /**
     * max date validator for date picker
     */
    max: any;

    /** stores selected condition */
    selectedCondition: any = {};

    /** indicates saving diagnosis loading state */
    savingDiagnosis: boolean = false;

    /** display diagnosis form */
    diagnosisFormIsHidden = false;

    loadingResult: boolean = false;

    patientDiagnosis: [] = [];

    patientDiagnosisCount: any;

    querySubscription: Subscription;

    visitStatus = ['CANCELLED', 'ENTERED_IN_ERROR'];

    model: any;

    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Shows the loading of the xhr requests
     */
    loading: boolean = false;
    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;
    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;
    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    /** stores selected diagnosis */
    selectedDiagnosis: DiagnosisInterface;

    showPreviewDiagnosisModal: boolean = false;

    /** stores condition name */
    conditionName: string = '';

    /** stores condition type can be either chronic(recurrence), confirmed, provisional */
    conditionType: string = '';

    /** emit serve patient modal event */
    emitToggleServicePointModal() {
        this.toggleServicePointModalEvent.emit('toggle service point modal');
    }
    /**
     * Indicates if the send to next service point function can be shown
     */
    @Input() showNextSpButton?: boolean = true;
    /**
     * Toogle function to display or hide cards
     */
    toggleIsHidden(section) {
        if (section === 'diagnosisForm') {
            this.diagnosisFormIsHidden = !this.diagnosisFormIsHidden;
        }
    }

    /** closes add diagnosis form */
    cancelAddDiagnosis() {
        this.diagnosisFormIsHidden = true;
    }

    /** toggles diagnosis modal */
    togglePreviewDiagnosisModal(event?) {
        if (event) {
            this.selectedDiagnosis = event;
        } else {
            this.selectedDiagnosis = {};
        }
        this.showPreviewDiagnosisModal = !this.showPreviewDiagnosisModal;
    }

    /** fetch patient diagnosis */
    fetchPatientDiagnosis() {
        if (
            !this.patient?.clinical_id ||
            !this.activeServiceRequest?.encounter_id
        ) {
            this.loadingResult = false;
            return;
        }

        this.dataLayer
            .list('condition', {
                patient_id: this.patient.clinical_id,
                encounter_id: this.activeServiceRequest.encounter_id,
                limit: 10,
            })
            .subscribe({
                next: (res: any) => {
                    this.loadingResult = false;
                    if (res.totalCount > 0) {
                        this.patientDiagnosisCount = res.totalCount;
                        const arr = res.edges.filter(diagnosis => {
                            return (
                                diagnosis.node.category ===
                                'encounter-diagnosis'
                            );
                        });
                        if (arr.length > 0) {
                            this.diagnosisFormIsHidden = true;

                            this.patientDiagnosis = arr.map(
                                this.selectFewerFields
                            );
                        } else {
                            this.diagnosisFormIsHidden = false;
                        }
                    }
                },
                error: (err: any) => {
                    this.showToastError(
                        'bottom-right',
                        'danger',
                        'Error',
                        err?.error?.message
                    );
                    this.loadingResult = false;
                },
            });
    }

    handleError = error => {
        this.showToastError('bottom-right', 'danger', 'Error', error?.message);
        this.loadingResult = false;
    };

    /** selects data needed from the response */
    selectFewerFields = select => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { code, name, system, status, note, recordedDate, onsetDate } =
            select.node;
        return {
            code,
            name,
            system,
            status,
            note,
            recordedDate,
            onsetDate,
        };
    };

    /**
     *  add a patient diagnosis item
     */
    addPatientDiagnosisItem(model) {
        if (!this.activeServiceRequest?.encounter_id) {
            this.showToastError(
                'bottom-right',
                'danger',
                'Error',
                'No active encounter found'
            );
            return;
        }

        // gets the model form
        /** SET ICD-10-WHO system to IDC10  */
        const system =
            model['diagnosis'].system === 'ICD-10-WHO'
                ? 'ICD10'
                : model['diagnosis'].system.replace(/-/g, '_');

        const diagnosisPayload = {
            code: model['diagnosis'].code,
            name: model['diagnosis'].name,
            system,
            status: model.status,
            severity: model.severity,
            category: 'ENCOUNTER_DIAGNOSIS',
            encounterID: this.activeServiceRequest.encounter_id,
            onsetDate: moment(model['diagnosis'].onset_date).format(
                'YYYY-MM-DD'
            ),
            note: model.note,
        };
        this.conditionName = model['diagnosis'].name;
        this.conditionType = model.status;
        this.addPatientDiagnosis(diagnosisPayload);
    }

    /**
     * @param diagnosisVariables arg is var required for graphql mutation
     */
    addPatientDiagnosis(diagnosisPayload): any {
        this.loadingResult = true;
        this.savingDiagnosis = true;
        this.dataLayer
            .create('condition', diagnosisPayload, null, null, null, null, true)
            .subscribe({
                next: () => {
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Successful',
                        `${this.conditionName} added`
                    );
                    this.conditionName = '';
                    this.visitService.reFetchChronicCondition(
                        `${this.conditionType}`
                    );
                    this.fetchPatientDiagnosis();
                    this.loadingResult = false;
                    this.savingDiagnosis = false;
                },
                error: () => {
                    this.showToast(
                        'bottom-right',
                        'danger',
                        'Error',
                        'There was an error adding the diagnosis.'
                    );
                    this.loadingResult = false;
                },
            });
    }

    responseFunction = response => {
        const nestedMutationResponse = 'createCondition';
        if (response.data[`${nestedMutationResponse}`]) {
            this.loadingResult = false;
            this.showToast(
                'bottom-right',
                'success',
                'Successful',
                `${this.conditionName} added`
            );
            this.conditionName = '';
            this.visitService.reFetchChronicCondition(`${this.conditionType}`);
        }
        this.fetchPatientDiagnosis();
        this.savingDiagnosis = false;
        this.loadingResult = false;
    };

    ngOnInit() {
        if (
            this.patient?.clinical_id &&
            this.activeServiceRequest?.encounter_id
        ) {
            this.fetchPatientDiagnosis();
        } else {
            this.loadingResult = false;
        }
        // Table header
        this.tableHeader = [
            { text: 'clinical.table_header.name' },
            { text: 'clinical.table_header.note' },
            { text: 'clinical.table_header.status' },
            { text: 'clinical.table_header.date' },
            { text: 'clinical.table_header.action' },
        ];
        // Table rows
        this.rows = [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'note',
                type: 'diagnosis_note',
            },
            {
                key: 'status',
                type: 'diagnosis_status',
            },
            {
                nested: [
                    {
                        label: 'Onset',
                        value: 'onsetDate',
                        type: 'date',
                    },
                    {
                        label: 'Recorded',
                        value: 'recordedDate',
                        type: 'date',
                    },
                ],
            },
        ];

        /**
         * Set the actions used for each row in the patient list table
         * */
        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.view',
                status: 'success',
                action: 'custom',
                modalConf: {
                    customFxn: true,
                },
            },
        ];
    }
}

import {
    afterNextRender,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { PageComponent } from '../../../../shared/page/page.component';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { AnalyticsService } from '../../../../@core/utils';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { fadeAnimation } from '../../../../shared/animations/if-animations';
import { ProblemInterface } from '../../models/ClinicalNotes';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

@Component({
    selector: 'patient-problem',
    templateUrl: './patient-problem.component.html',
    styleUrls: ['./patient-problem.component.scss'],
    animations: [fadeAnimation],
    standalone: false,
})
export class PatientProblemComponent extends PageComponent implements OnInit {
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
        public analytics: AnalyticsService,
        private errorHandler: ErrorHandlerService,
        public dataLayer: SilStoresService
    ) {
        super(toastrService, uiglobals, $state, analytics);
        afterNextRender(() => {
            this.loadCkEditor();
        });
    }

    async loadCkEditor() {
        if (typeof window !== 'undefined') {
            const classicEditor = (
                await import('@ckeditor/ckeditor5-build-classic')
            ).default;
            this.Editor = classicEditor;
        }
    }
    /**
     * Used to define the score card's background color
     */
    @Input() styleClass: string;

    querySubscription: Subscription;

    @Input() patient: any;

    @Input() item: any;

    /**
     * Indicates if the send to next service point function can be shown
     */
    @Input() showNextSpButton?: boolean = true;

    /** stores active service request */
    @Input() activeServiceRequest: any;

    /** stores patient visit status */
    @Input() patientVisitStatus: any;

    /** stores visit info */
    @Input() visit: any;

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
    @Output() toggleIsHiddenEvent: EventEmitter<any> = new EventEmitter<any>();

    itemHeading: any;

    itemHeadingTwo: any;

    /** stores vital reference condition i.e Normal/High/Low */
    vitalReferenceCondition: any;

    visitStatus = ['CANCELLED', 'ENTERED_IN_ERROR'];

    /**
     * Used to store a result after using the query
     */
    patientConditions: any[] = [];

    /** display problem form */
    showProblemFormDrawer = false;

    /**
     * Used to store patient's problems
     */
    patientProblems: any[] = [];

    patientProblemsCount: number = 0;

    /** active modal id */
    toggleId: any;

    @Input() isAddVital: boolean;

    model: Object;

    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    /**
     * Used to store a result after using the query
     */
    result: { value: number; timeRecorded: string };
    /**
     * Used to show that the component is loading
     *  */
    loadingResult: boolean = false;

    showPreviewProblemModal: boolean = false;

    /** stores selected problem */
    selectedProblem: ProblemInterface;

    /** store problem name */
    problemName: string = '';

    public Editor: any;

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

    /** disables ckeditor */
    isCkEditorDisabled: boolean = true;

    /** emit serve patient modal event */
    emitToggleServicePointModal() {
        this.toggleServicePointModalEvent.emit('toggle service point modal');
    }

    /**
     * Toogle function to display or hide cards
     */
    toggleProblemFormDrawer() {
        this.showProblemFormDrawer = !this.showProblemFormDrawer;
    }

    /**
     * Gets patient's problem/complaint.
     */
    fetchPatientProblem() {
        if (
            !this.patient?.clinical_id ||
            !this.activeServiceRequest?.encounter_id
        ) {
            this.loadingResult = false;
            return;
        }

        this.loadingResult = true;
        this.dataLayer
            .list('condition', {
                patient_id: this.patient.clinical_id,
                encounter_id: this.activeServiceRequest.encounter_id,
                limit: 10,
            })
            .subscribe({
                next: (res: any) => {
                    if (res.TotalCount > 0) {
                        const arr = res.Edges.filter(problem => {
                            return (
                                problem.Node.category === 'problem-list-item'
                            );
                        });

                        if (arr.length > 0) {
                            this.patientProblems = arr.map(
                                this.selectFewerFields
                            );
                        }
                    }
                    this.loadingResult = false;
                },
                error: () => {
                    this.showToastError(
                        'bottom-right',
                        'danger',
                        'Error',
                        'There was an error fetching patient problems.'
                    );
                    this.loadingResult = false;
                },
            });
    }

    /** toggle payment modal */
    toggleModal(context) {
        if (this.activeServiceRequest?.encounter_id === undefined) {
            return this.showToastError(
                'bottom-right',
                'danger',
                'Patient is not in an active service point',
                'Serve the patient in order to add their problem'
            );
        }
        this.toggleId = context.id;
        this.itemHeading = `Add ${context?.name}`;
        this.itemHeadingTwo = `Save ${context?.name}`;
        this.toggle[context.id] = !this.toggle[context.id];
    }
    /** toggles problem modal */
    togglePreviewProblemModal(event?) {
        if (event) {
            this.selectedProblem = event;
        } else {
            this.selectedProblem = {};
        }
        this.showPreviewProblemModal = !this.showPreviewProblemModal;
    }

    /**
     *  @description Creates a patiennt problem observation
     *  @param model
     */
    addPatientProblemItem(model) {
        // gets the model from form
        /** SET ICD-10-WHO system to IDC10  */
        const system =
            model['condition'].system === 'ICD-10-WHO'
                ? 'ICD10'
                : model['condition'].system.replace(/-/g, '_');

        const conditionPayload = {
            code: model['condition'].code,
            system,
            status: model.status,
            category:
                'PROBLEM_LIST_ITEM' /** category PROBLEM_LIST_ITEM distinguishes a problem from final diagnosis ENCOUNTER_DIAGNOSIS */,
            encounterID: `${this.activeServiceRequest.encounter_id}`,
            onsetDate: moment(model.onset_date).format('YYYY-MM-DD'),
            note: model.notes,
            name: model['condition'].name,
            severity: model.severity,
        };

        this.problemName = model['condition'].name;
        this.dataLayer.create('condition', conditionPayload).subscribe({
            next: () => {
                this.showProblemFormDrawer = false;
                this.showToast(
                    'bottom-right',
                    'success',
                    'Successful',
                    `${this.problemName} added`
                );
                this.fetchPatientProblem();
                this.problemName = '';
                this.loadingResult = false;
            },
            error: () => {
                this.showToast(
                    'bottom-right',
                    'danger',
                    'Error',
                    'There was an error adding the problem.'
                );
                this.loadingResult = false;
            },
        });
    }

    /** selects data needed from the response */
    selectFewerFields = select => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { code, name, system, status, note, recordedDate, onsetDate } =
            select.Node;
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
     * Hook that is called when the component is initialized
     */
    ngOnInit() {
        if (
            this.patient?.clinical_id &&
            this.activeServiceRequest?.encounter_id
        ) {
            this.fetchPatientProblem();
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

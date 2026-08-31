import {
    afterNextRender,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { PageComponent } from '../../../../shared/page/page.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { AnalyticsService } from '../../../../@core/utils';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import moment from 'moment';
import { fadeAnimation } from '../../../../shared/animations/if-animations';
import { CompositionNoteInterface } from '../../models/ClinicalNotes';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

@Component({
    selector: 'patient-composition',
    templateUrl: './patient-composition.component.html',
    styleUrls: ['./patient-composition.component.scss'],
    animations: [fadeAnimation],
    standalone: false,
})
export class PatientCompositionComponent
    extends PageComponent
    implements OnInit
{
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
        private formBuilder: FormBuilder,
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

    public Editor: any;

    treatmentPlanForm: FormGroup;

    treamentPlan: any;

    sectionNote: any;

    /** holds template note e.g social history */
    @Input() templateName: any;

    saveTemplateNameBtn = '';

    /** holds patient info */
    @Input() patient: any;

    /** stores the active service request */
    @Input() activeServiceRequest: any;

    /** stores the patient's visit status */
    @Input() patientVisitStatus: any;

    /** stores patient start visit date*/
    @Input() visitDate: any;

    @Input() isVisitDatePassed: boolean = false;
    /**
     * Filters to hide
     */
    @Input() displayFiltersToIgnore?: Array<string> = [];

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

    visitStatus = ['CANCELLED', 'ENTERED_IN_ERROR'];

    /** model for treatment plan note */
    compositionNote: string = '';

    /** diplays error if */
    isTreatmentPlanNoteNull: boolean = false;

    /** stores patient treatment plan */
    patientTreatmentPlan = [];

    /** holds loading state */
    loadingResult: boolean = false;

    /** holds loading state */
    savingTreatmentPlan: boolean = false;

    /** stores composition count */
    patientCompositionCount: any;

    /** stores the whole composition note, includes other notes types */
    wholeCompositionNote: any;

    /** stores composition id */
    compositionId: string;

    /** toggles composition form */
    compositionFormIsHidden = {
        name: '',
        hidden: false,
    };

    /** boolean to shpw treatment plan modal */
    showPreviewTreatmentPlanModal: boolean = false;

    /** stores selected treatment plan */
    selectedCompositionNote: CompositionNoteInterface;

    /** skika dialogue header */
    skikaDialogueHeader: any;

    /**
     * Indicates if the send to next service point function can be shown
     */
    @Input() showNextSpButton?: boolean = true;

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

    /** emit serve patient modal event */
    emitToggleServicePointModal() {
        this.toggleServicePointModalEvent.emit('toggle service point modal');
    }

    /** toggles treatment plan modal */
    togglePreviewCompositionModal(event?) {
        if (event) {
            this.skikaDialogueHeader = `Preview ${this.templateName?.name}`;
            this.selectedCompositionNote = event;
        } else {
            this.selectedCompositionNote = {};
        }
        this.showPreviewTreatmentPlanModal =
            !this.showPreviewTreatmentPlanModal;
    }
    /**
     * Toogle function to display or hide cards
     */
    toggleIsHidden(section) {
        if (
            section === 'compositionForm' &&
            this.compositionFormIsHidden.hidden
        ) {
            this.compositionFormIsHidden = {
                name: this.templateName.name,
                hidden: false,
            };
        } else {
            this.compositionFormIsHidden = {
                name: this.templateName.name,
                hidden: true,
            };
        }
    }

    /** closes add treatment plan form */
    cancelAddCompositionNote() {
        this.compositionFormIsHidden = {
            name: '',
            hidden: false,
        };
    }

    /** save treatment plan */
    addPatientCompositionItem(model) {
        const compositionNote = this.templateName.name;
        const compositionType = 'PROGRESS_NOTE';
        let compositionCategory = '';
        switch (compositionNote) {
            case 'History of present illness':
                compositionCategory = 'HISTORY_OF_PRESENTING_ILLNESS';
                break;
            case 'Chief complaint':
                compositionCategory = 'CHIEF_COMPLAINT';
                break;
            case 'Family history':
                compositionCategory = 'FAMILY_HISTORY';
                break;
            case 'Social history':
                compositionCategory = 'SOCIAL_HISTORY';
                break;
            case 'Past medical surgery history':
                compositionCategory = 'PAST_MEDICAL_SURGERY_HISTORY';
                break;
            case 'Examination':
                compositionCategory = 'EXAMINATION';
                break;
            case 'Treatment plan':
                compositionCategory = 'PLAN_OF_CARE';
                break;
            default:
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                compositionCategory = '';
                return;
        }
        if (this.wholeCompositionNote === undefined) return;

        if (this.wholeCompositionNote.length === 0) {
            // gets the model form
            const compositionPayload = {
                note: model.note,
                status: 'FINAL',
                type: `${compositionType}`,
                category: `${compositionCategory}`,
                encounterID: this.activeServiceRequest.encounter_id,
            };
            // create composition
            this.addPatientComposition(compositionPayload);
        } else {
            // composition already contains data, so append composition to composition section
            const compositionObj = {
                note: model.note,
                status: 'FINAL',
                type: `${compositionType}`,
                category: `${compositionCategory}`,
            };
            this.appendPatientComposition(compositionObj);
        }
    }

    /** add treatment plant to composistion resource */
    addPatientComposition(compositionPayload) {
        this.loadingResult = true;
        this.savingTreatmentPlan = true;
        this.dataLayer
            .create(
                'compositions',
                compositionPayload,
                null,
                null,
                null,
                null,
                true
            )
            .subscribe({
                next: () => {
                    this.loadingResult = false;
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Successful',
                        `Treatment plan added`
                    );
                    this.compositionNote = '';
                    this.fetchPatientCompositionNote();
                    this.loadingResult = false;
                    this.savingTreatmentPlan = false;
                },
                error: () => {
                    this.showToast(
                        'bottom-right',
                        'danger',
                        'Error',
                        'There was an error adding the problem.'
                    );
                    this.loadingResult = false;
                    this.savingTreatmentPlan = false;
                },
            });
    }

    /** append composition note to composition section */
    appendPatientComposition(compositionObj) {
        this.loadingResult = true;
        this.savingTreatmentPlan = true;
        this.dataLayer
            .update(
                'compositions',
                this.compositionId,
                compositionObj,
                null,
                true
            )
            .subscribe({
                next: () => {
                    this.loadingResult = false;
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Successful',
                        `Treatment plan added`
                    );
                    this.compositionNote = '';
                    this.fetchPatientCompositionNote();
                    this.savingTreatmentPlan = false;
                    this.loadingResult = false;
                },
                error: err => {
                    this.loadingResult = false;
                    this.handleError(err?.error);
                },
            });
    }

    /** response from adding patient treatment plan */
    responseFunction = response => {
        const nestedMutationResponse = 'createComposition';
        if (response.data[`${nestedMutationResponse}`]) {
            this.loadingResult = false;
            this.showToast(
                'bottom-right',
                'success',
                'Successful',
                `Treatment plan added`
            );
            this.compositionNote = '';
        }
        this.fetchPatientCompositionNote();
        this.savingTreatmentPlan = false;
        this.loadingResult = false;
    };

    /**
     * gets patient's treatment plan note from fhir composition
     */
    fetchPatientCompositionNote() {
        this.dataLayer
            .list('compositions', {
                patient_id: this.patient?.clinical_id,
                limit: 10,
            })
            .subscribe({
                next: (res: any) => {
                    if (res.totalCount > 0) {
                        this.patientCompositionCount = res.totalCount;
                        res.edges.filter(composition => {
                            /** set composition id  */
                            this.compositionId = composition.node.id;
                            if (composition?.node?.section !== null) {
                                // will hold the composition section notes
                                this.patientTreatmentPlan = [];
                                composition.node.section.filter(section => {
                                    if (
                                        section.title ===
                                        this.templateName.compositionNoteTitle
                                    ) {
                                        // hide composition form
                                        this.compositionFormIsHidden = {
                                            name: this.templateName.name,
                                            hidden: true,
                                        };
                                        const compositionMeta = {
                                            date: composition.node.date,
                                            category: composition.node.category,
                                            type: composition.node.type,
                                        };
                                        const newObj = Object.assign(
                                            {},
                                            section,
                                            compositionMeta
                                        );
                                        /** spread the obj that matches the composition section title to the array */
                                        this.patientTreatmentPlan = [
                                            ...this.patientTreatmentPlan,
                                            newObj,
                                        ];

                                        /** save final array of composition notes and select fewer fields to return to the UI */
                                        this.patientTreatmentPlan.map(
                                            this.selectFewerFields
                                        );
                                    }
                                });
                            }
                        });
                    }
                },
                error: err => {
                    this.handleError(err);
                },
            });
    }

    handleError = error => {
        this.showToastError('bottom-right', 'danger', 'Error', error?.message);
        this.loadingResult = false;
    };

    /** selects fewer fields */
    selectFewerFields(select) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { title, text, date } = select;
        return {
            title,
            text,
            date,
        };
    }

    determineTemplateBtn() {
        this.saveTemplateNameBtn =
            this.templateName.name === 'Patient Vitals'
                ? 'clinical.buttons.vitals'
                : this.templateName.name === 'Diagnosis'
                ? 'clinical.buttons.diagnosis'
                : this.templateName.name === 'Presenting complaints'
                ? 'clinical.buttons.presenting_complaints'
                : this.templateName.name === 'Allergy'
                ? 'clinical.buttons.allergy'
                : this.templateName.name === 'Chief complaint'
                ? 'clinical.buttons.chief_complaint'
                : this.templateName.name === 'History of present illness'
                ? 'clinical.buttons.history_of_present_illness'
                : this.templateName.name === 'Family history'
                ? 'clinical.buttons.family_history'
                : this.templateName.name === 'Family & social history'
                ? 'clinical.buttons.family_and_social_history'
                : this.templateName.name === 'Past medical surgery history'
                ? 'clinical.buttons.past_medical_surgery_history'
                : this.templateName.name === 'Social history'
                ? 'clinical.buttons.social_history'
                : this.templateName.name === 'Examination'
                ? 'clinical.buttons.examination'
                : this.templateName.name === 'Treatment plan'
                ? 'clinical.buttons.treatment_plan'
                : this.templateName.name;
    }

    /**
     * Hook that is called when the component is initialized
     */
    ngOnInit() {
        this.determineTemplateBtn();
        this.isVisitDatePassed =
            moment(Date.now()).format('YYYY-MM-DD') > this.visitDate;
        if (this.patient?.clinical_id) {
            this.fetchPatientCompositionNote();
        }

        // Table header
        this.tableHeader = [{ text: 'Note' }, { text: 'Action' }];
        // Table rows
        this.rows = [
            {
                key: 'text',
                type: 'diagnosis_note',
                nested: [
                    {
                        label: '',
                        class: 'text-muted',
                        value: 'date',
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
                btnText: 'View',
                status: 'success',
                action: 'custom',
                modalConf: {
                    customFxn: true,
                },
            },
        ];
    }
}

import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GetConditionListFromOcl } from '../../services/clinical-ocl.service';
import { VisitService } from '../visits/visit.service';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../shared/sil-http-services/error-handler';
import { PageComponent } from '../../../shared/page/page.component';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { AnalyticsService } from '../../../@core/utils';
import moment from 'moment';
import { fadeAnimation } from '../../../shared/animations/if-animations';
import { Authorization } from '../../../@core/auth/services/authorization.service';

interface AddPatientToQueue {
    status: string;
    activeServiceRequestID: string;
    isClinical: boolean;
}

@Component({
    selector: 'ngx-clinical-records',
    templateUrl: './clinical-records.component.html',
    styleUrls: ['./clinical-records.component.scss'],
    providers: [GetConditionListFromOcl],
    animations: [fadeAnimation],
    standalone: false,
})
export class ClinicalRecordsComponent extends PageComponent implements OnInit {
    user: any;
    /**
     *
     * @param getConditionList
     * @param visitService
     * @param errorHandler
     */
    constructor(
        public getConditionList: GetConditionListFromOcl,
        public visitService: VisitService,
        public dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public authConfig: Authorization,
        public analytics: AnalyticsService
    ) {
        super(toastrService, uiglobals, $state, analytics);
    }

    loadingResult: boolean = false;

    /** Used to display the patient timeline */
    showPatientTimeline: boolean = false;

    /**
     * Time used to show a toast
     */
    toastTime = 3000;

    /**
     * Used to toggle service point modal
     */
    showServicePointModal: boolean = false;
    /**
     * Display all visit clinical components
     */
    displayAllClinicalComponents: boolean = true;

    /** patients vitals */
    patientVitals: any[] = [
        {
            id: 'weight',
            name: 'Weight',
            units: 'kg',
            concept: 'WEIGHT',
            vitalReference: '',
        },
        {
            id: 'height',
            name: 'Height',
            units: 'cm',
            concept: 'HEIGHT',
            vitalReference: '',
        },
        {
            id: 'bmi',
            name: 'Body Mass Index',
            units: 'kg/m2',
        },
        {
            id: 'pulse',
            name: 'Pulse',
            units: 'BPM',
            concept: 'PULSE_RATE',
            vitalReference: 'PULSE_RATE',
        },
        {
            id: 's_bp',
            name: 'Systolic Blood Pressure',
            units: 'mmHg',
            concept: 'BLOOD_PRESSURE',
            vitalReference: 'SYSTOLIC_BLOOD_PRESSURE',
        },
        {
            id: 'd_bp',
            name: 'Diastolic Blood Pressure',
            units: 'mmHg',
            concept: 'DIASTOLIC_BLOOD_PRESSURE',
            vitalReference: 'DIASTOLIC_BLOOD_PRESSURE',
        },
        {
            id: 'temperature',
            name: 'Temperature',
            units: '°C',
            concept: 'TEMPERATURE',
            vitalReference: 'TEMPERATURE',
        },
        {
            id: 'oxygenSaturation',
            name: 'Oxygen Saturation',
            units: '%',
            concept: 'OXYGEN_SATURATION',
            vitalReference: 'SPO2',
        },
        {
            id: 'respirationRate',
            name: 'Respiration Rate',
            units: '%',
            concept: 'RESPIRATORY_RATE',
            vitalReference: 'RESPIRATION_RATE',
        },
        {
            id: 'muac',
            name: 'Mid-Upper Arm Circumference',
            units: 'mm',
            concept: 'MUAC',
            vitalReference: 'MUAC',
        },
    ];

    clinicalNotesTemplateSettings = [
        {
            id: 'vitals',
            name: 'Patient Vitals',
            display: 'Patient Vitals',
            isNoteHidden: false,
            selected: true,
        },
        {
            id: 'problem',
            name: 'Presenting complaints',
            display: 'Presenting complaints',
            isNoteHidden: false,
            selected: true,
        },
        {
            id: 'allergy',
            name: 'Allergy',
            display: 'Allergy',
            isNoteHidden: false,
            selected: false,
        },
        {
            id: 'chief_complaint',
            name: 'Chief complaint',
            display: 'Chief complaint',
            compositionNoteTitle: 'Chief complaint',
            isNoteHidden: false,
            selected: false,
        },
        {
            id: 'history_of_present_illness',
            name: 'History of present illness',
            display: 'History of present illness and family / social history',
            compositionNoteTitle: 'History of Present illness',
            isNoteHidden: false,
            selected: true,
        },
        {
            id: 'history_of_present_illness',
            name: 'History of present illness',
            display: 'History of present illness',
            compositionNoteTitle: 'Present illness',
            isNoteHidden: false,
            selected: false,
        },
        {
            id: 'family_history',
            name: 'Family history',
            display: 'Family history',
            compositionNoteTitle: 'History of family member diseases Narrative',
            isNoteHidden: false,
            selected: false,
        },
        {
            id: 'social_history',
            name: 'Social history',
            display: 'Social history',
            compositionNoteTitle: 'Social history Narrative',
            isNoteHidden: false,
            selected: false,
        },
        {
            id: 'past_medical_surgery_history',
            name: 'Past medical surgery history',
            display: 'Past medical and surgical history',
            compositionNoteTitle: 'Past medical surgery history Narrative',
            isNoteHidden: false,
            selected: false,
        },
        {
            id: 'examination',
            name: 'Examination',
            display: 'Examination',
            compositionNoteTitle: 'Physical findings',
            isNoteHidden: false,
            selected: this.displayAllClinicalComponents,
        },
        {
            id: 'diagnosis',
            name: 'Diagnosis',
            display: 'Diagnosis',
            isNoteHidden: false,
            selected: this.displayAllClinicalComponents,
        },
        {
            id: 'treatment_plan',
            name: 'Treatment plan',
            display: 'Treatment plan',
            compositionNoteTitle: 'Plan of care note',
            isNoteHidden: true,
            selected: false,
        },
    ];

    /** clinical notes template settings */
    finalClinicalNotesTemplateSettings: any[] = [];

    /**
     * Toogle function to display or hide clinical components notes
     */
    toggleIsHidden(section) {
        const sections = [
            'vitals',
            'problem',
            'history_of_present_illness',
            'family_history',
            'social_history',
            'allergy',
            'examination',
            'diagnosis',
            'treatment_plan',
        ];

        if (sections.includes(section)) {
            this.clinicalNotesTemplateSettings.filter(template => {
                if (template.id === section) {
                    template.isNoteHidden = !template.isNoteHidden;
                }
            });
            return;
        }
    }

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
     * Used to control loading for search
     */
    loadingDiagnosis: boolean = false;

    /**
     * Global loading for the component
     * @type {boolean}
     * */
    loading: boolean = false;

    loadingVitals: boolean = false;

    loadingPatientDetails: boolean = false;

    isAddVital: boolean = false;

    /** stores the active service request */
    activeServiceRequest: any;

    /** current service request */
    currentServiceRequest: any;

    /** stores the patient's visit status */
    patientVisitStatus: any;

    /** stores visit statuses */
    visitStatus = ['FINISHED', 'CANCELLED'];

    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    allVitals: any[] = [];

    querySubscription: any;

    /** active modal id */
    toggleId: any;

    /**
     * Contains patient information
     */
    patient: any;

    /**
     * Contains visit information resolved from the state
     */
    @Input() visitObservable: any;

    /** stores visit details */
    visit: any;

    /** stores patient's visit date */
    visitDate: any;

    /**
     * Contains all queues
     */
    queues: any;

    /** checks if clinical ids are save to localstorage */
    isClinicalIdsSaved: any = {};

    /**
     * Contains selected queue used to start a visit
     */
    selectedQueue: any;

    /** stores patient vitals */
    patientVitalsObj: Object = {};

    /** is visit date passed, don't save any notes */
    isVisitDatePassed: Boolean = false;

    /** used to toggle AI summary drawer */
    showAISummaryDrawer: boolean = false;

    /**
     * togglePTDrawer
     */
    togglePTDrawer() {
        this.showPatientTimeline = !this.showPatientTimeline;
    }

    /** */
    /** toggle payment modal */
    toggleModal(context) {
        this.toggleId = context;
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * toggles the AI summary drawer
     *
     */
    toggleAISummaryDrawer() {
        this.showAISummaryDrawer = !this.showAISummaryDrawer;
    }

    /** Observable that waits for patient data to be defined */
    visitPatientObservable() {
        this.loadingPatientDetails = true;
        this.visitService.visitPatientDataEmitter.subscribe(patient => {
            this.patient = patient;
            if (this.patient.clinical_id) {
                this.checkClinicalIdsSaved();
            }
            this.loadingPatientDetails = false;
        });
    }

    /**
     * Transition patient to IN_PROGRESS and get the current active service request encounter_id
     */
    transitionToInProgress(event: AddPatientToQueue) {
        this.visitService.addToQueue(
            event.status,
            event.activeServiceRequestID,
            event.isClinical
        );
        this.getVisitInfo();
    }

    // get visit details, contains patient details
    getVisitInfo() {
        /** Resolved observable from the state */
        this.visitObservable.subscribe(
            (response: any) => {
                const serviceRequestsArr = response.service_requests;
                /** get the most recent service request the patient is in */
                this.activeServiceRequest = serviceRequestsArr[0];
                this.checkIfEncounteIdNull(this.activeServiceRequest);
                /** get patient visit status */
                this.patientVisitStatus = response.status;
                this.visit = response;
                this.visitDate = moment(this.visit?.start).format('YYYY-MM-DD');
                this.isVisitDatePassed =
                    moment(Date.now()).format('YYYY-MM-DD') > this.visitDate;
                this.visitService.setVisitData(response);
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }

    checkIfEncounteIdNull(activeServiceRequest) {
        const status = activeServiceRequest?.status;
        let data: any;
        if (status === 'WAITING') {
            data = { status: 'IN_PROGRESS' };
            this.dataLayer
                .update('service-requests', activeServiceRequest.id, data)
                .subscribe({
                    next: () => {
                        this.getVisitInfo();
                    },
                    error: err => {
                        this.errorHandler.handleError(err, this);
                    },
                });
        }
    }

    /**
     *  get queues
     */
    getQueues() {
        this.visitService.queuesDataEmitter.subscribe((queues: any) => {
            this.queues = queues;
        });
    }

    /** getFilteredResponse of queues from sil-combo-box*/
    getFilteredResponse(event) {
        this.selectedQueue = event;
    }

    /**
     * gets clinical note index from clinicalNotesTemplateSettings array
     * @param noteName
     * @returns
     */
    getClinicalNoteIndex(noteName) {
        return (
            this.clinicalNotesTemplateSettings
                .filter(note => note.selected === true)
                .findIndex(note => note.name === noteName) + 1
        );
    }

    /**
     * @param event
     */
    toggleServicePointModal() {
        this.showServicePointModal = !this.showServicePointModal;
    }

    /** Sends patient to a selected queue */
    sendToQueue() {
        this.loading = true;
        this.dataLayer
            .update('visits', this.visit['id'], {
                current_queue: this.selectedQueue['id'],
            })
            .subscribe({
                next: response => {
                    this.visit = response;
                    this.visitService.visitDataEmitter.subscribe(response);
                    this.toggleServicePointModal();
                    const msg = 'Success';
                    const context = `Sent patient to ${this.selectedQueue?.name}`;
                    this.showToast('bottom-right', 'success', context, msg);
                    this.loading = false;
                    this.analytics.logEvent('service-request_completed');
                    // return the practioner to their previous URL(filtered queue list)
                    this.$state.go(
                        this.visitService?.prevPractitionerFilteredQueueUrl
                            ?.stateName,
                        this.visitService?.prevPractitionerFilteredQueueUrl
                            ?.params
                    );
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                },
            });
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    checkClinicalIdsSaved() {
        if (
            this.isClinicalIdsSaved === null ||
            this.isClinicalIdsSaved?.clinical_facility_id === null ||
            this.isClinicalIdsSaved?.clinical_org_id === null ||
            typeof this.isClinicalIdsSaved !== 'object'
        ) {
            this.refetchClinicalIds();
        }
    }

    /* refetches clinicals incase not fetched due to missing auth headers during authenticatioin */
    refetchClinicalIds() {
        this.dataLayer.list('userProfile').subscribe({
            next: (response: any) => {
                /* setup clinical ids */
                const ids = {
                    clinical_facility_id: response?.clinical_facility_id,
                    clinical_org_id: response?.clinical_org_id,
                };
                this.authConfig.setClinicalIds(ids);
                /* setup perms */
                this.user = this.authConfig.getUser();
                this.user.permissions = response.permissions;
                this.authConfig.setUser(this.user);
                this.isClinicalIdsSaved = JSON.parse(
                    localStorage.getItem(this.authConfig.USER_CLINICAL_IDS)
                );
            },
        });
    }

    ngOnInit() {
        this.isClinicalIdsSaved = JSON.parse(
            localStorage.getItem('auth.config.clinicalIds')
        );
        this.getVisitInfo();

        this.visitPatientObservable();

        this.getQueues();
        this.finalClinicalNotesTemplateSettings =
            this.clinicalNotesTemplateSettings.filter(
                note => note.selected === true
            );
    }
}

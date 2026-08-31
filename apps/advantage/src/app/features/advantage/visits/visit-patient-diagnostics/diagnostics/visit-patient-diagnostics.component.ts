import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PatientModel } from 'app/features/advantage/models';
import { Cookies } from 'app/shared/cookies/cookie.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { VisitService } from '../../visit.service';

/**
 * Define a simple interface for the Diagnosis object
 */
interface Diagnosis {
    id: string;
    condition: string;
    oncologyCondition?: {
        stage?: string;
        ICDO3PrimaryTumorCode?: string;
        ICDO3MorphologyCode?: string;
    };
    notes?: string;
    recordedDate: string;
}

/**
 * Drawer context types
 */
interface DrawerInterface {
    'add-specimen-information-drawer': false;
    'add-diagnosis-drawer': false;
}

@Component({
    selector: 'ngx-visit-patient-diagnostics',
    templateUrl: './visit-patient-diagnostics.component.html',
    styleUrl: './visit-patient-diagnostics.component.scss',
    standalone: false,
})
export class VisitPatientDiagnosticsComponent implements OnInit {
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
     * Used to define datatable header actions
     */
    actions: Array<any>;
    /**
     * Component loader for the patient observable
     */
    isPatientObservableLoaded: boolean = false;

    /**
     * contains the visit information resolved from the state

     */
    @Input() visitObservable: any;

    loading: boolean = true;

    /**
     * constains the encounter id for the visit
     */
    encounterId: string;

    /**
     * contains the visit data
     */
    visitData: any;

    /**
     * contains patient information
     */
    patient: PatientModel;

    /**
     * toggles the drawer
     */
    toggle: Object = {};

    /**
     * form data
     */
    diagnosisForm: Record<string, any> = {};

    /**
     * Stores the specimen information data
     */
    specimenInformationForm: any = {};

    /**
     * Form configuration
     */
    formConfig = {
        checkExpressionOn: 'changeDetectionCheck',
    };

    /**
     * Array to store the list of diagnoses in-memory
     */
    diagnoses: Diagnosis[] = [];

    /**
     * Tracks the state of the diagnostics section
     */
    diagnosticsState: any = {
        hasDiagnoses: false,
    };

    /**
     * Simulating encounter status for UI enable/disable
     */
    closedEncounter: boolean = false;

    /**
     * Contains the template settings for the treatment component
     */
    templateSettings: any[] = [
        {
            id: 'diagnosis',
            name: 'Diagnosis',
            display: 'Diagnosis',
            isHidden: false,
            selected: true,
        },
    ];

    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;

    /**
     * component constructor
     */
    constructor(
        public translate: TranslateService,
        private visitService: VisitService,
        private cdr: ChangeDetectorRef,
        private cookieService: Cookies,
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService
    ) {
        this.translate.setFallbackLang('en');
        this.translate.use(this.selectedLanguage);
    }
    /**
     * sets the filter used to query for data in the datatable
     * @param event contains the params used in the datatable
     */
    setFilter(event) {
        this.queryArg = event;
    }

    /** Observable that waits for patient visit data to be defined */
    visitPatientObservable() {
        this.visitService.visitPatientDataEmitter.subscribe(patient => {
            this.patient = patient;
            this.filterParams = {
                patient_id: this.patient.clinical_id,
            };
            this.isPatientObservableLoaded = true;
            if (patient?.clinical_id) {
                this.fetchExistingDiagnoses(patient?.clinical_id);
            }
            this.fetchExistingDiagnoses(this.patient.clinical_id);
        });
    }

    /**
     * Lifecycle hook that is called after data-bound properties are initialized
     */
    ngOnInit(): void {
        // Table headers
        this.tableHeader = [
            { text: 'Diagnosis Name' },
            { text: 'Stage' },
            { text: 'Additional Note' },
            { text: 'ICD-O-3 Primary Tumor' },
            { text: 'ICD-O-3 Morphology' },
            { text: 'Date Recorded' },
        ];

        // Table rows
        this.rows = [
            {
                type: 'mineVal',
                path: 'Node.condition',
            },
            {
                type: 'mineVal',
                path: 'Node.oncologyCondition.stage',
            },
            {
                type: 'mineVal',
                path: 'Node.note',
            },
            {
                type: 'mineVal',
                path: 'Node.oncologyCondition.ICDO3PrimaryTumorCode',
            },
            {
                type: 'mineVal',
                path: 'Node.oncologyCondition.ICDO3MorphologyCode',
            },
            {
                type: 'dateUTC',
                path: 'Node.recordedDate',
            },
        ];
        this.visitPatientObservable();
        this.visitObservable.subscribe(response => {
            const visit = response;
            this.visitService.setVisitData(visit);
            this.visitData = visit;
            this.encounterId = visit?.service_requests[0].encounter_id;
        });
    }

    /**
     * contains the selected language
     */
    selectedLanguage: string = this.cookieService.getLanguageCookie();

    /**
     * Function used to toggle the drawers
     * @param context has the different drawer contexts
     */
    toggleDrawer(context: keyof DrawerInterface) {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Toggle function to display or hide treatment sections
     * @param sectionId The unique identifier for the section to toggle
     */
    toggleIsHidden(sectionId: string) {
        const section = this.templateSettings.find(s => s.id === sectionId);
        if (section) {
            section.isHidden = !section.isHidden;
            this.cdr.detectChanges();
        }
    }

    /**
     * Handle diagnosis data
     */
    handleDiagnosisData(data: any) {
        this.diagnosisForm = data;
    }

    /**
     * @description used to get the form data
     * @param event form event
     */
    handleSpecimenInformationData(event) {
        this.specimenInformationForm = event;
    }

    /**
     * @description function to handle form submission
     * @param event form event
     * @returns void
     *
     */
    submitDiagnosisInformation(event: any) {
        const payload = {
            encounterId: this.encounterId,
            condition: {
                code: event.diagnosis.id,
                display: event.diagnosis.display_name,
            },
            ICDO3PrimaryTumorCode: event.icd_o_3_code_primary_tumor,
            ICDO3MorphologyCode: event.icd_o_3_code_morphology,
            behavior: event.behaviour,
            grade: event.grade,
            stage: event.stage_of_disease,
            notes: event.additional_notes,
        };
        this.dataLayer.create('diagnosis-information', payload).subscribe({
            next: () => {
                if (this.patient?.clinical_id) {
                    this.fetchExistingDiagnoses(this.patient?.clinical_id);
                }
                this.toggleDrawer('add-diagnosis-drawer');
                this.cdr.detectChanges();
            },
            error: error => {
                this.errorHandler.handleError(error, this);
                this.toggleDrawer('add-diagnosis-drawer');
            },
        });
    }

    /**
     * Fetches existing diagnoses for the given patient ID
     * @param patientId - The ID of the patient to fetch diagnoses for
     */
    fetchExistingDiagnoses(patientId: string) {
        if (!patientId) {
            this.diagnoses = [];
            this.loading = false;
            return;
        }

        this.loading = true;
        this.dataLayer
            .list('condition-list', { patient_id: patientId })
            .subscribe({
                next: (response: any) => {
                    if (response && Array.isArray(response.Edges)) {
                        this.diagnoses = response.Edges.map(edge => edge.Node);
                    } else {
                        this.diagnoses = [];
                    }
                    this.loading = false;

                    this.updateDiagnosticsState();
                    this.cdr.detectChanges();
                },
                error: error => {
                    this.errorHandler.handleError(error, this);
                    this.diagnoses = [];
                    this.loading = false;
                    this.updateDiagnosticsState();
                    this.diagnoses = [];
                    this.updateDiagnosticsState();
                },
            });
    }

    /**
     * Updates the `diagnosticsState.hasDiagnoses` based on the current `diagnoses` array
     */
    updateDiagnosticsState(): void {
        this.diagnosticsState.hasDiagnoses = this.diagnoses?.length > 0;
    }
}

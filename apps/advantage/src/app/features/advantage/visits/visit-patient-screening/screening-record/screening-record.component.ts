import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../../shared/cookies/cookie.service';
import { VisitService } from '../../visit.service';
import { ScreeningService } from '../screening.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';

/**
 * Drawer context types
 */
interface DrawerInterface {
    'add-test-drawer': boolean;
    'add-examination-drawer': boolean;
    'add-referral-drawer': boolean;
    deleteTest: boolean;
    editTest: boolean;
    endScreening: boolean;
}

/**
 * Component that is used to create a dynamic Screening Record
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrl: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-screening-record',
    templateUrl: './screening-record.component.html',
    styleUrl: './screening-record.component.scss',
    standalone: false,
})
/**
 * Class that creates the Screening Record component
 */
export class ScreeningRecordComponent implements OnInit {
    /**
     * The component constructor
     * @param translate Access an Instance of the Translate service
     * @param uiglobals injects the global values from ui router
     * @param cookieService Access an Instance of the Cookie service
     * @param visitService Access an Instance of the Visit Service
     * @param screeningService Access an instance of the Screening Service
     * @param dataLayer Connects to the data layer service
     * @param errorHandler injects instance of errorhandler service
     * @param fb FormBuilder for creating form controls
     */
    constructor(
        public translate: TranslateService,
        public uiglobals: UIRouterGlobals,
        public cookieService: Cookies,
        public visitService: VisitService,
        public dataLayer: SilStoresService,
        public screeningService: ScreeningService,
        private errorHandler: ErrorHandlerService,
        private fb: FormBuilder
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    /**
     * Boolean used to indicate if the visit/encounter is closed
     */
    closedEncounter: boolean = false;

    /**
     * Current screening encounter Id
     */
    encounterID: string = '';

    /**
     * Encounter status
     */
    encounterStatus: string = '';

    /**
     * Constant representing permitted consent status
     */
    CONSENT_PERMITTED: string = 'permit';

    /**
     * Constant representing denied consent status
     */
    CONSENT_DENIED: string = 'deny';

    /**
     * Consent choice saved on the server
     */
    savedConsentChoice: string = '';
    /**
     * Contains patient information
     */
    patient: any;
    /** stores visit details */
    visit: any;

    /**
     * Saves the selected language from the cookie
     */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /**
     * Indicates the active screening being performed
     */
    cancerType: string = '';
    /**
     * active modal id
     */
    toggleId: any;
    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};
    /**
     * Contains the patient's encounter information
     * sourced from the visit on advantage     */
    patientEncounterData: any;

    /**
     * Status of the selected service Point
     */
    servicePointStatus: any;
    /**
     * Contains the patient's screening information
     * sourced from clinical
     */
    screeningData: any;
    /**
     * Contains visit information resolved from the state
     */
    @Input() visitObservable: any;

    /** checks if clinical ids are save to localstorage */
    isClinicalIdsSaved: any = {};

    /**
     * Contains the selected test or examination
     */
    selectedTest: any;

    /**
     * Flag to track if a delete operation is in progress
     */
    deletingTest: boolean = false;

    /**
     * Mock data for result options - will be replaced dynamically
     */
    resultOptions: any[] = [];

    /**
     * Form group for test edit modal
     */
    editTestForm: FormGroup;

    /**
     * Current preview result value
     */
    previewResult: string;

    /**
     * Screening Report State
     * tracks the completeness of various sections of the screening report
     */
    reportState: any = {
        consentPermitted: undefined,
        consentDenied: undefined,
        hasTests: false,
        hasReferredTests: false,
        hasReferrals: false,
        hasFollowUps: false,
        hasExaminations: false,
    };

    /**
     * Toogle function to display or hide screening sections
     * @param sectionId The unique identifier for the section to toggle
     */
    toggleIsHidden(sectionId) {
        this.screeningService.toggleSection(sectionId, this);
    }

    /**
     * Function used to determine the style properties of the badge
     * @param testValue  Value of the test
     * @returns css properties
     */
    getBadgeStyle(testValue: string) {
        return this.screeningService.getBadgeStyle(testValue, this.cancerType);
    }

    /**
     * Defines resport data fetch loading state
     */
    loadingReportDataFetch: boolean;

    /**
     * Screening report data
     */
    reportData: any;
    /**
     * Function used to toggle the drawers
     * @param context has the different drawer contexts
     */
    toggleDrawer(context: keyof DrawerInterface) {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Contains the step number of the end screening
     */
    endscreeningStep: any;

    /**
     * Toggles the modal
     * @param context the identifier of the modal to toggle
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Custom settings to determine what records to display
     */
    finalExamTemplateSettings: any[] = [];

    /**
     * Function used to extract screening type from the current state
     * @param str current state name
     * @returns the screening type
     */
    extractScreeningType = str => {
        const match = str.match(/screening\.(\w+)_cancer/);
        return match ? match[1] : null;
    };

    /** Observable that waits for patient screening data to be defined */
    visitPatientObservable() {
        this.visitService.visitPatientScreeningDataEmitter.subscribe(
            patient => {
                this.patientEncounterData = patient;
                this.patientEncounterData.encounterId = this.encounterID;

                if (patient.servicePoints) {
                    this.servicePointStatus = this.getServicePointDetails(
                        patient.servicePoints
                    );
                }
            }
        );
    }

    /**
     * Function used to get the service point status from encounter Id
     * @param servicePoints encounter Data
     */
    getServicePointDetails(servicePoints) {
        const servicePt = servicePoints.find(
            sp => sp.encounterID === this.encounterID
        );

        return servicePt?.status;
    }

    /**
     * Check status of encounter or visit to predetermine what to show
     * @returns true or false
     */
    checkStatus() {
        const res =
            [
                this.patientEncounterData?.visit_status?.toLowerCase(),
                this.encounterStatus?.toLowerCase(),
            ].includes('finished') ||
            [
                this.patientEncounterData?.visit_status?.toLowerCase(),
                this.encounterStatus?.toLowerCase(),
            ].includes('completed');
        return res;
    }

    /**
     * Function used to filter items by screening type
     * @param items items to filter
     * @returns filtered items
     */
    filterByScreeningType(items: any[]): any[] {
        return this.screeningService.filterScreening(items, this.cancerType);
    }

    /**
     * Function used to get the screening report
     */
    fetchReport() {
        return this.screeningService.fetchReport(this);
    }

    /** Deals with error
     * @param error The error object received from the API call
     */
    errorHandlerFxn = error => {
        this.errorHandler.handleError(error, this, 'clinical');
        this.loadingReportDataFetch = false;
    };
    /**
     * Resolves the fetchReport data fetching observable
     * @param data screening report data object
     */
    responseFunction = data => {
        this.loadingReportDataFetch = false;
        this.reportData = { ...data };

        const filteredConsent = this.getMatchingConsent();

        this.encounterStatus = filteredConsent?.status;

        this.reportState = {
            ...this.screeningService.setReportData(
                this.reportData,
                this.cancerType
            ),
        };

        // Update savedConsentChoice based on filtered consent
        this.savedConsentChoice = filteredConsent?.decision ?? '';

        const stateData = this.screeningService.setScreeningStates(
            this.reportData,
            this.servicePointStatus,
            this.patientEncounterData?.visit_status?.toLowerCase(),
            this.cancerType
        );
        this.screeningData = {
            ...stateData,
            encounterID: this.encounterID,
        };
        this.closedEncounter = this.checkStatus();
    };

    /**
     * Checks if there is a matching consent record for the current screening type
     * @returns boolean indicating whether a matching consent record exists
     */
    hasMatchingConsent(): boolean {
        if (!this.reportData?.consent?.length) return false;
        return this.filterByScreeningType(this.reportData.consent).length > 0;
    }

    /**
     * Gets the matching consent record for the current screening type
     * @returns the matching consent object, or null if none exists
     */
    getMatchingConsent(): any {
        return this.screeningService.getMatchingConsent(
            this.reportData,
            this.cancerType
        );
    }

    /**
     * Function used to set the selected test or examination
     * @param test the test or examination to set
     */
    setSelectedTest(test: any) {
        this.screeningService.setSelectedScreeningTest(test, this);
    }

    /**
     * Function to confirm deletion of a test or examination
     * @param test the test or examination to delete
     */
    confirmDeleteTest(test: any) {
        this.selectedTest = test;
        this.toggleModal('deleteTest');
    }

    /**
     * Function to delete a test or examination
     */
    deleteTest() {
        this.screeningService.deleteTest(this);
    }

    /**
     * Function used to get the result options for a given test
     * @param test the test object containing name and code
     * @returns the result options for the test
     */
    getResultOptionsForTest(test: any): any[] {
        return this.screeningService.getResultOptionsForScreeningTest(
            test?.name,
            test?.code
        );
    }

    /**
     * Component lifecycle used after the component is initialized
     *  sets up the component state, fetches initial data, and subscribes to observables
     */
    ngOnInit() {
        this.editTestForm = this.fb.group({
            selectedResult: null,
        });

        this.encounterID = this.uiglobals.params.encounter_id;
        this.endscreeningStep = this.uiglobals.params.step;

        this.fetchReport();
        this.cancerType = this.extractScreeningType(
            this.uiglobals.current.name
        );

        const templateSettings = [
            {
                id: 'education',
                name: 'Education',
                display: 'Patient Education and Screening Consent',
                isHidden: false,
                selected: true,
            },
            {
                id: 'assessment',
                name: 'Assessment',
                display: 'Assessment',
                isHidden: false,
                selected: true,
            },
            {
                id: 'examinations',
                name: 'Examinations',
                display: 'Examinations',
                isHidden: this.cancerType?.toLowerCase() === 'prostate',
                selected: this.cancerType?.toLowerCase() !== 'prostate',
            },
            {
                id: 'tests',
                name: 'Tests',
                display: 'Tests',
                isHidden: false,
                selected: true,
            },
            {
                id: 'referrals',
                name: 'Referrals',
                display: 'Referrals',
                isHidden: false,
                selected: true,
            },
        ];

        this.finalExamTemplateSettings = templateSettings.filter(
            note => note.selected === true
        );

        this.isClinicalIdsSaved = JSON.parse(
            localStorage.getItem('auth.config.clinicalIds')
        );

        this.visitPatientObservable();

        this.visitObservable.subscribe(
            (response: any) => {
                this.visit = response;
                this.visitService.setVisitData(this.visit);
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }

    /**
     * Handles change events from the result dropdown
     * @param event The selected result event
     */
    onResultChange(event: any) {
        if (event && event.value) {
            this.previewResult = event.value;
        }
    }

    /**
     * Updates the test result with the selected value
     */
    updateTestResult() {
        this.screeningService.updateScreeningTestResult(this);
    }
}

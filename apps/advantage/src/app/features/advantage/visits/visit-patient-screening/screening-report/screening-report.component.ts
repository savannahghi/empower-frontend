import { Component, Input, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import {
    NbButtonModule,
    NbCardModule,
    NbToastrModule,
    NbToastrService,
    NbSpinnerModule,
} from '@nebular/theme';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThemeModule } from '../../../../../@theme/theme.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { StateService, Transition } from '@uirouter/angular';
import { SkikaLayoutModule } from '../../../../../shared/sil-layout/sil-layout.module';
import { EndScreeningComponent } from '../end-screening/end-screening.component';
import { ActionCardComponent } from './action-card/action-card.component';
import { SectionTitleComponent } from './section-title/section-title.component';
import { DisplayCardComponent } from './display-card/display-card.component';
import { ScreeningSummaryComponent } from '../screening-summary/screening-summary.component';
import { ScreeningService } from '../screening.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - imports: provides necessary modules and components for layout, UI elements, skeleton loading, and state management.
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-screening-report',
    imports: [
        CommonModule,
        ThemeModule,
        NbButtonModule,
        NbCardModule,
        ReactiveFormsModule,
        NbSpinnerModule,
        NgSelectModule,
        NbToastrModule,
        NgxSkeletonLoaderModule,
        SkikaLayoutModule,
        EndScreeningComponent,
        ActionCardComponent,
        SectionTitleComponent,
        DisplayCardComponent,
        ScreeningSummaryComponent,
    ],
    templateUrl: './screening-report.component.html',
    styleUrls: ['./screening-report.component.scss'],
    providers: [SilStoresService],
})
/**
 * This is the class definition of the component
 */
export class ScreeningReportComponent implements OnInit {
    /**
     * The component constructor
     * @param toastService Connects to the toast service
     * @param dataLayer Connects to the data layer service
     * @param $state - Connects to the state service
     * @param screeningService Access an instance of the Screening Service
     * @param errorHandler injects instance of errorhandler service
     * @param transition Current transition information
     */
    constructor(
        protected toastService: NbToastrService,
        public dataLayer: SilStoresService,
        public $state: StateService, // @Inject decorator added for proper injection
        public screeningService: ScreeningService,
        private errorHandler: ErrorHandlerService,
        private transition: Transition,
        private fb: FormBuilder
    ) {
        // Store the previous state information when component is created
        this.previousState = this.transition.from();
    }
    /**
     * Boolean used to indicate if the visit/encounter is closed
     */
    @Input() closedEncounter?: boolean = false;
    /**
     * Boolean used to indicate if a back button should be visible
     */
    @Input() showBackButton?: boolean = false;
    /**
     * Sms segments
     */
    @Input() segments?: any;
    /**
     * The Type of Cancer Screening being done
     */
    @Input() cancerType = '';
    /**
     * Encounter id
     */
    @Input() encounterID: string;
    /**
     * Patient ID
     */
    @Input() patientID?: string;
    /**
     * Visit ID
     */
    @Input() visitID?: string;
    /**
     * Patient Name
     */
    @Input() patientName?: string = '';
    /**
     * Consent choice saved on the server
     */
    savedConsentChoice: any;
    /**
     * Boolean used to hide segments data
     */
    hideSegmentsData: boolean = true;
    /**
     * Stores the previous state information for back navigation
     */
    previousState: any;
    /**
     * Flag to track if a delete operation is in progress
     */
    deletingTest: boolean = false;
    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};
    /**
     * Screening Report State
     *  tracks the completeness of various sections of the screening report
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
     * Defines form fetch loading state
     */
    loadingDataFetch: boolean;

    /**
     * Defines resport data fetch loading state
     */
    loadingReportDataFetch: boolean;

    /**
     * Contains the selected test or examination
     */
    selectedTest: any;

    /**
     * Screening report data
     */
    reportData: any;
    /**
     * Text and colors that are rendered based on the screening results
     */
    pageText: any = {
        breast: {
            normal: {
                label: 'Normal',
                badgeColor: '#83AE04',
                badgeBackgroundColor: '#83AE0426',
            },
            abnormal: {
                label: 'Abnormal',
                badgeColor: '#DA0A15',
                badgeBackgroundColor: '#DA0A1526',
            },
        },
        cervical: {
            negative: {
                label: 'Negative',
                badgeColor: '#83AE04',
                badgeBackgroundColor: '#83AE0426',
            },
            positive: {
                label: 'Positive',
                badgeColor: '#DA0A15',
                badgeBackgroundColor: '#DA0A1526',
            },
            suspicious: {
                label: 'Suspicious for cancer',
                badgeColor: '#FFB573',
                badgeBackgroundColor: '#FCF7E8',
            },
        },
        prostate: {
            normal: {
                label: 'Normal',
                badgeColor: '#83AE04',
                badgeBackgroundColor: '#83AE0426',
            },
            abnormal: {
                label: 'Abnormal',
                badgeColor: '#DA0A15',
                badgeBackgroundColor: '#DA0A1526',
            },
        },
    };

    /**
     * Function to check if an object is empty
     * @param obj Object o be validated
     * @returns length of the object
     */
    checkIfEmpty(obj: any) {
        return Object.keys(obj).length;
    }

    /**
     * Function used to format  a string by replacing underscores with spaces
     * Used to improve display of values that come from database fields
     * @param string to be formatted
     * @returns formatted string
     */
    convertString(inputString) {
        const result = inputString?.replace(/_/g, ' ');
        let screeningStatus = '';
        const screeningMap = {
            cervical: {
                values: ['negative', 'hr-hpv negative', 'normal'],
                outcomes: { default: 'negative', alternate: 'positive' },
            },
            breast: {
                values: [
                    'normal',
                    'benign findings - not suspicious for ca',
                    'birads 1',
                    'birads 2',
                    'her2 negative',
                ],
                outcomes: { default: 'normal', alternate: 'abnormal' },
            },
            prostate: {
                values: [
                    'normal_psa_levels',
                    'raised_psa_levels',
                    'normal psa levels',
                    'high psa levels',
                ],
                outcomes: { default: 'normal', alternate: 'abnormal' },
            },
        };

        const screeningData = screeningMap[this.cancerType];

        if (screeningData) {
            screeningStatus = screeningData.values.includes(
                result.toLowerCase()
            )
                ? screeningData.outcomes.default
                : screeningData.outcomes.alternate;
        }
        return screeningStatus;
    }
    /**
     * Time used to show a toast
     */
    toastTime = 5000;
    /**
     * Method used to display a toast
     * @param position position where toast should appear
     * @param status status type of toast
     * @param msg message to display in toast
     * @param context context label for the toast message
     */
    showToast(position, status, msg, context) {
        // Duration in milliseconds for the toast to display
        const duration = this.toastTime;
        this.toastService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
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
     * Function used to get the screening report
     */
    fetchReport() {
        return this.screeningService.fetchReport(this);
    }

    /**
     * Function used to navigate user to patient message segment
     * @param item segment object
     */
    viewSegment(item) {
        this.$state.transitionTo(
            'app.advantage.patients.detail.segments.messages',
            {
                id: this.patientID,
                segment_id: item?.segment?.id,
                member: item?.id,
                segment: item?.segment?.name?.replace(/ /g, '_'),
                name: this.patientName,
            }
        );
    }
    /**
     * Function used to navigate user to patient referrals
     */
    viewReferral() {
        this.$state.transitionTo(
            'app.advantage.patients.detail.referrals',
            {
                id: this.patientID,
            },
            { reload: true, inherit: true, notify: true }
        );
    }

    /**
     * Function used to navigate user to add test
     */
    performTest() {
        this.$state.transitionTo(
            'app.advantage.visits.detail.tests',
            {
                cancer_type: this.cancerType,
                patient_id: this.patientID,
                encounter_id: this.encounterID,
            },
            { reload: true, inherit: true, notify: true }
        );
    }
    /**
     * Function used to navigate user to perform examination
     */
    performExamination() {
        this.$state.transitionTo(
            'app.advantage.visits.detail.examinations',
            {
                cancer_type: this.cancerType,
                patient_id: this.patientID,
                encounter_id: this.encounterID,
            },
            { reload: true, inherit: true, notify: true }
        );
    }

    /**
     * Function used to navigate user to patient referrals
     */
    addReferral() {
        this.$state.transitionTo(
            'app.advantage.visits.detail.referral',
            {
                cancer_type: this.cancerType,
                patient_id: this.patientID,
                encounter_id: this.encounterID,
            },
            { reload: true, inherit: true, notify: true }
        );
    }
    /**
     * Function used to navigate user to patient followups
     */
    viewFollowUps() {
        this.$state.transitionTo(
            'app.advantage.patients.detail.follow-ups',
            {
                id: this.patientID,
            },
            { reload: true }
        );
    }

    /**
     * Handles navigation back to the screenings page based on user journey
     */
    navigateBack() {
        if (this.previousState && this.previousState.name) {
            this.$state.go(this.previousState.name, this.previousState.params);
        } else {
            this.$state.go('app.advantage.visits.detail.screening');
        }
    }

    /**
     * Toggles the modal
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Error handler callback function
     * Displays error messages and disables loading state
     * @param error The error object received from API
     */
    errorHandlerFxn = error => {
        this.errorHandler.handleError(error, this, 'clinical');
        this.loadingDataFetch = false;
    };

    /**
     * Function used to filter items by screening type
     * @param items items to filter
     * @returns filtered items
     */
    filterByScreeningType(items: any[]): any[] {
        return this.screeningService.filterScreening(items, this.cancerType);
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
     * @param testOrExamination the test or examination to set
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
     * Get appropriate result options based on test object
     * @param test the test object containing name and code
     * @returns array of result options
     */
    getResultOptionsForTest(test: any): any[] {
        return this.screeningService.getResultOptionsForScreeningTest(
            test?.name,
            test?.code
        );
    }

    /**
     * Resolves the fetchReport data fetching observable
     * @param data screening report data object
     */
    responseFunction = data => {
        this.loadingDataFetch = false;
        this.reportData = { ...data };

        this.reportState = {
            ...this.screeningService.setReportData(
                this.reportData,
                this.cancerType
            ),
        };
    };

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
     * Component lifecycle used after the component is initialized
     */
    ngOnInit() {
        this.editTestForm = this.fb.group({
            selectedResult: null,
        });

        if (this.encounterID) this.fetchReport();
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

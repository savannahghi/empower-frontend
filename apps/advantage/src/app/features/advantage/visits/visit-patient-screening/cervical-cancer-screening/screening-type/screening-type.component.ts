import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { UIRouterGlobals, StateService } from '@uirouter/angular';
import { PageComponent } from '../../../../../../shared/page/page.component';
import { AnalyticsService } from '../../../../../../@core/utils/analytics.service';
import { VisitService } from '../../../visit.service';
import moment from 'moment';
import { ErrorHandlerService } from '../../../../../../shared/sil-http-services/error-handler';
import _ from 'underscore';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

@Component({
    selector: 'ngx-screening-type',
    templateUrl: './screening-type.component.html',
    styleUrls: ['./screening-type.component.scss'],
    standalone: false,
})
/**
 * This is the class definition of the component
 */
export class ScreeningTypeComponent extends PageComponent implements OnInit {
    /**
     * The component constructor
     * @param uiglobals Contains the uiglobals
     * @param $state injects instance of State Service
     * @param analytics injects instance of AnalyticsService
     * @param toastrService Connects to the toast service
     * @param visitService Access instance of the visit service
     * @param screeningService injects instance of the screening service
     * @param errorHandler injects instance of errorhandler service
     */
    constructor(
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public analytics: AnalyticsService,
        protected toastrService: NbToastrService,
        public visitService: VisitService,
        private errorHandler: ErrorHandlerService,
        public dataLayer: SilStoresService
    ) {
        super(toastrService, uiglobals, $state, analytics);
    }

    /**
     * Emitter that emits event used to trigger function that moves to stepper's next step
     */
    @Output() nextStepRequested: EventEmitter<void> = new EventEmitter();

    /**
     * Emitter that emits event used to trigger function that moves to stepper's previous step
     */
    @Output() previousStepRequested: EventEmitter<void> = new EventEmitter();
    /**
     * Patient ID
     */
    @Input() patientID: string;
    /**
     * OnClick function used to trigger previousStep emitter
     */
    requestNextStep() {
        this.nextStepRequested.emit();
    }
    /**
     * Patient's return date after referral
     */
    returnDate: string;

    /**
     * @param event on date change event
     * Sends the day selected from the calendar to the payload for filtering appointments
     */
    handleDateChange(event) {
        this.returnDate = moment(event).format('YYYY-MM-DD');
    }
    /**
     * Gets the facility's contact information
     * @param contacts the facility's contacts
     * @param type the type of contact
     * @returns the value of the contact found
     */
    findContactByType(contacts, type) {
        const contactObj = _.find(contacts, function (contact) {
            return (
                contact?.contact_type?.toLowerCase().replace(/ /g, '_') === type
            );
        });
        return contactObj?.contact_value;
    }
    /**
     * OnClick function used to trigger nextStep emitter
     */
    requestPreviousStep() {
        this.previousStepRequested.emit();
    }

    /**
     * Used to show positive banner
     */
    isPositive: boolean = false;

    /**
     * Used to show suspicious cancer banner
     */
    isSuspicious: boolean = false;
    /**
     * servicerequest id used to fetch referral form
     */
    servicerequestId: string;
    /**
     * result saved for later
     */
    resultSavedForLater: boolean = false;
    /**
     * Used toggle active status of button
     */
    isFormFilled: boolean = false;

    /**
     * Boolean flag indicating whether a result is currently being saved
     */
    savingResult: boolean = false;

    /**
     * Configuration object for the formly form
     * Controls form behavior including change detection strategy
     */
    formConfig: any;
    /**
     * Function used to update resultSavedForLater value when task is set as complete
     */
    updateTaskStatus() {
        this.resultSavedForLater = false;
    }
    /**
     * Stores the form model data
     */
    model: Object = {};
    /**
     * Has the current date from the calendar filter
     */
    date: Object;
    /**
     * The Type of Cancer Screening being done
     */
    @Input() cancerType?: string;

    /**
     * Encounter ID used as a unique identifier for the patient's consent
     */
    encounterID: string;
    /**
     * Minimum selectable date for return appointment, defaults to current date
     */
    minDate: Object = moment();

    /**
     * Screening Encounter Data
     */
    @Input() encounterData: any;
    /**
     * Screening Tests Task Data
     */
    @Input() screeningTasksData: any;
    /**
     * Id of waiting result task
     */
    taskId: string;

    /**
     * Holds the current form data from user inputs
     */
    formData: any;

    /**
     *  detectModelChange
     * fetches model data from formly
     * @return updated form data
     */
    detectModelChange(model) {
        this.formData = model;
        return this.formData;
    }

    /**
     * Function used to get encounterID from encounter Data
     * @param servicePoints encounter Data
     * @return the encounter ID if found; otherwise, returns undefined
     */
    getEncounterId(servicePoints) {
        const encounter = servicePoints.find(
            sp => sp.queue_name === 'Cervical Cancer Screening'
        );
        return encounter?.encounterID;
    }

    /**
     * Function used to fetch form data on change
     * @param model form data model
     */
    getModelData(event) {
        const changes = this.detectModelChange(event);
        this.isFormFilled = false;
        this.isPositive = false;
        this.isSuspicious = false;
        if (
            (changes.selected_result != null ||
                ['test_referral', 'add_results_later'].includes(
                    changes.test_action
                )) &&
            changes.selected_test != null &&
            changes.screening_type != null
        ) {
            this.isFormFilled = true;
        }

        if (
            changes.selected_result != null &&
            changes.selected_result.toLowerCase().includes('positive')
        ) {
            this.isPositive = true;
        }

        if (
            changes.selected_result != null &&
            (changes.selected_result === 'Suspicious for cancer' ||
                changes.selected_result === 'suspicious_for_cancer')
        ) {
            this.isSuspicious = true;
        }
    }

    /**
     * Error handler callback function
     * Displays error messages and disables loading state
     * @param error The error object received from API
     */
    errorHandlerFxn = error => {
        this.loading = false;
        this.errorHandler.handleError(error, this, 'clinical');
    };

    /**
     * Handles form submission based on selected test action
     * Validates form completion before submission
     * Routes to appropriate mutation based on test type and action
     */
    recordResults() {
        if (!this.isFormFilled) {
            this.showToastError(
                'bottom-right',
                'warning',
                'Screening',
                'Kindly fill the required fields'
            );
            return;
        }

        this.savingResult = true;
        const selectedOptions = { ...this.formData };

        const handleReferral = () => {
            const referralData = {
                encounterID: this.encounterID,
                referralType: 'DIAGNOSTICS',
                usageContext: 'CERVICAL_CANCER_SCREENING',
                notes:
                    selectedOptions.additional_notes ??
                    'Patient Cervical cancer test referral',
                tests: [selectedOptions.selected_test],
                facility: {
                    name: selectedOptions?.facility?.name,
                    county: selectedOptions?.facility?.county,
                    contact: this.findContactByType(
                        selectedOptions?.facility?.contacts,
                        'phone_number'
                    ),
                    email: this.findContactByType(
                        selectedOptions?.facility?.contacts,
                        'email'
                    ),
                },
            };

            this.dataLayer.create('refer-patient', referralData).subscribe({
                next: (res: any) => {
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Successful',
                        `Referral for ${selectedOptions.selected_test} test created successfully`
                    );
                    this.servicerequestId = res.id;
                    this.savingResult = false;
                },
                error: err => {
                    this.savingResult = false;
                    this.errorHandler.handleError(err, this);
                },
            });
        };

        const handleRecordTest = payload => {
            this.dataLayer.create('tests', payload).subscribe({
                next: () => {
                    this.handleApiResponse(
                        'recordResults',
                        selectedOptions.selected_test
                    );
                },
                error: (err: any) => {
                    this.handleApiError(err, 'recordResults');
                },
            });
        };

        const handleRecordObservation = payload => {
            this.dataLayer.create('observations', payload).subscribe({
                next: () => {
                    this.handleApiResponse(
                        'recordResults',
                        selectedOptions.selected_test
                    );
                },
                error: (err: any) => {
                    this.handleApiError(err, 'recordResults');
                },
            });
        };

        if (selectedOptions.test_action === 'test_referral') {
            handleReferral();
            return;
        }

        const obsPayload: any = {
            status: 'FINAL',
            encounterID:
                this.encounterID ??
                this.getEncounterId(this.encounterData.servicePoints),
            value: selectedOptions.selected_result,
            note: selectedOptions.additional_notes,
            usageContext: 'CERVICAL_CANCER_SCREENING',
        };

        switch (selectedOptions.selected_test) {
            case 'Pap smear/cytology':
                handleRecordTest({
                    input: {
                        encounterID: this.encounterID,
                        note: selectedOptions.additional_notes,
                        findings: selectedOptions.selected_result,
                        usageContext: 'CERVICAL_CANCER_SCREENING',
                    },
                    testType: 'PAPSMEAR',
                });
                break;
            case 'VIA':
                handleRecordObservation({
                    ...obsPayload,
                    concept: 'VIA',
                });
                break;
            case 'HPV':
                handleRecordObservation({
                    ...obsPayload,
                    concept: 'HPV',
                });
                break;
            case 'VIA/VILI':
                handleRecordObservation({
                    ...obsPayload,
                    concept: 'VIA',
                });
                break;
            default:
                this.showToastError(
                    'bottom-right',
                    'error',
                    'Screening',
                    'Unknown test selected'
                );
                break;
        }
    }
    /**
     * Function used to handle the next callback from various API calls
     * @param response server response
     * @param type type of operation (e.g., 'referral', 'recordResults')
     * @param test name of the test performed
     */
    handleApiResponse = (type, test) => {
        this.savingResult = false;

        switch (type) {
            case 'recordResults':
                this.showToast(
                    'bottom-right',
                    'success',
                    'Successful',
                    ` ${test} test results added`
                );
                setTimeout(() => {
                    this.requestNextStep();
                }, 1000);
                break;
            default:
                this.showToastError(
                    'bottom-right',
                    'danger',
                    'Failed',
                    'Unknown action'
                );
        }
    };

    /**
     * handles error response from api call
     * @param error the error object from the api call
     * @param type the type of test performed
     */
    handleApiError(error, type) {
        this.savingResult = false;

        let errorMessage = 'Sorry, an error occurred. Please try again.';
        if (error.message) {
            errorMessage = error.message;
        }

        this.showToastError('bottom-right', 'danger', 'Failed', errorMessage);

        if (type === 'referral') {
            this.loading = false;
        }
    }

    /**
     * Hook that is called when the component is initialized
     *
     * - Loads visit data and initializes the screening state.
     * - Handles errors if visit data cannot be retrieved.
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
        /** Fetch Encounter Id */
        if (this.encounterData.servicePoints) {
            this.encounterID = this.getEncounterId(
                this.encounterData.servicePoints
            );
        }
        this.resultSavedForLater = !!this.screeningTasksData;

        if (this.screeningTasksData) {
            this.taskId = this.screeningTasksData[0]['id'];
        }
    }
}

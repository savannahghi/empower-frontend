import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { UIRouterGlobals, StateService } from '@uirouter/angular';
import { PageComponent } from '../../../../../../shared/page/page.component';
import { AnalyticsService } from '../../../../../../@core/utils/analytics.service';
import { VisitService } from '../../../visit.service';
import { ErrorHandlerService } from '../../../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../../../shared/sil-http-services/sil_datalayer.service';
import moment from 'moment';
import _ from 'underscore';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-screening-type-breast',
    templateUrl: './screening-type-breast.component.html',
    styleUrls: ['./screening-type-breast.component.scss'],
    standalone: false,
})
/**
 * Class that renders the Breast Cancer Screening Tests Component
 */
export class ScreeningTypeBreastComponent
    extends PageComponent
    implements OnInit
{
    /**
     * The component constructor
     * @param uiglobals Contains the uiglobals
     * @param $state injects instance of State Service
     * @param analytics injects instance of AnalyticsService
     * @param toastrService Connects to the toast service
     * @param visitService Access instance of the visit service
     * @param dataLayer Access instance of the data layer service
     * @param errorHandler Access instance of the error handling service
     */
    constructor(
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public analytics: AnalyticsService,
        protected toastrService: NbToastrService,
        public visitService: VisitService,
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService
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
     * The Type of Cancer Screening being done
     */
    @Input() cancerType?: string;

    /**
     * OnClick function used to trigger nextStep emitter
     */
    requestPreviousStep() {
        this.previousStepRequested.emit();
    }

    /**
     * Used to show abnormal test results banner
     */
    isAbnormal: boolean = false;

    /**
     * Used toggle active status of button
     */
    isFormFilled: boolean = false;
    /**
     * servicerequest id used to fetch referral form
     */
    servicerequestId: string;
    /**
     * result saved for later
     */
    resultSavedForLater: boolean = false;
    /**
     * Has the current date from the calendar filter
     */
    date: Object;
    /**
     * Stores the minimum date
     */
    minDate: Object = moment();
    /**
     * Used to show loader
     */
    savingResult: boolean = false;

    /**
     * Used to override default form configurations
     */

    /**
     * use to load when upload file
     */
    uploadingFile: boolean = false;

    formConfig: any;
    /**
     * Function used to update resultSavedForLater value when task is set as complete
     */
    updateTaskStatus() {
        this.resultSavedForLater = false;
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
     * Stores the form model data
     */
    model: Object = {};

    /**
     * Encounter ID used as a unique identifier for the patient's consent
     */
    encounterID: string;
    /**
     * Contains id, name and url returned from server after file upload
     */
    mediaData: any[] = [];

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
     *
     * @param model Current state of the form model containing all field values
     * @returns The updated form data object for further processing
     */
    detectModelChange(model) {
        this.formData = model;
        return this.formData;
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
     * Function used to upload file to server
     * @param file file to be uploaded
     */
    uploadFile(file: File) {
        const formData = new FormData();
        formData.append('encounterID', this.encounterID);
        formData.append('file', file);
        this.uploadingFile = true;
        this.dataLayer.create('upload', formData).subscribe({
            next: response => {
                const data = response[0];
                this.mediaData.push({
                    id: data?.id,
                    name: data?.name,
                    mediaLink: data?.mediaLink,
                });
                this.uploadingFile = false;
                this.savingResult = true;
                this.recordResults();
            },
            error: err => {
                this.uploadingFile = false;
                this.errorHandler.handleError(err, this);
            },
        });
        this.formData.attachment = null;
    }

    /**
     * Function used to get encounterID from encounter Data
     * @param servicePoints encounter Data
     * @returns the encounter ID string for the Breast Cancer Screening queue
     */
    getEncounterId(servicePoints) {
        const encounter = servicePoints.find(
            sp => sp.queue_name === 'Breast Cancer Screening'
        );
        return encounter.encounterID;
    }
    /**
     * Function used to get form data
     * @param event form event
     */

    getModelData(event) {
        const changes = this.detectModelChange(event);
        this.isFormFilled = false;
        this.isAbnormal = false;

        // if changes object contains a file attachment
        // then push the selected file to selected file array

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
            changes.selected_result.includes('- Suspicious For CA')
        ) {
            this.isAbnormal = true;
        }
    }
    /**
     * Validates the data before sending it
     * Shows error messages if required fields are missing
     */
    submitData() {
        if (!this.isFormFilled) {
            this.showToastError(
                'bottom-right',
                'warning',
                'Screening',
                'Kindly fill the required fields'
            );
            return;
        }

        if (this.formData.file) {
            this.uploadFile(this.formData.file);
        } else {
            this.savingResult = true;
            this.recordResults();
        }
    }

    /**
     * Handles form submission
     * - test_referral: Creates a referral for the patient to get tests at another facility
     * - add_results_later: Creates a pending task to add test results when they become available
     * - recordResults: Records immediate test results based on the selected test type
     */
    recordResults() {
        const selectedOptions = { ...this.formData };

        /**
         * Handles the referral workflow when test_action is 'test_referral'
         * Creates a diagnostic referral with facility information and test details
         */
        const handleReferral = () => {
            const referralData = {
                encounterID: this.encounterID,
                referralType: 'DIAGNOSTICS',
                usageContext: 'BREAST_CANCER_SCREENING',
                notes:
                    selectedOptions.referral_notes ??
                    'Patient breast screening test referral',
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
                next: res => {
                    this.handleApiResponse(
                        res,
                        'referral',
                        selectedOptions.selected_test
                    );
                },
                error: err => {
                    this.savingResult = false;
                    this.errorHandler.handleError(err, this);
                },
            });
        };

        const handleRecordTest = payload => {
            this.dataLayer.create('tests', payload).subscribe({
                next: (res: any) => {
                    this.handleApiResponse(
                        res,
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
                next: (res: any) => {
                    this.handleApiResponse(
                        res,
                        'recordResults',
                        selectedOptions.selected_test
                    );
                },
                error: (err: any) => {
                    this.handleApiError(err, 'recordResults');
                },
            });
        };

        // Workflow routing based on test_action
        if (selectedOptions.test_action === 'test_referral') {
            handleReferral();
            return;
        }

        // Create payload for immediate test results
        const testPayload: any = {
            input: {
                encounterID:
                    this.encounterID ??
                    this.getEncounterId(this.encounterData.servicePoints),
                note: this.formData.referral_notes,
                findings: this.formData.selected_result,
                date: this.formData.date,
                usageContext: 'BREAST_CANCER_SCREENING',
            },
        };
        if (this.mediaData.length > 0) {
            testPayload.media = this.mediaData;
        }

        // Route to the appropriate mutation based on the selected test
        switch (selectedOptions.selected_test) {
            case 'MRI':
                handleRecordTest({
                    ...testPayload,
                    testType: 'MRI',
                });
                break;
            case 'Ultrasound':
                handleRecordTest({
                    ...testPayload,
                    testType: 'ULTRASOUND',
                });
                break;
            case 'Mammogram':
                handleRecordTest({
                    ...testPayload,
                    testType: 'MAMMOGRAM',
                });
                break;
            case 'CBE':
                handleRecordTest({
                    ...testPayload,
                    testType: 'CBE',
                });
                break;
            case 'Immunohistochemistry':
                // Special case
                const screeningPayload = {
                    status: 'FINAL',
                    encounterID:
                        this.encounterID ??
                        this.getEncounterId(this.encounterData.servicePoints),
                    value: selectedOptions.selected_result,
                    note: selectedOptions.referral_notes,
                    usageContext: 'BREAST_CANCER_SCREENING',
                    concept: 'IMMUNO_HISTO_CHEMISTRY',
                };
                handleRecordObservation(screeningPayload);
                break;
            case 'IHC':
                // for IHC  tests
                const ihcPayload = {
                    input: {
                        status: 'FINAL',
                        encounterID:
                            this.encounterID ??
                            this.getEncounterId(
                                this.encounterData.servicePoints
                            ),
                        note: this.formData.referral_notes,
                        findings: this.formData.selected_result,
                        date: this.formData.date,
                        usageContext: 'BREAST_CANCER_SCREENING',
                    },
                    testType: this.formData.ihc_test,
                };
                handleRecordTest(ihcPayload);
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

    /** Deals with errors */
    errorHandlerFxn = error => {
        this.loading = false;
        this.errorHandler.handleError(error, this, 'clinical');
    };
    /**
     * Function used to handle the next callback from various API calls
     * @param response server response
     * @param type type of operation (e.g., 'referral', 'addResultsLater', 'recordResults')
     * @param test name of the test performed
     */
    handleApiResponse = (response, type, test) => {
        this.savingResult = false;

        switch (type) {
            case 'referral':
                this.showToast(
                    'bottom-right',
                    'success',
                    'Successful',
                    `Referral for ${test} test created successfully`
                );
                this.servicerequestId = response.referPatient?.id;
                break;
            case 'recordResults':
                this.showToast(
                    'bottom-right',
                    'success',
                    'Successful',
                    ` ${test} test results added`
                );
                this.requestNextStep();
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
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
        /** Set the form to detect changes on any changes happening */
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

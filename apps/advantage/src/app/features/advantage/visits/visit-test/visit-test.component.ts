import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule,
    NbToastrModule,
    NbToastrService,
} from '@nebular/theme';
import { UIRouterGlobals, StateService } from '@uirouter/angular';
import { PageComponent } from '../../../../shared/page/page.component';
import { AnalyticsService } from '../../../../@core/utils/analytics.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import moment from 'moment';
import _ from 'underscore';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../../@theme/theme.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkikaFormModule } from '../../../../shared/sil-form/sil-form.module';
import { VisitTestCervicalComponent } from './visit-test-cervical/visit-test-cervical.component';
import { VisitTestProstateComponent } from './visit-test-prostate/visit-test-prostate.component';
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-visit-test',
    imports: [
        CommonModule,
        ThemeModule,
        NbButtonModule,
        NbSpinnerModule,
        NbToastrModule,
        SkikaFormModule,
        NgxSkeletonLoaderModule,
        NbCardModule,
        VisitTestCervicalComponent,
        VisitTestProstateComponent,
    ],
    providers: [SilStoresService],
    templateUrl: './visit-test.component.html',
    styleUrls: ['./visit-test.component.scss'],
})
/**
 * Class that renders the Breast Cancer Screening Tests Component
 */
export class VisitTestComponent extends PageComponent implements OnInit {
    /**
     * The component constructor
     * @param uiglobals Contains the uiglobals
     * @param $state injects instance of State Service
     * @param analytics injects instance of AnalyticsService
     * @param toastrService Connects to the toast service
     * @param dataLayer Access instance of the data layer service
     * @param errorHandler Access instance of the error handling service
     */
    constructor(
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public analytics: AnalyticsService,
        protected toastrService: NbToastrService,
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
     * Emitter that emits event used to trigger function that moves to screening stepper's next step
     */
    @Output() nextScreeningStepRequested = new EventEmitter();

    /**
     * Emitter that emits event used to trigger function that moves to stepper's previous step
     */
    @Output() previousStepRequested: EventEmitter<void> = new EventEmitter();

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
     * The resolved cancer type
     */
    resolvedCancerType: string;
    /**
     * The Patient Id
     */
    @Input() patientId?: string;
    /**
     * Specifies if the component is in a drawer component
     */
    @Input() isChild?: boolean;

    /**
     * The resolved cancer type
     */
    resolvedPatientId: string;
    /**
     * The Encounter Id
     */
    encounterId: string;

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

    receivedEncounterData: any;

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
    model: any = {};

    /**
     * Contains id, name and url returned from server after file upload
     */
    mediaData: any[] = [];
    /**
     * Id of waiting result task
     */
    taskId: string;
    /**
     * Screening action input value
     */
    @Input() action?: string;
    /**
     * Screening action
     */
    screeningAction: string = '';

    /**
     * holds the form data
     */
    formData: any;

    /**
     *  detectModelChange
     * fetches model data from formly
     */
    detectModelChange(model) {
        this.formData = model;
        return this.formData;
    }
    /**
     * emitted when a custom function action button is clicked
     */
    @Output() customFxn = new EventEmitter<string>();
    /**
     * Navigates back to the previous page
     */
    goToBack(reloadState: boolean) {
        if (this.isChild) {
            if (reloadState) {
                this.$state.reload();
                return;
            }
            this.cancelFxn();
            return;
        }
        this.$state.transitionTo(
            `app.advantage.visits.detail.screening.${this.cancerType}_cancer`,
            {
                id: this.uiglobals.params?.id,
                encounter_id: this.encounterId,
                step: 2,
            },
            { reload: reloadState }
        );
    }

    /**
     * Emits the next screening step request
     * */
    requestNextScreeningStep() {
        this.nextScreeningStepRequested.emit();
    }

    /**
     * Function to cancel clear the send sms details
     * and navigate user back to a base state
     */
    cancelFxn() {
        this.customFxn.emit();
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
        formData.append('encounterID', this.encounterId);
        formData.append('file', file);
        this.uploadingFile = true;
        this.dataLayer.create('upload', formData).subscribe({
            next: this.handleResponse,
            error: err => {
                this.uploadingFile = false;
                this.clearMediaAndFormState();
                this.errorHandler.handleError(err, this);
                this.showToastError(
                    'bottom-right',
                    'warning',
                    'Attachment Upload',
                    'Attachment could not upload, please try again'
                );
            },
        });
        this.formData.file = null;
    }

    /** Deals with response from file upload fetch */
    handleResponse = response => {
        const data = response[0];
        this.mediaData.push({
            id: data?.id,
            name: data?.name,
            mediaLink: data?.mediaLink,
        });
        this.uploadingFile = false;
        this.savingResult = true;
        this.recordResults();
    };

    /**
     * Function that navigates user to the screening report page
     */
    redirectToHome() {
        this.$state.transitionTo(
            `app.advantage.visits.detail.screening`,
            {
                id: this.uiglobals.params?.id,
                encounter_id: this.encounterId,
            },
            { reload: true }
        );
    }
    /**
     * Function used to get form data
     * @param event form event
     */

    getModelData(event) {
        const changes = this.detectModelChange(event);
        this.isAbnormal = false;

        /**
         * Clear mediaData when form data changes and no new file is present
         */
        if (!changes.file && this.mediaData.length > 0) {
            this.mediaData = [];
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
     */
    submitData() {
        if (this.formData.file) {
            this.uploadFile(this.formData.file);
        } else {
            this.savingResult = true;
            this.recordResults();
        }
    }

    /**
     * Handles form submission
     */
    recordResults() {
        const selectedOptions = { ...this.formData };

        const handleReferral = () => {
            const selectedOption =
                selectedOptions.selected_test === 'IHC'
                    ? this.formData.ihc_test
                    : selectedOptions.selected_test;
            const referralData = {
                encounterID: this.encounterId,
                referralType: 'DIAGNOSTICS',
                usageContext: 'BREAST_CANCER_SCREENING',
                ...(selectedOptions.selected_test && {
                    tests: [selectedOption],
                }),
                notes:
                    selectedOptions.referral_notes ??
                    'Patient breast screening test referral',
                facility: {
                    fhirOrganisationID: selectedOptions?.facility?.tenant_id,
                    name: selectedOptions?.facility?.organisation_name,
                    county: 'NAKURU',
                    contact: this.findContactByType(
                        selectedOptions?.facility?.contacts,
                        'phone_number'
                    ),
                },
            };

            this.dataLayer.create('refer-patient', referralData).subscribe({
                next: (res: any) => {
                    this.savingResult = false;
                    this.servicerequestId = res?.id;
                    this.handleApiResponse(
                        res,
                        'referral',
                        selectedOptions.selected_test
                    );
                },
                error: err => {
                    this.savingResult = false;
                    this.handleApiError(err, 'referral');
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

        if (selectedOptions.test_action === 'test_referral') {
            handleReferral();
            return;
        }

        const testPayload: any = {
            input: {
                encounterID: this.encounterId,
                note: selectedOptions?.referral_notes,
                findings: selectedOptions.selected_result,
                usageContext: 'BREAST_CANCER_SCREENING',
                date: selectedOptions.date,
            },
        };
        if (this.mediaData.length > 0) {
            testPayload.media = this.mediaData;
        }

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
            case 'Biopsy':
                handleRecordTest({
                    ...testPayload,
                    testType: 'BIOPSY',
                });
                break;
            case 'CBE':
                handleRecordTest({
                    ...testPayload,
                    testType: 'CBE',
                });
                break;
            case 'Immunohistochemistry':
                const ihcPayload = {
                    status: 'FINAL',
                    encounterID: this.encounterId,
                    value: selectedOptions.selected_result,
                    note: selectedOptions.referral_notes,
                    usageContext: 'BREAST_CANCER_SCREENING',
                    concept: 'IMMUNO_HISTO_CHEMISTRY',
                };
                handleRecordObservation(ihcPayload);
                break;
            case 'IHC':
                // for IHC  tests
                const immunoHCPayload = {
                    input: {
                        encounterID: this.encounterId,
                        note: this.formData.referral_notes,
                        findings: this.formData.selected_result,
                        usageContext: 'BREAST_CANCER_SCREENING',
                        date: this.formData.date,
                    },
                    status: 'FINAL',
                    testType: this.formData.ihc_test,
                };
                handleRecordTest(immunoHCPayload);
                break;
            default:
                this.showToastError(
                    'bottom-right',
                    'danger',
                    'Screening',
                    'Unknown test selected'
                );
                break;
        }
    }

    /** Deals with errors */
    errorHandlerFxn = error => {
        this.loading = false;
        this.savingResult = false;

        this.errorHandler.handleError(error, this, 'clinical');
    };

    /**
     * Clears media data and form state
     */
    clearMediaAndFormState() {
        this.mediaData = [];
        this.uploadingFile = false;
        this.formData = {};
    }

    /**
     * Function used to handle the next callback from various API calls
     * @param response server response
     * @param type type of operation (e.g., 'referral', 'addResultsLater', 'recordResults')
     * @param test name of the test performed
     */
    handleApiResponse = (response, type, test) => {
        this.requestNextScreeningStep();
        this.savingResult = false;
        this.clearMediaAndFormState();
        this.cancelFxn();

        switch (type) {
            case 'referral':
                this.showToast(
                    'bottom-right',
                    'success',
                    'Successful',
                    `Referral for ${test} test created`
                );
                this.servicerequestId = response?.id;
                break;
            case 'recordResults':
                this.showToast(
                    'bottom-right',
                    'success',
                    'Successful',
                    ` ${test} test results added`
                );
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
        this.uploadingFile = false;
        this.clearMediaAndFormState();

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
        this.resolvedCancerType =
            this.cancerType || this.uiglobals.params.cancer_type;

        this.resolvedPatientId =
            this.patientId || this.uiglobals.params.patient_id;
        this.encounterId = this.uiglobals.params.encounter_id;

        if (
            !this.resolvedCancerType ||
            !this.resolvedPatientId ||
            !this.encounterId
        ) {
            this.redirectToHome();
        }

        const currentState = this.uiglobals.current.name;
        this.screeningAction = this.action || currentState.split('.').pop();

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }
}

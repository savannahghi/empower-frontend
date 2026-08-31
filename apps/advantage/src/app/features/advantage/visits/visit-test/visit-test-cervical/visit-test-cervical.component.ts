import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule,
    NbToastrModule,
    NbToastrService,
} from '@nebular/theme';
import { UIRouterGlobals, StateService } from '@uirouter/angular';
import { PageComponent } from '../../../../../shared/page/page.component';
import { AnalyticsService } from '../../../../../@core/utils/analytics.service';
import moment from 'moment';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import _ from 'underscore';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../../../@theme/theme.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkikaFormModule } from '../../../../../shared/sil-form/sil-form.module';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

@Component({
    selector: 'ngx-visit-test-cervical',
    imports: [
        CommonModule,
        ThemeModule,
        NbButtonModule,
        NbSpinnerModule,
        NbToastrModule,
        SkikaFormModule,
        NgxSkeletonLoaderModule,
        NbCardModule,
    ],
    templateUrl: './visit-test-cervical.component.html',
    styleUrls: ['./visit-test-cervical.component.scss'],
})
export class VisitTestCervicalComponent
    extends PageComponent
    implements OnInit
{
    /**
     * The component constructor
     * @param uiglobals Contains the uiglobals
     * @param $state injects instance of State Service
     * @param analytics injects instance of AnalyticsService
     * @param toastrService Connects to the toast service
     * @param errorHandler injects instance of errorhandler service
     */
    constructor(
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public analytics: AnalyticsService,
        protected toastrService: NbToastrService,
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
     * Emitter that emits event used to trigger function that moves to stepper's next step
     */
    @Output() nextScreeningStepRequested = new EventEmitter();

    /**
     * Patient ID
     */
    @Input() patientID: string;
    /**
     * Specifies if the component is in a drawer component
     */
    @Input() isChild?: boolean;

    /**
     * Screening action
     */
    @Input() screeningAction: string = '';

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
     * Used to show loader
     */
    savingResult: boolean = false;

    /**
     * Used to override default form configurations
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
    model: any = {};
    /**
     * Has the current date from the calendar filter
     */
    date: Object;
    /**
     * The Type of Cancer Screening being done
     */
    @Input() cancerType?: string;

    /**
     * Stores the minimum date
     */
    minDate: Object = moment();

    /**
     * Encounter Id
     */
    @Input() encounterId: string;
    /**
     * Id of waiting result task
     */
    taskId: string;

    /**
     * holds the form data
     */
    formData: any;
    /**
     * emitted when a custom function action button is clicked
     */
    @Output() customFxn = new EventEmitter<string>();

    /**
     *  detectModelChange
     * fetches model data from formly
     */
    detectModelChange(model) {
        this.formData = model;
        return this.formData;
    }
    /**
     * Function to cancel clear the send sms details
     * and navigate user back to a base state
     */
    cancelFxn() {
        this.customFxn.emit();
    }
    /**
     * Function used to go back to the previous page
     * @param reloadState used to specify if the pages should be reloaded
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
     * Function used to fetch form data on change
     * @param model form data model
     */
    getModelData(event) {
        const changes = this.detectModelChange(event);
        this.isFormFilled = false;
        this.isPositive = false;
        this.isSuspicious = false;
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

    /** Deals with error */
    errorHandlerFxn = error => {
        this.loading = false;
        this.savingResult = false;
        this.errorHandler.handleError(error, this, 'clinical');
    };

    /**
     * Function used to handle form submission
     */
    recordResults() {
        this.savingResult = true;
        const selectedOptions = { ...this.formData };

        const handleReferral = () => {
            const referralData = {
                encounterID: this.encounterId,
                referralType: 'DIAGNOSTICS',
                usageContext: 'CERVICAL_CANCER_SCREENING',
                tests: [selectedOptions.selected_test],
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
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Successful',
                        `Referral for ${selectedOptions.selected_test} test created`
                    );
                },
                error: err => {
                    this.savingResult = false;
                    this.errorHandler.handleError(err, this);
                },
            });
        };

        /**
         * records test
         */
        const handleRecordTest = payload => {
            this.dataLayer.create('tests', payload).subscribe({
                next: () => {
                    this.handleApiResponse();
                },
                error: (err: any) => {
                    this.handleApiError(err);
                },
            });
        };

        /**
         * records an observation
         */
        const handleRecordExamination = payload => {
            this.dataLayer.create('observations', payload).subscribe({
                next: () => {
                    this.handleApiResponse();
                },
                error: (err: any) => {
                    this.handleApiError(err);
                },
            });
        };

        if (selectedOptions.test_action === 'test_referral') {
            handleReferral();
            return;
        }

        const hpvData = {
            concept: 'HPV',
            status: 'FINAL',
            encounterID: this.encounterId,
            value: selectedOptions.selected_result,
            note: selectedOptions.additional_notes,
            usageContext: 'CERVICAL_CANCER_SCREENING',
        };

        const viaPayload = {
            concept: 'VIA',
            status: 'FINAL',
            encounterID: this.encounterId,
            value: selectedOptions.selected_result,
            note: selectedOptions.additional_notes,
            usageContext: 'CERVICAL_CANCER_SCREENING',
        };

        switch (selectedOptions.selected_test) {
            case 'Pap smear/cytology':
                handleRecordTest({
                    input: {
                        encounterID: this.encounterId,
                        note: selectedOptions.additional_notes,
                        findings: selectedOptions.selected_result,
                        usageContext: 'CERVICAL_CANCER_SCREENING',
                    },
                    testType: 'PAPSMEAR',
                });
                break;
            case 'VIA':
                handleRecordExamination(viaPayload);
                break;
            case 'HPV PCR DNA':
                const hpvPcrPayload = {
                    ...hpvData,
                    observationSubtype: 'HPV_PCR_DNA',
                };
                handleRecordExamination(hpvPcrPayload);
                break;
            case 'HPV Oncoprotein':
                const hpvOncoproteinPayload = {
                    ...hpvData,
                    observationSubtype: 'HPV_ONCOPROTEIN',
                };
                handleRecordExamination(hpvOncoproteinPayload);
                break;
            case 'VIA/VILI':
                handleRecordExamination(viaPayload);
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
    handleApiResponse = () => {
        this.nextScreeningStepRequested.emit();
        this.savingResult = false;
        this.cancelFxn();

        this.showToast(
            'bottom-right',
            'success',
            'Successful',
            ` Test recorded`
        );
    };

    /**
     * handles error response from api call
     * @param error the error object from the api call
     * @param type the type of test performed
     */
    handleApiError(error) {
        this.savingResult = false;

        let errorMessage = 'Sorry, an error occurred. Please try again.';
        if (error.message) {
            errorMessage = error.message;
        }

        this.showToastError('bottom-right', 'danger', 'Failed', errorMessage);
    }

    /**
     * Hook that is called when the component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }
}

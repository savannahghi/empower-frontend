import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { NbStepperComponent, NbStepChangeEvent } from '@nebular/theme';
import { NbToastrService } from '@nebular/theme';
import moment from 'moment';
import { Transition } from '@uirouter/angular';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { environment } from '../../../../../environments/environment';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { StepperService } from '../../../../shared/component-services/stepper.service';
import { PatientModel, PersonModel } from '../../models';
import { IDDocumentTypes, PersonIDModel } from '../../models/PersonID.model';
import { PatientService } from '../patient.service';

@Component({
    selector: 'ngx-patient-registration',
    templateUrl: './patient-registration.component.html',
    styleUrls: ['./patient-registration.component.scss'],
    standalone: false,
})
export class PatientRegistrationComponent implements OnInit, OnDestroy {
    /**
     * Constructor for the class component
     * @param dataLayer used to access the data layer service
     * @param errorHandler used to access the error handler service
     * @param toastrService used to access the toast service
     * @param $state - Connects to the state service
     */
    constructor(
        private patientService: PatientService,
        protected toastrService: NbToastrService,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        public transition: Transition,
        public stepperService: StepperService,
        private translate: TranslateService,
        private cookieService: Cookies
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
        this.variant = environment.variant;
    }

    /**
     * contains app variant information
     */
    variant: string;

    /**
     * Sets the selected language
     * */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /**
     * showToast - Used to display a toast using the nebular toast service
     * @param position - defines the toast's position e.g. bottom-right
     * @param status - defines the status being used e.g. success, danger, info
     * @param msg - defines what the message in the toast is
     * @param context - defines what the context of the toast is
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Used to display the loader when data is being fetched
     */
    loading: boolean = false;

    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    /**
     * Contains the patient details
     */
    patientDetails: any;

    /**
     * Contains the related person details
     */
    nextOfKinDetails: any;

    /**
     * Used to determine if the content of a form has been submitted
     */
    submitted: boolean = false;

    /**
     * Used to determine duration of the toast time
     */
    toastTime = 7000;

    /**
     * Saves the search input
     */
    searchInput: string;

    /** used to filter datatable params */
    filterParams: Object;

    /**
     * Used to determine if the  patient search request has been submitted
     */
    patientSearchSubmitted: boolean = false;

    /**
     * Display patientData
     */
    patient: PatientModel;

    /**
     * contains patient string based on variant
     */
    patientString: string;

    /**
     * Saves selected patient data
     */
    selectedPatient: PersonModel;

    /**
     * Saves patient proprties
     */
    patientProperties: any;

    /**
     * Used to determine whether to display patient match
     */
    showPatientMatchModal: boolean = false;

    /** Detect when step changes  */
    changeEvent: NbStepChangeEvent;

    /** Contains the step events  */
    changeStepEvents: any;

    /**
     * saves the id of the registered patient
     */
    registeredPatientId: string;

    /**
     *  OTP component config
     */
    config = {
        allowNumbersOnly: true,
        length: 6,
        isPasswordInput: false,
        disableAutoFocus: false,
        placeholder: '',
        inputStyles: {
            width: '40px',
            height: '40px',
        },
    };

    /**
     *  access to input component
     */
    @ViewChild('ngOtpInput') ngOtpInputRef: any;

    /**
     *  stores the OTP
     */
    otp: string = '';

    onOtpChange(otp) {
        this.otp = otp;
    }

    /**
     *  show success modal
     */
    showSuccessModal: boolean = false;

    /**
     *  show email consent success
     */
    showEmailSuccess: boolean = false;

    /**
     *  show failure modal
     */
    showFailureModal: boolean = false;

    /**
     * saves the data of the existing patient
     */
    existingPatient: any;

    /**
     * Save consent
     */
    smsConsent: boolean = true;

    /**
     * Used to store different consents
     */
    consent: Object = {};

    /**
     * Used to store different loading context
     */
    consentLoading: Object = {};

    /**
     * Used to store the patient's phone number
     */
    patientPhoneNumber: string;

    /**
     * Used to store the patient's email
     */
    patientEmail: string;

    /**
     * Starting time in seconds
     */
    timeLeft: number;

    /**
     * To hold the interval ID for clearing later
     */
    intervalId: any;

    /**
     *  show retry OTP button
     */
    showRetryButton: boolean = false;

    /**
     * saves the name of the previous state
     */
    previousState = 'app.advantage.' + this.transition.params().state;

    /**
     * stepper
     */
    stepper: any;

    /** Stepper layout orientation */
    orientation: 'horizontal' | 'vertical' = 'vertical';

    @ViewChild('stepper', { static: false }) set content(
        content: NbStepperComponent
    ) {
        if (content) {
            // initially setter gets called with undefined
            this.stepper = content;
        }
    }

    /**
     * Contains selector that is used to access the datatable component
     * used in the component
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /** Handle step changes */
    handleStepChange(e: NbStepChangeEvent): void {
        this.changeEvent = e;
        this.stepperService.handleStepChange(e, this.stepper);
    }

    /**
     * Used to define custom form options.
     * Required for the patient form to allow for constant updating of model
     */
    formOptions: any;

    /**
     * Go back to the previous page
     */
    back(): void {
        this.$state.go(this.previousState);
    }

    //  Set next step
    nextStep() {
        const params = this.uiglobals.params;
        params.id = this.registeredPatientId;
        this.stepperService.nextStep(this.stepper, params);
    }

    /**
     * Toggles the checkbox
     */
    toggleCheckbox(context) {
        this.consent[context] = !this.consent[context];
    }

    /**
     * Toggles the modal
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Toggles the checkbox
     */
    toggleConsentLoading(context) {
        this.consentLoading[context] = !this.consentLoading[context];
    }

    /**
     * send OTP to patient
     */
    sendOTP() {
        this.patientService.sendOTP(this);
    }

    /**
     * resend OTP to patient
     */
    resendOTP() {
        this.patientService.resendOTP(this);
    }

    /**
     * check if OTP is valid
     */
    isOtpValid(): boolean {
        return this.otp.length >= 6;
    }

    /**
     * Method to start the countdown
     */
    startCountdown() {
        this.intervalId = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                clearInterval(this.intervalId); // Stop the countdown when it reaches 0
                this.showRetryButton = true;
            }
        }, 1000);
    }

    /**
     * Method to reset the countdown
     */
    resetCountdown() {
        clearInterval(this.intervalId); // Ensure no ongoing intervals are cleared
        this.timeLeft = 60; // Reset the time
        this.startCountdown(); // Restart the countdown if needed
        this.showRetryButton = false;
    }

    /**
     * verify OTP to patient
     */
    verifyOTP() {
        this.patientService.verifyOTP(this);
    }

    /**
     * transtion status of the consent
     */
    transitionConsentStatus() {
        const consentStatus = this.uiglobals.params.consent_status;
        if (consentStatus === 'VERIFIED') {
            this.toggleModal('navigateAfterCreating');
            return;
        }
        // If no consent was verified, allow moving forward
        if (!this.showSuccessModal && this.variant === 'empower') {
            this.nextStep();
            return;
        }
        this.patientService.transitionOTP(this, 'VERIFIED');
    }

    /**
     * save patient education content
     */
    saveEducationConsent() {
        this.toggleConsentLoading('health_education');
        if (this.consent['SMS_HEALTH_EDUCATION']) {
            this.patientService.createEducationConsent('SMS_HEALTH_EDUCATION');
        }
        if (this.consent['EMAIL_HEALTH_EDUCATION']) {
            this.patientService.createEducationConsent(
                'EMAIL_HEALTH_EDUCATION'
            );
        }
        this.toggleConsentLoading('health_education');
        this.toggleModal('navigateAfterCreating');
    }

    /**
     * Go to patients list page
     */
    viewPatientList() {
        this.toggleModal('patientExists');
        this.goToPatientList();
    }

    /**
     * Used to submit the patient information
     * Comes from the form event that contains the patient information
     * @param model - Contains an instance of the PatientModel
     */
    submitPatient(model: PatientModel) {
        const patientData: PatientModel = Object.assign({}, model);
        this.submitted = true;
        this.loading = true;

        // Update date to YYYY-MM-DD format before saving
        if (patientData.person.date_of_birth) {
            patientData.person.date_of_birth = moment(
                patientData.person.date_of_birth
            ).format('YYYY-MM-DD');
        }

        // Update expected date of delivery to YYYY-MM-DD format before saving
        if (patientData.expected_delivery_date) {
            patientData.expected_delivery_date = moment(
                patientData.expected_delivery_date
            ).format('YYYY-MM-DD');
            // Check if the date is not valid
            if (
                !moment(
                    patientData.expected_delivery_date,
                    'YYYY-MM-DD'
                ).isValid()
            ) {
                delete patientData.expected_delivery_date;
            }
        }

        if (patientData?.person?.channel) {
            patientData.channel = patientData?.person?.channel;
            delete patientData?.person?.channel;
        }

        // Update person id details
        patientData.person.person_ids = [];
        if (patientData.person.id_value) {
            const documentType = patientData.person.id_document_type;
            const personId: PersonIDModel = {
                id_value: patientData.person.id_value,
                id_document_type: IDDocumentTypes[documentType],
            };
            patientData.person.person_ids.push(personId);
        }
        patientData.person.person_photos = [];
        this.patientService.createPatient(patientData, this);
    }

    /**
     * Save consent from the check button
     */
    saveSmsConsent(event) {
        this.smsConsent = event;
    }

    createPatientWithHCRMData() {
        this.toggleModal('showPatientMatchModal');
        const payload = this.patientService.preparePatientPayload(
            this.selectedPatient,
            {
                smsConsent: this.smsConsent,
            }
        );
        this.patientService.createPatient(payload, this);
    }

    /**
     * Used to submit the related person information
     * @param model - used to submit related person information
     */
    submitRelatedPerson(model: PersonModel) {
        this.patientService.submitRelatedPerson(model, this);
    }

    /**
     * Go back to the patient list
     */
    goToPatientList() {
        this.$state.go('app.advantage.patients');
    }

    /**
     * navigate to patient consent
     */
    goToPatientConsent() {
        this.nextStep();
    }

    /**
     * navigate to related person step
     */
    goToNextOfKin() {
        this.nextStep();
    }

    skipConsent() {
        /**
         * Only allow skipping on Empower variant*
         */
        if (this.variant === 'empower') {
            this.toggleModal('navigateAfterCreating');
        }
    }

    /**
     * Used to set the form options
     * @param formOptions
     */
    getFormOptions(formOptions) {
        this.formOptions = formOptions;
    }

    // setup onboarding stepper
    setupOnboarding() {
        setTimeout(() => {
            const step = this.uiglobals.params.step;
            if (step) {
                this.stepper._selectedIndex = parseInt(step, 10);
            }
            this.stepperService.setupStepper(this.stepper);
            this.stepperService.checkOrientationChange(this);
        }, 200);
    }

    /**
     * Switch between 'navigateAfterCreating' and 'patientCover'
     */
    openPatientCoverModal() {
        if (this.toggle['navigateAfterCreating']) {
            this.toggleModal('navigateAfterCreating');
            this.toggleModal('patientCover');
        } else if (this.toggle['patientCover']) {
            this.toggleModal('patientCover');
            this.toggleModal('navigateAfterCreating');
        }
    }

    ngOnInit() {
        this.changeStepEvents = [];
        this.setupOnboarding();
        this.patientString = 'patient';
        /** Initialize the patient person data with a contact */
        this.patientDetails = {
            person: {
                person_contacts: [{ contact_type: 'phone_number' }],
            },
        };
        /** Initialize the related person details */
        this.nextOfKinDetails = {
            person_contacts: [{ contact_type: 'phone_number' }],
        };

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        this.registeredPatientId = this.uiglobals.params.id;
        this.existingPatient = {
            id: this.uiglobals.params.id,
        };
        this.patientPhoneNumber = this.uiglobals.params.phone_number;
        this.patientEmail = this.uiglobals.params.email;
        this.timeLeft = 60;
    }

    ngOnDestroy() {
        clearInterval(this.intervalId);
    }
}

import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { PatientService } from '../patient.service';
import { environment } from '../../../../../environments/environment';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, UIRouterGlobals } from '@uirouter/core';

@Component({
    selector: 'ngx-patient-consent',
    templateUrl: './patient-consent.component.html',
    styleUrls: ['./patient-consent.component.scss'],
    standalone: false,
})
export class PatientConsentComponent implements OnInit {
    /**
     * Used to display the loader when data is being fetched
     */
    loading: boolean = false;

    /**
     * Contains the observable resolved from the state service
     */
    @Input() patientObservable: any;

    /**
     *  show success modal
     */
    showSuccessModal: boolean = false;

    /**
     *  show failure modal
     */
    showFailureModal: boolean = false;

    /**
     * Contains patient information
     */
    patient: any;

    /**
     * contains app variant information
     */
    variant: string;

    /**
     * contains patient string based on variant
     */
    patientString: string;

    /**
     * contains patient consents
     */
    consent: any;

    /**
     * Used to store different loading context
     */
    consentLoading: Object = {};

    /**
     * Used to display different toggle modals
     * information
     */
    toggle: Object = {};

    /**
     * Starting time in seconds
     */
    timeLeft: number;

    /**
     *  Current consent being processed
     */
    currentConsent: any;

    /**
     * To hold the interval ID for clearing later
     */
    intervalId: any;

    /**
     *  show retry OTP button
     */
    showRetryButton: boolean = false;

    /**
     * OTP
     */
    otp: string = '';

    /**
     * Toggles the modal
     */
    toggleModal(context, consent = null) {
        this.toggle[context] = !this.toggle[context];
        if (consent) {
            this.currentConsent = consent;
        } else {
            this.currentConsent = null;
        }
    }

    /**
     * Toggles the checkbox
     */
    toggleConsentLoading(context) {
        this.consentLoading[context] = !this.consentLoading[context];
    }

    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     * @param errorHandler - Connects to the error handler service
     * @param dataLayer injects the data layer service
     */
    constructor(
        protected toastrService: NbToastrService,
        public patientService: PatientService,
        private errorHandler: ErrorHandlerService,
        public dataLayer: SilStoresService,
        public $state: StateService,
        public uiglobals: UIRouterGlobals
    ) {
        this.variant = environment.variant;
    }

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
     * showToast - Used to display a toast using the nebular toast service
     * @param position - defines the toast's position e.g. bottom-right
     * @param status - defines the status being used e.g. success, danger, info
     * @param msg - defines what the message in the toast is
     * @param context - defines what the context of the toast is
     */
    showToast(position, status, msg, context) {
        const duration = 7000;
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    getPatientInfo() {
        this.loading = true;
        /** Resolved observable from the state */
        this.patientObservable.subscribe(
            (response: any) => {
                this.patient = response;
                this.fetchConsent();
            },
            err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            }
        );
    }

    /**
     * send OTP to patient
     */
    sendOTP() {
        this.patientService.sendOTP(this, this.currentConsent?.id);
    }

    /**
     * verify OTP to patient
     */
    verifyOTP() {
        this.patientService.verifyOTP(this, this.currentConsent?.id);
    }

    /**
     * resend OTP to patient
     */
    resendOTP() {
        this.patientService.resendOTP(this, this.currentConsent?.id);
    }

    onOtpChange(otp) {
        this.otp = otp;
    }

    /**
     * check if OTP is valid
     */
    isOtpValid(): boolean {
        return this.otp.length >= 6;
    }

    /**
     * Method to change the consent status
     */
    changeConsentStatus() {
        const mappedStatus =
            this.currentConsent?.status === 'VERIFIED'
                ? 'REJECTED'
                : 'VERIFIED';
        this.patientService.transitionOTP(
            this,
            mappedStatus,
            this.currentConsent?.id
        );
    }

    /**
     * Method to format the consent status
     * @param status - the status to be formatted
     * @returns the formatted consent status
     */
    formatConsentStatus(status: string): string {
        if (!status) {
            return '';
        }
        return status
            .split('_')
            .map(
                word =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ');
    }

    /**
     * Function to map text based on status and type
     * @param type type of element
     * @param status consent status
     * @returns text value
     */
    mapStatusStrings(type: string, status: string): string {
        const mappedValues = {
            messageText: {
                verified: `out this ${this.patientString} from `,
                default: `in this ${this.patientString} from `,
            },
            btnText: {
                verified: 'out',
                default: 'in',
            },
        };
        const mappedStatus =
            status.toLowerCase() === 'verified' ? 'verified' : 'default';

        return mappedValues[type][mappedStatus];
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
     * Function used to fetch patient's consent records
     */
    fetchConsent() {
        const params = {
            person: this.patient.person.id,
        };
        this.loading = true;
        this.dataLayer.list('consent', params).subscribe({
            next: (response: any) => {
                this.consent = response.results;
                this.loading = false;
            },
            error: err => {
                const message = 'Fetching consent failed';
                const context = 'Consent';
                this.showToast('bottom-right', 'danger', message, context);
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /** Create consent record */
    createEducationConsent() {
        this.patientService.createConsent(this, this.patient.person.id, true);
    }

    ngOnInit() {
        this.patientString = 'patient';
        this.getPatientInfo();
        this.timeLeft = 60;
    }
}

/** Imports used in the component */
import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { BiometricsService } from 'app/features/services/biometrics.service';
import { OperatingSystemDetectionService } from 'app/features/services/operating-system-detection.service';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { FeatureFlagService } from '../../../../@core/utils/feature.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import {
    BillingClassModel,
    GuarantorTypeModel,
    PatientCoverModel,
    PatientModel,
    SchemeModel,
    VisitTypeCode,
} from '../../models';
import { PatientService } from '../../patients/patient.service';
import { VisitService } from '../visit.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 * - provider: contains the services required by the component
 */
@Component({
    selector: 'visit-start-visit',
    templateUrl: './visit-start-visit.component.html',
    styleUrls: ['./visit-start-visit.component.scss'],
    standalone: false,
})

/**
 * startVisit component class
 * Implements OnInit when intializing the class
 */
export class StartVisitComponent implements OnInit, OnDestroy {
    /**
     * Contains visit information resolved from the state
     */
    @Input() visitPatientObservable: any;
    /**
     * Contains patient information
     */
    patient: PatientModel;

    /** Selected scheme ID comes from the patient cover selected */
    selectedSchemeId: string;

    /** Selected patient benefit */
    selectedPatientBenefit: string | null;

    /**
     * Patient benefits
     */
    benefits: Array<string>;

    /**
     * Used to display the loader when making a request for starting a visit
     */
    loading: boolean = false;

    /**
     * Contains patients payer details
     */
    patientBenefitDetails: any;

    /** selected payer */
    selectedPayerIndex: number | null = null;

    /**
     * Used to display the loader for patient data loading status
     */
    loadingPatientDetails: boolean = false;

    /**
     * Contains selected queue used to start a visit
     */
    selectedQueue: Object;
    /**
     * Contains details of the cover that is being created when
     * the user does not have a cover setup
     */
    coverModel: Object;

    /**
     * Contains selected billing class used to start a visit
     */
    private _selectedBillingClass: BillingClassModel = 'CASH';

    /**
     * Getter and setter for selected billing class
     * This is used to handle changes in billing class selection
     */
    get selectedBillingClass(): BillingClassModel {
        return this._selectedBillingClass;
    }

    set selectedBillingClass(value: BillingClassModel) {
        this._selectedBillingClass = value;
        this.handleBillingClassChange();
        this.updateStartVisitButtonVisibility();
    }

    /**
     * Contains selected visit type
     */
    selectedVisitType?: VisitTypeCode = 'AMB';

    /**
     * Contains selected guarantor type
     */
    selectedGuarantorType: GuarantorTypeModel;

    /**
     * COntains selected patient cover
     */
    selectedPatientCover: PatientCoverModel;

    /**
     * Contains selected guarantor for a credit visit
     */
    selectedGuarantor: null | string;

    /**
     * Used to display date picker if it is a past visit
     */
    isPastVisit: boolean = false;

    /**
     * Controls visibility of the record past visit checkbox based on feature flag
     */
    showRecordPastVisitCheckbox: boolean = false;

    /**
     * Used to display benefits after they have loaded
     */
    benefitsLoaded: boolean = false;

    /**
     * Contains all queues
     */
    queues: any;

    /**
     * max date validator for date picker
     */
    max: any;
    selectedAppointment: any;

    /**
     * saves the start date of a visit
     */
    startDate: any;

    /**
     * Time used to show a toast
     */
    toastTime = 4000;

    formConfig: Object;

    isEmpowerVariant: boolean =
        this.flagService.growthbook.getAttributes().variant === 'empower';

    /** flag used to display features in testing */
    displayFeatureInTesting = environment.displayFeature;

    /**
     * gets the stored selected language
     */
    selectedLanguage: string = this.cookieService.getLanguageCookie();

    /**
     * Used to store modal toggle status
     */
    toggle: {
        patientCoverModal: boolean;
    } = {
        patientCoverModal: false,
    };

    /**
     * Flag to show billing method
     */
    shouldShowBillingMethod = true;

    globalHealthId: any;

    fetchedFingerprints = false;

    hasRequiredVerifiedFingers: any;

    enrolledVerifiedPositions: number[] = [];

    isSupported: any;

    currentOS: any;

    unsupportedOS: string | null = null;

    hasCheckedDevice: boolean = false;

    destroy$ = new Subject<void>();

    isDeviceConnected: boolean = false;

    hasError: boolean = false;

    hasFetchEnrolledError: boolean = false;

    showSpinner = false;

    guarantorName: string | null = null;

    selectedFinger: string | null = null;

    authenticationError: boolean = false;

    authenticationSuccess: boolean = false;

    authenticatedFinger: string | null = null;

    hasAuthenticatedAnyFinger = false;

    deviceWorkstationID: any;

    deviceID: any;

    isRedirectingAfterAuth: boolean = false;

    salesType: any;

    /**
     * Component constructor
     * @param patientService - Connects to the patient service
     */
    constructor(
        public patientService: PatientService,
        public translate: TranslateService,
        public cookieService: Cookies,
        public visitService: VisitService,
        public uiglobals: UIRouterGlobals,
        public errorHandler: ErrorHandlerService,
        public dataLayer: SilStoresService,
        private cdr: ChangeDetectorRef,
        protected toastrService: NbToastrService,
        public flagService: FeatureFlagService,
        public biometricsService: BiometricsService,
        public operatingSystemDetectionService: OperatingSystemDetectionService
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    selectedBillingClassOptions = [
        { value: 'CASH', label: 'CASH', checked: true },
        { value: 'CREDIT', label: 'CREDIT' },
    ];

    selectedVisitTypeOptions = [
        { value: 'AMB', label: 'Outpatient' },
        { value: 'IMP', label: 'Inpatient' },
        { value: 'EMER', label: 'Emergency' },
        { value: 'FLD', label: 'Field' },
        { value: 'HH', label: 'Home Health' },
        { value: 'ACUTE', label: 'Inpatient Acute' },
        { value: 'NONAC', label: 'Inpatient Non-Acute' },
        { value: 'OBSENC', label: 'Observation Encounter' },
        { value: 'PRENC', label: 'Pre-Admission' },
        { value: 'SS', label: 'Short Stay' },
        { value: 'VR', label: 'Virtual' },
    ];

    guarantorTypeOptions = [
        { value: 'SELF', label: 'Self' }, // SELF guarantor type to filter out guarantor search for Self guarantor patients
        { value: 'INSURANCE', label: 'Insurance' },
        { value: 'EMPLOYER', label: 'Employer' },
        { value: 'PATIENT', label: 'Donor' }, // PATIENT guarantor type to Donor allow the user to search existing guarantor
    ];

    fingers = [
        { name: 'Left Index', img: 'left-index.png' },
        { name: 'Left Thumb', img: 'left-thumb.png' },
        { name: 'Right Thumb', img: 'right-thumb.png' },
        { name: 'Right Index', img: 'right-index.png' },
    ];

    FINGERPOSITIONS: Record<string, number> = {
        'Left Little': 10,
        'Left Ring': 9,
        'Left Middle': 8,
        'Left Index': 7,
        'Left Thumb': 6,
        'Right Little': 5,
        'Right Ring': 4,
        'Right Middle': 3,
        'Right Index': 2,
        'Right Thumb': 1,
        Unknown: 0,
    };

    selectFinger(finger: any) {
        // if already authenticated or there is showSpinner, prevent further selection
        if (this.authenticatedFinger || this.showSpinner) return;

        this.selectedFinger = finger;

        this.authenticationError = false;
        this.authenticationSuccess = false;
        this.showSpinner = true;

        const position = this.FINGERPOSITIONS[finger];

        this.authenticateFingerprint(position);
    }

    isFingerSelected(finger: string): boolean {
        return this.selectedFinger === finger;
    }

    /**
     * Checks if clear button should be shown (only for Empower visit types)
     */
    shouldShowClearButton(): boolean {
        const empowerVisitTypes = ['CHEMO', 'RADIO', 'SURG'];
        return (
            this.selectedVisitType &&
            empowerVisitTypes.includes(this.selectedVisitType)
        );
    }

    /**
     * Clears the selected visit type
     */
    clearVisitType() {
        this.selectedVisitType = undefined;
    }

    isFingerEnrolledAndVerified(fingerName: string): boolean {
        const position = this.FINGERPOSITIONS[fingerName];
        return this.enrolledVerifiedPositions.includes(position);
    }

    handleAuthenticationError = (err: any) => {
        this.loading = false;

        this.showSpinner = false;

        this.authenticationError = true;

        this.authenticationSuccess = false;

        this.errorHandler.handleError(err);
    };

    handleFingerprintAuthResponse = (response: any) => {
        this.hasError = false;

        this.showSpinner = false;

        if (response.matched) {
            this.authenticationSuccess = true;
            this.authenticationError = false;
            this.authenticatedFinger = this.selectedFinger;
            this.hasAuthenticatedAnyFinger = true;

            this.isRedirectingAfterAuth = true;

            this.startVisit(this.selectedAppointment);
        } else {
            this.authenticationError = true;
            this.authenticationSuccess = false;
        }
    };

    authenticateFingerprint(position: number) {
        if (!this.globalHealthId) {
            return;
        }

        const payload = {
            Id: this.deviceID,
            Enrollee: this.globalHealthId,
            Position: position,
        };

        this.dataLayer.create('verify-fingerprint', payload).subscribe({
            next: this.handleFingerprintAuthResponse,
            error: this.handleAuthenticationError,
        });
    }

    shouldShowStartVisitButton(): boolean {
        if (this.selectedBillingClass === 'CASH') {
            return true;
        }

        if (
            this.selectedBillingClass === 'CREDIT' &&
            !this.selectedGuarantor &&
            this.flagService.getForcedValue(
                'prov_enableBenefitServiceInStartVisit'
            ) &&
            (this.selectedGuarantorType === 'INSURANCE' ||
                this.selectedGuarantorType === 'EMPLOYER' ||
                this.selectedGuarantorType === 'PATIENT')
        ) {
            return true;
        }

        if (
            this.selectedBillingClass === 'CREDIT' &&
            !this.isSupported &&
            !this.deviceWorkstationID
        ) {
            return true;
        }

        if (
            this.selectedBillingClass === 'CREDIT' &&
            this.patient &&
            !this.globalHealthId
        ) {
            return true;
        }

        if (
            this.selectedBillingClass === 'CREDIT' &&
            this.patient &&
            this.globalHealthId &&
            this.isSupported &&
            !this.deviceWorkstationID
        ) {
            return true;
        }

        if (
            this.selectedBillingClass === 'CREDIT' &&
            this.patient &&
            this.globalHealthId &&
            this.isSupported &&
            this.deviceWorkstationID &&
            this.fetchedFingerprints &&
            !this.hasRequiredVerifiedFingers
        ) {
            return true;
        }

        if (
            this.selectedBillingClass === 'CREDIT' &&
            this.patient &&
            this.globalHealthId &&
            this.isSupported &&
            this.deviceWorkstationID &&
            this.fetchedFingerprints &&
            this.hasRequiredVerifiedFingers &&
            this.hasError
        ) {
            return true;
        }

        if (
            this.selectedBillingClass === 'CREDIT' &&
            this.patient &&
            this.globalHealthId &&
            this.isSupported &&
            this.deviceWorkstationID &&
            this.fetchedFingerprints &&
            this.hasRequiredVerifiedFingers &&
            !this.hasError &&
            this.hasFetchEnrolledError
        ) {
            return true;
        }

        return false;
    }

    /**
     * Cached property for start visit button visibility
     */
    showStartVisitButton: boolean = true;

    /**
     * Update the start visit button visibility
     */
    private updateStartVisitButtonVisibility() {
        this.showStartVisitButton = this.shouldShowStartVisitButton();
    }

    /**
     * Cached filtered guarantor type options
     */
    filteredGuarantorTypeOptions: any[] = [];
    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.initializeFilteredGuarantorOptions();
        this.updateStartVisitButtonVisibility();
        this.initializeRecordPastVisitCheckbox();

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'modelChange',
        };
        this.max = moment();

        this.selectedAppointment = this.uiglobals.params.appointment;

        if (this.isEmpowerVariant) {
            this.selectedVisitTypeOptions = [
                { value: 'CHEMO', label: 'Chemotherapy' },
                { value: 'RADIO', label: 'Radiotherapy' },
                { value: 'SURG', label: 'Surgery' },
            ];
        }

        /** initialises the billing class */
        this.selectedBillingClass = 'CASH';

        /** Initiates the visit patient observable to fetch the patient data once it is emitted */
        this.getPatientDetails();

        this.biometricsService.fetchedFingerprints$.subscribe(
            (flag: boolean) => {
                this.fetchedFingerprints = flag;
            }
        );

        this.biometricsService.hasRequiredVerifiedFingers$.subscribe(
            (flag: boolean) => {
                this.hasRequiredVerifiedFingers = flag;
            }
        );

        this.biometricsService.enrolledVerifiedPositions$
            .pipe(takeUntil(this.destroy$))
            .subscribe((positions: number[]) => {
                this.enrolledVerifiedPositions = positions;
            });

        this.biometricsService.hasCheckedDevice$
            .pipe(takeUntil(this.destroy$))
            .subscribe((checked: boolean) => {
                this.hasCheckedDevice = checked;
            });

        this.biometricsService.isDeviceConnected$.subscribe(
            (status: boolean) => {
                this.isDeviceConnected = status;
            }
        );

        this.biometricsService.hasError$
            .pipe(takeUntil(this.destroy$))
            .subscribe((flag: boolean) => {
                this.hasError = flag;
            });

        this.biometricsService.hasFetchEnrolledError$
            .pipe(takeUntil(this.destroy$))
            .subscribe((flag: boolean) => {
                this.hasFetchEnrolledError = flag;
            });

        this.biometricsService.deviceID$.subscribe((id: any) => {
            this.deviceID = id;
        });

        this.biometricsService.deviceWorkstationID$.subscribe((id: any) => {
            this.deviceWorkstationID = id;
        });
        setTimeout(() => {
            this.getPatientBenefits();
        }, 2000);
    }

    ngOnDestroy() {
        this.biometricsService.stopPolling();
        this.biometricsService.resetFingerprintState();
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Initialize the record past visit checkbox visibility based on feature flag
     */
    private initializeRecordPastVisitCheckbox(): void {
        if (!this.flagService.featuresLoaded) {
            this.flagService.flagsLoadedEmitter.subscribe(() => {
                this.setRecordPastVisitCheckboxVisibility();
            });
        } else {
            this.setRecordPastVisitCheckboxVisibility();
        }
    }

    /**
     * Set the visibility of the record past visit checkbox based on feature flag
     */
    private setRecordPastVisitCheckboxVisibility(): void {
        const allowedVariants = this.flagService.getForcedValue(
            'prov_showRecordPastVisitCheckbox'
        );

        if (!allowedVariants) {
            this.showRecordPastVisitCheckbox = false;
            return;
        }

        const currentVariant = environment.variant;
        const variantList = allowedVariants
            .split(';')
            .map((v: string) => v.trim());
        this.showRecordPastVisitCheckbox = variantList.includes(currentVariant);
    }

    /** Observable that waits for patient data to be defined */
    getPatientDetails() {
        this.loadingPatientDetails = true;
        this.visitPatientObservable.subscribe(
            (response: PatientModel) => {
                this.loadingPatientDetails = false;
                this.patient = response;
                this.globalHealthId = response.global_health_id;

                this.currentOS =
                    this.operatingSystemDetectionService.getCurrentOS();

                this.isSupported =
                    this.operatingSystemDetectionService.isCurrentOsSupported(
                        this.currentOS
                    );

                if (!this.isSupported) {
                    this.unsupportedOS = this.currentOS;
                }

                this.biometricsService.resetFingerprintState();

                if (this.isSupported) {
                    this.biometricsService.checkBiometricsHardwareDevice(
                        this.globalHealthId
                    );
                }
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }

    syncPatientDetailToClinical() {
        /**
         * The patient is resolved into this screen, so it is absent whenever
         * that resolve has not returned. The route always carries the id, and
         * it is what the resolve itself is keyed on.
         */
        const id = this.patient?.id ?? this.uiglobals.params['id'];
        if (!id) {
            return;
        }

        const patientID = { patient_id: id };
        this.dataLayer.create('clinical-sync', patientID).subscribe({
            next: () => {
                this.getPatientDetails();
            },
            error: err => {
                this.errorHandler.handleError(err);
            },
        });
    }

    /**
     * Saves the selected date on the date input field
     */
    getStartDate(event) {
        // Gets the current time and adds it to the seleted date
        const currentTime = moment().utc().format('HH:mm:ss z');
        const date = moment(event).format('YYYY-MM-DD');
        this.startDate = moment(`${date} ${currentTime}`);
    }

    /**
     * toggles checkbox to record a past visit
     */
    togglePastVisit(checked: boolean) {
        this.isPastVisit = checked;
    }

    toggleModal(context: 'patientCoverModal') {
        this.coverModel = {
            guarantor: this.selectedGuarantor,
        };
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Start a visit with the patient details
     */
    startVisit(appointment?) {
        this.loading = true;
        this.patientService.startVisit(
            this,
            this.patient,
            appointment,
            this.selectedQueue,
            this.selectedBillingClass,
            this.startDate,
            this.selectedGuarantor,
            this.selectedGuarantorType,
            this.selectedPatientCover,
            this.selectedVisitType,
            this.salesType,
            this.guarantorName
        );
    }

    isButtonDisabled(): boolean {
        // If selectedQueue, selectedBillingClass fields are not selected, disable the button
        if (!this.selectedQueue || !this.selectedBillingClass) {
            return true;
        }

        // disable button when making request to start visit
        if (this.loading) {
            return true;
        }

        if (this.selectedGuarantorType !== 'SELF' && !this.selectedGuarantor) {
            return true;
        }

        return false;
    }

    /**
     * Handles billing class changes
     */
    private handleBillingClassChange() {
        this.selectedGuarantorType = 'SELF';
    }

    /**
     * Detects changing of visit type
     */
    changeVisitType(visitType: VisitTypeCode) {
        this.selectedVisitType = visitType;
    }

    changeGuarantorType(guarantorType: GuarantorTypeModel) {
        this.selectedGuarantor = null;
        this.selectedGuarantorType = guarantorType;
    }

    /** getFilteredResponse of queues from sil-combo-box*/
    getFilteredResponse(event, item: 'queue' | 'guarantor' | 'patientcover') {
        if (item === 'queue') {
            this.selectedQueue = event;
        } else if (item === 'guarantor') {
            const data = event === undefined ? undefined : event;
            if (!data) return;

            this.selectedGuarantor = data.id;
            this.guarantorName = data.partner_name;
        } else if (item === 'patientcover') {
            this.selectedPatientCover = event;
            if (event?.scheme_id) {
                this.updateSelectedSchemeId(event?.scheme_id);
            }
        }
    }

    // Function to update selectedSchemeId
    updateSelectedSchemeId(newSchemeId: string) {
        this.selectedSchemeId = newSchemeId;
        this.fetchScheme(this.selectedSchemeId); // get updated scheme from selected scheme ID
        // Trigger change detection
        this.cdr.detectChanges();

        this.resetSelectedSchemeItem();
    }

    /** fetch scheme  */
    fetchScheme(id: string) {
        this.dataLayer.get('schemes', id).subscribe({
            next: (response: SchemeModel) => {
                this.receiveScheme(response);
            },
            error: err => {
                this.errorHandler.handleError(err);
            },
        });
    }

    receiveScheme = (data: SchemeModel) => {
        this.benefits = data.benefit_access;
    };

    changePatientBenefit(benefit: string | null) {
        this.selectedPatientBenefit = benefit;
    }

    /** Clear selected scheme ID */
    resetSelectedSchemeItem() {
        this.changePatientBenefit(null);
    }

    /**
     * Initialize filtered guarantor options once
     */
    private initializeFilteredGuarantorOptions() {
        this.filteredGuarantorTypeOptions = [...this.guarantorTypeOptions];
    }

    /** Get patient benefits if the flag is active */
    getPatientBenefits() {
        if (
            this.flagService.getForcedValue(
                'prov_enableBenefitServiceInStartVisit'
            )
        ) {
            this.benefitsLoaded = false;
            const patientGuid = this.uiglobals.params['id'];
            const view = 'get_eligibility_details_by_health_id';

            this.dataLayer.listNested('patients', view, patientGuid).subscribe({
                next: this.handlePatientBenefits,
                error: this.handleErrorFxn,
            });
        }
    }

    /** Display patient benefits */
    handlePatientBenefits = (response: any) => {
        this.benefitsLoaded = true;
        this.patientBenefitDetails = response?.covers;
    };

    handleErrorFxn = (err: any) => {
        this.errorHandler.handleError(err, this);
    };

    onViewBenefits(index: number) {
        this.selectedPayerIndex =
            this.selectedPayerIndex === index ? null : index;
    }
}

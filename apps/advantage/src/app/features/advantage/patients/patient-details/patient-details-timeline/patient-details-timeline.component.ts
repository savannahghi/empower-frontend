/** Imports used in the component */
import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { PatientService } from '../../patient.service';
import { ShepherdService } from 'angular-shepherd';
import { NbCardModule, NbTooltipModule, NbPopoverModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../../../@theme/theme.module';
import { PageComponent } from '../../../../../shared/page/page.component';
import { AnalyticsService } from '../../../../../@core/utils';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../../shared/cookies/cookie.service';
import { NgxTranslateModule } from '../../../../../shared/translate/translate.module';
import { VisitService } from '../../../visits/visit.service';

interface BannerCondition {
    id: string;
    resourceType: string;
    name: string;
    value: string;
    status: string;
    date: string;
    timeRecorded: string;
}

interface BannerAllergy {
    id: string;
    resourceType: string;
    name: string;
    value: string;
    date: string;
    timeRecorded: string;
}

interface BannerMedication {
    id: string;
    resourceType: string;
    name: string;
    value: string;
    date: string;
    timeRecorded: string;
}

interface BannerResponse {
    conditions: BannerCondition[];
    allergies: BannerAllergy[];
    medications: BannerMedication[] | null;
}

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 * - provider: contains the services required by the component
 */
@Component({
    selector: 'patient-details-timeline',
    imports: [
        CommonModule,
        ThemeModule,
        NbCardModule,
        NbTooltipModule,
        NbPopoverModule,
        NgxSkeletonLoaderModule,
        NgxTranslateModule,
    ],
    styleUrls: ['./patient-details-timeline.component.scss'],
    templateUrl: './patient-details-timeline.component.html',
    providers: [PatientService],
})

/**
 * PatientDetails component class
 * Implements OnInit when intializing the class
 */
export class PatientDetailsTimelineComponent
    extends PageComponent
    implements OnInit, OnChanges
{
    /**
     * Defines Patient data
     */
    @Input() patient: any;

    /**
     * Contains the observable resolved from the state service
     */
    @Input() patientObservable: any;

    formConfig: Object;

    /**
     * Used to store patient banner data from the new unified API
     */
    patientBannerData: BannerResponse | null = null;

    /**
     * Used to show that the fetching banner data progress
     */
    loading: boolean = true;

    /** checks if clinical ids are save to localstorage */
    isClinicalIdsSaved: any = {};

    /**
     * stores workstation information
     */
    workstation: any;

    /** store clinical ids */
    clinicalIds: any;

    /**
     * sets the preferred language
     */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /**
     * Component constructor
     * @param shepherdService - Connects to the shepherd service for guided tours
     * @param toastrService - Connects to the toast service
     * @param uiglobals - Connects to the UI router globals
     * @param $state - Connects to the state service
     * @param analytics - Connects to the analytics service
     * @param dataLayer - Connects to the data layer service
     * @param authUrlConfig - Connects to the authorization service
     * @param visitService - Connects to the visit service
     * @param errorHandler - Connects to the error handler service
     * @param translate - Connects to the translation service
     * @param cookieService - Connects to the cookie service
     */
    constructor(
        public shepherdService: ShepherdService,
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public analytics: AnalyticsService,
        public authService: Authorization,
        public dataLayer: SilStoresService,
        public authUrlConfig: Authorization,
        public visitService: VisitService,
        public errorHandler: ErrorHandlerService,
        public translate: TranslateService,
        public cookieService: Cookies
    ) {
        super(toastrService, uiglobals, $state, analytics);
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
        this.workstation = this.authService.getWorkstation();
    }

    /**
     * Get patient banner details using the new single API
     * Fetches conditions, allergies, and medications in one call
     */
    getPatientBannerDetails() {
        const patientGuid = this.patient.clinical_id;
        this.loading = true;

        this.dataLayer
            .listNested('clinical-patient', 'banner', patientGuid, null, true)
            .subscribe({
                next: (response: BannerResponse) => {
                    this.patientBannerData = response;
                    this.loading = false;
                },
                error: (err: any) => {
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                },
            });
    }

    /**
     * Get display text for conditions
     * Shows first condition name with count of additional conditions if multiple exist
     * @returns Display text for conditions section
     */
    getConditionsDisplayText(): string {
        if (
            !this.patientBannerData?.conditions ||
            this.patientBannerData.conditions.length === 0
        ) {
            return 'N/A';
        }

        const conditions = this.patientBannerData.conditions;
        if (conditions.length === 1) {
            return conditions[0].name;
        }

        const additionalCount = conditions.length - 1;
        return `${conditions[0].name} and ${additionalCount} other${
            additionalCount > 1 ? 's' : ''
        }`;
    }

    /**
     * Get display text for allergies
     * Shows first allergy name with count of additional allergies if multiple exist
     * @returns Display text for allergies section
     */
    getAllergiesDisplayText(): string {
        if (
            !this.patientBannerData?.allergies ||
            this.patientBannerData.allergies.length === 0
        ) {
            return 'N/A';
        }

        const allergies = this.patientBannerData.allergies;
        if (allergies.length === 1) {
            return allergies[0].name;
        }

        const additionalCount = allergies.length - 1;
        return `${allergies[0].name} and ${additionalCount} other${
            additionalCount > 1 ? 's' : ''
        }`;
    }

    /**
     * Get display text for medications
     * Shows first medication name with count of additional medications if multiple exist
     * @returns Display text for medications section
     */
    getMedicationsDisplayText(): string {
        if (
            !this.patientBannerData?.medications ||
            this.patientBannerData.medications.length === 0
        ) {
            return 'N/A';
        }

        const medications = this.patientBannerData.medications;
        if (medications.length === 1) {
            return medications[0].name;
        }

        const additionalCount = medications.length - 1;
        return `${medications[0].name} and ${additionalCount} other${
            additionalCount > 1 ? 's' : ''
        }`;
    }

    /**
     * Check if there are multiple conditions
     * Used to determine whether to show popover trigger
     * @returns Boolean indicating if multiple conditions exist
     */
    hasMultipleConditions(): boolean {
        return (
            this.patientBannerData?.conditions &&
            this.patientBannerData.conditions.length > 1
        );
    }

    /**
     * Check if there are multiple allergies
     * Used to determine whether to show popover trigger
     * @returns Boolean indicating if multiple allergies exist
     */
    hasMultipleAllergies(): boolean {
        return (
            this.patientBannerData?.allergies &&
            this.patientBannerData.allergies.length > 1
        );
    }

    /**
     * Check if there are multiple medications
     * Used to determine whether to show popover trigger
     * @returns Boolean indicating if multiple medications exist
     */
    hasMultipleMedications(): boolean {
        return (
            this.patientBannerData?.medications &&
            this.patientBannerData.medications.length > 1
        );
    }

    /* refetches clinicals incase not fetched due to missing auth headers during authenticatioin */
    refetchClinicalIds() {
        this.dataLayer.list('userProfile').subscribe({
            next: (response: any) => {
                const ids = {
                    clinical_facility_id: response?.clinical_facility_id,
                    clinical_org_id: response?.clinical_org_id,
                };
                /** setup clinical ids */
                this.authUrlConfig.setClinicalIds(ids);
                this.isClinicalIdsSaved = JSON.parse(
                    localStorage.getItem(this.authUrlConfig.USER_CLINICAL_IDS)
                );
                this.getPatientBannerDetails();
            },
        });
    }

    /** check if clinicalids are saved, if not refetch the clinicalids before fetching patient's banner data */
    checkClinicalIdsSaved() {
        if (
            this.isClinicalIdsSaved === null ||
            this.isClinicalIdsSaved?.clinical_facility_id === null ||
            this.isClinicalIdsSaved?.clinical_org_id === null ||
            typeof this.isClinicalIdsSaved !== 'object'
        ) {
            this.refetchClinicalIds();
        } else {
            this.getPatientBannerDetails();
        }
    }

    /**
     * Function that only shows exam states if user is in an exam state
     * @returns true or false
     */
    isClinicalServicePoint() {
        const servicePointType = this.workstation.workstation__workstation_type;
        const clinicalServicePoints = [
            'screening',
            'triage',
            'consultation',
            'pharmacy_dispensing',
        ];
        return clinicalServicePoints.includes(servicePointType);
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'modelChange',
        };
        this.isClinicalIdsSaved = JSON.parse(
            localStorage.getItem(this.authUrlConfig.USER_CLINICAL_IDS)
        );

        if (this.patient.clinical_id) {
            this.checkClinicalIdsSaved();
        }

        this.visitService.patientChronicConditionEmitter.subscribe(
            diagnosisType => {
                diagnosisType === 'RECURRENCE' &&
                    this.getPatientBannerDetails();
            }
        );
    }

    /**
     * OnChanges lifecycle hooks that detects when the inputs have changed
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.patient !== undefined) {
            this.patient = changes.patient.currentValue;
            if (this.patient.clinical_id) {
                this.checkClinicalIdsSaved();
            }
        }
    }
}

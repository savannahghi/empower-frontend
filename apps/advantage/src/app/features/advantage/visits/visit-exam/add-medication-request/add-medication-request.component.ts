import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Cookies } from '../../../../../../app/shared/cookies/cookie.service';
import { SilStoresService } from '../../../../../../app/shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../../../app/shared/sil-http-services/error-handler';
import { PrescriptionModel } from '../../../models/Prescription.model';
import { VisitService } from '../../visit.service';
import moment from 'moment';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-add-medication-request',
    templateUrl: './add-medication-request.component.html',
    styleUrl: './add-medication-request.component.scss',
    standalone: false,
})
/**
 * Class that renders the AddMedicationRequestComponent Component
 */
export class AddMedicationRequestComponent implements OnInit {
    /**
     * Constructor used for the add medication request component class
     * @param dataLayer Access instance of SilStoresService
     * @param errorHandler Access instance of ErrorHandlerService
     * @param toastrService Access instance of NbToastrService from Nebular
     * @param $state instance of StateService
     * @param visitService injects instance of the visit service
     * @param uiglobals - Connects to the uiglobals service
     * @param translate instance of TranslationService
     * @param cookieService instance of cookieService
     */
    constructor(
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        protected toastService: NbToastrService,
        public $state: StateService,
        public visitService: VisitService,
        public uiglobals: UIRouterGlobals,
        private translate: TranslateService,
        private cookieService: Cookies,
        public analytics: AnalyticsService
    ) {
        this.translate.setFallbackLang('en');
        this.translate.use(this.selectedLanguage);
    }
    /**
     * Saves the selected language from the cookie
     */
    selectedLanguage = this.cookieService.getLanguageCookie();
    /**
     * Used to override default form configurations
     */
    formConfig: any;
    /**
     * Used to define custom form options.
     */
    formOptions: any;

    /**
     * Visit payload
     */
    @Input() visitPayload: any;

    /**
     * Contains the prescription details
     */
    prescriptionDetails: any;
    /**
     * Used to determine if the content of a form has been submitted
     */
    submitted: boolean = false;
    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * emitted when a custom function action button is clicked
     */
    @Output() customFxn = new EventEmitter<string>();

    /**
     * Used to submit the prescription data
     * @param model object containing the form data used to create the prescription
     */
    submitPrescription(model) {
        this.loading = true;
        this.submitted = true;
        const prescriptionPayload: PrescriptionModel = {
            priority: 'routine',
            medication_name: model?.medication?.name,
            service_request: this.visitPayload?.serviceRequestId,
            patient: this.visitPayload?.patientId,
            dosage: [
                {
                    dose_quantity: model?.dose_quantity,
                    dose_unit: model?.dose_unit,
                    period: model?.period,
                    period_unit: model?.period_unit,
                    frequency: 1,
                    duration: model?.duration,
                    duration_unit: model?.duration_unit,
                    start_date: moment(model?.start_date).format('YYYY-MM-DD'),
                    end_date: moment(model?.end_date).format('YYYY-MM-DD'),
                    condition: model?.condition,
                    patient_instruction: model?.patient_instruction,
                },
            ],
        };
        const finalPayload = {
            ...prescriptionPayload,
            diagnosis: this.visitPayload?.diagnosis,
            ...this.visitPayload?.settingsData,
        };
        const baseModel = Object.assign({}, finalPayload);

        this.dataLayer.create('prescriptions', baseModel).subscribe({
            next: (data: any) => {
                const msg = `${data?.medication_name} medication added`;
                this.showToast('bottom-right', 'success', 'Successfully', msg);
                this.loading = false;
                this.formOptions.resetModel();
                this.analytics.logEvent('prescription_created');
                this.$state.reload();
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }
    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }
    /**
    /** Handles errors when creating a prescription
    */
    handleErrorFxn = err => {
        this.errorHandler.handleError(err, this);
        this.loading = false;
    };

    /**
     * Used to set the form options
     * @param formOptions
     */
    getFormOptions(formOptions) {
        this.formOptions = formOptions;
    }

    /**
     * Function to cancel clear the send sms details
     * and navigate user back to a base state
     */
    cancelFxn() {
        this.customFxn.emit();
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }
}

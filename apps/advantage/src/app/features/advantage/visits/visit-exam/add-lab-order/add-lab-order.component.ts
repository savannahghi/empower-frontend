import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Cookies } from '../../../../../shared/cookies/cookie.service';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { VisitService } from '../../visit.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

@Component({
    selector: 'ngx-add-lab-order',
    templateUrl: './add-lab-order.component.html',
    styleUrl: './add-lab-order.component.scss',
    standalone: false,
})
/**
 * Class that renders the AddLabOrderComponent Component
 */
export class AddLabOrderComponent implements OnInit {
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
     * Service Request Id of the newly created service request
     */

    @Input() newServiceRequestId?: any;
    /**
     * Contains the labOrder details
     */
    labOrderDetails: any;
    /**
     * Used to determine if the content of a form has been submitted
     */
    submitted: boolean = false;
    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Stores service request ID
     */
    serviceRequestId: any;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * emitted when a custom function action button is clicked
     */
    @Output() customFxn = new EventEmitter<string>();

    /**
     * Get LAB service request
     */
    getLabServiceRequest() {
        const labRequests =
            this.visitPayload && this.visitPayload.service_requests
                ? this.visitPayload.service_requests.filter(
                      request => request.queue_type === 'LAB'
                  )
                : [];

        this.serviceRequestId = labRequests[0]?.id ?? this.newServiceRequestId;
    }

    /**
     * Used to submit the lab order data
     * @param model object containing the form data used to create the labOrder
     */
    submitLabOrder(model) {
        this.loading = true;
        this.submitted = true;
        const labOrderPayload: any = {
            name: model.test?.name,
            loinc_code: model?.test?.loinc_code,
            service_request: this.serviceRequestId,
            status: 'REGISTERED',
            clinical_notes: model?.clinical_notes,
        };
        const finalPayload = {
            ...labOrderPayload,
            diagnosis: this.uiglobals.params.diagnosis_id,
            ...this.visitPayload?.settingsData,
        };
        const baseModel = Object.assign({}, finalPayload);
        this.dataLayer.create('exam-lab-orders', baseModel).subscribe({
            next: (data: any) => {
                const msg = `${data?.name} test added`;
                this.showToast('bottom-right', 'success', 'Successfully', msg);
                this.loading = false;
                this.formOptions.resetModel();
                this.analytics.logEvent('lab-order_created');
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
    /** Handles errors when creating a labOrder
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

        this.getLabServiceRequest();
    }
}

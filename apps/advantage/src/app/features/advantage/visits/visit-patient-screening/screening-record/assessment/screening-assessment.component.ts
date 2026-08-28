import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbToastrService, NbGlobalPosition } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../../../shared/sil-http-services/error-handler';
import { StepperService } from '../../../../../../shared/component-services/stepper.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../../../shared/sil-http-services/sil_datalayer.service';
import { timeout } from 'rxjs';

// Custom questionnaire renderer is used instead of LForms
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-screening-assessment',
    templateUrl: './screening-assessment.component.html',
    styleUrls: ['./screening-assessment.component.scss'],
    standalone: false,
})
/**
 * Class that renders the Screening Assessment Component
 */
export class ScreeningAssessmentComponent implements OnInit {
    /**
     * @param stepperService injects instance of stepper service
     * @param dataLayer Connects to the data layer service
     * @param toastService injects instance of toast service
     * @param uiglobals injects the global values from ui router
     * @param errorHandler injects instance of errorhandler service
     */
    constructor(
        public stepperService: StepperService,
        public dataLayer: SilStoresService,
        private toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        private errorHandler: ErrorHandlerService
    ) {}

    /** Contains visit data */
    visit: any;

    /**
     * Contains visit information resolved from the state
     */
    @Input() visitObservable: any;

    /**
     * Toggles form loader when form is being fetched
     */
    formloading: boolean;

    /**
     * Contains the patient's encounter information
     * sourced from the visit on advantage
     */
    @Input() encounterData: any;

    /**
     * add next step requested event emitter
     */
    @Output() nextStepRequested = new EventEmitter();

    /**
     * For showing the loader during form submission
     */
    loading: boolean;

    /**
     * The results of the screening assessment
     */
    results: string;

    /**
     * Contains the questionnaire response from the custom renderer
     */
    questionnaireResponse: any = null;

    /** Tracks whether the questionnaire form is valid */
    isFormValid: boolean = false;

    /**
     * Questionnaire object that defines the form structure
     */
    formDef: any;

    /**
     * The Cancer Screening being done
     * Used to determine which questionnaire to fetch
     */
    @Input() cancerType: string = '';

    /**
     * Service Point details for the patient's screening encounter
     */
    servicePointData: any;

    /**
     * Boolean used to toggle the visibility of the risk assessment component
     */
    @Input() onSummary: boolean;

    /**
     * Boolean used to toggle the visibility of the risk assessment component
     */
    submitted: boolean;

    /**
     * Hook that is called when the component is initialized
     */
    ngOnInit() {
        this.fetchQuestionnaires();
    }
    /**
     * Fetches questionnaire form definition from the server
     * Builds the search parameter based on the cancer type
     */
    fetchQuestionnaires() {
        this.formloading = true;
        const param = {
            searchParam:
                this.cancerType.charAt(0).toUpperCase() +
                this.cancerType.slice(1) +
                ' Cancer Screening',
        };

        this.dataLayer
            .getClinical('questionnaires', param)
            .pipe(timeout(20000))
            .subscribe({
                next: (response: any) => {
                    this.formDef = response;
                    this.formloading = false;
                    return;
                },
                error: err => {
                    this.errorHandler.handleError(err, this, 'clinical');
                },
            });
    }

    /**
     * Submission handler function that will be passed to the questionnaire renderer
     * @param payload The submission payload containing the questionnaire response and additional data
     * @returns A promise that resolves with the submission result or rejects with an error
     */
    submitQuestionnaireResponse(payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = {
                questionnaireID: this.formDef.id,
                encounterID: this.encounterData?.encounterId,
            };
            this.loading = true;
            this.dataLayer
                .create(
                    'questionnaire-response',
                    {
                        input: payload,
                    },
                    params
                )
                .subscribe({
                    next: (response: any) => {
                        resolve(response);
                        this.loading = false;
                        this.submitted = true;
                        this.nextStepRequested.emit();
                    },
                    error: (error: any) => {
                        reject(error);
                        this.loading = false;
                        this.submitted = false;
                    },
                });
        });
    }

    /**
     * Handler for successful form submission
     * @param response The response from the server
     */
    onSubmitSuccess(response: any) {
        const nestedQueryResponse = 'createQuestionnaireResponse';

        // Show success message
        this.toastrService.show(`Assessment added`, 'Successful', {
            status: 'success',
            position: 'bottom-right' as NbGlobalPosition,
        });

        // Store the results
        this.results = response.data[`${nestedQueryResponse}`];
        this.onSummary = true;
    }

    /**
     * Handler for form submission errors
     * @param error The error from the server
     */
    onSubmitError(error: any) {
        this.onSummary = false;
        this.errorHandler.handleError(error, this, 'clinical');
    }

    /**
     * Event handler for receiving the questionnaire response from the custom renderer
     * @param response The questionnaire response from the custom renderer
     */
    onQuestionnaireResponseReceived(response: any) {
        this.questionnaireResponse = response;
    }

    /**
     * Method used to display a toast error message
     * @param position position of the toast message.
     * @param status status of the toast message.
     * @param msg the message to display.
     * @param context additional context for the message.
     */
    showToastError(
        position: NbGlobalPosition,
        status: string,
        msg: string,
        context: string
    ) {
        // Duration in milliseconds for the toast to display
        const duration = 7000;
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }
    /**
     * Method used to display a toast
     * @param position position of the toast message.
     * @param status status of the toast message.
     * @param msg the message to display.
     * @param context additional context for the message.
     */
    showToast(
        position: NbGlobalPosition,
        status: string,
        msg: string,
        context: string
    ) {
        // Duration in milliseconds for the toast to display
        const duration = 7000;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }
}

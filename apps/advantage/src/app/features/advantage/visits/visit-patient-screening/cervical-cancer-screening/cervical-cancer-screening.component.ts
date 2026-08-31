import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    Input,
} from '@angular/core';
import { VisitService } from '../../visit.service';
import { NbStepChangeEvent, NbStepperComponent } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { NbToastrService } from '@nebular/theme';
import { StepperService } from '../../../../../shared/component-services/stepper.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { Subscription, timeout } from 'rxjs';
import { ScreeningService } from '../screening.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const LForms: any;
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-cervical-cancer-screening',
    templateUrl: './cervical-cancer-screening.component.html',
    styleUrls: ['./cervical-cancer-screening.component.scss'],
    standalone: false,
})
/**
 * Class that implements the cervical cancer screening workflow
 * handles the stepper component that guides users through the screening process
 */
export class CervicalCancerScreeningComponent implements OnInit, AfterViewInit {
    /**
     * @param visitService injects instance of the visit service
     * @param screeningService injects instance of the screening service
     * @param toastService Connects to the toast service
     * @param dataLayer Connects to the data layer service
     * @param stepperService injects instance of stepper service
     * @param uiglobals Access instance of uirouter global service
     * @param errorHandler injects instance of errorhandler service
     */
    constructor(
        private visitService: VisitService,
        private screeningService: ScreeningService,
        protected toastService: NbToastrService,
        public dataLayer: SilStoresService,
        public stepperService: StepperService,
        public uiglobals: UIRouterGlobals,
        public errorHandler: ErrorHandlerService,
        public analytics: AnalyticsService
    ) {}
    /**
     * Stepper component reference used to control step transitions
     * Uses static:true to ensure it's available in ngOnInit
     */
    @ViewChild('stepper', { static: true }) stepper: NbStepperComponent;

    /**
     * Tracks the current active step in the stepper
     * initialized during component setup and updated during step transitions
     */
    currentStep: any;

    /**
     * Contains the patient's encounter information
     * sourced from the visit on advantage
     */
    encounterData: any;
    /**
     * Service Point details for the patient's screening encounter
     */
    servicePointData: any;
    /**
     * Contains the patient's screening information
     * sourced from clinical
     */
    screeningData: any;

    /**
     * The results of the screening
     * Contains the response from the questionnaire submission
     */
    results: string;

    /**
     * For showing the loader during data processing operations
     */
    loading: boolean;
    /**
     * Toggles form loader when form is being fetched
     */
    formloading: boolean;

    /**
     * Tracks stepper change events to manage workflow
     * contains information about previous and current steps
     */
    changeEvent: NbStepChangeEvent;

    /**
     * Contains visit data for the current patient
     */
    visit: any;

    /**
     * Contains visit information resolved from the state
     * used to initialize patient and visit data
     */
    @Input() visitObservable: any;
    /**
     * Flag indicating whether the user is currently on the summary page.
     * controls display logic between questionnaire view and summary view
     */
    onSummary: boolean;

    /**
     * Stepper layout orientation
     * can be either 'horizontal' or 'vertical' based on screen size
     */
    orientation: 'horizontal' | 'vertical' = 'vertical';

    /**
     * Observable that waits for patient screening data to be defined
     * sets up subscription to patient data and fetches screening info when available
     */
    visitPatientObservable() {
        this.screeningData = {};
        this.visitService.visitPatientScreeningDataEmitter.subscribe(
            patient => {
                this.encounterData = patient;
                if (patient.servicePoints) {
                    this.servicePointData = this.getServicePointDetails(
                        patient.servicePoints
                    );
                    if (this.servicePointData?.encounterID) {
                        this.fetchScreeningData(
                            this.servicePointData?.encounterID,
                            this.servicePointData?.servicePointStatus
                        );
                    } else {
                        this.screeningData = {};
                    }
                }
            }
        );
    }

    /**
     * Event listener for steps
     * Updates current step and propagates event to stepper service
     * @param e the step change event containing previous and current step information
     */
    handleStepChange(e: NbStepChangeEvent): void {
        this.changeEvent = e;
        this.currentStep = e.index;
        this.stepperService.handleStepChange(e);
    }

    /**
     * Definition of the questionnaire form structure
     */
    formDef: any;
    /**
     * Subscription to GraphQL query responses
     */
    querySubscription: Subscription;

    /**
     * Method used to display a toast error message
     * @param position position where toast should appear
     * @param status status type of toast
     * @param msg message to display in toast
     * @param context context label for the toast message
     */
    showToastError(position, status, msg, context) {
        // Duration in milliseconds for the toast to display
        const duration = 7000;
        this.toastService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }
    /**
     * Method used to display a toast
     * @param position position where toast should appear
     * @param status status type of toast
     * @param msg message to display in toast
     * @param context context label for the toast message
     */
    showToast(position, status, msg, context) {
        // Duration in milliseconds for the toast to display
        const duration = 7000;
        this.toastService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Function to transition to the next step
     * Uses stepper service to handle the transition logic
     */
    nextStep() {
        this.stepperService.nextStep(this.stepper, {
            step: this.currentStep,
            id: this.visit.id,
        });
    }

    /**
     * Function to transition to the previous step
     */
    previousStep() {
        this.stepperService.previousStep(this.stepper, {
            id: this.visit.id,
            step: this.currentStep,
        });
    }

    /**
     * Function used to get encounterID and service point from encounter Data
     * @param servicePoints array of service points from encounter data
     * @returns object containing encounterID and service point status
     */
    getServicePointDetails(servicePoints) {
        const servicePt = servicePoints?.find(
            sp => sp.queue_name === 'Cervical Cancer Screening'
        );

        if (!servicePt) {
            return {
                encounterID: undefined,
                servicePointStatus: undefined,
            };
        }

        return {
            encounterID: servicePt?.encounterID,
            servicePointStatus: servicePt?.status,
        };
    }

    /**
     * Functions to move from the summary page back to the questionnaire screen from the summary
     * Toggles view state and calls previousStep
     */
    previous() {
        if (this.onSummary === true) {
            this.onSummary = false;
        }
        this.previousStep();
    }

    /**
     * Check status of encounter or visit to predetermine what to show
     * @returns true or false
     */
    checkStatus() {
        return (
            [
                this.encounterData?.visit_status?.toLowerCase(),
                this.screeningData?.encounter?.status?.toLowerCase(),
            ].includes('finished') ||
            [
                this.encounterData?.visit_status?.toLowerCase(),
                this.screeningData?.encounter?.status?.toLowerCase(),
            ].includes('completed')
        );
    }

    /**
     * Functions to move to the summary page from the questionnaire screen
     */
    next() {
        this.loading = true;
        this.collectResponses();
    }

    /**
     * Collects questionnaire response
     * builds response object with form data, questionnaire ID, and encounter ID
     */
    collectResponses() {
        const response = {
            questionnaireID: this.formDef.id,
            encounterID:
                this.servicePointData?.encounterID ??
                this.getServicePointDetails(this.encounterData?.servicePoints),
            input: LForms.Util.getFormFHIRData('QuestionnaireResponse', 'R4'),
        };
        this.submitLForm(response);
    }

    /**
     * Submits the LForm questionnaire response to the server
     * @param payload
     * makes call to post the questionnaire response
     */
    submitLForm(payload) {
        this.loading = true;

        // Extract the necessary data from the payload
        const questionnaireID = payload.questionnaireID;
        const encounterID = payload.encounterID;
        const formData = payload.input;

        // Create the REST API request
        this.dataLayer
            .create(
                'questionnaire-response',
                formData, // The form data from LForms
                {
                    // Add query parameters
                    questionnaireID: questionnaireID,
                    encounterID: encounterID,
                }
            )
            .subscribe({
                next: response => {
                    this.analytics.logEvent('screening_cervical_created');
                    this.responseFunction(response);
                },
                error: error => {
                    this.loading = false;
                    this.errorHandler.handleError(error, this);
                },
            });
    }

    /**
     * Function used to handle the next callback
     * @param response server response
     * @returns void as it updates screeningData property with processed state information
     */
    responseFunction(response) {
        if (response && response.questionnaireResponseID) {
            this.loading = false;
            this.showToast(
                'bottom-right',
                'success',
                'Successful',
                `Assessment added`
            );
            this.analytics.logEvent('screening_cervical_response_created');
            this.results = response;
            this.onSummary = true;
            return;
        }

        this.loading = false;
        this.onSummary = false;

        if (response?.message) {
            this.errorHandler.handleError(
                { message: response.message },
                this,
                'clinical'
            );
        }
    }
    /**
     * Function used to fetch patient's screening information
     * @param encounterIDVal encounter identifier
     * @param servicePointStatus service point status
     */
    fetchScreeningData(encounterIDVal, servicePointStatus) {
        this.screeningService.getScreeningData(encounterIDVal).subscribe({
            // Handles a successful response from the server
            next: response =>
                this.stateResponseFunction(
                    response,
                    encounterIDVal,
                    servicePointStatus
                ),
            // Handles any errors that occur during fetching
            error: error => {
                this.errorHandler.handleError(error, this), 'clinical';
            },
        });
    }

    /**
     * Function used to handle the next callback from the fetchScreeningData function
     * @param response server response
     * @param encounterID encounter ID
     * @param servicePointStatus service point status
     * @returns void as it updates screeningData property with processed state information
     */
    stateResponseFunction(response, encounterID, servicePointStatus) {
        if (response?.errors?.length > 0) {
            this.errorHandler.handleError(
                response?.errors[0],
                this,
                'clinical'
            );
            return;
        }
        const stateData = this.screeningService.setScreeningStates(
            response,
            servicePointStatus,
            this.encounterData?.visit_status?.toLowerCase(),
            'cervical'
        );

        this.screeningData = {
            ...stateData,
            encounterID: encounterID,
            servicePointStatus: servicePointStatus,
        };
    }

    /**
     * Hook that is called when the component is initialized
     */
    ngOnInit() {
        /**
         * Checks if user is authorized to access empower ui
         */
        this.screeningService.checkUnauthorizedAccess();
        /**
         * Sets up responsive behavior for stepper orientation
         */
        this.stepperService.checkOrientationChange(this, '991px');
        /**
         * Sets up patient data subscription
         */
        this.visitPatientObservable();
        /**
         * Fetches questionnaire definitions from server
         */
        this.fetchQuestionnaires();

        /**
         * Sets up visit data and handles errors
         */
        this.visitObservable.subscribe(
            /**
             * Handles a successful response from the server.
             * @param response The clinical data returned from the server.
             */
            (response: any) => {
                this.visit = response;
                this.visitService.setVisitData(this.visit);
            },
            // Handles any errors that occur during fetching
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }

    /**
     * Hook that is called after view is initially rendered
     */
    ngAfterViewInit(): void {
        /** Setup stepper */
        setTimeout(() => {
            this.updateStepContent();
        }, 100);
    }
    /**
     * Function used to update the step content with custom icons and initializes the stepper
     * Sets the `currentStep` based on `uiglobals.params.step`
     * and calls the `setupStepper` method after DOM is ready
     */
    updateStepContent(): void {
        // Update content for first span with image 1
        this.updateSpanContent(
            '.header .step:nth-child(1) .label-index span',
            '../../../../../assets/images/peicon.svg'
        );

        // Update content for second span with image 2
        this.updateSpanContent(
            '.header .step:nth-child(3) .label-index span',
            '../../../../../assets/images/riskicon.svg'
        );

        // Update content for third span with image 3
        this.updateSpanContent(
            '.header .step:nth-child(5) .label-index span',
            '../../../../../assets/images/screentype.svg'
        );

        // Update content for third span with image 4
        this.updateSpanContent(
            '.header .step:nth-child(7) .label-index span',
            '../../../../../assets/images/followupicon.svg'
        );

        this.currentStep =
            this.uiglobals.params.step === undefined
                ? 0
                : parseInt(this.uiglobals.params.step, 10);
        // Setup stepper
        setTimeout(() => {
            this.stepperService.setupStepper(this.stepper);
        }, 300);
    }
    /**
     * Function used to set step icons and images
     * @param selector Html Element to be styled
     * @param imageUrl Icon Image
     * Sets the image width to 85% and centers it vertically and horizontally
     */
    updateSpanContent(selector: string, imageUrl: string): void {
        // Find the <span> element you want to update
        const spanElement = document.querySelector(selector);

        if (spanElement) {
            // Clear existing content
            spanElement.innerHTML = '';

            // Create new <img> element with specified image URL
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;

            // Apply CSS styles to center the image and set its width
            imgElement.style.display = 'block';
            imgElement.style.width = '85%';
            imgElement.style.margin = '0 auto';

            // Append the <img> element to the <span> element
            spanElement.appendChild(imgElement);
        }
    }

    /**
     * Fetches questionnaire form definition from the server
     */
    fetchQuestionnaires() {
        // Set loading state for the form
        this.formloading = true;

        // Set up search parameters for the questionnaire
        const param = {
            searchParam: 'Cervical Cancer Screening',
        };

        // Call the clinical data service with a 20-second timeout
        this.dataLayer
            .getClinical('questionnaires', param)
            .pipe(timeout(20000)) // 20-second timeout for the request
            .subscribe({
                /**
                 * Handles a successful response from the server.
                 * @param response The clinical data returned from the server.
                 */
                next: (response: any) => {
                    this.formDef = response;
                    LForms?.Util?.addFormToPage(this.formDef, 'lformid');
                    this.formloading = false;
                    return;
                },
                // Handles any errors that occur during fetching
                error: err => {
                    this.errorHandler.handleError(err, this, 'clinical');
                },
            });
    }
}

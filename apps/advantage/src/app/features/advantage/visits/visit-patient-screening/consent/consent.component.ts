import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StateService, Transition } from '@uirouter/angular';
import { NbToastrService } from '@nebular/theme';
import _ from 'underscore';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { VisitService } from '../../visit.service';
import { environment } from '../../../../../../environments/environment';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-consent',
    templateUrl: './consent.component.html',
    styleUrls: ['./consent.component.scss'],
    standalone: false,
})
/**
 * This is the class definition of the component
 */
export class ConsentComponent implements OnInit {
    /**
     * Emmitter thay emits event used to trigger function that moves to stepper's next step
     */
    @Output() nextStepRequested: EventEmitter<void> = new EventEmitter();
    /**
     * The Cancer Screening being done
     */
    @Input() cancerType: string = '';
    /**
     * Encounter status
     */
    @Input() encounterStatus: string = '';
    /**
     * Screening Tests Task Data
     */
    @Input() screeningTasksData: any;
    /**
     * Screening Encounter Data
     */
    @Input() encounterData: any;
    /**
     * Screening Data
     */
    @Input() consentData: any;
    /**
     * Boolean used to indicate if risk assessment has been recorded
     */
    @Input() hasRiskAssessment: boolean = false;
    /**
     * OnClick function used to trigger emitter
     */
    requestNextStep() {
        if (this.hasRiskAssessment) {
            this.$state.transitionTo(
                `app.advantage.visits.detail.screening.${this.cancerType}_cancer`,
                {
                    id: this.encounterData.visit_id,
                    encounter_id: this.encounterID,
                    step: 2,
                },
                { reload: true, inherit: true }
            );
        } else {
            this.nextStepRequested.emit();
        }
    }
    /**
     * Defines loading state
     */
    loading: boolean = false;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * Used to determine if the content of a form has been submitted
     */
    submitted: boolean = false;

    /**
     * Consent response
     */
    result: { status: string } = {
        status: '',
    };
    /**
     * Encounter ID used as a unique identifier for the patient's consent
     */
    encounterID: string;
    /**
     * The component constructor
     * @param transition injects uirouter transition service
     * @param visitService injects instance of the visit service
     * @param dataLayer - Connects to the datalayer service
     * @param toastService Connects to the toast service
     * @param $state Access instance of the state service
     * @param errorHandler injects instance of errorhandler service
     * @param screeningService injects instance of the screening service
     */
    constructor(
        public transition: Transition,
        private visitService: VisitService,
        private dataLayer: SilStoresService,
        protected toastService: NbToastrService,
        public $state: StateService,
        private errorHandler: ErrorHandlerService,
        public analytics: AnalyticsService
    ) {}
    /**
     * Checks if the user has chosen a consent option
     */
    public consentChoice: string = '';
    /**
     * Saves consent choice
     */
    consentDenied: boolean = false;
    /**
     * User Message Segments
     */
    segments: any = [];
    /**
     * Consent Choice
     */
    provisionChoice: string = '';
    /**
     * Consent choice saved on the server
     */
    savedConsentChoice: string = '';
    /**
     * Reason for denying consent
     */
    denyReason: string = '';
    /**
     * ALternative reason for denying consent
     */
    otherReason: string = '';
    /**
     * Used to check if the user wants to enroll to sms
     */
    isEnrolling: boolean = false;
    /**
     * Used to check if the user denied consent
     */
    denialConsentSubmitted: boolean = false;
    /**
     * Function used to enroll the patient to Health education
     * @param event boolean that checks if enrollment has been accpeted
     */
    enrollToHealthEducation(event: boolean) {
        this.isEnrolling = event;
    }
    /**
     * Function used to set consent choice
     * @param choice consent choice deny or permit
     */
    chooseProvision(choice: string) {
        this.provisionChoice = choice;
        const hasEncounter = this.getEncounterId(
            this.encounterData.servicePoints
        );
        if (!hasEncounter || _.isNull(hasEncounter)) {
            this.$state.transitionTo(
                `app.advantage.visits.detail.screening.${this.cancerType}_cancer`,
                {
                    id: this.encounterData.visit_id,
                    encounter_id: this.encounterID,
                    choice: choice,
                },
                { reload: true }
            );
        }
    }
    /** fetch patient's segments */
    getSegments(personID) {
        const params = {
            person: personID,
            fields: 'id,segment,enrolled_at',
        };
        this.loading = true;
        this.dataLayer.list('patient-segments', params).subscribe({
            next: (response: any) => {
                this.loading = false;
                this.segments = response.results;
            },
            error: err => {
                this.loading = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }
    /**
     * Function used to get encounterID from encounter Data
     * @param servicePoints encounter Data
     */
    getEncounterId(servicePoints) {
        const encounter = servicePoints.find(
            sp =>
                sp.queue_name.toLowerCase() ===
                `${this.cancerType} cancer screening`
        );

        return encounter?.encounterID;
    }
    /**
     * Used to load as payload is sent to the server
     */
    loadingResult: boolean = false;
    /**
     * Reasons for user denying consent
     */
    public denyReasons: Array<string> = [
        'Fear or Anxiety',
        'Lack of Awareness',
        'Cultural or Religious Beliefs',
        'Previous Negative Experience',
        'Privacy Concerns',
        'Misinformation or Mistrust',
        'Personal Choice',
        'Other',
    ];
    /**
     * Check status of encounter or visit to predetermine what to show
     * @returns true or false
     */
    checkStatus() {
        return (
            [
                this.encounterData?.visit_status?.toLowerCase(),
                this.encounterStatus?.toLowerCase(),
            ].includes('finished') ||
            [
                this.encounterData?.visit_status?.toLowerCase(),
                this.encounterStatus?.toLowerCase(),
            ].includes('completed')
        );
    }

    /**
     * Takes user back to the visits page
     */
    goBack() {
        this.$state.transitionTo('app.advantage.visits.detail.screening', {
            id: this.encounterData.visit_id,
        });
    }
    /**
     * Used to set deny reason
     * @param inputName Name of the input field
     * @param event Value of the input field
     */
    setReason(inputName, $event) {
        this[inputName] = $event;
    }
    /**
     * Used to submit the facility data
     */
    submitConsent() {
        this.loadingResult = true;

        const dataObj = {
            decision: this.provisionChoice,
            denyReason:
                this.denyReason === 'Other'
                    ? this.otherReason
                    : this.denyReason,
            encounterID:
                this.encounterID ??
                this.getEncounterId(this.encounterData.servicePoints),
        };
        this.consentDenied = this.provisionChoice === 'deny';
        this.savePatientConsent(dataObj);
    }
    /**
     * Function used to clear form values
     */
    clearFormValues() {
        this.provisionChoice = '';
        this.denyReason = '';
        this.otherReason = '';
    }
    /**
     * Function that sends the consent data to the server
     * @param payload data to be sent to the server
     */
    savePatientConsent(payload): any {
        if (_.isNull(payload?.encounterID)) {
            const msg =
                'Consent could not be recorded. Please contact our support team.';
            if (environment.sentryEnvironment === 'testing') {
                this.showToastError('bottom-right', 'danger', 'Consent', msg);
            }
            this.loadingResult = false;

            return;
        }

        this.dataLayer.create('empower-consent', payload).subscribe({
            next: res => this.responseFunction(res),
            error: err => this.errorFunction(err),
        });
    }

    /**
     * Function that updates visit to in progress
     * @param visitId visit parameter
     */
    updateVisit(visitId) {
        this.dataLayer
            .update('visits', visitId, {
                status: 'IN_PROGRESS',
            })
            .subscribe({
                next: (response: any) => {
                    this.analytics.logEvent('service-request_completed');
                    this.visitService.updateVisit(response);
                },
                error: (err: any) => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }
    /**
     * Function used to handle the next callback
     * @param response server response
     */
    responseFunction(response) {
        if (this.encounterData.visit_id) {
            this.updateVisit(this.encounterData.visit_id);
        }

        this.denialConsentSubmitted = this.consentDenied;
        this.result.status = response.status;

        const msg = 'Patient consent successfully recorded';
        this.showToast('bottom-right', 'success', msg, 'Consent Recorded');
        this.loadingResult = false;
        if (!this.denialConsentSubmitted) {
            this.requestNextStep();
        }

        this.clearFormValues();
    }
    /**
     * Function used to handle the error callback
     * @param error server error
     */
    errorFunction = error => {
        {
            this.errorHandler.handleError(error, this, 'clinical');
            this.loadingResult = false;
            this.clearFormValues();
        }
    };
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
     * Method used to display a toast error message
     */
    showToastError(position, status, msg, context) {
        const duration = 7000;
        this.toastService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Hook that is called when the component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        if (this.encounterData?.servicePoints) {
            this.encounterID = this.getEncounterId(
                this.encounterData.servicePoints
            );
        }

        if (this.checkStatus()) this.getSegments(this.encounterData?.personID);

        const choice = this.transition.params().choice;
        if (choice) this.provisionChoice = choice;

        this.savedConsentChoice = this.consentData?.provision?.type ?? '';
        if (this.savedConsentChoice !== '')
            this.provisionChoice = this.savedConsentChoice;
    }
}

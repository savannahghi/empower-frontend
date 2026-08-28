import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Transition, StateService, UIRouterGlobals } from '@uirouter/core';
import { VisitService } from '../visit.service';
import { PatientService } from '../../patients/patient.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { ShepherdService } from 'angular-shepherd';
import {
    visitDetailsSteps as defaultSteps,
    defaultStepOptions,
} from '../../onboarding/shepherd-config';
import { environment } from '../../../../../environments/environment';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - style: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'visit-details',
    styleUrls: ['./visit-details.component.scss'],
    templateUrl: './visit-details.component.html',
    providers: [PatientService],
    standalone: false,
})

/**
 * class component for visit details
 */
export class VisitDetailsComponent implements OnInit {
    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};
    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;
    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;
    /**
     * Array used to define the actions of the datatable
     */
    actions: Array<any>;

    /**
     * params used to filter the datatable api
     */
    filterParams: Object;
    /**
     * name of parent state
     */
    parentName: string;
    /**
     * checks if it is a queue
     */
    isQueue: any;
    /**
     * Defines visit data
     */
    visit: any;
    /**
     * Contains visit information resolved from the state
     */
    @Input() visitObservable: any;

    /**
     * Defines visit id
     */
    visitId: string;
    /**
     * Defines loading state
     */
    loading: boolean = true;
    /**
     * Used to toggle billing modal
     */
    showBillingModal: boolean = false;
    /**
     * Used to toggle payment modal
     */
    showPaymentModal: boolean = false;
    /**
     * Boolean used to show the modal
     */
    showModal = false;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * id that contains the patient identifier
     */
    patientId: any;
    /**
     * Contains patient information
     */
    patient: any;
    /**
     * Contains patient information
     */
    patientDetails: any;
    /**
     * stores the state of when a form is submitted
     */
    submitted: boolean = true;
    /**
     * contains erp uesr details
     */
    erpUserDetails: any;

    /** Contains default currency */
    defaultCurrency: any;

    /** invoice information is stored in this variable */
    invoice: any;

    /**
     * toggles book appointment form when a visit ends
     */
    showAppointmentBooking: boolean = false;

    /**
     * contains org setting
     */
    orgSettingsDetails: any;

    /**
     * contains patient scheduling method
     */
    patientSchedulingMethod: any;

    /**
     * contains app variant information
     */
    variant: string;

    /**
     * stores workstation information
     */
    workstation: any;

    /**
     * stores workstationName information
     */
    workstationName: any;

    /**
     * Constructor for VisitDetailComponent
     * @param dataLayer injects instance of the datalayer service
     * @param transition injects instance of the transition service
     * @param $state injects instance of the state service
     * @param visitService injects instance of the visit service
     * @param authService injects instance of the auth service
     * @param uiglobals injects instance of uirouter uiglobals service
     * @param errorHandler injects instance of errorhandler service
     * @param swalTargets injects instance of sweetalert configuration
     */
    constructor(
        public authService: Authorization,
        public dataLayer: SilStoresService,
        protected toastrService: NbToastrService,
        private errorHandler: ErrorHandlerService,
        public visitService: VisitService,
        public patientService: PatientService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public transition: Transition,
        public readonly swalTargets: SwalPortalTargets,
        private shepherdService: ShepherdService,
        public analytics: AnalyticsService
    ) {
        this.variant = environment.variant;
    }

    /**
     * Used to toggle the modal
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }
    /**
     * Hides visit details base on user's current state
     * @returns true or false
     */
    checkState() {
        return (
            this.uiglobals.current.name.includes('medications-view') ||
            this.uiglobals.current.name.includes('create-medication')
        );
    }
    /**
     * Function used to start/continue exam
     */
    transitionExam() {
        if (this.checkExamsState()) {
            this.parentName = 'app.advantage.visits.detail';
            this.goToBilling();
        } else {
            this.$state.transitionTo(
                'app.advantage.visits.detail.exam',
                { id: this.visit.id },
                { reload: false }
            );
        }
    }
    /**
     * Function that only shows exam states if user is in an exam state
     * @returns true or false
     */
    checkExamsState() {
        return this.uiglobals.current.name.includes('exam');
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
     * Boolean used to show/hide test tabs
     */
    screeningTestTabsVisibility: boolean = false;
    /**
     * Complete an active visit
     */
    completeVisit() {
        /** prompt user to book a review appointment, if no end visit, if yes book review appointment then end visit */
        this.visitService.completeVisit(this, this.visit['id']);
    }

    /**
     * Start a visit with the patient details
     */
    cancelVisit() {
        this.loading = true;
        this.dataLayer
            .updateNested('visits', this.visit.id, 'cancel_visit', {})
            .subscribe({
                next: () => {
                    const title = 'Visit cancellation';
                    const context = 'Visit has been cancelled';
                    this.showToast('bottom-right', 'success', title, context);
                    this.analytics.logEvent('visit_cancelled');
                    this.$state.go(
                        'app.advantage.visits',
                        {},
                        { reload: true }
                    );
                },
                error: err => {
                    this.loading = false;
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /** saves workstation */
        this.workstation = this.authService.getWorkstation();

        this.visitId = this.transition.params().id;

        this.erpUserDetails = this.authService.getErpOrganisation();

        this.getOrganisationSettings();

        this.visitPatientObservable();

        /** Resolved observable from the state */
        this.visitObservable.subscribe(
            (response: any) => {
                this.visit = response;
                this.visitService.setVisitData(this.visit);
                this.patientId = response.patient;
                this.goToCorrectState(this.visit);
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );

        /**
         * Initiates the visit observable to fetch the visit once it is emitted
         */
        this.visitServiceObservable();
    }

    /** visit details walkthough function */
    startWalkthrough() {
        this.shepherdService.defaultStepOptions = defaultStepOptions;
        this.shepherdService.modal = true;
        this.shepherdService.tourName = 'visit-details';
        this.shepherdService.confirmCancel = false;
        this.shepherdService.addSteps(defaultSteps);
        this.shepherdService.start();
    }
    /**
     * Function used to show or hide the visit tests and referral tabs
     * @returns boolean used for the tab visibility
     */
    showScreeningTestTabs(params, page) {
        return (
            this.$state.includes(page) &&
            params?.cancer_type &&
            params?.patient_id &&
            params?.encounter_id
        );
    }

    /**
     * Subscribes to the observable that emits visit information
     */
    visitServiceObservable() {
        this.visit = this.visitService.visit;
        this.visitService.visitDataEmitter.subscribe(this.setVisit);
    }

    /** set visit */
    setVisit = vis => {
        this.visit = vis;
    };
    /**
     * Determines what state to navigate to
     * @param visit uses visit id to navigate to correct state
     */
    goToCorrectState(visit) {
        this.workstation = this.authService.getWorkstation();
        // determine if the parent is defined
        if (this.uiglobals.$current.parent !== undefined) {
            this.parentName = this.uiglobals.$current.parent.name;
            this.isQueue = this.uiglobals.current.name.includes('queues');
            if (
                this.uiglobals.current.name !==
                    `${this.parentName}.detail.billing` &&
                this.uiglobals.current.name !==
                    `${this.parentName}.detail.payments`
            ) {
                this.workstationName = this.workstation.workstation__name;
                this.transitionToState(this.workstationName, visit);
            }
        }
    }

    /**
     * Transition to states based on the service request queue
     */
    transitionToState(workstationName, visit) {
        let state = 'billing';
        const queue_type = this.visit?.service_requests[0]?.queue_type;
        const visit_type = this.visit?.visit_type;

        if (queue_type?.includes('SCREENING')) {
            state = 'screening';
        } else if (queue_type === 'TREATMENT' && visit_type === 'CHEMO') {
            state = 'diagnostics';
        } else if (
            workstationName.includes('Consultation') ||
            workstationName.includes('Triage')
        ) {
            state = 'clinical';
        }

        this.$state.transitionTo(
            `${this.parentName}.detail.${state}`,
            {
                id: visit.id,
                service_request: this.uiglobals.params.service_request,
            },
            { reload: true, notify: true }
        );
    }

    /**
     * Allows user to navigate to the billing state.
     * This is because the billing state requires the params defined while
     * navigating to the state.
     */
    goToBilling() {
        this.$state.transitionTo(
            `${this.parentName}.billing`,
            {
                id: this.visit.id,
                service_request: this.uiglobals.params?.service_request,
            },
            { reload: true, notify: true }
        );
    }

    /**
     * Allow transition of visit to IN_PROGRESS
     */
    transitionToInProgress() {
        this.dataLayer
            .update('visits', this.visit.id, {
                status: 'IN_PROGRESS',
            })
            .subscribe({ next: this.transitionedToInProgressVisit });
    }

    /** Handles the success transition of a visit to IN_PROGRESS */
    transitionedToInProgressVisit = () => {
        const title = 'Checks done';
        const context = 'The visit has been checked for completion';
        this.showToast('bottom-right', 'success', title, context);
    };

    /** Observable that waits for patient visit data to be defined */
    visitPatientObservable() {
        this.visitService.visitPatientDataEmitter.subscribe(patient => {
            this.patient =
                this.patientService.checkIfPatientIsComplete(patient);
        });
    }

    /** toggles book appointment dialogue */
    toggleBookAppointment() {
        this.showAppointmentBooking = !this.showAppointmentBooking;
    }

    /**
     * get organization scheduling method from organization settings
     */
    getOrganisationSettings() {
        this.orgSettingsDetails = this.authService.getOrgSettings();

        this.patientSchedulingMethod = this.orgSettingsDetails?.find(
            setting =>
                setting.name ===
                'scheduling:preferred_patient_scheduling_method'
        );
    }
}

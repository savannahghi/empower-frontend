/** Imports used within the component */
import { Component, OnInit } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Transition } from '@uirouter/core';
import { PatientService } from '../../patients/patient.service';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { PatientListComponent } from '../../patients/patient-list/patient-list.component';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { ShepherdService } from 'angular-shepherd';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - style: contains the scss file used to style the component
 * - providers: used to inject services
 */
@Component({
    selector: 'ngx-view-appointment',
    templateUrl: './view-appointment.component.html',
    styleUrls: ['./view-appointment.component.scss'],
    providers: [PatientService],
    standalone: false,
})

/**
 * This is the class definition of the component
 */
export class ViewAppointmentComponent
    extends PatientListComponent
    implements OnInit
{
    /**
     * Contains the appointment for the current day
     */
    appointment: any;

    /**
     * Contains a filter for bringing the current day's appointments
     */
    filterParams: any;

    /**
     * Contains appointment id from url
     */
    appointmentId: any;

    /**
     * Contains arrived visit
     */
    arrivedVisit: any;

    /**
     * Shows the loading of the xhr requests
     */
    loading: boolean = false;

    /**
     * Boolean used to show the modal
     */
    showCancelAppointmentModal: boolean = false;

    /**
     * Boolean used to define if the patient registration form data has been submitted
     */
    submitted: boolean = false;

    /**
     * Boolean used to disable the cancel button once the cancellation is successful
     */
    disableCancelButton: boolean = false;

    /**
     * Form loaded from assets to create a schedule
     */
    heading: any;

    /**
     * Time used to show the error toast
     */
    toastErrorTime = 10000;

    /**
     * Boolean used to show the modal
     */
    showModal = false;

    /**
     * Contains selected queue used to start a visit
     */
    selectedQueue: object;

    /**
     * Contains selected billing class used to start a visit
     */
    selectedBillingClass: object;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * Contains all queues
     */
    queues: any;

    /**
     * Constructor for the class component
     * @param dataLayer gives access to the datalayer service
     * @param transition gives access to the transition service
     * @param $state gives access to the state service
     * @param errorHandler gives access to the datalayer service
     * @param toastrService gives access to the toast service
     * @param patientService gives access to the patient service
     * @param swalTargets gives access to the sweetalert service
     */
    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        public shepherdService: ShepherdService,
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public transition: Transition,
        public patientService: PatientService,
        public readonly swalTargets: SwalPortalTargets,
        public translate: TranslateService,
        public cookieService: Cookies
    ) {
        super(
            dataLayer,
            errorHandler,
            shepherdService,
            toastrService,
            uiglobals,
            $state,
            translate,
            cookieService
        );
    }

    /**
     * Navigates to rescheduling page
     */
    navigateToReschedule(id) {
        this.$state.go('app.advantage.appointments.detail', { id: id });
    }

    /**
     * Toggles the cancel appointment modal
     */
    toggleCancelAppointmentModal() {
        this.heading = 'cancel-appointment';
        this.showCancelAppointmentModal = !this.showCancelAppointmentModal;
    }
    /**
     * Cancels an appointment
     * @param model contains info about the appointment
     */
    cancelAppointment(model) {
        this.submitted = true;
        this.showCancelAppointmentModal = false;
        this.loading = true;

        const dataObj = {
            appointment_status: 'CANCELLED',
            cancellation_reason: model.cancellation_reason,
        };
        this.dataLayer
            .update('appointments', this.appointmentId, dataObj)
            .subscribe({
                next: () => {
                    const msg = 'Cancelled appointment';
                    const context = 'Cancelled Appointment';
                    this.showToast('bottom-right', 'success', context, msg);
                    this.disableCancelButton = true;
                    this.loading = false;
                },
                error: err => {
                    this.errorHandler.handleError(err);
                    const msg = 'Failed to cancel appointment';
                    const context = 'Cancel';
                    this.showErrorToast('bottom-right', 'danger', msg, context);
                    this.loading = false;
                },
            });
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit(): void {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        /**
         * Get the appointment ID from the url parameter
         */
        this.appointmentId = this.transition.params().id;
        this.getQueues();
        this.changeBillingClass('CASH');

        /**
         * Get the appointment requested to be viewed
         */
        this.dataLayer.get('appointments', this.appointmentId).subscribe({
            next: (response: any) => {
                this.appointment = response;
                this.patientService.setPatient(
                    this.appointment.patient_details
                );
                this.patient = this.patientService.patient;

                this.loading = false;
                this.getPatientArrivedVisit();
            },
            error: err => {
                this.errorHandler.handleError(err);
                this.loading = false;
            },
        });
    }

    /** Start visit service */
    startVisit() {
        this.loading = true;
        this.patientService.startVisit(
            this,
            this.appointment['patient_details'],
            this.appointment,
            this.selectedQueue
        );
    }

    /**
     * Checks to see if there is an ongoing visit
     */
    getPatientArrivedVisit() {
        this.patientService.patientVisitDataEmitter.subscribe((visit: any) => {
            this.arrivedVisit = visit;
        });
    }

    /**
     *  get queues
     */
    getQueues() {
        this.patientService.queuesDataEmitter.subscribe((queues: any) => {
            this.queues = queues;
        });
    }

    /**
     * Detects changing of queue
     */
    changeQueue(queue) {
        this.selectedQueue = queue;
    }

    /**
     * Detects changing of visit class
     */
    changeBillingClass(billingClass) {
        this.selectedBillingClass = billingClass;
    }
}

/** Imports used in the component */
import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/core';
import { PatientService } from '../patient.service';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { PatientListComponent } from '../patient-list/patient-list.component';
import { ShepherdService } from 'angular-shepherd';
import moment from 'moment';
import { QueryRef } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { environment } from '../../../../../environments/environment';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { VisitTypeCode } from '../../models';

interface AppointmentBookingInterface {
    sched_description: string;
    sched_specialty: string;
    appointment_status: string;
    start: Date;
    end: Date;
}

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 * - provider: contains the services required by the component
 */
@Component({
    selector: 'patient-details',
    styleUrls: ['./patient-details.component.scss'],
    templateUrl: './patient-details.component.html',
    providers: [PatientService],
    standalone: false,
})

/**
 * PatientDetails component class
 * Implements OnInit when intializing the class
 */
export class PatientDetailsComponent
    extends PatientListComponent
    implements OnInit
{
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
     * Used to filter information being sent to the api via the datatable
     */
    filterParams: Object;

    /**
     * Defines Patient data
     */
    patient: any;

    /**
     * Defines preferred state
     */
    preferredState: any;

    /**
     * Contains the observable resolved from the state service
     */
    @Input() patientObservable: any;

    /**
     * Defines patient id
     */
    patientId: string;

    /**
     * Defines patient clinical id
     */
    patientClinicalId: any;

    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * Contains a booked appointment that has been scheduled for a patient
     */
    selectedAppointment;

    /**
     * Contains selected queue used to start a visit
     */
    selectedQueue: Object;

    /**
     * Contains selected billing class used to start a visit
     */
    selectedBillingClass: object;

    /**
     * Contains selected guarantor id for a credit visit
     */
    selectedGuarantor: object;

    /**
     * Contains array of upcoming appointments(check-in and bookings)
     */
    upcomingAppointments: any;

    /**
     * Contains array of upcoming bookings-appointments
     */
    upcomingBookingAppointments: Array<AppointmentBookingInterface>;

    /**
     * Contains arrived visit
     */
    arrivedVisit: any;

    /**
     * Tells if arrived visit has been loaded
     */
    loadedArrivedVisit: any;

    /**
     * Boolean to check if it is a past visit
     */
    isPastVisit: boolean = false;

    /**
     * Contains all queues
     */
    queues: any;

    /**
     * max date validator for date picker
     */
    max: any;

    /**
     * saves the start date of a visit
     */
    startDate: any;

    formConfig: { checkExpressionOn: string };

    /**
     * Used to store a patientAllergies
     */
    patientAllergies: Observable<any[]>;

    /**
     * Used to store a patientConditions
     */
    patientConditions: Observable<any[]>;

    /**
     * Used to show that the fetching allergies progress
     *  */
    loadingAllergies: boolean = false;

    /**
     * Used to show that the fetching conditions progress
     *  */
    loadingConditions: boolean = false;

    /**
     * contains app variant information
     */
    variant: string;

    /**
     * Selected Visit Type
     */
    selectedVisitType: VisitTypeCode = 'AMB';

    conditionsQuery: QueryRef<any>;

    private querySubscription: Subscription;

    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     * @param dataLayer - Connects to the datalayer service
     * @param transition - Connects to the transition service
     * @param $state - Connects to the state service
     * @param errorHandler - Connects to the error handler service
     * @param patientService - Connects to the patient service
     * @param swalTargets - Connects to the sweetalert service
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
        public cookieService: Cookies,
        public authService: AuthenticationService
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
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
        this.variant = environment.variant;
    }

    /**
     * Fetches the patient information
     */
    getPatientInfo() {
        this.patientObservable.subscribe(
            (response: any) => {
                this.patient =
                    this.patientService.checkIfPatientIsComplete(response);
                this.patientService.setPatient(this.patient);
                this.patientDetails = response;
                this.patientId = response.clinical_id;

                if (
                    this.uiglobals.current.name.includes(
                        'app.advantage.patients.detail.'
                    )
                ) {
                    this.$state.go(
                        this.uiglobals.current.name,
                        {},
                        { reload: false }
                    );
                } else {
                    this.$state.go(
                        `app.advantage.patients.detail.${this.preferredState}`,
                        {
                            customer_customer: this.patient.customer_id,
                        },
                        { reload: false }
                    );
                }
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }

    /**
     *  getPatientUpcomingAppointments
     */
    getPatientUpcomingAppointments() {
        if (!this.authService.checkPermission('advantage.appointment_list')) {
            return;
        }
        this.patientService.patientAppointmentsDataEmitter.subscribe({
            next: (appointments: any) => {
                if (Array.isArray(appointments)) {
                    // Get a list of all the appointments of the patient;
                    // both check-in and pre-booking
                    this.upcomingAppointments = appointments;
                    /**
                     * Add the check-in appointment as the default selected appointment
                     * for start visit.
                     * Incase the patient has pre-booked appointments, loop through them
                     * till you get the check-in appointment.
                     */
                    for (let i = 0; i < appointments.length; i++) {
                        if (appointments[i].sched_actor === 'FACILITY') {
                            this.selectedAppointment = appointments[i];
                        }
                    }
                    // Create a separate array for the appointment bookings to show
                    // on the table under patient details
                    this.getBookedAppointments(appointments);
                }
            },
        });
    }

    /**
     *  get upcoming booking appointments
     */
    getBookedAppointments(appointments) {
        const bookedAppointments = [];
        for (const appt of appointments) {
            // Don't add to array if it's a check-in appointment
            if (appt.sched_actor === 'PRACTITIONER') {
                bookedAppointments.push(appt);
            }
            this.upcomingBookingAppointments = bookedAppointments;
        }
    }

    /**
     *  get patient arrived visit info
     */
    getPatientArrivedVisit() {
        this.patientService.patientVisitDataEmitter.subscribe((visit: any) => {
            this.loadedArrivedVisit = true;
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
     * Saves the selected date on the date input field
     */
    getStartDate(event) {
        // Gets the current time and adds it to the seleted date
        const currentTime = moment().utc().format('HH:mm:ss z');
        const date = moment(event).utc().format('YYYY-MM-DD');
        this.startDate = moment(`${date} ${currentTime}`);
    }

    /**
     * toggles the isPastVisit
     */
    togglePastVisit() {
        this.isPastVisit = !this.isPastVisit;
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
            null,
            null,
            this.selectedVisitType
        );
    }

    /**
     * Sets the appointment being used
     * @param app contains information about the appointment
     */
    setAppointment(app) {
        this.selectedAppointment = app;
    }
    /**
     * Hides patient details base on user's current state
     * @returns true or false
     */
    checkState() {
        return (
            this.uiglobals.current.name.includes('post-screening') ||
            this.uiglobals.current.name.includes('screening-report') ||
            this.uiglobals.current.name.includes('post-referral') ||
            this.uiglobals.current.name.includes('lab-order') ||
            this.uiglobals.current.name.includes('medications-view')
        );
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'modelChange',
        };
        if (this.variant === 'empower') {
            this.preferredState = 'screening';
        } else {
            this.preferredState = 'billing';
        }
        this.max = moment();
        this.getPatientInfo();
        this.changeBillingClass('CASH');
        this.getPatientUpcomingAppointments();
        this.getQueues();
        this.getPatientArrivedVisit();
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

    /** getFilteredResponse of queues from sil-combo-box*/
    getFilteredResponse(event, item: string) {
        if (item === 'queue') {
            this.selectedQueue = event;
        } else if (item === 'guarantor') {
            this.selectedGuarantor = event;
        }
    }
}

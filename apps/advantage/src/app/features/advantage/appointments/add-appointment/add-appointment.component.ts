/**
 * Imports used in the component
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Transition } from '@uirouter/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { PatientService } from '../../patients/patient.service';
import { SwalPortalTargets, SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import moment from 'moment';
import _ from 'underscore';
import { ShepherdService } from 'angular-shepherd';
import {
    addAppointmentSteps as defaultSteps,
    defaultStepOptions,
} from '../../onboarding/shepherd-config';
import { PatientListComponent } from '../../patients/patient-list/patient-list.component';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { AnalyticsService } from 'app/@core/utils';
import { FeatureFlagService } from 'app/@core/utils/feature.service';

interface ModelInterface extends SelectedSlotInteface {
    appointment_status?: string;
    sched_specialty?: string;
    sched_description?: string;
    reason?: string;
    cancellation_reason?: string;
}

interface SelectedSlotInteface {
    id?: string;
    start?: any;
    end?: any;
}
/**
 * Contains the component decorator and defines
 * the selector, style url, template url and providers
 */
@Component({
    selector: 'add-appointment',
    templateUrl: './add-appointment.component.html',
    styleUrls: ['./add-appointment.component.scss'],
    providers: [PatientService],
    standalone: false,
})

/**
 * Definition of the component's class and the lifecycle hooks it uses: OnInit and OnChanges
 */
export class AddAppointmentComponent
    extends PatientListComponent
    implements OnInit
{
    /**
     * Form loaded from assets to create a schedule
     */
    heading: any = 'schedule-registration';

    /**
     * Boolean used to show the modal
     */
    showModal = false;

    /**
     * Boolean used to define if the form data has been submitted and displays the scheduler
     */
    displayScheduling: boolean = false;

    /**
     * Boolean used to define if a slot has been selected
     */
    slotSelected: boolean = false;

    /**
     * Shows the loading of the appointment creation requests
     */
    loading: boolean = false;

    /**
     * Shows the loading of the appointment reschedule requests
     */
    loadingReschedule: boolean = false;

    /**
     * Shows the loading of the appointment deatils
     */
    loadingAppointmentDetails: boolean = false;

    /**
     * stores the selected appointment
     */
    selectedAppointment: any;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * Stores the form model data
     */
    model: ModelInterface;

    /**
     * Stores the date data
     */
    date: Object = moment();

    /**
     * string used to store the selected date
     */
    selectedDate: string;

    /**
     * Stores the date data
     */
    timeSlots: any;

    /**
     * Stores the selected slot
     */
    selectedSlot: SelectedSlotInteface;

    /**
     * Stores the minimum date
     */
    min: Object = moment();

    /**
     * disables fields that don't need be edited
     */
    disabledFields: Array<string> = ['schedule', 'patient', 'reason'];

    /**
     * Check if component is for adding an apppointment or editing
     */
    addingAppointment: boolean;

    /**
     * stores the appointment id
     */
    appointmentId: string;

    /**
     * string containing the button text
     */
    headerText: string = 'shared.buttons.book_appointment';

    /**
     * string containing the button text
     */
    buttonText: string = 'shared.buttons.create';

    /**
     * stores page info
     */
    pageInfo: Array<any>;

    /**
     * Contains selected queue used to start a visit
     */
    selectedQueue: object;

    /**
     * Contains selected billing class used to start a visit
     */
    selectedBillingClass: object;

    /**
     * Contains information for pagination
     */
    paginationData: object;

    /**
     * contains params used to create/edit an appointment
     */
    params: object = {};

    /** Boolean used to hide elements while the slots are loading */
    loadingSlots: boolean;

    /** Contains the information of a schedule */
    schedule: any;
    self: any;

    /**
     * Contains arrived visit
     */
    arrivedVisit: any;

    /**
     * Used to disable unavailable days in the calendar when booking an appointment
     */
    unavailableDays: any;

    /**
     * Used to determine when data is loading
     */
    notLoading: boolean;

    /**
     * Used to determine if an appointment start date is after the current time
     */
    isAfter: boolean = false;

    /**
     * Contains all queues
     */
    queues: any;

    /**
     * Contains the patient details
     */
    patientDetails: any;

    /**
     * gets the stored selected language
     */
    selectedLanguage: string = this.cookieService.getLanguageCookie();

    /**
     * gets the stored appointment start visit
     */
    appointmentStartVisit: boolean;

    /** confirm as appointment as arrived sweetalert */
    @ViewChild('confirmArrival')
    public confirmArrival!: SwalComponent;

    /** confirm booking sweetalert */
    @ViewChild('confirmBooking')
    public confirmBooking!: SwalComponent;

    /** confirmed booking sweetalert */
    @ViewChild('confirmedBooking')
    public confirmedBooking!: SwalComponent;

    /**
     * contains the organisation setting response
     */
    settings: any;

    /**
     * contains the appointment start visit setting from org settings
     */
    appointmentStartVisitSetting;

    /**
     * Imports datalayer, errorhandler and toast services
     */
    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        public shepherdService: ShepherdService,
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public transition: Transition,
        private dialogService: NbDialogService,
        public readonly swalTargets: SwalPortalTargets,
        public patientService: PatientService,
        public translate: TranslateService,
        public cookieService: Cookies,
        public analytics: AnalyticsService,
        public flagService: FeatureFlagService
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
     * submit form data and fetch sclot for the current day
     */
    displayScheduler() {
        this.displayScheduling = true;
        this.min = moment();
        this.getSchedule();
    }

    /** Used to trigger sweet alert */
    fireSwal(swal) {
        swal.fire();
    }

    /**
     * Used to trigger sweet alert for confirm arrival
     */
    updateConfirmArrivalStatus() {
        this.fireSwal(this.confirmArrival);
    }

    /**
     * Used to trigger sweet alert for confirm booking
     */
    updateConfirmBookedStatus() {
        this.fireSwal(this.confirmBooking);
    }

    /**
     * Transition booking to fulfilled
     */
    transitionToFulfilled() {
        const params = {
            appointment_status: 'FULFILLED',
        };
        this.dataLayer
            .update('appointments', this.appointmentId, params)
            .subscribe({
                next: () => {
                    const msg = 'Confirmed Arrival';
                    this.showToast(
                        'bottom-right',
                        'success',
                        msg,
                        "The patient's arrival has been recorded successfully"
                    );
                    setTimeout(() => {
                        this.$state.go('app.advantage.appointments');
                    }, 500);
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     * Transition booking to booked
     */
    transitionToBooked() {
        const params = {
            appointment_status: 'BOOKED',
        };
        this.dataLayer
            .update('appointments', this.appointmentId, params)
            .subscribe({
                next: () => {
                    this.fireSwal(this.confirmedBooking);
                    const msg = 'Booked Appointment';
                    this.showToast(
                        'bottom-right',
                        'success',
                        msg,
                        "The confirmation of the patient's booking has taken place successfully"
                    );
                    setTimeout(() => {
                        this.$state.go('app.advantage.appointments');
                    }, 500);
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     * function to confirm arrival
     */
    confirmUpdate() {
        const params = {
            appointment_status: 'ARRIVED',
        };

        this.dataLayer
            .update('appointments', this.appointmentId, params)
            .subscribe({
                next: () => this.transitionToFulfilled(),
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     * Function to get org settings
     */
    getSettings() {
        this.dataLayer.list('settings').subscribe({
            next: (responses: any) => {
                this.settings = responses;
                if (Array.isArray(this.settings)) {
                    this.handleAppointmentStartVisit();
                }
            },
            error: err => {
                this.errorHandler.handleError(err);
                this.loading = false;
            },
        });
    }

    /**
     * Handle the preferred appointment start visit setting from org setting
     */
    handleAppointmentStartVisit() {
        this.appointmentStartVisitSetting = _.findWhere(this.settings, {
            name: 'scheduling:appointment_start_visit',
        });

        this.appointmentStartVisit = this.appointmentStartVisitSetting?.value;
    }

    /**
     * gets the schedule/clinic being used to book an appointment
     */
    getSchedule() {
        this.notLoading = false;
        this.dataLayer.get('schedules', this.model['schedule']).subscribe({
            next: (response: any) => {
                this.schedule = _.clone(response);
                this.processAvailability(this.schedule.availability);
                this.getSlots(
                    moment().startOf('date').format('YYYY-MM-D'),
                    moment().toISOString()
                );
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    /**
     * processes the dates that are available on the calendar
     */
    processAvailability(availability) {
        const dateIndices = ['0', '1', '2', '3', '4', '5', '6'];
        const availableDays = _.keys(availability);
        const apiUnavailableDays = _.difference(dateIndices, availableDays);
        this.unavailableDays = [];
        apiUnavailableDays.forEach(val => {
            const value = parseInt(val, 10);
            const newVal = value === 6 ? 0 : value + 1;
            this.unavailableDays.push(newVal);
        });
        localStorage.setItem(
            'unvailableDays',
            JSON.stringify(this.unavailableDays)
        );
        this.notLoading = true;
    }

    /**
     * used to determine if the given date should be filtered out of the calendar
     * @param date
     * @returns
     */
    filterDay(date) {
        const unavailableDays = JSON.parse(
            localStorage.getItem('unvailableDays')
        );
        const jsDate = date.toDate();
        const dateIndex = jsDate.getDay();
        return !unavailableDays.includes(dateIndex);
    }

    /**
     * fetches available slots
     */
    getSlots(selectedDate, fromDate?) {
        this.selectedDate = selectedDate;
        this.loadingSlots = true;
        this.params = {
            start: selectedDate,
            fields: 'id,start,end',
            schedule_id: this.model['schedule'],
            ordering: 'start',
            status: 'FREE',
            page_size: 1000,
        };
        this.params['from_date'] = fromDate ? fromDate : undefined;
        this.params = JSON.parse(JSON.stringify(this.params));
        this.dataLayer.list('slots', this.params).subscribe({
            next: (response: any) => {
                this.loadingSlots = false;
                const pagination = _.omit(response, 'results');
                this.paginationData = pagination;
                this.timeSlots = response.results;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    /**
     * Method used to set query params and refetch the timeslots data
     */
    setTableFilter(val) {
        this.params = _.extend(this.params, val);
        this.getSlots(moment(this.date).format('YYYY-MM-D'));
    }

    /**
     * fetches the time slot based on the selected calendar day
     * @param event
     */
    handleDateChange(event) {
        this.slotSelected = false;
        this.selectedSlot = {};
        this.selectedDate = moment(event).format('YYYY-MM-D');
        const today = moment().format('YYYY-MM-D');
        if (today === this.selectedDate) {
            this.getSlots(today, moment().toISOString());
        } else {
            this.getSlots(this.selectedDate);
        }
    }

    /**
     * @param slotId
     * gets the selected slot id
     */
    selectSlot(slot) {
        this.slotSelected = true;
        this.selectedSlot = slot;
    }

    /**
     * Adds appointment when creating from scratch
     */
    addAppointment() {
        this.loading = true;
        const data = _.omit(this.model, 'schedule', 'start');
        data['slot'] = this.selectedSlot['id'];
        data['start'] = this.selectedSlot['start'];
        data['end'] = this.selectedSlot['end'];
        if (
            this.flagService.getForcedValue(
                'prov_setAppointmentsToPendingStatus'
            )
        ) {
            data['appointment_status'] = 'PENDING';
        }
        this.dataLayer.create('appointments', data).subscribe({
            next: (response: any) => {
                const msg = 'Appointment added';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Appointment has been added'
                );
                this.loading = false;
                this.analytics.logEvent('appointment_created');
                this.$state.transitionTo(
                    'app.advantage.appointments.detail',
                    {
                        appointment_id: response['id'],
                    },
                    { reload: true }
                );
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    /**
     * reschedules an appointment when appointment already exists
     */
    rescheduleAppointment() {
        this.loadingReschedule = true;
        const data = _.omit(this.model, 'schedule', 'start');
        data['slot'] = this.selectedSlot['id'];
        data['start'] = this.selectedSlot['start'];
        data['end'] = this.selectedSlot['end'];
        this.dataLayer
            .update('appointments', this.appointmentId, data)
            .subscribe({
                next: (response: any) => {
                    const msg = 'Appointment rescheduled';
                    this.showToast(
                        'bottom-right',
                        'success',
                        msg,
                        'Appointment has been rescheduled'
                    );
                    this.loadingReschedule = false;
                    this.$state.go('app.advantage.appointments', {
                        id: response['id'],
                    });
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loadingReschedule = false;
                },
            });
    }

    /**
     *  openDialog
     * @param dialog
     * opens reschedule dialog
     */
    openDialog(dialog) {
        this.dialogService.open(dialog, {});
    }

    /**
     *  getModelData
     * @param event
     * fetches model data from formly
     */
    getModelData(event) {
        const changes = this.detectModelChange(event);
        /**
         * Check to see if there are changes that have
         * taken place for either patient or schedule
         * but both schedule and patient have to
         * be defined
         */
        if (
            !this.appointmentId &&
            (!changes['schedule'] || !changes['patient']) &&
            event['schedule'] &&
            event['patient']
        ) {
            this.model = event;
            this.displayScheduler();
        } else if (event['schedule'] === null || event['patient'] === null) {
            /** Don't fetch anything for reason changes */
            this.model = event;
            this.displayScheduling = false;
        } else {
            /** Don't fetch anything for reason changes */
            this.model = event;
        }
    }

    /**
     *  detectModelChange
     * fetches model data from formly
     */
    detectModelChange(model) {
        const modelChanges = {};
        _.each(_.keys(model), currentKey => {
            modelChanges[currentKey] =
                _.has(this.model, currentKey) &&
                _.isEqual(model[currentKey], this.model[currentKey]);
        });
        return modelChanges;
    }

    /**
     * determines if the time slots should be shown
     * @returns
     * returns a boolean to show or hide timeslots
     */
    showTimeSlots() {
        if (this.model['schedule'] && this.model['patient']) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * fetches details of an existing appointment
     */
    getAppointmentDetails() {
        if (this.appointmentId) {
            this.headerText = 'Appointment Details';
            this.buttonText = 'Reschedule Appointment';
            this.loadingAppointmentDetails = true;
            this.buttonText = 'Reschedule Appointment';
            this.dataLayer.get('appointments', this.appointmentId).subscribe({
                next: (response: any) => {
                    this.patientService.setPatient(response.patient_details);
                    this.patient = this.patientService.patient;
                    this.loadingAppointmentDetails = false;
                    this.date = moment(response.start);
                    this.model = {};
                    this.model['schedule'] = response.sched_id;
                    this.model['id'] = response.id;
                    this.getSchedule();
                    this.model['patient_details'] = response.patient_details;
                    this.model['sched_description'] =
                        response.sched_description;
                    this.model['sched_specialty'] = response.sched_specialty;
                    this.model['reason'] = response.reason;
                    this.model['start'] = response.start;
                    this.model['end'] = response.end;
                    this.model['appointment_status'] =
                        response.appointment_status;
                    this.model['cancellation_reason'] =
                        response.cancellation_reason;
                    this.selectedSlot = {};
                    this.selectedSlot['id'] = response.slot;
                    this.selectedAppointment = this.model;
                    this.checkIfAfterNow();
                    this.getSlots(moment(this.date).format('YYYY-MM-D'));
                    this.getPatientArrivedVisit();
                },
                error: err => {
                    this.loadingAppointmentDetails = false;
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                },
            });
        }
    }

    /**
     * Go to patient start visit page
     */
    navigateToStartVisit() {
        this.$state.go('app.advantage.visits.start_visit', {
            id: this.patient.id,
            appointment: this.appointmentId,
        });
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.getSettings();
        this.changeBillingClass('CASH');
        this.appointmentId = this.transition.params().appointment_id;
        this.addingAppointment = this.uiglobals.$current.is(
            'app.advantage.appointments.add'
        );
        this.getAppointmentDetails();
        this.getQueues();

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }

    /** Check and see if it is after now */
    checkIfAfterNow() {
        const now = moment();
        const canEdit = this.model['appointment_status'] !== 'CANCELLED';
        const startDate = moment(this.model['start']);
        this.isAfter = canEdit && startDate.isAfter(now);
    }

    /**
     *  getPatientArrivedVisit
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

    /** patient's list walkthough function */
    startWalkthrough() {
        this.shepherdService.defaultStepOptions = defaultStepOptions;
        this.shepherdService.modal = true;
        this.shepherdService.tourName = 'add-appointment';
        this.shepherdService.confirmCancel = false;
        this.shepherdService.addSteps(defaultSteps);
        this.shepherdService.start();
    }
}

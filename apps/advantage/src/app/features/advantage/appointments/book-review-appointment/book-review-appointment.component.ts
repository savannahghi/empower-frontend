import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../../@theme/theme.module';
import { FeaturesModule } from '../../../features.module';
import { NgxTranslateModule } from '../../../../shared/translate/translate.module';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { VisitService } from '../../visits/visit.service';
import { fadeAnimation } from '../../../../shared/animations/if-animations';
import _ from 'underscore';
import { NgPipesModule } from 'ngx-pipes';
import { SkikaFormModule } from '../../../../shared/sil-form/sil-form.module';
import {
    NbSelectModule,
    NbCardModule,
    NbCalendarModule,
    NbRadioModule,
    NbDatepickerModule,
    NbListModule,
    NbButtonModule,
    NbAlertModule,
    NbSpinnerModule,
    NbToastrService,
} from '@nebular/theme';
import { SkikaLayoutModule } from '../../../../shared/sil-layout/sil-layout.module';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import moment from 'moment';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

interface ModelInterface {
    start?: any;
    end?: any;
    patient?: any;
}

interface selectedSlotInterface {
    id?: string;
}
@Component({
    selector: 'review-appointment',
    imports: [
        CommonModule,
        ThemeModule,
        SkikaFormModule,
        SkikaLayoutModule,
        FeaturesModule,
        NgPipesModule,
        NbSelectModule,
        NbButtonModule,
        NbRadioModule,
        NbDatepickerModule,
        NbCardModule,
        NbCalendarModule,
        NbListModule,
        NbAlertModule,
        NbSpinnerModule,
        NgxTranslateModule,
        SilCurrencyPipe,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    templateUrl: './book-review-appointment.component.html',
    styleUrls: ['./book-review-appointment.component.scss'],
    animations: [fadeAnimation],
})
export class BookReviewAppointmentComponent implements OnInit {
    /**
     * Contains the observable resolved from the state service
     */
    @Input() patientObservable: any;

    /**
     * Contains service request details
     */
    @Input() serviceRequest: any;

    /**
     * stores patient scheduling method
     */
    @Input() patientSchedulingMethod: any;

    /**
     * toggles book appointment form when a visit ends
     */
    @Input() showAppointmentBooking: boolean;

    /**
     * toggles appointment booking dialogue
     */
    @Input() toggleBookAppointment: () => void;

    /**
     * event emitter to close appointment review dialogue
     * */
    @Output() closeDialogue: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Contains visit information
     */
    @Input() visit: any;

    /**
     * Contains patient information
     */
    @Input() patient: any;

    /**
     * dialogue header text
     */
    @Input() headerText: string = 'shared.buttons.book_review_appointment';

    /** holds the appointment selection method text */
    appointmentMethodText = 'appointments.select_appointment_method';

    /** holds the no slots for appointment for a date text */
    noSlotsForAppointment: 'appointments.no_slots_for_appointment';

    /**
     * Used to toggle modals
     */
    toggle: Object = {};

    /**
     * Used to set the form options
     * @param formOptions
     */

    /**
     * Saves the check-in date
     */
    startDate: any;

    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * object that stores the fetched checkin schedule
     */
    checkinSchedule: any;

    /**
     * Stores the available timeslot for the queue
     */
    timeSlots: any;

    /**
     * contains params used to create add patient to queue
     */
    params: object = {};

    /**
     * stores the appointment id
     */
    appointmentId: string;

    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Used to define custom form options.
     * Required for the patient form to allow for constant updating of model
     */
    formOptions: any;

    /**
     * Stores the form model data
     */
    model: ModelInterface = {};

    /** Contains the information of a schedule */
    schedule: any;
    self: any;

    /**
     * Used to disable unavailable days in the calendar when booking an appointment
     */
    unavailableDays: any;

    /**
     * Boolean used to define if the form data has been submitted and displays the scheduler
     */
    displayScheduling: boolean = false;

    /**
     * Used to determine when data is loading
     */
    notLoading: boolean;

    /**
     * Stores the date data
     */
    date: Object = moment();

    /**
     * string used to store the selected date
     */
    selectedDate: string;

    /**
     * Boolean used to hide elements while the slots are loading
     * */
    loadingSlots: boolean;

    /**
     * Contains information for pagination
     */
    paginationData: object;

    /**
     * Stores the minumum date
     */
    min: Object = moment();

    /**
     * Boolean used to define if a slot has been selected
     */
    slotSelected: boolean = false;

    /**
     * Stores the selected slot
     */
    selectedSlot: selectedSlotInterface;

    /**
     * string containing the button text
     */
    buttonText: string = 'shared.buttons.create';

    constructor(
        public dataLayer: SilStoresService,
        public visitService: VisitService,
        protected toastrService: NbToastrService,
        private errorHandler: ErrorHandlerService,
        public analytics: AnalyticsService
    ) {}

    getFormOptions(formOptions) {
        this.formOptions = formOptions;
    }

    /**
     * closes book review appointment dialogue
     */
    closeAppointmentDialogue() {
        this.closeDialogue.emit();
    }
    /**
     * Adds CHECK-IN scheduling appointment when creating from scratch
     */
    async addCheckInBooking(event, patient) {
        this.startDate = event.visit_date;
        this.loading = true;
        await this.getCheckinSchedule();
        if (this.checkinSchedule) {
            await this.getCheckInSlots(this.startDate);
        }

        const data = {
            slot: this.timeSlots['id'],
            appointment_status: 'PENDING',
            start: this.startDate.format('YYYY-MM-D HH:mm:ss'),
            end: this.timeSlots['end'],
            patient: patient.id,
        };

        this.dataLayer.create('appointments', data).subscribe({
            next: () => {
                this.visitService.completeVisit(this, this.visit['id']);
                const msg = `Visit ended and appointment booked`;
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    `Patient's visit has been ended and a review appointment booked`
                );
                this.analytics.logEvent('check-in_created');
                this.loading = false;
            },
            error: this.handleErrorFxn,
        });
    }

    /**
     * Gets the checkin schedule
     */
    getCheckinSchedule() {
        const params = {
            actor: 'FACILITY',
            specialty: 'OTHER',
            fields: 'id,description,actor,specialty',
        };
        this.dataLayer.list('schedules', params).subscribe({
            next: this.handleSchedules,
            error: this.handleErrorFxn,
        });
    }

    handleSchedules = response => {
        if (response['results'].length > 0) {
            this.checkinSchedule = response?.['results'][0];
        } else if (response['results'].length === 0) {
            const msg = 'Error:';
            this.showToast(
                'bottom-right',
                'warning',
                msg,
                'No verifiable check-in schedule.'
            );
            this.loading = false;
        }
    };

    handleErrorFxn = (err: any) => {
        this.loading = false;
        this.errorHandler.handleError(err, this);
    };

    /**
     * fetches checkin available slot
     */
    getCheckInSlots(date) {
        this.startDate = date;
        this.params = {
            start: this.startDate.format('YYYY-MM-DD'),
            fields: 'id,start,end',
            schedule_id: this.checkinSchedule['id'],
            ordering: 'start',
            status: 'FREE',
        };
        this.params = JSON.parse(JSON.stringify(this.params));
        this.dataLayer.list('schedules', this.params).subscribe({
            next: response => {
                if (response['results'].length === 1) {
                    this.timeSlots = response['response'][0];
                }
            },
            error: this.handleErrorFxn,
        });
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = 7000;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Adds appointment when creating from scratch - APPOINTMENT SCHEDULING
     */
    addAppointmentScheduleBooking() {
        this.loading = true;
        const data = _.omit(this.model, 'schedule', 'start');
        data['slot'] = this.selectedSlot['id'];
        data['start'] = this.selectedSlot['start'];
        data['end'] = this.selectedSlot['end'];
        data['patient'] = this.model.patient;
        const newData = _.omit(data, 'id');

        this.dataLayer.create('appointments', newData).subscribe({
            next: this.handleAppointmentCreation,
            error: this.handleErrorFxn,
        });
    }

    handleAppointmentCreation = () => {
        this.visitService.completeVisit(this, this.visit['id']);
        this.closeDialogue.emit();
        const msg = `Visit ended and appointment booked`;
        this.showToast(
            'bottom-right',
            'success',
            msg,
            `Patient's visit has been ended and a review appointment booked`
        );
        this.analytics.logEvent('appointment_created');
        this.loading = false;
    };

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
        if (!this.appointmentId && changes['schedule'] && event['schedule']) {
            this.model = event;
            this.displayScheduler();
        } else if (event['schedule'] === null) {
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
                !_.isEqual(model[currentKey], this.model[currentKey]);
        });
        return modelChanges;
    }

    /**
     * submit form data and fetch sclot for the current day
     */
    displayScheduler() {
        this.displayScheduling = true;
        this.min = moment();
        this.getSchedule();
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
            error: this.handleErrorFxn,
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
     * fetches available slots for normal appointment scheduling
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
            error: this.handleErrorFxn,
        });
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
     * @param slotId
     * gets the selected slot id
     */
    selectSlot(slot) {
        this.slotSelected = true;
        this.selectedSlot = slot;
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        /**
         * sets the patient model for the appointmentService form
         */
        this.model['patient'] = this.patient.id;
        this.model['schedule'] = null;
    }
}

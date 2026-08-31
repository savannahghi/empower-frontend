import { Component, OnInit } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition } from '@uirouter/angular';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

@Component({
    selector: 'ngx-add-future-check-in',
    templateUrl: './add-future-check-in.component.html',
    styleUrls: ['./add-future-check-in.component.scss'],
    standalone: false,
})
export class AddFutureCheckInComponent implements OnInit {
    /**
     * Constructor used for the AppointmentListComponent class
     * @param dataLayer injects the data layer service
     * @param errorHandler injects the error handler service
     * @param toastrService injects the toast service
     * @param patientService - Connects to the patient service
     */
    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public $state: StateService,
        public transition: Transition,
        private translate: TranslateService,
        private cookieService: Cookies,
        public analytics: AnalyticsService
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    /**
     * gets the stored selected language
     */
    selectedLanguage: string = this.cookieService.getLanguageCookie();

    /**
     * Used to override default form configurations
     */
    formConfig: any;
    /**
     * Used to display the loader when data is being fetched
     */
    loading: boolean = false;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * Saves the check-in date
     */
    startDate: any;
    /**
     * Sets the min date to show on the calendar
     */
    min = moment();
    /**
     * Contains information about the patient
     */
    patient: any;
    /**
     * Stores the available timeslot for the queue
     */
    timeSlots: any;
    /**
     * Has an object of the fetched checkin schedule
     */
    checkinSchedule: any;
    /**
     * contains params used to create add patient to queue
     */
    params: object = {};

    /** Used to determine if the form has submitted its content */
    submitted: boolean = false;

    /**
     * saves the name of the previous state
     */
    previousState = 'app.advantage.' + this.transition.params().state;

    /**
     * Used to define custom form options.
     * Required for the patient form to allow for constant updating of model
     */
    formOptions: any;
    /**
     * showToast - Used to display a toast using the nebular toast service
     * @param position - defines the toast's position e.g. bottom-right
     * @param status - defines the status being used e.g. success, danger, info
     * @param msg - defines what the message in the toast is
     * @param context - defines what the context of the toast is
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
     * Used to set the form options
     * @param formOptions
     */
    getFormOptions(formOptions) {
        this.formOptions = formOptions;
    }

    /**
     * Go back to the previous page
     */
    back(): void {
        if (!this.transition.params().state) {
            this.previousState = 'app.advantage.' + 'checkin';
        }
        this.$state.go(this.previousState);
    }

    /**
     * Gets the checkin schedule
     */
    async getCheckinSchedule() {
        const params = {
            actor: 'FACILITY',
            specialty: 'OTHER',
            fields: 'id,description,actor,specialty',
        };
        const schedule$ = this.dataLayer.list('schedules', params);

        try {
            const response: any = await lastValueFrom(schedule$);

            if (response.results.length > 0) {
                this.checkinSchedule = response?.results[0];
            } else if (response.results.length === 0) {
                const msg = 'Error:';
                this.showToast(
                    'bottom-right',
                    'warning',
                    msg,
                    'No verifiable check-in schedule.'
                );
                this.loading = false;
            }
        } catch (err) {
            this.errorHandler.handleError(err, this);
            this.loading = false;
        }
    }

    /**
     * fetches the available slot
     */
    async getSlots(date) {
        this.startDate = date;
        this.params = {
            start: this.startDate.format('YYYY-MM-DD'),
            fields: 'id,start,end',
            schedule_id: this.checkinSchedule['id'],
            ordering: 'start',
            status: 'FREE',
        };
        this.params = JSON.parse(JSON.stringify(this.params));
        const sltos$ = this.dataLayer.list('slots', this.params);
        try {
            const response: any = await lastValueFrom(sltos$);
            if (response.results.length === 0) {
                const msg = 'Error:';
                this.showToast(
                    'bottom-right',
                    'warning',
                    msg,
                    'No available checkin slots'
                );
                this.loading = false;
            } else if (response.results.length === 1) {
                this.timeSlots = response?.results[0];
            }
        } catch (err) {
            this.errorHandler.handleError(err, this);
            this.loading = false;
        }
    }

    /**
     * Adds appointment when creating from scratch
     */

    async addAppointment(event) {
        this.startDate = event.visit_date;
        this.loading = true;
        await this.getCheckinSchedule();
        if (this.checkinSchedule) {
            await this.getSlots(this.startDate);
        }

        const data = {
            slot: this.timeSlots ? this.timeSlots['id'] : null,
            appointment_status: 'PENDING',
            start: moment(this.startDate).format('YYYY-MM-D HH:mm:ss'),
            end: this.timeSlots ? this.timeSlots['end'] : null,
            patient: event.patient,
        };

        this.dataLayer.create('appointments', data).subscribe({
            next: () => {
                const msg = 'Queue has been updated';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Patient has been added to the queue.'
                );
                this.analytics.logEvent('check-in_created');
                this.loading = false;
                this.back();
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }
}

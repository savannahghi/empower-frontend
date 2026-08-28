import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import moment from 'moment';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Transition } from '@uirouter/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { NbCalendarRange } from '@nebular/theme';
import { HttpClient, HttpParams } from '@angular/common/http';

/**
 * Component decorator used in templates
 * the selector, style url, and template
 */
@Component({
    selector: 'ngx-clinic-availability',
    templateUrl: './clinic-availability.component.html',
    styleUrls: ['./clinic-availability.component.scss'],
    standalone: false,
})
/** defines the view clinic component class */
export class ClinicAvailabilityComponent implements OnInit {
    /**
     * Shows the loading of the clinic creation
     */
    loading: boolean = false;

    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted: boolean = false;

    /**
     * Boolean used to show the modal
     */
    showModal = false;

    /**
     *   Declares a property named 'range' of type 'NbCalendarRange'
     */
    range: NbCalendarRange<Date>;

    /**
     * Stores the selected date
     */
    selectedDate: string;

    /**
     * Stores the days as a list of objects
     */
    dayList: Array<object> = [
        { day: 0, label: 'days_week.Mon' },
        { day: 1, label: 'days_week.Tue' },
        { day: 2, label: 'days_week.Wed' },
        { day: 3, label: 'days_week.Thur' },
        { day: 4, label: 'days_week.Fri' },
        { day: 5, label: 'days_week.Sat' },
        { day: 6, label: 'days_week.Sun' },
    ];

    /**
     * Stores the boolean for each day to show or hide the time peroids
     */
    selectedDay: Array<boolean> = [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
    ];

    /**
     * Stores default start time
     */
    start = moment().set({ h: 9, m: 0 });

    /**
     * Stores default end time
     */
    end = moment().set({ h: 17, m: 0 });

    /**
     * Stores the form to display
     */
    formType: string = 'unblock';

    /**
     * Stores the customized time periods for each day
     */
    availability: object = {
        0: [{ start: this.start, end: this.end }],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
    };

    /**
     * Stores the selected duration
     */
    selectedDuration: number = 10;

    /**
     * Stores the clinic id
     */
    clinicId: string;

    /**
     * string used to store the today's date
     */
    rawDate = moment();
    today = this.rawDate.format('YYYY-MM-DD');

    /**
     * String containing the button text
     */
    buttonText: string = 'clinics.create';

    /**
     * String containing the button text
     */
    headerText: string = 'clinics.add';

    /**
     * Contains selected item from the items list
     */
    selectedItem: any;

    date: any;

    startDate: string;
    endDate: string;
    fromTime: string;
    toTime: string;

    showCalender: boolean = false;

    /**
     * Get the selected language
     */
    selectedLanguage = this.cookieService.getLanguageCookie();

    endDateMin: moment.Moment;

    /**
     * constructor for the class component
     * @param dataLayer Access instance of SilStoresService
     * @param errorHandler Access instance of error handler service
     * @param toastrService Access instance of toastrService from nebular
     * @param transition Access instance of the TransitionService from uirouter
     * @param $state Access instance of the StateService from uirouter
     * @param formBuilder
     */

    constructor(
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public transition: Transition,
        public $state: StateService,
        private http: HttpClient,
        private cookieService: Cookies,
        private translate: TranslateService,
        public uiglobals: UIRouterGlobals
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }
    /**
     * fetches the time slot based on the selected calendar day
     * @param event
     */

    handleDateChange(event: any, field: string) {
        if (field === 'selectedDate') {
            this.selectedDate = moment(event).format('YYYY-MM-DD');
        } else if (field === 'startDate') {
            this.startDate = moment(event).format('YYYY-MM-DD');
        } else if (field === 'endDate') {
            this.endDate = moment(event).format('YYYY-MM-DD');
        }
    }

    isSubmitDisabled(): boolean {
        if (this.formType === 'multiple') {
            return !(this.startDate && this.endDate);
        } else if (this.formType === 'single') {
            if (!this.selectedDate) {
                return true;
            }
            if (this.fromTime || this.toTime) {
                return !(this.fromTime && this.toTime && this.selectedDate);
            }
            return false;
        } else if (this.formType === 'unblock') {
            return !(this.startDate && this.endDate);
        }
        return true;
    }

    handleSuccessfulCalendarBlock = () => {
        const blockMessage =
            this.formType === 'unblock'
                ? 'Date unblocked successfully!'
                : 'Date blocked successfully!';
        this.showToast(
            'bottom-right',
            'success',
            blockMessage,
            'Clinic Availability'
        );
        this.$state.go('app.advantage.clinics.detail');
    };

    handleErrorFxn = err => {
        this.errorHandler.handleError(err, this);
    };

    submitTimeline() {
        let params = new HttpParams();
        let blockType = '';
        if (this.formType === 'single') {
            blockType = 'block_slots';
            params = params.set('date', this.selectedDate);

            if (this.fromTime) {
                params = params.set(
                    'start_time',
                    moment(this.fromTime, 'HH:mm:ss').format('HH:mm:ss')
                );
            }
            if (this.toTime) {
                params = params.set(
                    'end_time',
                    moment(this.toTime, 'HH:mm:ss').format('HH:mm:ss')
                );
            }
        } else if (this.formType === 'multiple') {
            blockType = 'block_slots';
            params = params
                .set('date', this.startDate)
                .set('end_date', this.endDate);
        } else {
            blockType = 'unblock_slots';
            params = params
                .set('date', this.startDate)
                .set('end_date', this.endDate);
        }

        this.clinicId = this.uiglobals.params.id;

        this.dataLayer
            .listNested('block-calendar', blockType, this.clinicId, params)
            .subscribe({
                next: this.handleSuccessfulCalendarBlock,
                error: this.handleErrorFxn,
            });
    }
    toggleCalender() {
        this.showCalender = !this.showCalender;
    }
    ngOnInit(): void {
        // Set default values
        this.start = moment().set({ h: 9, m: 0 });
        this.end = moment().set({ h: 17, m: 0 });

        // Initialize availability object with default time periods
        this.availability = {
            0: [{ start: this.start.clone(), end: this.end.clone() }],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
        };

        this.selectedDay = [true, false, false, false, false, false, false];
    }
    showToast(position, status, msg, context) {
        const duration = 7000;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    showForm(type: string) {
        this.formType = type;
        this.toggleModal();
    }

    /**
     * Toggles modal
     */
    toggleModal() {
        this.showModal = !this.showModal;
    }

    /**
     * @param event: boolean
     * @param dayIndex: number
     * Toggles visibility of time periods for a day
     */
    changeTimePeriodVisibility(event: boolean, dayIndex: number) {
        this.selectedDay[dayIndex] = event;
        if (event) {
            // Add default time period if the day is opened
            this.availability[dayIndex].push({
                start: this.start.clone(),
                end: this.end.clone(),
            });
        } else {
            // Remove all time periods if the day is closed
            this.availability[dayIndex] = [];
        }
    }

    /**
     * @param dayIndex: number
     * Adds a new time period for a day
     */
    addTimePeriod(dayIndex: number) {
        const endTime = this.getLastEndTime(this.availability[dayIndex]);
        const newEndTime = moment(endTime).add(1, 'hour');
        this.availability[dayIndex].push({ start: endTime, end: newEndTime });
    }

    /**
     * @param dayIndex: number
     * @param timeIndex: number
     * Removes a time period for a day
     */
    removeTimePeriod(dayIndex: number, timeIndex: number) {
        if (timeIndex === 0 && this.availability[dayIndex].length === 1) {
            // Hide time periods if removing the only one
            this.selectedDay[dayIndex] = false;
        } else {
            // Remove the specific time period
            this.availability[dayIndex].splice(timeIndex, 1);
        }
    }

    /**
     * @param dayList: Array<object>
     * @returns moment object of the last end time
     */
    getLastEndTime(dayList: Array<object>) {
        const lastIndex = dayList.length - 1;
        const endTime = dayList[lastIndex]?.['end'];
        return moment(endTime);
    }
}

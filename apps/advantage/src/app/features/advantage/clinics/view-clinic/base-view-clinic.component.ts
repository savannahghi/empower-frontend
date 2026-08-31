import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import moment from 'moment';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Transition } from '@uirouter/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';

interface DayInterface {
    day: number;
    label: string;
}

@Component({
    selector: 'app-clinic-component-base',
    template: '',
    standalone: false,
})
/**
 * Defines the base class for clinic components, including shared logic and properties
 */
export class ViewClinicBaseComponent implements OnInit {
    /**
     * Shows the loading of the clinic creation
     */
    loading: boolean = false;

    /**
     * Shows the loading of the clinic creation
     */
    loadingClinic: boolean = false;

    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted: boolean = false;

    /**
     * Boolean used to show the modal
     */
    showModal = false;

    /**
     * Observable that loads the practitioners
     */
    practitioners$: Observable<any>;

    /**
     * Subject that checks the input search
     */
    searchInput$ = new Subject<string>();

    /**
     * Stores the days as a list of objects
     */
    dayList: Array<DayInterface> = [
        { day: 0, label: 'days_week.Mon' },
        { day: 1, label: 'days_week.Tue' },
        { day: 2, label: 'days_week.Wed' },
        { day: 3, label: 'days_week.Thur' },
        { day: 4, label: 'days_week.Fri' },
        { day: 5, label: 'days_week.Sat' },
        { day: 6, label: 'days_week.Sun' },
    ];

    /**
     * Stores the boolean for each day to show or hide the time periods
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
     * Stores the customized time periods
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
    selectedDuration: any = '10';

    /**
     * Stores the actor information of the schedule
     */
    actor: string = 'PRACTITIONER';

    /**
     * Stores the selected practitioner
     */
    selectedPractitioner: any;

    /**
     * Stores the description
     */
    description: string = '';

    /**
     * Stores the clinic ID
     */
    clinicId: string;

    /**
     * String containing the button text
     */
    buttonText: string = 'clinics.create';

    /**
     * String containing the header text
     */
    headerText: string = 'clinics.add';

    /**
     * Stores the form group
     */
    formGroup: UntypedFormGroup;

    /**
     * Stores practitioners
     */
    practitioners: any;

    /**
     * Contains selected item from the items list
     */
    selectedItem: any;

    /**
     * Search term
     */
    term: string;

    /**
     * Checks if clinic exists
     */
    clinicExists: boolean;

    /**
     * Get the selected language
     */
    selectedLanguage: string;

    /**
     * Constructor for the base clinic component class
     * @param dataLayer Access instance of SilStoresService
     * @param errorHandler Access instance of ErrorHandlerService
     * @param toastrService Access instance of NbToastrService from Nebular
     * @param transition Access instance of the TransitionService from UI-Router
     * @param $state Access instance of the StateService from UI-Router
     * @param cookieService Access instance of Cookies service
     * @param translate Access instance of TranslateService
     * @param uiglobals Access instance of UIRouterGlobals
     */
    constructor(
        protected dataLayer: SilStoresService,
        protected errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public transition: Transition,
        public $state: StateService,
        protected cookieService: Cookies,
        protected translate: TranslateService,
        public uiglobals: UIRouterGlobals
    ) {
        this.selectedLanguage = this.cookieService.getLanguageCookie();
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    /**
     * Track by index
     * @param index Index of the item
     * @returns The index
     */
    trackByIndex(index: number): number {
        return index;
    }

    /**
     * Method used to display a toast
     * @param position Position of the toast
     * @param status Status of the toast
     * @param msg Message to display
     * @param context Context of the toast
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
     * Toggles the modal visibility
     */
    toggleModal() {
        this.showModal = !this.showModal;
    }

    /**
     * Show or hide the time period if checkbox is clicked
     * @param event The checkbox event
     * @param dayIndex The index of the day
     */
    changeTimePeriodVisibility(event: boolean, dayIndex: number) {
        this.selectedDay[dayIndex] = event;
        if (event) {
            this.availability[dayIndex].push({
                start: this.start,
                end: this.end,
            });
        } else {
            this.availability[dayIndex] = [];
        }
    }

    /**
     * Adds a new time period item
     * @param dayIndex The index of the day
     */
    addTimePeriod(dayIndex: number) {
        /**
         * Refer to last item on the list and get the end time,
         * which will be used as the start time for the new time period
         */
        const endTime = this.getLastEndTime(this.availability[dayIndex]);
        const newEndTime = moment(endTime).add(1, 'hour');
        this.availability[dayIndex].push({ start: endTime, end: newEndTime });
    }

    /**
     * Removes a time period item
     * @param dayIndex The index of the day
     * @param timeIndex The index of the time period
     */
    removeTimePeriod(dayIndex: number, timeIndex: number) {
        if (timeIndex === 0 && this.availability[dayIndex].length === 1) {
            /**
             * Hide the time period
             */
            this.selectedDay[dayIndex] = false;
        } else {
            /**
             * Remove time period
             */
            this.availability[dayIndex].splice(timeIndex, 1);
        }
    }

    /**
     * Returns the end time of the last item on the list
     * @param dayList The list of time periods for a day
     * @returns The end time of the last time period
     */
    getLastEndTime(dayList: Array<object>) {
        const lastIndex = dayList.length - 1;
        const endTime = dayList[lastIndex]['end'];
        return endTime;
    }

    /**
     * Create or update clinic
     */
    createClinic() {
        const params = {};
        params['slot_duration'] = this.selectedDuration;
        for (const day of Object.keys(this.dayList)) {
            if (this.availability[day]) {
                this.availability[day].map(timePeriod => {
                    timePeriod['start'] = moment(timePeriod['start']).format(
                        'HH:mm'
                    );
                    timePeriod['end'] = moment(timePeriod['end']).format(
                        'HH:mm'
                    );
                });
            }
        }
        params['availability'] = this.availability;
        params['description'] = this.description;

        this.submitted = true;
        this.showModal = false;
        this.loading = true;
        if (this.clinicId) {
            /**
             * If clinic exists, do an update
             */
            this.dataLayer
                .update('schedules', this.clinicId, params)
                .subscribe({
                    next: () => {
                        const msg = 'Clinic updated';
                        this.showToast(
                            'bottom-right',
                            'success',
                            msg,
                            'Clinic has been updated'
                        );
                        this.loading = false;
                        this.$state.go('app.advantage.clinics');
                    },
                    error: err => {
                        this.errorHandler.handleError(err, this);
                        this.loading = false;
                    },
                });
        } else {
            /**
             * Create clinic
             */
            if (this.actor === 'PRACTITIONER') {
                params['description'] = this.selectedPractitioner?.description;
                params['specialty'] = this.selectedPractitioner?.specialty;
                params['practitioner'] = this.selectedPractitioner?.id;
            } else {
                params['description'] = this.description;
            }
            params['actor'] = this.actor;
            this.dataLayer.create('schedules', params).subscribe({
                next: () => {
                    const msg = 'Clinic created';
                    this.showToast(
                        'bottom-right',
                        'success',
                        msg,
                        'Clinic has been created'
                    );
                    this.loading = false;
                    this.$state.go('app.advantage.clinics');
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                },
            });
        }
    }

    /**
     * Modify practitioner object from the response
     * @param practitioner The practitioner object
     * @returns The modified practitioner object
     */
    modifyPractitioner(practitioner) {
        if (practitioner?.person.title) {
            practitioner.person.person_display =
                practitioner.person.title +
                ' ' +
                practitioner.person.person_display;
        }
        return {
            id: practitioner?.id,
            description: practitioner?.person.person_display,
            specialty: practitioner?.qualification,
            phone_number: practitioner?.person.phone_number,
            email: practitioner?.person.email,
        };
    }

    /**
     * Fetch clinic info if it has been created
     */
    fetchClinic() {
        if (this.clinicId) {
            this.buttonText = 'shared.buttons.update_clinic';
            this.headerText = 'shared.buttons.view_clinic';
            this.loadingClinic = true;
            this.dataLayer.get('schedules', this.clinicId).subscribe({
                next: (response: any) => {
                    this.actor = response.actor;
                    this.description = response.description;
                    if (response.practitioner_data) {
                        this.selectedPractitioner = this.modifyPractitioner(
                            response.practitioner_data
                        );
                    } else {
                        this.selectedPractitioner = response;
                    }

                    this.selectedDuration = response.slot_duration.toString();
                    const currentAvailability = response.availability;

                    for (const day of Object.keys(this.dayList)) {
                        if (currentAvailability[day]) {
                            this.selectedDay[day] = true;
                            currentAvailability[day].map(timePeriod => {
                                timePeriod['start'] = moment(
                                    timePeriod['start'],
                                    'HH:mm'
                                );
                                timePeriod['end'] = moment(
                                    timePeriod['end'],
                                    'HH:mm'
                                );
                            });
                        } else {
                            currentAvailability[day] = [];
                            this.selectedDay[day] = false;
                        }
                    }
                    this.availability = currentAvailability;
                    this.loadingClinic = false;
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loadingClinic = false;
                },
            });
        }
    }

    /**
     * Lifecycle hook that is called after data-bound properties are initialized
     */
    ngOnInit(): void {
        let id;
        if (this.uiglobals.current.data['useThisParamInstead']) {
            id =
                this.transition.params()[
                    this.uiglobals.current.data['useThisParamInstead']
                ];
            this.clinicId = id;
            this.fetchClinic();
        } else {
            id = this.transition.params().id;
            this.clinicId = id;
            this.fetchClinic();
        }
    }

    /** Validate form before creating clinic */
    validateForm() {
        if (this.actor === 'PRACTITIONER') {
            return !this.selectedPractitioner;
        } else {
            return !this.description;
        }
    }

    /**
     * Update the queue and schedule names
     */
    updateName() {
        const queueId = this.uiglobals.params.queue_id;
        this.dataLayer
            .update('queues', queueId, {
                name: `${this.selectedPractitioner.description} | ${this.selectedPractitioner.specialty}`,
            })
            .subscribe({
                next: () => {
                    const id = this.uiglobals.params.schedule_id;
                    this.dataLayer
                        .update('schedules', id, {
                            specialty: `${this.selectedPractitioner.specialty}`,
                            description: `${this.selectedPractitioner.description}`,
                        })
                        .subscribe({
                            next: () => {
                                this.$state.reload();
                            },
                        });
                },
            });
    }

    /**
     * Get the filtered practitioner response
     * @param response The practitioner response
     */
    getFilteredResponse(response) {
        this.selectedPractitioner = response;
        this.clinicExists = false;
        const params = {
            practitioner: response['id'],
        };

        return this.dataLayer.list('schedules', params).subscribe({
            next: values => {
                const data = values['results'];
                const clinicExists = data.length < 1;
                this.clinicExists = !clinicExists;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    get selectedDays() {
        return this.dayList.filter((day, index) => this.selectedDay[index]);
    }
}

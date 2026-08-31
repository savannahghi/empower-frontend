/** Imports used in the component */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbSidebarService, NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import _ from 'underscore';
import moment from 'moment';
import { LayoutService } from '../../../../@core/utils';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { LocalStateService } from '../../../../@core/utils/state.service';
import { fadeAnimation } from '../../../../shared/animations/if-animations';
import { ShepherdService } from 'angular-shepherd';
import {
    appointmentSteps as defaultSteps,
    defaultStepOptions,
} from '../../onboarding/shepherd-config';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';

/**
 * Contains the component decorator and defines
 * the selector and template url
 */
@Component({
    selector: 'sil-appointment-list',
    templateUrl: './appointment-list.component.html',
    animations: [fadeAnimation],
    standalone: false,
})

/** Constructor for the appointment component */
export class AppointmentListComponent implements OnInit, OnDestroy {
    /**
     * Shows the loading of the xhr requests
     */
    loading: boolean = false;

    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;

    /**
     * Array used to define datatable grid actions
     */
    gridActions: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Object used to define the default filter params of the datatable
     */
    filterParams: Object;

    /**
     * String used to return the filter params used in the datatable
     */
    queryArg2: string;

    /**
     * Boolean used to show the modal
     */
    showModal = false;

    /**
     * Boolean used to show the patient registration modal
     */
    showPatientRegModal = false;

    /**
     * Boolean used to show the modal for cancelling appointments in bulk
     */
    showBulkCancelModal = false;

    /**
     * Contains the schedule that will be cancelled for a day
     */
    selectedCancelClinic = false;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * Form loaded from assets to create a schedule
     */
    heading: any = 'schedule-registration';

    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted: boolean = false;

    /**
     * Boolean used to define if the patient registration form data has been submitted
     */
    submittedPatientRegistration: boolean = false;

    /**
     * Used to get a reference of siltable used in the template
     */
    statusFilters: Array<any>;

    /**
     * Has an object of all clinics
     */
    clinics: any[];

    /**
     * Has an object of the selected clinics
     */
    selectedClinic: Object;

    /**
     * Has a list of selected clinic ids for filtering
     */
    selectedClinics: Array<string> = [];

    /**
     * Contains the moment object for today
     */
    todayDate: Object;

    /**
     * Has the current date from the calendar filter
     */
    date: Object;

    /**
     * Contains the date chosen from the calender to filter the appointments
     */
    startDateFilter: string;

    /** Contains params in use from uirouter */
    stateParams: any;

    /** Contains status */
    status: any;

    /**
     * Contains the actor of the schedule
     */
    actor: string = '';

    /**
     * Used to get a reference of siltable used in the template
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Checks to see if all appointments are active
     */
    allAppointments: boolean;

    /**
     * Used to check if upcoming appointments are active
     */
    upcomingAppointments: boolean;

    /**
     * Used to check if past appointments are active
     */
    pastAppointments: boolean;
    /**
     * sets the start date if not defined
     */
    todayAppointments: boolean;

    /**
     * gets the stored selected language
     */
    selectedLanguage: string = this.cookieService.getLanguageCookie();

    /**
     * Constructor used for the AppointmentListComponent class
     * @param dataLayer injects the data layer service
     * @param errorHandler injects the error handler service
     * @param toastrService injects the toast service
     * @param sidebarService injects the sidebar service
     * @param layoutService injects the layout service
     * @param $state injects the router's state service
     * @param localStateService injects the local state service
     * @param uiglobals injects the global values from ui router
     */
    constructor(
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        private sidebarService: NbSidebarService,
        private layoutService: LayoutService,
        private $state: StateService,
        public localStateService: LocalStateService,
        private uiglobals: UIRouterGlobals,
        private shepherdService: ShepherdService,
        private translate: TranslateService,
        private cookieService: Cookies
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

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
     * Event output by the datatable with the filter params used
     */
    setFilter(event) {
        this.queryArg2 = event;
    }

    /**
     * Toggles modal and sets the heading
     */
    toggleModal() {
        this.heading = 'schedule-registration';
        this.showModal = !this.showModal;
    }

    /**
     * Toggles patient registration modal
     */
    togglePatientRegistrationModal() {
        this.heading = 'appointment-patient-registration';
        this.showPatientRegModal = !this.showPatientRegModal;
    }

    /**
     * Toggles bulk cancel appointment modal
     */
    toggleBulkCancelModal() {
        this.heading = 'bulk-cancel-appointment';
        this.showBulkCancelModal = !this.showBulkCancelModal;
    }

    /**
     * Cancels appointments for a day
     */
    bulkCancelAppointments(model) {
        this.loading = true;
        this.dataLayer
            .listNested('schedules', 'cancel_day_appts', model.schedule, model)
            .subscribe({
                next: () => {
                    this.siltable.getData();
                    this.toggleBulkCancelModal();
                    const msg = 'Appointment Cancelled';
                    this.showToast(
                        'bottom-right',
                        'success',
                        msg,
                        'Appointments have been cancelled'
                    );
                    this.loading = false;
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                },
            });
    }

    /**
     * Adds appointment
     */
    addAppointment(model) {
        this.submitted = true;
        this.showModal = false;
        this.loading = true;
        const data = _.omit(model, 'schedule', 'start');
        data['slot'] = model.slot.id;
        this.dataLayer.list('appointments', data).subscribe({
            next: () => {
                this.siltable.getData();
                const msg = 'Appointment added';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Appointment has been added'
                );
                this.loading = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    /**
     * Gets all the clinics for displaying all the clinic types
     */
    getClinics() {
        const params = {
            actor: this.actor,
            fields: 'id,description,specialty,practitioner_data',
            page_size: 1000,
            active: true,
        };
        this.dataLayer.list('schedules', params).subscribe((response: any) => {
            this.clinics = response.results;
        });
    }

    /**
     * Filters appointments by selected clinics
     */
    getCheckedClinic(event: boolean, selectedClinic: any) {
        if (event) {
            this.selectedClinics.push(selectedClinic.id);
            this.selectedClinics = _.uniq(this.selectedClinics);
        } else {
            const index = this.selectedClinics.indexOf(selectedClinic.id);
            this.selectedClinics.splice(index, 1);
            this.selectedClinics = _.uniq(this.selectedClinics);
        }
        const filterParams = {
            schedule_id: this.selectedClinics.join(),
        };
        const finalFilters = this.localStateService.getFinalFilters();
        delete finalFilters['schedule_id'];
        const params = this.siltable.determineQueryFilters(filterParams);
        delete params['start'];
        this.setActorScheduleType();
        params['schedule_actor'] = this.actor;
        const filters = _.extend(finalFilters, params);
        this.$state.transitionTo(this.uiglobals.current.name, filters, {
            reload: false,
            notify: true,
            inherit: false,
        });
    }

    /**
     *  handles the date changing from the calendar
     * @param event
     * Sends the day selected from the calender to the payload for filtering appointments
     *
     * Toggles the status filters. It only shows the filters when the day is current date(today).
     */
    handleDateChange(event) {
        this.uiglobals.params.start = undefined;
        this.startDateFilter = moment(event).format('YYYY-MM-D');

        const filterParams = {
            start: this.startDateFilter,
            ordering: 'start',
            page: 1,
        };

        const finalFilters = this.localStateService.getFinalFilters();
        const params = this.siltable.determineQueryFilters(filterParams);
        const filters = _.extend(finalFilters, params);
        this.$state.transitionTo(this.uiglobals.current.name, filters, {
            reload: false,
            notify: true,
            inherit: false,
        });

        if (
            moment(event).format('YYYY-MM-D') === moment().format('YYYY-MM-D')
        ) {
            this.statusFilters = [
                {
                    display: `Today's Upcoming`,
                    filter: {
                        from_date: moment().format('YYYY-MM-D HH:mm'),
                        start: moment().format('YYYY-MM-D'),
                        ordering: 'start',
                    },
                },
                {
                    display: `Today's Past Appointments`,
                    filter: {
                        to_date: moment().toISOString(),
                        start: moment().format('YYYY-MM-D'),
                        from_date: '',
                        ordering: 'start',
                    },
                },
                {
                    display: `All for today`,
                    filter: {
                        start: moment().format('YYYY-MM-D'),
                        from_date: '',
                        ordering: 'start',
                    },
                },
            ];
        } else {
            this.statusFilters = [];
        }
    }

    /**
     * Registers patient
     */
    submitPatient(model) {
        this.submittedPatientRegistration = true;
        this.showPatientRegModal = false;
        this.loading = true;
        this.dataLayer.create('patients', model).subscribe({
            next: () => {
                const msg = 'Patient registered';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Patient has been registered'
                );
                this.loading = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    /**
     * Navigate to the state with the given params
     */
    navigateToStateWithParams(status) {
        let stateParams;
        if (status === 'All') {
            stateParams = {
                start: moment().format('YYYY-MM-D'),
                from_date: '',
                ordering: 'start',
                date: '',
                search: '',
                page_size: '5',
                page: '1',
            };
        } else if (status === 'Past') {
            stateParams = {
                to_date: moment().toISOString(),
                ordering: '-start',
                start: '',
                from_date: '',
                page_size: '5',
                page: '1',
            };
        } else {
            stateParams = {
                to_date: '',
                ordering: 'start',
                start: '',
                from_date: moment().toISOString(),
                page_size: '5',
                page: '1',
            };
        }

        /** Add Schedule Actor */
        if (this.uiglobals.params.schedule_actor) {
            stateParams.schedule_actor = this.uiglobals.params.schedule_actor;
        }

        /** Add Status filter */
        if (this.uiglobals.params.status) {
            stateParams.status = this.uiglobals.params.status;
        }

        const params = this.siltable.determineQueryFilters(stateParams);
        this.$state.transitionTo(this.uiglobals.current.name, params, {
            reload: false,
            notify: true,
            inherit: false,
        });
    }

    /**
     * compacts the sidebar
     * @returns a boolean once the toggle has been done
     */
    compactSidebar(): boolean {
        this.sidebarService.compact('menu-sidebar');
        this.layoutService.changeLayoutSize();

        return false;
    }

    /**
     * expands the sidebar
     * @returns a boolean once the toggle has been done
     */
    expandSidebar(): boolean {
        this.sidebarService.expand('menu-sidebar');
        this.layoutService.changeLayoutSize();

        return false;
    }

    /**
     * Lifecycle hook used when component is first initialized
     */
    ngOnInit() {
        this.setActorScheduleType();
        this.getClinics();
        this.compactSidebar();
        this.uiglobals.params.ordering = 'start';
        this.uiglobals.params.present_date = moment().format('YYYY-MM-D');
        this.todayAppointments = this.uiglobals.params.present_date;
        this.stateParams = this.uiglobals.params;

        /**
         * Table header
         */
        this.tableHeader = [
            { text: 'appointments.table_header.time' },
            { text: 'appointments.table_header.date' },
            { text: 'appointments.table_header.patient' },
            { text: 'appointments.table_header.status' },
            { text: 'appointments.table_header.action' },
        ];

        /**
         * Table rows
         */
        this.rows = [
            {
                type: 'startEnd',
                nested: [
                    {
                        type: 'duration',
                    },
                ],
            },
            {
                key: 'start',
                type: 'dateUTC',
                nested: [
                    {
                        type: 'day',
                        value: 'start',
                    },
                ],
            },
            {
                path: 'patient_details.person.person_display',
                type: 'mineVal',
                nested: [
                    {
                        value: 'sched_description',
                        type: 'scheduleDescription',
                    },
                ],
            },
            {
                key: 'appointment_status',
                type: 'statusColor',
            },
        ];

        /**
         * Fields used to filter the backend api for appointments
         */
        this.filterParams = {
            start: '',
            ordering: '-start',
            page_size: '5',
            schedule_actor: '',
            fields: 'id,appointment_status,sched_description,sched_specialty,start,end,patient_details,sched_actor',
        };

        if (
            this.uiglobals.params.present_date ===
                this.uiglobals.params.start ||
            !this.uiglobals.params.start
        ) {
            /**
             * Filters used by sil-datatable-filter component
             */
            this.statusFilters = [
                {
                    display: 'appointments.data_table_filters.today',
                    filter: {
                        from_date: moment().format('YYYY-MM-D HH:mm'),
                        start: moment().format('YYYY-MM-D'),
                        ordering: 'start',
                    },
                },
                {
                    display: 'appointments.data_table_filters.today_past',
                    filter: {
                        to_date: moment().toISOString(),
                        start: moment().format('YYYY-MM-D'),
                        from_date: '',
                        ordering: 'start',
                    },
                },
                {
                    display: 'appointments.data_table_filters.all',
                    filter: {
                        start: moment().format('YYYY-MM-D'),
                        from_date: '',
                        date: '',
                        search: '',
                    },
                    active: true,
                },
            ];
        }

        /**
         * Edit Action button with quick patch action from sil.datatable
         */
        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.view',
                status: 'success',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.appointments.detail',
                    stateParams: {
                        appointment_id: 'id',
                    },
                },
            },
            {
                btnText: 'shared.buttons.cancel',
                status: 'basic',
                expression: row => {
                    if (!row) {
                        return;
                    }
                    const cancelStatus = row.appointment_status !== 'CANCELLED';
                    const now = moment();
                    const startDate = moment(row.start);
                    const isAfter = startDate.isAfter(now);
                    return (
                        cancelStatus &&
                        isAfter &&
                        row.appointment_status !== 'ARRIVED'
                    );
                },
                action: 'modal',
                modalConf: {
                    formConfig: {},
                    context: 'CANCEL APPOINTMENT',
                    store: 'cancelService',
                    isService: true,
                    action: 'quickPatch',
                    method: 'cancelAppointment',
                },
            },
        ];

        /**
         * Get the current state filters
         */
        const finalFilters = this.localStateService.getFinalFilters();
        this.processStateFilters(finalFilters);
    }

    ngOnDestroy() {
        this.expandSidebar();
    }

    /**
     * Determines the active filters for the calendar and clinics
     * @param obj contains active filters from the url
     */
    processStateFilters(obj) {
        this.todayDate = moment();
        if (obj['start']) {
            this.date = moment(obj['start']);
        } else {
            this.date = moment();
        }
        if (obj['schedule_id']) {
            const schedules = obj['schedule_id'].split(',');
            this.selectedClinics = schedules;
        }
        this.getActiveClass(obj);
    }

    /**
     * Determines what classes should be active
     * @param obj contains the active filters from the url
     */
    getActiveClass(obj) {
        // Determine if the Past filter is active
        if (obj['to_date'] && !obj['from_date']) {
            this.pastAppointments = true;
        }

        // Determine if the Upcoming filter is active
        if (obj['from_date'] && !obj['to_date']) {
            this.upcomingAppointments = true;
        }

        // Determine if the All filter is active
        if (!obj['from_date'] && !obj['to_date']) {
            this.allAppointments = true;
            obj['start']
                ? obj['start']
                : (this.uiglobals.params.start = this.todayAppointments);
        }
    }

    /**
     * Select Schedule Type and filter clinics and appointments based on it
     * @param scheduleType
     */
    selectScheduleType(scheduleType) {
        const filterParams = {
            schedule_actor: scheduleType,
        };
        const finalFilters = this.localStateService.getFinalFilters();
        delete finalFilters['schedule_id'];
        const params = this.siltable.determineQueryFilters(filterParams);
        delete params['start'];
        const filters = _.extend(finalFilters, params);
        this.$state.transitionTo(this.uiglobals.current.name, filters, {
            reload: false,
            notify: true,
            inherit: false,
        });
    }

    /** Set Actor Schedule Type */
    setActorScheduleType() {
        if (this.uiglobals.params.schedule_actor) {
            this.actor = this.uiglobals.params.schedule_actor;
        }
    }

    /** Set Appointent Status */
    setAppointmentStatusType(status) {
        this.uiglobals.params.appointment_status = status;
        this.status = this.uiglobals.params.appointment_status;
        this.$state.transitionTo(
            this.uiglobals.current.name,
            this.uiglobals.params,
            {
                reload: false,
                notify: true,
                inherit: false,
            }
        );
    }

    /** appointments's list walkthough function */
    startWalkthrough() {
        this.shepherdService.defaultStepOptions = defaultStepOptions;
        this.shepherdService.modal = true;
        this.shepherdService.tourName = 'appointments';
        this.shepherdService.confirmCancel = false;
        this.shepherdService.addSteps(defaultSteps);
        this.shepherdService.start();
    }
}

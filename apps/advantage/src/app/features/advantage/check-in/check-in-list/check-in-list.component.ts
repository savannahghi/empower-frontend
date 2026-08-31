import { Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { NbToastrService } from '@nebular/theme';
import { PatientService } from '../../patients/patient.service';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { LocalStateService } from '../../../../@core/utils/state.service';
import _ from 'underscore';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { FeatureFlagService } from 'app/@core/utils/feature.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

@Component({
    selector: 'ngx-check-in-list',
    templateUrl: './check-in-list.component.html',
    styleUrls: ['./check-in-list.component.scss'],
    providers: [PatientService],
    standalone: false,
})
export class CheckInListComponent implements OnInit {
    /**
     * Constructor used for the AppointmentListComponent class
     * @param dataLayer injects the data layer service
     * @param errorHandler injects the error handler service
     * @param toastrService injects the toast service
     * @param patientService - Connects to the patient service
     * @param authConfig - Auth config
     */
    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public $state: StateService,
        public localStateService: LocalStateService,
        public patientService: PatientService,
        public uiglobals: UIRouterGlobals,
        public translate: TranslateService,
        public flagService: FeatureFlagService,
        public cookieService: Cookies,
        public authConfig: Authorization,
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
     * Used to display the loader when data is being fetched
     */
    loading: boolean = false;

    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;

    /**
     * Has an object of the fetched checkin schedule
     */
    checkinSchedule: Object;

    /**
     * Contains information about the patient
     */
    patient: any;

    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    /**
     * Array used to define the actions of the datatable
     */
    actions: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /** used to filter datatable params */
    futureFilterParams: Object;
    /**
     * Checks to see if today appointments are active
     */
    todayAppointments: boolean = true;

    /**
     * Used to check if upcoming appointments are active
     */
    upcomingAppointments: boolean = false;

    /**
     * Used to get a reference of siltable used in the template
     */
    statusFilters: Array<any>;

    /**
     * Used to get future items reference of siltable used in the template
     */
    futureStatusFilters: Array<any>;

    /**
     * Contains the patient details
     */
    patientDetails: any;

    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * Stores the selected date
     */
    date: any;

    submitted = false;

    /**
     * Contains the date chosen from the calender to filter the appointments
     */
    startDateFilter: string;

    /**
     * string used to store the today's date
     */
    rawDate = moment();
    today = this.rawDate.format('YYYY-MM-DD');

    /**
     * contains params used to create add patient to queue
     */
    params: object = {};
    /**
     * determines if check-in should have min date
     */
    addMinDateToCalendar: any;

    /**
     * Stores the available timeslot for the queue
     */
    timeSlots: any;

    /**
     * Boolean used to show the patient registration modal
     */
    showPatientRegModal = false;

    /**
     * Boolean used to show the patient registration modal
     */
    showAddQueueModal = false;

    /** determines if component has already mounted */
    isMounted: boolean = false;
    /**
     * Contains arrived visit
     */
    visit: any;
    /**
     * Tells if arrived visit has been loaded
     */
    loadedArrivedVisit: any;

    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    /**
     * Contains selector that is used to access the datatable component
     * used in the component
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Toggles the modal
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Get details for started visits
     */
    getVisitDetails(event) {
        this.patient = event.patient_details;
        const params = {
            patient: this.patient.id,
        };
        this.dataLayer.list('visits', params).subscribe({
            next: (response: any) => {
                this.visit = response.results[0];
                this.$state.go('app.advantage.visits.detail', {
                    id: this.visit.id,
                });
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
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
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Used to define custom form options.
     * Required for the patient form to allow for constant updating of model
     */
    formOptions: any;

    /**
     * Used to set the form options
     * @param formOptions
     */
    getFormOptions(formOptions) {
        this.formOptions = formOptions;
    }

    /**
     * Gets the checkin schedule
     */
    getCheckinSchedule() {
        const params = {
            actor: 'FACILITY',
            specialty: 'OTHER',
            fields: 'id,description,actor,specialty,organisation',
        };
        const org = this.authConfig.getAdvantageOrganisation();
        if (org) {
            params['organisation'] = org.organisation_id;
        }
        this.dataLayer.list('schedules', params).subscribe((response: any) => {
            if (response.results.length === 1) {
                this.checkinSchedule = response.results[0];
                this.getSlots(this.today);
            }
            if (response.results.length === 0) {
                this.createCheckinSchedule();
            } else if (response.results.length > 1) {
                this.checkinSchedule = response.results[0];
                this.getSlots(this.today);
                this.loading = false;
            }
        });
    }

    /**
     * Automatically creates the checkin schedule if none exists yet
     */
    createCheckinSchedule() {
        const data = {
            description: 'Check-in Queue',
            actor: 'FACILITY',
            specialty: 'OTHER',
            slot_duration: 1439,
            availability: {
                '0': [{ start: '00:00', end: '23:59' }],
                '1': [{ start: '00:00', end: '23:59' }],
                '2': [{ start: '00:00', end: '23:59' }],
                '3': [{ start: '00:00', end: '23:59' }],
                '4': [{ start: '00:00', end: '23:59' }],
                '5': [{ start: '00:00', end: '23:59' }],
                '6': [{ start: '00:00', end: '23:59' }],
            },
        };
        this.dataLayer.create('schedules', data).subscribe({
            next: (response: any) => {
                this.checkinSchedule = response;
                this.getSlots(this.today);
                const msg = 'Check-in Schedule added';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Schedule has been added successfully'
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
     * fetches the available slot
     */
    getSlots(today) {
        this.today = today;
        this.params = {
            start: today,
            fields: 'id,start,end',
            schedule_id: this.checkinSchedule['id'],
            ordering: 'start',
            status: 'FREE',
        };
        this.params = JSON.parse(JSON.stringify(this.params));
        this.dataLayer.list('slots', this.params).subscribe({
            next: (response: any) => {
                this.timeSlots = response.results[0];
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    /**
     * Adds appointment when creating from scratch
     */
    addAppointment(model) {
        this.loading = true;
        if (!this.timeSlots || !this.timeSlots['id']) {
            const context = 'Failed!';
            const msg = 'Cannot check in patient';
            this.toggleModal('checkin');
            this.showToast('bottom-right', 'danger', context, msg);
            this.loading = false;

            return;
        }

        const data = {
            slot: this.timeSlots['id'],
            /** Add some seconds to ensure start time will be greater than
             * current time when saving the appointment in the backend.
             */
            start: moment().add(5, 'seconds').format('YYYY-MM-D HH:mm:ss'),
            end: this.timeSlots['end'],
            patient: model.patient,
            priority: model.priority,
        };
        this.dataLayer.create('appointments', data).subscribe({
            next: () => {
                const filter = {
                    appointment_status:
                        'BOOKED,ARRIVED,IN_PROGRESS,FULFILLED,CANCELLED',
                };
                this.siltable?.getData(filter);
                this.toggleModal('checkin');
                const msg = 'Queue has been updated';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Patient has been added to the queue successfully'
                );
                this.analytics.logEvent('check-in_created');
                this.loading = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    /**
     * sets the filter used to query for data in the datatable
     * @param event contains the params used in the datatable
     */
    setFilter(event) {
        this.queryArg = event;
    }

    /**
     * Fields used to filter the backend api for appointments
     */
    filterParams = {
        start: this.today,
        ordering: 'start',
        page_size: '10',
        schedule_actor: 'FACILITY',
        fields: 'id,appointment_status,sched_description,start,patient_details,created,priority',
    };

    setDefaultFilterStatus() {
        if (
            this.uiglobals.params.appointment_status === undefined &&
            this.uiglobals.params.ordering === undefined &&
            this.uiglobals.params.page === undefined &&
            this.isMounted === false
        ) {
            this.$state.transitionTo(`app.advantage.checkin`, {
                appointment_status:
                    'BOOKED,ARRIVED,IN_PROGRESS,FULFILLED,CANCELLED',
                ordering: 'start',
                page: '1',
                start: this.today,
            });
            this.isMounted = true;
        } else if (
            this.uiglobals.params.page !== undefined &&
            this.uiglobals.params.ordering !== undefined &&
            this.uiglobals.params.appointment_status !== undefined &&
            this.isMounted
        ) {
            this.$state.transitionTo(`app.advantage.checkin`, {
                status: this.uiglobals.params.appointment_status,
                ordering: this.uiglobals.params.ordering,
                page: this.uiglobals.params.page,
            });
        }
    }

    /**
     *  handles the date changing from the calendar
     * @param event
     * Sends the day selected from the calender to the payload for filtering appointments
     *
     * Toggles the status filters. It only shows the filters when the day is current date(today).
     */
    handleDateChange(event) {
        this.startDateFilter = moment(event).format('YYYY-MM-DD');

        const filterParams = {
            start: this.startDateFilter,
            ordering: 'start',
            page_size: '10',
            schedule_actor: 'FACILITY',
            appointment_status: '',
            fields: 'id,appointment_status,sched_description,start,patient_details,created,priority',
        };
        if (this.startDateFilter === this.today) {
            filterParams.appointment_status =
                'BOOKED,ARRIVED,IN_PROGRESS,FULFILLED,CANCELLED';
        } else {
            filterParams.appointment_status = 'PENDING';
        }
        const finalFilters = this.localStateService.getFinalFilters();
        const params = this.siltable?.determineQueryFilters(filterParams);
        const filters = _.extend(finalFilters, params);
        this.$state.transitionTo(this.uiglobals.current.name, filters, {
            reload: false,
            notify: true,
            inherit: false,
        });
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.getCheckinSchedule();
        this.setDefaultFilterStatus();

        const selectedDate = this.uiglobals.params.start;
        this.date = moment(selectedDate);

        /**
         * Set the table header data
         */
        this.tableHeader = [
            { text: 'checkin.table_header.name' },
            { text: 'checkin.table_header.added_at' },
            { text: 'checkin.table_header.phone_no' },
            { text: 'checkin.table_header.action' },
        ];

        /**
         * Set the table's rows
         */
        this.rows = [
            {
                path: 'patient_details.person.person_display',
                type: 'mineVal',
                nested: [
                    {
                        key: 'priority',
                        type: 'statusColor',
                    },
                ],
            },
            {
                nested: [
                    {
                        value: 'start',
                        type: 'date',
                    },
                    { value: 'start', type: 'time' },
                ],
            },
            {
                path: 'patient_details.person.phone_number',
                type: 'phoneNumber',
            },
        ];

        /**
         * Filters used by sil-datatable-filter component
         */
        this.statusFilters = [
            {
                display: 'checkin.data_table_filters.all',
                filter: {
                    status: 'clear',
                    search: '',
                },
            },
            {
                display: 'checkin.data_table_filters.booked',
                filter: {
                    appointment_status: 'BOOKED',
                },
            },
            {
                display: 'checkin.data_table_filters.arrived',
                filter: {
                    appointment_status:
                        'ARRIVED,IN_PROGRESS,FULFILLED,CANCELLED',
                },
            },
            {
                display: 'checkin.data_table_filters.pending',
                filter: {
                    appointment_status: 'PENDING',
                },
            },
        ];

        /**
         * Set the actions used for each row in the checkin list table
         * */
        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.start_visit',
                status: 'success',
                action: 'stateGo',
                expression: row => {
                    this.patientService.checkIfPatientIsComplete(
                        row.patient_details
                    );
                    return (
                        row.appointment_status === 'BOOKED' &&
                        row.patient_details.isComplete
                    );
                },
                modalConf: {
                    state: 'app.advantage.visits.start_visit',
                    stateParams: {
                        id: 'patient_details.id',
                        appointment: 'id',
                    },
                },
            },
            {
                btnText: 'shared.buttons.complete_registration',
                status: 'warning',
                action: 'modal',
                expression: row => {
                    this.patientService.checkIfPatientIsComplete(
                        row.patient_details
                    );
                    return (
                        row.appointment_status === 'BOOKED' &&
                        !row.patient_details.isComplete
                    );
                },
                modalConf: {
                    context: 'Complete Patient Registration',
                    formConfig: {
                        checkExpressionOn: 'changeDetectionCheck',
                    },
                    store: 'patientRegisterService',
                    isService: true,
                    sortData: true,
                    action: 'quickPatch',
                    method: 'patchPatient',
                },
            },
            {
                btnText: 'shared.buttons.view_visit',
                status: 'primary',
                action: 'custom',
                expression: row => {
                    return (
                        row.appointment_status === 'ARRIVED' ||
                        row.appointment_status === 'CANCELLED' ||
                        row.appointment_status === 'IN_PROGRESS' ||
                        row.appointment_status === 'FULFILLED'
                    );
                },
                modalConf: {
                    customFxn: true,
                    Fxn: 'getVisitDetails',
                },
            },
            {
                btnText: 'shared.buttons.add',
                status: 'primary',
                action: 'quickPatch',
                expression: row => {
                    const start = moment(row.start).format('DD MM YYYY');
                    const today = moment().format('DD MM YYYY');
                    return (
                        row.appointment_status === 'PENDING' && start === today
                    );
                },
                confirm: {
                    title: 'Confirm Patient Arrival',
                    text: 'Add patient to the check in queue?',
                    showCancelButton: true,
                    cancelButtonColor: '#edf1f7',
                    confirmButtonText: 'Add',
                },
                modalConf: {
                    method: 'patchCheckinAppointment',
                },
            },
            {
                btnText: 'shared.buttons.view_patient',
                status: 'primary',
                action: 'stateGo',
                expression: row => {
                    const start = moment(row.start).format('DD MM YYYY');
                    const today = moment().format('DD MM YYYY');
                    return (
                        row.appointment_status === 'PENDING' && start !== today
                    );
                },
                modalConf: {
                    state: 'app.advantage.patients.detail.timeline',
                    stateParams: {
                        id: 'patient_details.id',
                    },
                },
            },
        ];

        this.loadFlag();

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }

    loadFlag() {
        setTimeout(() => {
            if (this.flagService.getForcedValue('prov_openCheckInCalendar')) {
                this.addMinDateToCalendar = undefined;
            } else {
                this.addMinDateToCalendar = this.rawDate;
            }
        }, 1000);
    }
}

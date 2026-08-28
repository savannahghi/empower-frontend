import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import _ from 'underscore';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { VisitService } from '../../visits/visit.service';
import { ShepherdService } from 'angular-shepherd';
import {
    queueListSteps as defaultSteps,
    defaultStepOptions,
} from '../../onboarding/shepherd-config';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - style: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'sil-queue-list',
    templateUrl: './queue-list.component.html',
    styleUrls: ['./queue-list.component.scss'],
    standalone: false,
})

/**
 * Class that defines clinic list controls, methods and lifecycle hooks
 */
export class QueueListComponent implements OnInit {
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
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted: boolean = false;

    /** Contains the queue information */
    queues: any;

    /** Contains selected visits information */
    activeVisits: Array<any> = [];

    /** Contains the all visit information */
    allVisits: Array<any> = [];

    /** patient in progress details */
    patientInProgress: any;

    /** saves workstation */
    workstation: any;

    /**
     * Contains current workstation type
     */
    currentWorkstationType: any;

    /** contains workstation name */
    workstationName: any;
    /**
     * Used to get a reference of siltable used in the template
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;
    /** Contains params in use from uirouter */
    stateParams: any;

    /**
     * Used to get a reference of siltable used in the template
     */
    statusFilters: Array<any>;

    /**
     * Fetches the selected language from cookie storage
     */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /**
     * Constructor for the settings class component
     * @param dataLayer injects instance of the datalayer service
     * @param errorHandler injects instance of errorhandler service
     * @param toastrService injects instance of nebular toast service
     * @param stateService injects instance of state service
     * @param UIRouterGlobals injects instance of uiglobal service
     */
    constructor(
        private datalayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        public authService: Authorization,
        public visitService: VisitService,
        private shepherdService: ShepherdService,
        private cookieService: Cookies,
        private translate: TranslateService
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
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
     * Event output by the datatable with the filter params used
     */
    setFilter(event) {
        this.queryArg2 = event;
    }

    /**
     * Toggles modal
     */
    toggleModal() {
        this.showModal = !this.showModal;
    }

    /**
     *  get queues
     */
    fetchQueues() {
        this.visitService.queuesDataEmitter.subscribe((queues: any) => {
            this.queues = queues;
        });
    }

    /** filters the queue to display visits for */
    filterVisitsByQueue(queue) {
        const selectedQueue = _.findWhere(this.queues, { id: queue.id });
        this.$state.go('app.advantage.queues', {
            queue: selectedQueue.id,
            status: 'WAITING',
            ordering: 'created',
        });
        const stateName = this.uiglobals.current.name;
        const params = {
            queue: selectedQueue.id,
            status: 'WAITING',
            ordering: 'created',
        };
        const obj = {
            stateName: stateName,
            params: params,
        };
        this.visitService.setCurrentDoctorFilteredQueue(obj);
        this.getInProgressQueueDetails();
    }

    /** displays all visits from all queues */
    getAllServiceRequests() {
        this.$state.transitionTo('app.advantage.queues', undefined, {
            notify: true,
            inherit: false,
        });
    }

    getInProgressQueueDetails() {
        if (this.uiglobals.params.queue) {
            const params = {
                status: 'IN_PROGRESS',
                queue: this.uiglobals.params.queue,
            };
            this.datalayer.list('service-requests', params).subscribe({
                next: (response: any) => {
                    this.patientInProgress = response.results;
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
        }
    }

    viewPatientInProgress() {
        let state = 'billing';
        if (this.workstation.workstation__name.includes('Consultation')) {
            state = 'clinical';
        }
        this.$state.transitionTo(
            `app.advantage.queues.detail.${state}`,
            {
                id: this.patientInProgress[0].visit,
                service_request: this.patientInProgress[0].id,
            },
            { reload: true }
        );
    }

    /** Automatically redirects to worklist for workstations that are not front desk */
    redirectToQueueWorklist() {
        this.currentWorkstationType =
            this.authService.getWorkstation().workstation__workstation_type;
        const exemptedWorkstations = ['front_desk'];
        if (!exemptedWorkstations.includes(this.currentWorkstationType)) {
            this.$state.go('app.advantage.queues.worklist');
        }
    }

    /**
     * Lifecycle hook used when component is first initialized
     */
    ngOnInit() {
        /** Redirect user to queue worklist */
        this.redirectToQueueWorklist();

        /** get current workstation */
        this.workstation = this.authService.getWorkstation();

        /** Get the list of queues */
        this.fetchQueues();
        this.visitService.fetchQueues();

        this.stateParams = this.uiglobals.params;

        this.getInProgressQueueDetails();

        /**
         * Table header
         */
        this.tableHeader = [
            { text: 'queues.table_header.time' },
            { text: 'queues.table_header.name' },
            { text: 'queues.table_header.previous' },
            { text: 'queues.table_header.status' },
            { text: 'queues.table_header.action' },
        ];

        /**
         * Table rows
         */
        this.rows = [
            {
                nested: [
                    {
                        value: 'created',
                        type: 'timeDate',
                        class: 'fs-12',
                    },
                    {
                        value: 'created',
                        type: 'waitingTime',
                    },
                ],
            },
            {
                key: 'patient_name',
                type: 'string',
            },
            {
                nested: [
                    {
                        value: 'previous_point',
                        type: 'splitQueueName',
                    },
                ],
            },
            {
                key: 'status',
                type: 'statusColor',
                nested: [
                    {
                        value: 'queue_name',
                        type: 'splitQueueName',
                    },
                ],
            },
        ];

        /**
         * Fields called from the backend
         */
        this.filterParams = {
            fields: 'created,id,status,previous_point,patient_name,queue_name,visit',
            ordering: '-created',
            page_size: '10',
        };

        /**
         * Filters used by sil-datatable-filter component
         */
        this.statusFilters = [
            {
                display: 'queues.filters.waiting',
                filter: {
                    status: 'WAITING',
                    ordering: 'created',
                },
            },
            {
                display: 'queues.filters.in_progress',
                filter: {
                    status: 'IN_PROGRESS',
                    ordering: 'created',
                },
            },
            {
                display: 'queues.filters.completed',
                filter: {
                    status: 'COMPLETED',
                    ordering: '-created',
                },
            },
            {
                display: 'queues.filters.all',
                filter: {
                    status: 'clear',
                    ordering: '-created',
                },
            },
        ];

        /**
         * Edit Action button with quick patch action from sil.datatable
         */
        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.view_service',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.queues.detail',
                    stateParams: {
                        id: 'visit',
                        service_request: 'id',
                    },
                },
            },
            {
                btnText: 'shared.buttons.view_visit',
                status: 'primary',
                appearance: 'outline',
                hidden: this.workstation.workstation__name === 'Consultation',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.visits.detail',
                    stateParams: {
                        id: 'visit',
                    },
                },
            },
            {
                btnText: 'shared.buttons.serve',
                status: 'success',
                appearance: 'ghost',
                expression: (row?: any) => {
                    if (row) {
                        return row?.status === 'WAITING';
                    }
                },
                action: 'quickPatch',
                confirm: {
                    title: 'Serve patient',
                    text: 'Are you sure you want to serve patient?',
                    showCancelButton: true,
                    cancelButtonColor: '#edf1f7',
                    confirmButtonText: 'Serve',
                },
                modalConf: {
                    method: 'addToQueue',
                },
            },
            {
                btnText: 'shared.buttons.add',
                status: 'primary',
                expression: (row?: any) => {
                    if (row) {
                        return row?.status === 'PENDING';
                    }
                },
                action: 'modal',
                modalConf: {
                    formConfig: {},
                    btnText: 'Add To Queue',
                    context: 'Confirm Add Patient to Queue',
                    store: 'service-requests',
                    action: 'quickPatch',
                    method: 'addToQueue',
                },
            },
        ];
    }

    /** queue list walkthough function */
    startWalkthrough() {
        this.shepherdService.defaultStepOptions = defaultStepOptions;
        this.shepherdService.modal = true;
        this.shepherdService.tourName = 'queue-list';
        this.shepherdService.confirmCancel = false;
        this.shepherdService.addSteps(defaultSteps);
        this.shepherdService.start();
    }
}

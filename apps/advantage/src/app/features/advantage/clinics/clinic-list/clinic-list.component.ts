import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ShepherdService } from 'angular-shepherd';
import {
    clinicListSteps as defaultSteps,
    defaultStepOptions,
} from '../../onboarding/shepherd-config';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from 'app/@core/auth/services/authorization.service';

/**
 * Component selector and template url
 */
@Component({
    selector: 'sil-clinic-list',
    templateUrl: './clinic-list.component.html',
    standalone: false,
})

/**
 * Class that defines clinic list controls, methods and lifecycle hooks
 */
export class ClinicListComponent implements OnInit {
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
     * Used to get a reference of siltable used in the template
     */
    statusFilters: Array<any>;
    /**
     * Boolean used to show the modal
     */
    showModal = false;
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
     * Selected Language
     */
    selectedLanguage = this.cookieService.getLanguageCookie();
    /**
     * Used to get a reference of siltable used in the template
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;
    /**
     * Imports datalayer, errorhandler and toast services
     */
    constructor(
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        private shepherdService: ShepherdService,
        private translate: TranslateService,
        public uiglobals: UIRouterGlobals,
        public state: StateService,
        private cookieService: Cookies,
        private authorizationService: Authorization
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
     * Setup default filter and branch_id
     */
    setDefaultFilter() {
        const workstation = this.authorizationService.getWorkstation();
        const branchId = workstation?.workstation__org_unit__parent || '';
        this.filterParams = {
            fields: 'id,availability,description,specialty,slot_duration,practitioner,practitioner_data',
            branch_id: branchId,
        };
        if (!this.uiglobals.params.actor && !this.uiglobals.params.nullstate) {
            this.state.go(
                this.uiglobals.current.name,
                { actor: 'PRACTITIONER', page: 1, branch_id: branchId },
                { notify: true }
            );
        }
    }

    /**
     * Toggles modal
     */
    toggleModal() {
        this.heading = 'schedule-registration';
        this.showModal = !this.showModal;
    }

    /**
     * Adds schedule
     */
    addSchedule(model) {
        this.submitted = true;
        this.showModal = false;
        this.loading = true;
        this.dataLayer.list('schedules', model).subscribe({
            next: () => {
                this.siltable.getData();
                const msg = 'Schedule added';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Schedule has been added'
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
     * Lifecycle hook used when component is first initialized
     */
    ngOnInit() {
        /**
         * Table header
         */
        this.tableHeader = [
            { text: 'clinics.table_header.clinic' },
            { text: 'clinics.table_header.time' },
            { text: 'clinics.table_header.available' },
            { text: 'clinics.table_header.action' },
        ];

        /**
         * Table rows
         */
        this.rows = [
            {
                nested: [
                    {
                        value: 'description',
                        path1: 'practitioner_data.person.title',
                        path2: 'practitioner_data.person.person_display',
                        type: 'combinedNestedVal',
                    },
                    {
                        value: 'specialty',
                        path: 'practitioner_data.qualification',
                        type: 'nestedValTag',
                    },
                ],
            },
            {
                key: 'slot_duration',
                type: 'duration',
            },
            {
                key: 'availability',
                type: 'availableDays',
            },
        ];

        /**
         * Fields called from the backend
         */
        this.filterParams = {
            fields: 'id,availability,description,specialty,slot_duration,practitioner,practitioner_data,branch_id',
        };

        /**
         * Filters used by sil-datatable-filter component
         */
        this.statusFilters = [
            {
                display: `clinics.schedule_types.practitioner`,
                filter: {
                    actor: 'PRACTITIONER',
                },
            },
            {
                display: `clinics.schedule_types.healthcare_service`,
                filter: {
                    actor: 'HEALTHCARE_SERVICE',
                },
            },
            {
                display: `clinics.schedule_types.facility`,
                filter: {
                    actor: 'FACILITY',
                },
            },
            {
                display: `clinics.schedule_types.navigator`,
                filter: {
                    actor: 'NAVIGATOR',
                },
            },
            {
                display: `clinics.schedule_types.all`,
                filter: {
                    actor: '',
                    nullstate: true,
                },
            },
        ];

        /**
         * Edit Action button with quick patch action from sil.datatable
         */
        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.clinics.detail',
                },
            },
        ];

        // Process to set default filter
        this.setDefaultFilter();
    }

    /** clinic list walkthough function */
    startWalkthrough() {
        this.shepherdService.defaultStepOptions = defaultStepOptions;
        this.shepherdService.modal = true;
        this.shepherdService.tourName = 'clinic-list';
        this.shepherdService.confirmCancel = false;
        this.shepherdService.addSteps(defaultSteps);
        this.shepherdService.start();
    }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';

import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { ShepherdService } from 'angular-shepherd';
import {
    visitsListSteps as defaultSteps,
    defaultStepOptions,
} from '../../onboarding/shepherd-config';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { environment } from 'environments/environment';
import { PatientService } from '../../patients/patient.service';
import { VisitTypeModel } from '../../models';
import { AnalyticsService } from 'app/@core/utils';

@Component({
    selector: 'sil-visit-list',
    templateUrl: './visit-list.component.html',
    standalone: false,
})
export class VisitListComponent implements OnInit {
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
     * Used to override default form configurations
     */
    formConfig: any;

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

    disableSubmit: false;

    /**
     * Used to get a reference of siltable used in the template
     */
    statusFilters: Array<any>;

    showModal = false;

    /**
     * contains app variant information
     */
    variant: string;

    /**
     * Stores the patient model data
     */
    patientData: any;

    /**
     * Stores the patient details
     */
    patient: any;

    /**
     * stores the state of patient data to update the form
     */
    updated: boolean = true;

    /**
     * stores the form data
     */
    formData: any;

    /**
     * Stores the instance of the existing patient
     */
    existingPatient: any;

    /**
     * Contains selected queue used to start a visit
     */
    selectedQueue: Object;

    /**
     * Contains selected billing class used to start a visit
     */
    selectedBillingClass: string = 'OTC';

    /**
     * Contains selected visit type
     */
    selectedVisitType?: VisitTypeModel = {
        value: 'AMB',
    };

    /**
     * saves the start date of a visit
     */
    startDate: string;

    /**
     * Used to differenttoggle modals
     * information in the table
     */
    toggle: Object = {};

    /**
     * Used to show drawer
     */
    showDrawer: boolean = false;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    showFetchModal: boolean = false;
    heading: any = 'patientRegisterService';

    /**
     * fetches the stored language
     */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted: boolean = false;

    /**
     * Stores the sales type
     */
    salesType = 'OTC';

    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    constructor(
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        private shepherdService: ShepherdService,
        private cookieService: Cookies,
        private translate: TranslateService,
        public patientService: PatientService,
        public analytics: AnalyticsService
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
        this.variant = environment.variant;
    }

    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    setFilter(event) {
        this.queryArg2 = event;
    }

    toggleDrawer() {
        this.showDrawer = !this.showDrawer;
    }

    submitPatient(model) {
        this.submitted = true;
        this.loading = true;
        // Update date to YYYY-MM-DD format before saving
        if (model.person.date_of_birth) {
            model.person.date_of_birth = moment(
                model.person.date_of_birth
            ).format('YYYY-MM-DD');
        }
        model.person.person_contacts = [];
        model.person.person_ids = [];
        if (model.person.phone_number) {
            if (model.person.phone_number.startsWith('+254')) {
                model.person.phone_number = model.person.phone_number;
            } else {
                model.person.phone_number = '+254' + model.person.phone_number;
            }
            model.person.person_contacts.push({
                contact_type: 'phone_number',
                contact: model.person.phone_number,
                is_primary_contact: false,
            });
        }
        if (model.person.email) {
            model.person.person_contacts.push({
                contact_type: 'email',
                contact: model.person.email,
                is_primary_contact: false,
            });
        }
        if (model.person.id_value) {
            model.person.person_ids.push({
                id_value: model.person.id_value,
                id_document_type: model.person.id_document_type,
            });
        }
        model.person.person_photos = [];

        this.dataLayer.create('visits', model).subscribe({
            next: () => {
                this.siltable?.getData();
                this.showModal = false;
                const msg = 'Visit started';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Visit has been started'
                );
                this.loading = false;
                this.analytics.logEvent('visit_created');
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Register patient on the fly
     */
    addPatient(model) {
        this.patientData = model;
        this.patientData.person.person_ids = [];
        this.patientData.person.person_photos = [];
        this.loading = true;
        this.toggleModal('addPatient');
        this.patientService.createPatient(
            this.patientData,
            this,
            this.salesType
        );
    }

    /**
     * Confirm patient already exists
     * - Close the modal and proceed to bill
     */
    confirmPatientExists() {
        this.toggleModal('patientExists');
        this.formData = { patient: this.patient };
        // reload the skika-form component
        this.updated = false;
        setTimeout(() => (this.updated = true), 0);
    }

    /**
     * Start a visit with the patient details
     */
    startOTCVisit(
        formData,
        appointment?,
        guarantorId?,
        selectedGuarantorType?,
        patientCover?
    ) {
        this.patient = formData?.patient;
        this.selectedQueue = formData?.queue;
        const today = moment.now();
        this.startDate = moment(today).format('YYYY-MM-D HH:mm:ss');
        this.loading = true;
        this.patientService.startVisit(
            this,
            this.patient,
            appointment,
            this.selectedQueue,
            this.selectedBillingClass,
            this.startDate,
            guarantorId,
            selectedGuarantorType,
            patientCover,
            this.selectedVisitType?.value,
            this.salesType
        );
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        // Table header
        this.tableHeader = [
            { text: 'visits.table_header.time' },
            { text: 'visits.table_header.date' },
            { text: 'visits.table_header.name' },
            { text: 'visits.table_header.billing' },
            { text: 'visits.table_header.status' },
            { text: 'visits.table_header.action' },
        ];

        // Table rows
        this.rows = [
            {
                nested: [
                    {
                        label: 'Start',
                        value: 'start',
                        type: 'time',
                    },
                    {
                        label: 'End',
                        value: 'end',
                        type: 'time',
                    },
                ],
            },
            {
                key: 'start',
                type: 'date',
            },
            {
                key: 'patient_name',
                type: 'string',
                nested: [
                    {
                        label: 'Phone',
                        value: 'phone_number',
                        type: 'string',
                    },
                ],
            },
            {
                key: 'billing_class',
                type: 'statusColor',
            },
            {
                key: 'status',
                type: 'statusColor',
            },
        ];

        // Fields called from the backend
        this.filterParams = {
            fields: 'id,start,patient_name,status,end,billing_class,phone_number',
            page_size: '10',
        };

        /**
         * Filters used by sil-datatable-filter component
         */
        this.statusFilters = [
            {
                display: `visits.filters.arrived`,
                filter: {
                    status: 'ARRIVED',
                    billing_class: 'CASH,CREDIT',
                    ordering: 'start',
                    page: '1',
                },
            },
            {
                display: `visits.filters.in_progress`,
                filter: {
                    status: 'IN_PROGRESS',
                    billing_class: 'CASH,CREDIT',
                    ordering: 'start',
                    page: '1',
                },
            },
            {
                display: `visits.filters.cancel`,
                filter: {
                    status: 'CANCELLED',
                    billing_class: 'CASH,CREDIT',
                    ordering: 'start',
                    page: '1',
                },
            },
            {
                display: `visits.filters.finished`,
                filter: {
                    status: 'FINISHED',
                    billing_class: 'CASH,CREDIT',
                    ordering: 'start',
                    page: '1',
                },
            },
            {
                display: `visits.filters.otc`,
                filter: {
                    billing_class: 'OTC',
                    ordering: 'start',
                    page: '1',
                },
            },
            {
                display: `visits.filters.all`,
                filter: {
                    status: 'clear',
                    billing_class: 'CASH,CREDIT,OTC',
                    ordering: '',
                    page: '1',
                },
            },
        ];

        // Edit Action button with quick patch action from sil.datatable
        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.visits.detail',
                },
            },
        ];

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressinOn: 'changeDetectionCheck',
        };
    }

    /** visit list walkthough function */
    startWalkthrough() {
        this.shepherdService.defaultStepOptions = defaultStepOptions;
        this.shepherdService.modal = true;
        this.shepherdService.tourName = 'visit-list';
        this.shepherdService.confirmCancel = false;
        this.shepherdService.addSteps(defaultSteps);
        this.shepherdService.start();
    }
}

/** Imports used in the component */
import { Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { ShepherdService } from 'angular-shepherd';
import {
    patientsListSteps as defaultSteps,
    defaultStepOptions,
} from '../../onboarding/shepherd-config';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { environment } from '../../../../../environments/environment';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'sil-patient-list',
    templateUrl: './patient-list.component.html',
    standalone: false,
})

/**
 * PatientList component class
 * Implements OnInit when intializing the class
 */
export class PatientListComponent implements OnInit {
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
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    /**
     * Contains information about the patient
     */
    patient: any;

    /**
     * Used to determine if detail view or patient list
     */
    detailView: boolean;

    /**
     * Array used to define the actions of the datatable
     */
    actions: Array<any>;

    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * Defines the default params used to filter
     * information in the table
     */

    /**
     * sets the filter used to query for data in the datatable
     * @param event contains the params used in the datatable
     */
    setFilter(event) {
        this.queryArg = event;
    }

    /** used to filter datatable params */
    filterParams: Object;
    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Used to disable the submit button
     */
    disableSubmit: false;

    /**
     * Contains the patient details
     */
    patientDetails: any;

    /**
     * Used to display a modal
     */
    showModal = false;

    /**
     * Used to determine duration of the toast time
     */
    toastTime = 7000;

    /**
     * Time used to show the error toast
     */
    toastErrorTime = 10000;

    /**
     * Used to show the fetch modal
     */
    showFetchModal: boolean = false;

    /**
     * Used to determine the service used in the form
     */
    heading: any = 'patientRegisterService';

    /**
     * Used to determine if the content of a form has been submitted
     */
    submitted: boolean = false;

    /**
     * gets the stored selected language
     */
    selectedLanguage: string = this.cookieService.getLanguageCookie();

    /**
     * Contains selector that is used to access the datatable component
     * used in the component
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Used to define custom form options.
     * Required for the patient form to allow for constant updating of model
     */
    formOptions: any;

    /**
     * Constructor for the class component
     * @param dataLayer used to access the data layer service
     * @param errorHandler used to access the error handler service
     * @param toastrService used to access the toast service
     */
    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        public shepherdService: ShepherdService,
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public translate: TranslateService,
        public cookieService: Cookies
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
     * showErrorToast - Used to display an error toast
     * @param position - defines the toast's position e.g. bottom-right
     * @param status - defines the status being used e.g. success, danger, info
     * @param context - defines what the title of the toast is
     * @param msg - defines what the message in the toast is
     */
    showErrorToast(position, status, msg, context) {
        const duration = this.toastErrorTime;
        this.toastrService.show(`${context} failed`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Used to toggle the modal
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Go to patient start visit page
     */
    navigateToStartVisit() {
        if (this.uiglobals.params.id) {
            const patientId = this.uiglobals.params.id;
            this.$state.go('app.advantage.visits.start_visit', {
                id: patientId,
            });
        }
    }

    /**
     * Used to submit the patient information
     * @param model - used to submit patient information
     */
    submitPatient(model) {
        const patientData = Object.assign({}, model);
        this.submitted = true;
        this.loading = true;
        // Update date to YYYY-MM-DD format before saving
        if (patientData.person.date_of_birth) {
            patientData.person.date_of_birth = moment(
                patientData.person.date_of_birth
            ).format('YYYY-MM-DD');
        }
        patientData.person.person_ids = [];
        if (patientData.person.person_contacts) {
            patientData.person.person_contacts.forEach(contact => {
                if (contact.contact_type === 'phone_number') {
                    if (contact.contact.startsWith('+254')) {
                        contact.contact = contact.contact;
                    } else if (/^\d+$/.test(contact.contact)) {
                        contact.contact = '+254' + contact.contact;
                    }
                }
            });
        }
        if (patientData.person.id_value) {
            patientData.person.person_ids.push({
                id_value: patientData.person.id_value,
                id_document_type: patientData.person.id_document_type,
            });
        }
        patientData.person.person_photos = [];
        this.detailView =
            this.uiglobals.current.name !== 'app.advantage.patients';
        let subscription;
        if (this.detailView) {
            subscription = this.dataLayer.update(
                'patients',
                this.patient.id,
                patientData
            );
        } else {
            subscription = this.dataLayer.create('patients', patientData);
        }
        subscription.subscribe(
            () => {
                this.$state.reload();
                this.showModal = false;
                const msg = 'Patient registered';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Patient has been registered'
                );
                this.loading = false;
                this.formOptions.resetModel();
            },
            err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            }
        );
    }

    /**
     * Used to set the form options
     * @param formOptions
     */
    getFormOptions(formOptions) {
        this.formOptions = formOptions;
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        const variant = environment.variant;
        const variantPatientTerm = 'Patient';
        /**
         * Set the table header data
         */
        this.tableHeader = [
            { text: 'patients.table_header.info' },
            { text: 'patients.table_header.name' },
            { text: 'shared.patient_banner.dob' },
            { text: 'shared.patient_banner.phone' },
            ...(variant === 'empower'
                ? [{ text: 'shared.patient_banner.health_id' }]
                : []),
            { text: 'patients.table_header.action' },
        ];

        /**
         * Set the table's rows
         */
        this.rows = [
            {
                nested: [
                    {
                        label: `${variantPatientTerm} No`,
                        value: 'patient_id',
                        type: 'string',
                    },
                    {
                        label: 'Added On',
                        value: 'created',
                        type: 'date',
                    },
                ],
            },
            {
                path: 'person.person_display',
                type: 'mineVal',
                nested: [
                    {
                        label: 'Gender',
                        path: 'person.gender',
                        type: 'nestedVal',
                    },
                ],
            },
            {
                label: 'Age:',
                path: 'person.age',
                type: 'age',
                nested: [
                    {
                        label: 'DOB',
                        path: 'person.date_of_birth',
                        type: 'nestedValDate',
                    },
                ],
            },
            {
                path: 'person.phone_number',
                type: 'phoneNumber',
            },

            ...(variant === 'empower'
                ? [
                      {
                          path: 'person.global_health_id',
                          type: 'mineVal',
                      },
                  ]
                : []),
        ];

        /**
         * Used to set the table's filters
         * */
        this.filterParams = {
            fields: 'id,active,patient_id,person,expected_delivery_date,created',
            is_deceased: false,
            page_size: '20',
            active: true,
        };

        /**
         * Set the actions used for each row in the patient list table
         * */
        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    context: 'Edit Patient',
                    formConfig: {
                        checkExpressionOn: 'changeDetectionCheck',
                    },
                    store: 'patientRegisterService',
                    isService: true,
                    sortData: true,
                    action: 'quickPatch',
                    method: 'patchPatient',
                },
                expression: () => true,
            },
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    context: 'Edit Client',
                    formConfig: {
                        checkExpressionOn: 'changeDetectionCheck',
                    },
                    store: 'patientRegisterService',
                    isService: true,
                    sortData: true,
                    action: 'quickPatch',
                    method: 'patchPatient',
                },
                expression: () => false,
            },
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.patients.detail.timeline',
                },
                expression: () => true,
            },
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.patients.detail.segments',
                },
                expression: () => false,
            },
        ];

        /** Initialize the patient person data with a contact */
        this.patientDetails = {
            person: {
                person_contacts: [{}],
            },
        };

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }

    /** patient's list walkthough function */
    startWalkthrough() {
        this.shepherdService.defaultStepOptions = defaultStepOptions;
        this.shepherdService.modal = true;
        this.shepherdService.tourName = 'appointments';
        this.shepherdService.confirmCancel = false;
        this.shepherdService.addSteps(defaultSteps);
        this.shepherdService.start();
    }
}

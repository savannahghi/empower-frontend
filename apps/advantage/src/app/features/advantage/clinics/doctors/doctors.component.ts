import { Component, OnInit, ViewChild } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { StateService } from '@uirouter/angular';

@Component({
    selector: 'ngx-doctors',
    templateUrl: './doctors.component.html',
    styleUrls: ['./doctors.component.scss'],
    standalone: false,
})
export class DoctorsComponent implements OnInit {
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
     * Used to determine if the content of a form has been submitted
     */
    submitted: boolean = false;
    /**
     * Contains information about the practitioner
     */
    practitioner: any;
    /**
     * Contains the practitioner details
     */
    practitionerDetails: any;
    /**
     * Selected Language
     */
    selectedLanguage = this.cookieService.getLanguageCookie();
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
        public $state: StateService,
        private translate: TranslateService,
        private cookieService: Cookies
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
     * Used to set the form options
     * @param formOptions
     */
    getFormOptions(formOptions) {
        this.formOptions = formOptions;
    }
    /**
     * Used to submit the practitioner information
     * @param model - used to submit practitioner information
     */
    submitPractitioner(model, method) {
        const practitionerData = Object.assign({}, model);
        practitionerData.person.person_ids = [];
        practitionerData.person.person_photos = [];
        if (practitionerData.person.person_contacts) {
            practitionerData.person.person_contacts.forEach(contact => {
                if (contact.contact_type === 'phone_number') {
                    if (contact.contact.startsWith('+254')) {
                        contact.contact = contact.contact;
                    } else if (/^\d+$/.test(contact.contact)) {
                        contact.contact = '+254' + contact.contact;
                    }
                }
            });
        }
        this.submitted = true;
        this.loading = true;
        let subscription;
        if (method === 'update') {
            subscription = this.dataLayer.update(
                'practitioners',
                this.practitioner.id,
                practitionerData
            );
        } else if (method === 'create') {
            subscription = this.dataLayer.create(
                'practitioners',
                practitionerData
            );
        }
        subscription.subscribe(
            () => {
                this.$state.reload();
                this.showModal = false;
                const msg = 'Practitioner Added';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Practitioner has been registered'
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
     * Toggles modal
     */
    toggleModal() {
        this.showModal = !this.showModal;
    }

    ngOnInit() {
        /**
         * Table header
         */
        this.tableHeader = [
            { text: 'Name' },
            { text: 'Clinic Type' },
            { text: 'Phone No.' },
            { text: 'Actions' },
        ];

        /**
         * Table rows
         */
        this.rows = [
            {
                nested: [
                    {
                        path: 'person.person_display',
                        type: 'nestedVal',
                    },
                    {
                        label: 'Added On',
                        path: 'created',
                        type: 'nestedValDate',
                    },
                ],
            },
            {
                key: 'qualification',
                type: 'string',
            },
            {
                nested: [
                    {
                        path: 'person.phone_number',
                        type: 'nestedPhoneNumber',
                    },
                ],
            },
        ];

        /**
         * Fields called from the backend
         */
        this.filterParams = {};

        /**
         * Edit Action button with quick patch action from sil.datatable
         */
        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    context: 'Edit Practitioner',
                    formConfig: {
                        checkExpressionOn: 'changeDetectionCheck',
                    },
                    store: 'practitionerRegisterService',
                    isService: true,
                    sortData: true,
                    action: 'quickPatch',
                    method: 'patchPractitioner',
                },
            },
        ];

        /** Initialize the patient person data with a contact */
        this.practitionerDetails = {
            person: {
                person_contacts: [{}],
            },
        };

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }
}

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/core';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { PatientService } from '../patient.service';

@Component({
    selector: 'ngx-next-of-kin-list',
    templateUrl: './next-of-kin-list.component.html',
    standalone: false,
})
export class NextOfKinListComponent implements OnInit {
    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     * @param patientService Access instance of the patient service
     * @param errorHandler - Connects to the error handler service
     * @param uiglobals - Connects to the uiglobals service
     */
    constructor(
        protected toastrService: NbToastrService,
        public patientService: PatientService,
        public transition: Transition,
        public $state: StateService,
        public uiglobals: UIRouterGlobals
    ) {}

    /**
     * Contains selector that is used to access the datatable component
     * used in the component
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Used to override default form configurations
     */
    formConfig: { checkExpressionOn: string };

    /** used to filter datatable params */
    filterParams: Object;
    /**
     * Array used to define the actions of the datatable
     */
    actions: Array<any>;
    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;
    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;
    /**
     * Defines loading state
     */
    loading: boolean = false;
    /**
     * Used to define custom form options.
     * Required for the patient form to allow for constant updating of model
     */
    formOptions: any;
    /**
     * Used to determine if the content of a form has been submitted
     */
    submitted: boolean = false;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;
    /**
     * Contains nextofkin information
     */
    nextOfKinDetails: any;
    /**
     * Contains patient id
     */
    patientId: string = this.uiglobals.params.id;
    /**
     * Contains the observable resolved from the state service
     */
    @Input() patientObservable: any;

    /**
     * sets the filter used to query for data in the datatable
     * @param event contains the params used in the datatable
     */
    setFilter(event) {
        this.queryArg = event;
    }
    /**
     * Used to display a modal
     */
    showModal = false;
    /**
     * Used to determine the service used in the form
     */
    heading: any = 'nextofKinRegisterService';
    /**
     * Used to toggle the modal
     */
    toggleModal() {
        this.heading = 'next-of-kin-registration';
        this.showModal = !this.showModal;
    }
    /**
     * showToast - Used to display a toast using the nebular toast service
     * @param position - defines the toast's position e.g. bottom-right
     * @param status - defines the status being used e.g. success, danger, info
     * @param msg - defines what the message in the toast is
     * @param context - defines what the context of the toast is
     */
    showToast(position, status, title, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, title, {
            position,
            status,
            duration,
        });
    }

    /**
     * Used to submit related person information
     * @param model - used to submit related person information
     */
    submitRelatedPerson(model) {
        this.patientService.submitRelatedPerson(model, this);
        this.showModal = false;
    }

    /**
     * Used to set the form options
     * @param formOptions
     */
    getFormOptions(formOptions) {
        this.formOptions = formOptions;
    }

    ngOnInit() {
        /**
         * Set the table header data
         */
        this.tableHeader = [
            { text: 'patients.kin_details.name' },
            { text: 'patients.kin_details.relationship' },
            { text: 'shared.patient_banner.dob' },
            { text: 'shared.patient_banner.phone' },
            { text: 'patients.kin_details.action' },
        ];

        /**
         * Set the table's rows
         */
        this.rows = [
            {
                nested: [
                    {
                        label: 'Name',
                        path: 'related.person_display',
                        type: 'nestedVal',
                    },
                    {
                        label: 'Gender',
                        path: 'related.gender',
                        type: 'nestedVal',
                    },
                ],
            },
            {
                path: 'relationship_display',
                type: 'mineVal',
            },
            {
                label: 'Age:',
                path: 'related.age',
                type: 'age',
                nested: [
                    {
                        label: 'DOB',
                        path: 'related.date_of_birth',
                        type: 'nestedValDate',
                    },
                ],
            },
            {
                path: 'related.phone_number',
                type: 'mineVal',
            },
        ];

        /**
         * Used to set the table's filters
         * */
        this.filterParams = {
            fields: 'id,related',
            page_size: '10',
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
                    context: 'Edit Details',
                    formConfig: {
                        checkExpressionOn: 'changeDetectionCheck',
                    },
                    store: 'nextofKinRegisterService',
                    isService: true,
                    sortData: true,
                    action: 'quickPatch',
                    method: 'patchNextOfKin',
                    view: 'link_related',
                    nestedId: this.patientId,
                },
            },
            {
                btnText: 'shared.buttons.unlink',
                status: 'danger',
                action: 'quickPatch',
                confirm: {
                    title: 'Confirm Unlink',
                    text: 'Are you sure you want to unlink?',
                    showCancelButton: true,
                    cancelButtonColor: '#edf1f7',
                    confirmButtonText: 'Unlink',
                },
                modalConf: {
                    method: 'removeRelationship',
                },
            },
        ];

        /** Initialize the related person data with a contact */
        this.nextOfKinDetails = {
            person_contacts: [{}],
        };

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }
}

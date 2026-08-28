import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { UIRouterGlobals } from '@uirouter/core';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { PatientModel } from '../../models';

@Component({
    selector: 'ngx-patient-covers',
    templateUrl: './patient-covers.component.html',
    styleUrls: ['./patient-covers.component.scss'],
    standalone: false,
})
export class PatientCoversComponent implements OnInit {
    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     * @param uiglobals - Connects to the uiglobals service
     */
    constructor(
        protected toastrService: NbToastrService,
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
    formConfig: Object;
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
     * Contains patient id
     */
    patientId: string = this.uiglobals.params.id;
    /**
     * Contains patient id
     */
    patient: PatientModel;
    /**
     * Contains the observable resolved from the state service
     */
    @Input() patientObservable: any;
    /**
     * Used to display a modal
     */
    showModal = false;
    /**
     * Used to determine the service used in the form
     */
    heading: any = 'patientCoverService';
    /**
     * Used to toggle the modal
     */
    toggleModal() {
        this.heading = 'add-patient-cover';
        this.showModal = !this.showModal;
    }
    /**
     * showToast - Used to display a toast using the nebular toast service
     * @param position - defines the toast's position e.g. bottom-right
     * @param status - defines the status being used e.g. success, danger, info
     * @param title - defines what the title in the toast is
     * @param message - defines what the message of the toast is
     */
    showToast(position, status, title, message) {
        const duration = this.toastTime;
        this.toastrService.show(`${message}`, title, {
            position,
            status,
            duration,
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
     * Used to submit related person information
     * @param model - used to submit related person information
     */
    /**
     * Used to set the form options
     * @param formOptions
     */
    getFormOptions(formOptions) {
        this.formOptions = formOptions;
    }

    getPatientInfo() {
        /** Resolved observable from the state */
        this.patientObservable.subscribe((response: any) => {
            this.patient = response;
        });
    }

    ngOnInit(): void {
        /**
         * Set the table header data
         */
        this.tableHeader = [
            { text: 'Cover Name' },
            { text: 'Member Number' },
            { text: 'Start Date' },
            { text: 'End Date' },
            { text: 'Action' },
        ];

        /**
         * Set the table's rows
         */
        this.rows = [
            {
                label: 'Cover Name',
                key: 'scheme_name',
                type: 'string',
            },
            {
                label: 'Member Number',
                key: 'member_number',
                type: 'string',
            },
            {
                label: 'Start Date',
                key: 'valid_from',
                type: 'date',
            },
            {
                label: 'End Date',
                key: 'valid_to',
                type: 'date',
            },
        ];

        this.actions = [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    store: 'add-patient-cover',
                    context: 'Edit Patient Cover',
                    action: 'quickPatch',
                    httpMethod: 'update',
                    convertDates: [
                        {
                            format: 'YYYY-MM-DD',
                            fields: ['valid_from', 'valid_to'],
                        },
                    ],
                    api: 'patient-covers',
                    method: 'genericPatch',
                    successTitle: 'Edit Patient Cover',
                    successMessage:
                        'Patient cover details updated successfully',
                    failedTitle: 'Edit Patient Cover',
                    failedMessage: 'Patient cover update was unsuccessful',
                    state: '',
                },
            },
        ];

        /**
         * Used to set the table's filters
         * */
        this.filterParams = {
            patient: this.patientId,
            active: true,
            page_size: 100,
        };

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        this.getPatientInfo();
    }
}

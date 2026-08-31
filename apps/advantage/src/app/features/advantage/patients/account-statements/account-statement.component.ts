/** Imports used in the component */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Transition } from '@uirouter/core';
import { PatientService } from '../patient.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - style: contains the scss file used to style the component
 * - provider: contains the component's services
 */
@Component({
    selector: 'account-statement',
    styleUrls: ['./account-statement.component.scss'],
    templateUrl: './account-statement.component.html',
    providers: [PatientService],
    standalone: false,
})

/**
 * Invoice component class
 * Implements OnInit when intializing the class
 */
export class StatementComponent implements OnInit {
    /**
     * Used to get a reference of siltable used in the template
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;
    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;
    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;
    /**
     * Array used to define the actions of the datatable
     */
    actions: Array<any>;
    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;
    /**
     * Defines the default params used to filter
     * information in the table
     */
    filterParams: Object;
    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;
    /**
     * Defines patient data observable
     */
    @Input() patientObservable: any;
    /**
     * Defines visit id
     */
    visitId: string;
    /**
     * Contains information about the customer
     */
    customer: any;
    /**
     * Defines loading state
     */
    loading: boolean;
    /**
     * Boolean used to show the modal
     */
    showModal = false;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * id that contains the patient identifier
     */
    patientId: any;
    /**
     * Contains patient information
     */
    patient: any;

    /**
     * Constructor for the class component
     * @param toastrService Connects to the toast service
     * @param dataLayer Connects to the data layer service
     * @param transition Connects to the router transition service
     * @param errorHandler Connects to the error handler service
     */
    constructor(
        protected toastrService: NbToastrService,
        private dataLayer: SilStoresService,
        public transition: Transition,
        private errorHandler: ErrorHandlerService
    ) {}

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
     * Sets the filter params that come from the datatable
     * @param event detects when the query params change for the datatable
     */
    setFilter(event) {
        this.queryArg = event;
    }

    fetchCustomer(id: any) {
        this.dataLayer.get('customers', id).subscribe({
            next: (resp: any) => {
                this.customer = resp;
                this.filterParams = {
                    account: resp.receivables_account.id,
                    ordering: '-effective_date',
                    page_size: '150',
                };
            },
            error: err => this.errorHandler.handleError(err, this),
        });
    }

    downloadPdf() {
        this.loading = true;
        this.dataLayer
            .listNestedDownload(
                'accounts',
                'pdf_statement',
                this.customer.receivables_account.id
            )
            .subscribe({
                next: this.pdfDownloaded,
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                },
            });
    }

    pdfDownloaded = (data: Blob) => {
        this.loading = false;
        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);

        // open PDF in a new tab
        window.open(fileURL);
        const a = document.createElement('a');
        a.href = fileURL;
        a.target = '_blank';
        a.download = `${this.customer.partner_name}-customer-statement.pdf`;
        document.body.appendChild(a);
        a.click();
    };

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.visitId = this.transition.params().id;
        /**
         *  Table header
         * */
        this.tableHeader = [
            { text: 'Date' },
            { text: 'Description' },
            { text: 'Charge' },
            { text: 'Payment' },
            { text: 'Balance' },
            { text: 'Action' },
        ];

        /**
         * Table rows
         *  */
        this.rows = [
            {
                type: 'date',
                key: 'effective_date',
                nested: [{ value: 'effective_date', type: 'time' }],
            },
            {
                type: 'string',
                key: 'description',
            },
            {
                type: 'statement',
                key: 'dr_amount',
                format: 'currency',
            },
            {
                type: 'statement',
                key: 'cr_amount',
                format: 'currency',
            },
            {
                type: 'bal_statement',
                key: 'balance',
                format: 'currency',
            },
        ];

        /**
         * Subscribes to the patient data observable from the patient service
         */
        this.patientObservable.subscribe(
            (response: any) => {
                this.fetchCustomer(response.customer_id);
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );

        // Download Action button with quick patch action from sil.datatable
        this.actions = this['actions'] = [
            {
                btnText: 'Download',
                status: 'primary',
                action: 'downloadDocument',
                modalConf: {
                    downloadId: 'source_document_ref',
                    dynamicApi: 'content_type',
                },
            },
        ];
    }
}

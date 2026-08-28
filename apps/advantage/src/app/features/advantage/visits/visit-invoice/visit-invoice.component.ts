import {
    Component,
    Input,
    OnInit,
    SimpleChanges,
    ViewChild,
    OnChanges,
} from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Transition, StateService, UIRouterGlobals } from '@uirouter/core';
import { VisitService } from '../visit.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import _ from 'underscore';
import { fadeAnimation } from '../../../../shared/animations/if-animations';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

/**
 * Component decorator used in templates
 * the selector, style url, and template
 */
@Component({
    selector: 'sil-visit-invoice',
    templateUrl: './visit-invoice.component.html',
    styleUrls: ['./visit-invoice.component.scss'],
    animations: [fadeAnimation],
    standalone: false,
})

/** Class that is used for the service request invoice */
export class VisitInvoiceComponent implements OnInit, OnChanges {
    /**
     * Contains service request details
     */
    @Input() serviceRequest: any;

    /**
     * Contains visit information
     */
    @Input() visit: any;

    /**
     * Checks if invoice is fully refunded
     */
    fullyRefunded: boolean = false;

    /**
     * Refund buttons state
     */
    refundDisabled: boolean = false;

    /**
     * Loading state when signing a credit note
     */
    signingCRN: boolean = false;

    /**
     * Loading state when signing an invoice
     */
    signingInvoice: boolean = false;

    /**
     * Used to get a reference of siltable used in the template
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;
    @ViewChild('removeInvoiceItemSwal') removeInvoiceItemSwal: SwalComponent;

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
     * Used to check if state is visit
     */
    isVisit: boolean = false;

    /**
     * Used to check if state is billing service request
     */
    isBillingRequest: boolean = false;

    /**
     * Contains all queues
     */
    queues: any;

    /**
     * Contains selected queue used to start a visit
     */
    selectedQueue: object;

    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    /**
     * Contains patient information
     */
    patient: any;

    /**
     * Defines the default params used to filter
     * information in the table
     */
    filterParams: Object;

    /**
     *
     */
    quantity: any;
    /**
     * Used to differenttoggle modals
     * information in the table
     */
    toggle: Object = {};

    /**
     * toggles book appointment form when a visit ends
     */
    showAppointmentBooking: boolean = false;

    /**
     * contains erp user details
     */
    erpUserDetails: any;

    /**
     * contains org setting
     */
    orgSettingsDetails: any;

    /**
     * contains patient scheduling method
     */
    patientSchedulingMethod: any;

    /**
     * invalid visit statuses for billing
     */
    invalidVisitBillingStatus: any = ['COMPLETED', 'FINISHED', 'CANCELLED'];

    /** Secondary table contains setup information for a second table inside datatable */
    secondaryTable: any;

    /**
     * Defines loading state
     */
    loading: boolean = false;
    /**
     * service request name to add bill items
     */
    serviceRequestSelected: any;

    /**
     * Stores invoice fettched from erp
     */
    erpInvoice: any;

    /**
     * This stores the available credit note
     */
    erpCreditNote: any;

    /**
     * Check if invoice is E-Tims signed
     */
    isEtimSigned: boolean = false;

    /**
     * Checks if credit note is E-Tims signed
     */
    isCRNEtimSigned: boolean = false;

    /**
     * Used to define currencies for payment purposes
     */
    currencies: any;

    /** check if bill has already been refunded */
    isRefunded: any;

    /** check if item is paid */
    isPaid: any;

    /** check if bill is unpaid */
    isUnpaid: any;

    /** check if bill is partially paid */
    partiallyPaid: any;

    /** Contains the refund amount total for the invoice*/
    refundAmount: any;

    /** credit note model from the form */
    creditNoteModel: any;

    /** credit note */
    creditNote: any;

    /** selected invoice lines */
    selectedInvoiceLines: any;

    /** refund data from api */
    refundData: any;

    /**
     * Used to define custom form options.
     * Required for the patient form to allow for constant updating of model
     */
    formOptions: any;

    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Saves the check-in date
     */
    startDate: any;

    /**
     * Has an object of the fetched checkin schedule
     */
    checkinSchedule: any;

    /**
     * contains params used to create add patient to queue
     */
    params: object = {};

    /**
     * Stores the available timeslot for the queue
     */
    timeSlots: any;

    /**
     * string containing the button text/dialogue title
     */
    headerText: string = 'shared.buttons.book_review_appointment';

    /**
     * stores the appointment id
     */
    appointmentId: string;

    /**
     * Stores the form model data
     */
    model: Object = {};

    /**
     * Boolean used to define if the form data has been submitted and displays the scheduler
     */
    displayScheduling: boolean = false;

    /**
     * Used to determine when data is loading
     */
    notLoading: boolean;

    /** Contains the information of a schedule */
    schedule: any;
    self: any;

    /**
     * Used to disable unavailable days in the calendar when booking an appointment
     */
    unavailableDays: any;

    /**
     * string used to store the selected date
     */
    selectedDate: string;

    /** Boolean used to hide elements while the slots are loading */
    loadingSlots: boolean;

    /**
     * Contains information for pagination
     */
    paginationData: object;

    /**
     * Stores the minumum date
     */
    min: Object = moment();

    /**
     * Boolean used to define if a slot has been selected
     */
    slotSelected: boolean = false;

    /**
     * Stores the selected slot
     */
    selectedSlot: object = {};

    /** Contains pricelist info */
    pricelist: any;
    /**
     * string containing the button text
     */
    buttonText: string = 'shared.buttons.create';
    /**
     * Boolean used to define if document is loading
     */
    loadingDocument: boolean = false;
    /** Contains document info */
    document: any;
    /** Contains document info */
    fileURL: any;
    /** receives emitted event from sil-document-dialogue to close document dialogue */
    valueEmittedFromChildComponent: string = '';
    /**
     * Boolean used to disable payment btutton
     */
    disablePaymentButton: boolean;
    /** Contains the variant set from environment variables */
    variant: string;

    /**
     * Contains organisation disallow discount setting
     */
    disallowDiscount: any;

    /**
     * Selected invoice item for removal
     */
    selectedInvoiceItem: any = null;

    /**
     * Constructor used for the VisitInvoiceComponent class
     * @param toastrService Access instance of toastrService from nebular
     * @param dataLayer Access instance of SilStoresService
     * @param transition Access instance of the TransitionService from uirouter
     * @param $state Access instance of the StateService from uirouter
     * @param visitService Access instance of the visit service
     * @param authService Access instance of the authorization service
     * @param uiglobals Access instance of the UIRouterGlobals from uirouter
     * @param errorHandler Access instance of error handler service
     */
    constructor(
        protected toastrService: NbToastrService,
        public dataLayer: SilStoresService,
        public transition: Transition,
        public $state: StateService,
        public visitService: VisitService,
        public authService: Authorization,
        public uiglobals: UIRouterGlobals,
        private errorHandler: ErrorHandlerService,
        private translate: TranslateService,
        public readonly swalTargets: SwalPortalTargets,
        public analytics: AnalyticsService
    ) {
        this.variant = environment.variant;
    }

    /**
     * get organization scheduling method from organization settings
     */
    getOrganisationSettings() {
        this.orgSettingsDetails = this.authService.getOrgSettings();

        this.patientSchedulingMethod = this.orgSettingsDetails.find(
            setting =>
                setting.name ===
                'scheduling:preferred_patient_scheduling_method'
        );
        this.disallowDiscount = this.orgSettingsDetails.find(
            setting => setting.name === 'billing:disallow_discount'
        );
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        this.selectedInvoiceLines = [];

        if (this.serviceRequest.invoice.refund_status === 'FULLY_REFUNDED') {
            this.fullyRefunded = true;
        } else {
            this.fullyRefunded = false;
        }

        if (
            this.serviceRequest.invoice.refund_status ===
                'PARTIALLY_REFUNDED' ||
            this.serviceRequest.invoice.refund_status === 'FULLY_REFUNDED'
        ) {
            this.refundDisabled = true;
        } else if (this.serviceRequest.invoice.amount_paid === 0) {
            this.refundDisabled = true;
        } else {
            this.refundDisabled = false;
        }

        this.erpUserDetails = this.authService.getErpOrganisation();

        this.getOrganisationSettings();

        /**
         * Table header
         */

        this.tableHeader = [
            { text: '', className: 'w10' },
            { text: 'visits.table_header.item' },
            { text: 'visits.table_header.unit_price' },
            { text: 'visits.table_header.quantity' },
            { text: 'visits.table_header.discount' },
            { text: 'visits.table_header.tax_rate' },
            { text: 'visits.table_header.total_price' },
            { text: 'visits.table_header.action' },
        ];

        /**
         * Table rows
         */
        this.rows = [
            {
                select: true,
            },
            {
                type: 'string',
                key: 'name',
            },
            {
                type: 'currency',
                key: 'original_price',
            },
            {
                type: 'number',
                key: 'quantity',
            },
            {
                type: 'discount',
                key: 'price',
            },
            {
                type: 'string',
                key: 'tax_rate',
            },
            {
                type: 'totalCalculation',
            },
        ];

        /**
         * Fields called from the backend
         */
        this.filterParams = {
            sales_invoice: this.serviceRequest.invoice.sales_invoice_id,
        };

        // Check to see if it a visit service request
        this.isVisit = this.uiglobals.$current.name.includes('visit');

        // Check to see if it billing service request
        this.isBillingRequest = this.uiglobals.$current.name.includes(
            'app.advantage.queues.worklist'
        );

        this.secondaryTable = {
            headers: [
                { text: 'visits.table_header.date' },
                { text: 'visits.table_header.payment' },
                { text: 'visits.table_header.payment_ref' },
                { text: 'visits.table_header.action' },
            ],
            rows: [
                {
                    nested: [
                        {
                            type: 'time',
                            value: 'payment_date',
                        },
                        {
                            type: 'date',
                            value: 'payment_date',
                        },
                    ],
                },
                {
                    nested: [
                        {
                            type: 'currency',
                            value: 'amount',
                        },
                        {
                            type: 'string',
                            value: 'payment_method_name',
                        },
                    ],
                },
                {
                    type: 'string',
                    key: 'payment_reference',
                },
            ],
            tableNames: {
                first: 'visits.billing.bill_items',
                second: 'visits.billing.payments',
            },
            actions: [
                {
                    btnText: 'shared.buttons.refund',
                    status: 'basic',
                    action: 'modal',
                    modalConf: {
                        btnText: 'shared.buttons.refund',
                        useSubmitFormModel: true,
                        context: 'visits.billing.refund_pay',
                        store: 'refund-payment',
                        action: 'quickPatch',
                        method: 'refundPayment',
                    },
                },
            ],
        };
        /**
         * Subscribe to pricelist info
         */
        this.pricelistObservable();

        /**
         * Subscribe to currency information
         */
        this.currenciesObservable();

        /**
         * Initiates the queues observable to define queues
         */
        this.getQueues();

        this.isPaid =
            this.serviceRequest.invoice.amount_paid !== null &&
            this.serviceRequest.invoice.amount_due !== null &&
            this.serviceRequest.invoice.invoice_lines?.length > 0 &&
            this.serviceRequest.invoice.amount_paid ===
                this.serviceRequest.invoice.amount_due;

        this.isUnpaid =
            (this.serviceRequest.invoice.amount_due !== null &&
                this.serviceRequest.invoice.amount_due !== 0 &&
                this.serviceRequest.invoice.amount_paid === null) ||
            (this.serviceRequest.invoice.amount_paid === 0 &&
                this.serviceRequest.invoice.invoice_lines?.length > 0);

        this.partiallyPaid =
            this.serviceRequest.invoice.amount_due !== null &&
            this.serviceRequest.invoice.amount_paid !== null &&
            this.serviceRequest.invoice.amount_paid <
                this.serviceRequest.invoice.amount_due;

        this.isRefunded =
            this.serviceRequest.invoice.refunds.length > 0 &&
            this.serviceRequest.invoice.refunds[0].workflow_state ===
                'PROCESSED';
        /**
         * Run the sales-invoice endpoint on advantage only
         */
        if (this.variant === 'default') this.fetchERPInvoiceSignedStatus();
        this.fetchERPCreditNoteSignedStatus();
        this.visitPatientObservable();
    }

    fetchERPInvoiceSignedStatus() {
        const id = this.serviceRequest.invoice.sales_invoice_id;
        this.dataLayer.get('sales-invoices', id).subscribe({
            next: response => {
                this.erpInvoice = response;
                this.isEtimSigned = response['is_signed'];
                return this.isEtimSigned;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    fetchERPCreditNoteSignedStatus() {
        const id = this.serviceRequest.invoice.refunds[0]?.sales_credit_note_id;
        if (id) {
            this.dataLayer.get('credit-notes', id).subscribe({
                next: response => {
                    this.erpCreditNote = response;
                    this.isCRNEtimSigned = response['is_signed'];
                    return this.isCRNEtimSigned;
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
        }
    }

    /** toggle payment modal */
    toggleModal(context, serviceRequest?) {
        if (
            this.toggle['payment'] &&
            this.serviceRequestSelected &&
            !this.serviceRequestSelected.invoice.sales_invoice_id
        ) {
            this.disablePaymentButton = true;
        } else {
            this.toggle[context] = !this.toggle[context];
        }
        if (serviceRequest) {
            this.serviceRequestSelected = serviceRequest;
        }
    }

    /**
     * Complete an active visit
     */
    completeVisit() {
        /** prompt user to book a review appointment, if no end visit, if yes book review appointment then end visit */
        this.visitService.completeVisit(this, this.visit['id']);
    }

    /** toggles book appointment dialogue */
    toggleBookAppointment() {
        this.showAppointmentBooking = !this.showAppointmentBooking;
    }

    /** Observable that waits for patient data to be defined */
    visitPatientObservable() {
        this.visitService.visitPatientDataEmitter.subscribe(patient => {
            this.patient = patient;
            this.model['id'] = this.patient.id;
        });
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = 7000;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * downloads patients' invoice given the invoice id
     */
    printInvoice() {
        const id = this.serviceRequest.invoice.sales_invoice_id;
        this.dataLayer.downloadDocument('sales-invoices', id).subscribe({
            next: (data: Blob) => {
                const file = new Blob([data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);

                // open PDF in a new tab
                window.open(fileURL);
                const a = document.createElement('a');
                a.href = fileURL;
                a.target = '_blank';
                a.download = `invoice-${id}.pdf`;
                document.body.appendChild(a);
                a.click();
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /** Show success message after generating signed invoice */
    showSuccessSignedInvoiceMessage = () => {
        const msg = 'Invoice submitted successfully for signing';
        const context = 'Invoice Submitted';
        this.showToast('bottom-right', 'success', context, msg);
        this.$state.reload();
    };
    /**
     * This forces a document to be signed if it wasn't signed after
     * a visit has been completed
     */
    forceInvoiceSign() {
        this.loading = true;
        this.signingInvoice = true;
        const id = this.serviceRequest.invoice.sales_invoice_id;
        this.dataLayer
            .createNested('sales-invoices', 'sign_sales_invoice', id)
            .subscribe({
                next: this.showSuccessSignedInvoiceMessage,
                error: err => {
                    this.loading = false;
                    this.signingInvoice = false;
                    this.errorHandler.handleError(err, this);
                },
            });
    }
    /**
     * This forces a document to be signed if it wasn't signed after
     * a visit has been completed
     */
    forceCreditNoteSign() {
        this.loading = true;
        this.signingCRN = true;
        const id = this.serviceRequest.invoice.refunds[0].sales_credit_note_id;
        this.dataLayer
            .createNested('credit-notes', 'send_credit_note', id)
            .subscribe({
                next: this.showSuccessSignedInvoiceMessage,
                error: err => {
                    this.loading = false;
                    this.signingCRN = false;
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    appendFileData = (data: Blob, documentNumber: string) => {
        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        file['data'] = fileURL;
        file['documentNumber'] = documentNumber;
        this.document = file;
    };

    /**
     * This fetches the attachment blob to be displayed
     */
    getAttachment(docType: string) {
        if (docType === 'invoice') {
            const id = this.serviceRequest.invoice.sales_invoice_id;
            const documentNumber = this.serviceRequest.invoice.invoice_number;
            this.dataLayer.downloadDocument('sales-invoices', id).subscribe({
                next: (data: Blob) => {
                    this.appendFileData(data, documentNumber);
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loadingDocument = false;
                },
            });
        }
        if (docType === 'credit-note') {
            const id =
                this.serviceRequest.invoice.refunds[0].sales_credit_note_id;
            const documentNumber =
                this.serviceRequest.invoice.refunds[0].refund_number;
            this.dataLayer.downloadDocument('credit-notes', id).subscribe({
                next: (data: Blob) => {
                    this.appendFileData(data, documentNumber);
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loadingDocument = false;
                },
            });
        }
    }

    /**
     * preview of patient invoice
     */
    previewDocument(docType: string) {
        this.getAttachment(docType);
        this.toggleModal('pdfPreview');
        this.document = {};
    }

    /**
     *  updates PENDING status to WAITING, to add a patient to queue, if queue status is PENDING
     *  or updates WAITING status to IN_PROGRESS to serve patient, if queue status is WAITING
     */
    addToQueue(status) {
        this.visitService.addToQueue(status, this.serviceRequest.id);
    }

    /**
     * Toggles the product form
     */
    toggleProductForm() {
        this.toggleModal('billing');
        this.toggleModal('addProduct');
    }

    /**
     * Toggles the payment form
     */
    togglePaymentMethodForm() {
        this.toggleModal('payment');
        this.toggleModal('paymentMethod');
    }

    /**
     * Add's a product from charge master to default pricelist
     */
    addProduct(model) {
        this.loading = true;
        const categories = _.pluck(model.categories, 'id');
        const data = {
            name: model?.name,
            preferred_name: model?.preferred_term,
            product_type: model.product_type,
            categories: categories,
            slade_code: model?.slade_code,
            selling_price: model.selling_price,
            purchasing_price: model.purchasing_price,
            sale_taxes: model?.sale_taxes,
            purchase_taxes: model.purchase_taxes,
        };
        this.dataLayer.create('products', data).subscribe({
            next: () => {
                this.toggleProductForm();
                this.loading = false;
                const msg = 'Added item';
                const context = 'Add Product/Service';
                this.showToast('bottom-right', 'success', context, msg);
            },
            error: () => {
                this.loading = false;
                const msg = 'Failed to add item';
                const context = 'Add Product/Service';
                this.errorHandler.showErrorToast(
                    'bottom-right',
                    'danger',
                    msg,
                    context
                );
            },
        });
    }

    /**
     * Add's a payment method
     */
    addPaymentMethod(model) {
        this.loading = true;
        const data = {
            name: model.name,
            account: model.account_details?.id,
            description: model.description,
        };
        this.dataLayer.create('payment-methods', data).subscribe({
            next: () => {
                this.togglePaymentMethodForm();
                this.loading = false;
                const msg = 'Payment Method Added Successfully';
                const context = 'Add Payment Method';
                this.showToast('bottom-right', 'success', context, msg);
            },
            error: err => {
                this.loading = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * Adds item to patient bill
     */
    addBillItem(model) {
        this.loading = true;
        const bill = {
            invoice: this.serviceRequest.invoice.id,
            price: model.price,
            quantity: model.quantity,
            product_id: model.pricelist_products.product_id,
            original_price: model.original_price,
            pricelist_product_id: model.pricelist_products.pricelist_product_id,
            name: model.pricelist_products.name,
            allow_discount: model.allow_discount,
        };

        this.dataLayer.create('billable-items', bill).subscribe({
            next: () => {
                this.visitService.fetchVisit();
                this.updateVisitStatusToInProgress();

                const msg = 'Bill item added';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Bill item has been added'
                );
                this.loading = false;
                this.toggleModal('billing');
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
                this.toggleModal('billing');
            },
        });
    }

    /**
     * Adds item to patient bill
     */
    partialRefund(model) {
        this.creditNoteModel = model;
        const refundPayload = {
            invoice: this.serviceRequest.invoice.id,
            kra_reason_code: this.creditNoteModel.kra_reason_code,
            reason: this.creditNoteModel.reason,
            invoice_lines: [
                {
                    id: this.creditNote?.id,
                    quantity: this.creditNote?.quantity,
                    amount: this.creditNote?.price,
                },
            ],
        };

        if (this.selectedInvoiceLines.length > 0) {
            refundPayload['invoice_lines'] = _.pluck(
                this.selectedInvoiceLines,
                'id'
            );
        }

        /** Create refund */
        this.dataLayer
            .createNested(
                'invoice-transactions',
                'refund_line',
                this.serviceRequest.invoice.id,
                refundPayload
            )
            .subscribe({
                next: this.processedRefund,
                error: this.errorHandlerFxn,
            });
    }

    fullRefund(model) {
        this.creditNoteModel = model;
        const refundPayload = {
            invoice: this.serviceRequest.invoice.id,
            kra_reason_code: this.creditNoteModel.kra_reason_code,
            reason: this.creditNoteModel.reason,
        };

        /** Create refund */
        this.dataLayer
            .createNested(
                'invoice-transactions',
                'refund',
                this.serviceRequest.invoice.id,
                refundPayload
            )
            .subscribe({
                next: this.processedFullRefund,
                error: this.errorHandlerFxn,
            });
    }

    errorHandlerFxn = err => {
        this.errorHandler.handleError(err, this);
        this.loading = false;
    };

    /** Process refund */
    submitRefund(refund) {
        this.dataLayer
            .nestedTransition('refunds', refund.id, 'SUBMITTED')
            .subscribe({
                next: this.processRefund,
                error: this.errorHandlerFxn,
            });
    }

    /** Selected invoice lines */
    selectInvoiceLines(invoiceLine) {
        const result = _.findWhere(this.selectedInvoiceLines, {
            id: invoiceLine.id,
        });
        if (result === undefined) {
            this.selectedInvoiceLines.push(invoiceLine);
        } else {
            this.selectedInvoiceLines = _.reject(
                this.selectedInvoiceLines,
                line => {
                    return line.id === invoiceLine.id;
                }
            );
        }
    }

    /** Get refund payload */
    processRefund = refund => {
        this.dataLayer
            .nestedTransition('refunds', refund.id, 'PROCESSED')
            .subscribe({
                next: this.processedRefund,
                error: this.errorHandlerFxn,
            });
    };

    /** Get refund payload */
    processedRefund = () => {
        this.visitService.fetchVisit();
        const msg = 'Refund has been Saved';
        this.showToast('bottom-right', 'success', msg, 'Refund saved');
    };

    /** Get refund payload */
    processedFullRefund = () => {
        this.visitService.fetchVisit();
        const msg = 'Refund has been Saved';
        this.showToast('bottom-right', 'success', msg, 'Refund saved');
    };

    /**
     * Adds item to patient bill
     */
    addPayment(model) {
        this.loading = true;
        const workstation = this.authService.getWorkstation();
        model.source_organisation_unit = workstation.workstation__org_unit;
        model.currency = this.currencies[0].id;
        model.invoice = this.serviceRequest.invoice.id;
        model.payment_method_name = model.paymentMethod?.name;
        model.payment_method = model.paymentMethod?.id;
        delete model.paymentMethod;
        this.dataLayer.create('adv-payment', model).subscribe({
            next: this.addedPayment,
            error: this.errorHandlerFxn,
        });
    }

    /** Deals with an added payment */
    addedPayment = () => {
        const context = 'Payment received';
        this.showToast(
            'bottom-right',
            'success',
            context,
            'Payment has been received succesfully'
        );
        this.loading = false;
        this.$state.reload();
        this.toggleModal('payment');
    };

    /**
     * Subscribes to the observable that emits visit information
     */
    currenciesObservable() {
        this.currencies = this.visitService.currencies;
        this.visitService.currenciesDataEmitter.subscribe(currencies => {
            this.currencies = currencies;
        });
    }

    /**
     * Subscribes to pricelist info
     */
    pricelistObservable() {
        this.pricelist = this.visitService.pricelist;
        this.visitService.pricelistDataEmitter.subscribe(pricelist => {
            this.pricelist = pricelist;

            /**
             * Edit Action button with quick patch action from sil.datatable
             */
            this.actions = this['actions'] = [
                {
                    btnText: 'shared.buttons.edit',
                    status: 'success',
                    action: 'modal',
                    expression: row => {
                        if (!row) {
                            return;
                        }
                        return !this.invalidVisitBillingStatus.includes(
                            this.visit.status
                        );
                    },
                    modalConf: {
                        formConfig: {},
                        context: 'visits.billing.edit_item',
                        formModelData: {
                            pricelist_products: {
                                unit_price: 'original_price',
                                price: 'price',
                                product_id: 'pricelist_product',
                                pricelist_product_id: 'pricelist_product_id',
                            },
                        },
                        secondaryData: [
                            this.visit,
                            this.serviceRequestSelected,
                            this.pricelist,
                        ],
                        store: 'addBillItemService',
                        isService: true,
                        action: 'quickPatch',
                        method: 'patchInvoiceLine',
                    },
                },
                {
                    btnText: 'shared.buttons.remove',
                    status: 'danger',
                    action: 'custom',
                    modalConf: {
                        customFxn: true,
                    },
                    expression: row => {
                        if (!row) {
                            return;
                        }
                        return !this.invalidVisitBillingStatus.includes(
                            this.visit.status
                        );
                    },
                },
                {
                    btnText: 'shared.buttons.refund',
                    status: 'basic',
                    disabled: this.refundDisabled,
                    action: 'modal',
                    expression: row => {
                        if (!row) {
                            return;
                        }
                        if (
                            this.serviceRequest.invoice.refunds.length > 0 &&
                            this.serviceRequest.invoice.refunds[0]
                                .workflow_state === 'PROCESSED'
                        ) {
                            return;
                        }
                        return this.invalidVisitBillingStatus.includes(
                            this.visit.status
                        );
                    },
                    modalConf: {
                        btnText: 'shared.buttons.refund',
                        context: 'visits.billing.refund_item',
                        store: 'refundLineService',
                        isService: true,
                        action: 'quickPatch',
                        method: 'refundInvoiceLine',
                    },
                },
                {
                    btnText: 'shared.buttons.refund',
                    status: 'basic',
                    disabled: this.refundDisabled,
                    action: 'alert',
                    expression: row => {
                        if (!row) {
                            return;
                        }
                        if (
                            this.serviceRequest.invoice.refunds.length > 0 &&
                            this.serviceRequest.invoice.refunds[0]
                                .workflow_state === 'PROCESSED'
                        ) {
                            return true;
                        }
                    },
                },
            ];
        });
    }

    /**
     * OnChanges lifecycle hooks that detects when the inputs have changed
     */
    ngOnChanges(changes: SimpleChanges) {
        if (!_.isUndefined(changes.serviceRequest)) {
            const newValues = _.clone(changes.serviceRequest.currentValue);
            this.serviceRequest = newValues;
        }
    }

    /**
     *  get queues
     */
    getQueues() {
        this.visitService.queuesDataEmitter.subscribe((queues: any) => {
            this.queues = queues;
        });
    }

    /**
     * Detects changing of queue
     */
    changeQueue(queue) {
        this.selectedQueue = queue;
    }

    /** Sends patient to selected queue */
    sendToQueue() {
        this.visitService.sendToQueue(this.selectedQueue['id'], this);
    }

    /** Add service request to episode of care */
    addServiceRequest() {
        this.visitService.addServiceRequest(this.selectedQueue['id'], this);
    }

    /** Navigates to queue state */
    navigateToQueue() {
        const href = this.$state.href('app.advantage.queues');
        const obj = {
            status: 'WAITING',
            ordering: 'created',
            queue: this.serviceRequest.queue,
        };
        const params = new URLSearchParams(obj).toString();
        const link = `${href}?${params}`;
        this.openLink(link);
    }

    /** Navigates to triage state */
    navigateToTriage() {
        this.$state.go('app.advantage.visits.detail.clinical');
    }

    /** Navigate link */
    openLink(link) {
        window.open(link, '_blank');
    }

    /** Updates the visit status to IN_PROGRESS */
    updateVisitStatusToInProgress() {
        const serviceRequestId = this.serviceRequest.id;
        const serviceRequestPayload = { status: 'IN_PROGRESS' };

        this.dataLayer
            .update('service-requests', serviceRequestId, serviceRequestPayload)
            .subscribe({
                next: this.updateVisitStatus,
                error: this.handleError,
            });
    }

    updateVisitStatus = () => {
        const visitId = this.visit.id;
        const visitPayload = { status: 'IN_PROGRESS' };

        this.dataLayer.update('visits', visitId, visitPayload).subscribe({
            next: this.onVisitStatusUpdated,
            error: this.handleError,
        });
    };

    handleError = err => {
        this.errorHandler.handleError(err, this);
    };

    onVisitStatusUpdated = () => {
        this.analytics.logEvent('service-request_completed');
        this.onAfterVisitStatusUpdated();
    };

    onAfterVisitStatusUpdated() {
        this.visitService.fetchVisit();
        this.$state.reload();
    }

    /**
     * Handles custom actions from the datatable - specifically the remove invoice item action
     */
    handleCustomAction(row: any) {
        this.selectedInvoiceItem = row;
        this.removeInvoiceItemSwal.fire();
    }

    /**
     * Confirms the removal of the selected invoice item
     */
    confirmRemoveInvoiceItem() {
        if (this.selectedInvoiceItem) {
            this.loading = true;
            this.dataLayer
                .remove('billable-items', this.selectedInvoiceItem.id)
                .subscribe({
                    next: () => {
                        this.showToast(
                            'bottom-right',
                            'success',
                            'Item removed',
                            'Invoice item has been removed successfully'
                        );
                        this.visitService.fetchVisit();
                        this.selectedInvoiceItem = null;
                        this.loading = false;
                    },
                    error: err => {
                        this.errorHandler.handleError(err, this);
                        this.selectedInvoiceItem = null;
                        this.loading = false;
                    },
                });
        }
    }
}

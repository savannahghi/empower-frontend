/**
 * Imports used in the component
 */
import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Transition, StateService, UIRouterGlobals } from '@uirouter/core';
import { fadeAnimation } from '../../../../shared/animations/if-animations';
import { listAnimation } from '../../../../shared/animations/list-animations';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { VisitService } from '../visit.service';
import _ from 'underscore';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

/**
 * Imports used in the component
 */
@Component({
    selector: 'visit-billing',
    styleUrls: ['./visit-billing.component.scss'],
    templateUrl: './visit-billing.component.html',
    animations: [fadeAnimation, listAnimation],
    standalone: false,
})

/**
 * Definition of the component's class
 */
export class VisitBillingComponent implements OnInit, OnChanges {
    /**
     * Contains service request details
     */
    @Input() serviceRequest: any;
    /**
     * Defines visit data
     */
    @Input() visit: any;

    /**
     * Defines visit id
     */
    visitId: string;

    /** checks if state is for visits */
    isVisit: any;

    /** checks if state is for queues */
    isQueue: any;

    /**
     * Used to toggle service point modal
     */
    showServicePointModal: boolean = false;

    /**
     * Toggle modal object
     */
    toggle: {
        service_point: boolean;
        pay_full_amount: boolean;
    } = {
        service_point: false,
        pay_full_amount: false,
    };

    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Used to define currencies for payment purposes
     */
    currencies: any;

    /** check if bill is paid */
    isPaid: any;

    /** check if bill is unpaid */
    isUnpaid: any;

    /** check if bill is partially paid */
    partiallyPaid: any;
    /**
     * Defines loading state
     */
    submitted: boolean = false;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * contains erp user details
     */
    erpUserDetails: any;
    /**
     * id that contains the patient identifier
     */
    patientId: any;

    /**
     * invalid visit statuses for billing
     */
    invalidVisitBillingStatus: any;

    /**
     * Contains patient information
     */
    patient: any;

    /**
     * Contains all queues
     */
    queues: any;

    /**
     * Contains selected queue used to start a visit
     */
    selectedQueue: object;

    /** stores the current active params */
    stateParams: any;

    /** service request data gotten from queue */

    serviceRequestFromQueue: any;

    /** i service request has invoice lines show print entire invoice/receipt button */
    showPrintEntireInvoiceOrReceipt: boolean = false;

    /**
     * Defines the total amount due for the visit.
     *
     */
    totalAmountDue: any;

    /**
     * Defines the total amount paid for the visit.
     *
     */

    totalAmountPaid: any;

    /**
     * Defines the total balance for the visit.
     *
     */
    totalBalance: any;

    /**
     * Contains an array of invoice IDs that are associated with the visit.
     *
     */
    invoiceIds: any;

    /**
     * Contains the name of the payment method that was used to pay the bill.
     *
     */
    paymentMethodName: any;
    /**
     * Contains the actions
     */
    actions: any;

    /**
     * Component constructor
     * @param toastrService Access instance of the toast service
     * @param datalayer Access instance of SilStoresService
     * @param transition Access instance of the transition service
     * @param $state Access instance of the state service
     * @param visitService Access instance of the visit service
     * @param errorHandler Access instance of error handler service
     * @param UIRouterGlobals Access instance of UIRouterGlobals service
     */
    constructor(
        protected toastrService: NbToastrService,
        public datalayer: SilStoresService,
        public transition: Transition,
        public $state: StateService,
        public authService: Authorization,
        public visitService: VisitService,
        private errorHandler: ErrorHandlerService,
        public uiglobals: UIRouterGlobals,
        public analytics: AnalyticsService
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

    /** toggle service point modal */
    toggleServicePointModal() {
        this.showServicePointModal = !this.showServicePointModal;
    }

    /** toggle service point modal */
    toggleModal(context: 'service_point' | 'pay_full_amount') {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /** if current state is visits it defaults to true */
        this.isVisit =
            this.$state.includes('app.advantage.visits') ||
            this.$state.includes('app.advantage.queues.worklist');

        /** if current state is queues it defaults to true */
        this.isQueue = this.$state.includes('app.advantage.queues.detail');

        this.visitId =
            this.transition.params().id || this.transition.params().visit;

        this.invalidVisitBillingStatus = ['COMPLETED', 'CANCELLED'];

        /**
         * Initiates the queues observable to define queues
         */
        this.getQueues();

        /**
         * Initiates the visit observable to fetch the visit once it is emitted
         */
        this.visitObservable();

        /**
         * Subscribe to currency information
         */
        this.currenciesObservable();

        this.visitPatientObservable();

        this.isPaid =
            this.serviceRequest?.invoice.amount_paid !== null &&
            this.serviceRequest?.invoice.amount_due !== null &&
            this.serviceRequest?.invoice.invoice_lines?.length > 0 &&
            this.serviceRequest?.invoice.amount_paid ===
                this.serviceRequest?.invoice.amount_due;
        this.isUnpaid =
            (this.serviceRequest?.invoice.amount_due !== null &&
                this.serviceRequest?.invoice.amount_due !== 0 &&
                this.serviceRequest?.invoice.amount_paid === null) ||
            (this.serviceRequest?.invoice.amount_paid === 0 &&
                this.serviceRequest?.invoice.invoice_lines?.length > 0);

        this.partiallyPaid =
            this.serviceRequest?.invoice.amount_due !== null &&
            this.serviceRequest?.invoice.amount_paid !== null &&
            this.serviceRequest?.invoice.amount_paid <
                this.serviceRequest?.invoice.amount_due;
    }

    /**
     * Adds item to patient bill
     */

    errorHandlerFxn = err => {
        this.errorHandler.handleError(err, this);
        this.loading = false;
    };
    addPayment(model) {
        this.loading = true;
        model.currency = this.currencies[0].id;

        this.datalayer
            .create('multiple-invoice-payments', {
                amount: this.totalBalance,
                currency: model.currency,
                invoice_ids: this.invoiceIds,
                payment_date: model.payment_date,
                payment_method: model?.paymentMethod?.id,
                payment_method_name: model?.paymentMethod?.name,
            })
            .subscribe({
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
        this.toggleModal('pay_full_amount');
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
     * filter the service request using state param
     */
    filterServiceRequest(queue) {
        if (queue) {
            this.stateParams = this.uiglobals.params;
            this.serviceRequestFromQueue = this.visit.service_requests.filter(
                (serviceRequest: any) => {
                    return (
                        serviceRequest.id === this.stateParams.service_request
                    );
                }
            );
        }
    }

    /**
     *
     * @param sRequest
     * @returns true if invoice line is greater than 0
     */
    checInvoiceLength(sRequest) {
        return sRequest?.invoice?.invoice_lines.length > 0;
    }

    /**
     * check if invoice lines are present
     * @param visit
     * @returns true if there are any invoice lines present
     */
    checkIfInvoiceLinesPresent(visit) {
        const serviceRequestsWithInvoices = visit.service_requests.filter(
            sRequest => sRequest?.invoice?.invoice_lines?.length > 0
        );
        this.showPrintEntireInvoiceOrReceipt =
            serviceRequestsWithInvoices.length > 0;
    }

    /**
     * Subscribes to the observable that emits visit information
     */
    visitObservable() {
        this.visit = this.visitService.visit;
        this.visitService.visitDataEmitter.subscribe(vis => {
            this.visit = vis;
            this.calculateTotalBalance(this.visit);
            this.checkIfInvoiceLinesPresent(this.visit);
            this.filterServiceRequest(this.isQueue);
        });
    }

    calculateTotalBalance(visit) {
        this.invoiceIds = visit?.service_requests?.map(service_request => {
            return service_request.invoice.id;
        });
        this.totalAmountDue = visit.service_requests?.reduce((acc, vis) => {
            return (acc += vis.invoice.amount_due);
        }, 0);

        this.totalAmountPaid = visit.service_requests?.reduce((acc, vis) => {
            return (acc += vis.invoice.amount_paid);
        }, 0);

        /** */
        this.totalBalance = this.totalAmountDue - this.totalAmountPaid;
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
    /** Observable that waits for patient visit data to be defined */
    visitPatientObservable() {
        this.visitService.visitPatientDataEmitter.subscribe(patient => {
            this.patient = patient;
        });
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
        this.loading = true;
        this.datalayer
            .update('visits', this.visit['id'], {
                current_queue: this.selectedQueue['id'],
            })
            .subscribe({
                next: this.handleQueueTransition,
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                },
            });
    }

    /** Handles queue after transitioning queue */
    handleQueueTransition = (response: any) => {
        this.visit = response;
        this.visitService.visitDataEmitter.next(response);
        this.toggleModal('service_point');
        this.addToQueue('IN_PROGRESS');
        this.loading = false;
        this.analytics.logEvent('service-request_completed');
        if (this.isVisit) {
            this.$state.reload();
        } else {
            this.$state.go('app.advantage.queues');
        }
    };

    /**
     *  updates PENDING status to WAITING, to add a patient to queue, if queue status is PENDING
     *  or updates WAITING status to IN_PROGRESS to serve patient, if queue status is WAITING
     */
    addToQueue(status) {
        this.visitService.addToQueue(status, this.serviceRequest.id);
        this.visitService.addToQueue(
            status,
            this.serviceRequestFromQueue[0].id
        );
    }

    /**
     *  updates PENDING status to WAITING, to add a patient to queue, if queue status is PENDING
     *  or updates WAITING status to IN_PROGRESS to serve patient, if queue status is WAITING
     */
    printEntireInvoice() {
        this.visitService.printEntireInvoice();
    }

    /** getFilteredResponse of queues from sil-combo-box*/
    getFilteredResponse(event) {
        this.selectedQueue = event;
    }
}

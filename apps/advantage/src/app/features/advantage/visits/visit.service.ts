/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { TransitionStatusPipe } from '../../../@theme/pipes';
import { StateService } from '@uirouter/core';
import { ErrorHandlerService } from '../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import _ from 'underscore';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})
/**
 * Class that helps with visit management
 */
export class VisitService {
    /** Used to store visit information */
    visit: {};
    /** Used to store patient info from the visit information */
    visitPatient: {};
    /** Used to store patients screening info requirements from the visit information */
    patientScreeningData: any;
    /** Emits visit information */
    visitDataEmitter: Subject<any>;
    /** Emits the patient info from the visit information */
    visitPatientDataEmitter: Subject<any>;
    /**
     * Emits the patient Screening info from the visit information
     * To be used during cancer screening process
     */
    visitPatientScreeningDataEmitter: Subject<any>;
    /** Emits the invoice info from the visit information */
    currenciesDataEmitter: Subject<any>;
    /** Emits the pricelist information */
    pricelistDataEmitter: Subject<any>;

    /** Emits the practioner's filtered queue url & params */
    practictionerFilteredQueueUrl: Subject<any>;

    prevPractitionerFilteredQueueUrl: any;

    /** Emits the patient's chronic condition */
    patientChronicConditionEmitter: Subject<any>;

    /** Used to store the invoice info from the visit information */
    visitInvoice: {};

    /**
     * Used to save available service points in a patient's visit
     */
    screeningServicePoints: Array<any> = [];

    /**
     * Used to check if state is visit
     */
    isVisit: boolean = false;

    /** Contains currency info for billing purposes */
    currencies: any;

    /** Contains pricelist info */
    pricelist: any;

    /**
     * Used to store queues
     */
    queues: any[];
    /**
     * Used to emit queues to its subscribers.
     */
    queuesDataEmitter: Subject<any>;

    /**
     *
     * @param dataLayer Used to make api requests
     * @param errorHandler Used to handle errors from the api
     * @param toastrService Access instance of the toast service
     * @param $state Access instance of the state service
     */
    constructor(
        public dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public $state: StateService,
        public analytics: AnalyticsService
    ) {
        this.visitDataEmitter = new Subject();
        this.visitPatientDataEmitter = new Subject();
        this.visitPatientScreeningDataEmitter = new Subject();

        this.currenciesDataEmitter = new Subject();
        this.pricelistDataEmitter = new Subject();
        this.queuesDataEmitter = new Subject();
        this.practictionerFilteredQueueUrl = new Subject();
        this.patientChronicConditionEmitter = new Subject();
        this.isVisit = this.$state.includes('app.advantage.visits');
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

    /** Used to set the visit data in context */
    setVisitData(visit) {
        this.visit = visit;

        this.doVisitCalculations(visit);
        this.getQueues();
        this.visitDataEmitter.next(visit);
        this.getVisitPatient(visit);
        this.getDefaultCurrency();
        this.getDefaultPricelist();
    }

    doVisitCalculations(visit) {
        /** calculates total amount, amount paid and balance  */
        this.visit['total_amount_due'] = visit.service_requests?.reduce(
            (acc, cur) => {
                return acc + cur.invoice.amount_due;
            },
            0
        );

        this.visit['total_amount_paid'] = visit.service_requests?.reduce(
            (acc, cur) => {
                return acc + cur.invoice.amount_paid;
            },
            0
        );

        this.visit['total_balance'] =
            this.visit['total_amount_due'] - this.visit['total_amount_paid'];
        let invoicelines = 0;
        _.map(this.visit['service_requests'], request => {
            invoicelines =
                invoicelines + request.invoice['invoice_lines'].length;
        });
        this.visit['invoice_lines'] = invoicelines;
    }

    /** Used to set the visit's patient in context */
    setVisitPatientData(patient) {
        this.visitPatientDataEmitter.next(patient);
    }

    /**
     * Set visit's patient screening data
     * @param screeningData patient's screening data
     */
    setVisitPatientScreeningData(screeningData) {
        this.visitPatientScreeningDataEmitter.next(screeningData);
    }

    /** Used to set currency information */
    setCurrencyData(currencies) {
        this.currenciesDataEmitter.next(currencies);
    }

    /** Used to set pricelist information */
    setPricelistData(pricelist) {
        this.pricelistDataEmitter.next(pricelist);
    }
    /**
     * Function used to update a visit
     * @param visitInfo patch call response
     */
    updateVisit(visitInfo) {
        this.visitDataEmitter.next(visitInfo);
    }

    /**
     * Function used to set the screening service points available to a patient
     * @param service_requests service points available in the visit
     */
    setVisitScreeningServicePoints(service_requests) {
        this.screeningServicePoints = _.chain(service_requests)
            .filter(
                servicePt =>
                    servicePt.queue_name === 'Breast Cancer Screening' ||
                    servicePt.queue_name === 'Cervical Cancer Screening' ||
                    servicePt.queue_name === 'Prostate Cancer Screening' ||
                    servicePt.queue_name === 'Cancer Screening'
            )
            .map(req => ({
                encounterID: req.encounter_id,
                queue_name: req.queue_name,
                status: req.status,
                previous_point: req.previous_point,
            }))
            .value();
    }

    /** Get the patient details from the visit from the patient api */
    getVisitPatient(visit) {
        this.setVisitScreeningServicePoints(visit.service_requests ?? []);

        this.dataLayer.get('patients', visit.patient).subscribe({
            next: (response: any) => {
                this.visitPatient = response;
                const screeningInfo = {
                    visit_id: visit?.id,
                    patient_id: visit?.patient,
                    patient_name: response?.person?.first_name,
                    visit_status: visit?.status,
                    age: response.person?.age?.years,
                    gender: response.person?.gender,
                    servicePoints: [...this.screeningServicePoints],
                    personID: response.person?.id,
                    clinical_id: response?.clinical_id,
                };
                this.patientScreeningData = screeningInfo;
                this.setVisitPatientData(this.visitPatient);
                this.setVisitPatientScreeningData(screeningInfo);
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }
    /** Gets the default currency */
    getDefaultCurrency() {
        this.dataLayer.list('currencys', { is_default: true }).subscribe({
            next: (response: any) => {
                this.currencies = response.results;
                localStorage.setItem(
                    'defaultCurrency',
                    JSON.stringify(this.currencies[0])
                );
                this.setCurrencyData(this.currencies);
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /** Gets the default pricelist */
    getDefaultPricelist() {
        this.dataLayer
            .list('pricelists', {
                pricelist_status: 'default',
                pricelist_type: 'sales',
                fields: 'id,name',
            })
            .subscribe({
                next: (response: any) => {
                    this.pricelist = response.results[0];
                    this.setPricelistData(this.pricelist);
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     * Check for queues
     * */
    getQueues() {
        this.dataLayer
            .list('queues', {
                fields: 'id,name,branch_id,active_visits,department_id,workstation_id',
                active: true,
            })
            .subscribe({
                next: (response: any) => {
                    const allQueues = response.results;
                    const queues: any[] = [];
                    if (Array.isArray(allQueues)) {
                        allQueues.forEach((queue: any) => {
                            if (queue['name'] !== 'Check-in Queue | OTHER') {
                                queues.push(queue);
                            }
                        });
                    }
                    this.queues = queues;
                    this.setQueues(this.queues);
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     *  updates PENDING status to WAITING, to add a patient to queue, if queue status is PENDING
     *  or updates WAITING status to IN_PROGRESS to serve patient, if queue status is WAITING
     */
    addToQueue(status, id, clinical?) {
        const pipe = new TransitionStatusPipe();
        const newStatus = pipe.transform(status);
        const data = { status: newStatus };
        this.dataLayer.update('service-requests', id, data).subscribe({
            next: () => {
                if (!clinical) {
                    const msg = 'Transitioned patient';
                    this.showToast('bottom-right', 'success', msg, `${msg}`);
                }
                this.fetchVisit();
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * Used to set queues
     * */
    setQueues(queues) {
        this.queues = queues;
        this.queuesDataEmitter.next(queues);
    }

    setCurrentDoctorFilteredQueue(stateAndParams) {
        this.prevPractitionerFilteredQueueUrl = stateAndParams;
        this.practictionerFilteredQueueUrl.next(
            this.prevPractitionerFilteredQueueUrl
        );
    }

    /** handles fetching chronic condition during visit and adding to the patient health details banner */
    reFetchChronicCondition(diagnosisType) {
        this.patientChronicConditionEmitter.next(diagnosisType);
    }

    /**
     * Used to fetch queues
     * */
    fetchQueues() {
        this.getQueues();
    }

    /** Sends patient to selected queue */
    sendToQueue(id: any, comp) {
        comp.loading = true;
        this.dataLayer
            .update('visits', this.visit['id'], {
                current_queue: id,
            })
            .subscribe({
                next: (response: any) => {
                    this.visit = response;
                    this.visitDataEmitter.next(response);
                    comp.loading = false;
                    this.analytics.logEvent('queue_transition');
                    if (this.isVisit) {
                        this.$state.reload();
                    } else {
                        this.$state.go('app.advantage.queues');
                    }
                },
                error: (err: any) => {
                    this.errorHandler.handleError(err, this);
                    comp.loading = false;
                },
            });
    }

    /** Print consolidated visit invoice */
    printEntireInvoice() {
        const id = this.visit['id'];
        const visitNumber = this.visit['visit_number'];
        this.dataLayer
            .listNestedDownload('visits', 'consolidated_invoice', id)
            .subscribe({
                next: (data: Blob) => {
                    const file = new Blob([data], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);

                    // open PDF in a new tab
                    window.open(fileURL);
                    const a = document.createElement('a');
                    a.href = fileURL;
                    a.target = '_blank';
                    a.download = `invoice-${visitNumber}.pdf`;
                    document.body.appendChild(a);
                    this.analytics.logEvent('visit_print_consolidated_invoice');
                    a.click();
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /** Get visit info afresh*/
    fetchVisit(id?) {
        const visitId = id ? id : this.visit['id'];
        this.dataLayer.get('visits', visitId).subscribe({
            next: (response: any) => {
                this.visit = response;
                this.setVisitData(this.visit);
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /** Complete visit */
    completeVisit(comp, visitId) {
        comp.loading = true;
        this.dataLayer.createNested('visits', 'close', visitId, {}).subscribe({
            next: () => {
                comp.loading = false;
                const title = 'Visit completion';
                const context = 'Visit has been completed';
                this.showToast('bottom-right', 'success', title, context);
                this.analytics.logEvent('visit_completed');
                this.$state.go('app.advantage.visits', {}, { reload: true });
            },
            error: err => {
                comp.loading = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /** Add service request to visit */
    addServiceRequest(id: any, comp) {
        comp.loading = true;
        this.dataLayer
            .create('service-requests', {
                visit: comp.visit.id,
                queue: id,
            })
            .subscribe({
                next: () => {
                    this.fetchVisit(comp.visit.id);
                },
                error: err => {
                    comp.loading = false;
                    this.errorHandler.handleError(err, this);
                },
            });
    }
}

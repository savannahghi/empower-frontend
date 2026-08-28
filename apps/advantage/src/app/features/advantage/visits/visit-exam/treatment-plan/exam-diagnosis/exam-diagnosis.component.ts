import { Component, Input, OnInit } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { VisitService } from '../../../visit.service';
import { ErrorHandlerService } from '../../../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../../../shared/sil-http-services/sil_datalayer.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
/**
 * Drawer context types
 */
interface DrawerInterface {
    'add-medication-drawer': boolean;
    'add-test-drawer': boolean;
    'add-appointment-drawer': boolean;
}

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'ngx-exam-diagnosis',
    templateUrl: './exam-diagnosis.component.html',
    styleUrl: './exam-diagnosis.component.scss',
    standalone: false,
})
/**
 * Class that creates the Exam Diagnosis component
 */
export class ExamDiagnosisComponent implements OnInit {
    /**
     * key value pairs for the toggle object
     */
    toggle: DrawerInterface = {
        'add-medication-drawer': false,
        'add-test-drawer': false,
        'add-appointment-drawer': false,
    };
    /**
     * Loading indicators
     */
    loadingResults: DrawerInterface = {
        'add-medication-drawer': false,
        'add-test-drawer': false,
        'add-appointment-drawer': false,
    };
    /**
     * Constants used to fetch a specified service request
     */
    QUEUECONSTANTS = {
        test: {
            queueName: 'Laboratory',
            serviceRequestType: 'LAB',
        },
        medication: {
            queueName: 'Pharmacy',
            serviceRequestType: 'PHARMACY',
        },
    };
    /**
     * The component constructor
     * @param uiglobals injects the global values from ui router
     * @param visitService injects instance of the visit service
     * @param datalayer Access instance of SilStoresService
     * @param errorHandler injects instance of the Error Handler Service
     */
    constructor(
        public uiglobals: UIRouterGlobals,
        private visitService: VisitService,
        public datalayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        public analytics: AnalyticsService
    ) {}
    /**
     * Tests attached to the diagnosis
     */
    tests: Array<any> = [
        {
            id: '6642',
            name: 'Complete Blood Count(CBC)',
            doctor: 'Dr John Muthee',
            provider: 'SIL Provider',
            date: '26-Sep-2019',
            copay: 'KES 10,500.00',
        },
        {
            id: '6643',
            name: 'Magnetic Resonance Imaging(MRI)',
            doctor: 'Dr John Muthee',
            provider: 'SIL Provider',
            date: '26-Sep-2019',
            copay: 'KES 12,500.00',
        },
    ];
    /**
     * Medications attached to the diagnosis
     */
    medications: Array<any> = [
        {
            id: '1642',
            name: 'Amoxicilin Clavulic - acid 400MG tablet',
            doctor: 'Dr John Muthee',
            provider: 'SIL Provider',
            date: '26-Sep-2019',
        },
        {
            id: '1643',
            name: 'Penicilin 50ML Injection',
            doctor: 'Dr John Muthee',
            provider: 'SIL Provider',
            date: '26-Sep-2019',
        },
    ];
    /**
     * Boolean that specifies if diagnosis data is being fetched
     */
    loadingState: boolean = true;
    /**
     * Contains visit information resolved from the state
     */
    @Input() visitObservable: any;
    /**
     * Service Request Id of the newly created service request
     */

    newServiceRequestId: any;
    /**
     * Minimal visit data
     */
    visitPayload: any = {};
    /**
     * Defines visit data
     */
    visit: any;
    /**
     * Contains visit Id
     */
    visitId: string;
    /**
     * Contains patient information
     */
    patient: any;
    /**
     * Contains diagnosis information
     */
    diagnosis: any;
    /**
     * Id of the diagnois
     */
    diagnosisId: string = '';
    /**
     * Name of child action states
     */
    diagnosisActions: Array<string> = ['test', 'medication', 'appointment'];
    /**
     * Contains all queues
     */
    queues: any;

    /**
     * Function used to toggle the drawers
     * @param context has the different drawer contexts
     */
    toggleDrawer(context: keyof DrawerInterface) {
        this.toggle[context] = !this.toggle[context];
    }
    /** Observable that waits for patient visit data to be defined */
    visitPatientObservable() {
        this.visitService.visitPatientDataEmitter.subscribe(patient => {
            this.patient = patient;
        });
    }
    /**
     * Function that toggles drawer when service request is available
     * @param serviceRequestId intended service request
     * @param context drawer context
     */
    processAction(serviceRequestId, context) {
        this.visitPayload.serviceRequestId = serviceRequestId;

        this.loadingResults[context] = false;

        this.toggleDrawer(context);
    }
    /**
     * Function that fetches the required service point
     */
    getServiceRequest(visitData, action) {
        const serviceRequestType =
            this.QUEUECONSTANTS[action]['serviceRequestType'];

        const serviceRequest = visitData?.service_requests?.find(
            sp => sp.queue_type === serviceRequestType
        );
        return serviceRequest;
    }
    /**
     * Function that processes some pre logic before adding a lab order
     * @param queueName type of queue
     */
    addItem(action) {
        this.loadingResults[`add-${action}-drawer`] = true;

        this.visitPayload = {
            patientId: this.visit?.patient,
            diagnosis: this.diagnosisId,
        };

        this.visitPayload.settingsData = {
            workstation_id: this.visit?.workstation_id,
            department_id: this.visit?.department_id,
            branch_id: this.visit?.branch_id,
            cluster_id: this.visit?.cluster_id,
            organisation: this.visit?.organisation,
        };

        const serviceRequest = this.getServiceRequest(this.visit, action);

        if (serviceRequest) {
            this.processAction(serviceRequest?.id, `add-${action}-drawer`);
        } else {
            /**
             * This condition helps mitigate the possibility of queues not being defined
             */
            const queueName = this.QUEUECONSTANTS[action]['queueName'];

            this.fetchQueue(queueName, action);
        }
    }

    /**
     * Check for queues
     * */
    fetchQueue(queueName: string, action: string) {
        const params = {
            active: true,
            search: queueName,
            fields: 'id,name,branch_id,department_id,workstation_id,queue_type',
        };
        this.datalayer.list('queues', params).subscribe({
            next: (response: any) => {
                this.queues = response.results;
                this.addServiceRequest(
                    response.results,
                    action,
                    `add-${action}-drawer`
                );
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * Function used to create a service Request if the specified one does not exist
     * @param queues service queues on advantage
     * @param action can either be a test or medication
     * @param context Drawer context
     */
    addServiceRequest(queues, action, context) {
        const queueName = this.QUEUECONSTANTS[action]['queueName'];

        const queue = queues?.find(q => q.name === queueName);

        if (queue) {
            /** Sends patient to specified queue */
            if (this.uiglobals.current.name.includes('app.advantage.queues')) {
                this.datalayer
                    .create('service-requests', {
                        visit: this.visit.id,
                        queue: queue['id'],
                    })
                    .subscribe({
                        next: (response: any) => {
                            this.newServiceRequestId = response?.id;
                            this.visitService.fetchVisit(this.visit.id);
                            setTimeout(() => {
                                if (response) {
                                    this.processAction(response?.id, context);
                                    return;
                                }
                                this.loadingResults[context] = false;
                                return;
                            }, 500);
                        },
                        error: err => {
                            this.loadingResults[context] = false;
                            this.errorHandler.handleError(err, this);
                        },
                    });
            } else {
                this.datalayer
                    .update('visits', this.visitId, {
                        current_queue: queue['id'],
                    })
                    .subscribe({
                        next: (response: any) => {
                            this.visitService.setVisitData(response);

                            const serviceRequest = this.getServiceRequest(
                                response,
                                action
                            );

                            this.newServiceRequestId = serviceRequest?.id;
                            this.analytics.logEvent(
                                'service-request_completed'
                            );
                            setTimeout(() => {
                                if (serviceRequest) {
                                    this.processAction(
                                        serviceRequest?.id,
                                        context
                                    );
                                    return;
                                }
                                this.loadingResults[context] = false;
                                return;
                            }, 500);
                        },
                        error: err => {
                            this.loadingResults[context] = false;

                            this.errorHandler.handleError(err, this);
                        },
                    });
            }
        } else {
            this.loadingResults[context] = false;
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
    /** Error handler for api calls */
    errorHandlerFxn = err => {
        this.errorHandler.handleError(err, this);
        this.loadingState = true;
        return;
    };
    /**
     * Receive diagnoses data and groups them by name
     */
    receiveDiagnosisData = data => {
        this.loadingState = false;
        this.diagnosis = data;
    };

    /**
     * Function to fetch a diagnosis details
     */
    fetchDiagnosesDetails() {
        this.loadingState = true;

        const url = `${this.diagnosisId}/related_data/`;
        this.datalayer.get('exam-diagnosis', url, {}, true).subscribe({
            next: this.receiveDiagnosisData,
            error: err => this.errorHandlerFxn(err),
        });
    }
    /**
     * Component lifecycle used after the component is initialized
     */
    ngOnInit() {
        this.visitId = this.uiglobals.params.visit || this.uiglobals.params.id;
        this.diagnosisId = this.uiglobals.params.diagnosis_id;

        this.fetchDiagnosesDetails();

        this.visitPatientObservable();

        /** Resolved observable from the state */
        this.visitObservable.subscribe(
            (response: any) => {
                this.visit = response;

                this.visitService.setVisitData(this.visit);
                this.getQueues();
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }
}

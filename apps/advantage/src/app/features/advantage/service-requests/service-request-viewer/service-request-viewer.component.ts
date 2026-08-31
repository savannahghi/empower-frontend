import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ServiceRequestService } from '../servicerequest.service';
import { NbButtonModule, NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { VisitService } from '../../visits/visit.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ThemeModule } from '../../../../@theme/theme.module';
import { PatientDetailsTimelineComponent } from '../../patients/patient-details/patient-details-timeline/patient-details-timeline.component';
import { PatientService } from '../../patients/patient.service';
import { VitalsEntryServiceRequestComponent } from '../vitals-entry-service-request/vitals-entry-service-request.component';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import {
    SwalPortalTargets,
    SweetAlert2Module,
} from '@sweetalert2/ngx-sweetalert2';
import { fadeAnimation } from 'app/shared/animations/if-animations';
import { SkikaLayoutModule } from 'app/shared/sil-layout/sil-layout.module';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { SilComboBoxModule } from 'app/shared/sil-combo-box/sil-combo-box.module';
import { ConsultationServiceRequestComponent } from '../consultation-service-request/consultation-service-request.component';
import { PharmacyServiceRequestComponent } from '../pharmacy-service-request/pharmacy-service-request.component';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
import { VisitsModule } from '../../visits/visits.module';
import { PatientTimelineComponent } from '../../patients/patient-timeline/patient-timeline.component';
@Component({
    selector: 'ngx-service-request-viewer',
    imports: [
        CommonModule,
        NbCardModule,
        NbButtonModule,
        NgxSkeletonLoaderModule,
        ThemeModule,
        SweetAlert2Module,
        TranslatePipe,
        PatientDetailsTimelineComponent,
        VitalsEntryServiceRequestComponent,
        PharmacyServiceRequestComponent,
        ConsultationServiceRequestComponent,
        SkikaLayoutModule,
        NbSpinnerModule,
        SilComboBoxModule,
        VisitsModule,
        PatientTimelineComponent,
    ],
    animations: [fadeAnimation],
    templateUrl: './service-request-viewer.component.html',
    styleUrl: './service-request-viewer.component.scss',
})
export class ServiceRequestViewerComponent implements OnInit, OnChanges {
    @Input() request;
    /**
     * Defines visit data
     */
    visit: any;
    /**
     * Contains patient information
     */
    patient: any;

    /**
     * Contains all queues
     */
    queues: any;

    /**
     * Contains current workstation type
     */
    currentWorkstationType: any;

    /**
     * Contains visit information resolved from the state
     */
    @Input() visitObservable: any;

    /**
     * Contains selected queue used to start a visit
     */
    selectedQueue: object;

    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Saves the selected language from the cookie
     */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /** variable used to toggle the patient timeline */
    showPatientTimeline: boolean;

    /** stores workstation information */
    workstation: any;

    constructor(
        public uiglobals: UIRouterGlobals,
        private cookieService: Cookies,
        private translate: TranslateService,
        public serviceRequestService: ServiceRequestService,
        public patientService: PatientService,
        public $state: StateService,
        public authService: Authorization,
        public dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        public readonly swalTargets: SwalPortalTargets,
        public visitService: VisitService,
        public analytics: AnalyticsService
    ) {
        this.translate.setFallbackLang('en');
        this.translate.use(this.selectedLanguage);
    }

    navigateToServiceRequest(serviceRequest) {
        const params = {
            visit: serviceRequest.visit,
            service_request: serviceRequest.id,
        };
        this.$state.transitionTo('', params, {
            notify: false,
            inherit: false,
            reload: false,
        });
    }

    /**
     * Subscribes to the observable that emits visit information
     */
    serviceRequestObservable() {
        this.request = this.serviceRequestService.serviceRequest;
        this.serviceRequestService.serviceRequestDataEmitter.subscribe(
            serviceRequest => {
                this.request = serviceRequest;
                this.fetchVisit();
            }
        );
    }

    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    fetchVisit() {
        this.visitService.fetchVisit(this.request?.visit);
    }

    /**
     * Subscribes to the observable that emits visit information
     */
    visitServiceObservable() {
        this.visit = this.visitService.visit;
        this.visitService.visitDataEmitter.subscribe(visit => {
            this.setVisit(visit);
            this.showPatientTimeline = this.showTimeline();
        });
    }

    /** set visit */
    setVisit = vis => {
        this.visit = vis;
    };

    /** Observable that waits for patient visit data to be defined */
    visitPatientObservable() {
        this.visitService.visitPatientDataEmitter.subscribe(
            this.receivePatient
        );
    }

    receivePatient = patient => {
        setTimeout(() => {
            this.patient = patient;
            this.patient = this.patientService.checkIfPatientIsComplete(
                this.patient
            );
        }, 500);
    };

    /** Handle error from server */
    handleError = err => {
        this.errorHandler.handleError(err, this);
        this.loading = false;
    };

    startServiceRequest() {
        this.serviceRequestService.startServiceRequest(this.request);
    }

    /**
     * Detects changing of queue
     */
    changeQueue(queue) {
        this.selectedQueue = queue;
    }

    /**
     * Used to toggle the modal
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    /** Sends patient to selected queue */
    sendToQueue() {
        this.loading = true;
        this.dataLayer
            .update('visits', this.visit['id'], {
                current_queue: this.selectedQueue['id'],
            })
            .subscribe({
                next: this.completeSendToQueue,
                error: this.handleError,
            });
    }

    completeSendToQueue = (response: any) => {
        this.visit = response;
        this.visitService.visitDataEmitter.next(response);
        this.toggleModal('service_point');
        this.loading = false;
        this.analytics.logEvent('service-request_completed');
        this.$state.go(
            'app.advantage.queues.worklist',
            {},
            { inherit: false, reload: true }
        );
    };

    /** getFilteredResponse of queues from sil-combo-box*/
    getFilteredResponse(event) {
        this.selectedQueue = event;
    }

    /**
     *  get queues
     */
    getQueues() {
        this.visitService.queuesDataEmitter.subscribe(this.receiveQueues);
    }
    /**
     * receive queues
     * @param queues
     */
    receiveQueues = (queues: any) => {
        this.queues = queues;
    };

    /**
     * function to determine whether to show the patient timeline
     *
     */
    showTimeline(): boolean {
        const clinicalServicePoints = [
            'screening',
            'triage',
            'consultation',
            'pharmacy_dispensing',
        ];
        if (clinicalServicePoints.includes(this.currentWorkstationType)) {
            return this.visit.service_requests[0].status === 'WAITING';
        }
        return false;
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.serviceRequestObservable();

        this.visitPatientObservable();

        this.visitServiceObservable();

        /**
         * Initiates the queues observable to define queues
         */
        this.getQueues();

        this.currentWorkstationType =
            this.authService.getWorkstation().workstation__workstation_type;
    }

    /**
     * OnChanges lifecycle hooks that detects when the inputs have changed
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.request !== undefined) {
            this.request = changes.request.currentValue;
            this.navigateToServiceRequest(this.request);
            this.fetchVisit();
        }
    }
}

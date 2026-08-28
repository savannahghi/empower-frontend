import { Component, OnInit } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { NbToastrService, NbSidebarService } from '@nebular/theme';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { ServiceRequestModel } from '../../models/ServiceRequest.model';
import { WorkstationModel } from '../../models/Workstation.model';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { ServiceRequestService } from '../../service-requests/servicerequest.service';
import _ from 'underscore';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { fadeAnimation } from 'app/shared/animations/if-animations';
import { LayoutService } from 'app/@core/utils';

@Component({
    selector: 'ngx-queue-worklist',
    standalone: false,
    templateUrl: './queue-worklist.component.html',
    styleUrl: './queue-worklist.component.scss',
    animations: [fadeAnimation],
})
export class QueueWorklistComponent implements OnInit {
    /**
     * Fetches the selected language from cookie storage
     */
    selectedLanguage = this.cookieService.getLanguageCookie();

    serviceRequests: Array<ServiceRequestModel>;
    serviceRequest: ServiceRequestModel;
    loadingServiceRequests: boolean;
    noQueue: boolean;
    noServiceRequests: boolean;
    workStationDetails: WorkstationModel;

    /**
     * Constructor for the settings class component
     * @param dataLayer injects instance of the datalayer service
     * @param errorHandler injects instance of errorhandler service
     * @param toastrService injects instance of nebular toast service
     * @param stateService injects instance of state service
     * @param UIRouterGlobals injects instance of uiglobal service
     */
    constructor(
        private datalayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        private serviceRequestService: ServiceRequestService,
        protected toastrService: NbToastrService,
        public authService: Authorization,
        private sidebarService: NbSidebarService,
        private cookieService: Cookies,
        private layoutService: LayoutService,
        private translate: TranslateService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    /**
     * Get current workstation information to get the workstation type
     */
    getCurrentWorkstationDetails() {
        const workstation = this.authService.getWorkstation();
        this.datalayer.get('workstations', workstation.workstation).subscribe({
            next: this.handleFetchedWorkstation,
            error: this.handleError,
        });
    }

    /**
     * The value set for searching
     *
     */
    searchValue: string = '';

    /**
     * Contains the queue
     *
     */
    queue: object;

    /**
     * Contains current workstation type
     */
    currentWorkstationType: any;

    /**
     * search input subject
     *
     */
    searchValueUpdate = new Subject<any>();

    /**
     * Maps workstation type to queue type
     */
    mapQueueType(workstationType) {
        switch (workstationType) {
            case 'triage':
                return 'TRIAGE';
            case 'consultation':
                return 'CONSULTATION';
            case 'lab':
                return 'LAB';
            case 'imaging':
                return 'IMAGING';
            case 'pharmacy_dispensing':
                return 'PHARMACY';
            case 'cashier':
                return 'BILLING';
            case 'procedure':
                return 'PROCEDURE';
            case 'optical':
                return 'OPTICAL';
            case 'breast_cancer_screening':
                return 'BREAST CANCER SCREENING';
            case 'cervical_cancer_screening':
                return 'CERVICAL CANCER SCREENING';
            case 'cancer_screening':
                return 'CANCER SCREENING';
            default:
                return workstationType;
        }
    }

    /**
     * Get queue information using workstation information
     * @param data
     */
    handleFetchedWorkstation = data => {
        this.workStationDetails = data;
        const queue = this.mapQueueType(data.workstation_type);
        const params = {
            workstation_id: this.workStationDetails.id,
            queue_type: queue,
        };
        this.datalayer.list('queues', params).subscribe({
            next: this.handleFetchedQueue,
            error: this.handleError,
        });
    };

    handleFetchedQueue = data => {
        if (data.results.length < 1) {
            this.noQueue = true;
            this.loadingServiceRequests = false;
            return;
        }
        this.queue = data.results[0];
        this.fetchServiceRequests({});
    };

    fetchServiceRequests(extraParams?) {
        const params = {
            queue: this.queue['id'],
            ordering: '-created',
            status: 'DRAFT,WAITING,IN_PROGRESS',
            fields: 'id,created,status,visit,patient_name',
        };
        Object.assign(params, extraParams);
        this.datalayer.list('service-requests', params).subscribe({
            next: this.handleWorkstationServiceRequests,
            error: this.handleError,
        });
    }

    /**
     * Receives service requests tied to the queue
     * @param data
     */
    handleWorkstationServiceRequests = data => {
        if (data.results.length < 1) {
            this.noQueue = true;
            this.loadingServiceRequests = false;
            return;
        }
        this.loadingServiceRequests = false;
        this.serviceRequests = data.results;
        if (this.uiglobals.params.visit) {
            this.serviceRequest = _.findWhere(this.serviceRequests, {
                visit: this.uiglobals.params.visit,
                id: this.uiglobals.params.service_request,
            });
        } else {
            this.serviceRequest = this.serviceRequests[0];
        }
        this.navigateToServiceRequestView();
        setTimeout(() => {
            this.serviceRequestService.setServiceRequest(this.serviceRequest);
        }, 500);
    };

    /**
     * Navigates the user to the service request viewer with
     * the service request in context
     * @param serviceRequest
     */
    emitServiceRequest(serviceRequest) {
        this.serviceRequest = serviceRequest;
        this.serviceRequestService.setServiceRequest(serviceRequest);
        this.navigateToServiceRequestView();
    }

    navigateToServiceRequestView() {
        if (
            this.currentWorkstationType === 'consultation' &&
            (this.uiglobals.current.name ===
                'app.advantage.queues.worklist.request' ||
                this.uiglobals.$current.parent.name ===
                    'app.advantage.queues.worklist.request')
        ) {
            this.$state.go('app.advantage.queues.worklist.request.review', {
                visit: this.serviceRequest?.visit,
                service_request: this.serviceRequest?.id,
            });
        } else if (
            this.currentWorkstationType === 'consultation' &&
            (this.uiglobals.current.name === 'app.advantage.queues.worklist' ||
                this.uiglobals.$current.parent.name === 'app.advantage.queues')
        ) {
            // Make sure to update the state based on the data added
            // on the patient. When tests have been added, move to treatment plan
            this.$state.go('app.advantage.queues.worklist.request.review', {
                visit: this.serviceRequest?.visit,
                service_request: this.serviceRequest?.id,
            });
        } else if (
            this.currentWorkstationType === 'triage' ||
            this.currentWorkstationType === 'cashier'
        ) {
            this.$state.go('app.advantage.queues.worklist.request', {
                visit: this.serviceRequest?.visit,
                service_request: this.serviceRequest?.id,
            });
        }
    }

    /** Handle error from server */
    handleError = err => {
        this.errorHandler.handleError(err, this);
    };

    /**
     * Observable that gets the search value
     *
     */
    searchObservable() {
        this.searchValueUpdate
            .pipe(debounceTime(2000), distinctUntilChanged())
            .subscribe(this.searchValueEmit);
    }

    /**
     * Emits the value from search input
     *
     */
    searchValueEmit = value => {
        const search = {};
        search['search'] = value;
        this.fetchServiceRequests(search);
    };

    /**
     * compacts the sidebar
     * @returns a boolean once the toggle has been done
     */
    compactSidebar(): boolean {
        this.sidebarService.compact('menu-sidebar');
        this.layoutService.changeLayoutSize();

        return false;
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.currentWorkstationType =
            this.authService.getWorkstation().workstation__workstation_type;
        this.loadingServiceRequests = true;
        this.getCurrentWorkstationDetails();
        this.compactSidebar();
        this.searchObservable();
    }
}

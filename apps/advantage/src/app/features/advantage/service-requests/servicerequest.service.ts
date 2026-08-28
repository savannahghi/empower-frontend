import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ServiceRequestModel } from '../models/ServiceRequest.model';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { StateService } from '@uirouter/angular';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';

/**
 * Allows service to be injectable into a patient component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that helps with service request administration
 */
export class ServiceRequestService {
    /**
     *
     */
    serviceRequest: ServiceRequestModel;
    /**
     * Used to emit patient info to its subscribers.
     */
    serviceRequestDataEmitter: Subject<any>;

    constructor(
        public dataLayer: SilStoresService,
        public $state: StateService,
        private errorHandler: ErrorHandlerService
    ) {
        this.serviceRequestDataEmitter = new Subject();
    }

    /** Emit next value for service request for all subscribers */
    setServiceRequest(serviceRequest) {
        this.serviceRequest = serviceRequest;
        this.serviceRequestDataEmitter.next(serviceRequest);
    }

    /** Emit next value for service request for all subscribers */
    startServiceRequest(serviceRequest) {
        const params = {
            status: 'IN_PROGRESS',
        };
        this.dataLayer
            .update('service-requests', serviceRequest.id, params)
            .subscribe({ next: this.handleRequest, error: this.handleError });
    }

    handleRequest = () => {
        this.$state.go(
            'app.advantage.queues.worklist',
            {},
            { inherit: false, reload: true }
        );
    };

    handleError = err => {
        this.errorHandler.handleError(err, this);
    };
}

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NbCardModule, NbListModule } from '@nebular/theme';
import { UIRouterGlobals } from '@uirouter/angular';
import { DoseUnitPipe } from 'app/@theme/pipes/dose-unit/dose-unit.pipe';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

@Component({
    imports: [NbCardModule, NbListModule, CommonModule, DoseUnitPipe],
    selector: 'ngx-pharmacy-service-request',
    templateUrl: './pharmacy-service-request.component.html',
    styleUrl: './pharmacy-service-request.component.scss',
})
export class PharmacyServiceRequestComponent implements OnInit {
    /** stores visit details */
    @Input() visit: any;

    /** service request id */
    serviceRequestId: string;

    /** service request id */
    prescription: any;

    constructor(
        public dataLayer: SilStoresService,
        public uiglobals: UIRouterGlobals,
        private errorHandler: ErrorHandlerService
    ) {}

    /** Fetches prescription tied to service request */
    fetchServiceRequestPrescription() {
        this.dataLayer
            .list('prescriptions', {
                service_request: this.serviceRequestId,
            })
            .subscribe({
                next: this.receivePrescription,
                error: this.handleError,
            });
    }

    receivePrescription = response => {
        this.prescription = response.results;
    };

    handleError = err => {
        this.errorHandler.handleError(err, this);
    };

    ngOnInit() {
        this.serviceRequestId = this.uiglobals.params.service_request;
        this.fetchServiceRequestPrescription();
    }
}

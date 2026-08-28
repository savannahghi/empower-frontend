import { Component, OnInit } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { UIRouterGlobals } from '@uirouter/angular';
import { SinglePrescriptionModel } from '../../models/Prescription.model';
/**
 * Component that is used to create the Patient Medication Requests Page
 *
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-patient-medication-request',
    templateUrl: './patient-medication-request.component.html',
    styleUrl: './patient-medication-request.component.scss',
    standalone: false,
})
/**
 * Class that creates the Patient Medication Requests component
 */
export class PatientMedicationRequestComponent implements OnInit {
    /**
     * Shows the loading of the medication request
     */
    loading: boolean = true;
    /**
     * Medication Request data
     */
    medicationRequest: SinglePrescriptionModel;

    /**
     * The component constructor
     * @param datalayer Injects an instance of the SilStoresService
     * @param uiglobals Access instance of UIRouterGlobals
     * @param errorHandler Access instance of ErrorHandlerService
     */
    constructor(
        public dataLayer: SilStoresService,
        public uiglobals: UIRouterGlobals,
        public errorHandler: ErrorHandlerService
    ) {}
    /**
     * Function that resolves a successfule api call
     * @param response
     */
    resolveResponseResolver = (response: SinglePrescriptionModel) => {
        this.medicationRequest = response;
        this.loading = false;
    };
    /**
     * Function used to solve the error response
     * @param err api error response
     */

    errorResponseResolver = err => {
        this.errorHandler.handleError(err, this);
        this.loading = false;
    };
    /**
     * gets the medication request by a request Id
     */
    getMedicationRequest() {
        this.dataLayer
            .get('prescriptions', this.uiglobals.params?.request_id)
            .subscribe({
                next: this.resolveResponseResolver,
                error: this.errorResponseResolver,
            });
    }
    /**
     * Lifecycle hook that is called when the component is initialized
     */
    ngOnInit(): void {
        this.getMedicationRequest();
    }
}

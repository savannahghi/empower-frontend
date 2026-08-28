import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import moment from 'moment';
import { VisitService } from '../../visits/visit.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterModule } from '@uirouter/angular';

@Component({
    selector: 'ngx-consultation-service-request',
    imports: [UIRouterModule],
    templateUrl: './consultation-service-request.component.html',
    styleUrl: './consultation-service-request.component.scss',
})
export class ConsultationServiceRequestComponent implements OnInit, OnChanges {
    constructor(
        public visitService: VisitService,
        public dataLayer: SilStoresService,
        public authConfig: Authorization,
        private errorHandler: ErrorHandlerService
    ) {}

    /** stores visit details */
    @Input() visit: any;

    /** checks if clinical ids are save to localstorage */
    isClinicalIdsSaved: any = {};

    /** stores the active service request */
    activeServiceRequest: any;

    loadingPatientDetails: boolean = false;

    /** stores patient's visit date */
    visitDate: any;

    /**
     * Contains visit information resolved from the state
     */
    @Input() visitObservable: any;

    /**
     * Contains patient information
     */
    patient: any;

    /** stores the patient's visit status */
    patientVisitStatus: any;

    // get visit details, contains patient details
    getVisitInfo() {
        if (this.visit?.id) {
            /** get the most recent service request the patient is in */
            this.activeServiceRequest = this.visit.service_requests[0];
            /** get patient visit status */
            this.patientVisitStatus = this.visit.status;
            this.visitDate = moment(this.visit?.start).format('YYYY-MM-DD');
        }
    }

    /** Observable that waits for patient data to be defined */
    visitPatientObservable() {
        this.loadingPatientDetails = true;
        this.visitService.visitPatientDataEmitter.subscribe(patient => {
            this.loadingPatientDetails = true;
            this.patient = undefined;
            setTimeout(() => {
                this.patient = patient;
                if (this.patient.clinical_id) {
                    this.checkClinicalIdsSaved();
                }
                this.loadingPatientDetails = false;
            }, 500);
        });
    }

    checkClinicalIdsSaved() {
        if (
            this.isClinicalIdsSaved === null ||
            this.isClinicalIdsSaved?.clinical_facility_id === null ||
            this.isClinicalIdsSaved?.clinical_org_id === null ||
            typeof this.isClinicalIdsSaved !== 'object'
        ) {
            this.refetchClinicalIds();
        }
    }

    /* refetches clinicals incase not fetched due to missing auth headers during authenticatioin */
    refetchClinicalIds() {
        this.dataLayer.list('userProfile').subscribe({
            next: this.handProfileFetch,
            error: this.handleError,
        });
    }

    /** Handle profile fetch */
    handProfileFetch = (response: any) => {
        const ids = {
            clinical_facility_id: response?.clinical_facility_id,
            clinical_org_id: response?.clinical_org_id,
        };
        /** setup clinical ids */
        this.authConfig.setClinicalIds(ids);
        this.isClinicalIdsSaved = JSON.parse(
            localStorage.getItem(this.authConfig.USER_CLINICAL_IDS)
        );
    };

    handleError = err => {
        this.errorHandler.handleError(err, this);
    };

    ngOnInit() {
        this.isClinicalIdsSaved = JSON.parse(
            localStorage.getItem('auth.config.clinicalIds')
        );
        this.getVisitInfo();

        this.visitPatientObservable();
    }

    /**
     * OnChanges lifecycle hooks that detects when the inputs have changed
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.visit !== undefined) {
            this.visit = undefined;
            this.visit = changes.visit.currentValue;
            this.getVisitInfo();
        }
    }
}

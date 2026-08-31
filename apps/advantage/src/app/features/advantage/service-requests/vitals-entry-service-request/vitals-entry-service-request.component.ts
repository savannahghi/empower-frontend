import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import moment from 'moment';
import { VisitService } from '../../visits/visit.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ClinicalRecordsModule } from '../../clinical-records/clinical-records.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ngx-vitals-entry-service-request',
    imports: [
        NbCardModule,
        NgxSkeletonLoaderModule,
        ClinicalRecordsModule,
        CommonModule,
    ],
    templateUrl: './vitals-entry-service-request.component.html',
    styleUrl: './vitals-entry-service-request.component.scss',
})
export class VitalsEntryServiceRequestComponent implements OnInit, OnChanges {
    constructor(
        public visitService: VisitService,
        public dataLayer: SilStoresService,
        public authConfig: Authorization,
        private errorHandler: ErrorHandlerService
    ) {}

    /** checks if clinical ids are save to localstorage */
    isClinicalIdsSaved: any = {};

    /** stores the active service request */
    activeServiceRequest: any;

    isAddVital: boolean = false;

    loadingVitals: boolean = false;

    loadingPatientDetails: boolean = false;

    /** stores visit details */
    @Input() visit: any;

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

    /** patients vitals */
    patientVitals: any[] = [
        {
            id: 'weight',
            name: 'Weight',
            units: 'kg',
            concept: 'WEIGHT',
            vitalReference: '',
        },
        {
            id: 'height',
            name: 'Height',
            units: 'cm',
            concept: 'HEIGHT',
            vitalReference: '',
        },
        {
            id: 'bmi',
            name: 'Body Mass Index',
            units: 'kg/m2',
        },
        {
            id: 'pulse',
            name: 'Pulse',
            units: 'BPM',
            concept: 'PULSE_RATE',
            vitalReference: 'PULSE_RATE',
        },
        {
            id: 's_bp',
            name: 'Systolic Blood Pressure',
            units: 'mmHg',
            concept: 'BLOOD_PRESSURE',
            vitalReference: 'SYSTOLIC_BLOOD_PRESSURE',
        },
        {
            id: 'd_bp',
            name: 'Diastolic Blood Pressure',
            units: 'mmHg',
            concept: 'DIASTOLIC_BLOOD_PRESSURE',
            vitalReference: 'DIASTOLIC_BLOOD_PRESSURE',
        },
        {
            id: 'temperature',
            name: 'Temperature',
            units: '°C',
            concept: 'TEMPERATURE',
            vitalReference: 'TEMPERATURE',
        },
        {
            id: 'oxygenSaturation',
            name: 'Oxygen Saturation',
            units: '%',
            concept: 'OXYGEN_SATURATION',
            vitalReference: 'SPO2',
        },
        {
            id: 'respirationRate',
            name: 'Respiration Rate',
            units: '%',
            concept: 'RESPIRATORY_RATE',
            vitalReference: 'RESPIRATION_RATE',
        },
        {
            id: 'muac',
            name: 'Mid-Upper Arm Circumference',
            units: 'mm',
            concept: 'MUAC',
            vitalReference: 'MUAC',
        },
    ];

    /** Observable that waits for patient data to be defined */
    visitPatientObservable() {
        this.loadingPatientDetails = true;
        this.visitService.visitPatientDataEmitter.subscribe({
            next: this.receivePatient,
        });
    }

    /** receive patient */
    receivePatient = patient => {
        this.loadingPatientDetails = true;
        this.patient = undefined;
        setTimeout(() => {
            this.patient = patient;
            if (this.patient.clinical_id) {
                this.checkClinicalIdsSaved();
            }
            this.loadingPatientDetails = false;
        }, 500);
    };

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

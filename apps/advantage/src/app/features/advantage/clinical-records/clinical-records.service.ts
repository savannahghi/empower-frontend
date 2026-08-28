/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Subject, Subscription } from 'rxjs';
import moment from 'moment';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../@core/auth/services/authorization.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})
/**
 * Class that helps with visit management
 */
export class ClinicalRecordsService {
    /** stores height info */
    height: any;

    /** stores weight info */
    weight: any;

    /**
     * Used to store a result after using the query
     */
    result: { id: string; value: number; timeRecorded: string } = {
        id: undefined,
        value: undefined,
        timeRecorded: undefined,
    };

    /** stores start visit date */
    startVisitDate: any;

    /** stores bmi info */
    calculatedBMI: any;

    /** stores activeServiceRequest info */
    activeServiceRequest: any;

    /** stores patient info */
    patient: any;

    vitalReferenceCondition: any;

    /** Emits the patient info */
    patientDataEmitter: Subject<any> = new Subject();

    /** Emits the activeServiceRequest info */
    activeServiceRequestDataEmitter: Subject<any> = new Subject();

    /** Emits the patient info */
    bmiDataEmitter: Subject<any> = new Subject();

    querySubscription: Subscription;

    loadingResult: boolean = true;

    /** checks if clinical ids are save to localstorage */
    isClinicalIdsSaved: any = {};

    bmiOptions = {
        id: 'bmi',
        name: 'Body mass index',
        units: 'kg/m2',
        concept: 'BMI',
        vitalReference: 'BMI',
    };

    /** holds all the clinical notes data */
    private allClinicalNotes: { [id: string]: any[] } = {};

    /**
     instantiates class
     */
    constructor(
        protected toastrService: NbToastrService,
        public dataLayer: SilStoresService,
        public authUrlConfig: Authorization
    ) {
        this.result = {
            id: undefined,
            value: undefined,
            timeRecorded: undefined,
        };
        this.patientDataEmitter.subscribe(value => {
            this.patient = value;
        });
        this.activeServiceRequestDataEmitter.subscribe(value => {
            this.activeServiceRequest = value;
        });
    }

    setHeight(result: any, id: string, encounterID: string, edit: any): void {
        if (this.result.value === undefined && !edit.isEditing) {
            this.getBMIRes(encounterID);
        }

        if (id === 'height' && edit.isEditing) {
            this.height = result.height;
            setTimeout(() => {
                this.calculateBMILocal();
            }, 700);
        }

        if (id === 'height' && !edit.isEditing) {
            this.height = result.value;
            // incase of any change in height calculate BMI
            setTimeout(() => {
                this.calculateBMILocal();
            }, 700);
        }
    }

    setWeight(result: any, id: string, encounterID: string, edit: any): void {
        if (this.result.value === undefined && !edit.isEditing) {
            this.getBMIRes(encounterID);
        }

        if (id === 'weight' && edit.isEditing) {
            this.weight = result.weight;
            setTimeout(() => {
                this.calculateBMILocal();
            }, 700);
        }

        if (id === 'weight' && result.value !== undefined && !edit.isEditing) {
            this.weight = result.value;
            // incase of any change in weight calculate BMI
            setTimeout(() => {
                this.calculateBMILocal();
            }, 700);
        }
    }

    setPatient(patient, activeServiceRequest) {
        this.patient = patient;
        this.activeServiceRequest = activeServiceRequest;
        this.patientDataEmitter.next(this.patient);
        this.activeServiceRequestDataEmitter.next(this.activeServiceRequest);
    }

    calculateBMILocal() {
        if (this.weight && this.height) {
            this.calculatedBMI = this.calculateBMIData();
        }

        if (
            (this.result.value !== undefined &&
                this.result.value > this.calculatedBMI &&
                this.height &&
                this.weight) ||
            (this.result.value !== undefined &&
                this.result.value < this.calculatedBMI &&
                this.height &&
                this.weight)
        ) {
            this.updateBMIRes(this.calculatedBMI);
            return;
        } else if (
            this.result.value === undefined &&
            this.weight &&
            this.height
        ) {
            this.saveBMIRes(this.calculatedBMI);
        }
    }

    /** Calculate bmi formula */
    calculateBMIData() {
        const bmi = (this.weight / Math.pow(this.height / 100, 2)).toFixed(1);
        return bmi;
    }

    /** get bmi response from server */
    getBMIRes(encounterID: string) {
        if (this.patient && encounterID) {
            const params = {
                encounter_id: encounterID,
                concept: this.bmiOptions.concept,
                patient_id: this.patient.clinical_id,
            };
            this.dataLayer.get('observations', null, params).subscribe({
                next: (res: any) => {
                    this.handleBMIRes(res);
                },
            });
        }
    }

    /**
     * handles successfull BMI api response
     * @param res response object from the api
     */
    handleBMIRes = (res: any) => {
        this.loadingResult = true;
        if (res.totalCount > 0) {
            this.result.id = res.edges[0].node.id;
            this.result.value = res.edges[0].node.value;
            this.result.timeRecorded = moment(
                res.edges[0].node.timeRecorded
            ).format('hh:mm A');
            this.getBMIVitalReference(this.result.value);
        } else {
            this.result = {
                id: undefined,
                value: undefined,
                timeRecorded: undefined,
            };
        }
        this.loadingResult = false;
    };

    /** gets vital reference */
    getBMIVitalReference(result) {
        this.patient?.vitals_reference_ranges[
            `${this.bmiOptions.vitalReference}`
        ]
            .filter(item => item.start <= result && result < item.end)
            .map((vital: any) => {
                this.vitalReferenceCondition = vital.display;
            });
        return this.vitalReferenceCondition;
    }

    /** save bmi data to the server */
    saveBMIRes(bmi) {
        this.loadingResult = true;
        const payload = {
            status: 'FINAL',
            encounterID: this.activeServiceRequest.encounter_id,
            value: bmi,
            concept: 'BMI',
        };
        this.dataLayer.create('observations', payload).subscribe({
            next: (res: any) => {
                this.loadingResult = false;
                this.handleBMIRes(res);
            },
            error: err => {
                this.loadingResult = false;
                this.handleError(err);
            },
        });
    }

    /** update/patch bmi data */
    updateBMIRes(bmi) {
        this.loadingResult = true;
        const payload = {
            observationType: 'BMI',
            value: bmi,
        };
        this.dataLayer
            .update('observations', `/${this.result.id}`, payload, null, true)
            .subscribe({
                next: (res: any) => {
                    this.result.id = res.id;
                    this.result.value = res.value;
                    this.result.timeRecorded = moment(res.timeRecorded).format(
                        'hh:mm A'
                    );
                    this.getBMIVitalReference(this.result.value);
                    this.loadingResult = false;
                },
                error: err => {
                    this.loadingResult = false;
                    this.handleError(err);
                },
            });
    }

    /**
     * handles error responses from an api call
     * @param error error response object
     */
    handleError = error => {
        this.showToastError('bottom-right', 'danger', 'Error', error.message);
        this.loadingResult = false;
    };

    /**
     * Method used to display a toast error message
     */
    showToastError(position, status, msg, context) {
        const duration = 7000;
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    /* refetches clinicals incase not fetched due to missing auth headers during authenticatioin */
    refetchClinicalIds() {
        this.dataLayer.list('userProfile').subscribe({
            next: (response: any) => {
                const ids = {
                    clinical_facility_id: response?.clinical_facility_id,
                    clinical_org_id: response?.clinical_org_id,
                };
                /** setup clinical ids */
                this.authUrlConfig.setClinicalIds(ids);
                this.isClinicalIdsSaved = JSON.parse(
                    localStorage.getItem(this.authUrlConfig.USER_CLINICAL_IDS)
                );
            },
        });
    }
}

import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    EventEmitter,
    Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { PageComponent } from '../../../../shared/page/page.component';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { AnalyticsService } from '../../../../@core/utils';
import { ClinicalRecordsService } from '../clinical-records.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

interface AddPatientToQueue {
    status: string;
    activeServiceRequestID: string;
    isClinical: boolean;
}

interface PatchVitalObj {
    observationType: string;
    value: string;
}

interface vitalObjPayload {
    concept: string;
    status: string;
    encounterID: string;
    value: string;
    note: string;
}

@Component({
    selector: 'vital-result',
    templateUrl: './vital-result.component.html',
    styleUrls: ['./vital-result.component.scss'],
    standalone: false,
})
export class VitalResultComponent
    extends PageComponent
    implements OnInit, OnDestroy
{
    /**
     * Creates a cubejs client to fetch data
     * @param cubejs Create an instance of the cubejs service.
     */
    constructor(
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public analytics: AnalyticsService,
        public authUrlConfig: Authorization,
        public errorHandler: ErrorHandlerService,
        public clinicalRecordsService: ClinicalRecordsService,
        public dataLayer: SilStoresService
    ) {
        super(toastrService, uiglobals, $state, analytics);
    }

    /**
     * Used to define the score card's background color
     */
    @Input() styleClass: string;

    querySubscription: Subscription;

    /** stores vital static details i.e units, nested queries */
    @Input() vital: any;

    /** stores the patient's visit start date  */
    @Input() visitDate: Date;

    /** holds the vtial concept variable */
    @Input() concept: string;
    /**
     * Used to send query to cube and get results
     */
    @Input() variables: object | any;

    @Input() patient: any;

    /** stores the current active service request the patient is in */
    @Input() activeServiceRequest: any;

    @Input() patientVisitStatus: any;

    /** emits event to serve patient from
     * child(vital-result) to parent(clinical-records) component
     * */
    @Output() servePatient? = new EventEmitter<AddPatientToQueue>();

    /**
     * sends event to ClinicaRecords parent component to show/hide send patient to service point modal
     */
    @Output() toggleServicePointModalEvent: EventEmitter<any> =
        new EventEmitter<any>();

    /** stores visit info */
    @Input() visit: any;

    @Input() isVisitDatePassed: boolean;

    /** is editting vital */
    isEditing: boolean = false;

    vitalHeading: any;

    height: any;

    weight: any;

    model: any;

    /** stores vital reference condition i.e Normal/High/Low */
    vitalReferenceCondition: any;

    /** active modal id */
    toggleId: any;

    @Input() isAddVital: boolean;

    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    /**
     * Used to store a result after using the query
     */
    result: { id: string; value: string; timeRecorded: string };

    /** handles add vital modal state */
    showAddModal: boolean = false;

    /** handles edit vital modal state */
    showEditModal: boolean = false;

    /**
     * Used to show that the component is loading
     *  */
    loadingResult: boolean = true;

    /**
     * Mapping for the vitals concepts
     */
    vitalConceptMap: { [key: string]: string } = {
        pulse: 'PULSE_RATE',
        s_bp: 'BLOOD_PRESSURE',
        d_bp: 'DIASTOLIC_BLOOD_PRESSURE',
        temperature: 'TEMPERATURE',
        oxygenSaturation: 'OXYGEN_SATURATION',
        respirationRate: 'RESPIRATORY_RATE',
        weight: 'WEIGHT',
        height: 'HEIGHT',
        muac: 'MUAC',
        viralLoad: 'VIRAL_LOAD',
    };

    /** emit serve patient modal event */
    emitToggleServicePointModal() {
        this.toggleServicePointModalEvent.emit('toggle service point modal');
    }

    /**
     * Gets the Scorecard data.
     */
    getResult() {
        if (!this.evaluateClinicalIds()) {
            this.loadingResult = false;
            return;
        }

        const params = {
            concept: this.concept,
            patient_id: this.patient.clinical_id,
            encounter_id: this.activeServiceRequest.encounter_id,
        };

        this.dataLayer.get('observations', null, params).subscribe({
            next: (res: any) => {
                if (res.totalCount > 0) {
                    const observationObj = res.edges[0].node;
                    this.handleObsResponse(observationObj);
                } else {
                    this.loadingResult = false;
                }
            },
            error: err => {
                this.handleObsError(err);
            },
        });
    }

    /**
     * Evaluate clinical ids before fetching data
     * @returns
     */
    evaluateClinicalIds() {
        return (
            this.clinicalRecordsService.isClinicalIdsSaved !== null &&
            this.concept &&
            this.clinicalRecordsService.isClinicalIdsSaved
                .clinical_facility_id !== null &&
            this.activeServiceRequest?.encounter_id
        );
    }

    /**
     * Used to separate login of resultset from main card function.
     * @param resultSet Response from cubejs API.
     */
    resultSetFxn = data => {
        const res = data[`${this.vital.nestedResponse}`];
        this.result.id = res.edges[0].node.id;
        this.result.value = res.edges[0].node.value;
        this.result.timeRecorded = moment(
            res.edges[0].node.timeRecorded
        ).format('hh:mm A');
        this.loadingResult = false;
    };

    /** emits and event to transition patient/serve to IN_PROGRESS and get the current service request encounter_id*/
    transitionPatient(value: AddPatientToQueue) {
        this.servePatient.emit(value);
    }

    /** toggle payment modal */
    addToggleModal(context) {
        if (
            this.activeServiceRequest?.encounter_id &&
            this.activeServiceRequest.status === 'WAITING'
        ) {
            /** transition patient to IN_PROGRESS service request status */
            this.transitionPatient({
                status: 'WAITING',
                activeServiceRequestID: this.activeServiceRequest.id,
                isClinical: true,
            });
        }
        this.toggleId = context.id;
        this.vitalHeading = `Add ${context?.name}`;
        this.toggle[context.id] = !this.toggle[context.id];
        this.showAddModal = !this.showAddModal;
    }

    updateToggleModal(context, event) {
        this.isEditing = !this.isEditing;
        this.toggleId = context.id;
        this.vitalHeading = `Edit ${context?.name}`;
        this.toggle[context.id] = !this.toggle[context.id];
        this.model = event;
        this.showEditModal = !this.showEditModal;
    }

    /** get vital reference */
    getPatientVitalReference(result) {
        if (this.vital.vitalReference) {
            this.patient?.vitals_reference_ranges[
                `${this.vital.vitalReference}`
            ]
                .filter(
                    item =>
                        item.start <= result.value && result.value < item.end
                )
                .map((vital: any) => {
                    this.vitalReferenceCondition = vital.display;
                });
            return this.vitalReferenceCondition;
        }
    }

    /**
     *  add a patient vital item
     */
    addPatientVitalItem(model) {
        const vital = Object.keys(model).find(key => model[key] !== undefined);
        const concept = this.vitalConceptMap[vital];

        if (!this.activeServiceRequest?.encounter_id) {
            this.showToastError(
                'bottom-right',
                'danger',
                'Error',
                'No active encounter found'
            );
            return;
        }

        const encounterID = this.activeServiceRequest.encounter_id;

        if (concept) {
            const payload: vitalObjPayload = {
                concept,
                status: 'FINAL',
                encounterID,
                value: model[`${vital}`],
                note: model['note'],
            };
            this.loadingResult = true;
            this.dataLayer.create('observations', payload).subscribe({
                next: (response: any) => {
                    this.handleObsResponse(response);
                },
                error: (err: any) => {
                    this.handleObsError(err);
                },
            });
        }
    }

    /**
     *  edit a patient vital item
     */
    editPatientVitalItem(model) {
        const vitalId = this.vital.id;
        const concept = this.vitalConceptMap[vitalId];

        if (concept && model.hasOwnProperty(vitalId)) {
            const patchObj: PatchVitalObj = {
                observationType: concept,
                value: model[vitalId],
            };

            this,
                this.dataLayer
                    .update('observations', `/${model.id}`, patchObj)
                    .subscribe({
                        next: (res: any) => {
                            this.handleObsResponse(res);
                        },
                        error: (err: any) => {
                            this.handleObsError(err);
                        },
                    });
        }
    }

    /**
     * handles observation api successfull response
     * @param resObj The observation response object
     *
     */
    handleObsResponse(resObj: any) {
        this.result.id = resObj.id;
        this.result.value = resObj.value;
        this.result.timeRecorded = moment(resObj.timeRecorded).format(
            'hh:mm A'
        );
        if (
            (this.vital?.id === 'height' || this.vital?.id === 'weight') &&
            resObj?.value
        ) {
            this.determineVitalsForBmi(this.vital, this.result, {
                isEditing: false,
            });
        }
        this.getPatientVitalReference(this.result);
        this.toggle = {};
        this.showAddModal = false;
        this.loadingResult = false;
    }

    /**
     * handles observation error response
     * @param err An error object
     */
    handleObsError(err) {
        this.showToastError('bottom-right', 'danger', 'Error', err?.message);
        this.errorHandler.handleError(err);
        this.loadingResult = false;
    }

    /** set vitals for BMI to the clinicalRecordsService */
    determineVitalsForBmi(vital, result, isEdit: Object) {
        vital.id === 'height'
            ? this.clinicalRecordsService.setHeight(
                  result,
                  vital.id,
                  this.activeServiceRequest.encounter_id,
                  isEdit
              )
            : this.clinicalRecordsService.setWeight(
                  result,
                  vital.id,
                  this.activeServiceRequest.encounter_id,
                  isEdit
              );
    }

    /**
     * Hook that is called when the component is initialized
     */
    ngOnInit() {
        this.result = {
            id: undefined,
            value: undefined,
            timeRecorded: undefined,
        };

        this.loadingResult = false;

        if (this.patient && this.patient.clinical_id) {
            this.loadingResult = true;

            if (this.activeServiceRequest) {
                this.clinicalRecordsService.setPatient(
                    this.patient,
                    this.activeServiceRequest
                );
            } else {
                this.clinicalRecordsService.setPatient(this.patient, {});
            }

            const saved = this.checkClinicalIdsSaved();
            this.handleSaved(saved);
        }
    }

    handleSaved(saved) {
        if (!saved) {
            this.clinicalRecordsService.refetchClinicalIds();
            return;
        }

        if (saved && this.vital && this.vital.id !== 'bmi') {
            this.getResult();
        }

        if (
            saved &&
            this.vital &&
            this.vital.id === 'bmi' &&
            this.activeServiceRequest?.encounter_id
        ) {
            this.clinicalRecordsService.getBMIRes(
                this.activeServiceRequest.encounter_id
            );
        }
    }

    /* checks if clinical IDs are saved and gets patient vitals */
    checkClinicalIdsSaved(): boolean {
        this.clinicalRecordsService.isClinicalIdsSaved = JSON.parse(
            localStorage.getItem(this.authUrlConfig.USER_CLINICAL_IDS)
        );

        return this.handleClinicalIdsSaved(
            this.clinicalRecordsService.isClinicalIdsSaved
        );
    }

    handleClinicalIdsSaved(isClinicalIdsSaved) {
        if (
            isClinicalIdsSaved === null ||
            isClinicalIdsSaved?.clinical_facility_id === null ||
            isClinicalIdsSaved?.clinical_org_id === null ||
            typeof isClinicalIdsSaved !== 'object'
        ) {
            this.clinicalRecordsService.refetchClinicalIds();
            setTimeout(() => {
                if (this.evaluateClinicalIds()) {
                    this.getResult();
                } else {
                    this.loadingResult = false;
                }
                return true;
            }, 1000);
        } else {
            if (this.evaluateClinicalIds()) {
                this.getResult();

                if (this.activeServiceRequest?.encounter_id) {
                    this.clinicalRecordsService.getBMIRes(
                        this.activeServiceRequest.encounter_id
                    );
                }
            } else {
                this.loadingResult = false;
            }
            return true;
        }
    }

    ngOnDestroy() {
        this.clinicalRecordsService.height = null;
        this.clinicalRecordsService.weight = null;
        this.clinicalRecordsService.result = {
            id: undefined,
            value: undefined,
            timeRecorded: undefined,
        };
        this.clinicalRecordsService.calculatedBMI = undefined;
    }
}

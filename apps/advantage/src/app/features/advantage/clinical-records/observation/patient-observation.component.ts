import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    OnInit,
} from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { ClinicalRecordsService } from '../clinical-records.service';
import { ObservationInterface } from '../../models/ClinicalNotes';

@Component({
    selector: 'ngx-patient-observation',
    templateUrl: './patient-observation.component.html',
    styleUrl: './patient-observation.component.scss',
    standalone: false,
})
export class PatientObservationComponent implements OnChanges, OnInit {
    constructor(
        protected toastrService: NbToastrService,
        public dataLayer: SilStoresService,
        public clinicalRecordsService: ClinicalRecordsService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['templateName'] &&
            this.templateName &&
            this.templateName.id
        ) {
            this.fetchTemplateObservations();
        }
    }

    /** Holds template notes */
    @Input() templateName: any;

    /** stores the active service request */
    @Input() activeServiceRequest: any;

    /** stores the patient informationn */
    @Input() patient: any;

    /** Stores the loading state for each observation section */
    loadingResult: any = {};

    /** A list of observations that have been recorded for a specific visit */
    patientObservations: any[] = [];

    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;

    /** booleann to show observation modal */
    showObservationPreviewModal = false;

    /** stores the seleected observation */
    selectedObservation: ObservationInterface;

    /** The skika dialogue header for observationn modal */
    skikaDialogueHeader: string;

    /** toggles observationn form */
    observationFormHidden = true;

    /**
     * @description Maps concept name to their correspondinng FHIR observation concept enums
     * @type {object}
     */
    conceptMap: { [key: string]: string } = {
        bmi: 'BMI',
        diaBp: 'DIASTOLIC_BLOOD_PRESSURE',
        examination: 'GENERAL_EXAMINATION',
        family_history: 'FAMILY_AND_SOCIAL_HISTORY',
        social_history: 'FAMILY_AND_SOCIAL_HISTORY',
        chief_complaint: 'CHIEF_COMPLAINT',
        height: 'HEIGHT',
        history_of_present_illness: 'HISTORY_OF_PRESENTING_ILLNESS',
        muac: 'MUAC',
        oxygenSaturation: 'OXYGEN_SATURATION',
        past_medical_surgery_history: 'PAST_MEDICAL_AND_SURGICAL_HISTORY',
        pulse: 'PULSE_RATE',
        respirationRate: 'respirationRate',
        sysBp: 'BLOOD_PRESSURE',
        temperature: 'TEMPERATURE',
        weight: 'WEIGHT',
    };

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = 3000;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * creates a new observation resource
     * @param model A form model that contains the observation value and note
     */
    addPatientObservationItem(model: { value: string; note: string }) {
        this.loadingResult[this.templateName.id] = true;
        const concept = this.conceptMap[this.templateName.id];
        const observationPayload = {
            note: model.note,
            status: 'FINAL',
            value: model.value,
            concept: concept,
            encounterID: this.activeServiceRequest.encounter_id,
        };
        this.dataLayer.create('observations', observationPayload).subscribe({
            next: () => {
                this.loadingResult[this.templateName.id] = false;
                this.fetchTemplateObservations();
                this.showToast(
                    'bottom-right',
                    'success',
                    'Observation',
                    'Added observation'
                );
            },
            error: err => {
                this.loadingResult[this.templateName.id] = false;
                this.clinicalRecordsService.handleError(err);
            },
        });
    }

    /**
     * fetches the patient observations for specific template
     * @returns null
     */
    fetchTemplateObservations() {
        const queryParams = {
            patient_id: this.patient?.clinical_id,
            encounter_id: this.activeServiceRequest?.encounter_id,
            concept: this.conceptMap[this.templateName.id],
        };
        this.dataLayer.list('observations', queryParams).subscribe({
            next: (res: any) => {
                this.patientObservations = res.edges.map(
                    (edge: any) => edge.node
                );
                if (this.patientObservations.length > 0) {
                    this.observationFormHidden = true;
                    return;
                }
                this.observationFormHidden = false;
            },
            error: err => {
                this.clinicalRecordsService.handleError(err);
                this.observationFormHidden = false;
            },
        });
    }

    /**
     * toggles the observation preview modal
     */
    togglePreviewObservationModal(event?) {
        if (event) {
            this.skikaDialogueHeader = `Preview ${this.templateName?.name}`;
            this.selectedObservation = event;
        } else {
            this.selectedObservation = {};
        }
        this.showObservationPreviewModal = !this.showObservationPreviewModal;
    }

    /**
     * Displays or hides the observation form
     */
    toggleIsHidden() {
        this.observationFormHidden = !this.observationFormHidden;
    }

    cancelAddObservation() {
        return;
    }

    ngOnInit() {
        // Table rows
        this.rows = [
            {
                key: 'value',
                type: 'diagnosis_note',
                nested: [
                    {
                        label: '',
                        class: 'text-muted',
                        value: 'timeRecorded',
                        type: 'date',
                    },
                ],
            },
            {
                key: 'note',
                type: 'diagnosis_note',
            },
        ];

        this.tableHeader = [
            { text: 'Observation' },
            { text: 'Note' },
            { text: 'Date' },
        ];

        /**
         * Set the actions used for each row in the patient list table
         * */
        this.actions = this['actions'] = [
            {
                btnText: 'View',
                status: 'success',
                action: 'custom',
                modalConf: {
                    customFxn: true,
                },
            },
        ];
    }
}

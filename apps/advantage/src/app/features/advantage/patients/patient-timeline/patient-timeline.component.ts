import { Component, OnInit, Input } from '@angular/core';
import {
    NbCardModule,
    NbSpinnerModule,
    NbTagModule,
    NbToastrService,
} from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PatientService } from '../patient.service';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/core';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { AnalyticsService } from '../../../../@core/utils';
import { listAnimation } from '../../../../shared/animations/list-animations';
import _ from 'underscore';
import { PageComponent } from '../../../../shared/page/page.component';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../../@theme/theme.module';
import { NgxTranslateModule } from '../../../../shared/translate/translate.module';
import { StatusColorPipe } from '../../../../@theme/pipes';
import { PatientTimelineInterface } from '../../models/PatientTimeline';
import { VariantPipe } from '../../../../@theme/pipes/variant/variant.pipe';
import { finalize, timer } from 'rxjs';
import { SilDatatableModule } from '../../../../shared/sil-datatable/sil-datatable.module';

interface VitalConfig {
    displayName: string;
    unit: string;
    translationKey: string;
    hasReference?: boolean;
}

@Component({
    selector: 'patient-timeline',
    imports: [
        CommonModule,
        ThemeModule,
        NbCardModule,
        NbSpinnerModule,
        NbTagModule,
        NgxTranslateModule,
        StatusColorPipe,
        VariantPipe,
        SilDatatableModule,
    ],
    templateUrl: './patient-timeline.component.html',
    styleUrls: ['./patient-timeline.component.scss'],
    providers: [SilStoresService, PatientService],
    animations: [listAnimation],
})
export class PatientTimelineComponent extends PageComponent implements OnInit {
    /**
     * Defines loading state
     */
    loadingResult: boolean = true;

    /**
     * Defines loading state
     */
    loadingTimeline: boolean = true;

    /** patient attachments */
    patientTimeline: PatientTimelineInterface[];

    /** patient observations */
    observations: any[];

    /** patient observations */
    allergyIntolerances: any[];

    // patient vitals
    vitals: any[];

    /** stores an individual attachment */
    attachment: any;
    /**
     * full screen
     */
    fullscreen: boolean = false;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * Contains patient information
     */
    patient: any;
    /**
     * Pagination properties
     */
    paginationData: any = null;
    totalItems = 0;
    defaultPageSize = 100;
    /**
     * Contains the observable resolved from the state service
     */
    @Input() patientObservable: any;

    /** receives emitted event from sil-document-dialogue to close document dialogue */
    valueEmittedFromChildComponent: string = '';

    // Dynamic vital configuration mapping
    private vitalConfigs: { [key: string]: VitalConfig } = {
        'Body weight': {
            displayName: 'Weight',
            unit: 'kg',
            translationKey: 'patients.timeline_details.weight',
            hasReference: false,
        },
        'Body height': {
            displayName: 'Height',
            unit: 'cm',
            translationKey: 'patients.timeline_details.height',
            hasReference: false,
        },
        'Body mass index': {
            displayName: 'BMI',
            unit: 'kg/m²',
            translationKey: 'patients.timeline_details.bmi',
            hasReference: true,
        },
        'Body temperature': {
            displayName: 'Temperature',
            unit: '°C',
            translationKey: 'patients.timeline_details.temperature',
            hasReference: true,
        },
        'Systolic blood pressure': {
            displayName: 'Systolic BP',
            unit: 'mmHg',
            translationKey: 'patients.timeline_details.systolic',
            hasReference: true,
        },
        'Diastolic blood pressure': {
            displayName: 'Diastolic BP',
            unit: 'mmHg',
            translationKey: 'patients.timeline_details.diastolic',
            hasReference: true,
        },
        'Respiratory rate': {
            displayName: 'Respiratory Rate',
            unit: '/min',
            translationKey: 'patients.timeline_details.respiration',
            hasReference: true,
        },
        'Heart rate': {
            displayName: 'Heart Rate',
            unit: 'BPM',
            translationKey: 'patients.timeline_details.pulse',
            hasReference: true,
        },
        'Oxygen saturation in Arterial blood by Pulse oximetry': {
            displayName: 'SpO2',
            unit: '%',
            translationKey: 'patients.timeline_details.spO2',
            hasReference: true,
        },
        'Mid-upper arm circumference': {
            displayName: 'MUAC',
            unit: 'mm',
            translationKey: 'patients.timeline_details.muac',
            hasReference: true,
        },
    };

    // Reference mapping for vital ranges
    private vitalReferenceMap: { [key: string]: string } = {
        'Body mass index': 'BMI',
        'Heart rate': 'PULSE_RATE',
        'Respiratory rate': 'RESPIRATION_RATE',
        'Oxygen saturation in Arterial blood by Pulse oximetry': 'SPO2',
        'Systolic blood pressure': 'SYSTOLIC_BLOOD_PRESSURE',
        'Diastolic blood pressure': 'DIASTOLIC_BLOOD_PRESSURE',
        'Body temperature': 'TEMPERATURE',
        'Mid-upper arm circumference': 'MUAC',
    };

    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     * @param transition - Connects to the transition service
     * @param $state - Connects to the state service
     * @param uiglobals - Connects to the uiglobals service
     * @param patientService Access instance of the patient service
     * @param errorHandler - Connects to the error handler service
     * @param swalTargets - Connects to the sweetalert service
     * @param dataLayer - Connects to the data layer service
     */
    constructor(
        private dataLayer: SilStoresService,
        protected toastrService: NbToastrService,
        public analytics: AnalyticsService,
        public transition: Transition,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        public patientService: PatientService,
        private errorHandler: ErrorHandlerService,
        public readonly swalTargets: SwalPortalTargets
    ) {
        super(toastrService, uiglobals, $state, analytics);
    }
    /**
     * Handler for pagination events
     * @param paginationParams - The pagination parameters from the event
     */
    onPaginationChange(event: any): void {
        let apiParams: any = {};

        if (event.offset !== undefined && event.count !== undefined) {
            apiParams = {
                offset: event.offset,
                count: event.count,
            };

            if (event._getpages) {
                apiParams._getpages = event._getpages;
            }
        } else if (event.page !== undefined) {
            const newOffset = (event.page - 1) * this.defaultPageSize;
            apiParams = {
                offset: newOffset,
                count: this.defaultPageSize,
            };
        } else if (event.after || event.before) {
            return;
        }
        timer(200)
            .pipe(
                finalize(() => {
                    if (this.loadingTimeline) {
                        this.loadingTimeline = true;
                    }
                })
            )
            .subscribe();
        this.getPatientTimeline(apiParams);
    }

    /**
     * fetch patient's timeline
     * @param apiParams - API parameters including pagination
     */
    getPatientTimeline(apiParams?: any): void {
        if (!this.patient?.clinical_id) {
            this.loadingTimeline = false;
            return;
        }

        const defaultParams = {
            offset: 0,
            count: this.defaultPageSize,
        };

        const dataParams = {
            type: 'Observation,AllergyIntolerance,DiagnosticReport,Condition',
        };

        const finalParams = { ...defaultParams, ...apiParams, ...dataParams };

        this.dataLayer
            .listNested(
                'clinical-patient',
                'timeline',
                this.patient.clinical_id,
                finalParams,
                true
            )
            .pipe(finalize(() => (this.loadingTimeline = false)))
            .subscribe({
                next: this.handleTimelineResponse,
                error: this.handleTimelineError,
            });
    }

    /** Handle timeline response */
    handleTimelineResponse = (response: any): void => {
        this.paginationData = response;
        this.totalItems = response?.totalCount || 0;
        this.patientTimeline = this.groupTimelineByDate({
            data: {
                patientHealthTimeline: {
                    timeline: response?.timeline || [],
                },
            },
        });
    };

    /** Handle timeline error */
    handleTimelineError = error => {
        this.showToastError('bottom-right', 'danger', 'Error', error.message);
        this.loadingResult = false;
        this.loadingTimeline = false;
        this.errorHandler.handleError(error, this);
    };

    // Get vital configuration for display
    getVitalConfig(vitalName: string): VitalConfig | null {
        return this.vitalConfigs[vitalName] || null;
    }

    // Check if vital is supported for display
    isVitalSupported(vitalName: string): boolean {
        return !!this.vitalConfigs[vitalName];
    }

    /** get vital reference */
    getPatientVitalReference(observation): string | undefined {
        const vitalReference = this.vitalReferenceMap[observation.name];

        if (
            vitalReference &&
            this.patient?.vitals_reference_ranges?.[vitalReference]
        ) {
            const ranges = this.patient.vitals_reference_ranges[vitalReference];
            const matchingRange = ranges.find(
                item =>
                    item.start <= observation.value &&
                    observation.value < item.end
            );
            return matchingRange?.display;
        }
        return undefined;
    }

    groupTimelineByDate(res): PatientTimelineInterface[] {
        const timeline = res?.data?.patientHealthTimeline?.timeline;
        const dates = _.groupBy(timeline, 'date');
        /** Gets use the days from the timeline as an array */
        const dateKeys = Object.keys(dates);
        const newTimelineArray = [];
        /** Loops through each day in the timeline */
        for (let index = 0; index < dateKeys.length; index++) {
            const object = {};
            object['date'] = dateKeys[index];
            const dateGroups = _.groupBy(
                dates[dateKeys[index]],
                'resourceType'
            );

            if (dateGroups.Observation) {
                dateGroups.Laboratory = _.filter(
                    dateGroups.Observation,
                    function (observation) {
                        return (
                            observation.category === 'Laboratory' &&
                            observation.name !== ''
                        );
                    }
                );
                dateGroups.Exam = _.filter(
                    dateGroups.Observation,
                    function (observation) {
                        return (
                            observation.category === 'Exam' &&
                            observation.name !== ''
                        );
                    }
                );
                // Separate observations by category
                const vitalSigns = dateGroups.Observation.filter(
                    obs =>
                        obs.category === 'Vital Signs' &&
                        this.isVitalSupported(obs.name)
                );

                const laboratory = dateGroups.Observation.filter(
                    obs => obs.category === 'Laboratory' && obs.name !== ''
                );

                const exam = dateGroups.Observation.filter(
                    obs => obs.category === 'Exam' && obs.name !== ''
                );

                const clinicalNotes = dateGroups.Observation.filter(
                    obs => obs.category === 'Social History' && obs.name !== ''
                );

                // sort observations by timeRecorded
                vitalSigns.sort((a, b) =>
                    b.timeRecorded.localeCompare(a.timeRecorded)
                );
                laboratory.sort((a, b) =>
                    b.timeRecorded.localeCompare(a.timeRecorded)
                );
                exam.sort((a, b) =>
                    b.timeRecorded.localeCompare(a.timeRecorded)
                );
                clinicalNotes.sort((a, b) =>
                    b.timeRecorded.localeCompare(a.timeRecorded)
                );

                // Assign to object
                if (vitalSigns.length > 0) object['Observation'] = vitalSigns;
                if (laboratory.length > 0) object['Laboratory'] = laboratory;
                if (exam.length > 0) object['Exam'] = exam;
                if (clinicalNotes.length > 0)
                    object['clinicalNotes'] = clinicalNotes;
            }

            // Handle other resource types
            Object.keys(dateGroups).forEach(key => {
                if (key !== 'Observation') {
                    object[key] = dateGroups[key];
                }
            });

            newTimelineArray.push(object);
        }

        this.loadingTimeline = false;
        return newTimelineArray;
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    getPatientInfo() {
        /** Resolved observable from the state */
        if (this.patientObservable.person) {
            this.patient = this.patientObservable;
            this.getPatientTimeline({ offset: 0, count: this.defaultPageSize });
        } else {
            this.handlePatientObservable();
        }
    }

    handlePatientObservable() {
        this.patientObservable.subscribe({
            next: this.handlePatientObservableResponse,
            error: this.handlePatientObservableError,
        });
    }

    handlePatientObservableResponse = response => {
        this.patientService.setPatient(response);
        this.patient = response;
        this.getPatientTimeline({ offset: 0, count: this.defaultPageSize });
    };

    handlePatientObservableError = err => {
        this.errorHandler.handleError(err, this);
    };

    /** when component mounts */
    ngOnInit() {
        /** get patient info */
        this.getPatientInfo();
    }
}

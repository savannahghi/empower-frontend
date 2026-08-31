import { Component, Input, OnInit } from '@angular/core';
import { VisitService } from '../../visit.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'ngx-visit-patient-screening',
    templateUrl: './visit-patient-screening.component.html',
    styleUrls: ['./visit-patient-screening.component.scss'],
    standalone: false,
})
/**
 * This is the class definition of the component
 */
export class VisitPatientScreeningComponent implements OnInit {
    /**
     * @param visitService injects instance of the visit service
     * @param uiglobals injects the global values from ui router
     * @param datalayer Access instance of SilStoresService
     * @param errorHandler injects instance of the error handling service
     * @param $state injects instance of the state service
     */
    constructor(
        private visitService: VisitService,
        public uiglobals: UIRouterGlobals,
        public datalayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        public $state: StateService
    ) {}
    /**
     * Array of cancer screenings
     */
    cancerScreenings: Array<any> = [];
    /**
     * Validation Mappings of the various screenings
     */
    screeningMappings: Array<any> = [
        {
            name: 'Breast',
            encounterId: '',
            showFor: 'ALL',
        },
        {
            name: 'Cervical',
            encounterId: '',
            showFor: 'FEMALE',
        },
        {
            name: 'Prostate',
            encounterId: '',
            showFor: 'MALE',
        },
    ];
    /**
     * Contains visit Id
     */
    visitId: string;
    /**
     * Used to determine the user's selection
     */
    screeningOption: string = '';
    /**
     * Used to load next section action
     */
    loadingResult: boolean = false;

    /**
     * Used to show loading indicator
     */
    isLoading: boolean = true;

    /**
     * Contains queue to be used to start the new encounter
     */
    selectedQueue: object;

    /**
     * Contains the patient's screening information
     */
    patientData: any;
    /**
     * Contains all available queues for the screening process.
     */
    queues: any;
    /**
     * Checks if screening encounter is valid
     */
    encounterIsValid: boolean = true;
    /**
     * Contains visit information resolved from the state
     */
    @Input() visitObservable: any;

    /**
     * Observable that waits for patient screening data to be defined
     * - Loads patient screening data.
     * - Sets loading state based on data availability.
     * - Calls `getServicePointDetails` to map screening data to encounter IDs.
     */
    visitPatientObservable() {
        this.patientData = this.visitService.patientScreeningData;

        this.visitService.visitPatientScreeningDataEmitter.subscribe(
            patient => {
                this.patientData = patient;
                this.isLoading = false;
                if (patient?.servicePoints?.length) {
                    const patientGender = patient?.gender?.toUpperCase();
                    this.getServicePointDetails(
                        patient.servicePoints,
                        patientGender
                    );
                }
            }
        );
    }

    /**
     * Function used to get encounterID and service point from encounter Data
     * - Filters available screenings based on patient gender.
     * - Maps each screening option to an encounter ID if available.
     * - Navigates to the breast cancer screening page if available.
     * @param servicePoints visit's service points
     * @param patientGender the patient's gender
     */
    getServicePointDetails(servicePoints, patientGender) {
        this.cancerScreenings = this.screeningMappings
            .filter(sm => sm.showFor === 'ALL' || patientGender === sm.showFor)
            .map(sm => {
                const servicePt = servicePoints.find(
                    sp => sp.queue_name === `${sm.name} Cancer Screening`
                );

                const defaultServicePt = servicePoints.find(
                    sp => sp.queue_name === 'Cancer Screening'
                );

                return {
                    name: sm.name,
                    encounterId:
                        servicePt?.encounterID ?? defaultServicePt?.encounterID,
                };
            });

        // Automatically navigate to breast cancer screening if available
        this.$state.go('^.screening.breast_cancer', {
            id: this.visitId,
            encounter_id: this.cancerScreenings.find(
                screening => screening.name === 'Breast'
            )?.encounterId,
        });
    }

    /**
     * Hook called when component is initialized
     * - Loads visit data and initializes the screening state.
     * - Handles errors if visit data cannot be retrieved.
     */
    ngOnInit() {
        this.encounterIsValid = true;
        this.visitId = this.uiglobals.params.id;

        /** Fetch patient information */
        this.visitPatientObservable();

        /** Resolved observable from the state */
        this.visitObservable.subscribe(
            (response: any) => {
                const visit = response;
                this.visitService.setVisitData(visit);
                this.$state.go('^.screening.breast_cancer', {
                    id: this.visitId,
                    encounter_id: this.cancerScreenings.find(
                        screening => screening.name === 'Breast'
                    )?.encounterId,
                });
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }

    /**
     * Navigates to the start visit page for the current patient.
     */
    startNewVisit() {
        if (this.patientData?.patient_id) {
            this.$state.go('app.advantage.visits.start_visit', {
                id: this.patientData.patient_id,
            });
        }
    }
}

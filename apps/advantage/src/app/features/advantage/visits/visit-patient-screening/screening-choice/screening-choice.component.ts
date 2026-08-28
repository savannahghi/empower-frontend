import { Component, Input, OnInit } from '@angular/core';
import { VisitService } from '../../visit.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { StateService } from '@uirouter/angular';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

/**
 * Interface defining the structure for tracking different screening statuses
 * - each property represents a cancer screening type with its corresponding status message
 */
interface ScreeningStatuses {
    Breast: string;
    Cervical: string;
    Prostate: string;
}

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'ngx-screening-choice',
    templateUrl: './screening-choice.component.html',
    styleUrls: ['./screening-choice.component.scss'],
    standalone: false,
})
/**
 * This is the class definition of the component
 */
export class ScreeningChoiceComponent implements OnInit {
    /**
     * @param visitService injects instance of the visit service
     * @param datalayer Access instance of SilStoresService
     * @param errorHandler injects instance of the error handling service
     * @param $state injects instance of the state service
     */
    constructor(
        private visitService: VisitService,
        public datalayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        public $state: StateService,
        public analytics: AnalyticsService
    ) {}
    /**
     * Used to determine the user's selection
     * Possible values include 'CERVICAL', 'BREAST', 'PROSTATE'
     */
    screeningOption: string = '';
    /**
     * Used to load next section action
     */
    loadingResult: boolean = false;
    /**
     * Sets age warning
     */
    showAgeWarning: boolean = false;
    /**
     * Displays cta or age warning message
     */
    ctaMsg: string = 'Select one screening form to proceed';
    /**
     * Contains queue to be used to start the new encounter
     */
    selectedQueue: object;
    /**
     * Text mappings used to d
     */
    textMaps = {
        PENDING: 'is pending',
        WAITING: 'is pending',
        IN_PROGRESS: 'is in progress',
        COMPLETED: 'has been done',
        ON_HOLD: 'is on hold',
        REVOKED: 'has been revoked',
    };

    /**
     * Object uses to show the status of the performed screenings
     */
    screeningStatuses: ScreeningStatuses = {
        Breast: '',
        Cervical: '',
        Prostate: '',
    };

    /**
     * Checks if ther patient is Male and disqualifes the patient
     */
    isMale: boolean = true;
    /**
     * Contains the patient's screening information
     */
    patientData: any;
    /**
     * Contains all queues
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
     * Default style state for the screening cards
     */
    defaultStyle = {
        fill1: '#F5F6F7',
        fill2: '#F0F0F0',
        fill3: '#E0E0E0',
        fillOpacity1: '0.5',
        fillOpacity2: '1',
    };
    /**
     * Style state for the screening cards once clicked
     */
    activeStyle = {
        fill1: '#F4EBF4',
        fill2: '#8C3B8C',
        fill3: '#8C3B8C',
        fillOpacity1: '1',
        fillOpacity2: '0.3',
    };

    /**
     * Array defining available cancer screening options with their properties
     * - each object contains id, title, gender applicability, and image paths
     */
    cancerScreenings = [
        {
            id: 'CERVICAL',
            title: 'Cervical Cancer Screening',
            showFor: 'FEMALE',
            defaultImage:
                '../../../../../../assets/images/cervical-screening.svg',
            activeImage:
                '../../../../../../assets/images/cervical-screening-active.svg',
        },
        {
            id: 'BREAST',
            title: 'Breast Cancer Screening',
            showFor: 'ALL',
            defaultImage: '../../../../../../assets/images/breast_default.svg',
            activeImage: '../../../../../../assets/images/breast_active.svg',
        },
    ];

    /**
     * Function used to check visit's validity
     */
    checkEncounter() {
        const patientData = this.patientData;

        if (['CANCELLED'].includes(patientData?.visit_status)) {
            this.encounterIsValid = false;
            this.ctaMsg = `This Visit is ${patientData.visit_status.toLowerCase()}, please start a new visit to proceed with screening`;
            return;
        }

        if (this.screeningOption === 'CERVICAL' && patientData.age > 64) {
            this.showAgeWarning = true;
            this.ctaMsg =
                'The patient is over 65 years, cervical cancer screening is not recommended';
        } else {
            this.ctaMsg = '';
            this.encounterIsValid = true;
            this.showAgeWarning = false;
        }
    }

    /**
     * Function used to determine the statuses of the performed screenings
     * @param servicePoints visit service points
     */
    checkScreeningStatus(servicePoints) {
        this.cancerScreenings.forEach(screening => {
            const queueName = `${screening.id.charAt(0)}${screening.id
                .slice(1)
                .toLowerCase()}`;
            const queue = servicePoints.find(
                sp => sp.queue_name === `${queueName} Cancer Screening`
            );
            if (queue) {
                this.screeningStatuses[
                    queueName
                ] = `${queueName} Cancer Screening ${
                    this.textMaps[queue?.status]
                }`;
            }
        });
        this.setInitialScreeningOption();
    }

    /**
     * Function used to set the initial screening option
     */
    setInitialScreeningOption() {
        for (const [key, value] of Object.entries(this.screeningStatuses)) {
            if (value.includes('is in progress')) {
                this.screeningOption = key.toUpperCase();
                this.checkEncounter();
                break;
            }
        }
    }
    /**
     * Function that checks if encounter is valid i.e. service point exists
     * If true navigate to specified screening
     * If false create service point and navigate to that service point
     */

    navigateToScreening() {
        this.loadingResult = true;
        const patientData = this.patientData;

        const queueName = `${
            this.screeningOption.charAt(0) +
            this.screeningOption.slice(1).toLowerCase()
        } Cancer Screening`;
        const encounter = patientData.servicePoints.find(
            sp => sp.queue_name === queueName
        );

        if (encounter?.encounterID) {
            this.$state.go(
                `app.advantage.visits.detail.screening.${this.screeningOption.toLowerCase()}_cancer`,
                {
                    id: this.patientData.visit_id,
                    encounter_id: encounter.encounterID,
                },
                { reload: true }
            );
            this.loadingResult = false;
        } else {
            if (this.queues) {
                this.addScreeningServiceRequest(this.queues, queueName);
            }
        }
    }

    /**
     * Function used to create a service Request if the selected one does not exist
     * @param queues service queues on advantage
     * @param queueName Queue Name of service point that is to be created
     */
    addScreeningServiceRequest(queues, queueName) {
        this.selectedQueue = queues.find(q => q.name === queueName);

        /** Sends patient to selected queue */
        this.datalayer
            .update('visits', this.patientData.visit_id, {
                current_queue: this.selectedQueue['id'],
            })
            .subscribe({
                next: (response: any) => {
                    this.visitService.setVisitData(response);
                    this.analytics.logEvent('service-request_completed');
                    setTimeout(() => {
                        this.loadingResult = false;
                        this.$state.go(
                            `app.advantage.visits.detail.screening.${this.screeningOption.toLowerCase()}_cancer`,
                            { id: this.patientData.visit_id },
                            { reload: true }
                        );
                    }, 500);
                },
                error: err => {
                    this.loadingResult = false;

                    this.errorHandler.handleError(err, this);
                },
            });
    }
    /**
     * Function used to set the screening Option and check validity
     * @param event the selected screening option identifier
     */
    setScreeningOption(event: string) {
        this.screeningOption = event;
        this.checkEncounter();
    }
    /**
     * Function used to get specific color code for the screening svgs
     * @param isActive boolean indicating if option is selected
     * @param key key used to identify the specific component to be styled
     * @returns color code
     */
    setColor(isActive: boolean, key: string) {
        return isActive ? this.activeStyle[key] : this.defaultStyle[key];
    }

    /** Observable that waits for patient screening data to be defined */
    visitPatientObservable() {
        this.patientData = this.visitService.patientScreeningData;

        this.visitService.visitPatientScreeningDataEmitter.subscribe(
            patient => {
                this.patientData = patient;
                if (patient.servicePoints) {
                    this.checkScreeningStatus(patient.servicePoints);
                }
            }
        );
    }
    /**
     * Subscribes to the queues data emitter to get available queues from the visit service
     */
    getQueues() {
        this.visitService.queuesDataEmitter.subscribe((queues: any) => {
            this.queues = queues;
        });
    }
    /**
     * Hook called when component is initialized
     * - Loads visit data and initializes the screening state.
     * - Handles errors if visit data cannot be retrieved.
     */
    ngOnInit() {
        this.encounterIsValid = true;
        /** Fetch patient information */
        this.visitPatientObservable();

        /**
         * Initiates the queues observable to define queues
         */
        this.getQueues();

        /** Resolved observable from the state */
        this.visitObservable.subscribe(
            (response: any) => {
                const visit = response;
                this.visitService.setVisitData(visit);
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }
}

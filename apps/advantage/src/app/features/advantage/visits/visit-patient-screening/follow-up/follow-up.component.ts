import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-follow-up',
    templateUrl: './follow-up.component.html',
    styleUrls: ['./follow-up.component.scss'],
    standalone: false,
})
/**
 * This is the class definition of the component
 */
export class FollowUpComponent implements OnInit {
    /**
     * The component constructor
     * @param dataLayer - Connects to the datalayer service
     * @param errorHandler injects instance of errorhandler service
     */
    constructor(
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService
    ) {}
    /**
     * Encounter ID
     */
    @Input() encounterID: string;
    /**
     * Patient ID
     */
    @Input() patientID: string;
    /**
     * Encounter status
     */
    @Input() encounterStatus: string = '';
    /**
     * Screening Encounter Data
     */
    @Input() encounterData: any;
    /**
     * Emmitter thay emits event used to trigger function that moves to stepper's previous step
     * Used in navigation within multi-step workflow
     */
    @Output() previousStepRequested: EventEmitter<void> = new EventEmitter();
    /**
     * OnClick function used to trigger nextStep emitter
     * Called when user wants to navigate back in the workflow
     */
    requestPreviousStep() {
        this.previousStepRequested.emit();
    }
    /**
     * User Message Segments
     */
    segments: any = [];
    /**
     * Screening Follow up Data
     */
    @Input() followUpData: any;
    /**
     * The Type of Cancer Screening being done
     */
    @Input() cancerType: string;
    /**
     * Defines loading state
     */
    loading: boolean = false;
    /**
     * Text and colors that are rendered based on the screening results
     */
    pageText: any = {
        breast: {
            normal: {
                label: 'Normal',
                badgeColor: '#276F09',
                badgeBackgroundColor: '#F6FFED',
            },
            abnormal: {
                label: 'Abnormal',
                badgeColor: '#DA0A15',
                badgeBackgroundColor: '#FFF1F0',
            },
        },
        cervical: {
            negative: {
                label: 'Negative',
                badgeColor: '#276F09',
                badgeBackgroundColor: '#F6FFED',
            },
            positive: {
                label: 'Positive',
                badgeColor: '#DA0A15',
                badgeBackgroundColor: '#FFF1F0',
            },
            suspicious: {
                label: 'Suspicious for cancer',
                badgeColor: '#FFB573',
                badgeBackgroundColor: '#FCF7E8',
            },
        },
    };

    /**
     * Check status of encounter or visit to predetermine what to show
     * @returns true or false
     */
    checkStatus() {
        return (
            [
                this.encounterData?.visit_status?.toLowerCase(),
                this.encounterStatus?.toLowerCase(),
            ].includes('finished') ||
            [
                this.encounterData?.visit_status?.toLowerCase(),
                this.encounterStatus?.toLowerCase(),
            ].includes('completed')
        );
    }

    /**
     * Screening Result status
     */
    screeningStatus: string = '';
    /**
     * Function used to format  a string by replacing underscores with spaces
     * Used to improve display of values that come from database fields
     * @param string to be formatted
     * @returns formatted string
     */
    convertString(inputString) {
        return inputString.replace(/_/g, ' ');
    }

    /**
     * Fetch patient's segments
     * @param personID ID of the patient whose segments need to be retrieved
     */
    getSegments(personID) {
        const params = {
            person: personID,
            fields: 'id,segment,enrolled_at',
        };
        this.loading = true;
        this.dataLayer.list('patient-segments', params).subscribe({
            next: (response: any) => {
                this.loading = false;
                this.segments = response.results;
            },
            error: err => {
                this.loading = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }
    /**
     * Hook called when component is initialized
     * Sets the status from the sreening result
     *
     * For each cancer type, specific values determine the outcome classification:
     * - Breast cancer: Values like 'normal', 'benign findings', specific BIRADS categories
     * - Cervical cancer: Values like 'negative', 'hr-hpv negative'
     */
    ngOnInit() {
        const screeningMap = {
            cervical: {
                values: ['negative', 'hr-hpv negative', 'normal'],
                outcomes: { default: 'negative', alternate: 'positive' },
            },
            breast: {
                values: [
                    'normal',
                    'benign findings - not suspicious for ca',
                    'birads 1',
                    'birads 2',
                    'her2 negative',
                ],
                outcomes: { default: 'normal', alternate: 'abnormal' },
            },
        };

        const screeningData = screeningMap[this.cancerType];
        if (screeningData) {
            this.screeningStatus = screeningData.values.includes(
                this.followUpData?.value.toLowerCase()
            )
                ? screeningData.outcomes.default
                : screeningData.outcomes.alternate;
        }

        if (this.checkStatus()) this.getSegments(this.encounterData?.personID);
    }
}

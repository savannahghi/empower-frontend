import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbToastrService } from '@nebular/theme';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-risk-assessment',
    templateUrl: './risk-assessment.component.html',
    styleUrls: ['./risk-assessment.component.scss'],
    standalone: false,
})

/**
 * This is the class definition of the risk assessment component
 */
export class RiskAssessmentComponent implements OnInit {
    /**
     * Constructor for the component
     *
     * @param toastService Connects to the toast service
     */
    constructor(protected toastService: NbToastrService) {}

    /**
     * Emmitter thay emits event used to trigger function that moves to stepper's next step
     */
    @Output() nextStepRequested: EventEmitter<void> = new EventEmitter();
    /**
     * OnClick function used to trigger emitter
     */
    requestNextStep() {
        this.nextStepRequested.emit();
    }
    /**
     * The Type of Cancer Screening being done
     */
    @Input() cancerType: string = '';

    /**
     * The results of the screening
     */
    @Input() results: any;

    /**
     * Emitter that triggers the removal of the summary view.
     */
    @Output() turnOffSummary = new EventEmitter<void>();
    /**
     * Encounter ID
     */
    @Input() encounterID: string;
    /**
     * Patient ID
     */
    @Input() patientID: string;

    /**
     * Active step index in the stepper.
     */
    activeStepIndex = 0;
    /**
     * Flag indicating whether the summary view is active.
     */
    onSummary = false;

    /**
     * Common text elements shared between different risk assessments
     * Contains reusable text snippets for the UI
     */
    commonText: any;

    /**
     * Screening Result status
     * Can be at at_risk/low_risk/not_at_risk for cervical
     * Can be at high_risk/low_risk/average_risk for breast
     */
    screeningStatus: string = '';

    /**
     * Navigate to the previous step in the workflow
     * Emits an event to turn off the summary view
     */
    previous() {
        this.turnOffSummary.emit();
    }

    /**
     * Navigate to the next step in the workflow
     * Sets the onSummary flag to true to display the summary view
     */
    next() {
        this.onSummary = true;
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {}

    /**
     * Hook called after component is initialized
     * Sets the status from the sreening result
     */
}

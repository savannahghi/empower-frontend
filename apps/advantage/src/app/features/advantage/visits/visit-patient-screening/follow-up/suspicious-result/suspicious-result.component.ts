import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-suspicious-result',
    templateUrl: './suspicious-result.component.html',
    styleUrls: ['./suspicious-result.component.scss'],
    standalone: false,
})
/**
 * This is the class definition of the component
 */
export class SuspiciousResultComponent implements OnInit {
    /**
     * Emmitter thay emits event used to trigger function that moves to stepper's previous step
     */
    @Output() previousStepRequested: EventEmitter<void> = new EventEmitter();
    /**
     * Encounter ID
     */
    @Input() encounterID: string;
    /**
     * Patient ID
     */
    @Input() patientID: string;
    /**
     * The Type of Cancer Screening being done
     */
    @Input() cancerType: string;
    /**
     * OnClick function used to trigger previousStep emitter
     */
    requestPreviousStep() {
        this.previousStepRequested.emit();
    }
    /**
     * holds the form data
     */
    formData: any;
    /**
     * Action chosen as a follow up
     * Can be additional_test, specialist_referral or treatment_referral
     */
    followUpStep: any;
    /**
     * Function used to fetch form data on change event
     * @param model form data object
     */

    getModelData(model) {
        this.formData = model;
        this.followUpStep = model.referral_type;
    }
    /**
     * Hook called when component is initialized
     */
    ngOnInit() {}
}

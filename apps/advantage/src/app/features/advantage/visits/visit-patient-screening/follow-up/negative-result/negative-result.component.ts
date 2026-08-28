import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-negative-result',
    templateUrl: './negative-result.component.html',
    styleUrls: ['./negative-result.component.scss'],
    standalone: false,
})
/**
 * This is the class definition of the component
 */
export class NegativeResultComponent implements OnInit {
    /**
     * Test result
     */
    @Input() testResult: string = '';
    /**
     * Encounter ID
     */
    @Input() encounterID: string;
    /**
     * Patient ID
     */
    @Input() patientID: string;
    /**
     * Emmitter thay emits event used to trigger function that moves to stepper's previous step
     */
    @Output() previousStepRequested: EventEmitter<void> = new EventEmitter();
    /**
     * OnClick function used to trigger previousStep emitter
     */
    requestPreviousStep() {
        this.previousStepRequested.emit();
    }
    /**
     * The Type of Cancer Screening being done
     */
    @Input() cancerType: string;
    /**
     * Text and colors that are rendered based on the screening results
     */
    pageText: any = {
        cervical: {
            label: 'negative',
            result: 'at risk ',
            text: 'The test results are ',
            text1: ' but the patient is still',
            text2: '. The next steps would be to:',
            action1: 'Educate the patient on what these test results mean',
            action2:
                'Advise them to return for routine screening at the facility after 5 years. If HIV positive, repeat screening process after 2 years',
        },
        breast: {
            label: 'normal',
            result: ' high risk ',
            text: 'The test results are ',
            text1: ' but the patient is still at',
            text2: '. The next steps would be to:',
            action1: 'Educate the patient on what these test results mean',
            action2:
                'Advise them to return for routine screening at the facility',
        },
    };
    /**
     * Hook called when component is initialized
     */
    ngOnInit() {}
}

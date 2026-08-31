import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import {
    NbAccordionComponent,
    NbStepChangeEvent,
    NbStepperComponent,
} from '@nebular/theme';
import { StepperService } from '../../../../../shared/component-services/stepper.service';
import { VisitService } from '../../visit.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { VisitExamService } from '../visit-exam.service';
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'visit-exam-stepper',
    templateUrl: './visit-exam-stepper.component.html',
    styleUrl: './visit-exam-stepper.component.scss',
    standalone: false,
})
/**
 * Class that creates the Vist Exam Stepper component
 */
export class VisitExamStepperComponent implements OnInit {
    /**
     * The component constructor
     * @param visitService injects instance of the visit service
     * @param datalayer Access instance of SilStoresService
     * @param stepperService Access instance of StepperService
     * @param uiglobals injects the global values from ui router
     * @param $state injects instance of the State Service
     * @param errorHandler injects instance of the Error Handler Service
     * @param visitExamService Access an instance of the Visit Exam Service
     */
    constructor(
        private visitService: VisitService,
        public stepperService: StepperService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public errorHandler: ErrorHandlerService,
        public visitExamService: VisitExamService
    ) {}

    /**
     * stepper
     */
    stepper: any;
    /**
     * Definition of the template components in the patient review step
     */
    examReviewTemplate: any[] = this.visitExamService.reviewTemplateSettings;

    /**
     * Definition of the template components in the patient history step
     */
    examHistoryTemplate: any[] = this.visitExamService.historyTemplateSettings;

    /**
     * Definition of the template components in the patient examination step
     */
    examTemplate: any[] = this.visitExamService.examTemplateSettings;

    /**
     * Definition of the template components in the patient treatment plan step
     */
    treatmentPlanTemplate: any[] =
        this.visitExamService.treatmentPlanTemplateSettings;

    /**
     * Definition of the template components in the patient sign off step
     */
    signOffTemplate: any[] = this.visitExamService.signOffTemplateSettings;

    /** Contains the number of steps */
    stepsLength: number = 0;
    /**
     * Defines visit data
     */
    visit: any;
    /**
     * Contains visit information resolved from the state
     */
    @Input() visitObservable: any;

    /**
     * Contains visit Id
     */
    visitId: string;
    /**
     * Contains patient information
     */
    patient: any;

    /**
     * Contains the index of the current step
     */
    currentStep: any;
    @ViewChild('accordion', { static: true }) accordion: NbAccordionComponent;

    @ViewChild('stepper', { static: false }) set content(
        content: NbStepperComponent
    ) {
        if (content) {
            // initially setter gets called with undefined
            this.stepper = content;

            this.stepperService.setupStepper(this.stepper);
        }
    }
    /**
     * Orientation of the Stepper Component
     */
    orientation: 'horizontal' | 'vertical' = 'horizontal';

    /**
     * Detect when step changes
     */
    changeEvent: NbStepChangeEvent;

    /**  Event listener for steps */
    handleStepChange(e: NbStepChangeEvent): void {
        this.changeEvent = e;
        this.currentStep = e.index;
        this.stepperService.handleStepChange(e, this.stepper);
        this.setupStep(e.index);
        this.$state.transitionTo(
            this.uiglobals.current.name,
            {
                id: this.visitId,
                step: `${e.index}`,
            },
            { reload: false, notify: false }
        );
    }

    /**
     * Function to transition to the next step
     */
    nextStep() {
        setTimeout(() => this.setupStep(), 2000);
        this.stepperService.nextStep(this.stepper, {
            step: this.currentStep,
            id: this.visitId,
        });
    }
    /**
     * Function to transition to the previous step
     */
    previousStep() {
        setTimeout(() => this.setupStep(), 2000);
        this.stepperService.previousStep(this.stepper, {
            id: this.visitId,
            step: this.currentStep,
        });
    }

    /**
     * Setup API step
     */
    setupStep(index?) {
        this.currentStep = index ? index : this.uiglobals.params.step;
    }

    /** Observable that waits for patient visit data to be defined */
    visitPatientObservable() {
        this.visitService.visitPatientDataEmitter.subscribe(patient => {
            this.patient = patient;
        });
    }

    /**
     * Component lifecycle used after the component is initialized
     */
    ngOnInit() {
        setTimeout(() => {
            this.stepperService.setupStepper(this.stepper);
            this.stepsLength = this.stepper.steps.length;
        }, 300);

        this.visitId = this.uiglobals.params.id;

        this.currentStep = this.stepperService.getCurrentStep().toString();

        this.visitPatientObservable();

        /** Resolved observable from the state */
        this.visitObservable.subscribe(
            (response: any) => {
                this.visit = response;
                this.visitService.setVisitData(this.visit);
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }
}

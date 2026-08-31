import { Injectable } from '@angular/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';

@Injectable({ providedIn: 'root' })
export class StepperService {
    /** Contains the stepper instancd */
    stepper: any;
    /** Contains the number of steps */
    stepsLength: any;
    /** Contains the current step */
    currentStep: any;
    /** Contains the selected step */
    selectedStep: any;
    service: any;
    constructor(
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        public mediaMatcher: MediaMatcher,
        public breakpointObserver: BreakpointObserver
    ) {}

    /** setup stepper */
    setupStepper(stepper) {
        this.stepper = stepper;
        this.stepsLength = stepper.steps.length;
        this.selectedStep = stepper._selectedIndex;
        this.currentStep =
            this.uiglobals.params.step !== undefined
                ? parseInt(this.uiglobals.params.step, 10)
                : 0;
        for (let index = 0; index < this.currentStep; index++) {
            stepper.steps['_results'][index].completed = true;
        }
        stepper.changeStep(stepper.steps['_results'][this.currentStep]);
    }

    /** event that handles the step change*/
    handleStepChange(event, stepper?) {
        const steppr = this.stepper ? this.stepper : stepper;
        const params = this.uiglobals.params;
        params['step'] = event.index;
        steppr?.changeStep(steppr.steps['_results'][event.index]);
    }

    /** Set next step */
    nextStep(stepper, params) {
        this.getCurrentStep();
        params['step'] = this.currentStep + 1;
        this.$state.go(this.uiglobals.current.name, params, {
            notify: true,
            inherit: true,
            reload: true,
        });
    }

    getCurrentStep() {
        this.currentStep =
            this.uiglobals.params.step !== undefined
                ? parseInt(this.uiglobals.params.step, 10)
                : 0;
        return this.currentStep;
    }

    /** Set previous step */
    previousStep(stepper, params) {
        params['step'] = parseInt(this.uiglobals.params['step'], 10) - 1;
        this.$state.go(this.uiglobals.current.name, params, {
            notify: true,
            reload: true,
        });
    }

    /** Updates stepper orientation property based on the current screen width */
    checkOrientationChange(component, width = '1400px') {
        const isSmallScreen = this.mediaMatcher.matchMedia(
            `(max-width: ${width})`
        );
        component.orientation = isSmallScreen.matches
            ? 'horizontal'
            : 'vertical';

        this.breakpointObserver
            .observe([`(max-width: ${width})`])
            .subscribe(result => {
                component.orientation = result.matches
                    ? 'horizontal'
                    : 'vertical';
            });
    }
}

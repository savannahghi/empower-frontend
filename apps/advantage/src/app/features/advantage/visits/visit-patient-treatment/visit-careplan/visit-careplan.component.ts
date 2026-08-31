import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../../shared/cookies/cookie.service';
import { VisitService } from '../../visit.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbSpinnerModule,
    NbAlertModule,
    NbToastrService,
} from '@nebular/theme';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { ChangeDetectorRef } from '@angular/core';
import { smoothToggle } from 'app/shared/animations/smooth-toggle';

/**
 * Component that is used to create a chemotherapy care plan
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrl: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-visit-careplan',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NbCardModule,
        NbButtonModule,
        NbIconModule,
        NbInputModule,
        NbSelectModule,
        NbSpinnerModule,
        NbAlertModule,
    ],
    templateUrl: './visit-careplan.component.html',
    styleUrl: './visit-careplan.component.scss',
    animations: [smoothToggle],
})
/**
 * Class that creates the Chemotherapy Care Plan component
 */
export class VisitCareplanComponent implements OnInit {
    /* Protocol section toggle states */
    protocolSections: { [key: string]: boolean } = {};

    /*
     * Stores the care plan data
     */
    @Input() carePlanData: any;
    /**
     * Time used to show a toast
     */
    toastTime = 3000;

    /*
     * Function to refresh care plan data
     */
    @Input() refreshCarePlan: (encounterId: string) => void;

    /*
     * Stores the loading state for the care plan data
     */
    loading: any = {};

    /* Selected cycle information */
    selectedCycle: any = null;
    selectedPhase: any = null;

    /**
     * The component constructor
     * @param translate Access an Instance of the Translate service
     * @param uiglobals injects the global values from ui router
     * @param cookieService Access an Instance of the Cookie service
     * @param visitService Access an Instance of the Visit Service
     * @param dataLayer Connects to the data layer service
     * @param cdr ChangeDetectorRef for detecting changes in the component
     * @param errorHandler injects instance of errorhandler service
     * @param toastService Access an Instance of the Toast service
     */
    constructor(
        public translate: TranslateService,
        public uiglobals: UIRouterGlobals,
        public cookieService: Cookies,
        public visitService: VisitService,
        public dataLayer: SilStoresService,
        private cdr: ChangeDetectorRef,
        public errorHandler: ErrorHandlerService,
        public toastService: NbToastrService // Assuming toastService is defined elsewhere
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    selectedLanguage = this.cookieService.getLanguageCookie();

    /**
     * Component lifecycle used after the component is initialized
     * sets up the component state, fetches initial data, and subscribes to observables
     */
    ngOnInit() {
        if (this.carePlanData && this.carePlanData.treatmentPhases) {
            this.carePlanData.treatmentPhases.forEach((phase: any) => {
                this.protocolSections[phase.id] = true;
            });
            this.setReadyCycle();
        }
    }

    /**
     * Toggles the visibility of a protocol section
     * @param section The section ID to toggle
     */
    toggleProtocolSection(section: string) {
        if (!(section in this.protocolSections)) {
            this.protocolSections[section] = true;
        }

        this.protocolSections[section] = !this.protocolSections[section];
    }

    /**
     * Selects a cycle to display its information
     * @param cycle The cycle to select
     * @param phase The phase that contains the cycle
     */
    selectCycle(cycle: any, phase: any) {
        this.selectedCycle = cycle;
        this.selectedPhase = phase;
    }

    /**
     * @description sets the cycle that is ready. Loops through the careplan data to find a ready phase and a ready cycle
     *
     */
    setReadyCycle() {
        if (this.carePlanData.treatmentPhases.length > 0) {
            const readyPhase = this.carePlanData.treatmentPhases.find(
                phase =>
                    phase.status === 'ready' &&
                    phase.cycles &&
                    phase.cycles.length > 0
            );

            if (
                readyPhase &&
                readyPhase.cycles &&
                readyPhase.cycles.length > 0
            ) {
                const readyCycle = readyPhase.cycles.find(
                    cycle => cycle?.status === 'ready'
                );
                if (readyCycle) {
                    this.selectCycle(readyCycle, readyPhase);
                    return;
                }
            }

            // default to the first cycle if there are no ready cycles and phase
            const firstPhase = this.carePlanData.treatmentPhases[0];
            if (firstPhase.cycles && firstPhase.cycles.length > 0) {
                this.selectCycle(firstPhase.cycles[0], firstPhase);
            }
        }
    }
    /**
     * Function used to administer
     */
    handleAdminister() {
        this.loading['administer'] = true;
        this.dataLayer
            .update(
                'clinical-task',
                this.selectedCycle.id,
                {
                    status: 'completed',
                    updateReason: 'Administered',
                },
                null,
                true
            )
            .subscribe({
                next: () => {
                    this.selectedCycle.status = 'completed';
                    // complete the careplan phase if last cycle has been administered
                    this.handleCompleteCarePlanPhase();
                    this.loading['administer'] = false;

                    let automaticallyAdvanced = false;

                    // Try to select the next uncompleted cycle in the current phase
                    if (this.selectedPhase && this.selectedPhase.cycles) {
                        const currentCycleIndex =
                            this.selectedPhase.cycles.findIndex(
                                (c: any) => c.id === this.selectedCycle.id
                            );

                        if (currentCycleIndex !== -1) {
                            for (
                                let i = currentCycleIndex + 1;
                                i < this.selectedPhase.cycles.length;
                                i++
                            ) {
                                const potentialNextCycle =
                                    this.selectedPhase.cycles[i];
                                if (potentialNextCycle.status !== 'completed') {
                                    this.selectCycle(
                                        potentialNextCycle,
                                        this.selectedPhase
                                    );
                                    automaticallyAdvanced = true;
                                    break;
                                }
                            }
                        }
                    }

                    //  Check if the phase is completed and move to the next phase
                    if (
                        !automaticallyAdvanced &&
                        this.isSelectedPhaseCompleted()
                    ) {
                        this.protocolSections[this.selectedPhase.id] = false;

                        const currentPhaseIndex =
                            this.carePlanData.treatmentPhases.findIndex(
                                (p: any) => p.id === this.selectedPhase.id
                            );

                        if (
                            currentPhaseIndex <
                            this.carePlanData.treatmentPhases.length - 1
                        ) {
                            const nextPhase =
                                this.carePlanData.treatmentPhases[
                                    currentPhaseIndex + 1
                                ];
                            this.protocolSections[nextPhase.id] = true;

                            if (
                                nextPhase.cycles &&
                                nextPhase.cycles.length > 0
                            ) {
                                const firstUncompletedCycleInNextPhase =
                                    nextPhase.cycles.find(
                                        (c: any) => c.status !== 'completed'
                                    );
                                if (firstUncompletedCycleInNextPhase) {
                                    this.selectCycle(
                                        firstUncompletedCycleInNextPhase,
                                        nextPhase
                                    );
                                    automaticallyAdvanced = true;
                                } else {
                                    this.selectCycle(
                                        nextPhase.cycles[0],
                                        nextPhase
                                    );
                                    automaticallyAdvanced = true;
                                }
                            }
                        }
                    }

                    // If no cycle was automatically selected by direct advancement use setReadyCycle
                    if (!automaticallyAdvanced) {
                        this.setReadyCycle();
                    }

                    if (
                        this.refreshCarePlan &&
                        this.carePlanData &&
                        this.carePlanData.encounterId
                    ) {
                        this.refreshCarePlan(this.carePlanData.encounterId);
                    }

                    this.showToast(
                        'bottom-right',
                        'success',
                        'Phase completed',
                        'Cycle has been administered'
                    );

                    this.cdr.detectChanges();
                },
                error: (err: any) => {
                    this.loading['administer'] = false;
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     * @description updates the phase status once all cycles in a phase are completed
     * @returns none
     */
    handleCompleteCarePlanPhase() {
        if (
            !this.selectedPhase ||
            !this.selectedCycle ||
            !Array.isArray(this.selectedPhase.cycles)
        ) {
            return;
        }

        const cycles = this.selectedPhase.cycles;
        const lastIndex = cycles.length - 1;
        const selectedIndex = cycles.findIndex(
            cycle => cycle.id === this.selectedCycle.id
        );

        if (selectedIndex !== lastIndex) return;

        const allCyclesComplete = cycles.every(
            cycle => cycle.status === 'completed'
        );
        if (!allCyclesComplete) return;

        this.dataLayer
            .update(
                'clinical-task',
                this.selectedPhase.id,
                {
                    status: 'completed',
                    updateReason: 'Phase completed',
                },
                null,
                true
            )
            .subscribe({
                next: () => {
                    this.selectedPhase.status = 'completed';
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /** Checks if the selected phase is completed
     * @returns {boolean} true if all cycles in the selected phase are completed
     * false otherwise
     */
    isSelectedPhaseCompleted(): boolean {
        if (!this.selectedPhase) {
            return false;
        }
        if (
            !this.selectedPhase.cycles ||
            this.selectedPhase.cycles.length === 0
        ) {
            return false;
        }
        return this.selectedPhase.cycles.every(
            (c: any) => c.status === 'completed'
        );
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }
}

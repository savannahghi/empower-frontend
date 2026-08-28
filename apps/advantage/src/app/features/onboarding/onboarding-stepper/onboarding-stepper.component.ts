import { Component, OnInit, ViewChild } from '@angular/core';
import {
    NbStepperComponent,
    NbAccordionComponent,
    NbStepChangeEvent,
} from '@nebular/theme';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { SilDatatableComponent } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { SilTableFormComponent } from '../../../shared/sil-table-form/components/sil-table-form.component';
import { StepperService } from '../../../shared/component-services/stepper.service';
import { ProviderOnboardingService } from './onboarding-stepper.service';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { ErrorHandlerService } from '../../../shared/sil-http-services/error-handler';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 * - provider: contains the services required by the component
 */
@Component({
    selector: 'onboarding-stepper',
    templateUrl: './onboarding-stepper.component.html',
    styleUrls: ['./onboarding-stepper.component.scss'],
    standalone: false,
})
export class OnboardingStepperComponent implements OnInit {
    selectedBillingClass: any;

    constructor(
        private dataLayer: SilStoresService,
        public stepperService: StepperService,
        public authConfig: Authorization,
        public onboardingService: ProviderOnboardingService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public errorHandler: ErrorHandlerService
    ) {}

    /**
     * stepper
     */
    stepper: any;
    /** Contains submitted */
    submitted: boolean = false;
    @ViewChild('accordion', { static: true }) accordion: NbAccordionComponent;
    /**
     * Contains selector that is used to access the datatable component
     * used in the component
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;
    @ViewChild(SilTableFormComponent) siltableform: SilTableFormComponent;

    @ViewChild('stepper', { static: false }) set content(
        content: NbStepperComponent
    ) {
        if (content) {
            // initially setter gets called with undefined
            this.stepper = content;
            this.stepperService.setupStepper(this.stepper);
        }
    }
    insuranceCompanies: Array<string> = ['Jubilee', 'Britam', 'Madison'];
    /** Provider data */
    providerData: object;
    user: any;

    //  Event listener for steps
    handleStepChange(e: NbStepChangeEvent): void {
        this.stepperService.handleStepChange(e, this.stepper);
        this.setupAPIStep(e.index);
        this.$state.transitionTo(
            this.uiglobals.current.name,
            {
                step: `${e.index}`,
            },
            { reload: false, notify: false }
        );
    }

    /**
     * Array used to define the headers of the datatable
     */
    ownersTableHeader: Array<any>;
    businessDocumentsHeader: Array<any>;

    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;

    /**
     * Array used to define the actions of the datatable
     */
    ownersTableActions: Array<any>;
    businessDocumentsActions: Array<any>;

    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    ownersTableRows: Array<any>;
    businessDocumentsRows: Array<any>;

    /** used to filter datatable params */
    filterParams: Object;

    /** Contains the current step */
    currentStep: any;

    /**
     * Used to display different toggle modals
     * information
     */
    toggle: Object = {};

    /**
     * Goes to next step on the stepper
     */
    nextStep() {
        setTimeout(() => this.setupAPIStep(), 2000);
        this.stepperService.nextStep(this.stepper, {});
    }

    /**
     * Goes to previous step on the stepper
     */
    previousStep() {
        setTimeout(() => this.setupAPIStep(), 2000);
        this.stepperService.previousStep(this.stepper, {});
    }

    /**
     * Toggles model
     * @param context defines what modal should be opened
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Detects changing of visit class
     */
    changeBillingClass(billingClass) {
        this.selectedBillingClass = billingClass;
    }

    // fetch the providers using logged in business partner
    fetchProvider() {
        const params = {
            slade_code: this.user.business_partner,
        };
        this.dataLayer.list('erp-provider', params).subscribe({
            next: (response: any) => {
                this.providerData = response.results[0];
                this.onboardingService.fetchOrganisation(this);
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /** hook initialized when component is loading */
    ngOnInit() {
        this.providerData = {};
        this.user = this.authConfig.getUser();
        this.changeBillingClass('CASH');

        /**
         * Used to set the table's filters
         * */
        this.filterParams = {
            page_size: 3,
        };

        /**
         * Set the table header data
         */
        this.ownersTableHeader = [
            { text: 'Name' },
            { text: 'Contact' },
            { text: 'ID' },
            { text: 'KRA PIN' },
            { text: 'Action' },
        ];
        /**
         * Set the table's rows
         */
        this.ownersTableRows = [
            {
                nested: [
                    {
                        label: 'name',
                        value: 'name',
                        type: 'string',
                    },
                    {
                        label: 'gender',
                        value: 'gender',
                        type: 'string',
                    },
                    {
                        label: 'age',
                        value: 'age',
                        type: 'string',
                    },
                ],
            },

            {
                nested: [
                    {
                        label: 'From',
                        value: 'valid_from',
                        type: 'string',
                    },
                    {
                        label: 'To',
                        value: 'valid_to',
                        type: 'string',
                    },
                ],
            },

            {
                key: 'created',
                type: 'date',
            },
            {
                key: 'created',
                type: 'date',
            },
        ];
        this.ownersTableActions = this['actions'] = [
            {
                btnText: 'View',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.ai.guidelines.detail',
                },
            },
        ];

        /**
         * Set the table header data
         */
        this.businessDocumentsHeader = [
            { text: 'Document Type' },
            { text: 'Date Added' },
            { text: 'Action' },
        ];

        /**
         * Set the table's rows
         */
        this.businessDocumentsRows = [
            {
                key: 'name',
                type: 'string',
            },

            {
                key: 'sil_global_identifier',
                type: 'string',
            },
        ];
        this.businessDocumentsActions = this['actions'] = [
            {
                btnText: 'View',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.ai.guidelines.detail',
                },
            },
        ];
        this.fetchProvider();
        this.currentStep = this.stepperService.getCurrentStep().toString();
    }

    /**
     * Updates the step in the onboarding process
     * @param dataObj contains the API step
     */
    nextOnboardingStep(dataObj) {
        const params = { slade_code: this.user.business_partner };
        this.dataLayer
            .customUpdate('next-step-onboarding', dataObj, params)
            .subscribe({
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     * Setup API step
     */
    setupAPIStep(index?) {
        this.currentStep = index ? index : this.uiglobals.params.step;
        const step = parseInt(this.currentStep, 10);
        this.nextOnboardingStep({ next_step: step });
    }
}

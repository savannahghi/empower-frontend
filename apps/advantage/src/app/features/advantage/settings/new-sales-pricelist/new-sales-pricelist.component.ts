import { Component, OnInit, ViewChild } from '@angular/core';
import {
    NbStepChangeEvent,
    NbStepperComponent,
    NbToastrService,
} from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { UIRouterGlobals, StateService } from '@uirouter/angular';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StepperService } from '../../../../shared/component-services/stepper.service';
import {
    CreateSalesPricelistModel,
    NewSalesPricelistModel,
    SalesPricelistModel,
} from '../../models';
import { ResolverService } from '../../../services/resolver.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

@Component({
    selector: 'ngx-new-sales-pricelist',
    templateUrl: './new-sales-pricelist.component.html',
    styleUrls: ['./new-sales-pricelist.component.scss'],
    standalone: false,
})
export class NewSalesPricelistComponent implements OnInit {
    /**
     * Time used to show a toast
     */
    toastTime = 1500;

    /**
     * Used to display the loader when data is being submitted
     */
    loading: boolean = false;

    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted: boolean = false;

    /**
     * Contains the stepper linear config
     */
    linearMode = true;

    /**
     * Contains disableStepNavigation option
     */
    stepNavigationOption = true;

    /**
     * stepper
     */
    stepper: any;

    /**
     * sales pricelist ID
     */
    pricelistID: string = this.uiglobals.params?.id;

    /**
     * Pricelist details
     */
    pricelistDetails: SalesPricelistModel;

    /**
     * Btn text
     */
    btnText = 'shared.buttons.save_proceed';

    @ViewChild('stepper', { static: false }) set content(
        content: NbStepperComponent
    ) {
        if (content) {
            // initially setter gets called with undefined
            this.stepper = content;
        }
    }

    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Constructor
     * @param uiglobals Contains the uiglobals
     * @param dataLayer Connects to the data layer
     * @param toastrService Connects to the toast service
     * @param state Connects to the state
     * @param errorHandler Connects to the error handler
     * @param translate Connects to the translate service
     * @param stepperService injects instance of stepper service
     */
    constructor(
        protected toastrService: NbToastrService,
        private dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        private translate: TranslateService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public stepperService: StepperService,
        public resolverService: ResolverService,
        public authServ: Authorization
    ) {}
    ngOnInit() {
        this.setupOnboarding();
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    goToProductsList() {
        this.$state.go('app.advantage.settings.pricelists');
    }

    //  Set next step
    nextStep({ pricelistId }: { pricelistId?: string }) {
        const params = this.uiglobals.params;
        // update params with pricelist id
        if (pricelistId) {
            params['id'] = pricelistId;
        }
        if (params['step'] > 1) return;

        this.stepperService.nextStep(this.stepper, params);
    }

    /**
     * Create pricelist
     */
    submitPricelist(model: NewSalesPricelistModel) {
        this.submitted = true;
        this.loading = true;
        const payload: NewSalesPricelistModel = { ...model };

        if (this.pricelistDetails?.id) {
            const id = this.pricelistDetails?.id;
            this.dataLayer.update('pricelists', id, payload).subscribe({
                next: (response: CreateSalesPricelistModel) => {
                    const msg = `Basic details for ${response?.name} have been updated successfully`;
                    const context = 'Basic details';
                    this.showToast('bottom-right', 'success', msg, context);
                    this.loading = false;
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                    this.submitted = false;
                },
            });
        } else {
            this.dataLayer.create('pricelists', payload).subscribe({
                next: (response: CreateSalesPricelistModel) => {
                    const msg = `Basic details for ${response?.name} have been created successfully`;
                    const context = 'Basic details';
                    this.showToast('bottom-right', 'success', msg, context);
                    setTimeout(() => {
                        const pricelistId = response?.id;
                        this.loading = false;
                        this.nextStep({ pricelistId });
                    }, this.toastTime);
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                    this.submitted = false;
                },
            });
        }
    }

    /**
     * Fetch pricelist details and populate the form
     */
    getPricelistDetails() {
        const erpOrg = this.authServ.getErpOrganisation();
        const params = {
            organisation: erpOrg?.organisation_id,
        };
        if (this.pricelistID) {
            this.resolverService
                .resolveItem('pricelists', this.pricelistID, params)
                .subscribe({
                    next: (response: SalesPricelistModel) => {
                        this.pricelistDetails = response;
                        this.btnText = 'shared.buttons.update';
                    },
                    error: err => {
                        this.errorHandler.handleError(err, this);
                    },
                });
        }
    }

    //  Event listener for steps
    handleStepChange(e: NbStepChangeEvent): void {
        this.stepperService.handleStepChange(e, this.stepper);
        const params = this.uiglobals.params;
        (params.step = e.index),
            this.$state.transitionTo(this.uiglobals.current.name, params, {
                reload: false,
                notify: false,
            });
    }

    // setup onboarding stepper
    setupOnboarding() {
        setTimeout(() => {
            const step = this.uiglobals.params?.step;
            if (step) {
                this.stepper._selectedIndex = parseInt(step, 10);
            }
            this.stepperService.setupStepper(this.stepper);
        }, 200);

        this.stepNavigationOption = !Boolean(this.pricelistID);
        this.getPricelistDetails();
    }

    /**
     * Check if the next button should be disabled
     * @returns boolean
     */
    get isNextDisabled(): boolean {
        if (!this.pricelistDetails) {
            return true;
        }
        if (this.pricelistDetails.pricelist_status === 'locational') {
            return (
                !this.pricelistDetails.locations ||
                this.pricelistDetails.locations.length === 0
            );
        }
        return false;
    }

    /**
     * Get the tooltip for the next button
     * @returns string
     */
    get nextButtonTooltip(): string {
        return this.isNextDisabled
            ? 'Please add at least one location to proceed.'
            : '';
    }

    /**
     * Event handler for when locations are changed
     */
    onLocationsChanged() {
        this.getPricelistDetails();
    }

    get buttonTooltip(): string | null {
        return this.isNextDisabled ? this.nextButtonTooltip : null;
    }
}

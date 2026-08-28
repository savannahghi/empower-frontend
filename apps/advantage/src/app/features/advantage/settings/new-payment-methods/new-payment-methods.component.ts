import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { UIRouterGlobals, StateService } from '@uirouter/angular';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import moment from 'moment';
import { ResolverService } from '../../../services/resolver.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { NewPaymentMethodModel } from '../../models/NewPaymentMethod.model';
import { CreatePaymentMethodModel } from '../../models/CreatePaymentMethodModel.model';

@Component({
    selector: 'app-new-payment-methods',
    templateUrl: './new-payment-methods.component.html',
    styleUrl: './new-payment-methods.component.scss',
    standalone: false,
})
export class NewPaymentMethodsComponent implements OnInit {
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
     * Payment method details
     */
    paymentMethodDetails: CreatePaymentMethodModel;

    /**
     * Btn text
     */
    btnText = 'shared.buttons.save';

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
        private errorHandler: ErrorHandlerService,
        private translate: TranslateService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public resolverService: ResolverService,
        public authServ: Authorization
    ) {}
    ngOnInit() {
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

    goToPaymentMethodsList() {
        this.$state.go('app.advantage.settings.payment_methods');
    }

    /**
     * Create pricelist
     */
    submitPaymentMethod(model: NewPaymentMethodModel) {
        this.submitted = true;
        this.loading = true;
        const payload: NewPaymentMethodModel = {
            ...model,
            effective_from: moment(model.effective_from).toISOString(),
            effective_to: moment(model.effective_to).toISOString(),
        };

        if (this.paymentMethodDetails?.id) {
            const id = this.paymentMethodDetails?.id;
            this.dataLayer.update('payment-methods', id, payload).subscribe({
                next: (response: CreatePaymentMethodModel) => {
                    const msg = `Payment details for ${response?.name} have been updated successfully`;
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
            this.dataLayer.create('payment-methods', payload).subscribe({
                next: (response: CreatePaymentMethodModel) => {
                    const msg = `Payment details for ${response?.name} have been created successfully`;
                    const context = 'Basic details';
                    this.showToast('bottom-right', 'success', msg, context);
                    setTimeout(() => {
                        this.loading = false;
                    }, this.toastTime);
                    this.goToPaymentMethodsList();
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                    this.submitted = false;
                },
            });
        }
    }
}

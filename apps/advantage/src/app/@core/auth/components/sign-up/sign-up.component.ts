import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
    NbIconLibraries,
    NbStepChangeEvent,
    NbToastrService,
} from '@nebular/theme';
import { StateService } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { environment } from '../../../../../environments/environment';
import { FacilityOnboardingService } from '../../../../shared/sil-form/services/formly/empower/facility-onboarding-form';

/**
 * Component that is used to render the sign up page used to onboard providers
 *
 *  Component declaration that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */

@Component({
    selector: 'sil-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    standalone: false,
})
/**
 * Class that creates the SignUp component
 */
export class SignUpComponent implements OnInit {
    constructor(
        protected toastrService: NbToastrService,
        public $state: StateService,
        private dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        private iconLibraries: NbIconLibraries,
        protected toastService: NbToastrService,
        public facilityService: FacilityOnboardingService,
        public cdr: ChangeDetectorRef
    ) {
        this.iconLibraries.registerFontPack('font-awesome', {
            packClass: 'fa',
            iconClassPrefix: 'fa',
        });
    }

    /** contains application variant */
    variant;
    /** contains form loading status */
    loading;
    /** tells you if organisation exists */
    orgExists;
    /** tells you the existing organisation's slade code */
    orgSladeCode;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * Used to indicate if the request was successfully submitted
     */
    submittedSuccessfully = false;
    /**
     * User email
     */
    userEmail = '';

    /**
     * saves the name of the registered facility
     */
    facilityName: string;

    /** shown once when the account is created without email */
    temporaryPassword = '';

    // Detect when step changes
    changeEvent: NbStepChangeEvent;

    /**
     * Contains the onboarding request details
     */
    requestDetails: any;
    /**
     * Used to determine if the content of a form has been submitted
     */
    submitted: boolean = false;

    /**
     * Used to define custom form options.
     * Required for the patient form to allow for constant updating of model
     */
    formOptions: any;

    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Used to set the form options
     * @param formOptions
     */
    getFormOptions(formOptions) {
        this.formOptions = formOptions;

        this.facilityService.setComponent(this);

        if (this.formOptions && this.formOptions.form) {
            this.formOptions.form.valueChanges.subscribe(() => {
                this.saveFormData();
                this.cdr.detectChanges();
            });

            this.formOptions.form.statusChanges.subscribe(() => {
                this.cdr.detectChanges();
            });
        }
    }

    /**
     * Used to check if org is already registered
     * @param model object containing the form data used to check org
     */
    checkOrganisation(model) {
        this.loading = true;
        this.orgSladeCode = model.provider.slade_code_counter;
        const facility = Object.assign(
            {},
            {
                name: model.provider.name,
                slade_code: model.provider.slade_code_counter,
            }
        );
        this.dataLayer.create('organisation-check', facility).subscribe({
            next: data => {
                this.orgExists = data['code'] === 2;
                this.loading = false;
            },
            error: err => {
                this.loading = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * Determines if the submit button should be disabled
     */
    isSubmitDisabled(): boolean {
        if (!this.formOptions || !this.formOptions.form) {
            return true;
        }

        const form = this.formOptions.form;
        const model = this.formOptions.model || {};

        const isFormValid = this.facilityService.validateRequiredFields(form);
        const termsAccepted = model.agreed_to_terms === true;

        return !isFormValid || !termsAccepted || this.loading;
    }

    /**
     * Method called when the terms and conditions checkbox is changed
     * @param event
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onTermsChange(event) {
        this.cdr.detectChanges();
    }

    /**
     * Method called when the terms and conditions checkbox is changed
     */
    back() {
        this.$state.go('auth.welcome');
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context, duration = this.toastTime) {
        this.toastService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Sets the facility category based on the set variant
     */
    setCategories(variant: string) {
        return variant === 'empower' ? ['EMPOWER'] : [];
    }

    /**
     * Used to submit the facility data
     * @param model object containing the form data used to create the facility
     */
    submitRequest(model) {
        const formBackup = { ...model };

        this.submitted = false;
        this.loading = true;

        let phoneNumber = '';
        if (model.user_phone_number) {
            const cleanNumber = model.user_phone_number.replace(/^\+?254/, '');
            phoneNumber = cleanNumber;
        }

        const facilityRequest = {
            name: model.facility_name,
            categories: this.setCategories(this.variant),
            county: model.county,
            description:
                model.description ||
                `${model.facility_name} ${model.facility_type}`,
            facility_type: model.facility_type,
            country: 'KE',
            owner: {
                first_name: model.first_name,
                last_name: model.last_name,
                email: model.user_email,
                phone: '+254' + phoneNumber,
                role: model.role,
            },
            identifiers: [
                {
                    identifier_type: 'MFL_CODE',
                    identifier_value: model.mfl_code,
                },
            ],
        };

        this.dataLayer
            .create('facility-onboarding', facilityRequest)
            .subscribe({
                next: (data: any) => {
                    const msg = `${data?.['name']} added successfully`;
                    this.showToast(
                        'bottom-right',
                        'success',
                        msg,
                        'Facility Added successfully'
                    );
                    this.facilityName = data['name'];
                    this.userEmail = data?.owner?.email;
                    // Provisioned immediately, and no mail is sent, so the
                    // credential is shown once here.
                    this.temporaryPassword = data?.temporary_password ?? '';
                    this.loading = false;
                    this.submitted = true;
                    this.submittedSuccessfully = true;
                    sessionStorage.removeItem('facilityFormData');
                },
                error: err => {
                    if (this.formOptions && this.formOptions.model) {
                        this.formOptions.model = { ...formBackup };
                    }
                    this.handleError(err);
                    this.loading = false;
                    this.submitted = false;
                    this.cdr.detectChanges();
                },
            });
    }
    /**
     * Custom error handling function
     * @param error error response
     */
    handleError(err) {
        if (err?.error?.owner) {
            const errors = Object.keys(err?.error?.owner).map(key => {
                return `This ${key} already exists`;
            });
            this.showToast(
                'bottom-right',
                'danger',
                errors.join('. '),
                'Validation error',
                0
            );
        } else {
            this.errorHandler.handleError(err, this);
        }
    }

    /**
     * Hook that is called when the component is initialized
     */
    ngOnInit() {
        this.variant = environment.variant;
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        this.restoreFormData();
    }

    /**
     * Hook that is called when the component is destroyed
     */
    saveFormData() {
        if (this.formOptions && this.formOptions.model) {
            sessionStorage.setItem(
                'facilityFormData',
                JSON.stringify(this.formOptions.model)
            );
        }
    }

    /**
     * Restores the form data from session storage
     */
    restoreFormData() {
        const savedData = sessionStorage.getItem('facilityFormData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setTimeout(() => {
                    if (this.formOptions) {
                        this.formOptions.model = { ...parsedData };
                        this.cdr.detectChanges();
                    }
                }, 500);
            } catch {}
        }
    }
}

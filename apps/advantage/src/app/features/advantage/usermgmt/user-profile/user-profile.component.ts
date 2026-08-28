import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { NbToastrService } from '@nebular/theme';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { CompleteService } from '../../../../@core/auth/services/login.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';

@Component({
    selector: 'ngx-user-profile',
    templateUrl: './user-profile.component.html',
    standalone: false,
})
export class UserProfileComponent implements OnInit {
    /**
     * Get selected language
     */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /**
     * Boolean used to define if the ofrm data has been submitted
     */
    submitted: boolean = false;

    /**
     * Boolean that defines the loading status
     */
    loading: boolean = false;

    /**
     * Boolean that defines the loading status
     */
    buttonLoading: boolean = false;

    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Stores the form data --user details
     */
    user: any;

    /**
     * Duration toaster will be displayed
     */
    toastTime: number = 3000;

    /** ChangePasswordForm */
    changePasswordForm: FormGroup;

    /** Stores token for api calls */
    token;

    showPassword = false;
    showPassword1 = false;
    showPassword2 = false;
    showPassword3 = false;

    constructor(
        public translate: TranslateService,
        public cookieService: Cookies,
        public authServ: Authorization,
        public toastrService: NbToastrService,
        public fb: FormBuilder,
        public completeService: CompleteService,
        public errorHandler: ErrorHandlerService
    ) {
        this.translate.setFallbackLang('en');
        this.translate.use(this.selectedLanguage);
    }

    /** Toggle show password */
    toggleShowPassword(status?) {
        status === 'CURRENT' ? (this.showPassword1 = !this.showPassword) : null;
        status === 'NEW' ? (this.showPassword2 = !this.showPassword2) : null;
        status === 'CONFIRM'
            ? (this.showPassword3 = !this.showPassword3)
            : null;
        this.showPassword = !this.showPassword;
    }

    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    submitNewDetails() {
        this.loading = true;
        this.submitted = true;
        this.showToast(
            'bottom-right',
            'danger',
            'Failed!',
            'Cannot update basic details at this time!'
        );
        setTimeout(() => {
            this.loading = false;
            this.submitted = false;
        }, this.toastTime);
    }

    serverChangePassword() {
        this.buttonLoading = true;
        const payload = {
            old_password: this.changePasswordForm.value.currentPassword,
            new_password1: this.changePasswordForm.value.newPassword,
            new_password2: this.changePasswordForm.value.confirmPassword,
        };
        this.completeService.changePassword(payload, this.token).subscribe({
            next: () => {
                this.buttonLoading = false;
                this.showToast(
                    'bottom-right',
                    'success',
                    'Password Change Successful',
                    'New password has been saved successfully'
                );
            },
            error: err => {
                this.buttonLoading = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /** Checks if new password and confirm password are the same */
    mustMatch(password1: string, password2: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const newPassword = control.get(password1);
            const confirmPassword = control.get(password2);

            if (newPassword?.value !== confirmPassword?.value) {
                const error = { passwordNotSame: true };
                confirmPassword.setErrors(error);
                return error;
            }
        };
    }

    ngOnInit() {
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        this.user = this.authServ.getUser();

        this.token = this.authServ?.getToken();

        /**
         * Validations for ChangePasswordForm
         */
        this.changePasswordForm = this.fb.group(
            {
                currentPassword: ['', Validators.required],
                newPassword: [
                    '',
                    [Validators.required, Validators.minLength(8)],
                ],
                confirmPassword: [
                    '',
                    [Validators.required, Validators.minLength(8)],
                ],
            },
            { validators: this.mustMatch('newPassword', 'confirmPassword') }
        );
    }
}

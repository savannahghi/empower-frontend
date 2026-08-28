import {
    ChangeDetectionStrategy,
    Component,
    ChangeDetectorRef,
    Inject,
    OnInit,
    PLATFORM_ID,
} from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { Authorization } from '../../services/authorization.service';
import { CompleteService } from '../../services/login.service';
import { HomePageService } from '../../services/home-page.service';
import { SessionService } from '../../services/session.service';
import { Setup } from '../../services/setup.service';
import { IdleService } from '../../services/idle.service';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { FeatureFlagService } from '../../../../@core/utils/feature.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { SilKeycloakService } from '../../../../shared/sil-keycloak/keycloak.service';
import { InitializeFlagsService } from 'app/@core/utils/initialize-flags.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - style: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 * - providers: contains the services used within the component
 * - changeDetection: determines change detection strategy
 */
@Component({
    selector: 'skika-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [
        SessionService,
        Setup,
        CompleteService,
        HomePageService,
        FeatureFlagService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})

/** Login component class */
export class SkikaLoginComponent implements OnInit {
    // nebular declarations
    redirectDelay: number = 0;
    /** contains params from uiglobal */
    stateParams: any;
    /** contains errors while logging in*/
    errors: string[] = [];
    error: any = undefined;
    /** Contains the window object */
    window: any;
    /** Stores token for api calls */
    token;
    errAlert: string;
    messages: string[] = [];
    user: any;
    submitted: boolean = false;
    rememberMe = false;
    store: string;
    // end of nebular declarations
    strategy: 'email';
    progressMsg = 'Starting your session';
    authError = false;
    loginCount: string;
    logout: any;
    formToggle: boolean = false;
    idleState: any;
    variant: string;
    loading: boolean = false;
    messaging: Subject<any>;
    isMFA: boolean = false;

    /** Show traditional login form */
    showLoginForm: boolean = false;

    /** Change to change password form */
    passwordChange: boolean = false;

    /** submit email to reset password */
    showSubmitEmailForm: boolean = false;

    toastTime = 10000;

    /** ChangePasswordForm */
    changePasswordForm: FormGroup;

    /** submit reset email form */
    emailResetForm: FormGroup;

    /** Store the html response */
    htmlRes;

    /** Store the CSRF token */
    CSRFToken: string;

    /** Store the referer */
    referer: string;

    /**
     *  Constructor for the login component class
     * @param complete injects instance of the complete service
     * @param service injects instance of the nebular auth service
     * @param options injects nebular auth options
     * @param cd injects angular's base change detector class
     * @param $state injects uirouter state service
     * @param authorizationService injects authorization service
     * @param toastrService injects nebular's toast service
     * @param idleService injects keepalive idle service
     * @param session injects session service
     * @param uiglobals injects uiglobal service,
     * @param errorHandler inject to error handler
     * @param PLATFORM_ID to distinguish between server side and client side
     * @param fb instance of Angular FormBuilder
     * @param keycloakService instance of SilKeycloakService for Keycloak authentication
     */
    constructor(
        public complete: CompleteService,
        public cd: ChangeDetectorRef,
        public $state: StateService,
        public authorizationService: Authorization,
        protected toastrService: NbToastrService,
        protected idleService: IdleService,
        protected session: SessionService,
        protected dataLayer: SilStoresService,
        public uiglobals: UIRouterGlobals,
        public httpClient: HttpClient,
        public errorHandlerService: ErrorHandlerService,
        @Inject(PLATFORM_ID) private platformId: Object,
        public fb: FormBuilder,
        private featureFlagService: FeatureFlagService,
        public initializeFlagsService: InitializeFlagsService,
        public keycloakService: SilKeycloakService
    ) {
        this.variant = environment.variant;
        this.dataLayer = dataLayer;
        this.messaging = new Subject();
        if (isPlatformBrowser(this.platformId)) {
            this.window = window;
        }
    }

    showPassword = false;
    showPassword1 = false;
    showPassword2 = false;
    showPassword3 = false;
    email: string = '';
    password: string;
    resetEmailAddress: string;
    mfa_options: any[] = [];
    user_id: string;

    /** Should determine if MFA is enabled */
    get enableMFA(): boolean {
        return this.featureFlagService.isFeatureOn('prov_platformMFA');
    }

    /** Should determine if keycloak is enabled */
    get enabledKeycloak(): boolean {
        return this.initializeFlagsService.getForcedValue(
            'prov_authenticationSetKeyCloakToTrue'
        );
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.stateParams = this.uiglobals.params;

        if (!this.enabledKeycloak) {
            /**
             * SIL Authentication Flow
             */
            this.setupSilLogin();
        } else {
            /**
             * Keycloak Authentication Flow
             */
            this.setupKeycloakLogin();
        }
    }

    /**
     * Handle successful Keycloak login
     */
    public async handleKeycloakLogin() {
        try {
            const token = await this.keycloakService.getToken();

            if (token) {
                // Create token object in the format expected by the auth service
                const tokenObject = {
                    access_token: token,
                    token_type: 'Bearer',
                };

                // Store token first so it's available for subsequent API calls
                this.authorizationService.storeToken(tokenObject);

                // Fetch complete user details from backend (includes roles, permissions, etc.)
                this.fetchKeycloakUserDetails(tokenObject);
            }
        } catch (error) {
            this.errorHandlerService.handleError(error);
        }
    }

    // Setup SIL authserver login flow
    public setupSilLogin() {
        this.formToggle = true;
        if (this.idleService.setLogin === true) {
            this.idleState = true;
        }
        setTimeout(() => {
            this.determineIfLoggedIn();
        }, 500);

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

        this.emailResetForm = this.fb.group({
            resetEmailAddress: [
                '',
                [Validators.required, this.emailValidator()],
            ],
        });
    }

    // Setup Keycloak login flow
    public setupKeycloakLogin() {
        this.keycloakService
            .isLoggedIn()
            .then(isLoggedIn => {
                if (isLoggedIn) {
                    // User is already authenticated after redirect from Keycloak
                    this.handleKeycloakLogin();
                } else {
                    // User is not authenticated, redirect to Keycloak login page
                    this.keycloakService.login();
                }
            })
            .catch(() => {
                this.showToast(
                    'bottom-right',
                    'danger',
                    'Authentication Error',
                    'Failed to check Keycloak login status'
                );
                this.keycloakService.login();
            });
    }

    /**
     * Fetch user and organization details from backend after Keycloak login
     * This mirrors the traditional login flow
     */
    private fetchKeycloakUserDetails(tokenObject: any) {
        // Fetch user details from advantage backend (ME endpoint)
        this.authorizationService
            .setAdvantageOrganisationDetails(tokenObject)
            .subscribe({
                next: meData => {
                    // Store user data (includes roles, permissions, etc.)
                    this.authorizationService.setUser(meData);
                    this.authorizationService.setAdvantageOrganisation(meData);

                    // Fetch ERP organization details (includes user_workstations)
                    this.authorizationService
                        .setOrganisationDetails(tokenObject, 'erp')
                        .subscribe({
                            next: erpData => {
                                this.authorizationService.setOrganisation(
                                    erpData,
                                    'erp'
                                );

                                // Now that we have all data, proceed with navigation
                                this.complete.determineApplicationAccess(
                                    meData
                                );
                                this.complete.determineAppsNavigation();
                            },
                            error: this.handleError,
                        });
                },
                error: this.handleError,
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

    /** Handle login for users without MFA */
    handleLoginWorkflow(params) {
        if (this.authorizationService.isLoggedIn() && !params.is_expired) {
            this.handleRedirect();
        } else if (params.is_expired) {
            this.handleExpiredSession();
        }
    }

    /** Determines if a user has logged in */
    determineIfLoggedIn() {
        if (this.complete.tempMFAData) {
            this.mfa_options = this.complete.tempMFAData.user_mfa_methods;
            this.user_id = this.complete.tempMFAData.id;
            this.toggleMFA();
            this.cd.detectChanges();
        } else {
            const params = this.uiglobals.params;
            this.handleLoginWorkflow(params);
        }
    }

    /** Handle expired session */
    handleExpiredSession = () => {
        const token = this.authorizationService.getToken();
        if (token) {
            this.authorizationService.logout();
        }
    };

    /* Handle redirect if user's token is valid */
    handleRedirect = () => {
        this.user = this.authorizationService.getUser();
        // Check if token is still valid
        this.dataLayer.getUser({ fields: 'id' }).subscribe({
            next: this.redirectToInitialPage,
            error: this.handleExpiredSession,
        });
    };

    /** Redirect to the initially logged in page */
    redirectToInitialPage = () => {
        this.complete.postLoginRedirect(this.user, 'determineRedirect');
    };

    /** Show Toast */
    showToast(position, status, title, msg) {
        const duration = 7000;
        this.toastrService.show(msg, title, {
            position,
            status,
            duration,
        });
    }

    /** Change input type */
    getInputType() {
        if (this.showPassword) {
            return 'text';
        }
        return 'password';
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

    /** Change Password */
    serverChangePassword() {
        this.loading = true;
        const body = {
            old_password: this.changePasswordForm.value.currentPassword,
            new_password1: this.changePasswordForm.value.newPassword,
            new_password2: this.changePasswordForm.value.confirmPassword,
        };
        this.complete.changePassword(body, this.token).subscribe({
            next: this.handleChangePassword,
            error: this.handleError,
        });
    }

    /** handle token response for change password */
    handleChangePassword = () => {
        this.loading = false;
        this.showToast(
            'bottom-right',
            'success',
            'Change Password Successful',
            'New password has been saved'
        );

        setTimeout(() => {
            this.loading = false;
            this.passwordChange = false;
            this.cd.detectChanges();
        }, 4000);
    };

    /** Handle error from server */
    handleError = err => {
        this.loading = false;
        this.errorHandlerService.handleError(err, this);
        this.cd.detectChanges();
    };

    /** Server side login */
    serverLogin() {
        this.loading = true;
        const body = {
            username: this.email,
            password: this.password,
        };
        this.complete.attemptLogin(body).subscribe({
            next: this.handleResponse,
            error: this.errorHandler,
        });
    }

    /** Handle error from server */
    errorHandler = err => {
        this.loading = false;
        if (environment.sentryEnvironment === 'testing') {
            this.showToast(
                'bottom-right',
                'danger',
                `Error!`,
                `${err?.error?.error_description}`
            );
        } else {
            this.errorHandlerService.handleError(err);
        }
        this.loading = false;
        this.cd.detectChanges();
    };

    /**
     * toggle MFA
     */
    toggleMFA() {
        this.isMFA = !this.isMFA;
    }

    /** check MFA */
    checkMFA() {
        this.complete.attemptCheckMFA().subscribe({
            next: (response: any) => {
                this.mfa_options = response?.user_mfa_methods;
                this.user_id = response?.id;
                this.complete.tempMFAData = response;
                this.toggleMFA();
                this.cd.detectChanges();
            },
            error: err => {
                this.errorHandler(err);
            },
        });
    }

    /** handle token response from server */
    handleResponse = data => {
        this.token = data;
        if (isPlatformBrowser(this.platformId) && !data['error']) {
            if (this.enableMFA) {
                this.complete.heldLoginData = data;
                this.complete.tempLoginData = data;
                this.checkMFA();
            } else {
                this.completeLogin();
            }
            this.cd.detectChanges();
        } else {
            this.error = {
                title: 'Login Error',
                message: data.error_description,
            };
            this.showToast(
                'bottom-right',
                'danger',
                'Login Error',
                data.error_description
            );
            this.loading = false;
            this.cd.detectChanges();
        }
    };

    /** Access authserver /me */
    accessMe(data) {
        this.complete
            .accessMe(data)
            .subscribe({ next: this.receiveMe, error: this.handleMeError });
    }

    /**
     * Access data received from /me
     */
    receiveMe = meData => {
        this.authorizationService.setUser(meData);
        this.authorizationService
            .setAdvantageOrganisationDetails(this.token)
            .subscribe({ next: this.storeAdvDetails });
        this.authorizationService
            .setOrganisationDetails(this.token, 'erp')
            .subscribe({ next: this.storeErpDetails });
        this.complete.determineApplicationAccess(meData);
        this.complete.determineAppsNavigation();
    };

    /** Store info from advantage backend */
    storeAdvDetails = data => {
        this.authorizationService.setAdvantageOrganisation(data);
    };

    /** Store info from erp backend */
    storeErpDetails = data => {
        this.authorizationService.setOrganisation(data, 'erp');
    };

    /** window assign method */
    assignToWindow(url) {
        this.window.location.assign(url);
    }

    /**
     * Handle error from /me
     */
    handleMeError = meError => {
        const { url, error } = meError;
        /** Handle error if password needs to be changed */
        if (url.includes('profile/password/?roadblock=password_change')) {
            this.error = {
                title: 'Password Change',
                message:
                    'Your password requires to be updated for security purposes',
            };
            this.showToast(
                'bottom-right',
                'danger',
                'Alert',
                'Your password needs to be changed for security purposes'
            );

            setTimeout(() => {
                this.loading = false;
                this.passwordChange = !this.passwordChange;
                this.cd.detectChanges();
            }, 4000);
        } else if (
            url.includes('profile/password/?roadblock=account_expired')
        ) {
            this.showToast(
                'bottom-right',
                'danger',
                'Alert',
                'Your account has expired due not being active on the platform'
            );
            this.error = {
                title: 'Account Expired',
                message:
                    'Your account requires to be updated for security purposes',
            };
            setTimeout(() => {
                const index: number = url.indexOf('/manage');
                const authserver: string = url.substring(0, index);
                this.assignToWindow(authserver);
            }, 5000);
        } else if (
            url.includes('profile/password/?roadblock=password_expire')
        ) {
            this.showToast(
                'bottom-right',
                'danger',
                'Alert',
                'Your password has expired to maintain high security for the platform.'
            );
            this.error = {
                title: 'Password Expired',
                message: 'Your password requires to be updated',
            };
            setTimeout(() => {
                this.loading = false;
                this.passwordChange = !this.passwordChange;
                this.cd.detectChanges();
            }, 4000);
        }

        this.errorHandlerService.handleError(error);
    };

    /** Handle error message */
    errorMessage(result) {
        this.errors = result.errors.length ? result.errors : undefined;
        this.submitted = false;
        if (result.response.error) {
            this.errAlert = result.response.error;
            this.error = result.response.error;
        }
    }

    /** toggleForgotPasswordEmailForm */
    toggleForgotPasswordEmailForm = () => {
        this.showSubmitEmailForm = !this.showSubmitEmailForm;
    };

    /**
     * submitEmail
     */
    submitEmail = () => {
        const data = {
            email: this.emailResetForm.value.resetEmailAddress,
        };
        this.loading = true;
        this.complete.attemptSendResetPasswordEmail(data).subscribe({
            next: this.emailSentResponse,
            error: this.errorHandler,
        });
    };

    /**
     * emailSentResponse
     */
    emailSentResponse = () => {
        this.showToast(
            'bottom-right',
            'success',
            'Reset Password Successful',
            'An email has been sent, check to reset your password'
        );
        this.emailResetForm.reset();
        this.loading = false;
    };

    /**
     * validates email
     */
    emailValidator() {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return (control: AbstractControl): ValidationErrors | null => {
            const valid = emailPattern.test(control.value);
            return valid ? null : { invalidEmail: true };
        };
    }

    /** Complete login after successful MFA */
    completeLogin = () => {
        if (!this.token) {
            this.token = this.complete.tempLoginData;
        }
        this.authorizationService.storeToken(this.token);
        this.accessMe(this.token);
        this.loading = false;
        this.complete.tempMFAData = null;
        this.complete.tempLoginData = null;
        this.cd.detectChanges();
    };
}

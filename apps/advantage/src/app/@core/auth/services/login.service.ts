import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { StateService } from '@uirouter/core';
import _ from 'underscore';
import { DataLayerUtils } from './datalayer.utils.service';
import { Oauth2Service } from './oauth2.service';
import { Setup } from './setup.service';
import { HomePageService } from './home-page.service';
import { Authorization } from './authorization.service';
import { ErrorHandlerService } from '../../../shared/sil-http-services/error-handler';
import { QuintusAuthorizationService } from '../../../shared/sil-http-services/quintus.authorization.service';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { isPlatformBrowser } from '@angular/common';
import { Cookies } from '../../../shared/cookies/cookie.service';
import { environment } from '../../../../environments/environment';
import { RedirectService } from './redirect.service';

/**
 * interface used to define object data structure
 */
interface LooseObject {
    /** defines the object key value pair */
    [key: string]: any;
}

@Injectable()
export class CompleteService {
    customSessionLoadState = null;
    router: any;
    user: any;
    /** Contains the available workstations */
    workstations: any;
    /** Contains the window object */
    window: any;
    /** Tells the count of apps that are available */
    availableAppsCount: any;
    /** Describes what apps are available */
    availableApps = {
        advantage: false,
        healthCRM: false,
        accessAfya: false,
        autorecon: false,
        userguide: true,
    };
    variant: string;
    heldLoginData: any;
    private readonly MFA_DATA_KEY = 'mfa_login_data';
    private readonly LOGIN_DATA_KEY = 'login_data';
    windowHref?: string = window?.location?.href;

    /**
     *
     * @param errorHandler gives access to the error handler service
     * @param dataLayerUtils
     * @param authService
     * @param $state
     * @param quintusAuthService
     * @param setup
     * @param oauthConfig
     * @param homePageServ
     * @param dataLayer gives access to the datalayer service
     */
    constructor(
        private errorHandler: ErrorHandlerService,
        readonly dataLayerUtils: DataLayerUtils,
        public authService: Authorization,
        public $state: StateService,
        public quintusAuthService: QuintusAuthorizationService,
        public dataLayer: SilStoresService,
        public toastService: NbToastrService,
        readonly setup: Setup,
        protected oauthConfig: Oauth2Service,
        protected homePageServ: HomePageService,
        protected cookieService: Cookies,
        private httpClient: HttpClient,
        private redirectService: RedirectService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.variant = environment.variant;
        if (isPlatformBrowser(this.platformId)) {
            this.window = window;
        }
    }

    set tempMFAData(value: any) {
        if (value) {
            sessionStorage.setItem(this.MFA_DATA_KEY, JSON.stringify(value));
        } else {
            sessionStorage.removeItem(this.MFA_DATA_KEY);
        }
    }

    get tempMFAData(): any {
        const stored = sessionStorage.getItem(this.MFA_DATA_KEY);
        return stored ? JSON.parse(stored) : null;
    }

    set tempLoginData(value: any) {
        if (value) {
            sessionStorage.setItem(this.LOGIN_DATA_KEY, JSON.stringify(value));
        } else {
            sessionStorage.removeItem(this.LOGIN_DATA_KEY);
        }
    }

    get tempLoginData(): any {
        const stored = sessionStorage.getItem(this.LOGIN_DATA_KEY);
        return stored ? JSON.parse(stored) : null;
    }

    /**
     * postLoginRedirect determines where to redirect someone
     */
    postLoginRedirect = (user, redirect?): void => {
        this.setupWorkstations();
        this.determineApplicationAccess(user);
        if (redirect) {
            this.determineAppsNavigation();
        }
    };

    setSessionLoadState(fxn: any): void {
        this.customSessionLoadState = fxn;
    }

    /**
     * determines what application a user is directed to
     * @param user object containing user information
     */
    determineApplicationAccess(user) {
        const roles = user?.roles ?? [];
        const perms = user?.permissions;
        this.checkApps(perms, roles);
    }

    /** check the apps available to the user */
    checkApps(perms, roles) {
        if (
            perms !== null &&
            perms !== undefined &&
            roles !== null &&
            roles !== undefined
        ) {
            this.checkAdvantageApp(perms);
            this.checkAIApp(roles, perms);
            this.checkHealthCRMApp(roles, perms);
            this.checkAutoreconApp(roles);
        }
        this.availableAppsCount = _.countBy(
            this.availableApps,
            function (value) {
                const app = value === true ? 'true' : 'false';
                return app;
            }
        );
    }

    /** Determine navigation for apps component */
    determineAppsNavigation() {
        if (this.availableAppsCount.true > 1) {
            this.$state.go('auth.apps');
        } else {
            this.determineAdvantageNavigation();
        }
    }

    /**
     * redirect to healthcrm application
     * @param user object containing user information
     * @param roles User roles
     * @param perms User permissions
     */
    checkHealthCRMApp(roles, perms) {
        if (roles.includes('Health CRM') && perms.includes('crm.person_list')) {
            this.availableApps.healthCRM = true;
        }
    }

    /**
     * redirect to autorecon application
     */
    checkAutoreconApp(roles) {
        if (roles.includes('Autorecon')) {
            this.availableApps.autorecon = true;
            this.getAutoreconSettings();

            const parsedUrl = new URL(this.windowHref);
            const redirectURL = parsedUrl.searchParams.get('redirect_url');

            if (redirectURL) {
                const regex =
                    /^(https?:\/\/[a-zA-Z0-9.-]+(:[0-9]+)?\/autorecon\/clients\/[a-z]+\/view\/[a-z0-9-]+\/invoices-report\/view\/[a-z0-9-]+\/invoice-report)/;
                this.handleRedirectUrl(regex, redirectURL, 2);
            }
        }
    }

    handleRedirectUrl(
        regex: RegExp,
        redirectURL?: string,
        timesToDecode?: number
    ) {
        try {
            let decodedRedirectUrl = null;
            for (let i = 0; i < timesToDecode; i++) {
                decodedRedirectUrl = decodeURIComponent(redirectURL);
            }

            const match = decodedRedirectUrl.match(regex);

            if (match) {
                const cleanUrl = match[1];
                this.redirectService.redirectTo(cleanUrl);
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * redirect to access afya ai application
     * @param user object containing user information
     * @param roles User roles
     * @param perms User permissions
     */
    checkAIApp(roles, perms) {
        if (
            roles.includes('M-Daktari AI') &&
            perms.includes('mdaktari_ai.clinical_guideline_list')
        ) {
            this.availableApps.accessAfya = true;
        }
    }

    /**
     * redirect to advantage application
     */
    checkAdvantageApp(perms) {
        if (perms?.includes('advantage.patient_list')) {
            this.availableApps.advantage = true;
        }
    }

    /**
     * Determine where to navigate the user for Advantage
     * @param user contains user information
     */
    determineAdvantageNavigation() {
        this.setupWorkstations();
        /** Timeout to allow for selection of workstation to happen
         * The backend should always be called with a workstation set
         */
        setTimeout(() => {
            this.setUpClinicalIds();
            this.getOrganisationSettings();
        }, 1000);
        /** Check if user is a provider and has multiple workstations assigned */
        if (this.workstations?.length === 1) {
            this.cookieService.set(
                this.authService.ORGANISATION_USER_WORKSTATION,
                JSON.stringify(this.workstations[0])
            );
            this.$state.go('app.advantage.home', {}, { reload: true });
        } else if (this.workstations?.length !== 1) {
            this.$state.go('auth.workstation', {}, { reload: true });
        }
    }

    goToApp(app) {
        switch (app) {
            case 'advantage':
                this.determineAdvantageNavigation();
                break;
            case 'healthcrm':
                this.$state.go('app.healthcrm');
                break;
            case 'ai':
                this.$state.go('app.ai');
                break;
            case 'autorecon':
                this.$state.go('app.autorecon');
                break;
            case 'userguide':
                this.$state.go('app.userguide');
                break;
            default:
                this.determineAdvantageNavigation();
                break;
        }
    }

    /** Sets up the workstation of a user */
    setupWorkstations() {
        this.workstations =
            this.authService.getErpOrganisation()?.user_workstations;
    }

    /** Sets up user clinical ids */
    setUpClinicalIds() {
        this.dataLayer.list('userProfile').subscribe({
            next: (response: any) => {
                const ids = {
                    clinical_facility_id: response?.clinical_facility_id,
                    clinical_org_id: response?.clinical_org_id,
                };
                this.user = this.authService.getUser();
                this.user.permissions = response.permissions;
                this.authService.setUser(this.user);
                /** setup clinical ids */
                this.authService.setClinicalIds(ids);
            },
        });
    }

    /** Fetch organisation settings */
    getOrganisationSettings() {
        this.dataLayer.list('settings').subscribe({
            next: this.settingsRetrieved,
            error: this.handleOrganisationSettingsErr,
        });
    }
    /** Fetch autorecon settings */
    getAutoreconSettings() {
        this.dataLayer.list('autorecon-me').subscribe({
            next: this.settingsAutoreconRetrieved,
            error: this.handleAutoreconSettingsErr,
        });
    }

    /** When settings are retrieved */
    settingsRetrieved = data => {
        this.authService.setOrganisationSettings(data);
    };

    /** handle org settings api error */
    handleOrganisationSettingsErr = err => {
        this.errorHandler.handleError(err);
    };

    /** When autorecon settings are retrieved */
    settingsAutoreconRetrieved = data => {
        this.authService.setAutoreconSettings(data);
    };

    /** handle autorecon settings api error */
    handleAutoreconSettingsErr = err => {
        this.errorHandler.handleError(err);
    };

    /** /me authserver call */
    accessMe(aToken: LooseObject) {
        return this.authService.setOrganisationDetails(aToken);
    }

    /** attempts to change password
     */
    changePassword(data, token) {
        const headersObj = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.access_token}`,
        });
        const params = { headers: headersObj };
        return this.httpClient.post(
            `${environment.AUTH_SERVER_DOMAIN}/password_change/`,
            data,
            params
        );
    }

    /** attempts to login */
    attemptLogin(credz) {
        const headersObj = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        const params = { headers: headersObj };
        if (environment.sentryEnvironment !== 'testing') {
            return this.httpClient.post('/api/login', credz, params);
        } else {
            const urlencoded = new URLSearchParams();
            urlencoded.append('grant_type', 'password');
            urlencoded.append(
                'client_id',
                `${this.oauthConfig.oauthCredz.ssrClientID}`
            );
            urlencoded.append(
                'client_secret',
                `${this.oauthConfig.oauthCredz.ssrClientSecret}`
            );
            urlencoded.append('username', credz.username);
            urlencoded.append('password', credz.password);

            const myHeaders = new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            });
            return this.httpClient.post(
                `${environment.AUTH_SERVER_DOMAIN}/oauth2/token/`,
                urlencoded,
                { headers: myHeaders }
            );
        }
    }

    attemptCheckMFA() {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.heldLoginData?.access_token}`,
        });
        const queryParams = { fields: 'user_mfa_methods,id' };
        const params = { headers, params: queryParams };
        return this.httpClient.get(`${environment.ME}`, params);
    }

    attemptVerifyMFA(data: LooseObject) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.tempLoginData?.access_token}`,
            'Content-Type': 'application/json',
        });
        const params = { headers };
        return this.httpClient.post(
            `${environment.onBoardingURL}/api/auth/users-mfa/${data.id}/verify_otp/`,
            { code: data.code },
            params
        );
    }

    attemptAssignMFA(data: LooseObject) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.heldLoginData?.access_token}`,
            'Content-Type': 'application/json',
        });
        const params = { headers };
        return this.httpClient.post(
            `${environment.onBoardingURL}/api/auth/users-mfa/`,
            data,
            params
        );
    }

    /**
     * password reset
     * @param body
     * @returns
     */
    attemptResetPassword = body => {
        const headersObj = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Variant': this.variant,
        });
        const params = { headers: headersObj };
        return this.httpClient.post(
            `${environment.AUTH_SERVER_DOMAIN}/accounts/password/reset/confirm/`,
            body,
            params
        );
    };

    /**
     * attemptSendResetPasswordEmail
     * @param data
     * @returns
     */
    attemptSendResetPasswordEmail = data => {
        const headersObj = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Variant': this.variant,
        });
        const params = { headers: headersObj };
        return this.httpClient.post(
            `${environment.AUTH_SERVER_DOMAIN}/accounts/password/reset/`,
            data,
            params
        );
    };
}

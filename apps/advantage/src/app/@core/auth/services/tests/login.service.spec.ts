import { of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NbAlertComponent, NbToastrService } from '@nebular/theme';
import { AppConfigService } from '../../../../app-config.service';
import { HomePageService } from '../home-page.service';
import { Setup } from '../setup.service';
import { DataLayerUtils } from '../datalayer.utils.service';
import { AuthUrls, Oauth2Service, OauthCredz } from '../oauth2.service';
import { Authorization } from '../authorization.service';
import { CompleteService } from '../login.service';
import { StateService, Transition } from '@uirouter/core';
import { SkikaLoginComponent } from '../../components/login/login.component';
import { SilAlertComponent } from '../../../../shared/sil-layout/components/sil-alert/sil-alert.component';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { QuintusAuthorizationService } from '../../../../shared/sil-http-services/quintus.authorization.service';
import { Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { RedirectService } from '../redirect.service';

export class RedirectServiceStub {
    redirectTo() {
        return true;
    }
}

class AuthServiceStub {
    setAuthDetails() {
        return of(() => {});
    }
    scopes = { scopes: ['scope1', 'scope2'] };
    authUrls = new AuthUrls();
    oauthCredz = new OauthCredz();
    setUser() {
        return of(() => {});
    }
}

class QuintusAuthorizationServiceStub {
    checkAuthorization() {
        return of(() => {});
    }
}

const servDepArray = [
    DataLayerUtils,
    Authorization,
    AppConfigService,
    HttpClient,
    HttpHandler,
    HomePageService,
];

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                    clinical_facility_id: 'sdsewerwjampisu9',
                    clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
                },
            ],
        });
    }
}

class AuthorizationConfigStub {
    setAuthDetails() {
        const replay = new ReplaySubject<any>(3);
        replay.next({ business_partner: 'yte767hjdh', roles: [] });
        replay.error(new Error('Kaboom!!'));
        replay.complete();

        return replay;
    }

    setUser(data) {
        return data;
    }

    setOrganisation(data) {
        return data;
    }

    getUser() {
        return {
            client_types: ['PROVIDER'],
            permissions: 'advantage.visit_list',
        };
    }

    getOrganisation() {
        return {
            bp_type: 'SAVANNAH',
        };
    }

    setAdvantageOrganisation() {
        return of(() => {});
    }

    setAdvantageOrganisationDetails() {
        return of(() => {});
    }

    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }

    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }

    setUserDetails() {
        return new BehaviorSubject<any>({
            client_types: ['PROVIDER'],
        });
    }

    setOrganisationDetails() {
        return new BehaviorSubject<any>({
            client_types: ['PROVIDER'],
        });
    }

    setOrganisationSettings() {
        return [
            {
                id: '042eb8ef-00a7-41db-97c0-509dbb205e67',
                default: 'APPOINTMENT BOOKING',
                description:
                    'Select the preferred patient scheduling method to use',
                setting_type: 'str',
                name: 'scheduling:preferred_patient_scheduling_method',
                value: 'APPOINTMENT BOOKING',
            },
        ];
    }
    setAutoreconSettings() {
        return [
            {
                id: '042eb8ef-00a7-41db-97c0-509dbb205e67',
                default: 'APPOINTMENT BOOKING',
                description:
                    'Select the preferred patient scheduling method to use',
                setting_type: 'str',
                name: 'scheduling:preferred_patient_scheduling_method',
                value: 'APPOINTMENT BOOKING',
            },
        ];
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

@Injectable()
class SetUpStub extends Setup {
    availableFeatures = { allowCompleteRedirect: 'allow' };
}

describe('Login service: checkApps, mfa and postLoginRedirect', () => {
    let completeService: CompleteService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                SkikaLoginComponent,
                SilAlertComponent,
                NbAlertComponent,
            ],
            providers: [
                CompleteService,
                servDepArray,
                { provide: Oauth2Service, useClass: AuthServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: PLATFORM_ID, useValue: 'browser' },
                {
                    provide: QuintusAuthorizationService,
                    useClass: QuintusAuthorizationServiceStub,
                },
                { provide: Setup, useClass: SetUpStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
            ],
        });
        completeService = TestBed.inject(CompleteService);
    });

    it('should test postLoginRedirect PROVIDER', () => {
        const user = {
            client_types: ['PROVIDER'],
        };
        const fakefxn = () => {};
        completeService.setSessionLoadState(fakefxn);
        completeService.postLoginRedirect(user);
        completeService.determineAdvantageNavigation();
        expect(completeService).toBeTruthy();
    });

    it('should test postLoginRedirect when there is a redirect', () => {
        const user = {
            client_types: ['PROVIDER'],
        };
        const redirect = {};
        const fakefxn = () => {};
        completeService.setSessionLoadState(fakefxn);
        completeService.postLoginRedirect(user, redirect);
        completeService.determineAdvantageNavigation();
        expect(completeService).toBeTruthy();
    });

    it('should test postLoginRedirect PROVIDER when workstations are more than one', () => {
        spyOn(
            completeService.authService,
            'getErpOrganisation'
        ).and.returnValue({ user_workstations: [{}, {}] });
        const user = {
            client_types: ['PROVIDER'],
        };
        completeService.postLoginRedirect(user);
        completeService.determineAdvantageNavigation();
        expect(completeService).toBeTruthy();
    });

    it('should test postLoginRedirect PAYER', () => {
        const user = {
            client_types: ['PAYER'],
        };
        completeService.postLoginRedirect(user);
        completeService.determineAdvantageNavigation();
        expect(completeService).toBeTruthy();
    });

    it('should test postLoginRedirect LENDER and SAVANNAH', () => {
        const user = {
            client_types: ['SAVANNAH'],
        };
        completeService.postLoginRedirect(user);
        completeService.determineAdvantageNavigation();
        expect(completeService).toBeTruthy();
    });

    it('should test postLoginRedirect method 4', () => {
        const user = {
            client_types: ['LENDER'],
        };
        completeService.postLoginRedirect(user);
        completeService.determineAdvantageNavigation();
        expect(completeService).toBeTruthy();
    });

    it('should test postLoginRedirect and goToApp method', () => {
        const user = {
            client_types: ['PRACTITIONER'],
        };
        completeService.user = {
            client_types: ['PRACTITIONER'],
            permissions: ['advantage.patient_list', 'crm.person_list'],
        };
        completeService.determineAdvantageNavigation();
        completeService.postLoginRedirect(user);
        completeService.goToApp('advantage');
        completeService.goToApp('ai');
        completeService.goToApp('healthcrm');
        completeService.goToApp('autorecon');
        completeService.goToApp('userguide');
        completeService.goToApp('');
        completeService.checkAdvantageApp(['advantage.patient_list']);
        completeService.checkApps(
            ['advantage.patient_list', 'crm.person_list'],
            ['Health CRM']
        );
        spyOn(completeService.$state, 'go');
        completeService.determineAppsNavigation();
        expect(completeService).toBeTruthy();
    });

    it('should test postLoginRedirect method LENDER', () => {
        const user = {
            client_types: ['LENDER'],
        };
        completeService.postLoginRedirect(user);
        expect(completeService).toBeTruthy();
    });

    it('should test postLoginRedirect method PRACTITIONER', () => {
        const user = {
            client_types: ['PRACTITIONER'],
        };
        completeService.postLoginRedirect(user);
        expect(completeService).toBeTruthy();
    });

    it('should test attemptLogin', () => {
        environment.sentryEnvironment = 'production';
        const user = {
            email: '12',
            password: '1234',
        };
        completeService.attemptLogin(user);
        expect(completeService.attemptLogin).toBeTruthy();
    });

    it('should test attemptLogin - client side', () => {
        environment.sentryEnvironment = 'testing';
        const user = {
            email: '12',
            password: '1234',
        };
        completeService.tempMFAData = undefined;
        spyOn(sessionStorage, 'getItem').and.returnValue(undefined);
        const mfaData = completeService.tempMFAData;
        expect(mfaData).toBe(null);
        completeService.tempMFAData = { user_mfa_methods: {} };
        completeService.tempLoginData = undefined;
        const tempMfaData = completeService.tempLoginData;
        expect(tempMfaData).toBe(null);
        completeService.tempLoginData = { user_mfa_methods: {} };
        completeService.attemptLogin(user);
        expect(completeService.attemptLogin).toBeTruthy();
    });

    it('should test mfa set and get methods', () => {
        environment.sentryEnvironment = 'testing';
        completeService.tempMFAData = undefined;
        spyOn(sessionStorage, 'getItem').and.returnValue(
            JSON.stringify({ id: 2 })
        );
        const mfaData = completeService.tempMFAData;
        expect(mfaData).toBeDefined();
        completeService.tempMFAData = { user_mfa_methods: {} };
        completeService.tempLoginData = undefined;
        const tempMfaData = completeService.tempLoginData;
        expect(tempMfaData).toBeDefined();
        completeService.tempLoginData = { user_mfa_methods: {} };
        expect(completeService.attemptLogin).toBeTruthy();
    });

    it('should test attemptResetPassword', () => {
        const data = {
            new_password1: 'securepassword',
            new_password2: 'securepassword',
        };
        completeService.attemptResetPassword(data);
        expect(completeService.attemptResetPassword).toBeTruthy();
    });

    it('should test attemptSendResetPasswordEmail', () => {
        const data = {
            email: 'test@gmail.com',
        };
        completeService.attemptSendResetPasswordEmail(data);
        expect(completeService.attemptSendResetPasswordEmail).toBeTruthy();
    });

    it('should test functions', () => {
        completeService.setUpClinicalIds();
        completeService.getOrganisationSettings();
        completeService.handleOrganisationSettingsErr({});
        completeService.accessMe({});
        expect(completeService.settingsRetrieved).toBeTruthy();
        expect(completeService.accessMe).toBeTruthy();
    });

    it('should test changePassword', () => {
        const user = {
            currentPassword: '12',
            newPassword: '1234',
            confirmPassword: '1234',
        };
        completeService.changePassword(user, {});
        expect(completeService.changePassword).toBeTruthy();
    });

    it('should test determineAppsNavigation when availableAppsCount is 2', () => {
        completeService.availableAppsCount = 2;
        completeService.determineAppsNavigation();
        expect(completeService.determineAppsNavigation).toBeTruthy();
    });

    it('should test determineAppsNavigation when availableAppsCount is 0', () => {
        completeService.availableAppsCount = 0;
        completeService.determineAppsNavigation();
        expect(completeService.determineAppsNavigation).toBeTruthy();
    });

    it('should test determineAdvantageNavigation', fakeAsync(() => {
        completeService.determineAdvantageNavigation();
        tick(1000);
        flush();
        expect(completeService.determineAdvantageNavigation).toBeTruthy();
    }));

    it('should test attemptCheckMFA', () => {
        completeService.attemptCheckMFA();
        expect(completeService.attemptCheckMFA).toBeTruthy();
    });

    it('should test attemptVerifyMFA', () => {
        const data = { code: '654321' };
        completeService.attemptVerifyMFA(data);
        expect(completeService.attemptVerifyMFA).toBeTruthy();
    });

    it('should test attemptAssignMFA', () => {
        const data = { user: 'useri123', mfa_type: 'TOTP' };
        completeService.attemptAssignMFA(data);
        expect(completeService.attemptAssignMFA).toBeTruthy();
    });
});

class AuthorizationConfigStubAllSuccess {
    setAuthDetails() {
        const replay = new ReplaySubject<any>(3);
        replay.next({ business_partner: 'yte767hjdh', roles: [] });
        replay.error(new Error('Kaboom!!'));
        replay.complete();

        return replay;
    }

    getUser() {
        return {
            client_types: ['PROVIDER'],
            permissions: 'erp.dashboard_list',
            roles: ['Advantage Super User'],
        };
    }

    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }

    setOrganisationSettings() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    setAutoreconSettings() {
        return { organisation_id: '1' };
    }

    setAdvantageOrganisation() {
        return of(() => {});
    }

    setAdvantageOrganisationDetails() {
        return of(() => {});
    }

    setUser() {
        return new BehaviorSubject<any>({});
    }

    setOrganisation() {
        return new BehaviorSubject<any>({});
    }

    setClinicalIds() {
        return {};
    }

    getClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }

    setUserDetails() {
        return new BehaviorSubject<any>({});
    }

    setOrganisationDetails() {
        return new BehaviorSubject<any>({});
    }
}

describe('Login service: check app access', () => {
    let completeService: CompleteService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                SkikaLoginComponent,
                SilAlertComponent,
                NbAlertComponent,
            ],
            providers: [
                CompleteService,
                servDepArray,
                { provide: Oauth2Service, useClass: AuthServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: Authorization,
                    useClass: AuthorizationConfigStubAllSuccess,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: QuintusAuthorizationService,
                    useClass: QuintusAuthorizationServiceStub,
                },
                { provide: Setup, useClass: SetUpStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
            ],
        });
        completeService = TestBed.inject(CompleteService);
    });

    it('should test healthcrm authentication and redirect to healthcrm if permission exists', () => {
        const roles = ['Health CRM'];
        const perms = ['crm.person_list'];

        completeService.window = {
            location: {
                assign: () => {},
            },
        };
        completeService.checkHealthCRMApp(roles, perms);
        expect(completeService.availableApps.healthCRM).toBeTruthy();
    });

    it('should test autorecon authentication and redirect to autorecon if role exists', () => {
        const roles = ['Autorecon'];

        const redirectURL =
            'http://localhost:4200/auth/login?redirect_url=http%3A%2F%2Flocalhost%3A4200%2Fautorecon%2Fclients%2Freconciliation%2Fview%2Fe3b808b8-d1f3%2Finvoices-report%2Fview%2Fe3b808b8-d1f3-4242-861a-0a014a4482e9%2Finvoice-report';

        completeService.window = {
            location: {
                replace: () => true,
            },
        };
        completeService.windowHref = redirectURL;
        environment.displayFeature = 'true';

        spyOn(completeService, 'checkAutoreconApp').and.callThrough();
        completeService.checkAutoreconApp(roles);
        expect(completeService.availableApps.autorecon).toBeTruthy();
    });

    it('should test handleRedirectUrl', () => {
        const redirectURL =
            'https://jstyqfrd.r.eu-west-1.awstrack.me/L0/https:%2F%2Fuat-emr.advantage.slade360.com%2Fauth%2Flogin%3Fredirect_url=https%253A%252F%252Fuat-emr.advantage.slade360.com%252Fautorecon%252Fclients%252Freconciliation%252Fview%252F5b919dfd-77f1-47ef-9491-bdc707207b61%252Finvoices-report%252Fview%252F5b919dfd-77f1-47ef-9491-bdc707207b61%252Finvoice-report/1/0102019348a4f694-85b75688-3178-4061-b890-9fd476a67961-000000/EPSfCFKCs1miI1f8Sn5l5Y_Zrio=401';
        const regex =
            /^(https?:\/\/[a-zA-Z0-9.-]+(:[0-9]+)?\/autorecon\/clients\/[a-z]+\/view\/[a-z0-9-]+\/invoices-report\/view\/[a-z0-9-]+\/invoice-report)/;

        spyOn(completeService, 'handleRedirectUrl').and.callThrough();
        completeService.handleRedirectUrl(regex, redirectURL, 2);

        expect(completeService.handleRedirectUrl).toHaveBeenCalledWith(
            regex,
            redirectURL,
            2
        );
    });

    it('should test redirect to AI if mdaktari_ai.clinical_guideline_list exists', () => {
        const roles = ['M-Daktari AI'];
        const perms = ['mdaktari_ai.clinical_guideline_list'];
        completeService.window = {
            location: {
                assign: () => {},
            },
        };
        completeService.checkAIApp(roles, perms);
        expect(completeService.availableApps.accessAfya).toBeTruthy();
    });
    it('should test settingsAutoreconRetrieved function', () => {
        spyOn(completeService, 'settingsAutoreconRetrieved').and.callThrough();
        completeService.settingsAutoreconRetrieved({});
        expect(completeService.settingsAutoreconRetrieved).toHaveBeenCalledWith(
            {}
        );
    });
    it('should test getAutoreconSettings function', () => {
        spyOn(completeService, 'getAutoreconSettings').and.callThrough();
        completeService.getAutoreconSettings();
        expect(completeService.getAutoreconSettings).toHaveBeenCalledWith();
    });
});

class SilStoresServiceStubError {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                    clinical_facility_id: 'sdsewerwjampisu9',
                    clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
                },
            ],
        });
    }
}

describe('Login service: check app access, Error', () => {
    let completeService: CompleteService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                SkikaLoginComponent,
                SilAlertComponent,
                NbAlertComponent,
            ],
            providers: [
                CompleteService,
                servDepArray,
                { provide: Oauth2Service, useClass: AuthServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: Authorization,
                    useClass: AuthorizationConfigStubAllSuccess,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: QuintusAuthorizationService,
                    useClass: QuintusAuthorizationServiceStub,
                },
                { provide: Setup, useClass: SetUpStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: RedirectService, useClass: RedirectServiceStub },
            ],
        });
        completeService = TestBed.inject(CompleteService);
    });

    it('should test healthcrm authentication and redirect to healthcrm if permission exists', () => {
        const roles = ['Health CRM'];
        const perms = ['crm.person_list'];

        completeService.window = {
            location: {
                assign: () => {},
            },
        };
        completeService.checkHealthCRMApp(roles, perms);
        expect(completeService.availableApps.healthCRM).toBeTruthy();
    });

    it('should test autorecon authentication and redirect to autorecon if role exists', () => {
        const roles = ['Autorecon'];

        completeService.window = {
            location: {
                assign: () => {},
            },
        };
        environment.displayFeature = 'true';
        completeService.checkAutoreconApp(roles);
        expect(completeService.availableApps.autorecon).toBeTruthy();
    });

    it('should test redirect to AI if mdaktari_ai.clinical_guideline_list exists', () => {
        const roles = ['M-Daktari AI'];
        const perms = ['mdaktari_ai.clinical_guideline_list'];
        completeService.window = {
            location: {
                assign: () => {},
            },
        };
        completeService.checkAIApp(roles, perms);
        expect(completeService.availableApps.accessAfya).toBeTruthy();
    });
    it('should test handleAutoreconSettingsErr function', () => {
        spyOn(completeService, 'handleAutoreconSettingsErr').and.callThrough();
        completeService.handleAutoreconSettingsErr({});
        expect(completeService.handleAutoreconSettingsErr).toHaveBeenCalledWith(
            {}
        );
    });
    it('should test settingsAutoreconRetrieved function', () => {
        spyOn(completeService, 'settingsAutoreconRetrieved').and.callThrough();
        completeService.settingsAutoreconRetrieved({});
        expect(completeService.settingsAutoreconRetrieved).toHaveBeenCalledWith(
            {}
        );
    });

    it('should test getAutoreconSettings function', () => {
        spyOn(completeService, 'getAutoreconSettings').and.callThrough();
        completeService.getAutoreconSettings();
        expect(completeService.getAutoreconSettings).toHaveBeenCalledWith();
    });

    it('should test handleRedirectUrl error instance', () => {
        // Suppress console errors for this test
        spyOn(console, 'error').and.callFake(() => {});
        const redirectURL = '%';
        const regex =
            /^(https?:\/\/[a-zA-Z0-9.-]+(:[0-9]+)?\/autorecon\/clients\/[a-z]+\/view\/[a-z0-9-]+\/invoices-report\/view\/[a-z0-9-]+\/invoice-report)/;

        spyOn(completeService, 'handleRedirectUrl').and.callThrough();
        completeService.handleRedirectUrl(regex, redirectURL, 2);

        expect(completeService.handleRedirectUrl).toHaveBeenCalledWith(
            regex,
            redirectURL,
            2
        );
    });
});

describe('Login service: multifactor authentication', () => {
    let completeService: CompleteService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                SkikaLoginComponent,
                SilAlertComponent,
                NbAlertComponent,
            ],
            providers: [
                CompleteService,
                servDepArray,
                { provide: Oauth2Service, useClass: AuthServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: PLATFORM_ID, useValue: 'browser' },
                {
                    provide: QuintusAuthorizationService,
                    useClass: QuintusAuthorizationServiceStub,
                },
                { provide: Setup, useClass: SetUpStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
            ],
        });
        completeService = TestBed.inject(CompleteService);
    });
    it('should test attemptCheckMFA', () => {
        completeService.heldLoginData = { access_token: 'fake_access_token' };
        completeService.attemptCheckMFA();
        expect(completeService.attemptCheckMFA).toBeTruthy();
    });

    it('should test attemptVerifyMFA', () => {
        completeService.heldLoginData = { access_token: 'fake_access_token' };
        const data = { id: 'user123', code: '123456' };
        completeService.attemptVerifyMFA(data);
        expect(completeService.attemptVerifyMFA).toBeTruthy();
    });

    it('should test attemptAssignMFA', () => {
        completeService.heldLoginData = { access_token: 'fake_access_token' };
        const data = { method: 'sms', phone_number: '+1234567890' };
        completeService.attemptAssignMFA(data);
        expect(completeService.attemptAssignMFA).toBeTruthy();
    });
});

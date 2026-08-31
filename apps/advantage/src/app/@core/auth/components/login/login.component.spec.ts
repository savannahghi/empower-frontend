import { SkikaLoginComponent } from './login.component';
import {
    TestBed,
    ComponentFixture,
    fakeAsync,
    tick,
    flush,
} from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    Pipe,
    PipeTransform,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Authorization } from '../../services/authorization.service';
import { NbToastrService } from '@nebular/theme';
import { DataLayerUtils } from '../../services/datalayer.utils.service';
import { StateService, Transition } from '@uirouter/core';
import { NB_AUTH_OPTIONS, NbAuthService } from '@nebular/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { CompleteService } from '../../services/login.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { IdleService } from '../../services/idle.service';
import {
    AuthUrls,
    Oauth2Service,
    OauthCredz,
} from '../../services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { QuintusAuthorizationService } from '../../../../shared/sil-http-services/quintus.authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { FormControl } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { RedirectService } from '../../services/redirect.service';
import { RedirectServiceStub } from '../../services/tests/login.service.spec';
import { VariantPipe } from '../../../../@theme/pipes/variant/variant.pipe';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { SilKeycloakService } from 'app/shared/sil-keycloak/keycloak.service';
import { InitializeFlagsService } from '../../../utils/initialize-flags.service';

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params: {
        is_logged_out: 'true',
    },
    $current: {
        is: () => true,
    },
};

class InitializeFlagsServiceStub {
    growthbook: any = {
        setFeatures: () => {},
        evalFeature: () => ({ value: false }),
    };
    featureFlags: any = {};
    growthbookResponse: any = {};
    flagsReady$ = of(true);

    async loadFlags(): Promise<void> {
        return Promise.resolve();
    }

    waitForReady(): Promise<boolean> {
        return Promise.resolve(true);
    }

    getForcedValue(): boolean {
        return false;
    }
}

class AuthorizationConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
    loginUrl() {
        return of(() => {});
    }
    logout() {
        return of(() => {});
    }
    storeToken() {
        return true;
    }
    isLoggedIn() {
        return true;
    }

    setOrganisationSettings() {
        return of(() => {});
    }

    setOrganisation() {
        return of(() => {});
    }
    setOrganisationDetails() {
        return of({
            client_types: ['PRACTITIONER'],
        });
    }
    setUserDetails() {
        return of(() => {});
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }

    setUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }

    getUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getToken() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    setAdvantageOrganisation() {
        return {};
    }
    setAdvantageOrganisationDetails() {
        return of(() => {});
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: [{ workstation: '1' }],
        };
    }
    removeTokenData() {
        return {};
    }
}

class SilKeycloakServiceStub {
    getToken() {
        return true;
    }
    isLoggedIn(): Promise<boolean> {
        return Promise.resolve(true);
    }
    login() {
        return;
    }
}

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                    clinical_facility_id: 'sdsewerwjampisu9',
                    clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
                    appointment_status: 'BOOKED',
                    organisation_name: 'EMR/ERP Test Organisation',
                },
            ],
        });
    }

    getUser() {
        return of({
            id: '123',
        });
    }

    get() {
        return of({
            id: '123',
        });
    }
}

class PipeStub {
    transform() {
        return true;
    }
}

class AuthUrlConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    scopes = { scopes: ['scope1', 'scope2'] };
    authUrls = new AuthUrls();
    oauthCredz = new OauthCredz();
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

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class RouterStub {
    navigateByUrl() {
        return of(() => {});
    }
    navigate() {
        return false;
    }
}

class CompleteServiceStub {
    completeAuth() {
        return of(() => {});
    }
    attemptLogin() {
        return of({
            user: 'q1231',
            dat: 'q1231',
        });
    }
    determineApplicationAccess() {
        return false;
    }
    determineAppsNavigation() {
        return false;
    }
    changePassword() {
        return of({
            old_password: '123',
            new_password1: '1234',
            new_password2: '1234',
        });
    }
    attemptResetPassword() {
        return of({ response: 'succcess' });
    }
    attemptSendResetPasswordEmail() {
        return of({ response: 'succcess' });
    }
    attemptCheckMFA() {
        return of({
            user_mfa_methods: ['sms', 'email'],
            id: '12345',
        });
    }
    accessMe() {
        return of({ id: '123', name: 'Test User' });
    }
    postLoginRedirect() {
        return of(() => {});
    }
    heldLoginData: any;
    tempLoginData: any;
    tempMFAData: any;
}

class NbAuthServiceStub {
    authenticate() {
        return of({
            response: { body: '' },
            errors: [],
            isSuccess: () => true,
            getMessages: () => ['Hi', 'Yeah'],
        });
    }
}

class IdleServiceStub {
    setLogin = true;
}

class QuintusAuthorizationServiceStub {
    checkAuthorization() {
        return of(() => {});
    }
}

describe('SkikaLoginComponent: platform browser', () => {
    let component: SkikaLoginComponent;
    let fixture: ComponentFixture<SkikaLoginComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaLoginComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('variantDisplay'),
            ],
            providers: [
                DataLayerUtils,
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbAuthService, useClass: NbAuthServiceStub },
                { provide: NB_AUTH_OPTIONS, useValue: NB_AUTH_OPTIONS },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Router, useClass: RouterStub },
                { provide: PLATFORM_ID, useValue: 'browser' },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123, logout: 'is_logged_out' }),
                    },
                },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                {
                    provide: QuintusAuthorizationService,
                    useClass: QuintusAuthorizationServiceStub,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                { provide: IdleService, useClass: IdleServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: InitializeFlagsService,
                    useClass: InitializeFlagsServiceStub,
                },
                { provide: DOMParser, useClass: DOMParser },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeAll(() => {
        window.onbeforeunload = () => 'Dont use real window object';
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaLoginComponent);
        component = fixture.componentInstance;
        component.window = {
            location: {
                assign: () => {},
            },
        };
        fixture.detectChanges();
    });

    it('should test ngOnInit', fakeAsync(() => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        tick(500);
        flush();
        expect(component.ngOnInit).toHaveBeenCalled();
    }));

    it('should initialize keycloak if enabled keycloak is true', () => {
        // Mock the InitializeFlagsService to return true for keycloak
        spyOn(
            component.initializeFlagsService,
            'getForcedValue'
        ).and.returnValue(true);
        spyOn(component, 'setupKeycloakLogin').and.callThrough();

        component.ngOnInit();

        expect(component.setupKeycloakLogin).toHaveBeenCalled();
        expect(
            component.initializeFlagsService.getForcedValue
        ).toHaveBeenCalledWith('prov_authenticationSetKeyCloakToTrue');
    });

    it('should test handleKeycloakLogin', fakeAsync(() => {
        spyOn(component, 'handleKeycloakLogin').and.callThrough();
        spyOn(component.keycloakService, 'getToken').and.returnValue(
            Promise.reject('Error')
        );
        component.handleKeycloakLogin();
        expect(component.handleKeycloakLogin).toHaveBeenCalled();
    }));

    it('should test handling the authserver password_change error', fakeAsync(() => {
        const response = {
            url: 'profile/password/?roadblock=password_change',
        };
        spyOn(component, 'assignToWindow');
        component.handleMeError(response);
        tick(5010);
        expect(component.error.title).toBe('Password Change');
    }));

    it('should test handling the authserver account_expired error', fakeAsync(() => {
        const response = {
            url: 'profile/password/?roadblock=account_expired',
        };
        spyOn(component, 'assignToWindow');
        component.handleMeError(response);
        tick(5010);
        expect(component.error.title).toBe('Account Expired');
    }));

    it('should test handling the authserver password_expired error', fakeAsync(() => {
        const response = {
            url: 'profile/password/?roadblock=password_expired',
        };
        spyOn(component, 'assignToWindow');
        component.handleMeError(response);
        tick(5010);
        expect(component.error.title).toBe('Password Expired');
    }));

    it('should test handling the unknown authserver error', fakeAsync(() => {
        const response = {
            url: 'unknown error',
        };
        spyOn(component.errorHandlerService, 'handleError');
        component.handleMeError(response);
        expect(component.errorHandlerService.handleError).toHaveBeenCalled();
    }));

    it('should test window assign method', fakeAsync(() => {
        const response = {
            url: 'unknown error',
        };
        spyOn(component, 'assignToWindow').and.callThrough();
        component.assignToWindow(response.url);
        expect(component.assignToWindow).toHaveBeenCalled();
    }));

    it('should test serverLogin', () => {
        component.showToast('bottom-right', 'danger', 'Error', 'Errr');
        spyOn(component, 'serverLogin').and.callThrough();
        component.serverLogin();
        component.handleResponse({ data: 'hallo' });
        expect(component.serverLogin).toHaveBeenCalled();
    });

    it('should test serverChangePassword', () => {
        component.emailResetForm = component.fb.group({});
        component.changePasswordForm = component.fb.group({});
        component.showToast('bottom-right', 'danger', 'Error', 'Errr');
        spyOn(component, 'serverChangePassword').and.callThrough();
        component.serverChangePassword();
        expect(component.serverChangePassword).toHaveBeenCalled();
    });

    it('should test handleRedirect', () => {
        spyOn(component, 'handleRedirect').and.callThrough();
        component.handleRedirect();
        expect(component.handleRedirect).toHaveBeenCalled();
    });

    it('should test determineIfLoggedIn and param.is_expired is true', () => {
        spyOn(component, 'determineIfLoggedIn').and.callThrough();
        component.determineIfLoggedIn();
        component.complete.tempMFAData = { user_mfa_methods: {} };
        component.determineIfLoggedIn();
        component.redirectToInitialPage();
        expect(component.determineIfLoggedIn).toHaveBeenCalled();
    });

    it('should test toggleForgotPasswordEmailForm func', () => {
        spyOn(component, 'toggleForgotPasswordEmailForm').and.callThrough();
        component.toggleForgotPasswordEmailForm();
        expect(component.toggleForgotPasswordEmailForm).toHaveBeenCalled();
    });

    it('should test emailValidator func validates invalid email', () => {
        spyOn(component, 'emailValidator').and.callThrough();
        const control = new FormControl('test@.com');
        const validator = component.emailValidator();
        const result = validator(control);
        component.emailValidator();
        expect(result).toEqual({ invalidEmail: true });
        expect(component.emailValidator).toHaveBeenCalled();
    });

    it('should test emailValidator func validates a valid email', () => {
        spyOn(component, 'emailValidator').and.callThrough();
        const control = new FormControl('test@gmail.com');
        const validator = component.emailValidator();
        const result = validator(control);
        component.emailValidator();
        expect(result).toEqual(null);
        expect(component.emailValidator).toHaveBeenCalled();
    });

    it('should test submitEmail func', () => {
        component.emailResetForm = component.fb.group({});
        spyOn(component, 'submitEmail').and.callThrough();
        component.submitEmail();
        component.emailSentResponse();
        component.showToast('bottom-right', 'danger', 'Error', 'Errr');
        expect(component.submitEmail).toHaveBeenCalled();
    });

    it('should test emailSentResponse func', () => {
        component.emailResetForm = component.fb.group({});
        spyOn(component, 'emailSentResponse').and.callThrough();
        component.emailSentResponse();
        expect(component.emailSentResponse).toHaveBeenCalled();
    });

    it('should test handleChangePassword', fakeAsync(() => {
        spyOn(component, 'handleChangePassword').and.callThrough();
        component.handleChangePassword();
        component.showToast('bottom-right', 'danger', 'Error', 'Errr');
        tick(40000);
        expect(component.handleChangePassword).toHaveBeenCalled();
    }));

    it('should test handleError', () => {
        spyOn(component, 'handleError').and.callThrough();
        component.handleError({});
        component.showToast('bottom-right', 'danger', 'Error', 'Errr');
        expect(component.handleError).toHaveBeenCalled();
    });

    it('should test toggleMFA', () => {
        spyOn(component, 'toggleMFA').and.callThrough();
        component.toggleMFA();
        expect(component.toggleMFA).toHaveBeenCalled();
    });

    it('should test toggleMFA toggles isMFA state', () => {
        // Initial state should be false
        expect(component.isMFA).toBeFalsy();

        // First toggle
        component.toggleMFA();
        expect(component.isMFA).toBeTruthy();

        // Second toggle
        component.toggleMFA();
        expect(component.isMFA).toBeFalsy();
    });

    it('should test checkMFA success case', fakeAsync(() => {
        const mockResponse = {
            user_mfa_methods: ['sms', 'email'],
            id: '12345',
        };

        spyOn(component.complete, 'attemptCheckMFA').and.returnValue(
            of(mockResponse)
        );
        spyOn(component, 'toggleMFA');
        spyOn(component.cd, 'detectChanges');

        component.checkMFA();
        tick();

        expect(component.mfa_options).toEqual(mockResponse.user_mfa_methods);
        expect(component.user_id).toEqual(mockResponse.id);
        expect(component.toggleMFA).toHaveBeenCalled();
        expect(component.cd.detectChanges).toHaveBeenCalled();
    }));

    it('should test checkMFA error case', fakeAsync(() => {
        const mockError = { error: 'MFA check failed' };

        spyOn(component.complete, 'attemptCheckMFA').and.returnValue(
            throwError(() => mockError)
        );
        spyOn(component, 'errorHandler');

        component.checkMFA();
        tick();

        expect(component.errorHandler).toHaveBeenCalledWith(mockError);
    }));

    it('should test checkMFA', () => {
        spyOn(component, 'checkMFA').and.callThrough();
        component.checkMFA();
        expect(component.checkMFA).toHaveBeenCalled();
    });

    it('should complete login directly when MFA is disabled', fakeAsync(() => {
        // Mock successful login response
        const mockLoginData = {
            access_token: 'test-token',
            token_type: 'Bearer',
        };

        // Mock that MFA is disabled
        spyOnProperty(component, 'enableMFA').and.returnValue(false);

        // Spy on completeLogin and detectChanges
        spyOn(component, 'completeLogin');
        spyOn(component.cd, 'detectChanges');

        // Call handleResponse
        component.handleResponse(mockLoginData);
        tick();

        // Verify login completes without MFA check
        expect(component.completeLogin).toHaveBeenCalled();
        expect(component.cd.detectChanges).toHaveBeenCalled();
    }));

    it('should test completeLogin when token is null', () => {
        const mockLoginData = {
            access_token: 'test-token',
            token_type: 'Bearer',
        };
        spyOn(component.authorizationService, 'setUser');
        spyOn(component, 'completeLogin').and.callThrough();
        component.token = null;
        component.complete.tempLoginData = mockLoginData;
        component.completeLogin();
        expect(component.completeLogin).toHaveBeenCalled();
    });

    it('should set heldLoginData and call checkMFA when MFA is enabled', fakeAsync(() => {
        // Mock platform browser
        spyOnProperty(component, 'enableMFA').and.returnValue(true);

        // Set up spies
        spyOn(component, 'checkMFA');
        spyOn(component.cd, 'detectChanges');

        // Mock login data
        const mockLoginData = {
            access_token: 'test-token',
            token_type: 'Bearer',
        };

        // Call handleResponse
        component.handleResponse(mockLoginData);
        tick();

        // Verify heldLoginData is set and checkMFA is called
        expect(component.complete.heldLoginData).toEqual(mockLoginData);
        expect(component.checkMFA).toHaveBeenCalled();
        expect(component.cd.detectChanges).toHaveBeenCalled();
    }));

    it('should test setupKeycloakLogin catch block', fakeAsync(() => {
        spyOn(component.keycloakService, 'isLoggedIn').and.returnValue(
            Promise.reject('error')
        );
        spyOn(component.keycloakService, 'login');
        spyOn(component, 'showToast');

        component.setupKeycloakLogin();
        tick();

        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Authentication Error',
            'Failed to check Keycloak login status'
        );
        expect(component.keycloakService.login).toHaveBeenCalled();
    }));

    it('should test setupKeycloakLogin when user is not logged in', fakeAsync(() => {
        spyOn(component.keycloakService, 'isLoggedIn').and.returnValue(
            Promise.resolve(false)
        );
        spyOn(component.keycloakService, 'login');

        component.setupKeycloakLogin();
        tick();

        expect(component.keycloakService.login).toHaveBeenCalled();
    }));

    it('should test setupKeycloakLogin when user is already logged in', fakeAsync(() => {
        spyOn(component.keycloakService, 'isLoggedIn').and.returnValue(
            Promise.resolve(true)
        );
        spyOn(component, 'handleKeycloakLogin');

        component.setupKeycloakLogin();
        tick();

        expect(component.handleKeycloakLogin).toHaveBeenCalled();
    }));

    it('should test handleKeycloakLogin success case', fakeAsync(() => {
        const mockToken = 'test-keycloak-token';
        spyOn(component.keycloakService, 'getToken').and.returnValue(
            Promise.resolve(mockToken)
        );
        spyOn(component.authorizationService, 'storeToken');
        spyOn<any>(component, 'fetchKeycloakUserDetails');

        component.handleKeycloakLogin();
        tick();

        expect(component.authorizationService.storeToken).toHaveBeenCalledWith({
            access_token: mockToken,
            token_type: 'Bearer',
        });
        expect(component['fetchKeycloakUserDetails']).toHaveBeenCalled();
    }));

    it('should test fetchKeycloakUserDetails success flow', fakeAsync(() => {
        const mockToken = { access_token: 'test-token', token_type: 'Bearer' };
        const mockMeData = { id: '123', name: 'Test User' };
        const mockErpData = { user_workstations: [] };

        spyOn(
            component.authorizationService,
            'setAdvantageOrganisationDetails'
        ).and.returnValue(of(mockMeData));
        spyOn(
            component.authorizationService,
            'setOrganisationDetails'
        ).and.returnValue(of(mockErpData));
        spyOn(component.authorizationService, 'setUser');
        spyOn(component.authorizationService, 'setAdvantageOrganisation');
        spyOn(component.authorizationService, 'setOrganisation');
        spyOn(component.complete, 'determineApplicationAccess');
        spyOn(component.complete, 'determineAppsNavigation');

        component['fetchKeycloakUserDetails'](mockToken);
        tick();

        expect(component.authorizationService.setUser).toHaveBeenCalledWith(
            mockMeData
        );
        expect(
            component.authorizationService.setAdvantageOrganisation
        ).toHaveBeenCalledWith(mockMeData);
        expect(
            component.authorizationService.setOrganisation
        ).toHaveBeenCalledWith(mockErpData, 'erp');
        expect(
            component.complete.determineApplicationAccess
        ).toHaveBeenCalledWith(mockMeData);
        expect(component.complete.determineAppsNavigation).toHaveBeenCalled();
    }));

    it('should test fetchKeycloakUserDetails error handling', fakeAsync(() => {
        const mockToken = { access_token: 'test-token', token_type: 'Bearer' };
        const mockError = { error: 'Failed to fetch user details' };

        spyOn(
            component.authorizationService,
            'setAdvantageOrganisationDetails'
        ).and.returnValue(throwError(() => mockError));
        spyOn(component, 'handleError');

        component['fetchKeycloakUserDetails'](mockToken);
        tick();

        expect(component.handleError).toHaveBeenCalledWith(mockError);
    }));

    it('should test accessMe method', () => {
        const mockData = { access_token: 'test-token' };
        spyOn(component.complete, 'accessMe').and.returnValue(of({}));
        spyOn(component, 'receiveMe');

        component.accessMe(mockData);

        expect(component.complete.accessMe).toHaveBeenCalledWith(mockData);
    });

    it('should test receiveMe method', () => {
        const mockMeData = { id: '123', name: 'Test User' };
        spyOn(component.authorizationService, 'setUser');
        spyOn(
            component.authorizationService,
            'setAdvantageOrganisationDetails'
        ).and.returnValue(of({}));
        spyOn(
            component.authorizationService,
            'setOrganisationDetails'
        ).and.returnValue(of({}));
        spyOn(component, 'storeAdvDetails');
        spyOn(component, 'storeErpDetails');
        spyOn(component.complete, 'determineApplicationAccess');
        spyOn(component.complete, 'determineAppsNavigation');

        component.receiveMe(mockMeData);

        expect(component.authorizationService.setUser).toHaveBeenCalledWith(
            mockMeData
        );
        expect(
            component.complete.determineApplicationAccess
        ).toHaveBeenCalledWith(mockMeData);
        expect(component.complete.determineAppsNavigation).toHaveBeenCalled();
    });

    it('should test storeAdvDetails method', () => {
        const mockData = { id: '123' };
        spyOn(component.authorizationService, 'setAdvantageOrganisation');

        component.storeAdvDetails(mockData);

        expect(
            component.authorizationService.setAdvantageOrganisation
        ).toHaveBeenCalledWith(mockData);
    });

    it('should test storeErpDetails method', () => {
        const mockData = { user_workstations: [] };
        spyOn(component.authorizationService, 'setOrganisation');

        component.storeErpDetails(mockData);

        expect(
            component.authorizationService.setOrganisation
        ).toHaveBeenCalledWith(mockData, 'erp');
    });

    it('should test completeLogin when token exists', () => {
        const mockToken = { access_token: 'test-token' };
        component.token = mockToken;
        component.complete.tempLoginData = null;
        component.complete.tempMFAData = { id: '123' };

        spyOn(component.authorizationService, 'storeToken');
        spyOn(component, 'accessMe');
        spyOn(component.cd, 'detectChanges');

        component.completeLogin();

        expect(component.authorizationService.storeToken).toHaveBeenCalledWith(
            mockToken
        );
        expect(component.accessMe).toHaveBeenCalledWith(mockToken);
        expect(component.loading).toBe(false);
        expect(component.complete.tempMFAData).toBeNull();
        expect(component.complete.tempLoginData).toBeNull();
        expect(component.cd.detectChanges).toHaveBeenCalled();
    });

    it('should test handleLoginWorkflow when is_expired is true', () => {
        const params = { is_expired: true };
        spyOn(component, 'handleExpiredSession');

        component.handleLoginWorkflow(params);

        expect(component.handleExpiredSession).toHaveBeenCalled();
    });

    it('should test setupSilLogin method', fakeAsync(() => {
        spyOn(component, 'determineIfLoggedIn');

        component.setupSilLogin();
        tick(500);

        expect(component.formToggle).toBe(true);
        expect(component.changePasswordForm).toBeDefined();
        expect(component.emailResetForm).toBeDefined();
        expect(component.determineIfLoggedIn).toHaveBeenCalled();
    }));
});

class SilKeycloakServiceFalseLogginStub {
    getToken() {
        return true;
    }
    isLoggedIn(): Promise<boolean> {
        return Promise.resolve(false);
    }
}

describe('SkikaLoginComponent platform server', () => {
    let component: SkikaLoginComponent;
    let fixture: ComponentFixture<SkikaLoginComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaLoginComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                CommonModule,
                FormsModule,
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('variantDisplay'),
            ],
            providers: [
                DataLayerUtils,
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbAuthService, useClass: NbAuthServiceStub },
                { provide: NB_AUTH_OPTIONS, useValue: NB_AUTH_OPTIONS },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Router, useClass: RouterStub },
                { provide: PLATFORM_ID, useValue: 'server' },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceFalseLogginStub,
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123, logout: 'is_logged_out' }),
                    },
                },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                {
                    provide: QuintusAuthorizationService,
                    useClass: QuintusAuthorizationServiceStub,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                { provide: IdleService, useClass: IdleServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: InitializeFlagsService,
                    useClass: InitializeFlagsServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaLoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should test serverLogin and ngOnit', () => {
        spyOn(component, 'serverLogin').and.callThrough();
        component.ngOnInit();
        component.serverLogin();
        component.handleResponse({ data: 'hallo' });
        expect(component.serverLogin).toHaveBeenCalled();
    });

    it('should test serverLogin and ngOnit', () => {
        spyOn(component.authorizationService, 'isLoggedIn').and.returnValue(
            true
        );
        spyOn(component, 'handleRedirect');
        component.handleLoginWorkflow({ is_expired: false });
        expect(component.handleRedirect).toHaveBeenCalled();
    });
});

class CompleteServiceStubError {
    completeAuth() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    attemptLogin() {
        const sub = new BehaviorSubject('');
        sub.error({ error: 'Kumenuka' });
        return sub;
    }
}

describe('SkikaLoginComponent: error', () => {
    let component: SkikaLoginComponent;
    let fixture: ComponentFixture<SkikaLoginComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaLoginComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('variantDisplay'),
                CommonModule,
                FormsModule,
            ],
            providers: [
                DataLayerUtils,
                AppConfigService,
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: CompleteService,
                    useClass: CompleteServiceStubError,
                },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbAuthService, useClass: NbAuthServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NB_AUTH_OPTIONS, useValue: NB_AUTH_OPTIONS },
                { provide: Router, useClass: RouterStub },
                {
                    provide: QuintusAuthorizationService,
                    useClass: QuintusAuthorizationServiceStub,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123, logout: 'is_logged_out' }),
                    },
                },
                {
                    provide: InitializeFlagsService,
                    useClass: InitializeFlagsServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaLoginComponent);
        component = fixture.componentInstance;
        component.window = {
            location: {
                assign: () => {},
            },
        };
        fixture.detectChanges();
    });

    it('should test errorMessage', () => {
        component.errorMessage({ errors: [], response: { error: 'error' } });
        expect(component.errorMessage).toBeTruthy();
    });

    it('should test password method', () => {
        spyOn(component, 'toggleShowPassword').and.callThrough();
        component.toggleShowPassword();
        component.getInputType();
        component.toggleShowPassword();
        component.getInputType();
        expect(component.toggleShowPassword).toHaveBeenCalled();
        expect(component.showPassword).toBe(false);
    });

    it('should test toggleShowPassword method when status is CURRENT', () => {
        spyOn(component, 'toggleShowPassword').and.callThrough();
        const status = 'CURRENT';
        component.toggleShowPassword(status);
        expect(component.toggleShowPassword).toHaveBeenCalled();
    });

    it('should test toggleShowPassword method when status is NEW', () => {
        spyOn(component, 'toggleShowPassword').and.callThrough();
        const status = 'NEW';
        component.toggleShowPassword(status);
        expect(component.toggleShowPassword).toHaveBeenCalled();
    });

    it('should test toggleShowPassword method when status is CONFIRM', () => {
        spyOn(component, 'toggleShowPassword').and.callThrough();
        const status = 'CONFIRM';
        component.toggleShowPassword(status);
        expect(component.toggleShowPassword).toHaveBeenCalled();
    });

    it('should test serverLogin method server side', () => {
        environment.sentryEnvironment = 'production';
        spyOn(component, 'serverLogin').and.callThrough();
        component.serverLogin();
        component.errorHandler({});
        expect(component.serverLogin).toHaveBeenCalled();
    });

    it('should test serverLogin method client side', () => {
        environment.sentryEnvironment = 'testing';
        spyOn(component, 'serverLogin').and.callThrough();
        component.serverLogin();
        component.errorHandler({});
        expect(component.serverLogin).toHaveBeenCalled();
    });

    it('should test errorMessage', () => {
        component.errorMessage({
            errors: ['error'],
            response: { error: false },
        });
        expect(component.errorMessage).toBeTruthy();
    });

    it('should test mustMatch method', () => {
        spyOn(component, 'mustMatch').and.callThrough();
        component.changePasswordForm = component.fb.group(
            {
                confirmPassword: '',
                newPassword: '',
            },
            {
                validators: component.mustMatch(
                    'newPassword',
                    'confirmPassword'
                ),
            }
        );
        const confirmPassword =
            component.changePasswordForm.get('confirmPassword');
        const newPassword = component.changePasswordForm.get('newPassword');
        confirmPassword.setValue('1');
        newPassword.setValue('2');
        expect(confirmPassword.errors).toEqual({ passwordNotSame: true });
        newPassword.setValue('1');
        confirmPassword.setValue('1');
        expect(confirmPassword.errors).toBeNull();
    });

    it('should test handleError', () => {
        spyOn(component, 'handleError').and.callThrough();
        component.handleError({});
        component.showToast('bottom-right', 'danger', 'Error', 'Errr');
        expect(component.handleError).toHaveBeenCalled();
    });
});

class NbAuthServiceStub2 {
    authenticate() {
        return of({
            response: { error: 'error', body: '' },
            errors: ['error'],
        });
    }
}

const uIRouterGlobalsStubIsExpiredTrue = {
    current: {
        name: 'state',
    },
    params: {
        is_logged_out: 'true',
        is_expired: true,
    },
    $current: {
        is: () => true,
    },
};

describe('SkikaLoginComponent: param.is_expired', () => {
    let component: SkikaLoginComponent;
    let fixture: ComponentFixture<SkikaLoginComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaLoginComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('variantDisplay'),
                FormsModule,
            ],
            providers: [
                DataLayerUtils,
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: CompleteService,
                    useClass: CompleteServiceStub,
                },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbAuthService, useClass: NbAuthServiceStub2 },
                { provide: NB_AUTH_OPTIONS, useValue: NB_AUTH_OPTIONS },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStubIsExpiredTrue,
                },
                { provide: Router, useClass: RouterStub },
                {
                    provide: QuintusAuthorizationService,
                    useClass: QuintusAuthorizationServiceStub,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123, logout: 'is_logged_out' }),
                    },
                },
                {
                    provide: InitializeFlagsService,
                    useClass: InitializeFlagsServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaLoginComponent);
        component = fixture.componentInstance;
        spyOn(component.$state, 'go');
        component.window = {
            location: {
                assign: () => {},
            },
        };
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test determineIfLoggedIn and param.is_expired is true', () => {
        component.complete.tempMFAData = undefined;
        spyOn(component, 'determineIfLoggedIn').and.callThrough();
        component.determineIfLoggedIn();
        component.handleExpiredSession();
        expect(component.determineIfLoggedIn).toHaveBeenCalled();
    });
});

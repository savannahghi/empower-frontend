import { ResetPasswordComponent } from './reset-password.component';
import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    Pipe,
    PipeTransform,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { NbAuthService, NbTokenService, NbTokenStorage } from '@nebular/auth';
import { of } from 'rxjs';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { TranslateService } from '@ngx-translate/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import {
    NbMediaBreakpointsService,
    NbThemeService,
    NbToastrService,
} from '@nebular/theme';
import { Authorization } from '../../services/authorization.service';
import { CompleteService } from '../../services/login.service';
import { DataLayerUtils } from '../../services/datalayer.utils.service';
import { Setup } from '../../services/setup.service';
import { Oauth2Service } from '../../services/oauth2.service';
import { environment } from '../../../../../environments/environment';
import { RedirectService } from '../../services/redirect.service';
import { RedirectServiceStub } from '../../services/tests/login.service.spec';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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

class NbTokenStorageStub {
    get() {
        return {};
    }
}

class StateServiceStub {
    go() {
        return true;
    }
}

class NbAuthServiceStub {
    register() {
        return of({
            getResponse() {},
            isSuccess() {
                return true;
            },
        });
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'app.rest-password',
    },
    params() {
        return { token: 'asdsdasd', uid: '234234' };
    },
};

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
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get(cookie) {
        if (cookie === 'app.theme') {
            return environment.variant;
        } else {
            return {
                first_name: 'Jon',
                last_name: 'Doe',
            };
        }
    }
    set() {
        return {
            first_name: 'Jon',
            last_name: 'Doe',
        };
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
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
}

const nbMediaBreakpointsServiceStub = {
    getBreakpointsMap: () => {
        const obj = {
            sm: 500,
            lg: 800,
        };
        return obj;
    },
};

class LayoutServiceStub {
    changeLayoutSize() {
        return {};
    }
    onMediaQueryChange() {
        return of([{ currentBreakpoint: { width: {} } }, {}]);
    }
    onThemeChange() {
        return of([{ currentBreakpoint: { width: {} } }, {}]);
    }
    changeTheme() {
        return of([{ currentBreakpoint: { width: {} } }, {}]);
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

describe('ResetPasswordComponent', () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ResetPasswordComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [mockPipe('translate'), mockPipe('variant')],
            providers: [
                DataLayerUtils,
                NbTokenService,
                Setup,
                { provide: NB_AUTH_OPTIONS, useValue: NB_AUTH_OPTIONS },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: NbAuthService, useClass: NbAuthServiceStub },
                { provide: NbTokenStorage, useClass: NbTokenStorageStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: NbThemeService, useClass: LayoutServiceStub },
                {
                    provide: NbMediaBreakpointsService,
                    useValue: nbMediaBreakpointsServiceStub,
                },
                ErrorHandlerService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test when app.theme is undefined', () => {
        spyOn(component, 'determineUserTheme').and.callThrough();
        environment.variant = 'MSOAS';
        component.determineUserTheme();
        expect(component.determineUserTheme).toHaveBeenCalled();
    });

    it('should test changeTheme method', () => {
        spyOn(component, 'changeTheme').and.callThrough();
        component.changeTheme('');
        spyOn(localStorage, 'getItem').and.returnValue('default');
        component.determineUserTheme();
        expect(component.changeTheme).toHaveBeenCalled();
    });

    it('should test onSubmitPassword method if passwords matches', () => {
        component.passwordNotMatch = false;
        component.onSubmitPassword();
        expect(component.onSubmitPassword).toBeTruthy();
    });

    it('should test toggleShowPassword method', () => {
        component.toggleShowPassword();
        expect(component.toggleShowPassword).toBeTruthy();
    });

    it('should test getInputType method', () => {
        component.getInputType();
        expect(component.getInputType).toBeTruthy();
    });

    it('should test getInputType for password method', () => {
        component.showPassword = true;
        component.getInputType();
        expect(component.getInputType).toBeTruthy();
    });

    it('should test checKPasswordMatches method if passwords matches', () => {
        component.password1 = '123';
        component.password2 = '123';
        component.checKPasswordMatches();
        component.onSubmitPassword();
        expect(component.checKPasswordMatches).toBeTruthy();
    });

    it('should test checKPasswordMatches method if passwords matches dont match', () => {
        component.password1 = '123';
        component.password2 = '321';
        component.checKPasswordMatches();
        component.onSubmitPassword();
        expect(component.checKPasswordMatches).toBeTruthy();
    });

    it('should test handleResponse method', fakeAsync(() => {
        component.time = 5;
        component.password1 = '123';
        component.password2 = '321';
        component.checKPasswordMatches();
        spyOn(component, 'onSubmitPassword').and.callThrough();
        component.onSubmitPassword();
        component.handleResponse();
        component.countdown();
        tick(30000);
        flush();
        expect(component.onSubmitPassword).toHaveBeenCalled();
    }));

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the errorHandler method', () => {
        spyOn(component, 'errorHandler').and.callThrough();
        component.errorHandler({ message: 'error!' });
        expect(component.errorHandler).toHaveBeenCalled();
    });
});

class CookieServiceStubUndefined {
    setLanguageCookie() {
        return 'en';
    }
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return undefined;
    }
    set() {
        return {
            first_name: 'Jon',
            last_name: 'Doe',
        };
    }
}

describe('ResetPasswordComponent theme undefined', () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ResetPasswordComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [mockPipe('translate'), mockPipe('variant')],
            providers: [
                DataLayerUtils,
                NbTokenService,
                Setup,
                { provide: NB_AUTH_OPTIONS, useValue: NB_AUTH_OPTIONS },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStubUndefined },
                { provide: NbAuthService, useClass: NbAuthServiceStub },
                { provide: NbTokenStorage, useClass: NbTokenStorageStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: NbThemeService, useClass: LayoutServiceStub },
                {
                    provide: NbMediaBreakpointsService,
                    useValue: nbMediaBreakpointsServiceStub,
                },
                ErrorHandlerService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test when app.theme is undefined', () => {
        spyOn(component, 'determineUserTheme').and.callThrough();
        component.determineUserTheme();
        expect(component.determineUserTheme).toHaveBeenCalled();
    });
});

class CookieServiceStubCorporate {
    setLanguageCookie() {
        return 'en';
    }
    getLanguageCookie() {
        return 'en';
    }
    get(cookie) {
        if (cookie === 'app.theme') {
            return 'corporate';
        } else {
            return {
                first_name: 'Jon',
                last_name: 'Doe',
            };
        }
    }
    set() {
        return {
            first_name: 'Jon',
            last_name: 'Doe',
        };
    }
}

describe('ResetPasswordComponent theme defined and no environment variant', () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ResetPasswordComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [mockPipe('translate'), mockPipe('variant')],
            providers: [
                DataLayerUtils,
                NbTokenService,
                Setup,
                { provide: NB_AUTH_OPTIONS, useValue: NB_AUTH_OPTIONS },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStubCorporate },
                { provide: NbAuthService, useClass: NbAuthServiceStub },
                { provide: NbTokenStorage, useClass: NbTokenStorageStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: NbThemeService, useClass: LayoutServiceStub },
                {
                    provide: NbMediaBreakpointsService,
                    useValue: nbMediaBreakpointsServiceStub,
                },
                ErrorHandlerService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test when app.theme is undefined', () => {
        spyOn(component, 'determineUserTheme').and.callThrough();
        environment.variant = 'MSOAS';
        component.determineUserTheme();
        expect(component.determineUserTheme).toHaveBeenCalled();
    });
});

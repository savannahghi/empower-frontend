import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    DOCUMENT,
} from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { NgIdleKeepaliveModule, Keepalive } from '@ng-idle/keepalive';
import { RouterTestingModule } from '@angular/router/testing';
import {
    BsModalService,
    ModalDirective,
    ModalModule,
} from 'ngx-bootstrap/modal';
import { Idle } from '@ng-idle/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { of } from 'rxjs';
import { StateService } from '@uirouter/core';

import { UIRouterGlobals } from '@uirouter/angular';
import { SilLogoutComponent } from './@core/auth/components/logout/logout.component';
import { environment } from '../environments/environment';
import { AnalyticsService } from './@core/utils/analytics.service';
import { IdleService } from './@core/auth/services/idle.service';
import { Authorization } from './@core/auth/services/authorization.service';
import { Cookies } from './shared/cookies/cookie.service';
import { FeatureFlagService } from './@core/utils/feature.service';
import { VariantPipe } from './@theme/pipes/variant/variant.pipe';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import Clarity from '@microsoft/clarity';

class AuthorizationConfigStub {
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
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
            client_types: ['PROVIDER'],
            user_workstations: null,
        };
    }
    removeTokenData() {
        return {};
    }
    removeAuthToken() {
        return {};
    }
    getToken() {
        return {};
    }
    logout() {
        return {};
    }
}

const subcribe = {
    subscribe: () => {
        return {};
    },
};

const obj = {
    onClose: subcribe,
};

const nbDialogServiceStub = {
    open() {
        return obj;
    },
};

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { appointment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

class IdleStub {
    setIdle() {
        return () => {};
    }
    setInterrupts() {
        return () => {};
    }
    onTimeout = {
        subscribe: () => {},
    };
    setTimeout() {
        return () => {};
    }
    watch() {
        return () => {};
    }
    stop() {
        return () => {};
    }
    onIdleStart = {
        subscribe: () => {},
    };
    onIdleEnd = {
        subscribe: () => {},
    };
    onTimeoutWarning = {
        subscribe: () => {},
    };
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class MockDocument {
    querySelectorAll() {
        return {
            forEach() {
                return {
                    remove: () => {},
                };
            },
        };
    }
}

class PipeStub {
    transform() {
        return true;
    }
}

describe('AppComponent', () => {
    let component: AppComponent;
    let doc: Document;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                ModalDirective,
                NgIdleKeepaliveModule,
                ModalModule.forRoot(),
                RouterTestingModule.withRoutes([
                    { path: 'auth/logout', component: SilLogoutComponent },
                ]),
                AngularFireModule.initializeApp(
                    environment.firebase,
                    'random-app'
                ),
                AngularFireAnalyticsModule,
            ],
            providers: [
                { provide: Document, useClass: MockDocument },
                { provide: StateService, useClass: StateServiceStub },
                { provide: AnalyticsService },
                { provide: IdleService },
                { provide: BsModalService },
                { provide: Keepalive },
                { provide: Idle, useClass: IdleStub },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                { provide: NbDialogService, useValue: nbDialogServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        doc = TestBed.inject(DOCUMENT);
        fixture.detectChanges();
    });

    it('should create component', () => {
        const spy = spyOn(doc, 'querySelectorAll').and.callThrough();
        component.childModal.show();
        component.stay();
        expect(spy).toHaveBeenCalled();
        component.reset();
        component.logout();
        component.hideChildModal();
        expect(component).toBeTruthy();
    });
});

class AuthorizationConfigStub2 {
    isLoggedIn() {
        return false;
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
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
            client_types: ['PROVIDER'],
            user_workstations: null,
        };
    }
    removeTokenData() {
        return {};
    }
    removeAuthToken() {
        return {};
    }
    getToken() {
        return {};
    }
    logout() {
        return {};
    }
}

describe('AppComponent should test idle functions', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let doc: Document;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                ModalDirective,
                NgIdleKeepaliveModule,
                ModalModule.forRoot(),
                AngularFireModule.initializeApp(
                    environment.firebase,
                    'random-app'
                ),
                AngularFireAnalyticsModule,
            ],
            providers: [
                { provide: Document, useClass: MockDocument },
                { provide: AnalyticsService },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbDialogService, useValue: nbDialogServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: IdleService },
                { provide: BsModalService },
                { provide: Keepalive },
                { provide: Idle, useClass: IdleStub },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                { provide: FeatureFlagService },
                { provide: Authorization, useClass: AuthorizationConfigStub2 },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        doc = TestBed.inject(DOCUMENT);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        const spy = spyOn(doc, 'querySelectorAll').and.callThrough();
        component.childModal.show();
        component.stay();
        expect(spy).toHaveBeenCalled();
        component.reset();
        component.logout();
        component.hideChildModal();
        component.onTimeout();
        component.onTimeoutWarning();
        component.onIdleStart();
        component.onIdleEnd();
        component.onPing();
        component.toggleDialog();
        expect(component).toBeTruthy();
    });

    // --- onTimeout: Keycloak enabled ---

    it('should call auth logout with isTimeout=true when keycloak is enabled', () => {
        const flagService = TestBed.inject(FeatureFlagService);
        spyOn(flagService, 'isFeatureOn').and.returnValue(true);

        const logoutSpy = spyOn(component.authConfig, 'logout').and.returnValue(
            of(undefined)
        );
        spyOn(component, 'dumpState');

        component.onTimeout();

        expect(logoutSpy).toHaveBeenCalledWith(true);
        expect(component.idleState).toBe('TIMED_OUT');
    });

    it('onTimeout with keycloak enabled should dump state before calling logout', () => {
        const flagService = TestBed.inject(FeatureFlagService);
        spyOn(flagService, 'isFeatureOn').and.returnValue(true);

        const dumpStateSpy = spyOn(component, 'dumpState');
        spyOn(component.authConfig, 'logout').and.returnValue(of(undefined));

        component.onTimeout();

        expect(dumpStateSpy).toHaveBeenCalled();
    });

    it('onTimeout with keycloak enabled should subscribe to the logout observable', () => {
        const flagService = TestBed.inject(FeatureFlagService);
        spyOn(flagService, 'isFeatureOn').and.returnValue(true);

        const logoutObs = of(undefined);
        const subscribeSpy = spyOn(logoutObs, 'subscribe').and.callThrough();
        spyOn(component.authConfig, 'logout').and.returnValue(logoutObs);
        spyOn(component, 'dumpState');

        component.onTimeout();

        expect(subscribeSpy).toHaveBeenCalled();
    });

    // --- onTimeout: Keycloak disabled ---

    it('onTimeout with keycloak disabled should hide modal, show login popup, and not call logout', () => {
        const flagService = TestBed.inject(FeatureFlagService);
        spyOn(flagService, 'isFeatureOn').and.returnValue(false);

        spyOn(component.childModal, 'hide');
        const popupSpy = spyOn(component, 'popupLoginComponent');
        const logoutSpy = spyOn(component.authConfig, 'logout');
        spyOn(component, 'dumpState');

        component.onTimeout();

        expect(component.childModal.hide).toHaveBeenCalled();
        expect(popupSpy).toHaveBeenCalled();
        expect(logoutSpy).not.toHaveBeenCalled();
        expect(component.timedOut).toBe(true);
        expect(component.idleState).toBe('TIMED_OUT');
    });

    it('onTimeout with keycloak disabled should set idleService.setLogin and dump state', () => {
        const flagService = TestBed.inject(FeatureFlagService);
        spyOn(flagService, 'isFeatureOn').and.returnValue(false);

        const idleService = TestBed.inject(IdleService);
        spyOn(component.childModal, 'hide');
        spyOn(component, 'popupLoginComponent');
        const dumpStateSpy = spyOn(component, 'dumpState');

        component.onTimeout();

        expect(idleService.setLogin).toBe(true);
        expect(dumpStateSpy).toHaveBeenCalled();
    });

    // --- dumpState ---

    it('dumpState should persist current state to cookie with key state_dump', () => {
        const cookieService = TestBed.inject(Cookies);
        const setSpy = spyOn(cookieService, 'set');

        component.dumpState();

        expect(setSpy).toHaveBeenCalledWith(
            'state_dump',
            jasmine.objectContaining({ stateName: 'state' }),
            true
        );
    });

    // --- Idle lifecycle callbacks ---

    it('onTimeoutWarning should show modal and display countdown message', () => {
        spyOn(component.childModal, 'show');

        component.onTimeoutWarning(15);

        expect(component.idleState).toBe('TIMEOUT_WARNING');
        expect(component.modalShowing).toBe(true);
        expect(component.timeOutMessage).toBe(
            'You will be logged out in 15 seconds!'
        );
        expect(component.childModal.show).toHaveBeenCalled();
    });

    it('onIdleStart should set idleState to IDLE', () => {
        component.onIdleStart();

        expect(component.idleState).toBe('IDLE');
    });

    it('onIdleEnd should set idleState to IDLE_END', () => {
        component.onIdleEnd();

        expect(component.idleState).toBe('IDLE_END');
    });

    it('onPing should update lastPing and set idleState to PINGING', () => {
        spyOn(component.dataLayer, 'getUser');

        component.onPing();

        expect(component.idleState).toBe('PINGING');
        expect(component.lastPing).toBeDefined();
        expect(component.dataLayer.getUser).toHaveBeenCalledWith({
            fields: 'id',
        });
    });

    // --- popupLoginComponent ---

    it('popupLoginComponent should remove token, open dialog, and set flag when not already open', () => {
        const dialogService = TestBed.inject(NbDialogService);
        const openSpy = spyOn(dialogService, 'open').and.callThrough();
        const removeTokenSpy = spyOn(component.authConfig, 'removeAuthToken');

        component.isLoginDialogOpen = false;
        component.popupLoginComponent();

        expect(removeTokenSpy).toHaveBeenCalled();
        expect(openSpy).toHaveBeenCalled();
        expect(component.isLoginDialogOpen).toBe(true);
    });

    it('popupLoginComponent should not open dialog when already open', () => {
        const dialogService = TestBed.inject(NbDialogService);
        const openSpy = spyOn(dialogService, 'open');

        component.isLoginDialogOpen = true;
        component.popupLoginComponent();

        expect(openSpy).not.toHaveBeenCalled();
    });

    // --- toggleDialog ---

    it('toggleDialog should call stay and reset isLoginDialogOpen', () => {
        const staySpy = spyOn(component, 'stay');
        component.isLoginDialogOpen = true;

        component.toggleDialog();

        expect(staySpy).toHaveBeenCalled();
        expect(component.isLoginDialogOpen).toBe(false);
    });

    // --- hideChildModal ---

    it('hideChildModal should reset modal state and clear backdrops', () => {
        component.modalShowing = true;
        const querySpy = spyOn(doc, 'querySelectorAll').and.callThrough();

        component.hideChildModal();

        expect(component.modalShowing).toBe(false);
        expect(querySpy).toHaveBeenCalledWith('.modal-backdrop');
        expect(component.idleState).toBe('NOT_IDLE');
        expect(component.timedOut).toBe(false);
    });

    // --- enabledKeycloak getter ---

    it('enabledKeycloak should return false when feature flag is off', () => {
        const flagService = TestBed.inject(FeatureFlagService);
        spyOn(flagService, 'isFeatureOn').and.returnValue(false);

        expect(component.enabledKeycloak).toBe(false);
    });

    it('enabledKeycloak should return true when feature flag is on', () => {
        const flagService = TestBed.inject(FeatureFlagService);
        spyOn(flagService, 'isFeatureOn').and.returnValue(true);

        expect(component.enabledKeycloak).toBe(true);
    });

    // --- logout (manual, via button) ---

    it('logout should set modalShowing false, navigate to auth.logout, and update idle state', () => {
        const stateSpy = spyOn(component.$state, 'go');
        const idleService = TestBed.inject(IdleService);
        const setUserLoggedInSpy = spyOn(idleService, 'setUserLoggedIn');
        const hideModalSpy = spyOn(component, 'hideChildModal');

        component.modalShowing = true;
        component.logout();

        expect(component.modalShowing).toBe(false);
        expect(hideModalSpy).toHaveBeenCalled();
        expect(setUserLoggedInSpy).toHaveBeenCalledWith(false);
        expect(idleService.setLogin).toBe(true);
        expect(stateSpy).toHaveBeenCalledWith('auth.logout');
    });

    describe('Clarity Initialization for the empower variant', () => {
        let originalVariant: any;
        let originalProjectId: any;

        beforeEach(() => {
            originalVariant = environment.variant;
            originalProjectId = environment.empowerClarityProjectId;
            spyOn(Clarity, 'init');
        });

        afterEach(() => {
            environment.variant = originalVariant;
            environment.empowerClarityProjectId = originalProjectId;
        });

        it('should initialize Clarity when the environment variant is "empower"', () => {
            environment.variant = 'empower';
            environment.empowerClarityProjectId = 'mock-empower-id';

            TestBed.createComponent(AppComponent);

            expect(Clarity.init).toHaveBeenCalledWith('mock-empower-id');
            expect(Clarity.init).toHaveBeenCalledTimes(1);
        });

        it('should bypass Clarity initialization when the environment variant is NOT "empower"', () => {
            environment.variant = 'default';

            TestBed.createComponent(AppComponent);

            expect(Clarity.init).not.toHaveBeenCalled();
        });
    });
});

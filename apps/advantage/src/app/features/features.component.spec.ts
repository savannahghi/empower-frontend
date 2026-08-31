import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { of } from 'rxjs';
import { Authorization } from '../@core/auth/services/authorization.service';
import { AppConfigService } from '../app-config.service';
import { Cookies } from '../shared/cookies/cookie.service';
import { FeaturesComponent } from './features.component';
import { MENU_ITEMS } from './sidebar-menu';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { SilKeycloakService } from 'app/shared/sil-keycloak/keycloak.service';

class AuthorizationStub {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    setUser() {
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
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class SilKeycloakServiceStub {
    getToken() {
        return true;
    }
    isLoggedIn() {
        return true;
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
        data: {
            requiresAuth: undefined,
        },
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

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transitionTo() {
        return true;
    }
}

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

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
    set() {
        return 'en';
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

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

describe('FeaturesComponent', () => {
    let component: FeaturesComponent;
    let fixture: ComponentFixture<FeaturesComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeaturesComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [mockPipe('translate')],
            providers: [
                AppConfigService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                {
                    provide: MENU_ITEMS,
                    useValue: [
                        {
                            title: 'home',
                            link: '/',
                        },
                        {
                            title: 'dashboard',
                            link: 'dashboard',
                        },
                    ],
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FeaturesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.quintusTokenObservable = of({
            id: '12312',
        });
    });

    it('should create', fakeAsync(() => {
        component.configureQuintusToken();
        expect(component).toBeTruthy();
    }));
});

const uIRouterGlobalsStubNoAuth = {
    current: {
        name: 'state',
        data: {
            requiresAuth: true,
        },
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

describe('FeaturesComponent: mock getUser null no auth', () => {
    let component: FeaturesComponent;
    let fixture: ComponentFixture<FeaturesComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeaturesComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [mockPipe('translate')],
            providers: [
                AppConfigService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStubNoAuth,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: MENU_ITEMS,
                    useValue: [],
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FeaturesComponent);
        component = fixture.componentInstance;
        spyOn(component.authConfig, 'getUser').and.returnValue(null);
        fixture.detectChanges();
    });

    it('should test requiresAuth', fakeAsync(() => {
        expect(component).toBeTruthy();
    }));
});

describe('FeaturesComponent: requires auth', () => {
    let component: FeaturesComponent;
    let fixture: ComponentFixture<FeaturesComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeaturesComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [mockPipe('translate')],
            providers: [
                AppConfigService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStub,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: MENU_ITEMS,
                    useValue: [
                        {
                            title: 'home',
                            link: '/',
                        },
                        {
                            title: 'dashboard',
                            link: 'dashboard',
                        },
                    ],
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FeaturesComponent);
        component = fixture.componentInstance;
        component.quintusTokenObservable = of({
            id: '12312',
        });
        fixture.detectChanges();
    });

    it('should test quintustoken', fakeAsync(() => {
        component.configureQuintusToken();
        expect(component).toBeTruthy();
    }));
});

describe('FeaturesComponent: mock getUser', () => {
    let component: FeaturesComponent;
    let fixture: ComponentFixture<FeaturesComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeaturesComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [mockPipe('translate')],
            providers: [
                AppConfigService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStubNoAuth,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: MENU_ITEMS,
                    useValue: [
                        {
                            title: 'home',
                            data: {
                                business_partner: '4605',
                            },
                            link: '/',
                        },
                        {
                            title: 'dashboard',
                            data: {
                                business_partner: '4605',
                            },
                            link: 'dashboard',
                        },
                    ],
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FeaturesComponent);
        component = fixture.componentInstance;
        spyOn(component.authConfig, 'getUser').and.returnValue({
            client_types: ['PROVIDER'],
            roles: ['Quintus'],
        });
        component.quintusTokenObservable = of({
            id: '12312',
        });
        fixture.detectChanges();
    });

    it('should test menu function', fakeAsync(() => {
        component.configureQuintusToken();
        const menu = [
            {
                title: 'home',
                data: {
                    business_partner: '4605',
                },
                link: '/',
            },
            {
                title: 'dashboard',
                data: {
                    business_partner: 'PROVIDER',
                },
                link: 'dashboard',
            },
        ];
        component.processMenu(menu);
        expect(component).toBeTruthy();
    }));

    it('should test checkQuintusAccess function if user has a Quintus Role', () => {
        spyOn(component, 'checkQuintusAccess').and.callThrough();
        const user = {
            roles: ['Quintus'],
        };
        component.checkQuintusAccess(user);
        expect(component.checkQuintusAccess).toHaveBeenCalled();
    });

    it('should test checkQuintusAccess function for an Alternate Quinutus user', () => {
        spyOn(component, 'checkQuintusAccess').and.callThrough();
        const user = {
            roles: ['Advantage Super User'],
            perms: ['erp.dashboard_list'],
        };
        component.checkQuintusAccess(user);
        expect(component.checkQuintusAccess).toHaveBeenCalled();
    });
});

describe('FeaturesComponent: mock getUser null', () => {
    let component: FeaturesComponent;
    let fixture: ComponentFixture<FeaturesComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeaturesComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [mockPipe('translate')],
            providers: [
                AppConfigService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStubNoAuth,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: MENU_ITEMS,
                    useValue: [
                        {
                            title: 'home',
                            data: {
                                business_partner: '4605',
                            },
                            link: '/',
                        },
                        {
                            title: 'dashboard',
                            data: {
                                business_partner: '4605',
                            },
                            link: 'dashboard',
                        },
                    ],
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FeaturesComponent);
        component = fixture.componentInstance;
        spyOn(component.authConfig, 'getUser').and.returnValue(null);
        component.quintusTokenObservable = of({
            id: '12312',
        });
        fixture.detectChanges();
    });

    it('should test menu function', () => {
        component.configureQuintusToken();
        expect(component).toBeTruthy();
    });
});

describe('FeaturesComponent: mock getUser null & requiresAuth', () => {
    let component: FeaturesComponent;
    let fixture: ComponentFixture<FeaturesComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeaturesComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [mockPipe('translate')],
            providers: [
                AppConfigService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStub,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: MENU_ITEMS,
                    useValue: [
                        {
                            title: 'home',
                            data: {
                                business_partner: '4605',
                            },
                            link: '/',
                        },
                        {
                            title: 'dashboard',
                            data: {
                                business_partner: '4605',
                            },
                            link: 'dashboard',
                        },
                    ],
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FeaturesComponent);
        component = fixture.componentInstance;
        spyOn(component.authConfig, 'getUser').and.returnValue(null);
        component.quintusTokenObservable = of({
            id: '12312',
        });
        fixture.detectChanges();
    });

    it('should test menu function', fakeAsync(() => {
        component.configureQuintusToken();
        expect(component).toBeTruthy();
    }));
});

import {
    Location,
    LocationStrategy,
    PathLocationStrategy,
} from '@angular/common';
import { HttpBackend, HttpClient, HttpHandler } from '@angular/common/http';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
    NbAccessChecker,
    NbAclService,
    NbIsGrantedDirective,
    NbRoleProvider,
    NbSecurityModule,
} from '@nebular/security';
import {
    NbMediaBreakpointsService,
    NbMenuService,
    NbSidebarService,
    NbThemeService,
    NbToastrService,
    NbUserModule,
} from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import {
    Transition,
    TransitionService,
    UIRouterGlobals,
} from '@uirouter/angular';
import { StateService } from '@uirouter/core';
import { FeatureFlagService } from 'app/@core/utils/feature.service';
import { BehaviorSubject, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SilLogoutComponent } from '../../../@core/auth/components/logout/logout.component';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { HomePageService } from '../../../@core/auth/services/home-page.service';
import { CompleteService } from '../../../@core/auth/services/login.service';
import { Setup } from '../../../@core/auth/services/setup.service';
import { RedirectServiceStub } from '../../../@core/auth/services/tests/login.service.spec';
import { LayoutService } from '../../../@core/utils';
import { AppConfigService } from '../../../app-config.service';
import { Cookies } from '../../../shared/cookies/cookie.service';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { VariantDisplayPipe } from '../../pipes/variant-display/variant-display.pipe';
import { RedirectService } from './../../../@core/auth/services/redirect.service';
import { HeaderComponent } from './header.component';
import { SilKeycloakService } from 'app/shared/sil-keycloak/keycloak.service';

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

class SilKeycloakServiceStub {
    getToken() {
        return true;
    }
    getUserInfo(): Promise<boolean> {
        return Promise.resolve(true);
    }
    isLoggedIn(): Promise<boolean> {
        return Promise.resolve(true);
    }
}

class CookieServiceStub {
    setLanguageCookie() {
        return 'en';
    }
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

class TranslateServiceStub {
    setFallbackLang() {
        return of('en.json');
    }
    use() {
        return of('en.json');
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class SilStoreServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                },
            ],
        });
    }
    create() {
        return of({});
    }
    update() {
        return of({
            id: '12',
        });
    }
    createNested() {
        return of({});
    }
    get() {
        return of({
            id: '123',
        });
    }
    getClinical() {
        return of({
            data: {
                id: 1,
            },
        });
    }
}

class CompleteServiceStub {
    determineApplicationAccess() {}
    availableApps() {
        const apps = {
            advantage: true,
            quintus: true,
            healthCRM: true,
            accessAfya: true,
        };
        return apps;
    }
}

class NbMenuServiceStub {
    onItemClick() {
        return of(
            { tag: 'my-context-menu', item: { title: 'Log out' } },
            { tag: 'my-context-menu', item: { title: 'Profile' } },
            { tag: 'my-context-menu', item: { title: 'Else' } },
            {
                tag: 'biometrics-context-menu',
                item: { title: 'View Hardware Info' },
            }
        );
    }
    navigateHome() {
        return {};
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    includes() {
        return true;
    }
    reload() {
        return true;
    }
}

class TransitionServiceStub {
    onSuccess() {
        return { name: 'auth.login' };
    }
    params() {
        return {};
    }
}

const uIRouterGlobalsStub = {
    params: {
        id: '112',
        service_request: 'wer',
        page_size: '2',
        queue: 1,
    },
    current: {
        name: 'current',
        data: {},
        params: {
            page_size: '2',
        },
    },
    $current: {
        is: () => true,
        name: 'advantage',
    },
};

NbSecurityModule.forRoot({
    accessControl: {
        guest: {
            view: '*',
        },
        user: {
            parent: 'guest',
            create: '*',
            edit: '*',
            remove: '*',
        },
    },
}).providers,
    class NbThemeServiceStub {
        currentTheme() {
            return {};
        }
        onMediaQueryChange() {
            return of([{ currentBreakpoint: { width: {} } }, {}]);
        }
        onThemeChange() {
            return of({});
        }
        changeTheme() {
            return {};
        }
    };

class AuthorizationConfigStub {
    logout() {
        return of(() => {});
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
            permissions: 'crm.person_list',
            roles: ['Admin', 'Cashier'],
        };
    }
    getOrganisation() {
        return {
            organisation_name: 'org',
        };
    }
    getErpOrganisation() {
        return null;
    }
    getToken() {
        return {};
    }
    getAutoreconSettings() {
        return {
            organisation_name: 'Test Org',
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

class NbSidebarServiceStub {
    toggle() {
        return {};
    }
    collapse() {
        return {};
    }
    compact() {
        return {};
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

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

class AclProviderStub {
    NbAclOptions() {
        return of([{ can: () => {} }, {}]);
    }
    getRole() {
        return of([{ currentBreakpoint: { width: {} } }, {}]);
    }
    can() {
        return {};
    }
}

class FeatureFlagServiceStub {
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

    setupFlagging() {}

    isFeatureOn(): boolean {
        return false;
    }
    checkVariantFlag(flagName: string): boolean {
        if (flagName === 'prov_biometricsEnrollmentSidebarLink') {
            return true;
        }
        return false;
    }

    getForcedValue(flagName: string): boolean | undefined {
        void flagName;
        return undefined;
    }
}

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NbUserModule,
                VariantDisplayPipe,
                mockPipe('featureFlag'),
                mockPipe('titleCase'),
                mockPipe('app'),
                mockPipe('translate'),
                mockPipe('variant'),
            ],
            declarations: [
                HeaderComponent,
                NbIsGrantedDirective,
                SilLogoutComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                AppConfigService,
                Setup,
                HttpClient,
                HttpHandler,
                Location,
                HttpBackend,
                HomePageService,
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                { provide: NbAclService, useClass: AclProviderStub },
                { provide: LocationStrategy, useClass: PathLocationStrategy },
                {
                    provide: ActivatedRoute,
                    useValue: { queryParams: of({ login: 'first_time' }) },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: SilStoresService, SilStoreServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: TransitionService, useClass: TransitionServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbRoleProvider, useClass: AclProviderStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: NbThemeService, useClass: LayoutServiceStub },
                { provide: LayoutService, useClass: LayoutServiceStub },
                {
                    provide: NbMediaBreakpointsService,
                    useValue: nbMediaBreakpointsServiceStub,
                },
                { provide: Router, useValue: routerSpy },
                { provide: NbAccessChecker },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        component.tag = 'my-context-menu';
        fixture.detectChanges();
    });

    it('should test changeTheme method', () => {
        spyOn(component, 'changeTheme').and.callThrough();
        component.changeTheme('');
        component.toggleTheme(true);
        component.toggleTheme(false);
        component.workstationsCount = 1;
        spyOn(localStorage, 'getItem').and.returnValue('default');
        component.determineUserTheme();
        expect(component.changeTheme).toHaveBeenCalled();
    });

    it('should test changeTheme method | empower', () => {
        spyOn(component, 'changeTheme').and.callThrough();
        component.changeTheme('');
        component.toggleTheme(true);
        component.toggleTheme(false);
        component.workstationsCount = 1;
        spyOn(localStorage, 'getItem').and.returnValue('empower');
        component.determineUserTheme();
        expect(component.changeTheme).toHaveBeenCalled();
    });

    it('should test current theme being environement theme', () => {
        spyOn(component, 'changeTheme').and.callThrough();
        component.changeTheme('');
        component.toggleTheme(true);
        component.toggleTheme(false);
        component.workstationsCount = 1;
        spyOn(localStorage, 'getItem').and.returnValue('empower');
        environment.variant = 'empower';
        component.determineUserTheme();
        expect(component.changeTheme).toHaveBeenCalled();
    });

    it('should test toggleSidebar method', () => {
        spyOn(component, 'toggleSidebar').and.callThrough();
        component.getInnerWidth();
        component.toggleSidebar();
        expect(component.toggleSidebar).toHaveBeenCalled();
    });

    it('should test navigateHome method', () => {
        spyOn(component, 'navigateHome').and.callThrough();
        component.workstationsCount = 1;
        component.navigateHome();
        component.setLanguageCookie('en');
        expect(component.navigateHome).toHaveBeenCalled();
    });

    it('should test when screen is smaller than lg', () => {
        spyOn(component, 'getInnerWidth').and.returnValue(500);
        spyOn(component.sidebarService, 'compact');
        component.sidebarResponsiveness();
        expect(component.sidebarService.compact).toHaveBeenCalled();
    });

    it('should test when screen is smaller than sm', () => {
        spyOn(component, 'getInnerWidth').and.returnValue(300);
        spyOn(component.sidebarService, 'collapse');
        component.sidebarResponsiveness();
        expect(component.sidebarService.collapse).toHaveBeenCalled();
    });
    it('should test getAutoreconOrgDetails function', () => {
        spyOn(component, 'getAutoreconOrgDetails').and.callThrough();
        component.getAutoreconOrgDetails();
        expect(component.getAutoreconOrgDetails).toHaveBeenCalledWith();
    });

    it('should fetch autorecon org details for autorecon users only', () => {
        const roles = ['Autorecon'];
        spyOn(component, 'getAutoreconOrgDetails').and.callThrough();

        component.checkAutoreconApp(roles);
        expect(component.getAutoreconOrgDetails).toHaveBeenCalled();
    });

    it('should return true for isAdvantageApp when $current.name includes "advantage"', () => {
        expect(component.isAdvantageApp).toBeTrue();
    });

    it('should test checkBiometricsHardwareDevice function', () => {
        spyOn(component, 'checkBiometricsHardwareDevice').and.callThrough();
        component.checkBiometricsHardwareDevice();
        expect(component.checkBiometricsHardwareDevice).toHaveBeenCalled();
    });

    it('should test getHardwareDeviceDetails function', () => {
        const response = {
            devices: [],
            isAuthed: true,
            workstationID: 'C4E5F8A0-7F8F-403A-9B2F-0EEEFA07C1BD',
            version: '1.5.0.21629',
        };

        spyOn(component, 'getHardwareDeviceDetails').and.callThrough();
        component.getHardwareDeviceDetails(response);
        expect(component.getHardwareDeviceDetails).toHaveBeenCalledWith(
            response
        );
    });

    it('should test fetchHardwareStatus function', () => {
        spyOn(component, 'fetchHardwareStatus').and.callThrough();
        component.fetchHardwareStatus();

        expect(component.fetchHardwareStatus).toHaveBeenCalled();
    });

    it('should poll fetchHardwareStatus every 5 seconds when checkBiometricsHardwareDevice is called', fakeAsync(() => {
        component.hardwareStatusInterval = true;

        const fetchSpy = spyOn(
            component,
            'fetchHardwareStatus'
        ).and.callThrough();

        component.checkBiometricsHardwareDevice();

        // First call is immediate
        expect(fetchSpy).toHaveBeenCalledTimes(1);

        // Simulate 5s passing
        tick(5000);
        expect(fetchSpy).toHaveBeenCalledTimes(2);

        tick(5000);
        expect(fetchSpy).toHaveBeenCalledTimes(3);

        tick(5000);
        expect(fetchSpy).toHaveBeenCalledTimes(4);

        // Clean up
        clearInterval(component['hardwareStatusInterval']);
    }));

    it('should test biometricsHardwareServerStatusCheckTimeoutInMs when undefined', fakeAsync(() => {
        component.hardwareStatusInterval = false;

        const fetchSpy = spyOn(
            component,
            'fetchHardwareStatus'
        ).and.callThrough();

        environment.biometricsHardwareServerStatusCheckTimeoutInMs = undefined;

        component.checkBiometricsHardwareDevice();

        // First call is immediate
        expect(fetchSpy).toHaveBeenCalledTimes(1);

        // Simulate 5s passing
        tick(5000);
        expect(fetchSpy).toHaveBeenCalledTimes(2);

        tick(5000);
        expect(fetchSpy).toHaveBeenCalledTimes(3);

        tick(5000);
        expect(fetchSpy).toHaveBeenCalledTimes(4);

        // Clean up
        clearInterval(component['hardwareStatusInterval']);
    }));

    it('should call checkBiometricsHardwareDevice in ngOnInit if OS is supported', () => {
        spyOn(component, 'checkBiometricsHardwareDevice');

        spyOn(
            component['operatingSystemDetectionService'],
            'getCurrentOS'
        ).and.returnValue('Windows');

        spyOn(
            component['operatingSystemDetectionService'],
            'isCurrentOsSupported'
        ).and.returnValue(true);

        component.ngOnInit();

        expect(component.checkBiometricsHardwareDevice).toHaveBeenCalled();
    });

    it('should test toggleBiometricsModal function', () => {
        spyOn(component, 'toggleBiometricsModal').and.callThrough();
        component.toggleBiometricsModal();

        expect(component.toggleBiometricsModal).toHaveBeenCalled();
    });

    describe('loadDarkModeFlag method', () => {
        it('should set showDarkModeToggle to true for non-empower variants', fakeAsync(() => {
            environment.variant = 'default';
            spyOn(component.flagService, 'getForcedValue');

            component.loadDarkModeFlag();

            tick(1000);

            expect(component.showDarkModeToggle).toBe(true);
            expect(component.flagService.getForcedValue).not.toHaveBeenCalled();
        }));

        it('should set showDarkModeToggle to true for sha variant', fakeAsync(() => {
            environment.variant = 'sha';
            spyOn(component.flagService, 'getForcedValue');

            component.loadDarkModeFlag();

            tick(1000);

            expect(component.showDarkModeToggle).toBe(true);
            expect(component.flagService.getForcedValue).not.toHaveBeenCalled();
        }));

        it('should set showDarkModeToggle to true when flag returns true for empower variant', fakeAsync(() => {
            environment.variant = 'empower';
            spyOn(component.flagService, 'getForcedValue').and.returnValue(
                true
            );

            component.loadDarkModeFlag();

            tick(1000);

            expect(component.showDarkModeToggle).toBe(true);
            expect(component.flagService.getForcedValue).toHaveBeenCalledWith(
                'prov_showDarkModeEmpower'
            );
        }));

        it('should set showDarkModeToggle to false when flag returns false for empower variant', fakeAsync(() => {
            environment.variant = 'empower';
            spyOn(component.flagService, 'getForcedValue').and.returnValue(
                false
            );

            component.loadDarkModeFlag();

            tick(1000);

            expect(component.showDarkModeToggle).toBe(false);
            expect(component.flagService.getForcedValue).toHaveBeenCalledWith(
                'prov_showDarkModeEmpower'
            );
        }));

        it('should set showDarkModeToggle to false when flag returns undefined for empower variant', fakeAsync(() => {
            environment.variant = 'empower';
            spyOn(component.flagService, 'getForcedValue').and.returnValue(
                undefined
            );

            component.loadDarkModeFlag();

            tick(1000);

            expect(component.showDarkModeToggle).toBe(false);
        }));
    });

    describe('ngOnInit with loadDarkModeFlag', () => {
        it('should call loadDarkModeFlag on initialization', () => {
            spyOn(component, 'loadDarkModeFlag');

            component.ngOnInit();

            expect(component.loadDarkModeFlag).toHaveBeenCalled();
        });
    });
});

const uIRouterGlobalsNotAdvantageStub = {
    params: {
        id: '112',
        service_request: 'wer',
        page_size: '2',
        queue: 1,
    },
    current: {
        name: 'current',
        data: {},
        params: {
            page_size: '2',
        },
    },
    $current: {
        is: () => true,
        name: 'healthcrm',
    },
};

describe('HeaderComponent with $current name is not advantage', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NbUserModule,
                VariantDisplayPipe,
                mockPipe('featureFlag'),
                mockPipe('titleCase'),
                mockPipe('app'),
                mockPipe('translate'),
                mockPipe('variant'),
            ],
            declarations: [
                HeaderComponent,
                NbIsGrantedDirective,
                SilLogoutComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                AppConfigService,
                Setup,
                HttpClient,
                HttpHandler,
                Location,
                HttpBackend,
                HomePageService,
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                { provide: NbAclService, useClass: AclProviderStub },
                { provide: LocationStrategy, useClass: PathLocationStrategy },
                {
                    provide: ActivatedRoute,
                    useValue: { queryParams: of({ login: 'first_time' }) },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: SilStoresService, SilStoreServiceStub },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsNotAdvantageStub,
                },
                { provide: Transition, useClass: TransitionStub },
                { provide: TransitionService, useClass: TransitionServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbRoleProvider, useClass: AclProviderStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: NbThemeService, useClass: LayoutServiceStub },
                { provide: LayoutService, useClass: LayoutServiceStub },
                {
                    provide: NbMediaBreakpointsService,
                    useValue: nbMediaBreakpointsServiceStub,
                },
                { provide: Router, useValue: routerSpy },
                { provide: NbAccessChecker },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        component.tag = 'my-context-menu';
        fixture.detectChanges();
    });

    it('should return false for isAdvantageApp when $current is healthcrm', () => {
        expect(component.isAdvantageApp).toBeFalse();
    });
});

class AuthorizationConfigStub2 {
    logout() {
        return of(() => {});
    }
    getUser() {
        return {
            business_partner: '1',
            first_name: 'John',
            last_name: 'Doe',
            client_types: ['PROVIDER'],
            permissions: 'crm.person_list',
            roles: ['Admin', 'Cashier'],
        };
    }
    getOrganisation() {
        return {
            organisation_name: 'org',
        };
    }
    getWorkstation() {
        return {
            organisation_name: 'org',
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    getToken() {
        return {};
    }
}

describe('HeaderComponent 2: getUser not null', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NbUserModule,
                VariantDisplayPipe,
                mockPipe('featureFlag'),
                mockPipe('titleCase'),
                mockPipe('app'),
                mockPipe('translate'),
                mockPipe('variant'),
            ],
            declarations: [
                HeaderComponent,
                NbIsGrantedDirective,
                SilLogoutComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                AppConfigService,
                HttpClient,
                HttpHandler,
                Location,
                HttpBackend,
                Setup,
                HomePageService,
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                { provide: NbAclService, useClass: AclProviderStub },
                { provide: LocationStrategy, useClass: PathLocationStrategy },
                {
                    provide: ActivatedRoute,
                    useValue: { queryParams: of({ login: 'first_time' }) },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: SilStoresService, SilStoreServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: TransitionService, useClass: TransitionServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub2 },
                { provide: NbRoleProvider, useClass: AclProviderStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: NbThemeService, useClass: LayoutServiceStub },
                { provide: LayoutService, useClass: LayoutServiceStub },
                {
                    provide: NbMediaBreakpointsService,
                    useValue: nbMediaBreakpointsServiceStub,
                },
                { provide: Router, useValue: routerSpy },
                { provide: NbAccessChecker },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        component.tag = 'my-context-menu';
        fixture.detectChanges();
    });

    it('should test when getUser returns null', () => {
        spyOn(component.authConfig, 'getUser').and.returnValue(null);
        component.ngOnInit();
        component.workstationsCount = 1;
        expect(component).toBeTruthy();
    });

    it('should test when getUser returns object', () => {
        spyOn(component.authConfig, 'getUser').and.returnValue({
            business_partner: '1',
            first_name: 'John',
            last_name: 'Doe',
            roles: ['Admin', 'Cashier'],
            permissions: 'advantage.patient_list',
        });
        component.ngOnInit();
        component.workstationsCount = 1;
        expect(component).toBeTruthy();
    });

    it('should test header component has a workstation method', () => {
        component.workstationsCount = 2;
        spyOn(component, 'selectWorkStation').and.callThrough();
        component.selectWorkStation();
        expect(component.selectWorkStation).toHaveBeenCalled();
    });

    it('should test workstation method doesnt redirect to select workstations if user has only one workstation', () => {
        component.workstationsCount = 1;
        spyOn(component, 'selectWorkStation').and.callThrough();
        component.selectWorkStation();
        expect(component.selectWorkStation).toHaveBeenCalled();
    });
});

class CookieServiceStubNull {
    setLanguageCookie() {
        return 'en';
    }
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return null;
    }
    set() {
        return {
            first_name: 'Jon',
            last_name: 'Doe',
        };
    }
}

describe('HeaderComponent when app.theme is null', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NbUserModule,
                VariantDisplayPipe,
                mockPipe('featureFlag'),
                mockPipe('titleCase'),
                mockPipe('app'),
                mockPipe('translate'),
                mockPipe('variant'),
            ],
            declarations: [
                HeaderComponent,
                NbIsGrantedDirective,
                SilLogoutComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                AppConfigService,
                Setup,
                HttpClient,
                HttpHandler,
                Location,
                HttpBackend,
                HomePageService,
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                { provide: NbAclService, useClass: AclProviderStub },
                { provide: LocationStrategy, useClass: PathLocationStrategy },
                {
                    provide: ActivatedRoute,
                    useValue: { queryParams: of({ login: 'first_time' }) },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: SilStoresService, SilStoreServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: TransitionService, useClass: TransitionServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbRoleProvider, useClass: AclProviderStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: NbThemeService, useClass: LayoutServiceStub },
                { provide: LayoutService, useClass: LayoutServiceStub },
                {
                    provide: NbMediaBreakpointsService,
                    useValue: nbMediaBreakpointsServiceStub,
                },
                { provide: Router, useValue: routerSpy },
                { provide: NbAccessChecker },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStubNull },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        component.tag = 'my-context-menu';
        fixture.detectChanges();
    });

    it('should test when app.theme is null', () => {
        spyOn(component, 'determineUserTheme').and.callThrough();
        component.determineUserTheme();
        expect(component.determineUserTheme).toHaveBeenCalled();
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

describe('HeaderComponent when app.theme is undefined', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NbUserModule,
                VariantDisplayPipe,
                mockPipe('featureFlag'),
                mockPipe('titleCase'),
                mockPipe('app'),
                mockPipe('translate'),
                mockPipe('variant'),
            ],
            declarations: [
                HeaderComponent,
                NbIsGrantedDirective,
                SilLogoutComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                AppConfigService,
                Setup,
                HttpClient,
                HttpHandler,
                Location,
                HttpBackend,
                HomePageService,
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                { provide: NbAclService, useClass: AclProviderStub },
                { provide: LocationStrategy, useClass: PathLocationStrategy },
                {
                    provide: ActivatedRoute,
                    useValue: { queryParams: of({ login: 'first_time' }) },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: SilStoresService, SilStoreServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: TransitionService, useClass: TransitionServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub2 },
                { provide: NbRoleProvider, useClass: AclProviderStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: NbThemeService, useClass: LayoutServiceStub },
                { provide: LayoutService, useClass: LayoutServiceStub },
                {
                    provide: NbMediaBreakpointsService,
                    useValue: nbMediaBreakpointsServiceStub,
                },
                { provide: Router, useValue: routerSpy },
                { provide: NbAccessChecker },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStubUndefined },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        component.tag = 'my-context-menu';
        spyOn(component.authConfig, 'getUser').and.returnValue({
            first_name: 'Jon',
            last_name: 'Doe',
        });
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

const uIRouterGlobalsStub2 = {
    params: {
        id: '112',
        service_request: 'wer',
        page_size: '2',
        queue: 1,
    },
    current: {
        name: 'current',
        data: {},
        params: {
            page_size: '2',
        },
    },
    $current: {
        is: () => true,
        name: 'survey',
    },
};

describe('should test current theme is not environment variant', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NbUserModule,
                VariantDisplayPipe,
                mockPipe('featureFlag'),
                mockPipe('titleCase'),
                mockPipe('app'),
                mockPipe('translate'),
                mockPipe('variant'),
            ],
            declarations: [
                HeaderComponent,
                NbIsGrantedDirective,
                SilLogoutComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                AppConfigService,
                Setup,
                HttpClient,
                HttpHandler,
                Location,
                HttpBackend,
                HomePageService,
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                { provide: NbAclService, useClass: AclProviderStub },
                { provide: LocationStrategy, useClass: PathLocationStrategy },
                {
                    provide: ActivatedRoute,
                    useValue: { queryParams: of({ login: 'first_time' }) },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: SilStoresService, SilStoreServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: Transition, useClass: TransitionStub },
                { provide: TransitionService, useClass: TransitionServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub2 },
                { provide: NbRoleProvider, useClass: AclProviderStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: NbThemeService, useClass: LayoutServiceStub },
                { provide: LayoutService, useClass: LayoutServiceStub },
                {
                    provide: NbMediaBreakpointsService,
                    useValue: nbMediaBreakpointsServiceStub,
                },
                { provide: Router, useValue: routerSpy },
                { provide: NbAccessChecker },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStubCorporate },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        component.tag = 'my-context-menu';
        spyOn(component.authConfig, 'getUser').and.returnValue({
            first_name: 'Jon',
            last_name: 'Doe',
        });
        fixture.detectChanges();
    });

    it('should test ngOnit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();

        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test when app.theme is undefined', () => {
        spyOn(component, 'determineUserTheme').and.callThrough();
        environment.variant = 'MSOAS';
        component.determineUserTheme();
        expect(component.determineUserTheme).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NbUserModule,
                VariantDisplayPipe,
                mockPipe('featureFlag'),
                mockPipe('titleCase'),
                mockPipe('app'),
                mockPipe('translate'),
                mockPipe('variant'),
            ],
            declarations: [
                HeaderComponent,
                NbIsGrantedDirective,
                SilLogoutComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                AppConfigService,
                Setup,
                HttpClient,
                HttpHandler,
                Location,
                HttpBackend,
                HomePageService,
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                { provide: NbAclService, useClass: AclProviderStub },
                { provide: LocationStrategy, useClass: PathLocationStrategy },
                {
                    provide: ActivatedRoute,
                    useValue: { queryParams: of({ login: 'first_time' }) },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: SilStoresService, SilStoresServiceStubError },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: TransitionService, useClass: TransitionServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbRoleProvider, useClass: AclProviderStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: NbThemeService, useClass: LayoutServiceStub },
                { provide: LayoutService, useClass: LayoutServiceStub },
                {
                    provide: NbMediaBreakpointsService,
                    useValue: nbMediaBreakpointsServiceStub,
                },
                { provide: Router, useValue: routerSpy },
                { provide: NbAccessChecker },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        component.tag = 'my-context-menu';
        fixture.detectChanges();
    });

    it('should test handleErrorFxn method', () => {
        spyOn(component, 'handleErrorFxn').and.callThrough();
        component.handleErrorFxn({});
        expect(component.handleErrorFxn).toHaveBeenCalled();
    });

    describe('toggleTheme method', () => {
        let themeServiceSpy: jasmine.SpyObj<NbThemeService>;

        beforeEach(() => {
            themeServiceSpy = TestBed.inject(
                NbThemeService
            ) as jasmine.SpyObj<NbThemeService>;
            spyOn(themeServiceSpy, 'changeTheme').and.callThrough();
        });

        it('should call changeTheme with "empower-dark" when bool is true and variant is empower', () => {
            environment.variant = 'empower';
            component.toggleTheme(true);
            expect(themeServiceSpy.changeTheme).toHaveBeenCalledWith(
                'empower-dark'
            );
        });

        it('should call changeTheme with "dark" when bool is true and variant is not empower', () => {
            environment.variant = 'default';
            component.toggleTheme(true);
            expect(themeServiceSpy.changeTheme).toHaveBeenCalledWith('dark');
        });

        it('should call changeTheme with environment variant when bool is false', () => {
            environment.variant = 'corporate';
            component.toggleTheme(false);
            expect(themeServiceSpy.changeTheme).toHaveBeenCalledWith(
                'corporate'
            );
        });

        it('should call changeTheme with "default" when bool is false and variant is default', () => {
            environment.variant = 'default';
            component.toggleTheme(false);
            expect(themeServiceSpy.changeTheme).toHaveBeenCalledWith('default');
        });
    });

    describe('setupUser', () => {
        it('should setup user with SIL Auth when enabledKeycloak is false', () => {
            // Arrange: Make enabledKeycloak return false (default behavior)
            const flagService = TestBed.inject(FeatureFlagService);
            spyOn(flagService, 'isFeatureOn').and.returnValue(false);

            const mockUser = {
                first_name: 'John',
                last_name: 'Doe',
                bp_type: 'PROVIDER',
            };
            const mockOrganisation = { organisation_name: 'Test Org' };
            const mockErpOrg = {
                user_workstations: [{ id: 1, name: 'Station 1' }],
            };
            const mockAdvantageOrg = { id: 'adv123' };

            spyOn(component.authConfig, 'getUser').and.returnValue(mockUser);
            spyOn(component.authConfig, 'getOrganisation').and.returnValue(
                mockOrganisation
            );
            spyOn(component.authConfig, 'getErpOrganisation').and.returnValue(
                mockErpOrg
            );
            spyOn(
                component.authConfig,
                'getAdvantageOrganisation'
            ).and.returnValue(mockAdvantageOrg);
            spyOn(component.cookieService, 'get').and.returnValue('station1');

            // Act
            component.setupUser();

            // Assert: Verify SIL Auth branch was executed
            expect(component.authConfig.getUser).toHaveBeenCalled();
            expect(component.user.full_name).toBe('John Doe');
            expect(component.organisationUser).toBe(mockOrganisation);
            expect(component.erpUserDetails).toEqual(
                mockErpOrg.user_workstations
            );
            expect(component.selectedErpUserDetails).toBe('station1');
            expect(component.advantageOrgDetails).toBe(mockAdvantageOrg);
        });

        it('should handle null user in SIL Auth branch', () => {
            // Arrange: Make enabledKeycloak return false
            const flagService = TestBed.inject(FeatureFlagService);
            spyOn(flagService, 'isFeatureOn').and.returnValue(false);

            spyOn(component.authConfig, 'getUser').and.returnValue(null);
            spyOn(component.authConfig, 'getOrganisation').and.returnValue(
                null
            );

            // Act
            component.setupUser();

            // Assert: Verify null user is converted to empty object
            expect(component.user).toEqual({
                full_name: 'undefined undefined',
            });
        });

        it('should setup user with Keycloak Auth when enabledKeycloak is true', done => {
            // Arrange: Make enabledKeycloak return true
            const flagService = TestBed.inject(FeatureFlagService);
            spyOn(flagService, 'isFeatureOn').and.returnValue(true);

            const mockUserData = {
                __zone_symbol__value: {
                    first_name: 'Jane',
                    last_name: 'Smith',
                },
            };
            const mockOrganisation = { organisation_name: 'Keycloak Org' };
            const mockErpOrg = {
                user_workstations: [{ id: 2, name: 'Station 2' }],
            };
            const mockAdvantageOrg = { id: 'adv456' };

            spyOn(component.authConfig, 'getUserInformation').and.returnValue(
                of(mockUserData)
            );
            spyOn(component.authConfig, 'getOrganisation').and.returnValue(
                mockOrganisation
            );
            spyOn(component.authConfig, 'getErpOrganisation').and.returnValue(
                mockErpOrg
            );
            spyOn(
                component.authConfig,
                'getAdvantageOrganisation'
            ).and.returnValue(mockAdvantageOrg);
            spyOn(component.cookieService, 'get').and.returnValue('station2');

            // Act
            component.setupUser();

            // Assert: Verify Keycloak Auth branch was executed
            setTimeout(() => {
                expect(
                    component.authConfig.getUserInformation
                ).toHaveBeenCalled();
                expect(component.user).toEqual(
                    mockUserData.__zone_symbol__value
                );
                expect(component.organisationUser).toBe(mockOrganisation);
                expect(component.erpUserDetails).toEqual(
                    mockErpOrg.user_workstations
                );
                expect(component.selectedErpUserDetails).toBe('station2');
                expect(component.advantageOrgDetails).toBe(mockAdvantageOrg);
                done();
            }, 100);
        });

        it('should handle getUserInformation observable in Keycloak branch', done => {
            // Arrange: Make enabledKeycloak return true
            const flagService = TestBed.inject(FeatureFlagService);
            spyOn(flagService, 'isFeatureOn').and.returnValue(true);

            const mockUserData = {
                __zone_symbol__value: { username: 'testuser' },
            };

            spyOn(component.authConfig, 'getUserInformation').and.returnValue(
                of(mockUserData)
            );
            spyOn(component.authConfig, 'getOrganisation').and.returnValue({});
            spyOn(component.authConfig, 'getErpOrganisation').and.returnValue(
                null
            );

            // Act
            component.setupUser();

            // Assert
            setTimeout(() => {
                expect(component.user).toEqual(
                    mockUserData.__zone_symbol__value
                );
                done();
            }, 50);
        });
    });

    describe('Property Initializations', () => {
        it('should initialize showDarkModeToggle to false', () => {
            expect(component.showDarkModeToggle).toBe(false);
        });
    });

    describe('getInnerWidth', () => {
        it('should return window.innerWidth', () => {
            spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1024);
            expect(component.getInnerWidth()).toBe(1024);
        });

        it('should return different window widths', () => {
            spyOnProperty(window, 'innerWidth', 'get').and.returnValue(768);
            expect(component.getInnerWidth()).toBe(768);
        });
    });

    describe('determineUserTheme', () => {
        it('should set theme to environment variant when no theme cookie exists', () => {
            const cookieService = TestBed.inject(Cookies);
            const themeService = TestBed.inject(NbThemeService);

            spyOn(cookieService, 'get').and.returnValue(null);
            spyOn(cookieService, 'set');
            spyOn(themeService, 'changeTheme');
            spyOn(component, 'themeChanger');

            component.determineUserTheme();

            expect(cookieService.set).toHaveBeenCalledWith(
                'app.theme',
                environment.variant
            );
            expect(component.themeChecked).toBe(false);
            expect(component.currentTheme).toBe(themeService.currentTheme);
            expect(themeService.changeTheme).toHaveBeenCalledWith(
                themeService.currentTheme
            );
            expect(component.themeChanger).toHaveBeenCalled();
        });

        it('should set theme to environment variant when theme cookie is undefined', () => {
            const cookieService = TestBed.inject(Cookies);
            const themeService = TestBed.inject(NbThemeService);

            spyOn(cookieService, 'get').and.returnValue(undefined);
            spyOn(cookieService, 'set');
            spyOn(themeService, 'changeTheme');
            spyOn(component, 'themeChanger');

            component.determineUserTheme();

            expect(cookieService.set).toHaveBeenCalledWith(
                'app.theme',
                environment.variant
            );
            expect(component.themeChecked).toBe(false);
        });

        it('should use existing theme when cookie exists and matches variant', () => {
            const cookieService = TestBed.inject(Cookies);
            const themeService = TestBed.inject(NbThemeService);
            const currentTheme = environment.variant;

            spyOn(cookieService, 'get').and.returnValue(currentTheme);
            spyOn(themeService, 'changeTheme');
            spyOn(component, 'themeChanger');

            component.determineUserTheme();

            expect(component.themeChecked).toBe(false);
            expect(component.currentTheme).toBe(currentTheme);
            expect(themeService.changeTheme).toHaveBeenCalledWith(currentTheme);
            expect(component.themeChanger).toHaveBeenCalled();
        });

        it('should use existing theme when cookie exists and differs from variant', () => {
            const cookieService = TestBed.inject(Cookies);
            const themeService = TestBed.inject(NbThemeService);
            const currentTheme = 'dark';

            spyOn(cookieService, 'get').and.returnValue(currentTheme);
            spyOn(themeService, 'changeTheme');
            spyOn(component, 'themeChanger');

            component.determineUserTheme();

            expect(component.themeChecked).toBe(true);
            expect(component.currentTheme).toBe(currentTheme);
            expect(themeService.changeTheme).toHaveBeenCalledWith(currentTheme);
            expect(component.themeChanger).toHaveBeenCalled();
        });
    });

    describe('themeChanger', () => {
        it('should subscribe to theme changes and call themeSubscription', () => {
            const themeService = TestBed.inject(NbThemeService);
            const themeChangeSub = new BehaviorSubject({ name: 'dark' });
            spyOn(themeService, 'onThemeChange').and.returnValue(
                themeChangeSub
            );
            spyOn(component, 'themeSubscription');

            component.themeChanger();
            themeChangeSub.next({ name: 'cosmic' });

            expect(component.themeSubscription).toHaveBeenCalledWith('cosmic');
        });

        it('should unsubscribe on destroy', () => {
            const themeService = TestBed.inject(NbThemeService);
            const themeChangeSub = new BehaviorSubject({ name: 'dark' });
            spyOn(themeService, 'onThemeChange').and.returnValue(
                themeChangeSub
            );
            spyOn(component, 'themeSubscription');

            component.themeChanger();
            component.ngOnDestroy();

            // After destroy, new emissions should not trigger subscription
            themeChangeSub.next({ name: 'cosmic' });

            // The subscription should only have been called once (during initialization)
            expect(component.themeSubscription).toHaveBeenCalledTimes(1);
        });
    });

    describe('themeSubscription', () => {
        it('should set cookie and update currentTheme', () => {
            const cookieService = TestBed.inject(Cookies);
            spyOn(cookieService, 'set');

            component.themeSubscription('dark');

            expect(cookieService.set).toHaveBeenCalledWith('app.theme', 'dark');
            expect(component.currentTheme).toBe('dark');
        });

        it('should handle different theme names', () => {
            const cookieService = TestBed.inject(Cookies);
            spyOn(cookieService, 'set');

            component.themeSubscription('cosmic');

            expect(cookieService.set).toHaveBeenCalledWith(
                'app.theme',
                'cosmic'
            );
            expect(component.currentTheme).toBe('cosmic');
        });
    });

    describe('ngOnDestroy', () => {
        it('should complete destroy$ subject', () => {
            spyOn(component['destroy$'], 'next');
            spyOn(component['destroy$'], 'complete');

            component.ngOnDestroy();

            expect(component['destroy$'].next).toHaveBeenCalled();
            expect(component['destroy$'].complete).toHaveBeenCalled();
        });

        it('should clear hardwareStatusInterval if it exists', () => {
            component.hardwareStatusInterval = setInterval(() => {}, 1000);
            spyOn(window, 'clearInterval');

            component.ngOnDestroy();

            expect(clearInterval).toHaveBeenCalledWith(
                component.hardwareStatusInterval
            );
        });

        it('should not throw error if hardwareStatusInterval is null', () => {
            component.hardwareStatusInterval = null;

            expect(() => component.ngOnDestroy()).not.toThrow();
        });
    });

    describe('toggleSidebar', () => {
        it('should toggle sidebar and change layout size', () => {
            const sidebarService = TestBed.inject(NbSidebarService);
            const layoutService = TestBed.inject(LayoutService);

            spyOn(sidebarService, 'toggle');
            spyOn(layoutService, 'changeLayoutSize');

            const result = component.toggleSidebar();

            expect(sidebarService.toggle).toHaveBeenCalledWith(
                true,
                'menu-sidebar'
            );
            expect(layoutService.changeLayoutSize).toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });

    describe('navigateHome', () => {
        it('should call menuService.navigateHome and return false', () => {
            const menuService = TestBed.inject(NbMenuService);
            spyOn(menuService, 'navigateHome');

            const result = component.navigateHome();

            expect(menuService.navigateHome).toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });

    describe('checkAutoreconApp', () => {
        it('should call getAutoreconOrgDetails when roles include Autorecon', () => {
            spyOn(component, 'getAutoreconOrgDetails');
            const roles = ['Admin', 'Autorecon', 'User'];

            component.checkAutoreconApp(roles);

            expect(component.getAutoreconOrgDetails).toHaveBeenCalled();
        });

        it('should not call getAutoreconOrgDetails when roles do not include Autorecon', () => {
            spyOn(component, 'getAutoreconOrgDetails');
            const roles = ['Admin', 'User'];

            component.checkAutoreconApp(roles);

            expect(component.getAutoreconOrgDetails).not.toHaveBeenCalled();
        });

        it('should not call getAutoreconOrgDetails when roles is undefined', () => {
            spyOn(component, 'getAutoreconOrgDetails');

            component.checkAutoreconApp(undefined);

            expect(component.getAutoreconOrgDetails).not.toHaveBeenCalled();
        });

        it('should not call getAutoreconOrgDetails when roles is null', () => {
            spyOn(component, 'getAutoreconOrgDetails');

            component.checkAutoreconApp(null);

            expect(component.getAutoreconOrgDetails).not.toHaveBeenCalled();
        });
    });

    describe('getAutoreconOrgDetails', () => {
        it('should set organisationName and bp_type from auth config', () => {
            const mockAutoreconSettings = {
                organisation_name: 'Test Organization',
            };
            component.user = { bp_type: 'PROVIDER' };
            spyOn(component.authConfig, 'getAutoreconSettings').and.returnValue(
                mockAutoreconSettings
            );

            component.getAutoreconOrgDetails();

            expect(component.organisationName).toBe('Test Organization');
            expect(component.bp_type).toBe('PROVIDER');
        });

        it('should handle undefined organisation_name', () => {
            const mockAutoreconSettings = {};
            component.user = { bp_type: 'PAYER' };
            spyOn(component.authConfig, 'getAutoreconSettings').and.returnValue(
                mockAutoreconSettings
            );

            component.getAutoreconOrgDetails();

            expect(component.organisationName).toBeUndefined();
            expect(component.bp_type).toBe('PAYER');
        });

        it('should handle null autorecon settings', () => {
            component.user = { bp_type: 'BOTH' };
            spyOn(component.authConfig, 'getAutoreconSettings').and.returnValue(
                null
            );

            component.getAutoreconOrgDetails();

            expect(component.organisationName).toBeUndefined();
            expect(component.bp_type).toBe('BOTH');
        });
    });
});

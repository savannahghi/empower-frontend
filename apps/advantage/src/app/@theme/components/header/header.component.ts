import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    NbMediaBreakpointsService,
    NbMenuService,
    NbSidebarService,
    NbThemeService,
} from '@nebular/theme';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { LayoutService } from '../../../@core/utils';

import { TranslateService } from '@ngx-translate/core';
import {
    StateService,
    TransitionService,
    UIRouterGlobals,
} from '@uirouter/angular';
import { FeatureFlagService } from 'app/@core/utils/feature.service';
import { OperatingSystemDetectionService } from 'app/features/services/operating-system-detection.service';
import packageJson from '../../../../../../../package.json';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../@core/auth/services/datalayer.utils.service';
import { IdleService } from '../../../@core/auth/services/idle.service';
import { CompleteService } from '../../../@core/auth/services/login.service';
import { Oauth2Service } from '../../../@core/auth/services/oauth2.service';
import { Cookies } from '../../../shared/cookies/cookie.service';
import { ErrorHandlerService } from '../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { VariantDisplayPipe } from '../../pipes/variant-display/variant-display.pipe';

/** contains the providers in the header component */
const providers = [
    Authorization,
    CompleteService,
    DataLayerUtils,
    Oauth2Service,
    VariantDisplayPipe,
];

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - style: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 * - providers: contains the services used within the component
 */
@Component({
    selector: 'ngx-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
    providers,
    standalone: false,
})

/**
 * This is the class definition of the component
 */
export class HeaderComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    /** Used to hide the user picture for specific responsiveness */
    userPictureOnly: boolean = false;
    /** Contains the authserver used */
    authServer = environment.AUTH_SERVER_DOMAIN;
    /** Contains the setting of the application: development, test, production */
    environment = environment.sentryEnvironment;
    /** Used to navigate the user to the profile page on the auth server */
    profileUrl: string;
    /** Used to hide elements that do not have auth */
    noAuth: boolean;
    /** Contains user information */
    user: any;
    /** organisation details */
    organisationUser: any;
    /** Used to hide the dark mode toggle in empower */
    showDarkModeToggle: boolean = false;
    /** organisation name */
    organisationName: any;
    /** Advantage organsation details */
    advantageOrgDetails: any;
    /** organisation business partner type */
    bp_type: any;
    /** erp organisation details */
    erpUserDetails: any;
    /** selected erp organisation details */
    selectedErpUserDetails: any;
    /** Contains the active variant */
    variant: any;
    tag = 'my-context-menu';
    /** number of workstations */
    workstationsCount: any;
    /** contains the options for what theme can be used */
    /** Contains information about available apps */
    availableApps: any;
    /** Used to disable submit button on the form */
    disableSubmit: boolean = false;
    /** Used to determine if Keycloak is enabled */
    currentStateName: string;

    hardwareStatusInterval: any;

    showHardwareInfoDialog = false;

    themes = [
        {
            value: 'default',
            name: 'Light',
        },
        {
            value: 'dark',
            name: 'Dark',
        },
        {
            value: 'cosmic',
            name: 'Cosmic',
        },
        {
            value: 'corporate',
            name: 'Corporate',
        },
    ];

    /** contains the links to various Advantage applications in the app switcher*/
    appListItems = [
        { value: 'advantage', title: 'Advantage', url: '/auth/workstation' },
        {
            value: 'healthCRM',
            title: 'HealthCRM',
            url: '/healthcrm/clients/customers',
        },
        {
            value: 'autorecon',
            title: 'AutoRecon',
            url: '/autorecon/clients/reconciliation',
        },
        {
            value: 'accessAfya',
            title: 'Artificial Intelligence',
            url: '/ai',
        },
        {
            value: 'userguide',
            title: 'User Guide',
            url: '/user-guides',
        },
    ];

    /** Contains final list of available apps */
    appList = [];

    currentTheme = environment.variant;

    userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

    biometricsHardwareMenu = [
        {
            value: 'Download Biometrics Service Installer',
            title: 'Download Biometrics Service Installer',
            url: environment.biometricsHardwareServerUrl,
        },
        {
            value: 'View Hardware Info',
            title: 'View Hardware Info',
        },
    ];

    themeChecked: boolean;

    deviceWorkstationID: any;

    deviceVersion: any;

    isDeviceAuthed: any;

    devicesConnected: any;

    currentOS: any;

    isSupported: any;

    hasError: boolean = false;

    /** Application version */
    appVersion = packageJson.version;

    /**
     * gets the stored selected language
     */
    selectedLanguage: string = this.cookieService.getLanguageCookie();

    /**
     *
     * @param sidebarService
     * provides access to the sidebar service
     * @param menuService
     * directs which action is made when user profile is clicked
     * @param themeService
     * allows one to access the nebular theme service
     * @param layoutService
     * allows one to access the layout service
     * @param $state
     * allows one to access the $state service
     * @param breakpointService
     * allows one to access the nebular breakpoint service
     * @param authConfig
     * allows one to access the authorization service
     * @param idleService
     * allows one to access the ngIdle service
     */
    constructor(
        public sidebarService: NbSidebarService,
        private menuService: NbMenuService,
        private themeService: NbThemeService,
        private layoutService: LayoutService,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        private breakpointService: NbMediaBreakpointsService,
        public authConfig: Authorization,
        private idleService: IdleService,
        public transition: TransitionService,
        private translate: TranslateService,
        public cookieService: Cookies,
        public completeService: CompleteService,
        public variantDisplayPipe: VariantDisplayPipe,
        public dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        public flagService: FeatureFlagService,
        public operatingSystemDetectionService: OperatingSystemDetectionService
    ) {
        menuService
            .onItemClick()
            .pipe(filter(({ tag }) => tag === this.tag))
            .subscribe((bag: any) => {
                if (bag.item.title === 'Log out') {
                    this.idleService.setUserLoggedIn(false);
                    this.$state.go('auth.logout', {}, { reload: true });
                } else if (bag.item.title === 'Profile') {
                    this.$state.go('app.advantage.manage.profile');
                }
            });
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
        this.variant = environment.variant;
    }

    /** Should determine if keycloak is enabled */
    get enabledKeycloak(): boolean {
        return this.flagService.isFeatureOn(
            'prov_authenticationSetKeyCloakToTrue'
        );
    }

    /**
     * loads the empower dark mode flag
     */
    loadDarkModeFlag() {
        setTimeout(() => {
            if (environment.variant !== 'empower') {
                this.showDarkModeToggle = true;
                return;
            }

            if (this.flagService.getForcedValue('prov_showDarkModeEmpower')) {
                this.showDarkModeToggle = true;
            } else {
                this.showDarkModeToggle = false;
            }
        }, 1000);
    }

    /**
     * set the language cookie
     */
    setLanguageCookie(event) {
        this.cookieService.setLanguageCookie(event);
        this.$state.reload();
    }

    /**
     * returns the user to select a workstation
     */
    selectWorkStation() {
        if (this.workstationsCount < 2) return;
        this.$state.go('auth.workstation');
    }

    /**
     * Component lifecycle used after the component is initialized
     */
    ngOnInit() {
        this.currentStateName = this.uiglobals.current?.name;
        this.determineUserTheme();
        this.profileUrl = `${this.authServer}/manage/profile/`;

        this.setupUser();
        this.determineNavigableApplications();

        const { xl } = this.breakpointService.getBreakpointsMap();
        this.themeService
            .onMediaQueryChange()
            .pipe(
                map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
                takeUntil(this.destroy$)
            )
            .subscribe(
                (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
            );

        this.workstationsCount =
            this.authConfig.getUser()?.user_workstations?.length;

        this.requiresAuth();

        this.transition.onSuccess({}, this.sidebarResponsiveness);

        this.checkAutoreconApp(this.authConfig.getUser()?.roles);

        this.currentOS = this.operatingSystemDetectionService.getCurrentOS();

        this.isSupported =
            this.operatingSystemDetectionService.isCurrentOsSupported(
                this.currentOS
            );

        if (
            this.uiglobals.$current.name.includes('advantage') &&
            this.isSupported
        ) {
            this.checkBiometricsHardwareDevice();
        }

        this.loadDarkModeFlag();

        /**
         * Subscribe to nbMenuservice
         */
        this.menuService
            .onItemClick()
            .pipe(
                filter(({ tag }) => tag === 'biometrics-context-menu'),
                map(({ item: { title } }) => title)
            )
            .subscribe(title => {
                if (title === 'View Hardware Info') {
                    this.toggleBiometricsModal();
                }
            });
    }

    get isAdvantageApp(): boolean {
        const appName = this.uiglobals?.$current?.name;

        return appName.includes('advantage');
    }

    get hasBiometricsFeature(): boolean {
        return this.advantageOrgDetails?.organisation_features?.includes(
            'BIOMETRICS'
        );
    }

    toggleBiometricsModal() {
        this.showHardwareInfoDialog = !this.showHardwareInfoDialog;
    }

    handleErrorFxn = (err: any) => {
        this.hasError = true;
        this.errorHandler.handleError(err, this);
    };

    getHardwareDeviceDetails = response => {
        this.hasError = false;

        this.deviceWorkstationID = response.workstationID;

        this.deviceVersion = response.version;

        this.isDeviceAuthed = response.isAuthed;

        this.devicesConnected = response.devices;
    };

    checkBiometricsHardwareDevice() {
        // Clear any existing interval to prevent multiple intervals
        if (this.hardwareStatusInterval) {
            clearInterval(this.hardwareStatusInterval);
        }

        // First call immediately
        this.fetchHardwareStatus();

        // Start polling
        this.hardwareStatusInterval = setInterval(() => {
            this.fetchHardwareStatus();
        }, Number(environment.biometricsHardwareServerStatusCheckTimeoutInMs || 5000));
    }

    fetchHardwareStatus() {
        this.dataLayer.get('biometrics-hardware-status').subscribe({
            next: this.getHardwareDeviceDetails,
            error: this.handleErrorFxn,
        });
    }

    /** Check if the state requires auth */
    requiresAuth() {
        if (!this.uiglobals.current.data.requiresAuth) {
            this.noAuth = true;
        }
    }

    /** Sets up the user based on their details */
    setupUser() {
        if (!this.enabledKeycloak) {
            this.user = this.authConfig.getUser();
            this.user = this.user === null ? {} : this.user;
            this.user.full_name = `${this.user.first_name} ${this.user.last_name}`;
            this.organisationUser = this.authConfig.getOrganisation();
            this.erpUserDetails =
                this.authConfig.getErpOrganisation()?.user_workstations;
            this.selectedErpUserDetails = this.cookieService.get(
                this.authConfig.ORGANISATION_USER_WORKSTATION,
                true
            );
            this.advantageOrgDetails =
                this.authConfig.getAdvantageOrganisation?.();
        } else {
            this.authConfig.getUserInformation().subscribe(data => {
                this.user = data.__zone_symbol__value;
                this.organisationUser = this.authConfig.getOrganisation();
                this.erpUserDetails =
                    this.authConfig.getErpOrganisation()?.user_workstations;
                this.selectedErpUserDetails = this.cookieService.get(
                    this.authConfig.ORGANISATION_USER_WORKSTATION,
                    true
                );
                this.advantageOrgDetails =
                    this.authConfig.getAdvantageOrganisation?.();
            });
        }
    }

    /** Determines what applications are accessible to the user */
    determineNavigableApplications() {
        const user = this.authConfig.getUser();
        if (user !== null) {
            this.completeService.determineApplicationAccess(user);
            this.availableApps = this.completeService.availableApps;

            /** Determine what applications should be accessible */
            for (let index = 0; index < this.appListItems.length; index++) {
                const app = this.appListItems[index];
                if (this.availableApps[app.value] === true) {
                    /** Transform the display based on the variant */
                    if (app.value === 'advantage') {
                        app.title = this.variantDisplayPipe.transform(
                            this.variant
                        );
                    }
                    this.appList.push(app);
                }
            }
        }
    }

    /** Works on sidebar responsiveness */
    sidebarResponsiveness = () => {
        const { sm, lg } = this.breakpointService.getBreakpointsMap();
        if (this.getInnerWidth() < sm) {
            this.sidebarService.collapse('menu-sidebar');
        } else if (this.getInnerWidth() < lg) {
            this.sidebarService.compact('menu-sidebar');
        }
    };

    getInnerWidth() {
        return window.innerWidth;
    }

    /**
     * Used to determine the theme a user would have
     * considering if they are logging in for the first time
     * or the choice stored in a cookie
     */
    determineUserTheme() {
        const currentTheme = this.cookieService.get('app.theme');
        if (currentTheme === null || currentTheme === undefined) {
            this.cookieService.set('app.theme', environment.variant);
            this.themeChecked = false;
            this.currentTheme = this.themeService.currentTheme;
        } else {
            this.themeChecked =
                currentTheme === environment.variant ? false : true;
            this.currentTheme = currentTheme;
        }
        this.changeTheme(this.currentTheme);
        this.themeChanger();
    }

    /**
     * Uses the themeService to effect a theme change
     */
    themeChanger() {
        this.themeService
            .onThemeChange()
            .pipe(
                map(({ name }) => name),
                takeUntil(this.destroy$)
            )
            .subscribe(this.themeSubscription);
    }

    /**
     * Stores the theme choice to local storage to remember
     * @param themeName includes: default,dark,cosmic,default
     */
    themeSubscription = themeName => {
        this.cookieService.set('app.theme', themeName);
        this.currentTheme = themeName;
    };

    /**
     * Component lifecycle hook called when the component is destroyed
     */
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();

        if (this.hardwareStatusInterval) {
            clearInterval(this.hardwareStatusInterval);
        }
    }

    /**
     * Used to change from one theme option to another
     * @param themeName includes: default,dark,cosmic,default
     */
    changeTheme(themeName: string) {
        this.themeService.changeTheme(themeName);
    }

    /**
     * Used to switch from one theme to another.
     * - true is used to show the dark  and empower-dark themes .
     * - false is used to show the default theme
     * @param bool used to toggle a theme option
     */
    toggleTheme(bool: boolean) {
        const themeName = bool
            ? environment.variant === 'empower'
                ? 'empower-dark'
                : 'dark'
            : environment.variant;
        this.themeService.changeTheme(themeName);
    }

    /**
     * Toggles the sidebar to the open state
     * @returns false after sidebar is opened
     */
    toggleSidebar(): boolean {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();

        return false;
    }

    /**
     *  Navigates the user home
     * @returns false after navigating home
     */
    navigateHome() {
        this.menuService.navigateHome();
        return false;
    }

    /**
     * redirect to autorecon application
     */
    checkAutoreconApp(roles) {
        if (roles?.includes('Autorecon')) {
            this.getAutoreconOrgDetails();
        }
    }
    /** Fetch autorecon organisation details */
    getAutoreconOrgDetails() {
        this.organisationName =
            this.authConfig.getAutoreconSettings()?.organisation_name;
        this.bp_type = this.user.bp_type;
    }
}

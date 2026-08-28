import { SilCurrencyPipe } from './currency.pipe';
import { CurrencyPipe, Location } from '@angular/common';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../@core/auth/services/datalayer.utils.service';
import { StateService, UIRouter } from '@uirouter/angular';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../../app-config.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import {
    AuthUrls,
    Oauth2Service,
} from '../../../@core/auth/services/oauth2.service';
import { Injector } from '@angular/core';
import { Cookies } from '../../../shared/cookies/cookie.service';
import { TestBed } from '@angular/core/testing';
import { SilKeycloakService } from 'app/shared/sil-keycloak/keycloak.service';
import { KeycloakService } from 'keycloak-angular';

class AuthorizationStubKES extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'KEN' };
    };
}

class Handler {
    handle: any;
}

class LocStrategy {
    path() {
        return '';
    }
    prepareExternalUrl() {
        return '';
    }
    getState() {}
    pushState() {}
    replaceState() {}
    forward() {}
    back() {}
    onPopState() {}
    getBaseHref() {
        return '';
    }
}

describe('SilCurrencyPipe: KES', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubKES(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('KES 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'KES ');
    });
});

class AuthorizationStub extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'USA' };
    };
}
describe('SilCurrencyPipe', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStub(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with default currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('KES 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'KES ');
    });
});

class AuthorizationStubTZA extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'TZA' };
    };
}

describe('SilCurrencyPipe: TZA', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubTZA(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('TSZ 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'TSZ ');
    });
});

class AuthorizationStubUGA extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'UGA' };
    };
}

describe('SilCurrencyPipe: UGA', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubUGA(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('UGX 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'UGX ');
    });
});

class AuthorizationStubRWA extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'RWA' };
    };
}

describe('SilCurrencyPipe: RWA', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubRWA(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('RWF 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'RWF ');
    });
});

class AuthorizationStubSSD extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'SSD' };
    };
}

describe('SilCurrencyPipe: SSD', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const oauth2Services = new Oauth2Service(appConfig);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubSSD(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('SSP 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'SSP ');
    });
});

class AuthorizationStubNGA extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'NGA' };
    };
}

describe('SilCurrencyPipe: NGA', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubNGA(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('NGN 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'NGN ');
    });
});

class AuthorizationStubSOM extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'SOM' };
    };
}

describe('SilCurrencyPipe: SOM', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubSOM(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('SOS 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'SOS ');
    });
});

class AuthorizationStubETH extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'ETH' };
    };
}

describe('SilCurrencyPipe: ETH', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubETH(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('ETB 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'ETB ');
    });
});

class AuthorizationStubZMB extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'ZMB' };
    };
}

describe('SilCurrencyPipe: ZMB', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubZMB(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('ZMW 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'ZMW ');
    });
});

class AuthorizationStubZAF extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'ZAF' };
    };
}

describe('SilCurrencyPipe: ZAF', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubZAF(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('ZAR 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'ZAR ');
    });
});

class AuthorizationStubBDI extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'BDI' };
    };
}

describe('SilCurrencyPipe: BDI', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const cookiessr = new SsrCookieService();
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubBDI(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('BIF 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'BIF ');
    });
});

class AuthorizationStubCOD extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'COD' };
    };
}

describe('SilCurrencyPipe: COD', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubCOD(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('CDF 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'CDF ');
    });
});

class AuthorizationStubCOG extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'COG' };
    };
}

describe('SilCurrencyPipe: COG', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubCOG(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('CFA 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'CFA ');
    });
});

class AuthorizationStubMOZ extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'MOZ' };
    };
}

describe('SilCurrencyPipe: MOZ', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubMOZ(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('MZN 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'MZN ');
    });
});

class AuthorizationStubBWA extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'BWA' };
    };
}

describe('SilCurrencyPipe: BWA', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubBWA(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('BWP 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'BWP ');
    });
});

class AuthorizationStubLBY extends Authorization {
    constructor(
        public location: Location,
        public dataUtils: DataLayerUtils,
        public oauth2Services: Oauth2Service,
        public httpClient: HttpClient,
        public $state: StateService,
        public cookies: Cookies,
        public keycloakService: SilKeycloakService,
        public injector: Injector
    ) {
        super(
            location,
            dataUtils,
            oauth2Services,
            httpClient,
            $state,
            cookies,
            keycloakService,
            injector
        );
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = oauth2Services.oauthCredz;
        this.oauthScopes = oauth2Services.scopes;
        this.authUrls = oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }
    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'auth.config.credz';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state.dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    storedOrganisation: Object;
    storedWorkstation: Object;
    storedErpOrganisation: Object;
    dataLayerUtils: DataLayerUtils;
    http: HttpClient;
    origin: any;
    params: any;
    refreshTokenInterval: any;
    refreshSmallInterval: any;
    iframe: any;
    uatScopes: any;
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'LBY' };
    };
}

describe('SilCurrencyPipe: LBY', () => {
    let pipe: SilCurrencyPipe;
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.runInInjectionContext(() => {
            const dataUtils = new DataLayerUtils();
            const router = new UIRouter();
            const state = new StateService(router);
            const handler = new Handler();
            const httpClient = new HttpClient(handler);
            const appConfig = new AppConfigService(httpClient);
            const oauth2Services = new Oauth2Service(appConfig);
            const locationStrategy = new LocStrategy();
            const location = new Location(locationStrategy);
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const keycloak = new KeycloakService();
            const keycloakService = new SilKeycloakService(keycloak);
            const injector = Injector.create({ providers: [] });
            const authorization = new AuthorizationStubLBY(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            currencyPipe = new CurrencyPipe('en-US');
            pipe = new SilCurrencyPipe(currencyPipe, authorization);
        });
    });

    it('should transform value with country code currency', () => {
        spyOn(currencyPipe, 'transform').and.callThrough();
        const transformedValue = pipe.transform(100);
        expect(transformedValue).toBe('LYD 100.00');
        expect(currencyPipe.transform).toHaveBeenCalledWith(100, 'LYD ');
    });
});

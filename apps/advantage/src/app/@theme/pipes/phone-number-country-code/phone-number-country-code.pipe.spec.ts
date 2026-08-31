import { Location } from '@angular/common';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../@core/auth/services/datalayer.utils.service';
import { StateService, UIRouter } from '@uirouter/angular';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../../app-config.service';
import { Oauth2Service } from '../../../@core/auth/services/oauth2.service';
import { SilPhoneCountryCodePipe } from './phone-number-country-code.pipe';
import { Cookies } from '../../../shared/cookies/cookie.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { TestBed } from '@angular/core/testing';
import { SilKeycloakService } from 'app/shared/sil-keycloak/keycloak.service';
import { KeycloakService } from 'keycloak-angular';
import { Injector } from '@angular/core';

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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: undefined };
    };
}

describe('SilPhoneCountryCodePipe', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with default country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Kenya');
    });
});

class AuthorizationStubKEN extends Authorization {
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'KEN' };
    };
}

describe('SilPhoneCountryCodePipe: KEN', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            const authorization = new AuthorizationStubKEN(
                location,
                dataUtils,
                oauth2Services,
                httpClient,
                state,
                cookie,
                keycloakService,
                injector
            );
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Kenya');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'TZA' };
    };
}

describe('SilPhoneCountryCodePipe: TZA', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Tanzania');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'UGA' };
    };
}

describe('SilPhoneCountryCodePipe: UGA', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Uganda');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'RWA' };
    };
}

describe('SilPhoneCountryCodePipe: RWA', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Rwanda');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'SSD' };
    };
}

describe('SilPhoneCountryCodePipe: SSD', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('SouthSudan');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'NGA' };
    };
}

describe('SilPhoneCountryCodePipe: NGA', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Nigeria');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'SOM' };
    };
}

describe('SilPhoneCountryCodePipe: SOM', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Somalia');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'ETH' };
    };
}

describe('SilPhoneCountryCodePipe: ETH', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Ethiopia');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'ZMB' };
    };
}

describe('SilPhoneCountryCodePipe: ZMB', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Zimbabwe');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'ZAF' };
    };
}

describe('SilPhoneCountryCodePipe: ZAF', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('SouthAfrica');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'BDI' };
    };
}

describe('SilPhoneCountryCodePipe: BDI', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Burundi');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'COD' };
    };
}

describe('SilPhoneCountryCodePipe: COD', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('CongoDRCJamhuriYaKidemokrasiaYaKongo');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'COG' };
    };
}

describe('SilPhoneCountryCodePipe: COG', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('CongoRepublicCongoBrazzaville');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'MOZ' };
    };
}

describe('SilPhoneCountryCodePipe: MOZ', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Mozambique');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'BWA' };
    };
}

describe('SilPhoneCountryCodePipe: BWA', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Botswana');
    });
});

describe('SilPhoneCountryCodePipe: MOZ', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Mozambique');
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
    checkOauthScope() {}
    windowOrigin() {}
    getUserClinicalIds() {}
    getWorkstation() {}
    getErpOrganisation = (): any => {
        return { organisation_country: 'LBY' };
    };
}

describe('SilPhoneCountryCodePipe: LBY', () => {
    let pipe: SilPhoneCountryCodePipe;

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
            pipe = new SilPhoneCountryCodePipe(authorization);
        });
    });

    it('should transform value with set country code', () => {
        const transformedValue = pipe.transform();
        expect(transformedValue).toBe('Libya');
    });
});

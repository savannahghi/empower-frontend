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
import { Location } from '@angular/common';
import { CountryPipe } from './country.pipe';
import { TestBed } from '@angular/core/testing';
import { KeycloakService } from 'keycloak-angular';
import { SilKeycloakService } from 'app/shared/sil-keycloak/keycloak.service';

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

describe('CountryPipe', () => {
    let pipe: CountryPipe;

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
            const cookiessr = new SsrCookieService();
            const cookie = new Cookies(cookiessr, {});
            const location = new Location(locationStrategy);
            const keycloak = new KeycloakService();
            const injector = Injector.create({ providers: [] });
            const keycloakService = new SilKeycloakService(keycloak);
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
            pipe = new CountryPipe(authorization);
        });
    });

    it('should transform value with country', () => {
        const transformedValue1 = pipe.transform('KEN');
        expect(transformedValue1).toBeTruthy();
        const transformedValue2 = pipe.transform('USA');
        expect(transformedValue2).toBeFalsy();
    });
});

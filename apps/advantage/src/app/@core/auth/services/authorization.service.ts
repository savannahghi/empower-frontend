import moment from 'moment';
import { AuthUrls, Oauth2Service } from './oauth2.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { from, Observable, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { DataLayerUtils } from './datalayer.utils.service';
import { Injectable, Injector } from '@angular/core';
import _ from 'underscore';
import { environment as e } from '../../../../environments/environment';
import { StateService } from '@uirouter/core';
import { Cookies } from '../../../shared/cookies/cookie.service';
import { SilKeycloakService } from 'app/shared/sil-keycloak/keycloak.service';
import { InitializeFlagsService } from '../../utils/initialize-flags.service';

/**
 * interface used to define object data structure
 */
interface LooseObject {
    /** defines the object key value pair */
    [key: string]: any;
}

@Injectable()
export class Authorization {
    private featureFlagService: InitializeFlagsService;

    token_timeout = 5 * 60 * 1000; // five minutes before token expiry
    CREDZ_STORE = 'KEYCLOAK_IDENTITY';
    USER_STORE = 'auth.config.user';
    ORGANISATION_USER_STORE = 'auth.config.org';
    ORGANISATION_USER_ERP_STORE = 'auth.config.erporg';
    ORGANISATION_USER_AUTORECON_STORE = 'auth.config.autorecon';
    ORGANISATION_USER_ADVANTAGE_STORE = 'auth.config.advantageorg';
    ORGANISATION_USER_WORKSTATION = 'auth.config.userWorkStation';
    ORGANISATION_SETTINGS = 'auth.config.orgSettings';
    BRANCH_SETTINGS = 'auth.config.branchSettings';
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    quintusAuth = 'quintus_token';
    STATE_STORE = 'state_dump';
    authUrls: AuthUrls;
    oauthCredz: any;
    oauthScopes: any;
    storedUser: Object;
    clinicalIds: any;
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

    constructor(
        protected location: Location,
        protected dataUtils: DataLayerUtils,
        protected Oauth2Services: Oauth2Service,
        protected httpClient: HttpClient,
        protected $state: StateService,
        protected cookieService: Cookies,
        public keycloakService: SilKeycloakService,
        protected injector: Injector
    ) {
        this.dataLayerUtils = dataUtils;
        this.oauthCredz = Oauth2Services.oauthCredz;
        this.oauthScopes = Oauth2Services.scopes;
        this.authUrls = Oauth2Services.authUrls;
        this.http = httpClient;
        this.uatScopes = ['auth.me.read', 'integration.*', 'erp.*'];
    }

    // Create a private getter to load the service on demand
    private get flagService(): InitializeFlagsService {
        if (!this.featureFlagService) {
            this.featureFlagService = this.injector.get(InitializeFlagsService);
        }
        return this.featureFlagService;
    }

    /** Should determine if keycloak is enabled */
    get enabledKeycloak(): boolean {
        // [5] This now calls the getter, avoiding the constructor cycle
        return this.flagService.getForcedValue(
            'prov_authenticationSetKeyCloakToTrue'
        );
    }

    checkOauthScopes = (): any => {
        const oauthScopes = !_.isEmpty(this.oauthScopes.scopes)
            ? this.oauthScopes.scopes.join(' ')
            : '';
        return oauthScopes;
    };

    /**
     * @return {Promise}
     * This resolves if urlparams dont have a server error
     * and the token is persisted successfully
     *
     * @params {Object} token
     *
     * @description
     * Set token retrieved from the server
     * The token is then stored in localstorage
     */

    setAuthDetails = (token: LooseObject): Observable<any> => {
        const tokenFxn = observer => {
            if (!_.isEmpty(token)) {
                const tokenErrorObj = token as { error };
                if (tokenErrorObj.error) {
                    observer.error(tokenErrorObj.error);
                }
                const updatedToken = { ...token };
                this.storeToken(token);
                observer.next(updatedToken);
            } else {
                observer.next(token);
            }
        };
        const authObservable = new Observable<any>(tokenFxn);
        return authObservable;
    };

    /**
     *
     * @name setXHRToken
     * @param {Object | undefined} token to set in $http. If the token is undefined,
     * it shall remove the tokens
     *
     * @description
     * Add token to the header so that the token included
     * in every request made to resource server
     */

    setXHRToken = (token?: LooseObject): void => {
        const httpHeaders: HttpHeaders = new HttpHeaders();
        if (!_.isObject(token)) {
            httpHeaders.delete('Authorization');
            return;
        }
        const tokenObject = token as { access_token; token_type };
        const authToken = `${tokenObject.token_type} ${tokenObject.access_token}`;
        httpHeaders.append('Authorization', authToken);
    };

    /**
     * @name storeToken
     * @param {Object}
     *
     * @description
     * Sets to be included in every request and also stores in localstorage
     */

    storeToken = (token?: LooseObject): void => {
        this.setXHRToken(token);
        const till = moment().add(token.expires_in, 'seconds');
        token.expire_at = till;
        localStorage.setItem(this.CREDZ_STORE, JSON.stringify(token));
    };

    /**
     * @name revokeToken
     * @param {Object} token
     * Token to revoke
     *
     * @returns {Promise}
     * Promise that resolves when the token is revoked
     *
     * @description
     * Revokes token and clears localStorage to remove
     * user and credentials details
     *
     */

    revokeToken = (token: any): Observable<any> => {
        const dom = this.objectPropChecker(
            this.Oauth2Services.authUrls,
            'domain'
        );
        const url = `${dom}/tokenlogout/`;
        const tokenObject = token;
        // server logout request
        this.cookieService.delete(this.CREDZ_STORE);
        this.setXHRToken();

        function invalidTokenFxn(observer) {
            observer.error('Invalid token provided');
        }

        if (!_.isObject(tokenObject)) {
            const tokenError: Observable<string> = new Observable(
                invalidTokenFxn
            );
            return tokenError;
        }
        const accessToken = tokenObject.access_token;
        const tokenType = tokenObject.token_type;

        const clientId = this.Oauth2Services.oauthCredz.clientId;
        const payload = `token=${accessToken}&client_id=${clientId}`;

        // Performed by interceptor
        const myHeaders = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `${tokenType} ${accessToken}`,
        });
        return this.http.post(url, payload, { headers: myHeaders });
    };

    getToken(): Object {
        const token: LooseObject = this.cookieService.get(
            this.CREDZ_STORE,
            true
        );
        return token;
    }

    setUser = (data: any): void => {
        this.cookieService.set(this.USER_STORE, data, true);
        this.storedUser = data;
        // implement event emittion to notify logged in user data stored
    };

    /** stores user clinical ids */
    setClinicalIds = (data: any): void => {
        this.cookieService.set(this.USER_CLINICAL_IDS, data, true);
        this.clinicalIds = data;
    };

    setOrganisation = (data: any, server?: string): void => {
        if (!server) {
            const orgId = data.organisation_id;
            this.cookieService.set(this.ORGANISATION_USER_STORE, data, true);
            this.storedOrganisation = orgId;
        } else {
            const orgId = data.organisation_id;
            this.cookieService.set(
                this.ORGANISATION_USER_ERP_STORE,
                data,
                true
            );
            this.storedErpOrganisation = orgId;
        }
    };

    setAdvantageOrganisation = (data: any): void => {
        this.cookieService.set(
            this.ORGANISATION_USER_ADVANTAGE_STORE,
            data,
            true
        );
    };

    setOrganisationSettings = (data: any): void => {
        this.cookieService.set(this.ORGANISATION_SETTINGS, data, true);
    };

    setAutoreconSettings = (data: any): void => {
        this.cookieService.set(
            this.ORGANISATION_USER_AUTORECON_STORE,
            data,
            true
        );
    };

    setBranchSettings = (data: any): void => {
        this.cookieService.set(this.BRANCH_SETTINGS, data, true);
    };

    objectPropChecker(obj, key): object {
        return _.has(obj, key) ? obj[key] : {};
    }

    setUserDetails = (token: LooseObject): Observable<any> => {
        function setHeaders() {
            const looseObj = token as { token_type; access_token };
            const authToken = `${looseObj.token_type} ${looseObj.access_token}`;
            // const authToken = `Token ${token.token}`;
            const httpHeaders = new HttpHeaders({
                Authorization: authToken,
            });
            return httpHeaders;
        }
        const dom = this.objectPropChecker(
            this.Oauth2Services.authUrls,
            'domain'
        );
        const userInfo = this.objectPropChecker(
            this.Oauth2Services.authUrls,
            'userInfo'
        );
        // const dom = '';
        const url = this.dataLayerUtils.urlJoin(dom, userInfo);
        const headerObj = { headers: setHeaders() };
        return this.http.get(url, headerObj).pipe(
            map(data => {
                this.setUser(data);
                return data;
            })
        );
    };

    setOrganisationDetails = (token: LooseObject, server?): Observable<any> => {
        function setHeaders() {
            const looseObj = token as { token_type; access_token };
            const authToken = `${looseObj.token_type} ${looseObj.access_token}`;
            const httpHeaders = new HttpHeaders({
                Authorization: authToken,
            });
            return httpHeaders;
        }
        const url = server ? e.ERPME : `${e.AUTH_SERVER_DOMAIN}/v1/user/me/`;
        const headerObj = { headers: setHeaders() };
        return this.http.get(url, headerObj).pipe(
            map(data => {
                this.setOrganisation(data, server);
                return data;
            })
        );
    };

    setAdvantageOrganisationDetails = (token: LooseObject): Observable<any> => {
        function setHeaders() {
            const looseObj = token;
            const authToken = `${looseObj.token_type} ${looseObj.access_token}`;
            const httpHeaders = new HttpHeaders({
                Authorization: authToken,
            });
            return httpHeaders;
        }
        const url = e.ME;
        const headerObj = { headers: setHeaders() };
        return this.http.get(url, headerObj).pipe(
            map(data => {
                this.setAdvantageOrganisation(data);
                return data;
            })
        );
    };

    getUserInformation = (): Observable<any> => {
        const userData = this.keycloakService.getUserInfo();
        return of(userData);
    };

    getUser = (): any => {
        const user =
            this.storedUser || this.cookieService.get(this.USER_STORE, true);
        return user;
    };

    getOrganisation = (): any => {
        const org =
            this.storedOrganisation ||
            this.cookieService.get(this.ORGANISATION_USER_STORE, true);
        return org;
    };

    getErpOrganisation = (): any => {
        const org = this.cookieService.get(
            this.ORGANISATION_USER_ERP_STORE,
            true
        );
        return org;
    };
    getOrganisationId = async (): Promise<any> => {
        return this.keycloakService.getSelectedOrganisationId();
    };

    getSladeCode = () => {
        const org = this.getErpOrganisation();
        return org ? org.business_partner : null;
    };

    getAdvantageOrganisation = (): any => {
        const org = this.cookieService.get(
            this.ORGANISATION_USER_ADVANTAGE_STORE,
            true
        );
        return org;
    };

    getOrgSettings = (): any => {
        const org = this.cookieService.get(this.ORGANISATION_SETTINGS, true);
        return org;
    };

    getBranchSettings = (): any => {
        const branch = this.cookieService.get(this.BRANCH_SETTINGS, true);
        return branch;
    };

    getWorkstation() {
        const workstation = this.cookieService.get(
            this.ORGANISATION_USER_WORKSTATION,
            true
        );
        return workstation;
    }

    getAutoreconSettings() {
        const autoreconSettings = this.cookieService.get(
            this.ORGANISATION_USER_AUTORECON_STORE,
            true
        );
        return autoreconSettings;
    }

    getUserClinicalIds() {
        const clinicalIds = this.cookieService.get(
            this.USER_CLINICAL_IDS,
            true
        );
        return clinicalIds;
    }

    isLoggedIn = (): Boolean => {
        const user = this.getUser();
        const hasToken = this.getToken();
        return (
            !_.isUndefined(user) &&
            !_.isNull(user) &&
            !_.isUndefined(hasToken) &&
            !_.isNull(hasToken)
        );
    };

    logout = (isTimeout?: boolean): Observable<any> => {
        if (!isTimeout) {
            this.cookieService.delete(this.STATE_STORE);
        }
        if (!this.enabledKeycloak) {
            const token = this.getToken();
            return this.revokeToken(token).pipe(
                finalize(() => {
                    this.removeTokenData();
                })
            );
        } else {
            return from(this.keycloakService.logout()).pipe(
                finalize(() => {
                    this.removeTokenData();
                })
            );
        }
    };

    /** Remove all stored info */
    removeTokenData = () => {
        this.cookieService.delete(this.USER_STORE);
        this.cookieService.delete(this.ORGANISATION_USER_STORE);
        this.cookieService.delete(this.ORGANISATION_USER_ERP_STORE);
        this.cookieService.delete(this.ORGANISATION_USER_ADVANTAGE_STORE);
        this.cookieService.delete(this.ORGANISATION_USER_WORKSTATION);
        this.cookieService.delete(this.ORGANISATION_SETTINGS);
        this.cookieService.delete(this.USER_CLINICAL_IDS);
        this.cookieService.delete(this.quintusAuth);
        this.storedUser = null;
        this.storedOrganisation = null;
    };

    /** Remove only the token */
    removeAuthToken = () => {
        this.cookieService.delete(this.CREDZ_STORE);
    };

    resetPassword = (email?: string): Observable<any> => {
        const dom = this.objectPropChecker(
            this.Oauth2Services.authUrls,
            'domain'
        );
        const resetUrl = this.objectPropChecker(
            this.Oauth2Services.authUrls,
            'passwordReset'
        );
        const url = this.dataLayerUtils.urlJoin(dom, resetUrl);
        return this.http.post(url, { email }).pipe(map(data => data));
    };

    changePassword = (postObj?: object): Observable<any> => {
        const dom = this.objectPropChecker(
            this.Oauth2Services.authUrls,
            'domain'
        );
        const chageUrl = this.objectPropChecker(
            this.Oauth2Services.authUrls,
            'passwordChange'
        );
        const url = this.dataLayerUtils.urlJoin(dom, chageUrl);

        return this.http.post(url, postObj).pipe(map(data => data));
    };
}

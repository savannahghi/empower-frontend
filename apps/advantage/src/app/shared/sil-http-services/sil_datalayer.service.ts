import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StateService } from '@uirouter/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import _ from 'underscore';
import { environment } from '../../../environments/environment';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { stores } from './stores.service';

interface StatusObject {
    status: string;
    reason?: string;
}

@Injectable()
/** Defines the datalayer service */
export class SilStoresService {
    availableApps = {
        advantage: false,
        quintus: false,
        healthCRM: false,
        accessAfya: false,
        autorecon: false,
        userguide: false,
    };
    /** contains the environment */
    configs: any = environment;
    /** contains the server url */
    serverUrl = environment.onBoardingURL;
    /** contains the OCL url */
    oclUrl = 'https://api.openconceptlab.org/concepts';
    /** contains the erp server url */
    erpServerUrl = environment.erpServerURL;
    /** contains the edi server url */
    ediServerUrl = environment.ediServerURL;
    /** contains the is server url */
    isServerUrl = environment.isServerURL;
    /** contains the is clinical graphql url */
    clinicalUrl = environment.clinicalServerURL;
    /** contains the is clinical rest url */
    clinicalRestUrl = environment.clinicalRestUrl;
    /** contains the sil comms url */
    commsUrl = environment.commsServerURL;
    /** contains the authserver url */
    authServerUrl = environment.AUTH_SERVER_DOMAIN;
    /** contains the ocl diagnoses server url */
    oclServerUrl = environment.oclServerUrl;
    /** contains the biometrics middleware service server url */
    biometricsMidlewareServiceUrl = environment.biometricsMidlewareServiceUrl;
    /** contains the ocl server token */
    oclServerToken = environment.oclServerToken;
    /** contains the api configurations */
    stores: any[] = stores;
    /** sets the workstation that is used */
    workstation: object;
    /** contains the user's workstations  */
    userWorkstations: any;
    /** clinical ids localstorage object name */
    USER_CLINICAL_IDS = 'auth.config.clinicalIds';
    /**
     * variant
     */
    appVariant = environment.variant;

    private httpClient: HttpClient;

    constructor(
        private http: HttpClient,
        private handler: HttpBackend,
        public authServ: Authorization,
        public $state: StateService
    ) {
        const erpOrg = authServ.getErpOrganisation();
        this.processWorkstation(erpOrg);
        this.httpClient = new HttpClient(handler);
    }

    /**
     * processes which workstation to use based on the erp user information
     * @param erpOrg
     */
    processWorkstation(erpOrg) {
        if (erpOrg) {
            this.userWorkstations = erpOrg.user_workstations;
            this.workstation = this.authServ.getWorkstation();
        }
    }

    /**
     * finds the store that is being used based on the store name
     * @param name
     * @returns
     */
    getStore(name: string) {
        const aStore = _.findWhere(this.stores, { name });
        return aStore;
    }

    /**
     * get server that is being used
     * @param store
     * @returns
     */
    getServer(store) {
        const server = store['server'] ? store['server'] : this.serverUrl;
        return server;
    }

    /**
     *
     * @param server
     * @returns
     */

    processHeaders(server, workstation?, hasContentTypeHeader = true) {
        const token: any = this.authServ.getToken();
        let headersObj: HttpHeaders;
        if (token === null) {
            /** Ensure sign up is done */
            if (
                this.$state.includes('auth.sign-up') ||
                this.$state.includes('auth.welcome') ||
                this.$state.includes('app.risk-assessment.breast_cancer') ||
                this.$state.includes('app.risk-assessment.cervical_cancer') ||
                this.$state.includes('app.risk-assessment.prostate_cancer')
            ) {
                return {};
            }
            this.$state.go('auth.logout');
            return;
        }

        headersObj = new HttpHeaders({
            Authorization: `${token.token_type} ${token.access_token}`,
        });

        if (server === this.authServerUrl) {
            headersObj = new HttpHeaders({
                Authorization: `${token.token_type} ${token.access_token}`,
                'X-Variant': this.appVariant,
            });
        }
        if (server === this.erpServerUrl) {
            const wkstation = this.checkForWorkstation(workstation);
            if (wkstation !== undefined) {
                headersObj = new HttpHeaders({
                    Authorization: `${token.token_type} ${token.access_token}`,
                    'X-workstation': wkstation.workstation,
                    'X-Variant': this.appVariant,
                });
            } else {
                headersObj = new HttpHeaders({
                    Authorization: `${token.token_type} ${token.access_token}`,
                    'X-Variant': this.appVariant,
                });
            }
        } else if (server === this.serverUrl) {
            const wkstation = this.checkForWorkstation(undefined);
            const erpOrg = this.authServ.getErpOrganisation();
            this.processWorkstation(erpOrg);
            if (wkstation !== undefined) {
                headersObj = new HttpHeaders({
                    Authorization: `${token.token_type} ${token.access_token}`,
                    'X-Workstation': wkstation['workstation'],
                    'X-Department': wkstation['workstation__org_unit'],
                    'X-Branch': wkstation['workstation__org_unit__parent'],
                    'X-Cluster':
                        wkstation['workstation__org_unit__parent__parent'],
                    'X-Variant': this.appVariant,
                });
            } else {
                /** Cases such as fetching /me will not have a workstation */
                headersObj = new HttpHeaders({
                    Authorization: `${token.token_type} ${token.access_token}`,
                });
            }
        } else if (server === this.commsUrl) {
            headersObj = new HttpHeaders({
                Authorization: `X-Bearer ${token.access_token}`,
            });
            return headersObj;
        } else if (server === this.clinicalRestUrl) {
            const clinicalIds = this.authServ.getUserClinicalIds();
            let baseHeaders: any = {
                Authorization: `Bearer ${token.access_token}`,
                'Clinical-Organization-ID': `${clinicalIds.clinical_org_id}`,
                'Clinical-Facility-ID': `${clinicalIds.clinical_facility_id}`,
            };

            if (hasContentTypeHeader) {
                baseHeaders = {
                    'content-type': 'application/json',
                    ...baseHeaders,
                };
            }
            headersObj = new HttpHeaders({
                ...baseHeaders,
            });
        } else if (server === this.oclServerUrl) {
            headersObj = new HttpHeaders({
                Authorization: `Bearer ${this.oclServerToken}`,
            });
        } else if (server === this.biometricsMidlewareServiceUrl) {
            headersObj = new HttpHeaders({
                'X-INTENT': 'Advantage',
            });
        }
        return headersObj;
    }

    /** Check what workstation should be used */
    checkForWorkstation(workstation) {
        this.workstation = this.authServ.getWorkstation();

        const roles = this.authServ.getUser()?.roles ?? [];
        const perms = this.authServ.getUser()?.permissions;

        const rolePermissionMappings = [
            {
                condition:
                    roles?.includes('Health CRM') &&
                    perms?.includes('crm.person_list'),
                app: 'healthCRM',
            },
            {
                condition: roles?.includes('Autorecon'),
                app: 'autorecon',
            },
            {
                condition:
                    roles?.includes('M-Daktari AI') &&
                    perms?.includes('mdaktari_ai.clinical_guideline_list'),
                app: 'accessAfya',
            },
            {
                condition: perms?.includes('advantage.patient_list'),
                app: 'advantage',
            },
        ];

        rolePermissionMappings.forEach(({ condition, app }) => {
            if (condition) {
                this.availableApps[app] = true;
            }
        });

        if (this.$state?.current?.name?.startsWith('app.userguide')) {
            return undefined;
        }

        let wkstation;
        if (workstation) {
            wkstation = workstation;
        } else if (
            this.workstation !== null &&
            this.workstation !== undefined
        ) {
            wkstation = this.workstation;
        } else {
            const apps = [
                'accessAfya',
                'advantage',
                'healthCRM',
                'quintus',
                'userguide',
                'autorecon',
            ];

            const noApps = apps.every(app => !this.availableApps[app]);

            this.noAppsNavigation(noApps);
        }
        return wkstation;
    }

    /** Navigation after determining applications status */
    noAppsNavigation(noApps: boolean) {
        switch (true) {
            case noApps && this.availableApps.autorecon:
                this.$state.go('app.autorecon');
                break;
            case noApps && this.availableApps.userguide:
                this.$state.go('app.userguide');
                break;
            default:
                this.$state.go('auth.workstation');
                break;
        }
    }

    /** Get data clinical from clinical server */
    getClinical(storeName: string, opts?, responseType: any = 'json') {
        const store = this.getStore(storeName);
        const server = this.getServer(store);
        const headersObj = this.processHeaders(server);
        const completeUrl = `${server}${store.url}`;
        const resp = this.http
            .get(completeUrl, {
                headers: headersObj,
                params: opts,
                responseType: responseType,
            })
            .pipe(map(result => result));
        return resp;
    }

    /**
     * used to fetch records from a list endpoint
     * @param storeName
     * @param opts
     * @returns
     */
    list(storeName: string, opts?: any, workstation?: string) {
        if (storeName !== 'ocl-diagnoses') {
            const store = this.getStore(storeName);
            const server = this.getServer(store);
            const completeUrl = `${server}${store.url}`;
            const headersObj = this.processHeaders(server, workstation);
            const params = { headers: headersObj, params: opts };
            return this.http
                .get(completeUrl, params)
                .pipe(map(result => result));
        } else {
            const store = this.getStore(storeName);
            const server = this.getServer(store);
            const completeUrl = `${server}${store.url}`;
            const headersObj = new HttpHeaders().set(
                'Authorization',
                '105528af-9aa9-460b-a016-910863cefb95'
            );
            const params = { headers: headersObj, params: opts };
            return this.httpClient
                .get(completeUrl, params)
                .pipe(map(result => result));
        }
    }

    /**
     * used to get nested records from a certain record
     * @param storeName
     * @param view
     * @param id
     * @param opts
     * @returns
     */
    listNested(
        storeName: string,
        view: string,
        id: string,
        opts?: any,
        removeSlash?: boolean
    ) {
        const store = this.getStore(storeName);
        const server = this.getServer(store);
        const completeUrl = `${server}${store.url}${id}/${view}${
            removeSlash ? '' : '/'
        }`;
        const headersObj = this.processHeaders(server);
        const params = { headers: headersObj, params: opts };
        return this.http.get(completeUrl, params).pipe(map(result => result));
    }

    /**
     * used to download blobs from nested endpoints
     * @param storeName name of the store
     * @param view from the backend
     * @param id for the resource
     * @returns a get http client instance
     */
    listNestedDownload(storeName: string, view: string, id: string) {
        const store = this.getStore(storeName);
        const server = this.getServer(store);
        const completeUrl = `${server}${store.url}${id}/${view}/`;
        const headersObj = this.processHeaders(server);
        return this.http
            .get(completeUrl, { headers: headersObj, responseType: 'blob' })
            .pipe(map(result => result));
    }

    /**
     * used to update a record
     * @param storeName name of the store
     * @param id for the resource
     * @param patchObj data sent in the payload
     * @param opts params for the url
     * @returns a patch http client instance
     */
    update(
        storeName: string,
        id: any,
        patchObj: object,
        opts?: any,
        removeSlash?: boolean
    ) {
        const store = this.getStore(storeName);
        const server = this.getServer(store);
        const completeUrl = `${server}${store.url}${id}${
            removeSlash ? '' : '/'
        }`;
        const headersObj = this.processHeaders(server);
        const params = { headers: headersObj, params: opts };
        return this.http
            .patch(completeUrl, patchObj, params)
            .pipe(map(result => result));
    }

    /**
     * used to update nested records from a certain record
     * @param storeName name of the store
     * @param id for the resource
     * @param view for the url-view
     * @param patchObj data sent in the payload
     * @param opts
     * @returns
     */
    updateNested(
        storeName: string,
        id: any,
        view: string,
        patchObj,
        opts?: any
    ) {
        const store = this.getStore(storeName);
        const server = this.getServer(store);
        const completeUrl = `${server}${store.url}${id}/${view}/`;
        const headersObj = this.processHeaders(server);
        const params = { headers: headersObj, params: opts };
        return this.http
            .patch(completeUrl, patchObj, params)
            .pipe(map(result => result));
    }

    /**
     * used to update nested records from a certain record
     * @param storeName name of the store
     * @param id for the resource
     * @param view for the url-view
     * @param patchObj data sent in the payload
     * @param opts
     * @returns
     */
    updateResource(
        storeName: string,
        id: any,
        view: string,
        patchObj,
        opts?: any
    ) {
        const store = this.getStore(storeName);
        const server = this.getServer(store);
        const completeUrl = `${server}${store.url}${id}/${view}/`;
        const headersObj = this.processHeaders(server);
        const params = { headers: headersObj, params: opts };
        return this.http
            .put(completeUrl, patchObj, params)
            .pipe(map(result => result));
    }

    statusUpdate(
        storeName: string,
        id: any,
        patchObj: StatusObject,
        opts?: any
    ) {
        const store = this.getStore(storeName);
        const server = this.getServer(store);
        const status = patchObj.status;
        const reason = patchObj.reason;
        const completeUrl = `${server}${store.url}${id}/transition/${status}/`;
        const headersObj = this.processHeaders(server);
        const params = { headers: headersObj, params: opts };
        return this.http
            .patch(completeUrl, { reason: reason }, params)
            .pipe(map(result => result));
    }

    /**
     * used to update a record at an list endpoint
     * @param storeName name of the store
     * @param body data sent in the payload
     * @param opts params for the url
     * @returns patch http client instance
     */
    customUpdate(storeName: string, body: object, opts?: any) {
        const store = this.getStore(storeName);
        const server = this.getServer(store);
        const completeUrl = `${server}${store.url}`;
        const headersObj = this.processHeaders(server);
        const params = { headers: headersObj, params: opts };
        return this.http
            .patch(completeUrl, body, params)
            .pipe(map(result => result));
    }

    /**
     * used to delete records
     * @param storeName name of the store
     * @param id for the resource
     * @param opts optional query parameters
     * @returns delete http client instance
     */
    remove(storeName: string, id: any, opts?: any) {
        const store = this.getStore(storeName);
        const server = this.getServer(store);
        const headersObj = this.processHeaders(server);
        const completeUrl = `${server}${store.url}${id ? `${id}/` : ''}`;
        return this.http
            .delete(completeUrl, { headers: headersObj, params: opts })
            .pipe(map(result => result));
    }

    /**
     * used to get a specific record
     * @param storeName name of the store
     * @param id for the resource
     * @param opts params for the url
     * @returns get http client instance
     */
    get(storeName: string, id?: any, opts?, noBackSlash: boolean = false) {
        const store = this.getStore(storeName);
        const server = this.getServer(store);
        const headersObj = this.processHeaders(server);
        const initUrl = `${server}${store.url}`;
        const completeUrl = this.buildUrl(initUrl, id, opts);
        this.buildUrl(initUrl, id, opts);
        const resp = this.http
            .get(completeUrl, {
                headers: headersObj,
                params: noBackSlash ? {} : opts,
            })
            .pipe(map(result => result));
        return resp;
    }

    /** builds complete url */
    buildUrl(initUrl, id, opts) {
        if (id && opts) {
            return `${initUrl}${id}/`;
        }

        if (id) {
            return `${initUrl}${id}/`;
        } else {
            return initUrl;
        }
    }

    /**
     * used to retrieve user information
     * @param opts params for the url
     * @returns get http client instance
     */
    getUser(opts?) {
        const server = environment.ERPME;
        const headersObj = this.processHeaders(server);
        const completeUrl = `${server}`;
        const resp = this.http
            .get(completeUrl, { headers: headersObj, params: opts })
            .pipe(map(result => result));
        return resp;
    }

    /**
     * used to create a new record
     * @param storeName name of the store
     * @param postObj data sent in the payload
     * @param opts params for the url
     * @param hasContentTypeHeader used to hide content type headers on specific cases
     * @param domainUrl used to build custom url that follow a unique convention
     * @param removeSlash boolean to remove trailing slash onn the api endpoint
     * @returns post http client instance
     */
    create(
        storeName: string,
        postObj: object,
        opts?: any,
        workstation?: string,
        id?: string,
        domainUrl?: string,
        removeSlash?: boolean
    ) {
        const store = this.getStore(storeName);
        const server = this.getServer(store);

        const completeUrl = `${server}${
            removeSlash ? store.url.slice(0, -1) : store.url
        }${id ? `${id}/` : domainUrl || ''}`;

        const hasContentTypeHeader = store.url !== '/api/v1/media';
        const headersObj = this.processHeaders(
            server,
            workstation,
            hasContentTypeHeader
        );

        const params = { headers: headersObj, params: opts };
        const resp = this.http
            .post(completeUrl, postObj, params)
            .pipe(map(result => result));
        return resp;
    }

    /**
     * used to create an item in a nested item
     * @param storeName name of the store
     * @param view backend view for api
     * @param id for the reource
     * @param postObj data sent in the payload
     * @param opts params for the url
     * @returns
     */
    createNested(
        storeName: string,
        view: string,
        id: string,
        postObj?: object,
        opts?: any
    ) {
        const store = this.getStore(storeName);
        const server = this.getServer(store);
        const completeUrl = `${server}${store.url}${id}/${view}/`;
        const headersObj = this.processHeaders(server);
        const params = { headers: headersObj, params: opts };
        const resp = this.http
            .post(completeUrl, postObj, params)
            .pipe(map(result => result));
        return resp;
    }

    /**
     * used to update an item in a nested item
     * @param storeName name of the store
     * @param view backend view for api
     * @param id for the reource
     * @param patchObj data sent in the payload
     * @param opts params for the url
     * @returns
     */
    nestedTransition(
        storeName: string,
        id: string,
        transition: string,
        opts?: any,
        patchObj?: object
    ) {
        const store = this.getStore(storeName);
        const server = this.getServer(store);
        const completeUrl = `${server}${store.url}${id}/transition/${transition}/`;
        const headersObj = this.processHeaders(server);
        const params = { headers: headersObj, params: opts };
        const resp = this.http
            .patch(completeUrl, patchObj, params)
            .pipe(map(result => result));
        return resp;
    }

    getExcel(storeName: string): Observable<Blob> {
        const store = this.getStore(storeName);
        const server = this.getServer(store);
        const completeUrl = `${server}${store.url}`;
        const resp = this.http
            .get(completeUrl, { responseType: 'blob' })
            .pipe(map(result => result));
        return resp;
    }

    uploadDocuments(
        storeName: string,
        file: File,
        providerId: string,
        fileTitle: string
    ): Observable<object> {
        const store = this.getStore(storeName);
        const formdata = new FormData();
        formdata.append('data', file, file.name);
        formdata.append('content_type', file.type);
        formdata.append('provider', providerId);
        formdata.append('size', file.size.toString());
        formdata.append('title', fileTitle);

        const token: any = this.authServ.getToken();
        const headersObj = new HttpHeaders({
            Authorization: `${token.token_type} ${token.access_token}`,
            'X-workstation': this.workstation['workstation'],
        });
        const server = this.getServer(store);
        const completeUrl = `${server}${store.url}`;
        const resp = this.http
            .post(completeUrl, formdata, { headers: headersObj })
            .pipe(map(result => result));
        return resp;
    }

    downloadDocument(storeName: string, id: any): Observable<Blob> {
        const store = this.getStore(storeName);
        const token: any = this.authServ.getToken();
        const headersObj = new HttpHeaders({
            Authorization: `${token.token_type} ${token.access_token}`,
            'X-workstation': this.workstation['workstation'],
        });
        const server = this.getServer(store);
        const completeUrl = `${server}${store.url}${id}/download/`;
        return this.http
            .get(completeUrl, { headers: headersObj, responseType: 'blob' })
            .pipe(map(result => result));
    }

    /**
     * supports downloading of documents that require body options
     * @param storeName
     * @param body body
     * @returns Blob
     */
    downloadDocumentOptions(storeName: string, body: any): Observable<Blob> {
        const store = this.getStore(storeName);
        const token: any = this.authServ.getToken();
        const headersObj = new HttpHeaders({
            Authorization: `${token.token_type} ${token.access_token}`,
            'X-workstation': this.workstation['workstation'],
        });
        const server = this.getServer(store);
        const completeUrl = `${server}${store.url}`;
        return this.http
            .post(completeUrl, body, {
                headers: headersObj,
                responseType: 'blob',
            })
            .pipe(map(result => result));
    }

    errMap(errObj) {
        const errArray = [];
        const keys = _.keys(errObj);
        _.each(keys, key => {
            const obj: any = {};
            obj.key = key;
            obj.value = errObj[key];
            errArray.push(obj);
        });
        return errArray;
    }
}

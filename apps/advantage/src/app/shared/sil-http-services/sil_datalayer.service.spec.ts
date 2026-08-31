import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { StateService } from '@uirouter/angular';
import { environment } from '../../../environments/environment';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../app-config.service';
import { SilStoresService } from './sil_datalayer.service';
import { SilKeycloakService } from '../../shared/sil-keycloak/keycloak.service';

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
    includes() {
        return true;
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

class StateServiceStub2 {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transitionTo() {
        return true;
    }
    includes() {
        return false;
    }
}

describe('SilStoresService', () => {
    let service: SilStoresService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                Authorization,
                SilStoresService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { params: { id: '24fkzrw3487943uf358lovd' } },
                    },
                },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(SilStoresService);
        service.workstation = {
            workstation: '1',
        };
        service.USER_CLINICAL_IDS = 'auth.config.clinicalIds';
        window.localStorage.setItem(
            'auth.config.userWorkStation',
            JSON.stringify({
                workstation: '1',
                workstation__org_unit: '2',
                workstation__org_unit__parent: '3',
            })
        );
        httpMock = TestBed.inject(HttpTestingController);
        localStorage.setItem(
            'auth.config.credz',
            JSON.stringify({ token_type: '1', access_token: '1' })
        );
        localStorage.setItem(
            'auth.config.clinicalIds',
            JSON.stringify({
                clinical_org_id: '14234234',
                clinical_facility_id: '23123',
            })
        );
        service.stores = [
            {
                name: 'sql',
                url: '/sql/',
            },
            {
                name: 'diagnosis',
                url: '',
                server: service.oclUrl,
            },
            {
                name: 'ocl-diagnoses',
                url: '/concepts',
                server: service.oclServerUrl,
            },
            {
                name: 'questionnaires',
                url: '/api/v1/questionnaires',
                server: service.clinicalRestUrl,
            },
            {
                name: 'erp-sql',
                url: '/sql/',
                server: service.erpServerUrl,
            },
            {
                name: 'comms-sql',
                url: '/sql/',
                server: service.commsUrl,
            },
            {
                name: 'auth-sql',
                url: '/sql/',
                server: service.authServerUrl,
            },
            {
                name: 'ocl-diagnoses',
                url: '/concepts',
                server: service.oclServerUrl,
            },
        ];
        spyOn(service.$state, 'go');
    });

    it('should test processHeaders with token', () => {
        spyOn(service, 'create').and.callThrough();
        const result = service.create('erp-sql', {}, null, '121');
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.create).toHaveBeenCalledWith('erp-sql', {}, null, '121');
        const request = httpMock.expectOne(`${service.erpServerUrl}/sql/`);
        expect(request.request.method).toBe('POST');
        request.flush({ results: [] });
        httpMock.verify();
        spyOn(service.authServ, 'getToken').and.returnValue(null);
        spyOn(service, 'processHeaders').and.callThrough();
        service.processHeaders(environment.erpServerURL, 'asdafdsf');
        spyOn(service, 'checkForWorkstation').and.returnValue({
            workstation: '1',
        });
        expect(service.processHeaders).toHaveBeenCalled();
    });

    it('should test processHeaders with token and id', () => {
        spyOn(service, 'create').and.callThrough();
        const result = service.create('erp-sql', {}, null, '121', '2');
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.create).toHaveBeenCalledWith(
            'erp-sql',
            {},
            null,
            '121',
            '2'
        );
        const request = httpMock.expectOne(`${service.erpServerUrl}/sql/2/`);
        expect(request.request.method).toBe('POST');
        request.flush({ results: [] });
        httpMock.verify();
        spyOn(service.authServ, 'getToken').and.returnValue(null);
        spyOn(service, 'processHeaders').and.callThrough();
        service.processHeaders(environment.erpServerURL, 'asdafdsf');
        spyOn(service, 'checkForWorkstation').and.returnValue({
            workstation: '1',
        });
        expect(service.processHeaders).toHaveBeenCalled();
    });

    it('should test processHeaders for authServerUrl', () => {
        spyOn(service, 'processHeaders').and.callThrough();
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        service.processHeaders(service.authServerUrl);
        expect(service.processHeaders).toHaveBeenCalled();
    });

    it('should test processHeaders for erpServerUrl', () => {
        spyOn(service, 'processHeaders').and.callThrough();
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        spyOn(service, 'checkForWorkstation').and.returnValue({
            workstation: '1',
        });
        service.processHeaders(service.erpServerUrl);
        expect(service.processHeaders).toHaveBeenCalled();
    });

    it('should test processHeaders for erpServerUrl and no workstation is found', () => {
        spyOn(service, 'processHeaders').and.callThrough();
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        spyOn(service, 'checkForWorkstation').and.returnValue(undefined);
        service.processHeaders(service.erpServerUrl);
        expect(service.processHeaders).toHaveBeenCalled();
    });

    it('should test processHeaders for advantageServerUrl', () => {
        spyOn(service, 'processHeaders').and.callThrough();
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        spyOn(service, 'checkForWorkstation').and.returnValue({
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        });
        service.processHeaders(service.serverUrl);
        expect(service.processHeaders).toHaveBeenCalled();
    });

    it('should test processHeaders for advantageServerUrl and no workstation is found', () => {
        spyOn(service, 'processHeaders').and.callThrough();
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        spyOn(service, 'checkForWorkstation').and.returnValue(undefined);
        service.processHeaders(service.serverUrl);
        expect(service.processHeaders).toHaveBeenCalled();
    });

    it('should test processHeaders for commsUrl', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        spyOn(service, 'processHeaders').and.callThrough();
        service.processHeaders(service.commsUrl);
        expect(service.processHeaders).toHaveBeenCalled();
    });

    it('should test processHeaders for clinical', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        spyOn(service, 'processHeaders').and.callThrough();
        service.processHeaders(service.clinicalRestUrl);
        expect(service.processHeaders).toHaveBeenCalled();
    });

    it('should test processHeaders for clinical if hasContentTypeHeader is set to false', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        spyOn(service, 'processHeaders').and.callThrough();
        service.processHeaders(service.clinicalRestUrl, undefined, false);
        expect(service.processHeaders).toHaveBeenCalled();
    });

    it('should test processHeaders for oclServerUrl', () => {
        spyOn(service, 'processHeaders').and.callThrough();
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        service.processHeaders(service.oclServerUrl);
        expect(service.processHeaders).toHaveBeenCalled();
    });

    it('should test processHeaders for biometricsMidlewareServiceUrl', () => {
        spyOn(service, 'processHeaders').and.callThrough();
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        service.processHeaders(service.biometricsMidlewareServiceUrl);
        expect(service.processHeaders).toHaveBeenCalled();
    });

    it('should test checkForWorkstation', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        spyOn(service, 'checkForWorkstation').and.callThrough();
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        service.checkForWorkstation(workstation);
        service.checkForWorkstation(undefined);
        expect(service.checkForWorkstation).toHaveBeenCalled();
    });

    it('should skip workstation check for userguide app', () => {
        service.$state = {
            get current() {
                return { name: 'app.userguide' };
            },
        } as any;

        const result = service.checkForWorkstation(null);

        expect(result).toBeUndefined();
    });

    it('should go to app.userguide when no other apps are available but userguide is true', () => {
        service.availableApps.accessAfya = false;
        service.availableApps.advantage = false;
        service.availableApps.healthCRM = false;
        service.availableApps.autorecon = false;
        service.availableApps.userguide = true;

        service.noAppsNavigation(true);

        expect(service.$state.go).toHaveBeenCalledWith('app.userguide');
    });

    it('should test checkForWorkstation getWorkstation is not null', () => {
        spyOn(service, 'checkForWorkstation').and.callThrough();
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        service.checkForWorkstation(workstation);
        service.checkForWorkstation(undefined);
        expect(service.checkForWorkstation).toHaveBeenCalled();
    });

    it('should test checkForWorkstation getWorkstation is undefined', () => {
        spyOn(service, 'checkForWorkstation').and.callThrough();
        spyOn(service.authServ, 'getWorkstation').and.returnValue(undefined);
        service.checkForWorkstation(undefined);
        expect(service.checkForWorkstation).toHaveBeenCalled();
    });

    it('should test list method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'list').and.callThrough();
        const result = service.list('sql', {});
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.list).toHaveBeenCalledWith('sql', {});
        const request = httpMock.expectOne(`${service.serverUrl}/sql/`);
        expect(request.request.method).toBe('GET');
        request.flush({ results: [] });
        httpMock.verify();
    });
    it('should test comms list method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        spyOn(service, 'list').and.callThrough();
        const result = service.list('comms-sql', {});
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.list).toHaveBeenCalledWith('comms-sql', {});
        const request = httpMock.expectOne(`${service.commsUrl}/sql/`);
        expect(request.request.method).toBe('GET');
        request.flush({ results: [] });
        httpMock.verify();
    });
    it('should test list method for a store url without a trailing slash', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        spyOn(service, 'list').and.callThrough();
        const result = service.list('questionnaires', {});
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.list).toHaveBeenCalledWith('questionnaires', {});
        const request = httpMock.expectOne(
            `${service.clinicalRestUrl}/api/v1/questionnaires`
        );
        expect(request.request.method).toBe('GET');
        request.flush({ results: [] });
        httpMock.verify();
    });
    it('should test list method with ocl-diagnoses as the parameter', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'list').and.callThrough();
        const result = service.list('ocl-diagnoses', {});
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.list).toHaveBeenCalledWith('ocl-diagnoses', {});
        const request = httpMock.expectOne(`${service.oclServerUrl}/concepts`);
        expect(request.request.method).toBe('GET');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test listNested method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'listNested').and.callThrough();
        const result = service.listNested('sql', 'nested', '1');
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.listNested).toHaveBeenCalledWith('sql', 'nested', '1');
        const request = httpMock.expectOne(
            `${service.serverUrl}/sql/1/nested/`
        );
        expect(request.request.method).toBe('GET');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test listNestedDownload method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'listNestedDownload').and.callThrough();
        spyOn(service, 'getStore').and.returnValue({
            name: 'graphql',
            url: '/visits/',
        });
        const result = service.listNestedDownload('visits', 'download', '1');
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.listNestedDownload).toHaveBeenCalledWith(
            'visits',
            'download',
            '1'
        );
        const request = httpMock.expectOne(
            `${service.serverUrl}/visits/1/download/`
        );
        expect(request.request.method).toBe('GET');
        const response = new Blob();
        request.flush(response);
        httpMock.verify();
    });

    it('should test createNested method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'createNested').and.callThrough();
        const result = service.createNested('erp-sql', 'nested', '1');
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.createNested).toHaveBeenCalledWith(
            'erp-sql',
            'nested',
            '1'
        );
        const request = httpMock.expectOne(
            `${service.erpServerUrl}/sql/1/nested/`
        );
        expect(request.request.method).toBe('POST');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test update method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'update').and.callThrough();
        const result = service.update('sql', 1, {});
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.update).toHaveBeenCalledWith('sql', 1, {});
        const request = httpMock.expectOne(`${service.serverUrl}/sql/1/`);
        expect(request.request.method).toBe('PATCH');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test update method with removeSlash', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'update').and.callThrough();
        const result = service.update('sql', 1, {}, null, true);
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.update).toHaveBeenCalledWith('sql', 1, {}, null, true);
        const request = httpMock.expectOne(`${service.serverUrl}/sql/1`);
        expect(request.request.method).toBe('PATCH');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test listNested method with removeSlash', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'listNested').and.callThrough();
        const result = service.listNested('sql', 'update', '1', {}, true);
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.listNested).toHaveBeenCalledWith(
            'sql',
            'update',
            '1',
            {},
            true
        );
        const request = httpMock.expectOne(`${service.serverUrl}/sql/1/update`);
        expect(request.request.method).toBe('GET');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test updateNested method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'updateNested').and.callThrough();
        const result = service.updateNested('sql', 1, 'update', {});
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.updateNested).toHaveBeenCalledWith(
            'sql',
            1,
            'update',
            {}
        );
        const request = httpMock.expectOne(
            `${service.serverUrl}/sql/1/update/`
        );
        expect(request.request.method).toBe('PATCH');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test updateResource method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'updateResource').and.callThrough();
        const result = service.updateResource('sql', 1, 'update', {});
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.updateResource).toHaveBeenCalledWith(
            'sql',
            1,
            'update',
            {}
        );
        const request = httpMock.expectOne(
            `${service.serverUrl}/sql/1/update/`
        );
        expect(request.request.method).toBe('PUT');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test statusUpdate method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        spyOn(service, 'statusUpdate').and.callThrough();
        spyOn(service, 'checkForWorkstation').and.returnValue({
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        });
        const result = service.statusUpdate('sql', 1, { status: 'STATUS' });
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.statusUpdate).toHaveBeenCalledWith('sql', 1, {
            status: 'STATUS',
        });
        const request = httpMock.expectOne(
            `${service.serverUrl}/sql/1/transition/STATUS/`
        );
        expect(request.request.method).toBe('PATCH');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test custom update method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'customUpdate').and.callThrough();
        const result = service.customUpdate('sql', {}, {});
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.customUpdate).toHaveBeenCalledWith('sql', {}, {});
        const request = httpMock.expectOne(`${service.serverUrl}/sql/`);
        expect(request.request.method).toBe('PATCH');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test remove method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'remove').and.callThrough();
        const result = service.remove('sql', 2);
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.remove).toHaveBeenCalledWith('sql', 2);
        const request = httpMock.expectOne(`${service.serverUrl}/sql/2/`);
        expect(request.request.method).toBe('DELETE');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test remove method with falsy id', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'remove').and.callThrough();

        const result = service.remove('sql', null);
        result.subscribe(results => {
            results = results;
            return results;
        });

        expect(service.remove).toHaveBeenCalledWith('sql', null);
        const request = httpMock.expectOne(`${service.serverUrl}/sql/`);
        expect(request.request.method).toBe('DELETE');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test get method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'get').and.callThrough();
        const result = service.get('sql');
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.get).toHaveBeenCalledWith('sql');
        const request = httpMock.expectOne(`${service.serverUrl}/sql/`);
        expect(request.request.method).toBe('GET');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test getClinical method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'getClinical').and.callThrough();
        const result = service.getClinical('sql');
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.getClinical).toHaveBeenCalledWith('sql');
        const request = httpMock.expectOne(`${service.serverUrl}/sql/`);
        expect(request.request.method).toBe('GET');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test get method with id', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'get').and.callThrough();
        const result = service.get('sql', '1');
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.get).toHaveBeenCalledWith('sql', '1');
        const request = httpMock.expectOne(`${service.serverUrl}/sql/1/`);
        expect(request.request.method).toBe('GET');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test get method if noBackSlash is set to true', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'get').and.callThrough();
        const result = service.get('sql', '1', {}, true);
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.get).toHaveBeenCalledWith('sql', '1', {}, true);
        const request = httpMock.expectOne(`${service.serverUrl}/sql/1/`);
        expect(request.request.method).toBe('GET');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test get method with id and options two', () => {
        spyOn(service, 'buildUrl').and.callThrough();
        service.buildUrl('sql', '1', 'refunds');
        expect(service.buildUrl).toHaveBeenCalledWith('sql', '1', 'refunds');
    });

    it('should test getUser method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'getUser').and.callThrough();
        const result = service.getUser({ fields: 'id' });
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.getUser).toHaveBeenCalledWith({ fields: 'id' });
        const request = httpMock.expectOne(`${environment.ERPME}?fields=id`);
        expect(request.request.method).toBe('GET');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test getExcel method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'getExcel').and.callThrough();
        const result = service.getExcel('sql');
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.getExcel).toHaveBeenCalledWith('sql');
        const request = httpMock.expectOne(`${service.serverUrl}/sql/`);
        expect(request.request.method).toBe('GET');
        const response = new Blob();
        request.flush(response);
        httpMock.verify();
    });

    it('should test downloadDocument method for GET request', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: '1',
            token_access: 'access_token',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'downloadDocument').and.callThrough();
        const result = service.downloadDocument('sql', '1');
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.downloadDocument).toHaveBeenCalledWith('sql', '1');
        const request = httpMock.expectOne(
            `${service.serverUrl}/sql/1/download/`
        );
        expect(request.request.method).toBe('GET');
        const response = new Blob();
        request.flush(response);
        httpMock.verify();
    });

    it('should test downloadDocumentOptions with POST method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: '1',
            token_access: 'access_token',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'downloadDocumentOptions').and.callThrough();
        const result = service.downloadDocumentOptions('sql', '1');
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.downloadDocumentOptions).toHaveBeenCalledWith(
            'sql',
            '1'
        );
        const request = httpMock.expectOne(`${service.serverUrl}/sql/`);
        expect(request.request.method).toBe('POST');
        const response = new Blob();
        request.flush(response);
        httpMock.verify();
    });

    it('should test create method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'create').and.callThrough();
        const result = service.create('sql', {});
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.create).toHaveBeenCalledWith('sql', {});
        const request = httpMock.expectOne(`${service.serverUrl}/sql/`);
        expect(request.request.method).toBe('POST');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test create method when the domainUrl has been set', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'create').and.callThrough();
        const result = service.create('sql', {}, {}, '', '', 'test-url');
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.create).toHaveBeenCalledWith(
            'sql',
            {},
            {},
            '',
            '',
            'test-url'
        );
        const request = httpMock.expectOne(`${service.serverUrl}/sql/test-url`);
        expect(request.request.method).toBe('POST');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test create function and remove trailing slash when removeSlash is true', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'create').and.callThrough();
        const result = service.create('sql', {}, null, null, null, null, true);

        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.create).toHaveBeenCalledWith(
            'sql',
            {},
            null,
            null,
            null,
            null,
            true
        );
        const request = httpMock.expectOne(`${service.serverUrl}/sql`);
        expect(request.request.method).toBe('POST');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test uploadDocuments method for POST request', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'uploadDocuments').and.callThrough();
        const file = new File([''], 'file');
        const result: any = service.uploadDocuments(
            'sql',
            file,
            'store',
            'check'
        );
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.uploadDocuments).toHaveBeenCalledWith(
            'sql',
            file,
            'store',
            'check'
        );
        const request = httpMock.expectOne(`${service.serverUrl}/sql/`);
        expect(request.request.method).toBe('POST');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test nestedTransition method', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });
        const workstation = {
            workstation: '1',
            workstation__org_unit: '2',
            workstation__org_unit__parent: '3',
            workstation__org_unit__parent__parent: '4',
        };
        spyOn(service.authServ, 'getWorkstation').and.returnValue(workstation);
        spyOn(service, 'nestedTransition').and.callThrough();
        const result = service.nestedTransition('sql', '1', 'PROCESSED');
        result.subscribe(results => {
            results = results;
            return results;
        });
        expect(service.nestedTransition).toHaveBeenCalledWith(
            'sql',
            '1',
            'PROCESSED'
        );
        const request = httpMock.expectOne(
            `${service.serverUrl}/sql/1/transition/PROCESSED/`
        );
        expect(request.request.method).toBe('PATCH');
        request.flush({ results: [] });
        httpMock.verify();
    });

    it('should test errMap method', () => {
        const obj = {
            key: '',
            value: '',
        };
        spyOn(service, 'errMap').and.callThrough();
        service.errMap(obj);
        expect(service.errMap).toHaveBeenCalled();
    });
});

describe('SilStoresService: no workstations', () => {
    let service: SilStoresService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                Authorization,
                SilStoresService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { params: { id: '24fkzrw3487943uf358lovd' } },
                    },
                },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                { provide: StateService, useClass: StateServiceStub2 },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(SilStoresService);
        localStorage.setItem(
            'auth.config.credz',
            JSON.stringify({ token_type: '1', access_token: '1' })
        );
        localStorage.setItem(
            'auth.config.erporg',
            JSON.stringify({ email: 'user@email ', user_workstations: [{}] })
        );
        service.USER_CLINICAL_IDS = 'auth.config.clinicalIds';
        service.stores = [
            {
                name: 'sql',
                url: '/sql/',
            },
            {
                name: 'erp-sql',
                url: '/sql/',
                server: service.erpServerUrl,
            },
        ];
    });

    it('should test processWorkstation', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: '1',
            token_access: 'access_token',
        });
        spyOn(service, 'processWorkstation').and.callThrough();
        service.processWorkstation(undefined);
        service.processWorkstation(null);
        let obj = {};
        service.processWorkstation(obj);
        obj = {
            user_workstations: null,
        };
        service.processWorkstation(obj);
        obj = {
            user_workstations: [],
        };
        service.processWorkstation(obj);
        obj = {
            user_workstations: [{ workstation: '1' }],
        };
        service.processWorkstation(obj);
        expect(service.processWorkstation).toHaveBeenCalled();
    });
    it('should test processHeaders no token', () => {
        spyOn(service.authServ, 'getToken').and.returnValue(null);
        spyOn(service, 'processHeaders').and.callThrough();
        service.processHeaders(environment.serverURL);
        expect(service.processHeaders).toHaveBeenCalled();
    });
});

describe('SilStoresService: null workstations', () => {
    let service: SilStoresService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                Authorization,
                SilStoresService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { params: { id: '24fkzrw3487943uf358lovd' } },
                    },
                },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                { provide: StateService, useClass: StateServiceStub2 },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(SilStoresService);
        localStorage.setItem(
            'auth.config.credz',
            JSON.stringify({ token_type: '1', access_token: '1' })
        );
        localStorage.removeItem('auth.config.userWorkStation');
        service.USER_CLINICAL_IDS = 'auth.config.clinicalIds';

        service.stores = [
            {
                name: 'sql',
                url: '/sql/',
            },
            {
                name: 'erp-sql',
                url: '/sql/',
                server: service.erpServerUrl,
            },
        ];
        spyOn(service.$state, 'go');
    });

    it('should test terminologies and tariffs user role', () => {
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: '1',
            token_access: 'access_token',
        });
        spyOn(service, 'checkForWorkstation').and.callThrough();
        service.checkForWorkstation(undefined);
        expect(service.checkForWorkstation).toHaveBeenCalled();
    });

    it('should test checkForWorkstation', () => {
        const mockUser = { roles: ['Some Role'], permissions: [] };
        const mockWorkstation = { id: 'mock-workstation' };

        // Spy on authServ methods
        spyOn(service.authServ, 'getToken').and.returnValue({
            token_type: 'Bearer',
            access_token: '12312',
        });

        spyOn(service.authServ, 'getWorkstation').and.returnValue(
            mockWorkstation
        );
        spyOn(service.authServ, 'getUser').and.returnValue(mockUser);

        // Spy on checkForWorkstation
        spyOn(service, 'checkForWorkstation').and.callThrough();

        // Test with provided workstation
        const providedWorkstation = { workstation: '1' };
        const result1 = service.checkForWorkstation(providedWorkstation);
        expect(result1).toBe(providedWorkstation);

        // Test Health CRM app availability
        mockUser.roles = ['Health CRM'];
        mockUser.permissions = ['crm.person_list'];
        service.checkForWorkstation(undefined);
        expect(service.availableApps.healthCRM).toBe(true);

        // Test Access Afya app availability
        mockUser.roles = ['M-Daktari AI'];
        mockUser.permissions = ['mdaktari_ai.clinical_guideline_list'];
        service.checkForWorkstation(undefined);
        expect(service.availableApps.accessAfya).toBe(true);

        // Test Advantage app availability
        mockUser.permissions = ['advantage.patient_list'];
        service.checkForWorkstation(undefined);
        expect(service.availableApps.advantage).toBe(true);

        service.availableApps.accessAfya = false;
        service.availableApps.advantage = false;
        service.availableApps.healthCRM = false;

        mockUser.permissions = [];

        service.availableApps.advantage = false;
        service.availableApps.accessAfya = false;
        service.availableApps.healthCRM = false;

        expect(service.checkForWorkstation).toHaveBeenCalledTimes(4);
    });
    it('should navigate to app.autorecon when noApps is true and autorecon is available', () => {
        // Arrange: all apps false except autorecon
        Object.keys(service.availableApps).forEach(app => {
            service.availableApps[app] = false;
        });
        service.availableApps.autorecon = true;
        // Act
        service.noAppsNavigation(true);
        // Assert
        expect(service.$state.go).toHaveBeenCalledWith('app.autorecon');
    });
});

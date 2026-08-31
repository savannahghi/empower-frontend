import { AuthUrls } from './oauth2.service';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { DataLayerUtils } from './datalayer.utils.service';
import { Oauth2Service, OauthCredz } from './oauth2.service';
import { RouterTestingModule } from '@angular/router/testing';
import {
    Location,
    LocationStrategy,
    APP_BASE_HREF,
    PathLocationStrategy,
} from '@angular/common';
import { Authorization } from './authorization.service';
import { TestBed } from '@angular/core/testing';
import _ from 'underscore';
import moment from 'moment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StateService } from '@uirouter/core';
import { environment } from '../../../../environments/environment';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { SilKeycloakService } from 'app/shared/sil-keycloak/keycloak.service';
import { FeatureFlagService } from '../../utils/feature.service';
import { Cookies } from '../../../shared/cookies/cookie.service';
import { InitializeFlagsService } from 'app/@core/utils/initialize-flags.service';

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

class SilKeycloakServiceStub {
    getToken() {
        return true;
    }
    getUserInfo() {
        return true;
    }
    isLoggedIn(): Promise<boolean> {
        return Promise.resolve(true);
    }
    logout(): Promise<void> {
        return Promise.resolve();
    }
    getSelectedOrganisationId() {
        return 'org-123';
    }
}

class Oauth2ServiceStub {
    scopes = { scopes: ['scope1', 'scope2'] };
    authUrls = new AuthUrls();
    oauthCredz = new OauthCredz();
}

class InitializeFlagsServiceStub {
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

    getForcedValue(): boolean {
        return false;
    }
}

class FeatureFlagServiceStub {
    isFeatureOn(): boolean {
        return false;
    }
}

describe('Authorization Service Specs:', () => {
    'use strict';

    let httpMock: HttpTestingController;

    let service: Authorization;

    const testObj = { key: 'value' };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                Authorization,
                Location,
                DataLayerUtils,
                Cookies,
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                { provide: Oauth2Service, useClass: Oauth2ServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: LocationStrategy, useClass: PathLocationStrategy },
                { provide: APP_BASE_HREF, useValue: '/my/app' },
                {
                    provide: InitializeFlagsService,
                    useClass: InitializeFlagsServiceStub,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(Authorization);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        service = undefined;
    });

    it('checkOauthScopes should return undefined', () => {
        spyOn(service, 'checkOauthScopes').and.callThrough();
        service.checkOauthScopes();
        expect(service.checkOauthScopes).toHaveBeenCalled();
    });

    it('getUserInformation return user information from keycloak', () => {
        spyOn(service, 'getUserInformation').and.callThrough();
        service.getUserInformation();
        expect(service.getUserInformation).toHaveBeenCalled();
        spyOn(service.keycloakService, 'getUserInfo');
        service.getUserInformation().subscribe(() => {
            expect(service.keycloakService.getUserInfo).toHaveBeenCalled();
        });
    });

    it('checkOauthScopes should return empty', () => {
        spyOn(service, 'checkOauthScopes').and.callThrough();
        spyOn(_, 'isEmpty').and.returnValue(true);
        service.checkOauthScopes();
        expect(service.checkOauthScopes).toHaveBeenCalled();
    });

    it('should test removeTokenData', () => {
        spyOn(service, 'removeTokenData').and.callThrough();
        spyOn(service, 'removeAuthToken').and.callThrough();
        service.removeTokenData();
        service.removeAuthToken();
        expect(service.removeTokenData).toHaveBeenCalled();
        expect(service.removeAuthToken).toHaveBeenCalled();
    });

    it('getUser should return defined', () => {
        spyOn(service, 'getUser').and.callThrough();
        service.getUser();
        service.isLoggedIn();
        service.logout();
        expect(service.getUser).toHaveBeenCalled();
    });

    it('changePassword should return defined', () => {
        spyOn(service, 'changePassword').and.callThrough();
        service.changePassword({});
        service.setUser({});
        expect(service.changePassword).toHaveBeenCalled();
    });

    it('should test getToken method', () => {
        service.CREDZ_STORE = '';
        spyOn(service, 'getToken').and.callThrough();
        service.getToken();
        expect(service.getToken).toHaveBeenCalled();
    });

    it('should test setOrganisation method', () => {
        const data = {
            organisationId: 123,
        };
        spyOn(service, 'setOrganisation').and.callThrough();
        service.setOrganisation(data);
        service.setOrganisation(data, 'erp');
        expect(service.setOrganisation).toHaveBeenCalled();
    });

    it('should test getOrgSettings method', () => {
        const data = {
            organisationId: 123,
        };
        service.setOrganisationSettings(data);
        spyOn(service, 'getOrgSettings').and.callThrough();
        service.getOrgSettings();
        expect(service.getOrgSettings).toHaveBeenCalled();
    });

    it('should test getAutoreconSettings method', () => {
        const data = {
            organisation_id: '123',
        };
        service.setAutoreconSettings(data);
        spyOn(service, 'getAutoreconSettings').and.callThrough();
        service.getAutoreconSettings();
        expect(service.getAutoreconSettings).toHaveBeenCalled();
    });

    it('should test getBranchSettings method', () => {
        const data = {
            branchId: 123,
        };
        service.setBranchSettings(data);
        spyOn(service, 'getBranchSettings').and.callThrough();
        service.getBranchSettings();
        expect(service.getBranchSettings).toHaveBeenCalled();
    });

    it('should test setClinicalIds method', () => {
        const ids = {
            clinical_facility_id: null,
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
        spyOn(service, 'setClinicalIds').and.callThrough();
        service.setClinicalIds(ids);
        expect(service.setClinicalIds).toHaveBeenCalled();
    });

    it('refreshToken should return defined 2', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        spyOn(window.document, 'getElementById').and.returnValue(div);
        spyOn(service, 'setAuthDetails').and.callFake(() => null);
        service.setAuthDetails({});
        expect(service.setAuthDetails).toHaveBeenCalled();
    });

    it('refreshToken should return defined 3', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        spyOn(window.document, 'getElementById').and.returnValue(div);
        spyOn(service, 'setAuthDetails').and.callFake(() => {
            const sub = new BehaviorSubject(true);
            sub.complete();

            return sub;
        });
        service.setAuthDetails({});
        expect(service.setAuthDetails).toHaveBeenCalled();
    });

    it('storeToken should return defined', () => {
        spyOn(service, 'storeToken').and.callThrough();
        service.storeToken({ key: 'htw546763jhfj' });
        expect(service.storeToken).toHaveBeenCalled();
    });

    it('objectPropChecker should return defined', () => {
        expect(service.objectPropChecker(1, 9)).toBeDefined();
    });

    it('setAuthDetails should return defined', () => {
        spyOn(service, 'setAuthDetails').and.callThrough();

        service.setAuthDetails({});

        expect(service.setAuthDetails).toHaveBeenCalledWith({});
    });

    const success = () => {};

    const error = () => {};

    const complete = () => {};

    const callbacks = [success, error, complete];

    it('With error in urlParams', () => {
        spyOn(service, 'setAuthDetails').and.callThrough();
        service.setAuthDetails({}).subscribe(...callbacks);
        service.setAuthDetails({ error: 'Kabooom!!' }).subscribe(...callbacks);
        expect(service.setAuthDetails).toHaveBeenCalled();
    });

    it('should return slade code', () => {
        const orgDetails = { business_partner: 'SLD001' };
        spyOn(service, 'getErpOrganisation').and.returnValue(orgDetails);
        const org = service.getErpOrganisation();
        const sladeCode = service.getSladeCode();
        expect(sladeCode).toEqual(org.business_partner);
    });

    it('should return null when organisation is not available', () => {
        spyOn(service, 'getErpOrganisation').and.returnValue(null);
        const sladeCode = service.getSladeCode();
        expect(sladeCode).toBeNull();
    });

    it('should return org Id', () => {
        const orgId = service.getOrganisationId();
        expect(orgId).toBeDefined();
    });

    it('Empty urlParams', () => {
        spyOn(service, 'setAuthDetails').and.callThrough();
        service.setAuthDetails({}).subscribe(...callbacks);
        service.setAuthDetails({ error: false }).subscribe(...callbacks);
        expect(service.setAuthDetails).toHaveBeenCalled();
    });

    it('revokeToken should return observable', () => {
        spyOn(service, 'revokeToken').and.callThrough();
        service.revokeToken(4).subscribe(
            () => {},
            () => {}
        );
        expect(service.revokeToken).toHaveBeenCalled();
    });

    it('revokeToken should return defined', () => {
        spyOn(_, 'isObject').and.returnValue(true);
        spyOn(service, 'revokeToken').and.callThrough();
        spyOn(service, 'setXHRToken').and.callFake(() => {});
        service.revokeToken({ token_type: 'token_type' }).subscribe(
            () => {},
            () => {}
        );
        expect(service.revokeToken).toHaveBeenCalled();
    });

    it('setUserDetails should set user details', () => {
        spyOn(TestBed.inject(DataLayerUtils), 'urlJoin').and.returnValue('url');
        spyOn(service, 'setUser').and.callFake(() => {});
        spyOn(service, 'setUserDetails').and.callThrough();
        service.setUserDetails({ key: 'jdhur637f' }).subscribe(
            () => {},
            () => {}
        );
        const userReq = httpMock.expectOne('url');
        userReq.flush({ user: 'Vincent' });
        expect(service.setUserDetails).toHaveBeenCalled();
    });

    it('setOrganisationDetails should set user details', () => {
        const url = `${environment.AUTH_SERVER_DOMAIN}/v1/user/me/`;
        spyOn(service, 'setOrganisation').and.callFake(() => {});
        spyOn(service, 'setOrganisationDetails').and.callThrough();
        service.setOrganisationDetails({ key: 'jdhur637f' }).subscribe(
            () => {},
            () => {}
        );
        const userReq = httpMock.expectOne(url);
        userReq.flush({ user: 'Vincent' });
        expect(service.setOrganisationDetails).toHaveBeenCalled();
    });

    it('setAdvantageOrganisationDetails should set user details', () => {
        const url = `${environment.ME}`;
        spyOn(service, 'setAdvantageOrganisationDetails').and.callThrough();
        service.setAdvantageOrganisationDetails({ key: 'jdhur637f' }).subscribe(
            () => {},
            () => {}
        );
        service.setAdvantageOrganisation({});
        service.getAdvantageOrganisation();
        const userReq = httpMock.expectOne(url);
        userReq.flush({ user: 'Vincent' });
        expect(service.setAdvantageOrganisationDetails).toHaveBeenCalled();
    });

    it('setOrganisationDetails should set user details for ERP', () => {
        const url = `${environment.erpServerURL}/me/`;
        spyOn(service, 'setOrganisation').and.callFake(() => {});
        spyOn(service, 'setOrganisationDetails').and.callThrough();
        service.setOrganisationDetails({ key: 'jdhur637f' }, 'erp').subscribe(
            () => {},
            () => {}
        );
        const userReq = httpMock.expectOne(url);
        userReq.flush({ user: 'Vincent' });
        expect(service.setOrganisationDetails).toHaveBeenCalled();
    });

    it('should test resetPassword method', () => {
        spyOn(TestBed.inject(DataLayerUtils), 'urlJoin').and.returnValue('url');
        spyOn(service, 'resetPassword').and.callThrough();
        service.resetPassword('mail@test.com').subscribe(
            () => {},
            () => {}
        );
        const password = httpMock.expectOne('url');
        password.flush({ password: '1234' });
        expect(service.resetPassword).toHaveBeenCalled();
    });

    it('should test changePassword method', () => {
        spyOn(TestBed.inject(DataLayerUtils), 'urlJoin').and.returnValue('url');
        spyOn(service, 'changePassword').and.callThrough();
        service.changePassword({}).subscribe(
            () => {},
            () => {}
        );
        const password = httpMock.expectOne('url');
        password.flush({ password: '1234' });
        expect(service.changePassword).toHaveBeenCalled();
    });

    it('Should create the service', () => {
        service.setXHRToken(testObj);
        service.storeToken({ id: 1 });

        service.setUser({ id: 1 });
        service.isLoggedIn();
        service.logout(true);
        expect(service).toBeTruthy();
    });

    it('should test set user details function', () => {
        service.setAuthDetails({ id: 1 });
        service.changePassword({ user: 'test@domain.com' });
        service.setUserDetails({ id: 1 });
        expect(service.setAuthDetails).toBeTruthy();
    });

    it('should get a valid token', () => {
        const authObject = { expires_at: moment().add(2, 'hours') };
        localStorage.setItem(service.CREDZ_STORE, JSON.stringify(authObject));
        expect(service.getToken()).toBeDefined();
    });

    it('should get stored user from local storage', () => {
        service.storedUser = null;
        const userObject = { email: 'user@email ' };
        localStorage.setItem(service.USER_STORE, JSON.stringify(userObject));
        expect(service.getUser()).toEqual(userObject);
    });

    it('should get organisation user from local storage', () => {
        service.storedOrganisation = null;
        const orgObject = { email: 'user@email ' };
        localStorage.setItem(
            service.ORGANISATION_USER_STORE,
            JSON.stringify(orgObject)
        );
        expect(service.getOrganisation()).toEqual(orgObject);
    });

    it('should get erp organisation user from local storage', () => {
        service.storedOrganisation = null;
        const orgObject = { email: 'user@email ', user_workstations: null };
        localStorage.setItem(
            service.ORGANISATION_USER_ERP_STORE,
            JSON.stringify(orgObject)
        );
        expect(service.getErpOrganisation()).toEqual(orgObject);
    });

    it('should get workstation from localstorage', () => {
        service.storedWorkstation = null;
        const objWorkstation = {
            workstation: '1xskas',
            workstation__name: 'Administration',
            workstation__org_unit__name: 'Main Department',
            workstation__org_unit: '12ac3ba',
            workstation__org_unit__parent__name: 'Main Branch',
            workstation__org_unit__parent: 'ac1455404daf',
        };

        localStorage.setItem(
            service.ORGANISATION_USER_WORKSTATION,
            JSON.stringify(objWorkstation)
        );
        expect(service.getWorkstation()).toEqual(objWorkstation);
    });
    it('should get autoreconsettings from localstorage', () => {
        service.storedWorkstation = null;
        const data = {
            organisation: '111',
        };

        localStorage.setItem(
            service.ORGANISATION_USER_AUTORECON_STORE,
            JSON.stringify(data)
        );
        expect(service.getAutoreconSettings()).toEqual(data);
    });

    it('should get clinical ids from localstorage', () => {
        const ids = {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };

        localStorage.setItem(service.USER_CLINICAL_IDS, JSON.stringify(ids));
        expect(service.getUserClinicalIds()).toEqual(ids);
    });

    it('should test enabledKeycloak getter returns false when feature flag is disabled', () => {
        const featureFlagService = TestBed.inject(InitializeFlagsService);
        spyOn(featureFlagService, 'getForcedValue').and.returnValue(false);
        const result = service.enabledKeycloak;
        expect(featureFlagService.getForcedValue).toHaveBeenCalledWith(
            'prov_authenticationSetKeyCloakToTrue'
        );
        expect(result).toBe(false);
    });

    it('should test enabledKeycloak getter returns true when feature flag is enabled', () => {
        const featureFlagService = TestBed.inject(InitializeFlagsService);
        spyOn(featureFlagService, 'getForcedValue').and.returnValue(true);

        const result = service.enabledKeycloak;

        expect(featureFlagService.getForcedValue).toHaveBeenCalledWith(
            'prov_authenticationSetKeyCloakToTrue'
        );
        expect(result).toBe(true);
    });

    it('should logout using SIL AuthServer and clear data on success', done => {
        const featureFlagService = TestBed.inject(FeatureFlagService);
        spyOn(featureFlagService, 'isFeatureOn').and.returnValue(false);

        const mockToken = { access_token: 'test-token', token_type: 'Bearer' };
        spyOn(service, 'getToken').and.returnValue(mockToken);
        spyOn(service, 'revokeToken').and.returnValue(of({ success: true }));
        spyOn(service, 'removeTokenData');

        service.logout().subscribe({
            next: result => {
                expect(service.revokeToken).toHaveBeenCalledWith(mockToken);
                expect(result).toEqual({ success: true });
            },
            error: err => {
                fail('Should not have errored: ' + err);
                done();
            },
            complete: () => {
                // finalize runs after complete, so check in a setTimeout
                setTimeout(() => {
                    expect(service.removeTokenData).toHaveBeenCalled();
                    done();
                }, 0);
            },
        });
    });

    it('should logout using SIL AuthServer and clear data on error', done => {
        const featureFlagService = TestBed.inject(FeatureFlagService);
        spyOn(featureFlagService, 'isFeatureOn').and.returnValue(false);

        const mockToken = { access_token: 'test-token', token_type: 'Bearer' };
        const mockError = new Error('Logout failed');
        spyOn(service, 'getToken').and.returnValue(mockToken);
        spyOn(service, 'revokeToken').and.returnValue(
            new Observable(observer => observer.error(mockError))
        );
        spyOn(service, 'removeTokenData');

        service.logout().subscribe({
            next: () => {
                fail('Should have errored');
                done();
            },
            error: err => {
                expect(service.revokeToken).toHaveBeenCalledWith(mockToken);
                expect(err).toBe(mockError);
                // finalize runs after error, so check in a setTimeout
                setTimeout(() => {
                    expect(service.removeTokenData).toHaveBeenCalled();
                    done();
                }, 0);
            },
        });
    });

    it('should logout using Keycloak and clear data on success', done => {
        const initializeFlagsService = TestBed.inject(InitializeFlagsService);
        spyOn(initializeFlagsService, 'getForcedValue').and.returnValue(true);

        const keycloakService = TestBed.inject(SilKeycloakService);
        spyOn(keycloakService, 'logout').and.returnValue(Promise.resolve());
        spyOn(service, 'removeTokenData');

        service.logout().subscribe({
            next: result => {
                expect(keycloakService.logout).toHaveBeenCalled();
                expect(result).toBeUndefined();
            },
            error: err => {
                fail('Should not have errored: ' + err);
                done();
            },
            complete: () => {
                // finalize runs after complete, so check in a setTimeout
                setTimeout(() => {
                    expect(service.removeTokenData).toHaveBeenCalled();
                    done();
                }, 0);
            },
        });
    });

    it('should logout using Keycloak and clear data on error', done => {
        const initializeFlagsService = TestBed.inject(InitializeFlagsService);
        spyOn(initializeFlagsService, 'getForcedValue').and.returnValue(true);

        const keycloakService = TestBed.inject(SilKeycloakService);
        const mockError = new Error('Keycloak logout failed');
        spyOn(keycloakService, 'logout').and.returnValue(
            Promise.reject(mockError)
        );
        spyOn(service, 'removeTokenData');

        service.logout().subscribe({
            next: () => {
                fail('Should have errored');
                done();
            },
            error: err => {
                expect(keycloakService.logout).toHaveBeenCalled();
                expect(err).toBe(mockError);
                // finalize runs after error, so check in a setTimeout
                setTimeout(() => {
                    expect(service.removeTokenData).toHaveBeenCalled();
                    done();
                }, 0);
            },
        });
    });

    it('should delete STATE_STORE when logout is called without timeout flag', done => {
        const featureFlagService = TestBed.inject(FeatureFlagService);
        spyOn(featureFlagService, 'isFeatureOn').and.returnValue(false);

        const cookieService = TestBed.inject(Cookies);
        spyOn(cookieService, 'delete');

        const mockToken = { access_token: 'test-token', token_type: 'Bearer' };
        spyOn(service, 'getToken').and.returnValue(mockToken);
        spyOn(service, 'revokeToken').and.returnValue(of({ success: true }));
        spyOn(service, 'removeTokenData');

        service.logout(false).subscribe({
            next: () => {
                expect(cookieService.delete).toHaveBeenCalledWith(
                    service.STATE_STORE
                );
                done();
            },
            error: err => {
                fail('Should not have errored: ' + err);
                done();
            },
        });
    });

    it('should not delete STATE_STORE when logout is called with timeout flag', done => {
        const featureFlagService = TestBed.inject(FeatureFlagService);
        spyOn(featureFlagService, 'isFeatureOn').and.returnValue(false);

        const cookieService = TestBed.inject(Cookies);
        spyOn(cookieService, 'delete');

        const mockToken = { access_token: 'test-token', token_type: 'Bearer' };
        spyOn(service, 'getToken').and.returnValue(mockToken);
        spyOn(service, 'revokeToken').and.returnValue(of({ success: true }));
        spyOn(service, 'removeTokenData');

        service.logout(true).subscribe({
            next: () => {
                // Should not have called delete for STATE_STORE when isTimeout is true
                const deleteCalls = (
                    cookieService.delete as jasmine.Spy
                ).calls.all();
                const stateStoreCalls = deleteCalls.filter(
                    call => call.args[0] === service.STATE_STORE
                );
                expect(stateStoreCalls.length).toBe(0);
                done();
            },
            error: err => {
                fail('Should not have errored: ' + err);
                done();
            },
        });
    });
});

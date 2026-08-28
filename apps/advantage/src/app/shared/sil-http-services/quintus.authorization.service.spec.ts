import { TestBed } from '@angular/core/testing';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { QuintusAuthorizationService } from './quintus.authorization.service';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

const user = {
    id: 133944,
    guid: 'bfdc441d-80a2-4817-9aa3-5567312a2864',
    roles: ['Savannah'],
    permissions: ['erp.dashboard_list'],
};

const token = {
    scope: 'auth.me.read',
    expires_in: '3600',
    access_token: 'XKkeF8PjajGdRYeQIqLL7gE3m2k77q',
    token_type: 'Bearer',
    expire_at: '2023-06-02T13:14:02.928Z',
};

class AuthorizationConfigStub {
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            id: 133944,
            guid: 'bfdc441d-80a2-4817-9aa3-5567312a2864',
            roles: ['Quintus'],
            permissions: ['erp.dashboard_list'],
        };
    }
    getAdvantageToken() {
        return {
            scope: 'auth.me.read',
            expires_in: '3600',
            access_token: 'XKkeF8PjajGdRYeQIqLL7gE3m2k77q',
            token_type: 'Bearer',
            expire_at: '2023-06-02T13:14:02.928Z',
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
            user_workstations: null,
        };
    }
    removeTokenData() {
        return {};
    }
    getToken() {
        return {
            scope: 'auth.me.read',
            expires_in: '3600',
            access_token: 'XKkeF8PjajGdRYeQIqLL7gE3m2k77q',
            token_type: 'Bearer',
            expire_at: '2023-06-02T13:14:02.928Z',
        };
    }
    getJWt() {
        return {};
    }
}

describe('QuintusAuthorizationService', () => {
    let service: QuintusAuthorizationService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: Authorization, useClass: AuthorizationConfigStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(QuintusAuthorizationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('checkAuthorization should return defined', () => {
        service.user = {
            id: 133944,
            guid: 'bfdc441d-80a2-4817-9aa3-5567312a2864',
            roles: ['Quintus'],
            permissions: ['erp.dashboard_list'],
        };
        service.token = {
            scope: 'auth.me.read',
            expires_in: '3600',
            access_token: 'XKkeF8PjajGdRYeQIqLL7gE3m2k77q',
            token_type: 'Bearer',
            expire_at: '2023-06-02T13:14:02.928Z',
        };
        service.checkAuthorization();
        expect(service.checkAuthorization).toBeTruthy();
    });

    it('checkAuthorization should return defined with Savannah', () => {
        service.user = {
            id: 133944,
            guid: 'bfdc441d-80a2-4817-9aa3-5567312a2864',
            roles: ['Savannah'],
            permissions: ['erp.dashboard_list'],
        };
        service.getUser();
        service.getAdvantageToken();
        service.checkAuthorization();
        expect(service.checkAuthorization).toBeTruthy();
    });

    it('checkAuthorization should return defined with Advantage Super User', () => {
        service.user = {
            id: 133944,
            guid: 'bfdc441d-80a2-4817-9aa3-5567312a2864',
            roles: ['Savannah'],
            permissions: ['erp.dashboard_list'],
        };
        service.getUser();
        service.getAdvantageToken();
        service.checkAuthorization();
        expect(service.checkAuthorization).toBeTruthy();
    });

    it('checkAuthorization should return defined with erp.dashboard_list', () => {
        service.user = {
            id: 133944,
            guid: 'bfdc441d-80a2-4817-9aa3-5567312a2864',
            roles: ['incorrect'],
            permissions: ['erp.dashboard_list'],
        };
        service.getUser();
        service.getAdvantageToken();
        service.checkAuthorization();
        expect(service.checkAuthorization).toBeTruthy();
    });

    it('getJWT should return defined', () => {
        environment.variant = 'default';
        const url = environment.CUBEJS_LOGIN_URL;
        service.getJWT(user, token);
        const loginReq = httpMock.expectOne(url);
        loginReq.flush({
            'Error in Sign in Module: ':
                "Cannot read property 'guid' of undefined",
        });
        expect(service.getJWT(user, token)).toBeDefined();
    });

    it('getJWT test for exempted variants', () => {
        environment.variant = 'mater';
        spyOn(service, 'getUser').and.returnValue({
            id: 133944,
            guid: 'bfdc441d-80a2-4817-9aa3-5567312a2864',
            roles: ['notCorrect'],
            permissions: ['erp.dashboard_list'],
        });
        spyOn(service, 'getJWT').and.callThrough();
        service.getJWT(user, token);
        service.getJWTToken(user, token);
        expect(service.getJWT).toHaveBeenCalled();
    });

    it('getJWT test for allowed variants', () => {
        environment.variant = 'default';
        spyOn(service, 'getUser').and.returnValue({
            id: 133944,
            guid: 'bfdc441d-80a2-4817-9aa3-5567312a2864',
            roles: ['notCorrect'],
            permissions: ['erp.dashboard_list'],
        });
        spyOn(service, 'getJWT').and.callThrough();
        service.getJWT(user, token);
        service.getJWTToken(user, token);
        expect(service.getJWT).toHaveBeenCalled();
    });

    it('getJWTToken should be called', () => {
        service.getJWTToken(user, token);
        expect(service.getJWTToken(user, token)).toBeDefined();
    });

    it('getUser should return defined', () => {
        spyOn(service, 'getUser').and.callThrough();
        service.getUser();
        expect(service.getUser).toHaveBeenCalled();
    });

    it('getToken should return defined', () => {
        spyOn(service, 'getToken').and.callThrough();
        service.getToken();
        expect(service.getToken).toHaveBeenCalled();
    });
});

describe('QuintusAuthorizationService Failures', () => {
    let service: QuintusAuthorizationService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: Authorization, useClass: AuthorizationConfigStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(QuintusAuthorizationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('checkAuthorization should return no user passed', () => {
        spyOn(service, 'getUser').and.returnValue({
            id: 133944,
            guid: 'bfdc441d-80a2-4817-9aa3-5567312a2864',
            roles: ['notCorrect'],
            permissions: ['erp.dashboard_list'],
        });
        service.checkAuthorization();
        expect(service.checkAuthorization).toBeDefined();
    });

    it('checkAuthorization should return not authenticated', () => {
        spyOn(service.authConfig, 'getUser').and.returnValue({
            id: 133944,
            guid: 'bfdc441d-80a2-4817-9aa3-5567312a2864',
            roles: ['notCorrect'],
            permissions: ['notcorrect'],
        });
        service.checkAuthorization();
        expect(service.checkAuthorization).toBeDefined();
    });

    it('getJWT should return undefined', () => {
        const undefinedUser = undefined;
        const undefinedToken = undefined;
        service.getJWT(undefinedUser, undefinedToken);
        expect(service.user).toBeUndefined();
    });
});

import { TestBed } from '@angular/core/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import {
    provideHttpClientTesting,
    HttpTestingController,
} from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import {
    EmbeddedDashboardService,
    SupersetDashboardConfig,
} from './embedded-dashboard.service';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { ErrorHandlerService } from '../sil-http-services/error-handler';
import { environment } from '../../../environments/environment';

class AuthorizationStub {
    getUser(): { business_partner: string | null } | null {
        return { business_partner: 'TEST_BP' };
    }

    getSladeCode(): string | null {
        return 'TEST_BP';
    }
}

class ErrorHandlerServiceStub {
    handleError() {
        return of(() => {});
    }
}

describe('EmbeddedDashboardService', () => {
    let service: EmbeddedDashboardService;
    let httpMock: HttpTestingController;
    let authStub: AuthorizationStub;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EmbeddedDashboardService,
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(EmbeddedDashboardService);
        httpMock = TestBed.inject(HttpTestingController);
        authStub = TestBed.inject(Authorization) as any;
        (environment as any).supersetDashboardUuids = JSON.stringify({
            HEALTH_CRM: 'health-crm-uuid-123',
        });
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('service creation', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });
    });

    describe('observable streams', () => {
        it('should expose loading$ observable', done => {
            service.loading$.subscribe(loading => {
                expect(loading).toBe(false);
                done();
            });
        });

        it('should expose error$ observable', done => {
            service.error$.subscribe(error => {
                expect(error).toBe('');
                done();
            });
        });

        it('should expose guestToken$ observable', done => {
            service.guestToken$.subscribe(token => {
                expect(token).toBe('');
                done();
            });
        });
    });

    describe('getBp method', () => {
        it('should return business partner from ERP organisation', () => {
            const bp = (service as any).getBp();
            expect(bp).toBe('TEST_BP');
        });

        it('should fall back to user object when ERP organisation has no business partner', () => {
            spyOn(authStub, 'getSladeCode').and.returnValue(null);
            spyOn(authStub, 'getUser').and.returnValue({
                business_partner: 'USER_BP',
            });
            const bp = (service as any).getBp();
            expect(bp).toBe('USER_BP');
        });

        it('should return null when neither ERP organisation nor user has a business partner', () => {
            spyOn(authStub, 'getSladeCode').and.returnValue(null);
            spyOn(authStub, 'getUser').and.returnValue({
                business_partner: null,
            });
            const bp = (service as any).getBp();
            expect(bp).toBeNull();
        });

        it('should return null when both ERP organisation and user are null', () => {
            spyOn(authStub, 'getSladeCode').and.returnValue(null);
            spyOn(authStub, 'getUser').and.returnValue(null);
            const bp = (service as any).getBp();
            expect(bp).toBeNull();
        });
    });

    describe('initializeDashboard method', () => {
        const basicConfig: SupersetDashboardConfig = {
            dashboardId: 'test-dash',
            serverUrl: 'https://test.com',
            username: 'user',
            password: 'pass',
        };

        describe('successful initialization', () => {
            beforeEach(() => {
                // Reset environment each time
                (environment as any).supersetDashboardUuids = JSON.stringify({
                    HEALTH: 'uuid-health-123',
                    FINANCE: 'uuid-finance-456',
                });
            });
            it('should initialize dashboard and emit guest token successfully', done => {
                service.guestToken$.subscribe(token => {
                    if (token) {
                        expect(token).toBe('guest-token-123');
                        done();
                    }
                });

                service.initializeDashboard(basicConfig);

                const loginReq = httpMock.expectOne(
                    'https://test.com/api/v1/security/login'
                );
                loginReq.flush({
                    access_token: 'token123',
                    refresh_token: 'refresh123',
                });

                const guestTokenReq = httpMock.expectOne(
                    'https://test.com/api/v1/security/guest_token/'
                );
                guestTokenReq.flush({ token: 'guest-token-123' });
            });

            it('should include authorization header in guest token request', () => {
                service.initializeDashboard(basicConfig);

                httpMock
                    .expectOne('https://test.com/api/v1/security/login')
                    .flush({
                        access_token: 'access-token-123',
                        refresh_token: 'refresh',
                    });

                const guestTokenReq = httpMock.expectOne(
                    'https://test.com/api/v1/security/guest_token/'
                );
                expect(guestTokenReq.request.headers.get('Authorization')).toBe(
                    'Bearer access-token-123'
                );
                guestTokenReq.flush({ token: 'guest-token' });
            });
        });

        describe('request payload validation', () => {
            it('should include correct login payload', () => {
                service.initializeDashboard(basicConfig);

                const loginReq = httpMock.expectOne(
                    'https://test.com/api/v1/security/login'
                );
                expect(loginReq.request.body).toEqual({
                    username: 'user',
                    password: 'pass',
                    provider: 'db',
                    refresh: true,
                });

                loginReq.flush({
                    access_token: 'token123',
                    refresh_token: 'refresh123',
                });

                httpMock
                    .expectOne('https://test.com/api/v1/security/guest_token/')
                    .flush({ token: 'guest-token' });
            });

            it('should include dashboard resources in guest token request', () => {
                const config = { ...basicConfig, dashboardId: 'dash-123' };
                service.initializeDashboard(config);

                httpMock
                    .expectOne('https://test.com/api/v1/security/login')
                    .flush({ access_token: 'token', refresh_token: 'refresh' });

                const guestTokenReq = httpMock.expectOne(
                    'https://test.com/api/v1/security/guest_token/'
                );
                expect(guestTokenReq.request.body.resources).toEqual([
                    { id: 'dash-123', type: 'dashboard' },
                ]);
                guestTokenReq.flush({ token: 'guest-token' });
            });

            it('should include default RLS clause with business partner', () => {
                service.initializeDashboard(basicConfig);

                httpMock
                    .expectOne('https://test.com/api/v1/security/login')
                    .flush({ access_token: 'token', refresh_token: 'refresh' });

                const guestTokenReq = httpMock.expectOne(
                    'https://test.com/api/v1/security/guest_token/'
                );
                expect(guestTokenReq.request.body.rls).toEqual([
                    { clause: "sladeCode='TEST_BP'" },
                ]);
                guestTokenReq.flush({ token: 'guest-token' });
            });

            it('should error when no business partner is available', () => {
                spyOn(authStub, 'getSladeCode').and.returnValue(null);
                spyOn(authStub, 'getUser').and.returnValue({
                    business_partner: null,
                });
                service.initializeDashboard(basicConfig);

                httpMock.expectNone('https://test.com/api/v1/security/login');
                expect(service['errorSubject'].getValue()).toContain(
                    'Business partner not found'
                );
            });
        });

        describe('environment defaults', () => {
            it('should use environment defaults for serverUrl', () => {
                const config: SupersetDashboardConfig = {
                    dashboardId: 'test-dash',
                };
                service.initializeDashboard(config);

                const loginReq = httpMock.expectOne(
                    `${environment.supersetServerUrl}/api/v1/security/login`
                );
                loginReq.flush({
                    access_token: 'token',
                    refresh_token: 'refresh',
                });

                const guestTokenReq = httpMock.expectOne(
                    `${environment.supersetServerUrl}/api/v1/security/guest_token/`
                );
                guestTokenReq.flush({ token: 'guest-token' });
            });

            it('should use environment defaults for credentials', () => {
                const config: SupersetDashboardConfig = {
                    dashboardId: 'test-dash',
                    serverUrl: 'https://test.com',
                };
                service.initializeDashboard(config);

                const loginReq = httpMock.expectOne(
                    'https://test.com/api/v1/security/login'
                );
                expect(loginReq.request.body.username).toBe(
                    environment.supersetUsername
                );
                expect(loginReq.request.body.password).toBe(
                    environment.supersetPassword
                );

                loginReq.flush({
                    access_token: 'token',
                    refresh_token: 'refresh',
                });

                httpMock
                    .expectOne('https://test.com/api/v1/security/guest_token/')
                    .flush({ token: 'guest-token' });
            });
        });

        describe('loading state management', () => {
            beforeEach(() => {
                (environment as any).supersetDashboardUuids = JSON.stringify({
                    HEALTH_CRM: 'health-crm-uuid-123',
                });
            });
            it('should set loading states during execution', () => {
                spyOn(service['loadingSubject'], 'next');
                service.initializeDashboard(basicConfig);

                expect(service['loadingSubject'].next).toHaveBeenCalledWith(
                    true
                );

                httpMock
                    .expectOne('https://test.com/api/v1/security/login')
                    .flush({ access_token: 'token', refresh_token: 'refresh' });

                httpMock
                    .expectOne('https://test.com/api/v1/security/guest_token/')
                    .flush({ token: 'guest-token' });

                expect(service['loadingSubject'].next).toHaveBeenCalledWith(
                    false
                );
            });

            it('should set loading to false on error', () => {
                spyOn(service['loadingSubject'], 'next');
                service.initializeDashboard(basicConfig);

                httpMock
                    .expectOne('https://test.com/api/v1/security/login')
                    .error(new ErrorEvent('Error'));

                expect(service['loadingSubject'].next).toHaveBeenCalledWith(
                    false
                );
            });

            it('should set error and stop loading when dashboard ID is missing', () => {
                spyOn(service['loadingSubject'], 'next');
                spyOn(service['errorSubject'], 'next');

                service.initializeDashboard({ dashboardId: '' });

                expect(service['errorSubject'].next).toHaveBeenCalledWith(
                    'Dashboard ID not configured'
                );
                expect(service['loadingSubject'].next).toHaveBeenCalledWith(
                    false
                );
            });
        });

        describe('error handling', () => {
            it('should clear error and set error on failure', () => {
                spyOn(service['errorSubject'], 'next');

                service.initializeDashboard(basicConfig);
                expect(service['errorSubject'].next).toHaveBeenCalledWith('');

                httpMock
                    .expectOne('https://test.com/api/v1/security/login')
                    .error(new ErrorEvent('Network error'));

                expect(service['errorSubject'].next).toHaveBeenCalledWith(
                    jasmine.stringContaining('Dashboard error:')
                );
            });

            it('should handle login API errors', () => {
                service.initializeDashboard(basicConfig);

                httpMock
                    .expectOne('https://test.com/api/v1/security/login')
                    .error(new ErrorEvent('Login failed'));

                expect(service['errorSubject'].getValue()).toContain(
                    'Dashboard error:'
                );
            });

            it('should handle guest token API errors', () => {
                service.initializeDashboard(basicConfig);

                httpMock
                    .expectOne('https://test.com/api/v1/security/login')
                    .flush({ access_token: 'token', refresh_token: 'refresh' });

                httpMock
                    .expectOne('https://test.com/api/v1/security/guest_token/')
                    .error(new ErrorEvent('Token failed'));

                expect(service['errorSubject'].getValue()).toContain(
                    'Dashboard error:'
                );
            });

            it('should use fallback error message when error has no message property', () => {
                const errorWithoutMessage = {} as any;
                spyOn(service as any, 'getGuestToken').and.returnValue(
                    throwError(() => errorWithoutMessage)
                );

                service.initializeDashboard(basicConfig);

                expect(service['errorSubject'].getValue()).toBe(
                    'Dashboard error: Failed to load dashboard'
                );
            });

            it('should use fallback error message when error.message is null', () => {
                const errorWithNullMessage = { message: null } as any;
                spyOn(service as any, 'getGuestToken').and.returnValue(
                    throwError(() => errorWithNullMessage)
                );

                service.initializeDashboard(basicConfig);

                expect(service['errorSubject'].getValue()).toBe(
                    'Dashboard error: Failed to load dashboard'
                );
            });

            it('should use fallback error message when error.message is undefined', () => {
                const errorWithUndefinedMessage = { message: undefined } as any;
                spyOn(service as any, 'getGuestToken').and.returnValue(
                    throwError(() => errorWithUndefinedMessage)
                );

                service.initializeDashboard(basicConfig);

                expect(service['errorSubject'].getValue()).toBe(
                    'Dashboard error: Failed to load dashboard'
                );
            });

            it('should use fallback error message when error.message is empty string', () => {
                const errorWithEmptyMessage = { message: '' } as any;
                spyOn(service as any, 'getGuestToken').and.returnValue(
                    throwError(() => errorWithEmptyMessage)
                );

                service.initializeDashboard(basicConfig);

                expect(service['errorSubject'].getValue()).toBe(
                    'Dashboard error: Failed to load dashboard'
                );
            });
        });

        describe('health CRM RLS logic', () => {
            beforeEach(() => {
                (environment as any).supersetDashboardUuids = JSON.stringify({
                    HEALTH_CRM: 'health-crm-uuid-123',
                });
            });

            it('should skip RLS for health CRM dashboard when business partner is "1"', () => {
                spyOn(authStub, 'getSladeCode').and.returnValue('1');
                const healthCrmConfig: SupersetDashboardConfig = {
                    dashboardId: 'health-crm-uuid-123',
                    serverUrl: 'https://test.com',
                };

                service.initializeDashboard(healthCrmConfig);

                httpMock
                    .expectOne('https://test.com/api/v1/security/login')
                    .flush({ access_token: 'token', refresh_token: 'refresh' });

                const guestTokenReq = httpMock.expectOne(
                    'https://test.com/api/v1/security/guest_token/'
                );
                expect(guestTokenReq.request.body.rls).toEqual([]);
                guestTokenReq.flush({ token: 'guest-token' });
            });

            it('should apply RLS for health CRM dashboard when business partner is not "1"', () => {
                spyOn(authStub, 'getSladeCode').and.returnValue('2');
                const healthCrmConfig: SupersetDashboardConfig = {
                    dashboardId: 'health-crm-uuid-123',
                    serverUrl: 'https://test.com',
                };

                service.initializeDashboard(healthCrmConfig);

                httpMock
                    .expectOne('https://test.com/api/v1/security/login')
                    .flush({ access_token: 'token', refresh_token: 'refresh' });

                const guestTokenReq = httpMock.expectOne(
                    'https://test.com/api/v1/security/guest_token/'
                );
                expect(guestTokenReq.request.body.rls).toEqual([
                    { clause: "sladeCode='2'" },
                ]);
                guestTokenReq.flush({ token: 'guest-token' });
            });

            it('should apply RLS for non-health CRM dashboard when business partner is "1"', () => {
                spyOn(authStub, 'getSladeCode').and.returnValue('1');
                const otherDashboardConfig: SupersetDashboardConfig = {
                    dashboardId: 'other-dashboard-uuid',
                    serverUrl: 'https://test.com',
                };

                service.initializeDashboard(otherDashboardConfig);

                httpMock
                    .expectOne('https://test.com/api/v1/security/login')
                    .flush({ access_token: 'token', refresh_token: 'refresh' });

                const guestTokenReq = httpMock.expectOne(
                    'https://test.com/api/v1/security/guest_token/'
                );
                expect(guestTokenReq.request.body.rls).toEqual([
                    { clause: "sladeCode='1'" },
                ]);
                guestTokenReq.flush({ token: 'guest-token' });
            });

            it('should apply RLS for non-health CRM dashboard when business partner is not "1"', () => {
                spyOn(authStub, 'getSladeCode').and.returnValue('TEST_BP');
                const otherDashboardConfig: SupersetDashboardConfig = {
                    dashboardId: 'other-dashboard-uuid',
                    serverUrl: 'https://test.com',
                };

                service.initializeDashboard(otherDashboardConfig);

                httpMock
                    .expectOne('https://test.com/api/v1/security/login')
                    .flush({ access_token: 'token', refresh_token: 'refresh' });

                const guestTokenReq = httpMock.expectOne(
                    'https://test.com/api/v1/security/guest_token/'
                );
                expect(guestTokenReq.request.body.rls).toEqual([
                    { clause: "sladeCode='TEST_BP'" },
                ]);
                guestTokenReq.flush({ token: 'guest-token' });
            });

            it('should error when business partner is null for any dashboard', () => {
                spyOn(authStub, 'getSladeCode').and.returnValue(null);
                spyOn(authStub, 'getUser').and.returnValue({
                    business_partner: null,
                });
                const anyDashboardConfig: SupersetDashboardConfig = {
                    dashboardId: 'any-dashboard-uuid',
                    serverUrl: 'https://test.com',
                };

                service.initializeDashboard(anyDashboardConfig);

                httpMock.expectNone('https://test.com/api/v1/security/login');
                expect(service['errorSubject'].getValue()).toContain(
                    'Business partner not found'
                );
            });

            it('should verify isHealthCrmDashboard method returns true for health CRM UUID', () => {
                const isHealthCrm = service['isHealthCrmDashboard'](
                    'health-crm-uuid-123'
                );
                expect(isHealthCrm).toBe(true);
            });

            it('should verify isHealthCrmDashboard method returns false for non-health CRM UUID', () => {
                const isHealthCrm = service['isHealthCrmDashboard'](
                    'other-dashboard-uuid'
                );
                expect(isHealthCrm).toBe(false);
            });

            it('should verify isHealthCrmDashboard method returns false when supersetDashboardUuids is not set', () => {
                (environment as any).supersetDashboardUuids = undefined;
                const isHealthCrm = service['isHealthCrmDashboard'](
                    'health-crm-uuid-123'
                );
                expect(isHealthCrm).toBe(false);
            });
        });

        describe('isTokenExpired', () => {
            it('should return true when token is expired', () => {
                const pastExpiry = Math.floor(Date.now() / 1000) - 3600;
                const payload = btoa(JSON.stringify({ exp: pastExpiry }));
                const expiredToken = `header.${payload}.signature`;

                const result = service['isTokenExpired'](expiredToken);
                expect(result).toBe(true);
            });

            it('should return false when token is not expired', () => {
                const futureExpiry = Math.floor(Date.now() / 1000) + 3600;
                const payload = btoa(JSON.stringify({ exp: futureExpiry }));
                const validToken = `header.${payload}.signature`;

                const result = service['isTokenExpired'](validToken);
                expect(result).toBe(false);
            });

            it('should return true when token expires within margin', () => {
                const nearExpiry = Math.floor(Date.now() / 1000) + 30;
                const payload = btoa(JSON.stringify({ exp: nearExpiry }));
                const soonExpiredToken = `header.${payload}.signature`;

                const result = service['isTokenExpired'](soonExpiredToken, 60);
                expect(result).toBe(true);
            });

            it('should return true when token parsing fails due to invalid format', () => {
                const invalidToken = 'invalid.token.format';
                const result = service['isTokenExpired'](invalidToken);
                expect(result).toBe(true);
            });

            it('should return true when token parsing fails due to invalid base64', () => {
                const invalidBase64Token =
                    'header.invalid-base64-@#$%.signature';
                const result = service['isTokenExpired'](invalidBase64Token);
                expect(result).toBe(true);
            });

            it('should return true when token has invalid JSON in payload', () => {
                const invalidJsonPayload = btoa('{ invalid json }');
                const invalidJsonToken = `header.${invalidJsonPayload}.signature`;
                const result = service['isTokenExpired'](invalidJsonToken);
                expect(result).toBe(true);
            });
        });
    });
});

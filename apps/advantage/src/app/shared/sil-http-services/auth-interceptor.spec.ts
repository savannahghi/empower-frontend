import { AuthInterceptor } from './auth-interceptor';
import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { Authorization } from '../../@core/auth/services/authorization.service';
import {
    HttpErrorResponse,
    HttpRequest,
    HttpHandler,
    HTTP_INTERCEPTORS,
    HttpClient,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { StateService } from '@uirouter/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FeatureFlagService } from 'app/@core/utils/feature.service';
import { SilKeycloakService } from '../sil-keycloak/keycloak.service';
import { InitializeFlagsService } from 'app/@core/utils/initialize-flags.service';

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    includes() {
        return false;
    }
    go() {
        return true;
    }
}

class AuthorizationConfigStub {
    getToken() {
        return {};
    }
    getUser() {
        return {};
    }
    getOrganisation() {
        return true;
    }
    getSladeCode() {
        return 'ORG123';
    }
    isLoggedIn() {
        return true;
    }
    logout() {
        return;
    }
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

class HttpHandlerStub {
    handle() {
        return of({});
    }
}

const subcribe = {
    subscribe: () => {
        return {};
    },
};

const obj = {
    onClose: subcribe,
};

const nbDialogServiceStub = {
    open() {
        return obj;
    },
};

class SilKeycloakServiceStub {
    getToken() {
        return true;
    }
    isLoggedIn(): Promise<boolean> {
        return Promise.resolve(true);
    }
    getAuthHeader(): Promise<string> {
        return Promise.resolve('Bearer valid-token');
    }
    logout(): Promise<void> {
        return Promise.resolve();
    }
}

describe('AuthInterceptor', () => {
    let service: AuthInterceptor;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };
    let httpMock: HttpTestingController;
    let httpHandler: HttpHandler;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [
                AuthInterceptor,
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                {
                    provide: InitializeFlagsService,
                    useClass: InitializeFlagsServiceStub,
                },
                { provide: Router, useValue: routerSpy },
                { provide: NbDialogService, useValue: nbDialogServiceStub },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true,
                },
                { provide: HttpHandler, useClass: HttpHandlerStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AuthInterceptor);
        httpMock = TestBed.inject(HttpTestingController);
        httpHandler = TestBed.inject(HttpHandler);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it(
        'should test handleError method: 401',
        <any>fakeAsync(() => {
            spyOn(service.toastServ, 'show').and.callThrough();
            service.handleError(
                new HttpErrorResponse({ status: 401, error: { detail: '' } })
            );
            tick(9001);
            service.toggleDialog();
            expect(service).toBeTruthy();
        })
    );

    it(
        'should test handleError method: not 401',
        <any>fakeAsync(() => {
            spyOn(service.toastServ, 'show').and.callThrough();
            service.handleError(
                new HttpErrorResponse({ status: 500, error: { detail: '' } })
            );
            service.returnError(
                new HttpErrorResponse({ status: 500, error: { detail: '' } })
            );
            service.filterResponseFxn('sa');
            service.mapResponseFxn('sa');
            tick(9001);
            expect(service).toBeTruthy();
        })
    );

    it('should return an error observable', done => {
        const mockError = new Error('Test Error');

        service.returnError(mockError).subscribe({
            next: () => fail('Expected an error, but got success response'),
            error: err => {
                expect(err).toBe(mockError); // Assert error is the same
                done(); // Ensure async test completes
            },
        });
    });

    it('should test intercept method | creds not defined', inject(
        [HttpClient],
        () => {
            spyOn(service, 'intercept').and.callThrough();
            service.CREDZ_STORE = undefined;
            const request = new HttpRequest('GET', '/');
            const next = httpHandler;
            service.intercept(request, next);
            expect(service.intercept).toHaveBeenCalled();
        }
    ));

    it('should test intercept method | keycloak logged in', inject(
        [HttpClient],
        () => {
            spyOn(service, 'intercept').and.callThrough();
            service.CREDZ_STORE = undefined;
            const request = new HttpRequest('GET', '/api/patients');
            const next = httpHandler;
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(true)
            );
            service.intercept(request, next);
            expect(service.intercept).toHaveBeenCalled();
        }
    ));

    it('should test intercept method when there is an api call but not logged in', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: () =>
                    Observable.create(subscriber => {
                        subscriber.complete();
                    }),
            };
            service.CREDZ_STORE = 'auth.config.credz';
            const request = new HttpRequest('GET', '/api/');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(true)
            );
            spyOn(service.keycloak, 'getAuthHeader').and.returnValue(
                Promise.resolve('Bearer 1')
            );
            localStorage.setItem('auth.config.credz', JSON.stringify({}));
            service.handleResponse();
            tick(9001);
            spyOn(service, 'intercept').and.callThrough();
            localStorage.removeItem('auth.config.credz');
            service.intercept(request, next).subscribe({
                next: next,
                error: (error: HttpErrorResponse) => {
                    expect(error.status).toBeUndefined();
                },
            });
            expect(service.intercept).toHaveBeenCalled();
        })
    ));

    it('should test intercept method', inject([HttpClient], () => {
        spyOn(service, 'intercept').and.callThrough();
        service.CREDZ_STORE = 'auth.config.credz';
        localStorage.setItem(
            'auth.config.credz',
            JSON.stringify({ token_type: '1', access_token: '1' })
        );
        const request = new HttpRequest('GET', '/');
        const next = httpHandler;
        service.intercept(request, next);
        service.errorHandler({});
        expect(service.intercept).toHaveBeenCalled();
    }));

    it('should test enableLoginPopup getter', () => {
        service.variant = 'empower';
        expect(service.enableLoginPopup).toBe(false);
    });

    it('should test popupLoginComponent method', () => {
        const dialogService = TestBed.inject(NbDialogService);
        spyOn(dialogService, 'open').and.callThrough();
        service.popupLoginComponent();
        expect(service.isLoginDialogOpen).toBe(true);
        expect(dialogService.open).toHaveBeenCalled();
    });

    it('should redirect to login page when enableLoginPopup is false and 401 error occurs', fakeAsync(() => {
        const enabledKeycloak = spyOnProperty(
            service,
            'enabledKeycloak',
            'get'
        ).and.returnValue(false);
        Object.defineProperty(service, 'enableLoginPopup', {
            get: () => false,
        });
        const stateSpy = spyOn(service.$state, 'go');
        service.handleError(
            new HttpErrorResponse({
                status: 401,
                error: { detail: 'Unauthorized' },
            })
        );
        tick(3001);
        if (!enabledKeycloak) {
            expect(stateSpy).toHaveBeenCalledWith(
                'auth.login',
                { is_expired: true },
                { reload: true }
            );
        }
    }));

    it('should test enabled login popup for 401 error when keycloak disabled', fakeAsync(() => {
        spyOnProperty(service, 'enabledKeycloak', 'get').and.returnValue(false);
        spyOn(service, 'popupLoginComponent');
        Object.defineProperty(service, 'enableLoginPopup', {
            get: () => true,
        });
        spyOn(service.authConfig, 'isLoggedIn').and.throwError('Error');
        service.handle401Action();
        tick(3001);
        expect(service.popupLoginComponent).toHaveBeenCalled();
    }));

    it('should test enabledKeycloak getter', () => {
        const flagService = TestBed.inject(InitializeFlagsService);
        spyOn(flagService, 'getForcedValue').and.returnValue(true);
        const result = service.enabledKeycloak;
        expect(result).toBe(true);
        expect(flagService.getForcedValue).toHaveBeenCalledWith(
            'prov_authenticationSetKeyCloakToTrue'
        );
    });

    it('should test enabledKeycloak getter returns false', () => {
        const flagService = TestBed.inject(InitializeFlagsService);
        spyOn(flagService, 'getForcedValue').and.returnValue(false);
        const result = service.enabledKeycloak;
        expect(result).toBe(false);
    });

    it('should handle 401 error and logout from Keycloak when user is logged in', fakeAsync(() => {
        spyOn(service.authConfig, 'isLoggedIn').and.returnValue(true);
        spyOn(service.authConfig, 'logout').and.callThrough();
        service.handle401Action();
        tick(100);
        expect(service.authConfig.isLoggedIn).toHaveBeenCalled();
        expect(service.authConfig.logout).toHaveBeenCalled();
    }));

    it('should handle 401 error and show login popup when Keycloak logout fails and enableLoginPopup is true', fakeAsync(() => {
        Object.defineProperty(service, 'enableLoginPopup', {
            get: () => true,
        });
        spyOn(service.authConfig, 'isLoggedIn').and.throwError('Not logged in');
        spyOn(service, 'popupLoginComponent');
        spyOn(console, 'error');
        service.handle401Action();
        tick(100);
        expect(service.popupLoginComponent).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
    }));

    it('should handle 401 error and redirect to login when Keycloak logout fails and enableLoginPopup is false', fakeAsync(() => {
        Object.defineProperty(service, 'enableLoginPopup', {
            get: () => false,
        });
        spyOn(service.authConfig, 'isLoggedIn').and.throwError('Not logged in');
        const stateSpy = spyOn(service.$state, 'go');
        spyOn(console, 'error');
        service.handle401Action();
        tick(3001);
        expect(stateSpy).toHaveBeenCalledWith(
            'auth.login',
            { is_expired: true },
            { reload: true }
        );
    }));

    it('should add X-Active-Tenant header when organization is selected', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(true)
            );
            spyOn(service.keycloak, 'getAuthHeader').and.returnValue(
                Promise.resolve('Bearer valid-token')
            );
            spyOn(service.authConfig, 'getSladeCode').and.returnValue('ORG123');
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('X-Active-Tenant')).toBe(
                'ORG123'
            );
            expect(modifiedRequest.headers.get('Authorization')).toBe(
                'Bearer valid-token'
            );
        })
    ));

    it('should add X-Variant header when variant is set', inject(
        [HttpClient],
        fakeAsync(() => {
            service.variant = 'empower';
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(true)
            );
            spyOn(service.keycloak, 'getAuthHeader').and.returnValue(
                Promise.resolve('Bearer valid-token')
            );
            spyOn(service.authConfig, 'getSladeCode').and.returnValue('ORG123');
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('X-Variant')).toBe('empower');
        })
    ));

    it('should not add X-Active-Tenant header when organization is not selected', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(true)
            );
            spyOn(service.keycloak, 'getAuthHeader').and.returnValue(
                Promise.resolve('Bearer valid-token')
            );
            spyOn(service.authConfig, 'getSladeCode').and.returnValue(null);
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('X-Active-Tenant')).toBeNull();
            expect(modifiedRequest.headers.get('Authorization')).toBe(
                'Bearer valid-token'
            );
        })
    ));

    it('should handle empty auth header from Keycloak', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(true)
            );
            spyOn(service.keycloak, 'getAuthHeader').and.returnValue(
                Promise.resolve('')
            );
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('Authorization')).toBeNull();
        })
    ));

    it('should handle "Bearer null" auth header from Keycloak', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(true)
            );
            spyOn(service.keycloak, 'getAuthHeader').and.returnValue(
                Promise.resolve('Bearer null')
            );
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('Authorization')).toBeNull();
        })
    ));

    it('should catch errors in intercept method for API calls', inject(
        [HttpClient],
        fakeAsync(() => {
            const mockError = new HttpErrorResponse({
                status: 500,
                statusText: 'Server Error',
            });
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.error(mockError);
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(true)
            );
            spyOn(service.keycloak, 'getAuthHeader').and.returnValue(
                Promise.resolve('Bearer valid-token')
            );
            spyOn(service.authConfig, 'getSladeCode').and.returnValue('ORG123');
            spyOn(service, 'handleError').and.callThrough();
            service.intercept(request, next).subscribe({
                error: err => {
                    expect(err.status).toBe(500);
                },
            });
            tick(100);
            expect(service.handleError).toHaveBeenCalled();
        })
    ));

    it('should not open login dialog when already open', () => {
        service.isLoginDialogOpen = true;
        const dialogService = TestBed.inject(NbDialogService);
        spyOn(dialogService, 'open');
        service.popupLoginComponent();
        expect(dialogService.open).not.toHaveBeenCalled();
    });

    it('should handle getSladeCode returning null and still proceed with request', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(true)
            );
            spyOn(service.keycloak, 'getAuthHeader').and.returnValue(
                Promise.resolve('Bearer valid-token')
            );
            spyOn(service.authConfig, 'getSladeCode').and.returnValue(null);
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('X-Active-Tenant')).toBeNull();
        })
    ));

    it('should handle Keycloak isLoggedIn error', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.reject(new Error('Keycloak error'))
            );
            spyOn(service, 'handleError').and.callThrough();
            service.intercept(request, next).subscribe({
                error: err => {
                    expect(err.message).toBe('Keycloak error');
                },
            });
            tick(100);
            expect(service.handleError).toHaveBeenCalled();
        })
    ));

    it('should handle Keycloak getAuthHeader error', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(true)
            );
            spyOn(service.keycloak, 'getAuthHeader').and.returnValue(
                Promise.reject(new Error('Failed to get auth header'))
            );
            spyOn(service, 'handleError').and.callThrough();
            service.intercept(request, next).subscribe({
                error: err => {
                    expect(err.message).toBe('Failed to get auth header');
                },
            });
            tick(100);
            expect(service.handleError).toHaveBeenCalled();
        })
    ));

    it('should add variant header only when variant is set', inject(
        [HttpClient],
        fakeAsync(() => {
            service.variant = '';
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(true)
            );
            spyOn(service.keycloak, 'getAuthHeader').and.returnValue(
                Promise.resolve('Bearer valid-token')
            );
            spyOn(service.authConfig, 'getSladeCode').and.returnValue('ORG123');
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('X-Variant')).toBeNull();
        })
    ));

    it('should handle successful 401 logout from Keycloak', fakeAsync(() => {
        spyOn(service.authConfig, 'isLoggedIn').and.returnValue(true);
        spyOn(service.authConfig, 'logout').and.callThrough();
        spyOn(console, 'error');
        service.handle401Action();
        tick(100);
        expect(service.authConfig.logout).toHaveBeenCalled();
        expect(console.error).not.toHaveBeenCalled();
    }));

    it('should handle 401 when user is not logged in', fakeAsync(() => {
        spyOn(service.authConfig, 'isLoggedIn').and.returnValue(false);
        spyOn(service.authConfig, 'logout');
        spyOn(console, 'error');
        service.handle401Action();
        tick(100);
        expect(service.authConfig.logout).not.toHaveBeenCalled();
        expect(console.error).not.toHaveBeenCalled();
    }));

    it('should handle Keycloak logout error and show popup', fakeAsync(() => {
        Object.defineProperty(service, 'enableLoginPopup', {
            get: () => true,
        });
        spyOn(service.authConfig, 'isLoggedIn').and.returnValue(true);
        spyOn(service.authConfig, 'logout').and.throwError('Logout failed');
        spyOn(service, 'popupLoginComponent');
        spyOn(console, 'error');
        service.handle401Action();
        tick(100);
        expect(service.popupLoginComponent).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
    }));

    it('should not add authorization header when keycloak is not logged in', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(false)
            );
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('Authorization')).toBeNull();
        })
    ));

    it('should test toggleDialog method', () => {
        service.isLoginDialogOpen = true;
        service.toggleDialog();
        expect(service.isLoginDialogOpen).toBe(false);
    });

    it('should test errorHandler method', () => {
        const mockError = new HttpErrorResponse({
            status: 500,
            error: { detail: 'Server error' },
        });
        spyOn(service, 'handleError').and.callThrough();
        service.errorHandler(mockError);
        expect(service.handleError).toHaveBeenCalledWith(mockError);
    });

    it('should handle 403 error without triggering 401 action', fakeAsync(() => {
        spyOn(service.toastServ, 'show');
        spyOn(service, 'handle401Action');
        const error = new HttpErrorResponse({
            status: 403,
            error: { detail: 'Forbidden' },
        });
        service.handleError(error);
        tick(100);
        expect(service.toastServ.show).not.toHaveBeenCalled();
        expect(service.handle401Action).not.toHaveBeenCalled();
    }));
});

class HttpHandlerStub2 {
    handle() {
        const err = new BehaviorSubject('');
        err.error(new Error());
        return err;
    }
}

class AuthorizationConfigStub2 {
    getToken() {
        return null;
    }
    getUser() {
        return null;
    }
    getOrganisation() {
        return true;
    }
    getSladeCode() {
        return 'ORG123';
    }
    isLoggedIn() {
        return false;
    }
    logout() {
        return;
    }
}

class StateServiceStubIncludes {
    reset() {
        return true;
    }
    includes() {
        return true;
    }
    go() {
        return true;
    }
}

describe('AuthInterceptor: 2', () => {
    let service: AuthInterceptor;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [
                AuthInterceptor,
                { provide: StateService, useClass: StateServiceStubIncludes },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub2 },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                {
                    provide: InitializeFlagsService,
                    useClass: InitializeFlagsServiceStub,
                },
                { provide: Router, useValue: routerSpy },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true,
                },
                { provide: NbDialogService, useValue: nbDialogServiceStub },
                { provide: HttpHandler, useClass: HttpHandlerStub2 },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AuthInterceptor);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should test intercept method', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: () =>
                    Observable.create(subscriber => {
                        subscriber.complete();
                    }),
            };
            service.CREDZ_STORE = 'auth.config.credz';
            const request = new HttpRequest('GET', '/');
            localStorage.setItem('auth.config.credz', JSON.stringify({}));
            service.handleResponse();
            tick(9001);
            spyOn(service, 'intercept').and.callThrough();
            localStorage.removeItem('auth.config.credz');
            service.intercept(request, next).subscribe(
                () => fail(''),
                (error: HttpErrorResponse) => {
                    expect(error.status).toBeUndefined();
                }
            );
            expect(service.intercept).toHaveBeenCalled();
        })
    ));

    it('should test intercept method when there is an api call', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: () =>
                    Observable.create(subscriber => {
                        subscriber.complete();
                    }),
            };
            service.CREDZ_STORE = 'auth.config.credz';
            const request = new HttpRequest('GET', '/api/');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(true)
            );
            spyOn(service.keycloak, 'getAuthHeader').and.returnValue(
                Promise.resolve('Bearer null')
            );
            localStorage.setItem('auth.config.credz', JSON.stringify({}));
            service.handleResponse();
            tick(9001);
            spyOn(service, 'intercept').and.callThrough();
            localStorage.removeItem('auth.config.credz');
            service.intercept(request, next).subscribe({
                next: next,
                error: (error: HttpErrorResponse) => {
                    expect(error.status).toBeUndefined();
                },
            });
            expect(service.intercept).toHaveBeenCalled();
        })
    ));

    it('should test handleResponse method when it is null', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: () =>
                    Observable.create(subscriber => {
                        subscriber.complete();
                    }),
            };
            service.CREDZ_STORE = 'auth.config.credz';
            spyOn(service, 'intercept').and.callThrough();
            const request = new HttpRequest('GET', '/');
            localStorage.setItem('auth.config.credz', null);
            service.handleResponse();
            tick(9001);
            localStorage.removeItem('auth.config.credz');
            service.intercept(request, next).subscribe(
                () => fail(''),
                (error: HttpErrorResponse) => {
                    expect(error.status).toBeUndefined();
                }
            );
            expect(service.intercept).toHaveBeenCalled();
        })
    ));
});

class SilKeycloakServiceFailedLogginStub {
    getToken() {
        return true;
    }
    isLoggedIn(): Promise<boolean> {
        return Promise.resolve(false);
    }
    getAuthHeader(): Promise<boolean> {
        return Promise.resolve(true);
    }
}

class AuthorizationConfigStubWithToken {
    getToken() {
        return {
            token_type: 'Bearer',
            access_token: 'sil-auth-server-token',
        };
    }
    getUser() {
        return {};
    }
    getOrganisation() {
        return true;
    }
    getSladeCode() {
        return 'SIL-ORG-123';
    }
    isLoggedIn() {
        return true;
    }
    logout() {
        return;
    }
}

class AuthorizationConfigStubWithTokenNoSladeCode {
    getToken() {
        return {
            token_type: 'Bearer',
            access_token: 'sil-auth-server-token',
        };
    }
    getUser() {
        return {};
    }
    getOrganisation() {
        return true;
    }
    getSladeCode() {
        return null;
    }
    isLoggedIn() {
        return true;
    }
    logout() {
        return;
    }
}

class AuthorizationConfigStubNoToken {
    getToken() {
        return null;
    }
    getUser() {
        return {};
    }
    getOrganisation() {
        return true;
    }
    getSladeCode() {
        return 'SIL-ORG-123';
    }
    isLoggedIn() {
        return false;
    }
    logout() {
        return;
    }
}

describe('AuthInterceptor with no login from keycloak', () => {
    let service: AuthInterceptor;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [
                AuthInterceptor,
                { provide: StateService, useClass: StateServiceStubIncludes },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub2 },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceFailedLogginStub,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                {
                    provide: InitializeFlagsService,
                    useClass: InitializeFlagsServiceStub,
                },
                { provide: Router, useValue: routerSpy },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true,
                },
                { provide: NbDialogService, useValue: nbDialogServiceStub },
                { provide: HttpHandler, useClass: HttpHandlerStub2 },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AuthInterceptor);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should test intercept method when there is an api call but not logged in', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: () =>
                    Observable.create(subscriber => {
                        subscriber.complete();
                    }),
            };
            service.CREDZ_STORE = 'auth.config.credz';
            const request = new HttpRequest('GET', '/api/');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(false)
            );
            spyOn(service.keycloak, 'getAuthHeader').and.returnValue(
                Promise.resolve('Bearer null')
            );
            localStorage.setItem('auth.config.credz', JSON.stringify({}));
            service.handleResponse();
            tick(9001);
            spyOn(service, 'intercept').and.callThrough();
            localStorage.removeItem('auth.config.credz');
            service.intercept(request, next).subscribe({
                next: next,
                error: (error: HttpErrorResponse) => {
                    expect(error.status).toBeUndefined();
                },
            });
            expect(service.intercept).toHaveBeenCalled();
        })
    ));
});

describe('AuthInterceptor with SIL AuthServer token (non-Keycloak)', () => {
    let service: AuthInterceptor;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [
                AuthInterceptor,
                { provide: StateService, useClass: StateServiceStubIncludes },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: Authorization,
                    useClass: AuthorizationConfigStubWithToken,
                },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceFailedLogginStub,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                {
                    provide: InitializeFlagsService,
                    useClass: InitializeFlagsServiceStub,
                },
                { provide: Router, useValue: routerSpy },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true,
                },
                { provide: NbDialogService, useValue: nbDialogServiceStub },
                { provide: HttpHandler, useClass: HttpHandlerStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AuthInterceptor);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should add Authorization header with SIL AuthServer token when not logged in via Keycloak', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(false)
            );
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('Authorization')).toBe(
                'Bearer sil-auth-server-token'
            );
        })
    ));

    it('should add X-Active-Tenant header with SIL AuthServer when not logged in via Keycloak', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(false)
            );
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('X-Active-Tenant')).toBe(
                'SIL-ORG-123'
            );
        })
    ));

    it('should add X-Variant header with SIL AuthServer when variant is set', inject(
        [HttpClient],
        fakeAsync(() => {
            service.variant = 'advantage';
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(false)
            );
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('X-Variant')).toBe('advantage');
        })
    ));

    it('should add all three headers (Authorization, X-Active-Tenant, X-Variant) for SIL AuthServer', inject(
        [HttpClient],
        fakeAsync(() => {
            service.variant = 'empower';
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(false)
            );
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('Authorization')).toBe(
                'Bearer sil-auth-server-token'
            );
            expect(modifiedRequest.headers.get('X-Active-Tenant')).toBe(
                'SIL-ORG-123'
            );
            expect(modifiedRequest.headers.get('X-Variant')).toBe('empower');
        })
    ));

    it('should not add X-Variant header for SIL AuthServer when variant is empty', inject(
        [HttpClient],
        fakeAsync(() => {
            service.variant = '';
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(false)
            );
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('X-Variant')).toBeNull();
        })
    ));

    it('should handle errors in SIL AuthServer path', inject(
        [HttpClient],
        fakeAsync(() => {
            const mockError = new HttpErrorResponse({
                status: 500,
                statusText: 'Server Error',
            });
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.error(mockError);
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(false)
            );
            spyOn(service, 'handleError').and.callThrough();
            service.intercept(request, next).subscribe({
                error: err => {
                    expect(err.status).toBe(500);
                },
            });
            tick(100);
            expect(service.handleError).toHaveBeenCalled();
        })
    ));
});

describe('AuthInterceptor with SIL AuthServer token but no slade code', () => {
    let service: AuthInterceptor;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [
                AuthInterceptor,
                { provide: StateService, useClass: StateServiceStubIncludes },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: Authorization,
                    useClass: AuthorizationConfigStubWithTokenNoSladeCode,
                },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceFailedLogginStub,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                {
                    provide: InitializeFlagsService,
                    useClass: InitializeFlagsServiceStub,
                },
                { provide: Router, useValue: routerSpy },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true,
                },
                { provide: NbDialogService, useValue: nbDialogServiceStub },
                { provide: HttpHandler, useClass: HttpHandlerStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AuthInterceptor);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should not add X-Active-Tenant header when slade code is null for SIL AuthServer', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(false)
            );
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('Authorization')).toBe(
                'Bearer sil-auth-server-token'
            );
            expect(modifiedRequest.headers.get('X-Active-Tenant')).toBeNull();
        })
    ));
});

describe('AuthInterceptor with no token (not logged in at all)', () => {
    let service: AuthInterceptor;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [
                AuthInterceptor,
                { provide: StateService, useClass: StateServiceStubIncludes },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: Authorization,
                    useClass: AuthorizationConfigStubNoToken,
                },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceFailedLogginStub,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                {
                    provide: InitializeFlagsService,
                    useClass: InitializeFlagsServiceStub,
                },
                { provide: Router, useValue: routerSpy },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true,
                },
                { provide: NbDialogService, useValue: nbDialogServiceStub },
                { provide: HttpHandler, useClass: HttpHandlerStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AuthInterceptor);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should not add Authorization header when token is null', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(false)
            );
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('Authorization')).toBeNull();
        })
    ));

    it('should still add X-Active-Tenant header when token is null but slade code exists', inject(
        [HttpClient],
        fakeAsync(() => {
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(false)
            );
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('X-Active-Tenant')).toBe(
                'SIL-ORG-123'
            );
        })
    ));

    it('should still add X-Variant header when token is null but variant is set', inject(
        [HttpClient],
        fakeAsync(() => {
            service.variant = 'advantage';
            const next: any = {
                handle: jasmine.createSpy('handle').and.returnValue(
                    Observable.create(subscriber => {
                        subscriber.complete();
                    })
                ),
            };
            const request = new HttpRequest('GET', '/api/patients');
            spyOn(service.keycloak, 'isLoggedIn').and.returnValue(
                Promise.resolve(false)
            );
            service.intercept(request, next).subscribe();
            tick(100);
            expect(next.handle).toHaveBeenCalled();
            const modifiedRequest = next.handle.calls.mostRecent().args[0];
            expect(modifiedRequest.headers.get('X-Variant')).toBe('advantage');
        })
    ));
});

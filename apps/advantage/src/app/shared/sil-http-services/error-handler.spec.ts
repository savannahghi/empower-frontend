import { ErrorHandlerService } from './error-handler';
import { SilStoresService } from './sil_datalayer.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { DataLayerUtils } from '../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../app-config.service';
import {
    HttpErrorResponse,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StateService } from '@uirouter/angular';

class AuthorizationConfigStub {
    getUser() {
        const stringified = JSON.stringify({
            business_partner: 1,
            client_types: ['PROVIDER'],
        });
        return stringified;
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
}
class NbToastrServiceStub {
    show() {
        return {};
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    reload() {
        return true;
    }
}

describe('ErrorHandlerService', () => {
    let service: ErrorHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: Authorization, useClass: AuthorizationConfigStub },
                ErrorHandlerService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                SilStoresService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { params: { id: '24fkzrw3487943uf358lovd' } },
                    },
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ErrorHandlerService);
        localStorage.setItem(
            'auth.config.credz',
            JSON.stringify({ token_type: '1', access_token: '1' })
        );
    });

    it('should test containsInvalidAccessTokenError function', () => {
        spyOn(service, 'containsInvalidAccessTokenError').and.callThrough();
        const errorList = [
            {
                error: 'supplied access token not in cache',
            },
            {
                error: 'the supplied access token is invalid',
            },
            {
                error: 'the supplied access token is invalid',
            },
        ];
        service.containsInvalidAccessTokenError(errorList);
        expect(service.containsInvalidAccessTokenError).toHaveBeenCalled();
    });

    it('should test setupComponent', () => {
        const err = {
            status: 400,
            error: {
                key: 'njln',
                value: 'nni',
            },
        };

        // Suppress console errors for this test
        spyOn(console, 'error').and.callFake(() => {});

        spyOn(service, 'errorFxn').and.callThrough();
        service.setupComponent({});
        service.errorFxn(err, {});

        // error status is => 500
        const err2 = {
            status: 500,
            error: {
                key: 'njln',
                value: 'nni',
            },
        };
        service.errorFxn(err2, {});

        // error is ngOriginalError
        const err3 = {
            status: 500,
            ngOriginalError: {
                key: 'njln',
                value: 'nni',
            },
            error: {
                key: 'njln',
                value: 'nni',
            },
        };
        service.errorFxn(err3, {});

        const err4 = 'Error';
        service.errorFxn(err4, {});

        const err5 = new Error();
        service.errorFxn(err5, {});

        const httpError = new HttpErrorResponse({
            error: '404 error',
            status: 404,
            statusText: 'Not Found',
        });

        service.errorFxn(httpError, {});

        // test instanceof Error
        const httpError2 = new HttpErrorResponse({
            error: new Error(),
            status: 404,
            statusText: 'Not Found',
        });

        service.errorFxn(httpError2, {});

        // test instanceof ErrorEvent
        const httpError3 = new HttpErrorResponse({
            error: new ErrorEvent('err'),
            status: 404,
            statusText: 'Not Found',
        });

        service.errorFxn(httpError3, {});

        // test instanceof not string
        const httpError4 = new HttpErrorResponse({
            error: { constructor: Object },
            status: 404,
            statusText: 'Not Found',
        });

        service.errorFxn(httpError4, {});

        // test instanceof 401
        const httpError5 = new HttpErrorResponse({
            error: {
                detail: 'Not Authorized',
            },
            status: 401,
            statusText: 'Not Found',
        });

        service.errorFxn(httpError5, {});

        // test instanceof 401 and error array
        const httpError6 = new HttpErrorResponse({
            error: [
                {
                    error: 'supplied access token not in cache',
                },
                {
                    error: 'the supplied access token is invalid',
                },
                {
                    error: 'the supplied access token is invalid',
                },
            ],
            status: 401,
            statusText: 'Not Found',
        });

        service.errorFxn({ networkError: httpError6 }, {}, 'clinical');

        // test instanceof 401 and error array if api is clinical server rest
        const httpError7 = {
            error: [
                {
                    error: 'supplied access token not in cache',
                },
                {
                    error: 'the supplied access token is invalid',
                },
                {
                    error: 'the supplied access token is invalid',
                },
            ],
            status: 401,
            statusText: 'Not Found',
        };

        service.errorFxn(httpError7, {}, 'clinical');
        // test instance of 422 and error array
        const httpError8 = new HttpErrorResponse({
            error: {
                errors: [
                    {
                        message: 'must be defined',
                        path: ['variable', 'input', 'encounterID'],
                        extensions: {
                            code: 'GRAPHQL_VALIDATION_FAILED',
                        },
                    },
                ],
            },
            status: 422,
            statusText: 'Not Found',
        });

        service.errorFxn({ networkError: httpError8 }, {}, 'clinical');

        const httpError9 = new HttpErrorResponse({
            error: 'Internal error',
            status: 500,
            statusText: 'Server error',
        });
        service.errorFxn(httpError9, {});

        const httpError10 = new HttpErrorResponse({
            error: new Error(),
            status: 500,
            statusText: 'Server error',
        });
        service.errorFxn(httpError10, {});

        const httpError11 = new HttpErrorResponse({
            error: new ErrorEvent('err'),
            status: 500,
            statusText: 'Server error',
        });
        service.errorFxn(httpError11, {});

        const httpError12 = new HttpErrorResponse({
            error: { constructor: Object },
            status: 500,
            statusText: 'Server error',
        });
        service.errorFxn(httpError12, {});

        // test instance of clinical server string error
        const err13 = 'Error Occured';

        service.errorFxn({ networkError: err13 }, {}, 'clinical');

        expect(service.errorFxn).toHaveBeenCalled();

        // test instance of clinical server error of instance Error
        const err14 = new Error();
        service.errorFxn({ networkError: err14 }, {}, 'clinical');
    });
});

class AuthorizationConfigStubNull {
    getUser() {
        const stringified = null;
        return stringified;
    }
    getOrganisation() {
        return null;
    }
    getErpOrganisation() {
        return null;
    }
}

describe('ErrorHandlerService | null', () => {
    let service: ErrorHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                {
                    provide: Authorization,
                    useClass: AuthorizationConfigStubNull,
                },
                ErrorHandlerService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                SilStoresService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { params: { id: '24fkzrw3487943uf358lovd' } },
                    },
                },
                {
                    provide: environment,
                    useValue: { sentryEnvironment: 'testing' },
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ErrorHandlerService);
        localStorage.setItem(
            'auth.config.credz',
            JSON.stringify({ token_type: '1', access_token: '1' })
        );
    });

    it('should test handleError testing environment', () => {
        environment.sentryEnvironment = 'testing';

        spyOn(service, 'handleError').and.callThrough();

        const err = {
            status: 400,
            error: {
                key: 'njln',
                value: 'nni',
            },
        };
        service.setupComponent({});
        service.handleError(err, {});

        expect(service.handleError).toHaveBeenCalled();
    });

    it('should test setupComponent', () => {
        spyOn(service, 'errorFxn').and.callThrough();
        const err = {
            status: 400,
            error: {
                key: 'njln',
                value: 'nni',
            },
        };
        service.setupComponent({});
        service.errorFxn(err, {});

        // error status is => 500
        const err2 = {
            status: 500,
            error: {
                key: 'njln',
                value: 'nni',
            },
        };
        service.errorFxn(err2, {});
        expect(service.errorFxn).toHaveBeenCalled();
    });
});

describe('sentrEnvironment is production', () => {
    let service: ErrorHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                {
                    provide: Authorization,
                    useClass: AuthorizationConfigStubNull,
                },
                ErrorHandlerService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                SilStoresService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { params: { id: '24fkzrw3487943uf358lovd' } },
                    },
                },
                {
                    provide: environment,
                    useValue: { sentryEnvironment: 'production' },
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ErrorHandlerService);
        localStorage.setItem(
            'auth.config.credz',
            JSON.stringify({ token_type: '1', access_token: '1' })
        );
    });

    it('should test handleError production environment', () => {
        environment.sentryEnvironment = 'production';

        spyOn(service, 'handleError').and.callThrough();

        const err = {
            status: 400,
            error: {
                key: 'njln',
                value: 'nni',
            },
        };
        service.setupComponent({});
        service.handleError(err, {});
        service.setupSentry();

        expect(service.handleError).toHaveBeenCalled();
    });
});

describe('sentrEnvironment is development', () => {
    let service: ErrorHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                {
                    provide: Authorization,
                    useClass: AuthorizationConfigStubNull,
                },
                ErrorHandlerService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                SilStoresService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { params: { id: '24fkzrw3487943uf358lovd' } },
                    },
                },
                {
                    provide: environment,
                    useValue: { sentryEnvironment: 'development' },
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ErrorHandlerService);
        localStorage.setItem(
            'auth.config.credz',
            JSON.stringify({ token_type: '1', access_token: '1' })
        );
    });

    it('should test handleError development environment', () => {
        environment.sentryEnvironment = 'development';

        spyOn(service, 'handleError').and.callThrough();

        const err = {
            status: 400,
            error: {
                key: 'njln',
                value: 'nni',
            },
        };

        service.setupComponent({});
        service.handleError(err, {});

        expect(service.handleError).toHaveBeenCalled();
    });
});

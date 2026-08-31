/** Imports used in the component */
import { Injectable } from '@angular/core';
import { StateService } from '@uirouter/core';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { Authorization } from '../../@core/auth/services/authorization.service';
import {
    catchError,
    filter,
    map,
    Observable,
    throwError,
    from,
    switchMap,
    of,
} from 'rxjs';
import { ErrorHandlerService } from './error-handler';
import { LoginDialogComponent } from '../../@core/auth/components/login-dialog/login-dialog.component';
import { environment } from 'environments/environment';
import { SilKeycloakService } from '../sil-keycloak/keycloak.service';
import { InitializeFlagsService } from '../../@core/utils/initialize-flags.service';

/**
 * Injectable for AuthInterceptor
 * Used to intercept http requests
 * handles successful requests and responses
 * handles errors in requests and responses
 */
@Injectable()
/**
 * AuthInterceptor injectable class
 * Implements HttpInterceptor when intializing the class
 */
export class AuthInterceptor implements HttpInterceptor {
    /** storage key for token information */
    CREDZ_STORE = 'KEYCLOAK_IDENTITY';
    dialogRef: any;
    isLoginDialogOpen: boolean = false;

    /**
     * Initializes toast, auth and state services
     * @param toastServ toast service from Nebular
     * @param errorHandlerService internal errror handler service
     * @param authConfig internal authorization service
     * @param $state uiRouter state service
     * @param dialogService dialog service from Nebular
     * @param keycloak Keycloak service for authentication
     * @param featureFlagService feature flag service
     */
    constructor(
        public toastServ: NbToastrService,
        public errorHandlerService: ErrorHandlerService,
        public authConfig: Authorization,
        public $state: StateService,
        private dialogService: NbDialogService,
        public keycloak: SilKeycloakService,
        public featureFlagService: InitializeFlagsService
    ) {}

    /** calls handleError method */
    errorHandler = err => this.handleError(err);

    /** defined the current environment variant */
    variant = environment.variant;

    /** Should disable login popup for empower */
    get enableLoginPopup(): boolean {
        return this.variant !== 'empower';
    }

    /** Should determine if keycloak is enabled */
    get enabledKeycloak(): boolean {
        return this.featureFlagService.getForcedValue(
            'prov_authenticationSetKeyCloakToTrue'
        );
    }

    /** used in mapResponseFxn to determine if the auth token exists */
    handleResponse(event?) {
        setTimeout(() => {
            const token: any = this.authConfig.getToken();
            if (token === null) {
                console.error('Token is null', token);
            } else {
                return event;
            }
        }, 9000);
    }

    /** used to determine if event is a http response */
    filterResponseFxn = evt => evt instanceof HttpResponse;

    /** used to return a response in a HttpEvent observable */
    mapResponseFxn = evt => {
        this.handleResponse(evt);
        return evt;
    };

    /** handles error for http responses */
    handleError(error: HttpErrorResponse) {
        const position: any = 'bottom-right';
        const status: any = 'danger';
        if (error.status === 401) {
            this.toastServ.show(error.error.detail, 'Authentication Error', {
                preventDuplicates: true,
                position,
                status,
            });
            this.handle401Action();
        }
        return this.returnError(error);
    }

    /**
     * Handle 401 errors
     */
    async handle401Action() {
        try {
            const isLoggedIn = this.authConfig.isLoggedIn();
            if (isLoggedIn) {
                this.authConfig.logout();
            }
        } catch (error) {
            if (this.enableLoginPopup) {
                this.popupLoginComponent();
                console.error(error);
            } else {
                setTimeout(() => {
                    this.$state.go(
                        'auth.login',
                        { is_expired: true },
                        { reload: true }
                    );
                }, 3000);
            }
        }
    }

    /**
     * Pop up the login component
     */
    popupLoginComponent() {
        if (!this.isLoginDialogOpen) {
            this.isLoginDialogOpen = true;
            this.dialogRef = this.dialogService.open(LoginDialogComponent, {
                context: {},
                closeOnBackdropClick: false,
                hasBackdrop: true,
                closeOnEsc: false,
            });
            this.dialogRef.onClose.subscribe({ next: this.toggleDialog });
        }
    }

    /** Toggle Dialog off */
    toggleDialog = () => {
        this.isLoginDialogOpen = false;
    };

    /** return error */
    returnError = error => {
        /**
         * We return an errored observable, we can now handle errors at the service level
         */
        return throwError(() => error);
    };

    /**
     * Handles http requests going out and adds the authorization header
     * in the request using Keycloak bearer token
     */
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // Skip non-API calls and Superset API calls
        if (
            !request.url.includes('/api/') ||
            request.url.includes('superset')
        ) {
            return next
                .handle(request)
                .pipe(
                    catchError(this.errorHandler),
                    filter(this.filterResponseFxn),
                    map(this.mapResponseFxn)
                );
        }

        // Use Keycloak to add bearer token
        return from(this.keycloak.isLoggedIn()).pipe(
            switchMap(isLoggedIn => {
                if (!isLoggedIn) {
                    const headers: any = {};

                    // Add Authorization header for SIL AuthServer
                    const token: any = this.authConfig.getToken();
                    if (token?.access_token) {
                        headers[
                            'Authorization'
                        ] = `${token.token_type} ${token.access_token}`;
                    }

                    const selectedOrgId = this.authConfig.getSladeCode();
                    if (selectedOrgId) {
                        headers['X-Active-Tenant'] = selectedOrgId;
                    }

                    if (this.variant) {
                        headers['X-Variant'] = this.variant;
                    }

                    const authReq = request.clone({
                        setHeaders: headers,
                    });
                    return next
                        .handle(authReq)
                        .pipe(
                            catchError(this.errorHandler),
                            filter(this.filterResponseFxn),
                            map(this.mapResponseFxn)
                        );
                }

                return from(this.keycloak.getAuthHeader()).pipe(
                    switchMap(authHeader => {
                        // Get selected organisation ID for X-Active-Tenant header
                        return of(this.authConfig.getSladeCode()).pipe(
                            switchMap(selectedOrgId => {
                                if (
                                    authHeader &&
                                    authHeader !== 'Bearer null' &&
                                    authHeader !== ''
                                ) {
                                    // Build headers object with Authorization
                                    const headers: any = {
                                        Authorization: authHeader,
                                    };

                                    // Add X-Active-Tenant header if organisation is selected
                                    if (selectedOrgId) {
                                        headers['X-Active-Tenant'] =
                                            selectedOrgId;
                                    }

                                    // Add variant header
                                    if (this.variant) {
                                        headers['X-Variant'] = this.variant;
                                    }

                                    const authReq = request.clone({
                                        setHeaders: headers,
                                    });

                                    return next
                                        .handle(authReq)
                                        .pipe(
                                            catchError(this.errorHandler),
                                            filter(this.filterResponseFxn),
                                            map(this.mapResponseFxn)
                                        );
                                }
                                return next
                                    .handle(request)
                                    .pipe(
                                        catchError(this.errorHandler),
                                        filter(this.filterResponseFxn),
                                        map(this.mapResponseFxn)
                                    );
                            })
                        );
                    })
                );
            }),
            catchError(this.errorHandler)
        );
    }
}

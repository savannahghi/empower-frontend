import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
    BehaviorSubject,
    Observable,
    map,
    catchError,
    switchMap,
    throwError,
} from 'rxjs';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from '../sil-http-services/error-handler';

export interface SupersetAuthResponse {
    access_token: string;
    refresh_token: string;
}

export interface SupersetGuestTokenResponse {
    token: string;
}

export interface SupersetDashboardConfig {
    serverUrl?: string;
    dashboardId: string;
    username?: string;
    password?: string;
    /**
     * SQL clause for row-level security filtering
     */
    rlsClause?: Array<any>;
}

@Injectable({
    providedIn: 'root',
})
export class EmbeddedDashboardService {
    /**
     * Injected HTTP client for making direct HTTP requests to Superset API.
     */
    private httpClient = inject(HttpClient);

    private authService = inject(Authorization);

    private errorHandler = inject(ErrorHandlerService);

    /**
     * BehaviorSubject to track the loading state of dashboard operations.
     */
    private loadingSubject = new BehaviorSubject<boolean>(false);

    /**
     * BehaviorSubject to track error messages from dashboard operations.
     */
    private errorSubject = new BehaviorSubject<string>('');

    /**
     * BehaviorSubject to track the guest token after successful authentication.
     * Persists between navigation to avoid unnecessary token fetching
     */
    private guestTokenSubject = new BehaviorSubject<string>('');

    /**
     * Observable stream of loading state changes.
     */
    public loading$ = this.loadingSubject.asObservable();

    /**
     * Observable stream of error message changes.
     */
    public error$ = this.errorSubject.asObservable();

    /**
     * Observable stream of guest token changes.
     */
    public guestToken$ = this.guestTokenSubject.asObservable();

    private isTokenExpired(token: string, marginSeconds = 60): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000;
            return Date.now() > expiry - marginSeconds * 1000;
        } catch {
            return true;
        }
    }

    /**
     * Get the business partner code for RLS filtering.
     * Checks the ERP organisation first, falls back to the user object.
     */
    private getBp(): string | null {
        const erpBp = this.authService.getSladeCode();
        if (erpBp) return erpBp;

        const user = this.authService.getUser();
        return user?.business_partner ?? null;
    }

    /**
     * Check if the given dashboard ID is the health CRM dashboard.
     * @param dashboardId The dashboard ID to check
     * @returns true if this is the health CRM dashboard
     */
    private isHealthCrmDashboard(dashboardId: string): boolean {
        if (environment.supersetDashboardUuids) {
            const dashboardIds = JSON.parse(environment.supersetDashboardUuids);
            return dashboardId === dashboardIds['HEALTH_CRM'];
        }
        return false;
    }

    /**
     * Authenticate with Superset to get access token.
     */
    private supersetLogin(config: SupersetDashboardConfig): Observable<string> {
        const loginPayload = {
            username: config.username || environment.supersetUsername,
            password: config.password || environment.supersetPassword,
            provider: 'db',
            refresh: true,
        };

        const headersObj = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        const serverUrl = config.serverUrl || environment.supersetServerUrl;
        const loginUrl = `${serverUrl}/api/v1/security/login`;

        return this.httpClient
            .post<SupersetAuthResponse>(loginUrl, loginPayload, {
                headers: headersObj,
            })
            .pipe(
                map((response: SupersetAuthResponse) => {
                    return response.access_token;
                }),
                catchError(() => {
                    return throwError(
                        () =>
                            new Error('Failed to obtain Superset access token.')
                    );
                })
            );
    }

    // Reuse access token or get a new one
    private getValidAccessToken(
        config: SupersetDashboardConfig
    ): Observable<string> {
        return this.supersetLogin(config);
    }

    /**
     * Get guest token for dashboard access with RLS filtering.
     */
    private getGuestToken(config: SupersetDashboardConfig): Observable<string> {
        const bp = this.getBp();

        // Skip RLS for health CRM dashboard when business partner is "1"
        const shouldSkipRls =
            this.isHealthCrmDashboard(config.dashboardId) && bp === '1';

        if (!bp && !shouldSkipRls) {
            return throwError(
                () =>
                    new Error(
                        'Business partner not found. Cannot load dashboard without RLS filter.'
                    )
            );
        }

        const resources = [{ id: config.dashboardId, type: 'dashboard' }];
        const guestTokenPayload = {
            resources,
            user: {},
            rls: !shouldSkipRls ? [{ clause: `sladeCode='${bp}'` }] : [],
        };

        return this.getValidAccessToken(config).pipe(
            switchMap(accessToken => {
                const headersObj = new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                });

                const serverUrl =
                    config.serverUrl || environment.supersetServerUrl;
                const guestTokenUrl = `${serverUrl}/api/v1/security/guest_token/`;

                return this.httpClient
                    .post<SupersetGuestTokenResponse>(
                        guestTokenUrl,
                        guestTokenPayload,
                        { headers: headersObj }
                    )
                    .pipe(
                        map((response: SupersetGuestTokenResponse) => {
                            return response.token;
                        }),
                        catchError(error => {
                            return throwError(
                                () =>
                                    new Error(
                                        `Failed to obtain Superset guest token. Status: ${
                                            error.status
                                        }, Message: ${
                                            error.error?.message ||
                                            error.message
                                        }`
                                    )
                            );
                        })
                    );
            }),
            catchError(() =>
                throwError(
                    () =>
                        new Error(
                            'Could not retrieve Superset guest token due to authentication/API error.'
                        )
                )
            )
        );
    }

    /**
     * Initialize dashboard by obtaining guest token.
     * @param config Configuration for the dashboard initialization
     */
    initializeDashboard(config: SupersetDashboardConfig): void {
        this.loadingSubject.next(true);
        this.errorSubject.next('');

        if (!config.dashboardId) {
            this.errorSubject.next('Dashboard ID not configured');
            this.loadingSubject.next(false);
            return;
        }

        this.getGuestToken(config).subscribe({
            next: guestToken => {
                this.guestTokenSubject.next(guestToken);
                this.loadingSubject.next(false);
            },
            error: error => {
                const errorMsg = error.message || 'Failed to load dashboard';
                this.errorSubject.next(`Dashboard error: ${errorMsg}`);
                this.loadingSubject.next(false);
            },
        });
    }
}

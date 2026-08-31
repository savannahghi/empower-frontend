import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { Cookies } from '../cookies/cookie.service';
import { of, pipe } from 'rxjs';

/**
 * Service component that is used to send
 * a request to cubejs backend and get a
 * token that is used for all cube api
 * request.
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the quintus authorization service.
 */
export class QuintusAuthorizationService {
    /**
     * Initializes a user object to store the user data.
     */
    user;
    /**
     * Initializes a token object to store the token associated with the user.
     */
    token;
    /**
     * Component constructor
     * @param http Initilizes a http client to send API request to cube.
     * @param authConfig Initializes an instance of the Authorization service.
     */
    constructor(
        private http: HttpClient,
        public authConfig: Authorization,
        public cookieService: Cookies
    ) {}

    /**
     * Gets the currently logged in user
     */
    getUser() {
        this.user = this.authConfig.getUser();
        return this.user;
    }

    /**
     * Gets the currently logged in user's erp credz token
     */
    getAdvantageToken() {
        this.token = this.authConfig.getToken();
        return this.user;
    }

    /**
     * @param user The user logged in
     * Gets the JWT from cubejs backend from the /login endpoint
     */
    async getJWT(user, token) {
        if (user && token) {
            /** Temporary allow only working variants to call quintus backend */
            const allowedVariants = ['default'];
            if (allowedVariants.includes(environment.variant)) {
                this.http
                    .post(
                        environment.CUBEJS_LOGIN_URL,
                        { user, token },
                        { responseType: 'text' }
                    )
                    .subscribe(
                        pipe(data => {
                            localStorage.setItem(
                                'quintus_token',
                                JSON.stringify(data)
                            );
                        })
                    );
            } else {
                return of('fakeToken');
            }
        }
    }

    /**
     * @param user The user logged in
     * @param responseType type of response from cube
     * Gets the JWT from cube js backend from the /login endpoint
     * Used as an Observable in the quintus resolver
     */
    async getJWTToken(user, token) {
        /** Temporary allow only working variants to call quintus backend */
        const allowedVariants = ['default'];
        if (allowedVariants.includes(environment.variant)) {
            return this.http.post(
                environment.CUBEJS_LOGIN_URL,
                { user, token },
                { responseType: 'text' }
            );
        } else {
            return of('fakeToken');
        }
    }
    /**
     * Gets the user authorization details from cube and creates quintus_token
     */
    checkAuthorization() {
        this.getUser();
        this.getAdvantageToken();
        if (this.user && this.token) {
            if (
                this.user.permissions.includes('erp.dashboard_list') &&
                this.token.access_token
            ) {
                this.getJWT(this.user, this.token);
                return this.user;
            } else {
                return 'Not authenticated';
            }
        } else {
            return 'No user passed';
        }
    }

    /**
     * returns quintus_token from local storage
     */
    getToken() {
        return localStorage.getItem('quintus_token');
    }
}

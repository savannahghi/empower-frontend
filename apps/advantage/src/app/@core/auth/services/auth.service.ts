/**
 * Imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Contains the data attributes for UserData interface
 */
export interface UserData {
    /** defines the username being used */
    username: string;
    /** defines the password being used */
    password: string;
}

/**
 * Contains the data attributes for TokenResponse interface
 */
export interface TokenResponse {
    /** defines the access_token being used */
    access_token: string;
    /** defines the token_type being used */
    token_type: string;
    /** defines the expires_in being used */
    expires_in: number;
}

/**
 * Contains the data attributes for AuthConfig interface
 */
export interface AuthConfig {
    apiAddress: string;
}

/**
 * Contains decorator used for the service
 */
@Injectable()

/**
 * Defines auth class for the provider that extends NbAuthService
 */
export class AuthProvider {
    /** access authconfig interface */
    protected config: AuthConfig;
    /** access the angular http client class */
    protected httpClient: HttpClient;

    /**
     * Constructor for the AuthProvider class
     * @param http contains the http client service
     * @param tokenService contains an instance of the nebular token service
     */
    constructor(protected http: HttpClient) {}

    /**
     * sets the key for the config
     * @param key
     * @returns the config value based on the param
     */
    getConfigValue(key: string) {
        return this.config[key];
    }
}

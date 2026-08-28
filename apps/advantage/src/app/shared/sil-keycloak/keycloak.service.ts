import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { KeycloakService } from 'keycloak-angular';

interface DecodedIdToken {
    sub?: string;
    given_name?: string;
    family_name?: string;
    email?: string;
    tenants?: {
        [key: string]: {
            name?: string[];
            id: string;
        };
    };
}

export interface UserProfile {
    id?: string;
    full_name?: string;
    email?: string;
    tenants?: object;
}

@Injectable({
    providedIn: 'root',
})
export class SilKeycloakService {
    authUrl = environment.keycloak.authURL;
    realm = environment.keycloak.realm;
    clientId = environment.keycloak.clientId;
    pkceMethod = environment.keycloak.pkceMethod;
    redirectUri = environment.keycloak.redirectUri;
    logoutRedirectUri = environment.keycloak.logoutRedirectUri;

    private userProfile?: UserProfile;

    constructor(private keycloak: KeycloakService) {}

    /**
     * use keycloak for authentication is authWithKeyCloak value is 'true'
     */
    useKeyCloakService = environment.authWithKeyCloak === 'true';

    /**
     * Get a valid access token, refreshing if necessary
     */
    getToken = async (): Promise<string> => {
        await this.keycloak.updateToken(30);
        const token = await this.keycloak.getToken();
        if (token) {
            localStorage.setItem('keycloak_token', token);
        }
        return token;
    };

    /**
     * Returns user info decoded from the ID token (not the access token).
     */
    async getUserInfo(): Promise<UserProfile | null> {
        if (this.userProfile) return this.userProfile;

        const keycloakInstance = this.keycloak.getKeycloakInstance();
        const idToken = keycloakInstance.idToken;

        if (!idToken) return null;

        try {
            const decoded = jwtDecode<DecodedIdToken>(idToken);
            this.userProfile = {
                id: decoded.sub,
                email: decoded.email,
                full_name: `${decoded.given_name} ${decoded.family_name}`,
                tenants: decoded.tenants,
            };
            return this.userProfile;
        } catch (error) {
            console.error('Error decoding ID token:', error);
            return null;
        }
    }

    /**
     * Clears user profile info.
     */
    clearCache() {
        this.userProfile = undefined;
    }

    /**
     * Returns true if the user is logged in
     */
    isLoggedIn = async (): Promise<boolean> => {
        return this.keycloak.isLoggedIn();
    };

    /**
     * Trigger Keycloak login redirect
     */
    login = (): Promise<void> => {
        return this.keycloak.login({
            redirectUri: environment.keycloak.redirectUri,
        });
    };

    /**
     * Get the logged-in user's profile
     */
    getUserProfile = (): Promise<any> => {
        return this.keycloak.loadUserProfile();
    };

    /**
     * Trigger Keycloak logout redirect
     */
    logout = async (): Promise<void> => {
        // Clear local cache and tokens before redirecting
        this.clearCache();
        localStorage.removeItem('keycloak_token');
        localStorage.removeItem('KEYCLOAK_IDENTITY');
        return this.keycloak.logout(environment.keycloak.logoutRedirectUri);
    };

    /**
     * Get authorization header for API calls
     */
    getAuthHeader = async (): Promise<string> => {
        try {
            const token = await this.getToken();
            if (!token) {
                return ''; // Return empty string instead of "Bearer null"
            }
            return `Bearer ${token}`;
        } catch (error) {
            console.error('Failed to get auth token:', error);
            return ''; // Return empty string on error
        }
    };

    async getSelectedOrganisationId(): Promise<string | null> {
        const keycloakInstance = this.keycloak.getKeycloakInstance();
        const idToken = keycloakInstance.idToken;

        if (!idToken) return null;

        try {
            const decoded = jwtDecode<DecodedIdToken>(idToken);
            const tenants = decoded.tenants;

            // Check if tenants exists and is an object
            if (!tenants || typeof tenants !== 'object') {
                return null;
            }

            // Get the first tenant's id from the tenants object
            const tenantKeys = Object.keys(tenants);
            if (tenantKeys.length === 0) {
                return null;
            }

            const firstTenant = tenants[tenantKeys[0]];
            if (!firstTenant || !firstTenant.id) {
                return null;
            }

            return firstTenant.id;
        } catch (error) {
            console.error('Error decoding ID token:', error);
            return null;
        }
    }
}

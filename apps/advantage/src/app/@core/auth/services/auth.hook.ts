import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TransitionService } from '@uirouter/core';
import { AuthenticationService } from './authentication.service';
import { SessionService } from './session.service';
import { SilKeycloakService } from '../../../shared/sil-keycloak/keycloak.service';
import { environment } from '../../../../environments/environment';

/**
 * This file contains a Transition Hook which protects a
 * route that requires authentication.
 *
 * This hook redirects to /login when both:
 * - The user is not authenticated
 * - The user is navigating to a state that requires authentication
 */
export function requiresAuthHook(
    transitionService: TransitionService,
    keycloakService: SilKeycloakService
) {
    // Matches if the destination state's data property has a truthy 'requiresAuth' property

    const requiresAuthCriteria = {
        to: state => state.data && state.data.requiresAuth,
    };

    const path = platformId => {
        if (isPlatformBrowser(platformId)) {
            const completeUrl = location.origin + location.pathname;
            return completeUrl;
        }
    };

    const redirectToLogin = transition => {
        if (environment.authWithKeyCloak === 'true') {
            const authenticated = keycloakService.isLoggedIn();
            if (!authenticated) {
                return keycloakService.login();
            }
            return true;
        } else {
            const authService: AuthenticationService = transition
                .injector()
                .get(AuthenticationService);
            const sessionService: SessionService = transition
                .injector()
                .get(SessionService);

            const platformId = transition.injector().get(PLATFORM_ID);
            const pathInfo = path(platformId);
            const $state = transition.router.stateService;

            if (!authService.isAuthenticated()) {
                sessionService.dumpUrl(`${pathInfo}`);
                return $state.target('auth.login', undefined, {
                    location: false,
                });
            }
        }
    };

    // Register the "requires auth" hook with the TransitionsService
    transitionService.onBefore(requiresAuthCriteria, redirectToLogin, {
        priority: 1,
    });
}

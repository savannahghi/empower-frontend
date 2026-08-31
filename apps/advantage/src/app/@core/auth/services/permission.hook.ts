import { TransitionService } from '@uirouter/core';
import { AuthenticationService } from './authentication.service';

/**
 * This file contains a Transition Hook which protects a
 * route that requires authentication.
 *
 * This hook redirects to /login when both:
 * - The user is not authenticated
 * - The user is navigating to a state that requires authentication
 */

export function requiresPermHook(transitionService: TransitionService) {
    // Matches if the destination state's data property has a truthy 'requiresAuthCriteria' property
    const requiresAuthCriteria = {
        to: state => state.data && state.data.permission,
    };

    // Function that returns a redirect for the current transition to the login state
    // if the user is not currently authenticated (according to the AuthService)

    function transitionToError(trans: any) {
        if (trans.router.stateService) {
            trans.router.stateService.transitionTo('auth.error', {
                error: '403',
            });
        }
    }

    const redirectTo403 = transition => {
        const authService: AuthenticationService = transition
            .injector()
            .get(AuthenticationService);

        if (
            !authService.checkPermission(
                transition._targetState._definition.data.permission
            )
        ) {
            transitionToError(transition);
        }
    };

    // Register the "requires auth" hook with the TransitionsService
    transitionService.onSuccess(requiresAuthCriteria, redirectTo403, {
        priority: 1,
    });
}

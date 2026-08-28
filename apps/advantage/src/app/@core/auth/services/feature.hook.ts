import { TransitionService } from '@uirouter/core';
import { NbToastrService } from '@nebular/theme';

/**
 * This file contains a Transition Hook which protects a
 * route that is a feature in still in development.
 *
 * This hook redirects to /home when both:
 * - The user is navigating to a state that a feature in still in development.
 */

export function featureHook(transitionService: TransitionService) {
    // Matches if the destination state's data property has a truthy 'featureHook' property

    const featureFlagCriteria = {
        to: state => state.data && state.data.featureFlag,
    };

    // Function that returns a redirect for the current transition to the login state
    // if the user is not currently authenticated (according to the AuthService)

    const redirectHome = transition => {
        const toastrService: NbToastrService = transition
            .injector()
            .get(NbToastrService);
        const $state = transition.router.stateService;

        const showToast = (position, status, title, message) => {
            const duration = 7000;
            toastrService.show(message, title, {
                position,
                status,
                duration,
            });
        };

        showToast(
            'bottom-right',
            'warning',
            'Coming Soon!',
            'Feature is still under development'
        );
        return $state.target('app.advantage.home', undefined, {
            location: false,
        });
    };

    // Register the "requires auth" hook with the TransitionsService
    transitionService.onBefore(featureFlagCriteria, redirectHome, {
        priority: 1,
    });
}

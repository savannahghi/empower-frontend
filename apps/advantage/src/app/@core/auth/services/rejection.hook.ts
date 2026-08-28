import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TransitionService } from '@uirouter/core';

/**
 * This file contains a Transition Hook which protects a
 * route that has not loaded in the application
 *
 * This hook reloads page when there is a chunking error
 *
 */

export function handleRejectionHook(transitionService: TransitionService) {
    // Matches if the destination state's data property has a truthy 'requiresStateTransitionCriteria' property
    const requiresStateTransitionCriteria = {
        to: state => state,
    };

    // Function that returns a redirect for the current transition to the login state
    // if the user is not currently authenticated (according to the AuthService)

    const checkRejectionMessage = transition => {
        /** Check if error is being caused because of missing chunk */
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        const chunkFailedMessageAlpha = /Loading chunk [\a-z]+/;
        const platformId = transition.injector().get(PLATFORM_ID);
        if (
            transition._error &&
            transition._error.detail &&
            transition._error.detail.message
        ) {
            if (
                chunkFailedMessage.test(transition._error.detail.message) ||
                chunkFailedMessageAlpha.test(transition._error.detail.message)
            ) {
                if (isPlatformBrowser(platformId)) {
                    // Clearing cache (if possible) and force reloading the page
                    if ('caches' in window) {
                        caches.keys().then(keyList => {
                            keyList.forEach(key => {
                                caches.delete(key);
                            });
                        });
                    }
                    window.location.reload();
                }
            }
        }
    };

    // Register the "rejection" hook with the TransitionsService
    transitionService.onError(
        requiresStateTransitionCriteria,
        checkRejectionMessage,
        {
            priority: 1,
        }
    );
}

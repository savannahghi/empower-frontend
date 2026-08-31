import { UIRouter, Category } from '@uirouter/core';
import { stateTransitionHook } from './@core/auth/services/analytics.hook';
import { requiresAuthHook } from './@core/auth/services/auth.hook';
import { requiresPermHook } from './@core/auth/services/permission.hook';
import { handleRejectionHook } from './@core/auth/services/rejection.hook';
import { featureHook } from './@core/auth/services/feature.hook';
import { SilKeycloakService } from './shared/sil-keycloak/keycloak.service';
import { inject } from '@angular/core';
// import { Visualizer } from '@uirouter/visualizer';

/**
 * router config used for the application
 * @param router
 */
export function routerConfigFn(router: UIRouter) {
    const transitionService = router.transitionService;
    const silKeycloakService = inject(SilKeycloakService);
    requiresAuthHook(transitionService, silKeycloakService);
    featureHook(transitionService);
    requiresPermHook(transitionService);
    handleRejectionHook(transitionService);
    stateTransitionHook(transitionService);

    router.trace.enable(Category.TRANSITION);
    // router.plugin(Visualizer);
}

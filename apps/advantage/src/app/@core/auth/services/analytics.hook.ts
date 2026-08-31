import { TransitionService } from '@uirouter/core';
import { environment } from '../../../../environments/environment';
import { AnalyticsService } from '../../utils/analytics.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

/**
 * This file contains a Transition Hook which logs
 * analytic events for state transitions
 *
 * This is achieved when the router detects a state transition
 */
export function stateTransitionHook(transitionService: TransitionService) {
    const analyticsCriteria = {
        to: state => state,
    };

    const path = trans => {
        let withSitePrefix;
        const formattedRoute = trans.$to().url.format(trans.params());
        const platformId = trans.injector().get(PLATFORM_ID);
        if (isPlatformBrowser(platformId)) {
            withSitePrefix = location.pathname + formattedRoute;
        } else {
            withSitePrefix = formattedRoute;
        }
        return `/${withSitePrefix
            .split('/')
            .filter(x => x)
            .join('/')}`;
    };

    function switchApp(value) {
        switch (value) {
            case 'default':
                return 'Slade360 Advantage';
            case 'empower':
                return 'Empower Clinic';
            default:
                return 'Slade360 Advantage';
        }
    }

    /** Function that logs an analytics event */
    const logAnalyticsEvent = transition => {
        const analyticsService: AnalyticsService = transition
            .injector()
            .get(AnalyticsService);
        const platformId = transition.injector().get(PLATFORM_ID);
        const pathInfo = path(transition);
        const state = transition._targetState._definition.self;
        const breadcrumb = state.breadcrumb ? state.breadcrumb() : 'null';
        let value = environment.variant;
        value = switchApp(value);
        const title =
            breadcrumb !== 'null' ? value + ' - ' + breadcrumb : value;
        if (isPlatformBrowser(platformId)) {
            document.title = title;
            analyticsService.logEvent('state_view', {
                path: pathInfo,
                app: state.name.split('.')[1],
                state: state.name,
                url: state.url,
                breadcrumb: breadcrumb,
            });
        }
    };

    /** Register the "analytics" hook with the TransitionsService */
    transitionService.onSuccess(analyticsCriteria, logAnalyticsEvent, {
        priority: -10000,
    });
}

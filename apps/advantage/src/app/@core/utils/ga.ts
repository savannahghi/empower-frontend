import { TransitionService } from '@uirouter/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export function googleAnalyticsHook(transitionService: TransitionService) {
    const vpv = vpath => window['ga']('send', 'pageview', vpath);

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

    const error = trans => {
        const err = trans.error();
        const platformId = trans.injector().get(PLATFORM_ID);
        const type = err && err.hasOwnProperty('type') ? err.type : '_';
        const message =
            err && err.hasOwnProperty('message') ? err.message : '_';
        if (isPlatformBrowser(platformId)) {
            (<any>function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                (i[r] =
                    i[r] ||
                    function () {
                        (i[r].q = i[r].q || []).push(arguments);
                    }),
                    (i[r].l = 1 * <any>new Date());
                (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m);
            })(
                window,
                document,
                'script',
                '//www.google-analytics.com/analytics.js',
                'ga'
            );
            vpv(
                path(trans) + ';errorType=' + type + ';errorMessage=' + message
            );
        }
    };

    transitionService.onSuccess({}, trans => vpv(path(trans)), {
        priority: -10000,
    });
    transitionService.onError({}, trans => error(trans), { priority: -10000 });
}

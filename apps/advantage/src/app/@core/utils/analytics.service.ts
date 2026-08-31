import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Authorization } from '../auth/services/authorization.service';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { getAnalytics, logEvent, isSupported } from '@angular/fire/analytics';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AnalyticsService {
    public enabled: boolean;
    private firebaseReady = false;
    public ga: any;
    public user: any = {};
    public analytics: any;
    public gaGetAnalytics = getAnalytics;
    public gaLogEvent = logEvent;
    public gaIsSupported = isSupported;

    constructor(
        private location: Location,
        public router: Router,
        public authConfig: Authorization,
        @Optional() analytics: AngularFireAnalytics,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.enabled = false;
        this.firebaseReady = !!analytics;

        const user = this.authConfig.getUser();
        const org = this.authConfig.getOrganisation();
        if (analytics && user && org && isPlatformBrowser(this.platformId)) {
            analytics.setUserProperties({
                email: user.email,
                slade_code: user.business_partner,
                bp_type: user.bp_type,
                org_name: org.organisation_name,
            });
        }
    }

    navigateEndFn = event => event instanceof NavigationEnd;

    sendEvent = () => {
        this.ga('send', { hitType: 'pageview', page: this.location.path() });
    };

    logEvent = (eventName, params?) => {
        // getAnalytics() throws when no Firebase app was initialised.
        if (!this.firebaseReady) return;
        if (this.gaIsSupported() && isPlatformBrowser(this.platformId)) {
            const analytics = this.gaGetAnalytics();
            this.gaLogEvent(analytics, eventName, params);
        }
    };

    trackPageViews() {
        if (this.enabled && isPlatformBrowser(this.platformId)) {
            this.router.events
                .pipe(filter(this.navigateEndFn))
                .subscribe(this.sendEvent);
        }
    }

    trackEvent(eventName: string) {
        if (this.enabled && isPlatformBrowser(this.platformId)) {
            this.ga('send', 'event', eventName);
        }
    }
}

import { Injectable, NgZone } from '@angular/core';
import { environment } from 'environments/environment';
import posthog from 'posthog-js';

@Injectable({
    providedIn: 'root',
})
export class PosthogService {
    constructor(private ngZone: NgZone) {
        this.initPostHog();
    }
    private initPostHog() {
        if (environment.posthogKey) {
            this.ngZone.runOutsideAngular(() => {
                posthog.init(
                    environment.posthogKey,
                    {
                        api_host: environment.posthogHost,
                        defaults: '2026-01-30',
                    },
                    'empower'
                );
            });
        }
    }
}

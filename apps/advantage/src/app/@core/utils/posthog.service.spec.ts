import { TestBed } from '@angular/core/testing';

import { PosthogService } from './posthog.service';
import { environment } from 'environments/environment';
import { NgZone } from '@angular/core';
import posthog from 'posthog-js';

describe('PosthogService', () => {
    let ngZone: NgZone;

    const originalPosthogKey = environment.posthogKey;

    beforeEach(() => {
        spyOn(posthog, 'init');

        TestBed.configureTestingModule({
            providers: [PosthogService],
        });
        ngZone = TestBed.inject(NgZone);
        spyOn(ngZone, 'runOutsideAngular').and.callFake((fn: Function) => fn());
    });

    afterEach(() => {
        (environment as any).posthogKey = originalPosthogKey;
    });

    it('should initialize PostHog when the key is present', () => {
        TestBed.inject(PosthogService);

        expect(ngZone.runOutsideAngular).toHaveBeenCalled();
        expect(posthog.init).toHaveBeenCalled();
    });

    it('should NOT initialize PostHog if the key is missing', () => {
        (environment as any).posthogKey = '';

        expect(ngZone.runOutsideAngular).not.toHaveBeenCalled();
        expect(posthog.init).not.toHaveBeenCalled();
    });
});

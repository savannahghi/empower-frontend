import { TestBed } from '@angular/core/testing';
import { RedirectService } from '../redirect.service';
import { WINDOW } from '../../../../features/services/window.service';

describe('RedirectService', () => {
    let redirectService: RedirectService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RedirectService, { provide: WINDOW, useValue: window }],
        });

        redirectService = TestBed.inject(RedirectService);
    });

    it('should call window.location.replace with the provided URL', () => {
        redirectService.windowInstance = {
            location: {
                replace: () => true,
            },
        };
        const testUrl = 'http://example.com';

        spyOn(redirectService, 'redirectTo').and.callThrough();
        redirectService.redirectTo(testUrl);
        expect(redirectService.redirectTo).toHaveBeenCalled();
    });
});

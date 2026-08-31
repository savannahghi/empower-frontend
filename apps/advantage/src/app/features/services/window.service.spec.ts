import {
    WINDOW,
    WindowRef,
    BrowserWindowRef,
    windowFactory,
} from './window.service';
import { PLATFORM_ID } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { isPlatformBrowser } from '@angular/common';

class TestWindowRef extends WindowRef {}

describe('Window Service', () => {
    let windowRef: WindowRef;
    let platformId: Object;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: PLATFORM_ID, useValue: 'browser' },
                { provide: WindowRef, useClass: BrowserWindowRef },
                {
                    provide: WINDOW,
                    useFactory: windowFactory,
                    deps: [WindowRef, PLATFORM_ID],
                },
            ],
        });

        windowRef = TestBed.inject(WindowRef);
        platformId = TestBed.inject(PLATFORM_ID);
    });

    describe('WindowRef', () => {
        it('should throw an error when accessing nativeWindow directly on WindowRef', () => {
            const directWindowRef = new TestWindowRef();
            expect(() => directWindowRef.nativeWindow).toThrowError(
                'Not implemented.'
            );
        });
    });

    describe('BrowserWindowRef', () => {
        it('should return the native window object when in the browser', () => {
            const browserWindowRef = new BrowserWindowRef();
            expect(browserWindowRef.nativeWindow).toBe(window);
        });
    });

    describe('windowFactory', () => {
        it('should return native window if platform is browser', () => {
            const result = windowFactory(
                windowRef as BrowserWindowRef,
                'browser'
            );
            expect(result).toBe(window);
        });

        it('should return an empty object if platform is server', () => {
            const result = windowFactory(
                windowRef as BrowserWindowRef,
                'server'
            );
            expect(result).toEqual({});
        });

        it('should use the provided WINDOW token', inject(
            [WINDOW],
            injectedWindow => {
                if (isPlatformBrowser(platformId)) {
                    expect(injectedWindow).toBe(window);
                } else {
                    expect(injectedWindow).toEqual({});
                }
            }
        ));
    });
});

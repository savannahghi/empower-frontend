import {
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InviewDirective } from './inview.directive';

describe('InViewDirective', () => {
    let directive: InviewDirective;
    let elementRef: ElementRef;
    let observerCallback: IntersectionObserverCallback;
    let mockObserver: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [InviewDirective],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });

        const mockElement = document.createElement('div');
        elementRef = new ElementRef(mockElement);

        // Mock IntersectionObserver to capture the callback
        mockObserver = {
            observe: jasmine.createSpy('observe'),
            unobserve: jasmine.createSpy('unobserve'),
            disconnect: jasmine.createSpy('disconnect'),
        };

        // Mock IntersectionObserver as a constructor function
        (window as any).IntersectionObserver = function (
            callback: IntersectionObserverCallback
        ) {
            observerCallback = callback;
            return mockObserver;
        };

        directive = new InviewDirective(elementRef);
    });

    it('should test inview directive', () => {
        expect(directive).toBeTruthy();
    });

    it('should emit true when element is intersecting', done => {
        // Subscribe to the inView output
        directive.inView.subscribe((isIntersecting: boolean) => {
            expect(isIntersecting).toBe(true);
            done();
        });

        // Simulate IntersectionObserver callback with intersecting entry
        const mockEntry = {
            isIntersecting: true,
            target: elementRef.nativeElement,
        } as IntersectionObserverEntry;

        observerCallback([mockEntry], mockObserver);
    });

    it('should emit false when element is not intersecting', done => {
        // Subscribe to the inView output
        directive.inView.subscribe((isIntersecting: boolean) => {
            expect(isIntersecting).toBe(false);
            done();
        });

        // Simulate IntersectionObserver callback with non-intersecting entry
        const mockEntry = {
            isIntersecting: false,
            target: elementRef.nativeElement,
        } as IntersectionObserverEntry;

        observerCallback([mockEntry], mockObserver);
    });

    it('should observe element on initialization', () => {
        expect(mockObserver.observe).toHaveBeenCalledWith(
            elementRef.nativeElement
        );
    });

    it('should disconnect observer on destroy', () => {
        directive.ngOnDestroy();
        expect(mockObserver.disconnect).toHaveBeenCalled();
    });
});

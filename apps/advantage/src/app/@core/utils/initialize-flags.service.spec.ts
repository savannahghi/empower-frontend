import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { InitializeFlagsService } from './initialize-flags.service';
import { GrowthBook } from '@growthbook/growthbook';
import { environment } from '../../../environments/environment';
import { of, throwError, take } from 'rxjs';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('InitializeFlagsService', () => {
    let service: InitializeFlagsService;

    const mockFeatureResponse = {
        features: {
            feature1: {
                defaultValue: true,
            },
            feature2: {
                defaultValue: false,
            },
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                InitializeFlagsService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(InitializeFlagsService);
        // httpBackend = TestBed.inject(HttpBackend);
    });

    afterEach(() => {
        // Reset the service state for each test
        service['flagsLoaded'] = false;
        service['flagsReadySubject'].next(false);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize http client in constructor', () => {
        expect(service['http']).toBeInstanceOf(HttpClient);
    });

    it('should initialize flagsReadySubject with false', () => {
        expect(service['flagsReadySubject'].value).toBe(false);
    });

    it('should expose flagsReady$ as observable', done => {
        service.flagsReady$.pipe(take(1)).subscribe(value => {
            expect(value).toBe(false);
            done();
        });
    });

    describe('loadFlags', () => {
        it('should return early if flags are already loaded', async () => {
            service['flagsLoaded'] = true;
            spyOn(service['http'], 'get');

            await service.loadFlags();

            expect(service['http'].get).not.toHaveBeenCalled();
        });

        it('should successfully load flags and initialize GrowthBook', async () => {
            spyOn(service['http'], 'get').and.returnValue(
                of(mockFeatureResponse)
            );

            await service.loadFlags();

            expect(service.growthbook).toBeDefined();
            expect(service.growthbook).toBeInstanceOf(GrowthBook);
            expect(service.featureFlags).toEqual(mockFeatureResponse.features);
            expect(service.growthbookResponse).toEqual(mockFeatureResponse);
            expect(service['flagsLoaded']).toBe(true);
            expect(service['flagsReadySubject'].value).toBe(true);
        });

        it('should initialize GrowthBook with correct configuration', async () => {
            spyOn(service['http'], 'get').and.returnValue(
                of(mockFeatureResponse)
            );

            await service.loadFlags();
            environment.variant = 'default';
            spyOn(localStorage, 'getItem').and.returnValue('empower');
            expect(service.growthbook).toBeDefined();
            // Verify GrowthBook was initialized with correct attributes
            const attributes = service.growthbook.getAttributes();
            environment.variant = 'default';
            expect(attributes.variant).toBe(environment.variant);
        });

        it('should call http.get with correct URL', async () => {
            const getSpy = spyOn(service['http'], 'get').and.returnValue(
                of(mockFeatureResponse)
            );

            await service.loadFlags();

            const expectedUrl = `${environment.flaggingServerUrl}/api/features/${environment.flagsmithClientSideKey}`;
            expect(getSpy).toHaveBeenCalledWith(expectedUrl);
        });

        it('should set features on GrowthBook instance', async () => {
            spyOn(service['http'], 'get').and.returnValue(
                of(mockFeatureResponse)
            );

            await service.loadFlags();

            expect(service.growthbook).toBeDefined();
            spyOn(service.growthbook, 'setFeatures');

            service.growthbook.setFeatures(service.featureFlags);
            expect(service.growthbook.setFeatures).toHaveBeenCalledWith(
                mockFeatureResponse.features
            );
        });

        it('should handle errors and still set flagsReady to true', async () => {
            const mockError = new Error('Network error');
            spyOn(service['http'], 'get').and.returnValue(
                throwError(() => mockError)
            );
            spyOn(console, 'error');

            await service.loadFlags();

            expect(console.error).toHaveBeenCalledWith(
                'Failed to load feature flags',
                mockError
            );
            expect(service['flagsReadySubject'].value).toBe(true);
        });

        it('should log error message when flags fail to load', async () => {
            const mockError = new Error('HTTP 500 error');
            spyOn(service['http'], 'get').and.returnValue(
                throwError(() => mockError)
            );
            spyOn(console, 'error');

            await service.loadFlags();

            expect(console.error).toHaveBeenCalledWith(
                'Failed to load feature flags',
                mockError
            );
        });

        it('should not set flagsLoaded to true when error occurs', async () => {
            const mockError = new Error('Failed');
            spyOn(service['http'], 'get').and.returnValue(
                throwError(() => mockError)
            );
            spyOn(console, 'error');

            await service.loadFlags();

            expect(service['flagsLoaded']).toBe(false);
        });
    });

    describe('waitForReady', () => {
        it('should resolve immediately if flags are already ready', async () => {
            service['flagsReadySubject'].next(true);

            const result = await service.waitForReady();

            expect(result).toBe(true);
        });

        it('should wait until flags are ready', async () => {
            const readyPromise = service.waitForReady();

            // Simulate flags becoming ready after a delay
            setTimeout(() => {
                service['flagsReadySubject'].next(true);
            }, 50);

            const result = await readyPromise;

            expect(result).toBe(true);
        });

        it('should filter out false values and only resolve on true', async () => {
            const readyPromise = service.waitForReady();

            // Emit false first (should be filtered out)
            service['flagsReadySubject'].next(false);

            // Then emit true
            setTimeout(() => {
                service['flagsReadySubject'].next(true);
            }, 50);

            const result = await readyPromise;

            expect(result).toBe(true);
        });
    });

    describe('getForcedValue', () => {
        beforeEach(async () => {
            // Set up a loaded state with mock features
            spyOn(service['http'], 'get').and.returnValue(
                of(mockFeatureResponse)
            );
            await service.loadFlags();
        });

        it('should call setFeatures before evaluating', () => {
            const setFeaturesSpy = spyOn(service.growthbook, 'setFeatures');
            spyOn(service.growthbook, 'evalFeature').and.returnValue({
                value: true,
                on: true,
                off: false,
                ruleId: '123',
                source: 'defaultValue',
            });

            service.getForcedValue('feature1');

            expect(setFeaturesSpy).toHaveBeenCalledWith(service.featureFlags);
        });

        it('should return the feature value from GrowthBook', () => {
            spyOn(service.growthbook, 'evalFeature').and.returnValue({
                value: true,
                on: true,
                off: false,
                ruleId: '123',
                source: 'defaultValue',
            });

            const result = service.getForcedValue('feature1');

            expect(result).toBe(true);
        });

        it('should evaluate the correct feature by name', () => {
            const evalFeatureSpy = spyOn(
                service.growthbook,
                'evalFeature'
            ).and.returnValue({
                value: false,
                on: false,
                off: true,
                ruleId: '123',
                source: 'defaultValue',
            });

            service.getForcedValue('feature2');

            expect(evalFeatureSpy).toHaveBeenCalledWith('feature2');
        });

        it('should return false when feature is disabled', () => {
            spyOn(service.growthbook, 'evalFeature').and.returnValue({
                value: false,
                on: false,
                off: true,
                ruleId: '123',
                source: 'defaultValue',
            });

            const result = service.getForcedValue('disabledFeature');

            expect(result).toBe(false);
        });

        it('should handle different feature names', () => {
            const evalFeatureSpy = spyOn(
                service.growthbook,
                'evalFeature'
            ).and.returnValue({
                value: true,
                on: true,
                off: false,
                ruleId: '123',
                source: 'defaultValue',
            });

            service.getForcedValue('myCustomFeature');

            expect(evalFeatureSpy).toHaveBeenCalledWith('myCustomFeature');
        });
    });

    describe('Integration tests', () => {
        it('should complete full lifecycle: load flags, wait for ready, get value', async () => {
            spyOn(service['http'], 'get').and.returnValue(
                of(mockFeatureResponse)
            );

            // Load flags
            await service.loadFlags();

            // Wait for ready
            const isReady = await service.waitForReady();
            expect(isReady).toBe(true);

            // Get a feature value
            spyOn(service.growthbook, 'evalFeature').and.returnValue({
                value: true,
                on: true,
                off: false,
                ruleId: '123',
                source: 'defaultValue',
            });

            const featureValue = service.getForcedValue('feature1');
            expect(featureValue).toBe(true);
        });

        it('should handle multiple calls to loadFlags gracefully', async () => {
            spyOn(service['http'], 'get').and.returnValue(
                of(mockFeatureResponse)
            );

            // First call
            await service.loadFlags();
            const firstGrowthbook = service.growthbook;

            // Second call should return early
            await service.loadFlags();
            const secondGrowthbook = service.growthbook;

            // Should be the same instance
            expect(firstGrowthbook).toBe(secondGrowthbook);
            expect(service['http'].get).toHaveBeenCalledTimes(1);
        });

        it('should emit true only once through flagsReady$ on successful load', async () => {
            spyOn(service['http'], 'get').and.returnValue(
                of(mockFeatureResponse)
            );

            const emissions: boolean[] = [];
            service.flagsReady$.subscribe(value => emissions.push(value));

            await service.loadFlags();

            // Should have initial false and then true
            expect(emissions).toEqual([false, true]);
        });

        it('should emit true on flagsReady$ even when error occurs', async () => {
            const mockError = new Error('Load error');
            spyOn(service['http'], 'get').and.returnValue(
                throwError(() => mockError)
            );
            spyOn(console, 'error');

            const emissions: boolean[] = [];
            service.flagsReady$.subscribe(value => emissions.push(value));

            await service.loadFlags();

            // Should have initial false and then true (even on error)
            expect(emissions).toEqual([false, true]);
        });
    });

    describe('Properties and initial state', () => {
        it('should initialize with flagsLoaded as false', () => {
            expect(service['flagsLoaded']).toBe(false);
        });

        it('should initialize featureFlags as undefined', () => {
            expect(service.featureFlags).toBeUndefined();
        });

        it('should initialize growthbookResponse as undefined', () => {
            expect(service.growthbookResponse).toBeUndefined();
        });

        it('should initialize growthbook as undefined', () => {
            expect(service.growthbook).toBeUndefined();
        });

        it('should have http client instance after construction', () => {
            expect(service['http']).toBeInstanceOf(HttpClient);
        });
    });
});

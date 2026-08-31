import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';
import { GrowthBook } from '@growthbook/growthbook';
import { environment } from '../../../environments/environment';

const apiUrl = environment.flaggingServerUrl;
const clientKey = environment.flagsmithClientSideKey;
const envVariant = environment.variant; // Replace with your GrowthBook client key

@Injectable({
    providedIn: 'root',
})
export class InitializeFlagsService {
    /** contains the growthbook instance */
    growthbook: GrowthBook;
    private http: HttpClient;
    private flagsLoaded = false;
    /** contains the flags */
    featureFlags: any;
    growthbookResponse: any;

    // 1. Create a BehaviorSubject to track state
    private flagsReadySubject = new BehaviorSubject<boolean>(false);

    // 2. Expose it as an observable for components to subscribe to
    public flagsReady$ = this.flagsReadySubject.asObservable();

    // Inject HttpBackend to bypass interceptors
    constructor(private handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }

    async loadFlags(): Promise<void> {
        if (this.flagsLoaded) return;

        // Replace with your actual GrowthBook URL/logic
        // Using this.http here ensures no AuthInterceptor is triggered
        try {
            this.growthbook = new GrowthBook({
                apiHost: apiUrl,
                clientKey: clientKey,
                // Enable easier debugging during development
                enableDevMode: true,
                // Update the instance in realtime as features change in GrowthBook
                subscribeToChanges: true,
                attributes: {
                    /** Set variant among the attributes */
                    variant: envVariant,
                },
            });
            const response = await firstValueFrom(
                this.http.get<any>(`${apiUrl}/api/features/${clientKey}`)
            );
            this.featureFlags = response.features;
            this.growthbookResponse = response;
            this.growthbook.setFeatures(this.featureFlags);
            this.flagsLoaded = true;
            this.flagsReadySubject.next(true);
        } catch (error) {
            console.error('Failed to load feature flags', error);
            this.flagsReadySubject.next(true);
        }
    }

    // Helper to wait as a Promise
    waitForReady(): Promise<boolean> {
        return firstValueFrom(
            this.flagsReady$.pipe(filter(isReady => isReady === true))
        );
    }

    // Your existing method
    getForcedValue(featureName: string): boolean {
        this.growthbook.setFeatures(this.featureFlags);
        const feat = this.growthbook.evalFeature(featureName).value;
        return feat;
    }
}

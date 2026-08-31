import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GrowthBook } from '@growthbook/growthbook';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VariantPipe } from '../../@theme/pipes/variant/variant.pipe';
import { Authorization } from '../auth/services/authorization.service';

const apiUrl = environment.flaggingServerUrl; // Replace with your GrowthBook CDN URL
const clientKey = environment.flagsmithClientSideKey; // Replace with your GrowthBook client key
const envVariant = environment.variant; // Replace with your GrowthBook client key

@Injectable({
    providedIn: 'root',
})
export class FeatureFlagService {
    /** contains the growthbook instance */
    growthbook: GrowthBook;
    /** contains the flags */
    featureFlags: any;
    /** Used to know when feature flags have been loaded */
    featuresLoaded: boolean;
    /**
     * Used to emit flag information
     */
    flagsLoadedEmitter: Subject<any>;

    constructor(
        private httpClient: HttpClient,
        public variantPipe: VariantPipe,
        public authConfig: Authorization
    ) {
        this.flagsLoadedEmitter = new Subject();
        this.featuresLoaded = false;
        this.setupFlagging();
    }

    setupFlagging() {
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
                /** Set slade code among the attributes */
                bpCode: this.authConfig.getUser()?.business_partner,
                userGuid: this.authConfig.getUser()?.guid,
                email: this.authConfig.getUser()?.email,
            },
        });
        this.httpClient
            .get(`${apiUrl}/api/features/${clientKey}`)
            .subscribe({ next: this.receiveFlags });
    }

    receiveFlags = response => {
        this.featureFlags = response.features;
        this.growthbook.setFeatures(this.featureFlags);
        this.featuresLoaded = true;
        this.flagsLoadedEmitter.next(this);
    };

    isFeatureOn(featureName: string) {
        return this.growthbook.isOn(featureName);
    }

    /**
     * Get the evaluated value of a feature flag
     * Uses GrowthBook's evaluation engine to handle rules and conditions
     * @param featureName - The name of the feature flag
     * @param defaultValue - Optional fallback value if feature not loaded
     * @returns The evaluated feature value
     */
    getForcedValue(featureName: string, defaultValue?: any) {
        if (this.featuresLoaded) {
            // Ensure features are set before evaluation
            this.growthbook.setFeatures(this.featureFlags);
            const result = this.growthbook.evalFeature(featureName);
            return result.value ?? defaultValue;
        }
        return defaultValue;
    }

    checkVariantFlag(nodeValue) {
        if (this.featuresLoaded) {
            // loads default value
            const featureValue = this.getForcedValue(nodeValue);
            if (
                featureValue !== undefined &&
                !this.variantPipe.transform(featureValue)
            ) {
                return false;
            } else {
                return true;
            }
        }
    }
}

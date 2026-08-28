import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '../../app-config.service';
import { DataLayerUtils } from '../auth/services/datalayer.utils.service';
import { Oauth2Service } from '../auth/services/oauth2.service';
import { FeatureFlagService } from './feature.service';
import { VariantPipe } from '../../@theme/pipes/variant/variant.pipe';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { Authorization } from '../auth/services/authorization.service';

class PipeStub {
    transform() {
        return true;
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    setUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getWorkstation() {
        return {};
    }
    getUser() {
        return {
            business_partner: '334',
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
            organisation: '123',
        };
    }
}

describe('FeatureFlagService', () => {
    let service: FeatureFlagService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [],
            providers: [
                FeatureFlagService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(FeatureFlagService);
    });

    it('should test methods', () => {
        spyOn(service, 'isFeatureOn').and.callThrough();
        service.isFeatureOn('setting');
        service.receiveFlags({
            features: { prov_someFeature: { defaultValue: 'default' } },
        });
        service.checkVariantFlag('prov_someFeature');
        expect(service.isFeatureOn).toHaveBeenCalled();
    });

    it('should test getForcedValue', () => {
        spyOn(service, 'getForcedValue').and.callThrough();
        service.receiveFlags({
            features: { prov_someFeature: { defaultValue: 'default' } },
        });
        service.getForcedValue('prov_someFeature');
        expect(service.getForcedValue).toHaveBeenCalled();
    });

    it('should return defaultValue when result.value is null or undefined', () => {
        service.receiveFlags({
            features: { prov_someFeature: { defaultValue: null } },
        });
        spyOn(service.growthbook, 'evalFeature').and.returnValue({
            value: null,
            source: 'defaultValue',
            on: false,
            off: true,
            ruleId: '',
        });
        const result = service.getForcedValue('prov_someFeature', 'fallback');
        expect(result).toBe('fallback');
    });

    it('should return defaultValue when features are not loaded', () => {
        service.featuresLoaded = false;
        const result = service.getForcedValue('prov_someFeature', 'fallback');
        expect(result).toBe('fallback');
    });
});

class PipeStub2 {
    transform() {
        return false;
    }
}

describe('FeatureFlagService checkVariant returns false', () => {
    let service: FeatureFlagService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [],
            providers: [
                FeatureFlagService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: VariantPipe,
                    useClass: PipeStub2,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(FeatureFlagService);
    });

    it('should test methods', () => {
        spyOn(service, 'isFeatureOn').and.callThrough();
        spyOn(service, 'getForcedValue').and.returnValue('someValue');
        service.isFeatureOn('setting');
        service.receiveFlags({
            features: {
                prov_someFeature: { defaultValue: 'default' },
                prov_someOtherFeature: {
                    defaultValue: 'default',
                    rules: [{ force: 'default' }],
                },
            },
        });
        const result1 = service.checkVariantFlag('prov_someFeature');
        const result2 = service.checkVariantFlag('prov_someOtherFeature');
        expect(service.isFeatureOn).toHaveBeenCalled();
        expect(result1).toBe(false);
        expect(result2).toBe(false);
    });
});

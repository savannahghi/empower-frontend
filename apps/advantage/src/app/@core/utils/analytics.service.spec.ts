import { AnalyticsService } from './analytics.service';
import { TestBed } from '@angular/core/testing';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Authorization } from '../auth/services/authorization.service';
import { environment } from '../../../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AppConfigService } from '../../app-config.service';
import { DataLayerUtils } from '../auth/services/datalayer.utils.service';
import { Oauth2Service } from '../auth/services/oauth2.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class AuthorizationConfigStub {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class AuthorizationConfigStub2 {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrganisation() {
        return false;
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class NbLayoutDirectionServStub {
    changeLayoutSize() {
        return {};
    }
    getDirection() {
        return of([{ currentBreakpoint: { width: {} } }, {}]);
    }
}

class NbLayoutDirectionStub {
    changeLayoutSize() {
        return {};
    }
}

describe('AnalyticsService', () => {
    let service: AnalyticsService;
    let navEnd;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [
                RouterTestingModule,
                AngularFireModule.initializeApp(
                    environment.firebase,
                    'random-app'
                ),
                AngularFireAnalyticsModule,
            ],
            providers: [
                AnalyticsService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: NbLayoutDirectionService,
                    useClass: NbLayoutDirectionServStub,
                },
                { provide: NbLayoutDirection, useClass: NbLayoutDirectionStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(AnalyticsService);
    });

    it('should test methods', () => {
        const event = new Event('event_name');
        service.ga = () => {};
        spyOn(service, 'trackEvent').and.callThrough();
        service.trackPageViews();
        service.trackEvent('event');
        service.enabled = true;
        service.navigateEndFn(event);
        service.navigateEndFn(navEnd);
        service.trackPageViews();
        expect(service.trackEvent).toHaveBeenCalled();
    });
    it('should test trackEvent', () => {
        service.ga = () => {};
        service.enabled = true;
        spyOn(service, 'trackEvent').and.callThrough();
        service.trackEvent('event');
        expect(service.trackEvent).toHaveBeenCalled();
    });
    it('should test subscribe', () => {
        spyOn(service, 'sendEvent').and.callThrough();
        service.ga = () => {};
        const complete = () => {};
        const callbacks = [complete];
        service.router.events.pipe().subscribe(...callbacks);
        service.sendEvent();
        expect(service.sendEvent).toHaveBeenCalled();
    });
});

describe('AnalyticsService without Login', () => {
    let service: AnalyticsService;
    let navEnd;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [
                RouterTestingModule,
                AngularFireModule.initializeApp(
                    environment.firebase,
                    'random-app'
                ),
                AngularFireAnalyticsModule,
            ],
            providers: [
                AnalyticsService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: NbLayoutDirectionService,
                    useClass: NbLayoutDirectionServStub,
                },
                { provide: NbLayoutDirection, useClass: NbLayoutDirectionStub },
                { provide: Authorization, useClass: AuthorizationConfigStub2 },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(AnalyticsService);
    });

    it('should test methods', () => {
        const event = new Event('event_name');
        service.ga = () => {};
        spyOn(service, 'trackEvent').and.callThrough();
        service.trackPageViews();
        service.trackEvent('event');
        service.enabled = true;
        service.navigateEndFn(event);
        service.navigateEndFn(navEnd);
        service.trackPageViews();
        expect(service.trackEvent).toHaveBeenCalled();
    });
    it('should test trackEvent', () => {
        service.ga = () => {};
        service.enabled = true;
        spyOn(service, 'trackEvent').and.callThrough();
        spyOn(service, 'gaGetAnalytics');
        spyOn(service, 'gaLogEvent');
        service.logEvent('test_event');
        service.trackEvent('event');
        expect(service.trackEvent).toHaveBeenCalled();
    });
    it('should test subscribe', () => {
        service.ga = () => {};
        const complete = () => {};
        const callbacks = [complete];
        service.router.events.pipe().subscribe(...callbacks);
        spyOn(service, 'sendEvent').and.callThrough();
        service.sendEvent();
        expect(service.sendEvent).toHaveBeenCalled();
    });
});

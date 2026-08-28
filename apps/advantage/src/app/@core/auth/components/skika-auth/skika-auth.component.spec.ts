import { Pipe, PipeTransform } from '@angular/core';
import { SkikaAuthComponent } from './skika-auth.component';
import { Location } from '@angular/common';
import {
    NbAuthService,
    NbTokenService,
    NbTokenStorage,
    NbAuthStrategy,
} from '@nebular/auth';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { StateService, Transition } from '@uirouter/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { FeatureFlagService } from '../../../utils/feature.service';

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

class CookieServiceStub {
    setLanguageCookie() {
        return 'en';
    }
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class NbTokenStorageStub {
    get() {
        return {};
    }
}

class NbAuthServiceStub {
    onAuthenticationChange() {
        return of({});
    }
}

class LocationStub {
    back() {
        return false;
    }
}

class RouterStub {
    navigateByUrl() {
        return of(() => {});
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class FeatureFlagServiceStub {
    isFeatureOn() {
        return false;
    }
}

describe('SkikaAuthComponent', () => {
    let component: SkikaAuthComponent;
    let fixture: ComponentFixture<SkikaAuthComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaAuthComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('featureFlag'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                NbAuthService,
                NbTokenService,
                NbAuthStrategy,
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbTokenStorage, useClass: NbTokenStorageStub },
                { provide: NbAuthService, useClass: NbAuthServiceStub },
                { provide: Location, useClass: LocationStub },
                { provide: Router, useClass: RouterStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaAuthComponent);
        component = fixture.componentInstance;
    });

    it('should call main methods', () => {
        component.ngOnInit();
        component.back();
        component.setLanguageCookie('en');
        component.ngOnDestroy();
        expect(component.location).toBeTruthy();
    });

    it('should initialize component properties with correct default values', () => {
        expect(component.alive).toBe(true);
        expect(component.authenticated).toBe(false);
        expect(component.formToggle).toBe(false);
        expect(component.token).toBe('');
        expect(component.links).toEqual(['']);
    });

    it('should initialize variant property from environment', () => {
        expect(component.variant).toBeDefined();
    });

    it('should initialize location and $state in constructor', () => {
        const location = TestBed.inject(Location);
        const stateService = TestBed.inject(StateService);

        expect(component.location).toBe(location);
        expect(component.$state).toBe(stateService);
    });

    it('should set fallback language and use selected language in constructor', () => {
        const translateService = TestBed.inject(TranslateService);
        spyOn(translateService, 'setFallbackLang');
        spyOn(translateService, 'use');
        // Create a new component to trigger constructor
        const newFixture = TestBed.createComponent(SkikaAuthComponent);
        const newComponent = newFixture.componentInstance;
        newComponent.ngOnInit();
        expect(translateService.setFallbackLang).toHaveBeenCalledWith('en');
        expect(translateService.use).toHaveBeenCalledWith('en');
    });

    it('should get selected language from cookie service in constructor', () => {
        expect(component.selectedLanguage).toBe('en');
    });

    it('should call location.back() when back method is called', () => {
        const location = TestBed.inject(Location);
        spyOn(location, 'back');
        const result = component.back();
        expect(location.back).toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('should return false when enabledKeycloak getter is called and feature is disabled', () => {
        const featureFlagService = TestBed.inject(FeatureFlagService);
        spyOn(featureFlagService, 'isFeatureOn').and.returnValue(false);
        const result = component.enabledKeycloak;
        expect(featureFlagService.isFeatureOn).toHaveBeenCalledWith(
            'prov_authenticationSetKeyCloakToTrue'
        );
        expect(result).toBe(false);
    });

    it('should return true when enabledKeycloak getter is called and feature is enabled', () => {
        const featureFlagService = TestBed.inject(FeatureFlagService);
        spyOn(featureFlagService, 'isFeatureOn').and.returnValue(true);
        const result = component.enabledKeycloak;
        expect(featureFlagService.isFeatureOn).toHaveBeenCalledWith(
            'prov_authenticationSetKeyCloakToTrue'
        );
        expect(result).toBe(true);
    });

    it('should update selectedLanguage and call translate.use in setLanguageCookie', () => {
        const translateService = TestBed.inject(TranslateService);
        const cookieService = TestBed.inject(Cookies);
        spyOn(cookieService, 'setLanguageCookie').and.returnValue('fr');
        spyOn(translateService, 'use');

        component.setLanguageCookie('fr');

        expect(cookieService.setLanguageCookie).toHaveBeenCalledWith('fr');
        expect(component.selectedLanguage).toBe('fr');
        expect(translateService.use).toHaveBeenCalledWith('fr');
    });

    it('should set alive to false on ngOnDestroy', () => {
        component.alive = true;
        component.ngOnDestroy();
        expect(component.alive).toBe(false);
    });
});

describe('SkikaAuthComponent without cookie', () => {
    let component: SkikaAuthComponent;
    let fixture: ComponentFixture<SkikaAuthComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaAuthComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('featureFlag'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                NbAuthService,
                NbTokenService,
                NbAuthStrategy,
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbTokenStorage, useClass: NbTokenStorageStub },
                { provide: NbAuthService, useClass: NbAuthServiceStub },
                { provide: Location, useClass: LocationStub },
                { provide: Router, useClass: RouterStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaAuthComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

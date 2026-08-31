import { TestBed } from '@angular/core/testing';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { Cookies } from './cookie.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class CookieServiceStub {
    set() {
        return 'en';
    }
    get() {
        return 'en';
    }
    check() {
        return true;
    }
}
describe('Cookies', () => {
    let service: Cookies;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: SsrCookieService, useClass: CookieServiceStub },
                { provide: PLATFORM_ID, useValue: 'browser' },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(Cookies);
    });

    it('should test setLanguageCookie', () => {
        spyOn(service, 'setLanguageCookie').and.callThrough();
        service.setLanguageCookie('en');
        expect(service.setLanguageCookie).toHaveBeenCalled();
    });

    it('should test getLanguageCookie', () => {
        spyOn(service, 'getLanguageCookie').and.callThrough();
        service.getLanguageCookie();
        expect(service.getLanguageCookie).toHaveBeenCalled();
    });
});

class CookieServiceStub2 {
    get() {
        return 'en';
    }
    check() {
        return false;
    }
    set() {
        return 'en';
    }
    delete() {
        return 'en';
    }
}
describe('No stored Cookies', () => {
    let service: Cookies;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: SsrCookieService, useClass: CookieServiceStub2 },
                { provide: PLATFORM_ID, useValue: 'browser' },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(Cookies);
    });

    it('should test getLanguageCookie when check returns false', () => {
        spyOn(service, 'getLanguageCookie').and.callThrough();
        service.getLanguageCookie();
        expect(service.getLanguageCookie).toHaveBeenCalled();
    });
});
class CookieServiceStubCheckTrue {
    get() {
        return JSON.stringify({ id: '123' });
    }
    check() {
        return true;
    }
    set() {
        return 'en';
    }
    delete() {
        return 'en';
    }
}
describe('CookiseService isPlatformServer parse', () => {
    let service: Cookies;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                {
                    provide: SsrCookieService,
                    useClass: CookieServiceStubCheckTrue,
                },
                { provide: PLATFORM_ID, useValue: 'server' },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(Cookies);
    });

    it('should test get and set methods', () => {
        spyOn(service, 'get').and.callThrough();
        service.set('cookie', 'cookie');
        service.set('cook', { id: 'asdfasdf' }, true);
        service.get('cookie');
        service.get('cook', true);
        service.delete('cook');
        expect(service.get).toHaveBeenCalled();
    });
});

describe('CookiseService isPlatformServer', () => {
    let service: Cookies;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                {
                    provide: SsrCookieService,
                    useClass: CookieServiceStubCheckTrue,
                },
                { provide: PLATFORM_ID, useValue: 'server' },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(Cookies);
    });

    it('should test get and set methods', () => {
        spyOn(service, 'get').and.callThrough();
        service.set('cookie', 'cookie');
        service.set('cook', { id: 'asdfasdf' }, true);
        service.get('cookie');
        service.get('cook', true);
        service.delete('cook');
        expect(service.get).toHaveBeenCalled();
    });
});

describe('CookiseService isPlatformBrowser JSON', () => {
    let service: Cookies;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                {
                    provide: SsrCookieService,
                    useClass: CookieServiceStubCheckTrue,
                },
                { provide: PLATFORM_ID, useValue: 'browser' },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(Cookies);
    });

    it('should test get and set for non-stringified values', () => {
        spyOn(service, 'get').and.callThrough();
        service.set('cookie', 'cookie');
        service.set('cook', { id: 'asdfasdf' }, true);
        service.get('cookie');
        service.get('cook', true);
        service.delete('cook');
        expect(service.get).toHaveBeenCalled();
    });
});

describe('CookiseService isPlatformServer no cookie', () => {
    let service: Cookies;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                {
                    provide: SsrCookieService,
                    useClass: CookieServiceStub2,
                },
                { provide: PLATFORM_ID, useValue: 'server' },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(Cookies);
    });

    it('should test get and set methods', () => {
        spyOn(service, 'get').and.callThrough();
        service.set('cookie', 'cookie');
        service.set('cook', { id: 'asdfasdf' }, true);
        service.get('cookie');
        service.get('cook', true);
        service.delete('cook');
        expect(service.get).toHaveBeenCalled();
    });
});

import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class Cookies {
    constructor(
        public cookieService: SsrCookieService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    /**
     * set the language cookie
     */
    setLanguageCookie(lang): string {
        this.cookieService.set('language', lang, {
            path: '/',
            expires: 365,
            sameSite: 'Lax',
        });
        return this.cookieService.get('language');
    }

    /**
     * get stored language cookie
     */
    getLanguageCookie(): string {
        let language: string;
        const cookieExists: boolean = this.cookieService.check('language');
        if (cookieExists) {
            language = this.cookieService.get('language');
        } else {
            language = 'en';
        }
        return language;
    }

    /**
     * Sets the cookie
     * @param cookie cookie name
     * @param value cookie value
     * @param jsonStringify stringifies value before storing the data
     */
    set(cookie: string, value, jsonStringify?: boolean) {
        if (isPlatformBrowser(this.platformId)) {
            if (jsonStringify) {
                const data = JSON.stringify(value);
                const stringCopy = (' ' + data).slice(1);
                localStorage.setItem(cookie, stringCopy);
            } else {
                localStorage.setItem(cookie, value);
            }
        } else {
            if (jsonStringify) {
                const data = JSON.stringify(value);
                const stringCopy = (' ' + data).slice(1);
                this.cookieService.set(cookie, stringCopy, {
                    path: '/',
                    expires: 365,
                    sameSite: 'Lax',
                });
            } else {
                this.cookieService.set(cookie, value, {
                    path: '/',
                    expires: 365,
                    sameSite: 'Lax',
                });
            }
        }
    }

    /**
     * Gets the cookie
     * @param cookie cookie name
     * @param jsonParse parse cookie if stringified
     * @returns cookie if cookie exists
     */
    get(cookie: string, jsonParse?: boolean) {
        if (isPlatformBrowser(this.platformId)) {
            if (jsonParse) {
                return JSON.parse(localStorage.getItem(cookie));
            } else {
                localStorage.getItem(cookie);
            }
        } else {
            const cookieExists: boolean = this.cookieService.check(cookie);
            if (cookieExists && jsonParse) {
                return JSON.parse(this.cookieService.get(cookie));
            } else if (cookieExists && !jsonParse) {
                return this.cookieService.get(cookie);
            } else {
                false;
            }
        }
    }

    /**
     * Delete the cookie
     * @param cookie cookie name
     */
    delete(cookie) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(cookie);
        } else {
            this.cookieService.delete(cookie);
        }
    }
}

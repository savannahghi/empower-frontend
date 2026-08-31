import { Injectable } from '@angular/core';
import { Authorization } from './authorization.service';
import { Cookies } from '../../../shared/cookies/cookie.service';
@Injectable()
export class SessionService {
    STATE_STORE = 'state.dump';
    URL_STORE = 'url.dump';

    constructor(
        public authConfig: Authorization,
        public cookieService: Cookies
    ) {}
    dumpState(state: string, params: Object, opts?: any): void {
        const user = this.authConfig.getUser() as { id };
        const stateObj = JSON.parse(state) as { name };
        const stateDump = {
            name: stateObj.name,
            params: opts,
            queryParams: params,
            uid: null,
        };

        if (user) {
            stateDump.uid = user.id;
        }

        this.cookieService.set(this.STATE_STORE, stateDump, true);
    }

    loadState = (): Object => {
        const dump = this.cookieService.get(this.STATE_STORE) as {
            uid;
            name;
            params;
            queryParams;
            extraParams;
        };
        const user = this.authConfig.getUser();
        if (
            dump &&
            ((dump.uid && user.id === dump.uid) || (dump && !dump.uid))
        ) {
            return {
                uid: dump.uid,
                name: dump.name,
                params: dump.params,
                queryParams: dump.queryParams,
                extraParams: dump.extraParams,
            };
        }

        return null;
    };

    clearState(): void {
        this.cookieService.delete(this.STATE_STORE);
        return;
    }

    dumpUrl(url: string): void {
        this.cookieService.set(this.URL_STORE, url);
    }

    loadUrl(): void {
        this.cookieService.get(this.URL_STORE);
    }

    clearUrl(): void {
        this.cookieService.delete(this.URL_STORE);
        return;
    }
}

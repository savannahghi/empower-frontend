import { Injectable } from '@angular/core';
import _ from 'underscore';

class AuthStates {
    loginState = '/auth/login';
    logoutState = '/auth/logout';
    error403 = '/error_403';
}

class AvailableFeatures {
    allowCompleteRedirect = 'allow';
}

@Injectable()
export class Setup {
    authStates: any = new AuthStates();
    availableFeatures: any = new AvailableFeatures();

    setStuff(vars?: any, config?: Object, obj?: Object) {
        _.each(vars, v => {
            const cfg = config[v];
            if (!_.isString(cfg)) {
                return;
            }
            obj[v] = cfg;
        });
    }

    setFeatures(obj): void {
        const keys = Object.keys(this.availableFeatures);
        this.setStuff(keys, obj, this.availableFeatures);
    }

    setStates(obj): void {
        const keys = Object.keys(this.authStates);
        this.setStuff(keys, obj, this.authStates);
    }
}

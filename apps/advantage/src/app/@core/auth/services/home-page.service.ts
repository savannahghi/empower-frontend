import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import _ from 'underscore';
import { environment as e } from '../../../../environments/environment';
import { Setup } from './setup.service';

/**
 * interface used to define object data structure
 */
interface LooseObject {
    /** defines the object key value pair */
    [key: string]: any;
}

@Injectable()
export class HomePageService {
    homePages: string[] = e.AVAILABLE_HOMEPAGES;
    pageCheckers: any = e.ACTIONS.PAGECHECKERS;
    router: Router;

    constructor(readonly routerItem: Router, readonly setup: Setup) {
        this.router = routerItem;
    }

    getAllAvailableState() {
        // const allStates = [];
        for (let i = 0; i < this.homePages.length; i++) {
            // this.homePages[i];
        }
        return this.homePages;
    }

    determineHomePage = (): string => {
        const routerConfigs = this.router.config;
        const availableStates = this.getAllAvailableState();
        for (let i = 0; i < availableStates.length; i++) {
            const ans: LooseObject = {};
            // const canGoToState = true;
            const toState = _.findWhere(routerConfigs, {
                path: availableStates[i],
            });

            if (!_.isUndefined(toState)) {
                ans.can_view = true;
                return availableStates[i];
            }
        }
        return this.setup.authStates.loginState;
    };
}

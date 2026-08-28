/**
 * Imports used in the component
 */
import { Component, Input, OnInit } from '@angular/core';
import _ from 'underscore';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { NbIconLibraries } from '@nebular/theme';
import { Authorization } from '../@core/auth/services/authorization.service';
import { Oauth2Service } from '../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../@core/auth/services/datalayer.utils.service';
import { CompleteService } from '../@core/auth/services/login.service';
import { MENU_ITEMS } from './sidebar-menu';
import { Cookies } from '../shared/cookies/cookie.service';

/** Contains the providers injected into the component */
const servArray = [
    Authorization,
    DataLayerUtils,
    CompleteService,
    Oauth2Service,
];

/**
 * Contains the component decorator and defines
 * the selector, style url, template and the providers
 */
@Component({
    selector: 'sil-features',
    template: ` <ngx-one-column-layout>
        <nb-menu [items]="menu"></nb-menu>
    </ngx-one-column-layout>`,
    providers: servArray,
    standalone: false,
})

/**
 * Definition of the component's class
 */
export class FeaturesComponent implements OnInit {
    /** Contains an array of the menu option */
    menu: Array<any> = [];
    /** Used to hide elements that do not have auth */
    noAuth: boolean;
    /** contains the user information */
    user: any;
    /** Contains the quintus token observable */
    @Input() quintusTokenObservable: any;

    /**
     * Component constructor
     * @param authConfig injects the authorization service
     * @param $state injects the state service
     * @param iconLibraries injects nebular icon library service
     */
    constructor(
        public authConfig: Authorization,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        private iconLibraries: NbIconLibraries,
        protected cookieService: Cookies
    ) {
        this.iconLibraries.registerFontPack('font-awesome', {
            packClass: 'fa',
            iconClassPrefix: 'fa',
        });
        this.iconLibraries.registerFontPack('regular', {
            packClass: 'far',
            iconClassPrefix: 'fa',
        });
        this.iconLibraries.registerFontPack('solid', {
            packClass: 'fas',
            iconClassPrefix: 'fa',
        });
    }

    /**
     * Used when user does not have a bp type
     */
    unconfigured() {}

    /**
     * Check if user needs to access Quinuts Services
     * @param user contains user information
     */
    checkQuintusAccess(user) {
        const roles = user?.roles;
        const perms = user?.permissions;

        if (
            roles?.includes('Quintus') ||
            (roles?.includes('Advantage Super User') &&
                perms?.includes('erp.dashboard_list'))
        ) {
            return true;
        }
        return false;
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.user = this.authConfig.getUser();
        if (this.user !== null) {
            const menu = MENU_ITEMS;
            this.processMenu(menu);
            if (this.checkQuintusAccess(this.user)) {
                this.configureQuintusToken();
            }
        } else if (!this.uiglobals.current.data.requiresAuth) {
            this.noAuth = true;
        } else {
            this.$state.go('app.advantage');
        }
    }

    /** Iterate over the menus */
    processMenu(menu) {
        _.each(menu, item => {
            const bp = item.data.business_partner;
            bp === this.user.client_types[0]
                ? this.menu.push(item)
                : this.unconfigured();
        });
    }

    /** configure quintus token */
    configureQuintusToken() {
        if (this.quintusTokenObservable !== undefined) {
            this.quintusTokenObservable.subscribe((response: any) => {
                this.cookieService.set('quintus_token', response, true);
            });
        }
    }
}

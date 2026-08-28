import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { StateService } from '@uirouter/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { environment } from '../../../../../environments/environment';
import { FeatureFlagService } from 'app/@core/utils/feature.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - style: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'skika-auth',
    templateUrl: './skika-auth.component.html',
    styleUrls: ['./skika-auth.component.scss'],
    standalone: false,
})
export class SkikaAuthComponent implements OnDestroy, OnInit {
    alive = true;
    location: any;
    $state: any;
    variant: string;

    authenticated: boolean = false;
    formToggle: boolean = false;
    token: string = '';

    links: any[] = [''];
    /**
     * gets the stored selected language
     */
    selectedLanguage: any = this.cookieService.getLanguageCookie();

    // showcase of how to use the onAuthenticationChange method
    constructor(
        $state: StateService,
        location: Location,
        private translate: TranslateService,
        private cookieService: Cookies,
        private featureFlagService: FeatureFlagService
    ) {
        this.location = location;
        this.$state = $state;
        this.variant = environment.variant;
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }
    /**
     * Go back to the previous page
     */
    back() {
        this.location.back();
        return false;
    }

    /** Should determine if keycloak is enabled */
    get enabledKeycloak(): boolean {
        return this.featureFlagService.isFeatureOn(
            'prov_authenticationSetKeyCloakToTrue'
        );
    }

    /**
     * set the language cookie
     */
    setLanguageCookie(event) {
        this.selectedLanguage = this.cookieService.setLanguageCookie(event);
        this.translate.use(this.selectedLanguage);
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {}

    ngOnDestroy(): void {
        this.alive = false;
    }
}

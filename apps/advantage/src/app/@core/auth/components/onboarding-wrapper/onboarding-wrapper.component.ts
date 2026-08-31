import { Component, OnInit } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';

/**
 * Onboarding Wrapper component that wraps all onboarding components
 * and does an authentication check to see if cube token has been received.
 * If not, user is redirected to the loader page.
 */
@Component({
    selector: 'onboarding-wrapper',
    templateUrl: './onboarding-wrapper.component.html',
    styleUrls: ['./onboarding-wrapper.component.scss'],
    standalone: false,
})
export class OnboardingWrapperComponent implements OnInit {
    currentYear = new Date().getFullYear();

    currentPage = '';

    constructor(public uiglobals: UIRouterGlobals) {}

    ngOnInit() {
        this.currentPage = this.uiglobals.current.name;
    }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { StateService } from '@uirouter/core';

import { Authorization } from '../../services/authorization.service';
import { CompleteService } from '../../services/login.service';
import { SessionService } from '../../services/session.service';
import { Setup } from '../../services/setup.service';

import { IdleService } from '../../services/idle.service';
import { HomePageService } from '../../services/home-page.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'sil-complete',
    templateUrl: './complete.component.html',
    styleUrls: ['./complete.component.scss'],
    providers: [SessionService, Setup, CompleteService, HomePageService],
    standalone: false,
})
export class CompleteAuthComponent implements OnInit, OnDestroy {
    progressMsg = 'Starting your session';
    authError = false;
    color = 'primary';
    mode = 'indeterminate';
    value = 50;
    window: any;
    authConfig: Authorization;
    complete: CompleteService;
    session: SessionService;
    user: any;
    org: any;
    cycleMessages: boolean = true;
    displayedMessage: any;
    showLoginLink: boolean = false;
    loadingMessages = [
        'complete.loadingMessage1',
        'complete.loadingMessage2',
        'complete.loadingMessage3',
        'complete.loadingMessage4',
    ];

    submitted: any;
    error: any;
    errors: any;
    /** Contains the variant set from environment variables */
    variant: string;

    constructor(
        authConfig: Authorization,
        public $state: StateService,
        complete: CompleteService,
        private idleService: IdleService,
        sessionClass: SessionService
    ) {
        this.authConfig = authConfig;
        this.complete = complete;
        this.session = sessionClass;
        this.variant = environment.variant;
        this.window = window;
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.progressMsg = 'Starting your session';
        this.idleService.setUserLoggedIn(true);
        this.cycleLoadingMessages();
        setTimeout(() => {
            this.displayLoginLink();
        }, 11000);

        if (this.authConfig.isLoggedIn()) {
            this.user = this.authConfig.getUser();

            this.org = this.authConfig.getOrganisation();
            if (this.org.bp_type === 'SAVANNAH') {
                this.$state.go('app.advantage.providers', {}, { reload: true });
            }
            const workstation =
                this.authConfig.getErpOrganisation()?.user_workstations;

            if (workstation?.length > 0) {
                /** if user has no workstation, redirect to workstation component and show an error */
                return this.$state.go('auth.workstation', {}, { reload: true });
            } else {
                this.$state.go('app.advantage.home', {}, { reload: true });
            }
        } else {
            setTimeout(() => {
                this.completeAuthentication();
            }, 5000);
        }
    }

    /** displays the login button if the loading takes too long */
    displayLoginLink = () => {
        this.showLoginLink = true;
    };

    /** clears your session */
    clearSession = () => {
        this.authConfig.removeTokenData();
    };

    /** completes the authentication process */
    completeAuthentication() {}

    /** Used to display a message while the screen is loading */
    async cycleLoadingMessages() {
        while (this.cycleMessages) {
            for (let i = 0; i < this.loadingMessages.length; i++) {
                this.displayedMessage = this.loadingMessages[i];
                await new Promise(resolve => setTimeout(resolve, 5000)); // Display each message for 1 second
            }
        }
    }

    ngOnDestroy() {
        this.cycleMessages = false;
    }
}

import { Component, Inject, OnInit, ViewChild, DOCUMENT } from '@angular/core';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IdleService } from './@core/auth/services/idle.service';
import { environment } from '../environments/environment';
import { Authorization } from './@core/auth/services/authorization.service';
import { SilStoresService } from './shared/sil-http-services/sil_datalayer.service';
import { Cookies } from './shared/cookies/cookie.service';
import { FeatureFlagService } from './@core/utils/feature.service';
import { LoginDialogComponent } from './@core/auth/components/login-dialog/login-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { PosthogService } from './@core/utils/posthog.service';
import Clarity from '@microsoft/clarity';

/**
 * This is the main app component for an authenticated user.
 *
 * This component renders the outermost chrome
 * (application header and tabs, the compose  and logout button)
 * It has a `ui-view` viewport for nested states to fill in.
 */
@Component({
    selector: 'ngx-app',
    template: `
        <div
            bsModal
            #childModal="bs-modal"
            id="idleModal"
            class="modal fade"
            tabindex="-1"
            role="dialog"
            aria-labelledby="dialog-child-name">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="col-12 row">
                            <h4
                                id="dialog-child-name"
                                class="modal-title col-9 ms-3">
                                Hi there, still here?
                            </h4>
                            <div
                                class="col flex-row-reverse d-inline-flex align-items-start">
                                <button
                                    type="button"
                                    nbButton
                                    ghost
                                    class="close pull-right"
                                    aria-label="Close"
                                    (click)="hideChildModal()">
                                    <nb-icon icon="close-outline"></nb-icon>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="mt-1 ms-3 col mb-3">
                            <div *ngIf="idleState === 'NOT_IDLE'">
                                Click <b>Stay</b> to stay logged in.
                                <br />
                                Click <b>Logout</b> to log out. <br /><br />
                                Keeping your session alive
                            </div>
                            <div *ngIf="idleState === 'PINGING'">
                                Click <b>Stay</b> to stay logged in.
                                <br />
                                Click <b>Logout</b> to log out. <br /><br />
                                Keeping your session alive
                            </div>
                            <div *ngIf="idleState === 'IDLE'">
                                Click <b>Stay</b> to stay logged in.
                                <br />
                                Click <b>Logout</b> to log out. <br /><br />
                                Keeping your session alive
                            </div>
                            <div *ngIf="idleState === 'TIMEOUT_WARNING'">
                                Click <b>Stay</b> to stay logged in.
                                <br />
                                Click <b>Logout</b> to log out. <br /><br />
                                {{ this.timeOutMessage }}
                            </div>
                            <div *ngIf="idleState === 'TIMED_OUT'">
                                <h4>Session has timed out</h4>
                                <br />
                                You will be logged out shortly.
                                <br /><br />
                            </div>
                        </div>
                        <div class="col-12 mt-5 m-0 row mrgbtm">
                            <div class="col">
                                <button
                                    nbButton
                                    type="button"
                                    status="primary"
                                    (click)="stay()"
                                    class="btn btn-success">
                                    Stay
                                </button>
                            </div>
                            <div
                                class="col flex-row-reverse d-inline-flex align-items-start">
                                <button
                                    nbButton
                                    type="button"
                                    (click)="logout()"
                                    class="btn btn-danger">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ui-view></ui-view>
    `,
    providers: [SilStoresService],
    standalone: false,
})

/** Class that is used for app component */
export class AppComponent implements OnInit {
    /** Contains the idle state */
    idleState = 'NOT_STARTED';
    /** Used to display the countdown for idle service */
    countdown?: number = null;
    /** Used to store the last ping time */
    lastPing?: Date = null;
    /** Used to determine if the idle service has timed out */
    timedOut = false;
    /** Method used when the idle service times out */
    onTimeout: any;
    /** Contains instance of authorization service */
    authConfig: any;
    /** Method used when the idle service starts the idle timer */
    onIdleStart: any;
    /** Method used when the idle service ends the idle timer */
    onIdleEnd: any;
    /** Method used when the idle service is warning about the timeout */
    onTimeoutWarning: any;
    /** NbDialog reference */
    dialogRef: any;
    /** Boolean to display the login component */
    isLoginDialogOpen: boolean = false;
    /** Ping server to keep session alive */
    onPing: any;
    title = 'angular-idle-timeout';
    /** Used to set the timeout time in seconds */
    timeoutIdle = parseInt(environment.TIMEOUT.idle, 10);
    /** Used to set the warning timeout time in seconds */
    timeoutWarning = parseInt(environment.TIMEOUT.warning, 10);

    private featureFlagService: FeatureFlagService;

    public modalRef: BsModalRef;

    @ViewChild('childModal', { static: false }) childModal: ModalDirective;
    modalShowing: boolean;
    dataLayer: SilStoresService;
    timeOutMessage: string;

    constructor(
        protected idle: Idle,
        authConfig: Authorization,
        dataLayer: SilStoresService,
        keepalive: Keepalive,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        private idleService: IdleService,
        protected cookieService: Cookies,
        public flagService: FeatureFlagService,
        private dialogService: NbDialogService,
        posthogService: PosthogService,
        @Inject(DOCUMENT) private document: Document
    ) {
        // initialise clarity for empower
        if (environment.variant === 'empower')
            Clarity.init(environment.empowerClarityProjectId);
        // get authConfig methods
        this.authConfig = authConfig;
        this.dataLayer = dataLayer;
        // sets an idle timeout of x seconds, for testing purposes.
        idle.setIdle(this.timeoutIdle);
        // sets a timeout period of x seconds. after x seconds of inactivity, the user will be considered timed out.
        idle.setTimeout(this.timeoutWarning);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        this.onIdleEnd = () => {
            this.idleState = 'IDLE_END';
        };
        idle.onIdleEnd.subscribe(this.onIdleEnd);

        this.onTimeout = () => {
            this.idleState = 'TIMED_OUT';
            if (!this.enabledKeycloak) {
                this.childModal.hide();
                this.timedOut = true;
                this.idleService.setLogin = true;
                this.dumpState();
                this.popupLoginComponent();
            } else {
                this.dumpState();
                this.authConfig.logout(true).subscribe();
            }
        };

        idle.onTimeout.subscribe(this.onTimeout);

        this.onIdleStart = () => {
            this.idleState = 'IDLE';
        };

        idle.onIdleStart.subscribe(this.onIdleStart);

        this.onTimeoutWarning = countdown => {
            this.idleState = 'TIMEOUT_WARNING';
            this.modalShowing = true;
            this.childModal.show();
            this.timeOutMessage =
                'You will be logged out in ' + countdown + ' seconds!';
        };

        idle.onTimeoutWarning.subscribe(this.onTimeoutWarning);

        // sets the ping interval to 40 seconds
        keepalive.interval(40);

        this.onPing = () => {
            this.idleState = 'PINGING';
            this.lastPing = new Date();
            this.dataLayer.getUser({ fields: 'id' });
        };
        keepalive.onPing.subscribe(this.onPing);
    }

    /** Should determine if keycloak is enabled */
    get enabledKeycloak(): boolean {
        // This now calls the getter, avoiding the constructor cycle
        return this.flagService.isFeatureOn(
            'prov_authenticationSetKeyCloakToTrue'
        );
    }

    /**
     * Pop up the login component
     */
    popupLoginComponent() {
        if (!this.isLoginDialogOpen) {
            this.authConfig.removeAuthToken();
            this.isLoginDialogOpen = true;
            this.dialogRef = this.dialogService.open(LoginDialogComponent, {
                context: {},
                closeOnBackdropClick: false,
                hasBackdrop: true,
                closeOnEsc: false,
            });
            this.dialogRef.onClose.subscribe({ next: this.toggleDialog });
        }
    }

    /** Toggle Dialog off */
    toggleDialog = () => {
        this.stay();
        this.isLoginDialogOpen = false; // Reset flag when dialog closes
    };

    /** Resets idle service */
    reset() {
        this.idle.watch();
        this.timedOut = false;
        this.idleState = 'NOT_IDLE';
        this.countdown = null;
        this.lastPing = null;
    }

    /** dumps the state before being logged out */
    dumpState() {
        const stateName = this.uiglobals.current.name;
        const params = this.uiglobals.params;
        const obj = {
            stateName: stateName,
            params: params,
        };
        this.cookieService.set('state_dump', obj, true);
    }

    /** Hides idle modal */
    hideChildModal(): void {
        this.modalShowing = false;
        this.childModal.hide();
        const collections = this.document.querySelectorAll('.modal-backdrop');
        collections.forEach(box => {
            box.remove();
        });
        this.reset();
    }

    /** used to idle stay event */
    stay() {
        this.hideChildModal();
    }

    /** Used for idle logout event */
    logout() {
        this.modalShowing = false;
        this.hideChildModal();
        this.idleService.setUserLoggedIn(false);
        this.idleService.setLogin = true;
        this.$state.go('auth.logout');
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit(): void {
        this.loadGoogleMapsScript();
        this.loadJiraServiceDeskWidget();
        this.flagService.setupFlagging();
        if (this.authConfig.isLoggedIn()) {
            this.reset();
        } else {
            this.idle.stop();
        }
    }

    private loadGoogleMapsScript(): void {
        const script = this.document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
        script.defer = true;
        this.document.head.appendChild(script);
    }

    private loadJiraServiceDeskWidget(): void {
        const script = this.document.createElement('script');
        script.setAttribute('data-jsd-embedded', '');
        script.setAttribute('data-key', environment.jsdKey);
        script.setAttribute(
            'data-base-url',
            'https://jsd-widget.atlassian.com'
        );
        script.src = 'https://jsd-widget.atlassian.com/assets/embed.js';
        this.document.body.appendChild(script);
    }
}

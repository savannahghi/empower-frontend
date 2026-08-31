import { Component, OnInit } from '@angular/core';
import { Authorization } from '../../services/authorization.service';

import { NbToastrService } from '@nebular/theme';
import { StateService } from '@uirouter/angular';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - style: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'sil-logout',
    styleUrls: ['./logout.component.scss'],
    templateUrl: './logout.component.html',
    standalone: false,
})

/** defines the logout component class */
export class SilLogoutComponent implements OnInit {
    /** defines the credentials store  */
    CREDZ_STORE = 'auth.config.credz';
    /** used to define submission */
    submitted: any;
    /** used to display an error on the logout component template */
    error: any;
    /** used to display multiple errors in the logout component template */
    errors: any;
    /** used to determine the toast duration time */
    toastTime = 10000;

    constructor(
        private authConfig: Authorization,
        protected toastrService: NbToastrService,
        public $state: StateService
    ) {}

    /**
     * showToast - Used to display a toast using the nebular toast service
     * @param position
     * defines the toast's position e.g. bottom-right
     * @param status
     * defines the status being used e.g. success, danger, info
     * @param msg
     * defines what the message in the toast is
     */
    showToast(position, status, msg) {
        const duration = this.toastTime;
        const titleMsg = 'Log back in to access resources';
        this.toastrService.show(titleMsg, msg, { position, status, duration });
    }

    /**
     * method used to logout the user
     */
    logoutUser = () => {
        const token = this.authConfig.getToken();
        if (token) {
            this.authConfig.logout().subscribe({
                next: () => {
                    const msg = 'Successfully logged out';
                    this.showToast('bottom-right', 'success', msg);
                    void this.$state.go(
                        'auth.login',
                        { is_logged_out: true },
                        { reload: true }
                    );
                },
                error: err => {
                    console.error('Logout error:', err);
                    // Navigate to login even on error
                    void this.$state.go('auth.login');
                },
            });
        } else {
            // No token, just clear local data and navigate
            this.authConfig.removeTokenData();
            this.$state.go('auth.login');
        }
    };

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.logoutUser();
    }
}

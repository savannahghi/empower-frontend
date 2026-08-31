import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    Inject,
    PLATFORM_ID,
    DOCUMENT,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StateService } from '@uirouter/angular';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { CompleteService } from '../../services/login.service';
import { environment } from '../../../../../environments/environment';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { Cookies } from '../../../../../../src/app/shared/cookies/cookie.service';
import { Authorization } from '../../services/authorization.service';
import { NgxTranslateModule } from '../../../../shared/translate/translate.module';
import { VariantPipe } from '../../../../../../src/app/@theme/pipes/variant/variant.pipe';
import {
    NbButtonModule,
    NbCardModule,
    NbDialogRef,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbSpinnerModule,
    NbToastrService,
} from '@nebular/theme';

@Component({
    selector: 'ngx-login-dialog',
    standalone: true,
    imports: [
        CommonModule,
        NbCardModule,
        NbButtonModule,
        NbInputModule,
        NbFormFieldModule,
        NbIconModule,
        FormsModule,
        NbSpinnerModule,
        NgxTranslateModule,
        VariantPipe,
    ],
    providers: [CompleteService],
    templateUrl: './login-dialog.component.html',
    styleUrl: './login-dialog.component.scss',
})
export class LoginDialogComponent {
    email: string = '';
    password: string;
    showPassword = false;
    loading: boolean = false;
    /** Stores token for api calls */
    token;
    /** Contains the window object */
    window: any;
    /** contains errors while logging in*/
    errors: string[] = [];
    error: any = undefined;
    /**
     * gets the stored selected language
     */
    selectedLanguage: string = this.cookieService.getLanguageCookie();
    constructor(
        public complete: CompleteService,
        public cd: ChangeDetectorRef,
        public errorHandlerService: ErrorHandlerService,
        public cookieService: Cookies,
        public state: StateService,
        protected toastrService: NbToastrService,
        public authorizationService: Authorization,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document,
        private translate: TranslateService,
        protected dialogRef: NbDialogRef<LoginDialogComponent>
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.window = window;
        }
        this.translate.setFallbackLang('en');
        this.translate.use(this.selectedLanguage);
    }

    /** Change input type */
    getInputType() {
        if (this.showPassword) {
            return 'text';
        }
        return 'password';
    }

    /** cancel dialog */
    cancel() {
        this.dialogRef.close();
    }

    /** Server side login */
    serverLogin() {
        this.loading = true;
        const body = {
            username: this.email,
            password: this.password,
        };

        this.complete.attemptLogin(body).subscribe({
            next: this.handleResponse,
            error: this.errorHandler,
        });
    }

    /** handle token response from server */
    handleResponse = data => {
        this.token = data;
        if (isPlatformBrowser(this.platformId) && !data['error']) {
            this.completeLogin();
            this.cd.detectChanges();
        } else {
            this.error = {
                title: 'Login Error',
                message: data.error_description,
            };
            this.showToast(
                'bottom-right',
                'danger',
                'Login Error',
                data.error_description
            );
            this.loading = false;
            this.cd.detectChanges();
        }
    };

    /** Toggle show password */
    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    /** Show Toast */
    showToast(position, status, title, msg) {
        const duration = 7000;
        this.toastrService.show(msg, title, {
            position,
            status,
            duration,
        });
    }

    /** Handle error from server */
    errorHandler = err => {
        this.loading = false;
        if (environment.sentryEnvironment === 'testing') {
            this.showToast(
                'bottom-right',
                'danger',
                `Error!`,
                `${err?.error?.error_description}`
            );
        } else {
            this.errorHandlerService.handleError(err);
        }
        this.loading = false;
        this.cd.detectChanges();
    };

    /** Access authserver /me */
    accessMe(data) {
        this.complete
            .accessMe(data)
            .subscribe({ next: this.receiveMe, error: this.handleMeError });
    }

    /**
     * Access data received from /me
     */
    receiveMe = meData => {
        this.authorizationService.setUser(meData);
        this.authorizationService
            .setAdvantageOrganisationDetails(this.token)
            .subscribe({ next: this.storeAdvDetails });
        this.authorizationService
            .setOrganisationDetails(this.token, 'erp')
            .subscribe({ next: this.storeErpDetails });
        this.complete.determineApplicationAccess(meData);
        this.dialogRef.close();
    };

    /** Store info from advantage backend */
    storeAdvDetails = data => {
        this.authorizationService.setAdvantageOrganisation(data);
    };

    /** Store info from erp backend */
    storeErpDetails = data => {
        this.authorizationService.setOrganisation(data, 'erp');
    };

    /** Access authserver /me */
    logout() {
        this.state.go('auth.logout');
    }

    /**
     * Handle error from /me
     */
    handleMeError = meError => {
        const { error } = meError;
        this.errorHandlerService.handleError(error);
    };

    /** Handle removing nbdialog elements */
    closeAllLoginModals() {
        const backdropBackground = this.document.querySelectorAll(
            '.cdk-overlay-backdrop'
        );
        backdropBackground.forEach(this.removeBox);
        const loginModals = this.document.querySelectorAll(
            '.cdk-global-overlay-wrapper'
        );
        loginModals.forEach(this.removeBox);
    }

    /** remove element */
    removeBox = box => {
        box.remove();
    };

    /** Complete login after successful MFA */
    completeLogin = () => {
        if (!this.token) {
            this.token = this.complete.tempLoginData;
        }
        this.authorizationService.storeToken(this.token);
        this.accessMe(this.token);
        this.loading = false;
        this.cd.detectChanges();
        this.dialogRef.close();
        this.closeAllLoginModals();
    };
}

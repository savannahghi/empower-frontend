import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../../../src/app/shared/cookies/cookie.service';
import { ErrorHandlerService } from '../../../../../../src/app/shared/sil-http-services/error-handler';
import {
    NbMediaBreakpointsService,
    NbThemeService,
    NbToastrService,
} from '@nebular/theme';
import { environment } from '../../../../../environments/environment';
import { CompleteService } from '../../services/login.service';
import { Setup } from '../../services/setup.service';
import { SessionService } from '../../services/session.service';
import { HomePageService } from '../../services/home-page.service';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
    providers: [SessionService, Setup, CompleteService, HomePageService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class ResetPasswordComponent implements OnInit {
    private destroy$: Subject<void> = new Subject<void>();
    userPictureOnly: boolean = false;

    showPassword = false;
    password1: string;
    password2: string;
    token: string;
    uid: string;
    variant: string;
    loading: boolean = false;
    passwordNotMatch: boolean = false;
    resetPasswordForm: FormGroup;
    notify: any = undefined;
    error: any = undefined;
    /** Contains the window object */
    window: any;
    time: number = 5;
    currentTheme = environment.variant;

    themeChecked: boolean;

    themes = [
        {
            value: 'default',
            name: 'Light',
        },
        {
            value: 'dark',
            name: 'Dark',
        },
        {
            value: 'cosmic',
            name: 'Cosmic',
        },
        {
            value: 'corporate',
            name: 'Corporate',
        },
    ];

    /**
     * stores state params
     */
    stateParams: any;

    /**
     * gets the stored selected language
     */
    selectedLanguage: string = this.cookieService.getLanguageCookie();

    constructor(
        private themeService: NbThemeService,
        private breakpointService: NbMediaBreakpointsService,
        public complete: CompleteService,
        public dataLayer: SilStoresService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public cookieService: Cookies,
        protected cdr: ChangeDetectorRef,
        private translate: TranslateService,
        protected toastrService: NbToastrService,
        public errorHandlerService: ErrorHandlerService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.variant = environment.variant;
        if (isPlatformBrowser(this.platformId)) {
            this.window = window;
            this.variant = environment.variant;
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

    /** Toggle show password */
    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    /**
     * check if passwords matches or not
     * returns boolean
     */
    checKPasswordMatches = () => {
        return this.password1 !== this.password2;
    };

    /** Handles submission of reset password */
    onSubmitPassword = () => {
        this.passwordNotMatch = false;
        this.notify = undefined;
        this.error = undefined;
        this.passwordNotMatch = this.checKPasswordMatches();
        if (!this.passwordNotMatch) {
            this.loading = true;
            const body = {
                new_password1: this.resetPasswordForm.value.password1,
                new_password2: this.resetPasswordForm.value.password2,
                token: this.stateParams?.token,
                uid: this.stateParams?.uid,
            };
            this.complete.attemptResetPassword(body).subscribe({
                next: this.handleResponse,
                error: this.errorHandler,
            });
        } else {
            this.passwordNotMatch = this.checKPasswordMatches();
        }
    };

    /**
     * handle reset pwd response
     */
    handleResponse = () => {
        this.loading = false;
        this.notify = {
            title: 'Reset password success',
            message: `Reset Successful, redirecting to login page in ${this.time} seconds`,
        };
        this.countdown();
    };

    /** redirect user count down */
    countdown() {
        const timer = setInterval(() => {
            this.time--;

            this.notify = {
                ...this.notify,
                message: `Reset Successful, redirecting to login page ${
                    this.time > 0
                        ? 'in ' + `${this.time}` + ' seconds'
                        : 'about now...'
                } `,
            };

            if (this.time < 1) {
                clearInterval(timer);
                setTimeout(() => {
                    this.$state.go('auth.login', { reload: true });
                }, 1000);
            }

            this.cdr.detectChanges();
        }, 1000);
    }

    /** Handle error from server */
    errorHandler = err => {
        this.errorHandlerService.handleError(err, this);
        this.loading = false;
        this.cdr.detectChanges();
    };

    /** Show Toast */
    showToast(position, status, title, msg) {
        const duration = 7000;
        this.toastrService.show(msg, title, {
            position,
            status,
            duration,
        });
    }

    determineUserTheme() {
        const currentTheme = this.cookieService.get('app.theme');
        if (currentTheme === null || currentTheme === undefined) {
            this.cookieService.set('app.theme', environment.variant);
            this.themeChecked = false;
            this.currentTheme = this.themeService.currentTheme;
        } else {
            this.themeChecked =
                currentTheme === environment.variant ? false : true;
            this.currentTheme = currentTheme;
        }
        this.changeTheme(this.currentTheme);
        this.themeChanger();
    }

    /**
     * Used to change from one theme option to another
     * @param themeName includes: default,dark,cosmic,default
     */
    changeTheme(themeName: string) {
        this.themeService.changeTheme(themeName);
    }

    /**
     * Uses the themeService to effect a theme change
     */
    themeChanger() {
        this.themeService
            .onThemeChange()
            .pipe(
                map(({ name }) => name),
                takeUntil(this.destroy$)
            )
            .subscribe(this.themeSubscription);
    }

    /**
     * Stores the theme choice to local storage to remember
     * @param themeName includes: default,dark,cosmic,default
     */
    themeSubscription = themeName => {
        this.cookieService.set('app.theme', themeName);
        this.currentTheme = themeName;
    };

    ngOnInit() {
        this.determineUserTheme();
        const { xl } = this.breakpointService.getBreakpointsMap();
        this.themeService
            .onMediaQueryChange()
            .pipe(
                map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
                takeUntil(this.destroy$)
            )
            .subscribe(
                (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
            );

        this.resetPasswordForm = new FormGroup({
            password1: new FormControl('', [Validators.required]),
            password2: new FormControl('', Validators.required),
        });
        this.stateParams = this.uiglobals?.params;
    }
}

import { AppComponent } from './app.component';
import { CompleteAuthComponent } from './@core/auth/components/complete/complete.component';
import { WorkstationComponent } from './@core/auth/components/workstation/workstation.component';
import { SkikaLoginComponent } from './@core/auth/components/login/login.component';
import { SkikaAuthComponent } from './@core/auth/components/skika-auth/skika-auth.component';
import { Transition } from '@uirouter/core';
import { SilLogoutComponent } from './@core/auth/components/logout/logout.component';
import { ErrorPageComponent } from './@core/auth/components/error-page/error-page.component';
import { SignUpComponent } from './@core/auth/components/sign-up/sign-up.component';
import { environment } from '../environments/environment';
import { AppsComponent } from './@core/auth/components/apps/apps.component';
import { ResetPasswordComponent } from './@core/auth/components/reset-password/reset-password.component';
import { FeaturesComponent } from './features/features.component';
import { EmpowerWelcomeComponent } from './@core/auth/components/welcome/empower-welcome.component';
/**
 * This is the parent state for the entire application.
 *
 * This state's primary purposes are:
 * 1) Shows the outermost chrome (including the navigation and logout for authenticated users)
 * 2) Provide a viewport (ui-view) for a substate to plug into
 */
export const appState = {
    name: 'app',
    redirectTo: 'app.advantage.home',
    component: AppComponent,
};

/**
 * A resolve function for 'login' state which figures out what state to return to, after a successful login.
 *
 * If the user was initially redirected to login state (due to the requiresAuth redirect),
 * then return the toState/params they were redirected from.
 * Otherwise, if they transitioned directly, return the fromState/params.  Otherwise
 * return the main "home" state.
 */
export function returnTo($transition$: Transition): any {
    if ($transition$.redirectedFrom() != null) {
        // The user was redirected to the login state (e.g., via the requiresAuth hook when trying to activate contacts)
        // Return to the original attempted target state (e.g., contacts)
        return $transition$.redirectedFrom().targetState();
    }

    const $state = $transition$.router.stateService;

    // The user was not redirected to the login state; they directly activated the login state somehow.
    // Return them to the state they came from.
    if ($transition$.from().name !== '') {
        return $state.target($transition$.from(), $transition$.params('from'));
    }

    // If the fromState's name is empty, then this was the initial transition. Just return them to the home state
    return $state.target('app.advantage.home');
}

/**
 * This is the auth state. It is activated when the user navigates to /auth.
 * It is the main authentication state and is the parent to the following states:
 *  - auth.login
 *  - auth.complete
 *  - auth.workstation
 *  - auth.logout
 */
export const authState = {
    parent: 'app',
    name: 'auth',
    url: '/auth',
    redirectTo: 'auth.login',
    component: SkikaAuthComponent,
};

/**
 * This is the login state. It is activated when the user navigates to /auth/login, or if a unauthenticated
 * user attempts to access a protected state (or substate) which requires authentication.
 * (see routerhooks/requiresAuth.js)
 *
 * It shows a fake login dialog and prompts the user to authenticate.  Once the user authenticates, it then
 * reactivates the state that the user originally came from.
 */
export const loginState = {
    name: 'auth.login',
    data: {
        requiresAuth: false,
    },
    url: '/login?is_logged_out&is_expired',
    component: SkikaLoginComponent,
};

/**
 * This is the password reset state used to reset forgotten password
 * create an account.
 */
export const resetPasswordState = {
    name: 'reset-password',
    data: {
        requiresAuth: false,
    },
    url: '/reset-password?uid&token',
    redirectTo: 'reset-password.form',
    component: FeaturesComponent,
};

export const resetPasswordFormState = {
    name: 'reset-password.form',
    url: '/form',
    data: {
        requiresAuth: false,
    },
    component: ResetPasswordComponent,
};

/**
 * This is the provider sign-up state. It's used by a user/provider to
 * create an account.
 */
export const signUpState = {
    name: 'auth.sign-up',
    data: {
        requiresAuth: false,
    },
    url: '/sign-up?step&exists&code',
    component: SignUpComponent,
};

/**
 * This is the logout state. It is the state used when a user is being logout.
 * The state is important for clearing the stored information and it is also
 * the state used to logout of a session.
 */
export const logoutState = {
    name: 'auth.logout',
    data: {
        requiresAuth: false,
    },
    url: '/logout',
    component: SilLogoutComponent,
};

/**
 * This is the complete state. It is the state used when a user is redirected
 * from the authserver.
 * The state is important for storing information retrieved from backend servers
 * in the client application.
 * ?access_token=kwejbYJuKMfk9F3PXgVfjI3FiHfHPp&expires_in=3600&token_type=Bearer&scope=auth.user.read
 */
export const completeState = {
    name: 'auth.complete',
    url: '/complete/?token_type&scope&expires_in&access_token',
    component: CompleteAuthComponent,
};

/**
 * This is the workstation state. It is used when a user has more than one
 * branch or department and they're required to select the branch and
 * department they're working from
 */
export const workStationState = {
    name: 'auth.workstation',
    data: {
        requiresAuth: true,
    },
    url: '/workstation',
    component: WorkstationComponent,
};

/**
 * This is the apps state. It is used when a user has more than one
 * app they have access to
 */
export const appsState = {
    name: 'auth.apps',
    data: {
        requiresAuth: true,
    },
    url: '/apps',
    component: AppsComponent,
};

/**
 * This is the error state. It is used to display an client server errors.
 * These includes the class of 4xx errors e.g. 401, 403 etc
 */
export const errorState = {
    name: 'auth.error',
    data: {
        requiresAuth: true,
    },
    url: '/error?error',
    component: ErrorPageComponent,
};

/**
 * Show the correct URL based on Variant
 */
const variant = environment.variant;
const variantURL = variant !== 'default' ? `/${variant}` : '/advantage';

/**
 * This is the parent state for the advantage application.
 */
export const advantageFutureState = {
    name: 'app.advantage.**',
    url: variantURL,
    loadChildren: () =>
        import('./features/advantage/advantage.module').then(
            m => m.AdvantageModule
        ),
};

/**
 * This is the parent state for the health CRM application.
 *
 */
export const healthCrmFutureState = {
    name: 'app.healthcrm.**',
    url: '/healthcrm',
    data: {
        requiresAuth: true,
    },
    loadChildren: () =>
        import('./features/healthcrm/healthcrm.module').then(
            m => m.HealthCrmModule
        ),
};

/** This is the parent state for the Access Afya application.
 *
 */
export const aiFutureState = {
    name: 'app.ai.**',
    url: '/ai',
    loadChildren: () => import('./features/ai/ai.module').then(m => m.AIModule),
};

/**
 * This is the parent state for EDI feedback survey
 *
 */
export const feedbackFutureState = {
    name: 'app.feedback.**',
    url: '/feedback',
    loadChildren: () =>
        import('./features/feedback/feedback.module').then(
            m => m.FeedbackModule
        ),
};

/**
 * This is the parent state for onboarding
 *
 */
export const onboardingFutureState = {
    name: 'app.onboarding.**',
    url: '/onboarding',
    loadChildren: () =>
        import('./features/onboarding/onboarding.module').then(
            m => m.OnboardingModule
        ),
};

/**
 * This is the parent state for public risk assessment
 *
 */
export const publicRiskAssessmentFutureState = {
    name: 'app.risk-assessment.**',
    url: '/risk-assessment',
    loadChildren: () =>
        import('./features/risk-assessment/public-risk-assessment.module').then(
            m => m.PublicRiskAssessmentModule
        ),
};

/**
 * This is the parent state for Advantage feedback survey
 *
 */
export const surveyFutureState = {
    name: 'app.survey.**',
    url: '/survey',
    data: {
        requiresAuth: false,
    },
    loadChildren: () =>
        import('./features/survey/survey.module').then(m => m.SurveyModule),
};

/**
 * This is the parent state for Advantage feedback survey
 *
 */
export const summaryFutureState = {
    name: 'app.summary.**',
    url: '/summary',
    data: {
        requiresAuth: false,
    },
    loadChildren: () =>
        import('./features/survey/survey.module').then(m => m.SurveyModule),
};

/**
 * This is the parent state for Advantage feedback survey
 *
 */
export const tosFutureState = {
    name: 'app.tos.**',
    url: '/tos',
    data: {
        requiresAuth: false,
    },
    loadChildren: () =>
        import('./features/tos/tos.module').then(m => m.TosModule),
};

/**
 * This is the parent state for the Autorecon application.
 *
 */
export const autoreconFutureState = {
    name: 'app.autorecon.**',
    url: '/autorecon',
    data: {
        requiresAuth: true,
    },
    loadChildren: () =>
        import('./features/autorecon/autorecon.module').then(
            m => m.AutoreconModule
        ),
};

/**
 * This is the parent state for the user guide application.
 *
 */
export const userGuideFutureState = {
    name: 'app.userguide.**',
    url: '/user-guides',
    data: {
        requiresAuth: true,
    },
    loadChildren: () =>
        import('./features/user-guide/user-guide.module').then(
            m => m.UserGuideModule
        ),
};

/**
 * This is the parent state for the delete account application.
 *
 */
export const deleteAccountFutureState = {
    name: 'app.deleteaccount.**',
    url: '/delete-account',
    data: {
        requiresAuth: false,
    },
    loadChildren: () =>
        import('./features/delete-account/delete-account.module').then(
            m => m.DeleteAccountModule
        ),
};

/**
 * This is the welcome state. It is used to display a welcome message to the user.
 * It is accessible without authentication.
 */
export const welcomeState = {
    name: 'auth.welcome',
    url: '/welcome',
    data: {
        requiresAuth: false,
        public: true,
    },
    component: EmpowerWelcomeComponent,
};

/**
 * This contains all the states used for the entire application
 */
export const APP_STATES = [
    appState,
    advantageFutureState,
    healthCrmFutureState,
    aiFutureState,
    feedbackFutureState,
    onboardingFutureState,
    surveyFutureState,
    summaryFutureState,
    tosFutureState,
    authState,
    loginState,
    logoutState,
    completeState,
    workStationState,
    appsState,
    signUpState,
    welcomeState,
    errorState,
    resetPasswordState,
    resetPasswordFormState,
    autoreconFutureState,
    userGuideFutureState,
    deleteAccountFutureState,
    publicRiskAssessmentFutureState,
];

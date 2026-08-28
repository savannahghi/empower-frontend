import { StepsCompletionComponent } from './completion/steps-completion.component';
import { MemberInvitesComponent } from './member-invites/member-invites.component';
import { FeaturesComponent } from '../features.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { NextStepsComponent } from './next-steps/next-steps.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { OnboardingStepperComponent } from './onboarding-stepper/onboarding-stepper.component';
/**
 * Contains the features component which
 * the sidebar and header components
 */
export const onboardingState = {
    name: 'app.onboarding',
    url: '/onboarding',
    data: {
        requiresAuth: false,
    },
    redirectTo: 'app.onboarding.welcome',
    component: FeaturesComponent,
};

/**
 * Onboarding form for collecting basic details
 */
export const onboardingStepperState = {
    name: 'app.onboarding.kyc',
    data: {
        requiresAuth: false,
    },
    url: '/kyc?step',
    component: OnboardingStepperComponent,
};

/**
 * Onboarding form for collecting basic details
 */
export const basicDetailsState = {
    name: 'app.onboarding.details',
    data: {
        requiresAuth: true,
    },
    url: '/basic-details',
    component: BasicDetailsComponent,
};

/**
 * This is the provider onboarding Next steps state. It is used when show a user/provider
 * a summary of the steps in the on boarding process after succesffuly creating an account
 */
export const nextStepsState = {
    name: 'app.onboarding.next-steps',
    data: {
        requiresAuth: true,
    },
    url: '/next-steps',
    component: NextStepsComponent,
};

/**
 * This is the provider onboarding welcome state. It's used when a user/provider has
 * successfully created account, logged in and is now on boarding
 */
export const welcomeState = {
    name: 'app.onboarding.welcome',
    data: {
        requiresAuth: true,
    },
    url: '/welcome',
    component: WelcomeComponent,
};

/**
 * This is the provider onboarding Success state. It is used when a user/provider
 * has successfully completed the on boarding process
 */
export const successState = {
    name: 'app.onboarding.success',
    data: {
        requiresAuth: true,
    },
    url: '/success',
    component: StepsCompletionComponent,
};
/**
 * This is the provider onboarding member Invites state. It's used to
 * send member invites after provider has successfully completed the on boarding process
 */
export const memberInvitiesState = {
    name: 'app.onboarding.invite-members',
    data: {
        requiresAuth: true,
    },
    url: '/invite-members',
    component: MemberInvitesComponent,
};
/**
 * Contains the onboarding states
 */
export const ONBOARDING_STATES = [
    onboardingState,
    basicDetailsState,
    welcomeState,
    nextStepsState,
    onboardingStepperState,
    successState,
    memberInvitiesState,
];

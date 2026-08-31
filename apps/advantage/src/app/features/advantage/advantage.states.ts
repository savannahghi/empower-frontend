import { Ng2StateDeclaration, Transition } from '@uirouter/angular';
import { environment } from '../../../environments/environment';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { QuintusAuthorizationService } from '../../shared/sil-http-services/quintus.authorization.service';
import { ViewFormComponent } from '../../shared/sil-view-form/view-form.component';
import { FeaturesComponent } from '../features.component';
import { ResolverService } from '../services/resolver.service';
import { ProviderBranchesDetailsComponent } from './home/provider-details/provider-branches-details/provider-branches-details.component';
import { ProviderDetailsComponent } from './home/provider-details/provider-details.component';
import { ProviderFeaturesDetailsComponent } from './home/provider-details/provider-features-details/provider-features-details.component';
import { ProviderListingComponent } from './home/provider-listing/provider-listing.component';
import { ProviderRegistrationComponent } from './home/provider-registration/provider-registration.component';

/**
 * Show the correct URL based on Variant
 */
const variant = environment.variant;
const variantURL = variant !== 'default' ? `/${variant}` : '/advantage';

/**
 * Contains the features component which
 * the sidebar and header components
 */
export const advantageState = {
    name: 'app.advantage',
    url: variantURL,
    resolve: [
        {
            token: 'quintusTokenObservable',
            deps: [QuintusAuthorizationService, Authorization],
            resolveFn: (quintusAuth, auth) => {
                const user = auth.getUser();
                const token = auth.getToken();
                return quintusAuth.getJWTToken(user, token);
            },
        },
    ],
    data: {
        requiresAuth: true,
    },
    redirectTo: 'app.advantage.home',
    component: FeaturesComponent,
};

/** providersState
 * State contains the providers component that
 * contains a list of the organisations that have
 * been setup on advantage
 */
export const providersState: Ng2StateDeclaration = {
    name: 'app.advantage.providers',
    breadcrumb: () => 'Business Partners',
    url: '/business_partners?search&page_size&page',
    data: {
        requiresAuth: true,
        permission: 'advantage.organisation_list',
    },
    component: ProviderListingComponent,
};

/** registerProviderState
 * State contains the register provider component that
 * allows someone to register an organisation
 */
export const registerProviderState: Ng2StateDeclaration = {
    name: 'app.advantage.providers.registerProvider',
    url: '/register_bp',
    breadcrumb: () => 'Register Business Partner',
    data: {
        requiresAuth: true,
        permission: 'advantage.appointment_list',
    },
    component: ProviderRegistrationComponent,
    views: {
        '$default@app.advantage': {
            component: ProviderRegistrationComponent,
        },
    },
};

/** providersDetailsState
 * State contains the providers details component that
 * contains details of the organisations that have
 * been setup on advantage
 */
export const providersDetailsState: Ng2StateDeclaration = {
    name: 'app.advantage.providers.detail',
    url: '/view/:id',
    redirectTo: 'app.advantage.providers.detail.branches',
    breadcrumb: () => 'Business Partner Details',
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'organisationObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc, transition) =>
                resolveSvc.resolveItem(
                    'erp-organisations',
                    transition.params().id
                ),
        },
    ],
    bindings: {
        resolveData: 'organisationObservable',
    },

    views: {
        '$default@app.advantage': { component: ProviderDetailsComponent },
    },
};

/**
 * providersBranchesDetailsState
 *
 * This is the default tab (Branches) for Business Partner details.
 */
export const providersBranchesDetailsState: Ng2StateDeclaration = {
    name: 'app.advantage.providers.detail.branches',
    url: '/branches',
    breadcrumb: () => 'Branches',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.providers.detail': {
            component: ProviderBranchesDetailsComponent,
            bindings: {
                organisationDetails: 'organisationObservable',
            },
        },
    },
};

/**
 * providersFeaturesDetailsState
 *
 * This state defines the "Features" view for a specific Business Partner
 * in Advantage Admin. It allows configuring organization-specific features
 * such as enabling or disabling Biometrics, eTIMS workflows.
 */
export const providersFeaturesDetailsState: Ng2StateDeclaration = {
    name: 'app.advantage.providers.detail.features',
    url: '/features',
    breadcrumb: () => 'Features',
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'organisationObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc, transition) =>
                resolveSvc.resolveItem(
                    'erp-organisations',
                    transition.params().id
                ),
        },
    ],
    bindings: {
        resolveData: 'organisationObservable',
    },
    views: {
        'detail@app.advantage.providers.detail': {
            component: ProviderFeaturesDetailsComponent,
            bindings: {
                organisationDetails: 'organisationObservable',
            },
        },
    },
};

export const editProviderState: Ng2StateDeclaration = {
    name: 'app.advantage.providers.detail.edit',
    url: '/edit',
    breadcrumb: () => 'Edit Organisation',
    data: {
        requiresAuth: true,
        pageTitle: 'Edit Organisation',
        pageSubTitle: 'Edit your organisation details here',
        formRecordId: 'id',
        recordDisplay: 'Success!',
        goBackState: 'app.advantage.providers.detail',
        patchId: 'id',
        isService: true,
        formFields: 'provService',
        formStore: 'erp-organisations',
    },
    views: {
        '$default@app.advantage': {
            component: ViewFormComponent,
        },
    },
};
/**
 * Future state for inbox states
 * reference the inbox module for more information
 */
export const inboxFutureState = {
    name: 'app.advantage.inbox.**',
    data: {
        requiresAuth: true,
    },
    breadcrumb: () => 'Inbox',
    url: '/inbox',
    loadChildren: () => import('./inbox/inbox.module').then(m => m.InboxModule),
};

/**
 * Future state for home states in the advantage app.
 * Reference the home module for more information
 */
export const homeFutureState = {
    name: 'app.advantage.home.**',
    data: {
        requiresAuth: true,
    },
    url: '/home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
};

/**
 * Future state for check-in states
 * reference the checkin module for more information
 */
export const checkinFutureState = {
    name: 'app.advantage.checkin.**',
    data: {
        requiresAuth: true,
    },
    url: '/checkin',
    loadChildren: () =>
        import('./check-in/check-in.module').then(m => m.CheckInModule),
};

/**
 * Future state for patient states
 * reference the patients module for more information
 */
export const patientFutureState = {
    name: 'app.advantage.patients.**',
    data: {
        requiresAuth: true,
    },
    url: '/patients',
    loadChildren: () =>
        import('./patients/patients.module').then(m => m.PatientsModule),
};

/**
 * Future state for Enrollment states
 * reference the Enrollment module for more information
 */
export const enrollmentFutureState = {
    name: 'app.advantage.enrollment.**',
    data: {
        requiresAuth: true,
    },
    url: '/enrollment',
    loadChildren: () =>
        import('./enrollment/enrollment.module').then(m => m.EnrollmentModule),
};

/**
 * Future state for visit states
 * reference the visits module for more information
 */
export const visitFutureState = {
    name: 'app.advantage.visits.**',
    data: {
        requiresAuth: true,
    },
    url: '/visits',
    loadChildren: () =>
        import('./visits/visits.module').then(m => m.VisitsModule),
};

/**
 * Future state for queue states
 * reference the queues module for more information
 */
export const queueFutureState = {
    name: 'app.advantage.queues.**',
    data: {
        requiresAuth: true,
    },
    url: '/queues',
    loadChildren: () =>
        import('./queues/queues.module').then(m => m.QueuesModule),
};

/**
 * Future state for billing states
 */
export const billingFutureState = {
    name: 'app.advantage.billing.**',
    data: {
        requiresAuth: true,
    },
    url: '/billing',
    loadChildren: () =>
        import('./billing/billing.module').then(m => m.BillingModule),
};

/**
 * Future state for appointments states
 * reference the appointments module for more information
 */
export const appointmentFutureState = {
    name: 'app.advantage.appointments.**',
    data: {
        requiresAuth: true,
    },
    url: '/appointments',
    loadChildren: () =>
        import('./appointments/appointments.module').then(
            m => m.AppointmentsModule
        ),
};

/**
 * Future state for screenings states
 * reference the screenings module for more information
 */
export const screeningsFutureState = {
    name: 'app.advantage.screenings.**',
    data: {
        requiresAuth: true,
    },
    url: '/screenings',
    loadChildren: () =>
        import('./screenings/screenings.module').then(m => m.ScreeningsModule),
};
/**
 * Future state for medications states
 * reference the medications module for more information
 */
export const medicationsFutureState = {
    name: 'app.advantage.medications.**',
    data: {
        requiresAuth: true,
    },
    url: '/medications',
    loadChildren: () =>
        import('./medications/medications.module').then(
            m => m.MedicationsModule
        ),
};

/**
 * Future state for referrals states
 * reference the referrals module for more information
 */
export const referralsFutureState = {
    name: 'app.advantage.referrals.**',
    url: '/referrals',
    breadcrumb: () => 'Referrals',
    data: {
        requiresAuth: true,
    },
    loadChildren: () =>
        import('./referrals/referrals.module').then(m => m.ReferralsModule),
};

/**
 * Future state for lab order states
 * reference the lab order module for more information
 */
export const labOrdersFutureState = {
    name: 'app.advantage.lab_orders.**',
    url: '/lab_orders',
    breadcrumb: () => 'Orders',
    data: {
        requiresAuth: true,
    },
    loadChildren: () =>
        import('./lab-orders/lab-orders.module').then(m => m.LabOrdersModule),
};

/**
 * Future state for lab order states
 * reference the lab order module for more information
 */
export const followupsFutureState = {
    name: 'app.advantage.followups.**',
    url: '/followups',
    breadcrumb: () => 'Follow-ups',
    data: {
        requiresAuth: true,
    },
    loadChildren: () =>
        import('./followups/followups.module').then(m => m.FollowupsModule),
};

/**
 * Future state for dashboard states
 * reference the dashboard module for more information
 */
export const dashboardFutureState = {
    name: 'app.advantage.dashboard.**',
    data: {
        requiresAuth: true,
    },
    url: '/dashboard',
    loadChildren: () =>
        import('./dashboard/dashboard.module').then(m => m.DashboardModule),
};

/**
 * Future state for setting states
 * reference the settings module for more information
 */
export const settingFutureState = {
    name: 'app.advantage.settings.**',
    data: {
        requiresAuth: true,
    },
    url: '/settings',
    loadChildren: () =>
        import('./settings/settings.module').then(m => m.SettingsModule),
};

/**
 * Future state for user management states
 */
export const userMgmtFutureState = {
    name: 'app.advantage.usermgmt.**',
    data: {
        requiresAuth: true,
    },
    url: '/usermgmt',
    loadChildren: () =>
        import('./usermgmt/usermgmt.module').then(m => m.UserMgmtModule),
};

/**
 * Future state for user profile states
 */
export const manageUserProfileFutureState = {
    name: 'app.advantage.manage.**',
    data: {
        requiresAuth: true,
    },
    url: '/manage',
    loadChildren: () =>
        import('./usermgmt/usermgmt.module').then(m => m.UserMgmtModule),
};

/**
 * Contains all the ui router states in the advantage module
 */
export const ADVANTAGE_STATES = [
    advantageState,
    providersState,
    homeFutureState,
    checkinFutureState,
    patientFutureState,
    enrollmentFutureState,
    queueFutureState,
    billingFutureState,
    visitFutureState,
    appointmentFutureState,
    dashboardFutureState,
    settingFutureState,
    userMgmtFutureState,
    screeningsFutureState,
    referralsFutureState,
    labOrdersFutureState,
    inboxFutureState,
    registerProviderState,
    providersDetailsState,
    providersBranchesDetailsState,
    providersFeaturesDetailsState,
    editProviderState,
    medicationsFutureState,
    followupsFutureState,
    manageUserProfileFutureState,
];

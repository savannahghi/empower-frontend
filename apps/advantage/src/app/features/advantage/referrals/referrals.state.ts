import { HieReferralsComponent } from './hie-referrals/hie-referrals.component';
import { ReferralsListComponent } from './referrals-list/referrals-list.component';

/**
 * Contains the referrals list component
 * The list referrals component allows you to search for referrals
 */
export const referralsState = {
    name: 'app.advantage.referrals',
    url: '/referrals?after&before&status&patient',
    breadcrumb: () => 'Referrals',
    data: {
        requiresAuth: true,
    },
    component: ReferralsListComponent,
};

/**
 * Contains the hie referrals component
 * The hie referrals component allows you to search for referrals
 */
export const hieReferralsState = {
    name: 'app.advantage.hie-referrals',
    url: '/hie-referrals?after&before&referral_type&status',
    breadcrumb: () => 'Referrals',
    data: {
        requiresAuth: true,
    },
    component: HieReferralsComponent,
};

/**
 * Contains all the ui router states in the referrals module
 */
export const REFERRALS_STATES = [referralsState, hieReferralsState];

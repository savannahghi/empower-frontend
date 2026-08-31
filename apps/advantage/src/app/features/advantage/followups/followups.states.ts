import { FollowupDetailsComponent } from './followup-details/followup-details.component';
import { FollowupsListComponent } from './followups-list/followups-list.component';

/**
 * Contains the followups list component
 * The list followups component allows you to search for followups
 */
export const followupsState = {
    name: 'app.advantage.followups',
    url: '/followups?after&before&status&facilityID&patient',
    breadcrumb: () => 'Follow-ups',
    data: {
        requiresAuth: true,
    },
    component: FollowupsListComponent,
};

/**
 * Contains the followup details component
 * The followup details component allows you to view the followup details
 */
export const followupDetailsState = {
    name: 'app.advantage.followups.detail',
    url: '/view/:taskId',
    breadcrumb: () => 'Followup Details',
    data: {
        requiresAuth: true,
    },
    views: {
        '$default@app.advantage': {
            component: FollowupDetailsComponent,
        },
    },
};
/**
 * Contains all the ui router states in the followups module
 */
export const FOLLOWUPS_STATES = [followupsState, followupDetailsState];

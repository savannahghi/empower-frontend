import { FeaturesComponent } from '../features.component';
import { UserGuideDetailsComponent } from './guide-details/user-guide-details.component';
import { UserGuideComponent } from './guide/user-guide.component';

/**
 * Parent state for the User Guide module
 */
export const userGuideParentState = {
    name: 'app.userguide',
    url: '/user-guides',
    breadcrumb: () => 'User Guides',

    data: {
        requiresAuth: true,
    },
    redirectTo: 'app.userguide.list',
    component: FeaturesComponent,
};

/**
 * State for the User Guide list
 */
export const userGuideListState = {
    name: 'app.userguide.list',
    url: '',
    component: UserGuideComponent,
};

/**
 * State for the User Guide topic details
 */
export const userGuideTopicState = {
    name: 'app.userguide.list.topic',
    url: '/topic/:topicId/:topicName/',
    breadcrumb: () => 'User Guides Details',
    data: {
        requiresAuth: true,
    },
    views: {
        '$default@app.userguide': {
            component: UserGuideDetailsComponent,
        },
    },
};

/**
 * Contains all User Guide states
 */
export const USER_GUIDE_STATES = [
    userGuideParentState,
    userGuideListState,
    userGuideTopicState,
];

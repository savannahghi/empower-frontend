import { FeaturesComponent } from '../features.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

/**
 * Parent state for the User Guide module
 */
export const deleteAccountParentState = {
    name: 'app.deleteaccount',
    url: '/delete-account',
    data: {
        requiresAuth: false,
    },
    redirectTo: 'app.deleteaccount.view',
    component: FeaturesComponent,
};

/**
 * State for the User Guide list
 */
export const deleteAccountState = {
    name: 'app.deleteaccount.view',
    breadcrumb: () => 'Delete Account',
    url: '',
    component: DeleteAccountComponent,
};

/**
 * Contains all User Guide states
 */
export const DELETE_ACCOUNT_STATES = [
    deleteAccountParentState,
    deleteAccountState,
];

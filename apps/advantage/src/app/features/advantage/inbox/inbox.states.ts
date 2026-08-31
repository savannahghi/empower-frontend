import { Ng2StateDeclaration } from '@uirouter/angular';
import { InboxComponent } from './inbox-component/inbox.component';
import { ListComponent } from '../../../shared/list/list.component';
import { environment } from '../../../../environments/environment';

/**
 * Parent of the inbox states
 */
export const inboxState = {
    name: 'app.advantage.inbox',
    url: '/inbox',
    redirect: 'app.advantage.inbox.notifications',
    data: {
        requiresAuth: true,
    },
};

/**
 * Contains the notification component
 */
export const notificationsState: Ng2StateDeclaration = {
    name: 'app.advantage.inbox.notifications',
    url: '/notifications?search&page_size&page',
    breadcrumb: () => 'Notifications',
    data: {
        requiresAuth: true,
        hideCreateButton: true,
        etimsRows: [
            {
                key: 'title',
                type: 'string',
            },
            {
                key: 'content',
                type: 'string',
            },
            {
                key: 'registration_name',
                type: 'string',
            },
            {
                key: 'registration_date',
                type: 'date',
            },
        ],
        etimsTableHeader: [
            { text: 'Title' },
            { text: 'Contents' },
            { text: 'Registration Name' },
            { text: 'Registration Date' },
            { text: 'Action' },
        ],
        etimsHeaderActions: [
            {
                btnText: 'eTIMS Sync',
                status: 'primary',
                action: 'apiCall',
                actionConf: {
                    httpMethod: 'list',
                    api: 'sync-notices',
                    successTitle: 'Success',
                    successMessage: 'Synchronised eTIMS notices Successfully',
                    failedTitle: 'Failed',
                    failedMessage: 'Failed to synchronise eTIMS notices',
                },
                featureFlag: environment.displayFeature === 'true',
            },
        ],

        actionsEtims: [
            {
                btnText: 'shared.buttons.view',
                status: 'success',
                action: 'custom',
                modalConf: {
                    openModal: true,
                    HttpMethod: 'update',
                    api: 'sync-notices',
                    method: 'viewRowDetails',
                },
            },
        ],

        pageTitle: 'eTIMS Notices',
        pageSubTitle: 'Find all your eTIMS notices here',
        hasSearch: true,
        formlyJsonFilename: 'notices-modal',
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'notices',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: ListComponent,
        },
    },
};

/**
 * Contains the inbox component
 */
export const inboxComponentState: Ng2StateDeclaration = {
    name: 'app.advantage.inbox.inbox',
    url: '/inbox',
    breadcrumb: () => 'Inbox',
    data: {
        requiresAuth: true,
    },
    views: {
        '$default@app.advantage': {
            component: InboxComponent,
        },
    },
};

/**
 * Contains all the ui router states in the clinics module
 */
export const INBOX_STATES = [
    inboxState,
    inboxComponentState,
    notificationsState,
];

import { Ng2StateDeclaration } from '@uirouter/angular';
import { DashboardWrapperComponent } from '../../../../shared/embedded-dashboard/dashboard-wrapper.component';

/**
 * Contains the messages dashboard component
 * The messages dashboard component allows you to view messages analytics
 */
export const messagesDashboardState: Ng2StateDeclaration = {
    name: 'app.advantage.dashboard.message-dashboard',
    url: '/messages-dashboard',
    breadcrumb: () => 'Messages Dashboard',
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'dashboardKey',
            resolveFn: () => 'MESSAGES',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: DashboardWrapperComponent,
        },
    },
};

import { Ng2StateDeclaration } from '@uirouter/angular';
import { DashboardWrapperComponent } from '../../../../shared/embedded-dashboard/dashboard-wrapper.component';

/**
 * Contains the engagement dashboard component
 * The engagement dashboard component allows you to view engagement analytics
 */
export const engagementDashboardState: Ng2StateDeclaration = {
    name: 'app.advantage.dashboard.engagement-dashboard',
    url: '/engagement-dashboard',
    breadcrumb: () => 'Engagement Dashboard',
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'dashboardKey',
            resolveFn: () => 'ENGAGEMENT',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: DashboardWrapperComponent,
        },
    },
};

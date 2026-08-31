import { Ng2StateDeclaration } from '@uirouter/angular';
import { DashboardWrapperComponent } from '../../../../shared/embedded-dashboard/dashboard-wrapper.component';

/**
 * Contains the executive dashboard component
 * The executive dashboard component allows authorized users to view executive analytics
 *
 * Access Control:
 * - Only for accessafya variant (controlled via GrowthBook feature flag)
 * - Email-based access control (users must be in allowed emails list)
 */
export const executiveDashboardState: Ng2StateDeclaration = {
    name: 'app.advantage.dashboard.executive-overview',
    url: '/executive-overview',
    breadcrumb: () => 'Executive Overview',
    data: {
        requiresAuth: true,
        permission: '',
    },
    resolve: [
        {
            token: 'dashboardKey',
            resolveFn: () => 'EXECUTIVE_DASHBOARD',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: DashboardWrapperComponent,
        },
    },
};

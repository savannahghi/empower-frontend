import { Ng2StateDeclaration } from '@uirouter/angular';
import { DashboardWrapperComponent } from '../../../../shared/embedded-dashboard/dashboard-wrapper.component';

/**
 * Contains the visits dashboard component (embedded version)
 * The visits dashboard component allows you to view visits analytics via Superset
 */
export const visitsDashboardState: Ng2StateDeclaration = {
    name: 'app.advantage.dashboard.visits-dashboard',
    url: '/visits',
    breadcrumb: () => 'Visits',
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'dashboardKey',
            resolveFn: () => 'VISITS',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: DashboardWrapperComponent,
        },
    },
};

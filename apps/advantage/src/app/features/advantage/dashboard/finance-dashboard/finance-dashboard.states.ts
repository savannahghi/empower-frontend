import { Ng2StateDeclaration } from '@uirouter/angular';
import { DashboardWrapperComponent } from '../../../../shared/embedded-dashboard/dashboard-wrapper.component';

/**
 * Contains the finance dashboard component
 * The finance dashboard component allows you to view financial analytics
 */
export const financeDashboardState: Ng2StateDeclaration = {
    name: 'app.advantage.dashboard.finance-dashboard',
    url: '/finance-dashboard',
    breadcrumb: () => 'Finance',
    data: {
        requiresAuth: true,
        permission: 'erp.is_organisation_level',
    },
    resolve: [
        {
            token: 'dashboardKey',
            resolveFn: () => 'FINANCE',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: DashboardWrapperComponent,
        },
    },
};

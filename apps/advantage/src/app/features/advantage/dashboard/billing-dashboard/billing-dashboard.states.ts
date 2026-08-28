import { Ng2StateDeclaration } from '@uirouter/angular';
import { DashboardWrapperComponent } from '../../../../shared/embedded-dashboard/dashboard-wrapper.component';

/**
 * Contains the billing dashboard component
 * The billing dashboard component allows you to view billing analytics
 */
export const billingDashboardState: Ng2StateDeclaration = {
    name: 'app.advantage.dashboard.billing-dashboard',
    url: '/billing-dashboard',
    breadcrumb: () => 'Billing Dashboard',
    data: {
        requiresAuth: true,
        permission: 'erp.is_organisation_level',
    },
    resolve: [
        {
            token: 'dashboardKey',
            resolveFn: () => 'BILLING',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: DashboardWrapperComponent,
        },
    },
};

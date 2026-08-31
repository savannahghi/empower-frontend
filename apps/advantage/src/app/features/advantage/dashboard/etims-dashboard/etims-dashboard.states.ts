import { Ng2StateDeclaration } from '@uirouter/angular';
import { DashboardWrapperComponent } from '../../../../shared/embedded-dashboard/dashboard-wrapper.component';

/**
 * Contains the eTIMS dashboard component
 * The eTIMS dashboard component allows you to view eTIMS analytics
 */
export const eTIMSDashboardState: Ng2StateDeclaration = {
    name: 'app.advantage.dashboard.etims-dashboard',
    url: '/etims-dashboard',
    breadcrumb: () => 'eTIMS',
    data: {
        requiresAuth: true,
        permission: 'erp.perform_etims_operations',
    },
    resolve: [
        {
            token: 'dashboardKey',
            resolveFn: () => 'ETIMS',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: DashboardWrapperComponent,
        },
    },
};

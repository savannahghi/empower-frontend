import { Ng2StateDeclaration } from '@uirouter/angular';
import { DashboardWrapperComponent } from '../../../../shared/embedded-dashboard/dashboard-wrapper.component';

/**
 * Contains the inventory dashboard component
 * The inventory dashboard component allows you to view inventory analytics
 */
export const inventoryDashboardState: Ng2StateDeclaration = {
    name: 'app.advantage.dashboard.inventory-dashboard',
    url: '/inventory-dashboard',
    breadcrumb: () => 'Inventory',
    data: {
        requiresAuth: true,
        permission: 'erp.is_organisation_level',
    },
    resolve: [
        {
            token: 'dashboardKey',
            resolveFn: () => 'INVENTORY',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: DashboardWrapperComponent,
        },
    },
};

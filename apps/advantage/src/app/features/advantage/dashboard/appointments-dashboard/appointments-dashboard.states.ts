import { Ng2StateDeclaration } from '@uirouter/angular';
import { DashboardWrapperComponent } from '../../../../shared/embedded-dashboard/dashboard-wrapper.component';

/**
 * Contains the appointments dashboard component
 * The appointments dashboard component allows you to view appointments analytics
 */
export const appointmentsDashboardState: Ng2StateDeclaration = {
    name: 'app.advantage.dashboard.appointments-dashboard',
    url: '/appointments-dashboard',
    breadcrumb: () => 'Appointments Dashboard',
    data: {
        requiresAuth: true,
        permission: 'erp.is_organisation_level',
    },
    resolve: [
        {
            token: 'dashboardKey',
            resolveFn: () => 'APPOINTMENTS',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: DashboardWrapperComponent,
        },
    },
};

import { Ng2StateDeclaration } from '@uirouter/angular';
import { DashboardWrapperComponent } from '../../../../shared/embedded-dashboard/dashboard-wrapper.component';

/**
 * Contains the patients dashboard component
 * The patients dashboard component allows you to view patients analytics
 */
export const patientsDashboardState: Ng2StateDeclaration = {
    name: 'app.advantage.dashboard.patients-dashboard',
    url: '/patients-dashboard',
    breadcrumb: () => 'Patients',
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'dashboardKey',
            resolveFn: () => 'PATIENTS',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: DashboardWrapperComponent,
        },
    },
};

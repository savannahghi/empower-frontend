import { billingDashboardState } from './billing-dashboard/billing-dashboard.states';
import { engagementDashboardState } from './engagement-dashboard/engagement-dashboard.states';
import { messagesDashboardState } from './messages-dashboard/messages-dashboard.states';
import { patientsDashboardState } from './patients-dashboard/patients-dashboard.states';
import { eTIMSDashboardState } from './etims-dashboard/etims-dashboard.states';
import { inventoryDashboardState } from './inventory-dashboard/inventory-dashboard.states';
import { financeDashboardState } from './finance-dashboard/finance-dashboard.states';
import { visitsDashboardState } from './visits-dashboard/visits-dashboard.states';
import { appointmentsDashboardState } from './appointments-dashboard/appointments-dashboard.states';
import { executiveDashboardState } from './executive-dashboard/executive-dashboard.states';

/**
 * Contains the dashboard state
 */
export const dashboardState = {
    name: 'app.advantage.dashboard',
    url: '/dashboard',
    breadcrumb: () => 'Dashboard',
    data: {
        requiresAuth: true,
    },
    redirectTo: 'app.advantage.dashboard.billing-dashboard',
};

/**
 * Contains all the ui router states in the dashboard module
 */
export const DASHBOARD_STATES = [
    dashboardState,
    billingDashboardState,
    engagementDashboardState,
    messagesDashboardState,
    patientsDashboardState,
    eTIMSDashboardState,
    inventoryDashboardState,
    financeDashboardState,
    visitsDashboardState,
    appointmentsDashboardState,
    executiveDashboardState,
];

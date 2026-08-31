import { LabOrdersListComponent } from './lab-orders-list/lab-orders-list.component';

/**
 * Contains the lab orders list component
 * The list lab orders component allows you to search for lab orders
 */
export const labOrdersState = {
    name: 'app.advantage.lab_orders',
    url: '/lab_orders?after&before&status&facilityID&patient',
    breadcrumb: () => 'Orders',
    data: {
        requiresAuth: true,
    },
    component: LabOrdersListComponent,
};

/**
 * Contains all the ui router states in the lab orders module
 */
export const LAB_ORDERS_STATES = [labOrdersState];

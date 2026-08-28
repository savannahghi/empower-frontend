import { SmsListComponent } from './sms-list/sms-list.component';
/**
 * Contains the worklist state
 */
export const smslistState = {
    name: 'app.advantage.billing',
    url: '/billing',
    breadcrumb: () => 'Billing',
    data: {
        requiresAuth: true,
    },
    component: SmsListComponent,
};

/**
 * Contains all the ui router states in the billing module
 */
export const BILLING_STATES = [smslistState];

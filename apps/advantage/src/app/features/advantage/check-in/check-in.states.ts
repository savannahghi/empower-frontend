import { Ng2StateDeclaration } from '@uirouter/angular';
import { CheckInListComponent } from './check-in-list/check-in-list.component';
import { AddFutureCheckInComponent } from './add-future-check-in/add-future-check-in.component';

/**
 * Renders the check-in list component
 * and search, filter for any appointment
 */
export const checkinState: Ng2StateDeclaration = {
    name: 'app.advantage.checkin',
    url: '/checkin?search&page_size&page&from_date&start&to_date&schedule_id&appointment_status&ordering',
    breadcrumb: () => 'Check-In',
    data: {
        requiresAuth: true,
    },
    component: CheckInListComponent,
};

export const futureCheckinState: Ng2StateDeclaration = {
    name: 'app.advantage.checkin.future',
    url: '/add-future-checkin?state',
    breadcrumb: () => 'Add Future Check-In',
    data: {
        requiresAuth: true,
    },
    component: AddFutureCheckInComponent,
    views: {
        '$default@app.advantage': {
            component: AddFutureCheckInComponent,
        },
    },
};
/**
 * Contains all the ui router states in the appointments module
 */
export const CHECKIN_STATES = [checkinState, futureCheckinState];

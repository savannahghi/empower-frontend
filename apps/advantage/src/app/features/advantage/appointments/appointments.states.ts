import { Ng2StateDeclaration } from '@uirouter/angular';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AddAppointmentComponent } from './add-appointment/add-appointment.component';

/**
 * Renders the appointment list component
 * and search, filter for any appointment
 */
export const appointmentState = {
    name: 'app.advantage.appointments',
    url: '/appointments?ordering&appointment_status&schedule&search&id&page_size&page&from_date&start&to_date&schedule_id&present_date&schedule_actor',
    breadcrumb: () => 'Appointments',
    data: {
        requiresAuth: true,
        permission: 'advantage.appointment_list:advantage.schedule_list',
    },
    component: AppointmentListComponent,
};

/**
 * Renders the add appointment component
 * and allows one to create an appointment
 */
export const addAppointmentState: Ng2StateDeclaration = {
    name: 'app.advantage.appointments.add',
    url: '/add',
    breadcrumb: () => 'Book appointment',
    data: {
        requiresAuth: true,
    },
    views: {
        '$default@app.advantage': {
            component: AddAppointmentComponent,
        },
    },
};

/**
 * Renders the add appointment component
 * and allows one to edit the appointment details
 */
export const viewAppointmentState: Ng2StateDeclaration = {
    name: 'app.advantage.appointments.detail',
    url: '/view/:appointment_id/',
    breadcrumb: () => 'Edit appointment',
    data: {
        requiresAuth: true,
    },
    views: {
        '$default@app.advantage': {
            component: AddAppointmentComponent,
        },
    },
};

/**
 * Contains all the ui router states in the appointments module
 */
export const APPOINTMENT_STATES = [
    appointmentState,
    addAppointmentState,
    viewAppointmentState,
];

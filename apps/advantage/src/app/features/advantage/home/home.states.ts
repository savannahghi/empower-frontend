/** Imports used in the states */
import { Ng2StateDeclaration } from '@uirouter/angular';
import { HomePageComponent } from './home-page/home-page.component';
import { AddAppointmentComponent } from '../appointments/add-appointment/add-appointment.component';
import { ViewAppointmentComponent } from './view-appointment/view-appointment.component';

/** homeState
 * State contains the home page component that
 * contains an agenda view for appointments
 * and also quick access links to the rest of the advantage
 * web app
 */
export const homeState = {
    name: 'app.advantage.home',
    breadcrumb: () => 'Home',
    url: '/home',
    data: {
        requiresAuth: true,
    },
    component: HomePageComponent,
};

/** addAppointmentState
 * State contains the add appointment component that
 * allows someone to add a new appointment
 */
export const addAppointmentState: Ng2StateDeclaration = {
    name: 'app.advantage.home.addAppointment',
    url: '/add-appointment',
    breadcrumb: () => 'Add appointment',
    data: {
        requiresAuth: true,
        permission: 'advantage.appointment_create',
    },
    views: {
        '$default@app.advantage': {
            component: AddAppointmentComponent,
        },
    },
};

/** viewAppointmentstate
 * State contains the view appointment component that
 * allows someone to view an appointment that showed up
 * in the agenda view in the home page component
 */
export const viewAppointmentState: Ng2StateDeclaration = {
    name: 'app.advantage.home.viewAppointment',
    url: '/view/:id/',
    breadcrumb: () => 'View appointment',
    data: {
        requiresAuth: true,
        permission: 'advantage.appointment_list',
    },
    component: ViewAppointmentComponent,
    views: {
        '$default@app.advantage': {
            component: ViewAppointmentComponent,
        },
    },
};

/**
 * Contains all the ui router states in the home module
 */
export const HOME_STATES = [
    homeState,
    addAppointmentState,
    viewAppointmentState,
];

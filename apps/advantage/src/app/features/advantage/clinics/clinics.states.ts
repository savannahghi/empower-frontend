import { ClinicAvailabilityComponent } from './clinic-availability/clinic-availability.component';
import { Ng2StateDeclaration } from '@uirouter/angular';
import { ClinicListComponent } from './clinic-list/clinic-list.component';
import { ViewClinicComponent } from './view-clinic/view-clinic.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { SchedulingInformationComponent } from './view-clinic/scheduling-information/scheduling-information.component';

/**
 * Contains the clinic list component
 * The list clinic component allows you to search for clinics
 */
export const clinicState = {
    name: 'app.advantage.clinics',
    url: '/clinics?search&page&page_size&actor&nullstate',
    breadcrumb: () => 'Clinics',
    data: {
        requiresAuth: true,
    },
    component: ClinicListComponent,
};

/**
 * Contains the clinic add component
 * The list clinic component allows you to add new clinic
 */
export const clinicAddState: Ng2StateDeclaration = {
    name: 'app.advantage.clinics.add',
    url: '/add',
    breadcrumb: () => 'Add clinic',
    data: {
        requiresAuth: true,
    },
    views: {
        '$default@app.advantage': {
            component: SchedulingInformationComponent,
        },
    },
};

/**
 * Contains the clinic view component
 * The view clinic component allows you to view a clinic and edit it
 */
export const viewClinicState: Ng2StateDeclaration = {
    name: 'app.advantage.clinics.detail',
    url: '/view/:id',
    breadcrumb: () => 'View Clinic',
    data: {
        requiresAuth: true,
    },
    component: ViewClinicComponent,
    views: {
        '$default@app.advantage': {
            component: ViewClinicComponent,
        },
    },
    redirectTo: 'app.advantage.clinics.detail.scheduling-information',
};

/**
 * Contains the doctors' view component
 * The view doctor component allows you to view doctors' list
 */
export const listDoctorState: Ng2StateDeclaration = {
    name: 'app.advantage.practitioners',
    url: '/practitioners?search&page&page_size',
    breadcrumb: () => 'Practitioners',
    data: {
        requiresAuth: true,
    },
    component: DoctorsComponent,
    views: {
        '$default@app.advantage': {
            component: DoctorsComponent,
        },
    },
};

export const schedulingInformationState: Ng2StateDeclaration = {
    name: 'app.advantage.clinics.detail.scheduling-information',
    url: '/scheduling-information/',
    breadcrumb: () => 'Scheduling Information',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.clinics.detail': {
            component: SchedulingInformationComponent,
        },
    },
};

/**
 * Contains the clinic availability component
 * The clinic availability component allows one to edit the availabilty of a clinic
 */
export const clinicAvalilabilityState: Ng2StateDeclaration = {
    name: 'app.advantage.clinics.detail.clinic-availability',
    url: '/availability/',
    breadcrumb: () => 'Edit Availability ',
    data: {
        requiresAuth: true,
    },
    component: ClinicAvailabilityComponent,
    views: {
        'detail@app.advantage.clinics.detail': {
            component: ClinicAvailabilityComponent,
        },
    },
};

/**
 * Contains all the ui router states in the clinics module
 */
export const CLINIC_STATES = [
    clinicState,
    clinicAddState,
    viewClinicState,
    listDoctorState,
    clinicAvalilabilityState,
    schedulingInformationState,
];

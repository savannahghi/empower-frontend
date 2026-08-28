import { Ng2StateDeclaration } from '@uirouter/angular';
import { ScreeningsListComponent } from './screenings-list/screenings-list.component';
import { ExaminationsListComponent } from './examinations-list/examinations-list.component';
import { ExaminationsDetailsComponent } from './examinations-details/examinations-details.component';

/**
 * Screenings state which is the parent state for all screenings related states
 */
export const screeningsState: Ng2StateDeclaration = {
    name: 'app.advantage.screenings',
    url: '/screenings',
    breadcrumb: () => 'Screenings',
    redirectTo: 'app.advantage.screenings.risk-assessments',
    data: {
        requiresAuth: true,
        permission: 'auth.user_view',
    },
};

/**
 * Risk assessments state which is the screenings list
 */
export const riskAssessmentsState: Ng2StateDeclaration = {
    name: 'app.advantage.screenings.risk-assessments',
    url: '/risk-assessments?search&page&patient_name',
    breadcrumb: () => 'Risk Assessments',
    data: {
        requiresAuth: true,
        permission: 'auth.user_view',
    },
    views: {
        '$default@app.advantage': {
            component: ScreeningsListComponent,
        },
    },
};

/**
 * Examinations state
 */
export const examinationsState: Ng2StateDeclaration = {
    name: 'app.advantage.screenings.examinations',
    url: '/examinations?search&page&patient_name&status',
    breadcrumb: () => 'Examinations',
    data: {
        requiresAuth: true,
        permission: 'auth.user_view',
    },
    views: {
        '$default@app.advantage': {
            component: ExaminationsListComponent,
        },
    },
};

export const examinationsDetailsState: Ng2StateDeclaration = {
    name: 'app.advantage.screenings.examinations-details',
    url: '/examinations-details/:observationId/:examinationType?usageContext&timeRecorded&patientId',
    breadcrumb: () => 'Examination Details',
    data: {
        requiresAuth: true,
        permission: 'auth.user_view',
    },
    views: {
        '$default@app.advantage': {
            component: ExaminationsDetailsComponent,
        },
    },
    params: {
        observationId: null,
        examinationType: null,
        usageContext: null,
        timeRecorded: null,
        patientId: null,
    },
};

/**
 * Contains all the ui router states in the screenings module
 */
export const SCREENINGS_STATES = [
    screeningsState,
    riskAssessmentsState,
    examinationsState,
    examinationsDetailsState,
];

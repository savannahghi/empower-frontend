import { VisitPatientScreeningComponent } from './screening/visit-patient-screening.component';
import { ScreeningRecordComponent } from './screening-record/screening-record.component';

/**
 * Contains the visit patient screening component where the patient screening forms are added
 */
export const visitPatientScreeningState = {
    name: 'app.advantage.visits.detail.screening',
    breadcrumb: () => 'Screening',
    url: '/screening',
    data: {
        requiresAuth: true,
    },
    component: VisitPatientScreeningComponent,
    views: {
        'detail@app.advantage.visits.detail': {
            component: VisitPatientScreeningComponent,
        },
    },
};

/**
 * Renders the Cerival Cancer Screening Section
 */
export const cervicalCancerState = {
    name: 'app.advantage.visits.detail.screening.cervical_cancer',
    url: '/:encounter_id/cervical_cancer?step&choice',
    breadcrumb: () => 'Cervical Cancer',
    data: {
        requiresAuth: true,
    },
    views: {
        'screening@app.advantage.visits.detail.screening': {
            component: ScreeningRecordComponent,
        },
    },
};

/**
 * Renders the Breast Cancer Screening Section
 */
export const breastCancerState = {
    name: 'app.advantage.visits.detail.screening.breast_cancer',
    url: '/:encounter_id/breast_cancer?step&choice',
    breadcrumb: () => 'Breast Cancer',
    data: {
        requiresAuth: true,
    },
    views: {
        'screening@app.advantage.visits.detail.screening': {
            component: ScreeningRecordComponent,
        },
    },
};

/**
 * Renders the Prostate Cancer Screening Section
 */
export const prostateCancerState = {
    name: 'app.advantage.visits.detail.screening.prostate_cancer',
    url: '/:encounter_id/prostate_cancer?step&choice',
    breadcrumb: () => 'Prostate Cancer',
    data: {
        requiresAuth: true,
    },
    views: {
        'screening@app.advantage.visits.detail.screening': {
            component: ScreeningRecordComponent,
        },
    },
};
/**
 * Contains the empower screening states
 */
export const VISIT_SCREENING_STATES = [
    visitPatientScreeningState,
    cervicalCancerState,
    breastCancerState,
    prostateCancerState,
];

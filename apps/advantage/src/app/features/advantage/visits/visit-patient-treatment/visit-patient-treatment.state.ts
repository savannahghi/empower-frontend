import { VisitPatientTreatmentComponent } from './treatment/visit-patient-treatment.component';
/**
 * Contains the visit patient treatment component where the patient treatment forms are added
 */
export const visitPatientTreatmentState = {
    name: 'app.advantage.visits.detail.treatment',
    breadcrumb: () => 'Treatment',
    url: '/treatment',
    data: {
        requiresAuth: true,
    },
    component: VisitPatientTreatmentComponent,
    views: {
        'detail@app.advantage.visits.detail': {
            component: VisitPatientTreatmentComponent,
        },
    },
};

/**
 * Contains the empower screening states
 */
export const VISIT_TREATMENT_STATES = [visitPatientTreatmentState];

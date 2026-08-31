import { VisitPatientDiagnosticsComponent } from './diagnostics/visit-patient-diagnostics.component';
import { DiagnosisLinkageComponent } from './diagnosis-linkage/diagnosis-linkage.component';
/**
 * Contains the visit patient diagnostics component where the patient diagnostics forms are added
 */
export const visitPatientDiagnosticsState = {
    name: 'app.advantage.visits.detail.diagnostics',
    breadcrumb: () => 'Diagnostics',
    url: '/diagnostics',
    data: {
        requiresAuth: true,
    },
    component: VisitPatientDiagnosticsComponent,
    views: {
        'detail@app.advantage.visits.detail': {
            component: VisitPatientDiagnosticsComponent,
        },
    },
};

/**
 * Contains the visit patient diagnostics component where the patient diagnostics forms are added
 */
export const visitDiagnosisLinkageState = {
    name: 'app.advantage.visits.detail.diagnosis_linkage',
    breadcrumb: () => 'Diagnosis & Linkage',
    url: '/diagnosis_linkage',
    data: {
        requiresAuth: true,
    },
    component: DiagnosisLinkageComponent,
    views: {
        'detail@app.advantage.visits.detail': {
            component: DiagnosisLinkageComponent,
        },
    },
};

/**
 * Contains the empower diagnostic states
 */
export const VISIT_DIAGNOSTICS_STATES = [
    visitPatientDiagnosticsState,
    visitDiagnosisLinkageState,
];

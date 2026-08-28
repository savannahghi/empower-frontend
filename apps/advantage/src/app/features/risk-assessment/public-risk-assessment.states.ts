import { SkikaAuthComponent } from 'app/@core/auth/components/skika-auth/skika-auth.component';
import { PublicRiskAssessmentComponent } from './public-risk-assessment.component';

/**
 * Contains the visit patient screening component where the patient screening forms are added
 */
export const visitPublicRiskAssessmentState = {
    name: 'app.risk-assessment',
    url: '/risk-assessment',
    data: {
        requiresAuth: false,
    },
    redirectTo: 'app.risk-assessment.breast_cancer',
    component: SkikaAuthComponent,
};

/**
 * Renders the Cerival Cancer Screening Section
 */
export const publicCervicalCancerState = {
    name: 'app.risk-assessment.cervical_cancer',
    url: '/cervical_cancer',
    breadcrumb: () => 'Cervical Cancer',
    data: {
        requiresAuth: false,
    },
    component: PublicRiskAssessmentComponent,
};

/**
 * Renders the Breast Cancer Screening Section
 */
export const publicBreastCancerState = {
    name: 'app.risk-assessment.breast_cancer',
    url: '/breast_cancer',
    breadcrumb: () => 'Breast Cancer',
    data: {
        requiresAuth: false,
    },
    component: PublicRiskAssessmentComponent,
};

/**
 * Renders the Prostate Cancer Screening Section
 */
export const publicProstateCancerState = {
    name: 'app.risk-assessment.prostate_cancer',
    url: '/prostate_cancer',
    breadcrumb: () => 'Prostate Cancer',
    data: {
        requiresAuth: false,
    },
    component: PublicRiskAssessmentComponent,
};

/**
 * Contains the empower screening states
 */
export const PUBLIC_RISK_ASSESSMENT_STATES = [
    visitPublicRiskAssessmentState,
    publicCervicalCancerState,
    publicBreastCancerState,
    publicProstateCancerState,
];

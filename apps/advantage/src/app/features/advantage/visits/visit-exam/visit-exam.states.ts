import { ExaminationsComponent } from './examinations/examinations.component';
import { ExamHistoryComponent } from './exam-history/exam-history.component';
import { ExamReviewComponent } from './exam-review/exam-review.component';
import { TreatmentPlanComponent } from './treatment-plan/treatment-plan.component';
import { ExamDiagnosisComponent } from './treatment-plan/exam-diagnosis/exam-diagnosis.component';
import { ExamSignOffComponent } from './exam-sign-off/exam-sign-off.component';
import { ResolverService } from '../../../../features/services/resolver.service';
import { Transition } from '@uirouter/angular';
import { ExamReferralsComponent } from './treatment-plan/exam-referrals/exam-referrals.component';

/**
 * Contains the Visit Exam base state
 */
export const visitExamState = {
    name: 'app.advantage.visits.detail.exam',
    breadcrumb: () => 'Exam',
    url: '/exam',
    data: {
        requiresAuth: true,
    },
    redirectTo: 'app.advantage.visits.detail.exam.review',
};
/**
 * Contains the Visit exam review state
 */
export const visitExamReviewState = {
    name: 'app.advantage.visits.detail.exam.review',
    breadcrumb: () => 'Exam Review',
    url: '/review',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: ExamReviewComponent,
        },
    },
};
/**
 * Contains the Visit exam history state
 */
export const visitExamHistoryState = {
    name: 'app.advantage.visits.detail.exam.history',
    breadcrumb: () => 'Exam History',
    url: '/history',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: ExamHistoryComponent,
        },
    },
};

/**
 * Contains the Visit exam examinations state
 */
export const visitExaminationsState = {
    name: 'app.advantage.visits.detail.exam.examinations',
    breadcrumb: () => 'Examination',
    url: '/examinations',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: ExaminationsComponent,
        },
    },
};

/**
 * Contains the Visit exam treatment plan state
 */
export const visitTreatmentPlanState = {
    name: 'app.advantage.visits.detail.exam.treatment_plan',
    breadcrumb: () => 'Treatment Plan',
    url: '/treatment_plan',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: TreatmentPlanComponent,
        },
    },
};

/**
 * Contains the Visit exam diagnosis state
 */
export const visitTreatmentDiagnosisState = {
    name: 'app.advantage.visits.detail.exam.treatment_plan.diagnosis',
    breadcrumb: () => 'Treatment Plan',
    url: '/view/:diagnosis_id',
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'visitObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc, transition) =>
                resolveSvc.resolveItem('visits', transition.params().id),
        },
    ],
    bindings: {
        resolveData: 'visitObservable',
    },
    views: {
        'treatment_plan@app.advantage.visits.detail.exam.treatment_plan': {
            component: ExamDiagnosisComponent,
        },
    },
};

/**
 * Contains the Visit exam sign off state
 */
export const visitExamSignOffState = {
    name: 'app.advantage.visits.detail.exam.sign_off',
    breadcrumb: () => 'Sign Off',
    url: '/sign_off',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: ExamSignOffComponent,
        },
    },
};

/**
 * Contains the Visit exam referrals state
 */
export const visitExamReferralsState = {
    name: 'app.advantage.visits.detail.exam.referrals',
    breadcrumb: () => 'Referrals',
    url: '/referrals?after&before&referral_type',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: ExamReferralsComponent,
        },
    },
};

/**
 * Contains the visit exam states
 */
export const VISIT_EXAM_STATES = [
    visitExamState,
    visitExamReviewState,
    visitExamHistoryState,
    visitExaminationsState,
    visitTreatmentPlanState,
    visitTreatmentDiagnosisState,
    visitExamSignOffState,
    visitExamReferralsState,
];

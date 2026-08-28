import { Ng2StateDeclaration, Transition } from '@uirouter/angular';
import { ExamHistoryComponent } from '../visits/visit-exam/exam-history/exam-history.component';
import { ExamReviewComponent } from '../visits/visit-exam/exam-review/exam-review.component';
import { TreatmentPlanComponent } from '../visits/visit-exam/treatment-plan/treatment-plan.component';
import { ResolverService } from 'app/features/services/resolver.service';
import { ServiceRequestViewerComponent } from './service-request-viewer/service-request-viewer.component';
import { QueueWorklistComponent } from '../queues/queue-worklist/queue-worklist.component';
import { ExamDiagnosisComponent } from '../visits/visit-exam/treatment-plan/exam-diagnosis/exam-diagnosis.component';

/**
 * Renders the queue worklist component
 * and finds service requests based on your queue
 */
export const queueWorklistState: Ng2StateDeclaration = {
    name: 'app.advantage.queues.worklist',
    url: '/worklist',
    data: {
        requiresAuth: true,
    },
    reloadOnSearch: false,
    views: {
        '$default@app.advantage': {
            component: QueueWorklistComponent,
        },
    },
};

/**
 * Renders the queue worklist component
 * and finds service requests based on your queue
 */
export const serviceRequestViewerState: Ng2StateDeclaration = {
    name: 'app.advantage.queues.worklist.request',
    url: '/request?visit&service_request',
    breadcrumb: () => 'Request',
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'visitObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc, transition) =>
                resolveSvc.resolveItem('visits', transition.params().visit),
        },
    ],
    bindings: {
        resolveData: 'visitObservable',
    },
    views: {
        'request@app.advantage.queues.worklist': {
            component: ServiceRequestViewerComponent,
        },
    },
};

export const serviceRequestExamReviewState = {
    name: 'app.advantage.queues.worklist.request.review',
    breadcrumb: () => 'Exam Review',
    url: '/review',
    data: {
        requiresAuth: true,
    },
    views: {
        'consultation@app.advantage.queues.worklist.request': {
            component: ExamReviewComponent,
        },
    },
};
/**
 * Contains the Visit exam history state
 */
export const serviceRequestExamHistoryState = {
    name: 'app.advantage.queues.worklist.request.history',
    breadcrumb: () => 'Exam History',
    url: '/history',
    data: {
        requiresAuth: true,
    },
    views: {
        'consultation@app.advantage.queues.worklist.request': {
            component: ExamHistoryComponent,
        },
    },
};

/**
 * Contains the service request exam treatment plan state
 */
export const serviceRequestTreatmentPlanState = {
    name: 'app.advantage.queues.worklist.request.treatment_plan',
    breadcrumb: () => 'Treatment Plan',
    url: '/treatment_plan',
    data: {
        requiresAuth: true,
    },
    views: {
        'consultation@app.advantage.queues.worklist.request': {
            component: TreatmentPlanComponent,
        },
    },
};

/**
 * Contains the service request diagnosis state
 */
export const serviceRequestTreatmentDiagnosisState = {
    name: 'app.advantage.queues.worklist.request.treatment_plan.diagnosis',
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
                resolveSvc.resolveItem('visits', transition.params().visit),
        },
    ],
    bindings: {
        resolveData: 'visitObservable',
    },
    views: {
        'treatment_plan@app.advantage.queues.worklist.request.treatment_plan': {
            component: ExamDiagnosisComponent,
        },
    },
};

/**
 * Contains all the ui router states in the service request module
 */
export const SERVICE_REQUEST_STATES = [
    queueWorklistState,
    serviceRequestViewerState,
    serviceRequestExamReviewState,
    serviceRequestExamHistoryState,
    serviceRequestTreatmentPlanState,
    serviceRequestTreatmentDiagnosisState,
];

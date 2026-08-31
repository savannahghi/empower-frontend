import { Ng2StateDeclaration } from '@uirouter/angular';
import { Transition } from '@uirouter/core';
import { ResolverService } from '../../services/resolver.service';
import { VisitDetailsComponent } from '../visits/visit-details/visit-details.component';
import { QueueListComponent } from './queue-list/queue-list.component';
import { VisitBillingComponent } from '../visits/visit-billing/visit-billing.component';
import { ClinicalRecordsComponent } from '../clinical-records/clinical-records.component';
import { QueueSetupComponent } from './queue-setup/queue-setup.component';
import { BreastCancerScreeningComponent } from '../visits/visit-patient-screening/breast-cancer-screening/breast-cancer-screening.component';
import { CervicalCancerScreeningComponent } from '../visits/visit-patient-screening/cervical-cancer-screening/cervical-cancer-screening.component';
import { VisitPatientScreeningComponent } from '../visits/visit-patient-screening/screening/visit-patient-screening.component';

/**
 * Renders the queues list component
 * and search, filter for any queues
 */
export const queuesState: Ng2StateDeclaration = {
    name: 'app.advantage.queues',
    url: '/queues?queue&status&ordering&search&page_size&page',
    breadcrumb: () => 'Queues',
    data: {
        requiresAuth: true,
        permission: 'advantage.visit_list',
    },
    component: QueueListComponent,
};

/**
 * Renders the queues setup component
 * and search, filter for any queues
 */
export const queueSetupState: Ng2StateDeclaration = {
    name: 'app.advantage.queues.setup',
    url: '/list',
    breadcrumb: () => 'Setup',
    data: {
        requiresAuth: true,
        permission: 'advantage.queue_list',
    },
    views: {
        '$default@app.advantage': {
            component: QueueSetupComponent,
        },
    },
};

export const queuesDetailState: Ng2StateDeclaration = {
    name: 'app.advantage.queues.detail',
    url: '/view/:id?service_request',
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
        '$default@app.advantage': {
            component: VisitDetailsComponent,
        },
    },
};

/**
 * Contains the visit billing component where all the bill items are added
 */
export const visitBillingState: Ng2StateDeclaration = {
    name: 'app.advantage.queues.detail.billing',
    url: '/billing/',
    breadcrumb: () => 'Visit billing',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.queues.detail': {
            component: VisitBillingComponent,
        },
    },
};

/**
 * Contains the visit clinical records component where all the clinical data  is added
 */
export const clinicalRecordState: Ng2StateDeclaration = {
    name: 'app.advantage.queues.detail.clinical',
    url: '/clinical/',
    breadcrumb: () => 'Visit clinical record',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.queues.detail': {
            component: ClinicalRecordsComponent,
        },
    },
};

/**
 * Contains the visit patient screening component where the patient screening forms are added
 */
export const visitPatientScreeningState: Ng2StateDeclaration = {
    name: 'app.advantage.queues.detail.screening',
    breadcrumb: () => 'Screening',
    url: '/screening',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.queues.detail': {
            component: VisitPatientScreeningComponent,
        },
    },
};

/**
 * Renders the Cerival Cancer Screening Form
 */
export const cervicalCancerState: Ng2StateDeclaration = {
    name: 'app.advantage.queues.detail.screening.cervical_cancer',
    url: '/cervical_cancer?step',
    breadcrumb: () => 'Cervical Cancer',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.queues.detail': {
            component: CervicalCancerScreeningComponent,
        },
    },
};

/**
 * Renders the Cerival Cancer Screening Form
 */
export const breastCancerState: Ng2StateDeclaration = {
    name: 'app.advantage.queues.detail.screening.breast_cancer',
    url: '/breast_cancer?step',
    breadcrumb: () => 'Breast Cancer',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.queues.detail': {
            component: BreastCancerScreeningComponent,
        },
    },
};

/**
 * Renders the queue worklist component
 * and finds service requests based on your queue
 */
export const serviceRequestFutureState: Ng2StateDeclaration = {
    name: 'app.advantage.queues.worklist.**',
    url: '/worklist',
    data: {
        requiresAuth: true,
    },
    loadChildren: () =>
        import('./../service-requests/servicerequest.module').then(
            m => m.ServiceRequestModule
        ),
};

/**
 * Contains all the ui router states in the queues module
 */
export const QUEUES_STATE = [
    queuesState,
    queuesDetailState,
    queueSetupState,
    serviceRequestFutureState,
    visitBillingState,
    clinicalRecordState,
];

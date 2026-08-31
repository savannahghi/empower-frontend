import { Ng2StateDeclaration } from '@uirouter/angular';
import { Transition } from '@uirouter/core';
import { VisitListComponent } from './visit-list/visit-list.component';
import { VisitDetailsComponent } from './visit-details/visit-details.component';
import { VisitBillingComponent } from './visit-billing/visit-billing.component';
import { VisitPaymentComponent } from './visit-payment/visit-payment.component';
import { ResolverService } from '../../services/resolver.service';
import { ClinicalRecordsComponent } from '../clinical-records/clinical-records.component';
import { StartVisitComponent } from './visit-start-visit/visit-start-visit.component';
import { VisitReferralComponent } from './visit-referral/visit-referral.component';
import { VisitTestComponent } from './visit-test/visit-test.component';
import { VisitMedicationRequestComponent } from './visit-medication-request/visit-medication-request.component';
import { VisitMedicationRequestsComponent } from './visit-medication-requests/visit-medication-requests.component';
import { VisitLabOrdersComponent } from './visit-lab-orders/visit-lab-orders.component';

/**
 * Contains the visits component where all the visits
 * can be found. Searching and filtering from this list component
 * is possible
 */
export const visitState = {
    name: 'app.advantage.visits',
    url: '/visits?visit&status&billing_class&ordering&page&search&page_size&sales_invoice_id',
    breadcrumb: () => 'Visits',
    data: {
        requiresAuth: true,
        permission: 'advantage.visit_list',
    },
    component: VisitListComponent,
};

/**
 * Contains the visit detail component where all the information
 * of a single visit can be found
 */
export const visitDetailState: Ng2StateDeclaration = {
    name: 'app.advantage.visits.detail',
    url: '/view/:id',
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
export const visitBillingState = {
    name: 'app.advantage.visits.detail.billing',
    url: '/billing/',
    breadcrumb: () => 'Visit billing',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: VisitBillingComponent,
        },
    },
};

/**
 * Contains the visit tests component where all the bill items are added
 */
export const visitTestsState = {
    name: 'app.advantage.visits.detail.tests',
    url: '/tests?cancer_type&patient_id&encounter_id',
    breadcrumb: () => 'Visit tests',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: VisitTestComponent,
        },
    },
};

/**
 * Contains the visit examinations component where all the bill items are added
 */
export const visitExaminationsState = {
    name: 'app.advantage.visits.detail.examinations',
    url: '/examinations?cancer_type&patient_id&encounter_id',
    breadcrumb: () => 'Visit Examinations',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: VisitTestComponent,
        },
    },
};

/**
 * Contains the visit patient screening future state where the patient screening forms are added
 */
export const visitPatientScreeningFutureState = {
    name: 'app.advantage.visits.detail.screening.**',
    data: {
        requiresAuth: true,
    },
    url: '/screening',
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
    loadChildren: () =>
        import('./visit-patient-screening/visit-patient-screening.module').then(
            m => m.VisitPatientScreeningModule
        ),
};

/**
 * Contains the visit referral component where all the referrals are added
 */
export const visitReferralState = {
    name: 'app.advantage.visits.detail.referral',
    url: '/referral?cancer_type&patient_id&encounter_id',
    breadcrumb: () => 'Referral',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: VisitReferralComponent,
        },
    },
};

/**
 * Contains the visit clinical records component where all the clinical data  is added
 */
export const clinicalRecordState = {
    name: 'app.advantage.visits.detail.clinical',
    url: '/clinical/',
    breadcrumb: () => 'Visit clinical record',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: ClinicalRecordsComponent,
        },
    },
};

/**
 * Contains the visit payments component where all the payments are added
 */
export const visitPaymentsState = {
    name: 'app.advantage.visits.detail.payments',
    url: '/payments/?payments_invoice',
    breadcrumb: () => 'Visit payments',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: VisitPaymentComponent,
        },
    },
};

/**
 * Contains the start visit component where patients can start visits
 */
export const visitStartVisitState = {
    name: 'app.advantage.visits.start_visit',
    url: '/start_visit/:id?appointment',
    breadcrumb: () => 'Start visit',
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'visitPatientObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc, transition) =>
                resolveSvc.resolveItem('patients', transition.params().id),
        },
    ],
    bindings: {
        resolveData: 'visitPatientObservable',
    },
    views: {
        '$default@app.advantage': {
            component: StartVisitComponent,
        },
    },
};

/**
 * Contains the medication requests list component
 * The component allows you to view medication requests of a visit
 */
export const visitMedicationsState = {
    name: 'app.advantage.visits.detail.medications',
    url: '/medications?medication_search&page&page_size',
    breadcrumb: () => 'Medications',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: VisitMedicationRequestsComponent,
        },
    },
};

/**
 * State contains a visit medication request component.
 * The component shows you the medication request
 */
export const viewVisitMedicationState = {
    name: 'app.advantage.visits.detail.medications-view',
    url: '/medications/:serviceRequestId',
    breadcrumb: () => 'View Medication Request',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: VisitMedicationRequestComponent,
        },
    },
};

/**
 * Contains the lab orders list component
 * The component allows you to view visit lab orderssssssssssss of a visit
 */
export const visitLabOrdersState = {
    name: 'app.advantage.visits.detail.lab_orders',
    url: '/lab_orders?lab_order_search&page&page_size',
    breadcrumb: () => 'Lab Orders',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.visits.detail': {
            component: VisitLabOrdersComponent,
        },
    },
};

/**
 * Contains the visit patient treatment future state where the patient treatment forms are added
 */
export const visitPatientTreatmentState = {
    name: 'app.advantage.visits.detail.treatment.**',
    data: {
        requiresAuth: true,
    },
    url: '/treatment',
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
    loadChildren: () =>
        import('./visit-patient-treatment/visit-patient-treatment.module').then(
            m => m.VisitPatientTreatmentModule
        ),
};

/**
 * Contains the visit patient diagnostics future state where the patient diagnostic forms are added
 */
export const visitPatientDiagnosticState = {
    name: 'app.advantage.visits.detail.diagnostics.**',
    data: {
        requiresAuth: true,
    },
    url: '/diagnostics',
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
    loadChildren: () =>
        import(
            './visit-patient-diagnostics/visit-patient-diagnostics.module'
        ).then(m => m.VisitPatientDiagnosticsModule),
};

/**
 * Contains the visit diagnosis & linkage future state. This is a sibling of
 * `visitPatientDiagnosticState` (not nested under it), so it needs its own
 * future state glob to trigger lazy-loading `VisitPatientDiagnosticsModule`
 * when navigated to directly, before the diagnostics tab has been visited.
 */
export const visitDiagnosisLinkageFutureState = {
    name: 'app.advantage.visits.detail.diagnosis_linkage.**',
    data: {
        requiresAuth: true,
    },
    url: '/diagnosis_linkage',
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
    loadChildren: () =>
        import(
            './visit-patient-diagnostics/visit-patient-diagnostics.module'
        ).then(m => m.VisitPatientDiagnosticsModule),
};

/**
 * Contains the visit exam future state where the patient exams are performed
 */
export const visitExamFutureState = {
    name: 'app.advantage.visits.detail.exam.**',
    data: {
        requiresAuth: true,
    },
    url: '/exam',
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
    loadChildren: () =>
        import('./visit-exam/visit-exam.module').then(m => m.VisitExamModule),
};

/**
 * Contains all the ui router states in the visits module
 */
export const VISIT_STATES = [
    visitState,
    visitDetailState,
    visitBillingState,
    clinicalRecordState,
    visitPaymentsState,
    visitPatientScreeningFutureState,
    visitStartVisitState,
    visitReferralState,
    visitTestsState,
    visitExaminationsState,
    visitMedicationsState,
    viewVisitMedicationState,
    visitExamFutureState,
    visitLabOrdersState,
    visitPatientTreatmentState,
    visitPatientDiagnosticState,
    visitDiagnosisLinkageFutureState,
];

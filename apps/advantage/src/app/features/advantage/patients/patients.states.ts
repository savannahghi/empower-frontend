import { Ng2StateDeclaration } from '@uirouter/angular';
import { Transition } from '@uirouter/core';
import { environment } from '../../../../environments/environment';
import { ResolverService } from '../../services/resolver.service';
import { BiometricsEnrollmentComponent } from '../enrollment/biometrics-enrollment/biometrics-enrollment.component';
import { StatementComponent } from './account-statements/account-statement.component';
import { NextOfKinListComponent } from './nextOfKin-list/nextOfKin-list.component';
import { PatientAttachmentsComponent } from './patient-attachments/patient-attachments.component';
import { PatientConsentComponent } from './patient-consent/patient-consent.component';
import { PatientCoversComponent } from './patient-covers/patient-covers.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { PatientFollowUpsComponent } from './patient-follow-ups/patient-follow-ups.component';
import { PatientLabOrderComponent } from './patient-lab-order/patient-lab-order.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientMedicationRequestComponent } from './patient-medication-request/patient-medication-request.component';
import { PatientMedicationRequestsComponent } from './patient-medication-requests/patient-medication-requests.component';
import { PatientPostReferralComponent } from './patient-post-referral/patient-post-referral.component';
import { PatientReferralsComponent } from './patient-referrals/patient-referrals.component';
import { PatientRegistrationComponent } from './patient-registration/patient-registration.component';
import { PatientScreeningReportComponent } from './patient-screening-report/patient-screening-report.component';
import { PatientScreeningsComponent } from './patient-screenings/patient-screenings.component';
import { PatientTestsComponent } from './patient-tests/patient-tests.component';
import { PatientTimelineComponent } from './patient-timeline/patient-timeline.component';

/** patientState
 * State contains the patient list.
 * Loads the component that renders the patients
 */
const variant = environment.variant;
const variantPatientTerm = 'Patient';

export const patientState = {
    name: 'app.advantage.patients',
    breadcrumb: () => `${variantPatientTerm}s`,
    url: '/patients?search&page&page_size',
    data: {
        requiresAuth: true,
    },
    component: PatientListComponent,
};

/** patientDetailState
 * State contains the patient view component.
 * The component shows you the patient's information
 */
export const patientDetailState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail',
    url: '/view/:id',
    breadcrumb: () => `${variantPatientTerm} profile`,
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'patientObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc, transition) =>
                resolveSvc.resolveItem('patients', transition.params().id),
        },
    ],
    bindings: {
        resolveData: 'patientObservable',
    },
    views: {
        '$default@app.advantage': {
            component: PatientDetailsComponent,
        },
    },
};

/** patientRegisterState
 * State contains the patient registration form.
 * Loads the component that renders the patients' regitration
 */
export const patientRegistrationState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.register',
    url: '/register?id&step&state&person_id&consent_id&phone_number&email&consent_status',
    breadcrumb: () => `Register ${variantPatientTerm}`,
    data: {
        requiresAuth: true,
    },
    views: {
        '$default@app.advantage': {
            component: PatientRegistrationComponent,
        },
    },
};

/** patientEnrollmentState
 * State contains the patient enrollment component.
 * The component shows you the enrollment workflows
 */
export const patientEnrollmentState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.enrollment',
    url: '/enrollment',
    breadcrumb: () => 'Enrollment',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: BiometricsEnrollmentComponent,
        },
    },
};

/** patientAttachmentState
 * State contains the patient attachments component.
 * The component shows you the attachments's bills
 */
export const patientAttachmentState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.attachments',
    url: '/attachments/',
    breadcrumb: () => 'Attachments',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientAttachmentsComponent,
        },
    },
};

/** patientTimelineState
 * State contains the patient timeline component.
 * The component shows you the patient medical timeline
 */
export const patientTimelineState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.timeline',
    url: '/timeline/',
    breadcrumb: () => 'Timeline',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientTimelineComponent,
        },
    },
};

/** patientRelatedPersonsState
 * State contains the patient related persons component.
 * The component shows you the details of the related persons
 */
export const patientNextOfKinState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.nextOfKin',
    url: '/next_of_kin/',
    breadcrumb: () => 'Related persons',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: NextOfKinListComponent,
        },
    },
};

/** patientBillsState
 * State contains the patient billing component.
 * The component shows you the patient's bills
 */
export const patientBillsState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.billing',
    url: '/bills/?customer_customer',
    breadcrumb: () => 'Bills',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: StatementComponent,
        },
    },
};

export const patientPatientCoversState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.patientcovers',
    url: '/patient_covers',
    breadcrumb: () => 'Patient Covers',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientCoversComponent,
        },
    },
};

/** patientScreeningsState
 * State contains the patient screenings component.
 * The component shows you the screeings
 */
export const patientScreeingsState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.screenings',
    url: '/screenings',
    breadcrumb: () => 'Screenings',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientScreeningsComponent,
        },
    },
};
/**
 * Contains the patient medication requests list component
 * The component allows you to view patient medication requests
 */
export const patientMedicationsState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.medications',
    url: '/medications?status&medication_search',
    breadcrumb: () => 'Medications',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientMedicationRequestsComponent,
        },
    },
};

/** patientMedicationsState
 * State contains the patient medications component.
 * The component shows you the medications
 */
export const viewPatientMedicationsState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.medications-view',
    url: '/medications/:request_id',
    breadcrumb: () => 'View Patient Medication',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientMedicationRequestComponent,
        },
    },
};

/** patientFollowUpState
 * State contains the patient follow ups component.
 * The component shows you the follow ups
 */
export const patientFollowUpState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.follow-ups',
    url: '/follow-ups',
    breadcrumb: () => 'Follow Ups',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientFollowUpsComponent,
        },
    },
};

/** patientTestsState
 * State contains the patient tests component.
 * The component shows you the tests
 */
export const patientTestsState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.tests',
    url: '/tests',
    breadcrumb: () => 'Tests',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientTestsComponent,
        },
    },
};

/** patientPostReferralState
 * State contains the patient post screening referral component.
 * The component shows you the post screening referral state
 */
export const patientPostScreeningReferralState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.post-referral',
    url: '/post_referral/:serviceRequestId',
    breadcrumb: () => 'Post Screening Referral',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientPostReferralComponent,
        },
    },
};

/** patientLabOrderState
 * State contains the patient lab order component.
 * The component shows you the lab order state
 */
export const patientLabOrderState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.lab-order',
    url: '/lab_order/:serviceRequestId',
    breadcrumb: () => 'Lab Order',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientLabOrderComponent,
        },
    },
};

/** patientPostScreeningState
 * State contains the patient screening report component.
 * The component shows you the screening report state
 */
export const patientScreeningReportState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.screening-report',
    url: '/screening_report/:cancerType/:encounterId/',
    breadcrumb: () => 'Screening Report',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientScreeningReportComponent,
        },
    },
};

/** patientSegmentsState
 * State contains the patient segments component.
 * The component shows you the segments
 */
export const patientSegmentsState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.segments.**',
    url: '/segments',
    breadcrumb: () => 'Segments',
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'patientObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc, transition) =>
                resolveSvc.resolveItem('patients', transition.params().id),
        },
    ],
    bindings: {
        resolveData: 'patientObservable',
    },
    loadChildren: () =>
        import('./patient-segments/patient-segments.module').then(
            m => m.PatientSegmentsModule
        ),
};

/** patientReferralsState
 * State contains the patient referrals component.
 * The component shows you the referrals
 */
export const patientReferralsState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.referrals',
    url: '/referrals',
    breadcrumb: () => 'Referrals',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientReferralsComponent,
        },
    },
};

/** patientConsentState
 * State contains the patient follow ups component.
 * The component shows you the follow ups
 */
export const patientConsentState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.consent',
    url: '/consent',
    breadcrumb: () => 'Consent',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientConsentComponent,
        },
    },
};

/**
 * Contains all the ui router states in the patient module
 */
export const PATIENT_STATES = [
    patientState,
    patientDetailState,
    patientBillsState,
    patientEnrollmentState,
    patientAttachmentState,
    patientTimelineState,
    patientNextOfKinState,
    patientRegistrationState,
    patientPatientCoversState,
    patientScreeingsState,
    patientSegmentsState,
    patientFollowUpState,
    patientReferralsState,
    patientPostScreeningReferralState,
    patientScreeningReportState,
    patientConsentState,
    patientLabOrderState,
    patientTestsState,
    patientMedicationsState,
    viewPatientMedicationsState,
];

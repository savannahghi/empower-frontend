import { Ng2StateDeclaration } from '@uirouter/angular';
import { PatientSegmentsComponent } from './patient-segments.component';
import { PatientSegmentMessagesComponent } from './patient-segment-messages/patient-segment-messages.component';

/** patientSegmentsState
 * State contains the patient segments component.
 * The component shows you the segments
 */
export const patientSegmentsState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.segments',
    url: '/segments',
    breadcrumb: () => 'Segments',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientSegmentsComponent,
        },
    },
};

/** patientSegmentMessagesState
 * State contains the patient segments component.
 * The component shows you the segments
 */
export const patientSegmentsMessagesState: Ng2StateDeclaration = {
    name: 'app.advantage.patients.detail.segments.messages',
    url: '/messages/:segment_id/:member?segment&name',

    breadcrumb: () => 'Segment Messages',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.patients.detail': {
            component: PatientSegmentMessagesComponent,
        },
    },
};

/**
 * Contains all the ui router states in the patient segment module
 */
export const PATIENT_SEGMENT_STATES = [
    patientSegmentsState,
    patientSegmentsMessagesState,
];

import { FeaturesComponent } from '../features.component';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { FeedbackGoogleFormComponent } from './feedback-google-form/feedback-google-form.component';
import { FeedbackSubmittedComponent } from './feedback-submitted/feedback-submitted.component';
/**
 * Contains the features component which
 * the sidebar and header components
 */
export const feedbackState = {
    name: 'app.feedback',
    url: '/feedback',
    data: {
        requiresAuth: false,
    },
    redirectTo: 'app.feedback.form',
    component: FeaturesComponent,
};

/**
 * Feedback form containing the survey questions
 */
export const feedbackFormState = {
    name: 'app.feedback.form',
    data: {
        requiresAuth: false,
    },
    url: '/form?hash&payer',
    component: FeedbackFormComponent,
};

/**
 * Feedback survey after submission
 */
export const feedbackSubmissionState = {
    name: 'app.feedback.submitted',
    data: {
        requiresAuth: false,
    },
    url: '/submitted?hash&slade_code',
    component: FeedbackSubmittedComponent,
};

/**
 * Feedback containing the google form questions
 */
export const feedbackGoogleFormState = {
    name: 'app.feedback.google',
    data: {
        requiresAuth: false,
    },
    url: '/google',
    component: FeedbackGoogleFormComponent,
};

/**
 * Contains the feedback states
 */
export const FEEDBACK_STATES = [
    feedbackState,
    feedbackFormState,
    feedbackSubmissionState,
    feedbackGoogleFormState,
];

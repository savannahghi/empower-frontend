import { FeaturesComponent } from '../features.component';
import { FeedbackSubmittedComponent } from '../feedback/feedback-submitted/feedback-submitted.component';
import { AdvantageSummaryComponent } from './advantage-summary/advantage-summary.component';
import { AdvantageSurveyFormComponent } from './advantage-survey-form/advantage-survey-form.component';
/**
 * Advantage feedback state containing the advantage survey token
 */
export const advantageSurveyState = {
    name: 'app.survey',
    url: '/survey?t',
    data: {
        requiresAuth: false,
    },
    redirectTo: 'app.survey.form',
    component: FeaturesComponent,
};

/**
 * Advantage feedback state containing the advantage survey form questions
 */
export const advantageFeedbackFormState = {
    name: 'app.survey.form',
    data: {
        requiresAuth: false,
    },
    url: '/form',
    component: AdvantageSurveyFormComponent,
};

/**
 * Feedback survey after submission
 */
export const advantageSubmissionState = {
    name: 'app.survey.submitted',
    data: {
        requiresAuth: false,
    },
    url: '/submitted',
    component: FeedbackSubmittedComponent,
};

export const advantageSummaryState = {
    name: 'app.summary',
    url: '/summary?t',
    data: {
        requiresAuth: false,
    },
    redirectTo: 'app.summary.receipt',
    component: FeaturesComponent,
};

/**
 * Advantage feedback state containing the summary receipt
 */
export const advantageReceiptSummaryState = {
    name: 'app.summary.receipt',
    data: {
        requiresAuth: false,
    },
    url: '/receipt',
    component: AdvantageSummaryComponent,
};

/**
 * Contains the survey states
 */
export const SURVEY_STATES = [
    advantageSurveyState,
    advantageFeedbackFormState,
    advantageSubmissionState,
    advantageSummaryState,
    advantageReceiptSummaryState,
];

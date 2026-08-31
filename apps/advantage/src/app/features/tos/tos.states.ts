import { FeaturesComponent } from '../features.component';
import { TosDocumentComponent } from './tos-document/tos-document.component';
/**
 * Contains the features component which
 * the sidebar and header components
 */
export const termsOfServiceState = {
    name: 'app.tos',
    url: '/tos',
    breadcrumb: () => 'Terms of Service',
    data: {
        requiresAuth: false,
    },
    redirectTo: 'app.tos.document',
    component: FeaturesComponent,
};

/**
 * Terms and services state
 */
export const termsOfServiceDocumentState = {
    name: 'app.tos.document',
    data: {
        requiresAuth: false,
    },
    url: '/document',
    component: TosDocumentComponent,
};

/**
 * Contains the ToS states
 */
export const TOS_STATES = [termsOfServiceState, termsOfServiceDocumentState];

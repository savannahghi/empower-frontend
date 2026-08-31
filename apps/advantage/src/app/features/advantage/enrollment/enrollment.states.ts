import { ResolverService } from 'app/features/services/resolver.service';
import { EnrollmentBannerComponent } from './enrollment-banner/enrollment-banner.component';
import { EnrollmentListComponent } from './enrollment-list/enrollment-list.component';
import { Transition } from '@uirouter/angular';
import { BiometricsEnrollmentComponent } from './biometrics-enrollment/biometrics-enrollment.component';
import { BiometricsAuthenticationComponent } from './biometrics-authentication/biometrics-authentication.component';

export const enrollmentState = {
    name: 'app.advantage.enrollment',
    breadcrumb: () => 'Enrollment',
    url: '/enrollment?search&page&page_size',
    data: {
        requiresAuth: true,
    },
    component: EnrollmentListComponent,
};

export const enrollmentDetailState = {
    name: 'app.advantage.enrollment.detail',
    url: '/view/:id',
    redirectTo: 'app.advantage.enrollment.detail.biometrics-enrollment',
    breadcrumb: () => 'Enrollment Details',
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
            component: EnrollmentBannerComponent,
        },
    },
};

export const biometricsEnrollmentDetailsState = {
    name: 'app.advantage.enrollment.detail.biometrics-enrollment',
    url: '/enrollment?search&page_size&page',
    breadcrumb: () => 'Biometrics Enrollment',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.enrollment.detail': {
            component: BiometricsEnrollmentComponent,
            bindings: {
                patientDetails: 'patientObservable',
            },
        },
    },
};

export const biometricsAuthenticationDetailsState = {
    name: 'app.advantage.enrollment.detail.biometrics-authentication',
    url: '/authentication?search&page_size&page',
    breadcrumb: () => 'Biometrics Authentication',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.enrollment.detail': {
            component: BiometricsAuthenticationComponent,
            bindings: {
                patientDetails: 'patientObservable',
            },
        },
    },
};

export const ENROLLMENT_STATES = [
    enrollmentState,
    enrollmentDetailState,
    biometricsEnrollmentDetailsState,
    biometricsAuthenticationDetailsState,
];

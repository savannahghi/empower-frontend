import {
    visitPatientScreeningState,
    cervicalCancerState,
    breastCancerState,
    prostateCancerState,
} from './visit-patient-screening.states';

describe('Visit Patient Screening UI Router States', () => {
    describe('breadcrumbs', () => {
        it('should define breadcrumbs correctly', () => {
            expect(visitPatientScreeningState.breadcrumb()).toBe('Screening');
            expect(cervicalCancerState.breadcrumb()).toBe('Cervical Cancer');
            expect(breastCancerState.breadcrumb()).toBe('Breast Cancer');
            expect(prostateCancerState.breadcrumb()).toBe('Prostate Cancer');
        });
    });
});

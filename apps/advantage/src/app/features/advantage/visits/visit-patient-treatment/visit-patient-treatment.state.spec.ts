import { visitPatientTreatmentState } from './visit-patient-treatment.state';

describe('Visit Patient Treatment UI Router States', () => {
    describe('breadcrumbs', () => {
        it('should define breadcrumbs correctly', () => {
            expect(visitPatientTreatmentState.breadcrumb()).toBe('Treatment');
        });
    });
});

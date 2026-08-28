import {
    visitPatientDiagnosticsState,
    visitDiagnosisLinkageState,
} from './visit-patient-diagnostics.state';

describe('Visit Patient Diagnostics UI Router States', () => {
    describe('breadcrumbs', () => {
        it('should define the diagnostic breadcrumb correctly', () => {
            expect(visitPatientDiagnosticsState.breadcrumb()).toBe(
                'Diagnostics'
            );
        });

        it('should define the diagnosis and linkage breadcrumb correctly', () => {
            expect(visitDiagnosisLinkageState.breadcrumb()).toBe(
                'Diagnosis & Linkage'
            );
        });
    });
});

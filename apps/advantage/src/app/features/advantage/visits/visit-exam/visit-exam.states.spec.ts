import {
    visitExamState,
    visitExamReviewState,
    visitExamHistoryState,
    visitExaminationsState,
    visitTreatmentPlanState,
    visitTreatmentDiagnosisState,
    visitExamSignOffState,
    visitExamReferralsState,
} from './visit-exam.states';

describe('Visit Exam UI Router States', () => {
    describe('breadcrumbs', () => {
        it('should define breadcrumbs correctly', () => {
            expect(visitExamState.breadcrumb()).toBe('Exam');
            expect(visitExamReviewState.breadcrumb()).toBe('Exam Review');
            expect(visitExamHistoryState.breadcrumb()).toBe('Exam History');
            expect(visitExaminationsState.breadcrumb()).toBe('Examination');
            expect(visitTreatmentPlanState.breadcrumb()).toBe('Treatment Plan');
            expect(visitTreatmentDiagnosisState.breadcrumb()).toBe(
                'Treatment Plan'
            );
            expect(visitExamSignOffState.breadcrumb()).toBe('Sign Off');
            expect(visitExamReferralsState.breadcrumb()).toBe('Referrals');
        });
    });

    describe('visitTreatmentDiagnosisState resolveFn', () => {
        it('should resolve visitTreatmentDiagnosisState with correct parameters', () => {
            const mockResolveSvc = {
                resolveItem: jasmine.createSpy('resolveItem'),
            };
            const mockTransition = { params: () => ({ id: '1' }) };
            const resolver = visitTreatmentDiagnosisState.resolve?.[0];
            if (!resolver)
                fail('visitTreatmentDiagnosisState.resolve not found');

            resolver.resolveFn(mockResolveSvc, mockTransition as any);
            expect(mockResolveSvc.resolveItem).toHaveBeenCalledWith(
                'visits',
                '1'
            );
        });
    });
});

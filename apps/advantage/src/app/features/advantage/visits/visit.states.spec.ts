import {
    VISIT_STATES,
    visitState,
    visitDetailState,
    visitPatientScreeningFutureState,
    visitPatientTreatmentState,
    visitStartVisitState,
    visitPaymentsState,
    visitPatientDiagnosticState,
    visitDiagnosisLinkageFutureState,
    visitMedicationsState,
    viewVisitMedicationState,
    visitExamFutureState,
    visitBillingState,
    visitTestsState,
    visitExaminationsState,
    visitReferralState,
    clinicalRecordState,
    visitLabOrdersState,
} from './visits.states';

describe('Visit UI Router States', () => {
    it('should include all expected states', () => {
        expect(VISIT_STATES.length).toBeGreaterThan(0);
        const stateNames = VISIT_STATES.map(s => s.name);
        expect(stateNames).toContain('app.advantage.visits');
        expect(stateNames).toContain('app.advantage.visits.detail');
        expect(stateNames).toContain('app.advantage.visits.detail.billing');
    });

    describe('visitState', () => {
        it('should define visitState correctly', () => {
            expect(visitState.name).toBe('app.advantage.visits');
            expect(visitState.url).toContain('/visits');
            expect(typeof visitState.breadcrumb).toBe('function');
            expect(visitState.breadcrumb()).toBe('Visits');
            expect(visitState.component).toBeDefined();
        });
    });

    describe('breadcrumbs', () => {
        it('should define breadcrumbs correctly', () => {
            expect(visitBillingState.breadcrumb()).toBe('Visit billing');
            expect(visitTestsState.breadcrumb()).toBe('Visit tests');
            expect(visitExaminationsState.breadcrumb()).toBe(
                'Visit Examinations'
            );
            expect(visitStartVisitState.breadcrumb()).toBe('Start visit');
            expect(visitReferralState.breadcrumb()).toBe('Referral');
            expect(clinicalRecordState.breadcrumb()).toBe(
                'Visit clinical record'
            );
            expect(visitPaymentsState.breadcrumb()).toBe('Visit payments');
            expect(visitMedicationsState.breadcrumb()).toBe('Medications');
            expect(visitLabOrdersState.breadcrumb()).toBe('Lab Orders');
            expect(viewVisitMedicationState.breadcrumb()).toBe(
                'View Medication Request'
            );
        });
    });

    describe('visitStartVisitState resolveFn', () => {
        it('should resolve visitStartVisitState with correct parameters', () => {
            const mockResolveSvc = {
                resolveItem: jasmine.createSpy('resolveItem'),
            };
            const mockTransition = { params: () => ({ id: '1' }) };
            const resolver = visitStartVisitState.resolve?.[0];
            if (!resolver) fail('visitStartVisitState.resolve not found');

            resolver.resolveFn(mockResolveSvc, mockTransition as any);
            expect(mockResolveSvc.resolveItem).toHaveBeenCalledWith(
                'patients',
                '1'
            );
        });
    });

    describe('visitDetailState resolveFn', () => {
        it('should resolve visitObservable with correct parameters', () => {
            const mockResolveSvc = {
                resolveItem: jasmine.createSpy('resolveItem'),
            };
            const mockTransition = { params: () => ({ id: '123' }) };
            const resolver = visitDetailState.resolve?.[0];
            if (!resolver) fail('visitDetailState.resolve not found');

            resolver.resolveFn(mockResolveSvc, mockTransition as any);
            expect(mockResolveSvc.resolveItem).toHaveBeenCalledWith(
                'visits',
                '123'
            );
        });
    });

    describe('Future states', () => {
        const futureStates = [
            visitPatientScreeningFutureState,
            visitPatientTreatmentState,
            visitPatientDiagnosticState,
            visitDiagnosisLinkageFutureState,
            visitExamFutureState,
        ];

        futureStates.forEach(state => {
            it(`should define lazy loading for ${state.name}`, async () => {
                const result = await state.loadChildren();
                expect(result).toBeDefined();
            });

            it(`${state.name} should resolve visitObservable correctly`, () => {
                const mockResolveSvc = {
                    resolveItem: jasmine.createSpy('resolveItem'),
                };
                const mockTransition = { params: () => ({ id: '456' }) };

                const resolver = state.resolve?.[0];
                if (!resolver) fail(`${state.name}.resolve not found`);

                resolver.resolveFn(mockResolveSvc, mockTransition as any);
                expect(mockResolveSvc.resolveItem).toHaveBeenCalledWith(
                    'visits',
                    '456'
                );
            });
        });
    });
});

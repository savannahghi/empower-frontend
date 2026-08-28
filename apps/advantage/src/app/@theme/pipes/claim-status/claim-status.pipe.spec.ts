import { ClaimStatusColorPipe, ClaimStatusPipe } from './claim-status.pipe';

describe('claimStatusColorPipe', () => {
    it('create an instance', () => {
        const pipe = new ClaimStatusColorPipe();
        let res = pipe.transform('APPROVED');
        expect(res).toBe('reviewed');
        res = pipe.transform('APPEALED');
        expect(res).toBe('pending');
        res = pipe.transform('SUBMITTED_PROVIDER');
        expect(res).toBe('cyan');
        res = pipe.transform('CLARIFICATION_AFTER_AUTOMATIC_CHECKS');
        expect(res).toBe('inverse');
        res = pipe.transform('REJECTED');
        expect(res).toBe('danger');
        res = pipe.transform('RECONCILED');
        expect(res).toBe('lightgreen');
        res = pipe.transform('DRAFT_PROVIDER');
        expect(res).toBe('teal');
        res = pipe.transform('CLOSED');
        expect(res).toBe('default');
        const result = pipe.transform('UNKNOWN');
        expect(result).toBe('info');
    });
});

describe('claimStatusPipe', () => {
    it('create an instance', () => {
        const pipe = new ClaimStatusPipe();
        let res = pipe.transform('APPROVED');
        expect(res).toBe('Approved');
        res = pipe.transform('REJECTED');
        expect(res).toBe('Declined');
        res = pipe.transform('SUBMITTED_PROVIDER');
        expect(res).toBe('Submitted');
        res = pipe.transform('SUBMITTED_PAYER');
        expect(res).toBe('Loaded in payer');
        res = pipe.transform('CLARIFICATION_AFTER_PAYER_CHECKS');
        expect(res).toBe('Pending payer clarification');
        res = pipe.transform('AUTOMATIC_CHECKS_DONE');
        expect(res).toBe('Pending payer review');
        res = pipe.transform('CLARIFICATION_AFTER_AUTOMATIC_CHECKS');
        expect(res).toBe('Clarification');
        res = pipe.transform('CLARIFICATION_AFTER_PAYER_REVIEW');
        expect(res).toBe('Clarification');
        res = pipe.transform('APPEALED');
        expect(res).toBe('Appealed');
        res = pipe.transform('PAID');
        expect(res).toBe('Paid');
        res = pipe.transform('CLOSED');
        expect(res).toBe('Closed');
        res = pipe.transform('RECONCILED');
        expect(res).toBe('Reconciled');
        res = pipe.transform('DRAFT_PROVIDER');
        expect(res).toBe('Unsubmitted');
        const result = pipe.transform('UNKNOWN');
        expect(result).toBe('UNKNOWN');
    });
});

import { LoanStatusColorPipe } from './loan-status-color.pipe';

describe('LoanStatusColorPipe', () => {
    it('create an instance', () => {
        const pipe = new LoanStatusColorPipe();
        const res = pipe.transform('PENDING');
        expect(res).toBe('text-warning');
        let result = pipe.transform('APPROVED');
        expect(result).toBe('text-info');
        result = pipe.transform('PAID');
        expect(result).toBe('text-success');
        result = pipe.transform('REJECTED');
        expect(result).toBe('text-danger');
        result = pipe.transform('CANCELLED');
        expect(result).toBe('text-danger');
        result = pipe.transform('');
        expect(result).toBe('text-black');
    });
});

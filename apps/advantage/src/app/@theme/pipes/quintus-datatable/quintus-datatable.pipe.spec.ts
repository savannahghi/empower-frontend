import { QuintusDatatablePipe } from './quintus-datatable.pipe';

describe('QuintusDatatable', () => {
    it('test for values > 1000000', () => {
        const pipe = new QuintusDatatablePipe();
        const result = pipe.transform(3000000);
        expect(result).toBe('3.00M');
    });
    it('test for values between 10000 and 1000000', () => {
        const pipe = new QuintusDatatablePipe();
        const result = pipe.transform(300000);
        expect(result).toBe('300.0K');
    });
    it('test for values < 999', () => {
        const pipe = new QuintusDatatablePipe();
        const result = pipe.transform(999);
        expect(result).toBe('999');
    });
});

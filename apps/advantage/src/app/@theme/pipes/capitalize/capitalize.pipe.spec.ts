import { CapitalizePipe } from './capitalize.pipe';

describe('CapitalizePipe', () => {
    it('create an instance', () => {
        const pipe = new CapitalizePipe();
        const res = pipe.transform('');
        expect(res).toBe('');
        const result = pipe.transform('John');
        expect(result).toBe('John');
    });
});

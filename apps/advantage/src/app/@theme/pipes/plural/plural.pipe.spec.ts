import { PluralPipe } from './plural.pipe';

describe('PluralPipe', () => {
    it('create an instance', () => {
        const pipe = new PluralPipe();
        let result = pipe.transform(0, 'loan');
        expect(result).toBe('0 loans');
        result = pipe.transform(0, 'loan', 'sds');
        expect(result).toBe('0 sds');
        const res = pipe.transform(1, 'loan', 'ss');
        expect(res).toBe('1 loan');
    });
});

import { NumberWithCommasPipe } from './number-with-commas.pipe';

describe('NumberWithCommasPipe', () => {
    it('create an instance', () => {
        const pipe = new NumberWithCommasPipe();
        const result = pipe.transform(1000);
        expect(result).toBe('1,000');
    });
});

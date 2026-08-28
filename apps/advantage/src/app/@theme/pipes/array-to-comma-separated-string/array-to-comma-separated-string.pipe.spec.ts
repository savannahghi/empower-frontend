import { ArrayToCommaSeparatedStringPipe } from './array-to-comma-separated-string.pipe';

describe('ArrayToCommaSeparatedStringPipe', () => {
    it('should test transforming an array of strings to a comma separated string', () => {
        const pipe = new ArrayToCommaSeparatedStringPipe();
        const result = pipe.transform(['Mtiba', 'Slade', 'Email']);
        expect(result).toBe('Mtiba, Slade, Email');
    });

    it('should test with an empty array', () => {
        const pipe = new ArrayToCommaSeparatedStringPipe();
        const result = pipe.transform([]);
        expect(result).toEqual([]);
    });
});

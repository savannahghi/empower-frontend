import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
    let pipe: TruncatePipe;

    beforeEach(() => {
        pipe = new TruncatePipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should truncate text with default limit', () => {
        const text = 'This is a long sentence that needs truncation.';
        const expected = 'This is a long sente...';
        expect(pipe.transform(text, [])).toEqual(expected);
    });

    it('should truncate text with custom limit', () => {
        const text = 'Another sentence to be truncated.';
        const expected = 'Another se...';
        expect(pipe.transform(text, ['10'])).toEqual(expected);
    });

    it('should not truncate text shorter than limit', () => {
        const text = 'Short text';
        expect(pipe.transform(text, [])).toEqual(text);
    });

    it('should truncate text with custom trail', () => {
        const text = 'Custom truncation test';
        const expected = 'Custom tru[...]';
        expect(pipe.transform(text, ['10', '[...]'])).toEqual(expected);
    });

    it('should handle invalid limit argument', () => {
        const text = 'Invalid limit test';
        const expected = 'Invalid limit test';
        expect(pipe.transform(text, ['not a number'])).toEqual(expected);
    });

    it('should handle empty text', () => {
        expect(pipe.transform('', [])).toEqual('');
    });

    it('should handle null text', () => {
        expect(pipe.transform(null, [])).toEqual('');
    });
});

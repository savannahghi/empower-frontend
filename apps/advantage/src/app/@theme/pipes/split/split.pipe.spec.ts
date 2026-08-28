import { SplitPipe } from './split.pipe';

describe('SplitPipe', () => {
    it('create an instance', () => {
        const pipe = new SplitPipe();
        const result = pipe.transform('Not a word', ' ', 0);
        expect(result).toBe('Not');
    });
});

import { ReplaceWithPipe } from './replace.pipe';

describe('ReplaceWithPipe', () => {
    it('create an instance', () => {
        const pipe = new ReplaceWithPipe();
        const result = pipe.transform('b_toa', '_', ' ');
        expect(result).toBe('b toa');
    });
});

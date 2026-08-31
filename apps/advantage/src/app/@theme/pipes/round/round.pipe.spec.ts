import { RoundPipe } from './round.pipe';

describe('RoundPipe', () => {
    it('create an instance', () => {
        const pipe = new RoundPipe();
        const result = pipe.transform(10.21);
        expect(result).toBe(10);
    });
});

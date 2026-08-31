import { TimingPipe } from './timing.pipe';

describe('TimingPipe', () => {
    it('create an instance', () => {
        const pipe = new TimingPipe();
        const res = pipe.transform(undefined);
        expect(res).toBe('00:00');
        const result = pipe.transform(10.21);
        expect(result).toBe('00:10');
    });
});

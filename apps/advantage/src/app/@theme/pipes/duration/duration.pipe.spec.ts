import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
    it('create an instance', () => {
        const pipe = new DurationPipe();
        expect(pipe).toBeTruthy();
    });

    it('should test transformation', () => {
        const pipe = new DurationPipe();
        const result = pipe.transform({
            start: '2022-11-30T22:00:00Z',
            end: '2022-11-30T22:30:00Z',
        });
        expect(result).toBe('30 mins');
    });
});

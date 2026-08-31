import { AvailableDaysPipe } from './available-days.pipe';

describe('AvailableDaysPipe', () => {
    it('create an instance', () => {
        const pipe = new AvailableDaysPipe();
        expect(pipe).toBeTruthy();
    });

    it('should test transformation', () => {
        const pipe = new AvailableDaysPipe();
        const result = pipe.transform({
            '0': [{ start: '08:00', end: '17:00' }],
            '1': [{ start: '14:00', end: '17:00' }],
            '2': [{ start: '08:00', end: '17:00' }],
            '3': [
                { start: '08:00', end: '12:00' },
                { start: '14:00', end: '17:00' },
            ],
        });
        expect(result).toBe('Mon,Tue,Wed,Thur');
    });
});

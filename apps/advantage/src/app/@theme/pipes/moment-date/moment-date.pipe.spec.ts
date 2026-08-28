import { MomentDatePipe } from './moment-date.pipe'; // Update the path as necessary

describe('MomentDatePipe', () => {
    let pipe: MomentDatePipe;

    beforeEach(() => {
        pipe = new MomentDatePipe();
    });

    it('should format the date according to the provided format', () => {
        const testDate = '2024-08-30T10:24:01.097949+03:00';
        const customFormat = 'YYYY-MM-DD';
        const formattedDate = pipe.transform(testDate, customFormat);

        expect(formattedDate).toBe('2024-08-30');
    });

    it('should return "Invalid date" when given an invalid date', () => {
        const invalidDate = 'invalid date string';
        const formattedDate = pipe.transform(invalidDate);

        expect(formattedDate).toBe('Invalid date');
    });
});

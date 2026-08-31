import { TitleCasePipe } from './title-case.pipe';

describe('TitleCasePipe', () => {
    it('create an instance', () => {
        const pipe = new TitleCasePipe();
        expect(pipe).toBeTruthy();
    });

    it('should test transformation', () => {
        const pipe = new TitleCasePipe();
        const result = pipe.transform('OCCUPATIONAL MEDICINE');
        expect(result).toBe('Occupational Medicine');
        const result2 = pipe.transform('occupational medicine');
        expect(result2).toBe('Occupational Medicine');
        const result3 = pipe.transform('OccuPatIonAl mediCine');
        expect(result3).toBe('Occupational Medicine');
    });
});

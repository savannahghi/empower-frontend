import { HealthIdFormatterPipe } from './health-id.pipe';

describe('HealthIdFormatterPipe', () => {
    it('should return a formatted HealthID', () => {
        const pipe = new HealthIdFormatterPipe();
        const result = pipe.transform('48002222333344445555');
        expect(result).toBe('4800 2222 3333 4444 5555');
    });
});

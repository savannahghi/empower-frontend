import { DoseUnitPipe } from './dose-unit.pipe';

describe('DoseUnitPipe', () => {
    it('create an instance', () => {
        const pipe = new DoseUnitPipe();
        const res = pipe.transform('s');
        expect(res).toBe('second');
        let result = pipe.transform('min');
        expect(result).toBe('minute');
        result = pipe.transform('h');
        expect(result).toBe('hour');
        result = pipe.transform('d');
        expect(result).toBe('day');
        result = pipe.transform('w');
        expect(result).toBe('week');
        result = pipe.transform('m');
        expect(result).toBe('month');
        result = pipe.transform('a');
        expect(result).toBe('year');
        result = pipe.transform('test');
        expect(result).toBe('test');
    });
});

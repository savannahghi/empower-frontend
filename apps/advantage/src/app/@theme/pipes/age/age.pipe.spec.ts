import { AgePipe } from './age.pipe';

describe('AgePipe', () => {
    it('should test if age is null', () => {
        const pipe = new AgePipe();
        const age = null;
        const res = pipe.transform(age);
        expect(res).toBe('DoB not set');
    });
    it('should test for patients more than 2 years', () => {
        const pipe = new AgePipe();
        let age = { years: 2, months: 2, weeks: 1, days: 2 };
        let res = pipe.transform(age);
        expect(res).toBe('2 years');
        age = { years: 2, months: 2, weeks: 1, days: 2 };
        res = pipe.transform(age);
    });
    it('should test for patients less than 2 years', () => {
        const pipe = new AgePipe();
        let age = { years: 1, months: 2, weeks: 1, days: 2 };
        let res = pipe.transform(age);
        expect(res).toBe('1 year 2 months');
        age = { years: 1, months: 1, weeks: 1, days: 2 };
        res = pipe.transform(age);
        expect(res).toBe('1 year 1 month');
        age = { years: 1, months: 0, weeks: 1, days: 2 };
        res = pipe.transform(age);
        expect(res).toBe('1 year');
        age = { years: 0, months: 2, weeks: 2, days: 2 };
        res = pipe.transform(age);
        expect(res).toBe('2 months 2 weeks');
        age = { years: 0, months: 1, weeks: 1, days: 2 };
        res = pipe.transform(age);
        expect(res).toBe('1 month 1 week');
        age = { years: 0, months: 1, weeks: 0, days: 2 };
        res = pipe.transform(age);
        expect(res).toBe('1 month');
    });
    it('should test for patients less than a month more than a week', () => {
        const pipe = new AgePipe();
        let age = { years: 0, months: 0, weeks: 2, days: 6 };
        let res = pipe.transform(age);
        expect(res).toBe('2 weeks 6 days');
        age = { years: 0, months: 0, weeks: 1, days: 1 };
        res = pipe.transform(age);
        expect(res).toBe('1 week 1 day');
        age = { years: 0, months: 0, weeks: 1, days: 0 };
        res = pipe.transform(age);
        expect(res).toBe('1 week');
    });
    it('should test for patients less than a week', () => {
        const pipe = new AgePipe();
        let age = { years: 0, months: 0, weeks: 0, days: 6 };
        let res = pipe.transform(age);
        expect(res).toBe('6 days');
        age = { years: 0, months: 0, weeks: 0, days: 1 };
        res = pipe.transform(age);
        expect(res).toBe('1 day');
        age = { years: 0, months: 0, weeks: 0, days: 0 };
        res = pipe.transform(age);
        expect(res).toBe('Below a day');
    });
});

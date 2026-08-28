import { SilTimeAgoPipe } from './time-ago.pipe';
import moment from 'moment';

describe('SilTimeAgoPipe', () => {
    let pipe: SilTimeAgoPipe;

    const recentlyString = 'just now';
    const futureString = 'in the future';

    beforeAll(() => {
        pipe = new SilTimeAgoPipe();
    });

    it('should return just now', () => {
        const today = new Date();
        expect(pipe.transform(today)).toEqual(recentlyString);
    });

    it('should return just now', () => {
        const today = new Date();
        const fewSecondsAgoDate = new Date(today.getTime() - 5 * 1000);
        expect(pipe.transform(fewSecondsAgoDate)).toEqual(recentlyString);
    });

    it('should return just now', () => {
        const today = new Date();
        const aMinuteAgoDate = new Date(today.getTime() - 60 * 1000);
        expect(pipe.transform(aMinuteAgoDate)).toEqual(recentlyString);
    });

    it('should return 5 minutes ago', () => {
        const fewMinutesAgoString = 5 + ' minutes ago';
        const fewMinutesAgoDate = new Date(
            new Date().getTime() - 5 * 60 * 1000
        );
        expect(pipe.transform(fewMinutesAgoDate)).toEqual(fewMinutesAgoString);
    });

    it('should return an hour ago', () => {
        const anHourAgoString = 'an hour ago';
        const anHourAgoDate = new Date(new Date().getTime() - 60 * 60 * 1000);
        expect(pipe.transform(anHourAgoDate)).toEqual(anHourAgoString);
    });

    it('should return 5 hours ago', () => {
        const fewHoursAgoString = 5 + ' hours ago';
        const fewHoursAgoDate = new Date(
            new Date().getTime() - 5 * 60 * 60 * 1000
        );

        expect(pipe.transform(fewHoursAgoDate)).toEqual(fewHoursAgoString);
    });

    it('should return yesterday', () => {
        const yesterdayString = 'yesterday';
        const yesterdayDate = new Date(
            new Date().setDate(new Date().getDate() - 1)
        );
        expect(pipe.transform(yesterdayDate)).toEqual(yesterdayString);
    });

    it('should return 5 days ago', () => {
        const fewDaysAgoString = 3 + ' days ago';
        const fewDaysAgoDate = new Date(
            new Date().setDate(new Date().getDate() - 3)
        );
        expect(pipe.transform(fewDaysAgoDate)).toEqual(fewDaysAgoString);
    });

    it('should return last week', () => {
        const lastWeekString = 'last week';
        const lastWeekDate = new Date(
            new Date().setDate(new Date().getDate() - 12)
        );
        expect(pipe.transform(lastWeekDate)).toEqual(lastWeekString);
    });

    it('should return 2 weeks ago', () => {
        const fewWeeksAgoString = 2 + ' weeks ago';
        const fewWeeksAgoDate = new Date(
            new Date().setDate(new Date().getDate() - 14)
        );
        expect(pipe.transform(fewWeeksAgoDate)).toEqual(fewWeeksAgoString);
    });

    it('should return last month', () => {
        const lastMonthString = 'last month';
        const lastMonthDate = new Date(
            new Date().setDate(new Date().getDate() - 30)
        );
        expect(pipe.transform(lastMonthDate)).toEqual(lastMonthString);
    });

    it('should return 5 months ago', () => {
        const fewMonthsAgoString = 5 + ' months ago';
        const fewMonthsAgoDate = new Date(
            new Date().setDate(new Date().getDate() - 30 * 5)
        );
        expect(pipe.transform(fewMonthsAgoDate)).toEqual(fewMonthsAgoString);
    });

    it('should return last year', () => {
        const lastYearString = 'last year';
        const lastYearDate = new Date(
            new Date().setDate(new Date().getDate() - 366)
        );
        expect(pipe.transform(lastYearDate)).toEqual(lastYearString);
    });

    it('should return 5 years ago', () => {
        const fewYearsAgoString = 5 + ' years ago';
        const fewYearsAgoDate = new Date(
            new Date().setDate(new Date().getDate() - 365 * 5)
        );
        expect(pipe.transform(fewYearsAgoDate)).toEqual(fewYearsAgoString);
    });

    it('should return in the future', () => {
        const today = new Date();
        const future = new Date(today.getTime() + 1000 * 60);
        expect(pipe.transform(future)).toEqual(futureString);
    });

    it('should support moment.js just now', () => {
        expect(pipe.transform(moment())).toEqual('just now');
    });

    it('should support moment.js last week', () => {
        expect(pipe.transform(moment().subtract(10, 'days'))).toEqual(
            'last week'
        );
    });
});

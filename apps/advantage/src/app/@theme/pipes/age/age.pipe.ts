import { Pipe, PipeTransform } from '@angular/core';
/**
 * Pipe used to return the age of a person in years, months, weeks or days
 */
@Pipe({
    name: 'age',
    standalone: false,
})
export class AgePipe implements PipeTransform {
    transform(age: any) {
        /** Patients above 2 just show the years */
        if (age === null) {
            return 'DoB not set';
        }
        if (age.years > 1) {
            return `${age.years} years`;
        }

        /** Patients below 2 but older than 1 year  */
        if (age.years > 0 && age.years < 2) {
            const monthwiths = age.months > 1 ? 's' : '';
            const showmonths =
                age.months > 0 ? ` ${age.months} month${monthwiths}` : '';
            return `1 year${showmonths}`;
        }

        /** Patients below 1, but older than a month show months and weeks */
        if (age.years === 0 && age.months > 0) {
            const monthwiths = age.months > 1 ? 's' : '';
            const weekwiths = age.weeks > 1 ? 's' : '';
            const showWeeks =
                age.weeks > 0 ? ` ${age.weeks} week${weekwiths}` : '';
            return `${age.months} month${monthwiths}${showWeeks}`;
        }

        /** Patients less than a month */
        if (age.years === 0 && age.months === 0 && age.weeks > 0) {
            const dayswiths = age.days > 1 ? 's' : '';
            const days = age.days > 0 ? ` ${age.days} day${dayswiths}` : '';
            return `${age.weeks} week${age.weeks > 1 ? 's' : ''}${days}`;
        }

        /** Patients who are less than a week old */
        if (
            age.years === 0 &&
            age.months === 0 &&
            age.weeks === 0 &&
            age.days > 0
        ) {
            return `${age.days} day${age.days === 1 ? '' : 's'}`;
        }

        /** Patients who are less than a day old */
        if (
            age.years === 0 &&
            age.months === 0 &&
            age.weeks === 0 &&
            age.days === 0
        ) {
            return 'Below a day';
        }
    }
}

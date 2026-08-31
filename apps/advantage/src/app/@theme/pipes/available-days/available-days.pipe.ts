import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return the available days as used in schedules
 */
@Pipe({
    name: 'availableDays',
    standalone: false,
})
export class AvailableDaysPipe implements PipeTransform {
    availableDays: Array<string> = [];
    days: object = {
        0: 'Mon',
        1: 'Tue',
        2: 'Wed',
        3: 'Thur',
        4: 'Fri',
        5: 'Sat',
        6: 'Sun',
    };

    transform(value: Object) {
        for (let i = 0; i < 7; i++) {
            if (value.hasOwnProperty(i)) {
                this.availableDays.push(this.days[i]);
            }
        }

        return this.availableDays.join();
    }
}

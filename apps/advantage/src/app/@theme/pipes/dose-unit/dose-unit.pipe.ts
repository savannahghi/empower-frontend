import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return the loan status text colour
 */
@Pipe({
    name: 'doseUnit',
    standalone: true,
})
export class DoseUnitPipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 's':
                return 'second';
            case 'min':
                return 'minute';
            case 'h':
                return 'hour';
            case 'd':
                return 'day';
            case 'w':
                return 'week';
            case 'm':
                return 'month';
            case 'a':
                return 'year';
            default:
                return value;
        }
    }
}

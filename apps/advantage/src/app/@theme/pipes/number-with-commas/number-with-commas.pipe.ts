import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return a number formated with commas
 */
@Pipe({
    name: 'ngxNumberWithCommas',
    standalone: false,
})
export class NumberWithCommasPipe implements PipeTransform {
    transform(input: number): string {
        return new Intl.NumberFormat().format(input);
    }
}

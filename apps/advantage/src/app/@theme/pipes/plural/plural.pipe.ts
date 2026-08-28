import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return a single/plural string of the item used as an input
 */
@Pipe({
    name: 'ngxPlural',
    standalone: false,
})
export class PluralPipe implements PipeTransform {
    /**
     * Implements a filter for plural
     * @param input needs to be an integer to determine the count
     * @param label string that defines the item
     * @param pluralLabel string that defines the plural format of the item
     * @returns a string that is formated based on the plural status
     */
    transform(input: number, label: string, pluralLabel: string = ''): string {
        input = input || 0;
        return input === 1
            ? `${input} ${label}`
            : pluralLabel
            ? `${input} ${pluralLabel}`
            : `${input} ${label}s`;
    }
}

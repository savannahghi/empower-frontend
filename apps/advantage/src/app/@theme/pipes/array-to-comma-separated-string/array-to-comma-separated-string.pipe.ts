import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return comma separated strings from an array of strings
 */
@Pipe({ name: 'arrayToCommaSeparatedStrings', standalone: true })
export class ArrayToCommaSeparatedStringPipe implements PipeTransform {
    transform(arr: string[]) {
        if (arr.length > 0) {
            return arr.join(', ');
        }
        return arr;
    }
}

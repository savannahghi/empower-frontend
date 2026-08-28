import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to split strings e.g. '_' with ' '
 */
@Pipe({
    name: 'split',
    standalone: false,
})
export class SplitPipe implements PipeTransform {
    transform(value: string, splitChar: string, position: number): any {
        const splitWord = value.split(splitChar);
        return splitWord[position];
    }
}

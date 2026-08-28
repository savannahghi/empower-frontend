import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to round off numbers
 */
@Pipe({
    name: 'ngxRound',
    standalone: false,
})
export class RoundPipe implements PipeTransform {
    transform(input: number): number {
        return Math.round(input);
    }
}

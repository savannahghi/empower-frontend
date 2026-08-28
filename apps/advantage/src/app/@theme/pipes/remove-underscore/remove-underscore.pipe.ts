import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to remove underscore in strings e.g. '_' with ' '
 */
@Pipe({
    name: 'removeUnderScore',
    standalone: false,
})
export class RemoveUnderScorePipe implements PipeTransform {
    transform(value: any): any {
        if (typeof value === 'number') {
            return value;
        }
        return value?.replace(/_/g, ' ');
    }
}

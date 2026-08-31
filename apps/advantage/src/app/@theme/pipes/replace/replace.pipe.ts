import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to replace characters e.g. '_' with ' '
 */
@Pipe({
    name: 'replaceWith',
    standalone: false,
})
export class ReplaceWithPipe implements PipeTransform {
    transform(value: string, regexValue: string, replaceValue: string): any {
        const regex = new RegExp(regexValue, 'g');
        return value?.replace(regex, replaceValue);
    }
}

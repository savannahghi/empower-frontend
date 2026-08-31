import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to a string in title case
 */
@Pipe({
    name: 'titleCase',
    standalone: false,
})
export class TitleCasePipe implements PipeTransform {
    transform(value: any) {
        if (!value) {
            return value;
        }
        return value?.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}

import { Pipe, PipeTransform } from '@angular/core';

/**
 * The pipe should get the current routed state the user is on
 */
@Pipe({
    name: 'stringReplace',
    standalone: true,
})
export class StringReplacePipe implements PipeTransform {
    transform(value: string): any {
        switch (value) {
            case 'DELIVERED':
                return 'Delivered';
            case 'UNDELIVERED':
                return 'Undelivered';
            case 'SENT':
                return 'Pending';
            case undefined:
                return 'No Status';
            default:
                return value;
        }
    }
}

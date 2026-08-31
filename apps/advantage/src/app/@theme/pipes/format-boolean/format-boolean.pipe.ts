import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatBoolean',
    standalone: true,
})
export class FormatBooleanPipe implements PipeTransform {
    constructor() {}
    transform(value: any): string {
        if (typeof value === 'boolean') {
            return value ? 'Active' : 'Inactive';
        }
        return value;
    }
}

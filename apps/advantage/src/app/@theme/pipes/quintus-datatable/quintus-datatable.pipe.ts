import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return formatted values used in quintus datatable
 */
@Pipe({
    name: 'quintusDatatable',
    standalone: false,
})
export class QuintusDatatablePipe implements PipeTransform {
    transform(value: any) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(2) + 'M';
        } else if (value >= 10000 && value < 1000000) {
            return (value / 1000).toFixed(1) + 'K';
        } else {
            return value.toFixed(0);
        }
    }
}

import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'momentDate',
    standalone: false,
})
export class MomentDatePipe implements PipeTransform {
    transform(value: any, format: string = 'Do MMMM YYYY [at] h:mmA'): string {
        return moment(value).format(format);
    }
}

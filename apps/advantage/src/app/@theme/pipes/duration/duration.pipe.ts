import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

/**
 * Pipe used to return the dureation in minutes between a start and end
 */
@Pipe({
    name: 'duration',
    standalone: false,
})
export class DurationPipe implements PipeTransform {
    transform(value: any) {
        const startTime = moment(value.start);
        const endTime = moment(value.end);

        const duration = moment.duration(endTime.diff(startTime)).asMinutes();
        return `${duration} mins`;
    }
}

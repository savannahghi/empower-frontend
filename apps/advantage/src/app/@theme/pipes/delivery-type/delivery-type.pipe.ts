import { Pipe, PipeTransform } from '@angular/core';

/**
 * The pipe should format the segment delivery types
 */
@Pipe({
    name: 'deliveryType',
    standalone: true,
})
export class DeliveryTypePipe implements PipeTransform {
    transform(value: string): any {
        switch (value) {
            case 'SCHEDULED_RECURRENT':
                return 'Scheduled Recurrent';
            case 'SCHEDULED_ONE_TIME':
                return 'Scheduled One Time';
            case 'INSTANT':
                return 'Instant Message';
            default:
                return value;
        }
    }
}

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return colour intention based on status of a visit/appointment
 */
@Pipe({
    name: 'transitionStatus',
    standalone: false,
})
export class TransitionStatusPipe implements PipeTransform {
    transform(value: any) {
        switch (value) {
            case 'WAITING':
                return 'IN_PROGRESS';
            case 'PENDING':
                return 'WAITING';
            case 'IN_PROGRESS':
                return 'COMPLETED';
            case 'ENTERED_IN_ERROR':
                return 'ENTERED_IN_ERROR';
            default:
                return '';
        }
    }
}

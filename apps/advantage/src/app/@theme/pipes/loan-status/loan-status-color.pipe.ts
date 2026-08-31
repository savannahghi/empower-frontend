import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return the loan status text colour
 */
@Pipe({
    name: 'LoanStatusColor',
    standalone: false,
})
export class LoanStatusColorPipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'PENDING':
                return 'text-warning';
            case 'APPROVED':
                return 'text-info';
            case 'PAID':
                return 'text-success';
            case 'REJECTED':
                return 'text-danger';
            case 'CANCELLED':
                return 'text-danger';
            default:
                return 'text-black';
        }
    }
}

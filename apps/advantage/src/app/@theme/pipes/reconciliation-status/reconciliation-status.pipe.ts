import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'reconciliationStatus',
    standalone: false,
})
export class ReconciliationStatusPipe implements PipeTransform {
    transform(value: any) {
        switch (value) {
            case 'RECONCILED':
                return 'success';
            case 'PAID':
                return 'success';
            case 'NOT_PAID':
                return 'danger';
            case 'PROCESSED':
                return 'primary';
            case 'OPEN':
                return 'basic';
            case 'CANCELLED':
                return 'danger';
            case 'REJECTED':
                return 'danger';
            case 'INVALIDATED':
                return 'danger';
            case 'PARTIALLY_PAID':
                return 'warning';
            case 'OPEN_FOR_RECON':
                return 'primary';
            case 'INQUIRY':
                return 'primary';
            case 'READY_FOR_REVIEW':
                return 'info';
            case 'AGREEMENT_REACHED':
                return 'success';
            case 'FINALIZED_PROVIDER':
                return 'primary';
            case 'FINALIZED_PAYER':
                return 'primary';
            case 'PENDING_PAYMENT_UPDATE':
                return 'warning';
            case 'NOT_LOADED':
                return 'warning';
            case 'LOADED':
                return 'primary';
            case 'PARTIALLY_RECONCILED':
                return 'warning';
            case 'PAYMENT_UPDATED':
                return 'success';
            case 'DECLINED':
                return 'danger';
            case 'APPROVED':
                return 'success';
            case 'Declined':
                return 'danger';
            case 'Duplicate':
                return 'warning';
            case 'Loaded':
                return 'primary';
            case 'Paid':
                return 'success';
            case 'Paid Externally':
                return 'success';
            case 'Paid To Zero':
                return 'success';
            case 'Partially Paid':
                return 'warning';
            case 'Pending Decline':
                return 'warning';
            case 'Pre-Processed':
                return 'primary';
            case 'Processed':
                return 'info';
            case 'Processed - Suspended':
                return 'danger';
            case 'QA':
                return 'primary';
            case 'Rectification':
                return 'info';
            case 'Under Investigation':
                return 'warning';
            case 'Waiting Approval':
                return 'info';
            case 'PAYER':
                return 'info';
            case 'PROVIDER':
                return 'info';
            case 'SHARED':
                return 'info';
            case 'NOT_ASSIGNED':
                return 'warning';
            default:
                return 'basic';
        }
    }
}

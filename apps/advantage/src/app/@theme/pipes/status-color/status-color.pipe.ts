import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return colour intention based on status of a visit/appointment
 */
@Pipe({
    name: 'statusColor',
    standalone: true,
})
export class StatusColorPipe implements PipeTransform {
    transform(value: any) {
        switch (value) {
            case 'BOOKED':
                return 'success';
            case true:
                return 'success';
            case 'Published':
                return 'success';
            case 'PUBLISHED':
                return 'success';
            case 'PROCESSED':
                return 'success';
            case 'processed':
                return 'success';
            case 'SUBMITTED':
                return 'success';
            case 'FINISHED':
                return 'success';
            case 'COMPLETED':
                return 'success';
            case 'completed':
                return 'success';
            case 'Completed':
                return 'success';
            case 'COMPLETE':
                return 'success';
            case 'complete':
                return 'success';
            case 'DELIVERED':
                return 'success';
            case 'RECEIVED':
                return 'success';
            case 'ACTIVE':
                return 'success';
            case 'active':
                return 'success';
            case 'Active':
                return 'success';
            case 'Not At Risk':
                return 'success';
            case 'CONFIRMED':
                return 'success';
            case 'Linked':
                return 'success';
            case 'APPROVED':
                return 'success';
            case 'Yes':
                return 'success';
            case 'RECONCILED':
                return 'success';
            case 'PAID':
                return 'success';
            case 'OPEN':
                return 'success';
            case 'PAYMENT_UPDATED':
                return 'success';
            case 'Valid':
                return 'success';
            case 'ARRIVED':
                return 'warning';
            case 'ASAP':
                return 'warning';
            case 'WAITING':
                return 'warning';
            case 'DRAFT':
                return 'warning';
            case 'Draft':
                return 'warning';
            case 'draft':
                return 'warning';
            case 'Low Risk':
                return 'warning';
            case 'NO_SHOW':
                return 'warning';
            case 'Average Risk':
                return 'warning';
            case 'UNDELIVERED':
                return 'warning';
            case 'REQUESTED':
                return 'warning';
            case 'pending':
                return 'warning';
            case 'PENDING_PAYMENT_UPDATE':
                return 'warning';
            case 'NOT_LOADED':
                return 'warning';
            case 'RETURNED':
                return 'warning';
            case 'Returned':
                return 'warning';
            case 'requested':
                return 'warning';
            case 'PARTIALLY-PAID':
                return 'warning';
            case 'urgent':
                return 'warning';
            case 'PENDING':
                return 'warning';
            case 'CASH':
                return 'primary';
            case 'INQUIRY':
                return 'primary';
            case 'CREDIT':
                return 'info';
            case 'IN_PROGRESS':
                return 'info';
            case 'INSURANCE':
                return 'info';
            case 'PATIENT':
                return 'info';
            case 'EMPLOYER':
                return 'info';
            case 'LOADED':
                return 'info';
            case 'PARTIALLY_RECONCILED':
                return 'info';
            case 'SENT':
                return 'info';
            case 'REVIEWED':
                return 'info';
            case 'Reviewed':
                return 'info';
            case 'OPEN_FOR_RECON':
                return 'info';
            case 'READY_FOR_REVIEW':
                return 'info';
            case 'CANCELLED':
                return 'danger';
            case 'cancelled':
                return 'danger';
            case 'FAILED':
                return 'danger';
            case 'EMERGENCY':
                return 'danger';
            case 'ENTERED_IN_ERROR':
                return 'danger';
            case 'At Risk':
                return 'danger';
            case 'High Risk':
                return 'danger';
            case 'No':
                return 'danger';
            case 'Unlinked':
                return 'danger';
            case 'Invalid':
                return 'danger';
            case 'Retired':
                return 'danger';
            case 'RETIRED':
                return 'danger';
            case 'NOT_PAID':
                return 'danger';
            case 'DECLINED':
                return 'danger';
            case false:
                return 'danger';
            case 'INVALIDATED':
                return 'danger';
            case 'REJECTED':
                return 'danger';
            case 'stat':
                return 'danger';
            case 'Mapped':
                return 'secondary';
            case 'MAPPED':
                return 'secondary';
            case 'FULFILLED':
                return 'secondary';
            case 'FINALIZED_PROVIDER':
                return 'primary';
            default:
                return 'basic';
        }
    }
}

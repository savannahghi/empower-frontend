import { Pipe, PipeTransform } from '@angular/core';
import _ from 'underscore';

/**
 * Pipe used to return a formatted version of a claim status
 */
@Pipe({
    name: 'claimStatus',
    standalone: false,
})
export class ClaimStatusPipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'APPROVED':
                return 'Approved';
            case 'REJECTED':
                return 'Declined';
            case 'DRAFT_PROVIDER':
                return 'Unsubmitted';
            case 'SUBMITTED_PROVIDER':
                return 'Submitted';
            case 'SUBMITTED_PAYER':
                return 'Loaded in payer';
            case 'CLARIFICATION_AFTER_PAYER_CHECKS':
                return 'Pending payer clarification';
            case 'AUTOMATIC_CHECKS_DONE':
                return 'Pending payer review';
            case 'CLARIFICATION_AFTER_AUTOMATIC_CHECKS':
                return 'Clarification';
            case 'CLARIFICATION_AFTER_PAYER_REVIEW':
                return 'Clarification';
            case 'APPEALED':
                return 'Appealed';
            case 'PAID':
                return 'Paid';
            case 'CLOSED':
                return 'Closed';
            case 'RECONCILED':
                return 'Reconciled';
            default:
                return 'UNKNOWN';
        }
    }
}

/**
 * Pipe used to the colour intention based on the status of the claim
 */
@Pipe({
    name: 'claimStatusColor',
    standalone: false,
})
export class ClaimStatusColorPipe implements PipeTransform {
    transform(input: string): string {
        // inSuccess
        const success = ['PAID', 'APPROVED', 'AUTHORIZED'];

        // inWarning
        const warning = ['APPEALED', 'PENDING'];

        // (info)inPending
        const info = [
            'SUBMITTED_PROVIDER',
            'SUBMITTED_PAYER',
            'AUTOMATIC_CHECKS_DONE',
            'SUBMITTED',
        ];

        const rej = ['REJECTED', 'FLAGGED'];

        // (default)inClarify
        const defaultState = [
            'CLARIFICATION_AFTER_AUTOMATIC_CHECKS',
            'CLARIFICATION_AFTER_PAYER_CHECKS',
            'CLARIFICATION_AFTER_PAYER_REVIEW',
            'APPEALED',
        ];

        const lightgreen = ['RECONCILED'];

        const teal = ['DRAFT_PROVIDER', 'DRAFT', 'FINAL'];

        const black = ['CLOSED'];
        if (_.contains(success, input)) {
            return 'reviewed';
        } else if (_.contains(warning, input)) {
            return 'pending';
        } else if (_.contains(info, input)) {
            return 'cyan';
        } else if (_.contains(defaultState, input)) {
            return 'inverse';
        } else if (_.contains(rej, input)) {
            return 'danger';
        } else if (_.contains(lightgreen, input)) {
            return 'lightgreen';
        } else if (_.contains(teal, input)) {
            return 'teal';
        } else if (_.contains(black, input)) {
            return 'default';
        } else {
            return 'info';
        }
    }
}

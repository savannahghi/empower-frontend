import { Pipe, PipeTransform } from '@angular/core';
import { SilCurrencyPipe } from './../currency/currency.pipe';
/**
 * Pipe used to round off numbers
 */

@Pipe({
    name: 'visitAmountDue',
    standalone: false,
})
export class VisitAmountPipe implements PipeTransform {
    constructor(public silCurrencyPipe: SilCurrencyPipe) {}
    transform(input: any): string {
        const amountRemaining =
            input.invoice.amount_due - input.invoice.amount_paid;
        if (amountRemaining > 0) {
            const amount = this.silCurrencyPipe.transform(amountRemaining);
            return `${amount} still due`;
        } else if (
            amountRemaining === 0 &&
            input.invoice.invoice_lines.length > 0
        ) {
            return 'Amount has been fully paid';
        } else if (
            amountRemaining === 0 &&
            input.invoice.invoice_lines.length === 0
        ) {
            return 'Nothing has been billed yet';
        } else if (
            amountRemaining < 0 &&
            input.invoice.invoice_lines.length > 0
        ) {
            return 'Overpaid for the service';
        } else {
            return 'Undetermined state of the bill';
        }
    }
}

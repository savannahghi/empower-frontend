import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'notLoadedInvoicesRemarks',
    standalone: false,
})
export class NotLoadedInvoicesRemarksPipe implements PipeTransform {
    transform(value: any): string {
        let displayText: string | undefined;

        if (
            !value?.not_loaded_remarks &&
            value?.workflow_state === 'NOT_LOADED'
        ) {
            displayText = value?.identifiers?.edi?.workflow_state?.replace(
                /_/g,
                ' '
            );
        } else {
            displayText = value?.not_loaded_remarks;
        }

        return displayText || '_';
    }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'entryType',
    standalone: true,
})
export class EntryTypePipe implements PipeTransform {
    /**
     * map an entry type to either debit or credit
     */
    private entryTypeMap: { [key: string]: string } = {
        dr: 'Debit',
        cr: 'Credit',
    };

    transform(entryType: string): string {
        return this.entryTypeMap[entryType];
    }
}

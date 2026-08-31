import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return the payer name based on the slade code
 */
@Pipe({
    name: 'payerName',
    standalone: false,
})
export class PayerNamePipe implements PipeTransform {
    transform(value: number): string {
        const payer = value.toString();
        switch (payer) {
            case '457':
                return 'Jubilee Health Insurance Limited';
            case '2001':
                return 'APA Insurance Company';
            case '2020':
                return 'MINET Insurance Brokers Limited';
            case '2011':
                return 'MADISON GENERAL INSURANCE KENYA LTD';
            case '2002':
                return 'BRITAM General Insurance';
            case '2022':
                return 'GNRSH Insurance Scheme';
            case '2023':
                return 'Savannah Informatics Insurance Scheme';
            default:
                return payer;
        }
    }
}

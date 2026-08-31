import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Authorization } from '../../../@core/auth/services/authorization.service';
/**
 * The pipe display the correct currency using the country code
 */
@Pipe({
    name: 'silCurrency',
    standalone: true,
})
export class SilCurrencyPipe implements PipeTransform {
    constructor(
        public currencyPipe: CurrencyPipe,
        public authServ: Authorization
    ) {}
    transform(value: any) {
        const erpOrg = this.authServ.getErpOrganisation();
        const country = erpOrg?.organisation_country;
        switch (country) {
            case 'KEN':
                return this.currencyPipe.transform(value, 'KES ');
            case 'TZA':
                return this.currencyPipe.transform(value, 'TSZ ');
            case 'UGA':
                return this.currencyPipe.transform(value, 'UGX ');
            case 'RWA':
                return this.currencyPipe.transform(value, 'RWF ');
            case 'SSD':
                return this.currencyPipe.transform(value, 'SSP ');
            case 'NGA':
                return this.currencyPipe.transform(value, 'NGN ');
            case 'SOM':
                return this.currencyPipe.transform(value, 'SOS ');
            case 'ETH':
                return this.currencyPipe.transform(value, 'ETB ');
            case 'ZMB':
                return this.currencyPipe.transform(value, 'ZMW ');
            case 'ZAF':
                return this.currencyPipe.transform(value, 'ZAR ');
            case 'BDI':
                return this.currencyPipe.transform(value, 'BIF ');
            case 'COD':
                return this.currencyPipe.transform(value, 'CDF ');
            case 'COG':
                return this.currencyPipe.transform(value, 'CFA ');
            case 'MOZ':
                return this.currencyPipe.transform(value, 'MZN ');
            case 'BWA':
                return this.currencyPipe.transform(value, 'BWP ');
            case 'LBY':
                return this.currencyPipe.transform(value, 'LYD ');
            default:
                return this.currencyPipe.transform(value, 'KES ');
        }
    }
}

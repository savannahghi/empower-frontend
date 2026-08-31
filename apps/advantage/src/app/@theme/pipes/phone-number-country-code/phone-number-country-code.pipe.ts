import { Pipe, PipeTransform } from '@angular/core';
import { Authorization } from '../../../@core/auth/services/authorization.service';
/**
 * The pipe should help determine the default selected phone country code
 */
@Pipe({
    name: 'silPhoneCountryCode',
    standalone: true,
})
export class SilPhoneCountryCodePipe implements PipeTransform {
    constructor(public authServ: Authorization) {}
    transform() {
        const erpOrg = this.authServ.getErpOrganisation();
        const country = erpOrg?.organisation_country;
        switch (country) {
            case 'KEN':
                return 'Kenya';
            case 'TZA':
                return 'Tanzania';
            case 'UGA':
                return 'Uganda';
            case 'RWA':
                return 'Rwanda';
            case 'SSD':
                return 'SouthSudan';
            case 'NGA':
                return 'Nigeria';
            case 'SOM':
                return 'Somalia';
            case 'ETH':
                return 'Ethiopia';
            case 'ZMB':
                return 'Zimbabwe';
            case 'ZAF':
                return 'SouthAfrica';
            case 'BDI':
                return 'Burundi';
            case 'COD':
                return 'CongoDRCJamhuriYaKidemokrasiaYaKongo';
            case 'COG':
                return 'CongoRepublicCongoBrazzaville';
            case 'MOZ':
                return 'Mozambique';
            case 'BWA':
                return 'Botswana';
            case 'LBY':
                return 'Libya';
            default:
                return 'Kenya';
        }
    }
}

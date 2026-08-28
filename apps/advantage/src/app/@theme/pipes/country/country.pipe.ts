import { Pipe, PipeTransform } from '@angular/core';
import { Authorization } from '../../../@core/auth/services/authorization.service';

/**
 * The pipe should get decide whether to show a feature in production or not
 */
@Pipe({
    name: 'country',
    standalone: true,
})
export class CountryPipe implements PipeTransform {
    /**
     * Stores country
     */
    country: string;

    constructor(public authConfig: Authorization) {
        const erpOrg = this.authConfig.getErpOrganisation();
        this.country = erpOrg?.organisation_country;
    }

    transform(value: any): any {
        return this.country === value;
    }
}

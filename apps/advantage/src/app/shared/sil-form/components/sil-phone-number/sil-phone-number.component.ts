import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

import {
    SearchCountryField,
    CountryISO,
    PhoneNumberFormat,
} from 'ngx-intl-tel-input-gg';
import { SilPhoneCountryCodePipe } from '../../../../@theme/pipes/phone-number-country-code/phone-number-country-code.pipe';
import _ from 'underscore';

@Component({
    selector: 'ngx-sil-phone-number',
    templateUrl: './sil-phone-number.component.html',
    styleUrls: ['./sil-phone-number.component.scss'],
    providers: [SilPhoneCountryCodePipe],
    standalone: false,
})
export class SilPhoneNumberComponent
    extends FieldType<FieldTypeConfig>
    implements OnInit
{
    constructor(public phoneCountryCode: SilPhoneCountryCodePipe) {
        super();
    }
    separateDialCode = true;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    modelValue: string;
    preferredCountryISO = this.phoneCountryCode.transform();
    prefCountries = [
        CountryISO[this.preferredCountryISO],
        CountryISO.Kenya,
        CountryISO.Rwanda,
        CountryISO.Tanzania,
        CountryISO.Uganda,
        CountryISO.Ethiopia,
        CountryISO.Nigeria,
    ];
    preferredCountries: CountryISO[] = _.uniq(this.prefCountries);

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.modelValue = this.formControl.value;
    }

    /**
     * onModelChange event
     */
    onModelChange(e) {
        if (e === null) {
            this.formControl.setValue(null);
        } else {
            this.modelValue = e.number;
            this.formControl.setValue(e.e164Number);
        }
    }
}

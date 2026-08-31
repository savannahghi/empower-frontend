import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';

@Injectable({
    providedIn: 'root',
})
export class ExpiriesFilterFormFieldService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Organisation ID
     */
    organisationID: string;

    constructor(
        public dataLayer: SilStoresService,
        public auth: AuthenticationService,
        public authServ: Authorization,
        public uiglobals: UIRouterGlobals
    ) {}

    /**
     * Fields loaded in formly form
     * @returns fileds used in the formly field form component
     */
    fields() {
        return [
            {
                key: 'expires_within',
                type: 'input',
                className: 'col-12 col-md-6 col-sm-12 w-100',
                props: {
                    type: 'number',
                    required: false,
                    size: 'small',
                },
                expressions: {},
            },
        ];
    }

    setComponent(component) {
        this.component = component;
        const erpOrg = this.authServ.getErpOrganisation();
        this.organisationID = erpOrg?.organisation_id;
    }
}

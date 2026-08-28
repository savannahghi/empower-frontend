import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';

@Injectable({
    providedIn: 'root',
})
export class AddCommentsFormFieldsService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model
     */
    model: Object;

    /**
     * OrganisationID
     */
    organisationID: string;

    constructor(
        public dataLayer: SilStoresService,
        public auth: AuthenticationService,
        public authServ: Authorization,
        public uiglobals: UIRouterGlobals
    ) {}

    /**
     * Fields loaded in the formly form
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'note',
                type: 'textarea',
                className: 'col-12 mb-4',
                props: {
                    label: 'Comment',
                    required: false,
                    placeholder: 'Kindly put your comment here..',
                },
            },
        ];
    }

    /**
     * setComponent
     * Sets the component instance from the formly component
     */
    setComponent() {
        this.component = this.component;
        const erpOrg = this.authServ.getErpOrganisation();
        this.organisationID = erpOrg?.organisation_id;
    }
}

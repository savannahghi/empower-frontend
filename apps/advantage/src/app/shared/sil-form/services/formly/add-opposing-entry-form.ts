import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

@Injectable({
    providedIn: 'root',
})
export class AddOpposingEntryFormFieldsService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores an instance of the formcomponent
     */
    component: any;

    /**
     * OrganisationID
     */
    organisationID: string;

    constructor(
        public auth: AuthenticationService,
        public authServ: Authorization
    ) {}

    fields() {
        return [
            {
                key: 'account_name',
                type: 'combobox',
                className: 'col-6 pe-4',
                props: {
                    label: 'Account',
                    store: 'accounts',
                    responseKey: 'results',
                    extendParams: {
                        fields: 'id,account_name,parent_account',
                        active: true,
                        page_size: 10,
                    },
                    bindLabel: [
                        {
                            key: 'account_name',
                            newline: true,
                        },
                        {
                            key: 'parent_account',
                        },
                    ],
                    bindValue: 'account_name',
                    required: true,
                    setSelectedItemToModel: true,
                },
            },
            {
                key: 'amount',
                type: 'input',
                className: 'col-6',
                props: {
                    label: 'Amount',
                    required: true,
                    type: 'number',
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
        const erpOrg = this.authServ.getErpOrganisation();
        this.organisationID = erpOrg?.organisation_id;
    }
}

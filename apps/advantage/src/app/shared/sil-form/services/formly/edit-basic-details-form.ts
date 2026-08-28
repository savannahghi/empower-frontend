import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

@Injectable({
    providedIn: 'root',
})
export class EditProfileBasicDetailsFormFieldsService {
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
        public auth: AuthenticationService,
        public authServ: Authorization
    ) {}

    /**
     * Fields loaded in the formly form
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'first_name',
                type: 'input',
                className: 'col-12 mb-4',
                props: {
                    type: 'text',
                    label: 'First Name',
                    required: true,
                },
            },
            {
                key: 'last_name',
                type: 'input',
                className: 'col-12 mb-4',
                props: {
                    type: 'text',
                    label: 'Last Name',
                    required: true,
                },
            },
            {
                key: 'other_names',
                type: 'input',
                className: 'col-12 mb-4',
                props: {
                    type: 'text',
                    label: 'Other Names',
                    required: false,
                },
            },
            {
                key: 'email',
                type: 'input',
                className: 'col-12',
                props: {
                    type: 'text',
                    label: 'Email',
                    required: true,
                },
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        const erpOrg = this.authServ.getErpOrganisation();
        this.organisationID = erpOrg?.organisation_id;
    }
}

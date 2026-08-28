import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

@Injectable({
    providedIn: 'root',
})
export class EditOpposingEntryFieldsService {
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

    constructor(public authServ: Authorization) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'account_name',
                type: 'combobox',
                className: 'col-12',
                props: {
                    label: 'Opposing Entry Account',
                    store: 'accounts',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        is_control_account: false,
                    },
                    bindLabel: [
                        {
                            key: 'account_name',
                            newLine: true,
                        },
                        {
                            key: 'parent_account',
                            class: 'fw-semibold text-muted fs-13px',
                        },
                    ],
                    bindValue: 'account_name',
                    required: true,
                    setSelectedItemToModel: true,
                },
            },
            {
                key: 'name',
                type: 'combobox',
                className: 'col-12',
                props: {
                    label: 'Currency',
                    store: 'currencys',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                    },
                    bindLabel: [
                        {
                            key: 'name',
                            newline: false,
                        },
                    ],
                    bindValue: 'id',
                    required: false,
                },
            },
            {
                key: 'line_amount',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Journal Amount',
                    required: true,
                    type: 'number',
                    store: 'accounts',
                    responseKey: 'results',
                },
            },
        ];
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;

        const erpOrg = this.authServ.getErpOrganisation();
        this.organisationID = erpOrg?.organisation_id;
    }
}

import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';

@Injectable({
    providedIn: 'root',
})
export class RecordBillItemsFormFieldsService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    /**
     * Organisation ID
     */
    organisationID: string;

    /**
     * authorization configuration
     */
    authConfig: Authorization;

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public auth: AuthenticationService,
        public authServ: Authorization,
        public uiglobals: UIRouterGlobals
    ) {
        this.authConfig = authServ;
    }

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            // Item Name
            {
                key: 'name',
                type: 'input',
                className: 'col-4 mb-4 pe-4',
                props: {
                    label: 'Enter Bill Item',
                    placeholder: 'Enter item name',
                    required: true,
                },
            },
            // Select Expense Account
            {
                key: 'expense_account',
                type: 'combobox',
                className: 'col-6 mb-4 pe-4',
                props: {
                    label: 'Select Account',
                    placeholder: 'Select Account',
                    store: 'accounts',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        organisation: this.organisationID,
                        is_control_account: false,
                    },
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                            class: 'fw-semibold',
                        },
                        {
                            key: 'parent_account',
                            newline: true,
                            class: 'text-muted',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
            },
            // Amount
            {
                key: 'new_price',
                type: 'input',
                className: 'col-2 mb-4',
                props: {
                    type: 'number',
                    label: 'Enter Amount',
                    placeholder: 'Enter Amount',
                    required: true,
                },
            },
            {
                key: 'description',
                type: 'textarea',
                className: 'col-12 mb-0',
                props: {
                    label: 'Description',
                    placeholder: 'Enter Description',
                    required: true,
                    rows: 3,
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
        this.organisationID =
            this.authConfig.getErpOrganisation()?.organisation_id;
    }
}

import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class PostNewJournalEntryFormFieldsService {
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
                key: 'transaction_date',
                type: 'datepicker',
                className: 'col-4 mb-4 pe-4',
                props: {
                    type: 'text',
                    label: 'Transaction Date',
                    required: true,
                    placeholder: 'DD-MM-YYYY',
                    max: moment().add(0, 'days'),
                },
                modelOptions: {
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'entry_type',
                type: 'select',
                defaultValue: 'cr',
                className: 'col-4 mb-4 pe-4',
                props: {
                    placeholder: 'Select entry type',
                    label: 'Select Entry Type',
                    required: true,
                    options: [
                        {
                            title: 'DEBIT',
                            value: 'dr',
                        },
                        {
                            title: 'CREDIT',
                            value: 'cr',
                        },
                    ],
                    bindValue: 'value',
                    bindLabel: 'title',
                    closeOnSelect: true,
                },
            },
            {
                key: 'account_name',
                type: 'combobox',
                className: 'col-4 mb-4',
                props: {
                    label: 'Main Entry Account',
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
                className: 'col-4 pe-4',
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
                    required: true,
                },
            },
            {
                key: 'amount',
                type: 'input',
                className: 'col-8',
                props: {
                    label: 'Journal Amount',
                    required: true,
                    type: 'number',
                },
            },
            {
                key: 'description',
                type: 'textarea',
                className: 'col-12',
                props: {
                    label: 'Description',
                    required: false,
                    placeholder:
                        'Please provide a description for this journal entry',
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

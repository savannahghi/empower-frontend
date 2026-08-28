import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';
import moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class RecordBillFormFieldsService {
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
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public auth: AuthenticationService,
        public authServ: Authorization,
        public uiglobals: UIRouterGlobals
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            // Select supplier and bill dates
            {
                template:
                    '<h6 class="mb-2 mt-2 fs-6 text-uppercase fw-light">Select Supplier</h6>',
                className: 'col-12 mb-2',
            },
            {
                key: 'supplier',
                type: 'combobox',
                className: 'col-6 mb-4 pe-4',
                props: {
                    label: 'Supplier',
                    placeholder: 'Supplier',
                    store: 'suppliers',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        orgunit_type: 'branch',
                        fields: 'id,country,partner_name,physical_address,town',
                    },
                    bindLabel: [
                        {
                            key: 'partner_name',
                            newline: true,
                            class: 'fw-semibold',
                        },
                        {
                            key: 'country',
                            newline: true,
                            class: 'fs-13 text-muted',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {},
            },
            {
                key: 'reference_number',
                type: 'input',
                className: 'col-6 mb-4 pe-sm-1',
                props: {
                    type: 'text',
                    label: 'Reference Number',
                    required: true,
                },
            },
            {
                key: 'bill_date',
                type: 'datepicker',
                className: 'col-6 mb-4 pe-4',
                props: {
                    type: 'text',
                    label: 'Bill Date',
                    dateFormat: 'DD-MM-YYYY',
                    placeholder: 'DD-MM-YYYY',
                    required: true,
                    max: moment().add(0, 'days'),
                },

                modelOptions: {
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'due_date',
                type: 'datepicker',
                className: 'col-6 mb-4 pe-4',
                props: {
                    type: 'text',
                    label: 'Due Date',
                    dateFormat: 'DD-MM-YYYY',
                    placeholder: 'DD-MM-YYYY',
                    required: true,
                },

                modelOptions: {
                    debounce: {
                        default: 2000,
                    },
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

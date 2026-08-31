import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { CreateReturnOutwardsModel } from '../../../../features/advantage/models/CreateReturnOutwardsModel.model';
import moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class RecordDirectInvoiceFormFieldsService {
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
     * record direct invoice details
     */
    recordDirectInvoiceDetails: CreateReturnOutwardsModel;

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
            {
                key: 'invoice_date',
                type: 'datepicker',
                className: 'col-12 mb-4',
                props: {
                    type: 'text',
                    label: 'Invoice Date',
                    dateFormat: 'DD-MM-YYYY',
                    placeholder: 'DD-MM-YYYY',
                    required: true,
                    max: moment().add(0, 'days'),
                },

                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'supplier',
                type: 'combobox',
                className: 'col-12 mb-4',
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
                key: 'description',
                type: 'textarea',
                className: 'col-12 mb-4',
                props: {
                    label: 'Description',
                    required: false,
                },
                expressions: {},
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

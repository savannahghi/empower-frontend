import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NewPaymentMethodModel } from '../../../../features/advantage/models/NewPaymentMethod.model';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';

@Injectable({
    providedIn: 'root',
})
export class NewReturnOutwardsFieldsService {
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
    model: NewPaymentMethodModel;

    /**
     * Organisation ID
     */
    organisationID: string;

    /**
     * Sales pricelist type
     */
    salesPricelistType = 'sales';

    paymentMethodDetails;

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public silCurrencyPipe: SilCurrencyPipe,
        public auth: AuthenticationService,
        public uiglobals: UIRouterGlobals,
        public authServ: Authorization
    ) {
        this.silCurrencyPipe = silCurrencyPipe;
    }

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */

    fields() {
        return [
            {
                key: 'operation_type',
                type: 'combobox',
                className: 'col-12 mb-4',
                props: {
                    label: 'Operation Type',
                    placeholder: 'Select or type to search',
                    store: 'inventory-operation-types',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        operation_name: 'Return Outwards',
                    },
                    bindLabel: [
                        {
                            label: 'Return Outwards',
                            newline: true,
                            class: 'fw-semibold',
                        },
                        {
                            label: 'Type',
                            key: 'operation_type',
                            newline: true,
                            class: 'fw-semibold',
                        },
                        {
                            label: 'System Operation',
                            key: 'is_system_operation',
                            newline: true,
                            class: 'fw-semibold',
                            type: 'boolean',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {},
            },
            {
                key: 'supplier',
                type: 'combobox',
                className: 'col-12 mb-4',
                props: {
                    label: 'Supplier',
                    placeholder: 'Select a supplier',
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
                            class: 'text-muted fs-13px',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
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

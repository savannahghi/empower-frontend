import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NewPaymentMethodModel } from '../../../../features/advantage/models/NewPaymentMethod.model';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { AbstractControl } from '@angular/forms';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { AsyncValidatorService } from '../../../component-services/async-validator.service';

@Injectable({
    providedIn: 'root',
})
export class NewPaymentMethodFieldsService {
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
     * Duplicate pricelist name error message
     */
    duplicatePaymentMethodMessage =
        'A Payment Method by the same name already exists. Please create one with a different name and proceed.';

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public silCurrencyPipe: SilCurrencyPipe,
        public auth: AuthenticationService,
        public uiglobals: UIRouterGlobals,
        public authServ: Authorization,
        public asyncValidatorService: AsyncValidatorService
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
                key: 'name',
                type: 'input',
                className: 'col-sm-12 col-12 pe-sm-1',
                props: {
                    placeholder: 'Enter Payment Method',
                    label: 'Name',
                    required: true,
                    prefillFields: { name: 'name' },
                },
                asyncValidators: {
                    uniqueItem: {
                        expression: (control: AbstractControl) => {
                            const stateParamsID = this.uiglobals?.params?.id;
                            const term = control?.value;
                            const params = {
                                name: term,
                                organisation: this.organisationID,
                                pricelist_type: this.salesPricelistType,
                            };

                            return this.asyncValidatorService.validateUniquenessEditMode(
                                {
                                    store: 'pricelists',
                                    stateParamsID,
                                    params,
                                }
                            );
                        },
                        message: this.duplicatePaymentMethodMessage,
                    },
                },

                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 2000,
                    },
                },
            },

            {
                key: 'account',
                type: 'combobox',
                className: 'col-12 mb-4',
                props: {
                    label: 'Account',
                    placeholder: 'Select account',
                    store: 'accounts',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        _identifiers: 'mobile+money,bank,cash',
                        is_control_account: false,
                    },
                    bindLabel: [
                        {
                            key: 'account_name',
                            newline: true,
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
                className: 'col-12',
                props: {
                    label: 'Description',
                    rows: 2,
                    required: false,
                    prefillFields: { name: 'description' },
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

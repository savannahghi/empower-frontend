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
export class NewDirectPurchaseOrderFieldsService {
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

    paymentMethodDetails;

    /**
     * Contains selected supplier id
     */
    selectedSupplierId: any;

    /**
     * Contains pricelist field
     */
    pricelistField: any;

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
                key: 'required_by',
                type: 'datepicker',
                className: 'col-12 mb-4',
                props: {
                    type: 'text',
                    label: 'Required By',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                    required: true,
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
                hooks: {
                    onInit: field => this.initializeSupplierField(field),
                },
            },
            {
                key: 'pricelist',
                type: 'select',
                className: 'col-12 mb-4',
                props: {
                    label: 'Select Pricelist',
                    placeholder: 'Select Pricelist',
                    serverSide: true,
                    options: [],
                    bindGroupLabelClass: 'd-flex flex-column',
                    bindGroupLabel: [
                        {
                            key: 'name',
                            label: 'Pricelist',
                            newline: true,
                            class: 'fw-semibold',
                        },
                        {
                            key: 'partner_name',
                            label: 'Supplier name',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                    closeOnSelect: true,
                    searchable: false,
                },
                expressions: {
                    hide: (field: FormlyFieldConfig) => {
                        return !field.model?.supplier;
                    },
                },
                hooks: {
                    onInit: field => this.initializePricelistField(field),
                },
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

    initializeSupplierField(field: any) {
        field.formControl.valueChanges.subscribe((supplierId: string) => {
            if (supplierId) {
                this.selectedSupplierId = supplierId;
                this.loadPricelistsForSupplier(supplierId);
            }
        });
    }

    initializePricelistField(field: any) {
        this.pricelistField = field;
    }

    loadPricelistsForSupplier(supplierId: string) {
        const params = {
            business_partner: supplierId,
            page_size: 20,
            pricelist_type: 'purchases',
        };
        this.dataLayer.list('pricelists', params).subscribe((data: any) => {
            if (this.pricelistField) {
                this.pricelistField.props.options = data?.results;
                this.pricelistField.formControl.setValue(null);
                this.component.cd.detectChanges();
            }
        });
    }
}

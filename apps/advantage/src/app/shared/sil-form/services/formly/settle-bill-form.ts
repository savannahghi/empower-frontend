import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { NbToastrService } from '@nebular/theme';

@Injectable({
    providedIn: 'root',
})
export class SettleBillFormFieldsService {
    /**
     * The current field configuration for the Formly form.
     */
    field: FormlyFieldConfig;

    /**
     * The component instance associated with this service.
     */
    component: any;

    /**
     * The model object that holds the form data.
     */
    model: any = {};

    /**
     * The ID of the organisation associated with the current user.
     */
    organisationID: string;

    /**
     * The ID of the supplier currently selected in the form.
     */
    selectedSupplierId: string;

    /**
     * The list of all bills fetched from the server.
     */
    bills: any[] = [];

    /**
     * The list of bills filtered by the selected supplier and formatted with labels.
     */
    onlyFilteredBills: {
        id: string;
        document_number: string;
        bill_amount_balance: number;
        has_balance: boolean;
    }[] = [];

    constructor(
        public dataLayer: SilStoresService,
        public auth: AuthenticationService,
        public authServ: Authorization,
        public uiglobals: UIRouterGlobals,
        protected toastrService: NbToastrService
    ) {}

    private fetchBills() {
        this.dataLayer.get('bills').subscribe({
            next: (response: any) => {
                this.bills = response.results || [];
            },
            error: () => {
                this.toastrService.danger('Failed to fetch bills', 'Error');
            },
        });
    }

    private getFilteredBills(supplierId: string) {
        this.fetchBills();

        const filteredBills = this.bills.filter(
            bill =>
                bill.supplier === supplierId &&
                bill.bill_amount_balance > 0 &&
                !bill.is_paid
        );

        const billsWithLabels = filteredBills.map(bill => ({
            ...bill,
            label: `${bill.document_number}\nBal: ${bill.bill_amount_balance}`,
        }));

        this.onlyFilteredBills = billsWithLabels;
        return billsWithLabels;
    }

    /**
     * Load fields in the Formly form
     */
    fields(): FormlyFieldConfig[] {
        return [
            // Select Supplier
            {
                key: 'supplier',
                type: 'combobox',
                className: 'col-4 mb-4 pe-4',
                props: {
                    label: 'Select Supplier',
                    placeholder: 'Select Supplier',
                    store: 'suppliers',
                    responseKey: 'results',
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
                hooks: {
                    onInit: field => {
                        field.options.formState.service = this;
                    },
                },
                expressions: {
                    'model.supplier': field => {
                        const supplierId = field.formControl?.value;

                        if (
                            supplierId &&
                            field.options.formState.selectedSupplierId !==
                                supplierId
                        ) {
                            field.options.formState.selectedSupplierId =
                                supplierId;

                            const billField = field.parent?.fieldGroup?.find(
                                f => f.key === 'bill'
                            );

                            if (billField) {
                                // Fetch and filter bills
                                const filteredBills =
                                    field.options.formState.service.getFilteredBills(
                                        supplierId
                                    );

                                setTimeout(() => {
                                    billField.props.options = [
                                        ...filteredBills,
                                    ];

                                    billField.formControl?.patchValue(null);
                                });
                            }
                        }
                    },
                },
            },

            // Select Bill
            {
                key: 'bill',
                type: 'select',
                className: 'col-4 mb-4 pe-4',
                defaultValue: null,
                props: {
                    label: 'Select Bill',
                    placeholder: 'Select Bill',
                    required: true,
                    options: this.onlyFilteredBills,
                    bindLabel: 'label',
                    bindValue: 'id',
                    closeOnSelect: true,
                },
                expressions: {
                    'props.disabled': field => {
                        return !field.options?.formState?.selectedSupplierId;
                    },
                },
            },

            // Payment Date
            {
                key: 'payment_date',
                type: 'datepicker',
                className: 'col-4 mb-4 pe-4',
                props: {
                    label: 'Payment Date',
                    placeholder: 'Select Payment Date',
                    required: true,
                },
            },

            // Select Bank Account
            {
                key: 'payment_method',
                type: 'combobox',
                className: 'col-4 mb-4 pe-4',
                props: {
                    placeholder: 'Select payment method...',
                    label: 'Payment method',
                    store: 'payment-methods',
                    responseKey: 'results',
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
            },

            // currency
            {
                key: 'currency',
                type: 'combobox',
                className: 'col-4 pe-4',
                props: {
                    placeholder: 'Select currency...',
                    label: 'Currency',
                    store: 'currencys',
                    responseKey: 'results',
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    'model.currency': field => {
                        if (field?.model?.currency) {
                            return field?.model?.currency;
                        }
                    },
                },
            },

            // Amount
            {
                key: 'amount',
                type: 'input',
                className: 'col-4 mb-4 pe-4',
                props: {
                    type: 'number',
                    label: 'Amount',
                    placeholder: 'Enter Amount',
                    required: true,
                },
            },
        ];
    }

    setComponent(component: any) {
        this.component = component;
        this.organisationID =
            this.authServ.getErpOrganisation()?.organisation_id;
        this.fetchBills();
    }
}

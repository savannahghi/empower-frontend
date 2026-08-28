import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import {
    catchError,
    concat,
    debounceTime,
    distinctUntilChanged,
    map,
    Observable,
    of,
    startWith,
    Subject,
    switchMap,
    tap,
} from 'rxjs';

/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the form registration service
 */
export class CreateSupplierPaymentRunFormService {
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     * Stores form data from api
     */
    model: any = {};

    /**
     * Observable that loads the sellingTaxes
     */
    invoiceObservable$: Observable<any>;

    /**
     * Subject that checks the sellingTaxes search
     */
    invoiceObservableInput$ = new Subject<string>();

    /**
     * Selected Sales Tax
     */
    selectedInvoice: any;

    /**
     * Used to control loading for search
     */
    loading: boolean = false;

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public currencyPipe: CurrencyPipe
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'business_partner',
                type: 'combobox',
                className: 'col-sm-12 col-12 pe-sm-1',
                props: {
                    placeholder: 'Enter supplier name',
                    label: 'Search for supplier',
                    store: 'suppliers',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        page_size: '10',
                    },
                    bindLabel: [
                        {
                            key: 'partner_name',
                            newline: true,
                            objectBinding: true,
                        },
                        {
                            key: 'country',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    'model.business_partner': field => {
                        if (field?.model?.business_partner) {
                            return field?.model?.business_partner;
                        }
                    },
                },
            },
            {
                key: 'invoice',
                type: 'select',
                className: 'col-sm-12 col-12 pe-sm-2 mt-2 mb-2',
                hideExpression: '!model.business_partner',
                props: {
                    store: 'purchase-invoices',
                    responseKey: 'results',
                    observableItem: true,
                    observable: this.invoiceObservable$,
                    observableInput: this.invoiceObservableInput$,
                    placeholder: 'Search for invoice',
                    model: this.selectedInvoice,
                    label: 'Purchase Invoices',
                    bindLabel: [
                        {
                            key: 'document_number',
                            newline: true,
                            class: 'fw-semibold',
                        },
                        {
                            label: 'Total amount',
                            key: 'amount',
                            newline: true,
                            class: 'text-muted fs-8',
                        },
                        {
                            label: 'Balance',
                            key: 'invoice_amount_balance',
                            newline: true,
                            class: 'text-muted fs-8',
                        },
                        {
                            label: 'Paid amount',
                            key: 'paid_invoice_amount',
                            newline: true,
                            class: 'text-muted fs-8',
                        },
                        {
                            label: 'Supplier',
                            key: 'supplier_name',
                            newline: true,
                            class: 'text-muted fs-8',
                        },
                        {
                            label: 'Status',
                            key: 'workflow_state',
                            newline: true,
                            class: 'text-muted fs-8',
                        },
                        {
                            label: 'Invoice date',
                            key: 'invoice_date',
                            type: 'date',
                            newline: true,
                            class: 'text-muted fs-8',
                        },
                    ],
                    bindValue: 'id',
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: true,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loading,
                    loadingText: 'Search for invoice..',
                    typeToSearchText: 'Please enter characters to search',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                },
                expressions: {
                    'model.invoice': () => {
                        if (this.selectedInvoice) {
                            return this.selectedInvoice;
                        }
                    },
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'reference_number',
                type: 'input',
                className: 'col-sm-12 col-12 pe-sm-1',
                props: {
                    placeholder: 'Enter Reference Number',
                    label: 'Reference Number',
                    required: false,
                },
            },
            {
                key: 'description',
                type: 'textarea',
                className: 'col-sm-12 col-12 pe-sm-1',
                props: {
                    placeholder: 'Enter Description',
                    label: 'Description',
                    required: false,
                },
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.loadInvoices();
    }

    /**
     *
     * loadInvoices
     * Loads the selling taxes using a subject and term searched by
     */
    loadInvoices() {
        this.invoiceObservable$ = concat(
            of([' ']),
            this.invoiceObservableInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapInvoicesFunction)
            )
        );
    }

    /**
     *  switchMapInvoicesFunction
     * Gets the sellingTaxes using the getInvoices function
     */
    switchMapInvoicesFunction = () =>
        this.getInvoices().pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapLoading)
        );

    /**
     * @param term
     * @returns product types
     */
    getInvoices(): Observable<any> {
        const params = {
            active: true,
            workflow_state: 'PROCESSED',
        };
        return this.dataLayer
            .list('purchase-invoices', params)
            .pipe(map(this.invoicesResponseFunction));
    }

    /**
     *  responseFunction
     * Returns the results from purchase invoices api
     */
    invoicesResponseFunction = resp => {
        function selectFewerFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const {
                id,
                document_number,
                amount,
                invoice_amount_balance,
                paid_invoice_amount,
                supplier_name,
                workflow_state,
            } = select;
            return {
                id,
                document_number,
                amount,
                invoice_amount_balance,
                paid_invoice_amount,
                supplier_name,
                workflow_state,
            };
        }
        const newArr = resp['results'].map(selectFewerFields);
        this.selectedInvoice = newArr[0].id;
        return newArr;
    };

    /**
     *  catchErrorFunction
     * Catches the error from the typeahead
     */
    catchErrorFunction = () => of([]);

    /**
     *  tapFunction
     * Shows that the typeahead is loading
     */
    tapFunction = () => (this.loading = true);

    /**
     *  tapLoading
     * Shows that the typeahead has stopped loading
     */
    tapLoading = () => (this.loading = false);
}

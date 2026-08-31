/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { concat, Observable, of, Subject } from 'rxjs';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    startWith,
    switchMap,
    tap,
} from 'rxjs/operators';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines pricelist form controls, methods
 */
export class PriceListFieldsService {
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
     * check if action is for viewing price list
     */
    view: boolean = false;

    /**
     * Observable that loads the products
     */
    products$: Observable<any>;

    /**
     * Subject that checks the product search
     */
    productsInput$ = new Subject<string>();

    /**
     * Observable that loads the products
     */
    currency$: Observable<any>;

    /**
     * Subject that checks the currency search
     */
    currencyInput$ = new Subject<string>();

    /**
     * saves default currency
     */
    defaultCurrency: any;

    /**
     * Used to control loading for search
     */
    loadingProducts: boolean;

    /**
     * Used to control loading for search
     */
    loadingCurrencies: boolean;

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
        public currencyPipe: CurrencyPipe,
        public silCurrencyPipe: SilCurrencyPipe,
        public auth: AuthenticationService,
        public authorization: Authorization
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
                key: 'product',
                type: 'select',
                hideExpression: 'model.id',
                className: 'col-sm-12 col-12 pe-sm-1',
                disabled: false,
                props: {
                    observableItem: true,
                    observable: this.products$,
                    observableInput: this.productsInput$,
                    placeholder: 'Search for product',
                    label: 'Product Search',
                    bindGroupLabel: [
                        {
                            key: 'name',
                        },
                        {
                            key: 'product_type',
                        },
                    ],
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                        {
                            key: 'quantity_at_hand',
                            label: 'Remaining Stock',
                            newline: true,
                            class: 'fs-9',
                        },
                        {
                            key: 'product_type',
                            label: 'Type',
                            class: 'fw-lighter',
                            newline: false,
                        },
                    ],
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loadingProducts,
                    loadingText: 'Searching products..',
                    typeToSearchText: 'Please enter characters to search',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                },
                expressions: {
                    'model.product': field => {
                        if (field?.model?.product) {
                            return field?.model?.product;
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
                key: 'product_name',
                type: 'input',
                hideExpression: '!model.id',
                className: 'col-sm-6 col-12 pe-sm-1 mt-2 text-muted',
                props: {
                    type: 'text',
                    label: 'Product name',
                    required: false,
                    disabled: true,
                },
                expressions: {
                    'model.product_name': field => {
                        return field?.model?.product_name;
                    },
                },
            },
            {
                key: 'currency',
                type: 'select',
                hideExpression: 'model.id',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2',
                props: {
                    observableItem: true,
                    observable: this.currency$,
                    observableInput: this.currencyInput$,
                    placeholder: 'Search for currency',
                    label: 'Currency',
                    bindGroupLabel: [
                        {
                            key: 'name',
                        },
                    ],
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                    ],
                    bindValue: 'id',
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loadingCurrencies,
                    loadingText: 'Searching currencies..',
                    typeToSearchText: 'Please enter characters to search',
                    searchable: true,
                    searchWhileComposing: false,
                    required: true,
                    virtualScroll: true,
                },
                expressions: {
                    'model.currency': field => {
                        return field.model.currency;
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
                key: 'price_inclusive_tax',
                type: 'input',
                className: 'col-sm-6 col-12 ps-sm-2 mt-2',
                props: {
                    type: 'number',
                    label: 'Price',
                    required: this.view ? false : true,
                    disabled: this.view ? true : false,
                },
                expressions: {
                    'model.price_inclusive_tax': field => {
                        this.model = field.model;
                        return field?.model?.price_inclusive_tax;
                    },
                },
                validators: {
                    price_inclusive_tax: {
                        expression: control => {
                            const number = Number(control.value);
                            const ifPositive = number >= 0;
                            return ifPositive;
                        },
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
        this.view = Array.isArray(this.component?.secondaryData)
            ? this.component.secondaryData[0]
            : false;
        this.loadProducts();
        this.loadCurrencies();
    }

    /**
     *  loadProducts
     * Loads the products using a subject and term searched by
     */
    loadProducts() {
        this.products$ = concat(
            of([' ']), // default items
            this.productsInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapProductFunction)
            )
        );
    }

    /**
     *
     * loadCurrencies
     * Loads the currencies using a subject and term searched by
     */
    loadCurrencies() {
        this.currency$ = concat(
            of([' ']),
            this.currencyInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(500),
                tap(this.tapFunction),
                switchMap(this.switchMapCurrencyFunction)
            )
        );
    }

    /**
     *  switchMapPatientFunction
     * Gets the products using the getProducts function
     */
    switchMapProductFunction = term =>
        this.getProducts(term).pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapLoading)
        );

    /**
     *
     * @param term
     * @returns products
     */
    getProducts(term: string = null): Observable<any> {
        const params = {
            search: term,
        };

        return this.dataLayer
            .list('products', params)
            .pipe(map(this.productsResponseFunction));
    }

    /**
     *
     * @param term
     * @returns currencies
     */
    getCurrencies(): Observable<any> {
        return this.dataLayer
            .list('currencys')
            .pipe(map(this.currencyResponseFunction));
    }

    /**
     *  switchMapCurrencyFunction
     * Gets the products using the getProducts function
     */

    switchMapCurrencyFunction = () =>
        this.getCurrencies().pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapLoading)
        );

    /**
     *  tapLoading
     * Shows that the typeahead has stopped loading
     */
    tapLoading = () => (this.loading = false);

    /**
     *  tapFunction
     * Shows that the typeahead is loading
     */
    tapFunction = () => (this.loading = true);

    /**
     *  catchErrorFunction
     * Catches the error from the typeahead
     */
    catchErrorFunction = () => of([]);

    /**
     *  productsResponseFunction
     * Returns the results from products api
     */
    productsResponseFunction = resp => {
        function selectFewerFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { id, name, preferred_name, code, product_type, active } =
                select;
            return { id, name, preferred_name, code, product_type, active };
        }
        const newArr = resp['results'].map(selectFewerFields);
        return newArr;
    };

    /**
     * responseFunction
     * Returns the results from currencys api
     */
    currencyResponseFunction = resp => {
        /**
         * Currency code(e.g. KES) is not given from org details, only country code (e.g. KEN)
         * But we can get the currency code from the currency pipe which
         * determines the currency code based on the country code
         * */
        const curr = this.silCurrencyPipe.transform(0); // this gets 'KES 0.00'
        const substrings = curr.split(' '); // this splits 'KES 0.00' to ['KES','0.00']
        const currencyCode = substrings[0].trim(); // gets first substring 'KES'
        function selectFewerFields(select) {
            if (select.iso_code === currencyCode) {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                const { id, name } = select;
                return { id, name };
            }
        }
        const newArr = resp['results']
            .filter(cur => cur.iso_code === currencyCode)
            .map(selectFewerFields);

        return newArr;
    };
}

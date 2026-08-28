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

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines adding products to pricelist from charge masters
 */
export class ProductFieldsService {
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
     * Observable that loads the categories
     */
    category$: Observable<any>;

    /**
     * Subject that checks the categories search
     */
    categoriesInput$ = new Subject<string>();

    /**
     * Observable that loads the sellingTaxes
     */
    sellingTax$: Observable<any>;

    /**
     * Subject that checks the sellingTaxes search
     */
    sellingTaxesInput$ = new Subject<string>();

    /**
     * Selected Sales Tax
     */
    selectedSalesTax: any;

    /**
     * Selected Purchase Tax
     */
    selectedPurchasesTax: any;

    /**
     * Selected Categories
     */
    selectedCategories: any;

    /**
     * Observable that loads the purchasingTaxes
     */
    purchasingTax$: Observable<any>;

    /**
     * Subject that checks the purchasingTaxes search
     */
    purchasingTaxesInput$ = new Subject<string>();

    /**
     * Used to control loading for search
     */
    loadingProducts: boolean;

    /**
     * Used to control loading for search
     */
    loadingCategories: boolean;

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
        public auth: AuthenticationService
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */

    fields() {
        return [
            {
                key: 'name',
                type: 'input',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2 mb-2',
                props: {
                    type: 'text',
                    placeholder: 'Enter the product name',
                    label: 'Product Name',
                    required: true,
                },
            },
            {
                key: 'product_type',
                type: 'select',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2',
                props: {
                    placeholder: 'Search for product type',
                    label: 'Product Type',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        { title: 'Service', value: 'service' },
                        { title: 'Store Keeping Unit(SKU)', value: 'sku' },
                        { title: 'Consumable', value: 'consu' },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.product_type': field => {
                        return field?.model?.product_type;
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
                key: 'categories',
                type: 'select',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2 mb-2',
                disabled: false,
                props: {
                    observableItem: true,
                    observable: this.category$,
                    observableInput: this.categoriesInput$,
                    placeholder: 'Search for product category',
                    label: 'Product Category',
                    model: this.selectedCategories,
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
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loadingCategories,
                    loadingText: 'Searching categories..',
                    typeToSearchText: 'Please enter characters to search',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    multiple: true,
                    virtualScroll: true,
                },
                expressions: {
                    'model.categories': field => {
                        return field?.model?.categories;
                    },
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 700,
                    },
                },
            },
            {
                key: 'selling_price',
                type: 'input',
                className: 'col-sm-6 col-12 mt-2',
                props: {
                    type: 'text',
                    label: 'Selling price',
                    required: true,
                    disabled: false,
                },
                expressions: {
                    'model.selling_price': field => {
                        return field?.model?.selling_price;
                    },
                },
                validators: {
                    selling_price: {
                        expression: control => {
                            const number = Number(control.value);
                            const ifPositive = number >= 0;
                            return ifPositive;
                        },
                    },
                },
            },
            {
                key: 'purchasing_price',
                type: 'input',
                className: 'hidden',
                defaultValue: 0,
                props: {
                    type: 'text',
                    label: 'Purchasing price',
                    required: false,
                    disabled: false,
                },
                expressions: {
                    'model.purchasing_price': field => {
                        return field?.model?.purchasing_price;
                    },
                },
                validators: {
                    purchasing_price: {
                        expression: control => {
                            const number = Number(control.value);
                            const ifPositive = number >= 0;
                            return ifPositive;
                        },
                    },
                },
            },
            {
                key: 'sale_taxes',
                type: 'select',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2 mb-2',
                props: {
                    responseKey: 'results',
                    observableItem: true,
                    observable: this.sellingTax$,
                    observableInput: this.sellingTaxesInput$,
                    placeholder: 'Search for sale tax',
                    model: this.selectedSalesTax,
                    label: 'Sale Tax',
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
                    multiple: true,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loading,
                    loadingText: 'Search for sale tax..',
                    typeToSearchText: 'Please enter characters to search',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                },
                expressions: {
                    'model.sale_taxes': field => {
                        if (this.selectedSalesTax) {
                            return this.selectedSalesTax;
                        }
                        return field?.model?.sale_taxes;
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
                key: 'purchase_taxes',
                type: 'select',
                className: 'col-sm-6 col-12 mt-2',
                props: {
                    observableItem: true,
                    observable: this.purchasingTax$,
                    observableInput: this.purchasingTaxesInput$,
                    placeholder: 'Search for purchase tax',
                    label: 'Purchase Tax',
                    model: this.selectedPurchasesTax,
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
                    multiple: true,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loading,
                    loadingText: 'Searching purchase tax..',
                    typeToSearchText: 'Please enter characters to search',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                },
                expressions: {
                    'model.purchase_taxes': field => {
                        if (this.selectedPurchasesTax) {
                            return this.selectedPurchasesTax;
                        }
                        return field?.model?.purchase_taxes;
                    },
                },
                modelOptions: {
                    updateOn: 'blur',
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
        this.view = this.component?.secondaryData?.[0];
        this.loadProducts();
        this.loadProductTypes();
        this.loadSellingTaxes();
        this.loadPurchasingTaxes();
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
     * loadProductTypes
     * Loads the product types using a subject and term searched by
     */
    loadProductTypes() {
        this.category$ = concat(
            of([' ']),
            this.categoriesInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapProductTypeFunction)
            )
        );
    }

    /**
     *
     * loadSellingTaxes
     * Loads the selling taxes using a subject and term searched by
     */
    loadSellingTaxes() {
        this.sellingTax$ = concat(
            of([' ']),
            this.sellingTaxesInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapSellingTaxesFunction)
            )
        );
    }

    /**
     *
     * loadPurchasingTaxes
     * Loads the purchasing taxes using a subject and term searched by
     */
    loadPurchasingTaxes() {
        this.purchasingTax$ = concat(
            of([' ']),
            this.purchasingTaxesInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapPurchasingTaxesFunction)
            )
        );
    }

    /**
     *  switchMapProductFunction
     * Gets the products using the getProducts function
     */
    switchMapProductFunction = term =>
        this.getProducts(term).pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapLoading)
        );

    /**
     *  switchMapSellingTaxesFunction
     * Gets the sellingTaxes using the getSellingTaxes function
     */
    switchMapSellingTaxesFunction = () =>
        this.getSellingTaxes().pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapLoading)
        );

    /**
     *  switchMapPurchasingTaxesFunction
     * Gets the purchasingTaxes using the getPurchasingTaxes function
     */
    switchMapPurchasingTaxesFunction = () =>
        this.getPurchasingTaxes().pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapLoading)
        );

    /**
     *  switchMapProductTypeFunction
     * Gets the products using the getProducts function
     */
    switchMapProductTypeFunction = term =>
        this.getProductTypes(term).pipe(
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
            active: true,
            fields: 'id,slade_code,preferred_term,category_name',
            search: term,
        };

        return this.dataLayer
            .list('chargemaster-products', params)
            .pipe(map(this.productsResponseFunction));
    }

    /**
     * @param term
     * @returns product types
     */
    getSellingTaxes(): Observable<any> {
        const params = {
            active: true,
        };
        return this.dataLayer
            .list('sales-taxes', params)
            .pipe(map(this.sellingTaxesResponseFunction));
    }

    /**
     * @param term
     * @returns product types
     */
    getPurchasingTaxes(): Observable<any> {
        const params = {
            active: true,
        };
        return this.dataLayer
            .list('purchases-taxes', params)
            .pipe(map(this.purchasingTaxesResponseFunction));
    }

    /**
     *
     * @param term
     * @returns product types
     */
    getProductTypes(term: string = null): Observable<any> {
        const params = {
            active: true,
            search: term,
        };
        return this.dataLayer
            .list('product-categories', params)
            .pipe(map(this.productTypesResponseFunction));
    }

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
            const { id, preferred_term, slade_code } = select;
            return { id, preferred_term, slade_code };
        }
        const newArr = resp['results'].map(selectFewerFields);
        return newArr;
    };

    /**
     *  responseFunction
     * Returns the results from productTypes api
     */
    productTypesResponseFunction = resp => {
        function selectFewerFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { id, name, costing_method } = select;
            return { id, name, costing_method };
        }
        const newArr = resp['results'].map(selectFewerFields);
        this.selectedCategories = newArr;
        return newArr;
    };

    /**
     *  responseFunction
     * Returns the results from selling taxes api
     */
    sellingTaxesResponseFunction = resp => {
        function selectFewerFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { id, name } = select;
            return { id, name };
        }
        const newArr = resp['results'].map(selectFewerFields);
        this.selectedSalesTax = newArr[0].id;
        return newArr;
    };

    /**
     *  responseFunction
     * Returns the results from selling taxes api
     */
    purchasingTaxesResponseFunction = resp => {
        function selectFewerFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { id, name } = select;
            return { id, name };
        }
        const newArr = resp['results'].map(selectFewerFields);
        this.selectedPurchasesTax = newArr[0].id;
        return newArr;
    };
}

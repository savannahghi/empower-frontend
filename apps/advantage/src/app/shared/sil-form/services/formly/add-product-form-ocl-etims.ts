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
import countries from './../../../../../assets/data/countries.json';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines adding products to pricelist from charge masters
 */
export class OclEtimsProductFieldsService {
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
     * fetched Products
     */
    fetchedProducts: any;

    /**
     * Selected Product
     */
    selectedProduct: any;

    /**
     * Selected identifiers
     */
    productIdentifiers = [];

    /**
     * Stores countries with ISO codes
     */
    countriesList: Array<{ title: string; value: string }>;

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
     * Source param
     */
    source: string;

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public currencyPipe: CurrencyPipe,
        public auth: AuthenticationService
    ) {}

    private unsubscribe$ = new Subject<void>();

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */

    fields() {
        return [
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
                        if (field.model.product_type === 'service') {
                            this.source = 'KNC4Investigations';
                        } else {
                            this.source = 'KNC4Drugs';
                        }
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
                key: 'product',
                type: 'select',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2 mb-2',
                props: {
                    observableItem: true,
                    observable: this.products$,
                    observableInput: this.productsInput$,
                    placeholder: 'Search for product',
                    label: 'Product Name',
                    model: this.fetchedProducts,
                    bindGroupLabel: [
                        {
                            key: 'display_name',
                        },
                        {
                            key: 'concept_class',
                        },
                        {
                            key: 'slade_code',
                        },
                    ],
                    bindLabel: [
                        {
                            key: 'display_name',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                        {
                            key: 'concept_class',
                            label: 'Class',
                            newline: true,
                            class: '',
                        },
                    ],
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loading,
                    loadingText: 'Searching products...',
                    typeToSearchText: 'Please enter characters to search',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    multiple: false,
                    virtualScroll: true,
                },
                expressions: {
                    'props.disabled': '!model.product_type',
                    'model.identifiers': field => {
                        this.fetchProductIdentifiers(field.model.product);
                        return this.productIdentifiers;
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
                type: 'repeat',
                key: 'identifiers',
                className: 'col-12',
                fieldArray: {
                    fieldGroupClassName: 'col-12 m-0 col-sm-6 pe-sm-2',
                    props: {
                        btnText: 'Add Product Identifier',
                        min: 1,
                        model: [],
                    },
                    fieldGroup: [
                        {
                            key: 'identifier_type',
                            type: 'select',
                            className: 'col-sm-6 col-12 pe-sm-2',
                            props: {
                                placeholder: 'Select identifier type',
                                label: 'Identifier Type',
                                bindLabel: 'title',
                                bindValue: 'value',
                                options: [
                                    {
                                        title: 'APID',
                                        value: 'APID',
                                    },
                                    {
                                        title: 'CM Code',
                                        value: 'CM_CODE',
                                    },
                                    {
                                        title: 'HS Code',
                                        value: 'HS_CODE',
                                    },
                                    {
                                        title: 'GTIN',
                                        value: 'GTIN',
                                    },
                                    {
                                        title: 'KNC',
                                        value: 'KNC',
                                    },
                                    {
                                        title: 'LOINC Code',
                                        value: 'LOINC_CODE',
                                    },
                                    {
                                        title: 'VPID',
                                        value: 'VPID',
                                    },
                                ],
                                searchable: false,
                                closeOnSelect: true,
                            },
                            expressions: {
                                'model.identifier_value': field => {
                                    if (
                                        !field.model?.identifier_type &&
                                        !this.productIdentifiers[0]
                                            ?.identifier_value
                                    ) {
                                        return '';
                                    } else {
                                        return field.model.identifier_value;
                                    }
                                },
                                'model.identifier_type': field => {
                                    return field?.model?.identifier_type;
                                },
                            },
                            modelOptions: {
                                updateOn: 'blur',
                                debounce: {
                                    default: 100,
                                },
                            },
                        },
                        {
                            key: 'identifier_value',
                            type: 'input',
                            className: 'col-sm-6 col-12 pe-sm-2 ',
                            props: {
                                label: 'Identifier',
                                placeholder: 'Enter identifier value',
                                type: 'text',
                            },
                            modelOptions: {
                                updateOn: 'blur',
                                debounce: {
                                    default: 500,
                                },
                            },
                        },
                    ],
                },
            },

            {
                key: 'scu_item_classification',
                type: 'combobox',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2 mb-2',
                props: {
                    store: 'item-classifications',
                    responseKey: 'results',
                    placeholder: 'Select the classification of item',
                    label: 'Item Classification',
                    bindLabel: [
                        {
                            key: 'classification_name',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                        {
                            key: 'classification_code',
                            label: 'Code',
                            class: '',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    'model.scu_item_classification': field => {
                        return field?.model?.scu_item_classification;
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
                key: 'item_type',
                type: 'select',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2 mb-2',
                props: {
                    placeholder: 'Select the type of item',
                    label: 'Item Type',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        { title: 'Raw Material', value: '1' },
                        { title: 'Finished Product', value: '2' },
                        { title: 'Service', value: '3' },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.item_type': field => {
                        return field?.model?.item_type;
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
                type: 'combobox',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2 mb-2',
                disabled: false,
                props: {
                    store: 'product-categories',
                    responseKey: 'results',
                    placeholder: 'Search for product category',
                    label: 'Product Category',
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    'model.categories': field => {
                        const id = field?.defaultValue?.[0];
                        return id || null;
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
                key: 'packaging_unit',
                type: 'combobox',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2 mb-2',
                props: {
                    store: 'packaging-units',
                    responseKey: 'results',
                    placeholder: 'Select the packaging unit',
                    label: 'Packaging Unit',
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                    ],
                    bindValue: 'id',
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
                key: 'quantity_unit',
                type: 'combobox',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2 mb-2',
                props: {
                    store: 'unit-measure',
                    responseKey: 'results',
                    placeholder: 'Search for the unit of measure',
                    label: 'Unit of Measure',
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                        {
                            key: 'code',
                            label: 'Code',
                            class: '',
                            newline: true,
                        },
                    ],

                    bindValue: 'id',
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
                key: 'selling_price',
                type: 'input',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2',
                props: {
                    placeholder: 'Enter the selling price',
                    label: 'Selling Price',
                    searchable: false,
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
                key: 'sale_taxes',
                type: 'combobox',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2 mb-2',
                props: {
                    store: 'taxes',
                    responseKey: 'results',
                    placeholder: 'Select the sales tax',
                    label: 'Tax Type',
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    'model.sale_taxes': field => {
                        const id = field?.defaultValue?.[0];
                        return id || null;
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
                key: 'country_of_origin',
                type: 'select',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2 mb-2',
                props: {
                    placeholder: 'Select the country origin',
                    label: 'Country',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: this.countriesList,
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.country_of_origin': field => {
                        return field?.model?.country_of_origin;
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
                key: 'purchasing_price',
                type: 'input',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2 mb-2',
                props: {
                    placeholder: 'Enter the purchasing price',
                    label: 'Purchasing price',
                    searchable: false,
                    required: true,
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
                expressions: {
                    'model.selling_price': field => {
                        return field?.model?.selling_price;
                    },
                },
            },
            {
                key: 'purchasing_price',
                type: 'input',
                className: 'hidden',
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
                className: 'hidden',
                props: {
                    store: 'taxes',
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
                    multiple: false,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loading,
                    loadingText: 'Search for sale tax..',
                    typeToSearchText: 'Please enter characters to search',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: false,
                    virtualScroll: true,
                },
                expressions: {
                    'model.sale_taxes': field => {
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
                type: 'combobox',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2 mb-2',
                props: {
                    store: 'taxes',
                    responseKey: 'results',
                    placeholder: 'Select the purchase tax',
                    label: 'Purchase Type',
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },

                expressions: {
                    'model.purchase_taxes': field => {
                        const id = field?.defaultValue?.[0];
                        return id || null;
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
        this.view = this.component?.secondaryData[0];
        this.loadProducts();
        this.loadSellingTaxes();
        this.loadPurchasingTaxes();
        this.formatCountries();
    }

    /**
     * Format imported countries
     */
    formatCountries() {
        this.countriesList = countries.map(country => {
            return {
                title: country.country,
                value: country.code,
            };
        });
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
     *
     * @param term
     * @returns products
     */
    getProducts(term: string = null): Observable<any> {
        const params = {
            source: !this.source ? 'KNC4Drugs' : this.source,
            q: !term ? '' : term,
            verbose: true,
        };

        return this.dataLayer
            .list('ocl-concepts', params)
            .pipe(map(this.productsResponseFunction));
    }

    /**
     * @param term
     * @returns product types
     */
    getSellingTaxes(): Observable<any> {
        const params = {
            active: true,
            percentage: 0,
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
            percentage: 0,
        };
        return this.dataLayer
            .list('purchases-taxes', params)
            .pipe(map(this.purchasingTaxesResponseFunction));
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
            const { id, display_name, concept_class, extras } = select;
            return { id, display_name, concept_class, extras };
        }
        const newArr = resp['data'].map(selectFewerFields);
        this.fetchedProducts = newArr;
        return newArr;
    };

    /**
     *  responseFunction
     * Returns the results from productTypes api
     */
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

    /**
     * Fetches the procuct identifiers and returns
     * the identifier_type and identifier_value fields
     */
    fetchProductIdentifiers = product => {
        this.productIdentifiers = [];
        const oclIdentifiers = product?.extras?.identifiers;
        const nestedData = product?.extras?.nested;

        if (product?.id) {
            const obj = {
                identifier_type: 'KNC',
                identifier_value: product?.id,
            };
            this.productIdentifiers.push(obj);
        }

        if (Array.isArray(oclIdentifiers)) {
            oclIdentifiers.forEach(identifier => {
                const obj = Object.assign(
                    {},
                    {
                        identifier_type: identifier.type ? identifier.type : '',
                        identifier_value: identifier.value
                            ? identifier.value
                            : '',
                    }
                );
                this.productIdentifiers.push(obj);
            });
        }

        if (Array.isArray(nestedData)) {
            nestedData.forEach(mapping => {
                if ('loinc_mapping' in mapping) {
                    const obj = Object.assign(
                        {},
                        {
                            identifier_type: 'LOINC_CODE',
                            identifier_value: mapping.loinc_mapping.loinc_num,
                        }
                    );
                    this.productIdentifiers.push(obj);
                }
            });
        }
        return this.productIdentifiers;
    };
}

/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BehaviorSubject, concat, Observable, of, Subject } from 'rxjs';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    startWith,
    switchMap,
    tap,
    filter,
} from 'rxjs/operators';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import _ from 'underscore';
import { StateService } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines billing form controls, methods
 */
export class BillItemFieldsService {
    /**
     * Observable that loads the products
     */
    products$: Observable<any>;

    /**
     * Stores the selected pricelist id
     */
    selectedPricelist$ = new BehaviorSubject<string | null>(null);

    /**
     * Subject that checks the product search
     */
    productsInput$ = new Subject<string>();
    /**
     * Used to control loading for search
     */
    loading: boolean = false;
    /**
     * Stores the search term
     */
    term: string;
    /**
     * Displays different combobox based on organisation settings
     */
    multipleBillingPoints: boolean;
    /**
     * service request name to be used as a query param
     */
    serviceRequestName: any;
    /**
     * Stores instance of the form component
     */
    component: any;
    /**
     * Stores the form model data
     */
    model: Object;

    /**
     * Contains organisation setting for allowing discount
     */
    disallowDiscount: boolean;

    items: any[] = [];

    /**
     * Stores the selected pricelist id
     */
    onlyFilteredItems: any[] = [];

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public currencyPipe: CurrencyPipe,
        public auth: AuthenticationService,
        public authorization: Authorization,
        private $state: StateService
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        const workstation = this.authorization.getWorkstation?.();
        const locationId = workstation.workstation__org_unit__parent;
        return [
            {
                key: 'pricelists',
                type: 'combobox',
                className: 'col-12 mb-2',
                props: {
                    label: 'Pricelist',
                    placeholder: 'Select pricelist',
                    store: 'pricelists',
                    responseKey: 'results',
                    modifyItemNotFound: true,
                    buttonText: 'Add New Pricelist',
                    buttonEvent: () => {
                        window.open(
                            '/advantage/settings/pricelists/new_sales_pricelist?step=0',
                            '_blank'
                        );
                    },
                    bindLabel: [
                        { key: 'name', class: 'fw-bold', newline: true },
                        {
                            key: 'description',
                            label: 'Description',
                            class: 'fw-lighter',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                    extendParams: {
                        location_id: locationId,
                        pricelist_type: 'sales',
                        fields: 'id,name,description',
                    },
                },
                expressionProperties: {
                    'props.disabled': 'model.id',
                },
                hooks: {
                    onInit: field => {
                        field.options.formState.service = this;
                    },
                },
                expressions: {
                    'model.pricelists': field => {
                        const pricelistId =
                            field.formControl?.value?.id ||
                            field.formControl?.value;

                        if (!pricelistId) {
                            if (field.model && field.model.pricelist_products) {
                                field.model.pricelist_products = null;
                            }
                            const form = field.form;
                            if (form && form.get('pricelist_products')) {
                                form.get('pricelist_products').setValue(null);
                                const itemField =
                                    form.get('pricelist_products');
                                if (
                                    itemField &&
                                    itemField.field &&
                                    itemField.field.props
                                ) {
                                    itemField.field.props.options = [];
                                }
                            }
                            return;
                        }

                        if (
                            field.options.formState.selectedPricelistId !==
                            pricelistId
                        ) {
                            field.options.formState.selectedPricelistId =
                                pricelistId;

                            const form = field.form;
                            if (form && form.get('pricelist_products')) {
                                form.get('pricelist_products').setValue(null);
                                const itemField =
                                    form.get('pricelist_products');
                                if (
                                    itemField &&
                                    itemField.field &&
                                    itemField.field.props
                                ) {
                                    itemField.field.props.options = [];
                                }
                            }
                            if (field.model && field.model.pricelist_products) {
                                field.model.pricelist_products = null;
                            }

                            field.options.formState.service.selectedPricelist$.next(
                                pricelistId
                            );
                            field.options.formState.service.loadOnlyProducts();
                        }
                    },
                },
            },

            {
                key: 'pricelist_products',
                type: 'select',
                hideExpression: !this.multipleBillingPoints,
                className: 'col-12 col-sm-6 pe-sm-1',
                props: {
                    observableItem: true,
                    observable: this.products$,
                    observableInput: this.productsInput$,
                    placeholder: 'Search for items or services',
                    label: 'Item / Service',
                    bindGroupLabel: [
                        {
                            key: 'name',
                        },
                        {
                            key: 'type',
                        },
                    ],
                    bindLabel: [
                        {
                            key: 'name',
                            class: 'd-inline-block text-wrap',
                            style: 'max-width: 70%; word-wrap: break-word; white-space: normal; line-height: 1.2; vertical-align: top;',
                        },
                        {
                            key: 'unit_price',
                            type: 'currency',
                            class: 'd-inline-block float-end',
                            style: 'max-width: 25%; vertical-align: top;',
                        },
                        {
                            key: 'pricelist_name',
                            label: 'Pricelist',
                            class: 'fw-lighter',
                            newline: true,
                        },
                        {
                            key: 'display_quantity',
                            hideExpression: item => !item.display_quantity,
                            newline: true,
                            class: 'display_quantity_class',
                            style: 'font-size: 0.875rem; margin-top: 2px;',
                        },
                    ],
                    groupBy: 'pricelist_products',
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loading,
                    loadingText: 'Searching...',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                    modifyItemNotFound: true,
                    buttonText: 'Add New Item',
                    buttonEvent: () => {
                        this.component.refresh?.emit();
                    },
                    expressionProperties: {
                        'props.disabled': model =>
                            !this.isPricelistSelected(model),
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
                key: 'pricelist_products',
                type: 'select',
                hideExpression: () => {
                    return this.multipleBillingPoints || this.model?.['id'];
                },
                className: 'col-12 col-sm-6 pe-sm-1',
                props: {
                    observableItem: true,
                    observableInput: this.productsInput$,
                    placeholder: 'Search for items or services',
                    label: 'Item / Service',
                    bindGroupLabel: [
                        {
                            key: 'product_name',
                        },
                        {
                            key: 'type',
                        },
                    ],
                    bindLabel: [
                        {
                            key: 'product_name',
                            class: 'd-inline-block text-wrap',
                            style: 'max-width: 50%; word-wrap: break-word; white-space: normal; line-height: 1.2; vertical-align: top;',
                        },
                        {
                            key: 'price_inclusive_tax',
                            type: 'currency',
                            class: 'd-inline-block float-end',
                            style: 'max-width: 25%; vertical-align: top;',
                        },
                        {
                            key: 'display_quantity',
                            hideExpression: item => !item.display_quantity,
                            newline: true,
                            class: 'display_quantity_class',
                            style: 'font-size: 0.875rem; margin-top: 2px;',
                        },
                    ],
                    groupBy: 'pricelist_products',
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loading,
                    loadingText: 'Searching...',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                    modifyItemNotFound: true,
                    buttonText: 'Add New Item',
                    buttonEvent: () => {
                        this.component.refresh?.emit();
                    },
                },
                hooks: {
                    onInit: field => {
                        field.props.observable = this.products$;
                    },
                },
                expressionProperties: {
                    'props.disabled': model => !this.isPricelistSelected(model),
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },

            {
                key: 'name',
                type: 'input',
                hideExpression: '!model.id',
                className: 'col-12 col-sm-6 pe-sm-1',
                props: {
                    type: 'text',
                    label: 'Item',
                    disabled: true,
                },
            },
            {
                key: 'price',
                type: 'input',
                hideExpression: !this.auth.checkPermission(
                    'advantage.billed_item_override_price'
                ),
                className: 'col-sm-4 col-12 pe-sm-1',
                props: {
                    type: 'number',
                    label: 'Adjusted Price',
                    required: true,
                },
                expressions: {
                    'model.price': field => {
                        this.model = field.model;

                        if (
                            field.model.pricelist_products &&
                            field.model.pricelist_products.unit_price
                        ) {
                            if (field.formControl.pristine === false) {
                                // User changed the adjusted price manually
                                const originalPrice =
                                    field.model.pricelist_products.unit_price;
                                const adjustedPrice = field.model.price;
                                const discountPercentage =
                                    ((originalPrice - adjustedPrice) /
                                        originalPrice) *
                                    100;
                                const discountControl =
                                    field.form.get('discount');
                                if (discountControl) {
                                    discountControl.setValue(
                                        discountPercentage,
                                        { emitEvent: false }
                                    );
                                    discountControl.markAsPristine();
                                }
                                field.formControl.markAsPristine();
                                return field.model.price;
                            } else {
                                if (
                                    field.model.discount_type === 'amount' &&
                                    field.model.discount_amount != null &&
                                    !isNaN(field.model.discount_amount)
                                ) {
                                    const originalPrice =
                                        field.model.pricelist_products
                                            .unit_price;
                                    const discountAmount = Number(
                                        field.model.discount_amount
                                    );
                                    const adjustedPrice = Math.max(
                                        0,
                                        originalPrice - discountAmount
                                    );
                                    if (
                                        field.formControl.value !==
                                        adjustedPrice
                                    ) {
                                        field.formControl.setValue(
                                            adjustedPrice,
                                            { emitEvent: false }
                                        );
                                    }
                                    return adjustedPrice;
                                }

                                if (
                                    field.model.discount &&
                                    !isNaN(field.model.discount)
                                ) {
                                    const discountPercentage =
                                        field.model.discount / 100;
                                    const originalPrice =
                                        field.model.pricelist_products
                                            .unit_price;
                                    const adjustedPrice =
                                        originalPrice -
                                        originalPrice * discountPercentage;
                                    const roundedAdjustedPrice =
                                        Math.round(adjustedPrice * 10000) /
                                        10000;
                                    field.formControl.setValue(
                                        roundedAdjustedPrice,
                                        { emitEvent: false }
                                    );
                                    return roundedAdjustedPrice;
                                }
                            }
                        }

                        if (
                            field.model.pricelist_products &&
                            field.model.pricelist_products.price
                        ) {
                            return field.model.pricelist_products.price;
                        }

                        if (
                            field.model.pricelist_products &&
                            field.model.pricelist_products.unit_price !==
                                null &&
                            field.formControl.pristine &&
                            field.model.waive_item !== 'true' &&
                            field.model.price !== 0
                        ) {
                            field.formControl.setValue(
                                field.model.pricelist_products.unit_price
                            );
                            field.formControl.value =
                                field.model.pricelist_products.unit_price;
                            return field.model.pricelist_products.unit_price;
                        } else if (field.model.waive_item === 'true') {
                            field.formControl.setValue(0);
                            field.formControl.value = 0;
                            return 0;
                        } else {
                            return field.model.price;
                        }
                    },
                },
                validators: {
                    price: {
                        expression: (control, field) => {
                            const number = parseFloat(control.value);

                            const ifPositive = number >= 0;
                            if (field?.model?.pricelist_products?.unit_price) {
                                const times10 =
                                    field.model.pricelist_products.unit_price *
                                    10;
                                return ifPositive && number <= times10;
                            } else {
                                return ifPositive;
                            }
                        },
                    },
                },
            },

            {
                key: 'unadjusted_price',
                type: 'input',
                hideExpression: this.auth.checkPermission(
                    'advantage.billed_item_override_price'
                ),
                className: 'col-sm-4 col-12 pe-sm-1',
                props: {
                    type: 'number',
                    label: 'Price',
                    required: true,
                    disabled: true,
                },
                expressions: {
                    'model.unadjusted_price': field => {
                        this.model = field.model;
                        if (
                            field.model.pricelist_products &&
                            field.model.pricelist_products.unit_price !==
                                null &&
                            field.formControl.pristine
                        ) {
                            field.formControl.setValue(
                                field.model.pricelist_products.unit_price
                            );
                            field.formControl.value =
                                field.model.pricelist_products.unit_price;
                            return field.model.pricelist_products.unit_price;
                        } else {
                            return field.model.price;
                        }
                    },
                },
            },
            {
                key: 'quantity',
                type: 'input',
                defaultValue: 1,
                className: 'col-sm-2 col-12',
                props: {
                    type: 'number',
                    label: 'Quantity',
                },
            },
            {
                key: 'discount_placeholder',
                type: 'input',
                className: 'col-sm-6 d-sm-block',
                props: {
                    type: 'hidden',
                    label: '',
                    disabled: true,
                },
                hideExpression: false,
            },
            {
                key: 'discount_type',
                type: 'select',
                className: 'col-sm-4 pe-sm-1',
                hideExpression: this.disallowDiscount,
                defaultValue: 'amount',
                props: {
                    label: 'Discount Type',
                    placeholder: 'Select Discount Type',
                    bindValue: 'value',
                    bindLabel: 'label',
                    options: [
                        { value: 'percent', label: 'Percentage' },
                        { value: 'amount', label: 'Amount' },
                    ],
                },
            },
            {
                key: 'discount',
                type: 'input',
                className: 'col-sm-2',
                hideExpression: model =>
                    this.disallowDiscount || model.discount_type === 'amount',
                props: {
                    type: 'number',
                    label: 'Discount(%)',
                    min: 0,
                    max: 100,
                },
                expressions: {
                    'model.discount': field => {
                        if (
                            field.model.pricelist_products &&
                            field.model.pricelist_products.unit_price
                        ) {
                            const originalPrice =
                                field.model.pricelist_products.unit_price;

                            if (field.formControl.pristine === false) {
                                return field.formControl.value;
                            } else {
                                const adjustedPrice = parseFloat(
                                    field.model.price
                                );
                                const discountPercentage =
                                    ((originalPrice - adjustedPrice) /
                                        originalPrice) *
                                    100;

                                field.formControl.setValue(discountPercentage, {
                                    emitEvent: false,
                                });
                                return discountPercentage;
                            }
                        }
                    },
                },
            },
            {
                key: 'discount_amount',
                type: 'input',
                className: 'col-sm-2',
                hideExpression: model =>
                    this.disallowDiscount || model.discount_type !== 'amount',
                props: {
                    type: 'number',
                    label: 'Discount Amount',
                    min: 0,
                },
                expressions: {
                    'model.discount_amount': field => {
                        const model = field.model;
                        if (
                            model.discount_type === 'amount' &&
                            model.pricelist_products &&
                            model.pricelist_products.unit_price != null &&
                            model.discount_amount != null &&
                            !isNaN(model.discount_amount)
                        ) {
                            const adjustedPrice = Math.max(
                                0,
                                model.pricelist_products.unit_price -
                                    Number(model.discount_amount)
                            );
                            if (model.price !== adjustedPrice) {
                                model.price = adjustedPrice;
                            }
                            return model.discount_amount;
                        }
                        return model.discount_amount;
                    },
                },
            },
            {
                key: 'allow_discount',
                type: 'checkbox',
                className: 'col-12 row ms-1 mb-3 mt-2',
                hideExpression: !this.disallowDiscount,
                defaultValue: this.disallowDiscount,
                props: {
                    label: 'Allow discount application',
                },
            },
            {
                key: 'pricelist_product',
                type: 'input',
                className: 'hidden',
                props: {
                    type: 'text',
                    label: 'pricelist_product',
                },
                expressions: {
                    'model.pricelist_product': field => {
                        if (
                            field.model.pricelist_products &&
                            field.model.pricelist_products
                                .pricelist_product_id &&
                            field.formControl.pristine
                        ) {
                            field.formControl.setValue(
                                field.model.pricelist_products
                                    .pricelist_product_id
                            );
                            field.formControl.value =
                                field.model.pricelist_products.pricelist_product_id;
                            return field.model.pricelist_products
                                .pricelist_product_id;
                        } else {
                            return field.model.pricelist_product;
                        }
                    },
                },
            },
            {
                className: 'col-12 row p-0 ms-3',
                hideExpression: this.disallowDiscount,
                expressionProperties: {
                    template: model => {
                        if (
                            !model.pricelist_products ||
                            !model.price ||
                            !model.pricelist_products.unit_price
                        ) {
                            return;
                        }
                        const template =
                            `<div class="row col-12 margin-r-3px">
                        <div class="col-sm-4 pe-sm-1">
                        </div>
                        <div *ngIf="model.pricelist_products" class="col-sm-4 text-end col-12 pe-sm-1">
                            Unit Price <br> ${this.transformMoney(
                                model.pricelist_products.unit_price
                            )}
                        </div>
                        <div class="col-sm-4 text-end col-12 pe-0">
                            <span>` +
                            this.getMarkupDiscountString(model) +
                            `</span>
                            <br>
                            <span class="fw-semibold ${this.flagDiscountOrMarkup(
                                model
                            )}">` +
                            this.getMarkupDiscountCash(model) +
                            `</span>
                        </div>
                        <div class="col-sm-4 pe-sm-1"></div>
                        </div>
                        <div class="col-12 row text-end margin-r-3px">
                            <div class="mt-3 fs-13">
                            Total <br> <span class="fw-semibold mt-1">` +
                            this.transformMoney(
                                this.model['price'] * this.model['quantity']
                            ) +
                            `</span>
                            </div>
                        </div>
                    </div>`;
                        return template;
                    },
                },
            },
            {
                key: 'original_price',
                type: 'input',
                className: 'hidden',
                props: {
                    type: 'text',
                    label: 'original_price',
                },
                expressions: {
                    'model.original_price': field => {
                        this.model = field.model;
                        if (
                            field.model.pricelist_products &&
                            field.model.pricelist_products
                                .pricelist_product_id &&
                            field.formControl.pristine
                        ) {
                            field.formControl.setValue(
                                field.model.pricelist_products.unit_price
                            );
                            field.formControl.value =
                                field.model.pricelist_products.unit_price;
                            return field.model.pricelist_products.unit_price;
                        }
                    },
                },
            },
            {
                key: 'waive_item',
                type: 'formaction',
                hideExpression: () => {
                    return !this.model?.['original_price'];
                },
                props: {
                    buttonType: 'submit',
                    className: 'mb-3',
                    buttonText: 'Waive Item',
                    tooltip: 'Set the item to Ksh 0',
                    permission: 'advantage.billed_item_override_price',
                },
                expressions: {
                    'model.waive_item': field => {
                        this.model = field.model;
                        if (field.model.waive_item === 'true') {
                            setTimeout(() => {
                                field.formControl.setValue(undefined);
                                field.formControl.value = undefined;
                                return undefined;
                            }, 1000);
                        }
                    },
                },
            },
        ];
    }

    getMarkupDiscountCash(model) {
        let value =
            model['pricelist_products']['unit_price'] * model['quantity'] -
            model['price'] * model['quantity'];
        if (value < 0) {
            value = value * -1;
        }
        const code = this.getDefaultCurrency();
        return this.currencyPipe.transform(value, `${code} `);
    }

    getDefaultCurrency() {
        const curr = JSON.parse(localStorage.getItem('defaultCurrency'));
        return `${curr.iso_code}`;
    }

    getMarkupDiscountString(model) {
        const value =
            model['pricelist_products']['unit_price'] * model['quantity'] -
            model['price'] * model['quantity'];
        if (value === 0) {
            return 'Discount ';
        } else if (value > 0) {
            return 'Discount';
        } else {
            return 'Markup';
        }
    }

    flagDiscountOrMarkup(model) {
        const string = this.getMarkupDiscountString(model);
        let className = '';
        switch (string) {
            case 'Discount ':
                className = 'text-success';
                break;
            case 'Discount':
                className = 'text-prim';
                break;
            default:
                className = 'text-danger';
                break;
        }
        return className;
    }

    transformMoney(money) {
        const code = this.getDefaultCurrency();
        return this.currencyPipe.transform(money, `${code} `);
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.multipleBillingPoints = this.auth.checkSetting(
            'billing:multiple_billing_points'
        );

        if (this.multipleBillingPoints) {
            this.loadProducts();
        } else {
            if (!this.products$) {
                this.products$ = this.selectedPricelist$.pipe(
                    filter(pricelistId => !!pricelistId),
                    switchMap(pricelistId =>
                        this.productsInput$.pipe(
                            startWith(''),
                            distinctUntilChanged(),
                            debounceTime(800),
                            tap(this.tapFunction),
                            switchMap(term =>
                                this.getOnlyProducts(term, pricelistId)
                            ),
                            tap(this.tapFunctionLoading)
                        )
                    )
                );
            }
        }

        // Safely access secondaryData[3] if it exists
        this.disallowDiscount =
            this.component.secondaryData &&
            Array.isArray(this.component.secondaryData) &&
            this.component.secondaryData.length > 3
                ? this.component.secondaryData[3]['value']
                : false;

        if (!this.component.model) this.component.model = {};
        if (!('discount_type' in this.component.model)) {
            this.component.model.discount_type = 'amount';
        }
    }

    /**
     *  tapFunction
     * Shows that the typeahead is loading
     */
    tapFunction = () => (this.loading = true);

    /**
     *  tapFunctionLoading
     * Shows that the typeahead has stopped loading
     */
    tapFunctionLoading = () => (this.loading = false);

    /**
     *  catchErrorFunction
     * Catches the error from the typeahead
     */
    catchErrorFunction = () => of([]);

    /**
     *  switchMapProductFunction
     * Gets the products using the getProducts function
     */
    switchMapProductFunction = term =>
        this.getProducts(term).pipe(
            catchError(this.catchErrorFunction),
            tap(this.tapFunctionLoading)
        );

    /**
     *  switchMapOnlyProductFunction
     * Gets the products using the getOnlyProducts function
     */
    switchMapOnlyProductFunction = term => {
        const pricelistId =
            this.component?.model?.pricelists?.id ||
            this.component?.model?.pricelists;
        return this.getOnlyProducts(term, pricelistId).pipe(
            catchError(this.catchErrorFunction),
            tap(this.tapFunctionLoading)
        );
    };

    /**
     *  loadProducts
     * Loads the products using a subject and term searched by
     */
    loadProducts() {
        this.products$ = concat(
            of([' ']),
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
     *  loadOnlyProducts
     * Triggers a refresh of the products observable by emitting a new search term.
     * The observable pipeline is now set up in setComponent().
     */
    loadOnlyProducts() {
        this.productsInput$.next('');
    }

    /**
     * responseFunction
     * Returns the results from products api
     */
    responseFunction = (resp: any) => {
        function ObjAssignFn(item: any, pricelistProducts: any[]) {
            const itemFields = _.pick(item, 'name', 'type', 'product_id');

            pricelistProducts.forEach(product => {
                Object.assign(product, itemFields);

                let disabled = false;
                let display_quantity: number | string | undefined;
                let display_quantity_class = 'text-muted small d-block';
                const disabledText: string | undefined = product.disabledText;

                if (product.stock_tracking === true) {
                    if (product.remaining_quantity === 0) {
                        disabled = true;
                        display_quantity = 'Out of stock';
                        display_quantity_class = 'text-danger small d-block';
                    } else if (typeof product.remaining_quantity === 'number') {
                        display_quantity = `${product.remaining_quantity} remaining`;
                        if (product.remaining_quantity < 10) {
                            display_quantity_class =
                                'text-warning small d-block';
                        }
                    }
                } else {
                    display_quantity = 'not tracked';
                }

                Object.assign(product, {
                    disabled,
                    ...(disabledText ? { disabledText } : {}),
                    ...(display_quantity !== undefined
                        ? { display_quantity }
                        : {}),
                    display_quantity_class,
                });
            });
        }

        function combineFn(item: any) {
            ObjAssignFn(item, item.pricelist_products);
            return item;
        }

        const newArr = resp.results.map(combineFn);
        return newArr;
    };

    /**
     * simpleResponseFunction
     * Returns the results from products api
     */
    simpleResponseFunction = (resp: any) => {
        function ObjAssignFn(item: any) {
            item.unit_price = item.price_inclusive_tax;
            item.pricelist_product_id = item.id;
            item.name = item.product_name;

            let disabled = false;
            let display_quantity: number | string | undefined;
            let display_quantity_class = 'text-muted small d-block';
            const disabledText: string | undefined = item.disabledText;

            if (item.stock_tracking === true) {
                if (item.remaining_quantity === 0) {
                    disabled = true;
                    display_quantity = 'Out of stock';
                    display_quantity_class = 'text-danger small d-block';
                } else if (typeof item.remaining_quantity === 'number') {
                    display_quantity = `${item.remaining_quantity} remaining`;
                    if (item.remaining_quantity < 10) {
                        display_quantity_class = 'text-warning small d-block';
                    }
                }
            } else {
                display_quantity = 'not tracked';
            }

            Object.assign(item, {
                disabled,
                ...(disabledText ? { disabledText } : {}),
                ...(display_quantity !== undefined ? { display_quantity } : {}),
                display_quantity_class,
            });
        }

        function combineFn(item: any) {
            ObjAssignFn(item);
            return item;
        }

        const newArr = resp.results.map(combineFn);
        return newArr;
    };

    /**
     * getProducts
     * Gets the products from the api
     */
    getProducts(term: string = null): Observable<any> {
        const params = {
            q: term,
            bp_id: this.component.secondaryData[0]['customer_id'],
            category: this.component.secondaryData[1].queue_type,
        };

        return this.dataLayer
            .list('price-list-search', params)
            .pipe(map(this.responseFunction));
    }

    /**
     * getOnlyProducts
     * Ensures that the api used
     */
    getOnlyProducts(
        term: string = null,
        pricelistId: string,
        extendParams: any = { active: 'true' }
    ): Observable<any> {
        const params = {
            search: term,
            pricelist: pricelistId,
            fields: 'id,unit-price,pricelist_name,product_name,product_type,product_id,remaining_quantity,available_quantity,quantity_on_hand,type,price_inclusive_tax,stock_tracking',
            ...extendParams,
        };
        return this.dataLayer
            .list('price-list-products', params)
            .pipe(map(this.simpleResponseFunction));
    }

    isPricelistSelected(model) {
        return !!(model && (model.pricelists?.id || model.pricelists));
    }
}

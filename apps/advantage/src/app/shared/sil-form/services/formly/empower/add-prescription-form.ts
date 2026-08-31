import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../../sil-http-services/sil_datalayer.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import moment from 'moment';
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
 * Class for the form prescription service
 */
export class AddPrescriptionService {
    /**
     * Observable that loads the products
     */
    products$: Observable<any>;

    /**
     * Subject that checks the product search
     */
    productsInput$ = new Subject<string>();

    /**
     * Used to control loading for search
     */
    loading: boolean = false;

    /**
     * Used to control loading for search
     */
    loadingProducts: boolean;

    /**
     * Stores the search term
     */
    term: string;

    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     *
     * Duration and period units
     */
    units: Array<any> = [];

    /**
     *
     * Forms of dosage to administer
     */
    doseForms: Array<any> = [];
    /**
     * Dosage conditions
     */
    conditions: Array<any> = [];
    /**
     * Stores form data from api
     */
    model: any = {};

    /** current date */
    currentDate: any = moment();
    /**

    /**
     * Imports datalayer for service calls
     * @param dataLayer gives access to the datalayer service
     */
    constructor(public dataLayer: SilStoresService) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'medication',
                type: 'select',
                className: 'col-12 input-flex-one display-grid pad-t-12',
                props: {
                    observableItem: true,
                    observable: this.products$,
                    observableInput: this.productsInput$,
                    placeholder: 'Search for medication',
                    label: 'Medication Search',
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
                            key: 'selling_price',
                            newline: true,
                            type: 'currency',
                            label: 'Price',
                            class: 'fs-9',
                        },
                    ],
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loadingProducts,
                    loadingText: 'Searching medication..',
                    typeToSearchText: 'Please enter characters to search',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                },
                expressions: {
                    'model.medication': field => {
                        if (field?.model?.medication) {
                            return field?.model?.medication;
                        }
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
                key: 'dose_quantity',
                type: 'input',
                defaultValue: 1,
                className:
                    'col-sm-6 col-12 input-flex-one display-grid pad-t-10 pe-sm-1',
                props: {
                    type: 'number',
                    label: 'RX: Take',
                    required: true,
                    min: 1,
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'dose_unit',
                type: 'select',
                className:
                    'col-sm-6 col-12 input-flex-one display-grid pad-t-10 ps-sm-1',
                props: {
                    label: 'Form',
                    placeholder: 'Select form',
                    required: true,
                    bindLabel: 'title',
                    bindValue: 'value',
                    closeOnSelect: true,
                    options: [...this.doseForms],
                },
                expressions: {
                    'model.dose_unit': field => {
                        return field.model?.dose_unit;
                    },
                },
                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 10,
                    },
                },
            },
            {
                key: 'period',
                type: 'input',
                defaultValue: 12,
                className:
                    'col-sm-6 col-12 input-flex-one display-grid pad-t-10 pe-sm-1',
                props: {
                    type: 'number',
                    label: 'Every',
                    required: true,
                    min: 1,
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'period_unit',
                type: 'select',
                defaultValue: 'h',
                className:
                    'col-sm-6 col-12 input-flex-one display-grid pad-t-10 ps-sm-1',
                props: {
                    label: 'Frequency',
                    placeholder: 'Select dosage frequency',
                    required: true,
                    bindLabel: 'title',
                    bindValue: 'value',
                    closeOnSelect: true,
                    options: this.units,
                },
                expressions: {
                    'model.period_unit': field => {
                        return field.model?.period_unit;
                    },
                },
                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 10,
                    },
                },
            },
            {
                key: 'duration',
                type: 'input',
                defaultValue: 1,
                className:
                    'col-sm-6 col-12 input-flex-one display-grid pad-t-10 pe-sm-1',
                props: {
                    type: 'number',
                    label: 'For',
                    required: true,
                    min: 1,
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'duration_unit',
                type: 'select',
                defaultValue: 'd',
                className:
                    'col-sm-6 col-12 input-flex-one display-grid pad-t-10 ps-sm-1',
                props: {
                    label: 'Duration',
                    placeholder: 'Select dosage duration',
                    required: true,
                    bindLabel: 'title',
                    bindValue: 'value',
                    closeOnSelect: true,
                    options: this.units,
                },
                expressions: {
                    'model.duration_unit': field => {
                        return field.model?.duration_unit;
                    },
                },
                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 10,
                    },
                },
            },
            {
                key: 'calculated',
                className:
                    'col-12 input-flex-one display-grid pad-t-10 pe-sm-1',
                type: 'input',
                props: {
                    label: 'Calculated Quantity',
                    disabled: true,
                },
                expressions: {
                    'model.calculated': field => {
                        let timesInPeriod = 1;
                        if (field.model?.duration) {
                            if (field.model.period_unit === 'h') {
                                timesInPeriod = Math.floor(
                                    24 / field.model.period
                                );
                            }
                            const qty =
                                parseInt(field.model.duration, 10) *
                                parseInt(field.model.dose_quantity, 10) *
                                timesInPeriod;
                            return qty;
                        }
                        return field.model?.dose_quantity;
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
                key: 'start_date',
                className:
                    'col-sm-6 col-12 input-flex-one display-grid pad-t-10 pe-sm-1',
                type: 'datepicker',
                defaultValue: this.currentDate,
                props: {
                    type: 'text',
                    label: 'Starting From',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                    required: true,
                    min: this.currentDate,
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'end_date',
                className:
                    'col-sm-6 col-12 input-flex-one display-grid pad-t-10 ps-sm-1',
                type: 'datepicker',
                props: {
                    type: 'text',
                    label: 'To',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                    required: true,
                    min: this.currentDate,
                },
                expressions: {
                    'model.end_date': field => {
                        if (
                            field.model?.duration_unit === 'd' &&
                            field.model.start_date
                        ) {
                            const date = moment(field.model?.start_date).add(
                                field.model.duration,
                                'days'
                            );
                            return date;
                        }
                        return field.model?.end_date;
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
                key: 'condition',
                type: 'select',
                defaultValue: 'After meals',
                className:
                    'col-sm-6 col-12 input-flex-one display-grid pad-t-10 pe-sm-1',
                props: {
                    label: 'Instructions for taking the medication',
                    placeholder: 'Select Condition',
                    required: true,
                    bindLabel: 'title',
                    bindValue: 'value',
                    closeOnSelect: true,
                    options: [...this.conditions],
                },
                expressions: {
                    'model.condition': field => {
                        return field.model?.condition;
                    },
                },
                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 10,
                    },
                },
            },
            {
                key: 'patient_instruction',
                type: 'textarea',
                className: 'col-12 input-flex-one display-grid pad-t-10',
                props: {
                    label: 'Instructions',
                    placeholder: 'Enter dispensing instructions here',
                    required: false,
                    className: 'label',
                    rows: 5,
                },
                expressions: {
                    'model.patient_instruction': field => {
                        return field.model?.patient_instruction;
                    },
                },
                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 10,
                    },
                },
            },
        ];
    }
    /**
     *  tapFunction
     * Shows that the type ahead is loading
     */
    tapFunction = () => (this.loading = true);
    /**
     *  tapLoading
     * Shows that the typeahead has stopped loading
     */
    tapLoading = () => (this.loading = false);
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
     *  catchErrorFunction
     * Catches the error from the typeahead
     */
    catchErrorFunction = () => of([]);
    /**
     *  productsResponseFunction
     * Returns the results from products api
     * @param resp gives the full response object from the API
     * @returns fields used in the formly component
     */
    productsResponseFunction = resp => {
        function selectFewerFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const {
                id,
                name,
                preferred_name,
                code,
                product_type,
                selling_price,
                quantity_at_hand,
            } = select;
            return {
                id,
                name,
                preferred_name,
                code,
                product_type,
                selling_price,
                quantity_at_hand,
            };
        }
        const newArr = resp['results'].map(selectFewerFields);
        return newArr;
    };

    /**
     *  getProducts
     * Fetches product data from the API based on the search term.
     * @param term
     * @returns products
     */
    getProducts(term: string = null): Observable<any> {
        const params = {
            search: term,
            category: this.component.secondaryData?.category,
            product_type: 'sku',
        };

        return this.dataLayer
            .list('products', params)
            .pipe(map(this.productsResponseFunction));
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;

        this.units = [
            {
                title: 'Second(s)',
                value: 's',
            },
            {
                title: 'Minute(s)',
                value: 'min',
            },
            {
                title: 'Hour(s)',
                value: 'h',
            },
            {
                title: 'Day(s)',
                value: 'd',
            },
            {
                title: 'Week(s)',
                value: 'wk',
            },
            {
                title: 'Month(s)',
                value: 'mo',
            },
            {
                title: 'Year(s)',
                value: 'a',
            },
        ];

        this.doseForms = [
            {
                title: 'Capsules',
                value: 'capsules',
            },
            {
                title: 'Tablets',
                value: 'tablets',
            },
            {
                title: 'Milligrams',
                value: 'mg',
            },
            {
                title: 'Drops',
                value: 'drops',
            },
        ];

        this.conditions = [
            {
                title: 'After Meals',
                value: 'After meals',
            },
            {
                title: 'Before Meals',
                value: 'Before meals',
            },
            {
                title: 'In the Morning',
                value: 'In the morning',
            },
            {
                title: 'At Night',
                value: 'At night',
            },
        ];
        this.loadProducts();
    }
}

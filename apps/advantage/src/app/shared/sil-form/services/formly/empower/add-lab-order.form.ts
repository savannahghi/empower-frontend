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
 * Class for the form lab order service
 */
export class AddLabOrderService {
    /**
     * Observable that loads the tests
     */
    tests$: Observable<any>;
    /**
     * Subject that checks the test search
     */
    testsInput$ = new Subject<string>();

    /**
     * Used to control loading for search
     */
    loading: boolean = false;

    /**
     * Used to control loading for search
     */
    loadingTests: boolean;
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
                key: 'test',
                type: 'select',
                className: 'col-12 input-flex-one display-grid pad-t-12',
                props: {
                    observableItem: true,
                    observable: this.tests$,
                    observableInput: this.testsInput$,
                    placeholder: 'Search for test',
                    label: 'Test Search',
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
                            key: 'loinc_code',
                            label: 'Code',
                            class: 'fw-light fs-8px',
                            newline: true,
                        },
                        {
                            key: 'loinc_code',
                            label: 'Source',
                            class: 'fw-light fs-8px',
                            newline: true,
                        },
                    ],
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loadingTests,
                    loadingText: 'Searching tests..',
                    typeToSearchText: 'Please enter characters to search',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                },
                expressions: {
                    'model.test': field => {
                        return field?.model?.test;
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
                key: 'clinical_notes',
                type: 'textarea',
                className: 'col-12 input-flex-one display-grid pad-t-10',
                props: {
                    label: 'Notes',
                    placeholder: 'Enter clinical notes',
                    required: false,
                    className: 'label',
                    rows: 5,
                },
                expressions: {
                    'model.clinical_notes': field => {
                        return field.model?.clinical_notes;
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
     * Gets the tests using the getTests function
     */
    switchMapTestFunction = term =>
        this.getTests(term).pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapLoading)
        );
    /**
     *  loadTests
     * Loads the tests using a subject and term searched by
     */
    loadTests() {
        this.tests$ = concat(
            of([' ']), // default items
            this.testsInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapTestFunction)
            )
        );
    }
    /**
     *  catchErrorFunction
     * Catches the error from the typeahead
     */
    catchErrorFunction = () => of([]);
    /**
     *  testsResponseFunction
     * Returns the results from tests api
     * @param resp gives the full response object from the API
     * @returns fields used in the formly component
     */
    testsResponseFunction = resp => {
        function selectFewerFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention

            const identifiers = Array.isArray(select.identifiers)
                ? select.identifiers
                : [];

            const loincCode = identifiers.find(
                identifier => identifier.identifier_type === 'KNC'
            )?.identifier_value;

            return {
                id: select.id,
                name: select.name,
                loinc_code: loincCode,
            };
        }
        const newArr = resp['results'].map(selectFewerFields);
        return newArr;
    };

    /**
     *  getTests
     * Fetches test data from the API based on the search term.
     * @param term
     * @returns tests
     */
    getTests(term: string = null): Observable<any> {
        const params = {
            search: term,
            category: this.component.secondaryData?.category,
        };

        return this.dataLayer
            .list('products', params)
            .pipe(map(this.testsResponseFunction));
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.loadTests();
    }
}

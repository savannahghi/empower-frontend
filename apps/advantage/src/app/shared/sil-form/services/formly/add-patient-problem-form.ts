/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { concat, Observable, of, Subject } from 'rxjs';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    startWith,
    switchMap,
    tap,
    map,
} from 'rxjs/operators';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import _ from 'underscore';
import moment from 'moment';

export interface Condition {
    uuid: string;
    id: boolean;
    display_name: string;
    source: string;
}

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines billing form controls, methods
 */
export class PatientProblemFieldsService {
    /**
     * Observable that loads the products
     */
    /**
     * Observable that loads the conditions
     */
    conditions$: Observable<any>;
    /**
     * Subject that checks the search input
     */
    searchInput$ = new Subject<string>();
    /**
     * Used to control loading for search
     */
    loading: boolean = false;
    /**
     * Stores the search term
     */
    term: string;
    /**
     * Stores instance of the form component
     */
    component: any;
    /**
     * Stores the form model data
     */
    model: Object;

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public auth: AuthenticationService
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'condition',
                type: 'select',
                hideExpression: 'model.id',
                className: 'col-12 col-md-11 col-sm-12 mt-3 ms-5 me-5 mb-2',
                props: {
                    observableItem: true,
                    observable: this.conditions$,
                    observableInput: this.searchInput$,
                    placeholder: 'Search problem...',
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
                            newline: true,
                            label: '',
                            class: '',
                        },
                        {
                            key: 'code',
                            label: 'Code',
                            class: 'fw-lighter',
                            newline: false,
                        },
                        {
                            key: 'system',
                            label: 'Source',
                            class: 'fw-lighter ms-5',
                            newline: false,
                        },
                    ],
                    label: 'Search for problem',
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loading,
                    loadingText: 'Searching..',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    searchWhileComposing: false,
                    required: true,
                    virtualScroll: true,
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'onset_date',
                className: `col-12 col-md-11 col-sm-12 mt-2 ms-5 me-5 mb-2 problem-date`,
                type: 'datepicker',
                props: {
                    type: 'text',
                    placeholder: 'Choose the day the problem began',
                    label: 'Onset date (day problem began)',
                    dateFormat: 'YYYY-MM-DD',
                    required: true,
                    max: moment(),
                },
                expressions: {
                    'model.onset_date': field => {
                        if (field.formControl.pristine === false) {
                            this.model = field.model;
                            if (
                                !_.isUndefined(field.model.onset_date) &&
                                field.formControl.touched === true &&
                                field.defaultValue !== field.model.onset_date
                            ) {
                                field.formControl.markAsPristine();
                                return moment(field.model.onset_date);
                            } else {
                                return this.model['onset_date'];
                            }
                        } else if (field.model.onset_date !== null) {
                            return moment(field.model.onset_date);
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
                key: 'status',
                type: 'select',
                className: 'col-12 col-md-11 col-sm-12 mt-2 ms-5 me-5 mb-2',
                defaultValue: 'ACTIVE',
                props: {
                    placeholder: `Select status`,
                    label: 'Status',
                    options: [
                        {
                            value: 'ACTIVE',
                            name: 'ACTIVE',
                        },
                        {
                            value: 'RESOLVED',
                            name: 'RESOLVED',
                        },
                        {
                            value: 'RESOLVED',
                            name: 'RESOLVED',
                        },
                        {
                            value: 'UNKNOWN',
                            name: 'UNKNOWN',
                        },
                    ],
                    bindValue: 'value',
                    bindLabel: 'name',
                    closeOnSelect: true,
                },
                expressions: {
                    'model.status': field => {
                        return field.model.status;
                    },
                },
            },
            {
                key: 'severity',
                type: 'select',
                className: 'col-12 col-md-11 col-sm-12 mt-2 ms-5 me-5 mb-2',
                props: {
                    placeholder: `Select severity`,
                    label: 'Severity',
                    required: true,
                    options: [
                        {
                            value: 'severe',
                            name: 'Severe',
                        },
                        {
                            value: 'mild',
                            name: 'Mild',
                        },
                        {
                            value: 'moderate',
                            name: 'Moderate',
                        },
                    ],
                    bindValue: 'value',
                    bindLabel: 'name',
                    closeOnSelect: true,
                },
                expressions: {
                    'model.severity': field => {
                        return field.model.severity;
                    },
                },
            },
            {
                key: 'notes',
                type: 'textarea',
                className: 'col-12 col-md-11 col-sm-12 mt-2 ms-5 me-5 mb-2',
                props: {
                    placeholder: `Add complaints notes`,
                    label: 'Presenting complaints notes',
                    rows: 4,
                },
                expressions: {
                    'model.notes': field => {
                        return field.model.notes;
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
        this.loadCondition();
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
     *  switchMapDiagnosisFunction
     * Gets the diagnosis using the getCondition function
     */
    switchMapConditionFunction = term =>
        this.getCondition(term).pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapFunctionLoading)
        );

    /**
     *  loadCondition
     * Loads the conditions using a subject and term searched by
     */
    loadCondition() {
        this.conditions$ = concat(
            of([' ']), // default items
            this.searchInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(500),
                tap(this.tapFunction),
                switchMap(this.switchMapConditionFunction)
            )
        );
    }

    /**
     *  getCondition
     * Gets the conditions from the api
     */
    getCondition(term): Observable<Condition[]> {
        return this.dataLayer
            .list('allergyintolerance-search', { limit: 25, name: term })
            .pipe(map(resp => this.responseFunction(resp)));
    }

    responseFunction = resp => {
        function selectFewerFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { code, name, system } = select.Node;
            return { code, name, system };
        }
        const newArr = resp.edges.map(selectFewerFields);
        return newArr;
    };
}

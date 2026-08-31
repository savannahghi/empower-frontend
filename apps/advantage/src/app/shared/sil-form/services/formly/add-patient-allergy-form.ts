/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { concat, Observable, of, Subject, Subscription } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    switchMap,
    tap,
    catchError,
    map,
} from 'rxjs/operators';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines billing form controls, methods
 */
export class PatientAllergyFieldsService {
    /**
     * Observable that loads the allergies
     */
    allergies$: Observable<any>;
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

    querySubscription: Subscription;

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
                key: 'allergy',
                type: 'select',
                hideExpression: 'model.id',
                className: 'col-12 col-md-11 col-sm-12 mt-3 ms-5 me-5 mb-2',
                props: {
                    observableItem: true,
                    observable: this.allergies$,
                    observableInput: this.searchInput$,
                    placeholder: 'Search allergy...',
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
                    groupBy: 'allergy',
                    label: 'Search for allergy',
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
                key: 'status',
                type: 'select',
                className: 'col-12 col-md-11 col-sm-12 mt-3 ms-5 me-5 mb-2',
                props: {
                    placeholder: 'Choose allergy intolerance',
                    label: 'Choose allergy intolerance',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Mild',
                            value: 'MILD',
                        },
                        { title: 'Moderate', value: 'MODERATE' },
                        { title: 'Severe', value: 'SEVERE' },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.status': field => {
                        if (field?.model?.status) {
                            return field?.model?.status;
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
        ];
    }
    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.loadAllergy();
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
     *  switchMapallergyFunction
     * Gets the allergy using the getCondition function
     */
    switchMapAllergyFunction = term =>
        this.getAllergy(term).pipe(
            catchError(this.catchErrorFunction),
            tap(this.tapFunctionLoading)
        );

    /**
     *  catchErrorFunction
     * Catches the error from the typeahead
     */
    catchErrorFunction = () => of([]);

    /**
     *  loadAllergy
     * Loads the allergies using a subject and term searched by
     */
    loadAllergy() {
        this.allergies$ = concat(
            of([' ']), // default items
            this.searchInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(500),
                tap(this.tapFunction),
                switchMap(this.switchMapAllergyFunction)
            )
        );
    }

    /**
     *  getAllergy
     * Gets the allergies from the api
     */
    getAllergy(term): Observable<any> {
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

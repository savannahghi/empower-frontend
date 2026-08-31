import { Injectable } from '@angular/core';
import { concat, Observable, of, Subject } from 'rxjs';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    startWith,
    switchMap,
    map,
    tap,
} from 'rxjs/operators';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
export interface Condition {
    uuid: string;
    id: string;
    display_name: string;
    source: string;
    owner: string;
}

/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the facility service form registration service
 */
export class FacilityServiceFormService {
    /**
     * Observable that loads the conditions
     */
    conditions$: Observable<any>;
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;
    /**
     * Subject that checks the search input
     */
    searchInput$ = new Subject<string>();
    /**
     * Used to control loading for search
     */
    loading: boolean = false;

    /**
     * Stores form data from api
     */
    model: Object;
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
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(public dataLayer: SilStoresService) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'services',
                type: 'select',
                defaultValue: '',
                className: 'col-12',
                props: {
                    observableItem: true,
                    observable: this.conditions$,
                    observableInput: this.searchInput$,
                    multiple: true,
                    label: 'Service',
                    bindLabel: [
                        {
                            key: 'display_name',
                            newline: true,
                            label: '',
                            class: '',
                        },
                        {
                            key: 'id',
                            label: 'Code',
                            class: 'fw-lighter',
                            newline: false,
                        },
                        {
                            key: 'source',
                            label: 'Source',
                            class: 'fw-lighter ms-5',
                            newline: false,
                        },
                    ],
                    searchable: true,
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loading,
                    loadingText: 'Searching..',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchWhileComposing: false,
                    required: true,
                    virtualScroll: true,
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 100,
                    },
                },
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.loadCondition();
    }
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
                debounceTime(1000),
                tap(this.tapFunction),
                switchMap(this.switchMapConditionFunction)
            )
        );
    }

    /**
     *  getCondition
     * Gets the conditions from the api
     * @param term search term used to filter the data
     * @returns api response
     */
    getCondition(term): Observable<Condition[]> {
        const params = {
            q: term,
            exact_match: 'off',
            includeSearchMeta: true,
            verbose: false,
            owner: 'ciel',
            sortDesc: '_score',
        };

        return this.dataLayer
            .list('diagnosis', params)
            .pipe(map(this.responseFunction));
    }

    responseFunction = resp => {
        function selectFewerFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { id, display_name, source, uuid, owner } = select;
            return { id, display_name, source, uuid, owner };
        }
        const newArr = resp.map(selectFewerFields);
        return newArr;
    };
}

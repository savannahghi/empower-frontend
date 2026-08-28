/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
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

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines bulk cancel appointment controls
 */
export class BulkCancelAppointmentService {
    /**
     * Observable that loads the clinics
     */
    clinic$: Observable<any>;

    /**
     * Subject that checks the the clinics search
     */
    clinicInput$ = new Subject<string>();

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
     *  Constructor for the class
     * @param dataLayer injects the data layer service
     */
    constructor(public dataLayer: SilStoresService) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'schedule',
                type: 'select',
                className: 'col-12',
                props: {
                    observableItem: true,
                    observable: this.clinic$,
                    observableInput: this.clinicInput$,
                    placeholder:
                        'Select clinic that will have cancelled appointments',
                    label: 'Clinic with cancelled appointments',
                    bindLabel: [
                        {
                            key: 'description',
                            class: 'fw-semibold',
                            newline: true,
                        },
                        {
                            key: 'specialty',
                            class: 'fs-13px',
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
                    loadingText: 'Searching..',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                },
            },
            {
                type: 'datepicker',
                key: 'date',
                className: 'col-12',
                props: {
                    label: 'Select date to cancel all appointments',
                    required: false,
                },
            },
            {
                className: 'mt-2 col-12',
                template: '<div class="mt-3"></div>',
            },
        ];
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.loadClinics();
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
     *  switchMapClinicFunction
     * Gets the clinics using the getClinics function
     */
    switchMapClinicFunction = term =>
        this.getClinics(term).pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapFunctionLoading)
        );

    /**
     *  loadClinics
     * Loads the clinics using a subject and term searched by
     */
    loadClinics() {
        this.clinic$ = concat(
            of([' ']), // default items
            this.clinicInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapClinicFunction)
            )
        );
    }

    /**
     *  responseFunction
     * Returns the results from clinics api
     */
    responseFunction = resp => resp['results'];

    /**
     *  getClinics
     * Gets the clinics from the api
     */
    getClinics(term: string = null): Observable<any> {
        const params = {
            fields: 'id,description,specialty',
        };
        if (term) {
            params['search'] = term;
        }
        return this.dataLayer
            .list('schedules', params)
            .pipe(map(this.responseFunction));
    }
}

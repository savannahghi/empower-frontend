import { Injectable } from '@angular/core';
import { Observable, Subject, concat, of } from 'rxjs';

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
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the form search facility service
 */
export class SearchFacilityService {
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     * Stores form data from api
     */
    model: any = {};

    /**
     * Used to control loading for search
     */
    loading: boolean = false;

    /**
     * Observable that loads the businessPartners
     */
    businessPartners$: Observable<any>;

    /**
     * Observable that loads the available countries
     */
    availableCountries$: Observable<any>;

    /**
     * Subject that checks the provider search
     */
    businessPartnersInput$ = new Subject<string>();

    /**
     * Subject that checks the available countries
     */
    availableCountriesInput$ = new Subject<string>();

    /**
     * Selected country
     */
    selectedCountry: any;

    /**
     * Function to save selected country
     */
    saveCountry(country: string): void {
        this.selectedCountry = country;
    }

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(private dataLayer: SilStoresService) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                className: 'width-100p mb-1',
                fieldGroup: [
                    {
                        key: 'country',
                        type: 'select',
                        className: 'col-12 col-sm-3 px-sm-4',
                        props: {
                            label: 'Country',
                            placeholder: 'Select your country',
                            required: true,
                            observableItem: true,
                            observable: this.availableCountries$,
                            observableInput: this.availableCountriesInput$,
                            loading: this.loading,
                            closeOnSelect: true,
                            multiple: false,
                            bindLabel: [
                                {
                                    key: 'name',
                                    class: 'me-1 mb-1',
                                },
                            ],
                            bindValue: 'name',
                        },
                        expressions: {
                            'model.country': field => {
                                field.props.model = field.model?.country;
                                this.saveCountry(field.model?.country);
                                return field.model?.country;
                            },
                        },
                        modelOptions: {
                            debounce: {
                                default: 1000,
                            },
                        },
                    },
                    {
                        key: 'provider',
                        type: 'select',
                        className: 'col-12 col-sm-9 ps-sm-3',
                        props: {
                            label: 'Facility Search',
                            placeholder:
                                'Search for healthcare provider or practitioner e.g ABC Hospital',
                            required: true,
                            observableItem: true,
                            observable: this.businessPartners$,
                            observableInput: this.businessPartnersInput$,
                            loading: this.loading,
                            multiple: false,
                            bindLabel: [
                                {
                                    key: 'name',
                                    class: 'me-1 mb-1',
                                },
                                {
                                    key: 'slade_code_counter',
                                },
                            ],
                            options: [],
                            dropdownPosition: 'bottom',
                            closeOnSelect: true,
                            minTermLength: 3,
                            loadingText: 'Searching facility..',
                            typeToSearchText:
                                'Please enter 3 or more characters',
                            searchable: true,
                        },
                        modelOptions: {
                            updateOn: 'change',
                            debounce: {
                                default: 10,
                            },
                        },
                    },
                ],
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.loadBusinessPartners();
        this.loadAvailableCountries();
    }

    /**
     *  tapFunction
     * Shows that the typeahead is loading
     */
    tapFunction = () => {
        this.loading = true;
    };

    /**
     *  tapLoading
     * Shows that the typeahead has stopped loading
     */
    tapLoading = () => {
        this.loading = false;
    };

    /**
     *  responseFunction
     * Returns the results from providers api
     */
    responseFunction = resp => resp['results'];

    /**
     *  catchErrorFunction
     * Catches the error from the typeahead
     */
    catchErrorFunction = () => of([]);

    /**
     *  switchMapBusinessPartnerFunction
     * Gets the business partner using the getBusinessPartner function
     */
    switchMapBusinessPartnerFunction = term =>
        this.getBusinessPartner(term).pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapLoading)
        );

    /**
     *  switchMapAvailableCountriesFunction
     * Gets the available countries using the getAvailableCountries function
     */
    switchMapAvailableCountriesFunction = () =>
        this.getAvailableCountries().pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapLoading)
        );

    /**
     *  getBusinessPartner
     * Gets the business partner from the api
     */
    getBusinessPartner(term: string = null): Observable<any> {
        const params = {};
        params['country_name'] = this.selectedCountry;
        params['page_size'] = 10;

        if (term) {
            params['search'] = term;
        }

        return this.dataLayer
            .list('bp-search', params)
            .pipe(map(this.responseFunction));
    }

    getAvailableCountries(): Observable<any> {
        return this.dataLayer
            .list('available-countries')
            .pipe(map(this.responseFunction));
    }

    /**
     *  loadbusinessPartners
     * Loads the business partners using a subject and term searched by
     */
    loadBusinessPartners() {
        this.businessPartners$ = concat(
            of([' ']), // default items
            this.businessPartnersInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapBusinessPartnerFunction)
            )
        );
    }

    /**
     *  loadAvailableCountries
     * Loads the available countries
     */
    loadAvailableCountries() {
        this.availableCountries$ = concat(
            of([' ']), // default items
            this.availableCountriesInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapAvailableCountriesFunction)
            )
        );
    }
}

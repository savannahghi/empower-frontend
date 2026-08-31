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
} from 'rxjs/operators';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { map } from 'rxjs/operators';

export interface Condition {
    uuid: string;
    id: string;
    display_name: string;
    source: string;
    owner: string;
}

export interface DiseaseArea {
    id: string;
    name: string;
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
export class DiseaseRegistrationService {
    /**
     * Observable that loads the conditions
     */
    conditions$: Observable<any>;

    /**
     * Observable that loads the conditions
     */
    diseaseAreas$: Observable<any>;

    /**
     * Observable that loads the conditions
     */
    clinicalSources$: Observable<any>;

    /**
     * Observable that loads the conditions
     */
    patientSources$: Observable<any>;

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
                key: 'area',
                type: 'select',
                className: 'col-12 me-auto col-lg-6 row mb-4',
                props: {
                    observableItem: true,
                    observable: this.diseaseAreas$,
                    observableInput: this.searchInput$,
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                            label: '',
                            class: '',
                        },
                    ],
                    label: 'Disease Area',
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
                key: 'disease',
                type: 'select',
                className: 'col-12 col-lg-6 row mb-4',
                props: {
                    observableItem: true,
                    observable: this.conditions$,
                    observableInput: this.searchInput$,
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
                    label: 'Disease',
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
                key: 'description',
                type: 'textarea',
                className: 'col-12 ',
                props: {
                    label: 'Description',
                    required: false,
                    rows: '5',
                    placeholder: 'Enter the definition of the diseases',
                },
            },

            {
                key: 'clinical_guidelines',
                type: 'select',
                className: 'col-12 mb-4',
                props: {
                    observableItem: true,
                    observable: this.clinicalSources$,
                    observableInput: this.searchInput$,
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                            label: '',
                            class: '',
                        },
                        {
                            key: 'source_name',
                            newline: false,
                            label: 'source',
                            class: 'fw-lighter',
                        },
                    ],
                    label: 'Clinical Guideline Sources',
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: true,
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
                key: 'patient_guidelines',
                type: 'select',
                className: 'col-12',
                props: {
                    observableItem: true,
                    observable: this.patientSources$,
                    observableInput: this.searchInput$,
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                            label: '',
                            class: '',
                        },
                        {
                            key: 'source_name',
                            newline: false,
                            label: 'source',
                            class: 'fw-lighter',
                        },
                    ],
                    label: 'Patient Guideline Sources',
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: true,
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
        ];
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.loadCondition();
        this.loadDiseaseAreas();
        this.loadClinicalSources();
        this.loadPatientSources();
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
                debounceTime(1000),
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
        const params = {
            q: term,
            exact_match: 'off',
            source: 'ICD-10-WHO',
            conceptClass: 'code',
            owner: 'WHO',
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

    /**
     *  loadDisease areas
     * Loads the conditions using a subject and term searched by
     */
    loadDiseaseAreas() {
        this.diseaseAreas$ = concat(
            of([' ']), // default items
            this.searchInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(1000),
                tap(this.tapFunction),
                switchMap(this.switchMapDAreaFunction)
            )
        );
    }

    /**
     *  switchMapDiseaseAreaFunction
     * Gets the disease area using the getDiseaseAreas function
     */
    switchMapDAreaFunction = term =>
        this.getDiseaseAreas(term).pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapFunctionLoading)
        );

    diseaseAreaResponseFunction = resp => {
        function selectDiseaseAreaFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { id, name } = select;
            return { id, name };
        }
        const diseaseArea = resp.results.map(selectDiseaseAreaFields);
        return diseaseArea;
    };

    /**
     * getDiseaseAreas
     * Gets the disease areas from the api
     */
    getDiseaseAreas(term): Observable<DiseaseArea[]> {
        let params;
        if (term) {
            params = {
                search: term,
            };
        }

        return this.dataLayer
            .list('diseases-areas', params)
            .pipe(map(this.diseaseAreaResponseFunction));
    }

    /**
     *  loadDisease areas
     * Loads the conditions using a subject and term searched by
     */
    loadClinicalSources() {
        this.clinicalSources$ = concat(
            of([' ']), // default items
            this.searchInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(1000),
                tap(this.tapFunction),
                switchMap(this.switchMapClinicalSourcesFunction)
            )
        );
    }

    /**
     *  switchMapDiseaseAreaFunction
     * Gets the disease area using the getClinicalSources function
     */
    switchMapClinicalSourcesFunction = term =>
        this.getClinicalSources(term).pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapFunctionLoading)
        );

    clinicalSourcesResponse = resp => {
        function selectClinicalSourcesFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { id, name, source_name } = select;
            return { id, name, source_name };
        }
        const diseaseArea = resp.results.map(selectClinicalSourcesFields);
        return diseaseArea;
    };

    /**
     * getClinicalSources
     * Gets the disease areas from the api
     */
    getClinicalSources(term): Observable<DiseaseArea[]> {
        let params;
        if (term) {
            params = {
                search: term,
            };
        }

        return this.dataLayer
            .list('guidelines', params)
            .pipe(map(this.clinicalSourcesResponse));
    }

    /**
     *  loadDisease areas
     * Loads the conditions using a subject and term searched by
     */
    loadPatientSources() {
        this.patientSources$ = concat(
            of([' ']), // default items
            this.searchInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(1000),
                tap(this.tapFunction),
                switchMap(this.switchMapPatientSourcesFunction)
            )
        );
    }

    /**
     *  switchMapDiseaseAreaFunction
     * Gets the disease area using the getClinicalSources function
     */
    switchMapPatientSourcesFunction = term =>
        this.getPatientSources(term).pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapFunctionLoading)
        );

    patientSourcesResponse = resp => {
        function selectPatientSourcesFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { id, name, source_name } = select;
            return { id, name, source_name };
        }
        const diseaseArea = resp.results.map(selectPatientSourcesFields);
        return diseaseArea;
    };

    /**
     * getClinicalSources
     * Gets the disease areas from the api
     */
    getPatientSources(term) {
        let params;
        if (term) {
            params = {
                search: term,
            };
        }

        return this.dataLayer
            .list('patient-guidelines', params)
            .pipe(map(this.patientSourcesResponse));
    }
}

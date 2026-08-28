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
 * Class for the Exam Diagnosis form service
 */
export class AddExamReferralFormService {
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
     *
     * Test the referral options
     */
    referralOptions: Array<any> = [];

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
                key: 'diagnosis',
                type: 'select',
                className: 'col-12',
                props: {
                    placeholder: 'Search diagnosis',
                    observableItem: true,
                    observable: this.conditions$,
                    observableInput: this.searchInput$,
                    multiple: false,
                    label: 'Diagnosis',
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
            {
                key: 'referral_type',
                type: 'select',
                className: 'col-12 input-flex-one display-grid pad-t-12',
                defaultValue: 'OUTBOUND',
                props: {
                    label: 'Select the type of referral',
                    placeholder: 'Select referral type',
                    required: true,
                    bindLabel: 'label',
                    bindValue: 'value',
                    closeOnSelect: true,
                    searchable: false,
                    options: this.referralOptions,
                },
                expressions: {
                    'model.referral_type': field => {
                        field.props.model = field.model?.referral_type;
                        return field.model?.referral_type;
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
                key: 'facility',
                type: 'combobox',
                className: 'col-12 input-flex-one display-grid pad-t-12',
                defaultValue: '',
                props: {
                    store: 'organisations',
                    responseKey: 'results',
                    clearSearchOnAdd: false,
                    minTermLength: 0,
                    label: 'Referred to',
                    placeholder: 'Search a facility....',
                    bindGroupLabel: [
                        {
                            key: 'organisation_name',
                        },
                        {
                            key: 'postal_address',
                        },
                    ],
                    bindLabel: [
                        {
                            key: 'organisation_name',
                            newline: true,
                            label: 'Name',
                            class: 'fw-lighter me-1 mb-1',
                        },
                        {
                            key: 'postal_address',
                            label: 'Postal Address',
                            class: 'text-muted fs-13px',
                            newline: true,
                        },
                    ],
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    loadingText: 'Searching facilities...',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                },
                expressions: {
                    hide: field => {
                        return field.model.referral_type === 'INBOUND';
                    },
                    'model.facility': field => {
                        return {
                            tenant_id: field.model?.facility?.tenant_id,
                            organisation_name:
                                field.model?.facility?.organisation_name,
                            phone_number: field.model?.facility?.phone_number,
                            postal_address:
                                field.model?.facility?.postal_address,
                            slade_code: field.model?.facility?.slade_code,
                            email_address: field.model?.facility?.email_address,
                        };
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
                key: 'priority',
                type: 'select',
                className: 'col-12 input-flex-one display-grid pad-t-12',
                defaultValue: 'MEDIUM',
                props: {
                    label: 'Priority',
                    placeholder: 'Select priority',
                    required: true,
                    bindLabel: 'label',
                    bindValue: 'value',
                    closeOnSelect: true,
                    searchable: false,
                    options: [
                        { label: 'Urgent', value: 'URGENT' },
                        { label: 'Medium', value: 'MEDIUM' },
                        { label: 'Low', value: 'LOW' },
                    ],
                },
                expressions: {
                    'model.priority': field => {
                        field.props.model = field.model?.priority;
                        return field.model?.priority;
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
                key: 'description',
                type: 'textarea',
                className: 'col-12 input-flex-one display-grid pad-t-10',
                props: {
                    label: 'Description',
                    placeholder: 'Enter Description',
                    required: false,
                    className: 'label',
                    rows: 5,
                },
                expressions: {
                    'model.description': field => {
                        return field.model?.description;
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
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.referralOptions = [
            {
                label: 'Refer to same facility',
                value: 'INBOUND',
            },
            {
                label: 'Refer to another facility',
                value: 'OUTBOUND',
            },
        ];
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
        };
        return this.dataLayer
            .list('ocl-diagnoses', params)
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

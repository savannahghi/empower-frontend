import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { concat, Observable, of, Subject } from 'rxjs';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    switchMap,
    tap,
    map,
    filter,
} from 'rxjs/operators';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import countries from './../../../../../assets/data/countries.json';

@Injectable({
    providedIn: 'root',
})
/**
 * class used to register a new organisations
 */
export class ProviderFieldsService {
    /**
     * contains the providers observable
     */
    providers$: Observable<any>;
    /** subject used to search for a provider */
    providersInput$ = new Subject<string>();
    /** used to determine the minimum length for search */
    minTermLength: number;
    /** contains the state of loading when searching is happening */
    loading: boolean = false;
    /** used to access a formly field */
    field: FormlyFieldConfig;
    /** used as a search term */
    term: string;
    /** used to access the form component instance */
    component: any;

    constructor(private dataLayer: SilStoresService) {}
    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'business_partner',
                type: 'select',
                className: 'col-6',
                props: {
                    observableItem: true,
                    placeholder: 'Type to search for provider',
                    label: 'Provider Name',
                    bindLabel: [
                        {
                            key: 'name',
                            class: 'me-1 mb-1',
                        },
                        {
                            key: 'sladeCode',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                    ],
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    minTermLength: this.minTermLength,
                    clearSearchOnAdd: false,
                    loading: this.loading,
                    loadingText: 'Searching..',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    searchWhileComposing: false,
                    observable: this.providers$,
                    observableInput: this.providersInput$,
                    hideSelected: true,
                    required: false,
                    virtualScroll: true,
                },
                hooks: {
                    onInit: () => this.loadProviders(),
                },
                expressions: {
                    'model.business_partner': field => {
                        if (field?.model?.business_partner) {
                            return field?.model?.business_partner;
                        }
                    },
                },
            },

            {
                key: 'slade_code',
                type: 'input',
                className: 'input-flex-one hidden',
                props: {
                    label: 'Slade code',
                    disabled: true,
                    placeholder: 'Slade code',
                },
                expressions: {
                    'model.slade_code': field => {
                        if (field.model.business_partner) {
                            field.model.slade_code =
                                field.model.business_partner.slade_code_counter;
                            return field.model.business_partner
                                .slade_code_counter;
                        }
                    },
                },
            },

            {
                key: 'organisation_name',
                type: 'input',
                className: 'hidden',
                props: {
                    label: 'Organisation name',
                    disabled: false,
                    placeholder: 'Organisation name',
                },
                expressions: {
                    'model.organisation_name': field => {
                        if (field.model.business_partner) {
                            return field.model.business_partner.name;
                        }
                    },
                },
            },

            {
                key: 'web_address',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    label: 'Website',
                    placeholder: 'Enter the url of the website',
                },
                expressions: {
                    'model.web_address': field => {
                        if (field.model.web_address) {
                            return field.model.web_address;
                        }
                    },
                },
            },

            {
                key: 'preferred_contact',
                defaultValue: '+254700090954',
                type: 'input',
                className: 'hidden',
                props: {
                    label: 'Preferred contact',
                    type: 'text',
                    placeholder: 'Phone number',
                    required: false,
                },
                expressions: {
                    'model.preferred_contact': () => '+254700000000',
                },
            },

            {
                key: 'phone_number',
                type: 'input',
                className: 'col-6',
                props: {
                    label: 'Phone number',
                    type: 'text',
                    placeholder: 'Phone number',
                    required: false,
                },
                expressions: {
                    'model.phone_number': field => {
                        if (field.model.phone_number) {
                            return field.model.phone_number;
                        }
                    },
                },
            },

            {
                key: 'email_address',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'Email address',
                    pattern: '.+@.+..+',
                    required: true,
                },
                expressions: {
                    'model.email_address': field => {
                        if (field.model.email_address) {
                            return field.model.email_address;
                        }
                    },
                },
            },

            {
                key: 'postal_address',
                type: 'input',
                className: 'col-6',
                props: {
                    label: 'Postal Address',
                    placeholder: 'Enter the postal address',
                },
                expressions: {
                    'model.postal_address': field => {
                        if (field.model.postal_address) {
                            return field.model.postal_address;
                        }
                    },
                },
            },

            {
                key: 'physical_address',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    label: 'Physical Address',
                    placeholder: 'Enter the physical address',
                },
                expressions: {
                    'model.physical_address': field => {
                        if (field.model.physical_address) {
                            return field.model.physical_address;
                        }
                    },
                },
            },

            {
                key: 'tax_office',
                type: 'combobox',
                className: 'col-6',
                props: {
                    label: 'Tax Office',
                    placeholder: 'Select the tax office the org belongs to',
                    store: 'tax-offices',
                    responseKey: 'results',
                    bindLabel: [
                        {
                            key: 'name',
                        },
                    ],
                    bindValue: 'id',
                },
                expressions: {
                    'model.tax_office': field => {
                        if (field.model.tax_office) {
                            return field.model.tax_office;
                        }
                    },
                },
            },

            {
                key: 'organisation_country',
                type: 'select',
                className: 'ps-3 col-6',
                props: {
                    label: 'Country',
                    placeholder: 'Select the country',
                    options: countries,
                    bindValue: 'code',
                    bindLabel: 'country',
                },
                expressions: {
                    'model.organisation_country': field => {
                        if (field.model.organisation_country) {
                            return field.model.organisation_country;
                        }
                    },
                },
            },

            {
                className: 'p-0 col-12',
                expressionProperties: {
                    template: () => {
                        const template = `<div class="col-12">
                                    <div class="fw-semibold">
                                        Organisation Identifier's
                                    </div>
                                    <hr>
                                </div>
                            </div>`;
                        return template;
                    },
                },
            },

            {
                type: 'repeat',
                key: 'identifiers',
                className: 'row col-12 ms-0',
                fieldArray: {
                    props: {
                        btnText: 'Add Identifier',
                        hasIcon: true,
                        min: 1,
                        model: [],
                    },
                    fieldGroup: [
                        {
                            key: 'identifier_type',
                            type: 'input',
                            defaultValue: 'kraPIN',
                            className: 'col-6',
                            props: {
                                label: 'ID Type',
                                required: true,
                                closeOnSelect: true,
                            },
                            modelOptions: {
                                updateOn: 'blur',
                                debounce: {
                                    default: 100,
                                },
                            },
                        },
                        {
                            key: 'identifier_value',
                            className: 'ps-3 col-5',
                            type: 'input',
                            props: {
                                label: 'ID Number',
                                placeholder: 'Enter ID Number',
                                required: false,
                            },
                            modelOptions: {
                                updateOn: 'blur',
                                debounce: {
                                    default: 100,
                                },
                            },
                        },
                    ],
                },
            },

            {
                key: 'financial_year_start_date',
                type: 'datepicker',
                className: 'col-12',
                props: {
                    label: 'Financial Year Start Date',
                    type: 'text',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                    required: true,
                },
                expressions: {
                    'model.financial_year_start_date': field => {
                        if (field?.model?.financial_year_start_date) {
                            return field?.model?.financial_year_start_date;
                        }
                    },
                },
            },
        ];
    }

    /** sets the form component  */
    setComponent(component) {
        this.component = component;
        this.loadProviders();
    }

    /** used in the observable filter function */
    filterFunction = res => res !== null && res.length >= this.minTermLength;
    /** used in the observable tap function */
    tapFunction = () => (this.loading = true);
    /** used when the tap function is loading */
    tapFunctionLoading = () => (this.loading = false);
    /** used to catch an error while fetching the provider information */
    catchErrorFunction = () => of([]);

    /** used within the observable as a switch map function */
    switchMapFunction = term =>
        this.getProviders(term).pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapFunctionLoading)
        );

    /** used to load provider information */
    loadProviders() {
        this.minTermLength = 3;
        this.providers$ = concat(
            of([]), // default items
            this.providersInput$.pipe(
                filter(this.filterFunction),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapFunction)
            )
        );
    }

    /** used when as the response function for the observables */
    responseFunction = resp => resp['results'];

    /** used in the switch map function to load provider responses */
    getProviders(term: string = null): Observable<any> {
        const params = {
            fields: 'id,name,slade_code,slade_code_counter,bp_type',
            is_branch: 'False',
        };
        if (term) {
            params['search'] = term;
        }
        return this.dataLayer
            .list('chargemaster-bps', params)
            .pipe(map(this.responseFunction));
    }
}

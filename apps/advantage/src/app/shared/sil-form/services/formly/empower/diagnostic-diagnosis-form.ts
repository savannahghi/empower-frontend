import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../../sil-http-services/sil_datalayer.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
    behaviourConcepts,
    gradeConcepts,
    stageConcept,
} from 'app/features/advantage/visits/visit-patient-diagnostics/diagnostics/concepts';
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

export interface Condition {
    uuid?: string;
    id?: string;
    display_name?: string;
    source?: string;
    owner?: string;
}

/**
 * Injectable for the diagnosis form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the diagnosis form service
 */
export class DiagnosticDiagnosisService {
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
     * behaviour options
     */
    behaviourOptions: Array<any> = [];

    /**
     *  catchErrorFunction
     * Catches the error from the typeahead
     */
    catchErrorFunction = () => of([]);

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
     * grade options
     */
    gradeOptions: Array<any> = [];

    /**
     * stage options
     */
    stageOptions: Array<any> = [];

    /**
     * Subject that checks the search input
     */
    searchInput$ = new Subject<string>();

    /**
     * Observable that loads the conditions
     */
    conditions$?: Observable<any>;

    /**
     * Used to control loading for search
     */
    loading = false;

    /**
     * Stores form data from api
     */
    model: any = {};

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
                className: 'width-100p',
                fieldGroup: [
                    {
                        key: 'diagnosis',
                        type: 'select',
                        defaultValue: '',
                        className: 'col-12',
                        props: {
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
                            typeToSearchText:
                                'Please enter 3 or more characters',
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
                        key: 'icd_o_3_code_primary_tumor',
                        type: 'input',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'ICD-O-3 Code for Primary Tumor',
                            placeholder: 'Enter primary tumor code',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 100,
                            },
                        },
                    },
                    {
                        key: 'icd_o_3_code_morphology',
                        type: 'input',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'ICD-O-3 Code for Morphology',
                            placeholder: 'Enter morphology code',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 100,
                            },
                        },
                    },
                    {
                        key: 'behaviour',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Behaviour',
                            placeholder: 'Select behaviour',
                            required: true,
                            bindLabel: 'title',
                            searchable: false,
                            closeOnSelect: true,
                            bindValue: 'value',
                            options: [...this.behaviourOptions],
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 100,
                            },
                        },
                    },
                    {
                        key: 'grade',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Grade',
                            placeholder: 'Select grade',
                            required: true,
                            bindLabel: 'title',
                            closeOnSelect: true,
                            bindValue: 'value',
                            options: [...this.gradeOptions],
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 100,
                            },
                        },
                    },
                    {
                        key: 'stage_of_disease',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Stage of Disease',
                            placeholder: 'Select stage of disease',
                            required: true,
                            bindLabel: 'title',
                            closeOnSelect: true,
                            bindValue: 'value',
                            options: [...this.stageOptions],
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 100,
                            },
                        },
                    },
                    {
                        key: 'additional_notes',
                        type: 'textarea',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Additional Notes',
                            placeholder: 'Enter additional notes',
                            rows: 3,
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
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.loadCondition();

        this.behaviourOptions = behaviourConcepts;

        this.gradeOptions = gradeConcepts;

        this.stageOptions = stageConcept;
    } /**
    /**
     *  switchMapDiagnosisFunction
     * Gets the diagnosis using the getCondition function
     */
    switchMapConditionFunction = (term: any) =>
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
    getCondition(term: any): Observable<Condition[]> {
        const params = {
            q: term,
        };
        return this.dataLayer
            .list('ocl-diagnoses', params)
            .pipe(map(this.responseFunction as any));
    }

    responseFunction = (resp: any[]) => {
        function selectFewerFields(select: any) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { id, display_name, source, uuid, owner } = select;
            return { id, display_name, source, uuid, owner };
        }
        const newArr = resp.map(selectFewerFields);
        return newArr;
    };
}

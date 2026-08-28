import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { listAnimation } from '../../../animations/list-animations';
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
import _ from 'underscore';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { UIRouterGlobals } from '@uirouter/angular';

@Component({
    selector: 'ngx-sil-form-combobox',
    templateUrl: './sil-combobox.component.html',
    animations: [listAnimation],
    styleUrls: ['./sil-combobox.component.scss'],
    standalone: false,
})
export class SilFormComboboxComponent
    extends FieldType<FieldTypeConfig>
    implements OnInit
{
    /**
     * Used to return response from search store
     */
    @Output() filteredItemResponse: EventEmitter<any> = new EventEmitter<any>();
    /** extends params used while fetching  */
    extendParams: any;
    /** receives the store */
    store: any;
    /** term being searched */
    term: string;
    /** id being filtered */
    itemId: string;

    /** flag indicating that the combobox show search for the initially set data from the model being edited */
    isEdit: boolean;
    /**
     * Boolean holding the cancel btn clicked state
     */
    cancelBtnClicked: boolean = false;
    /** binding label used in dropdwon  */
    bindLabel: any;
    /** binding label for object items used in dropdwon  */
    objectLabel: any;
    /** bindValue is the value selected from the dropdown  */
    bindValue: any;
    /** use filters from the state params */
    useStateParamFilters?: boolean;
    /** use filters from the form model */
    useModelParamFilters?: boolean;
    /** placeholder text */
    placeholder?: string;
    /** Key that contains the array being repeated in the combobox */
    responseKey?: string;
    /** Object used to prefill other items */
    prefillFields?: any;
    /** Keys in the model that need to be set */
    prefillKeys?: any;
    /** Used to check if something is a multiselect */
    isMultiple?: any;
    /** Hide already selected fields */
    hideSelected?: boolean;
    /** Used to set model to item */
    setSelectedItemToModel?: boolean;

    /** extends nested params */
    extendedNestedParams: any;

    /**
     * Subject that checks the search input
     */
    searchInput$ = new Subject<string>();
    /**
     * Contains selected item from the items list
     */
    selectedItem: any;

    /**
     * Sets the button text if modifyItemNotFound is true
     */
    buttonText: string;

    /**
     * Determines whether to modify the 'items not found' tag
     */
    modifyItemNotFound: boolean;

    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Observable that loads the items
     */
    items$: Observable<any>;
    constructor(
        public dataLayer: SilStoresService,
        public toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals
    ) {
        super();
    }

    /**
     *  loadItems
     * Loads the items using a subject and term searched by
     */
    loadItems(event) {
        this.term = event.term;
        this.itemId = event.id;
        this.items$ = concat(
            of([' ']), // default items
            this.searchInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapItemFunction)
            )
        );
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

    responseFunction = resp => {
        if (resp[this.responseKey]) {
            const newArr = resp[this.responseKey].map(item => {
                const rest = { ...item };
                delete rest.disabled;
                return rest;
            });
            this.term = '';
            return newArr;
        } else {
            const rest = { ...resp };
            delete rest.disabled;
            return [rest];
        }
    };

    /**
     * Detects changing of selected item
     */
    changeModel(item) {
        if (this.setSelectedItemToModel) {
            this.model.selectedItem = item;
        }

        this.selectedItem = item;
        this.setPrefillFields(item);
        this.filteredItemResponse.emit(this.selectedItem);
    }

    /**
     * Handle removing of items
     */
    unselect(item, items) {
        const newItems = _.without(items, item);
        this.field.formControl.setValue(newItems);
    }

    /** Set fields to prefill */
    setPrefillFields(item) {
        if (!!this.isEdit) {
            /**
             * Asign item-key values to their corresponding model-key values
             */
            for (let index = 0; index < this.prefillKeys.length; index++) {
                this.model[this.prefillKeys[index]] =
                    item[this.prefillKeys[index]];
            }
        } else {
            for (let index = 0; index < this.prefillKeys.length; index++) {
                if (item[this.prefillFields[this.prefillKeys[index]]]) {
                    this.model[this.prefillKeys[index]] =
                        item[this.prefillFields[this.prefillKeys[index]]];
                    this.form.controls[this.prefillKeys[index]].value =
                        item[this.prefillFields[this.prefillKeys[index]]];
                }
            }
        }
    }

    removeItem() {
        this.cancelBtnClicked = true;
        const event = { term: '' };

        this.term = event.term;
        this.isEdit = this.isEdit ?? false;

        this.items$ = concat(
            of([' ']), // default items
            this.searchInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapItemFunction)
            )
        );
    }

    /**
     *  switchMapItemFunction
     * Gets the queue using the fetchQueues function
     */
    switchMapItemFunction = (term, itemId) =>
        this.fetchItems(term, itemId).pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapFunctionLoading)
        );

    /**
     * fetchItems
     * Gets the items from the api
     */
    fetchItems(term: string = null, itemId: any = null): Observable<any> {
        if (!term) term = this.term;
        if (!itemId) itemId = this.itemId;

        let params = {
            ...(term && { search: term }),
            // active: true,
        };

        if (_.isObject(this.extendParams)) {
            params = Object.assign(params, this.extendParams);
        }

        if (this.useStateParamFilters) {
            if (this.uiglobals.current.data['defaultFilterParams']) {
                const defaultParams = {};
                const parms =
                    this.uiglobals.current.data['defaultFilterParams'];
                for (let index = 0; index < parms.length; index++) {
                    const element = parms[index];
                    for (const key in element) {
                        if (element[key].param) {
                            defaultParams[key] =
                                this.uiglobals.params[element[key].param];
                        } else {
                            defaultParams[key] = parms[index][key];
                        }
                    }
                }
                Object.assign(params, defaultParams);
            }
        }

        if (this.useModelParamFilters) {
            const defaultParams = {};
            const parms = this.props.modelFilters;
            for (let index = 0; index < parms?.length; index++) {
                const param = parms[index];
                defaultParams[param] = this.model[param];
            }
            Object.assign(params, defaultParams);
        }

        if (this.extendedNestedParams) {
            return this.dataLayer
                .listNested(
                    `${this.store}`,
                    this.extendedNestedParams.paramView,
                    this.extendedNestedParams.paramValue,
                    params
                )
                .pipe(map(this.responseFunction));
        }

        if (!!itemId && this.isEdit && !this.cancelBtnClicked) {
            this.cancelBtnClicked = false;
            return this.dataLayer
                .get(`${this.store}`, itemId)
                .pipe(map(this.responseFunction));
        }

        return this.dataLayer
            .list(`${this.store}`, params)
            .pipe(map(this.responseFunction));
    }

    ngOnInit() {
        this.store = this.props.store;
        this.buttonText = this.props.buttonText;
        this.hideSelected = this.props.hideSelected;
        this.modifyItemNotFound = this.props.modifyItemNotFound;
        this.useStateParamFilters = this.props.useStateParamFilters;
        this.responseKey = this.props.responseKey;
        this.bindLabel = this.props.bindLabel;
        this.objectLabel = this.props.objectLabel;
        this.prefillFields = this.props.prefillFields;
        this.prefillKeys = _.isObject(this.prefillFields)
            ? Object.keys(this.prefillFields)
            : [];
        this.bindValue = this.props.bindValue;
        this.extendParams = this.props.extendParams;
        this.useModelParamFilters = this.props.useModelParamFilters;
        this.isMultiple = this.props.isMultiple;
        this.setSelectedItemToModel = this.props.setSelectedItemToModel;
        this.extendedNestedParams = this.props.extendedNestedParams;
        this.isEdit = this.props.isEdit;
        this.cancelBtnClicked = false;

        const keyValue: any = this.key;

        let id = null;

        if (this.model && keyValue in this.model) {
            id = this.model[keyValue];
        }

        const event = this.isEdit ? { term: '', id: id || null } : { term: '' };

        this.loadItems(event);
    }

    isObject(object) {
        if (typeof object === 'string') return false;
        if (Object.keys(object).length > 0) {
            return true;
        } else {
            return false;
        }
    }

    buttonTrigger() {
        this.props?.buttonEvent();
    }
}

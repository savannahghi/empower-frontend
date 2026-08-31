import {
    AfterViewInit,
    Component,
    DoCheck,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { UIRouterGlobals } from '@uirouter/angular';
import {
    Observable,
    Subject,
    catchError,
    concat,
    debounceTime,
    distinctUntilChanged,
    map,
    of,
    startWith,
    switchMap,
    tap,
} from 'rxjs';
import _ from 'underscore';
import { listAnimation } from '../../../animations/list-animations';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
/**
 * Component used to render selects in a form
 */
@Component({
    selector: 'sil-select',
    styleUrls: ['./sil-select.component.scss'],
    animations: [listAnimation],
    templateUrl: './sil-select-component.html',
    standalone: false,
})

/** Constructor for the radio button component */
export class SilFormSelectComponent
    extends FieldType<FieldTypeConfig>
    implements OnInit, AfterViewInit, DoCheck
{
    /**
     * Gets the select options as items
     */
    @Input() items: any[];
    /**
     * Emits event when changes happen
     */
    @Output() events: Event[] = [];
    /**
     * Subject that contains the select options
     */
    options$: any;
    /**
     * Used to return response from search store
     */
    @Output() filteredItemResponse: EventEmitter<any> = new EventEmitter<any>();
    /** receives the store */
    store: any;
    /** use filters from the state params */
    useStateParamFilters?: boolean;
    /** Keys in the model that need to be set */
    prefillKeys?: any;
    /** Object used to prefill other items */
    prefillFields?: any;
    /** Key that contains the array being repeated in the select */
    responseKey?: string;
    /** binding label used in dropdwon  */
    bindLabel: any;
    /** bindValue is the value selected from the dropdown  */
    bindValue: any;
    /** term being searched */
    term?: string;
    /** id being filtered */
    itemId?: string;
    /**
     * Boolean holding the cancel btn clicked state
     */
    cancelBtnClicked?: boolean = false;
    /** flag indicating that the select show search for the initially set data from the model being edited */
    isEdit?: boolean;
    /**
     * Subject that checks the search input
     */
    searchInput$ = new Subject<string>();
    /**
     * Contains selected item from the items list
     */
    selectedItem: any;
    /** Used to set model to item */
    setSelectedItemToModel?: boolean;
    /**
     * Observable that loads the items
     */
    items$?: Observable<any>;
    /**
     * used to determine if the select should close when a value is selected
     */
    closeOnSelect: boolean;
    /**
     * used to determine a loading state
     */
    loading: boolean;

    /**
     * Sets the button text if modifyItemNotFound is true
     */
    buttonText: string;

    /**
     * Determines whether to modify the 'items not found' tag
     */
    modifyItemNotFound: boolean;

    constructor(
        public dataLayer: SilStoresService,
        public uiglobals: UIRouterGlobals
    ) {
        super();
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
    /** extends params used while fetching  */
    extendParams: any;

    /**
     *  catchErrorFunction
     * Catches the error from the typeahead
     */
    catchErrorFunction = () => of([]);

    /**
     * Detects changing of selected item
     */
    changeModel(item: any) {
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
    unselect(item: any, items: any) {
        const newItems = _.without(items, item);
        this.field.formControl.setValue(newItems);
    }
    /** Set fields to prefill */
    setPrefillFields(item: any) {
        if (this.isEdit) {
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
                    (this.form.controls as { [key: string]: AbstractControl })[
                        this.prefillKeys[index]
                    ].setValue(
                        item[this.prefillFields[this.prefillKeys[index]]]
                    );
                }
            }
        }
    }
    responseFunction = (resp: any) => {
        if (resp[this.responseKey as any]) {
            const newArr = resp[this.responseKey as any];
            this.term = '';
            return newArr;
        } else {
            const list = [];
            list.push(resp);
            return list;
        }
    };
    /**
     *  loadItems
     * Loads the items using a subject and term searched by
     */
    loadItems(event: any) {
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
    switchMapItemFunction = (term: any, itemId: any) =>
        this.fetchItems(term, itemId).pipe(
            catchError(this.catchErrorFunction),
            tap(this.tapFunctionLoading)
        );
    fetchItems(term: any = null, itemId: any = null): Observable<any> {
        if (!term) term = this.term;
        if (!itemId) itemId = this.itemId;

        const params = {
            ...(term && { search: term }),
        };

        if (this.useStateParamFilters) {
            if (this.uiglobals.current.data['defaultFilterParams']) {
                const defaultParams = {} as any;
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
    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.options$ = this.props.options;
        this.modifyItemNotFound = this.props.modifyItemNotFound;
        this.buttonText = this.props.buttonText;

        this.store = this.props['store'];
        this.useStateParamFilters = this.props['useStateParamFilters'];
        this.responseKey = this.props['responseKey'];
        this.bindLabel = this.props['bindLabel'];
        this.prefillFields = this.props['prefillFields'];
        this.bindValue = this.props['bindValue'];
        this.cancelBtnClicked = false;
        this.prefillKeys = _.isObject(this.prefillFields)
            ? Object.keys(this.prefillFields)
            : [];
        const keyValue: any = this.key;

        const event = this.isEdit
            ? { term: '', id: this.model[keyValue] || null }
            : { term: '' };

        this.loadItems(event);
    }

    /**
     * Hook called when component has been drawn up on the view
     */
    ngAfterViewInit() {
        this.field.formControl?.setValue(this.field.defaultValue);
    }

    ngDoCheck(): void {
        this.options$ = this.props.options;
    }

    buttonTrigger() {
        this.props?.buttonEvent();
    }

    onChange($event) {
        this.events.push($event);
    }
}

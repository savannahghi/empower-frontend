import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { SilStoresService } from '../sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../sil-http-services/error-handler';
import _ from 'underscore';
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

@Component({
    selector: 'sil-combo-box',
    templateUrl: './sil-combo-box.component.html',
    styleUrl: './sil-combo-box.component.scss',
    standalone: false,
})
export class SilComboBoxComponent implements OnInit {
    /**
     * conditional check when item has not been found
     */
    itemNotFound: boolean = false;

    /**
     * option to add new item
     */
    @Input() addItemOption?: boolean = false;

    /**
     * Add item text
     */
    @Input() addNewItemText?: string;

    /**
     * Used to return response from search store
     */
    @Output() filteredItemResponse: EventEmitter<any> = new EventEmitter<any>();

    /** receives the store */
    @Input() store: any;

    /** term being searched */
    @Input() term: string;

    /** extends params used while fetching  */
    @Input() extendParams: any;

    /** bind used in dropdwon  */
    @Input() bind: any;

    /** bind used in dropdwon  */
    @Input() bindObject: any;

    /**
     * Used for multiselect
     */
    @Input() isMultiple: boolean = false;

    /** Used to display nested options in dropdwon  */
    @Input() nestedValue: string;

    @Input() responseKey?: string;

    @Input() placeholder?: string;

    @Input() dataTestID?: string;

    @Input() modifyQueueList: boolean = false;

    @Input() practitionerList?: boolean = false;

    /** Act on next action when item searched has not been found */
    @Output() addNewItem: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Subject that checks the search input
     */
    @Input() searchInput$ = new Subject<string>();

    /**
     * Observable that loads the items
     */
    items$: Observable<any>;

    /** sorts the items array in alphabetic order */
    @Input() sort: boolean = false;

    @Input() isService: boolean = false;

    /**
     * Contains selected item from the items list
     */
    selectedItem: any;

    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Used to override default form configurations
     */
    formConfig: Object;

    /**
     * Component constructor
     * @param dataLayer - Connects to the datalayer service
     * @param errorHandler - Connects to the error handler service
     */
    /**
     *
     * @param dataLayer - Connects to the datalayer service
     * @param errorHandler - Connects to the error handler service
     */
    constructor(
        private dataLayer: SilStoresService,
        protected toastrService: NbToastrService,
        private errorHandler: ErrorHandlerService
    ) {}

    /**
     *  loadItems
     * Loads the items using a subject and term searched by
     */
    loadItems(event) {
        this.term = event.term;
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
     * Detects changing of selected item
     */
    changeModel(item) {
        this.selectedItem = item;
        this.filteredItemResponse.emit(this.selectedItem);
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
     *  switchMapItemFunction
     * Gets the queue using the fetchQueues function
     */
    switchMapItemFunction = term =>
        this.fetchItems(term).pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapFunctionLoading)
        );

    /**
     *  fetchItems
     * Gets the items from the api
     */
    fetchItems(term: string = null): Observable<any> {
        if (!term) term = this.term;
        let params: {
            page_size: number;
            active: boolean;
            search?: string;
        } = {
            page_size: 100,
            active: true,
        };

        if (this.term.trim()) {
            params = {
                ...params,
                search: term,
            };
        }

        if (_.isObject(this.extendParams)) {
            params = Object.assign(params, this.extendParams);
        }

        if (this.responseKey !== undefined) {
            return this.dataLayer
                .create(
                    `${this.store}`,
                    { review_type: 'PROFILE_LINKING' },
                    params
                )
                .pipe(map(this.responseFunction));
        } else {
            return this.dataLayer
                .list(`${this.store}`, params)
                .pipe(map(this.responseFunction));
        }
    }

    responseFunction = resp => {
        /** sorts alphabetically */
        if (this.sort) {
            resp?.results.sort((a, b) => {
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            });
        }

        function selectFewerFields(select) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            /* const { id, name } = select;
               return { id, name }; */
            return select;
        }

        let response;
        if (this.responseKey !== undefined) {
            response = resp[this.responseKey];
        } else if (this.modifyQueueList) {
            const allQueues = resp?.results;
            const queues: any[] = [];
            if (Array.isArray(allQueues)) {
                allQueues.forEach((queue: any) => {
                    if (queue['name'] !== 'Check-in Queue | OTHER') {
                        queues.push(queue);
                    }
                });
                response = queues.filter(item => {
                    const binding = this.bind ? item[this.bind] : item.name;
                    return (
                        binding
                            .toLocaleLowerCase()
                            .indexOf(this.term.toLocaleLowerCase()) > -1
                    );
                });
            }
        } else if (this.practitionerList) {
            response = resp.results.map(practitioner => {
                if (practitioner.person.title) {
                    practitioner.person.person_display =
                        practitioner.person.title +
                        ' ' +
                        practitioner.person.person_display;
                }
                return {
                    id: practitioner.id,
                    description: practitioner.person.person_display,
                    specialty: practitioner.qualification,
                };
            });
        } else {
            response = resp.results.filter(item => {
                const binding = this.bindObject
                    ? item[this.bindObject][this.bind]
                    : this.bind
                    ? item[this.bind]
                    : item.name;
                return (
                    binding
                        .toLocaleLowerCase()
                        .indexOf(this.term.toLocaleLowerCase()) > -1
                );
            });
        }

        if (response) {
            const newArr = response.map(selectFewerFields);
            this.term = '';
            if (this.addItemOption && newArr && newArr.length === 0) {
                this.itemNotFound = true;
            }
            return newArr;
        }
    };

    // Function to handle when new item needs to be added
    onAddNewItem() {
        this.addNewItem.emit();
    }

    resetTermAndFetchItems() {
        this.term = ''; // Reset the term
        const event = { term: '' }; // Prepare the event object with an empty term
        this.loadItems(event); // Fetch items with the empty term
    }

    /** Refetch items once the user focuses in the input field, important to ensure items are up to date */
    handleFocusIn() {
        this.resetTermAndFetchItems();
    }

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'modelChange',
        };
        const event = { term: '' };
        this.loadItems(event);
    }
}

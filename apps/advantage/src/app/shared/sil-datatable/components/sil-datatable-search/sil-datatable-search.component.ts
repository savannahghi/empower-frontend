import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Transition, UIRouterGlobals } from '@uirouter/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - style: contains the scss file used to style the component
 * - template: contains the html structure of the component
 */
@Component({
    selector: 'sil-datatable-search',
    styleUrls: ['./sil-datatable-search.component.scss'],
    template: ` <nb-form-field fullWidth>
        <nb-icon nbPrefix icon="search-outline" pack="eva"></nb-icon>
        <input
            nbInput
            fullWidth
            style="display:block !important"
            type="text"
            name="searchValue"
            placeholder="{{ searchPlaceholder || 'Search...' }}"
            [(ngModel)]="searchValue"
            (ngModelChange)="this.searchValueUpdate.next($event)"
            fieldSize="medium"
            data-testid="sil-datatable-search" />
    </nb-form-field>`,
    standalone: false,
})
export class SilDatatableSearchComponent implements OnInit {
    /**
     * Search param that will be used to search on the API.
     */
    @Input() searchParam: any;
    /**
     * Placeholder text for the search
     */
    @Input() searchPlaceholder: string;

    /**
     * Contains pagination data from server
     */
    @Input() paginationData: any;

    /**
     * Contains the page queryed by pagination to move to a page
     */
    @Input() pageParam: any;

    /**
     * Event sent back to the datatable getData() method
     *
     */
    @Output() searchFilterArg = new EventEmitter();

    /**
     * Event that sends pagination preference to an api
     */
    @Output() pageEvent = new EventEmitter<any>();

    /**
     * The value set for searching
     *
     */
    searchValue: string = '';

    /**
     * search input subject
     *
     */
    searchValueUpdate = new Subject<string>();

    /**
     * constructor for the class
     */

    constructor(
        public transition: Transition,
        public uiglobals: UIRouterGlobals
    ) {}

    /**

    Hook called when component is initialized
    */
    ngOnInit() {
        this.setSearchParam();
        if (this.uiglobals.params.search) {
            this.searchValue = this.uiglobals.params.search;
        }
        this.searchValue = this.transition?.params().search ?? '';

        this.searchObservable();
    }

    /**
     * Observable that gets the search value
     *
     */
    searchObservable() {
        this.searchValueUpdate
            .pipe(debounceTime(2000), distinctUntilChanged())
            .subscribe(this.searchValueEmit);
    }

    /**
     * Emits the value from search input
     *
     */
    searchValueEmit = value => {
        const val = this.checkIfSearchValueIsPhoneNumber(value);
        this.removePageParam();
        const search = {};
        const searchParam = this.searchParam;
        search[`${searchParam}`] = val;
        this.searchFilterArg.emit(search);
    };

    /**
     * Check if the search param is a phone number
     */
    checkIfSearchValueIsPhoneNumber(val) {
        let newVal = val;
        if (val.startsWith('07')) {
            newVal = val.replace('07', '+2547');
        }
        return newVal;
    }

    /**
     * Set the search parameter sent
     *
     */
    setSearchParam() {
        this.searchParam = this.searchParam ? this.searchParam : 'search';
    }

    /**
     * On search for an item on the datatable, the page is removed
     * from the object
     *
     */
    removePageParam() {
        if (
            this.paginationData &&
            this.paginationData.current_page > 1 &&
            this.pageParam
        ) {
            delete this.pageParam.page;
        }
    }
}

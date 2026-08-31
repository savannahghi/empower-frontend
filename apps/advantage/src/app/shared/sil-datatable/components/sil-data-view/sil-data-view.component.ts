import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import _ from 'underscore';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';

/*
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'sil-data-view',
    templateUrl: './sil-data-view.component.html',
    styleUrl: './sil-data-view.component.scss',
    standalone: false,
})
/**
 * Definition of the Data View component class which extends from Sil-datatable
 * Class that renders the Data View Component
 */
export class SilDataViewComponent implements OnInit {
    /**
     * Used to load the data into the datatable assigned from sil datatable parent component
     */
    @Input() apilist: Array<any> = [];

    /**
     * Array with the actions a datatable has
     */
    @Input() actions: Array<any>;

    /**
     * Used to give the sil-data-view component access to a search bar: default is false
     */
    @Input() cardListSearch?: boolean = false;

    /**
     * Used to give the datatable access to a search bar: default is false
     */
    @Input() searchPlaceholder?: string = 'Search...';

    /**
     * Contains the search input
     */
    searchInput?: string = '';

    /**
     * Used to populate the description text based on the sender Ids sender_type
     */
    senderIdDescriptionText: Object = {
        TRANSACTION: ' messages e.g. OTPs, Appointment reminders',
        PROMOTION: ' messages e.g. Offers',
    };

    onSearch: boolean;

    /**
     * Contains the search parameters
     */
    @Input() searchParams?: Object = {};

    /**
     * emitted when a custom function action button is clicked
     */
    @Output() customFxn = new EventEmitter<string>();
    /**
     * Used to determine whether loading is complete
     */
    @Input() loading: boolean = true;

    /**
     * Table Crud actions
     */
    @Input() headerActions: Array<any>;

    /** Boolean used to determine if the sil-data-view is dynamic */
    @Input() dynamic?: boolean;

    /** contains rest function e.g. list, get, update, remove */
    @Input('rest-fxn') restFxn?: string;

    /** contains store string e.g. patients, appointments */
    @Input('rest-api') restApi?: string;

    /** contains view in a nested list */
    @Input() view?: string;

    /** contains the id to be used in a nested list*/
    @Input() nestedId?: string;

    /**
     * Used to set workstation used to fetch data
     */
    @Input() workstation;

    /**
     * Object used to contain default filters to the datatable api call
     */
    @Input() defaultQueryArg: any;

    /**
     * Array of state params the datatable should not use for filtering
     */
    @Input() ignoreStateParams: any;

    /**
     * Object used to set final filters to use in the datatable
     */
    queryArg: any;

    /**
     * Used to give the datatable header titles for each column
     */
    @Input() headers: Array<any>;

    /**
     * Used to give the datatable the fields to display assigned from parent component
     */
    @Input() rows: Array<any> = [];

    /**
     * Adds a numbered column to the data table
     */
    @Input() addIndexColumn: boolean;

    /** contains custom styles configuration for the table grid row */
    @Input('custom-grid-styles') customGridStyles: any;

    /** contains include image option */
    @Input('has-image') hasImage: boolean = false;

    /** contains row image path */
    @Input('row-image-path') imagePath: string = '';

    /**
     * emit selected row
     */
    @Output() selectedRow = new EventEmitter();

    /**
     * Contains the pagination data
     * @param paginationData
     * */

    paginationData: any;

    filters: any;

    /**
     * Method that defines the actions that can be done as a grid action.
     *
     * A grid action can be used toggle different components or to navigate to a different component
     */

    gridActions = {
        stateGo: (row, actConf) => {
            let params = {};
            if (actConf.stateParams && !actConf.activeStateParams) {
                params = this.transformStateParams(params, row, actConf);
            } else if (actConf.activeStateParams && !actConf.stateParams) {
                params = this.transformActiveStateParams(params, actConf);
                params['id'] = row.id;
            } else if (actConf.activeStateParams && actConf.stateParams) {
                const filterKeys = _.keys(actConf.stateParams);
                for (let i = 0; i < filterKeys.length; i++) {
                    params = this.transformStateParams(params, row, actConf);
                    params = this.transformActiveStateParams(params, actConf);
                }
            } else {
                params['id'] = row.id;
            }
            this.$state.go(actConf.state, params, { inherit: false });
        },
        custom: (row, actConf) => {
            if (actConf.customFxn) {
                this.customFxn.emit(row);
                if (actConf.filterOnSelection) {
                    const filteredRows = this.apilist.filter(
                        item => item.id !== row.id
                    );
                    this.apilist = filteredRows;
                }
            }
        },
    };
    /** Get state params from the data on the row */
    transformStateParams(params, row, actConf) {
        const filterKeys = _.keys(actConf.stateParams);
        for (let i = 0; i < filterKeys.length; i++) {
            /** Uses state params to set query params for state navigation
             * e.g
             * a data value from a table row '.visit' can be used
             * to set a value for a state param 'id' as shown below:
             *
             * {
             *   id: 'visit',
             * }
             *
             * The stateParam above would produce an object that looks like this:
             *
             * { id: '123123' }
             *
             * '123123' would come from the table row field 'visit'
             */
            if (!actConf.stateParams[filterKeys[i]].includes('.')) {
                params[filterKeys[i]] = row[actConf.stateParams[filterKeys[i]]];
            } else {
                const value = this.mineValue(
                    row,
                    actConf.stateParams[filterKeys[i]]
                );
                params[filterKeys[i]] = value;
            }
        }
        return params;
    }

    /**
     * Function to navigate to the create page state
     * @param stateData state params
     */
    navigateToCreateRecord(stateData) {
        this.$state.go(stateData.state, {
            ...stateData.stateParams,
        });
    }
    /**
     * Method used get a nested value
     */
    mineValue(obj, path) {
        if (!path) return obj;
        const properties = path.split('.');
        let current = obj;

        for (let i = 0; i < properties.length; i++) {
            if (!current) {
                return undefined;
            }
            current = current[properties[i]];
        }

        return current;
    }

    /** Set params that come from active state params */
    transformActiveStateParams(params, actConf) {
        // loop through activeStateParams
        for (let i = 0; i < actConf.activeStateParams.length; i++) {
            params[actConf.activeStateParams[i]] =
                this.uiglobals.params[actConf.activeStateParams[i]];
        }
        return params;
    }

    /**
     * Used to determine how to structure the row card
     * segment: for segment messages
     * template: for template messages
     * schedule: to display messages in recurrent schedules
     */
    @Input() messageParentType?: string = '';
    /**
     * Used to define what template should be used for the row card
     * Options
     * tableRow - for message cards
     * rowInput - for modal forms
     */
    @Input() rowTemplate?: string = '';
    /**
     * The component constructor
     * @param translate instance of TranslationService
     * @param cookieService instance of cookieService
     * @param $state Access instance of the state service
     * @param uiglobals Access instance of uirouter global service
     */
    constructor(
        private translate: TranslateService,
        private cookieService: Cookies,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        private errorHandler: ErrorHandlerService,
        public dataLayer: SilStoresService
    ) {
        this.translate.setFallbackLang('en');
        this.translate.use(this.selectedLanguage);
    }
    /**
     * Saves the selected language from the cookie
     */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /**
     * Method used to determine what the datatable should filter by
     */
    determineQueryFilters(obj) {
        /**
         * start out by adding the default filters
         */
        let params = _.clone(this.defaultQueryArg);
        params = _.isObject(params) ? params : {};
        /**
         * next add in filters from the filter form
         */
        const filters = _.isObject(obj) ? obj : {};
        params = _.extend(params, filters);
        this.queryArg = params;
        /**
         * Omit explicitly ignored filters
         */
        const ignoreStateParams =
            this.ignoreStateParams !== undefined ? this.ignoreStateParams : [];
        params = _.omit(params, ignoreStateParams);
        return params;
    }

    /**
     * Method used to fetch data or display data on the datatable
     */
    getData(searchValue: string = this.searchInput, obj?) {
        this.loading = true;
        /**
         * This limits double API calls for tables such as templates table that
         * inherit search and pagiantion features from the parent datatable component
         */
        if (this.restFxn && this.cardListSearch) {
            const filterparams = this.determineQueryFilters(obj);
            Object.assign(
                filterparams,
                this.defaultQueryArg,
                this.searchParams
            );
            filterparams['search'] = searchValue;
            const observable =
                this.restFxn === 'listNested'
                    ? this.dataLayer[this.restFxn](
                          this.restApi,
                          this.view,
                          this.nestedId,
                          filterparams
                      )
                    : this.dataLayer[this.restFxn](
                          this.restApi,
                          filterparams,
                          this.workstation
                      );
            observable.subscribe({
                next: (response: any) => {
                    /** Default behaviour for apis such as erp and advantage */
                    const pagination = response.edges
                        ? _.omit(response, 'edges')
                        : _.omit(response, 'results');
                    this.paginationData = pagination;
                    this.apilist = response.edges
                        ? response.edges
                        : !_.isUndefined(response.data) && response.data.results
                        ? response.data.results
                        : response.results
                        ? response.results
                        : response;

                    this.loading = false;
                    if (searchValue) this.onSearch = true;
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                },
            });
        } else {
            // data already supplied via apilist
            this.dynamic = true;
            this.apilist = this.apilist;

            setTimeout(() => {
                this.loading = false;
            }, 1000);
        }
    }

    /**
     * Refresh results after empty search
     */
    refreshResults() {
        this.getData('');
        [this.searchInput, this.onSearch] = ['', false];
    }

    /**
     * Search event function
     */
    searchOnEnter(event) {
        this.searchInput = event.target.value;
        if (event.code === 'Enter' && this.searchInput.length > 2) {
            // search the event field from this place
            this.getData(this.searchInput);
        }
    }
    /**
     * Uses a form to filter the api data
     */
    filterData(model) {
        this.filters = JSON.parse(JSON.stringify(model));
        this.getData('', this.filters);
    }

    /**
     * Event that emits the row selected
     */
    selectRow(row) {
        this.selectedRow.emit(row);
    }

    /**
     * Used to override the oninit function on sil-datatable.
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.getData();
    }
}

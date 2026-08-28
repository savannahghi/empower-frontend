import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule,
    NbThemeModule,
    NbToastrService,
} from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import {
    StateService,
    UIRouterGlobals,
    UIRouterModule,
} from '@uirouter/angular';
import { Cookies } from '../cookies/cookie.service';
import { SilDatatableComponent } from '../sil-datatable/components/sil-datatable/sil-datatable.component';
import { SilDatatableModule } from '../sil-datatable/sil-datatable.module';
import { SkikaFormModule } from '../sil-form/sil-form.module';
import { ErrorHandlerService } from '../sil-http-services/error-handler';
import { SilStoresService } from '../sil-http-services/sil_datalayer.service';
import { SkikaLayoutModule } from '../sil-layout/sil-layout.module';
import { NgxTranslateModule } from '../translate/translate.module';

import { AuthenticationService } from '../../@core/auth/services/authentication.service';
import { SegmentDeliveryMetricsComponent } from '../../features/advantage/engagement/segment-delivery-metrics/segment-delivery-metrics.component';
import { DetailComponentService } from '../detail/detail.services';
import { ListComponentService } from './list.services';

interface DownloadRecordInterface {
    store: string;
    showButton: boolean;
    hasNoRecord: boolean;
}

@Component({
    selector: 'ngx-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    imports: [
        NgSelectModule,
        FormsModule,
        CommonModule,
        NgxTranslateModule,
        SilDatatableModule,
        NbCardModule,
        NbButtonModule,
        NbThemeModule,
        NbSpinnerModule,
        SkikaLayoutModule,
        SkikaFormModule,
        UIRouterModule,
        SegmentDeliveryMetricsComponent,
    ],
    providers: [TranslateService, ListComponentService, DetailComponentService],
})
export class ListComponent implements OnInit, OnDestroy {
    /**
     * Defines the record
     */
    record: any;

    /**
     * Datatable rest fxn
     */
    restFxn: any;

    /**
     * Backend view for nested endpoints
     */
    view: any;

    /**
     * Defines the table's rows
     */
    rows: Array<any>;

    etimsRows: Array<any>;

    /**
     * Defines the actions on the top of the page
     */
    headerActions: Array<any>;
    etimsHeaderActions: Array<any>;

    /**
     * Defines the table's actions
     */
    actions: Array<any>;
    actionsEtims: Array<any>;

    /**
     * Used to display different toggle modals
     * information
     */
    toggle: Object = {};

    /**
     * Used to display different loading sections
     */
    loading: Object = {};

    /**
     * Used to display select elements
     */
    hasSelector: boolean = false;

    /**
     * Used to hide the create button from the list page
     */
    hideCreateButton: Object = {};

    formData: any;

    /**
     * Used to display different submit sections
     */
    submitted: Object = {};

    /**
     * Defines the header columns of the table
     */
    tableHeader: Array<any>;

    etimsTableHeader: Array<any>;

    /**
     * Used to define a different source of data
     */
    dontUseStore: boolean;

    /**
     * Used to set apilist from resolved data
     */
    resolvedDataKeyAsApiList: any;

    /**
     * Used to tell if the list is a tabbed view
     */
    isTabList: boolean;

    /**
     * Used to set a search placeholder
     */
    searchPlaceholder: string;

    /**
     * Used to set a search placeholder
     */
    @Input() placeholder: string;

    /**
     * Used to set a search box styling
     */
    searchClassName: string;

    /**
     * State used to navigate use to create a record
     */
    @Input() createState:
        | string
        | {
              state: string;
              params: Record<string, any>;
              stateParams: Record<string, string>;
          };
    /**
     * state params to be passed to the create state
     */
    createStateParams: Record<string, any>;

    /** Used in the datatable to set the data */
    apiList: Array<any>;

    /**
     * Used to get a reference of siltable used in the template
     */
    statusFilters: Array<any>;

    /** sets the workstation that is used */
    workstation: object;

    /** sets the branch that is used */
    branch: string;

    /**
     * Contains the select field info
     */
    statusSelector: Array<any>;
    etimsStatusSelector: Array<any>;

    /** Used to filter datatable params */
    filterParams: Object;
    /**
     * Defines the selector used to access the sil-table component
     * in the template.
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Used for the page title
     */
    @Input() pageTitle: any;

    /**
     * Used for the page sub-title
     */
    @Input() pageSubTitle: any;

    /**
     * Contains the resource being fetched
     */
    @Input() store: any;

    /**
     * Boolean used to determine if the table row is a card
     */
    @Input() isCardRow: boolean = false;

    /**
     * Used to determine how to structure the row card
     * schedule: to display messages in recurrent schedules
     */
    @Input() messageParentType?: string = '';

    /**
     * Contains the formly name used to draw up the form
     */
    @Input() formlyJsonFilename: any;

    /**
     * Contains the formly name used to draw up the form
     */
    formlyServiceFilename: any;

    /**
     * Contains the label of the store e.g. organisation Unit
     */
    @Input() storeLabel: any;

    /**
     * This defines the view of the fetch method of the datatable
     */
    @Input() nestedId: any;

    /**
     * Contains the download label of the store
     */
    @Input() storeDownloadLabel: string;

    /**
     * contains create record dialogue title
     */
    @Input() createRecordHeading: string;
    /**
     * holds download records details
     */
    downloadRecord: DownloadRecordInterface;

    /**
     * Contains the current state name
     */
    currentStateName: any;

    /**
     * stores default state params
     */
    defaultStateParams: any;

    /**
     * Contains extra params to filter the backend by
     */
    @Input() extraParams: any;

    /**
     * Contains an array of state params the datatable should not filter by
     */
    @Input() ignoreStateParams: any;
    /**
     * Ensure default params are not overriden
     */
    @Input() dontOverrideDefaultParams: any;
    /**
     * Contains state params that must be retained when reloading the state
     */
    @Input() activeStateParams: any;

    /**
     * Contains extra params to post in the backend
     */
    @Input() extraPayload: any;

    /**
     * Used for lists that are in a detail endpoint
     */
    @Input() detailList: any;

    /**
     * Used for display the search bar
     */
    @Input() hasSearch: any;

    /**
     * Used to filter rows from api
     */
    @Input() computedParams: Record<string, string> = {};

    /*
     * Used to determine if the branch data is required
     */
    listBranchData: false;

    /**
     * Contains the observable resolved from the state service
     */
    @Input() recordDetailObservable: any;

    /**
     * Stores information from the row
     */
    rowDetails: any;
    /**
     * stores details to be listed on the custom modal
     */
    customModalDetails: any;

    /**
     * Contains the empty state list title
     */
    emptyStateTitle?: string;

    /**
     * Contains the empty state message
     */
    emptyStateMessage?: string;

    /**
     * Contains the namespace for sil-table
     */
    namespace?: string;

    /**
     * Contains the search param
     */
    searchParam?: string;

    /**
     * Contains the empty state custom image
     */
    emptyStateImage?: string;

    /**
     * Contains the empty state custom image styles
     */
    emptyStateImageStyles?: string;

    /**
     * Used to show modal filters modal
     */
    hasModalFilters?: boolean = false;

    /**
     * Used to show download button
     */
    hasDownloadButton?: boolean = false;

    /**
     * Used to set title for modal tag filters
     */
    modalFiltersTitle?: string;

    /**
     * Contains list of modal filters
     */
    modalFilters?: Array<any>;

    /**
     * Contains configuration for the tags modal
     */
    modalFiltersConf?: { [key: string]: any };

    /**
     * Contains the download list table method
     */
    downloadButtonRequest?: string;

    /**
     * Toggles modal
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * showToast - Used to display a toast using the nebular toast service
     * @param position - defines the toast's position e.g. bottom-right
     * @param status - defines the status being used e.g. success, danger, info
     * @param title - defines what the title of the toast is
     * @param msg - defines what the message in the toast is
     */
    showToast(position, status, title, msg) {
        const duration = 5000;
        this.toastrService.show(`${msg}`, title, {
            position,
            status,
            duration,
        });
    }

    /**
     * Constructor used for list component class
     */
    constructor(
        protected dataLayer: SilStoresService,
        protected toastrService: NbToastrService,
        protected errorHandler: ErrorHandlerService,
        public translate: TranslateService,
        public uiglobals: UIRouterGlobals,
        public cookieService: Cookies,
        public detailService: DetailComponentService,
        public listService: ListComponentService,
        public state: StateService,
        public auth: AuthenticationService
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    /**
     * Fetches the record details
     */
    waitForRecord() {
        this.recordDetailObservable.subscribe(
            (response: any) => {
                this.record = response;
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }

    /**
     * Fetch the selected language */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /** Setup data coming from data */
    setupDataFromState() {
        /**
         * Read data from apiList in uiglobals if it exists
         */
        this.apiList = this.uiglobals.current.data['apiList'];

        this.currentStateName = this.uiglobals.current.name;

        this.defaultStateParams = this.uiglobals.params;

        /** This prevents the datatable from fetching results from a store */
        this.dontUseStore = this.uiglobals.current.data['dontUseStore'];
        /** This is used to know if the datatable is a tabbed view */
        this.isTabList = this.uiglobals.current.data['isTabList'];
        /** When a store is not used,
         * this key tells the datatable where to get the list of records
         */
        this.resolvedDataKeyAsApiList =
            this.uiglobals.current.data['resolvedDataKeyAsApiList'];
        if (this.uiglobals.current.data['apiList']) {
            this.apiList = this.uiglobals.current.data['apiList'];
        }
        /**
         * This defines the rows of the datatable
         */
        this.rows = this.uiglobals.current.data['rows'];

        // Check if there is special etims rows for the table
        if (
            this.auth.checkPermission('erp.perform_etims_operations') &&
            this.uiglobals.current.data['etimsRows']
        ) {
            this.rows = this.uiglobals.current.data['etimsRows'];
        }

        /**
         * This enables the search feature on the datatable
         */
        this.hasSearch = this.uiglobals.current.data['hasSearch'];

        /**
         * Configures the hasSelecter property
         */
        this.hasSelector = this.uiglobals.current.data['hasSelector'];

        /**
         * This sets the placeholder for the search box
         */
        this.searchPlaceholder =
            this.uiglobals.current.data['searchPlaceholder'];

        /**
         * This sets the search param
         */
        this.searchParam = this.uiglobals.current.data['searchParam'];

        /**
         * This sets the placeholder for the status box
         */
        this.placeholder = this.uiglobals.current.data['placeholder'];

        /**
         * This sets the placeholder for the search box
         */
        this.searchClassName = this.uiglobals.current.data['searchClassName'];

        /**
         * This defines the table headers of the datatable
         */
        this.tableHeader = this.uiglobals.current.data['tableHeader'];

        // Check if there is special etims headers for the table
        if (
            this.auth.checkPermission('erp.perform_etims_operations') &&
            this.uiglobals.current.data['etimsTableHeader']
        ) {
            this.tableHeader = this.uiglobals.current.data['etimsTableHeader'];
        }
        /**
         * This defines the status filters of datatable
         */
        this.statusFilters = this.uiglobals.current.data['statusFilters'];
        /**
         * Sets the status selector fields
         */
        this.statusSelector = this.auth.checkPermission(
            'erp.perform_etims_operations'
        )
            ? this.uiglobals.current.data['etimsStatusSelector']
            : this.uiglobals.current.data['statusSelector'];
        /**
         * This is used for the form information
         */
        this.extraPayload = this.uiglobals.current.data['extraPayload'];

        /**
         * This defines the actions of the datatable
         */
        this.actions = this.uiglobals.current.data['actions'];

        // Check if there is special etims actions for the table
        if (
            this.auth.checkPermission('erp.perform_etims_operations') &&
            this.uiglobals.current.data['actionsEtims']
        ) {
            this.actions = this.uiglobals.current.data['actionsEtims'];
        }

        /**
         * This defines the method of the fetch method of the datatable
         */
        this.restFxn = this.uiglobals.current.data['restFxn'] || 'list';
        /**
         * This defines the view of the fetch method of the datatable
         */
        this.view = this.uiglobals.current.data['view'];
        /**
         * This defines if the rows are cards if set to true
         * or table rows if set to false
         */
        this.isCardRow = this.uiglobals.current.data['isCardRow'];
        /**
         * Used to determine how to structure the row card
         * schedule: to display messages in recurrent schedules
         */
        this.messageParentType =
            this.uiglobals.current.data['messageParentType'];

        /**
         * This defines the page title and sizing is affected by isTabList boolean
         */
        this.pageTitle = this.uiglobals.current.data['pageTitle'];
        /**
         * This defines the page sub title and sizing is affected by isTabList boolean
         */
        this.pageSubTitle = this.uiglobals.current.data['pageSubTitle'];
        /**
         * This defines the page title and sizing is affected by isTabList boolean
         */
        this.headerActions = this.auth.checkPermission(
            'erp.perform_etims_operations'
        )
            ? this.uiglobals.current.data['etimsHeaderActions']
            : this.uiglobals.current.data['headerActions'];
        /**
         * Ensure params don't filter datatable
         */
        this.ignoreStateParams =
            this.uiglobals.current.data['ignoreStateParams'];

        /**
         * Add active state params to the datatable
         */
        this.activeStateParams =
            this.uiglobals.current.data['activeStateParams'];

        /**
         * Ensure default params are not overriden
         */
        this.dontOverrideDefaultParams =
            this.uiglobals.current.data['dontOverrideDefaultParams'];
        /**
         * This hides the create button if not needed in the list
         */
        this.hideCreateButton = this.uiglobals.current.data['hideCreateButton'];
        /**
         * This is a state name that directs the user to where they can create a new record
         */
        this.createState =
            this.createState ?? this.uiglobals.current.data['createState'];

        /**
         * allow consumer to pass params to createState or define how they are mapped from the global state
         */
        if (typeof this.createState == 'object' && this.createState?.state) {
            if (this.createState.params) {
                this.createStateParams = this.createState.params;
            }
            if (this.createState.stateParams) {
                this.createStateParams = Object.entries(
                    this.createState.stateParams
                ).reduce((acc, [key, value]) => {
                    acc[key] = this.uiglobals.params[value as string];
                    return acc;
                }, new Object() as any);
            }

            this.createState = this.createState.state;
        }

        /**
         * This is used to handle download state records object
         */
        this.downloadRecord = this.uiglobals.current.data['downloadRecord'];

        /**
         * this sets the create record heading, if defined
         */
        this.createRecordHeading =
            this.uiglobals.current.data['createRecordHeading'] ??
            `Create ${this.storeLabel}`;

        /**
         * This sets the empty state title for the list component
         */
        this.emptyStateTitle = this.uiglobals.current.data?.emptyStateTitle;

        /**
         * This sets the empty state message for the list component
         */
        this.emptyStateMessage = this.uiglobals.current.data?.emptyStateMessage;

        /**
         * This sets the empty state message for the list component
         */
        this.namespace = this.uiglobals.current.data?.namespace;

        /**
         * This sets the empty state custom image for the list component
         */
        this.emptyStateImage = this.uiglobals.current.data?.emptyStateImage;

        /**
         * This sets the empty state custom image styles for the list component
         */
        this.emptyStateImageStyles =
            this.uiglobals.current.data?.emptyStateImageStyles;

        this.hasModalFilters = this.uiglobals.current.data?.hasModalFilters;

        this.hasDownloadButton = this.uiglobals.current.data?.hasDownloadButton;

        this.modalFilters = this.uiglobals.current.data?.modalFilters;

        this.modalFiltersConf = this.uiglobals.current.data?.modalFiltersConf;

        this.modalFiltersTitle = this.uiglobals.current.data?.modalFiltersTitle;

        this.downloadButtonRequest =
            this.uiglobals.current.data?.downloadButtonRequest;

        /**
         * Set the branch_id
         * */
        this.listBranchData = this.uiglobals.current.data?.listBranchData;
        if (this.listBranchData) {
            this.workstation = JSON.parse(
                localStorage.getItem('auth.config.userWorkStation')
            );
            this.branch = this.workstation['workstation__org_unit__parent'];
        }

        /**
         * This processes default params for the datatabble
         */
        if (this.uiglobals.current.data['defaultParams']) {
            const defaultParams = {};
            /**
             * This logic adds params from the state into filters
             * for the api, by checking defaultParams for any key with
             * the format of `scheme: { param: 'scheme_id' }`
             * * `payer` is what the datatable will filter by
             * * `param: 'scheme_id'` is the state param that will be used
             * *  to filter the datatable:
             * * *  { scheme: this.uiglobals.params.scheme_id }
             */
            const params = this.uiglobals.current.data['defaultParams'];
            for (let index = 0; index < params.length; index++) {
                const element = params[index];
                for (const key in element) {
                    if (element[key].param) {
                        defaultParams[key] =
                            this.uiglobals.params[element[key].param];
                    } else {
                        defaultParams[key] = params[index][key];
                    }
                }
            }
            this.filterParams = defaultParams;
            /**
             * This adds the state params as payload for the creation form
             */
            if (this.uiglobals.current.data['stateParamsPayload']) {
                Object.assign(this.extraPayload, defaultParams);
            }
        } else {
            /**
             * This uses hardcoded params using filterParams from the state
             */
            this.filterParams = this.uiglobals.current.data['filterParams'];
            if (this.listBranchData) {
                Object.assign(this.filterParams, {
                    branch_org_unit_id: this.branch,
                });
            }
        }
        /**
         * Add support for computedParams that are resolved in the state file
         */
        this.filterParams = Object.assign(
            this.filterParams ?? {},
            this.computedParams
        );

        /**
         * This logic adds params from the state as data in the form
         * by checking defaultFormModelFields for any key with
         * the format of `scheme: { param: 'scheme_id' }`
         * * `scheme` is key in the form
         * * `param: 'scheme_id'` is the value of the key 'scheme'
         * * *  { scheme: this.uiglobals.params.scheme_id }
         */
        if (this.uiglobals.current.data['defaultFormModelFields']) {
            const defaultParams = {};
            const params =
                this.uiglobals.current.data['defaultFormModelFields'];
            for (let index = 0; index < params.length; index++) {
                const element = params[index];
                for (const key in element) {
                    if (element[key].param) {
                        defaultParams[key] =
                            this.uiglobals.params[element[key].param];
                    } else {
                        defaultParams[key] = params[index][key];
                    }
                }
            }
            Object.assign(this.extraPayload, defaultParams);
        }
        this.formlyJsonFilename =
            this.uiglobals.current.data['formlyJsonFilename'];
        this.formlyServiceFilename =
            this.uiglobals.current.data['formlyServiceFilename'];
    }

    /** Creates record */
    saveRecord(model) {
        Object.assign(model, this.extraPayload);
        this.dataLayer.create(this.store, model).subscribe({
            next: this.createdRecord,
            error: this.errorCreateRecord,
        });
    }

    /** Handles successful creation of record */
    createdRecord = () => {
        this.siltable?.getData();
        this.loading['createRecord'] = false;
        this.toggleModal('createRecord');
        const title = `Add ${this.storeLabel}`;
        const context = `${this.storeLabel} added successfully`;
        this.showToast('bottom-right', 'success', title, context);
    };

    /**
     * Redirect user to specified state
     */
    redirectToSpecifiedState = stateContext => {
        this.state.go(stateContext.state, stateContext?.params, {
            reload: true,
        });
    };

    /**
     * Defines the page header action methods
     */
    headerActionMethods = {
        stateRedirect: action => {
            this.redirectToSpecifiedState(action);
        },
        apiCall: action => {
            this.listService.apiCall(action, this);
        },
    };

    /** Handles errors when creating record */
    errorCreateRecord = err => {
        this.loading['createRecord'] = false;
        this.errorHandler.handleError(err, this);
    };

    setApiList = data => {
        this.apiList = data[this.resolvedDataKeyAsApiList];
    };
    /**
     * Used to open a custom modal.
     * ps: Should be refactored to be more dynamic
     */
    getRowDetails(event) {
        this.rowDetails = event;
        this.customModalDetails = {
            name: this.rowDetails?.registration_name,
            date: this.rowDetails?.registration_date,
            header: this.rowDetails?.title,
            message: this.rowDetails?.content,
            url: this.rowDetails?.detail_url,
        };
        this.toggleModal('viewRowDetails');
    }

    /**
     *  used to download records from a list
     * @param store
     */
    downloadRecords = store => {
        const params = {
            message_id: this.defaultStateParams?.template_id,
            segment_id: this.defaultStateParams?.segment_id,
            segment_message_id: this.defaultStateParams?.message_id,
        };
        this.dataLayer.downloadDocumentOptions(`${store}`, params).subscribe({
            next: (data: Blob) => {
                const file = new Blob([data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const fileURL = URL.createObjectURL(file);
                const a = document.createElement('a');
                a.href = fileURL;
                a.download = `segment-msg-report-${params.message_id.slice(
                    0,
                    6
                )}.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            },
            error: this.errorDownloadRecords,
        });
    };

    /** Handles errors when downloading records */
    errorDownloadRecords = err => {
        const msg = 'Failed to download segment delivery report';
        this.errorHandler.handleError(err, this);
        this.showToast('bottom-right', 'danger', msg, 'Failed');
    };

    /**
     * used to disable download delivery btn when ssthere are no records
     * @param event - returns true if there's no records
     */
    handleNoDeliveryMetrics = event => {
        if (event)
            this.downloadRecord.hasNoRecord = !this.downloadRecord.hasNoRecord;
    };

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        if (this.detailList) {
            this.waitForRecord();
        }
        this.setupDataFromState();
    }

    /**
     * hook called before list component is destroyed
     */
    ngOnDestroy() {
        // reset hasNoRecord to default
        if (this.downloadRecord) this.downloadRecord.hasNoRecord = false;
    }
}

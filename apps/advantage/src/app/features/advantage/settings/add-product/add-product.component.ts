import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { TranslateService } from '@ngx-translate/core';
import { UIRouterGlobals, StateService } from '@uirouter/angular';
import _ from 'underscore';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { ListComponentService } from '../../../../shared/list/list.services';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

@Component({
    selector: 'ngx-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss'],
    standalone: false,
})
export class AddProductComponent implements OnInit {
    /**
     * Defines the record
     */
    record: any;

    /**
     * Used for lists that are in a detail endpoint
     */
    @Input() detailList: any;

    /** Used in the datatable to set the data */
    apiList: Array<any>;

    /**
     * Used to tell if the list is a tabbed view
     */
    isTabList: boolean;

    /**
     * Contains the resource being fetched
     */
    @Input() store: any;

    /**
     * Contains the formly name used to draw up the form
     */
    @Input() formlyJsonFilename: any;

    /**
     * Contains the formly name used to draw up the form
     */
    formlyServiceFilename: any;
    formlyServiceFilenameEtims: any;

    /**
     * Defines the table's rows
     */
    rows: Array<any>;

    /**
     * Used to define a different source of data
     */
    dontUseStore: boolean;

    /**
     * Defines the selector used to access the sil-table component
     * in the template.
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Defines the table's actions
     */
    actions: Array<any>;

    /**
     * Used for the page title
     */
    @Input() pageTitle: any;

    /**
     * Used to set apilist from resolved data
     */
    resolvedDataKeyAsApiList: any;

    /**
     * Used to display different loading sections
     */
    loading: Object = {};

    /**
     * Contains an array of state params the datatable should not filter by
     */
    @Input() ignoreStateParams: any;

    /**
     * Defines the actions on the top of the page
     */
    headerActions: Array<any>;

    /**
     * Used to hide the create button from the list page
     */
    hideCreateButton: Object = {};

    /**
     * Used for the page sub-title
     */
    @Input() pageSubTitle: any;

    /**
     * Contains the label of the store e.g. organisation Unit
     */
    @Input() storeLabel: any;

    /**
     * Contains state params that must be retained when reloading the state
     */
    @Input() activeStateParams: any;

    /**
     * Used for display the search bar
     */
    @Input() hasSearch: any;

    /**
     * Used to get a reference of siltable used in the template
     */
    statusFilters: Array<any>;

    /**
     * Defines the header columns of the table
     */
    tableHeader: Array<any>;

    /**
     * Used to display different toggle modals
     * information
     */
    toggle: Object = {};
    // model: Object = {};

    /**
     * Stores the form model data
     */
    model: Object;

    viewEtims: boolean = false;

    /**
     * Contains extra params to post in the backend
     */
    @Input() extraPayload: any;

    /**
     * State used to navigate use to create a record
     */
    createState: string;

    /** Used to filter datatable params */
    filterParams: Object;

    /**
     * Contains the observable resolved from the state service
     */
    @Input() recordDetailObservable: any;

    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Adds modelData on the skika-form
     */
    addProductDetails: any;

    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted: boolean = false;

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
        public $state: StateService,
        public cookieService: Cookies,
        public listService: ListComponentService,
        public auth: AuthenticationService
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
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
        /**
         * This enables the search feature on the datatable
         */
        this.hasSearch = this.uiglobals.current.data['hasSearch'];
        /**
         * This defines the table headers of the datatable
         */
        this.tableHeader = this.uiglobals.current.data['tableHeader'];
        /**
         * This defines the status filters of datatable
         */
        this.statusFilters = this.uiglobals.current.data['statusFilters'];
        /**
         * This is used for the form information
         */
        this.extraPayload = this.uiglobals.current.data['extraPayload'];
        /**
         * This defines the actions of the datatable
         */
        this.actions = this.uiglobals.current.data['actions'];
        /**
         * This defines the page title and sizing is affected by isTabList boolean
         */
        this.pageTitle = this.uiglobals.current.data['pageTitle'];
        /**
         * This defines the page title and sizing is affected by isTabList boolean
         */
        this.headerActions = this.uiglobals.current.data['headerActions'];
        /**
         * This defines the page sub title and sizing is affected by isTabList boolean
         */
        this.pageSubTitle = this.uiglobals.current.data['pageSubTitle'];
        this.ignoreStateParams =
            this.uiglobals.current.data['ignoreStateParams'];
        this.activeStateParams =
            this.uiglobals.current.data['activeStateParams'];
        /**
         * This hides the create button if not needed in the list
         */
        this.hideCreateButton = this.uiglobals.current.data['hideCreateButton'];
        /**
         * This is a state name that directs the user to where they can create a new record
         */
        this.createState = this.uiglobals.current.data['createState'];

        /**
         * This processes default params for the datatable
         */
        if (this.uiglobals.current.data['defaultParams']) {
            const defaultParams = {};

            this.filterParams = defaultParams;
        }

        this.formlyJsonFilename =
            this.uiglobals.current.data['formlyJsonFilename'];

        this.formlyServiceFilename = this.auth.checkPermission(
            'erp.perform_etims_operations'
        )
            ? this.uiglobals.current.data['formlyServiceFilenameEtims']
            : this.uiglobals.current.data['formlyServiceFilename'];
    }

    /** Creates product */
    saveRecord(model) {
        const categories = _.pluck(model?.categories, 'id');
        const payload = {
            name: model?.name,
            preferred_name: model?.preferred_term,
            product_type: model.product_type,
            categories: categories,
            slade_code: model?.slade_code,
            selling_price: model.selling_price,
            purchasing_price: model.purchasing_price,
            sale_taxes: model?.sale_taxes,
            purchase_taxes: model.purchase_taxes,
        };

        Object.assign(model, this.extraPayload);
        this.dataLayer.create('products', payload).subscribe({
            next: this.createdRecord,
            error: this.errorCreateRecord,
        });
    }

    saveOclRecord(model) {
        const categories = _.pluck(model?.categories, 'id');
        const name = model?.product.display_name;
        const payload = {
            name: name,
            preferred_name: name,
            product_type: model?.productType,
            categories: categories,
            slade_code: model?.slade_code,
            selling_price: model.selling_price,
            purchasing_price: model.purchasing_price,
            sale_taxes: model?.sale_taxes,
            purchase_taxes: model.purchase_taxes,
        };

        Object.assign(model, this.extraPayload);
        this.dataLayer.create('products', payload).subscribe({
            next: this.createdRecord,
            error: this.errorCreateRecord,
        });
    }

    /** Creates product for eTIMS */
    saveRecordForEtims(model) {
        const payload = {
            ...model,
            categories: [model.categories],
            sale_taxes: [model.sale_taxes],
            purchase_taxes: [model.purchase_taxes],
        };

        Object.assign(model, this.extraPayload);
        this.dataLayer.create('products', payload).subscribe({
            next: this.createdRecord,
            error: this.errorCreateRecord,
        });
    }

    /** Creates product from OCL for eTIMS */
    saveRecordForOclEtims(model) {
        const name = model?.product?.display_name;
        const payload = {
            ...model,
            name: name,
            preferred_name: name,
            categories: [model.categories],
            sale_taxes: [model.sale_taxes],
            purchase_taxes: [model.purchase_taxes],
        };

        Object.assign(model, this.extraPayload);
        this.dataLayer.create('products', payload).subscribe({
            next: this.createdRecord,
            error: this.errorCreateRecord,
        });
    }

    /** Handles successful creation of record */
    createdRecord = () => {
        this.siltable?.getData();
        this.loading['createRecord'] = false;
        const title = `Added Product`;
        const context = `Product added successfully`;
        this.showToast('bottom-right', 'success', title, context);
        this.$state.go('app.advantage.settings.products');
    };

    /** Handles errors when creating record */
    errorCreateRecord = err => {
        this.loading['createRecord'] = false;
        this.errorHandler.handleError(err.error, this);
        const title = `Add Product`;
        const context = `Failed to add Product`;
        this.showToast('bottom-right', 'danger', title, context);
    };

    setApiList = data => {
        this.apiList = data[this.resolvedDataKeyAsApiList];
    };

    goToProductsList() {
        this.$state.go('app.advantage.settings.products');
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.setupDataFromState();

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        this.viewEtims = this.auth.checkPermission(
            'erp.perform_etims_operations'
        );
    }
}

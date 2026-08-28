import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService } from '@uirouter/angular';

@Component({
    selector: 'ngx-pricelist-list',
    templateUrl: './pricelist-list.component.html',
    styleUrls: ['./pricelist-list.component.scss'],
    standalone: false,
})
export class PriceListComponent implements OnInit {
    /**
     * Shows the loading of the xhr requests
     */
    loading: boolean = false;
    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;
    /**
     * Array used to define datatable grid actions
     */
    gridActions: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Object used to define the default filter params of the datatable
     */
    filterParams: Object;

    /**
     * Boolean used to show the modal
     */
    showModal = false;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted: boolean = false;

    /**
     * Contains organisation data
     */
    orgData: any;

    /**
     * saves the selected language
     */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /**
     * Used to get a reference of siltable used in the template
     */
    statusFilters: Array<any> = [];

    /**
     * Constructor for the settings class component
     * @param dataLayer injects instance of the datalayer service
     * @param errorHandler injects instance of errorhandler service
     * @param toastrService injects instance of nebular toast service
     */
    constructor(
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public authConfig: Authorization,
        public cookieService: Cookies,
        public translate: TranslateService,
        public $state: StateService
    ) {
        this.authConfig = authConfig;
        this.translate.setFallbackLang('en');
        this.translate.use(this.selectedLanguage);
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Toggles modal
     */
    toggleModal() {
        this.showModal = !this.showModal;
    }

    /**
     * Lifecycle hook used when component is first initialized
     */
    ngOnInit() {
        /**
         * Table header
         */
        this.tableHeader = [
            { text: 'pricelists.table_header.name' },
            { text: 'pricelists.table_header.status' },
            { text: 'pricelists.table_header.from' },
            { text: 'pricelists.table_header.to' },
            { text: 'pricelists.table_header.action' },
        ];

        /**
         * Table rows
         */
        this.rows = [
            {
                key: 'name',
                type: 'titleCaseString',
            },
            {
                key: 'pricelist_status',
                type: 'titleCaseString',
            },
            {
                key: 'effective_from',
                type: 'date',
            },
            {
                key: 'effective_to',
                type: 'date',
            },
        ];

        /**
         * Fields called from the backend
         */
        this.filterParams = {
            page_size: '20',
        };

        /**
         * Filters used by sil-datatable-filter component
         */
        this.statusFilters = [
            {
                display: 'All',
                filter: {
                    pricelist_type: '',
                },
            },
            {
                display: 'Sales',
                filter: {
                    pricelist_type: 'sales',
                },
            },
            {
                display: 'Purchases',
                filter: {
                    pricelist_type: 'purchases',
                },
            },
        ];

        /**
         * Edit Action button with quick patch action from sil.datatable
         */
        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.view',
                status: 'success',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.settings.pricelists.details',
                },
            },
        ];
    }
}

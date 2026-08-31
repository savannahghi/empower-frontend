import { Component, OnInit } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { NbToastrService } from '@nebular/theme';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'ngx-sms-list',
    templateUrl: './sms-list.component.html',
    styleUrls: ['./sms-list.component.scss'],
    standalone: false,
})
export class SmsListComponent implements OnInit {
    /**
     * Used to display the loader when data is being fetched
     */
    loading: boolean = false;

    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;

    /**
     * Array used to define the actions of the datatable
     */
    actions: Array<any>;

    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /** used to filter datatable params */
    filterParams: Object;

    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Used to define custom form options.
     * Required for the patient form to allow for constant updating of model
     */
    formOptions: any;

    /**
     * sets the filter used to query for data in the datatable
     * @param event contains the params used in the datatable
     */
    setFilter(event) {
        this.queryArg = event;
    }

    smsList: any;

    /**
     * Fetch the selected language */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /**
     * Constructor for the class component
     * @param dataLayer used to access the data layer service
     * @param errorHandler used to access the error handler service
     * @param toastrService used to access the toast service
     */
    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public translate: TranslateService,
        public cookieService: Cookies
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /**
         * Set the table header data
         */
        this.tableHeader = [
            { text: 'billing.sms.table_header.date' },
            { text: 'billing.sms.table_header.sms' },
            { text: 'billing.sms.table_header.to' },
            { text: 'billing.sms.table_header.direction' },
            { text: 'billing.sms.table_header.status' },
        ];

        /**
         * Set the table's rows
         */
        this.rows = [
            {
                label: 'Date',
                key: 'updated',
                value: 'updated',
                type: 'date',
            },
            {
                key: 'body',
                value: 'body',
                type: 'string',
            },
            {
                key: 'msisdn',
                value: 'msisdn',
                type: 'string',
            },
            {
                key: 'direction',
                value: 'direction',
                type: 'string',
            },
            {
                key: 'state',
                value: 'state',
                type: 'string',
            },
        ];

        /**
         * Used to set the table's filters
         * */
        this.filterParams = {
            page_size: '10',
        };

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        this.smsList = [
            {
                guid: '4e5e42bf-ac4b-4ce4-b760-20a9c69d50b5',
                body: 'SMS body',
                msisdn: '+254790360360',
                sms_type: 'BULK',
                gateway: null,
                carrier: '639/01',
                subscription: null,
                direction: 'OUTBOUND',
                state: 'QUEUED',
                metadata: {
                    owner: 4602,
                    intention: 'VISIT_START',
                },
                parts: 1,
                created: '2023-11-21T12:03:24.663696+03:00',
                updated: '2023-11-21T12:03:24.663711+03:00',
            },
        ];
    }
}

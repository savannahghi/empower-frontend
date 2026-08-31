import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'ngx-branchsetting-list',
    templateUrl: './branchsetting-list.component.html',
    styleUrls: ['./branchsetting-list.component.scss'],
    standalone: false,
})
export class BranchSettingListComponent implements OnInit {
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
     * String used to return the filter params used in the datatable
     */
    queryArg: string;

    /**
     * Boolean used to show the modal
     */
    showModal = false;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * saves the selected language
     */
    selectedLanguage = this.cookieService.getLanguageCookie();
    /**
     * Contains organisation data
     */
    orgData: any;
    /**
     * contains org setting
     */
    orgSettingsDetails: any;

    /**
     * Used to get a reference of siltable used in the template
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Constructor for the settings class component
     * @param dataLayer injects instance of the datalayer service
     * @param errorHandler injects instance of errorhandler service
     * @param toastrService injects instance of nebular toast service
     */
    constructor(
        protected toastrService: NbToastrService,
        public authConfig: Authorization,
        public cookieService: Cookies,
        public translate: TranslateService
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
     * sets the filter used to query for data in the datatable
     * @param event contains the params used in the datatable
     */
    setFilter(event) {
        this.queryArg = event;
    }

    /**
     * Lifecycle hook used when component is first initialized
     */
    ngOnInit() {
        this.orgData = this.authConfig.getErpOrganisation();
        this.orgSettingsDetails = this.authConfig.getOrgSettings();
        /**
         * Table header
         */
        this.tableHeader = [
            { text: 'settings.table_header.name' },
            { text: 'settings.table_header.setting' },
            { text: 'settings.table_header.action' },
        ];

        /**
         * Table rows
         */
        this.rows = [
            {
                key: 'description',
                type: 'titleCaseString',
                nested: [{ value: 'name', type: 'string' }],
            },
            {
                nested: [{ value: 'value', type: 'string' }],
            },
        ];

        /**
         * Fields called from the backend
         */
        this.filterParams = {};

        /**
         * Edit Action button with quick patch action from sil.datatable
         */
        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    context: 'Edit Branch Setting',
                    formConfig: {},
                    store: 'branchSettingsService',
                    showText: true,
                    isService: true,
                    action: 'quickPatch',
                    method: 'patchBranchSettings',
                },
            },
        ];
    }
}

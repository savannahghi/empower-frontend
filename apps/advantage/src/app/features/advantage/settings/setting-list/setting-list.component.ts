import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { OrganisationService } from '../../../healthcrm/organisations/organisation.service';
import { StateService } from '@uirouter/angular';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - style: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'sil-setting-list',
    templateUrl: './setting-list.component.html',
    styleUrls: ['./setting-list.component.scss'],
    standalone: false,
})

/**
 * Class that defines clinic list controls, methods and lifecycle hooks
 */
export class SettingListComponent implements OnInit {
    /**
     * Shows the loading of the xhr requests
     */
    loading: boolean = false;

    /**
     * Contains the organisation details
     */
    organisationDetails: any;

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
    queryArg2: string;

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
     * Contains the organisation Logo
     */
    organisationLogo: any;

    /**
     * Method used to reload page
     */
    pageReloader() {
        this.$state.reload();
    }

    /**
     * Reload function that reloads the state
     */
    fxnReload() {
        setTimeout(() => {
            this.pageReloader();
        }, 500);
    }

    /**
     * saves the selected language
     */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /**
     * Used to get a reference of siltable used in the template
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Constructor for the settings class component
     * @param dataLayer injects instance of the datalayer service
     * @param errorHandler injects instance of errorhandler service
     * @param toastrService injects instance of nebular toast service
     * @param $state Connects to the state service
     */
    constructor(
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public authConfig: Authorization,
        public cookieService: Cookies,
        public translate: TranslateService,
        public orgService: OrganisationService,
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
     * Event output by the datatable with the filter params used
     */
    setFilter(event) {
        this.queryArg2 = event;
    }

    /**
     * toggle to store modal status
     */
    toggle: {
        edit_org_logo: boolean;
    } = {
        edit_org_logo: false,
    };

    /**
     * Used to toggle the organisation logo modal
     */
    toggleOrgLogoModal(context: 'edit_org_logo') {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Toggles modal
     */
    toggleModal() {
        this.showModal = !this.showModal;
    }

    orgLogo = data => {
        this.organisationLogo = {
            id: data?.organisation_logo?.id,
            data: data?.organisation_logo?.data,
        };
        this.orgDetails(data);
        this.loading = false;
        return this.organisationLogo;
    };

    errorHandlerGetOrgLogo = err => {
        this.errorHandler.handleError(err, this);
        this.loading = false;
    };

    getOrganisationLogo(orgData) {
        this.loading = true;
        this.dataLayer
            .get('erp-organisations', orgData.organisation_id)
            .subscribe({
                next: this.orgLogo,
                error: this.errorHandlerGetOrgLogo,
            });
    }

    // Handle new file selection
    onNewFileSelected(event) {
        const input = event.target;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.newOrganisationLogo(file);
        }
    }

    redirectAfterCreatingOrgLogo = data => {
        const msg = `${data?.['title']} has been created successfully`;
        this.showToast(
            'bottom-right',
            'success',
            'Create Organisation Logo',
            msg
        );
        this.fxnReload();
    };

    errorHandlerNewOrgLogo = err => {
        this.errorHandler.handleError(err, this);
    };

    newOrganisationLogo(file) {
        const formData = new FormData();
        formData.append('data', file);
        formData.append('title', file.name);
        formData.append('size', file.size);
        formData.append('content_type', file.type);
        formData.append('organisation', this.orgData.organisation_id);

        this.dataLayer.create('organisation-logos', formData).subscribe({
            next: this.redirectAfterCreatingOrgLogo,
            error: this.errorHandlerNewOrgLogo,
        });
    }

    // Handle edit/existing file selection
    onFileSelected(event) {
        const input = event.target;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.updateOrganisationLogo(file);
        }
    }

    redirectAfterUpdatingOrgLogo = data => {
        const msg = `${data?.['title']} has been updated successfully`;
        this.showToast(
            'bottom-right',
            'success',
            'Update Organisation Logo',
            msg
        );
        this.fxnReload();
    };

    errorHandlerUpdateOrgLogo = err => {
        this.errorHandler.handleError(err, this);
    };

    updateOrganisationLogo(file) {
        const formData = new FormData();
        formData.append('data', file);
        formData.append('file', file);
        formData.append('title', file.name);
        formData.append('content_type', file.type);
        formData.append('size', file.size);

        if (this.organisationLogo?.id) {
            this.dataLayer
                .update(
                    'organisation-logos',
                    this.organisationLogo.id,
                    formData
                )
                .subscribe({
                    next: this.redirectAfterUpdatingOrgLogo,
                    error: this.errorHandlerUpdateOrgLogo,
                });
        }
    }

    redirectAfterDeletingOrgLogo = data => {
        const msg = `${data?.['title']} has been deleted successfully`;
        this.showToast(
            'bottom-right',
            'success',
            'Delete Organisation Logo',
            msg
        );
        this.fxnReload();
    };

    errorHandlerRemoveLogo = err => {
        this.errorHandler.handleError(err, this);
    };

    removeLogo() {
        if (this.organisationLogo?.id) {
            this.dataLayer
                .remove('organisation-logos', this.organisationLogo.id)
                .subscribe({
                    next: this.redirectAfterDeletingOrgLogo,
                    error: this.errorHandlerRemoveLogo,
                });
        }
    }

    orgDetails = data => {
        this.organisationDetails = {
            organisation_name:
                data?.organisation_name ?? this.orgData.organisation_name,
            physical_address: data?.physical_address,
            organisation_phone_number:
                data?.phone_number ?? this.orgData.organisation_phone_number,
            organisation_email_address:
                data?.email_address ?? this.orgData.organisation_email_address,
            postal_address: data?.postal_address,
            web_address: data?.web_address,
            organisation_country:
                data?.default_country ?? this.orgData.organisation_country,
            tax_office_name: data?.tax_office_name,
            tax_office: data?.tax_office,
            identifiers: data.identifiers,
            organisation_tax_pin:
                data?.tax_payer_pin ?? this.orgData.organisation_tax_pin,
        };
        return this.organisationDetails;
    };

    /**
     * Lifecycle hook used when component is first initialized
     */
    ngOnInit() {
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
                expression: row => {
                    return row?.name !== 'visits:post_visit_survey_template';
                },
                modalConf: {
                    context: 'Edit Organisation Setting',
                    formConfig: {},
                    store: 'orgSettingsService',
                    saveText: true,
                    isService: true,
                    action: 'quickPatch',
                    method: 'patchOrgSetting',
                },
            },
            {
                btnText: 'shared.buttons.view',
                status: 'success',
                action: 'stateGo',
                expression: row => {
                    return row?.name === 'visits:post_visit_survey_template';
                },
                modalConf: {
                    state: 'app.advantage.settings.postvisitsurvey',
                },
            },
        ];

        this.orgData = this.authConfig.getErpOrganisation();
        this.orgDetails(this.orgData);
        this.getOrganisationLogo(this.orgData);
        setTimeout(() => {
            this.orgService.setOrganisation(this.orgData);
        }, 500);
    }
}

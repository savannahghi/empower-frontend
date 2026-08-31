import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { NbToastrService } from '@nebular/theme';
import { StateService } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

@Component({
    selector: 'ngx-organisation-update',
    templateUrl: './organisation-update.component.html',
    styleUrls: ['./organisation-update.component.scss'],
    standalone: false,
})
export class OrganisationUpdateComponent implements OnInit {
    /**
     * Used to override default form configurations
     */
    formConfig: any;
    /**
     * Contains the organisation details
     */
    organisationDetails: any;
    /**
     * Contains organisation data
     */
    orgData: any;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;

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
     * The component constructor
     * @param toastService Connects to the toast service
     * @param $state Connects to the state service
     * @param dataLayer Connects to the data layer service
     * @param errorHandler Connects to the error handler service
     */
    constructor(
        protected toastService: NbToastrService,
        public $state: StateService,
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        public authConfig: Authorization
    ) {
        this.authConfig = authConfig;
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
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

    getOrganisationInfo(orgData) {
        this.dataLayer
            .get('erp-organisations', orgData.organisation_id)
            .subscribe({
                next: this.orgDetails,
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    redirectAfterOrgUpdate = data => {
        this.$state.go('app.advantage.settings.orglevel');
        const msg = `${data?.['organisation_name']} has been updated`;
        this.showToast('bottom-right', 'success', 'Organisation Update', msg);
        this.fxnReload();
    };

    ensureHttps(url: string): string {
        if (url && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    }

    updateOrganisation(model) {
        model.email_address = model.organisation_email_address;
        model.phone_number = model.organisation_phone_number;
        model.default_country = model.organisation_country;
        model.web_address = this.ensureHttps(model.web_address);

        this.dataLayer
            .update('erp-organisations', this.orgData.organisation_id, model)
            .subscribe({
                next: this.updateAdvantageOrganisation,
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    updateAdvantageOrganisation = erpOrg => {
        const advOrg = this.authConfig.getAdvantageOrganisation();
        const orgPatchDetails = {
            organisation_name: erpOrg.organisation_name,
        };
        this.dataLayer
            .update('organisations', advOrg.organisation_id, orgPatchDetails)
            .subscribe({
                next: this.redirectAfterOrgUpdate,
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    };

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
        this.orgData = this.authConfig.getErpOrganisation();
        this.getOrganisationInfo(this.orgData);
    }
}

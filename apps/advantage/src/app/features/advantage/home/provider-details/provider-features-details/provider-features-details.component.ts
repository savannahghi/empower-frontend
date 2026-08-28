import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

@Component({
    selector: 'ngx-provider-features-details',
    templateUrl: './provider-features-details.component.html',
    styleUrl: './provider-features-details.component.scss',
    standalone: false,
})
export class ProviderFeaturesDetailsComponent implements OnInit {
    constructor(
        private errorHandler: ErrorHandlerService,
        public uiglobals: UIRouterGlobals,
        public dataLayer: SilStoresService,
        public toastrService: NbToastrService,
        public $state: StateService
    ) {}

    toastTime = 7000;
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    loading: boolean = false;

    tableHeaders: Array<any>;

    rows: Array<any>;

    actions: Array<any> = [];

    orgFeatures: any;

    formConfig: any;

    /**
     * Used to display different toggle modals
     * information
     */
    toggle: Object = {};

    /**
     * Toggles the modal
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    handleErrorFxn = (err: any) => {
        this.loading = false;

        this.errorHandler.handleError(err, this);
    };

    getOrganisationFeatures() {
        const params = {
            organisation: this.uiglobals.params.id,
        };

        this.dataLayer.list('organisation-features', params).subscribe({
            next: (response: any) => {
                this.orgFeatures = response.results;
            },
            error: this.handleErrorFxn,
        });
    }

    addOrgFeatureSuccessfully = () => {
        const msg = 'Add Organisation Feature';
        const context = 'Add Organisation Feature';
        this.showToast('bottom-right', 'success', context, msg);

        this.loading = false;

        this.$state.reload();
    };

    addOrgFeature(model) {
        this.loading = true;

        const params = {
            organisation_id: this.uiglobals.params.id,
            name: model.feature,
        };

        this.dataLayer.create('organisation-features', params).subscribe({
            next: this.addOrgFeatureSuccessfully,
            error: this.handleErrorFxn,
        });
    }

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        this.getOrganisationFeatures();

        this.tableHeaders = [
            { text: 'Feature' },
            { text: 'Status' },
            { text: 'Date Activated' },
            { text: 'Date Deactivated' },
            { text: 'Action' },
        ];

        this.rows = [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'active',
                type: 'statusColor',
            },
            {
                key: 'date_activated',
                type: 'date',
            },
            {
                key: 'date_deactivated',
                type: 'date',
            },
        ];

        this.actions = this['actions'] = [
            {
                btnText: 'Activate',
                status: 'success',
                action: 'quickPatch',
                confirm: {
                    title: 'Activate Feature',
                    text: 'Are you sure you want to Activate this feature in this organisation?',
                    showCancelButton: true,
                    cancelButtonColor: '#edf1f7',
                    confirmButtonText: 'Activate',
                },
                modalConf: {
                    method: 'activateOrgFeatureMethod',
                },
                expression: row => !row.active,
            },
            {
                btnText: 'Deactivate',
                status: 'danger',
                action: 'quickPatch',
                confirm: {
                    title: 'Deactivate Feature',
                    text: 'Are you sure you want to Deactivate this feature from this organisation?',
                    showCancelButton: true,
                    cancelButtonColor: '#edf1f7',
                    confirmButtonText: 'Deactivate',
                },
                modalConf: {
                    method: 'deactivateOrgFeatureMethod',
                },
                expression: row => row.active,
            },
        ];
    }
}

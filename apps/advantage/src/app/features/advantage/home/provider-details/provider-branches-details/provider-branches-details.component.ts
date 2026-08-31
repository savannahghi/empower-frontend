import { Component, OnInit } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

@Component({
    selector: 'ngx-provider-branches-details',
    templateUrl: './provider-branches-details.component.html',
    styleUrl: './provider-branches-details.component.scss',
    standalone: false,
})
export class ProviderBranchesDetailsComponent implements OnInit {
    constructor(
        private errorHandler: ErrorHandlerService,
        public uiglobals: UIRouterGlobals,
        public dataLayer: SilStoresService
    ) {}

    orgBranches: any;

    loading: boolean = false;

    tableHeaders: Array<any>;

    rows: Array<any>;

    actions: Array<any> = [];

    handleErrorFxn = (err: any) => {
        this.loading = false;

        this.errorHandler.handleError(err, this);
    };

    getOrganisationBranches() {
        const params = {
            organisation: this.uiglobals.params.id,
        };

        this.dataLayer.list('branches', params).subscribe({
            next: (response: any) => {
                this.orgBranches = response.results;
            },
            error: this.handleErrorFxn,
        });
    }

    ngOnInit() {
        this.getOrganisationBranches();

        this.rows = [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'parent_name',
                type: 'string',
            },
            {
                key: 'phone_number',
                type: 'string',
            },
            {
                key: 'email_address',
                type: 'string',
            },
        ];

        this.tableHeaders = [
            { text: 'Name' },
            { text: 'Parent' },
            { text: 'Phone' },
            { text: 'Email' },
            { text: 'Action' },
        ];

        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    store: 'add-org-unit',
                    api: 'branches',
                    action: 'quickPatch',
                    httpMethod: 'update',
                    method: 'genericPatch',
                    successTitle: 'Edit Branch',
                    successMessage: 'Branch edited',
                    failedTitle: 'Edit Branch',
                    failedMessage: 'Branch updating has',
                },
            },
        ];
    }
}

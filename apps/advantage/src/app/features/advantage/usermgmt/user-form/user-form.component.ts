import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { InitializeFlagsService } from '../../../../@core/utils/initialize-flags.service';

@Component({
    selector: 'ngx-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
    standalone: false,
})
export class UserFormComponent implements OnInit {
    constructor(
        protected dataLayer: SilStoresService,
        protected errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public featureFlagService: InitializeFlagsService,
        public uiglobals: UIRouterGlobals
    ) {}
    /** contains the field by which the form is fetching */
    formId: string;
    /** Contains the fields to the form */
    formFields: string;
    /** Contains the store to fetch the information  */
    formStore: string;
    /** Contains the data on the form */
    data: any;
    /** Tells form that api has been called  */
    loading: boolean;
    /** Tells if the data has been fetched  */
    dataFetched: boolean;
    /** Contains page title */
    pageTitle: string;
    /** Contains page sub-title */
    pageSubTitle: string;
    /**
     * Used to tell if the list is a tabbed view
     */
    isTabList: boolean;
    /**
     * Contains the observable resolved from the state service
     */
    @Input() recordObservable: any;
    /**
     * Defines the record
     */
    record: any;

    get enabledKeycloak(): boolean {
        return this.featureFlagService.getForcedValue(
            'prov_authenticationSetKeyCloakToTrue'
        );
    }

    ngOnInit() {
        this.formId =
            this.uiglobals.params[this.uiglobals.current.data['formRecordId']];
        this.formFields = this.uiglobals.current.data['formFields'];
        this.formStore = this.uiglobals.current.data['formStore'];
        /**
         * This defines the page title and sizing is affected by isTabList boolean
         */
        this.pageTitle = this.uiglobals.current.data['pageTitle'];
        /**
         * This defines the page sub title and sizing is affected by isTabList boolean
         */
        this.pageSubTitle = this.uiglobals.current.data['pageSubTitle'];

        if (this.enabledKeycloak) {
            this.recordObservable.subscribe({
                next: this.fetchedRecord,
                error: this.errorFetchRecord,
            });
        } else {
            this.fetchRecord(this.formId);
        }
    }

    /** Fetch record */
    fetchRecord(id) {
        this.dataLayer.get(this.formStore, id).subscribe({
            next: this.fetchedRecord,
            error: this.errorFetchRecord,
        });
    }

    /** Fetched record */
    fetchedRecord = data => {
        this.data = data?.data ? data.data : data;
        this.dataFetched = true;
    };

    /** Save details*/
    saveDetails(data) {
        this.loading = true;
        const isEnabledKeycloak = this.enabledKeycloak;
        const payload = isEnabledKeycloak
            ? {
                  user_id: data.id,
                  role_ids: data.user_roles?.map(role => role.id) || [],
              }
            : data;
        const store = isEnabledKeycloak ? 'hermes-roles' : 'auth-erp-users';
        this.dataLayer
            .update(store, '', payload, true, true)
            .subscribe({ next: this.savedData, error: this.errorFetchRecord });
    }

    /** Saved data */
    savedData = data => {
        this.loading = false;
        this.showToast(
            'bottom-right',
            'success',
            'Updated User',
            `${data.first_name}'s details have been updated`
        );
    };

    /** Error when fetching record */
    errorFetchRecord = err => {
        this.loading = false;
        this.errorHandler.handleError(err, this);
    };

    /** Show Toast */
    showToast(position, status, title, msg) {
        const duration = 7000;
        this.toastrService.show(msg, title, {
            position,
            status,
            duration,
        });
    }
}

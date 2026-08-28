/** Imports used in the component */
import { Component, OnInit, ViewChild } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import moment from 'moment';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - style: contains the scss file used to style the component
 */
@Component({
    selector: 'provider-onboarding-selector',
    templateUrl: './provider-listing.component.html',
    styleUrls: ['./provider-listing.component.scss'],
    standalone: false,
})

/**
 * Provider Listing component class
 * Implements OnInit when intializing the class
 */
export class ProviderListingComponent implements OnInit {
    /**
     * Contains list of providers
     */
    providers: Array<any>;

    /**
     * Contains the id of a provider
     */
    providerId: any;

    /**
     * Used to display the loader when data is being fetched
     */
    loading: boolean = false;

    /**
     * Contains the row table actions
     */
    actions: Array<any>;

    /**
     * Defines the table's rows
     */
    rows: Array<any>;

    /**
     * Defines the header columns of the table
     */
    tableHeader: Array<any>;

    /**
     * Get's assigned the query params from the table
     */
    queryArg2: object;

    /**
     * Defines the error test time
     */
    toastErrorTime = 10000;

    /**
     * Boolean that defines the value used to display the modal in the component
     * It has been defaulted to false
     */
    showModal = false;

    /**
     * Defines the time taken by a success message toast
     */
    toastTime = 7000;

    /**
     * Defines the selector used to access the sil-table component
     * in the template.
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * component's constructor
     *
     * @param dataLayer - Connects to the StoreService
     * @param errorHandler - Connects to the error handler service
     * @param toastrService - Connects to the nebular toast service
     */
    constructor(
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService
    ) {}

    /**
     * showToast - Used to display a toast using the nebular toast service
     * @param position - defines the toast's position e.g. bottom-right
     * @param status - defines the status being used e.g. success, danger, info
     * @param title - defines what the title of the toast is
     * @param msg - defines what the message in the toast is
     */
    showToast(position, status, title, msg) {
        const duration = this.toastTime;
        this.toastrService.show(`${msg}`, title, {
            position,
            status,
            duration,
        });
    }

    /**
     * setFilter used to access query params from the datatable
     * @param event instance of an event from the datatable Output field filtersArg
     */
    setFilter(event) {
        this.queryArg2 = event;
    }

    /**
     * deleteOnboardedProvider Deletes a provider
     */
    deleteOnboardedProvider() {
        const context = 'Provider';
        const msg = 'Successfully deleted';
        this.loading = true;
        /**
         * Sends delete request to api using datalayer
         */
        this.dataLayer.remove('onboarding', this.providerId).subscribe({
            next: () => {
                this.showToast('bottom-right', 'success', msg, context);
                this.loading = false;
                this.siltable?.getData();
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    /**
     * toggleModal Toggles the display of the modal
     */
    toggleModal() {
        this.showModal = !this.showModal;
    }

    /**
     * showErrorToast - Used to display an error toast
     * @param position - defines the toast's position e.g. bottom-right
     * @param status - defines the status being used e.g. success, danger, info
     * @param title - defines what the title of the toast is
     * @param msg - defines what the message in the toast is
     */
    showErrorToast(position, status, title, msg) {
        const duration = this.toastErrorTime;
        /** calls the toast service to show an error */
        this.toastrService.show(`${msg} failed`, title, {
            position,
            status,
            duration,
        });
    }

    /**
     * createProvider
     * triggered when the register provider form is
     * filled and submitted.
     *
     * @param formModel Contains the data from the
     * register provider form filled when the user clicks submit.
     */
    createProvider(formModel) {
        this.loading = true;
        formModel['slade_code'] = formModel.business_partner.sladeCode;
        formModel['accepted_borrowing_terms'] = false;
        formModel['agreed_to_terms'] = false;
        formModel['financial_year_start_date'] = moment().format('YYYY-MM-DD');
        /**
         * Sends post request to api using datalayer
         */
        this.dataLayer.create('organisations', formModel).subscribe({
            next: () => {
                this.siltable?.getData();
                this.toggleModal();
                const title = 'Provider Registration';
                const context = 'Provider registered successfully';
                this.showToast('bottom-right', 'success', title, context);
            },
            error: err => {
                this.errorHandler.handleError(err.error, this);
                const title = 'Provider Registration';
                const context = 'Failed to register provider';
                this.showErrorToast('bottom-right', 'danger', title, context);
            },
        });
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /**
         * Contains the definition of the provider table's headers
         */
        this.tableHeader = [
            { text: 'Slade Code' },
            { text: 'Name' },
            { text: 'eTIMS Enabled' },
            { text: 'Device Number' },
            { text: 'Action' },
        ];

        /**
         * Contains the definition of the provider table's rows
         */
        this.rows = [
            {
                key: 'slade_code',
                type: 'number',
            },
            {
                key: 'organisation_name',
                type: 'string',
            },
            {
                key: 'etims_device',
                type: 'etimsEnabled',
            },
            {
                key: 'etims_device',
                type: 'string',
            },
        ];

        /**
         * Contains the actions defined for each row of the table
         */
        this.actions = [
            {
                btnText: 'View',
                status: 'success',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.providers.detail',
                    stateParams: {
                        id: 'id',
                    },
                },
            },
        ];
    }
}

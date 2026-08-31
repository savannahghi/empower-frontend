import { Component, OnInit, ViewChild } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import moment from 'moment';
import { StateService } from '@uirouter/angular';

@Component({
    selector: 'app-provider-registration',
    templateUrl: './provider-registration.component.html',
    styleUrls: ['./provider-registration.component.scss'],
    standalone: false,
})
export class ProviderRegistrationComponent implements OnInit {
    /**
     * Used to display the loader when data is being fetched
     */
    loading: boolean = false;

    /**
     * Defines the time taken by a success message toast
     */
    toastTime = 7000;

    /**
     * Defines the error test time
     */
    toastErrorTime = 10000;

    /**
     * Defines the selector used to access the sil-table component
     * in the template.
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        public toastrService: NbToastrService,
        public $state: StateService
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

    /* showErrorToast - Used to display an error toast
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
        formModel['slade_code'] = formModel.business_partner.slade_code_counter;
        formModel['accepted_borrowing_terms'] = false;
        formModel['agreed_to_terms'] = false;
        formModel['phone_number'] = formModel.phone_number;

        formModel['financial_year_start_date'] = moment(
            formModel.financial_year_start_date
        ).format('YYYY-MM-DD');
        /**
         * Sends post request to api using datalayer
         */
        this.dataLayer.create('organisations', formModel).subscribe({
            next: () => {
                this.siltable?.getData();
                const title = 'Provider Registration';
                const context = 'Provider registered successfully';
                this.showToast('bottom-right', 'success', title, context);
                this.$state.go('app.advantage.providers', {}, { reload: true });
                this.loading = false;
            },
            error: err => {
                this.errorHandler.handleError(err.error, this);
                const title = 'Provider Registration';
                const context = 'Failed to register provider';
                this.showErrorToast('bottom-right', 'danger', title, context);
                this.loading = false;
            },
        });
    }

    ngOnInit() {}
}

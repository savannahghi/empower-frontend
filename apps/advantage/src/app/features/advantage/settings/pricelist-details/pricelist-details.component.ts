import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { SilFormlyService } from '../../../../shared/sil-form/services/skika-formly-service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { UIRouterGlobals } from '@uirouter/angular';
import moment from 'moment';
@Component({
    selector: 'ngx-pricelist-details',
    templateUrl: './pricelist-details.component.html',
    styleUrls: ['./pricelist-details.component.scss'],
    standalone: false,
})
export class PricelistDetailsComponent implements OnInit {
    /**
     * Closes the edit pricelist modal
     */
    closeEditPricelistModal() {
        this.showEditPricelistModal = !this.showEditPricelistModal;
    }
    /*
     * Used to display the edit pricelist modal
     */
    showEditPricelistModal = false;

    /*
     * Holds the pricelist data
     */
    pricelist: any;

    /**
     * Used to show loading state
     */
    loading: boolean = false;

    toastTime = 1500;

    constructor(
        public errorHandler: ErrorHandlerService,
        public silFormlyService: SilFormlyService,
        private dataLayer: SilStoresService,
        public uiglobals: UIRouterGlobals,
        private toastrService: NbToastrService
    ) {}

    editPricelistDetails() {
        if (this.pricelist && this.pricelist.name) {
            this.showEditPricelistModal = true;
        } else {
            this.getPricelistInfo();
        }
    }

    submitEditPricelistDetails(model: any) {
        this.loading = true;
        const id = this.uiglobals.params.id;
        this.dataLayer.update('pricelists', id, model).subscribe({
            next: (response: any) => {
                this.pricelist = response;
                this.showToast(
                    'bottom-right',
                    'success',
                    'Pricelist details updated successfully.',
                    'Pricelist'
                );
                this.loading = false;

                setTimeout(() => {
                    this.showEditPricelistModal = false;
                }, 100);
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.showToast(
                    'bottom-right',
                    'danger',
                    'Failed to update pricelist details.',
                    'Pricelist'
                );
                this.loading = false;

                setTimeout(() => {
                    this.showEditPricelistModal = false;
                }, 100);
            },
        });
    }

    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.getPricelistInfo();
    }

    /**
     * Fetches the pricelist information
     */
    getPricelistInfo() {
        const id = this.uiglobals.params.id;
        if (!id) return;
        this.loading = true;
        this.dataLayer.get('pricelists', id).subscribe({
            next: (response: any) => {
                if (response.effective_from) {
                    response.effective_from = moment(response.effective_from);
                }
                if (response.effective_to) {
                    response.effective_to = moment(response.effective_to);
                }
                this.pricelist = response;
                this.loading = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }
}

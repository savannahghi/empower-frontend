import { Component, OnInit } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { NbToastrService } from '@nebular/theme';

@Component({
    selector: 'ngx-patient-post-referral',
    templateUrl: './patient-post-referral.component.html',
    styleUrls: ['./patient-post-referral.component.scss'],
    standalone: false,
})
export class PatientPostReferralComponent implements OnInit {
    /**
     * The component constructor
     * @param dataLayer Connects to the data layer service
     * @param uiglobals instance of UIRouterGlobals
     * @param toastrService Connects to the toast service
     */
    constructor(
        public dataLayer: SilStoresService,
        public uiglobals: UIRouterGlobals,
        protected toastrService: NbToastrService
    ) {}
    /**
     * Used to display the loader when data is being submitted
     */
    loading: boolean = false;
    /**
     * Boolean used to hide add attachment button
     */
    hideAddAttachmentButton: boolean = true;
    /**
     * referral details report data
     */
    referralData: any;

    /**
     * Function used to get the referral details
     */

    fetchReferralDetails() {
        if (this.uiglobals.params.serviceRequestId) {
            this.loading = true;
            this.dataLayer
                .get('patient-referral', null, {
                    serviceRequestID: this.uiglobals.params.serviceRequestId,
                })
                .subscribe({
                    next: response => {
                        this.referralData = response;
                        this.loading = false;
                    },
                    error: err => {
                        this.showToastError(
                            'bottom-right',
                            'danger',
                            'Error',
                            err?.error?.message
                        );
                        this.loading = false;
                    },
                });
        }
    }

    /**
     * Method used to display a toast error message
     */
    showToastError(position, status, msg, context) {
        const duration = 7000;
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Component lifecycle used after the component is initialized
     */

    ngOnInit() {
        this.fetchReferralDetails();
    }
}

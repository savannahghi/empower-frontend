import { Component, Input, OnInit } from '@angular/core';
import {
    NbButtonModule,
    NbDatepickerModule,
    NbSpinnerModule,
    NbThemeModule,
    NbToastrModule,
    NbToastrService,
} from '@nebular/theme';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { StateService } from '@uirouter/angular';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { catchError, throwError, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../../../../app/@theme/theme.module';
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-referral-form',
    templateUrl: './referral-form.component.html',
    styleUrls: ['./referral-form.component.scss'],
    imports: [
        CommonModule,
        NbButtonModule,
        NbSpinnerModule,
        NbDatepickerModule,
        ThemeModule,
        NbThemeModule,
        NbToastrModule,
    ],
})
/**
 * This is the class definition of the component
 */
export class ReferralFormComponent implements OnInit {
    /**
     * The component constructor
     * @param toastService Connects to the toast service
     * @param dataLayer Connects to the data layer service
     * @param errorHandler injects instance of errorhandler service
     * @param $state injects the $state service
     * @param authService injects the auth service
     */
    constructor(
        protected toastService: NbToastrService,
        public dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService,
        public $state: StateService,
        public authService: Authorization
    ) {}
    /**
     * Service request id returned after form referral
     */
    @Input() servicerequestId: string;
    /**
     * Defines form fetch loading state
     */
    loadingFormFetch: boolean;

    /**
     * Defines loading state when form is shared
     */
    loadingFormShare: boolean;
    /**
     * Boolean used to show share button
     */
    showShareButton: boolean = false;
    /**
     * stores workstation
     */
    workstation: any;
    /**
     * Time used to show a toast
     */
    toastTime = 5000;
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
    /**
     * Method used to display a toast error message
     */
    showToastError(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Function used to download the followup form
     */
    fetchReferralForm() {
        this.loadingFormFetch = true;

        const param = {
            servicerequest: this.servicerequestId,
        };
        this.dataLayer
            .getClinical('referral-report', param, 'blob')
            .pipe(
                timeout(14000),
                catchError(() =>
                    throwError(
                        () => 'An unexpected error occurred. Please try again.'
                    )
                )
            )
            .subscribe({
                next: this.pdfDownloaded,
                error: error => {
                    this.loadingFormFetch = false;
                    this.errorHandler.handleError(error, this, 'clinical');
                },
            });
    }

    /**
     * Resolves the form data fetching observable
     * @param data Blob object containg the referral form data object
     */
    pdfDownloaded = data => {
        this.showToast(
            'bottom-right',
            'success',
            'Successful',
            `The referral form has been successfully generated and is ready to be downloaded or shared`
        );
        this.loadingFormFetch = false;
        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);

        // open PDF in a new tab
        window.open(fileURL);
        const a = document.createElement('a');
        a.href = fileURL;
        a.target = '_blank';
        a.download = 'screening-referral-report.pdf';
        document.body.appendChild(a);
        a.click();
        this.showShareButton = true;
    };
    /**
     * Function used to share link to form
     */
    shareReferralForm() {
        this.loadingFormShare = true;
        const payload = {
            serviceRequestID: this.servicerequestId,
            workstationID: this.workstation?.workstation,
            branchID: this.workstation['workstation__org_unit__parent'],
        };
        this.dataLayer.create('referral-form', payload).subscribe({
            next: () => {
                this.showToast(
                    'bottom-right',
                    'success',
                    'Successful',
                    `Message sent`
                );
                this.loadingFormShare = false;
            },
            error: err => {
                this.showToastError(
                    'bottom-right',
                    'error',
                    err?.error?.message,
                    'clinical'
                );
                this.loadingFormShare = false;
            },
        });

        return;
    }

    /** Deals with error */
    errorHandlerFxn = error => {
        this.loadingFormShare = false;
        this.errorHandler.handleError(error, this, 'clinical');
    };

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.workstation = this.authService.getWorkstation();
    }
}

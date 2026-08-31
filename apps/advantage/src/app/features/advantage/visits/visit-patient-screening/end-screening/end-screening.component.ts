import { Component, Input, OnInit } from '@angular/core';
import {
    NbButtonModule,
    NbSpinnerModule,
    NbToastrModule,
    NbToastrService,
} from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../../../@theme/theme.module';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-end-screening',
    imports: [
        CommonModule,
        ThemeModule,
        NbButtonModule,
        NbToastrModule,
        NbSpinnerModule,
    ],
    templateUrl: './end-screening.component.html',
    styleUrls: ['./end-screening.component.scss'],
})
/**
 * This is the class definition of the component
 */
export class EndScreeningComponent implements OnInit {
    /**
     * The component constructor
     * @param toastService Connects to the toast service
     * @param $state injects the $state service
     * @param authService injects the auth service
     * @param errorHandler injects instance of errorhandler service
     * @param uiglobals Access instance of uirouter global service
     * @param dataLayer Access instance of the silstores service
     */
    constructor(
        protected toastService: NbToastrService,
        public $state: StateService,
        public authService: Authorization,
        private errorHandler: ErrorHandlerService,
        public uiglobals: UIRouterGlobals,
        public dataLayer: SilStoresService
    ) {}
    /**
     * Action that enables the end screening button
     */
    @Input() activateStep: any;
    /**
     * Encounter ID
     */
    @Input() encounterID?: string;
    /**
     * The Type of Cancer Screening being done
     */
    @Input() cancerType?: string;
    /**
     * Patient ID
     */
    @Input() patientID?: string;
    /**
     * Type of referral
     */
    @Input() referralType?: string;
    /**
     * Patient's return date after referral
     */
    @Input() returnDate?: string;
    /**
     * stores workstation
     */
    workstation: any;
    /**
     * ERP Organization data
     */
    erpOrgData: any;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * Defines loading state as screening ends and appointment is being made
     */
    loading: boolean;
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
     * Function used to book an appointment and end screening
     */
    endScreening() {
        this.loading = true;

        const payload = {
            encounterID: this.encounterID,
        };

        this.dataLayer
            .update('end-screening', this.encounterID, payload, null, true)
            .subscribe({
                next: res => this.appointmentResponseFunction(res),
                error: err => this.errorHandlerFxn(err),
            });

        return;
    }
    /**
     * Function used to handle the appointment mutation call's next callback
     * @param response server response
     */
    appointmentResponseFunction = response => {
        this.loading = false;

        if (response.results) {
            this.showToast(
                'bottom-right',
                'success',
                'Successful',
                `${
                    this.returnDate
                        ? 'Appointment created, screening has ended'
                        : 'Screening has ended'
                }`
            );

            this.$state.transitionTo(
                `app.advantage.visits.detail.screening.${this.cancerType}_cancer`,
                {
                    id: this.uiglobals.params?.id,
                    encounter_id: this.encounterID,
                    step: 0,
                },
                { reload: true }
            );
            return;
        }

        if (response?.errors?.[0]) {
            this.errorHandler.handleError(response.errors[0], this, 'clinical');
        }
    };

    /**
     * Method used to display a toast error message
     */
    showToastError(position, status, msg, context) {
        const duration = 7000;
        this.toastService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    /** Deals with error */
    errorHandlerFxn = error => {
        this.loading = false;
        this.errorHandler.handleError(error, this, 'clinical');
    };
    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.workstation = this.authService.getWorkstation();
        this.erpOrgData = this.authService.getErpOrganisation();
    }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    NbAccordionModule,
    NbButtonModule,
    NbCardModule,
    NbDatepickerModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbSpinnerModule,
    NbToastrModule,
    NbToastrService,
} from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import moment from 'moment';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../../@theme/theme.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkikaFormModule } from '../../../../shared/sil-form/sil-form.module';
import { PositiveResultComponent } from './positive-result/positive-result.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

/**

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-visit-referral',
    imports: [
        CommonModule,
        ThemeModule,
        NbButtonModule,
        NbSpinnerModule,
        NbIconModule,
        NbToastrModule,
        NbDatepickerModule,
        NbAccordionModule,
        SkikaFormModule,
        NbFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        NbInputModule,
        NgxSkeletonLoaderModule,
        NbCardModule,
        PositiveResultComponent,
    ],
    templateUrl: './visit-referral.component.html',
    styleUrls: ['./visit-referral.component.scss'],
})
/**
 * Class that renders the Visit Referral Component
 */
export class VisitReferralComponent implements OnInit {
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
        public uiglobals: UIRouterGlobals,
        public dataLayer: SilStoresService
    ) {}
    /**
     * Selected date
     */
    selectedDate: string;
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
     * Defines loading state as appointment is being made
     */
    loading: boolean;

    /**
     * The Type of Cancer Screening being done
     */
    @Input() cancerType?: string;

    /**
     * The Patient Id
     */
    @Input() patientId?: string;

    /**
     * Specifies if the component is in a drawer component
     */
    @Input() isChild?: boolean;
    /**
     * emitted when a custom function action button is clicked
     */
    @Output() customFxn = new EventEmitter<string>();

    /**
     * Emitter that emits event used to trigger function that moves to screening stepper's next step
     */
    @Output() nextScreeningStepRequested = new EventEmitter();

    /**
     * Function to cancel clear the send sms details
     * and navigate user back to a base state
     */
    cancelFxn() {
        this.customFxn.emit();
    }

    /**
     * Selected scheduled date
     */
    returnDate: string = '';
    /**
     * Stores the minimum date
     */
    min: Object = moment();
    /**
     * The Encounter Id
     */
    encounterId: string;
    /**
     * holds the form data
     */
    formData: any;
    /**
     * servicerequest id used to fetch referral form
     */
    servicerequestId: string;
    /**
     * Type of referral
     */
    referralType: string;
    /**
     * selected return date
     * @param event
     */
    handleReturnDateChange(event) {
        this.returnDate = event;
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
    /**
     * Function to emit the referral
     * @param event the set schedule data object
     */
    emitSetReferral(event: any) {
        this.referralType = event?.referralType;
        this.servicerequestId = event?.servicerequestId;
    }

    /**
     * Function that navigates user to the screening report page
     */
    viewReport() {
        if (this.isChild) {
            this.nextScreeningStepRequested.emit();
            this.cancelFxn();
            return;
        }
        this.$state.transitionTo(
            `app.advantage.visits.detail.screening.${this.cancerType}_cancer`,
            {
                id: this.uiglobals.params?.id,
                encounter_id: this.uiglobals.params.encounter_id,
                step: 2,
            },
            { reload: true }
        );
    }
    /**
     * Function that redirects invalid state
     */
    redirectToHome(params) {
        if (!params.cancer_type || !params.patient_id || !params.encounter_id) {
            this.$state.transitionTo(
                `app.advantage.visits.detail.screening`,
                {
                    id: this.uiglobals.params?.id,
                    encounter_id: this.uiglobals.params.encounter_id,
                },
                { reload: true }
            );
        }
        return;
    }
    /**
     * Function used to book an appointment
     */
    scheduleFollowUp() {
        this.loading = true;

        const appointmentReasons = {
            diagnosis_referral:
                'Refer patient for further diagnostics and testing',

            specialist_referral:
                'Refer patient to specialist for further evaluation',

            treatment_referral: 'Refer patient for treatment',
        };

        const mainData = {
            encounterID: this.encounterId,
            patientID: this.patientId,
            reason: appointmentReasons[this.referralType] ?? 'Patient referral',
            date: moment(this.returnDate).format('YYYY-MM-DD'),
        };

        const headersInput = {
            organisation: this.erpOrgData.organisation_id,
            cluster: this.workstation['workstation__org_unit__parent__parent'],
            department: this.workstation['workstation__org_unit'],
            branch: this.workstation['workstation__org_unit__parent'],
            workstation: this.workstation['workstation'],
            variant: environment.variant,
        };
        const appointmentData = Object.assign({
            appointmentInput: {
                ...mainData,
            },
            headersInput: {
                ...headersInput,
            },
        });

        this.dataLayer
            .create('patient-appointment', appointmentData)
            .subscribe({
                next: () => {
                    this.loading = false;
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Successful',
                        `${
                            this.returnDate
                                ? 'Appointment created'
                                : 'Screening has ended'
                        }`
                    );

                    this.viewReport();
                },
                error: err => {
                    this.loading = false;
                    this.showToastError(
                        'bottom-right',
                        'danger',
                        'Failed',
                        err?.error?.message
                            ? err.error.message
                            : 'Sorry, an error occured setting up the appointment. Please try again.'
                    );
                },
            });

        return;
    }

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

    /**
     * Hook that is called when the component is initialized
     */
    ngOnInit() {
        this.encounterId = this.uiglobals.params.encounter_id;
        /**
         * If the component is loaded throught state and not as a child
         * Run the logic below
         */
        if (!this.isChild) {
            this.cancerType = this.uiglobals.params.cancer_type;
            this.patientId = this.uiglobals.params.patient_id;
            this.redirectToHome(this.uiglobals.params);
        }

        this.workstation = this.authService.getWorkstation();
        this.erpOrgData = this.authService.getErpOrganisation();
    }
}

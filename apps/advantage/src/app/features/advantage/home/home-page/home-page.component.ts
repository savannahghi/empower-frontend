/** Imports used in the component */
import { Component, OnInit, ViewChild } from '@angular/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import moment from 'moment';
import { ShepherdService } from 'angular-shepherd';
import {
    homeDetailsSteps as defaultSteps,
    defaultStepOptions,
} from '../../onboarding/shepherd-config';
import { NbToastrService } from '@nebular/theme';
import { PatientService } from '../../patients/patient.service';
import { CheckInListComponent } from '../../check-in/check-in-list/check-in-list.component';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { LocalStateService } from '../../../../@core/utils/state.service';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { FeatureFlagService } from 'app/@core/utils/feature.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { environment } from 'environments/environment';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - style: contains the scss file used to style the component
 */
@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    standalone: false,
})

/**
 * This is the class definition of the component
 */
export class HomePageComponent extends CheckInListComponent implements OnInit {
    /**
     * Contains details of the logged in user
     */
    user: any;

    /**
     * Contains the organization's settings
     */
    settings: any;

    /**
     * Contains the preferred scheduling method
     */
    preferredScheduling: any;

    /**
     * Contains all the appointments for the current day
     */
    appointments: any;

    /**
     * Contains information about the appointment
     */
    selectedAppointment: any;

    /**
     * Contains the patient details
     */
    patientDetails: any;

    /**
     * Contains information about the patient
     */
    patient: any;

    /**
     * Contains selected queue used to start a visit
     */
    selectedQueue: Object;

    /**
     * Contains selected billing class used to start a visit
     */
    selectedBillingClass: object;

    /**
     * Contains arrived visit
     */
    visit: any;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * Contains all the check-in appointments for the current day
     */
    checkins: any;

    /**
     * Shows the loading of the xhr requests
     */
    loading: boolean = false;

    /**
     * Used to determine if the content of a form has been submitted
     */
    submitted: boolean = false;

    /**
     * Used to determine if detail view or patient list
     */
    detailView: boolean;

    /**
     * gets the stored selected language
     */
    selectedLanguage: any = this.cookieService.getLanguageCookie();

    /** confirm as appointment as arrived sweetalert */
    @ViewChild('confirmArrival')
    public confirmArrival!: SwalComponent;

    /**
     * Constructor for the component class
     * @param dataLayer gives access to the datalayer service
     * @param errorHandler gives access to the error handler service
     */
    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        public authUrlConfig: Authorization,
        public shepherdService: ShepherdService,
        protected toastrService: NbToastrService,
        public $state: StateService,
        public localStateService: LocalStateService,
        public uiglobals: UIRouterGlobals,
        public patientService: PatientService,
        public translate: TranslateService,
        public flagService: FeatureFlagService,
        public cookieService: Cookies,
        public authConfig: Authorization,
        public authService: AuthenticationService,
        public analytics: AnalyticsService
    ) {
        super(
            dataLayer,
            errorHandler,
            toastrService,
            $state,
            localStateService,
            patientService,
            uiglobals,
            translate,
            flagService,
            cookieService,
            authConfig,
            analytics
        );
    }

    /**
     * Used to set the form options
     * @param formOptions
     */
    getFormOptions(formOptions) {
        this.formOptions = formOptions;
    }

    /**
     * Used to submit the patient information
     * @param model - used to submit patient information
     */
    submitPatient(model) {
        const patientData = Object.assign({}, model);
        this.submitted = true;
        this.loading = true;
        // Update date to YYYY-MM-DD format before saving
        if (patientData.person.date_of_birth) {
            patientData.person.date_of_birth = moment(
                patientData.person.date_of_birth
            ).format('YYYY-MM-DD');
        }
        patientData.person.person_ids = [];
        if (patientData.person.person_contacts) {
            patientData.person.person_contacts.forEach(contact => {
                if (contact.contact_type === 'phone_number') {
                    if (contact.contact.startsWith('+254')) {
                        contact.contact = contact.contact;
                    } else if (/^\d+$/.test(contact.contact)) {
                        contact.contact = '+254' + contact.contact;
                    }
                }
            });
        }
        if (patientData.person.id_value) {
            patientData.person.person_ids.push({
                id_value: patientData.person.id_value,
                id_document_type: patientData.person.id_document_type,
            });
        }
        this.dataLayer
            .update('patients', this.patientDetails.id, patientData)
            .subscribe({
                next: () => {
                    this.$state.reload();
                    this.toggleModal('patientRegistration');
                    const msg = 'Registration completed';
                    this.showToast(
                        'bottom-right',
                        'success',
                        msg,
                        'Patient details have been updated'
                    );
                    this.loading = false;
                    this.formOptions.resetModel();
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                },
            });
    }
    goToPatientsRegistrationPage() {
        this.$state.go(
            `app.advantage.patients.register`,
            { step: 0, state: 'home' },
            { reload: true }
        );
    }

    /**
     * Adds appointment when creating check-in appt
     */
    addAppointment(model) {
        this.loading = true;
        const data = {
            slot: this.timeSlots['id'],
            /** Add some seconds to ensure start time will be greater than
             * current time when saving the appointment in the backend.
             */
            start: moment().add(5, 'seconds').format('YYYY-MM-D HH:mm:ss'),
            end: this.timeSlots['end'],
            patient: model.patient,
        };
        this.dataLayer.create('appointments', data).subscribe({
            next: () => {
                this.getCheckins();
                this.toggleModal('checkin');
                const msg = 'Queue has been updated';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Patient has been added to the queue.'
                );
                this.analytics.logEvent('check-in_created');
                this.loading = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    /**
     * Filter all appointments for the current day(Today)
     */
    appointmentFilterParams = {
                  from_date: moment().format('YYYY-MM-D HH:mm'),
                  start: moment().format('YYYY-MM-D'),
                  appointment_status: 'BOOKED',
                  schedule_actor: 'PRACTITIONER',
              };

    /**
     * Fetch list of appointments
     */
    getAppointments() {
        this.dataLayer
            .list('appointments', this.appointmentFilterParams)
            .subscribe({
                next: (response: any) => {
                    this.appointments = response.results;
                    this.loading = false;
                },
                error: err => {
                    this.errorHandler.handleError(err);
                    this.loading = false;
                },
            });
    }

    /**
     * Filter all check-ins for the current day(Today)
     */
    checkinFilterParams = {
        schedule_actor: 'FACILITY',
        from_date: moment().format('YYYY-MM-D'),
        start: moment().format('YYYY-MM-D'),
        appointment_status: 'BOOKED',
        ordering: 'start',
    };

    /**
     * loads patient details for completion
     */
    completeRegistration(patient) {
        this.patientDetails = patient;
        this.toggleModal('patientRegistration');
    }

    /**
     * Fetch list of checkins
     */
    getCheckins() {
        this.dataLayer
            .list('appointments', this.checkinFilterParams)
            .subscribe({
                next: (response: any) => {
                    this.checkins = [];
                    const appts = response.results;
                    // Checks whether patient details are complete
                    const len: number = appts?.length;
                    for (let i = 0; i < len; i++) {
                        this.patientService.checkIfPatientIsComplete(
                            appts[i].patient_details
                        );
                    }
                    this.checkins = appts;
                    this.loading = false;
                },
                error: err => {
                    this.errorHandler.handleError(err);
                    this.loading = false;
                },
            });
    }

    /** Used to trigger sweet alert */
    fireSwal(swal) {
        swal.fire();
    }

    /**
     * Used to trigger sweet alert for confirm arrival
     */
    updateConfirmArrivalStatus(appointment: any) {
        this.selectedAppointment = appointment;
        this.fireSwal(this.confirmArrival);
    }

    /**
     * Transition booking to fulfilled
     */
    transitionToFulfilled() {
        const params = {
            appointment_status: 'FULFILLED',
        };
        this.dataLayer
            .update('appointments', this.selectedAppointment.id, params)
            .subscribe({
                next: () => {
                    const msg = 'Confirmed Arrival';
                    this.showToast(
                        'bottom-right',
                        'success',
                        msg,
                        "The patient's arrival has been recorded successfully"
                    );
                    this.getAppointments();
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     * function to confirm arrival
     */
    confirmUpdate() {
        const params = {
            appointment_status: 'ARRIVED',
        };

        this.dataLayer
            .update('appointments', this.selectedAppointment.id, params)
            .subscribe({
                next: () => this.transitionToFulfilled(),
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     * Function to handle the available settings
     * @param setting the organization setting
     * @param permissionChecked boolean to check if user has advantage.appointment_list permission
     */
    handleSetting(setting, permissionChecked) {
        if (
            setting['name'] ===
                'scheduling:preferred_patient_scheduling_method' &&
            permissionChecked
        ) {
            this.preferredScheduling = setting['value'];
            // Fetch the appointments based on the preferred scheduling
            if (this.preferredScheduling === 'APPOINTMENT BOOKING') {
                this.getAppointments();
            }
            if (this.preferredScheduling === 'CHECK-IN SCHEDULING') {
                this.getCheckins();
            }
        }
    }
    /**
     *  Get the preferred scheduling method
     */
    getPreferredSchedulingMethod() {
        this.loading = true;
        this.settings.forEach((setting: object) => {
            this.handleSetting(
                setting,
                this.authService.checkPermission('advantage.appointment_list')
            );
        });
    }

    /**
     * Go to patient start visit page
     */
    navigateToStartVisit() {
        this.$state.go('app.advantage.visits.start_visit', {
            id: this.checkins[0].patient_details.id,
            appointment: this.checkins[0].id,
        });
    }

    /**
     * Function to get org settings
     */
    getSettings() {
        this.dataLayer.list('settings').subscribe({
            next: (responses: any) => {
                this.settings = responses;
                if (Array.isArray(this.settings)) {
                    this.getPreferredSchedulingMethod();
                }
            },
            error: err => {
                this.errorHandler.handleError(err);
                this.loading = false;
            },
        });
    }
    /**
     * Gets all appointments for the current day(Today)
     */
    ngOnInit(): void {
        this.loading = true;
        this.getCheckinSchedule();
        /**
         * Gets details of currently logged in provider
         */
        this.dataLayer
            .list('userProfile', {
                fields: 'first_name,clinical_facility_id,clinical_org_id',
            })
            .subscribe({
                next: (responses: any) => {
                    this.user = responses;
                    this.loading = false;
                    const ids = {
                        clinical_facility_id: responses?.clinical_facility_id,
                        clinical_org_id: responses?.clinical_org_id,
                    };
                    /** setup clinical ids */
                    this.authUrlConfig.setClinicalIds(ids);
                },
                error: err => {
                    this.errorHandler.handleError(err);
                    this.loading = false;
                },
            });

        /**
         * Gets preferred settings for the organization
         */
        this.getSettings();

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }

    /** home walkthough function */
    startWalkthrough() {
        this.shepherdService.defaultStepOptions = defaultStepOptions;
        this.shepherdService.modal = true;
        this.shepherdService.tourName = 'home';
        this.shepherdService.confirmCancel = false;
        this.shepherdService.addSteps(defaultSteps);
        this.shepherdService.start();
    }
}

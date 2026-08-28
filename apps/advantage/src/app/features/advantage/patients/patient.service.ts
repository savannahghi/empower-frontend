/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
/**
 * 3rd party libraries
 */
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../@core/auth/services/authorization.service';
/**
 * Internal libraries
 */
import { AnalyticsService } from 'app/@core/utils/analytics.service';
import { ErrorHandlerService } from '../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import {
    GuarantorTypeModel,
    PatientCoverModel,
    PatientModel,
    PersonModel,
    SchemeModel,
    VisitTypeCode,
} from '../models';

/**
 * Allows service to be injectable into a patient component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that helps with patient administration
 */
export class PatientService {
    /** Used to store patient information */
    patient: any = {};
    /**
     * Used to store appointment info associated to a patient.
     * This is used to know if there is an appointment that
     * converted into a visit
     */
    patientAppointments: [];
    /**
     * Used to store queues
     */
    queues: any[];
    /**
     * Used to store attachments
     */
    attachments: [];
    /**
     * Used to store patient covers
     */
    patientCovers: [];
    /**
     * Used to store appointment info associated to a patient.
     */
    patientVisit = {};
    /**
     * Used to emit patient info to its subscribers.
     */
    patientDataEmitter: Subject<any>;
    /**
     * Used to emit patient attachmenets info to its subscribers.
     */
    patientAttachmentsDataEmitter: Subject<any>;
    /**
     * Used to emit queues to its subscribers.
     */
    queuesDataEmitter: Subject<any>;
    /**
     * Used to emit patient appointment info to its subscribers.
     */
    patientAppointmentsDataEmitter: Subject<any>;
    /**
     * Used to emit patient info associated to a visit to its subscribers.
     */
    patientVisitDataEmitter: Subject<any>;

    /**
     * constructor for the patient service
     * @param dataLayer injects the data layer service
     * @param toastrService injects the toast service
     * @param errorHandler injects the error handler service
     * @param $state injects the state service
     */
    constructor(
        public dataLayer: SilStoresService,
        protected toastrService: NbToastrService,
        private errorHandler: ErrorHandlerService,
        public auth: Authorization,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        public authService: AuthenticationService,
        public analytics: AnalyticsService
    ) {
        this.patientAppointmentsDataEmitter = new Subject();
        this.patientVisitDataEmitter = new Subject();
        this.patientDataEmitter = new Subject();
        this.queuesDataEmitter = new Subject();
        this.patientAttachmentsDataEmitter = new Subject();
    }

    /**
     * Method used to display a toast
     */
    showToast(position, status, title, message) {
        const duration = 5000;
        this.toastrService.show(`${message}`, title, {
            position,
            status,
            duration,
        });
    }

    checkIfPatientIsComplete(patient) {
        let complete =
            patient.person?.date_of_birth !== null &&
            patient.person?.first_name !== null &&
            patient.person?.last_name !== null &&
            patient.person?.gender !== null;
        const orgSettings = this.auth.getOrgSettings();

        const lastNameRequired = orgSettings?.find(
            setting => setting.name === 'patients:patient_full_name'
        );
        if (lastNameRequired?.value === true) {
            complete = complete && patient.person?.other_names !== null;
        }
        patient.isComplete = complete;
        return patient;
    }

    /**
     * Used to set the patient in context
     */
    setPatient(patient) {
        const pat = this.checkIfPatientIsComplete(patient);
        this.patient = pat;
        this.getUpcomingAppointments(patient);
        this.getQueues();
        this.checkForOngoingVisits(patient);
        this.patientDataEmitter.next(patient);
    }

    /** sets a patient details */
    setPatientDetails(patient) {
        this.patient = patient;
        this.patientDataEmitter.next(patient);
    }

    /**
     * Used to set patient appointments
     * */
    setPatientAppointments(patientAppointments) {
        this.patientAppointments = patientAppointments;
        this.patientAppointmentsDataEmitter.next(patientAppointments);
    }

    /**
     * Set upcoming appointments
     * */
    getUpcomingAppointments(patient) {
        if (!this.authService.checkPermission('advantage.appointment_list')) {
            return;
        }
        const startOfDay = moment().startOf('day');
        const params = {
            patient: patient.id,
            from_date: startOfDay.toISOString(),
            appointment_status: 'BOOKED,IN_PROGRESS',
            ordering: 'start',
        };
        this.dataLayer.list('appointments', params).subscribe({
            next: (response: any) => {
                this.patientAppointments = response.results;
                this.setPatientAppointments(this.patientAppointments);
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * Used to set patient visits
     * */
    setPatientVisit(patientVisit) {
        this.patientVisit = patientVisit;
        this.patientVisitDataEmitter.next(patientVisit);
    }

    /**
     * Used to set queues
     * */
    setQueues(queues) {
        this.queues = queues;
        this.queuesDataEmitter.next(queues);
    }

    /**
     * Check for ongoings visits
     * */
    checkForOngoingVisits(patient) {
        if (!this.authService.checkPermission('advantage.visit_list')) {
            return;
        }
        const params = {
            patient: patient.id,
            status: 'ARRIVED,IN_PROGRESS',
        };
        this.dataLayer.list('visits', params).subscribe({
            next: (response: any) => {
                this.patientVisit = response.results[0];
                this.setPatientVisit(this.patientVisit);
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * Check for queues
     * */
    getQueues() {
        if (!this.authService.checkPermission('advantage.queue_list')) {
            return;
        }
        const params = { active: true, fields: 'id,name,active,queue_type' };
        this.dataLayer.list('queues', params).subscribe({
            next: (response: any) => {
                const allQueues = response.results;
                const queues: any[] = [];
                if (Array.isArray(allQueues)) {
                    allQueues.forEach((queue: any) => {
                        if (queue['name'] !== 'Check-in Queue | OTHER') {
                            queues.push(queue);
                        }
                    });
                }
                this.queues = queues;
                this.setQueues(this.queues);
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * Start a visit with the patient details
     */
    startVisit(
        comp,
        patient,
        appointment?,
        queue?,
        billingClass?,
        startDate?,
        guarantorId?,
        selectedGuarantorType?: GuarantorTypeModel,
        patientCover?: PatientCoverModel,
        visitType?: VisitTypeCode,
        salesType?, // defines whether the visit was an over the counter sale
        guarantorName?
    ) {
        /** Check for permission before action is performed */
        if (!this.authService.checkPermission('advantage.visit_create')) {
            this.showToast(
                'bottom-right',
                'warning',
                'Missing Permission',
                'You do not have the correct role to perform this action'
            );
            return;
        }

        /** Check if patient has clinical_id before starting visit */
        if (
            (patient['clinical_id'] === null ||
                patient['clinical_id'] === undefined) &&
            salesType !== 'OTC' // Check not necessary for an OTC sale
        ) {
            comp.loading = false;
            this.showToast(
                'bottom-right',
                'warning',
                'Failed to start visit',
                'Please try again later'
            );
            return;
        }

        const params = {
            visit_type: 'AMB',
            status: 'ARRIVED',
            patient: patient.id,
            billing_class: billingClass ? billingClass : 'CASH',
        };

        /**
         * Add start date if provided
         */
        if (startDate) {
            params['start'] = startDate;
        }

        /**
         * Add visit type
         */
        if (visitType) {
            params['visit_type'] = visitType;
        }

        /**
         * Check to see if appointment is defined
         */
        if (appointment) {
            appointment.id
                ? (params['appointment'] = appointment.id)
                : (params['appointment'] = appointment);
        }
        /**
         * Check to see if appointment is defined
         */
        if (queue) {
            params['current_queue'] = queue.id;
        }
        /**
         * Check to see if billingClass is credit
         */
        if (billingClass === 'CREDIT' && selectedGuarantorType !== 'SELF') {
            params['guarantor_id'] = guarantorId;
            params['guarantor_name'] = guarantorName;
        }
        /**
         * Add append patient cover information
         */
        if (guarantorId && patientCover) {
            params['patient_cover'] = patientCover?.id;
        }

        /**
         * Does an API call to create the visit
         */
        this.dataLayer.create('visits', params).subscribe({
            next: (resp: any) => {
                comp.loading = false;
                const title = 'Visit started';
                const context = 'Visit has been started';
                this.showToast('bottom-right', 'success', title, context);
                this.analytics.logEvent('visit_created');
                if (params['appointment']) {
                    this.analytics.logEvent('appointment_fulfilled');
                }
                this.$state.go(
                    'app.advantage.visits.detail',
                    {
                        id: resp.id,
                        service_request: resp.service_requests[0].id,
                    },
                    { reload: true }
                );
            },
            error: err => {
                comp.loading = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * Add patient cover
     * @param comp
     * @param scheme
     * @param memberNumber
     * @param patient
     * @param startDate
     * @param endDate
     * @returns
     */
    addPatientCover(
        comp: { loading: boolean },
        scheme: SchemeModel,
        memberNumber: string,
        patient: PatientModel,
        startDate: string,
        endDate: string
    ): Observable<PatientCoverModel> {
        const params = {
            scheme_name: scheme.name,
            scheme_id: scheme.id,
            member_number: memberNumber,
            patient: patient.id,
            payer_id: scheme.payer,
            valid_from: startDate,
            valid_to: endDate,
        };

        /**
         * Does an API call to create patient cover
         */
        return new Observable(observer => {
            this.dataLayer.create('patient-covers', params).subscribe({
                next: (resp: PatientCoverModel) => {
                    comp.loading = false;
                    const title = 'Patient cover added';
                    const context = 'Patient cover has been successfully added';
                    this.showToast('bottom-right', 'success', title, context);
                    observer.next(resp);
                    this.getPatientCover({ patientId: patient.id });
                    observer.complete();
                },
                error: err => {
                    comp.loading = false;
                    this.errorHandler.handleError(err, this);
                    observer.error(err);
                },
            });
        });
    }

    /**
     * Add person to segment
     * @param model contains segment and person information
     * @param comp contains information on the component
     * @returns
     */
    addMemberToSegment(model, comp) {
        const params = {
            segment_id: model.segment,
            person_id: model.person,
        };

        /**
         * Does an API call to create segment member
         */
        return new Observable(observer => {
            this.dataLayer.create('patient-segments', params).subscribe({
                next: (resp: PatientCoverModel) => {
                    comp.loading = false;
                    const title = 'Client added to segment';
                    const context = 'Client has been successfully added';
                    this.showToast('bottom-right', 'success', title, context);
                    observer.next(resp);
                    observer.complete();
                },
                error: err => {
                    comp.loading = false;
                    this.errorHandler.handleError(err, this);
                    observer.error(err);
                },
            });
        });
    }

    /**
     * Get Patient Covers
     */
    getPatientCover({ patientId }: { patientId: string }) {
        const params = { page_size: 100, active: true, patient: patientId };
        this.dataLayer.list('patientcovers', params).subscribe({
            next: (response: any) => {
                this.patientCovers = response.results;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * Create patient using data from HCRM if a match is confirmed
     */
    preparePatientPayload(selectedPatient, cmp) {
        // Split the full name into first, last and other names
        const nameArr: string[] = selectedPatient?.name.split(' ');
        const firstName = nameArr[0];
        const lastName = nameArr[nameArr.length - 1];
        let otherNames;
        if (nameArr.length > 2) {
            otherNames = nameArr.slice(1, nameArr.length - 1).join(' ');
        }
        // Set up payload that will be used to create a patient
        const payload = {
            global_health_id: selectedPatient.sil_global_identifier,
            person: {
                person_contacts: [],
                date_of_birth: selectedPatient?.date_of_birth,
                deceased: false,
                first_name: firstName,
                last_name: lastName,
                other_names: otherNames,
                gender: selectedPatient?.gender,
                person_ids: [],
                person_photos: [],
            },
        };
        if (selectedPatient?.phone_number) {
            payload.person.person_contacts.push({
                contact_type: 'phone_number',
                contact: selectedPatient.phone_number,
                consent_to_contact_given: cmp.smsConsent,
            });
        }
        if (selectedPatient?.email) {
            payload.person.person_contacts.push({
                contact_type: 'email',
                contact: selectedPatient.email,
                consent_to_contact_given: cmp.smsConsent,
            });
        }
        return payload;
    }

    /** Check if patient exists before creating the patient using createPatient() */
    checkPatientExists(patientData: PatientModel, cmpt, visitSaleType?) {
        const firstName = patientData.person.first_name;
        const lastName = patientData.person.last_name;
        const contact = patientData.person.person_contacts[0]?.contact;
        const query = firstName + ' ' + lastName + ' ' + contact;
        const params = {
            search: query,
            active: true,
            fields: 'id,patient_id,person,source',
        };
        this.dataLayer.list('patients', params).subscribe({
            next: response => {
                const data = response['results'];
                if (data.length === 0) {
                    this.createPatient(patientData, cmpt, visitSaleType);
                }
                if (data.length === 1) {
                    cmpt.existingPatient = data[0];
                    cmpt.patient = data[0];
                    cmpt.toggleModal('patientExists');
                    cmpt.loading = false;
                    return cmpt.patient;
                }
                if (data.length > 1) {
                    this.showToast(
                        'bottom-right',
                        'warning',
                        'Duplicate records found',
                        'Please retire the account with no data'
                    );
                    cmpt.goToPatientList();
                    return data[0];
                }
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                cmpt.loading = false;
            },
        });
    }
    /**
     * create education consent record
     */
    createEducationConsent(context: string) {
        const params = {
            person: this.uiglobals.params.person_id,
            consent_type: context,
            verification_type: 'HUMAN',
            status: 'VERIFIED',
        };
        this.dataLayer.create('consent', params).subscribe({
            next: () => {},
            error: err => {
                this.showToast(
                    'bottom-right',
                    'danger',
                    'Error',
                    'An error occurred. Please try again'
                );
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * send OTP to patient
     */
    sendOTP(cmpt: any, consentId?: string) {
        cmpt.toggleConsentLoading('sending_otp');
        const id = this.uiglobals.params.consent_id ?? consentId;
        const customUrl = `${id}/send_otp`;
        this.dataLayer.create('consent', {}, {}, '', customUrl).subscribe({
            next: () => {
                cmpt.toggleConsentLoading('sending_otp');
                cmpt.toggleModal('verifyOTP', cmpt.currentConsent);
                cmpt.startCountdown();
            },
            error: err => {
                cmpt.toggleConsentLoading('sending_otp');
                this.showToast(
                    'bottom-right',
                    'danger',
                    'Error',
                    'An error occurred while sending the OTP. Please try again'
                );
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * resend OTP to patient
     */
    resendOTP(cmpt: any, consentId?: string) {
        cmpt.toggleConsentLoading('resend_otp');
        const id = this.uiglobals.params.consent_id ?? consentId;
        const customUrl = `${id}/send_otp`;
        this.dataLayer.create('consent', {}, {}, '', customUrl).subscribe({
            next: () => {
                cmpt.toggleConsentLoading('resend_otp');
                cmpt.resetCountdown();
            },
            error: err => {
                cmpt.toggleConsentLoading('resend_otp');
                this.showToast(
                    'bottom-right',
                    'danger',
                    'Error',
                    'An error occurred while sending the OTP. Please try again'
                );
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * verify OTP
     */
    verifyOTP(cmpt: any, consentId?: string) {
        cmpt.toggleConsentLoading('verifying_otp');
        const id = this.uiglobals.params.consent_id ?? consentId;
        const param = {
            code: cmpt.otp,
        };
        const customUrl = `${id}/verify_otp`;
        this.dataLayer.create('consent', param, {}, '', customUrl).subscribe({
            next: () => {
                cmpt.showSuccessModal = true;
                cmpt.toggleConsentLoading('verifying_otp');
                cmpt.toggleModal('verifyOTP', cmpt.currentConsent);
                cmpt.toggleModal('verificationResult', cmpt.currentConsent);
            },
            error: err => {
                cmpt.toggleConsentLoading('verifying_otp');
                cmpt.ngOtpInputRef?.setValue('');
                this.errorHandler.handleError(err, this);
            },
            complete: () => {
                cmpt.toggleConsentLoading('verifying_otp');
            },
        });
    }

    /**
     * transition OTP
     */
    transitionOTP(cmpt: any, status: string, consentId?: string) {
        cmpt.toggleConsentLoading('transition_otp');
        const id = this.uiglobals.params.consent_id ?? consentId;
        const param = {
            status: status,
        };
        this.dataLayer.statusUpdate('consent', id, param).subscribe({
            next: response => {
                const consentStatus = response['status'];
                this.uiglobals.params.consent_status = consentStatus;
                cmpt.toggleConsentLoading('transition_otp');
                cmpt.toggleConsentLoading('verificationResult');
                cmpt.toggleModal('navigateAfterCreating');
                cmpt.toggleModal('optOutSMS');
                this.showToast(
                    'bottom-right',
                    'success',
                    'Success',
                    'Consent has been successfully updated'
                );

                // Check if fetchConsent function exists before calling it
                if (typeof cmpt.fetchConsent === 'function') {
                    cmpt.fetchConsent();
                }
            },
            error: err => {
                cmpt.toggleConsentLoading('transition_otp');
                this.showToast(
                    'bottom-right',
                    'danger',
                    'Error',
                    'An error occurred. Please try again'
                );
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * create a consent record
     */
    createConsent(cmpt, personId?: string, reloadState?: boolean) {
        const params = {
            person: this.uiglobals.params.person_id || personId,
            consent_type: 'SMS_COMMUNICATION',
            verification_type: 'OTP',
        };
        this.dataLayer.create('consent', params).subscribe({
            next: resp => {
                const consentId = resp['id'];
                this.uiglobals.params.consent_id = consentId;
                cmpt.loading = false;
                cmpt.formOptions?.resetModel();
                // should navigate to patient consent
                if (reloadState) {
                    this.$state.reload();
                } else {
                    const stateParams = {};
                    Object.assign(stateParams, this.uiglobals.params);
                    Object.assign(stateParams, {
                        id: cmpt.registeredPatientId,
                        step: '2',
                    });
                    this.$state.go(
                        'app.advantage.patients.register',
                        stateParams
                    );
                }
            },
            error: err => {
                this.showToast(
                    'bottom-right',
                    'danger',
                    'Error',
                    'An error occurred while loading consent. Please try again'
                );
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /** Create patient */
    createPatient(patientData, cmpt, visitSaleType?) {
        const payload = {
            ...patientData,
            branch_id: this.auth.getWorkstation().workstation__org_unit__parent,
            cluster_id:
                this.auth.getWorkstation()
                    .workstation__org_unit__parent__parent,
            department_id: this.auth.getWorkstation().workstation__org_unit,
            workstation_id: this.auth.getWorkstation().workstation,
            source: 'ADVANTAGE_USER_REGISTRATION',
        };

        const healthID = patientData.global_health_id;

        this.dataLayer
            .create('patients', payload, null, null, healthID)
            .subscribe({
                next: response => {
                    cmpt.loading = false;
                    cmpt.patient = response;
                    cmpt.registeredPatientId = response['id'];
                    cmpt.registeredPersonId = response['person']['id'];
                    this.uiglobals.params.person_id = response['person']['id'];
                    this.uiglobals.params.phone_number =
                        response['person']['phone_number'];
                    this.uiglobals.params.email = response['person']['email'];

                    if (visitSaleType !== 'OTC') {
                        this.createConsent(cmpt);
                    }

                    if (visitSaleType === 'OTC') {
                        // reload the skika-form component
                        cmpt.formData = { patient: cmpt.patient };
                        cmpt.updated = false;
                        setTimeout(() => (cmpt.updated = true), 0);
                    }

                    const msg = 'Patient registered';
                    this.showToast(
                        'bottom-right',
                        'success',
                        msg,
                        'Patient has been registered successfully'
                    );
                    cmpt.loading = false;
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    cmpt.loading = false;
                },
            });
    }

    /**
     * Used to submit the related person information
     * @param model - used to submit related person information
     */
    submitRelatedPerson(model: PersonModel, cmpt) {
        let relatedPersonData = Object.assign({}, model);
        cmpt.submitted = true;
        cmpt.loading = true;
        // Update date to YYYY-MM-DD format before saving
        if (relatedPersonData.date_of_birth) {
            relatedPersonData.date_of_birth = moment(
                relatedPersonData.date_of_birth
            ).format('YYYY-MM-DD');
        }
        relatedPersonData.person_ids = [];

        // adding related person block
        if (relatedPersonData?.relationship.length > 0) {
            const cleanedRelatedPersonData =
                this.cleanUpRelatedPersons(relatedPersonData);
            relatedPersonData = cleanedRelatedPersonData;
        }
        cmpt.registeredPatientId = this.uiglobals.params.id;

        this.dataLayer
            .createNested(
                'patients',
                'link_related',
                cmpt.registeredPatientId,
                relatedPersonData
            )
            .subscribe({
                next: () => {
                    const msg = 'Related person added successfully';
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Related person has been added',
                        msg
                    );
                    cmpt.loading = false;
                    cmpt.formOptions.resetModel();
                    this.$state.go(
                        'app.advantage.patients.detail.nextOfKin',
                        {
                            id: cmpt.registeredPatientId,
                        },
                        { reload: true }
                    );
                },
                error: err => {
                    this.errorHandler.handleError(err, cmpt);
                    cmpt.loading = false;
                },
            });
    }

    // empty the person_contacts if not added
    cleanUpRelatedPersons = relatedPersonData => {
        const noRelatedPersonContact = relatedPersonData.person_contacts.find(
            contact => contact.contact === null
        );

        // if no contact is null early return related person data
        if (!noRelatedPersonContact) return relatedPersonData;

        // if phone number contact is null, set person_contacts to an empty array
        if (!!noRelatedPersonContact?.contact === false) {
            relatedPersonData.person_contacts = [];
            return relatedPersonData;
        }
    };

    // Check if patient match exists on HCRM
    checkPatientExistsOnHCRM(cmpt) {
        cmpt.loading = true;
        const params = {
            search: cmpt.searchInput,
        };
        this.dataLayer.list('persons', params).subscribe({
            next: response => {
                let data: Array<PatientModel>;
                if (response['results']?.length > 0) {
                    data = response['results'];
                }
                cmpt.loading = false;
                cmpt.patientSearchSubmitted = true;
                cmpt.existingPatientsHCRM = data;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                cmpt.loading = false;
            },
        });
    }

    searchPersons(cmpt) {
        cmpt.loading = true;
        const params = {
            search: cmpt.searchInput,
            active: true,
        };
        this.dataLayer.list('persons', params).subscribe({
            next: response => {
                let data: Array<any>;
                if (response['results']?.length > 0) {
                    data = response['results'];
                }
                cmpt.loading = false;
                cmpt.patientSearchSubmitted = true;
                cmpt.existingPersons = data;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                cmpt.loading = false;
            },
        });
    }
}

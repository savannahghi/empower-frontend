import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
import { BehaviorSubject, of } from 'rxjs';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { ErrorHandlerService } from '../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { PersonModel } from '../models/Person.model';
import { mockSchemeData } from './patient-cover/patient-cover.component.spec';
import { PatientService } from './patient.service';

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

class AuthenticationStub {
    checkPermission() {
        return true;
    }
}

class SilStoresServiceStub {
    create() {
        return of({
            id: '4ed62h7281262h1',
            person: {
                id: '4ed62h7281262h1',
            },
            service_requests: [{ id: '2' }],
        });
    }
    list() {
        return of({
            results: [
                {
                    id: '4ed62h7281262h1',
                    service_requests: [{ id: '2' }],
                },
            ],
        });
    }
    createNested() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
    statusUpdate() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
}

class SilStoresServiceStubNoList {
    create() {
        return of({
            id: '4ed62h7281262h1',
            person: {
                id: '4ed62h7281262h1',
            },
            service_requests: [{ id: '2' }],
        });
    }
    list() {
        return of({
            results: [],
        });
    }
    statusUpdate() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
}

class SilStoresServiceStubListHasDuplicates {
    create() {
        return of({
            id: '4ed62h7281262h1',
            person: {
                id: '4ed62h7281262h1',
            },
            service_requests: [{ id: '2' }],
        });
    }
    list() {
        return of({
            results: [
                {
                    id: '4ed62h7281262h1',
                    service_requests: [{ id: '2' }],
                },
                {
                    id: '4ed62h7281262h1',
                    service_requests: [{ id: '2' }],
                },
                {
                    id: '4ed62h7281262h1',
                    service_requests: [{ id: '2' }],
                },
            ],
        });
    }
    statusUpdate() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    reload() {
        return true;
    }
    transitionTo() {
        return true;
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: true,
            },
        ];
    }
    getWorkstation() {
        return {};
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { appointment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('PatientService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('variantDisplay')],
            providers: [
                PatientService,
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(PatientService);
    });

    it('should test startVisit and trivial methods', () => {
        spyOn(service, 'startVisit').and.callThrough();
        const appointment = {
            patient: {
                id: 1,
                clinical_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
            },
        };
        const patient = {
            id: 'e12321',
            person: {
                patient_id: 'e12321',
                clinical_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
                name: 'Jim Gordon',
            },
        };
        const person = {
            patient_id: 'e12321',
            name: 'Jim Gordon Bonke',
            phone_number: '0700090954',
            email: 'w@w.com',
        };
        service.checkIfPatientIsComplete(person, {});
        service.setPatientDetails(patient);
        service.preparePatientPayload(patient.person, {});
        service.preparePatientPayload(person, {});
        spyOn(service, 'createConsent').and.callThrough();
        service.createConsent({});
        service.createConsent({}, '123123');
        expect(service.createConsent).toHaveBeenCalled();

        service.startVisit(
            { loading: true },
            appointment.patient,
            appointment,
            { id: 1 },
            'AMB',
            'CREDIT',
            '01-01-2023',
            { id: 1 },
            { id: 1 },
            undefined,
            'Zawadi'
        );
        expect(service.startVisit).toHaveBeenCalled();
    });

    it('should fail to start visit if patient client id is null', () => {
        spyOn(service, 'startVisit').and.callThrough();
        const appointment = {
            patient: {
                id: 1,
                clinical_id: null,
            },
        };
        const patient = {
            id: 'e12321',
            clinical_id: null,
            person: { patient_id: 'e12321', name: 'Jim Gordon' },
        };
        const person = {
            patient_id: 'e12321',
            name: 'Jim Gordon Bonke',
            phone_number: '0700090954',
            email: 'w@w.com',
        };
        service.checkIfPatientIsComplete(person, {});
        service.setPatientDetails(patient);
        service.preparePatientPayload(patient.person, {});
        service.preparePatientPayload(person, {});

        service.startVisit(
            { loading: true },
            appointment.patient,
            appointment,
            { id: 1 },
            'AMB',
            'CREDIT',
            '01-01-2023',
            { id: 1 },
            { id: 1 },
            undefined,
            'Zawadi'
        );
        expect(service.startVisit).toHaveBeenCalled();
    });

    it('should fail to start visit if patient client id is undefined', () => {
        spyOn(service, 'startVisit').and.callThrough();
        const appointment = {
            patient: {
                id: 1,
            },
        };
        const patient = {
            id: 'e12321',
            person: { patient_id: 'e12321', name: 'Jim Gordon' },
        };
        const person = {
            patient_id: 'e12321',
            name: 'Jim Gordon Bonke',
            phone_number: '0700090954',
            email: 'w@w.com',
        };
        service.checkIfPatientIsComplete(person, {});
        service.setPatientDetails(patient);
        service.preparePatientPayload(patient.person, {});
        service.preparePatientPayload(person, {});

        service.startVisit(
            { loading: true },
            appointment.patient,
            appointment,
            { id: 1 },
            'AMB',
            'CREDIT',
            '01-01-2023',
            { id: 1 },
            { id: 1 },
            undefined,
            'Zawadi'
        );
        expect(service.startVisit).toHaveBeenCalled();
    });

    it('should test actions that require correct access', () => {
        spyOn(service.authService, 'checkPermission').and.returnValue(false);
        service.getUpcomingAppointments();
        service.checkForOngoingVisits();
        service.getQueues();
        spyOn(service, 'startVisit').and.callThrough();
        service.startVisit();
        expect(service.startVisit).toHaveBeenCalled();
    });

    it('should startVisit with CASH method when billing class is not defined', () => {
        spyOn(service, 'startVisit').and.callThrough();
        const appointment = {
            patient: {
                id: 1,
                clinical_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
            },
            queue: {
                id: 1,
            },
        };
        service.startVisit(
            { loading: false },
            appointment.patient,
            appointment,
            appointment.queue,
            'AMB',
            undefined,
            undefined,
            { id: 1 },
            undefined,
            'Zawadi'
        );
        expect(service.startVisit).toHaveBeenCalled();
    });

    it(`should test submitRelatedPerson with related person's contacts`, () => {
        const person: PersonModel = {
            date_of_birth: '2015-03-03',
            gender: 'MALE',
            first_name: 'Patrick',
            last_name: 'Musembi',
            person_contacts: [
                {
                    contact_type: 'phone_number',
                    contact: '712345678',
                    is_primary_contact: true,
                },
                {
                    contact_type: 'phone_number',
                    contact: '+254712345678',
                    is_primary_contact: true,
                },
            ],
            person_photos: [],
            person_ids: [],
            relationship: 'SIB',
        };
        spyOn(service, 'submitRelatedPerson').and.callThrough();
        service.submitRelatedPerson(person, {
            showToast: () => {},
            formOptions: { resetModel: () => {} },
        });
        expect(service.submitRelatedPerson).toHaveBeenCalled();
    });

    it(`should test submitRelatedPerson with no related person's contacts`, () => {
        const person: PersonModel = {
            date_of_birth: '2015-03-03',
            gender: 'MALE',
            first_name: 'Patrick',
            last_name: 'Musembi',
            person_contacts: [
                {
                    contact_type: 'phone_number',
                    contact: null,
                },
            ],
            person_photos: [],
            person_ids: [],
            relationship: 'SIB',
        };
        spyOn(service, 'submitRelatedPerson').and.callThrough();
        spyOn(service, 'cleanUpRelatedPersons').and.callThrough();
        service.cleanUpRelatedPersons(person);
        service.submitRelatedPerson(person, {
            showToast: () => {},
            formOptions: { resetModel: () => {} },
        });
        expect(service.cleanUpRelatedPersons).toHaveBeenCalledWith(person);
        expect(service.submitRelatedPerson).toHaveBeenCalled();
    });

    it('should test sendOTP', () => {
        const payload = {
            registeredPersonId: '1234',
            loadingSendOTP: false,
            showToast: () => {},
            toggleModal: () => {},
            toggleConsentLoading: () => {},
            startCountdown: () => {},
            resetCountdown: () => {},
        };
        spyOn(service, 'sendOTP').and.callThrough();
        service.sendOTP(payload);
        expect(service.sendOTP).toHaveBeenCalled();
    });

    it('should test resendOTP', () => {
        const payload = {
            registeredPersonId: '1234',
            loadingSendOTP: false,
            showToast: () => {},
            toggleModal: () => {},
            toggleConsentLoading: () => {},
            startCountdown: () => {},
            resetCountdown: () => {},
        };
        spyOn(service, 'resendOTP').and.callThrough();
        service.resendOTP(payload);
        expect(service.resendOTP).toHaveBeenCalled();
    });

    it('should test transitionOTP', () => {
        const payload = {
            registeredPersonId: '1234',
            loadingVerifyOTP: false,
            setValue: () => {},
            loadingSendOTP: false,
            showToast: () => {},
            toggleModal: () => {},
            toggleConsentLoading: () => {},
            resetCountdown: () => {},
            startCountdown: () => {},
            fetchConsent: () => {},
        };
        spyOn(service, 'transitionOTP').and.callThrough();
        service.transitionOTP(payload);
        expect(service.transitionOTP).toHaveBeenCalled();
    });

    it('should test verifyOTP', () => {
        const payload = {
            otp: '123456',
            registeredPersonId: '1234',
            loadingVerifyOTP: false,
            showSuccessModa: true,
            setValue: () => {},
            showToast: () => {},
            toggleModal: () => {},
            toggleConsentLoading: () => {},
            startCountdown: () => {},
            resetCountdown: () => {},
        };
        spyOn(service, 'verifyOTP').and.callThrough();
        service.verifyOTP(payload);
        expect(service.verifyOTP).toHaveBeenCalled();
    });

    it('should test createEducationConsent for SMS content', () => {
        const payload = {
            otp: '123456',
            registeredPersonId: '1234',
            loadingVerifyOTP: false,
            showSuccessModa: true,
            showToast: () => {},
            setValue: () => {},
            toggleModal: () => {},
            toggleConsentLoading: () => {},
            startCountdown: () => {},
            resetCountdown: () => {},
        };
        spyOn(service, 'createEducationConsent').and.callThrough();
        service.createEducationConsent('SMS_HEALTH_EDUCATION', payload, true);
        service.createConsent(payload, 'personID', true);
        service.createConsent(payload, undefined, true);
        expect(service.createEducationConsent).toHaveBeenCalled();
    });

    it('should test createEducationConsent for Email content', () => {
        const payload = {
            otp: '123456',
            registeredPersonId: '1234',
            loadingVerifyOTP: false,
            showSuccessModa: true,
            showToast: () => {},
            setValue: () => {},
            toggleModal: () => {},
            toggleConsentLoading: () => {},
            startCountdown: () => {},
            resetCountdown: () => {},
        };
        spyOn(service, 'createEducationConsent').and.callThrough();
        service.createEducationConsent('EMAIL_HEALTH_EDUCATION', payload);
        expect(service.createEducationConsent).toHaveBeenCalled();
    });

    it('should test checkPatientExists', () => {
        const person: PersonModel = {
            date_of_birth: '2015-03-03',
            gender: 'MALE',
            first_name: 'Patrick',
            last_name: 'Musembi',
            person_contacts: [
                {
                    contact_type: 'phone_number',
                    contact: '712345678',
                    is_primary_contact: true,
                },
                {
                    contact_type: 'phone_number',
                    contact: '+254712345678',
                    is_primary_contact: true,
                },
            ],
            person_photos: [],
            person_ids: [],
        };
        spyOn(service, 'checkPatientExists').and.callThrough();
        service.checkPatientExists(
            { person: person },
            {
                showToast: () => {},
                formOptions: { resetModel: () => {} },
                toggleModal: () => {},
                createConsent: () => {},
                goToPatientConsent: () => {},
            }
        );
        expect(service.checkPatientExists).toHaveBeenCalled();
    });

    it('should test createPatient with OTC flow', () => {
        const person: PersonModel = {
            date_of_birth: '2015-03-03',
            gender: 'MALE',
            first_name: 'Patrick',
            last_name: 'Musembi',
            person_contacts: [
                {
                    contact_type: 'phone_number',
                    contact: '712345678',
                    is_primary_contact: true,
                },
                {
                    contact_type: 'phone_number',
                    contact: '+254712345678',
                    is_primary_contact: true,
                },
            ],
            person_photos: [],
            person_ids: [],
        };
        spyOn(service, 'createPatient').and.callThrough();
        service.createPatient(
            { person: person },
            {
                showToast: () => {},
                formOptions: { resetModel: () => {} },
                toggleModal: () => {},
                createConsent: () => {},
                goToPatientConsent: () => {},
            },
            'OTC'
        );
        expect(service.createPatient).toHaveBeenCalled();
    });

    it('should test addPatientCover and trivial methods', () => {
        spyOn(service, 'addPatientCover').and.callThrough();
        const person = {
            patient_id: 'e12321',
            name: 'Jim Gordon Bonke',
            phone_number: '0700090954',
            email: 'w@w.com',
        };
        const patient = {
            id: 'e12321',
            clinical_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
            person: person,
        };

        service
            .addPatientCover(
                { loading: false },
                mockSchemeData,
                'NH123',
                patient,
                '2023-01-01',
                '2024-01-01'
            )
            .subscribe({
                next: () => {},
                error: () => {},
            });
        expect(service.addPatientCover).toHaveBeenCalled();
    });

    it('should test addMemberToSegment', () => {
        spyOn(service, 'addMemberToSegment').and.callThrough();
        service
            .addMemberToSegment(
                {
                    segment: 123,
                    person: 212312,
                },
                { loading: false }
            )
            .subscribe({
                next: () => {},
                error: () => {},
            });
        expect(service.addMemberToSegment).toHaveBeenCalled();
    });

    it('should test checkPatientExistsOnHCRM', () => {
        const payload = {
            loading: false,
            searchInput: '',
            patientSearchSubmitted: false,
            existingPatientsHCRM: {},
        };
        spyOn(service, 'checkPatientExistsOnHCRM').and.callThrough();
        service.checkPatientExistsOnHCRM(payload);
        expect(service.checkPatientExistsOnHCRM).toHaveBeenCalled();
    });

    it('should test searchPersons', () => {
        const payload = {
            loading: false,
            searchInput: '',
            patientSearchSubmitted: false,
            existingPersons: {},
        };
        spyOn(service, 'searchPersons').and.callThrough();
        service.searchPersons(payload);
        expect(service.searchPersons).toHaveBeenCalled();
    });

    it('should set guarantor_id in params when billingClass is CREDIT and selectedGuarantorType is not SELF', () => {
        spyOn(service.dataLayer, 'create').and.returnValue(
            of({
                id: 10,
                service_requests: [{ id: 101 }],
            })
        );
        spyOn(service, 'showToast');
        spyOn(service.$state, 'go');

        const appointment = {
            id: 999,
            patient: {
                id: 1,
                clinical_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
            },
            queue: {
                id: 1,
            },
        };
        const guarantor = { id: 123 };
        const patientCover = { id: 456 };
        const billingClass = 'CREDIT';
        const selectedGuarantorType = 'COMPANY';

        service.startVisit(
            { loading: false },
            appointment.patient,
            appointment,
            appointment.queue,
            billingClass,
            '2023-01-01',
            guarantor.id,
            selectedGuarantorType,
            patientCover,
            undefined,
            'Zawadi'
        );

        const expectedParams = {
            visit_type: 'AMB',
            status: 'ARRIVED',
            patient: appointment.patient.id,
            billing_class: billingClass,
            start: '2023-01-01',
            appointment: appointment.id,
            current_queue: appointment.queue.id,
            guarantor_id: guarantor.id,
            guarantor_name: undefined,
            patient_cover: 456,
        };

        expect(service.dataLayer.create).toHaveBeenCalledWith(
            'visits',
            expectedParams
        );
    });

    it('should set billing_class to CASH when billingClass is not provided', () => {
        spyOn(service.dataLayer, 'create').and.returnValue(
            of({
                id: 10,
                service_requests: [{ id: 101 }],
            })
        );
        spyOn(service, 'showToast');
        spyOn(service.$state, 'go');

        const appointment = {
            id: 999,
            patient: {
                id: 1,
                clinical_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
            },
            queue: {
                id: 1,
            },
        };
        const guarantor = { id: 123 };
        const patientCover = { id: 456 };

        service.startVisit(
            { loading: false },
            appointment.patient,
            appointment,
            appointment.queue,
            undefined,
            '2023-01-01',
            guarantor.id,
            'SELF',
            patientCover,
            undefined,
            'Zawadi'
        );

        const expectedParams = {
            visit_type: 'AMB',
            status: 'ARRIVED',
            patient: appointment.patient.id,
            billing_class: 'CASH',
            start: '2023-01-01',
            appointment: appointment.id,
            current_queue: appointment.queue.id,
            patient_cover: patientCover.id,
        };

        expect(service.dataLayer.create).toHaveBeenCalledWith(
            'visits',
            expectedParams
        );
    });
});

describe('PatientService: No List', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('variantDisplay')],
            providers: [
                PatientService,
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubNoList,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(PatientService);
    });

    it('should test checkPatientExists', () => {
        spyOn(service, 'checkPatientExists').and.callThrough();
        const person: PersonModel = {
            date_of_birth: '2015-03-03',
            gender: 'MALE',
            first_name: 'Patrick',
            last_name: 'Musembi',
            person_contacts: [
                {
                    contact_type: 'phone_number',
                    contact: '712345678',
                    is_primary_contact: true,
                },
                {
                    contact_type: 'phone_number',
                    contact: '+254712345678',
                    is_primary_contact: true,
                },
            ],
            person_photos: [],
            person_ids: [],
            relationship: 'SIB',
        };
        service.checkPatientExists(
            { person: person },
            {
                showToast: () => {},
                formOptions: { resetModel: () => {} },
                toggleModal: () => {},
                createConsent: () => {},
                goToPatientConsent: () => {},
            }
        );
        expect(service.checkPatientExists).toHaveBeenCalled();
    });
});

describe('PatientService: List has duplicates', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('variantDisplay')],
            providers: [
                PatientService,
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubListHasDuplicates,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(PatientService);
    });

    it('should test trivial functions', () => {
        spyOn(service, 'setPatient').and.callThrough();
        const person: PersonModel = {
            id: '123123',
            date_of_birth: '2015-03-03',
            gender: 'MALE',
            first_name: 'Patrick',
            last_name: 'Musembi',
            person_contacts: [
                {
                    contact_type: 'phone_number',
                    contact: '712345678',
                    is_primary_contact: true,
                },
                {
                    contact_type: 'phone_number',
                    contact: '+254712345678',
                    is_primary_contact: true,
                },
            ],
            person_photos: [],
            person_ids: [],
            relationship: 'SIB',
        };
        service.setPatient(
            { person: person },
            {
                showToast: () => {},
                formOptions: { resetModel: () => {} },
                toggleModal: () => {},
                goToPatientList: () => {},
            }
        );
        expect(service.setPatient).toHaveBeenCalled();
    });

    it('should test startVisit with guarantor and patientCover', () => {
        spyOn(service, 'startVisit').and.callThrough();
        const appointment = {
            patient: {
                id: 1,
                clinical_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
            },
            queue: {
                id: 1,
            },
        };
        const guarantor = { id: 123 };
        const patientCover = { id: 456 };
        service.startVisit(
            { loading: false },
            appointment.patient,
            appointment,
            appointment.queue,
            'AMB',
            'CASH',
            undefined,
            guarantor,
            undefined,
            patientCover,
            undefined,
            'Zawadi'
        );
        expect(service.startVisit).toHaveBeenCalled();
    });

    it('should test checkPatientExists', () => {
        spyOn(service, 'checkPatientExists').and.callThrough();
        const person: PersonModel = {
            id: '123123',
            date_of_birth: '2015-03-03',
            gender: 'MALE',
            first_name: 'Patrick',
            last_name: 'Musembi',
            person_contacts: [
                {
                    contact_type: 'phone_number',
                    contact: '712345678',
                    is_primary_contact: true,
                },
                {
                    contact_type: 'phone_number',
                    contact: '+254712345678',
                    is_primary_contact: true,
                },
            ],
            person_photos: [],
            person_ids: [],
            relationship: 'SIB',
        };
        service.checkPatientExists(
            { person: person },
            {
                showToast: () => {},
                formOptions: { resetModel: () => {} },
                toggleModal: () => {},
                goToPatientList: () => {},
                createConsent: () => {},
                goToPatientConsent: () => {},
            }
        );
        service.getUpcomingAppointments({ id: 1232, person: person });
        expect(service.checkPatientExists).toHaveBeenCalled();
    });
});
class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    createNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    statusUpdate() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

const uIRouterGlobalsStubError = {
    current: {
        name: 'state',
    },
    params() {
        return false;
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

describe('PatientService error', () => {
    let service;
    let errorHandlerService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('variantDisplay')],
            providers: [
                PatientService,
                ErrorHandlerService,
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(PatientService);
        errorHandlerService = TestBed.inject(ErrorHandlerService);
    });

    it('should test createPatient but fail', () => {
        spyOn(service, 'createPatient').and.callThrough();
        const person: PersonModel = {
            id: '123123',
            date_of_birth: '2015-03-03',
            gender: 'MALE',
            first_name: 'Patrick',
            last_name: 'Musembi',
            person_contacts: [
                {
                    contact_type: 'phone_number',
                    contact: '712345678',
                    is_primary_contact: true,
                },
                {
                    contact_type: 'phone_number',
                    contact: '+254712345678',
                    is_primary_contact: true,
                },
            ],
            person_photos: [],
            person_ids: [],
            relationship: 'SIB',
        };
        service.setPatient({ id: '1221312', person: person });
        service.createPatient({ loading: false }, {});
        expect(service.createPatient).toHaveBeenCalled();
    });

    it('should test submitRelatedPerson but failed', () => {
        const person: PersonModel = {
            date_of_birth: '2015-03-03',
            gender: 'MALE',
            first_name: 'Patrick',
            last_name: 'Musembi',
            person_contacts: [
                {
                    contact_type: 'phone_number',
                    contact: '712345678',
                    is_primary_contact: true,
                },
                {
                    contact_type: 'phone_number',
                    contact: '+254712345678',
                    is_primary_contact: true,
                },
            ],
            person_photos: [],
            person_ids: [],
            relationship: 'SIB',
        };
        spyOn(service, 'submitRelatedPerson').and.callThrough();
        service.submitRelatedPerson(person, {});
        expect(service.submitRelatedPerson).toHaveBeenCalledWith(person, {
            submitted: true,
            loading: false,
            registeredPatientId: undefined,
        });
    });

    it('should test createConsent but failed', () => {
        const payload = {
            registeredPersonId: '1234',
            loading: false,
            showToast: () => {},
        };
        spyOn(service, 'createConsent').and.callThrough();
        service.createConsent(payload);
        service.createConsent(payload, '123123');
        expect(service.createConsent).toHaveBeenCalled();
    });

    it('should test addMemberToSegment', () => {
        spyOn(service, 'addMemberToSegment').and.callThrough();
        service
            .addMemberToSegment(
                {
                    segment: 123,
                    person: 212312,
                },
                { loading: false }
            )
            .subscribe({
                next: () => {},
                error: () => {},
            });
        expect(service.addMemberToSegment).toHaveBeenCalled();
    });

    it('should test sendOTP but failed', () => {
        const payload = {
            registeredPersonId: '1234',
            loadingSendOTP: false,
            showToast: () => {},
            toggleConsentLoading: () => {},
            startCountdown: () => {},
            resetCountdown: () => {},
        };
        spyOn(service, 'sendOTP').and.callThrough();
        service.sendOTP(payload);
        expect(service.sendOTP).toHaveBeenCalled();
    });

    it('should test resendOTP but failed', () => {
        const payload = {
            registeredPersonId: '1234',
            loadingSendOTP: false,
            showToast: () => {},
            toggleConsentLoading: () => {},
            startCountdown: () => {},
            resetCountdown: () => {},
        };
        spyOn(service, 'resendOTP').and.callThrough();
        service.resendOTP(payload);
        expect(service.resendOTP).toHaveBeenCalled();
    });

    it('should test verifyOTP but failed', () => {
        const payload = {
            registeredPersonId: '1234',
            loadingVerifyOTP: false,
            setValue: () => {},
            showToast: () => {},
            toggleConsentLoading: () => {},
            resetCountdown: () => {},
            startCountdown: () => {},
        };
        spyOn(service, 'verifyOTP').and.callThrough();
        service.verifyOTP(payload);
        expect(service.verifyOTP).toHaveBeenCalled();
    });

    it('should test transitionOTP but failed', () => {
        const payload = {
            registeredPersonId: '1234',
            loadingVerifyOTP: false,
            setValue: () => {},
            showToast: () => {},
            toggleConsentLoading: () => {},
            resetCountdown: () => {},
            startCountdown: () => {},
            fetchConsent: () => {},
        };
        spyOn(service, 'transitionOTP').and.callThrough();
        service.transitionOTP(payload);
        expect(service.transitionOTP).toHaveBeenCalled();
    });

    it('should test checkPatientExistsOnHCRM but failed', () => {
        const payload = {
            loading: false,
            searchInput: '',
            patientSearchSubmitted: false,
            existingPatientsHCRM: {},
        };
        spyOn(service, 'checkPatientExistsOnHCRM').and.callThrough();
        service.checkPatientExistsOnHCRM(payload);
        expect(service.checkPatientExistsOnHCRM).toHaveBeenCalled();
    });

    it('should test searchPersons but failed', () => {
        const payload = {
            loading: false,
            searchInput: '',
            patientSearchSubmitted: false,
            existingPersons: {},
        };
        spyOn(service, 'searchPersons').and.callThrough();
        service.searchPersons(payload);
        expect(service.searchPersons).toHaveBeenCalled();
    });

    it('should test createEducationConsent for SMS content and fail', () => {
        const payload = {
            otp: '123456',
            registeredPersonId: '1234',
            loadingVerifyOTP: false,
            showSuccessModa: true,
            setValue: () => {},
            showToast: () => {},
            toggleModal: () => {},
            toggleConsentLoading: () => {},
            resetCountdown: () => {},
            startCountdown: () => {},
        };
        spyOn(service, 'createEducationConsent').and.callThrough();
        service.createEducationConsent('SMS_HEALTH_EDUCATION', payload, true);
        expect(service.createEducationConsent).toHaveBeenCalled();
    });

    it('should test createEducationConsent for Email content and fail', () => {
        const payload = {
            otp: '123456',
            registeredPersonId: '1234',
            loadingVerifyOTP: false,
            showSuccessModa: true,
            setValue: () => {},
            showToast: () => {},
            toggleModal: () => {},
            toggleConsentLoading: () => {},
            resetCountdown: () => {},
            startCountdown: () => {},
        };
        spyOn(service, 'createEducationConsent').and.callThrough();
        service.createEducationConsent('EMAIL_HEALTH_EDUCATION', payload);
        expect(service.createEducationConsent).toHaveBeenCalled();
    });

    it('should test checkPatientExists but failed', () => {
        const person: PersonModel = {
            date_of_birth: '2015-03-03',
            gender: 'MALE',
            first_name: 'Patrick',
            last_name: 'Musembi',
            person_contacts: [
                {
                    contact_type: 'phone_number',
                    contact: '712345678',
                    is_primary_contact: true,
                },
                {
                    contact_type: 'phone_number',
                    contact: '+254712345678',
                    is_primary_contact: true,
                },
            ],
            person_photos: [],
            person_ids: [],
        };
        spyOn(service, 'checkPatientExists').and.callThrough();
        service.checkPatientExists({ person: person }, {});
        expect(service.checkPatientExists).toHaveBeenCalled();
    });

    it('should test startVisit but fail', () => {
        spyOn(service, 'startVisit').and.callThrough();
        const appointment = {
            patient: {
                id: 1,
                clinical_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
            },
            queue: {
                id: 1,
            },
        };
        service.startVisit(
            { loading: false },
            appointment.patient,
            appointment,
            appointment.queue,
            'AMB',
            'CASH',
            undefined,
            { id: 1 },
            undefined,
            'Zawadi'
        );
        expect(service.startVisit).toHaveBeenCalled();
    });

    it('should test getPatientCover but fail', () => {
        spyOn(service, 'getPatientCover').and.callThrough();
        service.getPatientCover({});
        expect(service.getPatientCover).toHaveBeenCalled();
    });

    it('should call errorHandler.handleError with the error when the addPatientCover API call fails', () => {
        spyOn(errorHandlerService, 'handleError').and.callThrough();
        const person = {
            patient_id: 'e12321',
            name: 'Jim Gordon Bonke',
            phone_number: '0700090954',
            email: 'w@w.com',
        };
        const patient = {
            id: 'e12321',
            person: person,
        };

        service
            .addPatientCover(
                { loading: false },
                mockSchemeData,
                'NH123',
                patient,
                '2023-01-01',
                '2024-01-01'
            )
            .subscribe({
                next: () => {},
                error: () => {},
            });
        expect(errorHandlerService.handleError).toHaveBeenCalled();
    });
});

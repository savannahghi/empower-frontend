import {
    ComponentFixture,
    discardPeriodicTasks,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from '@angular/core/testing';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { NbStepComponent, NbToastrService } from '@nebular/theme';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { PatientRegistrationComponent } from './patient-registration.component';
import { BehaviorSubject, of } from 'rxjs';
import { NbStepperComponent } from '@nebular/theme';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { StepperService } from '../../../../shared/component-services/stepper.service';
import { PatientModel, PersonModel } from '../../models';
import { PatientService } from '../patient.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

class AuthenticationStub {
    checkPermission() {
        return true;
    }
}

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

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.patients.register',
    },
    params() {
        return { step: 0 };
    },
};

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

class StepperServiceStub {
    setupStepper() {
        return { step: '1' };
    }
    nextStep() {
        return { step: '1' };
    }
    previousStep() {
        return { step: '1' };
    }
    handleStepChange() {
        return { step: '1' };
    }
    checkOrientationChange() {
        return 'vertical';
    }
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    getWorkstation() {
        return {
            workstation: '1',
            workstation__org_unit: 'dept_1',
            workstation__org_unit__parent: 'branch_1',
            workstation__org_unit__parent__parent: 'cluster_1',
        };
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transition() {
        return true;
    }
    transitionTo() {
        return true;
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class SilStoresServiceStub {
    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '2' }],
        });
    }

    createNested() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    list() {
        return of({
            results: [],
        });
    }

    statusUpdate() {
        return of({
            results: [],
        });
    }
}

class PatientServiceStub {
    preparePatientPayload() {
        return null;
    }
    checkPatientExists() {
        return null;
    }
    submitRelatedPerson() {
        return null;
    }
    createEducationConsent() {
        return null;
    }
    createPatient() {
        return null;
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('PatientRegistrationComponent: empty results list', () => {
    let component: PatientRegistrationComponent;
    let fixture: ComponentFixture<PatientRegistrationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientRegistrationComponent, NbStepperComponent],
            imports: [
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                mockPipe('phoneNumberPipe'),
                mockPipe('variant'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should saveEducationConsent for SMS content', () => {
        spyOn(component, 'saveEducationConsent').and.callThrough();
        component.saveSmsConsent(true);
        component.toggleCheckbox('SMS_HEALTH_EDUCATION');
        component.saveEducationConsent();
        expect(component.saveEducationConsent).toHaveBeenCalled();
    });

    it('should saveEducationConsent for Email content', () => {
        spyOn(component, 'saveEducationConsent').and.callThrough();
        component.saveSmsConsent(true);
        component.toggleCheckbox('EMAIL_HEALTH_EDUCATION');
        component.saveEducationConsent();
        expect(component.saveEducationConsent).toHaveBeenCalled();
    });

    it('should testviewPatientList', () => {
        spyOn(component, 'viewPatientList').and.callThrough();
        component.saveSmsConsent(true);
        component.viewPatientList();
        expect(component.viewPatientList).toHaveBeenCalled();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test submitPatient method success', () => {
        const person: PersonModel = {
            first_name: 'John',
            last_name: 'Doe',
            gender: 'MALE',
            id_value: '123',
            id_document_type: 'NATIONAL_ID',
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
            relationship: '',
            channel: 'SMS',
        };
        const model = { person };
        spyOn(component, 'submitPatient').and.callThrough();
        component.getFormOptions({ resetModel: () => {} });

        component.submitPatient(model);
        expect(component.submitPatient).toHaveBeenCalledWith(model);
    });

    it('should test submitPatient when EDD is invalid', () => {
        const patient: PatientModel = {
            expected_delivery_date: 'invalid date',
            person: {
                first_name: 'John',
                last_name: 'Doe',
                gender: 'MALE',
                id_value: '123',
                id_document_type: 'NATIONAL_ID',
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
                relationship: '',
            },
        };
        spyOn(component, 'submitPatient').and.callThrough();
        component.getFormOptions({ resetModel: () => {} });

        component.submitPatient(patient);
        expect(component.submitPatient).toHaveBeenCalledWith(patient);
    });

    it('should set patientString to client for uzazisalama', () => {
        component.variant = 'uzazisalama';
        component.ngOnInit();
        expect(component.patientString).toBe('client');
    });

    it('should set patientString to patient for other variants', () => {
        component.variant = 'default';
        component.ngOnInit();
        expect(component.patientString).toBe('patient');
    });

    it('should test createPatientWithHCRMData method', () => {
        component.selectedPatient = {
            date_of_birth: '',
            phone_number: '+254739822200',
            associated_region: '',
            email: 'me@mail.com',
            name: 'Johny Ed Bravo',
            first_name: 'John',
            last_name: 'Doe',
            gender: 'MALE',
            id_value: '123',
            id_document_type: 'NATIONAL_ID',
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
        spyOn(component, 'createPatientWithHCRMData').and.callThrough();
        component.createPatientWithHCRMData();
        expect(component.createPatientWithHCRMData).toHaveBeenCalled();
    });

    it('should test submitPatient when id_value is absent', () => {
        const patient: PatientModel = {
            person: {
                first_name: 'John',
                last_name: 'Doe',
                gender: 'MALE',
                person_contacts: [
                    {
                        contact_type: 'phone_number',
                        contact: '+254712345678',
                        is_primary_contact: true,
                    },
                ],
                person_photos: [],
                person_ids: [],
                relationship: '',
            },
        };
        spyOn(component, 'submitPatient').and.callThrough();
        component.getFormOptions({ resetModel: () => {} });

        component.submitPatient(patient);
        expect(component.submitPatient).toHaveBeenCalledWith(patient);
    });

    it('should test submitRelatedPerson method success', () => {
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
            relationship: '',
        };
        spyOn(component, 'submitRelatedPerson').and.callThrough();
        component.getFormOptions({ resetModel: () => {} });

        component.submitRelatedPerson(person);
        expect(component.submitRelatedPerson).toHaveBeenCalledWith(person);
    });
});

class SilStoresServiceStub2 {
    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '2' }],
            person: {
                id: 'person-1',
                phone_number: '+254712345678',
                email: '',
            },
        });
    }
    list() {
        return of({
            results: [
                {
                    id: 1,
                    active_visits: [
                        {
                            queue: 1,
                        },
                    ],
                },
            ],
        });
    }
    statusUpdate() {
        return of({
            results: [],
        });
    }
}

const uIRouterGlobalsStub2 = {
    current: {
        name: 'app.advantage.patients.register',
    },
    params: { step: '1' },
};

describe('PatientRegistrationComponent: results contains data', () => {
    let component: PatientRegistrationComponent;
    let fixture: ComponentFixture<PatientRegistrationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientRegistrationComponent, NbStepperComponent],
            imports: [
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                mockPipe('phoneNumberPipe'),
                mockPipe('variant'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should start a countdown', fakeAsync(() => {
        const clearIntervalSpy = spyOn(window, 'clearInterval');
        component.timeLeft = 10;
        component.startCountdown();

        // Simulate the passage of 60 seconds
        tick(60000);

        // Assertion
        expect(component.timeLeft).toEqual(0);

        // Ensure all periodic tasks are discarded
        discardPeriodicTasks(); // Clears setInterval tasks
        flush(); // Waits for the macrotask queue to be empty (including setTimeout)

        // Additional cleanup if necessary
        clearIntervalSpy.calls.reset();
    }));

    it('should start a countdown and update showRetryButton', fakeAsync(() => {
        const clearIntervalSpy = spyOn(window, 'clearInterval');
        component.timeLeft = -1;
        component.startCountdown();

        // Simulate the passage of 60 seconds
        tick(60000);

        expect(component.timeLeft).toEqual(-1);

        // Ensure all periodic tasks are discarded
        discardPeriodicTasks(); // Clears setInterval tasks
        flush(); // Waits for the macrotask queue to be empty (including setTimeout)

        expect(clearIntervalSpy).toHaveBeenCalled();
        expect(component.showRetryButton).toBeTruthy();
        // Additional cleanup if necessary
        clearIntervalSpy.calls.reset();
    }));

    it('should test submitPatient already existing', fakeAsync(() => {
        const patient: PatientModel = {
            expected_delivery_date: '2015-03-05',
            person: {
                id_value: '123',
                first_name: 'John',
                last_name: 'Doe',
                gender: 'MALE',
                other_names: 'Schwarznegger',
                id_document_type: 'NATIONAL_ID',
                date_of_birth: '2015-03-03',
                person_contacts: [
                    {
                        contact_type: 'phone_number',
                        contact: '+254712345678',
                        is_primary_contact: true,
                    },
                ],
                person_photos: [],
                person_ids: [],
            },
        };
        spyOn(component, 'submitPatient').and.callThrough();
        component.getFormOptions({ resetModel: () => {} });
        component.handleStepChange({
            index: 0,
            step: new NbStepComponent(NbStepperComponent),
            previouslySelectedIndex: 0,
            previouslySelectedStep: new NbStepComponent(NbStepperComponent),
        });
        component.uiglobals.params.step = '1';
        component.nextStep();
        component.back();
        component.setupOnboarding();
        tick(210);
        component.submitPatient(patient);
        expect(component.submitPatient).toHaveBeenCalledWith(patient);
        tick(1000);
    }));

    it('should skip consent and open navigateAfterCreating modal for empower variant', () => {
        component.variant = 'empower';
        spyOn(component, 'skipConsent').and.callThrough();
        spyOn(component, 'toggleModal').and.callThrough();

        component.skipConsent();

        expect(component.skipConsent).toHaveBeenCalled();
        expect(component.toggleModal).toHaveBeenCalledWith(
            'navigateAfterCreating'
        );
    });

    it('should not skip consent for uzazisalama variant', () => {
        component.variant = 'uzazisalama';
        spyOn(component, 'skipConsent').and.callThrough();
        spyOn(component, 'toggleModal').and.callThrough();

        component.skipConsent();

        expect(component.skipConsent).toHaveBeenCalled();
        expect(component.toggleModal).not.toHaveBeenCalled();
    });

    it('should not skip consent for non-empower variants', () => {
        component.variant = 'someOtherVariant';
        spyOn(component, 'skipConsent').and.callThrough();
        spyOn(component, 'toggleModal').and.callThrough();

        component.skipConsent();

        expect(component.skipConsent).toHaveBeenCalled();
        expect(component.toggleModal).not.toHaveBeenCalled();
    });

    it('should toggle navigateAfterCreating modal state when skipConsent is called on empower', () => {
        component.variant = 'empower';
        component.toggle['navigateAfterCreating'] = false;

        component.skipConsent();

        expect(component.toggle['navigateAfterCreating']).toBe(true);
    });

    it('should move to next step when no consent verified for empower variant in transitionConsentStatus', () => {
        component.variant = 'empower';
        component.showSuccessModal = false;
        component.uiglobals.params.consent_status = 'PENDING';

        spyOn(component, 'nextStep').and.callThrough();

        component.transitionConsentStatus();

        expect(component.nextStep).toHaveBeenCalled();
    });

    it('should transition OTP when no consent verified for uzazisalama variant in transitionConsentStatus', () => {
        component.variant = 'uzazisalama';
        component.showSuccessModal = false;
        component.uiglobals.params.consent_status = 'PENDING';

        const patientService =
            fixture.debugElement.injector.get(PatientService);
        spyOn(patientService, 'transitionOTP');

        component.transitionConsentStatus();

        expect(patientService.transitionOTP).toHaveBeenCalledWith(
            component,
            'VERIFIED'
        );
    });

    it('should call transitionOTP when consent is verified for empower variant in transitionConsentStatus', () => {
        component.variant = 'empower';
        component.showSuccessModal = true;
        component.uiglobals.params.consent_status = 'PENDING';

        const patientService =
            fixture.debugElement.injector.get(PatientService);
        spyOn(patientService, 'transitionOTP');

        component.transitionConsentStatus();

        expect(patientService.transitionOTP).toHaveBeenCalledWith(
            component,
            'VERIFIED'
        );
    });

    it('should open navigateAfterCreating modal when consent_status is already VERIFIED in transitionConsentStatus', () => {
        const originalConsentStatus = component.uiglobals.params.consent_status;
        component.uiglobals.params.consent_status = 'VERIFIED';

        spyOn(component, 'toggleModal');

        component.transitionConsentStatus();

        expect(component.toggleModal).toHaveBeenCalledWith(
            'navigateAfterCreating'
        );

        // Restore original value
        component.uiglobals.params.consent_status = originalConsentStatus;
    });

    it('should clear interval on component destroy', () => {
        component.intervalId = setInterval(() => {}, 1000);
        const clearIntervalSpy = spyOn(window, 'clearInterval');

        component.ngOnDestroy();

        expect(clearIntervalSpy).toHaveBeenCalledWith(component.intervalId);
    });
});

class SilStoresServiceStub3 {
    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '2' }],
            person: {
                id: 'person-1',
                phone_number: '+254712345678',
                email: '',
            },
        });
    }
    list() {
        return of({
            results: [
                {
                    id: 1,
                    active_visits: [
                        {
                            queue: 1,
                        },
                    ],
                },
                {
                    id: 2,
                    active_visits: [
                        {
                            queue: 1,
                        },
                    ],
                },
            ],
        });
    }
    statusUpdate() {
        return of({
            results: [],
        });
    }
}

describe('PatientRegistrationComponent: results contains multiple queues', () => {
    let component: PatientRegistrationComponent;
    let fixture: ComponentFixture<PatientRegistrationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientRegistrationComponent, NbStepperComponent],
            imports: [
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('variantDisplay'),
                mockPipe('phoneNumberPipe'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub3 },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test submitPatient with duplicates already existing', () => {
        const patient: PatientModel = {
            expected_delivery_date: '2015-03-05',
            person: {
                id_value: '123',
                first_name: 'John',
                last_name: 'Doe',
                gender: 'MALE',
                other_names: 'Schwarznegger',
                id_document_type: 'NATIONAL_ID',
                date_of_birth: '2015-03-03',
                person_contacts: [
                    {
                        contact_type: 'phone_number',
                        contact: '+254712345678',
                        is_primary_contact: true,
                    },
                ],
                person_photos: [],
                person_ids: [],
            },
        };
        spyOn(component, 'submitPatient').and.callThrough();
        component.getFormOptions({ resetModel: () => {} });
        component.setupOnboarding();
        component.submitPatient(patient);
        expect(component.submitPatient).toHaveBeenCalledWith(patient);
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

describe('PatientRegistrationComponent: error', () => {
    let component: PatientRegistrationComponent;
    let fixture: ComponentFixture<PatientRegistrationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientRegistrationComponent, NbStepperComponent],
            imports: [
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                mockPipe('phoneNumberPipe'),
                mockPipe('variant'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test submitPatient method error', () => {
        const patient: PatientModel = {
            expected_delivery_date: '2015-03-05',
            person: {
                id_value: '123',
                first_name: 'John',
                last_name: 'Doe',
                gender: 'MALE',
                other_names: 'Schwarznegger',
                id_document_type: 'NATIONAL_ID',
                date_of_birth: '2015-03-03',
                person_contacts: [
                    {
                        contact_type: 'phone_number',
                        contact: '+254712345678',
                        is_primary_contact: true,
                    },
                ],
                person_photos: [],
                person_ids: [],
            },
        };

        spyOn(component, 'submitPatient').and.callThrough();
        component.getFormOptions({ resetModel: () => {} });

        component.submitPatient(patient);
        expect(component.submitPatient).toHaveBeenCalledWith(patient);
    });

    it('should saveEducationConsent SMS', () => {
        spyOn(component, 'saveEducationConsent').and.callThrough();
        component.saveSmsConsent(true);
        component.toggleConsentLoading('SMS_HEALTH_EDUCATION');
        component.saveEducationConsent();
        expect(component.saveEducationConsent).toHaveBeenCalled();
    });

    it('should saveEducationConsent for Email content', () => {
        spyOn(component, 'saveEducationConsent').and.callThrough();
        component.saveSmsConsent(true);
        component.toggleConsentLoading('EMAIL_HEALTH_EDUCATION');
        component.saveEducationConsent();
        expect(component.saveEducationConsent).toHaveBeenCalled();
    });

    it('should test submitRelatedPerson method error', () => {
        const person: PersonModel = {
            date_of_birth: '2015-03-03',
            first_name: 'Hos',
            last_name: 'Bos',
            gender: 'MALE',
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
            relationship: '',
        };
        spyOn(component, 'submitRelatedPerson').and.callThrough();
        component.getFormOptions({ resetModel: () => {} });

        component.submitRelatedPerson(person);
        expect(component.submitRelatedPerson).toHaveBeenCalledWith(person);
    });
});

const uIRouterGlobalsStub3 = {
    current: {
        name: 'app.advantage.patients.register',
    },
    params: { step: '2' },
};

describe('PatientRegistrationComponent: Check if the stepper will load patient details', () => {
    let component: PatientRegistrationComponent;
    let fixture: ComponentFixture<PatientRegistrationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientRegistrationComponent, NbStepperComponent],
            imports: [
                mockPipe('age'),
                mockPipe('titleCase'),
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                mockPipe('phoneNumberPipe'),
                mockPipe('variant'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub3 },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should saveEducationConsent for SMS content', () => {
        spyOn(component, 'saveEducationConsent').and.callThrough();
        component.saveSmsConsent(true);
        component.toggleConsentLoading('SMS_HEALTH_EDUCATION');
        component.saveEducationConsent();
        expect(component.saveEducationConsent).toHaveBeenCalled();
    });

    it('should saveEducationConsent for Email content', () => {
        spyOn(component, 'saveEducationConsent').and.callThrough();
        component.saveSmsConsent(true);
        component.toggleConsentLoading('EMAIL_HEALTH_EDUCATION');
        component.saveEducationConsent();
        expect(component.saveEducationConsent).toHaveBeenCalled();
    });

    it('should test openPatientCoverModal with navigateAfterCreating as true and patientCover as false', () => {
        spyOn(component, 'openPatientCoverModal').and.callThrough();
        spyOn(component, 'toggleModal').and.callThrough();

        component.toggle['navigateAfterCreating'] = true;
        component.toggle['patientCover'] = false;

        component.openPatientCoverModal();

        expect(component.toggleModal).toHaveBeenCalledWith(
            'navigateAfterCreating'
        );
        expect(component.toggleModal).toHaveBeenCalledWith('patientCover');
        expect(component.toggleModal).toHaveBeenCalledTimes(2); // Ensure it's called twice
        expect(component.openPatientCoverModal).toHaveBeenCalled();
    });

    it('should test openPatientCoverModal with navigateAfterCreating as false and patientCover as true', () => {
        spyOn(component, 'openPatientCoverModal').and.callThrough();
        spyOn(component, 'toggleModal').and.callThrough();

        component.toggle['navigateAfterCreating'] = false;
        component.toggle['patientCover'] = true;

        component.openPatientCoverModal();

        expect(component.toggleModal).toHaveBeenCalledWith(
            'navigateAfterCreating'
        );
        expect(component.toggleModal).toHaveBeenCalledWith('patientCover');
        expect(component.toggleModal).toHaveBeenCalledTimes(2); // Ensure it's called twice
        expect(component.openPatientCoverModal).toHaveBeenCalled();
    });

    it('should navigate to next of kin step', () => {
        spyOn(component, 'goToNextOfKin').and.callThrough();
        spyOn(component, 'nextStep').and.callThrough();

        component.goToNextOfKin();
        component.nextStep();

        expect(component.goToNextOfKin).toHaveBeenCalled();
        expect(component.nextStep).toHaveBeenCalled();
    });

    it('should send OTP', () => {
        spyOn(component, 'sendOTP').and.callThrough();
        component.sendOTP();

        expect(component.sendOTP).toHaveBeenCalled();
    });

    it('should resnd OTP', () => {
        spyOn(component, 'resendOTP').and.callThrough();
        component.resendOTP();

        expect(component.resendOTP).toHaveBeenCalled();
    });

    it('should test isOtpValid', () => {
        spyOn(component, 'isOtpValid').and.callThrough();
        component.isOtpValid();

        expect(component.isOtpValid()).toBeFalsy();
    });

    it('should test resetCountdown', () => {
        spyOn(component, 'resetCountdown').and.callThrough();
        component.resetCountdown();

        expect(component.resetCountdown).toHaveBeenCalled();
    });

    it('should test startCountdown', () => {
        spyOn(component, 'startCountdown').and.callThrough();
        component.startCountdown();

        expect(component.startCountdown).toHaveBeenCalled();
    });

    it('should verify OTP', () => {
        spyOn(component, 'verifyOTP').and.callThrough();
        component.verifyOTP();

        expect(component.verifyOTP).toHaveBeenCalled();
    });

    it('should transition consent status when PENDING', () => {
        // Set the current status to be PENDING
        component.uiglobals.params.consent_status = 'PENDING';
        spyOn(component, 'transitionConsentStatus').and.callThrough();
        component.transitionConsentStatus();

        expect(component.transitionConsentStatus).toHaveBeenCalled();
    });

    it('should transition consent status when VERIFIED', () => {
        // Set the current status to be VERIFIED
        component.uiglobals.params.consent_status = 'VERIFIED';
        spyOn(component, 'transitionConsentStatus').and.callThrough();
        component.transitionConsentStatus();

        expect(component.transitionConsentStatus).toHaveBeenCalled();
    });

    it('should change OTP value', () => {
        spyOn(component, 'onOtpChange').and.callThrough();
        component.onOtpChange(123456);
        expect(component.onOtpChange).toHaveBeenCalled();
    });

    it('test patientString when variant is uzazisalama', () => {
        component.variant = 'uzazisalama';
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('test patientString when variant is not uzazisalama', () => {
        component.variant = 'default';
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should navigate to patient consent', () => {
        spyOn(component, 'goToPatientConsent').and.callThrough();
        spyOn(component, 'nextStep').and.callThrough();

        component.goToPatientConsent();
        component.nextStep();

        expect(component.goToPatientConsent).toHaveBeenCalled();
        expect(component.nextStep).toHaveBeenCalled();
    });

    it('should test openPatientCoverModal with both toggles false', () => {
        spyOn(component, 'openPatientCoverModal').and.callThrough();
        spyOn(component, 'toggleModal').and.callThrough();

        component.toggle['navigateAfterCreating'] = false;
        component.toggle['patientCover'] = false;

        component.openPatientCoverModal();

        expect(component.openPatientCoverModal).toHaveBeenCalled();
        expect(component.toggleModal).not.toHaveBeenCalled();
    });
});

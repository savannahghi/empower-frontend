import {
    ComponentFixture,
    discardPeriodicTasks,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from '@angular/core/testing';

import { PatientConsentComponent } from './patient-consent.component';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PatientService } from '../patient.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { StateService, UIRouterGlobals } from '@uirouter/angular';

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
}

class PatientServiceStub {
    preparePatientPayload() {
        return null;
    }
    createConsent() {
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
    sendOTP() {
        return null;
    }
    verifyOTP() {
        return null;
    }
    resendOTP() {
        return null;
    }
    transitionOTP() {
        return null;
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transitionTo() {
        return true;
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.patients.detail.',
    },
    params() {
        return { id: '8764-0284', appointment_id: 1 };
    },
};

describe('PatientConsentComponent', () => {
    let component: PatientConsentComponent;
    let fixture: ComponentFixture<PatientConsentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PatientConsentComponent],
            imports: [mockPipe('titleCase'), mockPipe('variantDisplay')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: ErrorHandlerService,
                    useValue: { handleError: jasmine.createSpy() },
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(PatientConsentComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({
            person: {
                id: '12345',
            },
        });
        fixture.detectChanges();
    });

    it('should test toggleModal function', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal('optOutSMS');
        expect(component.toggleModal).toHaveBeenCalledWith('optOutSMS');
    });

    it('should toggle the modal and set currentConsent', () => {
        // Arrange
        const context = 'optOutSMS';
        const consent = { id: '123' };

        // Act
        component.toggleModal(context, consent);

        // Assert
        expect(component.toggle[context]).toBe(true);
        expect(component.currentConsent).toBe(consent);
    });

    it('should fetch patient info', () => {
        spyOn(component, 'getPatientInfo').and.callThrough();
        component.ngOnInit();
        component.getPatientInfo();
        expect(component.getPatientInfo).toHaveBeenCalled();
    });

    it('should test toggleConsentLoading', () => {
        spyOn(component, 'toggleConsentLoading').and.callThrough();
        let consent;
        component.toggleConsentLoading(consent);
        expect(component.toggleConsentLoading).toHaveBeenCalled();
    });

    it('should test changeConsentStatus', () => {
        spyOn(component, 'changeConsentStatus').and.callThrough();
        component.changeConsentStatus();
        expect(component.changeConsentStatus).toHaveBeenCalled();
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

    it('should change OTP value', () => {
        spyOn(component, 'onOtpChange').and.callThrough();
        component.onOtpChange(123456);

        expect(component.onOtpChange).toHaveBeenCalled();
    });

    it('should start a countdown', fakeAsync(() => {
        const clearIntervalSpy = spyOn(window, 'clearInterval');
        component.timeLeft = 10;
        component.startCountdown();

        tick(60000);

        expect(component.timeLeft).toEqual(0);

        discardPeriodicTasks();
        flush();

        clearIntervalSpy.calls.reset();
    }));

    it('should start a countdown and update showRetryButton', fakeAsync(() => {
        const clearIntervalSpy = spyOn(window, 'clearInterval');
        component.timeLeft = -1;
        component.startCountdown();

        tick(60000);

        expect(component.timeLeft).toEqual(-1);

        discardPeriodicTasks();
        flush();

        expect(clearIntervalSpy).toHaveBeenCalled();
        expect(component.showRetryButton).toBeTruthy();
        clearIntervalSpy.calls.reset();
    }));

    it('should change the consent status to VERIFIED if the current status is not VERIFIED', () => {
        // Arrange
        component.currentConsent = { id: '123', status: 'PENDING' };
        spyOn(component.patientService, 'transitionOTP');

        // Act
        component.changeConsentStatus();

        // Assert
        expect(component.patientService.transitionOTP).toHaveBeenCalledWith(
            component,
            'VERIFIED',
            '123'
        );
    });

    it('should change the consent status to REJECTED if the current status is VERIFIED', () => {
        // Arrange
        component.currentConsent = { id: '456', status: 'VERIFIED' };
        component.createEducationConsent();
        spyOn(component.patientService, 'transitionOTP');

        // Act
        component.changeConsentStatus();

        // Assert
        expect(component.patientService.transitionOTP).toHaveBeenCalledWith(
            component,
            'REJECTED',
            '456'
        );
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
}

describe('PatientConsentComponent: error', () => {
    let component: PatientConsentComponent;
    let fixture: ComponentFixture<PatientConsentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PatientConsentComponent],
            imports: [mockPipe('titleCase'), mockPipe('variantDisplay')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: ErrorHandlerService,
                    useValue: { handleError: jasmine.createSpy() },
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(PatientConsentComponent);
        component = fixture.componentInstance;
        component.patientObservable = throwError('Error thrown');
        fixture.detectChanges();
    });

    it('should fail to fetch patient info', () => {
        spyOn(component, 'getPatientInfo').and.callThrough();
        component.ngOnInit();
        component.getPatientInfo();
        expect(component.getPatientInfo).toHaveBeenCalled();
    });

    it('should test mapStatusStrings function', () => {
        spyOn(component, 'mapStatusStrings').and.callThrough();
        const result = component.mapStatusStrings('btnText', 'verified');
        expect(component.mapStatusStrings).toHaveBeenCalled();
        expect(result).toBe('out');
    });

    it('should test mapStatusStrings function when status value is not verified', () => {
        component.variant = 'uzazisalama';
        spyOn(component, 'mapStatusStrings').and.callThrough();
        component.mapStatusStrings('messageText', 'default');
        expect(component.mapStatusStrings).toHaveBeenCalled();
    });
    it('should format the consent status', () => {
        // Arrange
        const status = 'PENDING_VERIFICATION';

        // Act
        const formattedStatus = component.formatConsentStatus(status);

        // Assert
        expect(formattedStatus).toBe('Pending Verification');
    });

    it('should test formatConsentStatus if the status is undefined', () => {
        // Arrange
        const status = undefined;

        // Act
        const formattedStatus = component.formatConsentStatus(status);

        // Assert
        expect(formattedStatus).toBe('');
    });
});

describe('PatientConsentComponent: error', () => {
    let component: PatientConsentComponent;
    let fixture: ComponentFixture<PatientConsentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PatientConsentComponent],
            imports: [mockPipe('titleCase'), mockPipe('variantDisplay')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: ErrorHandlerService,
                    useValue: { handleError: jasmine.createSpy() },
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(PatientConsentComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({
            person: {
                id: '12345',
            },
        });
        fixture.detectChanges();
    });

    it('should fail to fetch consent', () => {
        spyOn(component, 'fetchConsent').and.callThrough();
        component.ngOnInit();
        component.fetchConsent();
        expect(component.fetchConsent).toHaveBeenCalled();
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
});

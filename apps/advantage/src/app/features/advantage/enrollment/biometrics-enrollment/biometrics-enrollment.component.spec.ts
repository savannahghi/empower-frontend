import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { ShepherdService } from 'angular-shepherd';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { FeatureFlagService } from 'app/@core/utils/feature.service';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { BehaviorSubject, of } from 'rxjs';
import { BiometricsEnrollmentComponent } from './biometrics-enrollment.component';

const uIRouterGlobalsStub = {
    params: {
        id: '112',
    },
};

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class SilStoresServiceStub {
    create() {
        return of({
            origin: 'ADVANTAGE',
            content: 'message content',
            prompt_id: '12',
            chat_id: '32',
        });
    }
    get() {
        return of({
            id: '12312',
            total_payments: 4500,
        });
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getAutoreconSettings() {
        return {
            bp_type: ['PROVIDER'],
        };
    }
    getUser() {
        return {};
    }
    setUser() {
        return {};
    }
    getOrganisationData() {
        return {
            user_workstations: [{ workstation: '1' }],
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
    reload() {
        return true;
    }
    includes() {
        return true;
    }
    transitionTo() {
        return true;
    }
}

class FeatureFlagServiceStub {
    checkVariantFlag(flagName: string): boolean {
        if (flagName === 'prov_biometricsEnrollmentSidebarLink') {
            return true;
        }
        return false;
    }
}

class ShepherdServiceStub {
    addSteps() {}
    start() {}
}

describe('BiometricsEnrollmentComponent', () => {
    let component: BiometricsEnrollmentComponent;
    let fixture: ComponentFixture<BiometricsEnrollmentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BiometricsEnrollmentComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                { provide: ShepherdService, useClass: ShepherdServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BiometricsEnrollmentComponent);
        component = fixture.componentInstance;

        component.patientObservable = new BehaviorSubject({
            id: '123',
            patient_id: 'P-001',
            person: {
                first_name: 'Jane',
                other_names: 'A.',
                last_name: 'Doe',
                gender: 'FEMALE',
                age: 30,
                date_of_birth: '1994-01-01',
                phone_number: '1234567890',
                email: 'jane.doe@example.com',
            },
        });

        fixture.detectChanges();
    });

    it('should test ngOnInit method', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should toggle showFingerprintInfo when toggleFingerprintInfo is called', () => {
        // Initially false
        component.showFingerprintInfo = false;

        component.toggleFingerprintInfo();
        expect(component.showFingerprintInfo).toBeTrue();

        component.toggleFingerprintInfo();
        expect(component.showFingerprintInfo).toBeFalse();
    });

    it('should test getPatientData function', () => {
        spyOn(component, 'getPatientData').and.callThrough();
        component.getPatientData();
        expect(component.getPatientData).toHaveBeenCalledWith();
    });

    it('should test selectFinger function', () => {
        const finger = 'Right Thumb';

        component.FINGERPOSITIONS = { 'Right Thumb': 1 };
        component.enrolledUnverifiedPositions = [];
        component.enrolledVerifiedPositions = [];

        spyOn(component, 'selectFinger').and.callThrough();
        spyOn(component, 'enrollFingerprint').and.stub();
        spyOn(component, 'verifyEnrolledFingerprint').and.stub();

        component.selectFinger(finger);
        expect(component.selectFinger).toHaveBeenCalledWith(finger);
    });

    it('should test isFingerSelected function', () => {
        const finger = 'Right Thumb';

        spyOn(component, 'isFingerSelected').and.callThrough();
        component.isFingerSelected(finger);
        expect(component.isFingerSelected).toHaveBeenCalledWith(finger);
    });

    it('should test isFingerEnrolledUnverified function', () => {
        const finger = 'Right Thumb';
        component.FINGERPOSITIONS = { 'Right Thumb': 1 };
        component.enrolledUnverifiedPositions = [1];

        spyOn(component, 'isFingerEnrolledUnverified').and.callThrough();
        const result = component.isFingerEnrolledUnverified(finger);
        expect(component.isFingerEnrolledUnverified).toHaveBeenCalledWith(
            finger
        );
        expect(result).toBeTrue();
    });

    it('should test isFingerEnrolledAndVerified function', () => {
        const finger = 'Right Thumb';
        component.FINGERPOSITIONS = { 'Right Thumb': 1 };
        component.enrolledVerifiedPositions = [1, 2, 6, 7];

        spyOn(component, 'isFingerEnrolledAndVerified').and.callThrough();
        const result = component.isFingerEnrolledAndVerified(finger);
        expect(component.isFingerEnrolledAndVerified).toHaveBeenCalledWith(
            finger
        );
        expect(result).toBeTrue();
    });

    it('should test isFingerNotEnrolled function', () => {
        const finger = 'Right Thumb';
        component.FINGERPOSITIONS = { 'Right Thumb': 1 };
        component.enrolledVerifiedPositions = [];
        component.enrolledUnverifiedPositions = [];

        spyOn(component, 'isFingerNotEnrolled').and.callThrough();
        const result = component.isFingerNotEnrolled(finger);
        expect(component.isFingerNotEnrolled).toHaveBeenCalledWith(finger);
        expect(result).toBeTrue();
    });

    it('should test canSelectFinger function and should return true when finger is not enrolled', () => {
        const finger = 'Right Thumb';

        component.enrolledVerifiedPositions = [];
        component.enrolledUnverifiedPositions = [];

        expect(component.canSelectFinger(finger)).toBeTrue();
    });

    it('should test canSelectFinger function and should return true when finger is enrolled but unverified', () => {
        const finger = 'Right Thumb';

        component.enrolledVerifiedPositions = [];
        component.enrolledUnverifiedPositions = [1];

        expect(component.canSelectFinger(finger)).toBeTrue();
    });

    it('should test canSelectFinger function and should return false when finger is enrolled and verified', () => {
        const finger = 'Right Thumb';

        component.enrolledVerifiedPositions = [1];
        component.enrolledUnverifiedPositions = [];

        expect(component.canSelectFinger(finger)).toBeFalse();
    });

    it('should test verifyEnrolledFingerprint function when globalHealthId is not present', () => {
        component.globalHealthId = '';

        const position = 1;

        spyOn(component, 'verifyEnrolledFingerprint').and.callThrough();
        component.verifyEnrolledFingerprint(position);
        expect(component.verifyEnrolledFingerprint).toHaveBeenCalledWith(
            position
        );
    });

    it('should test verifyEnrolledFingerprint function when globalHealthId is present', () => {
        component.globalHealthId = '4580030000000551';

        const position = 1;

        spyOn(component, 'verifyEnrolledFingerprint').and.callThrough();
        component.verifyEnrolledFingerprint(position);
        expect(component.verifyEnrolledFingerprint).toHaveBeenCalledWith(
            position
        );
    });

    it('should call verifyEnrolledFingerprint if finger is enrolled but unverified', () => {
        const finger = 'Right Thumb';
        const position = 1;

        component.enrolledUnverifiedPositions = [position];
        component.enrolledVerifiedPositions = [];

        spyOn(component, 'verifyEnrolledFingerprint').and.callThrough();

        component.selectFinger(finger);

        component.verifyEnrolledFingerprint(position);
        expect(component.verifyEnrolledFingerprint).toHaveBeenCalledWith(
            position
        );
    });

    it('should set enrollmentError to false when response.verified is true in verifyEnrolledFingerprint', () => {
        const position = 1;
        component.globalHealthId = '123456789';
        const responseMock = { verified: true };

        spyOn(component.dataLayer, 'create').and.returnValue(of(responseMock));

        component.verifyEnrolledFingerprint(position);

        expect(component.enrollmentError).toBeFalse();

        expect(component.showSpinner).toBeFalse();
    });

    it('should set enrollmentError to true when response.verified is false', () => {
        const position = 1;
        component.globalHealthId = '123456789';
        const responseMock = { verified: false };

        spyOn(component.dataLayer, 'create').and.returnValue(of(responseMock));

        component.verifyEnrolledFingerprint(position);

        expect(component.enrollmentError).toBeTrue();
        expect(component.showSpinner).toBeFalse();
    });

    it('should call enrollFingerprint if finger is not enrolled', () => {
        const finger = 'Right Thumb';
        const position = 1;

        component.enrolledUnverifiedPositions = [];
        component.enrolledVerifiedPositions = [];

        spyOn(component, 'enrollFingerprint').and.callThrough();

        component.selectFinger(finger);

        component.enrollFingerprint(position);
        expect(component.enrollFingerprint).toHaveBeenCalledWith(position);
    });

    it('should test enrollFingerprint function when globalHealthId is not present', () => {
        component.globalHealthId = '';

        const position = 7;

        spyOn(component, 'enrollFingerprint').and.callThrough();
        component.enrollFingerprint(position);
        expect(component.enrollFingerprint).toHaveBeenCalledWith(position);
    });

    it('should test enrollFingerprint function when globalHealthId is present', () => {
        component.globalHealthId = '4580030000000551';

        const position = 7;

        spyOn(component, 'enrollFingerprint').and.callThrough();
        component.enrollFingerprint(position);
        expect(component.enrollFingerprint).toHaveBeenCalledWith(position);
    });

    it('should call biometricsService.checkBiometricsHardwareDevice if OS is supported', () => {
        const mockPatient = {
            global_health_id: '1234567890',
        };

        const biometricsSpy = spyOn(
            component['biometricsService'],
            'checkBiometricsHardwareDevice'
        );

        spyOn(
            component['operatingSystemDetectionService'],
            'getCurrentOS'
        ).and.returnValue('Windows');
        spyOn(
            component['operatingSystemDetectionService'],
            'isCurrentOsSupported'
        ).and.returnValue(true);

        component.patientObservable = of(mockPatient);
        component.getPatientData();

        expect(biometricsSpy).toHaveBeenCalledWith('1234567890');
    });

    it('should set unsupportedOS when OS is not supported', () => {
        spyOn(
            component['operatingSystemDetectionService'],
            'getCurrentOS'
        ).and.returnValue('Ubuntu');
        spyOn(
            component['operatingSystemDetectionService'],
            'isCurrentOsSupported'
        ).and.returnValue(false);

        component.patientObservable = of({ global_health_id: 'GHID-001' });
        component.getPatientData();

        expect(component.unsupportedOS).toEqual('Ubuntu');
        expect(component.isSupported).toBeFalse();
    });

    it('should call resetFingerprintState on biometricsService', () => {
        const resetSpy = spyOn(
            component['biometricsService'],
            'resetFingerprintState'
        );

        spyOn(
            component['operatingSystemDetectionService'],
            'getCurrentOS'
        ).and.returnValue('Windows');
        spyOn(
            component['operatingSystemDetectionService'],
            'isCurrentOsSupported'
        ).and.returnValue(true);

        component.patientObservable = of({ global_health_id: 'GHID-001' });
        component.getPatientData();

        expect(resetSpy).toHaveBeenCalled();
    });

    it('should test startWalkthrough', () => {
        spyOn(component, 'startWalkthrough').and.callThrough();
        component.startWalkthrough();
        expect(component.startWalkthrough).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('BiometricsEnrollmentComponent with error', () => {
    let component: BiometricsEnrollmentComponent;
    let fixture: ComponentFixture<BiometricsEnrollmentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BiometricsEnrollmentComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                { provide: ShepherdService, useClass: ShepherdServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BiometricsEnrollmentComponent);
        component = fixture.componentInstance;

        component.patientObservable = new BehaviorSubject({
            id: '123',
            patient_id: 'P-001',
            person: {
                first_name: 'Jane',
                other_names: 'A.',
                last_name: 'Doe',
                gender: 'FEMALE',
                age: 30,
                date_of_birth: '1994-01-01',
                phone_number: '1234567890',
                email: 'jane.doe@example.com',
            },
        });

        fixture.detectChanges();
    });

    it('should test handleErrorFxn method', () => {
        spyOn(component, 'handleErrorFxn').and.callThrough();
        component.handleErrorFxn({});
        expect(component.handleErrorFxn).toHaveBeenCalled();
    });

    it('should test handleEnrollmentError method', () => {
        spyOn(component, 'handleEnrollmentError').and.callThrough();
        component.handleEnrollmentError({});
        expect(component.handleEnrollmentError).toHaveBeenCalled();
    });
});

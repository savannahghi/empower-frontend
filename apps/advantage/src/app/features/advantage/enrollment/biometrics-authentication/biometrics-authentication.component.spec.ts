import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { FeatureFlagService } from 'app/@core/utils/feature.service';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { BehaviorSubject, of } from 'rxjs';
import { BiometricsAuthenticationComponent } from './biometrics-authentication.component';

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
        return of({});
    }
    get() {
        return of({});
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    setUser() {
        return {
            client_types: ['PROVIDER'],
        };
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

describe('BiometricsAuthenticationComponent', () => {
    let component: BiometricsAuthenticationComponent;
    let fixture: ComponentFixture<BiometricsAuthenticationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BiometricsAuthenticationComponent],
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
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BiometricsAuthenticationComponent);
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

    it('should test selectFinger function', () => {
        const finger = 'Right Thumb';

        spyOn(component, 'selectFinger').and.callThrough();
        component.selectFinger(finger);
        expect(component.selectFinger).toHaveBeenCalledWith(finger);
    });

    it('should not proceed with selectFinger if authenticatedFinger is set', () => {
        const finger = 'Right Thumb';
        component.authenticatedFinger = 'Right Thumb';
        component.showSpinner = false;

        const spy = spyOn<any>(component, 'authenticateFingerprint');

        component.selectFinger(finger);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should not proceed with selectFinger if showSpinner is true', () => {
        const finger = 'Right Thumb';
        component.authenticatedFinger = null;
        component.showSpinner = true;

        const spy = spyOn<any>(component, 'authenticateFingerprint');

        component.selectFinger(finger);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should test isFingerSelected function', () => {
        const finger = 'Right Thumb';

        spyOn(component, 'isFingerSelected').and.callThrough();
        component.isFingerSelected(finger);
        expect(component.isFingerSelected).toHaveBeenCalledWith(finger);
    });

    it('should test authenticateFingerprint function when globalHealthId is not present', () => {
        component.globalHealthId = '';
        const position = 7;

        spyOn(component, 'authenticateFingerprint').and.callThrough();
        component.authenticateFingerprint(position);
        expect(component.authenticateFingerprint).toHaveBeenCalledWith(
            position
        );
    });

    it('should test authenticateFingerprint function when globalHealthId is present', () => {
        component.globalHealthId = '4580030000000551';
        const position = 7;

        spyOn(component, 'authenticateFingerprint').and.callThrough();
        component.authenticateFingerprint(position);
        expect(component.authenticateFingerprint).toHaveBeenCalledWith(
            position
        );
    });

    it('should test handleFingerprintAuthResponse function when matched is true', () => {
        const response = {
            matched: true,
            score: 173.1950982822188,
            match_log_id: 'cb497bc7-09b0-445d-a32c-d1457deeb0e7',
        };

        spyOn(component, 'handleFingerprintAuthResponse').and.callThrough();
        component.handleFingerprintAuthResponse(response);
        expect(component.handleFingerprintAuthResponse).toHaveBeenCalledWith(
            response
        );
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
});

describe('BiometricsAuthenticationComponent with matched false - verification failed', () => {
    let component: BiometricsAuthenticationComponent;
    let fixture: ComponentFixture<BiometricsAuthenticationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BiometricsAuthenticationComponent],
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
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BiometricsAuthenticationComponent);
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

    it('should test selectFinger function', () => {
        const finger = 'Right Thumb';

        spyOn(component, 'selectFinger').and.callThrough();
        component.selectFinger(finger);
        expect(component.selectFinger).toHaveBeenCalledWith(finger);
    });

    it('should not proceed with selectFinger if authenticatedFinger is set', () => {
        const finger = 'Right Thumb';
        component.authenticatedFinger = 'Right Thumb';
        component.showSpinner = false;

        const spy = spyOn<any>(component, 'authenticateFingerprint');

        component.selectFinger(finger);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should not proceed with selectFinger if showSpinner is true', () => {
        const finger = 'Right Thumb';
        component.authenticatedFinger = null;
        component.showSpinner = true;

        const spy = spyOn<any>(component, 'authenticateFingerprint');

        component.selectFinger(finger);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should test isFingerSelected function', () => {
        const finger = 'Right Thumb';

        spyOn(component, 'isFingerSelected').and.callThrough();
        component.isFingerSelected(finger);
        expect(component.isFingerSelected).toHaveBeenCalledWith(finger);
    });

    it('should test authenticateFingerprint function when globalHealthId is not present', () => {
        component.globalHealthId = '';
        const position = 7;

        spyOn(component, 'authenticateFingerprint').and.callThrough();
        component.authenticateFingerprint(position);
        expect(component.authenticateFingerprint).toHaveBeenCalledWith(
            position
        );
    });

    it('should test authenticateFingerprint function when globalHealthId is present', () => {
        component.globalHealthId = '4580030000000551';
        const position = 7;

        spyOn(component, 'authenticateFingerprint').and.callThrough();
        component.authenticateFingerprint(position);
        expect(component.authenticateFingerprint).toHaveBeenCalledWith(
            position
        );
    });

    it('should test handleFingerprintAuthResponse function when matched is false', () => {
        const response = {
            matched: false,
            score: 26.666814770387404,
            match_log_id: null,
        };

        spyOn(component, 'handleFingerprintAuthResponse').and.callThrough();
        component.handleFingerprintAuthResponse(response);
        expect(component.handleFingerprintAuthResponse).toHaveBeenCalledWith(
            response
        );
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

describe('BiometricsAuthenticationComponent with error', () => {
    let component: BiometricsAuthenticationComponent;
    let fixture: ComponentFixture<BiometricsAuthenticationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BiometricsAuthenticationComponent],
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
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BiometricsAuthenticationComponent);
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

    it('should test handleAuthenticationError method', () => {
        spyOn(component, 'handleAuthenticationError').and.callThrough();
        component.handleAuthenticationError({});
        expect(component.handleAuthenticationError).toHaveBeenCalled();
    });
});

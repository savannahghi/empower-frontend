import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService } from '@uirouter/angular';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { BiometricsService } from './biometrics.service';

class SilStoresServiceStub {
    create() {
        return of({});
    }
    get() {
        return of({});
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
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

describe('BiometricsService', () => {
    let service: BiometricsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });

        service = TestBed.inject(BiometricsService);
    });

    afterEach(() => {
        if (service.hardwareStatusInterval) {
            clearInterval(service.hardwareStatusInterval);
            service.hardwareStatusInterval = null;
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should test getDeviceDetails function', () => {
        const response = {
            devices: [
                {
                    id: 'H39240100221',
                    name: 'Secugen',
                    displayName: 'Slade360',
                    type: 'Fingerprint',
                },
            ],
            isAuthed: true,
            workstationID: '7D45109F-D99F-45E3-B390-8354CED54D71',
            version: '1.5.1.20572',
        };

        spyOn(service, 'getDeviceDetails').and.callThrough();
        service.getDeviceDetails(response);
        expect(service.getDeviceDetails).toHaveBeenCalledWith(response);
    });

    it('should test fetchHardwareStatus function', () => {
        spyOn(service, 'fetchHardwareStatus').and.callThrough();
        service.fetchHardwareStatus();

        expect(service.fetchHardwareStatus).toHaveBeenCalled();
    });

    it('should poll fetchHardwareStatus every 5 seconds when checkBiometricsHardwareDevice is called', fakeAsync(() => {
        service.hardwareStatusInterval = true;

        const fetchSpy = spyOn(
            service,
            'fetchHardwareStatus'
        ).and.callThrough();

        service.checkBiometricsHardwareDevice('');

        // First call is immediate
        expect(fetchSpy).toHaveBeenCalledTimes(1);

        // Simulate 5s passing
        tick(5000);
        expect(fetchSpy).toHaveBeenCalledTimes(2);

        tick(5000);
        expect(fetchSpy).toHaveBeenCalledTimes(3);

        tick(5000);
        expect(fetchSpy).toHaveBeenCalledTimes(4);

        // Clean up
        clearInterval(service['hardwareStatusInterval']);
    }));

    it('should test biometricsHardwareServerStatusCheckTimeoutInMs when undefined', fakeAsync(() => {
        service.hardwareStatusInterval = false;

        const fetchSpy = spyOn(
            service,
            'fetchHardwareStatus'
        ).and.callThrough();

        environment.biometricsHardwareServerStatusCheckTimeoutInMs = undefined;

        service.checkBiometricsHardwareDevice('');

        // First call is immediate
        expect(fetchSpy).toHaveBeenCalledTimes(1);

        // Simulate 5s passing
        tick(5000);
        expect(fetchSpy).toHaveBeenCalledTimes(2);

        tick(5000);
        expect(fetchSpy).toHaveBeenCalledTimes(3);

        tick(5000);
        expect(fetchSpy).toHaveBeenCalledTimes(4);

        // Clean up
        clearInterval(service['hardwareStatusInterval']);
    }));

    it('should test fetchEnrolledFingerprints function when globalHealthId is not present', () => {
        spyOn(service, 'fetchEnrolledFingerprints').and.callThrough();
        service.fetchEnrolledFingerprints('');
        expect(service.fetchEnrolledFingerprints).toHaveBeenCalledWith('');
    });

    it('should test fetchEnrolledFingerprints function when globalHealthId is present', () => {
        spyOn(service, 'fetchEnrolledFingerprints').and.callThrough();
        service.fetchEnrolledFingerprints('4580030000000551');
        expect(service.fetchEnrolledFingerprints).toHaveBeenCalledWith(
            '4580030000000551'
        );
    });

    it('should test stopPolling method', () => {
        spyOn(service, 'stopPolling').and.callThrough();
        service.stopPolling();
        expect(service.stopPolling).toHaveBeenCalled();
    });

    it('should clear hardwareStatusInterval and set it to null when stopPolling is called', () => {
        // Set a dummy interval ID
        const dummyIntervalId = setInterval(() => {}, 5000);
        service.hardwareStatusInterval = dummyIntervalId;

        // Spy on clearInterval
        const clearSpy = spyOn(window, 'clearInterval').and.callThrough();

        service.stopPolling();

        expect(clearSpy).toHaveBeenCalledWith(dummyIntervalId);
        expect(service.hardwareStatusInterval).toBeNull();
    });

    it('should do nothing if hardwareStatusInterval is null', () => {
        service.hardwareStatusInterval = null;
        const clearSpy = spyOn(window, 'clearInterval');

        service.stopPolling();

        expect(clearSpy).not.toHaveBeenCalled();
        expect(service.hardwareStatusInterval).toBeNull(); // still null
    });

    it('should reset fingerprint-related state and observables', () => {
        // Set initial values
        service.enrolledUnverifiedPositions = [1, 2];
        service.enrolledVerifiedPositions = [3, 4];
        service.hasRequiredVerifiedFingers = true;
        service.fetchedFingerprints = true;

        service.enrolledUnverifiedPositions$.next([1, 2]);
        service.enrolledVerifiedPositions$.next([3, 4]);
        service.hasRequiredVerifiedFingers$.next(true);
        service.fetchedFingerprints$.next(true);

        // Subscribe to current values to verify them
        let unverified: number[] = [];
        let verified: number[] = [];
        let hasRequired: boolean = true;
        let fetched: boolean = true;

        service.enrolledUnverifiedPositions$.subscribe(v => (unverified = v));
        service.enrolledVerifiedPositions$.subscribe(v => (verified = v));
        service.hasRequiredVerifiedFingers$.subscribe(v => (hasRequired = v));
        service.fetchedFingerprints$.subscribe(v => (fetched = v));

        // Call reset
        service.resetFingerprintState();

        // Expectations for internal state
        expect(service.enrolledUnverifiedPositions).toEqual([]);
        expect(service.enrolledVerifiedPositions).toEqual([]);
        expect(service.hasRequiredVerifiedFingers).toBeFalse();
        expect(service.fetchedFingerprints).toBeFalse();

        // Expectations for observables
        expect(unverified).toEqual([]);
        expect(verified).toEqual([]);
        expect(hasRequired).toBeFalse();
        expect(fetched).toBeFalse();
    });
});

describe('BiometricsService with error', () => {
    let service: BiometricsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });

        service = TestBed.inject(BiometricsService);
    });

    it('should test handleErrorFxn method', () => {
        spyOn(service, 'handleErrorFxn').and.callThrough();
        service.handleErrorFxn({});
        expect(service.handleErrorFxn).toHaveBeenCalled();
    });

    it('should test handleFetchEnrolledErrorFxn method', () => {
        spyOn(service, 'handleFetchEnrolledErrorFxn').and.callThrough();
        service.handleFetchEnrolledErrorFxn({});
        expect(service.handleFetchEnrolledErrorFxn).toHaveBeenCalled();
    });
});

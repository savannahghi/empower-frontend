import { Injectable } from '@angular/core';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BiometricsService {
    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService
    ) {}

    hardwareStatusInterval: any;
    fetchedFingerprints = false;
    loading: boolean = false;
    hasError: boolean = false;
    hasFetchEnrolledError: boolean = false;
    deviceWorkstationID: any;
    isDeviceConnected: boolean = false;
    deviceID: any;
    hasCheckedDevice: boolean = false;
    enrolledUnverifiedPositions: number[] = [];
    enrolledVerifiedPositions: number[] = [];
    hasRequiredVerifiedFingers: any;

    isDeviceConnected$ = new BehaviorSubject<boolean>(false);
    deviceID$ = new BehaviorSubject<any>(null);
    fetchedFingerprints$ = new BehaviorSubject<boolean>(false);
    deviceWorkstationID$ = new BehaviorSubject<any>(null);
    enrolledUnverifiedPositions$ = new BehaviorSubject<number[]>([]);
    enrolledVerifiedPositions$ = new BehaviorSubject<number[]>([]);
    hasError$ = new BehaviorSubject<boolean>(false);
    hasFetchEnrolledError$ = new BehaviorSubject<boolean>(false);
    hasCheckedDevice$ = new BehaviorSubject<boolean>(false);
    hasRequiredVerifiedFingers$ = new BehaviorSubject<boolean>(false);

    checkBiometricsHardwareDevice(globalHealthId: any) {
        // Clear any existing interval to prevent multiple intervals
        if (this.hardwareStatusInterval) {
            clearInterval(this.hardwareStatusInterval);
        }

        // First call immediately
        this.fetchHardwareStatus();
        this.fetchEnrolledFingerprints(globalHealthId);

        // Start polling
        this.hardwareStatusInterval = setInterval(() => {
            this.fetchHardwareStatus();
            this.fetchEnrolledFingerprints(globalHealthId);
        }, Number(environment.biometricsHardwareServerStatusCheckTimeoutInMs || 5000));
    }

    getDeviceDetails = (response: any) => {
        this.hasError = false;
        this.hasError$.next(false);

        this.deviceWorkstationID = response.workstationID;
        this.deviceWorkstationID$.next(response.workstationID);

        const status = response.devices?.length > 0;
        this.isDeviceConnected = status;
        this.isDeviceConnected$.next(status);

        if (status) {
            this.deviceID = response.devices[0].id;
            this.deviceID$.next(response.devices[0].id);
        }

        this.hasCheckedDevice = true;
        this.hasCheckedDevice$.next(true);

        this.loading = false;
    };

    fetchHardwareStatus() {
        this.dataLayer.get('biometrics-hardware-status').subscribe({
            next: this.getDeviceDetails,
            error: this.handleErrorFxn,
        });
    }

    fetchEnrolledFingerprints(globalHealthId) {
        if (!globalHealthId) {
            return;
        }

        const payload = {
            Enrollee: globalHealthId,
        };

        this.dataLayer
            .create('fetch-enrolled-fingerprints', payload)
            .subscribe({
                next: (response: any) => {
                    this.hasError = false;
                    this.hasError$.next(false);

                    this.hasFetchEnrolledError = false;
                    this.hasFetchEnrolledError$.next(false);

                    this.fetchedFingerprints = true;
                    this.fetchedFingerprints$.next(true);

                    this.enrolledUnverifiedPositions =
                        response.non_verified ?? [];
                    this.enrolledUnverifiedPositions$.next(
                        this.enrolledUnverifiedPositions
                    );

                    this.enrolledVerifiedPositions = response.verified ?? [];
                    this.enrolledVerifiedPositions$.next(
                        this.enrolledVerifiedPositions
                    );

                    this.hasRequiredVerifiedFingers =
                        response?.verified?.length >= 4;
                    this.hasRequiredVerifiedFingers$.next(
                        this.hasRequiredVerifiedFingers
                    );
                },
                error: this.handleFetchEnrolledErrorFxn,
            });
    }

    handleErrorFxn = (err: any) => {
        this.loading = false;

        this.hasError = true;
        this.hasError$.next(true);

        this.errorHandler.handleError(err);
    };

    handleFetchEnrolledErrorFxn = (err: any) => {
        this.loading = false;

        this.hasFetchEnrolledError = true;
        this.hasFetchEnrolledError$.next(true);

        this.errorHandler.handleError(err);
    };

    resetFingerprintState() {
        this.enrolledUnverifiedPositions = [];
        this.enrolledVerifiedPositions = [];
        this.hasRequiredVerifiedFingers = false;
        this.fetchedFingerprints = false;

        this.enrolledUnverifiedPositions$.next([]);
        this.enrolledVerifiedPositions$.next([]);
        this.hasRequiredVerifiedFingers$.next(false);
        this.fetchedFingerprints$.next(false);
    }

    stopPolling() {
        if (this.hardwareStatusInterval) {
            clearInterval(this.hardwareStatusInterval);
            this.hardwareStatusInterval = null;
        }
    }
}

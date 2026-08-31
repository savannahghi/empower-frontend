import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { FeatureFlagService } from 'app/@core/utils/feature.service';
import { BiometricsService } from 'app/features/services/biometrics.service';
import { OperatingSystemDetectionService } from 'app/features/services/operating-system-detection.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { environment } from 'environments/environment';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'ngx-biometrics-authentication',
    templateUrl: './biometrics-authentication.component.html',
    styleUrl: './biometrics-authentication.component.scss',
    standalone: false,
})
export class BiometricsAuthenticationComponent implements OnInit, OnDestroy {
    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        public uiglobals: UIRouterGlobals,
        public flagService: FeatureFlagService,
        public operatingSystemDetectionService: OperatingSystemDetectionService,
        public biometricsService: BiometricsService
    ) {}

    @Input() patientObservable: any;

    patient: any;

    loading: boolean = false;

    globalHealthId: any;

    hasRequiredVerifiedFingers: any;

    enrolledVerifiedPositions: number[] = [];

    hasError: boolean = false;

    hasFetchEnrolledError: boolean = false;

    deviceWorkstationID: any;

    isDeviceConnected: boolean = false;

    deviceID: any;

    hasCheckedDevice: boolean = false;

    showSpinner = false;

    authenticationError: boolean = false;

    authenticationSuccess: boolean = false;

    authenticatedFinger: string | null = null;

    hasAuthenticatedAnyFinger = false;

    currentOS: any;

    isSupported: any;

    unsupportedOS: string | null = null;

    hardwareStatusInterval: any;

    fetchedFingerprints = false;

    destroy$ = new Subject<void>();

    biometricsHardwareServerUrl = environment.biometricsHardwareServerUrl;

    toastTime = 7000;

    fingers = [
        { name: 'Left Index', img: 'left-index.png' },
        { name: 'Left Thumb', img: 'left-thumb.png' },
        { name: 'Right Thumb', img: 'right-thumb.png' },
        { name: 'Right Index', img: 'right-index.png' },
    ];

    FINGERPOSITIONS: Record<string, number> = {
        'Left Little': 10,
        'Left Ring': 9,
        'Left Middle': 8,
        'Left Index': 7,
        'Left Thumb': 6,
        'Right Little': 5,
        'Right Ring': 4,
        'Right Middle': 3,
        'Right Index': 2,
        'Right Thumb': 1,
        Unknown: 0,
    };

    selectedFinger: string | null = null;

    selectFinger(finger: any) {
        // if already authenticated or there is showSpinner, prevent further selection
        if (this.authenticatedFinger || this.showSpinner) return;

        this.selectedFinger = finger;

        this.authenticationError = false;
        this.authenticationSuccess = false;
        this.showSpinner = true;

        const position = this.FINGERPOSITIONS[finger];

        this.authenticateFingerprint(position);
    }

    isFingerSelected(finger: string): boolean {
        return this.selectedFinger === finger;
    }

    isFingerEnrolledAndVerified(fingerName: string): boolean {
        const position = this.FINGERPOSITIONS[fingerName];
        return this.enrolledVerifiedPositions.includes(position);
    }

    handleErrorFxn = (err: any) => {
        this.loading = false;

        this.hasError = true;

        this.errorHandler.handleError(err);
    };

    getPatientData() {
        this.loading = true;

        this.patientObservable.subscribe({
            next: (response: any) => {
                this.patient = response;
                this.globalHealthId = response.global_health_id;

                this.loading = false;

                this.currentOS =
                    this.operatingSystemDetectionService.getCurrentOS();

                this.isSupported =
                    this.operatingSystemDetectionService.isCurrentOsSupported(
                        this.currentOS
                    );

                if (!this.isSupported) {
                    this.unsupportedOS = this.currentOS;
                }

                this.biometricsService.resetFingerprintState();

                if (this.isSupported) {
                    this.biometricsService.checkBiometricsHardwareDevice(
                        this.globalHealthId
                    );
                }
            },
            error: this.handleErrorFxn,
        });
    }

    handleAuthenticationError = (err: any) => {
        this.loading = false;

        this.showSpinner = false;

        this.authenticationError = true;

        this.authenticationSuccess = false;

        this.errorHandler.handleError(err);
    };

    handleFingerprintAuthResponse = (response: any) => {
        this.hasError = false;
        this.showSpinner = false;

        if (response.matched) {
            this.authenticationSuccess = true;
            this.authenticationError = false;
            this.authenticatedFinger = this.selectedFinger;
            this.hasAuthenticatedAnyFinger = true;
        } else {
            this.authenticationError = true;
            this.authenticationSuccess = false;
        }
    };

    authenticateFingerprint(position: number) {
        if (!this.globalHealthId) {
            return;
        }

        const payload = {
            Id: this.deviceID,
            Enrollee: this.globalHealthId,
            Position: position,
        };

        this.dataLayer.create('verify-fingerprint', payload).subscribe({
            next: this.handleFingerprintAuthResponse,
            error: this.handleAuthenticationError,
        });
    }

    ngOnInit() {
        this.getPatientData();

        this.biometricsService.isDeviceConnected$
            .pipe(takeUntil(this.destroy$))
            .subscribe((status: boolean) => {
                this.isDeviceConnected = status;
            });

        this.biometricsService.deviceID$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id: any) => {
                this.deviceID = id;
            });

        this.biometricsService.deviceWorkstationID$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id: any) => {
                this.deviceWorkstationID = id;
            });

        this.biometricsService.fetchedFingerprints$
            .pipe(takeUntil(this.destroy$))
            .subscribe((flag: boolean) => {
                this.fetchedFingerprints = flag;
            });

        this.biometricsService.hasRequiredVerifiedFingers$
            .pipe(takeUntil(this.destroy$))
            .subscribe((flag: boolean) => {
                this.hasRequiredVerifiedFingers = flag;
            });

        this.biometricsService.enrolledVerifiedPositions$
            .pipe(takeUntil(this.destroy$))
            .subscribe((positions: number[]) => {
                this.enrolledVerifiedPositions = positions;
            });

        this.biometricsService.hasError$
            .pipe(takeUntil(this.destroy$))
            .subscribe((flag: boolean) => {
                this.hasError = flag;
            });

        this.biometricsService.hasFetchEnrolledError$
            .pipe(takeUntil(this.destroy$))
            .subscribe((flag: boolean) => {
                this.hasFetchEnrolledError = flag;
            });

        this.biometricsService.hasCheckedDevice$
            .pipe(takeUntil(this.destroy$))
            .subscribe((checked: boolean) => {
                this.hasCheckedDevice = checked;
            });
    }

    ngOnDestroy() {
        this.biometricsService.stopPolling();
        this.biometricsService.resetFingerprintState();
        this.destroy$.next();
        this.destroy$.complete();
    }
}

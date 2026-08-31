import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { ShepherdService } from 'angular-shepherd';
import { FeatureFlagService } from 'app/@core/utils/feature.service';
import { BiometricsService } from 'app/features/services/biometrics.service';
import { OperatingSystemDetectionService } from 'app/features/services/operating-system-detection.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { environment } from 'environments/environment';
import { Subject, takeUntil } from 'rxjs';
import {
    defaultStepOptions,
    biometricsEnrollmentSteps as defaultSteps,
} from '../../onboarding/shepherd-config';

@Component({
    selector: 'ngx-biometrics-enrollment',
    templateUrl: './biometrics-enrollment.component.html',
    styleUrl: './biometrics-enrollment.component.scss',
    standalone: false,
})
export class BiometricsEnrollmentComponent implements OnInit, OnDestroy {
    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        public uiglobals: UIRouterGlobals,
        public flagService: FeatureFlagService,
        public biometricsService: BiometricsService,
        public operatingSystemDetectionService: OperatingSystemDetectionService,
        public shepherdService: ShepherdService
    ) {}

    @Input() patientObservable: any;

    patient: any;

    loading: boolean = false;

    isDeviceConnected: boolean = false;

    hasCheckedDevice: boolean = false;

    enrollmentError: boolean = false;

    hasError: boolean = false;

    hasFetchEnrolledError: boolean = false;

    deviceID: any;

    deviceWorkstationID: any;

    isSupported: any;

    unsupportedOS: string | null = null;

    currentOS: any;

    globalHealthId: any;

    fetchedFingerprints = false;

    biometricsHardwareServerUrl = environment.biometricsHardwareServerUrl;

    showSpinner = false;

    enrolledUnverifiedPositions: number[] = [];
    enrolledVerifiedPositions: number[] = [];

    destroy$ = new Subject<void>();

    selectedFinger: string | null = null;

    showFingerprintInfo = false;

    toggleFingerprintInfo() {
        this.showFingerprintInfo = !this.showFingerprintInfo;
    }

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

    selectFinger(finger: any) {
        this.selectedFinger = finger;

        this.enrollmentError = false;

        this.showSpinner = true;

        const position = this.FINGERPOSITIONS[finger];

        if (this.isFingerEnrolledUnverified(finger)) {
            // Enrolled but not verified — verify it
            this.verifyEnrolledFingerprint(position);
        } else {
            // Not enrolled — enroll it
            this.enrollFingerprint(position);
        }
    }

    isFingerSelected(finger: string): boolean {
        return this.selectedFinger === finger;
    }

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

    handleErrorFxn = (err: any) => {
        this.loading = false;

        this.hasError = true;

        this.errorHandler.handleError(err);
    };

    isFingerEnrolledUnverified(fingerName: string): boolean {
        const position = this.FINGERPOSITIONS[fingerName];
        return this.enrolledUnverifiedPositions.includes(position);
    }

    isFingerEnrolledAndVerified(fingerName: string): boolean {
        const position = this.FINGERPOSITIONS[fingerName];
        return this.enrolledVerifiedPositions.includes(position);
    }

    isFingerNotEnrolled(fingerName: string): boolean {
        const position = this.FINGERPOSITIONS[fingerName];

        return (
            !this.enrolledVerifiedPositions.includes(position) &&
            !this.enrolledUnverifiedPositions.includes(position)
        );
    }

    canSelectFinger(fingerName: string): boolean {
        return (
            this.isFingerNotEnrolled(fingerName) ||
            this.isFingerEnrolledUnverified(fingerName)
        );
    }

    verifyEnrolledFingerprint(position: number) {
        if (!this.globalHealthId) {
            return;
        }

        const payload = {
            Id: this.deviceID,
            Enrollee: this.globalHealthId,
            Position: position,
        };

        this.dataLayer
            .create('verify-enrolled-fingerprint', payload)
            .subscribe({
                next: (response: any) => {
                    this.hasError = false;

                    if (response.verified) {
                        this.enrollmentError = false;
                    } else {
                        this.enrollmentError = true;
                    }

                    this.showSpinner = false;
                    this.biometricsService.fetchEnrolledFingerprints(
                        this.globalHealthId
                    );
                },
                error: this.handleEnrollmentError,
            });
    }

    handleEnrollmentError = (err: any) => {
        this.loading = false;

        this.showSpinner = false;

        this.enrollmentError = true;

        this.errorHandler.handleError(err);
    };

    enrollFingerprint(position: number) {
        if (!this.globalHealthId) {
            return;
        }

        const payload = {
            Id: this.deviceID,
            Enrollee: this.globalHealthId,
            Position: position,
        };

        this.dataLayer.create('enroll-fingerprint', payload).subscribe({
            next: () => {
                this.biometricsService.fetchEnrolledFingerprints(
                    this.globalHealthId
                );
                this.verifyEnrolledFingerprint(position);

                this.showSpinner = false;
            },
            error: this.handleEnrollmentError,
        });
    }

    startWalkthrough(): void {
        this.shepherdService.defaultStepOptions = defaultStepOptions;
        this.shepherdService.modal = true;
        this.shepherdService.tourName = 'biometrics-enrollment';
        this.shepherdService.confirmCancel = false;
        this.shepherdService.addSteps(defaultSteps);
        this.shepherdService.start();
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

        this.biometricsService.enrolledUnverifiedPositions$
            .pipe(takeUntil(this.destroy$))
            .subscribe((positions: number[]) => {
                this.enrolledUnverifiedPositions = positions;
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

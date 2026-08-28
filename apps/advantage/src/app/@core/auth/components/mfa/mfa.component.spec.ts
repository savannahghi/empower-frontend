import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { of, throwError } from 'rxjs';
import {
    ChangeDetectorRef,
    ElementRef,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { CompleteService } from '../../services/login.service';
import { Authorization } from '../../services/authorization.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { MFAComponent } from './mfa.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { NbSpinnerModule } from '@nebular/theme';

function mockPipe(name: string): Pipe {
    const metadata: Pipe = { name };
    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

describe('MFAComponent', () => {
    let component: MFAComponent;
    let fixture: ComponentFixture<MFAComponent>;
    let completeServiceSpy: jasmine.SpyObj<CompleteService>;
    let toastrServiceSpy: jasmine.SpyObj<NbToastrService>;
    let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;

    beforeAll(() => {
        if (!(window as any).QRCode) {
            (window as any).QRCode = function (container, options) {
                const div = document.createElement('div');
                div.className = 'mock-qrcode';
                div.textContent = options.text;
                container.textContent = '';
                container.appendChild(div);
            };
            (window as any).QRCode.CorrectLevel = { M: 'M' };
        }
    });

    beforeEach(async () => {
        completeServiceSpy = jasmine.createSpyObj('CompleteService', [
            'attemptAssignMFA',
            'attemptVerifyMFA',
        ]);

        completeServiceSpy.attemptAssignMFA.and.returnValue(of({}));
        completeServiceSpy.attemptVerifyMFA.and.returnValue(of({}));

        toastrServiceSpy = jasmine.createSpyObj('NbToastrService', [
            'danger',
            'success',
        ]);

        cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

        await TestBed.configureTestingModule({
            declarations: [MFAComponent],
            imports: [
                ReactiveFormsModule,
                NgOtpInputModule,
                NbSpinnerModule,
                mockPipe('translate'),
                mockPipe('variant'),
                mockPipe('variantDisplay'),
            ],
            providers: [
                FormBuilder,
                { provide: CompleteService, useValue: completeServiceSpy },
                { provide: NbToastrService, useValue: toastrServiceSpy },
                { provide: ChangeDetectorRef, useValue: cdrSpy },
                { provide: Authorization, useValue: {} },
                { provide: ErrorHandlerService, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MFAComponent);
        component = fixture.componentInstance;

        component.user_id = '1';

        component.mfaForm = component.fb.group({
            code: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(6),
                ],
            ],
        });

        (completeServiceSpy as any).heldLoginData = {
            id: 1,
            access_token: 'token123',
        };
    });

    describe('ngOnInit', () => {
        it('should assign MFA and update state on success', fakeAsync(() => {
            component.mfa_options = [];

            const mockResponse = {
                id: 1,
                mfa_type: 'TOTP',
                status: 'PENDING',
                totp_provisioning_uri: 'otpauth://totp/Example',
            };
            completeServiceSpy.attemptAssignMFA.and.returnValue(
                of(mockResponse)
            );

            fixture.detectChanges();
            tick();

            expect(completeServiceSpy.attemptAssignMFA).toHaveBeenCalledWith({
                user: '1',
                mfa_type: 'TOTP',
            });

            expect(component.mfa_options).toEqual([mockResponse]);
            expect(component.selectedMFAOption).toEqual(mockResponse);
            expect(component.isPending).toBeTrue();
        }));

        it('should handle errors during MFA setup', fakeAsync(() => {
            component.mfa_options = [];

            completeServiceSpy.attemptAssignMFA.and.returnValue(
                throwError({ error: ['Failed to setup MFA'] })
            );

            fixture.detectChanges();
            tick();

            expect(completeServiceSpy.attemptAssignMFA).toHaveBeenCalledWith({
                user: '1',
                mfa_type: 'TOTP',
            });

            expect(toastrServiceSpy.danger).toHaveBeenCalledWith(
                'Failed to setup MFA',
                'Error'
            );
            expect(component.assigningMFA).toBeFalse();
        }));
    });

    describe('selectMFAOption', () => {
        it('should select TOTP option with status ENABLED if available', () => {
            component.mfa_options = [
                { mfa_type: 'TOTP', status: 'ENABLED' },
                { mfa_type: 'TOTP', status: 'PENDING' },
            ];

            component.selectedMFAOption = undefined;

            fixture.detectChanges();
            component.ngOnInit();

            expect(component.selectedMFAOption).toEqual(
                component.mfa_options.find(
                    option =>
                        option.mfa_type === 'TOTP' &&
                        option.status === 'ENABLED'
                )
            );
        });

        it('should select TOTP option with status PENDING if no ENABLED option is available', () => {
            component.mfa_options = [
                { mfa_type: 'TOTP', status: 'PENDING' },
                { mfa_type: 'SMS', status: 'ENABLED' },
            ];

            component.selectedMFAOption = undefined;

            fixture.detectChanges();
            component.ngOnInit();

            expect(component.selectedMFAOption).toEqual(
                component.mfa_options.find(
                    option =>
                        option.mfa_type === 'TOTP' &&
                        option.status === 'PENDING'
                )
            );
        });

        it('should not select any TOTP option if none are available', () => {
            component.mfa_options = [
                { mfa_type: 'SMS', status: 'ENABLED' },
                { mfa_type: 'EMAIL', status: 'PENDING' },
            ];

            component.selectedMFAOption = undefined;

            fixture.detectChanges();
            component.ngOnInit();
            expect(component.selectedMFAOption).toBeUndefined();
        });
    });

    describe('generateQRCode', () => {
        it('should generate QR code and append to container', () => {
            const mockContainer = document.createElement('div');
            component.qrcodeElement = {
                nativeElement: mockContainer,
            } as ElementRef;

            component.generateQRCode('otpauth://totp/Example');

            expect(mockContainer.innerHTML).toContain('otpauth://totp/Example');
        });

        it('should not generate QR code if qrcodeElement is undefined', () => {
            component.qrcodeElement = undefined as unknown as ElementRef;
            spyOn(component, 'generateQRCode').and.callThrough();
            component.generateQRCode('otpauth://totp/Example');
            expect(component.generateQRCode).toHaveBeenCalled();
        });

        it('should not generate QR code if qrcodeElement.nativeElement is undefined', () => {
            component.qrcodeElement = {
                nativeElement: undefined,
            } as unknown as ElementRef;
            component.generateQRCode('otpauth://totp/Example');
            expect(component.loading).toBeFalse();
        });
    });

    describe('verifyMFA', () => {
        it('should call attemptVerifyMFA and handle success', () => {
            component.code = '123456';
            component.selectedMFAOption = { id: 1 };
            component.mfaForm.patchValue({ code: '123456' });

            completeServiceSpy.attemptVerifyMFA.and.returnValue(of({}));

            component.verifyMFA();

            expect(completeServiceSpy.attemptVerifyMFA).toHaveBeenCalledWith({
                id: 1,
                code: '123456',
            });
            expect(toastrServiceSpy.success).toHaveBeenCalledWith(
                'MFA verification successful',
                'Success'
            );
            expect(component.loading).toBeFalse();
        });

        it('should call attemptVerifyMFA and handle error', () => {
            component.code = '123456';
            component.selectedMFAOption = { id: 1 };
            component.mfaForm.patchValue({ code: '123456' });

            completeServiceSpy.attemptVerifyMFA.and.returnValue(
                throwError({ error: ['Invalid verification code'] })
            );

            component.verifyMFA();

            expect(completeServiceSpy.attemptVerifyMFA).toHaveBeenCalledWith({
                id: 1,
                code: '123456',
            });
            expect(toastrServiceSpy.danger).toHaveBeenCalledWith(
                'Invalid verification code',
                'Error'
            );
            expect(component.loading).toBeFalse();
        });

        it('should show validation error if form is invalid', () => {
            component.code = '';
            component.mfaForm.patchValue({ code: '' });

            component.verifyMFA();

            expect(toastrServiceSpy.danger).toHaveBeenCalledWith(
                'Please enter a valid verification code',
                'Validation Error'
            );
            expect(completeServiceSpy.attemptVerifyMFA).not.toHaveBeenCalled();
        });
    });

    describe('onOtpChange', () => {
        it('should update the form and detect changes', () => {
            const newCode = '654321';

            component.onOtpChange(newCode);

            expect(component.code).toBe(newCode);
            expect(component.mfaForm.value.code).toBe(newCode);
        });
    });

    describe('ngAfterViewInit', () => {
        it('should not generate QR code if MFA is not pending', () => {
            component.selectedMFAOption = {
                totp_provisioning_uri: 'otpauth://totp/Example',
                status: 'ENABLED',
            };

            component.ngAfterViewInit();

            expect(
                component.qrcodeElement?.nativeElement?.innerHTML
            ).toBeUndefined();
        });
    });

    describe('assignMFA', () => {
        it('should call attemptAssignMFA and handle error', fakeAsync(() => {
            component.mfa_options = [];
            completeServiceSpy.attemptAssignMFA.and.returnValue(
                throwError({ error: ['Failed to setup MFA'] })
            );

            fixture.detectChanges();
            tick();

            expect(completeServiceSpy.attemptAssignMFA).toHaveBeenCalledWith({
                user: '1',
                mfa_type: 'TOTP',
            });

            expect(toastrServiceSpy.danger).toHaveBeenCalledWith(
                'Failed to setup MFA',
                'Error'
            );
            expect(component.assigningMFA).toBeFalse();
        }));
    });
});

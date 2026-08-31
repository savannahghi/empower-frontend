import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    AfterViewInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import { CompleteService } from '../../services/login.service';
import { NbToastrService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let QRCode: any;

@Component({
    selector: 'app-mfa',
    templateUrl: './mfa.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./mfa.component.scss'],
    standalone: false,
})
export class MFAComponent implements OnInit, AfterViewInit {
    @Output() mfaVerified = new EventEmitter<void>();
    @Input() mfa_options: any[] = [];
    @Input() user_id: string;
    selectedMFAOption: any;
    code: string = '';
    loginData: any;
    loading: boolean = false;
    mfaForm: FormGroup;
    isPending: boolean = false;
    assigningMFA: boolean = false;

    constructor(
        private complete: CompleteService,
        private toastrService: NbToastrService,
        private cd: ChangeDetectorRef,
        public fb: FormBuilder
    ) {
        this.initForm();
    }

    private initForm() {
        this.mfaForm = this.fb.group({
            code: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(6),
                ],
            ],
        });
    }

    @ViewChild('qrcode') qrcodeElement!: ElementRef;

    ngOnInit() {
        this.loginData = this.complete.heldLoginData;

        if (this.mfa_options.length === 0) {
            this.assigningMFA = true;
            this.complete
                .attemptAssignMFA({
                    user: this.user_id,
                    mfa_type: 'TOTP',
                })
                .subscribe({
                    next: (response: any) => {
                        this.mfa_options = [response];
                        this.selectedMFAOption = response;
                        this.isPending =
                            this.selectedMFAOption?.status === 'PENDING';
                        if (
                            this.isPending &&
                            this.selectedMFAOption?.totp_provisioning_uri
                        ) {
                            setTimeout(() => {
                                this.generateQRCode(
                                    this.selectedMFAOption.totp_provisioning_uri
                                );
                            });
                        }
                        this.cd.detectChanges();
                    },
                    error: () => {
                        this.toastrService.danger(
                            'Failed to setup MFA',
                            'Error'
                        );
                        this.assigningMFA = false;
                        this.cd.detectChanges();
                    },
                    complete: () => {
                        this.assigningMFA = false;
                        this.cd.detectChanges();
                    },
                });
        } else {
            this.selectedMFAOption =
                this.mfa_options.find(
                    option =>
                        option.mfa_type === 'TOTP' &&
                        option.status === 'ENABLED'
                ) ||
                this.mfa_options.find(
                    option =>
                        option.mfa_type === 'TOTP' &&
                        option.status === 'PENDING'
                );
        }

        this.isPending = this.selectedMFAOption?.status === 'PENDING';
        this.cd.detectChanges();
    }

    ngAfterViewInit() {
        if (this.isPending && this.selectedMFAOption?.totp_provisioning_uri) {
            this.generateQRCode(this.selectedMFAOption.totp_provisioning_uri);
        }
    }

    /**
     * onOtpChange
     * @param event
     */
    onOtpChange(event) {
        this.code = event;
        this.mfaForm.patchValue({ code: event });
        this.cd.detectChanges();
    }

    config = {
        allowNumbersOnly: true,
        length: 6,
        isPasswordInput: false,
        disableAutoFocus: false,
        placeholder: '',
        inputStyles: {
            width: '50px',
            height: '50px',
        },
    };

    generateQRCode(provisioning_uri: string) {
        if (this.qrcodeElement && this.qrcodeElement.nativeElement) {
            const qrcodeContainer = this.qrcodeElement.nativeElement;
            qrcodeContainer.innerHTML = '';
            new QRCode(qrcodeContainer, {
                text: provisioning_uri,
                width: 200,
                height: 200,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M,
            });
        }
    }

    verifyMFA() {
        if (this.mfaForm.invalid || !this.code) {
            this.toastrService.danger(
                'Please enter a valid verification code',
                'Validation Error'
            );
            return;
        }

        this.loading = true;
        this.complete
            .attemptVerifyMFA({
                id: this.selectedMFAOption.id,
                code: this.code,
            })
            .subscribe({
                next: this.onMFASuccess,
                error: () => {
                    this.toastrService.danger(
                        'Invalid verification code',
                        'Error'
                    );
                    this.loading = false;
                    this.cd.detectChanges();
                },
            });
    }

    onMFASuccess = () => {
        this.loading = false;
        this.toastrService.success('MFA verification successful', 'Success');
        this.mfaVerified.emit();
        this.cd.detectChanges();
    };
}

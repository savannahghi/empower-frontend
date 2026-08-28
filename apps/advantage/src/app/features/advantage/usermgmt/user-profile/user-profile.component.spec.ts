import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    flush,
} from '@angular/core/testing';
import { StateService } from '@uirouter/angular';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { of, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { UserProfileComponent } from './user-profile.component';
import { EditProfileBasicDetailsFormFieldsService } from '../../../../shared/sil-form/services/formly/edit-basic-details-form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CompleteService } from '../../../../@core/auth/services/login.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';

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
    getWorkstation() {
        return {};
    }
    getUser() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
            organisation: '123',
        };
    }
    getToken() {
        return {
            access_token: '12efrteruyr34',
        };
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
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

class CompleteServiceStub {
    changePassword() {
        return of({
            old_password: '123',
            new_password1: '1234',
            new_password2: '1234',
        });
    }
    heldLoginData: any;
}

describe('UserProfileComponent', () => {
    let component: UserProfileComponent;
    let fixture: ComponentFixture<UserProfileComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [UserProfileComponent],
            imports: [mockPipe('translate'), FormsModule, ReactiveFormsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ErrorHandlerService,
                EditProfileBasicDetailsFormFieldsService,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting,
                { provide: CompleteService, useClass: CompleteServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UserProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.toastTime = 3000;
    });

    it('should test ngOnInit method', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'danger', 'message', 'context');
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'message',
            'context'
        );
    });

    it('should test submitNewDetails method', fakeAsync(() => {
        spyOn(component, 'submitNewDetails').and.callThrough();
        component.submitNewDetails();
        flush();
        expect(component.submitNewDetails).toHaveBeenCalled();
        expect(component.loading).toBeFalse();
        expect(component.submitted).toBeFalse();
    }));

    it('should test toggleShowPassword method when status is CURRENT', () => {
        const status = 'CURRENT';
        component.showPassword1 = false;
        component.showPassword = false;
        spyOn(component, 'toggleShowPassword').and.callThrough();
        component.toggleShowPassword(status);
        expect(component.toggleShowPassword).toHaveBeenCalledWith(status);
        expect(component.showPassword1).toBeTrue();
        component.showPassword = true;
    });

    it('should test toggleShowPassword method when status is NEW', () => {
        spyOn(component, 'toggleShowPassword').and.callThrough();
        const status = 'NEW';
        component.toggleShowPassword(status);
        expect(component.toggleShowPassword).toHaveBeenCalled();
    });

    it('should test toggleShowPassword method when status is CONFIRM', () => {
        spyOn(component, 'toggleShowPassword').and.callThrough();
        const status = 'CONFIRM';
        component.toggleShowPassword(status);
        expect(component.toggleShowPassword).toHaveBeenCalled();
    });

    it('should test serverChangePassword method', () => {
        spyOn(component, 'serverChangePassword').and.callThrough();
        component.serverChangePassword();
        expect(component.serverChangePassword).toHaveBeenCalled();
    });

    it('should test mustMatch method', () => {
        spyOn(component, 'mustMatch').and.callThrough();
        component.changePasswordForm = component.fb.group(
            {
                confirmPassword: '',
                newPassword: '',
            },
            {
                validators: component.mustMatch(
                    'newPassword',
                    'confirmPassword'
                ),
            }
        );
        const confirmPassword =
            component.changePasswordForm.get('confirmPassword');
        const newPassword = component.changePasswordForm.get('newPassword');
        confirmPassword.setValue('1');
        newPassword.setValue('2');
        expect(confirmPassword.hasError('passwordNotSame')).toBeTrue();
        expect(component.changePasswordForm.valid).toEqual(false);
    });
});

class CompleteServiceStubError {
    changePassword() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('UserProfileComponent Error', () => {
    let component: UserProfileComponent;
    let fixture: ComponentFixture<UserProfileComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [UserProfileComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [FormsModule, ReactiveFormsModule, mockPipe('translate')],
            providers: [
                ErrorHandlerService,
                EditProfileBasicDetailsFormFieldsService,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                {
                    provide: CompleteService,
                    useClass: CompleteServiceStubError,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UserProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.toastTime = 3000;
    });

    it('should test serverChangePassword method', () => {
        spyOn(component, 'serverChangePassword').and.callThrough();
        component.serverChangePassword();
        expect(component.serverChangePassword).toHaveBeenCalled();
    });
});

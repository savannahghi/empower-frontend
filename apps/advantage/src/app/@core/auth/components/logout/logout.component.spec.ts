import { SilLogoutComponent } from './logout.component';
import { Authorization } from '../../services/authorization.service';
import { TestBed, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { of, throwError } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService } from '@uirouter/core';
import { NbToastrService } from '@nebular/theme';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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

class AuthorizationConfigStub {
    logout() {
        return of(() => {});
    }
    getToken() {
        return {};
    }
    removeTokenData() {
        return {};
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
    error() {
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

describe('SilLogoutComponent 1', () => {
    let component: SilLogoutComponent;
    let fixture: ComponentFixture<SilLogoutComponent>;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SilLogoutComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SilLogoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should logout successfully', () => {
        localStorage.setItem('auth.config.credz', JSON.stringify({}));
        spyOn(component, 'logoutUser');
        component.ngOnInit();
        expect(component.logoutUser).toHaveBeenCalled();
        expect(SilLogoutComponent).toBeTruthy();
        localStorage.removeItem('auth.config.credz');
    });
});

class AuthorizationConfigStub2 {
    logout() {
        return of(() => {});
    }
    getToken() {
        return null;
    }
    removeTokenData() {
        return {};
    }
}

describe('SilLogoutComponent 2', () => {
    let component: SilLogoutComponent;
    let fixture: ComponentFixture<SilLogoutComponent>;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SilLogoutComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [mockPipe('translate')],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub2 },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SilLogoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should navigate if token is null', () => {
        localStorage.removeItem('auth.config.credz');
        spyOn(component, 'logoutUser');
        component.ngOnInit();
        expect(component.logoutUser).toHaveBeenCalled();
    });

    it('should navigate to login state on logout error', () => {
        // Set up a token so the logout() call is made
        const authService = TestBed.inject(Authorization);
        spyOn(authService, 'getToken').and.returnValue({ token: 'test-token' });

        // Mock logout to return an error
        const logoutError = new Error('Logout failed');
        spyOn(authService, 'logout').and.returnValue(
            throwError(() => logoutError)
        );

        // Spy on console.error to verify it's called
        spyOn(console, 'error');

        // Spy on $state.go to verify navigation
        const stateService = TestBed.inject(StateService);
        spyOn(stateService, 'go');

        // Call logoutUser
        component.logoutUser();

        // Verify console.error was called with the error
        expect(console.error).toHaveBeenCalledWith(
            'Logout error:',
            logoutError
        );

        // Verify navigation to login state
        expect(stateService.go).toHaveBeenCalledWith('auth.login');
    });
});

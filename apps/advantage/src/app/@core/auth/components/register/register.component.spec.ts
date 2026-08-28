import { SkikaRegisterComponent } from './register.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    Pipe,
    PipeTransform,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { NbAuthService, NbTokenService, NbTokenStorage } from '@nebular/auth';
import { of } from 'rxjs';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { Router } from '@angular/router';
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

class NbTokenStorageStub {
    get() {
        return {};
    }
}

class NbAuthServiceStub {
    register() {
        return of({
            getResponse() {},
            isSuccess() {
                return true;
            },
        });
    }
}

describe('SkikaRegisterComponent', () => {
    let component: SkikaRegisterComponent;
    let fixture: ComponentFixture<SkikaRegisterComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaRegisterComponent],

            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('translate'),
                RouterTestingModule.withRoutes([
                    { path: 'auth/verify', component: SkikaRegisterComponent },
                ]),
            ],
            providers: [
                NbTokenService,
                { provide: NB_AUTH_OPTIONS, useValue: NB_AUTH_OPTIONS },
                { provide: NbAuthService, useClass: NbAuthServiceStub },
                { provide: NbTokenStorage, useClass: NbTokenStorageStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaRegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        spyOn(component, 'register');
        component.receiveModel('Me');
        expect(component.register).toHaveBeenCalled();
        expect(component).toBeTruthy();
    });
    it('should test register method', () => {
        component.register();
        expect(component.register).toBeTruthy();
    });
    it('should test goToLogin method', () => {
        const router = TestBed.inject(Router);
        spyOn(router, 'navigateByUrl');
        component.goToLogin('auth/verify');
        expect(component.goToLogin).toBeTruthy();
    });
    it('should test goToVerify method', () => {
        component.goToVerify('auth/verify');
        expect(component.goToVerify).toBeTruthy();
    });
});

class NbAuthServiceStub2 {
    register() {
        return of({
            getResponse: () => ['error'],
            isSuccess: () => false,
            getErrors: () => ['Error', 'Denied'],
        });
    }
}

describe('SkikaRegisterComponent', () => {
    let component: SkikaRegisterComponent;
    let fixture: ComponentFixture<SkikaRegisterComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SkikaRegisterComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('translate'),
                RouterTestingModule.withRoutes([
                    { path: 'auth/verify', component: SkikaRegisterComponent },
                ]),
            ],
            providers: [
                NbTokenService,
                { provide: NB_AUTH_OPTIONS, useValue: NB_AUTH_OPTIONS },
                { provide: NbAuthService, useClass: NbAuthServiceStub2 },
                { provide: NbTokenStorage, useClass: NbTokenStorageStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkikaRegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should test register method', () => {
        component.register();
        expect(component.register).toBeTruthy();
    });
});

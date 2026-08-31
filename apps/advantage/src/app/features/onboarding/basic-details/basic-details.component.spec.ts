import { TestBed, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService } from '@uirouter/core';
import { NbToastrService } from '@nebular/theme';
import { BasicDetailsComponent } from './basic-details.component';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class AuthorizationConfigStub {
    logout() {
        return of(() => {});
    }
    getToken() {
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

describe('BasicDetailsComponent', () => {
    let component: BasicDetailsComponent;
    let fixture: ComponentFixture<BasicDetailsComponent>;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            schemas: [
                // NO_ERRORS_SCHEMA,
                CUSTOM_ELEMENTS_SCHEMA,
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {
                        path: '/basic-details',
                        component: BasicDetailsComponent,
                    },
                ]),
            ],
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
        fixture = TestBed.createComponent(BasicDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        component.ngOnInit();
        expect(BasicDetailsComponent).toBeTruthy();
    });
});

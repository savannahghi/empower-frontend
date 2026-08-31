import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    SimpleChange,
} from '@angular/core';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService } from '@uirouter/core';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { OnboardingBusinessDetailsComponent } from './business-details.component';
import { CommonModule } from '@angular/common';
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

describe('OnboardingBusinessDetailsComponent', () => {
    let component: OnboardingBusinessDetailsComponent;
    let fixture: ComponentFixture<OnboardingBusinessDetailsComponent>;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            declarations: [OnboardingBusinessDetailsComponent],
            imports: [CommonModule],
            providers: [
                CommonModule,
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OnboardingBusinessDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        component.ngOnInit();
        component.ngOnChanges({
            providerData: undefined,
        });
        component.ngOnChanges({
            providerData: new SimpleChange(
                { provider_kyc_docs: {}, business_owners: {} },
                {},
                false
            ),
        });
        expect(OnboardingBusinessDetailsComponent).toBeTruthy();
    });
    it('should toggleModal', () => {
        component.toggleModal('form');

        expect(component).toBeTruthy();
    });
});

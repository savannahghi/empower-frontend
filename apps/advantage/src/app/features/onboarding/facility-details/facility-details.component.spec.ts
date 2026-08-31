import { TestBed, ComponentFixture } from '@angular/core/testing';
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
import { FacilityOnboardingDetailsComponent } from './facility-details.component';
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

describe('FacilityOnboardingDetailsComponent', () => {
    let component: FacilityOnboardingDetailsComponent;
    let fixture: ComponentFixture<FacilityOnboardingDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            declarations: [FacilityOnboardingDetailsComponent],
            imports: [CommonModule],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FacilityOnboardingDetailsComponent);
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
                { questions: {}, question_answers: {}, facility_photos: {} },
                {},
                false
            ),
        });
        expect(FacilityOnboardingDetailsComponent).toBeTruthy();
    });
    it('should toggleModal', () => {
        component.toggleModal('form');

        expect(component).toBeTruthy();
    });
});

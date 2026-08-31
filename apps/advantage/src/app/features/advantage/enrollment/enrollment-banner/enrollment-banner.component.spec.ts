import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { BehaviorSubject, of } from 'rxjs';
import { EnrollmentBannerComponent } from './enrollment-banner.component';

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
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    setUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getWorkstation() {
        return {
            workstation: {
                workstation__name: 'Consultation',
            },
        };
    }
    getOrganisation() {
        return {
            bp_type: 'PROVIDER',
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

const uIRouterGlobalsStub = {
    params: {
        id: '112',
    },
};

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
    includes() {
        return true;
    }
}

describe('EnrollmentBannerComponent', () => {
    let component: EnrollmentBannerComponent;
    let fixture: ComponentFixture<EnrollmentBannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EnrollmentBannerComponent],
            imports: [
                mockPipe('age'),
                mockPipe('phoneNumberPipe'),
                mockPipe('translate'),
                mockPipe('healthIdFormatter'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EnrollmentBannerComponent);
        component = fixture.componentInstance;

        component.patientObservable = new BehaviorSubject({
            id: '123',
            patient_id: 'P-001',
            person: {
                first_name: 'Jane',
                other_names: 'A.',
                last_name: 'Doe',
                gender: 'FEMALE',
                age: 30,
                date_of_birth: '1994-01-01',
                phone_number: '1234567890',
                email: 'jane.doe@example.com',
            },
        });

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

describe('EnrollmentBannerComponent with error', () => {
    let component: EnrollmentBannerComponent;
    let fixture: ComponentFixture<EnrollmentBannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EnrollmentBannerComponent],
            imports: [
                mockPipe('age'),
                mockPipe('phoneNumberPipe'),
                mockPipe('translate'),
                mockPipe('healthIdFormatter'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EnrollmentBannerComponent);
        component = fixture.componentInstance;

        component.patientObservable = new BehaviorSubject({
            id: '123',
            patient_id: 'P-001',
            person: {
                first_name: 'Jane',
                other_names: 'A.',
                last_name: 'Doe',
                gender: 'FEMALE',
                age: 30,
                date_of_birth: '1994-01-01',
                phone_number: '1234567890',
                email: 'jane.doe@example.com',
            },
        });

        fixture.detectChanges();
    });

    it('should test handleErrorFxn method', () => {
        spyOn(component, 'handleErrorFxn').and.callThrough();
        component.handleErrorFxn({});
        expect(component.handleErrorFxn).toHaveBeenCalled();
    });
});

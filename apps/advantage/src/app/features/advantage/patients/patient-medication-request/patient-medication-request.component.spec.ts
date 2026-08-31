import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { PatientMedicationRequestComponent } from './patient-medication-request.component';
import { BehaviorSubject, of } from 'rxjs';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

const response = {
    id: '9f82f11f-89eb-42c3-8f52-adb059be88e6',
    medication_name: 'Amoxicillin',
    status: 'ACTIVE',
    dosage: [
        {
            id: 'fbdd934b-196f-48b4-a50c-227b1ccf2015',
            created_by_name: 'Empower Admin',
            updated_by_name: 'Empower Admin',
            active: true,
            route: null,
            dose_quantity: 1,
            dose_unit: 'Capsules',
            period: '1',
            period_unit: 'wk',
            frequency: 1,
            duration: '2',
            duration_unit: 'mo',
            start_date: '2024-11-20',
            end_date: '2025-01-20',
            condition: 'After meals',
            patient_instruction: 'Kindly avoid alcohol',
            additional_instruction: null,
            prescription: '9f82f11f-89eb-42c3-8f52-adb059be88e6',
        },
    ],
    patient: 'f48b387a-d0f7-4a02-9d68-be7dc8ee816f',
    service_request: '25860b81-b39e-409e-b102-26c6bfe3f6eb',
};

class SilStoresServiceStub {
    get() {
        return of({
            ...response,
        });
    }
}
class SilStoresServiceStubError {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
        data: {
            useThisParamInstead: 'id',
        },
    },
    params() {
        return { request_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { request_id: 1 };
        },
    },
};

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    getToken() {
        return {
            access_token: 'token',
        };
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    getWorkstation() {
        return {
            workstation__name: 'Breast Cancer Screening',
        };
    }
}

class StateServiceStub {
    reload() {
        return true;
    }
}

class AuthenticationServiceStub {
    checkPermission() {
        return true;
    }
}
describe('PatientMedicationRequestComponent', () => {
    let component: PatientMedicationRequestComponent;
    let fixture: ComponentFixture<PatientMedicationRequestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientMedicationRequestComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: SilStoresService,
                    useCLass: SilStoresServiceStub,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientMedicationRequestComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should test the getMedicationRequest function', () => {
        spyOn(component, 'getMedicationRequest').and.callThrough();
        component.getMedicationRequest();
        expect(component.getMedicationRequest).toHaveBeenCalled();
    });

    it('should test the resolveResponseResolver function', () => {
        spyOn(component, 'resolveResponseResolver').and.callThrough();
        component.resolveResponseResolver(response);
        expect(component.resolveResponseResolver).toHaveBeenCalled();
    });
});

describe('PatientMedicationRequestComponent fails', () => {
    let component: PatientMedicationRequestComponent;
    let fixture: ComponentFixture<PatientMedicationRequestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientMedicationRequestComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [],
            providers: [
                ErrorHandlerService,
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: SilStoresService,
                    useCLass: SilStoresServiceStubError,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientMedicationRequestComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should test the getMedicationRequest function', () => {
        spyOn(component, 'getMedicationRequest').and.callThrough();
        component.getMedicationRequest();
        expect(component.getMedicationRequest).toHaveBeenCalled();
    });

    it('should test the errorResponseResolver function', () => {
        spyOn(component, 'errorResponseResolver').and.callThrough();
        component.errorResponseResolver({});
        expect(component.errorResponseResolver).toHaveBeenCalled();
    });
});

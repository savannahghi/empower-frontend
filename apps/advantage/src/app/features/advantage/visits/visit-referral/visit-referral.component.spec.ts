import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReferralComponent } from './visit-referral.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { of, throwError } from 'rxjs';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import {
    NbDatepickerModule,
    NbStatusService,
    NbThemeModule,
    NbToastrService,
} from '@nebular/theme';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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
    getUserClinicalIds() {
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

class NbStatusServiceStub {
    isCustomStatus() {}
}
class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
}

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
const uIRouterGlobalsStub = {
    params: {
        id: 'someId',
        cancer_type: 'breast',
        patientId: '2359',
    },
};

class SilStoreServiceStub {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(endpoint: string, id: string, data: any) {
        return of({
            data: {
                endScreening: true,
            },
        });
    }
    create() {
        return of({});
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transitionTo() {
        return true;
    }
    reload() {
        return true;
    }
}

describe('VisitReferralComponent', () => {
    let component: VisitReferralComponent;
    let fixture: ComponentFixture<VisitReferralComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('titleCase'),
                NbThemeModule.forRoot(),
                CommonModule,
                VisitReferralComponent,
                NbDatepickerModule.forRoot(),
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoreServiceStub,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(VisitReferralComponent);

        component = fixture.componentInstance;
        component.cancerType = 'cervical';

        component.encounterId = '753fb778-5ed4-406a-8a08-3e69952a4356';
        component.patientId = '2914-1491-0910-1485';
        spyOn(console, 'error').and.callFake(() => {});

        fixture.detectChanges();
    });

    it('should test handleReturnDateChange method', () => {
        component.returnDate = undefined;
        spyOn(component, 'handleReturnDateChange').and.callThrough();
        component.handleReturnDateChange({});
        expect(component.handleReturnDateChange).toHaveBeenCalledWith({});
    });

    it('should test viewReport method', () => {
        spyOn(component, 'viewReport').and.callThrough();
        component.viewReport();
        expect(component.viewReport).toHaveBeenCalled();
    });

    it('should test the viewReport function if isChild is set to true', () => {
        component.isChild = true;
        spyOn(component, 'viewReport').and.callThrough();
        spyOn(component, 'cancelFxn').and.callThrough();

        component.viewReport();
        expect(component.viewReport).toHaveBeenCalled();
        expect(component.cancelFxn).toHaveBeenCalled();
    });

    it('should test the redirectToHome function', () => {
        spyOn(component, 'redirectToHome').and.callThrough();
        component.redirectToHome({
            cancer_type: 'breast',
            patient_id: '8913',
            encounter_id: '123',
        });
        expect(component.redirectToHome).toHaveBeenCalled();
    });
    it('should test redirectToHome method', () => {
        spyOn(component, 'redirectToHome').and.callThrough();
        component.redirectToHome({
            cancer_type: 'breast',
            encounter_id: '123',
        });
        expect(component.redirectToHome).toHaveBeenCalled();
    });

    it('should test the redirectToHome function when encounter_id is missing', () => {
        spyOn(component, 'redirectToHome').and.callThrough();
        component.redirectToHome({
            cancer_type: 'breast',
            patient_id: '8913',
        });
        expect(component.redirectToHome).toHaveBeenCalled();
    });

    it('should test emitSetReferral method', () => {
        const data = {
            referralType: 'specialist',
            servicerequestId: '9814',
        };
        spyOn(component, 'emitSetReferral').and.callThrough();
        component.emitSetReferral(data);
        expect(component.emitSetReferral).toHaveBeenCalledWith(data);
    });

    it('should test scheduleFollowUp function if returnDate is defined', () => {
        spyOn(component, 'scheduleFollowUp').and.callThrough();
        component.returnDate = '2024-09-15';
        component.referralType = 'diagnosis_referral';
        component.workstation = {
            workstation: '9ecc89da-7977-406f-a682-6115a283442a',
            workstation__name: 'Cervical Cancer Screening',
            workstation__org_unit__name: 'Mombasa Empower Main Dept.',
            workstation__org_unit: 'c8b85542-c837-4cd9-9296-5341fec044b6',
            workstation__org_unit__parent__name: 'Mombasa (Main) Branch Clinic',
            workstation__org_unit__parent:
                'f2f03610-0319-4f59-b374-0cdf051cbbd0',
            workstation__org_unit__parent__parent__name: 'Main Cluster',
            workstation__org_unit__parent__parent:
                '9ffae8cc-1b13-4c63-89af-66a1fe2b9e5d',
        };

        component.scheduleFollowUp();
        expect(component.scheduleFollowUp).toHaveBeenCalled();
    });

    it('should test scheduleFollowUp function if returnDate is defined but referralType is undefined', () => {
        spyOn(component, 'scheduleFollowUp').and.callThrough();
        component.returnDate = '2024-09-15';

        component.workstation = {
            workstation: '9ecc89da-7977-406f-a682-6115a283442a',
            workstation__name: 'Cervical Cancer Screening',
            workstation__org_unit__name: 'Mombasa Empower Main Dept.',
            workstation__org_unit: 'c8b85542-c837-4cd9-9296-5341fec044b6',
            workstation__org_unit__parent__name: 'Mombasa (Main) Branch Clinic',
            workstation__org_unit__parent:
                'f2f03610-0319-4f59-b374-0cdf051cbbd0',
            workstation__org_unit__parent__parent__name: 'Main Cluster',
            workstation__org_unit__parent__parent:
                '9ffae8cc-1b13-4c63-89af-66a1fe2b9e5d',
        };

        component.scheduleFollowUp();
        expect(component.scheduleFollowUp).toHaveBeenCalled();
    });

    it('should test scheduleFollowUp function if returnDate is undefined', () => {
        spyOn(component, 'scheduleFollowUp').and.callThrough();

        component.scheduleFollowUp();
        expect(component.scheduleFollowUp).toHaveBeenCalled();
    });

    it('should handle successful mutation response', () => {
        const mockResponse = {
            data: { scheduleAppointment: true },
            errors: null,
        };

        const responseFunctionSpy = jasmine.createSpy('responseFunction');

        const nextCallback = response => {
            if (response?.errors?.length > 0) {
                component.showToastError(
                    'bottom-right',
                    'danger',
                    'Error',
                    response?.errors[0]?.message ?? 'Error message'
                );
                component.loading = false;
                return;
            }
            responseFunctionSpy(response);
        };

        nextCallback(mockResponse);

        expect(responseFunctionSpy).toHaveBeenCalledWith(mockResponse);
    });

    it('should use fallback error message when error has no message', () => {
        spyOn(component, 'showToastError');

        const errorResponse = {
            data: null,
            errors: [{ code: 'ERROR_CODE' }],
        };

        const errorMsg = 'Fallback error message';

        const nextCallback = response => {
            if (response?.errors?.length > 0) {
                component.showToastError(
                    'bottom-right',
                    'danger',
                    'Error',
                    response?.errors[0]?.message ?? errorMsg
                );
                component.loading = false;
                return;
            }
        };

        nextCallback(errorResponse);

        expect(component.showToastError).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Error',
            errorMsg
        );
        expect(component.loading).toBeFalse();
    });

    it('should show error toast with message from error', () => {
        const mockErrorResponse = {
            error: {
                message: 'No schedules available',
            },
        };
        spyOn(component, 'showToastError');
        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => mockErrorResponse)
        );

        component.scheduleFollowUp();

        expect(component.loading).toBeFalse();
        expect(component.showToastError).toHaveBeenCalled();
    });

    it('should show error toast with alternative message when error response has no message', () => {
        spyOn(component, 'showToastError');
        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => new Error())
        );

        component.scheduleFollowUp();

        expect(component.loading).toBeFalse();
        expect(component.showToastError).toHaveBeenCalled();
    });

    it('should test the showToastError function', () => {
        spyOn(component['toastService'], 'show');

        component.showToastError('bottom-right', 200, 'Success', 'clinical');

        expect(component['toastService'].show).toHaveBeenCalled();
    });
});

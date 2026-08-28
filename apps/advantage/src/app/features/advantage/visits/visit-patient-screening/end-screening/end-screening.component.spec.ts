import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    flush,
    tick,
} from '@angular/core/testing';

import { EndScreeningComponent } from './end-screening.component';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import {
    NbThemeModule,
    NbToastrService,
    NbGlobalPhysicalPosition,
} from '@nebular/theme';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { CommonModule } from '@angular/common';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

function asyncOf<T>(value: T) {
    return of(value).pipe(delay(10));
}

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

class SilStoresServiceStub {
    update() {
        return of({
            results: {
                endScreening: true,
            },
        });
    }
}

class SilStoresServiceErrorStub {
    update() {
        return throwError(() => new Error('Network error'));
    }
}

class ErrorHandlerServiceStub {
    handleError() {
        return {};
    }
}

const uIRouterGlobalsStub = {
    params: {
        id: 'someId',
    },
};

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
}

describe('EndScreeningComponent', () => {
    let component: EndScreeningComponent;
    let fixture: ComponentFixture<EndScreeningComponent>;
    let silStoresService: SilStoresService;
    let errorHandlerService: ErrorHandlerService;
    let stateService: StateService;
    let toastrService: NbToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NbThemeModule.forRoot(),
                CommonModule,
                EndScreeningComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
            ],
        });
        fixture = TestBed.createComponent(EndScreeningComponent);
        component = fixture.componentInstance;
        silStoresService = TestBed.inject(SilStoresService);
        errorHandlerService = TestBed.inject(ErrorHandlerService);
        stateService = TestBed.inject(StateService);
        toastrService = TestBed.inject(NbToastrService);

        component.cancerType = 'cervical';
        component.activateStep = 'specialist_referral';
        component.encounterID = '753fb778-5ed4-406a-8a08-3e69952a4356';
        component.patientID = '2914-1491-0910-1485';

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize workstation and erpOrgData on ngOnInit', () => {
        component.ngOnInit();
        expect(component.workstation).toBeDefined();
        expect(component.erpOrgData).toBeDefined();
    });

    it('should call endScreening and handle successful response', fakeAsync(() => {
        spyOn(silStoresService, 'update').and.returnValue(
            of({
                results: {
                    endScreening: true,
                },
            })
        );
        spyOn(component, 'showToast');
        spyOn(stateService, 'transitionTo');

        component.endScreening();
        tick(100);

        expect(silStoresService.update).toHaveBeenCalledWith(
            'end-screening',
            component.encounterID,
            { encounterID: component.encounterID },
            null,
            true
        );
        expect(component.loading).toBeFalse();
        expect(component.showToast).toHaveBeenCalled();
        expect(stateService.transitionTo).toHaveBeenCalled();
        flush();
    }));

    it('should handle API response with errors', fakeAsync(() => {
        const errorResponse = {
            errors: [{ message: 'Test error', code: 'TEST_ERROR' }],
        };

        spyOn(silStoresService, 'update').and.returnValue(of(errorResponse));
        spyOn(errorHandlerService, 'handleError');

        component.endScreening();
        tick(100);

        expect(errorHandlerService.handleError).toHaveBeenCalledWith(
            errorResponse.errors[0],
            component,
            'clinical'
        );
        expect(component.loading).toBeFalse();
        flush();
    }));

    it('should handle network errors', fakeAsync(() => {
        const networkError = new Error('Network error');

        spyOn(silStoresService, 'update').and.returnValue(
            throwError(() => networkError)
        );
        spyOn(component, 'errorHandlerFxn');

        component.endScreening();
        tick(100);

        expect(component.errorHandlerFxn).toHaveBeenCalledWith(networkError);
        flush();
    }));

    it('should handle timeout errors', () => {
        const timeoutError = new Error('Timeout has occurred');

        spyOn(component, 'errorHandlerFxn');
        component.errorHandlerFxn(timeoutError);

        expect(component.errorHandlerFxn).toHaveBeenCalledWith(timeoutError);
    });

    it('should test appointmentResponseFunction with successful response', () => {
        spyOn(component, 'showToast');
        spyOn(stateService, 'transitionTo');

        const successResponse = {
            results: {
                endScreening: true,
            },
        };

        component.appointmentResponseFunction(successResponse);

        expect(component.showToast).toHaveBeenCalled();
        expect(stateService.transitionTo).toHaveBeenCalledWith(
            `app.advantage.visits.detail.screening.${component.cancerType}_cancer`,
            {
                id: uIRouterGlobalsStub.params.id,
                encounter_id: component.encounterID,
                step: 0,
            },
            { reload: true }
        );
    });

    it('should test appointmentResponseFunction with return date', () => {
        component.returnDate = '2024-09-15';
        spyOn(component, 'showToast');
        spyOn(stateService, 'transitionTo');

        const successResponse = {
            results: {
                endScreening: true,
            },
        };

        component.appointmentResponseFunction(successResponse);

        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Successful',
            'Appointment created, screening has ended'
        );
    });

    it('should test appointmentResponseFunction with errors', () => {
        spyOn(errorHandlerService, 'handleError');

        const errorResponse = {
            errors: [{ message: 'Test error' }],
        };

        component.appointmentResponseFunction(errorResponse);

        expect(component.loading).toBeFalse();
    });

    it('should test errorHandlerFxn', () => {
        spyOn(errorHandlerService, 'handleError');
        const testError = new Error('Test error');

        component.errorHandlerFxn(testError);

        expect(component.loading).toBeFalse();
        expect(errorHandlerService.handleError).toHaveBeenCalledWith(
            testError,
            component,
            'clinical'
        );
    });

    it('should test showToast method', () => {
        spyOn(toastrService, 'show');

        component.showToast(
            NbGlobalPhysicalPosition.BOTTOM_RIGHT,
            'success',
            'Test message',
            'Test'
        );

        expect(toastrService.show).toHaveBeenCalledWith(
            'Test successfully',
            'Test message',
            {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'success',
                duration: 7000,
            }
        );
    });

    it('should test showToastError method', () => {
        spyOn(toastrService, 'show');
        component.showToastError(
            NbGlobalPhysicalPosition.BOTTOM_RIGHT,
            'error',
            'Error message',
            'Error'
        );

        expect(toastrService.show).toHaveBeenCalledWith(
            'Error',
            'Error message',
            {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'error',
                duration: 7000,
            }
        );
    });

    it('should set loading to true when endScreening starts', fakeAsync(() => {
        spyOn(silStoresService, 'update').and.returnValue(
            asyncOf({ results: true })
        );

        expect(component.loading).toBeFalsy();

        component.endScreening();
        expect(component.loading).toBeTrue();

        tick(100);
        flush();
    }));

    it('should handle endScreening without returnDate', () => {
        component.returnDate = undefined;
        spyOn(component, 'showToast');
        spyOn(stateService, 'transitionTo');

        const successResponse = {
            results: {
                endScreening: true,
            },
        };

        component.appointmentResponseFunction(successResponse);

        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Successful',
            'Screening has ended'
        );
    });

    it('should handle boolean true response', () => {
        spyOn(component, 'showToast');
        spyOn(stateService, 'transitionTo');

        component.appointmentResponseFunction(true);

        expect(component.loading).toBeFalse();
    });

    it('should handle response with returnDate set', () => {
        component.returnDate = '2023-07-30';
        spyOn(component, 'showToast');
        spyOn(component.$state, 'transitionTo');

        const response = { results: { endScreening: true } };
        component.appointmentResponseFunction(response);

        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Successful',
            'Appointment created, screening has ended'
        );
    });

    it('should handle response with returnDate not set', () => {
        component.returnDate = undefined;
        spyOn(component, 'showToast');
        spyOn(component.$state, 'transitionTo');

        const response = { results: { endScreening: true } };
        component.appointmentResponseFunction(response);

        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Successful',
            'Screening has ended'
        );
    });
});

describe('EndScreeningComponent Error Scenarios', () => {
    let component: EndScreeningComponent;
    let fixture: ComponentFixture<EndScreeningComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NbThemeModule.forRoot(),
                CommonModule,
                EndScreeningComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceErrorStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
            ],
        });

        fixture = TestBed.createComponent(EndScreeningComponent);
        component = fixture.componentInstance;

        component.cancerType = 'cervical';
        component.activateStep = 'specialist_referral';
        component.encounterID = '753fb778-5ed4-406a-8a08-3e69952a4356';
        component.patientID = '2914-1491-0910-1485';

        fixture.detectChanges();
    });

    it('should handle service errors', fakeAsync(() => {
        spyOn(component, 'errorHandlerFxn').and.callThrough();

        component.endScreening();
        tick(100);

        expect(component.errorHandlerFxn).toHaveBeenCalled();
        expect(component.loading).toBeFalse();

        flush();
    }));

    it('should handle response without data or errors', () => {
        const emptyResponse = {};

        component.appointmentResponseFunction(emptyResponse);

        expect(component.loading).toBeFalse();
    });
});

import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { VisitTestProstateComponent } from './visit-test-prostate.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsService } from '../../../../../@core/utils';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import {
    NbStatusService,
    NbThemeModule,
    NbToastrService,
} from '@nebular/theme';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthenticationService } from '../../../../../@core/auth/services/authentication.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
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
class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class SilStoreServiceStub {
    create() {
        return of({
            data: 1,
        });
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

class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
}

const uIRouterGlobalsStub = {
    params: {
        id: 'someId',
        cancer_type: 'breast',
        patientId: '2359',
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
    reload() {
        return true;
    }
}
class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

class NbStatusServiceStub {
    isCustomStatus() {}
}

describe('VisitTestProstateComponent', () => {
    let component: VisitTestProstateComponent;
    let fixture: ComponentFixture<VisitTestProstateComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('titleCase'),
                NbThemeModule.forRoot(),
                CommonModule,
                VisitTestProstateComponent,
            ],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
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
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        localStorage.setItem(
            'auth.config.clinicalIds',
            JSON.stringify({
                clinical_facility_id: '2348923403',
                clinical_org_id: '2348923403',
            })
        );

        fixture = TestBed.createComponent(VisitTestProstateComponent);
        component = fixture.componentInstance;
        component.cancerType = 'breast';

        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should test requestNextStep function', () => {
        spyOn(component, 'requestNextStep').and.callThrough();

        component.requestNextStep();
        expect(component.requestNextStep).toHaveBeenCalled();
    });

    it('should test handleDateChange function', () => {
        spyOn(component, 'handleDateChange').and.callThrough();

        component.handleDateChange('2024-11-03');
        expect(component.handleDateChange).toHaveBeenCalled();
    });

    it('should test getContactInformation method', () => {
        const contacts = [
            {
                contact_type: 'PHONE_NUMBER',
                role: 'PRIMARY_CONTACT',
                contact_value: '+254897663222',
            },
            {
                contact_type: 'EMAIL',
                role: 'SECONDARY_CONTACT',
                contact_value: 'oncokise@mailinator.com',
            },
        ];
        spyOn(component, 'findContactByType').and.callThrough();

        component.findContactByType(contacts, 'phone_number');
        expect(component.findContactByType).toHaveBeenCalledWith(
            contacts,
            'phone_number'
        );
    });

    it('should test requestPreviousStep function', () => {
        spyOn(component, 'requestPreviousStep').and.callThrough();

        component.requestPreviousStep();
        expect(component.requestPreviousStep).toHaveBeenCalled();
    });

    it('should test the updateTaskStatus function', () => {
        spyOn(component, 'updateTaskStatus').and.callThrough();
        component.updateTaskStatus();
        expect(component.updateTaskStatus).toHaveBeenCalled();
    });

    it('should test detectModelChange function', () => {
        spyOn(component, 'detectModelChange').and.callThrough();
        const model = {};

        component.detectModelChange(model);
        expect(component.detectModelChange).toHaveBeenCalled();
    });

    it('should test the goToBack function', () => {
        spyOn(component, 'goToBack').and.callThrough();

        component.goToBack(false);
        expect(component.goToBack).toHaveBeenCalled();
    });

    it('should test the goToBack function if isChild is set to true and reloadState is false', () => {
        component.isChild = true;
        spyOn(component, 'goToBack').and.callThrough();
        spyOn(component, 'cancelFxn').and.callThrough();

        component.goToBack(false);
        expect(component.goToBack).toHaveBeenCalled();
        expect(component.cancelFxn).toHaveBeenCalled();
    });

    it('should test the goToBack function if isChild is set to true and reloadState is true', () => {
        component.isChild = true;
        spyOn(component, 'goToBack').and.callThrough();
        spyOn(component, 'cancelFxn').and.callThrough();

        component.goToBack(true);
        expect(component.goToBack).toHaveBeenCalled();
        expect(component.cancelFxn).not.toHaveBeenCalled();
    });

    it('should test getModelData function and show positive', () => {
        spyOn(component, 'getModelData').and.callThrough();
        const model = {
            selected_result: 'Positive',
            selected_test: 'VIA',
            screening_type: 'First Time',
        };
        component.getModelData(model);
        expect(component.getModelData).toHaveBeenCalled();
    });

    it('should test getModelData function and show positive for MRI', () => {
        spyOn(component, 'getModelData').and.callThrough();
        const model = {
            selected_result: 'BIRADS 3',
            selected_test: 'MRI',
            screening_type: 'First Time',
        };

        component.getModelData(model);
        expect(component.getModelData).toHaveBeenCalled();
    });

    it('should test getModelData function and show Suspicious for cancer', () => {
        spyOn(component, 'getModelData').and.callThrough();
        const model = {
            selected_result: 'suspicious_for_cancer',
            selected_test: 'VIA',
            screening_type: 'First Time',
        };

        component.getModelData(model);
        expect(component.getModelData).toHaveBeenCalled();
    });

    it('should test getModelData function', () => {
        spyOn(component, 'getModelData').and.callThrough();
        const model = {
            selected_result: null,
            selected_test: null,
            screening_type: null,
        };

        component.getModelData(model);
        expect(component.getModelData).toHaveBeenCalled();
    });

    it('should handle response on handleReferral', () => {
        component.encounterId = '123';
        component.savingResult = true;
        component.isFormFilled = true;
        component.formData = {
            test_action: 'test_referral',
            selected_test: 'HPV',
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };

        spyOn(component.dataLayer, 'create').and.returnValue(of({ id: '123' }));
        spyOn(component, 'showToast');
        component.recordResults();

        expect(component.savingResult).toBeFalse();
        expect(component.servicerequestId).toBe('123');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test recordResults function', () => {
        spyOn(component, 'recordResults').and.callThrough();

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults function when form is filled', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.formData = {
            selected_test: 'Prostate Specific Antigen - Serum',
            selected_result: 'raised_psa_levels',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults for Prostate Specific Antigen - Serum', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.formData = {
            selected_test: 'Prostate Specific Antigen - Serum',
            selected_result: 'raised_psa_levels',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults for Whole Blood', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.formData = {
            selected_test: 'Prostate Specific Antigen - Whole Blood',
            selected_result: 'raised_psa_levels',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults when test is undefined', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.formData = {
            selected_test: '',
            selected_result: 'Positive',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults function when form is filled and referral is made', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.formData = {
            test_action: 'test_referral',
            additional_notes: 'Patient needs a diagnosis referral',
            selected_test: 'VIA',
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults function when additional_notes is undefined', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.formData = {
            test_action: 'test_referral',
            selected_test: 'VIA',
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });
});

describe('VisitTestProstateComponent with an error response', () => {
    let component: VisitTestProstateComponent;
    let fixture: ComponentFixture<VisitTestProstateComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('titleCase'),
                NbThemeModule.forRoot(),
                CommonModule,
                VisitTestProstateComponent,
            ],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        localStorage.setItem(
            'auth.config.clinicalIds',
            JSON.stringify({
                clinical_facility_id: '2348923403',
                clinical_org_id: '2348923403',
            })
        );

        fixture = TestBed.createComponent(VisitTestProstateComponent);
        component = fixture.componentInstance;
        component.cancerType = 'breast';

        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should handle errors on handleReferral error', () => {
        component.encounterId = '123';
        component.savingResult = true;
        component.isFormFilled = true;
        component.formData = {
            test_action: 'test_referral',
            selected_test: 'HPV',
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };

        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => new Error('Boom'))
        );
        spyOn(component['errorHandler'], 'handleError');
        component.recordResults();

        expect(component.savingResult).toBeFalse();
        expect(component['errorHandler'].handleError).toHaveBeenCalled();
    });

    it('should test errorHandlerFxn function', () => {
        spyOn(component, 'errorHandlerFxn').and.callThrough();
        component.errorHandlerFxn(new Error('Boom'));
        expect(component.errorHandlerFxn).toHaveBeenCalled();
    });

    it('should test the handleApiError function', () => {
        component.savingResult = true;
        spyOn(component, 'showToastError').and.callThrough();
        const mockErrorResponse = {
            message: 'server error',
        };
        component.handleApiError(mockErrorResponse, 'referral');
        expect(component.savingResult).toBeFalse();
        expect(component.showToastError).toHaveBeenCalled();
    });

    it('should test handleRecordTest on dataLayer error', () => {
        component.formData = {
            selected_test: 'Prostate Specific Antigen - Serum',
            referral_notes: 'some notes',
            selected_result: 'positive',
        };
        component.isFormFilled = true;
        spyOn(component, 'handleApiError');
        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => new Error('Server errror'))
        );
        component.recordResults();
        expect(component.handleApiError).toHaveBeenCalled();
    });
});

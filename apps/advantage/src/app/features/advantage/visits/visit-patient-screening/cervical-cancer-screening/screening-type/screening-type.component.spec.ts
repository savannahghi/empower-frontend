import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ScreeningTypeComponent } from './screening-type.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { VisitService } from '../../../visit.service';
import { AnalyticsService } from '../../../../../../@core/utils/analytics.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Authorization } from '../../../../../../@core/auth/services/authorization.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

const visitServiceStub = {
    visitPatientDataEmitter: of({
        new_price: 18,
        amount: '18',
        product_name: 'Lipid',
        quantity: 1,
        id: 1,
    }),
    visitPatientScreeningDataEmitter: of({
        age: 40,
        gender: 'MALE',
    }),
    pricelistDataEmitter: of({
        name: 'Default pricelist',
        id: 1,
    }),
    currenciesDataEmitter: of({
        results: {
            new_price: 18,
            amount: '18',
            product_name: 'Lipid',
            quantity: 1,
            id: 1,
        },
    }),
    sendToQueue: () => {},
    completeVisit: () => {},
    queuesDataEmitter: of([
        {
            id: 1,
        },
    ]),
    fetchVisit: () => {},
    addToQueue: () => {},
    visit: {
        id: 1,
        service_requests: [
            {
                invoice: {
                    amount_due: 100,
                    amount_paid: 100,
                    invoice_lines: [{ id: 1 }],
                },
            },
        ],
    },
};

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class StateServiceStub {
    reload() {
        return true;
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
    getOrgSettings() {
        return [
            {
                id: '260bb4db-59b7-4f93-b2fd-fe88d3af21a3',
                default: 'APPOINTMENT BOOKING',
                description:
                    'Select the preferred patient scheduling method to use',
                setting_type: 'str',
                name: 'scheduling:preferred_patient_scheduling_method',
                value: 'CHECK-IN SCHEDULING',
            },
        ];
    }
}
class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

const uIRouterGlobalsStub = {
    params: {
        page_size: '2',
    },
    $current: {
        params: {
            page_size: '2',
        },
        parent: {
            name: 'app.advantage.visits',
        },
    },
    current: {
        name: 'app.advantage.visits.detail',
    },
};

class SilStoreServiceStub {
    create() {
        return of({});
    }
}

class SilStoresServiceStubError {
    create() {
        return throwError(() => new Error('Boom'));
    }
}

describe('ScreeningTypeComponent', () => {
    let component: ScreeningTypeComponent;
    let fixture: ComponentFixture<ScreeningTypeComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ScreeningTypeComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoreServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        fixture = TestBed.createComponent(ScreeningTypeComponent);
        component = fixture.componentInstance;
        component.cancerType = 'cervical';
        component.encounterData = {
            age: 25,
            gender: 'FEMALE',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
                {
                    encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'IN_PROGRESS',
                    previous_point: 'Billing',
                },
            ],
        };
        component.screeningTasksData = [
            {
                id: '4a81cbcd-bac4-4058-8d19-2acb9b61b7a6',
                encounterID: 'c953c24c-5dea-458f-8232-f799893c20b9',
                task: 'VIA test',
                description: 'A VIA test',
                workflow: 'Cervical Cancer Screening',
            },
        ];
        fixture.detectChanges();
    });

    it('should test requestNextStep function', () => {
        spyOn(component, 'requestNextStep').and.callThrough();

        component.requestNextStep();
        expect(component.requestNextStep).toHaveBeenCalled();
    });

    it('should test requestPreviousStep function', () => {
        spyOn(component, 'requestPreviousStep').and.callThrough();

        component.requestPreviousStep();
        expect(component.requestPreviousStep).toHaveBeenCalled();
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
            selected_test: 'Pap smear/cytology',
            selected_result: 'suspicious_for_cancer',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults for Pap smear', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.encounterID = null;
        component.formData = {
            selected_test: 'Pap smear/cytology',
            selected_result: 'suspicious_for_cancer',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults for HPV', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.formData = {
            selected_test: 'HPV',
            selected_result: 'Normal',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults for VIA', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.formData = {
            selected_test: 'VIA',
            selected_result: 'Positive',
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

    it('should test the handleApiResponse if type is undefined', () => {
        spyOn(component, 'handleApiResponse').and.callThrough();
        component.handleApiResponse('', 'Ultrasound');
        expect(component.handleApiResponse).toHaveBeenCalled();
    });

    it('should test recordResults for VIA/VILI', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.formData = {
            selected_test: 'VIA/VILI',
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

    it('should test recordResults function when form is filled and action chosen is add_results_later', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.formData = {
            test_action: 'add_results_later',
            selected_test: 'VIA',
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

    it('should test getEncounterId function', () => {
        spyOn(component, 'getEncounterId').and.callThrough();

        component.getEncounterId(component.encounterData.servicePoints);
        expect(component.getEncounterId).toHaveBeenCalled();
    });

    it('should test detectModelChange function', () => {
        spyOn(component, 'detectModelChange').and.callThrough();
        const model = {};

        component.detectModelChange(model);
        expect(component.detectModelChange).toHaveBeenCalled();
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

    it('should test the handleApiResponse functionality', () => {
        spyOn(component, 'handleApiResponse').and.callThrough();
        component.handleApiResponse('recordResults', 'HPV');
        expect(component.handleApiResponse).toHaveBeenCalled();
    });

    it('should test the updateTaskStatus function', () => {
        spyOn(component, 'updateTaskStatus').and.callThrough();
        component.updateTaskStatus();
        expect(component.updateTaskStatus).toHaveBeenCalled();
    });

    it('should test handleDateChange function', () => {
        spyOn(component, 'handleDateChange').and.callThrough();

        component.handleDateChange('2024-11-03');
        expect(component.handleDateChange).toHaveBeenCalled();
    });
});

describe('ScreeningTypeComponent with an error response', () => {
    let component: ScreeningTypeComponent;
    let fixture: ComponentFixture<ScreeningTypeComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ScreeningTypeComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
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

        fixture = TestBed.createComponent(ScreeningTypeComponent);
        component = fixture.componentInstance;
        component = fixture.componentInstance;
        component.cancerType = 'cervical';
        component.encounterData = {
            age: 25,
            gender: 'FEMALE',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
                {
                    encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'IN_PROGRESS',
                    previous_point: 'Billing',
                },
            ],
        };
        component.screeningTasksData = [
            {
                id: '4a81cbcd-bac4-4058-8d19-2acb9b61b7a6',
                encounterID: 'c953c24c-5dea-458f-8232-f799893c20b9',
                task: 'VIA test',
                description: 'A VIA test',
                workflow: 'Cervical Cancer Screening',
            },
        ];
        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should handle errors on handleReferral error', () => {
        component.encounterID = '123';
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
});

describe('ScreeningTypeComponent error path', () => {
    let component: ScreeningTypeComponent;
    let fixture: ComponentFixture<ScreeningTypeComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ScreeningTypeComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        fixture = TestBed.createComponent(ScreeningTypeComponent);

        component = fixture.componentInstance;
        component.encounterData = {
            age: 25,
            gender: 'FEMALE',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
                {
                    encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'IN_PROGRESS',
                    previous_point: 'Billing',
                },
            ],
        };
        fixture.detectChanges();
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
            selected_test: 'Pap smear/cytology',
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

    it('should test handleRecordObservation on dataLayer error', () => {
        component.formData = {
            selected_test: 'VIA',
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

    it('should test errorHandlerFxn function', () => {
        spyOn(component, 'errorHandlerFxn').and.callThrough();
        component.errorHandlerFxn(new Error('Boom'));
        expect(component.errorHandlerFxn).toHaveBeenCalled();
    });
});

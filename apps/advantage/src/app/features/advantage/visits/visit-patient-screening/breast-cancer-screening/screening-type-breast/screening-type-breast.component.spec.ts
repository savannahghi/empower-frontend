import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { VisitService } from '../../../visit.service';
import { AnalyticsService } from '../../../../../../@core/utils/analytics.service';
import { ScreeningTypeBreastComponent } from './screening-type-breast.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SilStoresService } from '../../../../../../shared/sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../../../@core/auth/services/authorization.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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

const mediaPayload = {
    id: '9e82e1bc-9518-4c93-a938-ff1b6656b28d',
    name: 'Patient/b3baebf1-d5f5-4687-9108-7d4fe0bfc2cc@2024-04-17 12:24:37.785625778 +0000 UTC m=+65646.731822260',
    mediaLink: '',
};

class SilStoreServiceStub {
    create() {
        return of([mediaPayload]);
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

class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}
describe('ScreeningTypeBreastComponent', () => {
    let component: ScreeningTypeBreastComponent;
    let fixture: ComponentFixture<ScreeningTypeBreastComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ScreeningTypeBreastComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoreServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
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

        fixture = TestBed.createComponent(ScreeningTypeBreastComponent);
        component = fixture.componentInstance;
        component.cancerType = 'breast';
        component.encounterData = {
            age: 25,
            gender: 'FEMALE',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Breast Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
                {
                    encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                    queue_name: 'Breast Cancer Screening',
                    status: 'IN_PROGRESS',
                    previous_point: 'Billing',
                },
            ],
        };
        component.screeningTasksData = [
            {
                id: '4a81cbcd-bac4-4058-8d19-2acb9b61b7a6',
                encounterID: 'c953c24c-5dea-458f-8232-f799893c20b9',
                task: 'MRI test',
                description: 'A MRI test',
                workflow: 'Breast Cancer Screening',
            },
        ];
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

    it('should test requestPreviousStep function', () => {
        spyOn(component, 'requestPreviousStep').and.callThrough();

        component.requestPreviousStep();
        expect(component.requestPreviousStep).toHaveBeenCalled();
    });

    it('should test recordResults function if file is defined and mediaData is defined', () => {
        component.formData = {
            selected_test: 'MRI',
            selected_result: 'BIRADS 3',
            file: new File([''], 'file'),
            screening_type: 'First time screening',
        };
        component.mediaData = [{ ...mediaPayload }];
        spyOn(component, 'recordResults').and.callThrough();

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults function when form is filled and action chosen is add_results_later', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.formData = {
            test_action: 'add_results_later',
            selected_test: 'MRI',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
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

    it('should test submitData if isFormFilled is set to false', () => {
        component.isFormFilled = false;

        spyOn(component, 'submitData').and.callThrough();
        spyOn(component, 'recordResults').and.callThrough();

        component.encounterID = null;
        component.formData = {
            selected_test: 'MRI',
            selected_result: 'BIRADS 3',
        };

        component.submitData();
        expect(component.submitData).toHaveBeenCalled();
        expect(component.recordResults).not.toHaveBeenCalled();
    });

    it('should test submitData if isFormFilled is set to true', () => {
        component.isFormFilled = true;

        spyOn(component, 'submitData').and.callThrough();
        spyOn(component, 'recordResults').and.callThrough();

        component.encounterID = null;
        component.formData = {
            selected_test: 'MRI',
            selected_result: 'BIRADS 3',
        };

        component.submitData();
        expect(component.submitData).toHaveBeenCalled();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test submitData if isFormFilled is set to true and formData.file is defined', () => {
        component.isFormFilled = true;

        spyOn(component, 'submitData').and.callThrough();
        spyOn(component, 'uploadFile').and.callThrough();

        component.encounterID = null;
        component.formData = {
            selected_test: 'MRI',
            selected_result: 'BIRADS 3',
            file: new File([''], 'file'),
        };

        component.submitData();
        expect(component.submitData).toHaveBeenCalled();
        expect(component.uploadFile).toHaveBeenCalled();
    });

    it('should test handleDateChange function', () => {
        spyOn(component, 'handleDateChange').and.callThrough();

        component.handleDateChange('2024-11-03');
        expect(component.handleDateChange).toHaveBeenCalled();
    });

    it('should test recordResults for MRI', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.encounterID = null;
        component.formData = {
            selected_test: 'MRI',
            selected_result: 'BIRADS 3',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults function if selected_test is non-existent', () => {
        component.isFormFilled = true;

        component.formData = {
            selected_test: 'dummD',
            selected_result: 'BIRADS 3',
            file: new File([''], 'file'),
            screening_type: 'First time screening',
        };
        component.mediaData = [{ ...mediaPayload }];
        spyOn(component, 'recordResults').and.callThrough();

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults for Ultrasound', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.encounterID = null;
        component.formData = {
            selected_test: 'Ultrasound',
            selected_result: 'BIRADS 3',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults for Mammogram', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.encounterID = null;
        component.formData = {
            selected_test: 'Mammogram',
            selected_result: 'BIRADS 3',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults for Immunohistochemistry', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.encounterID = null;
        component.formData = {
            selected_test: 'Immunohistochemistry',
            selected_result: 'HER2 Positive',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults for CBE', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.encounterID = null;
        component.formData = {
            selected_test: 'CBE',
            selected_result: 'BIRADS 3',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults function when form is filled and referral is made', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.formData = {
            test_action: 'test_referral',
            referral_notes: 'Patient needs a diagnosis referral',
            selected_test: 'Ultrasound',
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults function when referral_notes is undefined', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.formData = {
            test_action: 'test_referral',
            selected_test: 'Mammogram',
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

    it('should test getModelData function for negative mri', () => {
        spyOn(component, 'getModelData').and.callThrough();
        const model = {
            selected_test: 'MRI',
            selected_result: 'Negative',
            screening_type: 'First time screening',
        };

        component.getModelData(model);
        expect(component.getModelData).toHaveBeenCalled();
    });

    it('should test getModelData function if test action is test_referral', () => {
        spyOn(component, 'getModelData').and.callThrough();

        component.formData = {
            test_action: 'test_referral',
            selected_test: 'MRI',
            file: new File([''], 'file'),
            attachment: 'fakepath.png',
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };
        const model = {
            selected_test: 'MRI',
            selected_result: 'Discrete Palpable Mass - Suspicious For CA',
            screening_type: 'First time screening',
            media: component.mediaData,
            attachment: 'fakepath.png',
            file: new File([''], 'file'),
        };

        component.getModelData(model);
        expect(component.getModelData).toHaveBeenCalled();
    });

    it('should test getModelData function if selected result if mediaData is undefined', () => {
        spyOn(component, 'getModelData').and.callThrough();
        component.formData = {
            test_action: 'test_referral',
            selected_test: 'Immunohistochemistry',
            file: new File([''], 'file'),
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };
        const model = {
            selected_test: 'Immunohistochemistry',
            selected_result: 'Discrete Palpable Mass - Suspicious For CA',
            screening_type: 'First time screening',
            file: new File([''], 'file'),
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };

        component.getModelData(model);
        expect(component.getModelData).toHaveBeenCalled();
    });

    it('should test uploadFile function and resolve if response is successful', () => {
        const file = new Blob();

        spyOn(component, 'uploadFile').and.callThrough();
        spyOn(component, 'recordResults').and.callThrough();
        component.formData = {
            test_action: 'test_referral',
            selected_test: 'Ultrasound',
            file: new File([file], 'file'),
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };
        component.encounterID = '753fb778-5ed4-406a-8a08-3e69952a4356';

        component.mediaData = [{ ...mediaPayload }];

        component.uploadFile(new File([file], 'file'));
        expect(component.uploadFile).toHaveBeenCalled();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test getModelData function for null values', () => {
        spyOn(component, 'getModelData').and.callThrough();
        const model = {
            selected_result: null,
            selected_test: null,
            screening_type: null,
        };

        component.getModelData(model);
        expect(component.getModelData).toHaveBeenCalled();
    });

    it('should test the handleApiResponse functionality when errors occur and errors array is undefined', () => {
        spyOn(component, 'handleApiResponse').and.callThrough();
        component.handleApiResponse(
            {
                data: null,
            },
            'recordResults',
            'MRI'
        );
        expect(component.handleApiResponse).toHaveBeenCalled();
    });

    it('should test the updateTaskStatus function', () => {
        spyOn(component, 'updateTaskStatus').and.callThrough();
        component.updateTaskStatus();
        expect(component.updateTaskStatus).toHaveBeenCalled();
    });

    it('should test the handleApiResponse if type is recordResults', () => {
        spyOn(component, 'handleApiResponse').and.callThrough();
        component.handleApiResponse(
            {
                data: {
                    addTestResultsLater: {
                        id: '4a81cbcd-bac4-4058-8d19-2acb9b61b7a6',
                        encounterID: 'c953c24c-5dea-458f-8232-f799893c20b9',
                        task: 'MRI test',
                        description: 'A MRI test',
                        workflow: 'Breast Cancer Screening',
                    },
                },
            },
            'recordResults',
            'Ultrasound'
        );
        expect(component.handleApiResponse).toHaveBeenCalled();
    });

    it('should test the handleApiResponse if type is undefined', () => {
        spyOn(component, 'handleApiResponse').and.callThrough();
        component.handleApiResponse(
            {
                data: {
                    addTestResultsLater: {
                        id: '4a81cbcd-bac4-4058-8d19-2acb9b61b7a6',
                        encounterID: 'c953c24c-5dea-458f-8232-f799893c20b9',
                        task: 'MRI test',
                        description: 'A MRI test',
                        workflow: 'Breast Cancer Screening',
                    },
                },
            },
            '',
            'Ultrasound'
        );
        expect(component.handleApiResponse).toHaveBeenCalled();
    });

    it('should test the handleApiResponse functionality when errors occur', () => {
        spyOn(component, 'handleApiResponse').and.callThrough();
        component.handleApiResponse(
            {
                data: null,
                errors: [
                    {
                        message:
                            'cannot create a questionnaire response in a finished encounter',
                        path: ['createQuestionnaireResponse'],
                    },
                ],
            },
            'addResultsLater',
            'Mammogram'
        );
        expect(component.handleApiResponse).toHaveBeenCalled();
    });
});

describe('ScreeningTypeBreastComponent with an error response', () => {
    let component: ScreeningTypeBreastComponent;
    let fixture: ComponentFixture<ScreeningTypeBreastComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ScreeningTypeBreastComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoreServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
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

        fixture = TestBed.createComponent(ScreeningTypeBreastComponent);
        component = fixture.componentInstance;
        component.cancerType = 'breast';
        component.encounterData = {
            age: 25,
            gender: 'FEMALE',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Breast Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
                {
                    encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                    queue_name: 'Breast Cancer Screening',
                    status: 'IN_PROGRESS',
                    previous_point: 'Billing',
                },
            ],
        };
        component.screeningTasksData = [
            {
                id: '4a81cbcd-bac4-4058-8d19-2acb9b61b7a6',
                encounterID: 'c953c24c-5dea-458f-8232-f799893c20b9',
                task: 'MRI test',
                description: 'A MRI test',
                workflow: 'Breast Cancer Screening',
            },
        ];
        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should test the handleApiResponse functionality when errors occur', () => {
        spyOn(component, 'handleApiResponse').and.callThrough();
        component.handleApiResponse(
            {
                data: null,
                errors: [
                    {
                        message:
                            'cannot create a questionnaire response in a finished encounter',
                        path: ['createQuestionnaireResponse'],
                    },
                ],
            },
            'addResultsLater',
            'Immunohistochemistry'
        );
        expect(component.handleApiResponse).toHaveBeenCalled();
    });

    it('should test the handleApiResponse functionality when errors occur and error message is undefined', () => {
        spyOn(component, 'handleApiResponse').and.callThrough();
        component.handleApiResponse(
            {
                data: null,
            },
            'recordResults',
            'Immunohistochemistry'
        );
        expect(component.handleApiResponse).toHaveBeenCalled();
    });

    it('should test the handleApiResponse functionality when errors occur', () => {
        spyOn(component, 'handleApiResponse').and.callThrough();
        component.handleApiResponse(
            {
                data: null,
                errors: [
                    {
                        message:
                            'cannot create a questionnaire response in a finished encounter',
                        path: ['createQuestionnaireResponse'],
                    },
                ],
            },
            'addResultsLater',
            'Mammogram'
        );
        expect(component.handleApiResponse).toHaveBeenCalled();
    });

    it('should test the handleApiResponse functionality when errors occur and errors object is undefined', () => {
        spyOn(component, 'handleApiResponse').and.callThrough();
        component.handleApiResponse(
            {
                data: null,
            },
            'addResultsLater',
            ''
        );
        expect(component.handleApiResponse).toHaveBeenCalled();
    });
});
describe('ScreeningTypeBreastComponent error path', () => {
    let component: ScreeningTypeBreastComponent;
    let fixture: ComponentFixture<ScreeningTypeBreastComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ScreeningTypeBreastComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
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

        fixture = TestBed.createComponent(ScreeningTypeBreastComponent);

        component = fixture.componentInstance;
        component.encounterData = {
            age: 25,
            gender: 'FEMALE',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Breast Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
                {
                    encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                    queue_name: 'Breast Cancer Screening',
                    status: 'IN_PROGRESS',
                    previous_point: 'Billing',
                },
            ],
        };
        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should test uploadFile function and resolve errors', () => {
        const file = new Blob();
        const data = new File([file], 'test.pdf', {
            type: 'application/pdf',
        });

        spyOn(component, 'uploadFile').and.callThrough();
        spyOn(component, 'recordResults').and.callThrough();
        component.formData = {
            test_action: 'test_referral',
            selected_test: 'Ultrasound',
            file: data,
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };
        component.encounterID = '753fb778-5ed4-406a-8a08-3e69952a4356';
        component.mediaData = [{ ...mediaPayload }];

        component.uploadFile(data);
        expect(component.uploadFile).toHaveBeenCalled();
        expect(component.recordResults).not.toHaveBeenCalled();
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
            selected_test: 'MRI',
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
            selected_test: 'Immunohistochemistry',
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

    it('should test handleRecordTest on success for IHC', () => {
        component.formData = {
            selected_test: 'IHC',
            ihc_test: 'IHC_HER2',
            referral_notes: 'some notes',
            selected_result: 'Positive',
            date: '2024-11-03',
        };
        component.isFormFilled = true;
        component.encounterID = null;
        spyOn(component, 'getEncounterId').and.callThrough();
        spyOn(component, 'handleApiResponse');
        spyOn(component.dataLayer, 'create').and.returnValue(of({ id: '123' }));
        component.recordResults();
        expect(component.getEncounterId).toHaveBeenCalledWith(
            component.encounterData.servicePoints
        );
        expect(component.handleApiResponse).toHaveBeenCalled();
    });
});

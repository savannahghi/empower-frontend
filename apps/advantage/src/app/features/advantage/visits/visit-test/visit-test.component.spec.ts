import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsService } from '../../../../@core/utils';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import {
    NbStatusService,
    NbThemeModule,
    NbToastrService,
} from '@nebular/theme';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { VisitTestComponent } from './visit-test.component';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class NbToastrServiceStub {
    show() {
        return of(() => {});
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

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class AuthenticationServiceStub {
    checkPermission() {
        return false;
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

    getWorkstation() {
        return {
            workstation__name: 'Breast Cancer Screening',
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
}

const mediaPayload = {
    id: '9e82e1bc-9518-4c93-a938-ff1b6656b28d',
    name: 'Patient/b3baebf1-d5f5-4687-9108-7d4fe0bfc2cc@2024-04-17 12:24:37.785625778 +0000 UTC m=+65646.731822260',
    mediaLink: '',
};

const uIRouterGlobalsStub = {
    params: {
        id: 'someId',
        cancer_type: 'breast',
        patient_id: '2359',
    },
    current: {
        name: 'state',
    },
};

const uIRouterGlobalsStub2 = {
    params: {
        id: 'someId',
        cancer_type: 'breast',
        encounter_id: '2359',
    },
    current: {
        name: 'state',
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

class SilStoreServiceStub {
    create() {
        return of([mediaPayload]);
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

describe('VisitTestComponent', () => {
    let component: VisitTestComponent;
    let fixture: ComponentFixture<VisitTestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('titleCase'),
                NbThemeModule.forRoot(),
                CommonModule,
                VisitTestComponent,
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

        fixture = TestBed.createComponent(VisitTestComponent);
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

        component.goToBack(true);
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

    it('should test cancelFxn function', () => {
        spyOn(component, 'cancelFxn').and.callThrough();
        component.cancelFxn();
        expect(component.cancelFxn).toHaveBeenCalled();
    });

    it('should test the redirectToHome function', () => {
        spyOn(component, 'redirectToHome').and.callThrough();
        component.redirectToHome();
        expect(component.redirectToHome).toHaveBeenCalled();
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

    it('should test submitData if isFormFilled is set to false', () => {
        component.isFormFilled = false;

        spyOn(component, 'submitData').and.callThrough();
        spyOn(component, 'recordResults').and.callThrough();

        component.encounterId = null as any;
        component.formData = {
            selected_test: 'MRI',
            selected_result: 'BIRADS 3',
        };

        component.submitData();
        expect(component.submitData).toHaveBeenCalled();
    });

    it('should test submitData if isFormFilled is set to true', () => {
        component.isFormFilled = true;

        spyOn(component, 'submitData').and.callThrough();
        spyOn(component, 'recordResults').and.callThrough();

        component.encounterId = null as any;
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

        component.encounterId = null as any;
        component.formData = {
            selected_test: 'MRI',
            selected_result: 'BIRADS 3',
            file: new File([''], 'file'),
        };

        component.submitData();
        expect(component.submitData).toHaveBeenCalled();
        expect(component.uploadFile).toHaveBeenCalled();
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

    it('should test recordResults for MRI', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.encounterId = null as any;
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
        component.encounterId = null as any;
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
        component.encounterId = null as any;
        component.formData = {
            selected_test: 'Mammogram',
            selected_result: 'BIRADS 3',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults for Biopsy', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.encounterId = null as any;
        component.formData = {
            selected_test: 'Biopsy',
            selected_result: 'Focal Pain Or Tenderness',
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults for Immunohistochemistry', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.isFormFilled = true;
        component.encounterId = null as any;
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
        component.encounterId = null as any;
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

    it('should test the handleApiResponse if type is referral', () => {
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
            'referral',
            'Ultrasound'
        );
        expect(component.handleApiResponse).toHaveBeenCalled();
    });

    it('should test the handleApiResponse if type is referral and response is null', () => {
        spyOn(component, 'handleApiResponse').and.callThrough();
        component.handleApiResponse(null, 'referral', 'Ultrasound');
        expect(component.handleApiResponse).toHaveBeenCalled();
        expect(component.servicerequestId).toBeUndefined();
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

    it('should handle response on handleRecordTest', () => {
        component.formData = {
            selected_test: 'MRI',
            findings: 'positive',
        };
        spyOn(component.dataLayer, 'create').and.returnValue(
            of({ id: '123', test: 'MRI' })
        );
        spyOn(component, 'handleApiResponse');
        component.recordResults();

        expect(component.handleApiResponse).toHaveBeenCalled();
    });

    it('should handle response on handleRecordObservation', () => {
        component.formData = {
            selected_test: 'Immunohistochemistry',
            findings: 'positive',
        };
        spyOn(component.dataLayer, 'create').and.returnValue(
            of({ id: '123', test: 'MRI' })
        );
        spyOn(component, 'handleApiResponse');
        component.recordResults();

        expect(component.handleApiResponse).toHaveBeenCalled();
    });

    it('should handle response on handleRecordTest for IHC', () => {
        component.formData = {
            selected_test: 'IHC',
            ihc_test: 'IHC_HER2',
            selected_result: 'Positive',
            date: '2024-11-03',
        };
        spyOn(component.dataLayer, 'create').and.returnValue(
            of({ id: '123', test: 'IHC' })
        );
        spyOn(component, 'handleApiResponse');
        component.recordResults();

        expect(component.handleApiResponse).toHaveBeenCalled();
    });

    it('should include ihc_test as the referral test when selected_test is IHC', () => {
        component.formData = {
            test_action: 'test_referral',
            selected_test: 'IHC',
            ihc_test: 'IHC_HER2',
            facility: {
                tenant_id: 'test-id',
                organisation_name: 'Test Facility',
                contacts: [
                    {
                        contact_type: 'phone_number',
                        contact_value: '0700100808',
                    },
                ],
            },
        };

        const createSpy = spyOn(component.dataLayer, 'create').and.returnValue(
            of({ id: '123' })
        );

        component.recordResults();

        const calledArgs = createSpy.calls.first().args;
        const calledPayload: any = calledArgs[1];

        expect(calledPayload.tests).toEqual(['IHC_HER2']);
    });

    it('should exclude tests field from referral when selected_test is null', () => {
        component.formData = {
            test_action: 'test_referral',
            selected_test: null,
            facility: {
                tenant_id: 'test-id',
                organisation_name: 'Test Facility',
                contacts: [
                    {
                        contact_type: 'phone_number',
                        contact_value: '0700100808',
                    },
                ],
            },
        };

        const createSpy = spyOn(component.dataLayer, 'create').and.returnValue(
            of({ id: '123' })
        );

        component.recordResults();

        const calledArgs = createSpy.calls.first().args;
        const calledPayload = calledArgs[1];

        expect('tests' in calledPayload).toBeFalse();
    });

    it('should include tests field in referral when selected_test has value', () => {
        component.formData = {
            test_action: 'test_referral',
            selected_test: 'MRI',
            facility: {
                tenant_id: 'test-id',
                organisation_name: 'Test Facility',
                contacts: [
                    {
                        contact_type: 'phone_number',
                        contact_value: '0700100808',
                    },
                ],
            },
        };

        const createSpy = spyOn(component.dataLayer, 'create').and.returnValue(
            of({ id: '123' })
        );

        component.recordResults();

        const calledArgs = createSpy.calls.first().args;
        const calledPayload: any = calledArgs[1];

        expect(calledPayload.tests).toEqual(['MRI']);
    });
});

describe('VisitTestComponent with an error response', () => {
    let component: VisitTestComponent;
    let fixture: ComponentFixture<VisitTestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('titleCase'),
                NbThemeModule.forRoot(),
                CommonModule,
                VisitTestComponent,
            ],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
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

        fixture = TestBed.createComponent(VisitTestComponent);
        component = fixture.componentInstance;
        component.resolvedCancerType = 'breast';

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
        component.encounterId = '753fb778-5ed4-406a-8a08-3e69952a4356';
        component.mediaData = [{ ...mediaPayload }];

        component.uploadFile(data);
        expect(component.uploadFile).toHaveBeenCalled();

        expect(component.recordResults).not.toHaveBeenCalled();
    });

    it('should test the handleResponse functionality', () => {
        spyOn(component, 'handleResponse').and.callThrough();
        component.handleResponse([mediaPayload]);

        expect(component.handleResponse).toHaveBeenCalled();
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
        spyOn(component, 'handleApiError');
        component.recordResults();

        expect(component.savingResult).toBeFalse();
        expect(component.handleApiError).toHaveBeenCalled();
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
});

describe('VisitTestComponent - edge cases ', () => {
    let component: VisitTestComponent;
    let fixture: ComponentFixture<VisitTestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('titleCase'),
                NbThemeModule.forRoot(),
                CommonModule,
                VisitTestComponent,
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

        fixture = TestBed.createComponent(VisitTestComponent);
        component = fixture.componentInstance;
        component.cancerType = 'breast';

        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    describe('clearMediaAndFormState', () => {
        it('should clear mediaData array', () => {
            component.mediaData = [
                {
                    id: '123',
                    name: 'test.pdf',
                    mediaLink: 'http://example.com',
                },
            ];
            component.uploadingFile = true;
            component.formData = { test: 'data' };

            component.clearMediaAndFormState();

            expect(component.mediaData).toEqual([]);
            expect(component.mediaData.length).toBe(0);
        });

        it('should reset uploadingFile to false', () => {
            component.uploadingFile = true;

            component.clearMediaAndFormState();

            expect(component.uploadingFile).toBe(false);
        });

        it('should reset formData to empty object', () => {
            component.formData = {
                selected_test: 'MRI',
                selected_result: 'BIRADS 3',
            };

            component.clearMediaAndFormState();

            expect(component.formData).toEqual({});
        });

        it('should clear all state variables at once', () => {
            component.mediaData = [
                { id: '1', name: 'file', mediaLink: 'link' },
            ];
            component.uploadingFile = true;
            component.formData = { some: 'data' };

            spyOn(component, 'clearMediaAndFormState').and.callThrough();

            component.clearMediaAndFormState();

            expect(component.clearMediaAndFormState).toHaveBeenCalled();
            expect(component.mediaData.length).toBe(0);
            expect(component.uploadingFile).toBe(false);
            expect(Object.keys(component.formData).length).toBe(0);
        });
    });

    describe('getModelData - Media Clearing Logic', () => {
        it('should clear mediaData when file is not present and mediaData has items', () => {
            component.mediaData = [
                { id: '123', name: 'test.pdf', mediaLink: 'link' },
            ];
            const model = {
                selected_test: 'MRI',
                selected_result: 'BIRADS 3',
            };

            component.getModelData(model);

            expect(component.mediaData).toEqual([]);
        });

        it('should not clear mediaData when file is present', () => {
            const existingMedia = [
                { id: '123', name: 'test.pdf', mediaLink: 'link' },
            ];
            component.mediaData = [...existingMedia];
            const model = {
                selected_test: 'MRI',
                selected_result: 'BIRADS 3',
                file: new File([''], 'newfile.pdf'),
            };

            component.getModelData(model);

            expect(component.mediaData).toEqual(existingMedia);
        });

        it('should not clear mediaData when mediaData is already empty', () => {
            component.mediaData = [];
            const model = {
                selected_test: 'MRI',
                selected_result: 'BIRADS 3',
            };

            component.getModelData(model);

            expect(component.mediaData).toEqual([]);
        });

        it('should set isAbnormal to false and clear media when appropriate', () => {
            component.mediaData = [
                { id: '1', name: 'file', mediaLink: 'link' },
            ];
            component.isAbnormal = true;
            const model = {
                selected_test: 'Biopsy',
                selected_result: 'Normal',
            };

            component.getModelData(model);

            expect(component.isAbnormal).toBe(false);
            expect(component.mediaData).toEqual([]);
        });
    });

    describe('handleApiResponse - with clearMediaAndFormState', () => {
        it('should call clearMediaAndFormState on successful referral', () => {
            spyOn(component, 'clearMediaAndFormState');
            spyOn(component, 'requestNextScreeningStep');
            spyOn(component, 'cancelFxn');
            spyOn(component, 'showToast');

            const response = { id: '123' };

            component.handleApiResponse(response, 'referral', 'MRI');

            expect(component.clearMediaAndFormState).toHaveBeenCalled();
        });

        it('should call clearMediaAndFormState on successful recordResults', () => {
            spyOn(component, 'clearMediaAndFormState');
            spyOn(component, 'requestNextScreeningStep');
            spyOn(component, 'cancelFxn');
            spyOn(component, 'showToast');

            const response = { data: 'success' };

            // Act
            component.handleApiResponse(
                response,
                'recordResults',
                'Ultrasound'
            );

            expect(component.clearMediaAndFormState).toHaveBeenCalled();
        });

        it('should reset savingResult and call clearMediaAndFormState', () => {
            component.savingResult = true;
            spyOn(component, 'clearMediaAndFormState');
            spyOn(component, 'requestNextScreeningStep');
            spyOn(component, 'cancelFxn');
            spyOn(component, 'showToast');

            component.handleApiResponse({}, 'recordResults', 'Biopsy');

            expect(component.savingResult).toBe(false);
            expect(component.clearMediaAndFormState).toHaveBeenCalled();
        });

        it('should call clearMediaAndFormState even for unknown action type', () => {
            spyOn(component, 'clearMediaAndFormState');
            spyOn(component, 'requestNextScreeningStep');
            spyOn(component, 'cancelFxn');
            spyOn(component, 'showToastError');

            component.handleApiResponse({}, 'unknownType', 'Test');

            expect(component.clearMediaAndFormState).toHaveBeenCalled();
            expect(component.showToastError).toHaveBeenCalled();
        });
    });

    describe('handleApiError - with clearMediaAndFormState', () => {
        it('should call clearMediaAndFormState on error', () => {
            spyOn(component, 'clearMediaAndFormState');
            spyOn(component, 'showToastError');
            const error = { message: 'Test error' };

            component.handleApiError(error, 'referral');

            expect(component.clearMediaAndFormState).toHaveBeenCalled();
        });

        it('should reset savingResult and uploadingFile on error', () => {
            component.savingResult = true;
            component.uploadingFile = true;
            spyOn(component, 'clearMediaAndFormState');
            spyOn(component, 'showToastError');

            component.handleApiError({ message: 'error' }, 'recordResults');

            expect(component.savingResult).toBe(false);
            expect(component.uploadingFile).toBe(false);
            expect(component.clearMediaAndFormState).toHaveBeenCalled();
        });

        it('should display error message from error object', () => {
            spyOn(component, 'clearMediaAndFormState');
            spyOn(component, 'showToastError');
            const error = { message: 'Custom error message' };

            component.handleApiError(error, 'referral');

            expect(component.showToastError).toHaveBeenCalledWith(
                'bottom-right',
                'danger',
                'Failed',
                'Custom error message'
            );
            expect(component.clearMediaAndFormState).toHaveBeenCalled();
        });

        it('should display default error message when error.message is undefined', () => {
            spyOn(component, 'clearMediaAndFormState');
            spyOn(component, 'showToastError');
            const error = {};

            component.handleApiError(error, 'recordResults');

            expect(component.showToastError).toHaveBeenCalledWith(
                'bottom-right',
                'danger',
                'Failed',
                'Sorry, an error occurred. Please try again.'
            );
            expect(component.clearMediaAndFormState).toHaveBeenCalled();
        });

        it('should set loading to false when type is referral', () => {
            component.loading = true;
            spyOn(component, 'clearMediaAndFormState');
            spyOn(component, 'showToastError');

            component.handleApiError({ message: 'error' }, 'referral');

            expect(component.loading).toBe(false);
            expect(component.clearMediaAndFormState).toHaveBeenCalled();
        });
    });

    describe('recordResults - Conditional Media Inclusion', () => {
        it('should include media in payload when mediaData has items', () => {
            component.mediaData = [
                { id: '123', name: 'test.pdf', mediaLink: 'link' },
            ];
            component.formData = {
                selected_test: 'MRI',
                selected_result: 'BIRADS 3',
                usageContext: 'BREAST_CANCER_SCREENING',
                findings: 'BIRADS 3',
            };

            spyOn(component.dataLayer, 'create').and.returnValue(of({}));

            component.recordResults();

            expect(component.dataLayer.create).toHaveBeenCalledWith(
                'tests',
                jasmine.objectContaining({
                    media: jasmine.arrayContaining([
                        jasmine.objectContaining({
                            id: '123',
                            name: 'test.pdf',
                            mediaLink: 'link',
                        }),
                    ]),
                })
            );
        });

        it('should not include media in payload when mediaData is empty', () => {
            component.mediaData = [];
            component.formData = {
                selected_test: 'Ultrasound',
                selected_result: 'BIRADS 2',
            };

            spyOn(component.dataLayer, 'create').and.returnValue(of({}));

            component.recordResults();

            expect(component.dataLayer.create).toHaveBeenCalledWith(
                'tests',
                jasmine.objectContaining({
                    input: jasmine.any(Object),
                    testType: 'ULTRASOUND',
                })
            );
            const callArgs = (
                component.dataLayer.create as jasmine.Spy
            ).calls.mostRecent().args[1];
            expect(callArgs.media).toBeUndefined();
        });

        it('should only add media property when mediaData length is greater than 0', () => {
            component.mediaData = [
                { id: '1', name: 'file1', mediaLink: 'link1' },
                { id: '2', name: 'file2', mediaLink: 'link2' },
            ];
            component.formData = {
                selected_test: 'Mammogram',
                selected_result: 'BIRADS 4',
            };

            spyOn(component.dataLayer, 'create').and.returnValue(of({}));

            component.recordResults();

            const callArgs = (
                component.dataLayer.create as jasmine.Spy
            ).calls.mostRecent().args[1];
            expect(callArgs.media).toBeDefined();
            expect(callArgs.media.length).toBe(2);
        });
    });

    describe('Full Workflow - Media Clearing Integration', () => {
        it('should clear media after successful submission with file', () => {
            const file = new File(['content'], 'test.pdf', {
                type: 'application/pdf',
            });
            component.formData = {
                selected_test: 'MRI',
                selected_result: 'BIRADS 3',
                file: file,
            };
            component.mediaData = [];

            spyOn(component, 'uploadFile').and.callFake(() => {
                component.mediaData.push({
                    id: '123',
                    name: 'test.pdf',
                    mediaLink: 'link',
                });
                component.uploadingFile = false;
                component.savingResult = true;
                component.recordResults();
            });

            spyOn(component.dataLayer, 'create').and.returnValue(
                of({ id: '456' })
            );

            component.submitData();

            expect(component.uploadFile).toHaveBeenCalledWith(file);
            expect(component.mediaData.length).toBe(0);
            expect(component.formData).toEqual({});
        });

        it('should clear media after successful submission without file', () => {
            component.formData = {
                selected_test: 'Biopsy',
                selected_result: 'Normal',
            };
            component.mediaData = [
                { id: '123', name: 'old.pdf', mediaLink: 'oldlink' },
            ];

            spyOn(component.dataLayer, 'create').and.returnValue(
                of({ id: '789' })
            );

            component.submitData();

            expect(component.mediaData.length).toBe(0);
            expect(component.formData).toEqual({});
        });

        it('should clear media on getModelData when switching tests without new file', () => {
            component.mediaData = [
                { id: '123', name: 'old.pdf', mediaLink: 'link' },
            ];

            const firstModel = {
                selected_test: 'MRI',
                file: new File([''], 'test.pdf'),
            };

            component.getModelData(firstModel);
            expect(component.mediaData.length).toBe(1);

            const secondModel = {
                selected_test: 'Ultrasound',
            };
            component.getModelData(secondModel);

            expect(component.mediaData.length).toBe(0);
        });
    });
});

describe('VisitTestComponent with error response - clearMediaAndFormState', () => {
    let component: VisitTestComponent;
    let fixture: ComponentFixture<VisitTestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('titleCase'),
                NbThemeModule.forRoot(),
                CommonModule,
                VisitTestComponent,
            ],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
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

        fixture = TestBed.createComponent(VisitTestComponent);
        component = fixture.componentInstance;
        component.resolvedCancerType = 'breast';

        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should clear media data when upload file fails', () => {
        const file = new File(['content'], 'test.pdf', {
            type: 'application/pdf',
        });

        component.mediaData = [
            { id: '123', name: 'old.pdf', mediaLink: 'link' },
        ];

        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => ({
                status: 401,
                statusText: 'Unauthorized',
                message: 'Upload failed',
            }))
        );

        spyOn(component, 'showToastError');

        component.uploadFile(file);

        expect(component.uploadingFile).toBe(false);
        expect(component.mediaData.length).toBe(0);
        expect(component.showToastError).toHaveBeenCalled();
    });

    it('should call clearMediaAndFormState when recordResults fails', () => {
        component.mediaData = [
            { id: '123', name: 'test.pdf', mediaLink: 'link' },
        ];
        component.formData = {
            selected_test: 'MRI',
            selected_result: 'BIRADS 3',
        };

        spyOn(component, 'clearMediaAndFormState');
        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => new Error('API Error'))
        );

        component.recordResults();

        expect(component.clearMediaAndFormState).toHaveBeenCalled();
    });

    it('should clear state on referral error', () => {
        component.formData = {
            test_action: 'test_referral',
            selected_test: 'Ultrasound',
            facility: {
                tenant_id: '123',
                organisation_name: 'Test Facility',
                contacts: [{ contact_value: '0700123456' }],
            },
        };
        component.mediaData = [
            { id: '123', name: 'test.pdf', mediaLink: 'link' },
        ];

        spyOn(component, 'clearMediaAndFormState');
        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => new Error('API Error'))
        );

        component.recordResults();

        expect(component.clearMediaAndFormState).toHaveBeenCalled();
        expect(component.savingResult).toBe(false);
    });
});

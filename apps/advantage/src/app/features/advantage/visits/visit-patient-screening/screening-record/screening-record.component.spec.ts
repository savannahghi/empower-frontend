import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../../shared/cookies/cookie.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { VisitService } from '../../visit.service';
import { ScreeningRecordComponent } from './screening-record.component';
import { ScreeningService } from '../screening.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transition() {
        return true;
    }
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

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
        servicePoints: [
            {
                encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                queue_name: 'Breast Cancer Screening',
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

class SilStoreServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                    clinical_facility_id: 'sdsewerwjampisu9',
                    clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
                    appointment_status: 'BOOKED',
                    organisation_name: 'EMR/ERP Test Organisation',
                },
            ],
        });
    }
    create() {
        return of({});
    }
    update() {
        return of({
            id: '12',
        });
    }
    createNested() {
        return of({});
    }
    get() {
        return of({
            id: '123',
        });
    }
    getClinical() {
        return of({
            data: {
                consent: [
                    {
                        id: '19a605ab-4818-4b0f-9b25-bf2c614a7ece',
                        status: 'active',
                        decision: {
                            type: 'deny',
                        },
                        patient: {
                            id: 'a3f7fb11-a119-476e-8f05-c5e9359e5d63',
                            reference:
                                'Patient/a3f7fb11-a119-476e-8f05-c5e9359e5d63',
                            identifier: {},
                        },
                        usageContext: 'breast_screening',
                    },
                ],
            },
        });
    }
    getStore() {
        return {
            url: '/api/v1/diagnostic-report',
        };
    }
    getServer() {
        return {
            url: '/api/v1/diagnostic-report',
        };
    }
    processHeaders() {
        return {
            url: '/api/v1/diagnostic-report',
        };
    }
}

class SilStoresServiceStubError {
    getClinical() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    getStore() {
        return {
            url: '/api/v1/diagnostic-report',
        };
    }

    getServer() {
        return 'http://test-server.com';
    }

    processHeaders() {
        return {
            'Content-Type': 'application/json',
        };
    }
}

export class BaseScreeningServiceStub {
    toggleSection() {
        return true;
    }
    templateSettings: [
        {
            id: 'education';
            name: 'Education';
            display: 'Education';
            isHidden: false;
            selected: true;
        }
    ];
    getBadgeStyle() {
        return true;
    }
    convertString() {
        return true;
    }
    filterScreening() {
        return [
            { usageContext: 'breast_screening', id: 1 },
            { usageContext: 'cervical_screening', id: 2 },
        ];
    }
    setReportData() {
        return {
            consentPermitted: true,
            consentDenied: false,
        };
    }
    checkUnauthorizedAccess() {}
    setScreeningStates() {}
    updateScreeningTestResult() {}
    setSelectedScreeningTest() {}
    getResultOptionsForScreeningTest() {}
    getMatchingConsent() {}
    fetchReport() {}
    deleteTest() {}
}
class ScreeningServiceStub extends BaseScreeningServiceStub {
    getScreeningData() {
        return of({
            data: {
                getEncounterAssociatedResources: {
                    riskAssessment: {},
                    consent: {},
                    __typename: 'EncounterAssociatedResources',
                },
            },
        });
    }

    mutationBuilder() {
        return of({
            data: {
                recordConsent: {
                    status: 'active',
                },
            },
        });
    }

    deleteTest() {
        return of({ success: true });
    }
}

class ScreeningServiceStubError extends BaseScreeningServiceStub {
    getScreeningData() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    mutationBuilder() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    deleteTest() {
        return throwError(() => new Error('Delete test error'));
    }
}
class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getToken() {
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

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { appointment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

describe('ScreeningRecordComponent', () => {
    let component: ScreeningRecordComponent;
    let fixture: ComponentFixture<ScreeningRecordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ScreeningRecordComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: ScreeningService, useClass: ScreeningServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoreServiceStub },
                {
                    provide: ErrorHandlerService,
                    useValue: { handleError: jasmine.createSpy() },
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ScreeningRecordComponent);
        component = fixture.componentInstance;
        component.visit = {
            start: '12/12/2023',
            service_requests: [{ id: '2' }],
        };

        component.visitObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 50,
                        invoice_lines: [{}],
                    },
                    encounter_id: '7742',
                    queue: '82742',
                },
            ],
        });
        fixture.detectChanges();
    });

    it('should test component functions', () => {
        spyOn(component, 'toggleIsHidden').and.callThrough();
        spyOn(component, 'toggleDrawer').and.callThrough();
        spyOn(component, 'toggleModal').and.callThrough();

        spyOn(component, 'extractScreeningType').and.callThrough();

        component.toggleIsHidden('treatment');
        component.toggleDrawer('add-test-drawer');
        component.toggleModal('add-test-modal');

        component.extractScreeningType('screening.breast_cancer');

        expect(component).toBeTruthy();
        expect(component.toggleIsHidden).toHaveBeenCalled();

        expect(component.toggleDrawer).toHaveBeenCalled();
        expect(component.toggleModal).toHaveBeenCalled();
        expect(component.extractScreeningType).toHaveBeenCalled();
    });

    it('should test extractScreeningType function when string is not found', () => {
        spyOn(component, 'extractScreeningType').and.callThrough();
        component.extractScreeningType('fakestring');
        expect(component.extractScreeningType).toHaveBeenCalled();
    });

    it('should test the fetchReport function', () => {
        spyOn(component, 'fetchReport').and.callThrough();

        component.fetchReport();
        expect(component.fetchReport).toHaveBeenCalled();
    });

    it('should test getServicePointDetails function', () => {
        component.encounterID = 'ff8850da-090a-4f80-9aab-6bc581c472ea';
        const servicePoints = [
            {
                encounterID: 'ff8850da-090a-4f80-9aab-6bc581c472ea',
                queue_name: 'Cervical Cancer Screening',
                status: 'IN_PROGRESS',
                previous_point: null,
            },
        ];
        spyOn(component, 'getServicePointDetails').and.callThrough();
        component.getServicePointDetails(servicePoints);
        expect(component.getServicePointDetails).toHaveBeenCalled();
    });

    it('should test the getBadgeStyle function', () => {
        spyOn(component, 'getBadgeStyle').and.callThrough();
        component.getBadgeStyle('normal');
        expect(component.getBadgeStyle).toHaveBeenCalled();
    });

    it('should test hasMatchingConsent with matching consent data', () => {
        component.cancerType = 'breast';
        component.reportData = {
            consent: [
                { usageContext: 'breast_screening' },
                { usageContext: 'cervical_screening' },
            ],
        };

        const result = component.hasMatchingConsent();
        expect(result).toBeTruthy();
    });

    it('should return false in hasMatchingConsent when consent data is empty', () => {
        component.reportData = undefined;
        expect(component.hasMatchingConsent()).toBeFalse();

        component.reportData = { consent: null };
        expect(component.hasMatchingConsent()).toBeFalse();

        component.reportData = { consent: [] };
        expect(component.hasMatchingConsent()).toBeFalse();
    });

    it('should test getMatchingConsent method is being called', () => {
        spyOn(component, 'getMatchingConsent').and.callThrough();
        component.getMatchingConsent();
        expect(component.getMatchingConsent).toHaveBeenCalled();
    });

    it('should test checkStatus function', () => {
        spyOn(component, 'checkStatus').and.callThrough();

        component.checkStatus();
        expect(component.checkStatus).toHaveBeenCalled();
    });
    it('should test the responseFunction function', () => {
        spyOn(component, 'responseFunction').and.callThrough();
        const data = {
            consent: {
                id: '19a605ab-4818-4b0f-9b25-bf2c614a7ece',
                status: 'active',
                decision: {
                    type: 'deny',
                },
                patient: {
                    id: 'a3f7fb11-a119-476e-8f05-c5e9359e5d63',
                    reference: 'Patient/a3f7fb11-a119-476e-8f05-c5e9359e5d63',
                    identifier: {},
                },
            },
        };

        component.responseFunction(data);
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should test the responseFunction function if data is undefined', () => {
        spyOn(component, 'responseFunction').and.callThrough();
        const data = undefined;

        component.responseFunction(data);
        expect(component.responseFunction).toHaveBeenCalled();
    });
    it('should handle all scenarios in filterByScreeningType', () => {
        spyOn(component, 'filterByScreeningType').and.callThrough();

        component.cancerType = 'breast';
        const items = [
            { usageContext: 'breast_screening' },
            { usageContext: 'cervical_screening' },
            { usageContext: 'BREAST_test' },
            { someOtherProperty: 'value' },
            { usageContext: null },
            { usageContext: undefined },
            { usageContext: 'breast other words' },
        ];

        component.filterByScreeningType(items);

        expect(component.filterByScreeningType).toHaveBeenCalled();
    });

    it('should call the setSelectedTest method', () => {
        spyOn(component, 'setSelectedTest').and.callThrough();

        component.setSelectedTest('Mommogram');

        expect(component.setSelectedTest).toHaveBeenCalled();
    });

    it('should call the getResultOptionsForTest method and delegate to screeningService', () => {
        const test = {
            name: 'Mammogram',
            code: 'LA16046-7',
        };

        spyOn(
            component.screeningService,
            'getResultOptionsForScreeningTest'
        ).and.returnValue([{ title: 'Normal', value: 'Normal' }]);

        const result = component.getResultOptionsForTest(test);

        expect(
            component.screeningService.getResultOptionsForScreeningTest
        ).toHaveBeenCalledWith('Mammogram', 'LA16046-7');
        expect(result.length).toBeGreaterThan(0);
    });

    it('should handle null test in getResultOptionsForTest', () => {
        spyOn(
            component.screeningService,
            'getResultOptionsForScreeningTest'
        ).and.returnValue([]);

        const result = component.getResultOptionsForTest(null);

        expect(
            component.screeningService.getResultOptionsForScreeningTest
        ).toHaveBeenCalledWith(undefined, undefined);
        expect(result).toEqual([]);
    });

    it('should handle test with only name in getResultOptionsForTest', () => {
        const test = { name: 'Mammogram' };

        spyOn(
            component.screeningService,
            'getResultOptionsForScreeningTest'
        ).and.returnValue([{ title: 'Test', value: 'Test' }]);

        const result = component.getResultOptionsForTest(test);

        expect(
            component.screeningService.getResultOptionsForScreeningTest
        ).toHaveBeenCalledWith('Mammogram', undefined);
        expect(result.length).toBeGreaterThan(0);
    });

    it('should handle test with only code in getResultOptionsForTest', () => {
        const test = { code: 'LA16046-7' };

        spyOn(
            component.screeningService,
            'getResultOptionsForScreeningTest'
        ).and.returnValue([{ title: 'Test', value: 'Test' }]);

        const result = component.getResultOptionsForTest(test);

        expect(
            component.screeningService.getResultOptionsForScreeningTest
        ).toHaveBeenCalledWith(undefined, 'LA16046-7');
        expect(result.length).toBeGreaterThan(0);
    });

    it('should update previewResult on onResultChange', () => {
        const event = { value: 'Abnormal' };

        component.onResultChange(event);

        expect(component.previewResult).toBe('Abnormal');
    });

    it('should not update previewResult if event or value is missing', () => {
        component.previewResult = 'Initial';

        component.onResultChange(null);
        expect(component.previewResult).toBe('Initial');

        component.onResultChange({});
        expect(component.previewResult).toBe('Initial');
    });

    it('should call the updateTestResult method', () => {
        spyOn(component, 'updateTestResult').and.callThrough();

        component.updateTestResult();

        expect(component.updateTestResult).toHaveBeenCalled();
    });
});

describe('ScreeningRecordComponent handles errors', () => {
    let component: ScreeningRecordComponent;
    let fixture: ComponentFixture<ScreeningRecordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ScreeningRecordComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [mockPipe('translate')],
            providers: [
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: ScreeningService, useClass: ScreeningServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                {
                    provide: ScreeningService,
                    useClass: ScreeningServiceStubError,
                },
                {
                    provide: ErrorHandlerService,
                    useValue: { handleError: jasmine.createSpy() },
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ScreeningRecordComponent);
        component = fixture.componentInstance;
        component.visit = {
            start: '12/12/2023',
            service_requests: [{ id: '2' }],
        };

        component.visitObservable = throwError(() => new Error('error'));

        fixture.detectChanges();
    });

    it('should create', () => {
        component.cancerType = 'cervical';

        component.ngOnInit();
        expect(component.finalExamTemplateSettings.length).toBe(5);
        expect(component).toBeTruthy();
    });

    it('should test the fetchReport function', () => {
        spyOn(component, 'fetchReport').and.callThrough();

        component.fetchReport();
        expect(component.fetchReport).toHaveBeenCalled();
    });

    it('should test errorHandlerFxn function', () => {
        spyOn(component, 'errorHandlerFxn').and.callThrough();
        component.errorHandlerFxn(new Error('Boom'));
        expect(component.errorHandlerFxn).toHaveBeenCalled();
    });

    it('should set selected test and open delete modal in confirmDeleteTest', () => {
        const testData = {
            id: '123',
            name: 'Mammogram',
            value: 'Normal',
        };

        spyOn(component, 'toggleModal');

        component.confirmDeleteTest(testData);

        expect(component.selectedTest).toEqual(testData);
        expect(component.toggleModal).toHaveBeenCalledWith('deleteTest');
    });

    describe('deleteTest method', () => {
        it('should call screeningService.deleteTest with correct parameters', () => {
            spyOn(component, 'deleteTest').and.callThrough();

            component.screeningService = {
                deleteTest: jasmine
                    .createSpy('deleteTest')
                    .and.returnValue(of({})),
            } as any;

            const testData = { id: '123', name: 'Test' };
            component.selectedTest = testData;

            component.deleteTest();

            expect(component.deleteTest).toHaveBeenCalled();
            expect(component.screeningService.deleteTest).toHaveBeenCalledWith(
                component
            );
        });
    });
});

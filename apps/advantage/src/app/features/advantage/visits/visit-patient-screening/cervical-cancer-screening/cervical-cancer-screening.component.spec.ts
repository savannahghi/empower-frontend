import { CervicalCancerScreeningComponent } from './cervical-cancer-screening.component';
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
    waitForAsync,
} from '@angular/core/testing';
import {
    NbStepChangeEvent,
    NbStepComponent,
    NbStepperModule,
    NbToastrService,
} from '@nebular/theme';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { VisitService } from '../../visit.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { StepperService } from '../../../../../shared/component-services/stepper.service';
import { cervicalCancerFormDef } from '../risk-assessment/data';
import { ScreeningService } from '../screening.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';

class SilStoresServiceStub {
    create() {
        return of({
            questionnaireResponseID: 'test-response-id',
            riskLevel: 'LOW',
        });
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
            node: {
                id: 1,
            },
        });
    }
}

const mockLFormsResponse = {
    createQuestionnaireResponse: {
        totalCount: 4,
        edges: [
            {
                node: {
                    resourceType: 'QuestionnaireResponse',
                    status: 'completed',
                    authored: '2024-02-08T08:59:30.086Z',
                    item: [
                        {
                            linkId: '2670125340596',
                            text: 'Are you experiencing a discharge from your vagina?',
                            answer: [{ valueCoding: { display: 'No' } }],
                        },
                        {
                            linkId: 'symptoms-score',
                            text: 'Total Score: Symptoms',
                            answer: [{ valueInteger: 0 }],
                        },
                    ],
                },
            },
        ],
    },
};

class ScreeningServiceStub {
    getScreeningData() {
        return of({
            riskAssessment: {},
            consent: {},
            observation: {},
        });
    }
    checkUnauthorizedAccess() {}
    setScreeningStates() {
        return {};
    }
}

class ScreeningServiceStubError {
    getScreeningData() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    checkUnauthorizedAccess() {}
    setScreeningStates() {}
}

class NbToastrServiceStub {
    show() {
        return {};
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
    transitionTo() {
        return true;
    }
    includes() {
        return true;
    }
}

class StepperServiceStub {
    handleStepChange() {
        return true;
    }
    nextStep() {
        return true;
    }
    previousStep() {
        return true;
    }
    setupStepper() {
        return true;
    }
    checkOrientationChange() {
        return 'vertical';
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
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

const visitServiceStub = {
    visitPatientDataEmitter: of({
        new_price: 18,
        amount: '18',
        product_name: 'Lipid',
        quantity: 1,
        id: 1,
    }),
    visitPatientScreeningDataEmitter: new BehaviorSubject({
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
    setVisitData: () => {},
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

const visitServiceStub2 = {
    ...visitServiceStub,
    visitPatientScreeningDataEmitter: new BehaviorSubject({
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
};

const visitServiceStub3 = {
    ...visitServiceStub,
    visitPatientScreeningDataEmitter: new BehaviorSubject({
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
};

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params: {
        step: 1,
    },
    $current: {
        is: true,
        params: {
            step: 1,
        },
    },
};

const mockLForms = {
    Util: {
        addFormToPage: jasmine.createSpy('addFormToPage'),
        getFormFHIRData: jasmine
            .createSpy('getFormFHIRData')
            .and.returnValue(mockLFormsResponse),
    },
};

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('CervicalCancerScreeningComponent', () => {
    let component: CervicalCancerScreeningComponent;
    let fixture: ComponentFixture<CervicalCancerScreeningComponent>;
    let dataLayer: SilStoresService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NbStepperModule],
            declarations: [CervicalCancerScreeningComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: VisitService, useValue: visitServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: ScreeningService,
                    useClass: ScreeningServiceStub,
                },
            ],
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(
                    CervicalCancerScreeningComponent
                );
                component = fixture.componentInstance;
                dataLayer = TestBed.inject(SilStoresService);
                (window as any).LForms = mockLForms;
                component.visitObservable = of({
                    id: 1,
                    person: {
                        gender: 'MALE',
                        age: {
                            years: 30,
                        },
                    },
                    invoices: [{ id: 1 }],
                    clinical_orders: [{ id: 1 }],
                    service_requests: [
                        {
                            invoice: {
                                amount_due: 100,
                                amount_paid: 50,
                                invoice_lines: [{}],
                            },
                        },
                    ],
                });
                fixture.detectChanges();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
            });
    }));

    it('should create', () => {
        const stepper: NbStepComponent = new NbStepComponent('stepper');
        const evt: NbStepChangeEvent = {
            index: 0,
            step: stepper,
            previouslySelectedIndex: 0,
            previouslySelectedStep: stepper,
        };
        component.handleStepChange(evt);
        expect(component).toBeTruthy();
    });

    it('should test fetchQuestionnaires ', fakeAsync(() => {
        component.formDef = cervicalCancerFormDef;
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        tick(100);
        spyOn(component, 'fetchQuestionnaires').and.callThrough();
        component.fetchQuestionnaires();
        expect(component.fetchQuestionnaires).toHaveBeenCalled();
    }));

    it('should test stepper next function', () => {
        component.formDef = cervicalCancerFormDef;
        component.currentStep = 1;
        spyOn(component, 'nextStep').and.callThrough();
        component.nextStep(); // Call the function directly
        expect(component.nextStep).toHaveBeenCalled();
        expect(component.currentStep).toBe(1);
    });

    it('should test stepper previous function', () => {
        component.formDef = cervicalCancerFormDef;
        component.currentStep = 2;
        spyOn(component, 'previousStep').and.callThrough();
        component.previousStep();
        expect(component.previousStep).toHaveBeenCalled();
        expect(component.currentStep).toBe(2);
    });

    it('should test the next() functionality onSummary is true', () => {
        component.formDef = cervicalCancerFormDef;
        component.onSummary = true;
        component.formDef;
        spyOn(component, 'next').and.callThrough();
        component.next();
        expect(component.next).toHaveBeenCalled();
    });

    it('should test the previous() functionality', () => {
        component.formDef = cervicalCancerFormDef;
        component.onSummary = false;
        spyOn(component, 'previous').and.callThrough();
        component.previous();
        expect(component.previous).toHaveBeenCalled();
    });

    it('should test the next() functionality onSummary is false', () => {
        component.formDef = cervicalCancerFormDef;
        component.onSummary = false;
        component.formDef;
        spyOn(component, 'next').and.callThrough();
        component.next();
        expect(component.next).toHaveBeenCalled();
    });

    it('should test the previous() functionality', () => {
        component.formDef = cervicalCancerFormDef;
        component.onSummary = true;
        spyOn(component, 'previous').and.callThrough();
        component.previous();
        expect(component.previous).toHaveBeenCalled();
        expect(component.onSummary).toBe(false);
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the collectResponses() functionality', () => {
        component.servicePointData = {
            encounterID: '7264-1485-1471-2752',
            servicePointStatus: 'In progress',
        };

        component.formDef = cervicalCancerFormDef;
        component.formDef;
        spyOn(component, 'collectResponses').and.callThrough();
        component.collectResponses();
        expect(component.collectResponses).toHaveBeenCalled();
    });

    it('should test collectResponses function if encounterID is undefined', () => {
        component.servicePointData = undefined;
        component.formDef = cervicalCancerFormDef;

        spyOn(component, 'collectResponses').and.callThrough();

        component.collectResponses();
        expect(component.collectResponses).toHaveBeenCalled();
    });

    it('should test the submitLForm functionality with REST API', () => {
        component.formDef = cervicalCancerFormDef;
        component.servicePointData = {
            encounterID: '7264-1485-1471-2752',
            servicePointStatus: 'In progress',
        };

        const createSpy = spyOn(dataLayer, 'create').and.callThrough();
        spyOn(component, 'submitLForm').and.callThrough();

        const payload = {
            questionnaireID: 'test-id',
            encounterID: '7264-1485-1471-2752',
            input: mockLFormsResponse,
        };

        component.submitLForm(payload);

        expect(component.submitLForm).toHaveBeenCalled();
        expect(createSpy).toHaveBeenCalledWith(
            'questionnaire-response',
            mockLFormsResponse,
            {
                questionnaireID: 'test-id',
                encounterID: '7264-1485-1471-2752',
            }
        );
    });

    it('should test the responseFunction with REST API success response', () => {
        spyOn(component, 'responseFunction').and.callThrough();
        spyOn(component, 'showToast');

        const restResponse = {
            questionnaireResponseID: 'test-response-id',
            riskLevel: 'LOW',
        };

        component.responseFunction(restResponse);

        expect(component.responseFunction).toHaveBeenCalled();
        expect(component.results).toEqual(
            jasmine.objectContaining(restResponse)
        );
        expect(component.onSummary).toBeTrue();
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the responseFunction with REST API error response', () => {
        spyOn(component, 'responseFunction').and.callThrough();
        spyOn(component.errorHandler, 'handleError');

        const errorResponse = {
            message: 'Invalid questionnaire response',
        };

        component.responseFunction(errorResponse);

        expect(component.responseFunction).toHaveBeenCalled();
        expect(component.onSummary).toBeFalse();
        expect(component.errorHandler.handleError).toHaveBeenCalledWith(
            { message: 'Invalid questionnaire response' },
            component,
            'clinical'
        );
    });

    it('should test showToastError function', () => {
        spyOn(component, 'showToastError').and.callThrough();
        component.showToastError('bottom-right', 'danger', 'Error', 'Error');
        expect(component.showToastError).toHaveBeenCalled();
    });

    it('should test checkStatus function', () => {
        spyOn(component, 'checkStatus').and.callThrough();
        component.checkStatus();
        expect(component.checkStatus).toHaveBeenCalled();
    });

    it('should set empty screeningData when servicePointData encounterID is undefined', () => {
        const mockPatient = {
            age: 40,
            gender: 'FEMALE',
            servicePoints: [
                {
                    queue_name: 'Cervical Cancer Screening',
                    status: 'IN_PROGRESS',
                },
            ],
        };

        spyOn(component, 'getServicePointDetails').and.returnValue({
            servicePointStatus: 'IN_PROGRESS',
            encounterID: undefined,
        });

        spyOn(component, 'fetchScreeningData');

        (component as any).visitService.visitPatientScreeningDataEmitter.next(
            mockPatient
        );

        expect(component.fetchScreeningData).not.toHaveBeenCalled();
        expect(component.screeningData).toEqual({});
    });
});

class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    createNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    getClinical() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('CervicalCancerScreeningComponent fetch data error', () => {
    let component: CervicalCancerScreeningComponent;
    let fixture: ComponentFixture<CervicalCancerScreeningComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NbStepperModule],
            declarations: [CervicalCancerScreeningComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: VisitService, useValue: visitServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: ScreeningService,
                    useClass: ScreeningServiceStubError,
                },
            ],
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(
                    CervicalCancerScreeningComponent
                );
                component = fixture.componentInstance;
                (window as any).LForms = mockLForms;
                component.visitObservable = of({
                    id: 1,
                    person: {
                        gender: 'MALE',
                        age: {
                            years: 30,
                        },
                    },
                    invoices: [{ id: 1 }],
                    clinical_orders: [{ id: 1 }],
                    service_requests: [
                        {
                            invoice: {
                                amount_due: 100,
                                amount_paid: 50,
                                invoice_lines: [{}],
                            },
                        },
                    ],
                });
                fixture.detectChanges();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 17000;
            });
    }));

    it('should test fetchQuestionnaires', fakeAsync(() => {
        component.formDef = cervicalCancerFormDef;
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        tick(100);
        spyOn(component, 'fetchQuestionnaires').and.callThrough();
        component.fetchQuestionnaires();
        expect(component.fetchQuestionnaires).toHaveBeenCalled();
    }));

    it('should resolve successful submitLForm response', () => {
        spyOn(component, 'submitLForm').and.callThrough();
        component.submitLForm(mockLFormsResponse);
        expect(component.submitLForm).toHaveBeenCalled();
    });
});

const uIRouterGlobalsStub2 = {
    current: {
        name: 'state',
    },
    params: {
        step: undefined,
    },
    $current: {
        is: true,
        params: {},
    },
};

describe('CervicalCancerScreeningComponent: visit data does not resolve', () => {
    let component: CervicalCancerScreeningComponent;
    let fixture: ComponentFixture<CervicalCancerScreeningComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CervicalCancerScreeningComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [],
            providers: [
                { provide: VisitService, useValue: visitServiceStub2 },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
        fixture = TestBed.createComponent(CervicalCancerScreeningComponent);
        component = fixture.componentInstance;
        (window as any).LForms = mockLForms;
        component.visitObservable = throwError(() => new Error('error'));
        fixture.detectChanges();
    });

    it('should test error part of observables', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test stateResponseFunction function error', () => {
        const encounterID = '7264-1485-1471-2752';
        const errorResponse = {
            errors: [{ message: 'Invalid encounterID' }],
        };
        spyOn(component, 'stateResponseFunction').and.callThrough();

        component.stateResponseFunction(
            errorResponse,
            encounterID,
            'in progress'
        );
        expect(component.stateResponseFunction).toHaveBeenCalled();
    });

    it('should handle errors in stateResponseFunction', () => {
        spyOn(component.errorHandler, 'handleError');

        const errorResponse = {
            errors: [{ message: 'Test error message' }],
        };

        component.stateResponseFunction(
            errorResponse,
            'test-encounter-id',
            'IN_PROGRESS'
        );

        expect(component.errorHandler.handleError).toHaveBeenCalledWith(
            errorResponse.errors[0],
            component,
            'clinical'
        );
    });

    it('should handle error in visitObservable subscription', () => {
        const errorObj = new Error('Test error');
        component.visitObservable = throwError(() => errorObj);

        spyOn(component.errorHandler, 'handleError');

        component.ngOnInit();

        expect(component.errorHandler.handleError).toHaveBeenCalledWith(
            errorObj,
            component
        );
    });
});

describe('CervicalCancerScreeningComponent: visit data resolves to non screening service Points', () => {
    let component: CervicalCancerScreeningComponent;
    let fixture: ComponentFixture<CervicalCancerScreeningComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CervicalCancerScreeningComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [],
            providers: [
                { provide: VisitService, useValue: visitServiceStub3 },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
        fixture = TestBed.createComponent(CervicalCancerScreeningComponent);
        component = fixture.componentInstance;
        (window as any).LForms = mockLForms;
        component.visitObservable = throwError(() => new Error('error'));
        fixture.detectChanges();
    });

    it('should test if visit patient observable resolves for non existent screening servicePoints', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        spyOn(component, 'fetchScreeningData');

        component.screeningData = {};

        const mockPatient = {
            age: 40,
            gender: 'FEMALE',
            servicePoints: [
                {
                    encounterID: 'some-other-encounter',
                    queue_name: 'Different Service',
                    status: 'IN_PROGRESS',
                },
            ],
        };

        spyOn(component, 'getServicePointDetails').and.returnValue({
            encounterID: undefined,
            servicePointStatus: undefined,
        });

        component.visitPatientObservable();

        (component as any).visitService.visitPatientScreeningDataEmitter.next(
            mockPatient
        );

        expect(component.getServicePointDetails).toHaveBeenCalledWith(
            mockPatient.servicePoints
        );
        expect(component.fetchScreeningData).not.toHaveBeenCalled();
        expect(component.screeningData).toEqual({});
    });

    it('should set empty screeningData when servicePointData has no encounterID', () => {
        component.screeningData = {};

        component.servicePointData = {
            servicePointStatus: 'IN_PROGRESS',
            encounterID: undefined,
        };

        const mockPatient = {
            age: 40,
            gender: 'FEMALE',
            servicePoints: [
                {
                    queue_name: 'Cervical Cancer Screening',
                    status: 'IN_PROGRESS',
                },
            ],
        };

        spyOn(component, 'fetchScreeningData');

        spyOn(component, 'getServicePointDetails').and.returnValue({
            servicePointStatus: 'IN_PROGRESS',
            encounterID: undefined,
        });

        (component as any).visitService.visitPatientScreeningDataEmitter.next(
            mockPatient
        );

        expect(component.fetchScreeningData).not.toHaveBeenCalled();
        expect(component.screeningData).toEqual({});
    });
});

describe('CervicalCancerScreeningComponent throws error on submitLForm component call', () => {
    let screeningServiceMock;
    let component: CervicalCancerScreeningComponent;
    let fixture: ComponentFixture<CervicalCancerScreeningComponent>;
    let errorHandler: ErrorHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CervicalCancerScreeningComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: ErrorHandlerService,
                    useValue: {
                        handleError: jasmine.createSpy('handleError'),
                    },
                },
            ],
        });
        fixture = TestBed.createComponent(CervicalCancerScreeningComponent);

        component = fixture.componentInstance;
        errorHandler = TestBed.inject(ErrorHandlerService);
        (window as any).LForms = mockLForms;
        component.visitObservable = of({
            id: 1,
            person: {
                gender: 'MALE',
                age: {
                    years: 30,
                },
            },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 50,
                        invoice_lines: [{}],
                    },
                },
            ],
        });
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
                    queue_name: 'Cervical Cancer Screening',
                    status: 'IN_PROGRESS',
                    previous_point: 'Billing',
                },
            ],
        };
        fixture.detectChanges();
    });

    it('should handle error when submitting questionnaire response', () => {
        spyOn(component, 'submitLForm').and.callThrough();

        const payload = {
            questionnaireID: 'test-id',
            encounterID: '7264-1485-1471-2752',
            input: mockLFormsResponse,
        };

        component.submitLForm(payload);

        expect(component.submitLForm).toHaveBeenCalled();
        expect(errorHandler.handleError).toHaveBeenCalled();
        expect(component.loading).toBeFalse();
    });

    it('should resolve when fetchScreeningData times out', () => {
        screeningServiceMock = jasmine.createSpyObj('screeningService', [
            'getScreeningData',
        ]);

        screeningServiceMock.getScreeningData.and.returnValue({
            pipe: jasmine.createSpy().and.returnValue({
                subscribe: (_, errorCallback) => errorCallback(),
            }),
        });
        spyOn(component, 'fetchScreeningData').and.callThrough();

        component.fetchScreeningData('2', 'In progress');

        expect(component.fetchScreeningData).toHaveBeenCalled();
    });

    it('should test the responseFunction with null response', () => {
        spyOn(component, 'responseFunction').and.callThrough();

        component.responseFunction(null);

        expect(component.responseFunction).toHaveBeenCalled();
        expect(component.loading).toBeFalse();
        expect(component.onSummary).toBeFalse();
    });

    it('should test the responseFunction with undefined response', () => {
        spyOn(component, 'responseFunction').and.callThrough();

        component.responseFunction(undefined);

        expect(component.responseFunction).toHaveBeenCalled();
        expect(component.loading).toBeFalse();
        expect(component.onSummary).toBeFalse();
    });

    it('should handle error when fetching questionnaires', () => {
        spyOn(component.dataLayer, 'getClinical').and.returnValue(
            throwError(() => new Error('API Error'))
        );
        component.fetchQuestionnaires();
        expect(component.errorHandler.handleError).toHaveBeenCalledWith(
            jasmine.any(Error),
            component,
            'clinical'
        );
    });
});

describe('CervicalCancerScreeningComponent with successful REST API response', () => {
    let component: CervicalCancerScreeningComponent;
    let fixture: ComponentFixture<CervicalCancerScreeningComponent>;
    let dataLayer: SilStoresService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CervicalCancerScreeningComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: VisitService, useValue: visitServiceStub },
                {
                    provide: SilStoresService,
                    useValue: {
                        create: storeName => {
                            if (storeName === 'questionnaire-response') {
                                return of({
                                    questionnaireResponseID: 'test-response-id',
                                    riskLevel: 'MEDIUM',
                                });
                            }
                            return of({});
                        },
                        getClinical: () => of(cervicalCancerFormDef),
                    },
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: ScreeningService, useClass: ScreeningServiceStub },
            ],
        });

        fixture = TestBed.createComponent(CervicalCancerScreeningComponent);
        component = fixture.componentInstance;
        dataLayer = TestBed.inject(SilStoresService);
        (window as any).LForms = mockLForms;
        component.visitObservable = of({
            id: 1,
            person: {
                gender: 'MALE',
                age: {
                    years: 30,
                },
            },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
        });
        fixture.detectChanges();
    });

    it('should successfully submit questionnaire response and handle REST API response', () => {
        spyOn(dataLayer, 'create').and.callThrough();
        spyOn(component, 'showToast');
        spyOn(component.analytics, 'logEvent');

        component.servicePointData = {
            encounterID: '7264-1485-1471-2752',
            servicePointStatus: 'In progress',
        };
        component.formDef = cervicalCancerFormDef;

        const payload = {
            questionnaireID: 'test-id',
            encounterID: '7264-1485-1471-2752',
            input: mockLFormsResponse,
        };

        component.submitLForm(payload);

        expect(dataLayer.create).toHaveBeenCalledWith(
            'questionnaire-response',
            mockLFormsResponse,
            {
                questionnaireID: 'test-id',
                encounterID: '7264-1485-1471-2752',
            }
        );

        expect(component.analytics.logEvent).toHaveBeenCalledWith(
            'screening_cervical_created'
        );
        expect(component.showToast).toHaveBeenCalled();
        expect(component.onSummary).toBeTrue();
        expect(component.results).toEqual(
            jasmine.objectContaining({
                questionnaireResponseID: 'test-response-id',
                riskLevel: 'MEDIUM',
            })
        );
    });
});

describe('CervicalCancerScreeningComponent with error REST API response', () => {
    let component: CervicalCancerScreeningComponent;
    let fixture: ComponentFixture<CervicalCancerScreeningComponent>;
    let errorHandler: ErrorHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CervicalCancerScreeningComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: VisitService, useValue: visitServiceStub },
                {
                    provide: SilStoresService,
                    useValue: {
                        create: () => throwError(() => new Error('API Error')),
                        getClinical: () => of(cervicalCancerFormDef),
                    },
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: ErrorHandlerService,
                    useValue: {
                        handleError: jasmine.createSpy('handleError'),
                    },
                },
                { provide: ScreeningService, useClass: ScreeningServiceStub },
            ],
        });

        fixture = TestBed.createComponent(CervicalCancerScreeningComponent);
        component = fixture.componentInstance;
        errorHandler = TestBed.inject(ErrorHandlerService);
        (window as any).LForms = mockLForms;
        component.visitObservable = of({
            id: 1,
            person: {
                gender: 'MALE',
                age: {
                    years: 30,
                },
            },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
        });
        fixture.detectChanges();
    });

    it('should handle error when submitting questionnaire response', () => {
        component.servicePointData = {
            encounterID: '7264-1485-1471-2752',
            servicePointStatus: 'In progress',
        };
        component.formDef = cervicalCancerFormDef;

        const payload = {
            questionnaireID: 'test-id',
            encounterID: '7264-1485-1471-2752',
            input: mockLFormsResponse,
        };

        component.submitLForm(payload);

        expect(errorHandler.handleError).toHaveBeenCalled();
        expect(component.loading).toBeFalse();
    });
});

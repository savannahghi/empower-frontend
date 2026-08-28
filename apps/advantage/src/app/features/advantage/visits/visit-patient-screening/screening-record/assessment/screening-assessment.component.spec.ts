import { ScreeningAssessmentComponent } from './screening-assessment.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
    NbGlobalPosition,
    NbStepperModule,
    NbToastrService,
} from '@nebular/theme';
import { BehaviorSubject, of } from 'rxjs';
import { VisitService } from '../../../visit.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Authorization } from '../../../../../../@core/auth/services/authorization.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../../../shared/sil-http-services/sil_datalayer.service';
import { StepperService } from '../../../../../../shared/component-services/stepper.service';
import { cervicalCancerFormDef } from '../../risk-assessment/data';
import { ScreeningService } from '../../screening.service';
class SilStoresServiceStub {
    create() {
        return of({});
    }
    update() {
        return of({
            id: '12',
        });
    }
    customUpdate() {
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

class BaseScreeningServiceStub {
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
    checkUnauthorizedAccess() {}
    setScreeningStates() {}
}

class ScreeningServiceStub extends BaseScreeningServiceStub {
    mutationBuilder() {
        return of({
            data: {},
        });
    }
}

class ScreeningServiceStubError {
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

describe('ScreeningAssessmentComponent', () => {
    let component: ScreeningAssessmentComponent;
    let fixture: ComponentFixture<ScreeningAssessmentComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NbStepperModule],
            declarations: [ScreeningAssessmentComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: VisitService, useValue: visitServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: ScreeningService,
                    useClass: ScreeningServiceStub,
                },
            ],
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ScreeningAssessmentComponent);
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
            });
    }));

    it('should test fetchQuestionnaires ', () => {
        component.formDef = cervicalCancerFormDef;
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        spyOn(component, 'fetchQuestionnaires').and.callThrough();
        component.fetchQuestionnaires();
        expect(component.fetchQuestionnaires).toHaveBeenCalled();
    });

    it('should test submitQuestionnaireResponse ', () => {
        component.formDef = cervicalCancerFormDef;
        const payload = {
            questionnaireResponse: {},
            additionalData: {},
        };
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        spyOn(component, 'submitQuestionnaireResponse').and.callThrough();
        component.submitQuestionnaireResponse(payload);
        expect(component.submitQuestionnaireResponse).toHaveBeenCalled();
    });

    it('should test onSubmitSuccess ', () => {
        const response = {
            data: {
                createQuestionnaireResponse: {},
            },
        };
        spyOn(component, 'onSubmitSuccess').and.callThrough();
        component.onSubmitSuccess(response);
        expect(component.onSubmitSuccess).toHaveBeenCalled();
    });
    it('should test onSubmitError ', () => {
        const error = {
            data: {
                createQuestionnaireResponse: {},
            },
        };
        spyOn(component, 'onSubmitError').and.callThrough();
        component.onSubmitError(error);
        expect(component.onSubmitError).toHaveBeenCalled();
    });
    it('should test onQuestionnaireResponseReceived ', () => {
        const response = {
            data: {
                createQuestionnaireResponse: {},
            },
        };
        spyOn(component, 'onQuestionnaireResponseReceived').and.callThrough();
        component.onQuestionnaireResponseReceived(response);
        expect(component.onQuestionnaireResponseReceived).toHaveBeenCalled();
    });
    it('should test showToastError ', () => {
        spyOn(component, 'showToastError').and.callThrough();
        component.showToastError(
            'bottom-right' as NbGlobalPosition,
            'error',
            'error',
            'error'
        );
        expect(component.showToastError).toHaveBeenCalled();
    });
    it('should test showToast ', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast(
            'bottom-right' as NbGlobalPosition,
            'error',
            'error',
            'error'
        );
        expect(component.showToast).toHaveBeenCalled();
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

describe('ScreeningAssessmentComponent fetch data error', () => {
    let component: ScreeningAssessmentComponent;
    let fixture: ComponentFixture<ScreeningAssessmentComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NbStepperModule],
            declarations: [ScreeningAssessmentComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: VisitService, useValue: visitServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: ScreeningService,
                    useClass: ScreeningServiceStubError,
                },
            ],
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ScreeningAssessmentComponent);
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
            });
    }));

    it('should test fetchQuestionnaires ', () => {
        component.formDef = cervicalCancerFormDef;
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        spyOn(component, 'fetchQuestionnaires').and.callThrough();
        component.fetchQuestionnaires();
        expect(component.fetchQuestionnaires).toHaveBeenCalled();
    });

    it('should test submitQuestionnaireResponse ', () => {
        component.formDef = cervicalCancerFormDef;
        const payload = {
            questionnaireResponse: {},
            additionalData: {},
        };
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        spyOn(component, 'submitQuestionnaireResponse').and.callThrough();
        component.submitQuestionnaireResponse(payload);
        expect(component.submitQuestionnaireResponse).toHaveBeenCalled();
    });
});

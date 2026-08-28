import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';

import { VisitExamStepperComponent } from './visit-exam-stepper.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    ErrorHandler,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    NbStepComponent,
    NbStepperComponent,
    NbStepperModule,
    NbToastrService,
} from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { StepperService } from '../../../../../shared/component-services/stepper.service';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { VisitService } from '../../visit.service';
import { VisitExamService } from '../visit-exam.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

class AuthorizationConfigStub {
    logout() {
        return of(() => {});
    }
    getToken() {
        return {};
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            organisation_id: '511',
        };
    }
    getUser() {
        return { business_partner: '511' };
    }
}

class ErrorHandlerStub {
    handleError() {}
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
    error() {
        return of(() => {});
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
    includes() {
        return true;
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

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class StepperServiceStub {
    nextStep() {
        return true;
    }
    previousStep() {
        return true;
    }
    getCurrentStep() {
        return 1;
    }
    setupStepper() {
        return true;
    }
    handleStepChange() {
        return true;
    }
}

class SilStoresServiceStub {
    get() {
        return of({
            email_address: 'a@a.com',
            physical_address: 'Meru',
            id: '123',
        });
    }
}

class VisitExamServiceStub {
    toggleSection() {}
    patientVitals: [
        {
            id: 'weight';
            name: 'Weight';
            units: 'kg';
            concept: 'WEIGHT';
            vitalReference: '';
        }
    ];
    reviewTemplateSettings: [
        {
            id: 'problem';
            name: 'Problems';
            display: 'Problems';
            isNoteHidden: false;
            selected: true;
        }
    ];
    historyTemplateSettings: [
        {
            id: 'history_of_present_illness';
            name: 'History of present illness';
            display: 'History of present illness';
            compositionNoteTitle: 'History of Present illness Narrative';
            isNoteHidden: false;
            selected: true;
        }
    ];
    examTemplateSettings: [
        {
            id: 'general_systems';
            name: 'General systems';
            display: 'General systems';
            compositionNoteTitle: 'General systems';
            isNoteHidden: false;
            selected: true;
        }
    ];

    treatmentPlanTemplateSettings: [
        {
            id: 'diagnosis';
            name: 'Diagnoses';
            display: 'Diagnoses';
            isNoteHidden: false;
            selected: true;
        }
    ];

    signOffTemplateSettings: [
        {
            id: 'sign_off';
            name: 'Sign off on assessment';
            display: 'Sign off on assessment';
            isNoteHidden: false;
            selected: true;
        }
    ];
}
describe('VisitExamStepperComponent', () => {
    let component: VisitExamStepperComponent;
    let fixture: ComponentFixture<VisitExamStepperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            declarations: [VisitExamStepperComponent],
            imports: [NbStepperModule],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: ErrorHandler, useClass: ErrorHandlerStub },
                { provide: VisitExamService, useClass: VisitExamServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(VisitExamStepperComponent);
        component = fixture.componentInstance;
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
        component.stepper = {
            steps: {
                _results: [
                    { completed: false },
                    { completed: false },
                    { completed: false },
                ],
                length: 1,
            },
            changeStep: () => {},
            next: () => {},
        };
        fixture.detectChanges();
    });

    it('should create component', () => {
        component.ngOnInit();
        component.nextStep();
        expect(VisitExamStepperComponent).toBeTruthy();
    });

    it('Should test the nextStep function', fakeAsync(() => {
        spyOn(component, 'nextStep').and.callThrough();
        component.nextStep();
        tick(2001);
        expect(component.nextStep).toHaveBeenCalled();
    }));

    it('Should test the previousStep function', fakeAsync(() => {
        spyOn(component, 'previousStep').and.callThrough();
        component.previousStep();
        tick(2001);
        expect(component.previousStep).toHaveBeenCalled();
    }));

    it('Should test the setupStep function', () => {
        spyOn(component, 'setupStep').and.callThrough();
        component.setupStep();
        expect(component.setupStep).toHaveBeenCalled();
    });

    it('Should test the setupStep function when an index has been provided', () => {
        spyOn(component, 'setupStep').and.callThrough();
        component.setupStep(2);
        expect(component.setupStep).toHaveBeenCalled();
    });
});

class SilStoresServiceStub2 {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('VisitExamStepperComponent fails', () => {
    let component: VisitExamStepperComponent;
    let fixture: ComponentFixture<VisitExamStepperComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            declarations: [VisitExamStepperComponent],
            imports: [NbStepperModule],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { provide: ErrorHandlerService, useClass: ErrorHandlerStub },
                { provide: VisitExamService, useClass: VisitExamServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitExamStepperComponent);
        component = fixture.componentInstance;
        component.visitObservable = throwError(() => new Error('error'));
        component.stepper = {
            steps: {
                _results: [
                    { completed: false },
                    { completed: false },
                    { completed: false },
                ],
                length: 1,
            },
            changeStep: () => {},
            next: () => {},
        };

        fixture.detectChanges();
    });
    it('should test the handleStepChange function', () => {
        component.handleStepChange({
            index: 0,
            step: new NbStepComponent(NbStepperComponent),
            previouslySelectedIndex: 0,
            previouslySelectedStep: new NbStepComponent(NbStepperComponent),
        });
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { NbToastrService } from '@nebular/theme';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
import { ExamReferralsComponent } from './exam-referrals.component';
import { VisitService } from '../../../visit.service';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from 'app/@core/auth/services/authentication.service';
import { CommonModule } from '@angular/common';

class AuthenticationStub {
    checkPermission() {
        return true;
    }
}

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

class AnalyticsServiceStub {
    logEvent() {
        return true;
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

class SilStoresServiceStub2 {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
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

class TransitionServiceStub {
    from() {
        return { name: 'app.advantage.home' };
    }
    params() {
        return { id: 'someid' };
    }
}

describe('ExamReferralsComponent', () => {
    let component: ExamReferralsComponent;
    let fixture: ComponentFixture<ExamReferralsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExamReferralsComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [CommonModule, mockPipe('app')],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: VisitService, useValue: visitServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: Transition, useClass: TransitionServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: ErrorHandlerService, useClass: ErrorHandlerStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ExamReferralsComponent);
        component = fixture.componentInstance;
        component.visitObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            invoices: [{ id: 1 }],
            branch_id: '1',
            organisation: '1',
            clinical_orders: [{ id: 1 }],
            service_requests: [
                {
                    id: 1,
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

    it('should test submitReferral function', () => {
        spyOn(component, 'submitReferral').and.callThrough();
        const model = {
            description: 'description',
            referral_type: 'INPATIENT',
            diagnosis: {
                display_name: 'Malaria',
            },
            facility: {
                id: '1',
                org_units: [{ id: 1 }],
            },
            priority: 'URGENT',
        };
        component.patient = { id: '1' };
        component.submitReferral(model);
        const model2 = {
            description: 'description',
            referral_type: 'INPATIENT',
            diagnosis: {
                display_name: 'Malaria',
            },
            priority: 'URGENT',
        };
        component.submitReferral(model2);
        component.formOptions = {
            resetModel: () => {},
        };
        component.toggleModal('hieModal');
        component.handleHieReferral({ diagnosis: '2' });
        expect(component.submitReferral).toHaveBeenCalled();
    });

    it('should test showToast functions', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.setFilter({});
        component.getFormOptions({});
        component.showToast(
            'bottom-right',
            'success',
            'Message',
            'Message sent'
        );
        expect(component.showToast).toHaveBeenCalled();
    });
});

describe('ExamReferralsComponent fails', () => {
    let component: ExamReferralsComponent;
    let fixture: ComponentFixture<ExamReferralsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ExamReferralsComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [CommonModule, mockPipe('app')],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: VisitService, useValue: visitServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: Transition, useClass: TransitionServiceStub },
                { provide: ErrorHandlerService, useClass: ErrorHandlerStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExamReferralsComponent);
        component = fixture.componentInstance;
        component.visitObservable = throwError(() => new Error('error'));
        fixture.detectChanges();
    });

    it('should test submitReferral function', () => {
        spyOn(component, 'submitReferral').and.callThrough();
        const model = {
            description: 'description',
            referral_type: 'INPATIENT',
            diagnosis: {
                display_name: 'Malaria',
            },
            facility: {
                id: '1',
                org_units: [{ id: 1 }],
            },
            priority: 'URGENT',
        };
        component.patient = { id: '1' };
        component.submitReferral(model);
        expect(component.submitReferral).toHaveBeenCalled();
    });

    it('should test handleErrorFxn method', () => {
        spyOn(component, 'handleErrorFxn').and.callThrough();
        component.handleErrorFxn({});
        expect(component.handleErrorFxn).toHaveBeenCalled();
    });
});

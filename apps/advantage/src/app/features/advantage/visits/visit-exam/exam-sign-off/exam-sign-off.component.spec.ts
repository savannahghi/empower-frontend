import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSignOffComponent } from './exam-sign-off.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { NbToastrService } from '@nebular/theme';
import { SilStoresService } from '../../../../..//shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { VisitService } from '../../visit.service';

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

class SilStoresServiceStub {
    get() {
        return of({
            email_address: 'a@a.com',
            physical_address: 'Meru',
            id: '123',
        });
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

class SilStoresServiceStub2 {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}
describe('ExamSignOffComponent', () => {
    let component: ExamSignOffComponent;
    let fixture: ComponentFixture<ExamSignOffComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExamSignOffComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: ErrorHandlerService, useClass: ErrorHandlerStub },
                { provide: VisitService, useValue: visitServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ExamSignOffComponent);
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

        fixture.detectChanges();
    });

    it('should test component functions', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal('test');
        expect(component.toggleModal).toHaveBeenCalled();
    });
});

describe('ExamSignOffComponent fails', () => {
    let component: ExamSignOffComponent;
    let fixture: ComponentFixture<ExamSignOffComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { provide: ErrorHandlerService, useClass: ErrorHandlerStub },
                { provide: VisitService, useValue: visitServiceStub },
            ],
            declarations: [ExamSignOffComponent],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExamSignOffComponent);
        component = fixture.componentInstance;
        component.visitObservable = throwError(() => new Error('error'));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../../shared/cookies/cookie.service';
import { BehaviorSubject, of } from 'rxjs';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { NbToastrService } from '@nebular/theme';
import { VisitService } from '../../visit.service';
import { AuthenticationService } from '../../../../../@core/auth/services/authentication.service';
import { SilFormlyService } from '../../../../../shared/sil-form/services/skika-formly-service';
import { AddLabOrderComponent } from './add-lab-order.component';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

const stateServiceStub = {
    reset() {
        return true;
    },
    go() {
        return true;
    },
    reload() {
        return true;
    },
    includes() {
        return true;
    },
    transitionTo() {
        return true;
    },
    param() {
        return true;
    },
};

const uIRouterGlobalsStub = {
    params: {
        id: 'dummyId',
    },
};

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
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
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class SilStoresServiceStub {
    create() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}
class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

class AuthenticationStubError {
    checkPermission() {
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
    visitDataEmitter: of({
        id: '123232',
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

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('AddLabOrderComponent', () => {
    let component: AddLabOrderComponent;
    let fixture: ComponentFixture<AddLabOrderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddLabOrderComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useValue: stateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStubError,
                },
                SilFormlyService,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddLabOrderComponent);
        component = fixture.componentInstance;
        component.visitPayload = {
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
        };

        fixture.detectChanges();
    });

    it('should test cancelFxn method', () => {
        spyOn(component, 'cancelFxn').and.callThrough();
        component.cancelFxn();
        expect(component.cancelFxn).toHaveBeenCalled();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test getLabServiceRequest function', () => {
        component.newServiceRequestId = '6936-2929';
        spyOn(component, 'getLabServiceRequest').and.callThrough();
        component.getLabServiceRequest();
        expect(component.getLabServiceRequest).toHaveBeenCalled();
    });

    it('should test the getFormOptions method', () => {
        spyOn(component, 'getFormOptions').and.callThrough();
        component.getFormOptions({ resetModel: () => {} });
        expect(component.getFormOptions).toHaveBeenCalled();
    });

    it('should test submitLabOrder', () => {
        const event = {
            status: 'REGISTERED',
            test: {
                name: 'Test',
                loinc_code: 'LC-12',
                scale_type: 'Test',
            },
            clinical_notes: 'Test',
            service_request: '124',
        };
        spyOn(component, 'submitLabOrder').and.callThrough();
        component.getFormOptions({ resetModel: () => {} });
        component.submitLabOrder(event);
        expect(component.submitLabOrder).toHaveBeenCalledWith(event);
    });
});

describe('AddLabOrderComponent fails', () => {
    let component: AddLabOrderComponent;
    let fixture: ComponentFixture<AddLabOrderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddLabOrderComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useValue: stateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStubError,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddLabOrderComponent);
        component = fixture.componentInstance;
        component.visitPayload = {};

        fixture.detectChanges();
    });

    it('should test submitLabOrder', () => {
        const event = {
            status: 'REGISTERED',
            test: {
                name: 'Test',
                loinc_code: 'LC-12',
                scale_type: 'Test',
            },
            clinical_notes: 'Test',
            service_request: '124',
        };
        spyOn(component, 'submitLabOrder').and.callThrough();
        component.getFormOptions({ resetModel: () => {} });
        component.submitLabOrder(event);
        expect(component.submitLabOrder).toHaveBeenCalledWith(event);
    });

    it('should test handleErrorFxn function', () => {
        spyOn(component, 'handleErrorFxn').and.callThrough();
        component.handleErrorFxn({});
        expect(component.handleErrorFxn).toHaveBeenCalled();
    });
});

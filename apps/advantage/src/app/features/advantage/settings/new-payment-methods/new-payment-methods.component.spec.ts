import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from '@angular/core/testing';
import { NewPaymentMethodsComponent } from './new-payment-methods.component';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbStepperComponent, NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { BehaviorSubject, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ResolverService } from '../../../../features/services/resolver.service';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { StepperService } from '../../../../shared/component-services/stepper.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { NewSalesPricelistFieldsService } from '../../../../shared/sil-form/services/formly/new-sales-pricelist-form';

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

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
    update() {
        return of({
            name: 'Cash Five',
            account: '379a74a2-5fa7-437b-929a-2221e4b2fa7c',
            description: 'cash 60 description',
            effective_from: '2024-08-09T06:27:49.283Z',
            effective_to: '2024-08-09T06:27:49.284Z',
        });
    }
    create() {
        return of({
            name: 'Cash Five',
            account: '379a74a2-5fa7-437b-929a-2221e4b2fa7c',
            description: 'cash 60 description',
            effective_from: '2024-08-09T06:27:49.283Z',
            effective_to: '2024-08-09T06:27:49.284Z',
        });
    }
}

const resolverServiceStub = {
    resolveItem() {
        return of({
            account_details: 'April Offers',
            mobile_money_type: 'Mobile Money',
            mobile_money_business_number: '123',
            bank_name: 'Bank Name',
            bank_branch: 'Bank Branch',
            bank_account_number: '123',
            active: true,
            name: 'Customer Name',
            description: 'This is the name of the customer',
            account: '123f-234',
        });
    },
};

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getUser() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
            organisation: '123',
        };
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

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
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class StepperServiceStub {
    setupStepper() {
        return true;
    }
    handleStepChange() {
        return true;
    }
    nextStep() {
        return true;
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params: {
        id: '112',
        page_size: '2',
        queue: 1,
        step: 1,
    },
    $current: {
        params: {
            page_size: '2',
        },
    },
};

describe('NewPaymentMethodsComponent', () => {
    let component: NewPaymentMethodsComponent;
    let fixture: ComponentFixture<NewPaymentMethodsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NewPaymentMethodsComponent, NbStepperComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ErrorHandlerService,
                NewSalesPricelistFieldsService,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: ResolverService,
                    useValue: resolverServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NewPaymentMethodsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test component functions', fakeAsync(() => {
        component.toastTime = 3000;
        expect(component).toBeTruthy();
        component.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();

        component.goToPaymentMethodsList();

        component.paymentMethodDetails = null;
        component.submitPaymentMethod({
            name: 'Cash Five',
            account: '379a74a2-5fa7-437b-929a-2221e4b2fa7c',
            description: 'cash 60 description',
            effective_from: '2024-08-09T06:27:49.283Z',
            effective_to: '2024-08-09T06:27:49.284Z',
        });
        tick(component.toastTime);

        flush();
    }));

    it('should test submitPaymentMethod update method', () => {
        component.paymentMethodDetails = {
            id: '6af57ac7-6ced-4a79-8493-078a63470c21',
            account_details: 'Account Details',
            mobile_money_type: 'Mobile Money Type',
            mobile_money_business_number: '123456',
            bank_name: 'Bank Name',
            bank_branch: 'Bank Branch',
            bank_account_number: '123456',
            active: true,
            name: 'FirstName LastName',
            description: 'Holiday offers for the April Holiday!',
            account: '6af57ac7-6ced-4a79-8493-078a63470f21',
        };

        component.submitPaymentMethod({
            name: 'Cash Five',
            account: '379a74a2-5fa7-437b-929a-2221e4b2fa7c',
            description: 'cash 60 description',
            effective_from: '2024-08-09T06:27:49.283Z',
            effective_to: '2024-08-09T06:27:49.284Z',
        });

        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
        expect(component).toBeTruthy();
    });
});

const silStoresServiceStubError = {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    },
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    },
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    },
    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    },
};

const resolverServiceStubError = {
    resolveItem() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    },
};

const uIRouterGlobalsStubError = {
    current: {
        name: 'state',
    },
    params: {
        service_request: 'wer',
        page_size: '2',
        queue: 1,
        step: 2,
    },
    $current: {
        params: {
            page_size: '2',
        },
    },
};

describe('NewPaymentMethodsComponent Error', () => {
    let component: NewPaymentMethodsComponent;
    let fixture: ComponentFixture<NewPaymentMethodsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NewPaymentMethodsComponent, NbStepperComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ErrorHandlerService,
                {
                    provide: ResolverService,
                    useValue: resolverServiceStubError,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: SilStoresService,
                    useValue: silStoresServiceStubError,
                },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStubError,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NewPaymentMethodsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test component functions Error path', () => {
        component.submitPaymentMethod({
            name: 'Cash Five',
            account: '379a74a2-5fa7-437b-929a-2221e4b2fa7c',
            description: 'cash 60 description',
            effective_from: '2024-08-09T06:27:49.283Z',
            effective_to: '2024-08-09T06:27:49.284Z',
        });

        expect(component).toBeTruthy();
    });

    it('should test submitPaymentMethod update method Error path', () => {
        component.paymentMethodDetails = {
            id: '6af57ac7-6ced-4a79-8493-078a63470c21',
            account_details: 'Account Details',
            mobile_money_type: 'Mobile Money Type',
            mobile_money_business_number: '123456',
            bank_name: 'Bank Name',
            bank_branch: 'Bank Branch',
            bank_account_number: '123456',
            active: true,
            name: 'FirstName LastName',
            description: 'Holiday offers for the April Holiday!',
            account: '6af57ac7-6ced-4a79-8493-078a63470f21',
        };

        component.submitPaymentMethod({
            name: 'Cash Five',
            account: '379a74a2-5fa7-437b-929a-2221e4b2fa7c',
            description: 'cash 60 description',
            effective_from: '2024-08-09T06:27:49.283Z',
            effective_to: '2024-08-09T06:27:49.284Z',
        });

        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });
});

import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BranchCustomersComponent } from './branch-customers.component';
import { BehaviorSubject, of } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

class AuthorizationStub {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrganisation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class AuthenticationServiceStub1 {
    checkPermission() {
        return true;
    }
}

class AuthenticationServiceStub2 {
    checkPermission() {
        return false;
    }
}

class UIRouterGlobalsStub1 {
    current = {
        data: {
            etimsRows: [],
            etimsTableHeader: [],
            actions: [],
        },
    };
}

class UIRouterGlobalsStub2 {
    current = {
        data: {
            rows: [],
            tableHeader: [],
            actions: [],
        },
    };
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
    reload() {
        return true;
    }
}

class SilStoresServiceStub {
    create() {
        return of({});
    }
}

class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

describe('BranchCustomersComponent', () => {
    let component: BranchCustomersComponent;
    let fixture: ComponentFixture<BranchCustomersComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BranchCustomersComponent],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub1,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useClass: UIRouterGlobalsStub1 },
                { provide: UIRouterGlobals },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(BranchCustomersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component.transition, 'params').and.returnValue({
            search: 'testSearch',
            page: 2,
        });

        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();

        expect(component.ngOnInit).toHaveBeenCalled();

        expect(component.filterParams).toEqual({
            search: 'testSearch',
            page: 2,
        });

        spyOn(component, 'setupDataFromState').and.callThrough();
        component.setupDataFromState();
        expect(component.setupDataFromState).toHaveBeenCalled();
    });

    it('should test setupDataFromState', () => {
        spyOn(component, 'setupDataFromState').and.callThrough();
        component.setupDataFromState();
        expect(component.setupDataFromState).toHaveBeenCalled();
    });

    it('should test the fxnReload function', fakeAsync(() => {
        spyOn(component, 'fxnReload').and.callThrough();
        component.fxnReload();
        tick(3200);
        expect(component.fxnReload).toHaveBeenCalled();
    }));

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.setFilter({});
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the pageReloader method', () => {
        spyOn(component, 'pageReloader').and.callThrough();
        component.pageReloader();
        expect(component.pageReloader).toHaveBeenCalled();
    });

    it('should test addBranchCustomer function', () => {
        const model = {
            partner_name: 'partner_name',
            customer_type: 'customer_type',
            is_customer: true,
            customer_tax_pin: 'customer_tax_pin',
            country: 'country',
            currency: 'currency',
        };
        spyOn(component, 'addBranchCustomer').and.callThrough();
        component.addBranchCustomer(model);
        expect(component.addBranchCustomer).toHaveBeenCalledWith(model);
    });

    it('should test receiveAddCustomerDetails function', () => {
        spyOn(component, 'receiveAddCustomerDetails').and.callThrough();
        component.receiveAddCustomerDetails();
        expect(component.receiveAddCustomerDetails).toHaveBeenCalled();
    });
});

describe('BranchCustomersComponent when setupDataFromState is displaying rows', () => {
    let component: BranchCustomersComponent;
    let fixture: ComponentFixture<BranchCustomersComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BranchCustomersComponent],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub2,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useClass: UIRouterGlobalsStub2 },
                { provide: UIRouterGlobals },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(BranchCustomersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test setupDataFromState', () => {
        spyOn(component, 'setupDataFromState').and.callThrough();
        component.setupDataFromState();
        expect(component.setupDataFromState).toHaveBeenCalled();
    });
});

describe('BranchCustomersComponent publishing error', () => {
    let component;
    let fixture: ComponentFixture<BranchCustomersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BranchCustomersComponent],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub1,
                },
                { provide: UIRouterGlobals, useClass: UIRouterGlobalsStub1 },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(BranchCustomersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Error is thrown when addBranchCustomer is not resolved', () => {
        spyOn(component, 'errorHandlerAddCustomerDetails').and.callThrough();
        component.errorHandlerAddCustomerDetails();
        expect(component.errorHandlerAddCustomerDetails).toHaveBeenCalled();
    });
});

describe('BranchCustomersComponent publishing error when setupDataFromState is displaying rows', () => {
    let component;
    let fixture: ComponentFixture<BranchCustomersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BranchCustomersComponent],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub2,
                },
                { provide: UIRouterGlobals, useClass: UIRouterGlobalsStub2 },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(BranchCustomersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test setupDataFromState', () => {
        spyOn(component, 'setupDataFromState').and.callThrough();
        component.setupDataFromState();
        expect(component.setupDataFromState).toHaveBeenCalled();
    });
});

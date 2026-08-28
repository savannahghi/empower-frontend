import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatementComponent } from './account-statement.component';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition } from '@uirouter/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';

class SilStoresServiceStub {
    get() {
        return of({
            receivables_account: {
                id: 12312,
            },
        });
    }
    listNestedDownload() {
        return of({
            receivables_account: {
                id: 12312,
            },
        });
    }
}

class NbToastrServiceStub {
    show() {
        return {};
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

class TransitionStub {
    params() {
        return { id: 1 };
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

describe('StatementComponent', () => {
    let fixture: ComponentFixture<StatementComponent>;
    let component;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [StatementComponent],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StatementComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({
            customer_id: 1,
        });
        fixture.detectChanges();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.customer = {
            receivables_account: {
                id: 12312,
            },
        };
        spyOn(window, 'open').and.returnValue(null);
        component.downloadPdf();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    listNestedDownload() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('StatementComponent throws error when fetching customer', () => {
    let fixture: ComponentFixture<StatementComponent>;
    let component;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [StatementComponent],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(StatementComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({
            customer_id: 1,
        });
        fixture.detectChanges();
    });

    it('Error is thrown when customer is not resolved', () => {
        spyOn(component, 'setFilter').and.callThrough();
        component.setFilter('bottom-right');
        component.customer = {
            receivables_account: {
                id: 12312,
            },
        };
        component.downloadPdf();
        expect(component.setFilter).toHaveBeenCalled();
    });
});

describe('StatementComponent patientObservable does not bring back the customer_id', () => {
    let fixture: ComponentFixture<StatementComponent>;
    let component;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [StatementComponent],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(StatementComponent);
        component = fixture.componentInstance;
        component.patientObservable = throwError('Error thrown');
        fixture.detectChanges();
    });

    it('Error is thrown when patient is not resolved', () => {
        spyOn(component, 'setFilter').and.callThrough();
        component.setFilter('bottom-right');
        expect(component.setFilter).toHaveBeenCalled();
    });
});

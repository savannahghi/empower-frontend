import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ProviderDetailsComponent } from './provider-details.component';

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    setUser() {
        return {
            client_types: ['PROVIDER'],
        };
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

class SilStoresServiceStub {
    get() {
        return of({
            id: '12312',
            total_payments: 4500,
        });
    }

    list() {
        return of({
            results: [
                {
                    id: '143224',
                },
            ],
        });
    }

    create() {
        return of({
            autorecon_enabled: false,
        });
    }

    update() {
        return of({
            id: '12',
        });
    }

    createNested() {
        return of({
            id: '12312',
        });
    }
    listNested() {
        return of({});
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    reload() {
        return true;
    }
    transition() {
        return true;
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.purchases.purchase-invoice.detail',
    },
    params() {
        return { id: 1 };
    },
};

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

describe('ProviderDetailsComponent', () => {
    let component: ProviderDetailsComponent;
    let fixture: ComponentFixture<ProviderDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ProviderDetailsComponent],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Transition, useClass: TransitionStub },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        });
        fixture = TestBed.createComponent(ProviderDetailsComponent);
        component = fixture.componentInstance;
        component.organisationObservable = of({
            id: '12312',
        });
        fixture.detectChanges();
    });

    it('should test the getOrganisationInfo method', () => {
        spyOn(component.organisationObservable, 'subscribe').and.callFake(
            success => {
                success({ workflow_state: 'PROCESSED' });
            }
        );
        spyOn(component, 'getOrganisationInfo').and.callThrough();
        component.getOrganisationInfo();
        expect(component.getOrganisationInfo).toHaveBeenCalled();
    });

    it('should test the toggleModal method', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal('enable');
        expect(component.toggleModal).toHaveBeenCalled();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('position', 'context', 'message', 'duration');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the enableEtims method', () => {
        spyOn(component, 'enableEtims').and.callThrough();
        component.enableEtims();
        expect(component.enableEtims).toHaveBeenCalled();
    });

    it('should test the checkIfOrgIsAutoreconEnabled method', () => {
        spyOn(component, 'checkIfOrgIsAutoreconEnabled').and.callThrough();
        component.checkIfOrgIsAutoreconEnabled();
        expect(component.checkIfOrgIsAutoreconEnabled).toHaveBeenCalled();
    });

    it('should test the enableAutoRecon method if organisation exists and org does not exist in autorecon', () => {
        component.isAutoReconEnabledResponse.exists = false;

        spyOn(component, 'enableAutoRecon').and.callThrough();
        component.enableAutoRecon();
        expect(component.enableAutoRecon).toHaveBeenCalled();
    });

    it('should test the enableAutoRecon method if organisation exists and org exists in autorecon', () => {
        component.isAutoReconEnabledResponse.exists = true;

        spyOn(component, 'enableAutoRecon').and.callThrough();
        component.enableAutoRecon();
        expect(component.enableAutoRecon).toHaveBeenCalled();
    });

    it('should test the disableAutoRecon method', () => {
        spyOn(component, 'disableAutoRecon').and.callThrough();
        component.disableAutoRecon();
        expect(component.disableAutoRecon).toHaveBeenCalled();
    });

    it('should test the enabledAutoReconSuccessfully method', () => {
        spyOn(component, 'enabledAutoReconSuccessfully').and.callThrough();
        component.enabledAutoReconSuccessfully();
        expect(component.enabledAutoReconSuccessfully).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    create() {
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

    listNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('ProviderDetailsComponent: Error', () => {
    let component: ProviderDetailsComponent;
    let fixture: ComponentFixture<ProviderDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ProviderDetailsComponent],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Transition, useClass: TransitionStub },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        });
        fixture = TestBed.createComponent(ProviderDetailsComponent);
        component = fixture.componentInstance;
        component.organisationObservable = throwError('Error Thrown');
        fixture.detectChanges();
    });

    it('should test the getOrganisationInfo method', () => {
        spyOn(component.organisationObservable, 'subscribe').and.callFake(
            success => {
                success({ workflow_state: 'PROCESSED' });
            }
        );
        spyOn(component, 'getOrganisationInfo').and.callThrough();
        component.getOrganisationInfo();
        expect(component.getOrganisationInfo).toHaveBeenCalled();
    });

    it('should test the toggleModal method', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal('enable');
        expect(component.toggleModal).toHaveBeenCalled();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('position', 'context', 'message', 'duration');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the enableEtims method', () => {
        spyOn(component, 'enableEtims').and.callThrough();
        component.enableEtims();
        expect(component.enableEtims).toHaveBeenCalled();
    });

    it('should test handleErrorFxn method', () => {
        spyOn(component, 'handleErrorFxn').and.callThrough();
        component.handleErrorFxn({});

        expect(component.handleErrorFxn).toHaveBeenCalled();
    });
});

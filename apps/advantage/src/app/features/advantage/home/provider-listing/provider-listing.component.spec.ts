import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { ProviderListingComponent } from './provider-listing.component';
import { BehaviorSubject, of } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    setUser() {
        return {
            client_types: ['PROVIDER'],
        };
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

class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
}

class SilStoresServiceStub {
    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '2' }],
        });
    }

    remove() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '2' }],
        });
    }
}

describe('ProviderListingComponent', () => {
    let fixture: ComponentFixture<ProviderListingComponent>;
    let component;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ProviderListingComponent],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                {
                    provide: ErrorHandlerService,
                    useValue: { handleError: jasmine.createSpy() },
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProviderListingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the showErrorToast method', () => {
        spyOn(component, 'showErrorToast').and.callThrough();
        component.showErrorToast(
            'bottom-right',
            'success',
            'message',
            'context'
        );
        expect(component.showErrorToast).toHaveBeenCalled();
    });

    it('should test setFilter method', () => {
        spyOn(component, 'setFilter').and.callThrough();
        component.setFilter('test');
        expect(component.setFilter).toHaveBeenCalled();
    });

    it('should test toggleModal method', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal();
        expect(component.toggleModal).toHaveBeenCalled();
    });

    it('should test createProvider method', () => {
        const formModel = {
            business_partner: {
                sladeCode: '12345',
            },
        };
        spyOn(component, 'createProvider').and.callThrough();
        component.createProvider(formModel);
        expect(component.createProvider).toHaveBeenCalled();
    });

    it('should test deleteOnboardedProvider method', () => {
        spyOn(component, 'deleteOnboardedProvider').and.callThrough();
        component.deleteOnboardedProvider();
        expect(component.deleteOnboardedProvider).toHaveBeenCalled();
    });

    it('should test the ngOnInit method', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    remove() {
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

describe('ProviderListingComponent', () => {
    let fixture: ComponentFixture<ProviderListingComponent>;
    let component;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ProviderListingComponent],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                {
                    provide: ErrorHandlerService,
                    useValue: { handleError: jasmine.createSpy() },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProviderListingComponent);
        component = fixture.componentInstance;
        component.isMounted = true;
        fixture.detectChanges();
    });

    it('should test createProvider method', () => {
        const formModel = {
            business_partner: {
                sladeCode: '12345',
            },
        };
        spyOn(component, 'createProvider').and.callThrough();
        component.createProvider(formModel);
        expect(component.createProvider).toHaveBeenCalled();
    });

    it('should test deleteOnboardedProvider method', () => {
        spyOn(component, 'deleteOnboardedProvider').and.callThrough();
        component.deleteOnboardedProvider();
        expect(component.deleteOnboardedProvider).toHaveBeenCalled();
    });
});

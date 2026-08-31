import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { StateObject } from '@uirouter/angular';
import { ProviderOnboardingService } from './onboarding-stepper.service';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { BehaviorSubject, of } from 'rxjs';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class AuthorizationConfigStub {
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            id: 133944,
            guid: 'bfdc441d-80a2-4817-9aa3-5567312a2864',
            roles: ['Quintus'],
            permissions: ['erp.dashboard_list'],
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return { organisation_id: 1 };
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
    error() {
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
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params: {
        step: '1',
    },
    $current: {
        params: {
            step: 1,
        },
    },
};

class SilStoresServiceStub {
    get() {
        return of({
            email_address: 'a@a.com',
            physical_address: 'Meru',
            id: '123',
        });
    }
    list() {
        return of({
            results: [
                {
                    slade_code: '511',
                },
            ],
        });
    }
}

describe('ProviderOnboardingService', () => {
    let service: ProviderOnboardingService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ProviderOnboardingService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ProviderOnboardingService);
        const uiglobals = new UIRouterGlobals();
        uiglobals.$current = StateObject.create({ name: 'app.healthcrm' });
    });

    it('should tested methods', () => {
        const stepper = {
            steps: {
                _results: [{ completed: false }, { completed: false }],
                length: 1,
            },
            changeStep: () => {},
            next: () => {},
        };
        spyOn(service, 'setupCompleteness').and.callThrough();
        service.setupCompleteness(stepper);
        const component = {
            ownerTableModel: {},
            providerData: {},
        };
        service.returnComponent();
        service.refreshComponent({});
        service.fetchOrganisation(component);
        service.fetchProvider(component);
        service.component = component;
        service.fetchProvider();
        service.setupOwnerFormTable(component);
        expect(service.setupCompleteness).toHaveBeenCalled();
    });
});

const uIRouterGlobalsStub2 = {
    current: {
        name: 'state',
    },
    params: {},
    $current: {
        params: {},
    },
};

class SilStoresServiceStub2 {
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
}

describe('ProviderOnboardingService: error', () => {
    let service: ProviderOnboardingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ProviderOnboardingService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ProviderOnboardingService);
    });

    it('should test failure', () => {
        const stepper = {
            steps: {
                _results: [{ completed: false }, { completed: false }],
                length: 1,
            },
            changeStep: () => {},
            next: () => {},
        };
        const component = {
            ownerTableModel: {},
            providerData: {},
        };
        spyOn(service, 'fetchOrganisation').and.callThrough();
        service.fetchOrganisation(component);
        service.fetchProvider(component);
        service.setupCompleteness(stepper);
        service.setupOwnerFormTable(component);
        expect(service.fetchOrganisation).toHaveBeenCalled();
    });
});

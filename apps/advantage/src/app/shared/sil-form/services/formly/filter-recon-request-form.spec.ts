import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FilterReconRequestService } from './filter-recon-request-form';
import { BehaviorSubject, of } from 'rxjs';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { NbToastrService } from '@nebular/theme';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

const uIRouterGlobalsStub = {
    params: {
        id: '112',
    },
};

class SilStoresServiceStub {
    list() {
        return of([{ name: 'Reason 1' }, { name: 'Reason 2' }]);
    }

    get() {
        return of({
            id: '123',
        });
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getAutoreconSettings() {
        return {
            organisation_slade_code: '123',
        };
    }
    getUser() {
        return {
            bp_type: 'PROVIDER',
        };
    }
    getOrganisationData() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class PayerAuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getAutoreconSettings() {
        return {
            organisation_slade_code: '123',
        };
    }
    getUser() {
        return {
            bp_type: 'PAYER',
        };
    }
    getOrganisationData() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class NbToastrServiceStub {
    show() {
        return {};
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
    includes() {
        return true;
    }
    transitionTo() {
        return true;
    }
}

describe('FilterReconRequestService', () => {
    let service: FilterReconRequestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(FilterReconRequestService);
    });

    it('should test fields', () => {
        const comp = {
            fields: [
                {},
                {},
                {
                    props: {
                        options: [
                            {
                                name: 'DESCRIPTION',
                            },
                            {
                                name: 'Ailment/ Condition Not Covered',
                            },
                        ],
                    },
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const field0 = {
            model: {
                created: '2025-01-17T07:56:06.490199Z',
            },
            props: {},
        };
        fields[0]['model.created'] = field0;
        fields[0].expressions['model.created'](field0);

        const field = {};
        field['model'] = {
            rejection_reason: 'Ailment/ Condition Not Covered',
        };

        const field3 = {
            model: {
                rejection_reason: 'DESCRIPTION',
            },
            props: {},
        };
        fields[3]['model.rejection_reason'] = field3;
        fields[3].hooks.onInit(field);

        expect(service.fields).toBeDefined();
    });

    it('should update rejection reason options and call detectChanges', () => {
        const fieldMock = {
            props: {
                options: [],
            },
        };

        service.component = {
            cd: {
                detectChanges: jasmine.createSpy('detectChanges'),
            },
        };

        service.getRejectionReasons(fieldMock);

        expect(fieldMock.props.options).toEqual([
            { name: 'Reason 1' },
            { name: 'Reason 2' },
        ]);

        expect(service.component.cd.detectChanges).toHaveBeenCalled();
    });
});

describe('FilterReconRequestService when logged in as a PAYER', () => {
    let service: FilterReconRequestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: PayerAuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(FilterReconRequestService);
    });

    it('should test fields', () => {
        const comp = {
            fields: [
                {},
                {},
                {
                    props: {
                        options: [
                            {
                                name: 'DESCRIPTION',
                            },
                            {
                                name: 'Ailment/ Condition Not Covered',
                            },
                        ],
                    },
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const field0 = {
            model: {
                created: '2025-01-17T07:56:06.490199Z',
            },
            props: {},
        };
        fields[0]['model.created'] = field0;
        fields[0].expressions['model.created'](field0);

        const field = {};
        field['model'] = {
            rejection_reason: 'Ailment/ Condition Not Covered',
        };

        const field3 = {
            model: {
                rejection_reason: 'DESCRIPTION',
            },
            props: {},
        };
        fields[3]['model.rejection_reason'] = field3;
        fields[3].hooks.onInit(field);

        expect(service.fields).toBeDefined();
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
}

describe('FilterReconRequestService with error', () => {
    let service: FilterReconRequestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(FilterReconRequestService);
    });

    it('should test handleErrorFxn method', () => {
        spyOn(service, 'handleErrorFxn').and.callThrough();
        service.handleErrorFxn({});
        expect(service.handleErrorFxn).toHaveBeenCalled();
    });
});

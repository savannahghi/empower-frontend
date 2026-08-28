import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { UpdateOrgBranchCustomerService } from './add-org-branch-customer';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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
    reload() {
        return true;
    }
}

class SilStoresServiceStub {
    list() {
        return of(['PATIENT', 'INSURANCE']);
    }

    create() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    update() {
        return of({
            id: '12',
            partner_name: 'partner 1',
        });
    }
}

class SilStoresServiceStubError {
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

class AuthenticationServiceStub {
    isAuthenticated() {
        return true;
    }
}

describe('UpdateOrgBranchCustomerService', () => {
    let service: UpdateOrgBranchCustomerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
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
                    useClass: AuthenticationServiceStub,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(UpdateOrgBranchCustomerService);
    });

    it('should test fields', () => {
        const comp = {
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };

        expect(service).toBeTruthy();
        service.setComponent(comp);

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const field0 = {
            model: {
                partner_name: 'abc',
            },
            props: {},
        };
        fields[0]['model.partner_name'] = field0;

        const field1 = {
            model: {
                customer_type: 'customer_type',
            },
            props: {},
        };
        fields[1]['model.customer_type'] = field1;

        const field2 = {
            model: {
                customer_tax_pin: 'customer_tax_pin',
            },
            props: {},
        };
        fields[2]['model.customer_tax_pin'] = field2;

        const field3 = {
            model: {
                country: 'country',
            },
            props: {},
        };
        fields[3]['model.country'] = field3;

        const field4 = {
            model: {
                currency: 'currency',
            },
            props: {},
        };
        fields[4]['model.currency'] = field4;

        const field5 = {
            model: {
                phone_number: 'phone_number',
            },
            props: {},
        };
        fields[5]['model.phone_number'] = field5;

        const field6 = {
            model: {
                email_address: 'email_address',
            },
            props: {},
        };
        fields[6]['model.email_address'] = field6;
    });
});

import { TestBed } from '@angular/core/testing';
import { AddOpposingEntryFormFieldsService } from './add-opposing-entry-form';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';

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

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
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
class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}
class AuthenticationServiceStub {
    checkSetting(string) {
        return string === 'string';
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

describe('AddOppoingEntryFormFieldsService', () => {
    let service: AddOpposingEntryFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                AddOpposingEntryFormFieldsService,
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AddOpposingEntryFormFieldsService);
    });

    it('should test fields', () => {
        const comp = {
            model: {},
            fields: [{}, {}],
            cd: {
                detectChanges: () => {},
            },
        };
        expect(service).toBeTruthy();
        service.setComponent(comp);

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        service.organisationID = '123';

        const field0 = {
            model: {
                account_name: 'Test Account',
            },
            props: {},
        };
        fields[0]['model.account_name'] = field0;

        const field1 = {
            model: {
                amount: 1000,
            },
            props: {},
        };
        fields[1]['model.amount'] = field1;

        expect(service.fields).toHaveBeenCalled();
    });
});

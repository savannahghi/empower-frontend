import { TestBed } from '@angular/core/testing';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { PostNewJournalEntryFormFieldsService } from './post-new-entry-form';

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

describe('PostNewJournalEntryFormFieldsService', () => {
    let service: PostNewJournalEntryFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                PostNewJournalEntryFormFieldsService,
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
        service = TestBed.inject(PostNewJournalEntryFormFieldsService);
    });

    it('should test fields', () => {
        const comp = {
            model: {},
            fields: [{}, {}, {}, {}, {}, {}],
            cd: {
                detectChanges: () => {},
            },
        };
        expect(service).toBeTruthy();
        service.setComponent(comp);

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        // test first branch payment method name
        service.organisationID = '123';

        // test first field
        const field0 = {
            model: {
                transaction_date: '20-11-2024',
            },
            props: {},
        };
        fields[0]['model.transaction_date'] = field0;

        // test second field
        const field1 = {
            model: {
                entry_type: 'test credit',
            },
            props: {},
        };
        fields[1]['model.entry_type'] = field1;

        // test third field
        const field2 = {
            model: {
                account_name: 'Test Account',
            },
            props: {},
        };
        fields[2]['model.account_name'] = field2;

        // test fourth field
        const field3 = {
            model: {
                name: 'KES',
            },
            props: {},
        };
        fields[3]['model.name'] = field3;

        // test the fifth field
        const field4 = {
            model: {
                amount: 5000,
            },
            props: {},
        };
        fields[4]['modelOptions.amount'] = field4;

        // test the sixth field
        const field5 = {
            model: {
                description: 'Sample description',
            },
            props: {},
        };
        fields[5]['modelOptions.description'] = field5;

        expect(service.fields).toHaveBeenCalled();
    });
});

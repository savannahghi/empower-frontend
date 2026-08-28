import { TestBed } from '@angular/core/testing';
import { EditProfileBasicDetailsFormFieldsService } from './edit-basic-details-form';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AsyncValidatorService } from '../../../../shared/component-services/async-validator.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
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

class AsyncValidatorServiceStub {
    validateUniquenessEditMode() {
        return of({});
    }
}

describe('EditProfileBasicDetailsFormFieldsService', () => {
    let service: EditProfileBasicDetailsFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                EditProfileBasicDetailsFormFieldsService,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: AsyncValidatorService,
                    useClass: AsyncValidatorServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(EditProfileBasicDetailsFormFieldsService);
    });

    it('should test fields', () => {
        const comp = {
            model: {},
            fields: [{}, {}, {}, {}],
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
                first_name: 'test',
            },
            props: {},
        };
        fields[0]['model.first_name'] = field0;

        // test second field
        const field1 = {
            model: {
                last_name: 'test last name',
            },
            props: {},
        };
        fields[1]['model.last_name'] = field1;

        // test third field
        const field2 = {
            model: {
                other_names: 'nickname',
            },
            props: {},
        };
        fields[2]['model.nickname'] = field2;

        // test fourth field
        const field3 = {
            model: {
                email: 'test@savinfo.com',
            },
            props: {},
        };
        fields[3]['model.email'] = field3;

        expect(service.fields).toHaveBeenCalled();
    });
});

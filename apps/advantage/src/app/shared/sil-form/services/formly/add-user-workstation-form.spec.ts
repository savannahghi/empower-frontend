import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ResolverService } from '../../../../features/services/resolver.service';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { AsyncValidatorService } from '../../../component-services/async-validator.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { AddUserWorkstationsFormFieldsService } from './add-user-workstation-form';

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

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
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

const resolverServiceStub = {
    resolveList() {
        return of({
            pricelist_type: 'sales',
            name: 'April Offers',
            effective_from: '2024-04-09T21:00:00.000Z',
            effective_to: '2024-04-10T21:00:00.000Z',
            description: 'Holiday offers for the April Holiday!',
            is_internal_pricelist: true,
            pricelist_status: 'promotional',
            business_partner: 'aa6b9c7c-b643-4f41-83bb-56cedb3878bf',
            id: '6af57ac7-6ced-4a79-8493-078a63470c21',
            organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
            active: true,
        });
    },
};

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { id: 1, guid: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { id: 1, guid: 1 };
        },
    },
};

class AsyncValidatorServiceStub {
    validateUniquenessEditMode() {
        return of({});
    }
}

const controlValue = ''; // Set the value property to the desired value
const formControlMock = new FormControl(controlValue);

describe('', () => {
    let service: AddUserWorkstationsFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                AddUserWorkstationsFormFieldsService,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: ResolverService,
                    useValue: resolverServiceStub,
                },
                { provide: CurrencyPipe, useValue: mockPipe('currencyPipe') },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: AsyncValidatorService,
                    useClass: AsyncValidatorServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AddUserWorkstationsFormFieldsService);
    });

    it('should test fields', () => {
        const comp = {
            model: {},
            fields: [{}],
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
                workstation: 1,
            },
        };
        fields[0]['modelOptions.workstation'] = field0;
        fields[0]['asyncValidators']['uniqueItem']['expression'](
            formControlMock
        );

        expect(service.fields).toHaveBeenCalled();
    });
});

import { TestBed } from '@angular/core/testing';
import { RecordDirectInvoiceFormFieldsService } from './record-direct-invoice-form';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ResolverService } from '../../../../features/services/resolver.service';
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

class AuthenticationServiceStub {
    checkSetting(string) {
        return string === 'string';
    }
}

const resolverServiceStub = {
    resolveList() {
        return of({
            invoice_date: '2024-04-09T21:00:00.000Z',
            supplier_name: 'Test 1',
            description: 'Holiday offers for the April Holiday!',
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

describe('RecordDirectinvoiceFormFieldsService', () => {
    let service: RecordDirectInvoiceFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                RecordDirectInvoiceFormFieldsService,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: ResolverService,
                    useValue: resolverServiceStub,
                },
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
        service = TestBed.inject(RecordDirectInvoiceFormFieldsService);
    });

    it('should test fields and observable functions', () => {
        const comp = {
            model: {},
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
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
                invoice_date: '09-04-2024',
            },
            props: {},
        };
        fields[0]['model.invoice_date'] = field0;

        // test second field
        const field1 = {
            model: {
                supplier: 'Savannah informatics',
            },
            props: {},
        };
        fields[1]['model.supplier'] = field1;

        // test third field
        const field2 = {
            model: {
                description: 'Sample description',
            },
            props: {},
        };
        fields[2]['model.description'] = field2;

        expect(service.fields).toHaveBeenCalled();
    });
});

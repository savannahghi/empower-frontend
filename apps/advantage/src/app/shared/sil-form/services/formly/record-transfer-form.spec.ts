import { TestBed } from '@angular/core/testing';

import { RecordTransferFormService } from './record-transfer-form';
import { CurrencyPipe } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { of } from 'rxjs';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { ResolverService } from '../../../../features/services/resolver.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
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
        return { appointment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

describe('RecordTransferFormService', () => {
    let service: RecordTransferFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                RecordTransferFormService,
                SilCurrencyPipe,
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
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(RecordTransferFormService);
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

        // test first branch name
        const field0 = {
            model: {
                name: 'Operation 1',
            },
            props: {},
        };
        fields[0]['model.name'] = field0;

        // test second branch description field
        const field1 = {
            model: {
                description: 'Description 1',
            },
            props: {},
        };
        fields[1]['model.description'] = field1;

        // test source_location field
        const field2 = {
            model: {
                source_location: 'Source 1',
            },
            props: {},
        };
        fields[2]['model.source_location'] = field2;

        // test destination_location field
        const field3 = {
            model: {
                destination_location: 'Destination 1',
            },
            props: {},
        };
        fields[3]['model.destination_location'] = field3;
    });
});

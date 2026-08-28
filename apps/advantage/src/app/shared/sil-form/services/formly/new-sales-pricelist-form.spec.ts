import { TestBed } from '@angular/core/testing';
import { NewSalesPricelistFieldsService } from './new-sales-pricelist-form';
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
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { FormControl } from '@angular/forms';
import { AsyncValidatorService } from '../../../component-services/async-validator.service';
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

class AsyncValidatorServiceStub {
    validateUniquenessEditMode() {
        return of({});
    }
}

const controlValue = ''; // Set the value property to the desired value
const formControlMock = new FormControl(controlValue);

describe('NewSalesPricelistFormService', () => {
    let service: NewSalesPricelistFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                NewSalesPricelistFieldsService,
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
                {
                    provide: AsyncValidatorService,
                    useClass: AsyncValidatorServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(NewSalesPricelistFieldsService);
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

        // test the first branch pricelist category
        const field0 = {
            model: {
                pricelist_type: 'purchases',
            },
            props: {},
        };
        fields[0]['pricelist_type'] = field0;

        // test second branch pricelist name
        service.organisationID = '123';
        // service.salesPricelistType = 'sales';
        const field1 = {
            model: {
                name: 'April Offers',
            },
            props: {},
        };
        fields[1]['model.name'] = field1;
        fields[1]['asyncValidators']['uniqueItem']['expression'](
            formControlMock
        );

        // test third branch effective_from field
        const field2 = {
            model: {
                effective_from: '2024-04-10T21:00:00.000Z',
            },
            props: {},
        };
        fields[2]['model.effective_from'] = field2;

        // test fourth branch with valid effective_from field
        const field3 = {
            model: {
                effective_from: '2024-04-10T21:00:00.000Z',
            },
            props: {},
        };
        fields[3]['expressions']['props.min'](field3);

        // test fourth branch with the effective_from field not provided
        const field21 = {
            model: {},
            props: {},
        };
        fields[3]['expressions']['props.min'](field21);

        // test fifth template branch
        const field4 = {
            type: 'template',
            props: {
                template: '',
            },
        };
        fields[4]['model.template'] = field4;

        // test sixth description branch
        const field5 = {
            model: {
                description: 'Holiday offers to the April Holiday!',
            },
            props: {},
        };
        fields[5]['model.description'] = field5;

        // test seventh is_internal_pricelist branch
        const field6 = {
            model: {
                is_internal_pricelist: true,
            },
            props: {},
        };
        fields[6]['model.is_internal_pricelist'] = field6;

        // test eighth pricelist_status branch
        const field7 = {
            model: {
                pricelist_type: 'purchases',
                pricelist_status: 'locational',
            },
        };
        fields[7]['model.pricelist_status'] = field7;
        const pricelistOptions = fields[7]['expressions']['props.options'];
        expect(
            pricelistOptions({ model: { pricelist_type: 'sales' } })
        ).toEqual([
            {
                title: 'Default',
                value: 'default',
            },
            { title: 'Locational', value: 'locational' },
            {
                title: 'Customer/Supplier',
                value: 'partner_specific',
            },
            {
                title: 'Promotional',
                value: 'promotional',
            },
            {
                title: 'Navigator',
                value: 'navigator',
            },
        ]);
        expect(
            pricelistOptions({ model: { pricelist_type: 'purchases' } })
        ).toEqual([
            {
                title: 'Default',
                value: 'default',
            },
            {
                title: 'Supplier',
                value: 'partner_specific',
            },
        ]);

        // test ninth template branch
        const field8 = {
            type: 'template',
            model: {
                pricelist_status: 'locational',
                pricelist_type: 'purchases',
            },
            props: {
                template: '',
            },
        };
        fields[8]['expressions']['hide'](field8);
        const customerTemplateHideFn = fields[8]['expressions']['hide'];
        expect(
            customerTemplateHideFn({
                model: {
                    pricelist_status: 'partner_specific',
                    pricelist_type: 'purchases',
                },
            })
        ).toBeTrue();

        // test tenth business_partner_type branch
        const field9 = {
            model: {
                business_partner_type: 'customer',
                pricelist_status: 'partner_specific',
            },
            props: {
                template: '',
            },
        };
        fields[9]['model.business_partner_type'] = field9;
        fields[9]['expressions']['hide'](field9);

        // test eleventh business_partner (customer) branch
        const field10 = {
            model: {
                pricelist_type: 'sales',
                business_partner: '123',
                business_partner_type: 'customer',
            },
            props: {},
        };
        fields[10]['model.business_partner'] = field10;
        fields[10]['expressions']['hide'](field10);

        // test twelfth business_partner (supplier) branch
        const field11 = {
            model: {
                business_partner: '123',
                business_partner_type: 'supplier',
            },
            props: {},
        };
        fields[11]['model.business_partner'] = field11;
        fields[11]['expressions']['hide'](field11);

        const supplierHideFn = fields[11]['expressions']['hide'];
        expect(
            supplierHideFn({
                model: {
                    pricelist_type: 'sales',
                    business_partner_type: 'customer',
                },
            })
        ).toBeTrue();

        expect(
            supplierHideFn({
                model: {
                    pricelist_type: 'sales',
                },
            })
        ).toBeTrue();

        expect(
            supplierHideFn({
                model: {
                    pricelist_type: 'sales',
                    business_partner_type: '',
                },
            })
        ).toBeTrue();

        expect(
            supplierHideFn({
                model: {
                    pricelist_type: 'purchases',
                    pricelist_status: 'default',
                },
            })
        ).toBeTrue();

        expect(
            supplierHideFn({
                model: {
                    business_partner_type: 'supplier',
                },
            })
        ).toBeTrue();

        expect(
            supplierHideFn({
                model: {
                    pricelist_type: 'sales',
                    business_partner_type: 'supplier',
                },
            })
        ).toBeFalse();

        expect(
            supplierHideFn({
                model: {
                    pricelist_type: 'purchases',
                    pricelist_status: 'partner_specific',
                },
            })
        ).toBeFalse();

        expect(service.fields).toHaveBeenCalled();
    });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ResolverService } from '../../../../features/services/resolver.service';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { AsyncValidatorService } from '../../../component-services/async-validator.service';
import { NewDirectPurchaseOrderFieldsService } from './new-direct-purchase-order-form';
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

describe('', () => {
    let service: NewDirectPurchaseOrderFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                NewDirectPurchaseOrderFieldsService,
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
        service = TestBed.inject(NewDirectPurchaseOrderFieldsService);
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
        // service.salesPricelistType = 'sales';

        // test first field
        const field0 = {
            model: {
                required_by: 'internal',
            },
            props: {},
        };
        fields[0]['model.required_by'] = field0;

        // test second field

        // Case 1: when supplier is present
        const pricelistField = fields[2];
        const fieldWithSupplier = {
            model: {
                supplier: 'some-supplier-id',
            },
        };
        expect(pricelistField.expressions.hide(fieldWithSupplier)).toBeFalse();

        // Case 2: when supplier is missing
        const fieldWithoutSupplier = {
            model: {},
        };
        expect(
            pricelistField.expressions.hide(fieldWithoutSupplier)
        ).toBeTrue();

        const fieldInit = {
            props: {},
        };
        service.initializePricelistField = jasmine.createSpy(
            'initializePricelistField'
        );
        pricelistField.hooks.onInit(fieldInit);
        expect(service.initializePricelistField).toHaveBeenCalledWith(
            fieldInit
        );

        // initialize supplierField
        const supplierField = fields[1];

        spyOn(service, 'initializeSupplierField');
        supplierField.hooks.onInit(supplierField);
        expect(service.initializeSupplierField).toHaveBeenCalledWith(
            supplierField
        );

        // test the third field
        const field2 = {
            model: {
                pricelist: '23423423',
            },
            props: {},
        };
        fields[2]['modelOptions.pricelist'] = field2;
        fields[2].hooks.onInit(field2);

        // test fourth field
        const field3 = {
            model: {
                description: 'Goodlife Pharmacy',
            },
            props: {},
        };
        fields[3]['model.description'] = field3;

        expect(service.fields).toHaveBeenCalled();
    });

    it('should call loadPricelistsForSupplier when supplier changes', () => {
        const mockField = {
            formControl: {
                valueChanges: new Subject<string>(),
            },
        };

        spyOn(service, 'loadPricelistsForSupplier');

        service.initializeSupplierField(mockField);

        const testSupplierId = 'abc-supplier-id';

        mockField.formControl.valueChanges.next(testSupplierId);

        expect(service.selectedSupplierId).toBe(testSupplierId);
        expect(service.loadPricelistsForSupplier).toHaveBeenCalledWith(
            testSupplierId
        );
    });

    it('should load pricelists and update field props and form control', () => {
        const mockSupplierId = 'supplier-123';
        const mockPricelists = [
            { id: '1', name: 'Mock Pricelist 1' },
            { id: '2', name: 'Mock Pricelist 2' },
        ];

        const detectChangesSpy = jasmine.createSpy('detectChanges');
        const setValueSpy = jasmine.createSpy('setValue');

        service.component = {
            cd: {
                detectChanges: detectChangesSpy,
            },
        };

        service.pricelistField = {
            props: {},
            formControl: {
                setValue: setValueSpy,
            },
        };

        const dataLayerSpy = spyOn(
            service['dataLayer'],
            'list'
        ).and.returnValue(of({ results: mockPricelists }));

        service.loadPricelistsForSupplier(mockSupplierId);

        expect(dataLayerSpy).toHaveBeenCalledWith('pricelists', {
            business_partner: mockSupplierId,
            page_size: 20,
            pricelist_type: 'purchases',
        });

        expect(service.pricelistField.props.options).toEqual(mockPricelists);
        expect(setValueSpy).toHaveBeenCalledWith(null);
        expect(detectChangesSpy).toHaveBeenCalled();
    });

    it('should set the pricelistField when initialized', () => {
        const mockField = {
            key: 'pricelist',
            props: {
                label: 'Test Pricelist',
            },
        };

        service.initializePricelistField(mockField);

        expect(service.pricelistField).toBe(mockField);
    });
});

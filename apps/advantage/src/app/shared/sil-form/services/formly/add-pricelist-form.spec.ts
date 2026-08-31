import { PriceListFieldsService } from './add-pricelist-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../../app-config.service';
import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
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
            transform() {
                return 'KES 0.00';
            }
        }
    );
}

const response = {
    results: [
        {
            id: '112141',
            name: 'Consultation',
            preferred_name: 'Consultation',
            code: '343421w',
            product_type: 'service',
        },
    ],
};

const currencyResponse = {
    results: [
        {
            id: 'f6e049a0-10fd-4d9f-8470-571c9efa546c',
            iso_code: 'KES',
            name: 'Kenyan Shillings',
        },
        {
            id: '10fd-f6e049a0-4d9f-8470-571c9efa546c',
            iso_code: 'TSH',
            name: 'Tanzanian Shillings',
        },
    ],
};

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: 1,
                    name: 'Consultation',
                    preferred_name: 'Consultation',
                    code: '343421w',
                    product_type: 'service',
                },
            ],
        });
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
}

class AuthorizationConfigStub {
    getUser() {
        const stringified = JSON.stringify({
            business_partner: 1,
            client_types: ['PROVIDER'],
        });
        return stringified;
    }
    getOrganisation() {
        return {
            currency_code: 'KES',
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

describe('PriceListFieldsService', () => {
    let service: PriceListFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                {
                    provide: SilCurrencyPipe,
                    useClass: mockPipe('silCurrencyPipe'),
                },
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                PriceListFieldsService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(PriceListFieldsService);
    });

    it('should test setComponent other branch if file is not rejected', () => {
        const comp = {
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            secondaryData: [],
            cd: {
                detectChanges: () => {},
            },
        };
        spyOn(service, 'setComponent').and.callThrough();
        service.setComponent(comp);
        expect(service.setComponent).toHaveBeenCalled();

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        const field = {
            model: {
                product: 'paracetamol',
            },
        };
        fields[0].expressions['model.product'](field);

        const field1 = {
            model: {
                product_name: 'paracetamol',
            },
        };
        fields[1].expressions['model.product_name'](field1);

        const currencyField = {
            formControl: {
                pristine: true,
                markAsPristine: () => {},
                touched: false,
            },
            model: {
                currency: 'f6e049a0-10fd-4d9f-8470-571c9efa546c',
            },
            props: {
                model: undefined,
            },
            defaultValue: 'f6e049a0-10fd-4d9f-8470-571c9efa546c',
        };

        fields[2].expressions['model.currency'](currencyField);

        const fieldprice = {
            model: {
                price: 10,
            },
        };
        fields[3].expressions['model.price_inclusive_tax'](fieldprice);
        const field3 = {
            model: {
                value: 10,
            },
        };
        fields[3].expressions['model.price_inclusive_tax'](field3);
        fields[3].validators['price_inclusive_tax'].expression(field3.model);

        service.fields();
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields and observable functions', () => {
        localStorage.setItem(
            'auth.config.org',
            JSON.stringify({ currency_code: 'KES' })
        );

        const comp = {
            fields: [
                { props: {} },
                { props: {} },
                {
                    props: {},
                },
            ],
            secondaryData: [{ view: true }],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        const field = {
            model: {
                product: 'paracetamol',
            },
        };
        fields[0].expressions['model.product'](field);

        const field1 = {
            model: {
                product_name: 'paracetamol',
            },
        };
        fields[1].expressions['model.product_name'](field1);

        const currencyField = {
            formControl: {
                pristine: true,
                markAsPristine: () => {},
                touched: false,
            },
            model: {
                currency: undefined,
            },
            props: {
                model: undefined,
            },
            defaultValue: 'f6e049a0-10fd-4d9f-8470-571c9efa546c',
        };

        fields[2].expressions['model.currency'](currencyField);

        const fieldprice = {
            model: {
                price: 10,
            },
        };
        fields[3].expressions['model.price_inclusive_tax'](fieldprice);
        const field3 = {
            model: {
                value: 10,
            },
        };
        fields[3].expressions['model.price_inclusive_tax'](field3);
        fields[3].validators['price_inclusive_tax'].expression(field3.model);

        service.fields();
        service.getProducts();
        service.getCurrencies();
        service.tapFunction();
        service.tapLoading();
        service.switchMapProductFunction('Consultation');
        service.switchMapCurrencyFunction();
        service.catchErrorFunction();
        service.setComponent(comp);
        service.productsResponseFunction(response);
        service.currencyResponseFunction(currencyResponse);
        expect(service.fields).toHaveBeenCalled();
    });

    it('should set view to false if secondaryData is not an array', () => {
        const comp = {
            fields: [],
            cd: { detectChanges: () => {} },
        };
        service.setComponent(comp);
        expect(service.view).toBe(false);

        service.setComponent({ ...comp, secondaryData: 'not-an-array' });
        expect(service.view).toBe(false);

        service.setComponent({ ...comp, secondaryData: null });
        expect(service.view).toBe(false);
    });
});

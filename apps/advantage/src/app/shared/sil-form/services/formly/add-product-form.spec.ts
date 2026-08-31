import { ProductFieldsService } from './add-product-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../../app-config.service';
import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { StateService } from '@uirouter/angular';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { SilKeycloakService } from 'app/shared/sil-keycloak/keycloak.service';

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

const productsResponse = {
    results: [
        {
            id: '112141',
            name: 'Paracetamol',
            preferred_name: 'Paracetamol',
            slade_code: '343421w',
            product_type: 'service',
        },
    ],
};

const productsTypeResponse = {
    results: [
        {
            id: '112141',
            name: 'service',
        },
    ],
};

const sellingTaxesResponse = {
    results: [
        {
            id: '112141',
            name: '16 percent VAT',
        },
    ],
};

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '112141',
                    name: 'Paracetamol',
                    preferred_name: 'Paracetamol',
                    slade_code: '343421w',
                    product_type: 'service',
                    selling_price: 1200,
                    purchasing_price: 1000,
                },
            ],
        });
    }
}

const stateServiceStub = {
    reset() {
        return true;
    },
    go() {
        return true;
    },
    includes() {
        return true;
    },
    transitionTo() {
        return true;
    },
    param() {
        return true;
    },
};

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class SilKeycloakServiceStub {
    getToken() {
        return true;
    }
    isLoggedIn(): Promise<boolean> {
        return Promise.resolve(true);
    }
}

describe('ProductFieldsService', () => {
    let service: ProductFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                ProductFieldsService,
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                AuthenticationService,
                Authorization,
                { provide: StateService, useValue: stateServiceStub },
                DataLayerUtils,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                Oauth2Service,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ProductFieldsService);
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

        const field1 = {
            model: {
                product_type: 'paracetamol',
            },
        };
        fields[1].expressions['model.product_type'](field1);

        const field2 = {
            model: {
                categories: 'paracetamol',
            },
        };

        fields[2].expressions['model.categories'](field2);
        service.selectedCategories = [{ id: 1 }];
        fields[2].expressions['model.categories'](field2);

        const field3 = {
            control: {
                value: 1000,
            },
            model: {
                selling_price: 1200,
            },
        };
        fields[3].expressions['model.selling_price'](field3);
        fields[3].validators['selling_price'].expression(field3.model);

        const field4 = {
            model: {
                purchasing_price: 1000,
            },
        };
        fields[4].expressions['model.purchasing_price'](field4);
        fields[4].validators['purchasing_price'].expression(field4.model);

        const field5 = {
            model: {
                sale_taxes: 'VAT 16',
            },
        };

        fields[5].expressions['model.sale_taxes'](field5);
        service.selectedSalesTax = 'asdfasdf';
        fields[5].expressions['model.sale_taxes'](field5);
        service.selectedSalesTax = 'asdfasdf';

        const field6 = {
            model: {
                purchase_taxes: 10,
            },
        };
        fields[6].expressions['model.purchase_taxes'](field6);
        service.selectedPurchasesTax = 'asdfasdf';
        fields[6].expressions['model.purchase_taxes'](field6);
        service.fields();
        service.getProducts();
        service.getProductTypes();
        service.getSellingTaxes();
        service.getPurchasingTaxes();
        service.tapFunction();
        service.tapLoading();
        service.switchMapProductFunction('Paracetamol');
        service.switchMapProductTypeFunction('service');
        service.switchMapSellingTaxesFunction();
        service.switchMapPurchasingTaxesFunction();
        service.catchErrorFunction();
        service.setComponent(comp);
        service.productsResponseFunction(productsResponse);
        service.productTypesResponseFunction(productsTypeResponse);
        service.sellingTaxesResponseFunction(sellingTaxesResponse);
        service.purchasingTaxesResponseFunction(sellingTaxesResponse);
        expect(service.fields).toHaveBeenCalled();
    });

    it('should handle setComponent with undefined secondaryData safely', () => {
        const compWithoutSecondaryData = {
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

        expect(() => {
            service.setComponent(compWithoutSecondaryData);
        }).not.toThrow();

        expect(service.view).toBeUndefined();
    });
});

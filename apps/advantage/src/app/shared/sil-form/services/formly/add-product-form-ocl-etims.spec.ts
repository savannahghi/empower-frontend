import { OclEtimsProductFieldsService } from './add-product-form-ocl-etims';
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
import { StateService } from '@uirouter/angular';
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
            display_name: 'Paracetamol',
            concept_class: 'Drugs',
            product_type: 'service',
        },
    ],
    data: [
        {
            id: '112141',
            name: 'Paracetamol',
            preferred_name: 'Paracetamol',
            display_name: 'Paracetamol',
            concept_class: 'Drugs',
            slade_code: '343421w',
            product_type: 'service',
            selling_price: 1200,
            purchasing_price: 1000,
            extras: {
                identifiers: [{ type: 'generic', value: '123' }],
            },
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

class SilKeycloakServiceStub {
    getToken() {
        return true;
    }
    isLoggedIn(): Promise<boolean> {
        return Promise.resolve(true);
    }
}

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '112141',
                    name: 'Paracetamol',
                    preferred_name: 'Paracetamol',
                    slade_code: '343421w',
                    display_name: 'Paracetamol',
                    concept_class: 'Drugs',
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

describe('OclEtimsProductFieldsService', () => {
    let service: OclEtimsProductFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                OclEtimsProductFieldsService,
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                AuthenticationService,
                Authorization,
                { provide: StateService, useValue: stateServiceStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
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
        service = TestBed.inject(OclEtimsProductFieldsService);
    });

    it('should test setComponent and form fields', () => {
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
            model: {
                business_partner: 1,
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
                product_type: 'sku',
            },
        };
        fields[0].expressions['model.product_type'](field);

        const field_extra = {
            model: {
                product_type: 'service',
            },
        };
        fields[0].expressions['model.product_type'](field_extra);

        const field1 = {
            model: {
                product: productsResponse.results[0],
            },
        };
        fields[1].expressions['model.identifiers'](field1);

        // identifier type input
        service.fetchProductIdentifiers(productsResponse.results[0]);
        fields[2].fieldArray.fieldGroup[0]['expressions'][
            'model.identifier_value'
        ](field);
        service.fetchProductIdentifiers(productsResponse.data[0]);
        const fieldIdentifierType = {
            model: { identifier_type: 'APID' },
        };
        fields[2].fieldArray.fieldGroup[0]['expressions'][
            'model.identifier_value'
        ](fieldIdentifierType);
        fieldIdentifierType.model.identifier_type = undefined;
        fields[2].fieldArray.fieldGroup[0]['expressions'][
            'model.identifier_type'
        ](fieldIdentifierType);
        service.productIdentifiers = [];
        fields[2].fieldArray.fieldGroup[0]['expressions'][
            'model.identifier_value'
        ](field);

        const field3 = {
            model: {
                scu_item_classification: 'paracetamol',
            },
        };

        fields[3].expressions['model.scu_item_classification'](field3);
        service.selectedCategories = [{ id: 1 }];
        fields[3].expressions['model.scu_item_classification'](field3);

        const field4 = {
            model: {
                item_type: 'title',
            },
        };
        fields[4].expressions['model.item_type'](field4);

        const field5 = {
            model: {
                categories: 'paracetamol',
            },
        };

        fields[5].expressions['model.categories'](field5);
        service.selectedCategories = [{ id: 1 }];
        fields[5].expressions['model.categories'](field5);

        service.selectedCategories = [{ id: 1 }];

        service.selectedSalesTax = 'asdfasdf';

        const field9 = {
            model: {
                sale_taxes: 'VAT 16',
            },
        };

        fields[9].expressions['model.sale_taxes'](field9);
        fields[9].expressions['model.sale_taxes'](field9);

        const field10 = {
            control: {
                value: 1000,
            },
            model: {
                country_of_origin: 'KEN',
            },
        };
        fields[10].expressions['model.country_of_origin'](field10);
        fields[10].expressions['model.country_of_origin'](field10);

        const field11 = {
            control: {
                value: 1000,
            },
            model: {
                selling_price: 1200,
            },
        };
        fields[11].validators['selling_price'].expression({
            value: 1000,
        });
        fields[11].expressions['model.selling_price'](field11);
        /** test for purchasing_price */
        const field12 = {
            control: {
                value: 1000,
            },
            model: {
                purchasing_price: 1200,
            },
        };
        fields[12].validators['purchasing_price'].expression({
            value: 1000,
        });
        fields[12].expressions['model.purchasing_price'](field12);
        /** test for sales tax */
        const field13 = {
            control: {
                value: 1000,
            },
            model: {
                sale_taxes: 1200,
            },
        };
        fields[13].expressions['model.sale_taxes'](field13);
        service.selectedSalesTax = undefined;
        fields[13].expressions['model.sale_taxes'](field13);

        const field14 = {
            model: {
                purchase_taxes: 'VAT 16',
            },
        };

        fields[14].expressions['model.purchase_taxes'](field14);
        fields[14].expressions['model.purchase_taxes'](field14);

        service.fields();
        service.getProducts();
        service.getSellingTaxes();
        service.getPurchasingTaxes();
        service.tapFunction();
        service.tapLoading();
        service.switchMapProductFunction('Paracetamol');
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

    it('should test getProducts with source specified', () => {
        spyOn(service, 'getProducts').and.callThrough();
        service.source = 'loinc';
        service.getProducts('maina');
        expect(service.getProducts).toHaveBeenCalled();
    });

    it('should test getProducts with source unspecified', () => {
        spyOn(service, 'getProducts').and.callThrough();
        service.source = null;
        service.getProducts('maina');
        expect(service.getProducts).toHaveBeenCalled();
    });
    it('should test fetchProductIdentifiers', () => {
        spyOn(service, 'fetchProductIdentifiers').and.callThrough();
        const product = {
            id: '12345',
            extras: {
                identifiers: [{}],
                nested: [
                    {
                        loinc_mapping: {
                            loinc_num: '123',
                        },
                    },
                ],
            },
        };
        service.fetchProductIdentifiers(product);
        expect(service.fetchProductIdentifiers).toHaveBeenCalled();
    });
});

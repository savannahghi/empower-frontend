import { EtimsProductFieldsService } from './add-product-form-etmis';
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

class AuthorizationConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
    loginUrl() {
        return of(() => {});
    }
    logout() {
        return of(() => {});
    }
    storeToken() {
        return true;
    }
    isLoggedIn() {
        return true;
    }

    setOrganisationSettings() {
        return of(() => {});
    }

    setOrganisation() {
        return of(() => {});
    }
    setOrganisationDetails() {
        return of({
            client_types: ['PRACTITIONER'],
        });
    }
    setUserDetails() {
        return of(() => {});
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }

    setUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }

    getUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getToken() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    setAdvantageOrganisation() {
        return {};
    }
    setAdvantageOrganisationDetails() {
        return of(() => {});
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: [{ workstation: '1' }],
        };
    }
    removeTokenData() {
        return {};
    }
}

describe('EtimsProductFieldsService', () => {
    let service: EtimsProductFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                EtimsProductFieldsService,
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                AuthenticationService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
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
        service = TestBed.inject(EtimsProductFieldsService);
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
                name: 'paracetamol',
            },
        };
        const sladeCodeField = {
            model: {
                slade_code: 'CM-10',
            },
        };

        fields[0].expressions['model.name'](field);
        fields[0].expressions['model.slade_code'](sladeCodeField);

        const field1 = {
            model: {
                product_type: 'paracetamol',
            },
        };
        fields[1].expressions['model.product_type'](field1);

        // identifier type input
        fields[2].fieldArray.fieldGroup[0]['expressions'][
            'model.identifier_type'
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
    it('should set view from secondaryData if present', () => {
        const testObj = { testKey: 'testValue' };
        const comp = {
            fields: [],
            secondaryData: [testObj],
            cd: { detectChanges: () => {} },
            model: {},
        };
        service.setComponent(comp);
        expect(service.view).toBeTruthy();
        expect((service.view as any).testKey).toBe('testValue');
    });
});

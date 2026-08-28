import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AddDirectInvoiceItemsFieldsService } from './add-direct-invoice-items-form';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { of } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { UIRouterGlobals } from '@uirouter/angular';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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
        };
    }
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

class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { id: 1 };
        },
    },
};

describe('AddDirectinvoiceItemsFieldsService', () => {
    let service: AddDirectInvoiceItemsFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AddDirectInvoiceItemsFieldsService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AddDirectInvoiceItemsFieldsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the component', () => {
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

        spyOn(service, 'setComponent').and.callThrough();
        service.setComponent(comp);
        expect(service.setComponent).toHaveBeenCalled();
        expect(service.setComponent).toHaveBeenCalledWith(comp);
    });

    it('should return the correct fields with a selectedItem', () => {
        service.model = {
            product_or_service: 'product 2',
            selectedItem: {
                price_inclusive_tax: '20',
            },
            adjusted_price: '200',
        };
        const fieldMock = {
            model: {
                selectedItem: {
                    price_inclusive_tax: '20',
                },
            },
        };
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const productOrService = {
            model: {
                name: 'product_or_service',
            },
        };
        fields[0]['model.product_or_service'] = productOrService;
        fields[0].expressions['model.adjusted_price'](fieldMock);

        const adjustedPrice = {
            model: {
                name: 'adjusted_price',
            },
        };
        fields[1]['model.adjusted_price'] = adjustedPrice;

        const quantity = {
            model: {
                name: 'quantity',
            },
        };
        fields[2]['model.quantity'] = quantity;

        expect(service.fields).toHaveBeenCalled();
    });

    it('should return undefined when selectedItem is missing', () => {
        service.model = {
            product_or_service: 'product 2',
            selectedItem: undefined,
            adjusted_price: '200',
        };

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const fieldMock = {
            model: {
                selectedItem: undefined,
            },
        };

        const undefinedField =
            fields[0].expressions['model.adjusted_price'](fieldMock);

        expect(undefinedField).toBeUndefined();
    });
});

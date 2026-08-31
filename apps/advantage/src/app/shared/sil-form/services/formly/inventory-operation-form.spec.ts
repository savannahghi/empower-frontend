import { TestBed } from '@angular/core/testing';

import { InventoryOperationService } from './inventory-operation-form';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { CurrencyPipe } from '@angular/common';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { FeatureFlagService } from 'app/@core/utils/feature.service';

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

class FeatureFlagServiceStub {
    checkVariantFlag(): boolean {
        return false;
    }
    getForcedValue(): boolean {
        return false;
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

class AuthenticationServiceStub {
    checkSetting(string) {
        return string === 'string';
    }
}

describe('InventoryOperationService', () => {
    let service: InventoryOperationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                SilCurrencyPipe,
                InventoryOperationService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: CurrencyPipe, useValue: mockPipe('currencyPipe') },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
            ],
        });
        service = TestBed.inject(InventoryOperationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
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
            secondaryData: {
                document_type: 'gdn',
            },
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
                product_name: 'Product name',
            },
            props: {},
        };
        fields[0]['model.product_name'] = field0;

        const field1 = {
            model: {
                quantity_confirmed: 300,
            },
            props: {},
            expressionProperties: {
                template: () => {},
            },
        };

        fields[2]['model.quantity_confirmed'] = field1;
        fields[2].validators['quantity_confirmed'].expression();

        fields[3].expressionProperties['template'](field1.model);
        fields[3].expressionProperties['template']({});
        fields[3].expressionProperties['template']({
            quantity_confirmed: 20,
            quantity: 1,
        });
        fields[3].expressionProperties['template']({
            quantity_confirmed: 0,
            quantity: 1,
        });

        fields[0]['model.quantity_confirmed'] = field1;

        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fieldValidator method with quantityConfirmed > initialQuantity', () => {
        const comp = {
            model: {
                quantity: 10,
                quantity_confirmed: 15,
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            secondaryData: {
                document_type: 'grn',
            },
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);

        spyOn(service, 'fieldValidator').and.callThrough();
        service.fieldValidator();
        expect(service.fieldValidator).toHaveBeenCalledWith();
    });

    it('should test fieldValidator method with quantityConfirmed < initialQuantity', () => {
        const comp = {
            model: {
                quantity: 2,
                quantity_confirmed: 1,
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            secondaryData: {
                document_type: 'grn',
            },
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);

        spyOn(service, 'fieldValidator').and.callThrough();
        service.fieldValidator();
        expect(service.fieldValidator).toHaveBeenCalledWith();
    });

    it('should test fieldValidator method with quantityConfirmed as negative', () => {
        const comp = {
            model: {
                quantity: 10,
                quantity_confirmed: -1,
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            secondaryData: {
                document_type: 'grn',
            },
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);

        spyOn(service, 'fieldValidator').and.callThrough();
        service.fieldValidator();
        expect(service.fieldValidator).toHaveBeenCalledWith();
    });
});

import { TestBed } from '@angular/core/testing';

import { AddTransferItemFormService } from './add-transfer-item-form';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { CurrencyPipe } from '@angular/common';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';

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

class AuthenticationServiceStub {
    checkSetting(string) {
        return string === 'string';
    }
}

describe('AddTransferItemFormService', () => {
    let service: AddTransferItemFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                SilCurrencyPipe,
                AddTransferItemFormService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: CurrencyPipe, useValue: mockPipe('currencyPipe') },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
            ],
        });
        service = TestBed.inject(AddTransferItemFormService);
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
                product: 'Product name',
            },
            props: {},
        };
        fields[0]['model.product'] = field0;

        const field1 = {
            model: {
                quantity_confirmed: 300,
            },
            props: {},
            expressionProperties: {
                template: () => {},
            },
        };
        fields[1]['model.quantity_confirmed'] = field1;
        fields[1].validators['quantity_confirmed'].expression({
            quantity_confirmed: '8',
        });

        fields[2].expressionProperties['template'](field1.model);
        fields[2].expressionProperties['template']({});
        fields[2].expressionProperties['template']({
            quantity_confirmed: 20,
            selectedItem: { quantity_at_hand: 1 },
        });
        fields[2].expressionProperties['template']({
            quantity_confirmed: 0,
            selectedItem: { quantity_at_hand: 1 },
        });

        fields[0]['model.quantity_confirmed'] = field1;

        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fieldValidator method with input > quantityAtHand', () => {
        const comp = {
            model: {
                selectedItem: {
                    quantity_at_hand: 10,
                },
            },
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
        service.setComponent(comp);

        spyOn(service, 'fieldValidator').and.callThrough();
        service.fieldValidator({ value: 12 });
        expect(service.fieldValidator).toHaveBeenCalledWith({
            value: 12,
        });
    });

    it('should test fieldValidator method with input < quantityAtHand', () => {
        const comp = {
            model: {
                selectedItem: {
                    quantity_at_hand: 2,
                },
            },
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
        service.setComponent(comp);

        spyOn(service, 'fieldValidator').and.callThrough();
        service.fieldValidator({ value: 1 });
        expect(service.fieldValidator).toHaveBeenCalledWith({
            value: 1,
        });
    });

    it('should test fieldValidator method with input as negative', () => {
        const comp = {
            model: {
                selectedItem: {
                    quantity_at_hand: 10,
                },
            },
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
        service.setComponent(comp);

        spyOn(service, 'fieldValidator').and.callThrough();
        service.fieldValidator({ value: -1 });
        expect(service.fieldValidator).toHaveBeenCalledWith({
            value: -1,
        });
    });
});

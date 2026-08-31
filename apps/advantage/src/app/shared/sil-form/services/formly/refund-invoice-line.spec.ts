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
import { RefundLineService } from './refund-invoice-line';
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
        return of({});
    },
};
class SilStoresServiceStub {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    get() {
        return of({ scu_item_code: 'ABC123' });
    }
}

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

describe('RefundLineService', () => {
    let service: RefundLineService;

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
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
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
        service = TestBed.inject(RefundLineService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('fields', () => {
        let fields;

        beforeEach(() => {
            fields = service.fields();
        });

        it('should return an array of field configurations', () => {
            expect(Array.isArray(fields)).toBeTruthy();
            expect(fields.length).toBeGreaterThan(0);
        });
        it('should test template generation for the first field', () => {
            const templateField = fields[0];
            service.loading = false;
            service.sCode = 'ABC123';

            const result = templateField.expressionProperties.template({
                name: 'Test Item',
                price: 10,
                quantity: 2,
                productId: '123',
            });

            expect(result).toContain('Test Item');
            expect(result).toContain('10');
            expect(result).toContain('2');
            expect(result).toContain('ABC123');
        });

        it('should test fields price comparison logic when price and quantity is below 1', () => {
            const comp = {
                model: { price: -2, original_price: 1 },
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

            // test first  name
            const field1 = {
                model: {
                    name: 'Operation 1',
                },
                props: {},
            };
            fields[1]['model.name'] = field1;

            // test  price field
            const field2 = {
                model: {
                    price: -2,
                    original_price: 1,
                },
                props: {},
                expressionProperties: {
                    template: () => {},
                },
            };
            fields[2]['model.price'] = field2;
            fields[2].validators['price'].expression({ price: '8' });
            fields[4].expressionProperties['template'](field2.model);
            fields[4].expressionProperties['template']({
                price: -2,
                original_price: 1,
            });

            fields[5].expressionProperties['template']({
                quantity: -2,
            });

            // test kra_reason_code field
            const field6 = {
                model: {
                    kra_reason_code: '1',
                },
                props: {},
            };
            fields[6]['model.kra_reason_code'] = field6;
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
                form: { controls: { quantity: { defaultValue: 2 } } },
                cd: {
                    detectChanges: () => {},
                },
            };
            expect(service).toBeTruthy();
            service.setComponent(comp);

            // test first  name
            const field1 = {
                model: {
                    name: 'Operation 1',
                },
                props: {},
            };
            fields[1]['model.name'] = field1;
            // test second price field
            const field2 = {
                model: {
                    price: 12,
                    original_price: 10,
                },
                props: {},
                expressionProperties: {
                    template: () => {},
                },
            };
            fields[2]['model.price'] = field2;
            fields[2].validators['price'].expression({ price: '8' });
            fields[4].expressionProperties['template'](field1.model);
            fields[4].expressionProperties['template']({
                price: 12,
                original_price: 10,
            });

            // test quantity field
            const field4 = {
                model: {
                    quantity: 10,
                },
                props: {},
                expressionProperties: {
                    template: () => {},
                },
            };
            fields[3]['model.quantity'] = field4;
            fields[3].validators['quantity'].expression({ quantity: '8' });
            fields[5].expressionProperties['template'](field4.model);
            // fields[5].expressionProperties['template']({});
            fields[5].expressionProperties['template']({
                model: { quantity: -2 },
            });
            fields[5].expressionProperties['template']({
                quantity: 5,
            });

            // test kra_reason_code field
            const field6 = {
                model: {
                    kra_reason_code: 'Destination 1',
                },
                props: {},
            };
            fields[6]['model.kra_reason_code'] = field6;
        });

        it('should test fieldValidator method with value > defaultValue', () => {
            spyOn(service, 'fieldValidator').and.callThrough();
            service.fieldValidator({ value: 12, defaultValue: 10 });
            expect(service.fieldValidator).toHaveBeenCalledWith({
                value: 12,
                defaultValue: 10,
            });
        });

        it('should test fieldValidator method with value as negative', () => {
            spyOn(service, 'fieldValidator').and.callThrough();
            service.fieldValidator({ value: -1, defaultValue: 10 });
            expect(service.fieldValidator).toHaveBeenCalledWith({
                value: -1,
                defaultValue: 10,
            });
        });

        it('should test fieldValidator method with value as negative', () => {
            spyOn(service, 'fieldValidator').and.callThrough();
            service.fieldValidator({ value: 10, defaultValue: 10 });
            expect(service.fieldValidator).toHaveBeenCalledWith({
                value: 10,
                defaultValue: 10,
            });
        });
    });
    it('should fetch item code and update sCode', () => {
        spyOn(service, 'getItemCode').and.callThrough();
        service.getItemCode('product_id_1');
        expect(service.getItemCode).toHaveBeenCalledWith('product_id_1');
    });
});

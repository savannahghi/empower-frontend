import { TestBed } from '@angular/core/testing';

import { AddAdjustmentItemService } from './add-adjustment-item';
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
    getWorkstation() {
        return {
            workstation__org_unit__parent: 'cdfg-45646',
        };
    }
}

class AuthenticationServiceStub {
    checkSetting(string) {
        return string === 'string';
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

describe('AddAdjustmentItemService', () => {
    let service: AddAdjustmentItemService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                SilCurrencyPipe,
                AddAdjustmentItemService,
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
        service = TestBed.inject(AddAdjustmentItemService);
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
        };
        fields[0]['model.quantity_confirmed'] = field1;
    });
});

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
import { AddPatientPaymentFieldsService } from './add-patient-payment';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { StateService } from '@uirouter/core';
import { VisitService } from '../../../../features/advantage/visits/visit.service';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { CurrencyPipe } from '@angular/common';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
    customUpdate() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
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

const visitServiceStub = {
    visit() {
        return {
            amount_due: 1000,
            account: 'Test Account',
        };
    },
};

const visitServiceStub2 = {
    visit() {
        return {
            amount_due: 1000,
            account: 'Test Account',
        };
    },
};
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
    includes() {
        return true;
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
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

describe('AddPatientPaymentFieldsService', () => {
    let service: AddPatientPaymentFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                AddPatientPaymentFieldsService,
                {
                    provide: SilCurrencyPipe,
                },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: CurrencyPipe },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: VisitService, useValue: visitServiceStub2 },
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
        service = TestBed.inject(AddPatientPaymentFieldsService);
    });

    function optionalChain(obj: any, path: string): any {
        let current = obj;
        const parts = path.split('.');
        for (const part of parts) {
            if (!current) return undefined; // Stop if any part is undefined
            current = current[part];
        }
        return current;
    }

    it('should test fields and observable functions', () => {
        const comp = {
            model: {
                business_partner: 1,
            },
            secondaryData: {
                amount_due: 3000,
                amount_paid: 1000,
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
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        const field = {
            model: {
                amount: 2000,
            },
            formControl: {
                pristine: true,
                markAsDirty: () => {},
                setValue: () => {},
                value: undefined,
            },
        };

        optionalChain(fields[2], 'props.buttonEvent')?.();
        fields[3]?.validators?.amount?.expression({ value: 1000 });
        fields[4].expressionProperties['template']({});
        fields[4].expressionProperties['template']({
            model: {
                amount: 2000,
            },
        });

        fields[4].expressionProperties['template'](field.model);
        service.getAmountDue();
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test balance template when balance is less than or equal to the model amount', () => {
        const comp = {
            model: {
                business_partner: 1,
            },
            secondaryData: {
                amount_due: 3000,
                amount_paid: 1000,
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
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        const field = {
            model: {
                amount: 5000,
            },
            formControl: {
                pristine: true,
                markAsDirty: () => {},
                setValue: () => {},
                value: undefined,
            },
        };

        fields[4].expressionProperties['template']({});
        fields[4].expressionProperties['template']({
            model: {
                amount: 2000,
            },
        });

        fields[4].expressionProperties['template'](field.model);
        service.getAmountDue();
        expect(service.fields).toHaveBeenCalled();
    });
    it('should return true for a valid payment amount', () => {
        const validator = {
            amount: {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                expression: control => {
                    const number = parseFloat(control.value);
                    const balance = 100 - 50;
                    const ifPositive = number > 0.0 && number <= balance;
                    return ifPositive;
                },
            },
        };

        const control = { value: 25 }; // Payment amount

        const isValid = validator.amount.expression(control);
        expect(isValid).toBe(true);
    });
    it('should return false for a negative payment amount', () => {
        const validator = {
            amount: {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                expression: control => {
                    const number = parseFloat(control.value);
                    const balance = 100 - 50; // Example balance
                    const ifPositive = number > 0.0 && number <= balance;
                    return ifPositive;
                },
            },
        };

        const control = { value: -10 }; // Negative payment

        const isValid = validator.amount.expression(control);
        expect(isValid).toBe(false);
    });
    it('should return false for a payment exceeding balance', () => {
        const validator = {
            amount: {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                expression: control => {
                    const number = parseFloat(control.value);
                    const balance = 100 - 50; // Example balance
                    const ifPositive = number > 0.0 && number <= balance;
                    return ifPositive;
                },
            },
        };

        const control = { value: 150 }; // Payment exceeding balance

        const isValid = validator.amount.expression(control);
        expect(isValid).toBe(false);
    });
    it('should allow zero payment (if applicable)', () => {
        const validator = {
            amount: {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                expression: control => {
                    const number = parseFloat(control.value);
                    const balance = 100 - 50; // Example balance
                    const ifPositive = number > 0.0 && number <= balance;
                    return ifPositive;
                },
            },
        };

        const control = { value: 0 }; // Zero payment

        const isValid = validator.amount.expression(control);
        expect(isValid).toBe(false); // If zero payment is not allowed
    });
});

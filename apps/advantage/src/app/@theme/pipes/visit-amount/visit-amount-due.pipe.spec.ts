import { TestBed } from '@angular/core/testing';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { VisitAmountPipe } from './visit-amount-due.pipe';
import { SilCurrencyPipe } from '../currency/currency.pipe';
import { CurrencyPipe } from '@angular/common';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { DataLayerUtils } from 'app/@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from 'app/@core/auth/services/oauth2.service';
import { StateService } from '@uirouter/core';
import { AppConfigService } from 'app/app-config.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SilKeycloakService } from 'app/shared/sil-keycloak/keycloak.service';

// Mock for Cookies
class MockCookies {
    private cookies: { [key: string]: string } = {};

    get(name: string): string {
        return this.cookies[name] || '';
    }

    set(name: string, value: string): void {
        this.cookies[name] = value;
    }

    delete(name: string): void {
        delete this.cookies[name];
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

class SilKeycloakServiceStub {
    getToken() {
        return true;
    }
    isLoggedIn(): Promise<boolean> {
        return Promise.resolve(true);
    }
}

describe('VisitAmountDuePipe', () => {
    let pipe: VisitAmountPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DataLayerUtils,
                AppConfigService,
                VisitAmountPipe,
                SilCurrencyPipe,
                CurrencyPipe,
                Authorization,
                Oauth2Service,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: SsrCookieService, useClass: MockCookies }, // Provide the mock
            ],
        });
        pipe = TestBed.inject(VisitAmountPipe);
    });

    it('should create an instance', () => {
        const obj = {
            invoice: {
                amount_due: 100,
                amount_paid: 90,
                invoice_lines: [{}],
            },
        };
        let res = pipe.transform(obj);
        expect(res).toBe('KES 10.00 still due');
        obj.invoice.amount_due = 100;
        obj.invoice.amount_paid = 100;
        res = pipe.transform(obj);
        expect(res).toBe('Amount has been fully paid');
        obj.invoice.amount_due = 100;
        obj.invoice.amount_paid = 100;
        obj.invoice.invoice_lines = [];
        res = pipe.transform(obj);
        expect(res).toBe('Nothing has been billed yet');
        obj.invoice.amount_due = 90;
        obj.invoice.amount_paid = 100;
        obj.invoice.invoice_lines = [{}];
        res = pipe.transform(obj);
        expect(res).toBe('Overpaid for the service');
        obj.invoice.amount_due = 90;
        obj.invoice.amount_paid = 100;
        obj.invoice.invoice_lines = [];
        res = pipe.transform(obj);
        expect(res).toBe('Undetermined state of the bill');
        expect(pipe).toBeTruthy();
    });
});

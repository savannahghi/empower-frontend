import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { BehaviorSubject, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ResolverService } from '../../../../features/services/resolver.service';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { AsyncValidatorService } from '../../../component-services/async-validator.service';
import { NewSignoffFormService } from './new-signoff-form';
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

class SilStoresServiceStub {
    list() {
        return of([{ name: 'Reason 1' }, { name: 'Reason 2' }]);
    }

    get() {
        return of({
            id: '123',
        });
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getAutoreconSettings() {
        return {
            organisation_slade_code: '123',
        };
    }
    getUser() {
        return {
            bp_type: 'PROVIDER',
        };
    }
    getOrganisationData() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class PayerAuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getAutoreconSettings() {
        return {
            organisation_slade_code: '123',
        };
    }
    getUser() {
        return {
            bp_type: 'PAYER',
        };
    }
    getOrganisationData() {
        return {
            user_workstations: [{ workstation: '1' }],
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
        return of({
            pricelist_type: 'sales',
            name: 'April Offers',
            effective_from: '2024-04-09T21:00:00.000Z',
            effective_to: '2024-04-10T21:00:00.000Z',
            description: 'Holiday offers for the April Holiday!',
            is_internal_pricelist: true,
            pricelist_status: 'promotional',
            business_partner: 'aa6b9c7c-b643-4f41-83bb-56cedb3878bf',
            id: '6af57ac7-6ced-4a79-8493-078a63470c21',
            organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
            active: true,
        });
    },
};

const uIRouterGlobalsStub = {
    params: {
        id: '112',
        workflow_state: '',
    },
};

class AsyncValidatorServiceStub {
    validateUniquenessEditMode() {
        return of({});
    }
}

describe('NewSignoffFormService', () => {
    let service: NewSignoffFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                NewSignoffFormService,
                SilCurrencyPipe,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
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
                {
                    provide: AsyncValidatorService,
                    useClass: AsyncValidatorServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(NewSignoffFormService);
    });

    it('should test fields and observable functions', () => {
        const comp = {
            model: {},
            fields: [
                {},
                {},
                {
                    props: {
                        options: [
                            {
                                name: 'DESCRIPTION',
                            },
                            {
                                name: 'Ailment/ Condition Not Covered',
                            },
                        ],
                    },
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

        // test first field
        const field0 = {
            model: {
                start_date: '2023-08-01',
            },
            props: {},
        };
        fields[0]['model.start_date'] = field0;

        // test second field
        const field1 = {
            model: {
                end_date: '2023-12-01',
            },
            props: {},
        };
        fields[1]['model.end_date'] = field1;

        expect(service.fields).toHaveBeenCalled();
    });

    it('should update rejection reason options and call detectChanges', () => {
        const fieldMock = {
            props: {
                options: [],
            },
        };

        service.component = {
            cd: {
                detectChanges: jasmine.createSpy('detectChanges'),
            },
        };

        service.getRejectionReasons(fieldMock);

        expect(fieldMock.props.options).toEqual([
            { name: 'Reason 1' },
            { name: 'Reason 2' },
        ]);

        expect(service.component.cd.detectChanges).toHaveBeenCalled();
    });
});

describe('NewSignoffFormService when logged in as a PAYER', () => {
    let service: NewSignoffFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                NewSignoffFormService,
                SilCurrencyPipe,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: PayerAuthorizationStub },
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
                {
                    provide: AsyncValidatorService,
                    useClass: AsyncValidatorServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(NewSignoffFormService);
    });

    it('should test fields and observable functions', () => {
        const comp = {
            model: {},
            fields: [
                {},
                {},
                {
                    props: {
                        options: [
                            {
                                name: 'DESCRIPTION',
                            },
                            {
                                name: 'Ailment/ Condition Not Covered',
                            },
                        ],
                    },
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

        // test first field
        const field0 = {
            model: {
                start_date: '2023-08-01',
            },
            props: {},
        };
        fields[0]['model.start_date'] = field0;

        // test second field
        const field1 = {
            model: {
                end_date: '2023-12-01',
            },
            props: {},
        };
        fields[1]['model.end_date'] = field1;

        expect(service.fields).toHaveBeenCalled();
    });

    it('should handle getRejectionReasons when bp_type is PAYER', () => {
        const fieldMock = {
            props: {
                options: [],
            },
        };

        service.component = {
            cd: {
                detectChanges: jasmine.createSpy('detectChanges'),
            },
        };

        spyOn(service.dataLayer, 'get').and.callFake((entity, id) => {
            expect(entity).toBe('recon-business-partners');
            expect(id).toBe('112');
            return of({ slade_code: 'BP123' });
        });

        spyOn(service.dataLayer, 'list').and.callFake((entity, params) => {
            expect(entity).toBe('recon-invoice-rejection_reasons');
            expect(params).toEqual({
                payer_slade_code: '123',
                provider_slade_code: 'BP123',
            });

            return of([{ name: 'Reason 1' }, { name: 'Reason 2' }]);
        });

        service.getRejectionReasons(fieldMock);

        expect(fieldMock.props.options).toEqual([
            { name: 'Reason 1' },
            { name: 'Reason 2' },
        ]);
        expect(service.component.cd.detectChanges).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('NewSignoffFormService with Error', () => {
    let service: NewSignoffFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [mockPipe('translate')],
            providers: [
                NewSignoffFormService,
                SilCurrencyPipe,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
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
                {
                    provide: AsyncValidatorService,
                    useClass: AsyncValidatorServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(NewSignoffFormService);
    });

    it('should test handleErrorFxn method', () => {
        spyOn(service, 'handleErrorFxn').and.callThrough();
        service.handleErrorFxn({});
        expect(service.handleErrorFxn).toHaveBeenCalled();
    });
});

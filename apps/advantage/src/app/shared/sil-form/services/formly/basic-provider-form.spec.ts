import { ProviderFieldsService } from './basic-provider-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../../app-config.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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
    isNestedList() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

describe('ProviderFieldsService', () => {
    let service: ProviderFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ProviderFieldsService,
                Authorization,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ProviderFieldsService);
    });

    it('should test fields', () => {
        const comp = {
            model: {
                business_partner: 1,
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
        expect(service.fields).toHaveBeenCalled();

        // expression tests
        const expField = {
            model: {
                business_partner: {
                    name: 'Provider',
                    slade_code_counter: 5072,
                },
                slade_code: 5032,
                branch_names: 'branch',
                web_address: 'test',
                phone_number: '+254722000000',
                email_address: 'test@test.com',
                postal_address: '1343',
                physical_address: 'Address',
                tax_office: 1,
                organisation_country: 'Kenya',
                identifier_type: 'Test',
                identifier_value: '1234',
                financial_year_start_date: '2024-01-01',
            },
        };

        // _expressionProperties: business_partner
        fields[0].expressions['model.business_partner']({ model: {} });
        fields[0].expressions['model.business_partner'](expField);

        // _expressionProperties: slade_code: 1
        fields[1].expressions['model.slade_code']({ model: {} });
        fields[1].expressions['model.slade_code'](expField);

        // _expressionProperties: organisation_name: 2
        fields[2].expressions['model.organisation_name']({ model: {} });
        fields[2].expressions['model.organisation_name'](expField);

        // _expressionProperties: web address
        fields[3].expressions['model.web_address']({ model: {} });
        fields[3].expressions['model.web_address'](expField);

        // _expressionProperties: preferred contact
        fields[4].expressions['model.preferred_contact']();

        // _expressionProperties: phone number
        fields[5].expressions['model.phone_number']({ model: {} });
        fields[5].expressions['model.phone_number'](expField);

        // _expressionProperties: email_address: 5
        fields[6].expressions['model.email_address']({ model: {} });
        fields[6].expressions['model.email_address'](expField);

        // _expressionProperties: postal_address
        fields[7].expressions['model.postal_address']({ model: {} });
        fields[7].expressions['model.postal_address'](expField);

        // _expressionProperties: physical_address
        fields[8].expressions['model.physical_address']({ model: {} });
        fields[8].expressions['model.physical_address'](expField);

        // _expressionProperties: tax_office
        fields[9].expressions['model.tax_office']({ model: {} });
        fields[9].expressions['model.tax_office'](expField);

        // _expressionProperties: organisation_country
        fields[10].expressions['model.organisation_country']({ model: {} });
        fields[10].expressions['model.organisation_country'](expField);

        // _expressionProperties: financial_year_start_date
        fields[13].expressions['model.financial_year_start_date']({});
        fields[13].expressions['model.financial_year_start_date'](expField);

        // _expressionProperties: template
        fields[11].expressionProperties['template']();

        service.getProviders('asdfas');

        expect(fields).toBeDefined();
    });

    it('should test loadProviders', () => {
        spyOn(service, 'tapFunctionLoading').and.callThrough();
        service.tapFunctionLoading();
        service.tapFunction();
        service.responseFunction('res');
        service.filterFunction('233');
        service.catchErrorFunction();
        service.switchMapFunction('Dr John');
        expect(service.tapFunctionLoading).toHaveBeenCalled();
    });
});

class SilStoresServiceStub2 {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('ProviderFieldsService: error', () => {
    let service: ProviderFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ProviderFieldsService,
                Authorization,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ProviderFieldsService);
    });

    it('should error on list', () => {
        const comp = {
            model: {
                business_partner: 1,
            },
            cd: {
                detectChanges: () => {},
            },
            fields: [
                {
                    props: {
                        options: [],
                    },
                },
            ],
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        service.getProviders();
        fields[0].hooks.onInit();
        expect(fields).toBeDefined();
    });
});

class SilStoresServiceStub3 {
    list() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
    listNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('ProviderFieldsService: results defined', () => {
    let service: ProviderFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ProviderFieldsService,
                Authorization,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub3 },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ProviderFieldsService);
    });

    it('should test field hook: setFields with bp', () => {
        const comp = {
            model: {
                business_partner: 1,
            },
            cd: {
                detectChanges: () => {},
            },
            fields: [
                {
                    props: {
                        options: [],
                    },
                },
            ],
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        service.getProviders();
        fields[0].hooks.onInit();
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test field hook: setFields without bp', () => {
        const comp = {
            model: {},
            cd: {
                detectChanges: () => {},
            },
            fields: [
                {
                    props: {
                        options: [],
                    },
                },
            ],
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        fields[0].hooks.onInit();
        expect(service.fields).toHaveBeenCalled();
    });
});

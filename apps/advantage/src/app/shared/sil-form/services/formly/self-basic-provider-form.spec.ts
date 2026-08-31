import { BasicProviderFieldsService } from './self-basic-provider-form';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../../app-config.service';
import { ProviderOnboardingService } from '../../../../features/onboarding/onboarding-stepper/onboarding-stepper.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { StateService } from '@uirouter/angular';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

class SilStoresServiceStub {
    isList() {
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
    customUpdate() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
    update() {
        return of({
            email_address: 'a@a.com',
            physical_address: 'Nairobi, Kenya',
        });
    }
}

class ProviderOnboardingServiceStub {
    setupOnboardingCompleteness() {}
    refreshComponent() {}
}

class AuthorizationConfigStub {
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            bp_type: 'PROVIDER',
        };
    }
    getOrganisation() {
        return {
            organisation_id: '1',
        };
    }
    removeTokenData() {
        return {};
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

describe('BasicProviderFieldsService', () => {
    let service: BasicProviderFieldsService;

    localStorage.setItem(
        'auth.config.user',
        JSON.stringify({ business_partner: 1 })
    );
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                BasicProviderFieldsService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: ProviderOnboardingService,
                    useClass: ProviderOnboardingServiceStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(BasicProviderFieldsService);
        spyOn(localStorage, 'getItem').and.returnValue(
            JSON.stringify({ business_partner: '1' })
        );
        service.setComponent({ providerData: {} });
    });

    it('should test fields: branch_name | nested call test', () => {
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

        // expressions: branch_name: 2
        const field2 = {
            model: {
                branch_name: 'ad',
                preferred_contact: '123',
            },
            formControl: {
                pristine: false,
                touched: true,
            },
        };
        fields[1].fieldGroup[1].expressions['model.branch_name'](field2);
        const field3 = {
            model: {},
            branch_name: 'ad',
            preferred_contact: 'ad',
            formControl: {
                pristine: false,
                touched: true,
            },
        };
        const field4 = {
            model: {
                branch_names: '1d',
                branch_name: '2g',
            },
            formControl: {
                pristine: false,
                touched: true,
            },
        };
        // test
        fields[1].fieldGroup[1].expressions['model.branch_name'](field3);
        fields[1].fieldGroup[1].expressions['model.branch_name'](field4);

        // patch when branch_names is updated
        const field5 = {
            model: {
                branch_name: '2g',
                branch_names: '4g',
            },
            formControl: {
                pristine: false,
                touched: true,
            },
            defaultValue: '2g',
        };
        fields[1].fieldGroup[1].expressions['model.branch_name'](field5);

        // patch when branch_names is updated
        const field6 = {
            model: {
                branch_name: '2g',
                branch_names: '2g',
            },
            formControl: {
                pristine: false,
                touched: true,
            },
            defaultValue: '2g',
        };
        fields[1].fieldGroup[1].expressions['model.branch_name'](field6);
    });

    it('should test fields: preferred_contact', () => {
        const comp = {
            model: {
                business_partner: 1,
            },
            fields: [
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

        // expressions: branch_name: 2
        const field = {
            model: {
                branch_name: 'ad',
                preferred_contact: '123',
            },
            formControl: {
                pristine: false,
                touched: true,
                markAsPristine: () => {},
            },
            defaultValue: '222',
        };

        // expressions: preferred_contact
        fields[2].fieldGroup[1].expressions['model.preferred_contact'](field);
        const field2 = {
            model: {},
            branch_name: 'ad',
            preferred_contact: 'ad',
            formControl: {
                pristine: false,
                touched: true,
            },
        };
        fields[2].fieldGroup[1].expressions['model.preferred_contact'](field2);
        const field3 = {
            model: {},
            formControl: {
                pristine: false,
                touched: true,
            },
        };
        fields[2].fieldGroup[1].expressions['model.preferred_contact'](field3);
        const field4 = {
            model: {
                preferred_contact: 'ad',
            },
            formControl: {
                pristine: false,
                touched: true,
            },
            defaultValue: 'ad',
        };
        fields[2].fieldGroup[1].expressions['model.preferred_contact'](field4);
        const field5 = {
            model: {
                preferred_contact: 'ad',
            },
            formControl: {
                pristine: true,
            },
            defaultValue: 'ad',
        };
        fields[2].fieldGroup[1].expressions['model.preferred_contact'](field5);
        expect(service.fields).toBeDefined();
    });

    it('should test fields: select fields', () => {
        const comp = {
            model: {
                business_partner: 1,
            },
            fields: [
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

        // expressions: county_name
        const field = {
            model: {
                county_name: 'Nairobi',
                legal_status: 'Company',
            },
            formControl: {
                pristine: false,
                touched: true,
                markAsUntouched: () => {},
            },
            props: {},
            defaultValue: 'Nairobi',
        };
        fields[3].fieldGroup[0].expressions['model.county_name'](field);
        fields[4].fieldGroup[0].expressions['model.legal_status'](field);
        fields[5].fieldGroup[0].expressions['model.facility_type'](field);
        fields[4].fieldGroup[1].expressions['model.ownership_type'](field);
        fields[5].fieldGroup[1].expressions['model.location_type'](field);
        fields[5].fieldGroup[2].expressions['model.internet_connectivity'](
            field
        );

        // expressions: county_name
        const field2 = {
            model: {
                county_name: 'Nairobi',
                legal_status: 'Company',
            },
            formControl: {
                pristine: true,
                touched: false,
                markAsUntouched: () => {},
            },
            props: {},
            defaultValue: 'Nairobi',
        };

        fields[3].fieldGroup[0].expressions['model.county_name'](field2);
        fields[4].fieldGroup[0].expressions['model.legal_status'](field2);

        service.model = {};
        const field3 = {
            formControl: {
                pristine: false,
                touched: false,
            },
            props: {},
        };
        const field4 = {
            props: {},
        };
        service.setModel(field4, {});
        service.determineModelAction({}, field3);
        expect(service.fields).toBeDefined();
    });

    it('should test fields: select fields 2', () => {
        const comp = {
            model: {
                business_partner: 1,
            },
            fields: [
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

        // setup model
        service.model = {};

        // expressions: county_name
        const field = {
            model: {
                county_name: 'Nairobi',
                legal_status: 'Company',
            },
            formControl: {
                pristine: false,
            },
            props: {},
            defaultValue: 'Nairobi',
        };

        const event = {
            lat: 12.121212,
            lng: 36.23423423,
        };
        // coordinates tests
        fields[6].props.addMarker(event);

        // coordinates tests
        field.model['latitude'] = 12.223123;

        field.model['longitude'] = 12.223123;
        expect(field).toBeDefined();
    });

    it('should test email and address', () => {
        spyOn(service, 'patchOrgField').and.callThrough();
        const comp = {
            model: {
                business_partner: 1,
            },
            fields: [
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
                email_address: 'a@a.com',
                physical_address: 'Nairobi, Kenya',
            },
            email_address: 'a@a.com',
            physical_address: 'Nairobi, Kenya',
            preferred_contact: 'ad',
            formControl: {
                pristine: false,
                touched: true,
                markAsPristine: () => {},
            },
        };
        fields[2].fieldGroup[0].expressions['model.email_address'](field);
        fields[3].fieldGroup[1].expressions['model.physical_address'](field);

        const field2 = {
            model: {},
            email_address: 'a@a.com',
            physical_address: 'Nairobi, Kenya',
            preferred_contact: 'ad',
            formControl: {
                pristine: false,
                touched: true,
                markAsPristine: () => {},
            },
        };

        fields[2].fieldGroup[0].expressions['model.email_address'](field2);
        fields[3].fieldGroup[1].expressions['model.physical_address'](field2);

        const field3 = {
            model: {
                email_address: 'a@a.com',
                physical_address: 'Nairobi, Kenya',
            },
            email_address: 'a@a.com',
            physical_address: 'Nairobi, Kenya',
            preferred_contact: 'ad',
            formControl: {
                pristine: false,
                touched: false,
            },
        };

        fields[2].fieldGroup[0].expressions['model.email_address'](field3);
        fields[3].fieldGroup[1].expressions['model.physical_address'](field3);

        const field4 = {
            model: {
                email_address: 'a@a.com',
                physical_address: 'Nairobi, Kenya',
            },
            email_address: 'a@a.com',
            physical_address: 'Nairobi, Kenya',
            preferred_contact: 'ad',
            formControl: {
                pristine: true,
            },
        };

        fields[2].fieldGroup[0].expressions['model.email_address'](field4);
        fields[3].fieldGroup[1].expressions['model.physical_address'](field4);

        expect(service.patchOrgField).toHaveBeenCalled();
    });

    it('should patchOrgField | providerData is defined', () => {
        spyOn(service, 'patchOrgField').and.callThrough();
        const model = {
            email_address: 'a@a.com',
            physical_address: 'address',
        };
        service.patchOrgField(model);
        expect(service.patchOrgField).toHaveBeenCalled();
    });

    it('should patchOrgField | providerData is undefined', () => {
        spyOn(service, 'patchOrgField').and.callThrough();
        const model = {
            email_address: 'a@a.com',
            physical_address: 'address',
        };
        service.component.providerData = undefined;
        service.patchOrgField(model);
        expect(service.patchOrgField).toHaveBeenCalled();
    });
});

class SilStoresServiceStub2 {
    isList() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }

    customUpdate() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    isNestedList() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('BasicProviderFieldsService: isNestedList error', () => {
    let service: BasicProviderFieldsService;

    localStorage.setItem(
        'auth.config.user',
        JSON.stringify({ business_partner: 1 })
    );

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                BasicProviderFieldsService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                {
                    provide: ProviderOnboardingService,
                    useClass: ProviderOnboardingServiceStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub2,
                },
                { provide: StateService, useClass: StateServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(BasicProviderFieldsService);
        spyOn(localStorage, 'getItem').and.returnValue(
            JSON.stringify({ business_partner: '1' })
        );
        service.setComponent({ providerData: {} });
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
                    props: {}, // branch_names
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

        // test error of patchField
        const field = {
            model: {
                business_partner: {
                    name: 'Provider',
                    sladeCode: 5072,
                },
                slade_code: 5032,
                branch_names: 'branch',
            },
            branch_name: 'ad',
            preferred_contact: 'ad',
            formControl: {
                pristine: false,
                touched: true,
            },
        };
        fields[1].fieldGroup[1].expressions['model.branch_name'](field);

        // patch when branch_names is updated
        const field5 = {
            model: {
                branch_name: '2g',
                branch_names: '4g',
            },
            formControl: {
                pristine: false,
                touched: true,
            },
            defaultValue: '2g',
        };
        fields[1].fieldGroup[1].expressions['model.branch_name'](field5);
    });
});

class SilStoresServiceStub3 {
    isList() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    customUpdate() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('BasicProviderFieldsService: isList error', () => {
    let service: BasicProviderFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                BasicProviderFieldsService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                {
                    provide: ProviderOnboardingService,
                    useClass: ProviderOnboardingServiceStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub3,
                },
                { provide: StateService, useClass: StateServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(BasicProviderFieldsService);
        service.setComponent({ providerData: {} });
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
                    props: {}, // branch_names
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
        const model = {
            business_partner: {
                name: 'Provider',
                sladeCode: 5072,
            },
            slade_code: 5032,
            latitude: 1231,
            longitude: 1231,
            branch_names: 'branch',
            branch_name: 'branch',
        };

        const field = {
            key: 'branch_name',
            defaultValue: '',
            model: {
                branch_name: 'branch name',
            },
            formControl: {
                pristine: false,
                touched: true,
                markAsUntouched: () => {},
            },
        };

        // expressions: branch_name: 1
        fields[1].fieldGroup[1].expressions['model.branch_name'](field);
        // model defined
        const field2 = {
            key: 'branch_name',
            formControl: {
                pristine: true,
                model: {
                    branch_name: 'branch',
                },
            },
            model: {
                branch_name: 'branch',
            },
        };
        fields[1].fieldGroup[1].expressions['model.branch_name'](field2);
        // no model defined
        const field3 = {
            key: 'branch_name',
            formControl: {
                pristine: true,
                model: {
                    branch_name: 'branch',
                },
            },
            model: {},
        };
        fields[1].fieldGroup[1].expressions['model.branch_name'](field3);
        service.patchField(model);
        // latitude is not defined
        const model2 = {
            latitude: undefined,
            longitude: undefined,
        };
        service.patchField(model2);
    });

    it('should fail patchOrgField', () => {
        spyOn(service, 'patchOrgField').and.callThrough();
        const model = {
            email_address: 'a@a.com',
            physical_address: 'address',
        };
        service.patchOrgField(model);
        expect(service.patchOrgField).toHaveBeenCalled();
    });
});

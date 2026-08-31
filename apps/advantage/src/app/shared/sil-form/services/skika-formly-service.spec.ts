import { SilFormlyService } from './skika-formly-service';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { SkikaSaveOnChangesService } from './skika-save-onchanges.service';
import { PatientRegistrationService } from './formly/patient-registration-form';
import {
    UntypedFormControl,
    ReactiveFormsModule,
    FormsModule,
    UntypedFormGroup,
} from '@angular/forms';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { SilStoresService } from '../../sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../app-config.service';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { StateService } from '@uirouter/core';
import { Apollo } from 'apollo-angular';
import { SilCurrencyPipe } from '../../../@theme/pipes/currency/currency.pipe';
import { BusinessDetailsRegistrationService } from './formly/business-details-form';
import { PayerRegistrationService } from './formly/payer-registration-form';
import { LicensingService } from './formly/payer-licensing-form';
import { EmployerRegistrationService } from './formly/employer-registration-form';
import { UIRouterGlobals } from '@uirouter/angular';
import { BankDetailsSetupService } from './formly/bank-account-setup';
import { MobileMoneySetupService } from './formly/mobile-money-setup';
import { VariantPipe } from '../../../@theme/pipes/variant/variant.pipe';
import { EditPricelistDetailsFormService } from './formly/edit-pricelist-details-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class PipeStub {
    transform() {
        return true;
    }
}

class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
}

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

describe('SilFormlyService', () => {
    let service: SilFormlyService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                mockPipe('currencyPipe'),
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule,
            ],
            providers: [
                { provide: CurrencyPipe, useValue: mockPipe('currencyPipe') },
                SilCurrencyPipe,
                SilFormlyService,
                HttpTestingController,
                SkikaSaveOnChangesService,
                PatientRegistrationService,
                SilStoresService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Apollo },
                {
                    provide: ActivatedRoute,
                    useValue: { queryParams: of({ id: 123 }) },
                },
                BusinessDetailsRegistrationService,
                PayerRegistrationService,
                EmployerRegistrationService,
                LicensingService,
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                BankDetailsSetupService,
                MobileMoneySetupService,
                EditPricelistDetailsFormService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(SilFormlyService);
    });

    it('should test getPassword method', fakeAsync(() => {
        spyOn(service, 'getPassword').and.callThrough();

        const cmpt = {
            model: new UntypedFormGroup({
                password: new UntypedFormControl('pass'),
            }),
            form: new UntypedFormGroup({
                password: new UntypedFormControl('pass'),
            }),
        };
        const control = true;

        service.getPassword(cmpt).validators.fieldMatch.expression(control);
        service.getPassword(cmpt).expressionProperties['props.disabled']();
        expect(service.getPassword).toHaveBeenCalled();
    }));

    it('should test setPassword method', () => {
        spyOn(service, 'setPassword').and.callThrough();
        const obj = {
            fields: [
                { key: 'value' },
                { key: 'value' },
                { fieldGroup: [{ key: 'value' }, { key: 'value' }] },
                { fieldGroup: [{ key: 'value' }, { key: 'value' }] },
                { expressionProperties: {} },
            ],
        };
        service.setPassword(obj);
        expect(service.setPassword).toHaveBeenCalledWith(obj);
    });

    it('should test changePassword method', () => {
        spyOn(service, 'changePassword').and.callThrough();
        const obj = {
            fields: [{ key: 'value' }, { key: 'value' }],
        };
        service.changePassword(obj);
        expect(service.changePassword).toHaveBeenCalledWith(obj);
    });

    it('should test setLocation method', () => {
        spyOn(service, 'setLocation').and.callThrough();
        const field = {
            key: 'location',
            value: 'value',
        };
        const obj = {
            model: {
                location_lattitude: 'location',
                location_longitude: 'location',
            },
        };
        service.setLocation(field, obj);
        expect(service.setLocation).toHaveBeenCalledWith(field, obj);
    });

    it('should test getFields method', () => {
        spyOn(service, 'getFields').and.callThrough();
        service.getFields('login');
        service.getFields('add-payment-method');
        service.setComponent({ store: 'request-loan' });
        expect(service.getFields).toHaveBeenCalled();
    });

    it('should test getServiceFields', () => {
        spyOn(service, 'getServiceFields').and.callThrough();
        spyOn(service.patientRegisterService, 'fields');
        service.getServiceFields('patientRegisterService');
        service.setComponent({ store: 'patientRegisterService' });
        expect(service.getServiceFields).toHaveBeenCalled();
    });

    it('should test setLocation method', () => {
        spyOn(service, 'setLocation').and.callThrough();
        const field = {
            key: 'address',
            value: 'value',
        };
        const obj = {
            model: {
                location_lattitude: 'location',
                location_longitude: 'location',
            },
        };
        service.setLocation(field, obj);
        expect(service.setLocation).toHaveBeenCalledWith(field, obj);
    });

    it('should test setOnChangeVal', () => {
        spyOn(service, 'setOnChangeVal').and.callThrough();
        const field = {
            key: 'dob',
        };
        const obj = {
            model: {
                dob: {},
            },
        };
        service.setOnChangeVal(field, obj, {});
        expect(service.setOnChangeVal).toHaveBeenCalledWith(field, obj, {});
    });

    it('should test setOnChangeVal', () => {
        spyOn(service, 'setOnChangeVal').and.callThrough();
        const field = {
            key: 'esle',
        };
        const obj = {
            model: {
                dob: {},
            },
        };
        service.setOnChangeVal(field, obj, {});
        expect(service.setOnChangeVal).toHaveBeenCalledWith(field, obj, {});
    });

    it('should test onChanges method: with FormControl', () => {
        spyOn(service, 'onChanges').and.callThrough();
        const obj = {
            form: {
                valid: true,
            },
            model: {},
            resetModel: {},
        };
        const field = {
            key: 'key',
            formControl: new UntypedFormControl(),
        };
        service.onChanges(obj).onChanges.change(field, obj);
        expect(service.onChanges).toHaveBeenCalledWith(obj);
    });

    it('should test onChanges method', () => {
        spyOn(service, 'onChanges').and.callThrough();
        const obj = {
            form: {
                valid: true,
            },
            model: {},
        };
        const field = {
            key: 'key',
        };
        service.onChanges(obj).onChanges.change(field, obj);
        expect(service.onChanges).toHaveBeenCalledWith(obj);
    });

    it('should test setOnchangesWatch method  with whitelist', () => {
        spyOn(service, 'setOnchangesWatch').and.callThrough();
        const obj = {
            fields: [
                {
                    props: {
                        change: 'change',
                    },
                },
                {
                    fieldGroup: [
                        {
                            props: {
                                change: 'change',
                            },
                        },
                    ],
                },
            ],
        };
        service.whiteList(obj.fields[0]);
        service.setOnchangesWatch(obj);
        expect(service.setOnchangesWatch).toHaveBeenCalledWith(obj);
    });

    it('should test setOnchangesWatch method', () => {
        spyOn(service, 'setOnchangesWatch').and.callThrough();
        const obj = {
            fields: [
                {
                    props: {
                        change: 'change',
                    },
                },
                {
                    fieldGroup: [
                        {
                            props: {
                                change: 'change',
                            },
                        },
                    ],
                },
            ],
        };
        service.setOnchangesWatch(obj);
        expect(service.setOnchangesWatch).toHaveBeenCalledWith(obj);
    });

    it('should test setOnchangesWatch method with key', () => {
        spyOn(service, 'setOnchangesWatch').and.callThrough();
        const obj = {
            fields: [
                {
                    props: {
                        change: 'change',
                    },
                    key: 'dob',
                },
                {
                    fieldGroup: [
                        {
                            props: {
                                change: 'change',
                            },
                        },
                    ],
                },
            ],
        };
        service.setOnchangesWatch(obj);
        expect(service.setOnchangesWatch).toHaveBeenCalledWith(obj);
    });

    it('should test setOnchangesWatch method with dateChange', () => {
        spyOn(service, 'setOnchangesWatch').and.callThrough();
        const obj = {
            fields: [
                { key: 'else' },
                {
                    props: {
                        dateChange: 'date',
                    },
                },
            ],
        };
        service.setOnchangesWatch(obj);
        expect(service.setOnchangesWatch).toHaveBeenCalledWith(obj);
    });
});

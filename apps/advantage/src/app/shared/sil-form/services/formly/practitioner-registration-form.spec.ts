import { PractitionerRegistrationService } from './practitioner-registration-form';
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
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { StateService } from '@uirouter/angular';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
    list() {
        return of(['result']);
    }
}

class AuthenticationServiceStub {
    checkSetting(string) {
        return string === 'string';
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

describe('PractitionerRegistrationService', () => {
    let service: PractitionerRegistrationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                PractitionerRegistrationService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: StateService, useClass: StateServiceStub },
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
        service = TestBed.inject(PractitionerRegistrationService);
    });

    it('should test fields', () => {
        const comp = {
            model: {
                business_partner: 1,
                person: {
                    first_name: 'Alex',
                    last_name: 'Maina',
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
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        // test first field
        const field = {
            model: {
                first_name: 'Alex',
                last_name: 'Maina',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[0].fieldGroup[0]['expressions']['model.title'](field);

        // test second field
        const field1 = {
            model: {
                qualification: 'Other',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[1].fieldGroup[0]['expressions']['model.qualification'](field1);
        fields[1].fieldGroup[0]['expressions']['props.options'](field1);

        expect(service.fields).toHaveBeenCalled();
    });

    it('should test repeat field', () => {
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

        // test person_contacts
        const field = {
            model: {
                contact_type: 'email',
            },
            parent: {
                key: '0',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        // contact type input
        fields[2].fieldArray.fieldGroup[0]['expressions']['model.contact_type'](
            field
        );
        fields[2].fieldArray.fieldGroup[0]['expressions']['props.disabled'](
            field
        );
        // email input
        fields[2].fieldArray.fieldGroup[1]['expressions']['hide'](field);
        fields[2].fieldArray.fieldGroup[1]['expressions']['model.contact'](
            field
        );
        // phone number input
        fields[2].fieldArray.fieldGroup[2]['expressions']['hide'](field);
        fields[2].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            field
        );
        const fieldwithContact = {
            model: {
                contact_type: 'phone_number',
                contact: '+254700090954',
            },
            parent: {
                key: '0',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[2].fieldArray.fieldGroup[1]['expressions']['model.contact'](
            fieldwithContact
        );
        const fieldStartWith254 = {
            model: {
                contact_type: 'email',
                contact: '+25423323',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        // phone number input
        fields[2].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            fieldStartWith254
        );
        fieldStartWith254.model['id'] = '1';
        fields[2].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            fieldStartWith254
        );
        const fieldStartWith254WithModelId = {
            model: {
                contact_type: 'email',
                contact: '+25423323',
                id: '1',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        expect(service.fields).toHaveBeenCalled();
        fields[2].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            fieldStartWith254WithModelId
        );
    });
});

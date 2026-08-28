import { NextofKinRegistrationService } from './next-of-kin-registration-form';
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
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthenticationServiceStub {
    checkSetting(string) {
        return string === 'string';
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

describe('NextofKinRegistrationService', () => {
    let service: NextofKinRegistrationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                NextofKinRegistrationService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
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
        service = TestBed.inject(NextofKinRegistrationService);
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

        // test gender and id document type
        const field5 = {
            date_of_birth: '12-12-2022',
            formControl: {
                pristine: true,
                markAsPristine: () => {},
                touched: false,
            },
            model: {},
            props: {
                model: undefined,
            },
            defaultValue: 'John',
        };

        const model4 = {
            business_partner: undefined,
            gender: undefined,
            relationship: undefined,
            person: {
                phone_number: undefined,
            },
        };

        field5.model = model4;

        fields[1].fieldGroup[0]['expressions']['model.date_of_birth'](field5);
        const field6 = {
            formControl: {
                pristine: false,
            },
            model: {
                age: '8',
            },
        };
        fields[1].fieldGroup[0]['expressions']['model.date_of_birth'](field6);
        fields[1].fieldGroup[2]['expressions']['model.gender'](field5);
        fields[2].fieldGroup[0]['expressions']['model.relationship'](field5);
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
        fields[3].fieldArray.fieldGroup[0]['expressions']['model.contact_type'](
            field
        );
        fields[3].fieldArray.fieldGroup[0]['expressions']['props.disabled'](
            field
        );
        // email input
        fields[3].fieldArray.fieldGroup[1]['expressions']['hide'](field);
        fields[3].fieldArray.fieldGroup[1]['expressions']['model.contact'](
            field
        );
        // phone number input
        fields[3].fieldArray.fieldGroup[2]['expressions']['hide'](field);
        fields[3].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            field
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
        fields[3].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            fieldStartWith254
        );
        fieldStartWith254.model['id'] = '1';
        fields[3].fieldArray.fieldGroup[2]['expressions']['model.contact'](
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
        fields[3].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            fieldStartWith254WithModelId
        );
    });
});

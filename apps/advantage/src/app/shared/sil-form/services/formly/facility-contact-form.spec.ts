import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { FacilityContactFieldsService } from './facility-contact-form';
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

describe('FacilityContactFieldsForm', () => {
    let service: FacilityContactFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                FacilityContactFieldsService,
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
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(FacilityContactFieldsService);
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

        // test facility_contacts
        const field = {
            model: {
                contact_type: 'email',
            },
            parent: {
                key: '0',
            },
            props: {},
            defaultValue: undefined,
        };
        // contact type input
        fields[0]['expressions']['model.contact_type'](field);
        // email input
        fields[1]['expressions']['hide'](field);
        fields[1]['expressions']['model.contact_value'](field);
        // phone number input
        fields[2]['expressions']['hide'](field);
        fields[2]['expressions']['model.contact_value'](field);
        const fieldStartWith254 = {
            model: {
                contact_type: 'email',
                contact_value: '+25423323',
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
        fields[2]['expressions']['model.contact_value'](fieldStartWith254);
        fieldStartWith254.model['id'] = '1';
        fields[2]['expressions']['model.contact_value'](fieldStartWith254);
        const fieldStartWith254WithModelId = {
            model: {
                contact_type: 'email',
                contact_value: '+25423323',
                id: '1',
            },
            props: {},
            defaultValue: undefined,
        };
        fields[2]['expressions']['model.contact_value'](
            fieldStartWith254WithModelId
        );
        // identifier type input
        fields[3]['expressions']['model.role'](field);
        expect(service.fields).toHaveBeenCalled();
    });
});

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { FacilityIdentifierFieldsService } from './facility-identifier-form';
import { MemberInvitationService } from './onboarding-member-invite-form';
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

describe('OnboardingMemberInvitationsFieldsForm', () => {
    let service: MemberInvitationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                FacilityIdentifierFieldsService,
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

        service = TestBed.inject(MemberInvitationService);
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
        const field = {
            model: {
                member_email: 'email',
            },
            parent: {
                key: '0',
            },
            props: {},
            defaultValue: undefined,
        };
        const field1 = {
            model: {
                user_type: 'ADMIN',
            },
            parent: {
                key: '0',
            },
            props: {},
            defaultValue: 'ADMIN',
        };
        fields[0]['expressions']['model.member_email'](field);
        fields[1]['expressions']['model.user_type'](field1);

        expect(service.fields).toHaveBeenCalled();
    });
});

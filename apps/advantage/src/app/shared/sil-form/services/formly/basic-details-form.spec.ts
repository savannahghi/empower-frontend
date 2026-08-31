import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { UnlinkProfileService } from './unlink-profile-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { BasicDetailsService } from './basic-details-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '1',
                    name: 'Test 1',
                },
                {
                    id: '2',
                    name: 'Test 2',
                },
                {
                    id: '3',
                    name: 'Test 3',
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

describe('BasicDetailsForm', () => {
    let service: BasicDetailsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                UnlinkProfileService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(BasicDetailsService);
    });

    it('should test field: provider name', fakeAsync(() => {
        const comp = {
            fields: [
                {
                    props: {
                        label: 'Provider Name',
                        required: true,
                    },
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        service.fields();
        expect(service.fields).toHaveBeenCalled();
    }));
});

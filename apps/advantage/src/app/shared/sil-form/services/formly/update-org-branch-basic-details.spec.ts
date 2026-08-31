import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { UpdateOrgBranchBasicDetailsService } from './update-org-branch-basic-details';
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
    getUser() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class AuthenticationStub {
    getUser() {
        return {};
    }
    getToken() {
        return {};
    }
}

describe('UpdateOrgBranchBasicDetailsService', () => {
    let service: UpdateOrgBranchBasicDetailsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(UpdateOrgBranchBasicDetailsService);
    });

    it('should test fields', () => {
        const comp = {
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        expect(service.fields).toHaveBeenCalled();

        const field1 = {
            model: {
                parent_name: 'April Offers',
                parent: '1235',
            },
            props: {},
        };
        fields[1]['model.parent_name'] = field1;
        fields[1].expressions['model.parent_name'](field1);
    });
});

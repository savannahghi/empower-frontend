import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AddRecipientService } from './add-recipient-form';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
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

describe('AddRecipientService', () => {
    let service: AddRecipientService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
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
        service = TestBed.inject(AddRecipientService);
    });

    it('should test fields', fakeAsync(() => {
        localStorage.setItem(
            'auth.config.userWorkStation',
            JSON.stringify({
                workstation__org_unit__parent: 'wdksd-2364-234234q',
            })
        );
        const comp = {
            fields: [{}, {}, { props: {} }],
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

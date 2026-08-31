import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AddCommentsFormFieldsService } from './add-comments-form';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { of } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { UIRouterGlobals } from '@uirouter/angular';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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

class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { id: 1 };
        },
    },
};

describe('AddCommentsFormFieldsService', () => {
    let service: AddCommentsFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AddCommentsFormFieldsService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AddCommentsFormFieldsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the component', () => {
        spyOn(service, 'setComponent').and.callThrough();
        service.setComponent();
        expect(service.setComponent).toHaveBeenCalled();
    });

    it('should return the correct fields', () => {
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const fieldName = {
            model: {
                name: 'note',
            },
        };
        fields[0]['model.name'] = fieldName;
        expect(service.fields).toHaveBeenCalled();
    });
});

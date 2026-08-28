import { ResolverService } from './resolver.service';
import { SilStoresService } from '../../shared/sil-http-services/sil_datalayer.service';
import { TestBed } from '@angular/core/testing';
import { DataLayerUtils } from '../../@core/auth/services/datalayer.utils.service';
import { of } from 'rxjs';
import { ErrorHandlerService } from '../../shared/sil-http-services/error-handler';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { StateService } from '@uirouter/core';

class SilStoresServiceStub {
    get() {
        return of({});
    }
    list() {
        return of({});
    }

    createNested() {
        return of({});
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthorizationConfigStub {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
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

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

describe('ResolverService', () => {
    let service: ResolverService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                DataLayerUtils,
                ErrorHandlerService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });
        service = TestBed.inject(ResolverService);
    });

    it('should test resolveItem method', () => {
        spyOn(service, 'resolveItem').and.callThrough();
        service.resolveItem('mock_store', '123', {});
        expect(service.resolveItem).toHaveBeenCalled();
    });

    it('should test resolveList method', () => {
        spyOn(service, 'resolveList').and.callThrough();
        service.resolveList('mock_store', {});
        expect(service.resolveList).toHaveBeenCalled();
    });

    it('should test resolvePostItem method', () => {
        spyOn(service, 'resolvePostItem').and.callThrough();
        service.resolvePostItem('profiles', 'person_comparison', '123', {});
        expect(service.resolvePostItem).toHaveBeenCalled();
    });
});

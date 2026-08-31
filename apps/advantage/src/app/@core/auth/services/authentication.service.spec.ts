import { AuthenticationService } from './authentication.service';
import { TestBed, fakeAsync } from '@angular/core/testing';
import _ from 'underscore';
import { Authorization } from './authorization.service';

class AuthorizationConfigStub {
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: ['erp.pricelist_manage', 'erp_product_service_manage'],
        };
    }
    getToken() {
        return {
            access_token: 'token',
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: null,
        };
    }
    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: false,
            },
        ];
    }
    removeTokenData() {
        return {};
    }
}

describe('AuthenticationService', () => {
    let service: AuthenticationService;
    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthenticationService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
            ],
        });
    }));

    beforeEach(() => {
        service = TestBed.inject(AuthenticationService);
    });

    it('should create', () => {
        expect(service).toBeDefined();
    });

    it('isAuthenticated should return a boolean', () => {
        spyOn(_, 'isNull').and.returnValue(false);
        spyOn(service, 'getToken').and.returnValue({ expires_at: 354 });
        expect(service.isAuthenticated()).toBeDefined();
    });

    it('checkPermission should return false', () => {
        spyOn(service.authConfig, 'getUser').and.returnValue({ name: 'John' });
        const result = service.checkPermission('erp.pricelist_manage');
        expect(result).toBe(false);
    });

    it('checkRoles should return true', () => {
        spyOn(service.authConfig, 'getUser').and.returnValue({
            name: 'Ritta',
            roles: ['Superuser'],
        });
        const result = service.checkRoles(['Superuser']);
        expect(result).toBe(true);
    });

    it('checkRoles should return false when user has no roles', () => {
        spyOn(service.authConfig, 'getUser').and.returnValue({
            name: 'Ritta',
            roles: undefined,
        });
        const result = service.checkRoles(['Superuser']);
        expect(result).toBe(false);
    });

    it('isAuthenticated should return a boolean - 2', () => {
        spyOn(_, 'isNull').and.returnValue(true);
        spyOn(service, 'getToken').and.returnValue({ expires_at: 354 });
        expect(service.isAuthenticated()).toBeDefined();
    });

    it('should test getToken service', () => {
        spyOn(service, 'getToken').and.callThrough();
        service.getToken();
        expect(service.getToken).toHaveBeenCalled();
    });

    it('should test checkSetting', () => {
        const setting = service.checkSetting('patients:patient_full_name');
        expect(setting).toBe(false);
    });

    it('should test checkPermission for one permission', () => {
        const perm = service.checkPermission('erp.pricelist_manage');
        expect(perm).toBeDefined();
    });

    it('should test checkPermission when mixing AND and OR', () => {
        expect(function () {
            service.checkPermission(
                'erp.pricelist_manage;erp_product_service_manage:erp_product_service_delete'
            );
        }).toThrowError('You can only use one type of action splitter');
    });

    it('should test checkPermission for OR and all checks pass', () => {
        expect(
            service.checkPermission(
                'erp.pricelist_manage;erp_product_service_manage'
            )
        ).toBe(true);
    });

    it('should test checkPermission for OR and all checks fail', () => {
        expect(
            service.checkPermission('erp.invoice_edit;erp.invoice_delete')
        ).toBe(false);
    });

    it('should test checkPermission for AND and one check fails', () => {
        expect(
            service.checkPermission(
                'erp.pricelist_manage:erp_product_service_manage:erp_product_service_delete'
            )
        ).toBe(false);
    });
    it('should test checkPermission for AND and all checks pass', () => {
        expect(
            service.checkPermission(
                'erp.pricelist_manage:erp_product_service_manage'
            )
        ).toBe(true);
    });
});

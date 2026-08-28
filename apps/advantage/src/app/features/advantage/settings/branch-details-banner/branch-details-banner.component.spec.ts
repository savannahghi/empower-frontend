import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BranchDetailsBannerComponent } from './branch-details-banner.component';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { BehaviorSubject, of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

class AuthorizationStub {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrganisation() {
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
    transitionTo() {
        return true;
    }
    reload() {
        return true;
    }
}

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    name: 'Branch Name',
                    phone_number: '07000000',
                    email_address: 'email_address',
                },
            ],
        });
    }
    create() {
        return of({});
    }
}

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

const orgData = { organisation_id: '123' };
const branchId = { id: '123' };

describe('BranchDetailsBannerComponent', () => {
    let component: BranchDetailsBannerComponent;
    let fixture: ComponentFixture<BranchDetailsBannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BranchDetailsBannerComponent],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(BranchDetailsBannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test the fxnReload function', fakeAsync(() => {
        spyOn(component, 'fxnReload').and.callThrough();
        component.getOrgBranchInfo(orgData, branchId);
        component.fxnReload();
        tick(3200);
        expect(component.fxnReload).toHaveBeenCalled();
    }));

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the pageReloader method', () => {
        spyOn(component, 'pageReloader').and.callThrough();
        component.pageReloader();
        expect(component.pageReloader).toHaveBeenCalled();
    });

    it('should test the toggleModal method', () => {
        const context = 'etims_initialize_device';
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal(context);
        expect(component.toggleModal).toHaveBeenCalled();
    });

    it('should test branchDataDetails function when branch exists', () => {
        const response = {
            results: [
                {
                    name: '',
                    parent: '',
                    parent_name: '',
                    phone_number: '',
                    email_address: '',
                    physical_address: '',
                    postal_address: '',
                    etims_web_address: '',
                    etims_branch_id: '',
                    etims_device_serial_no: '',
                    branch_status: '',
                },
            ],
        };
        spyOn(component, 'branchDataDetails').and.callThrough();
        component.branchDataDetails(response);
        component.branchData = {};
        expect(component.branchDataDetails).toHaveBeenCalledWith(response);
    });

    it('should test branchDataDetails function when branch does not exist', () => {
        const response = {
            results: [],
        };
        spyOn(component, 'branchDataDetails').and.callThrough();
        component.branchDataDetails(response);
        component.branchData = {};
        expect(component.branchDataDetails).toHaveBeenCalledWith(response);
    });

    it('should test the redirectAfterDeviceInitialized method', () => {
        const expectedMessage = 'Device has been initialized successfully';
        spyOn(component, 'showToast').and.callThrough();
        spyOn(component, 'fxnReload').and.callThrough();
        component.redirectAfterDeviceInitialized();
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'eTIMS Device Initialization',
            expectedMessage
        );
        expect(component.fxnReload).toHaveBeenCalled();
    });

    it('should test the etimsInitializeDevice method', () => {
        component.branchData = {
            organisation_tax_pin: 'P051410645S',
        };

        component.branchId = '123';

        const model = {
            etims_web_address:
                'http://00.p051410645s.test.etims.slade360edi.com',
            etims_branch_id: '03',
            etims_device_serial_no: '5CG64340DN',
            organisation_tax_pin: '',
            branch_id: '',
        };
        spyOn(component, 'etimsInitializeDevice').and.callThrough();
        component.etimsInitializeDevice(model);
        expect(component.etimsInitializeDevice).toHaveBeenCalledWith(model);
    });
});

describe('BranchDetailsBannerComponent publishing error', () => {
    let component;
    let fixture: ComponentFixture<BranchDetailsBannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BranchDetailsBannerComponent],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(BranchDetailsBannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Error is thrown when getOrgBranchInfo is not resolved', () => {
        spyOn(component, 'errorHandlerGetOrg').and.callThrough();
        component.errorHandlerGetOrg();
        expect(component.errorHandlerGetOrg).toHaveBeenCalled();
    });

    it('Error is thrown when etimsInitializeDevice is not resolved', () => {
        spyOn(component, 'errorHandlerInitializeDevice').and.callThrough();
        component.errorHandlerInitializeDevice();
        expect(component.errorHandlerInitializeDevice).toHaveBeenCalled();
    });
});

import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BranchDetailsComponent } from './branch-details.component';
import { NbToastrService } from '@nebular/theme';
import { BehaviorSubject, of } from 'rxjs';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
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
                    id: '143224',
                },
            ],
        });
    }

    update() {
        return of({
            id: '12',
            organisation_name: 'org 1',
        });
    }
}

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    update() {
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
const branchId = '123';

describe('BranchDetailsComponent', () => {
    let component: BranchDetailsComponent;
    let fixture: ComponentFixture<BranchDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BranchDetailsComponent],
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
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(BranchDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.getOrgBranchInfo(orgData, branchId);

        expect(component.ngOnInit).toHaveBeenCalled();
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

    it('should test updateOrganisationBranch function', () => {
        const model = {
            name: 'name',
            parent_name: 'parent name',
            phone_number: 'phone number',
            email_address: 'email address',
            physical_address: 'physical address',
            postal_address: 'testPostalAddress',
            etims_web_address: 'web address',
            etims_branch_id: ' etims_branch_id',
            etims_device_serial_no: 'etims_device_serial_no',
            branch_status: 'branch_status',
        };
        spyOn(component, 'updateOrganisationBranch').and.callThrough();
        component.updateOrganisationBranch(model);
        component.back();
        expect(component.updateOrganisationBranch).toHaveBeenCalledWith(model);
    });

    it('should test redirectAfterBranchUpdate function', () => {
        const model = { name: 'Name' };
        spyOn(component, 'redirectAfterBranchUpdate').and.callThrough();
        component.redirectAfterBranchUpdate(model);
        expect(component.redirectAfterBranchUpdate).toHaveBeenCalledWith(model);
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
});

describe('BranchDetailsComponent publishing error', () => {
    let component;
    let fixture: ComponentFixture<BranchDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BranchDetailsComponent],
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
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(BranchDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Error is thrown when getOrgBranchInfo is not resolved', () => {
        spyOn(component, 'getOrgBranchInfo').and.callThrough();
        component.getOrgBranchInfo(orgData, branchId);
        expect(component.getOrgBranchInfo).toHaveBeenCalled();
    });
});

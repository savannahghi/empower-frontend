import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolePermissionsComponent } from './role-permissions.component';
import { BehaviorSubject, of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.patients.detail.',
    },
    params() {
        return { id: 1 };
    },
};

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: true,
            },
        ];
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class SilStoresServiceStub {
    create() {
        return of({
            data: [
                {
                    node: {
                        status: '',
                    },
                },
            ],
        });
    }
    list() {
        return of({
            count: 648,
            next: 'https://accounts.multitenant.slade360.co.ke/v1/role/permissions/?page=2&page_size=50',
            previous: null,
            page_size: 50,
            current_page: 1,
            total_pages: 13,
            start_index: 1,
            end_index: 50,
            results: [
                {
                    id: 1029,
                    guid: '16aca78a-309e-4f6a-9b6b-d90cb47f0618',
                    name: 'advantage.visit_list',
                    description: 'View visits',
                    children: [],
                },
                {
                    id: 1028,
                    guid: '1826a4a7-9093-4f8e-91d9-11acf19b7da5',
                    name: 'advantage.visit_edit',
                    description: 'Edit visits',
                    children: [],
                },
                {
                    id: 1027,
                    guid: 'f34c71f9-a024-4122-8657-c0093e391d45',
                    name: 'advantage.visit_delete',
                    description: 'Remove visits',
                    children: [],
                },
            ],
        });
    }
    get() {
        return of({
            count: 648,
            next: 'https://accounts.multitenant.slade360.co.ke/v1/role/permissions/?page=2&page_size=50',
            previous: null,
            page_size: 50,
            current_page: 1,
            total_pages: 13,
            start_index: 1,
            end_index: 50,
            role_permissions: [
                {
                    id: 224312,
                    role: 16613,
                    description: 'View visits',
                    guid: '52d1e1c0-1861-481d-8b2e-1f7ee6b397b8',
                    permission: 1029,
                },
                {
                    id: 224143,
                    role: 16613,
                    description: 'User view',
                    guid: 'f70d4d07-0e09-4fd3-94fb-859b8a942e5b',
                    permission: 78,
                },
                {
                    id: 224142,
                    role: 16613,
                    description: 'User remove',
                    guid: 'f6e60ff5-d14a-471e-b91f-9c9696a2f29d',
                    permission: 81,
                },
                {
                    id: 224141,
                    role: 16613,
                    description: 'User edit',
                    guid: 'c07fb410-9490-43c5-bb7d-e4c06ea7fa51',
                    permission: 80,
                },
            ],
        });
    }
    remove() {
        return of({
            id: '1231',
        });
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transition() {
        return true;
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

describe('RolePermissionsComponent', () => {
    let component: RolePermissionsComponent;
    let fixture: ComponentFixture<RolePermissionsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],

            declarations: [RolePermissionsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
            ],
        });
        fixture = TestBed.createComponent(RolePermissionsComponent);
        component = fixture.componentInstance;
        component.actions = [
            {
                btnText: 'Remove',
                status: 'danger',
                action: 'custom',
                expression: (row: any) => row.isAdded === true,
                modalConf: {
                    customFxn: true,
                    Fxn: 'addOrRemovePermission',
                },
            },
            {
                btnText: 'Add',
                status: 'success',
                action: 'custom',
                expression: (row: any) => row.isAdded !== true,
                modalConf: {
                    customFxn: true,
                    Fxn: 'addOrRemovePermission',
                },
            },
        ];
        fixture.detectChanges();
    });

    it('should render correctly', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.actions[1].expression({ isAdded: false });
        component.activePermissions = [
            { id: '1234', description: 'test' },
            { id: '123', description: 'test 2' },
        ];
        expect(component).toBeTruthy();
        component.permissions = [
            { id: '1234', description: 'test' },
            { id: '123', description: 'test 3' },
        ];
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should should call remove permission action', () => {
        const event = {
            isAdded: true,
            role_permission_id: '1234',
        };
        spyOn(component, 'addOrRemovePermission').and.callThrough();
        component.addOrRemovePermission(event);
        expect(component).toBeTruthy();
        expect(component.addOrRemovePermission).toHaveBeenCalled();
    });

    it('should should call add permission action', () => {
        const event = {
            id: '1234',
        };
        spyOn(component, 'addOrRemovePermission').and.callThrough();
        component.addOrRemovePermission(event);
        expect(component).toBeTruthy();
        expect(component.addOrRemovePermission).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    remove() {
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

describe('RolePermissionsComponent', () => {
    let component: RolePermissionsComponent;
    let fixture: ComponentFixture<RolePermissionsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],

            declarations: [RolePermissionsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
            ],
        });
        fixture = TestBed.createComponent(RolePermissionsComponent);
        component = fixture.componentInstance;
        component.activePermissions = [
            { id: '1234', description: 'test' },
            { id: '123', description: 'test 2' },
        ];
        component.permissions = [
            { id: '1234', description: 'test' },
            { id: '123', description: 'test 3' },
        ];
        component.actions = [
            {
                btnText: 'Remove',
                status: 'danger',
                action: 'custom',
                expression: (row: any) => row.isAdded === true,
                modalConf: {
                    customFxn: true,
                    Fxn: 'addOrRemovePermission',
                },
            },
            {
                btnText: 'Add',
                status: 'success',
                action: 'custom',
                expression: (row: any) => row.isAdded !== true,
                modalConf: {
                    customFxn: true,
                    Fxn: 'addOrRemovePermission',
                },
            },
        ];
        fixture.detectChanges();
    });

    it('should render and return error', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component).toBeTruthy();
        component.actions[0].expression({ isAdded: true });
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should call getAddedPermissions error', () => {
        spyOn(component, 'getAddedPermissions').and.callThrough();
        component.getAddedPermissions();
        expect(component).toBeTruthy();
        expect(component.getAddedPermissions).toHaveBeenCalled();
    });

    it('should should call remove permission action and fail', () => {
        const event = {
            isAdded: true,
            role_permission_id: '1234',
        };
        spyOn(component, 'addOrRemovePermission').and.callThrough();
        component.addOrRemovePermission(event);
        expect(component).toBeTruthy();
        expect(component.addOrRemovePermission).toHaveBeenCalled();
    });

    it('should should call add permission action and fail', () => {
        const event = {
            id: '1234',
        };
        spyOn(component, 'addOrRemovePermission').and.callThrough();
        component.addOrRemovePermission(event);
        expect(component).toBeTruthy();
        expect(component.addOrRemovePermission).toHaveBeenCalled();
    });
});

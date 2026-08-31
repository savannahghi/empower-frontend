import { Ng2StateDeclaration, Transition } from '@uirouter/angular';
import { ListComponent } from '../../../shared/list/list.component';
import { ResolverService } from '../../services/resolver.service';
import { DetailComponent } from '../../../shared/detail/detail.component';
import { RolePermissionsComponent } from './role-permissions/role-permissions.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

/** customerState
 * State contains the customer list.
 * Loads the component that renders the customers
 */
export const usermgmtState: Ng2StateDeclaration = {
    name: 'app.advantage.usermgmt',
    url: '/usermgmt',
    breadcrumb: () => 'User Setup',
    redirectTo: 'app.advantage.usermgmt.users',
    data: {
        requiresAuth: true,
        permission: 'auth.user_view',
    },
};

/** users list State
 * State contains the organisation's users
 */
export const setupUsersState: Ng2StateDeclaration = {
    name: 'app.advantage.usermgmt.users',
    url: '/users?search&page&first_name',
    breadcrumb: () => 'Users',
    data: {
        requiresAuth: true,
        permission: 'auth.user_view',
        rows: [
            {
                key: 'first_name',
                type: 'string',
            },
            {
                key: 'last_name',
                type: 'string',
            },
            {
                key: 'email',
                type: 'string',
                format: 'email',
            },
        ],
        etimsRows: [
            {
                key: 'first_name',
                type: 'string',
            },
            {
                key: 'last_name',
                type: 'string',
            },
            {
                key: 'email',
                type: 'string',
                format: 'email',
            },
        ],
        tableHeader: [
            { text: 'First Name' },
            { text: 'Last Name' },
            { text: 'Email' },
            { text: 'Action', className: 'ms-2 text-center' },
        ],
        etimsTableHeader: [
            { text: 'First Name' },
            { text: 'Last Name' },
            { text: 'Email' },
            { text: 'Action', className: 'ms-2 text-center' },
        ],
        filterParams: {
            fields: 'id,email,first_name,last_name,guid',
            page_size: '10',
        },
        statusFilters: [],
        actions: [
            {
                btnText: 'View',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.usermgmt.users.detail',
                    stateParams: {
                        guid: 'guid',
                        user_id: 'id',
                    },
                },
            },
            {
                btnText: 'Reset Password',
                status: 'success',
                action: 'quickPatch',
                modalConf: {
                    action: 'quickPatch',
                    httpMethod: 'remove',
                    store: 'password-reset',
                    data: [{ key: 'email', value: 'email' }],
                    method: 'genericPost',
                    successTitle: 'Password Reset',
                    successMessage: 'Password has been successfully reset',
                    failedTitle: 'Password Reset',
                    failedMessage: 'Password has failed to be reset',
                },
                confirm: {
                    title: 'Password reset',
                    text: "Are you sure you would like to reset this user's password?",
                    showCancelButton: true,
                    cancelButtonColor: '#edf1f7',
                    confirmButtonText: 'Reset',
                },
            },
        ],
        actionsEtims: [
            {
                btnText: 'View',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.usermgmt.users.detail',
                    stateParams: {
                        guid: 'guid',
                        user_id: 'id',
                    },
                },
            },
            {
                btnText: 'Reset Password',
                status: 'success',
                action: 'quickPatch',
                modalConf: {
                    action: 'quickPatch',
                    httpMethod: 'remove',
                    store: 'password-reset',
                    data: [{ key: 'email', value: 'email' }],
                    method: 'genericPost',
                    successTitle: 'Password Reset',
                    successMessage: 'Password has been successfully reset',
                    failedTitle: 'Password Reset',
                    failedMessage: 'Password has failed to be reset',
                },
                confirm: {
                    title: 'Password reset',
                    text: "Are you sure you would like to reset this user's password?",
                    showCancelButton: true,
                    cancelButtonColor: '#edf1f7',
                    confirmButtonText: 'Reset',
                },
            },
        ],
        pageTitle: 'Users',
        pageSubTitle: 'List of the available users that have been setup',
        hasSearch: true,
        formlyJsonFilename: 'register-user-auth-server',
    },

    resolve: [
        {
            token: 'store',
            resolveFn: () => 'auth-erp-users',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'User',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: ListComponent,
        },
    },
};

/** setupUsersDetailState
 * State contains the detail view component.
 * The component shows you the users' information
 */
export const setupUsersDetailState: Ng2StateDeclaration = {
    name: 'app.advantage.usermgmt.users.detail',
    url: '/view/:guid',
    breadcrumb: () => 'User Details',
    data: {
        requiresAuth: true,
        permission: '',
        hasTabs: true,
        mainDisplayValue: ['first_name', 'last_name'],
        mainDisplayArray: true,
        secondaryDisplayValues: [{ label: 'Email', value: 'email' }],
        childStates: [
            {
                name: 'app.advantage.usermgmt.users.detail.workstations',
                display: 'Service Points',
                params: [{ key: 'id', value: 'id' }],
            },
            {
                name: 'app.advantage.usermgmt.users.detail.basic',
                display: 'Basic Details',
                params: [{ key: 'id', value: 'id' }],
            },
        ],
        stateGoAfterResolve: 'app.advantage.usermgmt.users.detail.workstations',
    },
    resolve: [
        {
            token: 'recordDetailObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc: any, transition: any) =>
                resolveSvc.resolveItem(
                    'auth-erp-users',
                    transition.params().guid
                ),
        },
    ],
    bindings: {
        resolveData: 'recordDetailObservable',
    },
    views: {
        '$default@app.advantage': {
            component: DetailComponent,
        },
    },
};

/** user basic details State
 * State contains the basic details under a user
 */
export const setupUsersDetailBasicState = {
    name: 'app.advantage.usermgmt.users.detail.basic',
    url: '/basic',
    breadcrumb: () => 'Basic Details',
    data: {
        requiresAuth: true,
        permission: 'auth.user_view',
        pageTitle: 'Basic Details',
        pageSubTitle: 'These are the basic details about the user',
        formRecordId: 'guid',
        formFields: 'add-user-auth-server',
        formStore: 'auth-erp-users',
    },
    resolve: [
        {
            token: 'recordObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc: any, transition: any) =>
                resolveSvc.resolveItem(
                    'auth-erp-users',
                    transition.params().guid
                ),
        },
    ],
    bindings: {
        resolveData: 'recordObservable',
    },
    views: {
        'detail@app.advantage.usermgmt.users.detail': {
            component: UserFormComponent,
        },
    },
};

/** user workstations State
 * State contains the workstations under a user
 */
export const setupUsersDetailWorkstationState = {
    name: 'app.advantage.usermgmt.users.detail.workstations',
    url: '/service-points/:id',
    breadcrumb: () => 'Service Points',
    data: {
        requiresAuth: true,
        permission: 'auth.user_view',
        isTabList: true,
        tableHeader: [
            { text: 'Service Point Name' },
            { text: 'Department' },
            { text: 'Action' },
        ],
        etimsTableHeader: [
            { text: 'Service Point Name' },
            { text: 'Department' },
            { text: 'Action' },
        ],
        filterParams: {
            fields: 'id,workstation_name,org_unit_name',
            page_size: '10',
        },
        defaultParams: [{ health_worker: { param: 'id' } }],
        defaultFormModelFields: [{ health_worker: { param: 'id' } }],
        extraPayload: {},
        statusFilters: [],
        ignoreStateParams: ['id'],
        hideCreateButton: false,
        hasSearch: true,
        pageTitle: 'Service Points',
        pageSubTitle: 'Here is a list of service points assigned to this user',
        rows: [
            {
                key: 'workstation_name',
                type: 'string',
            },
            {
                key: 'org_unit_name',
                type: 'string',
            },
        ],
        etimsRows: [
            {
                key: 'workstation_name',
                type: 'string',
            },
            {
                key: 'org_unit_name',
                type: 'string',
            },
        ],
        actions: [
            {
                btnText: 'Unassign',
                status: 'danger',
                action: 'quickPatch',
                modalConf: {
                    action: 'quickPatch',
                    httpMethod: 'remove',
                    api: 'workstation-users',
                    method: 'genericPatch',
                    successTitle: 'Unassign Service Point',
                    successMessage: 'Service Point unassigned successfully',
                    failedTitle: 'Unassign Service Point',
                    showText: true,
                    failedMessage: 'Service Point unassignment failed',
                },
                confirm: {
                    title: 'Unassign Service Point',
                    text: 'Are you sure you want to unassign the service point?',
                    showCancelButton: true,
                    cancelButtonColor: '#edf1f7',
                    confirmButtonText: 'Unassign',
                },
            },
        ],
        actionsEtims: [
            {
                btnText: 'Unassign',
                status: 'danger',
                action: 'quickPatch',
                modalConf: {
                    action: 'quickPatch',
                    httpMethod: 'remove',
                    api: 'workstation-users',
                    method: 'genericPatch',
                    successTitle: 'Unassign Service Point',
                    successMessage: 'Service Point unassigned successfully',
                    failedTitle: 'Unassign Service Point',
                    showText: true,
                    failedMessage: 'Service Point unassignment failed',
                },
                confirm: {
                    title: 'Unassign Service Point',
                    text: 'Are you sure you want to unassign the service point?',
                    showCancelButton: true,
                    cancelButtonColor: '#edf1f7',
                    confirmButtonText: 'Unassign',
                },
            },
        ],
        formlyServiceFilename: 'addUserWorkstationFieldsService',
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'workstation-users',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Service Point',
        },
        {
            token: 'detailList',
            resolveFn: () => true,
        },
    ],
    views: {
        'detail@app.advantage.usermgmt.users.detail': {
            component: ListComponent,
        },
    },
};

/** roles list State
 * State contains the organisation's roles
 */
export const rolesListState: Ng2StateDeclaration = {
    name: 'app.advantage.usermgmt.roles',
    url: '/roles?search&page&name',
    breadcrumb: () => 'Roles',
    data: {
        requiresAuth: true,
        hideCreateButton: false,
        permission: 'auth.role_view',
        rows: [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'description',
                type: 'string',
            },
        ],
        etimsRows: [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'description',
                type: 'string',
            },
        ],
        tableHeader: [
            { text: 'Name' },
            { text: 'Description' },
            { text: 'Action' },
        ],
        etimsTableHeader: [
            { text: 'Name' },
            { text: 'Description' },
            { text: 'Action' },
        ],
        filterParams: {
            fields: 'id,name,description',
            page_size: '10',
        },
        statusFilters: [],
        actions: [
            {
                btnText: 'View',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.usermgmt.roles.detail',
                    stateParams: {
                        id: 'id',
                    },
                },
            },
        ],
        actionsEtims: [
            {
                btnText: 'View',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.usermgmt.roles.detail',
                    stateParams: {
                        id: 'id',
                    },
                },
            },
        ],
        pageTitle: 'Roles',
        pageSubTitle: 'List of the active roles',
        hasSearch: true,
        formlyJsonFilename: 'add-role',
    },

    resolve: [
        {
            token: 'store',
            resolveFn: () => 'erp-roles',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Role',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: ListComponent,
        },
    },
};

/** roleDetailsState
 * State contains the detail view component.
 * The component shows you the roles' information
 */
export const roleDetailsState: Ng2StateDeclaration = {
    name: 'app.advantage.usermgmt.roles.detail',
    url: '/view/:id',
    breadcrumb: () => 'Role Details',
    data: {
        requiresAuth: true,
        permission: '',
        hasTabs: true,
        mainDisplayValue: 'name',
        secondaryDisplayValues: [
            { label: 'Description: ', value: 'description' },
        ],
        childStates: [
            {
                name: 'app.advantage.usermgmt.roles.detail.permissions',
                display: 'Add permissions',
                params: [{ key: 'role_id', value: 'id' }],
            },
        ],
    },
    resolve: [
        {
            token: 'recordDetailObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc: any, transition: any) =>
                resolveSvc.resolveItem('erp-roles', transition.params().id),
        },
    ],
    bindings: {
        resolveData: 'recordDetailObservable',
    },
    views: {
        '$default@app.advantage': {
            component: DetailComponent,
        },
    },
    redirectTo: 'app.advantage.usermgmt.roles.detail.permissions',
};

/** role basic details State
 * State contains the basic details for a role
 */
export const roleBasicDetailsState = {
    name: 'app.advantage.usermgmt.roles.detail.basic',
    url: '/basic',
    breadcrumb: () => 'Basic Details',
    data: {
        requiresAuth: true,
        permission: 'auth.role_view',
        isTabList: true,
        tableHeader: [{}],
        etimsTableHeader: [{}],
        filterParams: {
            fields: 'id',
            page_size: '10',
        },
        defaultParams: [{ role_id: { param: 'id' } }],
        statusFilters: [],
        hideCreateButton: false,
        rows: [],
        etimsRows: [],
        actions: [],
        actionsEtims: [],
    },
    resolve: [
        {
            token: 'recordDetailObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc: any, transition: any) =>
                resolveSvc.resolveItem('erp-roles', transition.params().id),
        },
    ],
    bindings: {
        resolveData: 'recordDetailObservable',
    },
    views: {
        'detail@app.advantage.usermgmt.roles.detail': {
            component: ListComponent,
        },
    },
};

/** add permissions State
 * State that handles permissions
 */
export const rolePermissionsState = {
    name: 'app.advantage.usermgmt.roles.detail.permissions',
    url: '/permissions?perm_search&perm_page&perm_name',
    breadcrumb: () => 'Add permissions',
    data: {
        requiresAuth: true,
        permission: 'auth.role_view',
        isTabList: true,
        hideCreateButton: false,
    },
    views: {
        'detail@app.advantage.usermgmt.roles.detail': {
            component: RolePermissionsComponent,
        },
    },
};

export const setupServicePointsState: Ng2StateDeclaration = {
    name: 'app.advantage.usermgmt.servicepoints',
    url: '/servicepoints?search&page&name',
    breadcrumb: () => 'Service Points',
    data: {
        requiresAuth: true,
        permission: 'auth.user_view',
        rows: [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'workstation_type_display',
                type: 'string',
            },
            {
                key: 'org_unit_name',
                type: 'string',
            },
        ],
        etimsRows: [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'workstation_type_display',
                type: 'string',
            },
            {
                key: 'org_unit_name',
                type: 'string',
            },
        ],
        tableHeader: [
            { text: 'Name' },
            { text: 'Type' },
            { text: 'Department' },
            { text: 'Action', className: 'ms-2 text-center' },
        ],
        etimsTableHeader: [
            { text: 'Name' },
            { text: 'Type' },
            { text: 'Department' },
            { text: 'Action', className: 'ms-2 text-center' },
        ],
        filterParams: {
            fields: 'id,name,workstation_type_display,org_unit,org_unit_name,is_billing_point',
            page_size: '10',
        },
        actions: [
            {
                btnText: 'shared.buttons.edit',
                status: 'primary',
                action: 'modal',
                modalConf: {
                    store: 'add-workstation',
                    api: 'workstations',
                    action: 'quickPatch',
                    httpMethod: 'update',
                    method: 'genericPatch',
                    successTitle: 'Edit Service Point',
                    successMessage: 'Service point updated successfully',
                    failedTitle: 'Edit Service Point',
                    failedMessage: 'Service point updating has failed',
                },
            },
        ],
        actionsEtims: [
            {
                btnText: 'shared.buttons.edit',
                status: 'primary',
                action: 'modal',
                modalConf: {
                    store: 'add-workstation',
                    api: 'workstations',
                    action: 'quickPatch',
                    httpMethod: 'update',
                    method: 'genericPatch',
                    successTitle: 'Edit Service Point',
                    successMessage: 'Service point updated successfully',
                    failedTitle: 'Edit Service Point',
                    failedMessage: 'Service point updating has failed',
                },
            },
        ],
        formlyJsonFilename: 'add-workstation',

        pageTitle: 'Service Points',
        pageSubTitle: 'All Service Points',
        hasSearch: true,
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'workstations',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Service Point',
        },
        {
            token: 'detailList',
            resolveFn: () => false,
        },
    ],
    views: {
        '$default@app.advantage': {
            component: ListComponent,
        },
    },
};

/** department list State
 * State contains the organisation's departments
 */
export const departmentsListState: Ng2StateDeclaration = {
    name: 'app.advantage.usermgmt.departments',
    url: '/departments?search&page&name',
    breadcrumb: () => 'Departments',
    data: {
        requiresAuth: true,
        hideCreateButton: false,
        permission: 'auth.user_view',
        rows: [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'phone_number',
                type: 'string',
            },
            {
                key: 'email_address',
                type: 'string',
            },
        ],
        etimsRows: [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'phone_number',
                type: 'string',
            },
            {
                key: 'email_address',
                type: 'string',
            },
        ],
        tableHeader: [
            { text: 'Department Name' },
            { text: 'Phone Contact' },
            { text: 'Email Contact' },
            { text: 'Action' },
        ],
        etimsTableHeader: [
            { text: 'Department Name' },
            { text: 'Phone Contact' },
            { text: 'Email Contact' },
            { text: 'Action' },
        ],
        filterParams: {
            page_size: '10',
        },
        actions: [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    context: 'Edit Department',
                    store: 'addDepartmentService',
                    isService: true,
                    api: 'erp-departments',
                    action: 'quickPatch',
                    httpMethod: 'update',
                    method: 'genericPatch',
                    successTitle: 'Edit Department',
                    successMessage: 'Department edited',
                    failedTitle: 'Edit Department',
                    failedMessage: 'Department updating has',
                },
            },
        ],
        actionsEtims: [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    context: 'Edit Department',
                    store: 'addDepartmentService',
                    isService: true,
                    api: 'erp-departments',
                    action: 'quickPatch',
                    httpMethod: 'update',
                    method: 'genericPatch',
                    successTitle: 'Edit Department',
                    successMessage: 'Department edited',
                    failedTitle: 'Edit Department',
                    failedMessage: 'Department updating has',
                },
            },
        ],
        pageTitle: 'Departments',
        pageSubTitle: 'List of available departments that have been setup',
        hasSearch: true,
        formlyServiceFilename: 'addDepartmentService',
    },

    resolve: [
        {
            token: 'store',
            resolveFn: () => 'erp-departments',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Department',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: ListComponent,
        },
    },
};

export const userProfileState: Ng2StateDeclaration = {
    name: 'app.advantage.manage',
    url: '/manage',
    breadcrumb: () => 'User Profile',
    redirectTo: 'app.advantage.manage.profile',
    data: {
        requiresAuth: true,
    },
};

export const manageUserProfileState: Ng2StateDeclaration = {
    name: 'app.advantage.manage.profile',
    url: '/profile',
    breadcrumb: () => 'Manage User Profile',
    data: {
        requiresAuth: true,
    },
    views: {
        '$default@app.advantage': {
            component: UserProfileComponent,
        },
    },
};

export const USERMGMT_STATES = [
    usermgmtState,
    setupUsersState,
    setupUsersDetailState,
    setupUsersDetailWorkstationState,
    setupUsersDetailBasicState,
    rolesListState,
    roleDetailsState,
    roleBasicDetailsState,
    rolePermissionsState,
    setupServicePointsState,
    departmentsListState,
    userProfileState,
    manageUserProfileState,
];

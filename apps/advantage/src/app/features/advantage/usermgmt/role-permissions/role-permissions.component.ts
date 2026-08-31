import { Component, OnInit } from '@angular/core';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { Transition, StateService, UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import _ from 'underscore';
import { NbToastrService } from '@nebular/theme';

@Component({
    selector: 'role-permissions',
    templateUrl: './role-permissions.component.html',
    styleUrls: ['./role-permissions.component.scss'],
    standalone: false,
})
export class RolePermissionsComponent implements OnInit {
    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;

    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * role permissions
     */
    permissions: any[];

    /**
     * active permissions for a role
     */
    activePermissions: any[];

    /**
     * Contains information for pagination
     */
    paginationData: object;

    /**
     * Boolean to show whether data has been fetched
     */
    dataFetched: boolean;

    /**
     * showToast - Used to display a toast using the nebular toast service
     * @param position - defines the toast's position e.g. bottom-right
     * @param status - defines the status being used e.g. success, danger, info
     * @param title - defines what the title of the toast is
     * @param msg - defines what the message in the toast is
     */
    showToast(position, status, title, msg) {
        const duration = 5000;
        this.toastrService.show(`${msg}`, title, {
            position,
            status,
            duration,
        });
    }

    /**
     * Component constructor
     * @param dataLayer - Connects to the datalayer service
     * @param transition - Connects to the transition service
     * @param $state - Connects to the state service
     * @param uiglobals - Connects to the uiglobals service
     * @param errorHandler - Connects to the error handler service
     * @param swalTargets - Connects to the sweetalert service
     */
    constructor(
        private dataLayer: SilStoresService,
        public transition: Transition,
        protected toastrService: NbToastrService,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        private errorHandler: ErrorHandlerService,
        public readonly swalTargets: SwalPortalTargets
    ) {}

    /** fetch role permissions */
    getPermissions() {
        this.loading = true;
        const params = {
            page: this.uiglobals.params.page ?? 1,
            search: this.uiglobals.params?.search ?? '',
        };
        this.dataLayer.list('erp-permissions', params).subscribe({
            next: (response: any) => {
                this.permissions = response.results;
                const pagination = _.omit(response, 'results');
                this.paginationData = pagination;
                this.getAddedPermissions();
                this.dataFetched = true;
            },
            error: err => {
                this.loading = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    getAddedPermissions() {
        this.loading = true;
        const param = this.uiglobals.params.id;
        this.dataLayer.get('erp-roles', param).subscribe({
            next: (response: any) => {
                this.activePermissions = response.role_permissions;
                this.loading = false;
                this.checkPermission();
            },
            error: err => {
                this.loading = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    checkPermission() {
        // Iterate through each element in the activePermissions array
        this.activePermissions.forEach(activePermission => {
            // Find the matching element in the permissions array based on the description
            const matchingResult = this.permissions.find(
                permission =>
                    permission.description === activePermission.description
            );

            // If a matching element is found, add the isAdded, id properties
            if (matchingResult) {
                matchingResult.isAdded = true;
                matchingResult.role_permission_id = activePermission.id;
            }
        });
    }

    addOrRemovePermission(event) {
        if (event.isAdded) {
            this.loading = true;
            const param = event.role_permission_id;
            this.dataLayer.remove('erp-role-permissions', param).subscribe({
                next: () => {
                    this.loading = false;
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Permission',
                        'The permission was removed successfully'
                    );
                    // fetch permissions
                    this.getPermissions();
                },
                error: err => {
                    this.loading = false;
                    this.showToast(
                        'bottom-right',
                        'danger',
                        'Error',
                        'An error occurred. Please try again'
                    );
                    this.errorHandler.handleError(err, this);
                },
            });
            return;
        }
        this.loading = true;
        const params = {
            role: this.uiglobals.params.id,
            permission: event.id,
        };
        this.dataLayer.create('erp-role-permissions', params).subscribe({
            next: () => {
                this.loading = false;
                this.showToast(
                    'bottom-right',
                    'success',
                    'Permission',
                    'The permission was added successfully'
                );
                // fetch permissions
                this.getPermissions();
            },
            error: err => {
                this.loading = false;
                this.showToast(
                    'bottom-right',
                    'danger',
                    'Error',
                    'An error occurred. Please try again'
                );
                this.errorHandler.handleError(err, this);
            },
        });
        return;
    }

    /** excecuted when the component mounts */
    ngOnInit() {
        // fetch permissions
        this.getPermissions();

        // Table headers
        this.tableHeader = [
            {
                text: 'Permission Details',
            },
            { text: 'Action' },
        ];

        // Table rows
        this.rows = [
            {
                key: 'description',
                type: 'string',
                nested: [{ type: 'string', value: 'name', label: 'Name' }],
            },
        ];

        // View Report Action button with quick patch action from sil.datatable
        this.actions = this['actions'] = [
            {
                btnText: 'Remove',
                status: 'danger',
                action: 'custom',
                expression: row => {
                    return row?.isAdded === true;
                },
                modalConf: {
                    customFxn: true,
                    Fxn: 'addOrRemovePermission',
                    action: 'quickPatch',
                    httpMethod: 'remove',
                    api: 'erp-role-permissions',
                    method: 'genericPatch',
                    successTitle: 'Remove Permission',
                    successMessage: 'Permission removed successfully',
                    failedTitle: 'Remove Permission',
                    failedMessage: 'Permission removal failed',
                },
                confirm: {
                    title: 'Remove permission',
                    text: 'Are you sure you want to remove this permission?',
                    showCancelButton: true,
                    cancelButtonColor: '#edf1f7',
                    confirmButtonText: 'Remove',
                },
            },
            {
                btnText: 'Add',
                status: 'success',
                action: 'custom',
                expression: row => {
                    return row?.isAdded !== true;
                },
                modalConf: {
                    customFxn: true,
                    Fxn: 'addOrRemovePermission',
                    action: 'quickPatch',
                    httpMethod: 'create',
                    api: 'erp-role-permissions',
                    method: 'genericPatch',
                    successTitle: 'Add permission',
                    successMessage: 'Permission added successfully',
                    failedTitle: 'Add permission',
                    failedMessage: 'Permission addition failed',
                },
                confirm: {
                    title: 'Add Permission',
                    text: 'Are you sure you want to add this permission?',
                    showCancelButton: true,
                    cancelButtonColor: '#edf1f7',
                    confirmButtonText: 'Add',
                },
            },
        ];
    }
}

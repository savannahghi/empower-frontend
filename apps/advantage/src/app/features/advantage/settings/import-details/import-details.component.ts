import { Component, Input, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';

@Component({
    selector: 'ngx-import-details',
    templateUrl: './import-details.component.html',
    styleUrls: ['./import-details.component.scss'],
    standalone: false,
})
export class ImportDetailsComponent implements OnInit {
    /**
     * Contains import information resolved from the state
     */
    @Input() importsObservable: any;

    /** import information is stored in this variable */
    import: any;

    /** Defines accepting into stock state */
    acceptingIntoStock: boolean = false;

    /** Defines process import state */
    processingImport: boolean = false;

    /**
     * Defines loading state
     */
    loading: boolean = true;

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
     * Used to override default form configurations
     */
    formConfig: { checkExpressionOn: string };

    /**
     * Used to display different toggle modals
     */
    toggle: Object = {};

    /**
     * Used to determine duration of the toast time
     */
    toastTime = 7000;

    constructor(
        public authService: Authorization,
        public dataLayer: SilStoresService,
        protected toastrService: NbToastrService,
        private errorHandler: ErrorHandlerService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public transition: Transition
    ) {}

    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    getImportInfo() {
        this.importsObservable.subscribe(
            (response: any) => {
                this.import = [response];
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }

    acceptIntoStock() {
        let unmappedItems = 0;

        this.getImportInfo();

        if (this.import[0].product === null) {
            unmappedItems += 1;
        }

        if (unmappedItems > 0) {
            this.toggleModal('alert');
        } else {
            this.loading = true;
            this.acceptingIntoStock = true;
            const dataObj = {
                id: this.uiglobals.params.id,
                view: 'accept_import',
                payload: {
                    import_transaction_status: 'APROVED',
                    quantity: this.import[0].quantity,
                },
            };

            this.dataLayer
                .createNested(
                    'imports',
                    dataObj.view,
                    dataObj.id,
                    dataObj.payload
                )
                .subscribe({
                    next: () => {
                        const msg = 'Import successfully accepted as stock';
                        const context = 'Success!!';
                        this.showToast('bottom-right', 'success', context, msg);
                        this.loading = false;
                        this.acceptingIntoStock = false;
                        this.$state.reload();
                    },
                    error: err => {
                        this.errorHandler.handleError(err, this);
                        this.loading = false;
                        this.acceptingIntoStock = false;
                    },
                });
        }
    }

    processImport() {
        this.loading = true;
        this.processingImport = true;
        const dataObj = {
            id: this.uiglobals.params.id,
            view: 'accept_import',
            payload: {
                import_transaction_status: 'PROCESS',
                quantity: this.import[0].quantity,
            },
        };

        this.dataLayer
            .createNested('imports', dataObj.view, dataObj.id, dataObj.payload)
            .subscribe({
                next: () => {
                    const msg = 'Import successfully accepted as non-stock';
                    const context = 'Success!!';
                    this.showToast('bottom-right', 'success', context, msg);
                    this.loading = false;
                    this.processingImport = false;
                    this.$state.reload();
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                    this.processingImport = false;
                },
            });
    }

    mapImport(model) {
        this.loading = true;
        const id = this.uiglobals.params.id;
        const params = {
            product: model?.product,
            quantity: model?.number_of_packages * model?.quantity_per_package,
        };

        this.dataLayer.update('imports', id, params).subscribe({
            next: () => {
                const msg = 'Import mapped';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Import has been mapped successfully'
                );
                this.loading = false;
                this.$state.reload();
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    ngOnInit() {
        this.getImportInfo();

        /**
         * Table headers
         */
        this.tableHeader = [
            { text: 'Item' },
            { text: 'Total Quantity' },
            { text: 'Action' },
        ];

        /** Table rows */
        this.rows = [
            {
                key: 'product_name',
                type: 'string',
                nested: [
                    {
                        label: 'Code',
                        key: 'product_code',
                        type: 'string',
                        value: 'product_code',
                    },
                ],
            },
            { key: 'quantity', type: 'number' },
        ];

        /** Table actions */
        this.actions = this['actions'] = [
            {
                btnText: 'Edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    isService: false,
                    store: 'map-import-form',
                    api: 'imports',
                    action: 'quickPatch',
                    httpMethod: 'update',
                    method: 'mapImport',
                    successTitle: 'Edit Item',
                    successMessage: 'Item edited',
                    failedTitle: 'Edit Item',
                    failedMessage: 'Item update has failed',
                },
            },
        ];

        this.formConfig = {
            checkExpressionOn: 'modelChange',
        };
    }
}

import { Component, OnInit } from '@angular/core';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { TranslateService } from '@ngx-translate/core';
import { NbButtonModule, NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ThemeModule } from '../../../../@theme/theme.module';
import { SilComboBoxModule } from '../../../../shared/sil-combo-box/sil-combo-box.module';
import { SilDatatableModule } from '../../../../shared/sil-datatable/sil-datatable.module';
import { SkikaFormModule } from '../../../../shared/sil-form/sil-form.module';
import _ from 'underscore';
import { SkikaLayoutModule } from '../../../../shared/sil-layout/sil-layout.module';
import { NgxTranslateModule } from '../../../../shared/translate/translate.module';

@Component({
    selector: 'ngx-product-list',
    templateUrl: './ngx-product-list.component.html',
    styleUrls: ['./ngx-product-list.component.scss'],
    imports: [
        SkikaFormModule,
        SilComboBoxModule,
        SkikaLayoutModule,
        NgxTranslateModule,
        SilDatatableModule,
        ThemeModule,
        NbButtonModule,
    ],
})
export class ProductListComponent implements OnInit {
    /**
     * Shows the loading of the xhr requests
     */
    loading: boolean = false;
    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;
    /**
     * Array used to define datatable grid actions
     */
    gridActions: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Object used to define the default filter params of the datatable
     */
    filterParams: Object;

    /**
     * Used to display a modal
     */
    showModal = false;
    /**
     * Used to display a default product modal
     */
    showdefaultProductModal = false;
    /**
     * Used to determine the service used in the form
     */
    heading: any = 'add-user-to-group';

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * determines if model is being editted or viewed
     */
    view: boolean = false;

    showPreviewPriceList: boolean = false;

    model: any;

    /**
     * holds the pricelist information including the status
     */
    pricelist: any;

    /**
     * holds the pricelist status
     */
    pricelistStatus: any;

    /*
    /**
     * Constructor
     * @param uiglobals Contains the uiglobals
     */
    constructor(
        public uiglobals: UIRouterGlobals,
        public state: StateService,
        public transition: Transition,
        public dataLayer: SilStoresService,
        protected toastrService: NbToastrService,
        private errorHandler: ErrorHandlerService,
        private translate: TranslateService
    ) {}

    /**
     * Used to toggle the modal
     */
    toggleModal() {
        this.heading = 'add-user-to-group';
        this.showModal = !this.showModal;
        this.view = false;
    }

    /**
     * Used to toggle default product modal
     */
    toggleDefaultProductModal() {
        this.heading = 'add-user-to-group';
        this.showdefaultProductModal = !this.showdefaultProductModal;
    }

    /**
     * adds product to individual category pricelist (not default)
     */
    addProduct(model) {
        const data = {
            pricelist: this.uiglobals.params.id,
            product: model['product'].id,
            product_service: model['product'].id,
            price_inclusive_tax: model.price_inclusive_tax,
            currency: model.currency,
        };
        this.dataLayer.create('price-list-products', data).subscribe({
            next: this.receivePricelistProducts,
            error: this.errorHandlerAddProduct,
        });
    }

    /** Error handler for addDefautProduct api calls */
    errorHandlerAddProduct = err => {
        this.errorHandler.handleError(err, this);
        this.toggleModal();
    };

    /**
     * adds default product from charge master to default pricelist
     */
    addDefautProduct(model) {
        const categories = _.pluck(model.product_category, 'id');
        const data = {
            name: model['name'],
            preferred_name: model['name'],
            product_type: model['product_type'],
            categories: categories,
            slade_code: model['selectedItem']['slade_code'],
            selling_price: model['selling_price'],
            purchasing_price: model['purchasing_price'],
            sale_taxes: model.sale_taxes,
            purchase_taxes: model.purchase_taxes,
        };
        this.dataLayer.create('products', data).subscribe({
            next: this.receivePricelistProducts,
            error: this.errorHandlerAddDefautProduct,
        });
    }

    /** Error handler for addDefautProduct api calls */
    errorHandlerAddDefautProduct = err => {
        this.errorHandler.handleError(err, this);
        this.toggleDefaultProductModal();
    };

    /** Handles the response from adding product */
    receivePricelistProducts = () => {
        this.state.reload();
        const msg = 'Added product Successful';
        const context = 'Add Product';
        this.showToast('bottom-right', 'success', msg, context);
    };

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    toggleViewPricelist(event?) {
        this.view = true;
        this.model = event;
        this.showPreviewPriceList = !this.showPreviewPriceList;
        this.showModal = false;
    }

    /**
     * Fetches the pricelist information
     */
    getPricelistInfo() {
        if (this.transition.params().id) {
            this.dataLayer
                .get('pricelists', this.transition.params().id)
                .subscribe({
                    next: this.receivePricelistInfo,
                    error: this.errorHandlerFxn,
                });

            /**
             * Used to set the table's filters
             * */
            this.filterParams = {
                page_size: '10',
                pricelist: this.uiglobals.params.id,
                pricelist_prods_search: '',
            };
        } else {
            this.filterParams = {
                page_size: '10',
                pricelist_prods_search: '',
            };
        }
    }

    /** Handle pricelist response info */
    receivePricelistInfo = response => {
        this.pricelist = response;
        this.pricelistStatus = response?.pricelist_status;
    };

    /** Error handler for api calls */
    errorHandlerFxn = err => {
        this.errorHandler.handleError(err, this);
    };

    /**
     * Lifecycle hook used when component is first initialized
     */
    ngOnInit() {
        /**
         * Fetch pricelist information
         */
        this.getPricelistInfo();

        /**
         * Table header
         */
        this.tableHeader = [
            { text: 'pricelists.products.table_header.product_name' },
            { text: 'pricelists.products.table_header.selling_price' },
            { text: 'pricelists.products.table_header.status' },
            { text: 'pricelists.products.table_header.action' },
        ];

        /**
         * Table rows
         */
        this.rows = [
            {
                key: 'product_name',
                type: 'string',
            },
            {
                key: 'price_inclusive_tax',
                type: 'currency',
            },
            {
                key: 'active',
                type: 'boolean',
            },
        ];

        /**
         * Edit Action button with quick patch action from sil.datatable
         */
        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    context: 'Edit Product Price',
                    store: 'priceListItemService',
                    isService: true,
                    sort: true,
                    action: 'quickPatch',
                    method: 'patchProduct',
                },
            },
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'custom',
                modalConf: {
                    customFxn: true,
                },
            },
            {
                btnText: 'shared.buttons.remove',
                status: 'danger',
                action: 'quickPatch',
                confirm: {
                    title: 'Confirm Delete',
                    text: 'Are you sure you want to remove this product from the pricelist?',
                    showCancelButton: true,
                    cancelButtonColor: '#edf1f7',
                    confirmButtonText: 'Delete',
                },
                modalConf: {
                    method: 'removePricelistProduct',
                },
            },
        ];
    }
}

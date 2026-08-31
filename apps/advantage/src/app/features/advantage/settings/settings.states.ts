import { Ng2StateDeclaration, Transition } from '@uirouter/angular';
import { environment } from '../../../../environments/environment';
import { SettingListComponent } from './setting-list/setting-list.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { ResolverService } from '../../services/resolver.service';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupMembersComponent } from './group-members/group-members.component';
import { PriceListComponent } from './pricelist-list/pricelist-list.component';
import { NewSalesPricelistComponent } from './new-sales-pricelist/new-sales-pricelist.component';
import { PricelistDetailsComponent } from './pricelist-details/pricelist-details.component';
import { PricelistBulkUploadComponent } from './pricelist-bulk-upload/pricelist-bulk-upload.component';
import { ListComponent } from '../../../shared/list/list.component';
import { DetailComponent } from '../../../shared/detail/detail.component';
import { ViewClinicComponent } from '../clinics/view-clinic/view-clinic.component';
import { ProductListComponent } from './product-list/ngx-product-list.component';
import { BranchSettingListComponent } from './branchsetting-list/branchsetting-list.component';
import { OrganisationUpdateComponent } from './organisation-update/organisation-update.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ImportDetailsComponent } from './import-details/import-details.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { NewPaymentMethodsComponent } from './new-payment-methods/new-payment-methods.component';
import { OperatingRegionsComponent } from './operating-regions/operating-regions.component';
import { PricelistFileUploadDetailsComponent } from './pricelist-file-upload-details/pricelist-file-upload-details.component';

/**
 * Renders the settings list component
 */
export const settingsState: Ng2StateDeclaration = {
    name: 'app.advantage.settings',
    url: '/settings',
    breadcrumb: () => 'Settings',
    data: {
        requiresAuth: true,
    },
};

/**
 * Renders the branch settings list component
 */
export const branchSettingState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.branchlevel',
    url: '/branch_settings',
    breadcrumb: () => 'Branch Settings',
    data: {
        requiresAuth: true,
        permission: 'erp.is_branch_level',
    },
    views: {
        '$default@app.advantage': {
            component: BranchSettingListComponent,
        },
    },
};

/**
 * Renders the settings list component
 */
export const settingsOrgLevelState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.orglevel',
    url: '/organisation_settings',
    breadcrumb: () => 'Organisation Settings',
    data: {
        requiresAuth: true,
        permission: 'erp.is_organisation_level',
    },
    views: {
        '$default@app.advantage': {
            component: SettingListComponent,
        },
    },
};

/**
 * Packaging Units
 */
export const packagingUnitsState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.packaging_units',
    url: '/packaging_units?search&page_size&page',
    breadcrumb: () => 'Packaging Units',
    data: {
        requiresAuth: true,
        etimsRows: [
            {
                key: 'code',
                type: 'string',
            },
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'description',
                type: 'string',
            },
        ],
        etimsTableHeader: [
            { text: 'Unit Code' },
            { text: 'Unit Name' },
            { text: 'Unit Description' },
        ],
        filterParams: {
            page_size: '10',
        },
        etimsHeaderActions: [
            {
                btnText: 'eTIMS Sync',
                status: 'primary',
                action: 'apiCall',
                actionConf: {
                    httpMethod: 'list',
                    api: 'sync-packaging-units',
                    successTitle: 'Success',
                    successMessage:
                        'Synchronised eTIMS Packaging Units Successfully',
                    failedTitle: 'Failed',
                    failedMessage:
                        'Failed to synchronise eTIMS packaging units',
                },
            },
        ],
        pageTitle: 'Packaging Units',
        pageSubTitle:
            'List of the packaging units that have been setup from eTIMS',
        hideCreateButton: true,
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'packaging-units',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Packaging Units',
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

/**
 * Renders an edit page for organisation
 */
export const updateOrganisationState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.orglevel.edit',
    url: '/edit',
    breadcrumb: () => 'Edit Organisation',
    data: {
        requiresAuth: true,
    },
    views: {
        '$default@app.advantage': {
            component: OrganisationUpdateComponent,
        },
    },
};

/** taxes list State
 * State contains the organisation's taxes
 */
export const taxesState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.taxes',
    url: '/taxes?search&page_size&page',
    breadcrumb: () => 'Taxes',
    data: {
        requiresAuth: true,
        hideCreateButton: true,
        rows: [
            {
                key: 'tax_code',
                type: 'string',
            },
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'active',
                type: 'statusColor',
            },
        ],
        etimsRows: [
            {
                key: 'tax_code',
                type: 'string',
            },
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'active',
                type: 'statusColor',
            },
        ],
        tableHeader: [
            { text: 'Tax Code' },
            { text: 'Tax Name' },
            { text: 'Status' },
            { text: 'Action' },
        ],
        etimsTableHeader: [
            { text: 'Tax Code' },
            { text: 'Tax Name' },
            { text: 'Status' },
            { text: 'Action' },
        ],
        headerActions: [],
        etimsHeaderActions: [
            {
                btnText: 'eTIMS Sync',
                status: 'primary',
                action: 'apiCall',
                actionConf: {
                    httpMethod: 'list',
                    api: 'sync-etims-taxes',
                    successTitle: 'Success',
                    successMessage: 'Synchronised eTIMS Taxes Successfully',
                    failedTitle: 'Failed',
                    failedMessage: 'Failed to synchronise eTIMS taxes',
                },
            },
        ],
        actions: [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    store: 'add-tax',
                    api: 'taxes',
                    action: 'quickPatch',
                    httpMethod: 'update',
                    method: 'genericPatch',
                    successTitle: 'Edit Tax',
                    successMessage: 'Tax edited',
                    failedTitle: 'Edit Tax',
                    failedMessage: 'Tax updating has',
                },
            },
        ],
        actionsEtims: [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    store: 'add-tax',
                    api: 'taxes',
                    action: 'quickPatch',
                    httpMethod: 'update',
                    method: 'genericPatch',
                    successTitle: 'Edit Tax',
                    successMessage: 'Tax edited',
                    failedTitle: 'Edit Tax',
                    failedMessage: 'Tax updating has',
                },
            },
        ],
        pageTitle: 'Taxes',
        pageSubTitle: 'List of the available taxes that have been setup',
        formlyJsonFilename: 'add-tax',
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'taxes',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Taxes',
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

/** tax offices list State
 * State contains the organisation's tax offices
 */
export const taxOfficesState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.taxOffices',
    url: '/tax-offices?search&page_size&page',
    breadcrumb: () => 'Tax Offices',
    data: {
        requiresAuth: true,
        hideCreateButton: true,
        etimsRows: [
            {
                key: 'code',
                type: 'string',
            },
            {
                key: 'name',
                type: 'string',
            },
        ],
        etimsTableHeader: [
            { text: 'Tax Office Code' },
            { text: 'Tax Office Name' },
        ],
        filterParams: {
            page_size: '10',
        },
        etimsHeaderActions: [
            {
                btnText: 'eTIMS Sync',
                status: 'primary',
                action: 'apiCall',
                actionConf: {
                    httpMethod: 'list',
                    api: 'sync-tax-offices',
                    successTitle: 'Success',
                    successMessage:
                        'Synchronised eTIMS Tax Offices Successfully',
                    failedTitle: 'Failed',
                    failedMessage: 'Failed to synchronise eTIMS tax offices',
                },
            },
        ],

        pageTitle: 'Tax Offices',
        pageSubTitle:
            'List of the available tax offices that have been setup from eTIMS',
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'tax-offices',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Tax Office',
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

/** item classifications State
 *
 * List item classifications from eTIMS + API hookup
 */
export const itemClassificationState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.itemclassification',
    url: '/itemclassification?search&page_size&page',
    breadcrumb: () => 'Item Classifications',
    data: {
        requiresAuth: true,
        etimsRows: [
            {
                key: 'classification_code',
                type: 'string',
            },
            {
                key: 'classification_name',
                type: 'string',
            },
            {
                key: 'classification_level',
                type: 'string',
            },
        ],
        etimsTableHeader: [
            { text: 'Item Class Code' },
            { text: 'Item Class Name' },
            { text: 'Item Class Level' },
        ],
        filterParams: {
            page_size: '10',
        },
        etimsHeaderActions: [
            {
                btnText: 'eTIMS Sync',
                status: 'primary',
                action: 'apiCall',
                actionConf: {
                    httpMethod: 'list',
                    api: 'fetch-item-classifications',
                    successTitle: 'Success',
                    successMessage:
                        'Synchronised eTIMS Item Classifications Successfully',
                    failedTitle: 'Failed',
                    failedMessage:
                        'Failed to synchronise eTIMS item classifications',
                },
            },
        ],

        pageTitle: 'Item Classifications',
        pageSubTitle: 'This is a list of item classifications from eTIMS',
        hideCreateButton: true,
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'item-classifications',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: ListComponent,
        },
    },
};
/** Unit of Measure State
 *
 * List Unit of Measure from eTIMS + API hookup
 */
export const unitMeasureState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.unitmeasure',
    url: '/unitmeasure?search&page_size&page',
    breadcrumb: () => 'Unit of Measure',
    data: {
        requiresAuth: true,
        etimsRows: [
            {
                key: 'code',
                type: 'string',
            },
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'description',
                type: 'string',
            },
        ],
        etimsTableHeader: [
            { text: 'Unit Code' },
            { text: 'Unit Name' },
            { text: 'Unit Description' },
        ],
        filterParams: {
            page_size: '10',
        },
        etimsHeaderActions: [
            {
                btnText: 'eTIMS Sync',
                status: 'primary',
                action: 'apiCall',
                actionConf: {
                    httpMethod: 'list',
                    api: 'fetch-unit-measure',
                    successTitle: 'Success',
                    successMessage:
                        'Synchronised eTIMS Units of Measure Successfully',
                    failedTitle: 'Failed',
                    failedMessage:
                        'Failed to synchronise eTIMS units of measure',
                },
            },
        ],

        pageTitle: 'Units of Measure',
        pageSubTitle: 'This is a list of units of measure from eTIMS',
        hideCreateButton: true,
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'unit-measure',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: ListComponent,
        },
    },
};

/** currency list State
 * State contains the organisation's currencies
 */
export const currencyState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.currencies',
    url: '/currencies?search&page_size&page',
    breadcrumb: () => 'Currencies',
    data: {
        requiresAuth: true,
        rows: [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'id',
                type: 'hidden',
            },
            {
                key: 'iso_code',
                type: 'string',
            },
            {
                key: 'is_default',
                type: 'booleanToString',
            },
            {
                key: 'conversion_rate',
                type: 'number',
            },
            {
                key: 'active',
                type: 'booleanToString',
            },
        ],
        etimsRows: [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'id',
                type: 'hidden',
            },
            {
                key: 'iso_code',
                type: 'string',
            },
            {
                key: 'is_default',
                type: 'booleanToString',
            },
            {
                key: 'conversion_rate',
                type: 'string',
            },
            {
                key: 'active',
                type: 'booleanToString',
            },
        ],
        tableHeader: [
            { text: 'Name' },
            { text: 'ISO Code' },
            { text: 'Default?' },
            { text: 'Conversion' },
            { text: 'Active' },
            { text: 'Action' },
        ],
        etimsTableHeader: [
            { text: 'Name' },
            { text: 'ISO Code' },
            { text: 'Default?' },
            { text: 'Conversion' },
            { text: 'Active' },
            { text: 'Action' },
        ],
        actions: [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    store: 'add-currency',
                    api: 'currencys',
                    action: 'quickPatch',
                    httpMethod: 'update',
                    method: 'genericPatch',
                    successTitle: 'Edit Currency',
                    successMessage: 'Currency edited',
                    failedTitle: 'Edit Currency',
                    failedMessage: 'Currency updating has',
                },
            },
            {
                btnText: 'Set default currency',
                status: 'success',
                action: 'modal',
                modalConf: {
                    store: 'add-currency',
                    api: 'currencys',
                    view: 'set_as_default',
                    action: 'quickPatch',
                    httpMethod: 'updateNested',
                    method: 'genericNestedPatch',
                    successTitle: 'Set Default Currency',
                    successMessage: 'Default currency set',
                    failedTitle: 'Set Default currency',
                    failedMessage: 'Default currency not set',
                },
            },
        ],
        actionsEtims: [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    store: 'add-currency',
                    api: 'currencys',
                    action: 'quickPatch',
                    httpMethod: 'update',
                    method: 'genericPatch',
                    successTitle: 'Edit Currency',
                    successMessage: 'Currency edited',
                    failedTitle: 'Edit Currency',
                    failedMessage: 'Currency updating has',
                },
            },
            {
                btnText: 'Set default currency',
                status: 'success',
                action: 'modal',
                modalConf: {
                    store: 'add-currency',
                    api: 'currencys',
                    view: 'set_as_default',
                    action: 'quickPatch',
                    httpMethod: 'updateNested',
                    method: 'genericNestedPatch',
                    successTitle: 'Set Default Currency',
                    successMessage: 'Default currency set',
                    failedTitle: 'Set Default currency',
                    failedMessage: 'Default currency not set',
                },
            },
        ],
        pageTitle: 'Currencies',
        pageSubTitle: 'List of the available currencies that have been setup',
        formlyJsonFilename: 'add-currency',
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'currencys',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Currency',
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

/** currency list State
 * State contains the organisation's currencies
 */
export const queuesState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.queues',
    url: '/queues?search&page_size&page',
    breadcrumb: () => 'Queues',
    data: {
        requiresAuth: true,
        rows: [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'queue_type',
                type: 'string',
            },
            {
                key: 'active',
                type: 'boolean',
            },
        ],
        etimsRows: [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'queue_type',
                type: 'string',
            },
            {
                key: 'active',
                type: 'booleanToString',
            },
        ],
        tableHeader: [
            { text: 'Name' },
            { text: 'Queue Type' },
            { text: 'Active' },
            { text: 'Action' },
        ],
        etimsTableHeader: [
            { text: 'Name' },
            { text: 'Queue Type' },
            { text: 'Active' },
            { text: 'Action' },
        ],
        actions: [
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.settings.queues.detail.schedule',
                    stateParams: {
                        queue_id: 'id',
                        schedule_id: 'schedule',
                    },
                },
            },
        ],
        actionsEtims: [
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.settings.queues.detail.schedule',
                    stateParams: {
                        queue_id: 'id',
                        schedule_id: 'schedule',
                    },
                },
            },
        ],
        pageTitle: 'Queues',
        hasSearch: true,
        pageSubTitle: 'List of the queues that have been setup',
        formlyServiceFilename: 'addQueueService',
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'queues',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Queue',
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

/**
 * This is the detail state for a queue item
 *
 */
export const queueDetailState = {
    name: 'app.advantage.settings.queues.detail',
    url: '/queue/:queue_id',
    breadcrumb: () => 'Detail',
    data: {
        requiresAuth: true,
        mainDisplayValue: 'name',
        secondaryDisplayValues: [{ label: 'Type', value: 'queue_type' }],
        childStates: [
            {
                name: 'app.advantage.settings.queues.detail.schedule',
                display: 'Clinic',
                params: [{ key: 'schedule_id', value: 'schedule' }],
            },
        ],
    },
    resolve: [
        {
            token: 'recordDetailObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc, transition) =>
                resolveSvc.resolveItem('queues', transition.params().queue_id),
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

/**
 * This is the detail state for a queue item
 *
 */
export const queueDetailScheduleState = {
    name: 'app.advantage.settings.queues.detail.schedule',
    url: '/schedule/:schedule_id',
    breadcrumb: () => 'Clinic',
    data: {
        requiresAuth: true,
        useThisParamInstead: 'schedule_id',
    },
    bindings: {
        resolveData: 'recordDetailObservable',
    },
    views: {
        'detail@app.advantage.settings.queues.detail': {
            component: ViewClinicComponent,
        },
    },
};

/**
 * Renders the organisation cluster component
 */

/**
 * Renders organization  view cluster details banner and tabs
 */

/**
 * Contains the basic details of a cluster, and one can update cluster details
 */

/**
 * renders branches specific to a particular cluster
 */

/**
 * Renders the organisation branch component
 */

/**
 * Renders the organisation view branch banner and the tabs
 */

/**
 * Contains the basic details component where one can update the basic details of their branch
 */

/**
 * Renders the organisation branch customers component
 */

/**
 * Renders the organisation dept component
 */

/**
 * List products
 */
export const productsState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.products',
    url: '/products?search&page_size&page',
    breadcrumb: () => 'Products',
    data: {
        requiresAuth: true,
        createState: 'app.advantage.settings.addproduct',
        hideCreateButton: true,
        rows: [
            {
                key: 'name',
                type: 'string',
                nested: [
                    {
                        key: 'scu_item_code',
                        label: 'Code',
                        value: 'scu_item_code',
                        type: 'string',
                    },
                ],
            },
            {
                key: 'product_type',
                type: 'string',
            },
            {
                path: 'taxes.sales_tax.0.name',
                type: 'mineVal',
            },

            {
                key: 'selling_price',
                type: 'number',
                format: 'currency',
            },
        ],
        etimsRows: [
            {
                key: 'name',
                type: 'string',
                nested: [
                    {
                        key: 'scu_item_code',
                        label: 'Code',
                        value: 'scu_item_code',
                        type: 'string',
                    },
                ],
            },
            {
                key: 'product_type',
                type: 'string',
            },
            {
                path: 'taxes.sales_tax.0.name',
                type: 'mineVal',
            },

            {
                key: 'sent_to_etims',
                type: 'booleanToString',
            },
            {
                key: 'selling_price',
                type: 'number',
                format: 'currency',
            },
        ],
        tableHeader: [
            { text: 'Name' },
            { text: 'Type' },
            { text: 'Tax rate' },
            { text: 'Unit Price', className: 'text-end' },
            { text: 'settings.msg_grp.action' },
        ],

        etimsTableHeader: [
            { text: 'Name' },
            { text: 'Type' },
            { text: 'Tax rate' },
            { text: 'Sent to eTIMS' },
            { text: 'Unit Price', className: 'text-end' },
            { text: 'settings.msg_grp.action' },
        ],
        filterParams: {
            page_size: '10',
        },
        hasSearch: true,
        actions: [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    context: 'Edit Product/Service',
                    formConfig: {
                        checkExpressionOn: 'changeDetectionCheck',
                    },
                    store: 'productItemService',
                    isService: true,
                    action: 'quickPatch',
                    httpMethod: 'update',
                    api: 'products',
                    method: 'updateProductPatch',
                    successTitle: 'Edit Product',
                    successMessage: 'Product details updated successfully',
                    failedTitle: 'Edit Product',
                },
            },
        ],
        actionsEtims: [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    context: 'Edit Product/Service',
                    formConfig: {
                        checkExpressionOn: 'changeDetectionCheck',
                    },
                    store: 'etimsProductItemService',
                    isService: true,
                    action: 'quickPatch',
                    httpMethod: 'update',
                    api: 'products',
                    method: 'updateProductPatch',
                    successTitle: 'Edit Product',
                    successMessage: 'Product details updated successfully',
                    failedTitle: 'Edit Product',
                },
            },
        ],
        headerActions: [],
        etimsHeaderActions: [
            {
                btnText: 'Fetch eTIMS Products',
                status: 'warning',
                action: 'apiCall',
                actionConf: {
                    httpMethod: 'list',
                    api: 'fetch-etims-products',
                    loadingState: 'fetchProducts',
                    successTitle: 'Success',
                    successMessage: 'Fetched eTIMS Products successfully',
                    failedTitle: 'Failed',
                    failedMessage: 'Failed to fetch eTIMS Products',
                },
            },
            {
                btnText: 'eTIMS Sync',
                status: 'primary',
                action: 'apiCall',
                actionConf: {
                    httpMethod: 'create',
                    api: 'post-products',
                    successTitle: 'Success',
                    loadingState: 'postProducts',
                    successMessage:
                        'Synchronised eTIMS Products listing successfully',
                    failedTitle: 'Failed',
                    failedMessage:
                        'Failed to synchronise eTIMS Products listing',
                },
            },
        ],
        formlyServiceFilename: 'productItemService',
        pageTitle: 'Products',
        pageSubTitle: 'This is a list of the products that have been setup',
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'products',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Product/Service',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: ListComponent,
        },
    },
};

/**
 * Adding new product
 */
export const addProductState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.addproduct',
    url: '/addproduct',
    breadcrumb: () => 'Add Product',
    data: {
        requiresAuth: true,
        pageTitle: 'Add new product',
        pageSubTitle: 'Fill out the item details here',
        createState: 'app.advantage.settings.products',
        hideCreateButton: true,
        formlyServiceFilename: 'productItemService',
        formlyServiceFilenameEtims: 'etimsProductItemService',
    },
    resolve: [
        {
            token: 'storeLabel',
            resolveFn: () => 'Back',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: AddProductComponent,
        },
    },
};

/**
 * List product categories
 */
export const productCategoriesState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.productcategories',
    url: '/products/categories?search&page_size&page',

    breadcrumb: () => 'Categories',
    data: {
        requiresAuth: true,
        rows: [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'costing_method',
                type: 'string',
            },
        ],
        etimsRows: [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'costing_method',
                type: 'string',
            },
        ],
        tableHeader: [
            { text: 'Product Category' },
            { text: 'Costing Method' },
            { text: 'settings.msg_grp.action' },
        ],
        etimsTableHeader: [
            { text: 'Product Category' },
            { text: 'Costing Method' },
            { text: 'settings.msg_grp.action' },
        ],
        filterParams: {
            page_size: '10',
        },
        hasSearch: true,
        actions: [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    context: 'Edit Product Category',
                    formConfig: {
                        checkExpressionOn: 'changeDetectionCheck',
                    },
                    store: 'addProductCategoryFormService',
                    isService: true,
                    action: 'quickPatch',
                    httpMethod: 'update',
                    api: 'product-categories',
                    method: 'updateProductPatch',
                    successTitle: 'Edit Product Category',
                    successMessage: 'Product category updated successfully',
                    failedTitle: 'Edit Product Category',
                    failedMessage: 'Failed to update product category',
                },
            },
        ],
        actionsEtims: [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    context: 'Edit Product Category',
                    formConfig: {
                        checkExpressionOn: 'changeDetectionCheck',
                    },
                    store: 'addProductCategoryFormService',
                    isService: true,
                    action: 'quickPatch',
                    httpMethod: 'update',
                    api: 'product-categories',
                    method: 'updateProductPatch',
                    successTitle: 'Edit Product Category',
                    successMessage: 'Product category updated successfully',
                    failedTitle: 'Edit Product Category',
                    failedMessage: 'Failed to update product category',
                },
            },
        ],
        formlyServiceFilename: 'addProductCategoryFormService',
        pageTitle: 'Product Categories',
        pageSubTitle: 'Find all product categories here',
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'product-categories',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Product Category',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: ListComponent,
        },
    },
};

/**
 * Renders the Payment Methods component
 */
export const paymentMethodsState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.payment_methods',
    url: '/payment_methods?search&page_size&page',
    breadcrumb: () => 'Payment Methods',
    data: {
        requiresAuth: true,
        permission: 'erp.is_organisation_level',
    },
    views: {
        '$default@app.advantage': {
            component: PaymentMethodsComponent,
        },
    },
};

/**
 * Renders the add new pricelist list component
 * allows one to create an appointment
 */
export const pricelistBulkUploadState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.pricelists.bulk_upload',
    url: '/bulk_upload?id&search',
    breadcrumb: () => 'Pricelist Bulk Upload',
    data: {
        requiresAuth: true,
        permission: 'erp.is_organisation_level',
    },
    views: {
        '$default@app.advantage': {
            component: PricelistBulkUploadComponent,
        },
    },
};

export const pricelistBulkUploadedFilesState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.pricelists.bulk_file_uploads',
    url: '/pricelist_file_uploads?&search&page_size&page&status',
    breadcrumb: () => 'Pricelist Uploads',
    data: {
        requiresAuth: true,
        hideCreateButton: true,
        ignoreDisplayFilters: ['pricelist_type'],
        tableHeader: [
            { text: 'Upload Date' },
            { text: 'File' },
            { text: 'Upload Stats' },
            { text: 'Status' },
            { text: 'Action' },
        ],
        etimsTableHeader: [
            { text: 'Upload Date' },
            { text: 'File' },
            { text: 'Upload Stats' },
            { text: 'Status' },
            { text: 'Action' },
        ],
        statusFilters: [
            {
                display: 'All',
                filter: {
                    status: 'clear',
                },
            },
            {
                display: 'Pending',
                filter: {
                    status: 'PENDING',
                },
            },
            {
                display: 'Complete',
                filter: {
                    status: 'COMPLETED',
                },
            },
        ],
        rows: [
            {
                nested: [
                    {
                        value: 'created',
                        type: 'dateTimeUTC',
                    },
                    {
                        value: 'created',
                        type: 'waitingTime',
                    },
                ],
            },
            {
                key: 'file_name',
                type: 'string',
            },
            {
                nested: [
                    {
                        label: 'Failed',
                        type: 'string',
                        value: 'fail_count',
                    },
                    {
                        label: 'Succeeded',
                        type: 'string',
                        value: 'success_count',
                    },
                ],
            },
            {
                key: 'status',
            },
        ],
        etimsRows: [
            {
                nested: [
                    {
                        value: 'created',
                        type: 'dateTimeUTC',
                    },
                    {
                        value: 'created',
                        type: 'waitingTime',
                    },
                ],
            },
            {
                key: 'file_name',
                type: 'string',
            },
            {
                nested: [
                    {
                        label: 'Failed',
                        type: 'string',
                        value: 'fail_count',
                    },
                    {
                        label: 'Succeeded',
                        type: 'string',
                        value: 'success_count',
                    },
                ],
            },
            {
                key: 'status',
                type: 'statusColor',
            },
        ],
        filterParams: {
            fields: 'id,file_name,created,fail_count,success_count,status',
            page_size: '10',
        },
        actions: [
            {
                btnText: 'shared.buttons.view',
                status: 'success',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.settings.pricelists.bulk_file_uploads.pricelist-file-details',
                    stateParams: {
                        id: 'id',
                    },
                },
            },
        ],
        actionsEtims: [
            {
                btnText: 'shared.buttons.view',
                status: 'success',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.settings.pricelists.bulk_file_uploads.pricelist-file-details',
                    stateParams: {
                        id: 'id',
                    },
                },
            },
        ],
        createState: 'app.advantage.settings.pricelists.bulk_upload',
        pageTitle: `Pricelist File Uploads`,
        pageSubTitle: `Below is the list of Pricelist File Uploads`,
        hasSearch: true,
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'pricelist-uploads',
        },
        {
            token: 'storeLabel',
            resolveFn: () => `Pricelist Uploads`,
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

/**
 * Renders the add new pricelist list component
 * allows one to create an appointment
 */
export const addNewPricelistState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.pricelists.new_pricelist',
    url: '/new_pricelist?step&id&search',
    breadcrumb: () => 'New Pricelist',
    data: {
        requiresAuth: true,
        permission: 'erp.is_organisation_level',
    },
    views: {
        '$default@app.advantage': {
            component: NewSalesPricelistComponent,
        },
    },
};

/**
 * Renders the add new payment method component
 * allows one to create an appointment
 */
export const addNewPaymentMethodState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.payment_methods.new_payment_method',
    url: '/new_payment_method',
    breadcrumb: () => 'New Payment Method',
    data: {
        requiresAuth: true,
        permission: 'erp.is_organisation_level',
    },
    views: {
        '$default@app.advantage': {
            component: NewPaymentMethodsComponent,
        },
    },
};

/**
 * Renders the pricelist list component
 */
export const pricelistState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.pricelists',
    url: '/pricelists?pricelist_type&page&page_size',
    breadcrumb: () => 'Pricelists',
    data: {
        requiresAuth: true,
        permission: 'erp.is_organisation_level',
    },
    views: {
        '$default@app.advantage': {
            component: PriceListComponent,
        },
    },
};

/**
 * View pricelist
 */
export const pricelistViewState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.pricelists.details',
    url: '/view/:id',
    breadcrumb: () => 'Detail',
    redirectTo: 'app.advantage.settings.pricelists.details.products',
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'pricelistObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc, transition) =>
                resolveSvc.resolveItem('pricelists', transition.params().id),
        },
    ],
    bindings: {
        resolveData: 'pricelistObservable',
    },
    views: {
        '$default@app.advantage': {
            component: PricelistDetailsComponent,
        },
    },
};

/**
 * View uploaded file pricelist
 */
export const pricelistBulkUploadViewState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.pricelists.bulk_file_uploads.pricelist-file-details',
    url: '/view/:id',
    breadcrumb: () => 'Details',
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'pricelistUploadFileObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc, transition) =>
                resolveSvc.resolveItem(
                    'pricelist-uploads',
                    transition.params().id
                ),
        },
    ],
    bindings: {
        resolveData: 'pricelistObservable',
    },
    views: {
        '$default@app.advantage': {
            component: PricelistFileUploadDetailsComponent,
        },
    },
};

/** pricelistProducts State
 * State contains the members of a group
 * The component shows you members of a group
 */
export const pricelistProductsState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.pricelists.details.products',
    url: '/products?search',
    breadcrumb: () => 'Products',
    data: {
        requiresAuth: true,
    },
    views: {
        'detail@app.advantage.settings.pricelists.details': {
            component: ProductListComponent,
        },
    },
};

/**
 * List message groups
 */
export const messageGroupState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.groups',
    url: '/groups',
    breadcrumb: () => 'Message groups',
    data: {
        requiresAuth: true,
        rows: [
            {
                key: 'role',
                type: 'string',
            },
            {
                key: 'description',
                type: 'string',
            },
            {
                key: 'active',
                type: 'boolean',
            },
        ],
        etimsRows: [
            {
                key: 'role',
                type: 'string',
            },
            {
                key: 'description',
                type: 'string',
            },
            {
                key: 'active',
                type: 'boolean',
            },
        ],
        tableHeader: [
            { text: 'settings.msg_grp.name' },
            { text: 'settings.msg_grp.description' },
            { text: 'settings.msg_grp.active' },
            { text: 'settings.msg_grp.action' },
        ],
        etimsTableHeader: [
            { text: 'settings.msg_grp.name' },
            { text: 'settings.msg_grp.description' },
            { text: 'settings.msg_grp.active' },
            { text: 'settings.msg_grp.action' },
        ],
        actions: [
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.settings.groups.detail.members',
                },
            },
        ],
        actionsEtims: [
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.settings.groups.detail.members',
                },
            },
        ],
        formlyJsonFilename: 'add-group',
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'groups',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Group',
        },
    ],
    views: {
        '$default@app.advantage': {
            component: ListComponent,
        },
    },
};

/**
 * View message group
 */
export const groupViewState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.groups.detail',
    url: '/view/:id',
    breadcrumb: () => 'View message group',
    redirectTo: 'app.advantage.settings.groups.detail.members',
    data: {
        requiresAuth: true,
        permission: 'advantage.group_list',
    },
    resolve: [
        {
            token: 'groupObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc, transition) =>
                resolveSvc.resolveItem('groups', transition.params().id),
        },
    ],
    bindings: {
        resolveData: 'groupObservable',
    },
    views: {
        '$default@app.advantage': {
            component: GroupDetailsComponent,
        },
    },
};

/** groupMembersState
 * State contains the members of a group
 * The component shows you members of a group
 */
export const groupMembersState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.groups.detail.members',
    url: '/members',
    breadcrumb: () => 'Members',
    data: {
        requiresAuth: true,
        permission: 'advantage.group_list',
    },
    views: {
        'detail@app.advantage.settings.groups.detail': {
            component: GroupMembersComponent,
        },
    },
};

/**
 * Renders the any formly form, provided it is given the json structure
 * and search, filter for any appointment
 */
export const surveyFormState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.postvisitsurvey',
    url: '/post_visit_survey',
    breadcrumb: () => 'Post visit survey',
    data: {
        requiresAuth: true,
        featureFlag: environment.displayFeature === 'false',
    },
    views: {
        '$default@app.advantage': {
            component: FormBuilderComponent,
        },
    },
};

/** operatingRegionsState
 * State contains the operating regions of a provider
 * The component shows you the operating regions and allows you
 * to create them.
 */
export const operatingRegionsState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.operatingregions',
    url: '/operating_regions',
    breadcrumb: () => 'Operating Regions',
    data: {
        requiresAuth: true,
    },
    views: {
        '$default@app.advantage': {
            component: OperatingRegionsComponent,
        },
    },
};

/** Imports list state
 * State contains the organisation's imports synced from KRA
 */
export const importsState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.imports',
    url: '/imports',
    breadcrumb: () => 'Imports',
    data: {
        requiresAuth: true,
        permission: 'erp.tax_manage',
        hideCreateButton: true,
        etimsTableHeader: [
            { text: 'Declaration Date' },
            { text: 'Import Details' },
            { text: 'Item Name' },
            { text: 'Status' },
            { text: 'Action' },
        ],
        etimsRows: [
            {
                key: 'declaration_date',
                type: 'date',
            },
            {
                nested: [
                    {
                        key: 'task_code',
                        label: 'Task Code',
                        type: 'string',
                        value: 'task_code',
                    },
                    {
                        key: 'hs_code',
                        label: 'HS Code',
                        type: 'string',
                        value: 'hs_code',
                    },
                ],
            },
            {
                key: 'item_name',
                type: 'splitString',
                nested: [
                    {
                        key: 'supplier_name',
                        label: 'Supplier',
                        type: 'string',
                        value: 'supplier_name',
                    },
                ],
            },
            {
                key: 'workflow_state',
                type: 'statusColor',
            },
        ],

        etimsHeaderActions: [
            {
                btnText: 'eTIMS Sync',
                status: 'primary',
                action: 'apiCall',
                actionConf: {
                    httpMethod: 'list',
                    api: 'sync-imports',
                    successTitle: 'Success',
                    successMessage: 'Synchronised eTIMS imports successfully',
                    failedTitle: 'Failed',
                    failedMessage: 'Failed to synchronise eTIMS imports',
                },
            },
        ],
        actionsEtims: [
            {
                btnText: 'View',
                status: 'success',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.settings.imports.details',
                    stateParams: {
                        id: 'id',
                    },
                },
            },
        ],
        pageTitle: 'Imports',
        pageSubTitle: 'Find all imports here',
    },
    resolve: [
        {
            token: 'store',
            resolveFn: () => 'imports',
        },
        {
            token: 'storeLabel',
            resolveFn: () => 'Imports',
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

export const importDetailsState: Ng2StateDeclaration = {
    name: 'app.advantage.settings.imports.details',
    url: '/import-details/:id',
    breadcrumb: () => 'Import Details',
    data: {
        requiresAuth: true,
    },
    resolve: [
        {
            token: 'importsObservable',
            deps: [ResolverService, Transition],
            resolveFn: (resolveSvc, transition) =>
                resolveSvc.resolveItem('imports', transition.params().id),
        },
    ],
    bindings: {
        resolveData: 'importsObservable',
    },
    views: {
        '$default@app.advantage': {
            component: ImportDetailsComponent,
        },
    },
};

/**
 * Contains all the ui router states in the settings module
 */
export const SETTING_STATES = [
    settingsState,
    branchSettingState,
    taxesState,
    taxOfficesState,
    queuesState,
    queueDetailState,
    queueDetailScheduleState,
    updateOrganisationState,
    currencyState,
    productsState,
    productCategoriesState,
    pricelistState,
    paymentMethodsState,
    pricelistViewState,
    pricelistProductsState,
    settingsOrgLevelState,
    messageGroupState,
    groupViewState,
    groupMembersState,
    surveyFormState,
    addNewPricelistState,
    addNewPaymentMethodState,
    itemClassificationState,
    unitMeasureState,
    packagingUnitsState,
    addProductState,
    importsState,
    importDetailsState,
    operatingRegionsState,
    pricelistBulkUploadState,
    pricelistBulkUploadedFilesState,
    pricelistBulkUploadViewState,
];

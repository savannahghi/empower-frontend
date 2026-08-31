import {
    Component,
    OnInit,
    EventEmitter,
    ChangeDetectorRef,
    Output,
    OnDestroy,
} from '@angular/core';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { environment } from '../../../../environments/environment';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../shared/sil-http-services/error-handler';
import { FeatureFlagService } from '../../../@core/utils/feature.service';
import { NotificationService } from '../../../shared/component-services/notification-count.service';
import { UserGuideMenuService } from '../../../../../../../apps/advantage/src/app/features/user-guide/user-guide-menu.service';
import { Subject, takeUntil } from 'rxjs';

interface MenuItemInterface {
    title: string;
    url: string;
    permission: string;
    flag?: string;
    featureFlag?: boolean;
}
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - style: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'ngx-one-column-layout',
    styleUrls: ['./one-column.layout.scss'],
    templateUrl: './one-column.layout.html',
    standalone: false,
})
/**
 * defines the one column component class
 */
export class OneColumnLayoutComponent implements OnInit, OnDestroy {
    /**
     * defines array of menu items
     */
    menu: Array<any> = [];
    /**
     * defines app variant
     */
    variant: string;
    /**
     * defines variant patient name
     */
    variantPatientTerm: string;
    /**
     * defines variant branch name
     */
    variantBranchTerm: string;
    /** Set the payer for edi surveys */
    payer: any;

    /**
     * defines array of screening menu items
     */
    screeningsmenu: Array<any> = [];
    /**
     * defines array of advantage dashboard menu items
     */
    menuDashboardItems: Array<any> = [];
    /**
     * defines array of advantage engagement menu items
     */
    menuEngagementItems: Array<any> = [];
    /**
     * defines array of healthcrm dashboard menu items
     */
    menuHealthCrmDashboardItems: Array<any> = [];
    /**
     * defines array of advantage settings menu items
     */
    menuSettingsItems: Array<MenuItemInterface> = [];
    /**
     * user object contains the user information
     */

    menuAccountingItems: Array<any> = [];

    /**
     * user object contains the inbox
     */
    menuInboxItems: Array<any> = [];

    /**
     * user object contains the sales information
     */

    menuSalesItems: Array<any> = [];

    /**
     * user object contains the purchases information
     */

    menuPurchasesItems: Array<any> = [];

    /**
     * user object contains the manufacturing information
     */

    menuManufacturingItems: Array<any> = [];

    /**
     * user object contains the user information
     */

    menuSetupItems: Array<any> = [];

    /**
     * defines array of advantage inventory menu items
     */
    menuInventoryItems: Array<{
        title: string;
        url: string;
        permission?: string;
        featureFlag?: boolean;
    }> = [];

    user: any;
    /**
     * contains business partner slade code
     */
    bp: any;
    /**
     * hover item event
     */
    hoverItem = new EventEmitter();
    item: object;
    /**
     * used to set the user's bp type
     */
    bp_type: any;
    /**
     * used to set the org's bp type
     */
    org_bp_type: string;
    /**
     * Contains array of savannah bp types
     */
    silBpType = ['SIL', 'SAVANNAH'];
    /**
     * Contains array of provider bp types
     */
    providerBpType = ['PROVIDER', 'PRACTITIONER'];

    /**
     * Contains array of payer bp types
     */
    payerBpType = ['PAYER'];

    /**
     * used to define the application environment status
     */
    environment = environment.sentryEnvironment;
    /** Used to hide elements that do not have auth */
    noAuth: boolean;
    subMenuToggle: any;
    /**
     * Variable used to display child submenus
     */

    /**
     * stores workstation
     */
    workstation: any;

    /**
     * used to set the menu items
     */
    userGuideMenuItems: any[] = [];

    /**
     * used to set the selected subtopic
     */
    activeSubtopicId: string | null = null;

    /**
     * Toggles the submenu
     */
    toggleSubMenu(context) {
        this.subMenuToggle[context] = !this.subMenuToggle[context];
    }

    /**
     * Used to set the selected guide
     */
    selectedGuide: any = null;

    /**
     * Used to set the subtopics
     */
    subtopics: any[] = [];

    /**
     * Used to destrqoy the observable avoid memory leaks
     */
    private destroy$ = new Subject<void>();

    /**
     * Used to set the selected IFrame Url on change
     */
    @Output() iframeUrlChange = new EventEmitter<string>();

    /**
     * Used to set the IFrame URL
     */
    iframeUrl: string = '';

    /**
     * Used to set the selected guide topic
     */
    openUserGuideTopic: string | null = null;

    /**
     * Constructor for the one column component
     * @param authConfig
     * @param menuService
     * @param $state,
     * @param uiglobals,
     */
    constructor(
        private authConfig: Authorization,
        public menuService: NbMenuService,
        public sidebarService: NbSidebarService,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        private dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        private notificationService: NotificationService,
        private cdr: ChangeDetectorRef,
        private featureFlagService: FeatureFlagService,
        public userGuideMenuService: UserGuideMenuService
    ) {
        this.variant = environment.variant;
        this.featureFlagService.setupFlagging();
        this.variantPatientTerm = 'Patient';
        this.variantBranchTerm = 'Branch';
    }

    /** Check if the state requires auth */
    requiresAuth() {
        if (!this.uiglobals.current.data.requiresAuth) {
            this.noAuth = true;
        } else {
            this.user = this.authConfig.getUser();
            this.bp = this.user?.business_partner;
            this.bp_type = this.user?.bp_type;
            const authcfg = this.authConfig.getOrganisation();
            this.org_bp_type = authcfg?.bp_type;
        }
    }

    /**
     * Auto expand sidebar
     */
    autoExpand(arr, value) {
        arr.forEach(menuItem => {
            if (this.$state.includes(menuItem.url)) {
                this.subMenuToggle[value] = this.$state.includes(menuItem.url);
            }
        });
    }

    notifications_count: any;

    getNotificationsInfo() {
        const params = { actioned: false };
        this.dataLayer.list('recon-notifications', params).subscribe({
            next: (response: any) => {
                this.notifications_count = response.count;
                this.cdr.detectChanges();
            },
            error: err => {
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * Expand sidebar
     */
    openSidebar() {
        this.sidebarService.expand('menu-sidebar');
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.workstation = this.authConfig.getWorkstation();
        if (this.uiglobals?.current?.name?.includes('app.autorecon.clients')) {
            this.getNotificationsInfo();
        }

        this.notificationService.notificationCount$.subscribe(data => {
            if (data.trim().length > 0) {
                this.getNotificationsInfo();
            }
        });

        this.subMenuToggle = {
            dashboard: false,
            engagement: false,
            healthcrm_dashboards: false,
            userguide: true,
        };

        if (this.userGuideMenuService.userGuideMenuItems$) {
            this.userGuideMenuService.userGuideMenuItems$
                .pipe(takeUntil(this.destroy$))
                .subscribe(menu => {
                    this.userGuideMenuItems = menu || [];
                });
        } else {
            this.userGuideMenuItems = [];
        }

        // Dashboard menus
        this.menuDashboardItems = [
            {
                title: 'Executive Overview',
                flag: 'prov_ExecutiveDashboardSidebarLink',
                url: 'app.advantage.dashboard.executive-overview',
                permission: 'erp.is_organisation_level',
            },
            {
                title: 'Appointments',
                flag: 'prov_appointmentsDashboardSidebarLink',
                url: 'app.advantage.dashboard.appointments-dashboard',
                permission: 'erp.is_organisation_level',
            },
            {
                title: 'Billing',
                flag: 'prov_BillingDashboardSidebarLink',
                url: 'app.advantage.dashboard.billing-dashboard',
                permission: 'erp.is_organisation_level',
            },
            {
                title: 'Finance',
                flag: 'prov_RecordsDigitizationDashboardSidebarLink',
                url: 'app.advantage.dashboard.finance-dashboard',
                permission: 'erp.is_organisation_level',
            },
            {
                title: 'eTIMS',
                flag: 'prov_eTimsDashboardSidebarLink',
                url: 'app.advantage.dashboard.etims-dashboard',
                permission: 'erp.is_organisation_level',
            },
            {
                title: 'Inventory',
                flag: 'prov_eTimsDashboardSidebarLink',
                url: 'app.advantage.dashboard.inventory-dashboard',
                permission: 'erp.is_organisation_level',
            },
            {
                title: 'Messages',
                flag: 'prov_MessageDashboardSidebarLink',
                url: 'app.advantage.dashboard.message-dashboard',
                permission: 'erp.is_organisation_level',
            },
            {
                title: 'Patients',
                flag: 'prov_patientsDashboardSidebarLink',
                url: 'app.advantage.dashboard.patients-dashboard',
                permission: 'erp.is_organisation_level',
            },
            {
                title: 'Visits',
                flag: 'prov_eTimsDashboardSidebarLink',
                url: 'app.advantage.dashboard.visits-dashboard',
                permission: 'erp.is_organisation_level',
            },
        ];

        // Health CRM Dashboard menus
        this.menuHealthCrmDashboardItems = [
            {
                title: 'Customers',
                url: 'app.healthcrm.dashboard.health-crm',
            },
        ];

        // Engagement menus
        this.menuEngagementItems = [
            {
                title: 'Message Logs',
                url: 'app.advantage.engagement.message_logs',
            },
            {
                title: 'Message Reports',
                url: 'app.advantage.engagement.message_reports',
            },
            {
                title: 'Send Message',
                permission:
                    'advantage.segment_list:advantage.message_template_list',
                url: 'app.advantage.engagement.sendsms.details',
            },

            {
                title: 'Care Journeys',
                flag: 'prov_CareJourneysSidebarLink',
                permission: 'advantage.segment_list',
                url: 'app.advantage.engagement.care_journey.list',
            },
            {
                title: 'Segments',
                permission: 'advantage.segment_list',
                url: 'app.advantage.engagement.segments',
            },
            {
                title: 'Message Templates',
                permission: 'advantage.message_template_list',
                url: 'app.advantage.engagement.templatemessage',
            },
            {
                title: `${this.variantPatientTerm} Uploads`,
                permission: 'advantage.patient_list_upload_list',
                url: 'app.advantage.engagement.patientuploads',
            },
            {
                title: 'Sender IDs',
                permission: 'advantage.sender_id_list',
                url: 'app.advantage.engagement.senderids',
            },
            {
                title: 'USSD Sessions',
                permission: 'advantage.sms_list',
                url: 'app.advantage.engagement.ussd_sessions',
            },
            {
                title: 'Inbox',
                flag: 'prov_2WayInboxChatSidebarLink',
                permission:
                    'advantage.segment_list:advantage.message_template_list',
                url: 'app.advantage.engagement.chats',
            },
            {
                title: 'Survey Responses',
                permission: 'advantage.visit_list',
                url: 'app.advantage.engagement.surveyresponses',
            },
        ];

        this.menuSetupItems = [
            {
                title: 'Users',
                permission: 'auth.user_view',
                url: 'app.advantage.usermgmt.users',
            },
            {
                title: 'Roles',
                permission: 'auth.role_view',
                url: 'app.advantage.usermgmt.roles',
            },
            {
                title: 'Service Points',
                permission: 'auth.user_view',
                url: 'app.advantage.usermgmt.servicepoints',
            },
            {
                title: 'Departments',
                permission: 'auth.user_view',
                url: 'app.advantage.usermgmt.departments',
            },
        ];

        // Accounting menus
        this.menuAccountingItems = [
            {
                title: 'Customers',
                permission: 'erp.customer_manage',
                url: 'app.advantage.accounting.customers',
            },
            {
                title: 'Networks',
                permission: 'erp.customer_manage',
                url: 'app.advantage.accounting.networks',
                flag: 'prov_NetworksSidebarLink',
            },
            {
                title: 'Bank Details',
                permission: 'erp.customer_manage',
                url: 'app.advantage.accounting.bank_details',
                flag: 'prov_BankDetailsSidebarLink',
            },
            {
                title: 'Mobile Money Details',
                permission: 'erp.customer_manage',
                url: 'app.advantage.accounting.mobile_money_details',
                flag: 'prov_MobileMoneyDetailsSidebarLink',
            },
            {
                title: 'Payments',
                permission: 'erp.customer_manage',
                url: 'app.advantage.accounting.payments',
                flag: 'prov_PaymentsSidebarLink',
            },
            {
                title: 'Customer Payment Run',
                permission: 'erp.customer_manage',
                url: 'app.advantage.accounting.payment_runs',
            },
            {
                title: 'Journal Entries',
                permission: 'erp.customer_manage',
                url: 'app.advantage.accounting.journal_entries',
            },
        ];

        this.menuInboxItems = [
            {
                title: 'Notifications',
                url: 'app.advantage.inbox.notifications',
                permission: 'erp.perform_etims_operations',
            },
            {
                title: 'Chat',
                url: 'app.advantage.inbox.inbox',
            },
        ];

        // Sales menus
        this.menuSalesItems = [
            {
                title: 'Invoices',
                permission: 'erp.customer_manage',
                url: 'app.advantage.sales.invoice',
            },
            {
                title: 'Credit Notes',
                permission: 'erp.customer_manage',
                url: 'app.advantage.sales.credit_notes',
            },
            {
                title: 'Sales Orders',
                permission: 'erp.customer_manage',
                url: 'app.advantage.sales.sales_orders',
            },
        ];

        // Purchase menus
        this.menuPurchasesItems = [
            {
                title: 'Suppliers',
                url: 'app.advantage.purchases.suppliers',
            },
            {
                title: 'Requisitions',
                url: 'app.advantage.purchases.requisitions',
                permission: 'erp.perform_etims_operations',
            },
            {
                title: 'Purchase Orders',
                url: 'app.advantage.purchases.purchase-orders',
            },
            {
                title: 'Bills',
                permission: 'erp.customer_manage',
                url: 'app.advantage.purchases.bills',
            },
            {
                title: 'eTIMS Purchases',
                url: 'app.advantage.purchases.etims-purchases',
            },
            {
                title: 'Purchase Invoices',
                url: 'app.advantage.purchases.purchase-invoice',
            },
            {
                title: 'Direct Purchase Invoices',
                url: 'app.advantage.purchases.direct-purchase-invoices',
                flag: 'prov_DirectPurchaseInvoicesSidebarLink',
            },
            {
                title: 'Return Outwards',
                url: 'app.advantage.purchases.return-outwards',
            },
            {
                title: 'Supplier Payment Runs',
                url: 'app.advantage.purchases.supplier-payment-run',
                flag: 'prov_SupplierPaymentRunsSidebarLink',
            },
        ];

        // manufacturing menus
        this.menuManufacturingItems = [
            {
                title: 'Bill Of Materials',
                url: 'app.advantage.manufacturing.billOfMaterials',
            },
            {
                title: 'BOM Operations',
                url: 'app.advantage.manufacturing.bom_operations',
            },
        ];

        // settings menu
        this.menuSettingsItems = [
            {
                title: 'Products',
                url: 'app.advantage.settings.products',
                permission: 'erp.product_service_manage',
            },
            {
                title: 'Product Category',
                url: 'app.advantage.settings.productcategories',
                permission: 'erp.product_service_manage',
            },
            {
                title: 'Item Classification',
                url: 'app.advantage.settings.itemclassification',
                permission: 'erp.perform_etims_operations',
            },
            {
                title: 'Unit of Measure',
                url: 'app.advantage.settings.unitmeasure',
                permission: 'erp.perform_etims_operations',
            },
            {
                title: 'Packaging Units',
                url: 'app.advantage.settings.packaging_units',
                permission: 'erp.perform_etims_operations',
            },
            {
                title: 'Pricelists',
                url: 'app.advantage.settings.pricelists',
                permission: 'erp.pricelist_manage',
            },
            {
                title: 'Payment Methods',
                url: 'app.advantage.settings.payment_methods',
                permission: 'erp.payment_method_manage',
            },
            {
                title: 'Taxes',
                url: 'app.advantage.settings.taxes',
                permission: 'erp.tax_manage',
            },
            {
                title: 'Tax Offices',
                url: 'app.advantage.settings.taxOffices',
                permission: 'erp.perform_etims_operations',
            },
            {
                title: 'Currencies',
                url: 'app.advantage.settings.currencies',
                permission: 'erp.currency_manage',
            },
            {
                title: 'Imports',
                url: 'app.advantage.settings.imports',
                permission: 'erp.perform_etims_operations',
            },
            {
                title: 'Queues',
                url: 'app.advantage.settings.queues',
                permission: 'advantage.queue_list',
            },
            {
                title: 'Message Groups',
                url: 'app.advantage.settings.groups',
                permission: 'advantage.group_list',
            },
            {
                title: 'Operating Regions',
                url: 'app.advantage.settings.operatingregions',
                permission: 'erp.is_organisation_level',
            },
            {
                title: `${this.variantBranchTerm} Settings`,
                url: 'app.advantage.settings.branchlevel',
                permission: 'erp.is_branch_level',
            },
            {
                title: 'Org Settings',
                url: 'app.advantage.settings.orglevel',
                permission: 'erp.is_organisation_level',
            },
        ];

        // inventory menus
        this.menuInventoryItems = [
            {
                title: 'Inventory Operations',
                url: 'app.advantage.inventory.inventory_operations',
                permission: 'erp.store_inventory_list',
            },
            {
                title: 'Inventory Report',
                url: 'app.advantage.inventory.stockquantity',
                permission: 'erp.store_inventory_list',
            },
            {
                title: 'Stockout Report',
                url: 'app.advantage.inventory.stockout',
                permission: 'erp.store_inventory_list',
            },
            {
                title: 'Locations',
                url: 'app.advantage.inventory.locations',
                permission: 'erp.store_inventory_list',
            },
            {
                title: 'Transfers',
                url: 'app.advantage.inventory.inventory_transfers',
                permission: 'erp.store_inventory_list',
            },
            {
                title: 'Adjustments',
                url: 'app.advantage.inventory.inventory_adjustments',
                permission: 'erp.store_inventory_list',
            },
            {
                title: 'Expiry Report',
                url: 'app.advantage.inventory.expiry_report',
                permission: 'erp.store_inventory_list',
            },
        ];

        this.screeningsmenu = [
            {
                title: 'Risk Assessments',
                url: 'app.advantage.screenings.risk-assessments',
            },
            {
                title: 'Examinations',
                url: 'app.advantage.screenings.examinations',
            },
        ];

        this.autoExpand(this.menuDashboardItems, 'dashboard');
        this.autoExpand(
            this.menuHealthCrmDashboardItems,
            'healthcrm_dashboards'
        );
        this.autoExpand(this.menuEngagementItems, 'engagement');
        this.autoExpand(this.menuSettingsItems, 'settings');
        this.autoExpand(this.menuAccountingItems, 'accounting');
        this.autoExpand(this.menuInboxItems, 'inbox');
        this.autoExpand(this.menuSalesItems, 'sales');
        this.autoExpand(this.menuInventoryItems, 'inventory');
        this.autoExpand(this.menuPurchasesItems, 'purchases');
        this.autoExpand(this.menuManufacturingItems, 'manufacturing');
        this.requiresAuth();
        this.changeThemeBasedOnPayer();

        if (this.userGuideMenuService.userGuideMenuItems$) {
            this.userGuideMenuService.userGuideMenuItems$
                .pipe(takeUntil(this.destroy$))
                .subscribe(menu => {
                    if (menu && menu.length > 0) {
                        this.selectedGuide = menu[0];
                        this.subtopics = this.selectedGuide.subtopics || [];
                    } else {
                        this.selectedGuide = null;
                        this.subtopics = [];
                    }
                });
        } else {
            this.selectedGuide = null;
            this.subtopics = [];
        }

        if (this.userGuideMenuService.activeSubtopicId$) {
            this.userGuideMenuService.activeSubtopicId$
                .pipe(takeUntil(this.destroy$))
                .subscribe(id => {
                    this.activeSubtopicId = id;

                    if (id && this.userGuideMenuItems) {
                        const parent = this.userGuideMenuItems.find(topic =>
                            topic.subtopics?.some(sub => sub.id === id)
                        );
                        if (parent) {
                            Object.keys(this.subMenuToggle).forEach(key => {
                                this.subMenuToggle[key] = false;
                            });
                            this.subMenuToggle[parent.title] = true;
                        }
                    }
                });
        }
    }

    renderSubtopic(subtopic: any): void {
        if (!subtopic || !subtopic.title) {
            this.errorHandler.handleError(
                new Error('Invalid subtopic: Missing required data.')
            );
            return;
        }

        const parentTopic = this.userGuideMenuItems.find(topic =>
            topic.subtopics?.some((item: any) => item.id === subtopic.id)
        );

        const topicId = parentTopic?.id || subtopic.parent;
        const topicName =
            (parentTopic?.title || '')
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9\-]/g, '') || 'user-guide-topic';

        if (
            !this.$state.is('app.userguide.list.topic', {
                topicId,
                topicName,
            })
        ) {
            this.$state.go(
                'app.userguide.list.topic',
                { topicId, topicName },
                { reload: true }
            );
        }

        if (!subtopic.url) {
            this.errorHandler.handleError(
                new Error('Subtopic is missing a valid URL.')
            );
            this.iframeUrl = '';
            return;
        }

        this.iframeUrl = subtopic.url;
        this.userGuideMenuService.setIframeUrl(subtopic.url);
        this.userGuideMenuService.setActiveSubtopicId(subtopic.id);
    }

    /**
     * Change theme of survey based on insurance
     * When using edi survey
     */
    changeThemeBasedOnPayer() {
        if (this.$state.includes('app.feedback')) {
            this.payer = this.uiglobals.params.payer;
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { StateService } from '@uirouter/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { NbToastrService } from '@nebular/theme';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
    selector: 'ngx-operating-regions',
    templateUrl: './operating-regions.component.html',
    styleUrl: './operating-regions.component.scss',
    standalone: false,
})
export class OperatingRegionsComponent implements OnInit {
    /**
     * Used to display the loader when data is being fetched
     */
    loading: boolean = false;

    /**
     * Used to set submitted to false
     */
    submitted: boolean = false;

    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;

    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    /**
     * Contains information about the operating region
     */
    patient: any;

    /**
     * Array used to define the actions of the datatable
     */
    actions: Array<any>;

    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    /** used to filter datatable params */
    filterParams: Object;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * sets the filter used to query for data in the datatable
     * @param event contains the params used in the datatable
     */
    setFilter(event) {
        this.queryArg = event;
    }

    /** Retire an operation region sweetalert */
    @ViewChild('retireOperatingRegion')
    public retireOperatingRegion!: SwalComponent;

    /** Activate an operation region sweetalert */
    @ViewChild('activateOperatingRegion')
    public activateOperatingRegion!: SwalComponent;

    /**
     * Used to display a modal
     */
    showModal = false;

    /**
     * Contains the region details
     */
    regionDetails: any;

    /**
     * Boolean used to show the add region modal
     */
    showAddRegionModal = false;

    /**
     * Used to define custom form options.
     * Required for the patient form to allow for constant updating of model
     */
    formOptions: any;

    /**
     *  holds an operating region
     */
    operatingRegion: any;

    /**
     * operating region action either retire or activate
     */
    operatingRegionAction: string;

    /** holds swal component text */
    operatingRegionText: string;

    /**
     * Used to set the form options
     * @param formOptions
     */
    getFormOptions(formOptions) {
        this.formOptions = formOptions;
    }

    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * gets the stored selected language
     */
    selectedLanguage: string = this.cookieService.getLanguageCookie();

    /**
     * Contains selector that is used to access the datatable component
     * used in the component
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Constructor for the class component
     * @param dataLayer used to access the data layer service
     * @param errorHandler used to access the error handler service
     * @param toastrService used to access the toast service
     */
    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public $state: StateService,
        public translate: TranslateService,
        public cookieService: Cookies,
        private cdr: ChangeDetectorRef
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    /**
     * showToast - Used to display a toast using the nebular toast service
     * @param position - defines the toast's position e.g. bottom-right
     * @param status - defines the status being used e.g. success, danger, info
     * @param msg - defines what the message in the toast is
     * @param context - defines what the context of the toast is
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Toggles add region modal
     */
    toggleAddRegion() {
        this.showAddRegionModal = !this.showAddRegionModal;
    }

    /**
     * Add Operating Region
     */
    addOperatingRegions(event) {
        this.loading = true;
        const data = {
            name: event.sub_county,
            unit_type: 'SUB_COUNTY',
        };

        this.dataLayer.create('operating-regions', data).subscribe({
            next: () => {
                this.loading = false;
                this.siltable?.getData();
                this.showToast(
                    'bottom-right',
                    'success',
                    'Operating Region',
                    'Operating Region has been added'
                );
                this.toggleAddRegion();
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    /** Used to trigger sweet alert */
    fireSwal(swal) {
        swal.fire();
    }

    /**
     * toggle retire an operating region
     */
    toggleRetireOR = event => {
        this.operatingRegion = event;
        this.operatingRegionAction =
            event.active === true ? 'retire' : 'activate';
        this.operatingRegionText = `Are you sure you want to ${this.operatingRegionAction} ${this.operatingRegion?.name}?`;
        this.cdr.detectChanges();
        if (event) {
            this.fireSwal(
                event.active === true
                    ? this.retireOperatingRegion
                    : this.activateOperatingRegion
            );
        }
    };

    /**
     * confirm retire/activate operating region
     */
    confirmUpdate = () => {
        const status = this.operatingRegion?.active === true ? false : true;
        this.dataLayer
            .update('operating-regions', this.operatingRegion?.id, {
                active: status,
            })
            .subscribe({
                next: () => {
                    this.loading = false;
                    this.siltable?.getData();
                    this.showToast(
                        'bottom-right',
                        'success',
                        'Operating Region',
                        'Operating Region has been updated'
                    );
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.loading = false;
                },
            });
    };

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /**
         * Used to set the table's filters
         * */
        this.filterParams = {
            page_size: 10,
        };

        /**
         * Set the table header data
         */
        this.tableHeader = [
            { text: 'settings.regions.table_header.name' },
            { text: 'settings.regions.table_header.unit' },
            { text: 'settings.regions.table_header.date' },
            { text: 'settings.regions.table_header.status' },
            { text: 'settings.regions.table_header.action' },
        ];

        /**
         * Set the table's rows
         */
        this.rows = [
            {
                key: 'name',
                type: 'string',
            },
            {
                label: 'Unit Type',
                key: 'unit_type',
                type: 'string',
            },
            {
                label: 'Added On',
                key: 'created',
                type: 'date',
            },
            {
                label: 'Active',
                key: 'active',
                type: 'operatingRegionStatus',
            },
        ];

        /**
         * Set the actions used for each row in the list table
         * */
        this.actions = this['actions'] = [
            {
                btnText: 'Retire',
                status: 'danger',
                action: 'custom',
                expression: row => {
                    if (!row) {
                        return;
                    }
                    return row.active === true;
                },
                modalConf: {
                    customFxn: true,
                    Fxn: 'toggleRetireOR',
                },
            },
            {
                btnText: 'Reactivate',
                status: 'primary',
                action: 'custom',
                expression: row => {
                    if (!row) {
                        return;
                    }
                    return row.active === false;
                },
                modalConf: {
                    customFxn: true,
                    Fxn: 'toggleRetireOR',
                },
            },
        ];

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }
}

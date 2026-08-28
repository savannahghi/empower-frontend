/**
 * Imports used in the component
 */
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import moment from 'moment';
import _ from 'underscore';
import counties from '../../../../../../src/app/features/healthcrm/facilities/facility-list/counties.json';
import { VisitService } from '../../../../features/advantage/visits/visit.service';
import { listAnimation } from '../../../animations/list-animations';
import { ErrorHandlerService } from '../../../sil-http-services/error-handler';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import specialties from './../../../../../assets/data/specialty.json';
import payerTypesList from './../../../../../assets/data/payerType.json';
import { SilDatatableService } from './sil-datatable.service';

interface ModalConfInterface {
    store?: string;
    cancelBtn: boolean;
    cancelBtnStatus?: string;
    cancelText: string;
    btnText: string;
    nestedServices: any;
    context: any;
    isService: boolean;
    fullWidth: boolean;
    useSubmitFormModel: any;
    formConfig: FormConfigInterface;
    noAction?: boolean;
    multiStep?: boolean;
    saveText?: boolean;
    btnStyles?: Object;
    data?: any;
}
interface FormConfigInterface {
    checkExpressionOn: string;
}
interface ZeroStateInterface {
    imageUrl?: string;
    alt?: string;
    title?: string;
    description?: string;
    btnText?: string;
    btnLink?: string;
    hideActionButtons?: boolean;
    hideOuterTableComponents?: boolean;
}

interface FhirPaginationInfo {
    EndCursor: string;
    HasNextPage: boolean;
    HasPreviousPage: boolean;
    StartCursor: string;
    totalCount?: number;
}

interface FhirPagination {
    pageInfo: FhirPaginationInfo;
}

/**
 * Definition of the component including
 * the providers it uses, templateUrl, styleUrl and selector
 */
@Component({
    selector: 'sil-table',
    templateUrl: './sil-datatable.component.html',
    styleUrls: ['./sil-datatable.component.scss'],
    providers: [SilDatatableService, SilStoresService, VisitService],
    animations: [listAnimation],
    standalone: false,
})

/**
 * Definition of the components class and the lifecycle hooks it uses: OnInit and OnChanges
 */
export class SilDatatableComponent implements OnInit, OnChanges {
    /**
     * Used to modify the classes on the card
     */
    @Input() cardClassName: string;
    /**
     * Used to give the datatable header titles for each column
     */
    @Input() headers: Array<any>;
    /** Contains array for list assigned from parent component */
    @Input() list: Array<any> = [];

    /**
     * Boolean used to determine if the table row is a card
     */
    @Input() isCardRow?: boolean = false;

    @Input() filterHeading: string = 'Filter Appointments';

    /**
     * Used to load the data into the datatable assigned from parent component
     */
    @Input() apilist: Array<any> = [];

    /**
     * Used to load the data into the form used in the datatable component
     */
    @Input() formData: {};

    /**
     * Used to set workstation used to fetch data
     */
    @Input() workstation;

    /**
     * Used to load the filtered data into the datatable assigned from parent component
     */
    @Input() filteredApilist: Array<any> = [];

    /**
     * Used for nebular reveal card display assigned from parent component
     */
    @Input() revealCard: boolean = false;

    /**
     * Used for nebular flip card display assigned from parent component
     */
    @Input() flipCard: boolean = false;
    /**
     * Used to determine what structure to use when displaying
     * The message Card
     *
     * segment: for segment messages
     * template: for template messages
     * schedule: to display messages in recurrent schedules
     */
    @Input() messageParentType?: string = '';
    /**
     * Used to define what template should be used for the row card
     */
    @Input() rowTemplate?: string = 'tableRow';

    /**
     * Used to know what filters apply from the browser url on the datatable
     * It will ensure the datatable only filters what is relevant to it
     */
    @Input() namespace: string;

    /**
     * Used to give the datatable access to secondary data outside the data shown on the table
     */
    @Input() secondaryData: Array<any>;

    /**
     * Controls the visibility of pagination in the table
     */
    @Input() showPagination?: boolean = true;

    /**
     * Used to set secondary table information assigned from parent component
     */
    @Input() secondaryTable: {
        tableNames: {
            first: undefined;
            second: undefined;
        };
    };

    /**
     * Used to give the datatable the fields to display assigned from parent component
     */
    @Input() rows: Array<any> = [];

    /** Boolean used to determine if the datatable is dynamic */
    @Input() dynamic: boolean;

    /**
     * Used to give the datatable a title at the top
     */
    @Input() title: string;
    /**
     * Used as an action for the button
     */
    @Input() actionIsNotButton: boolean;

    /**
     * Used to give the datatable a secondary title
     */
    @Input() subtitle: string;

    /**
     * Used to give the datatable access to a search bar: default is false
     */
    @Input() search: boolean = false;

    /**
     * Used to toggle if a datatable has actions or not
     */
    @Input('has-action') hasAction: boolean;

    /**
     * Array with the actions a datatable has
     */
    @Input() actions: Array<any>;

    /**
     * Object used to contain default filters to the datatable api call
     */
    @Input() defaultQueryArg: any;

    /**
     * Object used to set final filters to use in the datatable
     */
    queryArg: any;

    /** contains rest function e.g. list, get, update, remove */
    @Input('rest-fxn') restFxn: string;

    /** contains store string e.g. patients, appointments */
    @Input('rest-api') restApi: string;

    /** contains css class to use on datatable */
    @Input() tableStyle: string;

    /** contains custom styles configuration for the table grid row */
    @Input('custom-grid-styles') customGridStyles: any;

    /** contains include image option */
    @Input('has-image') hasImage: boolean = false;

    /** contains row image path */
    @Input('row-image-path') imagePath: string = '';

    /** contains status filters used as main filters at the top;
     * check datatatable filter component */
    @Input() statusFilters: Array<any>;

    /**
     * Contains workflow status with its description
     */
    @Input() workflowTableData: Array<any>;

    currentWorkflowStateKey: string = this.uiglobals?.params?.workflow_state;

    hasWorkflowState: boolean = false;

    /**
     * Contains the select field info
     */
    @Input() statusSelector: Array<Array<any>>;

    /** determines strategy for change detection */
    @Input() checkExpressionOn: string;

    /** contains data from a dashboard */
    @Input() dashboardData: any;

    /** contains context for the datatable */
    @Input() context: string;

    /** contains a string that lets the datatable know how
     * to process row information that will be given to the modal
     * when the modal is toggled
     */
    @Input() processSelectedItemMethod: string;

    /** used to store data that can be used for the datatable service */
    @Input() data: any;

    /** contains information for filtering the datatable */
    @Input() filter?: string;

    /** contains information for exporting the datatable */
    @Input() export?: string;

    /** contains the id to be used in a nested list*/
    @Input() nestedId?: string;

    /** contains view in a nested list */
    @Input() view?: string;

    /**
     * overall grid inputs
     */
    @Input() headerActions: Array<any>;

    /**
     * filters that will be ignored from those that are displayed
     */
    @Input() ignoreDisplayFilters: any;

    /**
     * Array of state params the datatable should not use for filtering
     */
    @Input() ignoreStateParams: any;

    /**
     * String containing the search placeholders
     */
    @Input() searchPlaceholder?: string = 'Search...';

    /**
     * String containing the search box styling
     */
    @Input() searchClassName?: string;

    /**
     * Ensure that default params are not overriden by state params
     */
    @Input() dontOverrideDefaultParams: boolean;

    @Input() isGraphqlEndpoint: boolean = false;

    /**
     *  Contains state params that must be retained when reloading the state
     */
    @Input() activeStateParams: any;

    /**
     * Image to be used as the empty table placeholder
     */
    @Input() emptyTableImage?: string = '../../../../assets/images/nodata.svg';
    /**
     * Text to be used in the empty table
     */
    @Input() emptyTableText?: string = 'tables.empty_message';

    /**
     * Used to compress the empty table experience
     */
    @Input() compressedEmptyTable: boolean;

    /**
     * Adds a numbered column to the data table
     */
    @Input() addIndexColumn: boolean;

    /**
     * Used to display select elements
     */
    @Input() hasSelector: boolean = false;

    /**
     * Used to display add customer button
     */
    @Input() hasAddCustomerBtn: boolean = false;

    /**
     * Used to display filter button
     */
    @Input() filterBtn: boolean = false;

    /**
     * Used to display tableTitle for the Inventory - Record new adjustment page - Add Item section
     */
    @Input() tableTitle: string;

    /**
     * Used to display title description for the Inventory - Record new adjustment page - Add Item section
     */
    @Input() showTitleDescription: boolean = false;

    /**
     * Used to display counties selector options
     */
    @Input() countiesSelector: boolean = false;

    /**
     * Array containing the county filters
     */
    countyFilters = [...counties];

    /**
     * Used to display specialty selector options
     */
    @Input() specialitySelector: boolean = false;

    /**
     * Used to display payer type selector options
     */
    @Input() payerTypeSelector: boolean = false;

    /**
     * Array containg the speciality
     */
    specialityFilters = [...specialties];

    /**
     * Array containg the payer types
     */
    payerTypeFilters = [...payerTypesList];

    /**
     * Used to display AAdd Item button under Inventory Adjustments, Record New Adjustment
     */
    @Input() hasAddItemBtn: boolean = false;

    @Input() selectedRows: any = [];
    /**
     * Used to give the sil-data-view component access to a search bar: default is false
     */
    @Input() cardListSearch?: boolean = false;

    @Input() customHeaderButtons?: boolean = false;

    /** set form export button */
    @Input() hasFormExportButton: boolean;

    /**
     * Flag to indicate if the endpoint is a FHIR endpoint
     */
    @Input() isFhirEndpoint: boolean = false;

    /**
     * Contains the total number of items (for FHIR endpoints)
     */
    @Input() totalItems: number = 0;

    /**
     * Contains the page size (for FHIR endpoints)
     */
    @Input() pageSize: number = 20;

    /**
     * Contains FHIR-specific query parameters
     */
    @Input() fhirQueryParams: any = {};

    /** form export function */
    @Output() formExportFxn = new EventEmitter();

    /** Outputs datatable filters */
    @Output() filtersArg = new EventEmitter();

    /** outputs end cursor data for graphql */
    @Output() endCursorArg = new EventEmitter();

    /**
     * emit selected row
     */
    @Output() selectedRow = new EventEmitter();

    /**
     * Emitted when datatable is refreshed
     */
    @Output() refresh = new EventEmitter();
    /**
     * Emitted when datatable is refreshed
     */
    @Output() apilistEmitter = new EventEmitter();
    /**
     * emitted when a custom dialogue action button is clicked
     */
    @Output() openModal = new EventEmitter<string>();
    /**
     * emitted when a custom function action button is clicked
     */
    @Output() customFxn = new EventEmitter<string>();

    /**
     * emitted when a custom function action button is clicked
     */
    @Output() addBranchCustomerFxn = new EventEmitter<string>();
    /**
     * emitted when a custom function action button is clicked
     */
    @Output() addItemFxn = new EventEmitter<void>();
    /**
     * Contains the current filters on the table
     */
    stateFilters: {};

    /** Used to show datatable is loading */
    @Input() loading: boolean = false;

    /** determines if component supports zero state */
    @Input() supportsZeroState: boolean;

    /** zero state details */
    @Input() zeroState: ZeroStateInterface;

    /**
     * send data to the parent component
     */
    @Input() sendDataToParent: boolean = false;

    /** checks if pagination has invalid end page */
    invalidPageError: boolean = false;

    /** Used to toggle modal used for forms */
    showModal: boolean = false;

    /** Used to disable submit button on the form */
    disableSubmit: boolean = false;

    /** Used to toggle drawer used with a form*/
    showDrawer: boolean = false;

    /** used to toggle drawer used for filtering */
    showFilterDrawer: boolean = false;
    selectedLoan: any;
    reason: string;

    /** used to set selected item */
    selectedItem: any;

    /** used for graphql page information */
    pageInfo: Array<any>;

    /** used to set modal context */
    modalContext: string;

    /** contains modal configuration */
    modalConf: ModalConfInterface;

    /** used to determine if form data has been submitted */
    submitted = false;

    /** used to determine if filters are active */
    isFiltered = false;

    /** Used to toggle modal used for the filter modal */
    showFilterModal = {
        download_tags: false,
        filter_tags: false,
    };

    /**
     * Contains the download message log status
     */
    downloadBtnStatus: boolean = false;

    /**
     * Contains information for pagination
     */
    @Input() paginationData: object;

    /**
     * Contains the search parameters
     */
    @Input() searchParams?: Object;

    /**
     * Contains the search parameters
     */
    @Input() searchParam?: Object;

    /**
     * Contains the empty state list title
     */
    @Input() emptyStateTitle?: string;

    /**
     * Contains the empty state message
     */
    @Input() emptyStateMessage?: string;

    /**
     * Contains the empty state custom image
     */
    @Input() emptyStateImage?: string;

    /**
     * Contains the empty state custom image styles
     */
    @Input() emptyStateImageStyles?: string;

    /**
     * Used to show modal filters modal
     */
    @Input() hasModalFilters?: boolean;

    /**
     * Used to show table download button
     */
    @Input() hasDownloadButton?: boolean;

    /**
     * Set the modal filter title
     */
    @Input() modalFiltersTitle?: string;
    /**
     * Contains list of modal filters
     */
    @Input() modalFilters?: Array<any>;

    /**
     * Contains configuration for the tags modal
     */
    @Input() modalFiltersConf?: { [key: string]: any };

    /**
     * Contains the download list table method
     */
    @Input() downloadButtonRequest?: string;

    @Input() pageGroupSize: number = 0;

    /**
     * Contains the page queryed for pagination
     *
     * It is needed by the silDatatable-search component
     */
    pageParam: any;

    /** toast time */
    toastTime = 7000;

    /** flip card */
    flipped = false;

    /** reveal card */
    revealed = false;

    /**
     * Boolean that checks whether we will has disabled checkboxes
     */
    @Input() hasDisabledCheckboxes: boolean = false;

    /**
     * Array that hold fields used to disable checkbox
     */
    @Input() disableByFields: any;

    /**
     * Boolean that checks whether we will has disabled checkboxes
     */
    @Input() apiType: boolean = false;

    filters: any;

    /**
     * Used to display different toggle modals
     * information
     */
    toggle: Object = {};

    /**
     * Used to override default form configurations
     */
    formConfigation: any;

    /** hides data table elements if zero state component is in view */
    isElementInView: any = false;

    /**
     * table has select row
     */
    hasSelectRow: boolean = false;

    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * empty list state Image URL
     */
    defaultEmptyListImagePath = '../../../../assets/images/nodata.svg';

    /**
     * contains default empty list state image styles
     */
    defaultEmptyListImageStyles = 'height: 3rem; width: 6rem';

    headerDialogueContext = {
        btnStoreContext: {
            heading: '',
            btnText: '',
            store: '',
            isService: false,
            hasCancelBtn: false,
            status: '',
            formData: {},
        },
    };

    /**
     * Header button formly context
     */
    btnStoreContext = {
        heading: '',
        btnText: '',
        store: '',
        isService: false,
        hasCancelBtn: false,
        status: '',
        formData: {},
    };

    @ViewChild('searchy', { static: false }) searchy!: ElementRef;

    /** emits event to hide outer components if the
     *  component supports zero state and data is empty
     * */
    /**
     * Constructor for datatable component class
     * @param toastrService Access instance of the toast service
     * @param $state Access instance of the state service
     * @param datatableService Access instance of datatable service
     * @param errorHandler Access instance of error handler service
     * @param uiglobals Access instance of uirouter global service
     * @param dataLayer Access instance of SilStoresService
     */
    constructor(
        protected toastrService: NbToastrService,
        public $state: StateService,
        public datatableService: SilDatatableService,
        private errorHandler: ErrorHandlerService,
        public uiglobals: UIRouterGlobals,
        public dataLayer: SilStoresService
    ) {}

    /**
     * Export function event
     * @param model the form data
     */
    exportFxn(event: any) {
        this.formExportFxn.emit(event);
    }

    /**
     * toggles to flip or reveal card
     */

    toggleView() {
        if (!this.revealed) {
            // set the primary table settings into the secondary table
            this.revealed = !this.revealed;
            this.filteredApilist = this.apilist;
            this.secondaryTable['frontTableActions'] = this.actions;
            this.secondaryTable['frontTableRows'] = this.rows;
            this.secondaryTable['frontTabletableHeader'] = this.headers;
            // move secondary table settings into main table settings
            this.apilist = this.secondaryData;
            this.actions = this.secondaryTable['actions'];
            this.rows = this.secondaryTable['rows'];
            this.headers = this.secondaryTable['headers'];
        } else {
            // move primary table settings back to the main settings
            this.revealed = !this.revealed;
            this.apilist = this.filteredApilist;
            this.actions = this.secondaryTable['frontTableActions'];
            this.rows = this.secondaryTable['frontTableRows'];
            this.headers = this.secondaryTable['frontTabletableHeader'];
        }
    }

    shouldDisableCheckbox(row) {
        // Iterate through the keys in disableByFields and compare each key's value with the row
        return Object.keys(this.disableByFields).some(key => {
            return !(row[key] === this.disableByFields[key]);
        });
    }

    /**
     * Event that emits the row selected
     */
    selectRow(row) {
        this.selectedRow.emit(row);
    }

    emitAddBranchCustomer(value) {
        this.addBranchCustomerFxn.emit(value);
    }

    emitAddItem(value) {
        this.addItemFxn.emit(value);
    }

    /**
     * OnClick function used to trigger sil data view emitter
     */
    emitCustomFxn($event) {
        this.customFxn.emit($event);
    }

    /**
     * Method that toggles a modal when used in the datatable
     */
    toggleModal(row?, modalConf?, context?): any {
        /**
         * Check if there is a saving action happening
         * This is to make sure the modal is not dismissed if there is an error
         */
        if (!context || !context.saving) {
            this.showModal = !this.showModal;
        }
        if (modalConf && modalConf.nestedServices) {
            this.modalConf = _.findWhere(modalConf.service, {
                type: row.attachment_type,
            });
        } else {
            this.modalConf = modalConf;
        }
        this.modalContext = context;

        if (this.showModal === true && context && context.saving) {
            /**
             * Checks if headerActions have been defined to
             * perform actions such as patching and controling the modal
             * */
            if (
                this.headerActions &&
                this.headerActions.length > 0 &&
                this.headerActions[0].modalConf.refreshDismiss
            ) {
                this.datatableService[
                    this.headerActions[0].modalConf.refreshFxn
                ](this.headerActions[0].modalConf);
            }
            if (modalConf && modalConf['action']) {
                this.gridActions[modalConf['action']](row, modalConf, this);
                this.getData();
            }
        }
    }

    /**
     * Method that toggles a drawer when used in a datatable
     */
    toggleDrawer(loan) {
        this.showDrawer = !this.showDrawer;
        this.selectedLoan = loan;
    }

    /**
     * Method to toggle tags modal
     */
    onToggleTagsModal(
        context: 'download_tags' | 'filter_tags' = 'filter_tags'
    ) {
        this.showFilterModal[context] = !this.showFilterModal[context];
    }

    /**
     * Method that maps a form model from a row
     */
    mapFormModelFromRow(row, modalConf) {
        const filterKeys = _.keys(modalConf.formModelData);
        const params = {};
        for (let i = 0; i < filterKeys.length; i++) {
            /** Uses params from formModelData
             * e.g
             * a data value from a table row '.visit' can be used
             * to set a value for a state param 'id' as shown below:
             *
             * {
             *   id: 'visit',
             * }
             *
             * The stateParam above would produce an object that looks like this:
             *
             * { id: '123123' }
             *
             * '123123' would come from the table row field 'visit'
             */

            // check if the param is an object before setting the value
            if (!_.isObject(modalConf.formModelData[filterKeys[i]])) {
                params[filterKeys[i]] =
                    row[modalConf.formModelData[filterKeys[i]]];
            } else {
                const objKeys = _.keys(modalConf.formModelData[filterKeys[i]]);
                const obj = {};
                for (let j = 0; j < objKeys.length; j++) {
                    obj[objKeys[j]] =
                        row[modalConf.formModelData[filterKeys[i]][objKeys[j]]];
                    params[filterKeys[i]] = obj;
                }
            }
        }
        return params;
    }

    /**
     * Method that defines the actions that can be done as a grid action.
     *
     * A grid action can be used toggle different components or to navigate to a different component
     */
    handleErrorFxn = (err: any) => {
        this.errorHandler.handleError(err, this);
    };

    gridActions = {
        modal: (row, modalConf) => {
            const rw = row;
            this.selectedItem = {};
            const formDataModel = this.mapFormModelFromRow(row, modalConf);
            // used to sort the data based on defined data
            // this is required to avoid users from deleting contacts
            if (modalConf.sortData) {
                if (this.processSelectedItemMethod === 'nextOfKin') {
                    rw['person_contacts'] = _.sortBy(
                        rw['person_contacts'],
                        'contact'
                    );
                    this.selectedItem = _.clone(rw);
                } else if (this.processSelectedItemMethod === 'checkin-list') {
                    rw.patient_details.person['person_contacts'] = _.sortBy(
                        rw.patient_details.person['person_contacts'],
                        'contact'
                    );
                    this.selectedItem = _.clone(rw.patient_details);
                } else {
                    rw.person['person_contacts'] = _.sortBy(
                        rw.person['person_contacts'],
                        'contact'
                    );
                    this.selectedItem = _.clone(rw);
                }
            } else {
                Object.assign(row, formDataModel);
                this.selectedItem = _.clone(row);
            }

            this.selectedItem = this.processSelectedItem();

            this.toggleModal(this.selectedItem, modalConf);
        },
        quickPatch: (row, actConf) => {
            this.disableSubmit = true;
            this.datatableService[actConf.method](row, actConf, this);
        },
        alert: () => {
            this.disableSubmit = true;
        },
        fake: () => {},
        downloadDocument: (row, actConf) => {
            const id = actConf.downloadId ? row[actConf.downloadId] : row.id;
            actConf.api = this.datatableService.processDownloadStoreName(
                row,
                actConf
            );
            this.dataLayer.downloadDocument(actConf.api, id).subscribe(data => {
                const file = new Blob([data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                // open PDF in a new tab
                window.open(fileURL);
                const a = document.createElement('a');
                a.href = fileURL;
                a.target = '_blank';
                a.download = `${actConf.api}-${row.document_number}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
        },
        openDocument: row => {
            const url = row?.node?.referralReportLink;
            // open PDF in a new tab
            window.open(url);
        },
        openAttachment: row => {
            const url = row?.data;
            // open PDF in a new tab
            window.open(url);
        },
        custom: (row, actConf) => {
            if (actConf.openModal) {
                this.openModal.emit(row);
            }
            if (actConf.customFxn) {
                this.customFxn.emit(row);
            }
        },
        drawer: loan => {
            this.toggleDrawer(loan);
        },
        quintusStateGo: (row, actConf) => {
            const dataParam = row[actConf.field];
            const obj = {};
            obj[actConf.key] = dataParam;
            this.$state.go(actConf.state, obj, { reload: true });
        },
        stateGo: (row, actConf) => {
            let params = {};
            if (actConf.stateParams && !actConf.activeStateParams) {
                params = this.transformStateParams(params, row, actConf);
            } else if (actConf.activeStateParams && !actConf.stateParams) {
                params = this.transformActiveStateParams(params, actConf);
                params['id'] = row.id;
            } else if (actConf.activeStateParams && actConf.stateParams) {
                const filterKeys = _.keys(actConf.stateParams);
                for (let i = 0; i < filterKeys.length; i++) {
                    params = this.transformStateParams(params, row, actConf);
                    params = this.transformActiveStateParams(params, actConf);
                }
            } else {
                params['id'] = row.id;
            }
            this.$state.go(actConf.state, params, { inherit: false });
        },
        markNotificationAsReadAndRedirectToInvoice: (row, actConf) => {
            const notificationId = row.id;

            const payload = {
                id: notificationId,
                view: 'mark_as_read',
            };

            // Mark notification as read
            this.dataLayer
                .createNested('recon-notifications', payload.view, payload.id)
                .subscribe({
                    error: this.handleErrorFxn,
                });

            // Redirect to the invoice
            let params = {};
            if (actConf.stateParams && !actConf.activeStateParams) {
                params = this.transformStateParams(params, row, actConf);
            }
            this.$state.go(actConf.state, params, { inherit: false });
        },
    };

    /** Get state params from the data on the row */
    transformStateParams(params, row, actConf) {
        const filterKeys = _.keys(actConf.stateParams);
        for (let i = 0; i < filterKeys.length; i++) {
            /** Uses state params to set query params for state navigation
             * e.g
             * a data value from a table row '.visit' can be used
             * to set a value for a state param 'id' as shown below:
             *
             * {
             *   id: 'visit',
             * }
             *
             * The stateParam above would produce an object that looks like this:
             *
             * { id: '123123' }
             *
             * '123123' would come from the table row field 'visit'
             */
            if (!actConf.stateParams[filterKeys[i]].includes('.')) {
                params[filterKeys[i]] = row[actConf.stateParams[filterKeys[i]]];
            } else {
                const value = this.mineValue(
                    row,
                    actConf.stateParams[filterKeys[i]]
                );
                params[filterKeys[i]] = value;
            }
        }
        return params;
    }

    /** Set params that come from active state params */
    transformActiveStateParams(params, actConf) {
        // loop through activeStateParams
        for (let i = 0; i < actConf.activeStateParams.length; i++) {
            params[actConf.activeStateParams[i]] =
                this.uiglobals.params[actConf.activeStateParams[i]];
        }
        return params;
    }
    /**
     * Function that extracts table data from all possible keys
     * @param response api response
     * @returns data to be rendered in table
     */
    extractApiList(response: any) {
        if (this.isFhirEndpoint) {
            return this.extractFhirData(response);
        }

        return (
            response.edges ??
            response.Edges ??
            response.data?.results ??
            response.results ??
            response
        );
    }

    /**
     * Method used to fetch data or display data on the datatable
     */
    getData(obj?) {
        this.loading = true;
        /**
         * !this.cardListSearch helps limit api calls to one call for data view components
         * that handle data fetching when a user runs a search
         */
        if (this.restFxn && !this.cardListSearch) {
            const filterparams = this.determineQueryFilters(obj);
            if (this.isFhirEndpoint) {
                if (!filterparams._count && this.pageSize) {
                    filterparams._count = this.pageSize;
                }

                if (this.fhirQueryParams) {
                    Object.assign(filterparams, this.fhirQueryParams);
                }
            }
            const observable =
                this.restFxn === 'listNested'
                    ? this.dataLayer[this.restFxn](
                          this.restApi,
                          this.view,
                          this.nestedId,
                          filterparams
                      )
                    : this.dataLayer[this.restFxn](
                          this.restApi,
                          filterparams,
                          this.workstation
                      );
            observable.subscribe({
                next: (response: any) => {
                    /** for non-standard apis, the data will not be found in 'results'
                         * so one would need to check the response to see if 'results'
                         * is defined.
                         *
                            /** Default behaviour for apis such as erp and advantage */
                    /** for non-standard apis, the data will not be found in 'results'
                         * so one would need to check the response to see if 'results'
                         * is defined.
                         *
                            /** Default behaviour for apis such as erp and advantage */
                    if (this.isFhirEndpoint) {
                        this.apilist = this.extractFhirData(response);

                        const fhirPagination: FhirPagination = {
                            pageInfo: {
                                HasNextPage: !!response.link?.find(
                                    link => link.relation === 'next'
                                ),
                                HasPreviousPage: !!response.link?.find(
                                    link => link.relation === 'previous'
                                ),
                                StartCursor:
                                    response.link?.find(
                                        link => link.relation === 'previous'
                                    )?.url || '',
                                EndCursor:
                                    response.link?.find(
                                        link => link.relation === 'next'
                                    )?.url || '',
                                totalCount:
                                    response.total || this.apilist.length,
                            },
                        };

                        this.paginationData = fhirPagination;
                        this.totalItems = response.total || this.apilist.length;
                    } else {
                        const edgesKey = response.edges
                            ? 'edges'
                            : response.Edges
                            ? 'Edges'
                            : 'results';
                        const pagination = _.omit(response, edgesKey);
                        this.paginationData = pagination;
                        this.apilist = this.extractApiList(response);
                    }
                    this.pageParam = this.queryArg;
                    this.apilistEmitter.emit(this.apilist);
                    this.loading = false;
                    this.determineIfClearFilterShouldBeShown();
                    this.determineIfZeroStateShouldBeShown();
                    this.updateSelectedItems();
                },
                error: err => {
                    this.errorHandler.handleError(err, this);
                    this.handleInvalidPage(err);
                    this.loading = false;
                    this.determineIfZeroStateShouldBeShown();
                },
            });
        } else {
            // data already supplied via apilist
            this.dynamic = true;
            this.apilist = this.apilist;
            this.determineIfClearFilterShouldBeShown();
            this.secondaryData = this.secondaryData;
            this.determineIfZeroStateShouldBeShown();
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        }
    }

    determineIfZeroStateShouldBeShown() {
        /**
         * hide search functionality if there is no search term and search results are empty
         */
        if (!this.queryArg?.search && !this.apilist?.length) {
            this.searchy?.nativeElement?.style.setProperty(
                'display',
                'none',
                'important'
            );
        }
    }

    /** show selected items in the table after refetching data */
    updateSelectedItems() {
        if (this.hasSelectRow) {
            this.apilist.forEach(item => {
                const isSelected = this.selectedRows.some(
                    selectedItem => selectedItem.id === item.id
                );
                item.isSelected = isSelected;
            });
        }
    }

    /**
     * handle invalid page
     */
    handleInvalidPage(err) {
        if (err?.error?.detail?.includes('Invalid page.'))
            this.invalidPageError = !this.invalidPageError;
    }

    /**
     * Method used to determine what the datatable should filter by
     */
    determineQueryFilters(obj) {
        /**
         * start out by adding the default filters
         */
        let params = _.clone(this.defaultQueryArg);
        params = _.isObject(params) ? params : {};
        /**
         * next add in filters from the filter form
         */
        const filters = _.isObject(obj) ? obj : {};
        params = _.extend(params, filters);
        this.queryArg = params;
        /**
         * Omit explicitly ignored filters
         */
        const ignoreStateParams =
            this.ignoreStateParams !== undefined ? this.ignoreStateParams : [];
        params = _.omit(params, ignoreStateParams);
        return params;
    }

    /**
     *  determineIfClearFilterShouldBeShown
     */
    determineIfClearFilterShouldBeShown() {
        const stateparams = _.omit(this.uiglobals.params, '#');
        const currentFilterObj = JSON.parse(JSON.stringify(stateparams));
        const stateFilterArray = _.omit(
            currentFilterObj,
            this.ignoreDisplayFilters
        );
        this.stateFilters = stateFilterArray;
        if (!_.isMatch(this.defaultQueryArg, this.stateFilters)) {
            this.isFiltered = true;
        }
    }

    /** checks if state filter shave been defined */
    checkIfStateFiltersExit() {
        if (!this.stateFilters) {
            return false;
        }
        const keys = Object.keys(this.stateFilters);
        return keys.length > 0;
    }

    /**
     * onFilterRemove
     * @param tag
     * @returns
     */
    onFilterRemove(tag) {
        const filterArr = tag.text.split(': ');
        const filterOut =
            filterArr[0] === 'page_size' ? ['page_size', 'page'] : filterArr[0];
        let newStateFilters = _.omit(this.stateFilters, filterOut);
        if (this.activeStateParams !== undefined) {
            const obj = { activeStateParams: this.activeStateParams };
            newStateFilters = this.transformActiveStateParams(
                newStateFilters,
                obj
            );
        }
        this.$state.transitionTo(this.uiglobals.current.name, newStateFilters, {
            reload: false,
            notify: false,
            inherit: false,
        });
    }

    /**
     * onSelectModalFilter modal tags
     */
    onSelectModalFilter(
        event: any,
        context: 'new_page' | 'current_page' = 'current_page',
        transitionTo?: string
    ) {
        if (Array.isArray(event)) return;

        const filterParams = event?.value;

        if (context === 'current_page') {
            this.extendStateParams(filterParams);
        } else {
            this.datatableService[this.downloadButtonRequest](
                this,
                event,
                transitionTo
            );
        }
    }

    /**
     *
     * @param obj Object of params to filter by
     * @param original Used to override existing params to set original default params
     * @returns
     */
    setParams(obj, original?) {
        /** If this has been set the default params will be used to filter the api */
        if (original) {
            this.$state.transitionTo(
                this.uiglobals.current.name,
                this.defaultQueryArg,
                { reload: false, notify: false, inherit: false }
            );
            return;
        }

        /** Check if new params match default params */
        const defaultparams = _.clone(this.defaultQueryArg);
        if (_.isMatch(defaultparams, obj)) {
            let finalFilters = this.getFinalFilters();
            /** Check if state params match the defaults being set */
            if (!_.isMatch(finalFilters, obj)) {
                /** if the state params and the default don't match
                 * the state params take precedence and should be used
                 * to filter the datatable
                 */
                finalFilters = this.getNamespacedFilters(finalFilters);
                let defaultParams = _.extend(obj, finalFilters);
                if (this.dontOverrideDefaultParams) {
                    defaultParams = _.extend(defaultParams, defaultparams);
                }
                this.getData(defaultParams);
            } else {
                /** This means the state params and the default params match
                 * this probably means it is the first time the datatable is loading
                 * using obj and filters can be interchanged to filter the table
                 */
                finalFilters = this.getNamespacedFilters(finalFilters);
                if (this.dontOverrideDefaultParams) {
                    finalFilters = _.extend(finalFilters, defaultparams);
                }
                this.getData(finalFilters);
                return;
            }
        } else {
            /** This means the params being set should filter the table */
            this.getData(obj);
        }
    }

    /**
     *  getNamespacedFilters
     * @param finalFilters Contains filters that might be namespaced
     * @returns filters without namespace
     */
    getNamespacedFilters(finalFilters) {
        if (this.namespace) {
            const lastFilters = {};
            const filterKeys = _.keys(finalFilters);
            const namespace = this.namespace + '_';
            if (filterKeys.length > 0) {
                for (let i = 0; i < filterKeys.length; i++) {
                    const key = filterKeys[i].substring(namespace.length);
                    if (filterKeys[i].includes(namespace)) {
                        lastFilters[key] = finalFilters[filterKeys[i]];
                    }
                }
            }
            return lastFilters;
        } else {
            return finalFilters;
        }
    }

    /**
     *  getFinalFilters
     * @returns filters that should be used in the api
     */
    getFinalFilters() {
        let finalFilters = {};
        /**
         * If the default params and the new params match
         * then use state params as filter params this is because
         * there are times the defaultparams may want to override
         * params coming from the filter form
         * */
        const stateparams = _.omit(this.uiglobals.params, '#');
        const filters = JSON.parse(JSON.stringify(stateparams));
        const stateParams = _.isEmpty(this.uiglobals.$current.params)
            ? _.clone(this.uiglobals.params)
            : _.clone(this.uiglobals.$current.params);

        // Check if stateparams are empty
        if (_.isEmpty(stateParams) || _.isEmpty(filters)) {
            finalFilters = {};
        } else {
            const stateKeys = _.intersection(
                _.keys(filters),
                _.keys(stateParams)
            );
            const newFilter = {};
            if (stateKeys.length > 0) {
                for (let i = 0; i < stateKeys.length; i++) {
                    newFilter[stateKeys[i]] = filters[stateKeys[i]];
                }
            }
            finalFilters = _.extendOwn(newFilter, filters);
        }
        return finalFilters;
    }

    /**
     * format table dates to a readable format
     */
    formatDate(date) {
        return moment(date).format('YYYY-MM-DD');
    }

    /**
     * Method that emits an event used to emit the params used to filter the datatable
     */
    silDatatableFiltersArg(arg) {
        this.filtersArg.emit(arg);
    }

    /**
     * Method that emits an event used to emit the end cursor of a graphql endpoint
     */
    setEndcursor(val) {
        const endCursorArg = val;
        this.endCursorArg.emit(endCursorArg);
    }

    /**
     * Method used get a nested value
     */
    mineValue(obj, path) {
        if (!path) return obj;
        const properties = path.split('.');
        let current = obj;

        for (let i = 0; i < properties.length; i++) {
            if (!current) {
                return undefined;
            }
            current = current[properties[i]];
        }

        return current;
    }

    /**
     * Method to get tooltip text for SMS status values
     */
    getStatusTooltip(statusValue: string, path: string): string {
        // Only show tooltips for SMS state paths
        if (!path || !path.includes('sms.state')) {
            return '';
        }

        const tooltipMapping = {
            DELIVERED: "The SMS has been delivered to the user's phone",
            FAILED: "The SMS gateway can't process the request due to invalid number",
            SENT: 'The SMS has been sent to the SMS gateway',
            REJECTED: 'The SMS gateway rejected the SMS',
            QUEUED: 'The SMS gateway has successfully received the request',
            UNDELIVERED: "The SMS couldn't be delivered to the user's phone",
        };

        return tooltipMapping[statusValue] || '';
    }

    /**
     * Method used to set set query params by resetting the query params
     */
    setFreshTableFilter(val) {
        this.queryArg = _.clone(this.defaultQueryArg);
        this.queryArg = _.extend(this.queryArg, val);
        this.getData(this.queryArg);
    }
    /**
     * Toggles the filter drawer
     */
    toggleFilterDrawer() {
        this.showFilterDrawer = !this.showFilterDrawer;
    }

    /**
     * Uses a form to filter the api data
     */
    filterData(model, toggle?) {
        this.filters = JSON.parse(JSON.stringify(model));

        if (this.filters.start_date) {
            this.filters.start_date = this.formatDate(this.filters.start_date);
        }
        if (this.filters.end_date) {
            this.filters.end_date = this.formatDate(this.filters.end_date);
        }

        if (toggle) {
            this.toggleFilterDrawer();
        }
        this.extendStateParams(this.filters);
    }

    /**
     * Extends state params before navigating
     */
    extendStateParams(model) {
        const newParams = model;
        const stateparams = _.omit(this.uiglobals.params, '#');
        let filters = JSON.parse(JSON.stringify(stateparams));
        if (_.has(newParams, 'search')) {
            filters = _.omit(filters, 'page');
        }
        const obj = {};
        const clearedKeys = [];
        const newStateParams = _.extend(filters, newParams);
        _.mapObject(newStateParams, (val, key) => {
            if (val !== 'clear') {
                obj[key] = val;
            } else {
                clearedKeys.push(key);
            }
        });
        const stateSettings = {
            reload: false,
            notify: false,
            inherit: true,
        };
        stateSettings.inherit = !_.isEmpty(_.pick(obj, clearedKeys));
        this.$state.transitionTo(
            this.uiglobals.current.name,
            obj,
            stateSettings
        );
    }
    /**
     * Clears the form filter data
     */
    clearData() {
        this.setParams({}, { originalDefault: true });
        this.isFiltered = !this.isFiltered;
    }

    /**
     * Sets the header action store
     */
    setHeaderDialogueContext(context: any) {
        this.btnStoreContext = context;
        this.headerDialogueContext[context?.store] =
            !this.headerDialogueContext[context?.store];
    }

    /**
     * header action submit
     */
    submitHeaderAction(): void {}

    /**
     * OnChanges lifecycle hooks that detects when the query parameters have changed
     */
    ngOnChanges(changes: SimpleChanges) {
        if (!_.isUndefined(changes.defaultQueryArg)) {
            const newValues = _.clone(changes.defaultQueryArg.currentValue);
            this.setParams(newValues);
        }
        if (!_.isUndefined(changes.secondaryData)) {
            this.secondaryData = _.clone(changes.secondaryData.currentValue);
        }
        if (!_.isUndefined(changes.apilist)) {
            this.apilist = _.clone(changes.apilist.currentValue);
        }

        if (!_.isUndefined(changes.statusFilters)) {
            this.statusFilters = _.clone(changes.statusFilters.currentValue);
        }

        if (changes.workflowTableData) {
            this.checkWorkflowState();
        }
    }

    processSelectedItem() {
        switch (this.processSelectedItemMethod) {
            case 'nextOfKin':
                const personContacts =
                    this.selectedItem.related.person_contacts;
                // stores the fetched contacts into an array
                const contacts = [];

                personContacts.forEach(contact => {
                    contacts.push(contact);
                });

                const cleanedData = {
                    id: this.selectedItem.related.id,
                    first_name: this.selectedItem.related.first_name,
                    other_names: this.selectedItem.related.other_names,
                    last_name: this.selectedItem.related.last_name,
                    date_of_birth: this.selectedItem.related.date_of_birth,
                    person_contacts: contacts,
                    gender: this.selectedItem.related.gender,
                    relationship: this.selectedItem.relationship,
                    person_ids: [],
                };

                return cleanedData;

            default:
                return this.selectedItem;
        }
    }

    /**
     *
     * @param value The value used to filter against in the collection
     * @param collection The set of objects to filter against
     * @param key The key used to filter against in the collection
     * @returns a boolean to check if one the objects is contained
     */
    includes(value, collection, key) {
        const obj = {};
        obj[key] = value;
        const foundObj = _.findWhere(collection, obj);
        return _.isObject(foundObj);
    }

    /**
     * filterTable of queues from sil-combo-box
     * @param event DOM event
     * @param filterprop filter string
     * */
    filterTable(event, filterprop) {
        const existingFilters = this.getFinalFilters();

        let obj = {};
        if (filterprop === 'status_type') {
            obj = event.filter;
        }
        const returnedTarget = Object.assign(existingFilters, obj);

        this.extendStateParams(returnedTarget);
    }

    /** navigate from zero state */
    navigateFromZeroState(destination) {
        this.$state.go(`${destination}`);
    }

    /**
     *  checks if zero state component is in view
     * then hide data table filters and search
     */
    onInView(isInView) {
        this.isElementInView = isInView;
        if (this.isElementInView)
            this.zeroState.hideOuterTableComponents =
                !this.zeroState.hideOuterTableComponents;
    }

    tableRowsIsSelectable() {
        const isSelect = this.rows.find(row => {
            if (row.select) return true;
        });
        this.hasSelectRow = !isSelect ? false : true;
    }

    toggleCheckbox(item, event) {
        if (!this.hasSelectRow) return;
        if (this.hasDisabledCheckboxes && this.shouldDisableCheckbox(item))
            return;

        if (!(event?.target as HTMLElement)?.closest('.grid-checkbox')) {
            item.isSelected = !item.isSelected;
            // emit selected row to the parent component
            this.selectRow(item);
        }
    }

    getCurrentWorkflowStateDescription(): string | undefined {
        const workflowState = this.workflowTableData?.find(
            data => data.key === 'workflow_state'
        );

        return workflowState?.items?.find(
            item => item[this.currentWorkflowStateKey]
        )?.[this.currentWorkflowStateKey];
    }

    checkWorkflowState(): void {
        const workflowState = this.workflowTableData?.find(
            data => data.key === 'workflow_state'
        );

        this.hasWorkflowState = !!workflowState?.items?.some(
            item => item[this.currentWorkflowStateKey]
        );
    }

    /**
     * Extract pagination parameters from FHIR URL
     */
    public extractFhirPaginationParams(
        url: string
    ): { offset: number; count: number; getpages?: string } | null {
        if (!url || typeof url !== 'string' || url.trim() === '') {
            return null;
        }
        try {
            const urlObj = new URL(url);
            const offset = parseInt(
                urlObj.searchParams.get('_getpagesoffset') || '0',
                10
            );
            const count = parseInt(
                urlObj.searchParams.get('_count') || '20',
                10
            );
            const getpages = urlObj.searchParams.get('_getpages') || undefined;
            const result = { offset, count, getpages };
            return result;
        } catch (error) {
            console.error(
                'Error extracting FHIR pagination parameters:',
                error
            );
            return null;
        }
    }

    /**
     * Function that extracts table data from FHIR response
     * @param response FHIR api response
     * @returns data to be rendered in table
     */
    extractFhirData(response: any) {
        // Check if response has GraphQL-like structure
        if (response && response.edges && Array.isArray(response.edges)) {
            return response.edges;
        }

        // Original FHIR handling
        if (response && response.entry && Array.isArray(response.entry)) {
            return response.entry.map(entry => entry.resource || entry);
        }

        // For direct resource arrays
        if (Array.isArray(response)) {
            return response;
        }

        return [];
    }
    /**
     * OnInit lifecycle hooks that setups the component and fetches the data
     * when the component initially loads
     */
    ngOnInit() {
        /**
         * If the defaultqueryArg is set then onchanges will drive
         * */
        this.datatableService.setupComponent(this);
        this.tableRowsIsSelectable();
        if (_.isUndefined(this.defaultQueryArg)) {
            /**
             * Fetching data
             * */
            this.getData();
        }
    }

    /**
     * Get status color for lab orders specifically
     * @param status The status string
     * @returns Nebular status color
     */
    getLabOrderStatusColor(status: string): string {
        if (!status) return 'basic';

        const normalizedStatus = status.toLowerCase();

        switch (normalizedStatus) {
            case 'active':
                return 'warning';
            case 'completed':
            case 'complete':
                return 'success';
            case 'pending':
            case 'requested':
                return 'warning';
            case 'cancelled':
            case 'rejected':
                return 'danger';
            default:
                return 'basic';
        }
    }
}

import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService } from '@uirouter/angular';
import _ from 'underscore';

/**
 * Component that is used to render the business details page
 *
 *  Component declaration that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'sil-business-details',
    templateUrl: './business-details.component.html',
    styleUrls: ['./business-details.component.scss'],
    standalone: false,
})
/**
 * Class that creates the OnboardingBusinessDetailsComponent component
 */
export class OnboardingBusinessDetailsComponent implements OnInit, OnChanges {
    constructor(
        protected toastrService: NbToastrService,
        public $state: StateService
    ) {}

    /** Used display action button */
    @Input() showActionButton: boolean = true;

    /** provider data */
    @Input() providerData: any;

    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;

    /** used to filter datatable params */
    filterParams: Object;

    /**
     * Array used to define the headers of the datatable
     */
    ownersTableHeader: Array<any>;
    /** Contains owner data  */
    ownerData: any;
    /**
     * Array used to define the rows of the datatable
     */
    ownersTableRows: Array<any>;
    /**
     * Array used to define the actions of the datatable
     */
    ownersTableActions: Array<any>;

    businessDocumentsActions: Array<any>;

    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    businessDocumentsRows: Array<any>;
    /** Contains business document headers */
    businessDocumentsHeader: Array<any>;
    /** Contains business document data  */
    businessDocuments: any;

    /**
     * Used to display different toggle modals
     * information
     */
    toggle: Object = {};

    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    ngOnInit() {
        /**
         * Used to set the table's filters
         * */
        this.filterParams = {
            page_size: 3,
        };

        /**
         * Set the table header data
         */
        this.ownersTableHeader = [
            { text: 'Name' },
            { text: 'Contact' },
            { text: 'ID / Passport' },
            { text: 'KRA Pin' },
            { text: 'Action' },
        ];
        /**
         * Set the table's rows
         */
        this.ownersTableRows = [
            {
                keys: ['title', 'full_name'],
                type: 'chain',
                nested: [
                    {
                        label: 'Gender',
                        value: 'gender',
                        type: 'string',
                        required: true,
                    },
                    {
                        label: 'DoB',
                        value: 'dob',
                        type: 'date',
                        required: true,
                    },
                ],
            },
            {
                nested: [
                    {
                        label: 'Email',
                        value: 'email',
                        type: 'string',
                        required: true,
                    },
                    {
                        label: 'Phone',
                        value: 'phone_number',
                        type: 'string',
                        required: true,
                    },
                ],
            },
            {
                nested: [
                    { label: 'ID', value: 'national_id', type: 'string' },
                    {
                        label: 'Passport',
                        value: 'passport_no',
                        type: 'string',
                    },
                    {
                        nolabel: true,
                        value: 'owner_kyc_docs',
                        type: 'document',
                        document: 'NATIONAL ID',
                    },
                    {
                        nolabel: true,
                        value: 'owner_kyc_docs',
                        type: 'document',
                        document: 'PASSPORT',
                    },
                ],
            },
            {
                key: 'kra_pin',
                type: 'string',
                nested: [
                    {
                        nolabel: true,
                        value: 'owner_kyc_docs',
                        type: 'document',
                        document: 'KRA CERTIFICATE',
                        required: true,
                    },
                ],
            },
        ];
        this.ownersTableActions = this['actions'] = [
            {
                btnText: 'EDIT',
                status: 'success',
                action: 'modal',
                modalConf: {
                    checkExpressionOn: 'modelChange',
                    context: 'VIEW OWNER',
                    service: 'selfBusinessOwnerService',
                    refreshDismiss: true,
                    refreshFxn: 'refreshData',
                    dataObj: 'business_owners',
                },
            },
        ];

        /**
         * Set the table header data
         */
        this.businessDocumentsHeader = [
            { text: 'Document Type' },
            { text: 'Date Added' },
            { text: 'View' },
            { text: 'Update' },
        ];

        /**
         * Set the table's rows
         */
        this.businessDocumentsRows = [
            {
                key: 'attachment_type',
                type: 'string',
                nested: [
                    {
                        label: 'Document Name',
                        value: 'title',
                        type: 'string',
                    },
                ],
            },
            {
                key: 'creation_date',
                type: 'date',
            },
            {
                key: 'data',
                type: 'document',
            },
        ];
        this.businessDocumentsActions = this['actions'] = [
            {
                btnText: 'View',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.ai.guidelines.detail',
                },
            },
        ];
    }

    /** Hook to the OnChanges lifecycle hook */
    ngOnChanges(changes: SimpleChanges) {
        !_.isUndefined(changes.providerData)
            ? this.setModel(changes.providerData.currentValue)
            : '';
    }

    /** sets the model data */
    setModel(val) {
        this.providerData = undefined;
        this.providerData = val;
        this.businessDocuments = this.providerData.provider_kyc_docs;
        this.ownerData = this.providerData.business_owners;
    }
}

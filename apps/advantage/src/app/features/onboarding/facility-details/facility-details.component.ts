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
 * Component that is used to render the facility details page
 *
 *  Component declaration that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'sil-facility-details',
    templateUrl: './facility-details.component.html',
    styleUrls: ['./facility-details.component.scss'],
    standalone: false,
})
/**
 * Class that creates the FacilityDetails component
 */
export class FacilityOnboardingDetailsComponent implements OnInit, OnChanges {
    constructor(
        protected toastrService: NbToastrService,
        public $state: StateService
    ) {}

    /** Used display action button */
    @Input() showActionButton: boolean = true;

    /** provider data */
    @Input() providerData: any;

    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted: boolean = false;

    selectedBillingClass: string = 'CREDIT';

    /**
     * Array used to define the headers of the datatable
     */
    facilityQuestionnaireTableHeader: Array<any>;
    facilityQuestionnaireData: any;
    facilityQuestionnaireTableActions: Array<any>;
    facilityQuestionnaireTableRows: Array<any>;
    secondaryData: any;

    /** Contains facility data  */
    businessDocumentsActions: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    facilityPhotoRows: Array<any>;
    facilityPhotoData: any;
    facilityPhotoTableActions: Array<any>;
    facilityPhotoHeaders: Array<any>;

    /** used to filter datatable params */
    filterParams: Object;

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
        this.filterParams = {};

        /**
         * Set the table header data
         */
        this.facilityQuestionnaireTableHeader = [
            { text: 'Question' },
            { text: 'Action' },
        ];
        /**
         * Set the table's rows
         */
        this.facilityQuestionnaireTableRows = [
            {
                key: 'question_text',
                type: 'string',
            },
        ];
        this.facilityQuestionnaireTableActions = this['actions'] = [
            {
                btnText: 'YES',
                status: 'success',
                action: 'quickPatch',
                modalConf: {
                    value: 'YES',
                    method: 'patchAnswer',
                },
            },
            {
                btnText: 'NO',
                status: 'danger',
                action: 'quickPatch',
                modalConf: {
                    value: 'NO',
                    method: 'patchAnswer',
                },
            },
        ];

        /**
         * Set the table header data
         */
        this.facilityPhotoHeaders = [
            { text: 'Date Added' },
            { text: 'Photo' },
            { text: 'Action' },
        ];

        /**
         * Set the table's rows
         */
        this.facilityPhotoRows = [
            {
                key: 'creation_date',
                type: 'date',
                nested: [
                    {
                        label: 'Time',
                        value: 'creation_date',
                        type: 'time',
                    },
                ],
            },
            {
                key: 'attachment_type',
                type: 'string',
            },
            {
                key: 'data',
                type: 'document',
            },
        ];
        this.facilityPhotoTableActions = this['actions'] = [];
    }

    ngOnChanges(changes: SimpleChanges) {
        !_.isUndefined(changes.providerData)
            ? this.setModel(changes.providerData.currentValue)
            : '';
    }

    /** sets the model data */
    setModel(val) {
        this.providerData = undefined;
        this.providerData = val;
        this.facilityQuestionnaireData = this.providerData.questions;
        this.secondaryData = this.providerData.question_answers;
        this.facilityPhotoData = this.providerData.facility_photos;
    }
}

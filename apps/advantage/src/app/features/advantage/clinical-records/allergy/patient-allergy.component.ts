import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    afterNextRender,
} from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { AnalyticsService } from '../../../../@core/utils';
import { fadeAnimation } from '../../../../shared/animations/if-animations';
import { AllergyInterface } from '../../models/ClinicalNotes';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { PageComponent } from '../../../../shared/page/page.component';

@Component({
    selector: 'patient-allergy',
    templateUrl: './patient-allergy.component.html',
    styleUrls: ['./patient-allergy.component.scss'],
    animations: [fadeAnimation],
    standalone: false,
})
export class PatientAllergyComponent extends PageComponent implements OnInit {
    /**
     * Constructor for the component
     * @param toastrService Connects to the toast service
     * @param uiglobals Access instance of uirouter global service
     * @param $state injects the $state service
     * @param analytics Analytics service
     * @param dataLayer Access instance of the silstores service
     */
    constructor(
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public analytics: AnalyticsService,
        public dataLayer: SilStoresService
    ) {
        super(toastrService, uiglobals, $state, analytics);
        afterNextRender(() => {
            this.loadCkEditor();
        });
    }

    async loadCkEditor() {
        if (typeof window !== 'undefined') {
            const classicEditor = (
                await import('@ckeditor/ckeditor5-build-classic')
            ).default;
            this.Editor = classicEditor;
        }
    }

    /**
     * Used to define the score card's background color
     */
    @Input() styleClass: string;

    /** store patient info */
    @Input() patient: any;

    @Input() item: any;

    /** stores active service request */
    @Input() activeServiceRequest: any;

    /** stores patient visit status */
    @Input() patientVisitStatus: any;

    @Input() isVisitDatePassed: boolean;

    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    /**
     * sends event to ClinicaRecords parent component to show/hide send patient to service point modal
     */
    @Output() toggleServicePointModalEvent: EventEmitter<any> =
        new EventEmitter<any>();

    /**
     * opens the template if note is already added, to prevent alot of clicks
     */
    @Output() toggleIsHiddenEvent: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Specifes which display filters can be hidden
     */
    @Input() ignoreDisplayFilters?: Array<string> = [];

    /**
     * Specifies if form should be in a skika drawer
     */
    @Input() useDrawer: boolean = false;

    /**
     * Used to display the allergy form drawer
     */
    showAllergyFormDrawer: boolean = false;

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

    itemHeading: any;

    itemHeadingTwo: any;

    /** active modal id */
    toggleId: any;

    model: Object;

    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    /**
     * Used to store a result after using the query
     */
    patientAllergies: any[] = [];

    /**
     * Used to show that the component is loading
     */
    loadingResult: boolean = false;

    patientAllergiesCount: number = 0;

    /** stores selected allergy */
    selectedAllergy: AllergyInterface;

    showPreviewAllergyModal: boolean = false;

    public Editor: any;

    /** disables ckeditor */
    isCkEditorDisabled: boolean = true;

    visitStatus = ['CANCELLED', 'ENTERED_IN_ERROR'];

    statusFilters: Array<any>;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * Gets allergies data using SilStoresService list method.
     */
    getResult() {
        this.loadingResult = true;

        const params = {
            patient_id: this.patient.clinical_id,
            encounter_id: this.activeServiceRequest?.encounter_id,
            limit: '5',
        };

        this.dataLayer.list('allergyintolerance', params).subscribe({
            next: (response: any) => {
                if (response.TotalCount > 0) {
                    this.patientAllergiesCount = response.TotalCount;
                    this.patientAllergies = response.Edges.map(edge =>
                        this.selectFewerFields(edge)
                    );
                } else {
                    this.patientAllergies = [];
                }
                this.loadingResult = false;
            },
            error: this.handleError,
        });
    }

    handleError = error => {
        this.showToastError(
            'bottom-right',
            'danger',
            'Error',
            error?.message || 'An error occurred'
        );
        this.loadingResult = false;
    };

    /** selects data needed from the response */
    selectFewerFields = select => {
        const { code, name, system, reaction } = select.Node;
        return {
            code,
            name,
            system,
            reaction,
        };
    };

    /**
     * toggle Add allergy form
     */
    toggleAllergyFormDrawer() {
        this.showAllergyFormDrawer = !this.showAllergyFormDrawer;
    }

    /** toggle payment modal */
    toggleModal(context) {
        if (this.activeServiceRequest?.encounter_id === undefined) {
            return this.showToastError(
                'bottom-right',
                'danger',
                'Patient is not in an active service point',
                'Serve the patient in order to add their allergy'
            );
        }
        this.toggleId = context.id;
        this.itemHeading = `Add ${context?.name}`;
        this.itemHeadingTwo = `Save ${context?.name}`;
        this.toggle[context.id] = !this.toggle[context.id];
    }

    /**
     *  add a patient allergy item
     */
    addPatientAllergyItem(model) {
        const allergyIntolerancePayload = {
            code: model['allergy'].code,
            encounterID: `${this.activeServiceRequest.encounter_id}`,
            patientID: this.patient.clinical_id,
            terminologySource: model['allergy'].system,
            reaction: {
                severity: model['status'],
                system: model['allergy'].system,
                code: model['allergy'].code,
            },
        };
        this.addPatientAllergy(allergyIntolerancePayload);
    }

    /**
     * @param allergyPayload arg is payload required for REST API
     */
    addPatientAllergy(allergyPayload): any {
        this.loadingResult = true;

        this.dataLayer.create('allergyintolerance', allergyPayload).subscribe({
            next: this.handleAddPatientAllergy,
            error: this.handleError,
        });
    }

    handleAddPatientAllergy = () => {
        this.toggle = {};
        this.loadingResult = false;
        this.showAllergyFormDrawer = false;
        this.getResult();
        this.showToast(
            'bottom-right',
            'success',
            'Successful',
            'Allergy added'
        );
    };

    togglePreviewAllergyModal(event?) {
        if (event) {
            this.selectedAllergy = event;
        } else {
            this.selectedAllergy = {};
        }
        this.showPreviewAllergyModal = !this.showPreviewAllergyModal;
    }

    /**
     * Hook that is called when the component is initialized
     */
    ngOnInit() {
        if (
            this.patient?.clinical_id &&
            this.activeServiceRequest?.encounter_id
        ) {
            this.getResult();
        } else {
            this.loadingResult = false;
        }

        // Table header
        this.tableHeader = [
            { text: 'clinical.table_header.name' },
            { text: 'clinical.table_header.severity' },
            { text: 'clinical.table_header.action' },
        ];
        // Table rows
        this.rows = [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'reaction',
                type: 'reaction',
            },
        ];

        this.statusFilters = [
            {
                display: 'Current',
                filter: {
                    status: 'current',
                },
            },
            {
                display: 'Retired',
                filter: {
                    status: 'retired',
                },
            },
        ];

        /**
         * Set the actions used for each row in the patient list table
         * */
        this.actions = [
            {
                btnText: 'shared.buttons.view',
                status: 'success',
                action: 'custom',
                modalConf: {
                    customFxn: true,
                },
            },
        ];
    }
}

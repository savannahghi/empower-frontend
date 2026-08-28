import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PatientModel, PersonModel } from '../../models';
import { PatientService } from '../patient.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'ngx-patient-search',
    templateUrl: './patient-search.component.html',
    styleUrls: ['./patient-search.component.scss'],
    standalone: false,
})
export class PatientSearchComponent implements OnInit {
    @Input() showPatientDetails: boolean = false;
    @Input() patientSearchSubmitted: boolean = false;
    /**
     * Used to display the loader when data is being fetched
     */
    loading: boolean = false;

    /**
     * Saves the search input
     */
    searchInput: string;

    /**
     * Saves selected patient data
     */
    selectedPatient: PersonModel;

    /**
     * Contains the variant information
     */
    variant: string;

    /**
     * Used to save existing patients on HCRM
     */
    existingPatientsHCRM: any;
    /**
     * saves the data of the existing patient
     */
    existingPatient: any;

    /**
     * Saves patient proprties
     */
    patientProperties: any;

    /**
     * Sets the selected language
     * */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /** used to filter datatable params */
    filterParams: Object;

    /**
     * Used to display different toggle modals
     * information
     */
    toggle: Object = {};

    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;

    /**
     * Array used to define the actions of the datatable
     */
    actions: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Save consent
     */
    smsConsent: boolean = true;

    /**
     * Constructor for the class component
     * @param dataLayer used to access the data layer service
     * @param errorHandler used to access the error handler service
     * @param toastrService used to access the toast service
     * @param $state - Connects to the state service
     */
    constructor(
        private dataLayer: SilStoresService,
        private translate: TranslateService,
        private cookieService: Cookies,
        private errorHandler: ErrorHandlerService,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        private patientService: PatientService
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    // Save user input on keystroke and search on pressing Enter
    searchOnEnter(event) {
        this.searchInput = event.target.value;
        if (event.code === 'Enter' && this.searchInput.length > 2) {
            this.checkPatientExistsOnHCRM();
        }
    }

    /**
     * Toggles the modal
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    // Check if patient match exists on HCRM
    checkPatientExistsOnHCRM() {
        this.loading = true;
        const params = {
            search: this.searchInput,
        };
        this.dataLayer.list('patients_search', params).subscribe({
            next: response => {
                let data: Array<PatientModel>;
                if (response['results']?.length > 0) {
                    data = response['results'];
                }
                this.loading = false;
                this.patientSearchSubmitted = true;
                this.existingPatientsHCRM = data;
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }

    /**
     * Used to toggle patient datailed view
     */
    togglePatientDetail() {
        this.showPatientDetails = !this.showPatientDetails;
    }

    /**
     * Get details for started visits
     */
    getPatientDetails(event) {
        this.selectedPatient = event;
        this.patientProperties = [
            { name: 'Full name', value: this.selectedPatient.name },
            { name: 'Sex', value: this.selectedPatient.gender },
            {
                name: 'Primary Phone Number',
                value: this.selectedPatient.phone_number,
            },
            { name: 'Email Address', value: this.selectedPatient.email },
            {
                name: 'Health ID',
                value: this.selectedPatient.sil_global_identifier,
            },
        ];
        this.togglePatientDetail();
    }

    createPatientWithHCRMData() {
        this.toggleModal('showPatientMatchModal');
        const payload = this.patientService.preparePatientPayload(
            this.selectedPatient,
            {
                smsConsent: this.smsConsent,
            }
        );
        this.patientService.createPatient(payload, this);
    }

    /**
     * Go to patient details page
     */
    viewPatient() {
        this.$state.go('app.advantage.patients.detail.nextOfKin', {
            id: this.existingPatient['id'],
        });
    }

    /** Hook called when component initializes */
    ngOnInit() {
        /**
         * Used to set the table's filters
         * */
        this.filterParams = {
            page_size: 5,
        };

        /**
         * Set the table header data
         */
        this.tableHeader = [
            { text: 'Health ID' },
            { text: 'Name' },
            { text: 'Date of Birth' },
            { text: 'Action' },
        ];

        /**
         * Set the table's rows
         */
        this.rows = [
            {
                path: 'sil_global_identifier',
                type: 'mineVal',
            },
            {
                path: 'name',
                type: 'mineVal',
            },
            {
                key: 'date_of_birth',
                type: 'date',
            },
        ];

        /**
         * Set the actions used for each row in the patient list table
         * */
        this.actions = this['actions'] = [
            {
                btnText: 'View',
                status: 'primary',
                action: 'custom',
                modalConf: {
                    customFxn: true,
                    Fxn: 'getPatientDetails',
                },
            },
        ];

        this.variant = environment.variant;
    }
}

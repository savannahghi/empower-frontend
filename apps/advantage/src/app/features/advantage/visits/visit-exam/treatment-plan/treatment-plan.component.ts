import { Component, Input, OnInit } from '@angular/core';
import { VisitService } from '../../visit.service';
import { VisitExamService } from '../visit-exam.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import moment from 'moment';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

/**
 * Modal context types
 */
interface ModalInterface {
    'add-diagnosis-modal': boolean;
    tests: boolean;
    medications: boolean;
    appointments: boolean;
}

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'ngx-treatment-plan',
    templateUrl: './treatment-plan.component.html',
    styleUrl: './treatment-plan.component.scss',
    standalone: false,
})
/**
 * Class that creates the Treamtent Plan component
 */
export class TreatmentPlanComponent implements OnInit {
    /**
     * key value pairs for the toggle object
     */
    toggle: ModalInterface = {
        'add-diagnosis-modal': false,
        tests: false,
        medications: false,
        appointments: false,
    };
    /**
     * The component constructor
     * @param dataLayer Access instance of SilStoresService
     * @param visitService injects instance of the visit service
     * @param uiglobals injects the global values from ui router
     * @param $state injects instance of the State Service
     * @param errorHandler injects instance of the Error Handler Service
     * @param visitExamService Access an instance of the Visit Exam Service
     * @param toastrService Access instance of NbToastrService from Nebular
     */
    constructor(
        private dataLayer: SilStoresService,
        private visitService: VisitService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public errorHandler: ErrorHandlerService,
        public visitExamService: VisitExamService,
        protected toastService: NbToastrService,
        public analytics: AnalyticsService
    ) {}

    /**
     * Defines visit data
     */
    visit: any;
    /**
     * Used to override default form configurations
     */
    formConfig: any;
    /**
     * Used to define custom form options.
     */
    formOptions: any;
    /**
     * Contains visit Id
     */
    visitId: string;
    /** stores patient's visit date */
    visitDate: any;
    /**
     * Contains patient information
     */
    patient: any;
    /** is visit date passed, don't save any notes */

    isVisitDatePassed: Boolean = false;
    /**
     * Defines loading state when fetching diagnoses
     */
    loadingDiagnoses: Boolean = true;

    /**
     * Contains the prescription details
     */
    prescriptionDetails: any;
    /**
     * Used to determine if the content of a form has been submitted
     */
    submitted: boolean = false;
    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /**
     * Array of diagnoses
     */
    diagnoses: Array<any> = [];
    /**
     * Definition of the template components in the patient treatment plan step
     */
    templateSettings: any[] =
        this.visitExamService.treatmentPlanTemplateSettings;
    /**
     * Used to toggle service point modal
     */
    showServicePointModal: boolean = false;

    /**
     * Contains visit information resolved from the state
     */
    @Input() visitObservable: any;
    /**
     *
     * @param context has the different modal contexts
     */
    toggleModal(context: keyof ModalInterface) {
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * @param event
     */
    toggleServicePointModal() {
        this.showServicePointModal = !this.showServicePointModal;
    }
    /**
     * Toogle function to display or hide clinical components notes
     */
    toggleIsHidden(sectionId) {
        this.visitExamService.toggleSection(sectionId, this);
    }

    /** Observable that waits for patient visit data to be defined */
    visitPatientObservable() {
        this.visitService.visitPatientDataEmitter.subscribe(patient => {
            this.patient = patient;
        });
    }

    // get visit details, contains patient details
    getVisitInfo() {
        /** Resolved observable from the state */
        this.visitDate = moment(this.visit?.start).format('YYYY-MM-DD');
        this.isVisitDatePassed =
            moment(Date.now()).format('YYYY-MM-DD') > this.visitDate;
    }

    /**
     * Used to submit the prescription data
     * @param model object containing the form data used to create the prescription
     */
    submitDiagnosis(model) {
        model.diagnosis.source =
            model.diagnosis?.source === 'ICD-10-WHO'
                ? 'ICD_10_WHO'
                : model.diagnosis?.source === 'ICD-11-WHO'
                ? 'ICD_11_WHO'
                : model.diagnosis?.source;

        const serviceRequest = this.visit?.service_requests[0];
        this.loading = true;
        this.submitted = true;
        const diagnosisPayload: any = {
            name: model?.diagnosis?.display_name,
            code: model?.diagnosis?.id,
            description: model?.description,
            organisation: this.visit?.organisation,
            service_request: serviceRequest?.id,
            workstation_id: this.visit?.workstation_id,
            department_id: this.visit?.department_id,
            branch_id: this.visit?.branch_id,
            cluster_id: this.visit?.cluster_id,
            terminology_source: model.diagnosis?.source,
        };
        const baseModel = Object.assign({}, diagnosisPayload);

        this.dataLayer.create('exam-diagnosis', baseModel).subscribe({
            next: (data: any) => {
                const msg = `${data?.name} diagnosis added`;
                this.showToast('bottom-right', 'success', 'Successfully', msg);
                this.loading = false;
                this.formOptions.resetModel();
                this.toggleModal('add-diagnosis-modal');
                this.analytics.logEvent('diagnosis_added');
                this.$state.go(
                    '^.treatment_plan.diagnosis',
                    {
                        id: this.visitId,
                        visit: this.visitId,
                        diagnosis_id: data?.id,
                    },
                    {
                        reload: true,
                        inherit: true,
                    }
                );
            },
            error: err => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
        });
    }
    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }
    /**
    /** Handles errors when creating a prescription
    */
    handleErrorFxn = err => {
        this.errorHandler.handleError(err, this);
        this.loading = false;
    };

    /**
     * Used to set the form options
     * @param formOptions
     */
    getFormOptions(formOptions) {
        this.formOptions = formOptions;
    }
    /** Error handler for api calls */
    errorHandlerFxn = err => {
        this.errorHandler.handleError(err, this);
        this.loadingDiagnoses = false;
        return;
    };

    /**
     * Function to fetch diagnoses
     */
    fetchDiagnoses() {
        const url = `?visit_id=${this.visitId}&fields=id,name,code,service_request`;
        this.dataLayer.get('exam-diagnosis', url, {}, true).subscribe({
            next: this.receiveDiagnoses,
            error: err => this.errorHandlerFxn(err),
        });
    }
    /**
     * Receive diagnoses
     */
    receiveDiagnoses = data => {
        this.loadingDiagnoses = false;
        this.diagnoses = data?.results;
        this.$state.go(
            '^.treatment_plan.diagnosis',
            { id: this.visitId, diagnosis_id: this.diagnoses?.[0]?.id },
            { reload: true }
        );
    };

    /**
     * Component lifecycle used after the component is initialized
     */
    ngOnInit() {
        this.visitId = this.uiglobals.params.visit || this.uiglobals.params.id;
        this.fetchDiagnoses();
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        this.visitPatientObservable();

        /** Resolved observable from the state */
        this.visitObservable.subscribe(
            (response: any) => {
                this.visit = response;
                this.visitService.setVisitData(this.visit);
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }
}

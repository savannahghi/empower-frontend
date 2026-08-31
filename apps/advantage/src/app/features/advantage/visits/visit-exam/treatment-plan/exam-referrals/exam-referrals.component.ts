import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { PatientService } from '../../../../patients/patient.service';
import { SilStoresService } from '../../../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../../../shared/sil-http-services/error-handler';
import { VisitService } from '../../../visit.service';
import { Observable, Subject } from 'rxjs';

/**
/**
 * Component selector and template url
 */
@Component({
    selector: 'sil-exam-referrals',
    templateUrl: './exam-referrals.component.html',
    styleUrls: ['./exam-referrals.component.scss'],
    standalone: false,
})

/**
 * Class that defines referrals list controls, methods and lifecycle hooks
 */
export class ExamReferralsComponent implements OnInit {
    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Observable that loads the conditions
     */
    conditions$: Observable<any>;
    /**
     * Subject that checks the search input
     */
    searchInput$ = new Subject<string>();

    /**
     * Patient details
     */
    @Input() patient: any;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * Used to toggle the referral modal
     */
    toggle: any = {};
    /**
     * Used to override default form configurations
     */
    formConfig: any;
    /**
     * Used to define custom form options.
     */
    formOptions: any;

    /**
     * Used to determine if the content of a form has been submitted
     */
    submitted: boolean = false;

    /**
     *
     * @param context has the different modal contexts
     */
    toggleModal(context: any) {
        this.toggle[context] = !this.toggle[context];
    }

    /** Used to filter datatable params */
    filterParams: Object;

    /** patient referrals */
    referrals: any[];

    /** HIe referral statuses */
    statusFilters: Array<any> = [
        {
            display: 'Outbound',
            filter: {
                referral_type: 'OUTBOUND',
            },
            active: true,
        },
        {
            display: 'Inbound',
            filter: {
                referral_type: 'INBOUND',
            },
        },
    ];

    /**
     * Service Request Id
     */
    serviceRequestId: string;

    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;

    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;

    // @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     * @param transition - Connects to the transition service
     * @param $state - Connects to the state service
     * @param patientService Access instance of the patient service
     * @param errorHandler - Connects to the error handler service
     * @param swalTargets - Connects to the sweetalert service
     * @param dataLayer - Connects to the datalayer service
     *
     */
    constructor(
        protected toastrService: NbToastrService,
        public transition: Transition,
        public $state: StateService,
        private errorHandler: ErrorHandlerService,
        public patientService: PatientService,
        public readonly swalTargets: SwalPortalTargets,
        private dataLayer: SilStoresService,
        protected toastService: NbToastrService,
        public visitService: VisitService,
        public uiglobals: UIRouterGlobals
    ) {}

    /**
     * Contains visit data
     */
    visit: any;
    /**
     * Contains visit Id
     */
    visitId: string;

    /**
     * Used to determine the duration of a toast
     */
    toastTime: number = 5000;

    /**
     * Contains visit data
     */
    @Input() visitObservable: any;

    /**
     * sets the filter used to query for data in the datatable
     * @param event contains the params used in the datatable
     */
    setFilter(event) {
        this.queryArg = event;
    }

    /** Observable that waits for patient visit data to be defined */
    visitPatientObservable() {
        this.visitService.visitPatientDataEmitter.subscribe(patient => {
            this.patient = patient;
            this.filterParams = {
                ...this.filterParams,
                patient: this.patient?.id,
            };
        });
    }

    /**
     * Used to set the form options
     * @param formOptions
     */
    getFormOptions(formOptions) {
        this.formOptions = formOptions;
    }

    /**
     * Used to submit the referral form
     * @param referral
     */
    submitReferral(model) {
        const serviceRequest = this.visit?.service_requests[0];
        this.loading = true;
        this.submitted = true;
        const referralPayload: any = {
            clinical_service_request_id: serviceRequest?.id,
            reason: model?.description,
            clinical_history: '',
            referral_type: model?.referral_type,
            referral_date: new Date().toISOString().split('T')[0],
            investigation_results: '',
            diagnosis: model?.diagnosis?.display_name,
            urgency: model?.priority,
            patient: this.patient?.id,
            referral_from: this.visit?.organisation,
            referral_to: model?.facility?.id || this.visit?.organisation,
            service_request: serviceRequest?.id,
            referral_to_branch:
                model?.facility?.org_units[0]?.id || this.visit?.branch_id,
        };
        const baseModel = Object.assign({}, referralPayload);

        this.dataLayer.create('hie-referrals', baseModel).subscribe({
            next: this.handleHieReferral,
            error: this.handleErrorFxn,
        });
    }

    handleHieReferral = (data: any) => {
        const msg = `${data?.diagnosis} referral added`;
        this.showToast('bottom-right', 'success', 'Successfully', msg);
        this.loading = false;
        this.formOptions.resetModel();
        this.toggleModal('add-referral-modal');
        this.$state.go('app.advantage.visits.detail.exam.referrals', {
            id: this.visitId,
        });
    };
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

    /** when component mounts */
    ngOnInit() {
        this.visitId = this.uiglobals.params.id;

        this.visitPatientObservable();
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
        // Filter params
        this.filterParams = {
            page_size: 10,
            patient: this.patient?.id,
            visit_id: this.visitId,
        };

        // Table headers
        this.tableHeader = [
            { text: 'Diagnosis' },
            { text: 'Referred To' },
            { text: 'Referred From' },
            { text: 'Action' },
        ];

        // Table rows
        this.rows = [
            {
                nested: [
                    {
                        label: 'Diagnosis',
                        type: 'string',
                        value: 'diagnosis',
                    },
                    {
                        label: 'Added On',
                        value: 'created',
                        type: 'date',
                    },
                ],
            },
            {
                key: 'referred_to_facility_name',
                value: 'referred_to_facility_name',
                type: 'string',
            },
            {
                key: 'referred_from_facility_name',
                value: 'referred_from_facility_name',
                type: 'string',
            },
        ];

        // View Report Action button with quick patch action from sil.datatable
        this.actions = this['actions'] = [
            {
                btnText: 'View',
                status: 'primary',
                action: 'custom',
            },
        ];

        /** Resolved observable from the state */
        this.visitObservable.subscribe({
            next: (response: any) => {
                this.visit = response;
                this.visitService.setVisitData(this.visit);
            },
            error: this.handleErrorFxn,
        });
    }
}

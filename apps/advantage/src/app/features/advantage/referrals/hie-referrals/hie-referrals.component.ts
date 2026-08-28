import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { StateService, Transition } from '@uirouter/angular';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { PatientService } from '../../patients/patient.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';

/**
 * Component selector and template url
 */
@Component({
    selector: 'sil-hie-referrals',
    templateUrl: './hie-referrals.component.html',
    styleUrls: ['./hie-referrals.component.scss'],
    standalone: false,
})

/**
 * Class that defines referrals list controls, methods and lifecycle hooks
 */
export class HieReferralsComponent implements OnInit {
    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

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

    /** view referral list post screening form */
    viewReferralForm($event) {
        this.serviceRequestId = $event?.node?.id;

        this.getVisitPatient($event?.node?.patientID);
    }

    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

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
        private dataLayer: SilStoresService
    ) {}

    /** Get the patient details from the clinical Id */
    getVisitPatient(clinical_id) {
        this.dataLayer
            .list('patients', { clinical_id: clinical_id })
            .subscribe({
                next: response => this.responseFunction(response),
                error: err => {
                    this.errorHandler.handleError(err, this);
                },
            });
    }

    /**
     * Function used to handle the next callback
     * @param response server response
     */
    responseFunction(response) {
        if (response?.results[0]?.id) {
            this.$state.go(
                'app.advantage.patients.detail.post-referral',
                {
                    id: response?.results[0]?.id,
                    serviceRequestId: this.serviceRequestId,
                },
                { reload: true }
            );
        }
        return;
    }

    /** when component mounts */
    ngOnInit() {
        // Filter params
        this.filterParams = {};

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
                type: 'string',
                value: 'referred_to_facility_name',
            },
            {
                key: 'referred_from_facility_name',
                type: 'string',
                value: 'referred_from_facility_name',
            },
        ];

        // View Report Action button with quick patch action from sil.datatable
        this.actions = this['actions'] = [
            {
                btnText: 'View Referral Form',
                status: 'primary',
                action: 'custom',
                modalConf: {
                    customFxn: true,
                },
            },
        ];
    }
}

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/core';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { PatientService } from '../patient.service';

@Component({
    selector: 'patient-referrals',
    templateUrl: './patient-referrals.component.html',
    styleUrls: ['./patient-referrals.component.scss'],
    standalone: false,
})
export class PatientReferralsComponent implements OnInit {
    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /** patient referrals */
    referrals: any[];

    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;

    /**
     * Component loader for the patient observable
     */
    isPatientObservableLoaded: boolean = false;

    /**
     * Defines default filter params
     */
    filterParams: any;

    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Contains the observable resolved from the state service
     */
    @Input() patientObservable: any;

    /**
     * Contains patient information
     */
    patient: any;

    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     * @param dataLayer - Connects to the datalayer service
     * @param transition - Connects to the transition service
     * @param $state - Connects to the state service
     * @param uiglobals - Connects to the uiglobals service
     * @param errorHandler - Connects to the error handler service
     * @param swalTargets - Connects to the sweetalert service
     */
    constructor(
        protected toastrService: NbToastrService,
        public transition: Transition,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        public readonly swalTargets: SwalPortalTargets,
        public patientService: PatientService,
        private errorHandler: ErrorHandlerService
    ) {}

    getPatientInfo() {
        /** Resolved observable from the state */
        this.patientObservable.subscribe(
            (response: any) => {
                this.patient = response;
                this.filterParams = {
                    patientID: this.patient.clinical_id,
                };
                this.isPatientObservableLoaded = true;
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }

    /**
     * view post screening referral report
     * @param $event row object
     */
    viewPostReferralReport($event) {
        this.$state.transitionTo(
            'app.advantage.patients.detail.post-referral',
            {
                id: this.uiglobals.params.id,
                serviceRequestId: $event?.node?.id,
            }
        );
    }

    /** when component mounts */
    ngOnInit() {
        // Table headers
        this.tableHeader = [
            { text: 'Referred To' },
            { text: 'Referred For' },
            { text: 'Requested On' },
            { text: 'Action' },
        ];

        // Table rows
        this.rows = [
            {
                type: 'mineVal',
                path: 'node.referredTo',
            },
            {
                type: 'mineVal',
                path: 'node.referredFor',
            },
            {
                type: 'mineVal',
                path: 'node.referralDate',
            },
        ];

        // View Action button with quick patch action from sil.datatable
        this.actions = this['actions'] = [
            {
                btnText: 'View',
                status: 'primary',
                action: 'custom',
                modalConf: {
                    customFxn: true,
                },
            },
        ];

        /** fetch referrals */
        this.getPatientInfo();
    }
}

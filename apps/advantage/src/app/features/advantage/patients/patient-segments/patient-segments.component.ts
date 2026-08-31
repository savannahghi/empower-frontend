import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/core';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { PatientService } from '../patient.service';

/**
 * Component that is used to create the Patient Screening Report Page
 *
 *  Component declaration that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'patient-segments',
    templateUrl: './patient-segments.component.html',
    styleUrls: ['./patient-segments.component.scss'],
    standalone: false,
})
export class PatientSegmentsComponent implements OnInit {
    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Used to override default form configurations
     */
    formConfig: { checkExpressionOn: string };

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /** patient segments */
    segments: any[];

    /**
     * Used to display a modal
     */
    showModal = false;

    /**
     * Defines the selector used to access the sil-table component
     * in the template.
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;

    /**
     * Used to determine if the content of a form has been submitted
     */
    submitted: boolean = false;

    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;

    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Defines default filter params
     */
    filterParams: any;

    /**
     * Contains the observable resolved from the state service
     */
    @Input() patientObservable: any;

    /**
     * gets the stored selected language
     */
    selectedLanguage: string = this.cookieService.getLanguageCookie();

    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
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
        private errorHandler: ErrorHandlerService,
        public readonly swalTargets: SwalPortalTargets,
        public translate: TranslateService,
        public cookieService: Cookies,
        public patientService: PatientService
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    /**
     * Defines person data
     */
    person: any = {
        id: '',
        name: '',
    };

    getPatientInfo() {
        /** Resolved observable from the state */
        this.patientObservable.subscribe(
            (response: any) => {
                this.person = {
                    ...this.person,
                    id: response?.person?.id,
                    name: response?.person?.first_name,
                };
                this.filterParams = {
                    person: this.person?.id,
                };
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }

    /**
     * Used to submit member to segment
     * @param model - used to submit member to segment
     */
    addMemberToSegment(model) {
        model.person = this.person.id;
        this.patientService.addMemberToSegment(model, this).subscribe({
            next: () => {
                this.loading = false;
                this.siltable?.getData();
            },
        });
        this.showModal = false;
    }

    /**
     * Used to toggle the modal
     */
    toggleModal() {
        this.showModal = !this.showModal;
    }

    viewSegment($event) {
        const patientId = this.uiglobals.params.id;
        this.$state.transitionTo(
            'app.advantage.patients.detail.segments.messages',
            {
                id: patientId,
                segment_id: $event?.segment?.id,
                member: $event?.id,
                segment: $event?.segment?.name?.replace(/ /g, '_'),
                name: this.person?.name,
            },
            { reload: true }
        );
    }

    /** when component mounts */
    ngOnInit() {
        /** get patient info */
        this.getPatientInfo();

        // Table headers
        this.tableHeader = [
            { text: 'Segment Name' },
            { text: 'Added On' },
            { text: 'Action' },
        ];

        // Table rows
        this.rows = [
            {
                path: 'segment.name',
                type: 'mineVal',
            },
            {
                key: 'enrolled_at',
                type: 'date',
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

        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }
}

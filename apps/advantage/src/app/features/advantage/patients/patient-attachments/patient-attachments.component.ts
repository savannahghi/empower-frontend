import { Component, OnInit, Input } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PatientService } from '../patient.service';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/core';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import moment from 'moment';
import { listAnimation } from '../../../../shared/animations/list-animations';
import _ from 'underscore';

@Component({
    selector: 'patient-attachments',
    templateUrl: './patient-attachments.component.html',
    styleUrls: ['./patient-attachments.component.scss'],
    animations: [listAnimation],
    standalone: false,
})
export class PatientAttachmentsComponent implements OnInit {
    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    /**
     * Used to override default form configurations
     */
    formConfig: { checkExpressionOn: string };

    /**
     * Defines loading state
     */
    loading: boolean = true;

    /**
     * Defines loading pdf state
     */
    loadingDocument: boolean = true;

    /** patient attachments */
    attachments: any[];

    /** stores an individual attachment */
    attachment: any;
    /**
     * full screen
     */
    fullscreen: boolean = false;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * Contains patient information
     */
    patient: any;
    /**
     * Contains the observable resolved from the state service
     */
    @Input() patientObservable: any;

    /** receives emitted event from sil-document-dialogue to close document dialogue */
    valueEmittedFromChildComponent: string = '';

    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     * @param dataLayer - Connects to the datalayer service
     * @param transition - Connects to the transition service
     * @param $state - Connects to the state service
     * @param uiglobals - Connects to the uiglobals service
     * @param patientService Access instance of the patient service
     * @param errorHandler - Connects to the error handler service
     * @param swalTargets - Connects to the sweetalert service
     */
    constructor(
        protected toastrService: NbToastrService,
        private dataLayer: SilStoresService,
        public transition: Transition,
        public $state: StateService,
        public uiglobals: UIRouterGlobals,
        public patientService: PatientService,
        private errorHandler: ErrorHandlerService,
        public readonly swalTargets: SwalPortalTargets
    ) {}

    /** Observable that waits for patient data to be defined */
    visitPatientObservable() {
        this.patientService.patientDataEmitter.subscribe(patient => {
            this.patient = patient;
        });
    }

    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    previewDoc(attachment) {
        const element = document.getElementById('exampleModal');
        const a = new (window as any).bootstrap.Modal(element);
        a.show();
        this.fullscreen = false;
        this.loadingDocument = true;
        const temp = attachment;
        if (temp && temp?.content_type === 'application/pdf') {
            // fetch pdf url and convert it to a blob
            fetch(`${temp.data}`).then(res => {
                res.blob().then((blob: any) => {
                    const re = URL.createObjectURL(blob);
                    temp.data = re;
                    this.attachment = temp;
                    this.loadingDocument = false;
                    return re;
                });
            });
        } else {
            this.attachment = temp;
            this.loadingDocument = false;
        }
    }

    /** fetch patient's attachments */
    getAttachments() {
        const params = {
            patient: this.uiglobals.params.id,
        };
        this.loading = true;
        this.dataLayer.list('patient-documents', params).subscribe({
            next: (response: any[] | any) => {
                const filteredAttachments = _.filter(
                    response?.results,
                    att =>
                        att.document_status === 'APPROVED' ||
                        att.document_status === 'PENDING'
                );
                const groupedAttachments = _.groupBy(
                    filteredAttachments,
                    'visit_date'
                );
                this.attachments = Object.entries(groupedAttachments);
                this.loading = false;
            },
            error: err => {
                this.loading = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    refreshDocuments(event) {
        this.getAttachments();
        this.valueEmittedFromChildComponent = event;
        const element = document.getElementById('close-modal');
        element.click();
    }
    /**
     * Adds patient's attachments
     */
    addPatientAttachment(postData) {
        this.loading = true;
        const formData = new FormData();
        formData.append('patient', this.uiglobals.params.id);
        formData.append('data', postData.fileEvent);
        formData.append('content_type', postData.fileEvent.type);
        formData.append('size', postData.fileEvent.size);
        formData.append('document_type', postData.document_type);
        formData.append('description', postData.description);
        formData.append('title', postData.title);
        formData.append(
            'visit_date',
            moment(postData.visit_date).format('YYYY-MM-DD')
        );
        this.dataLayer.create('patient-documents', formData).subscribe({
            next: () => {
                const msg = 'Attachment has been added';
                this.showToast(
                    'bottom-right',
                    'success',
                    msg,
                    'Attachment added'
                );
                this.loading = false;
                this.toggleModal('attachment');
                this.getAttachments();
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
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    getPatientInfo() {
        /** Resolved observable from the state */
        this.patientObservable.subscribe(
            (response: any) => {
                this.patientService.setPatient(response);
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }

    /** when component mounts */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'modelChange',
        };
        /** fetch patient infor */
        this.visitPatientObservable();

        /** get patient info */
        this.getPatientInfo();

        /** fetch attachments */
        this.getAttachments();
    }
}

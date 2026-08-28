import {
    Component,
    ViewEncapsulation,
    ElementRef,
    Input,
    Output,
    OnInit,
    EventEmitter,
} from '@angular/core';
import { SilStoresService } from '../sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../sil-http-services/error-handler';
import { UIRouterGlobals } from '@uirouter/core';

import moment from 'moment';

@Component({
    selector: 'sil-document-dialogue',
    templateUrl: './sil-document-dialogue.component.html',
    styleUrls: ['./sil-document-dialogue.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class SilDocumentDialogueComponent implements OnInit {
    /**
     * Used to determine if the dialog has been toggled
     */
    @Output() setVisitPatientObservable = new EventEmitter<any>();

    /** event emitter to listen to patient info */
    @Output() setPatientInfo = new EventEmitter<any>();

    /** event emitter to refresh documents list and close dialogue */
    @Output() refreshDocumentList: EventEmitter<any> = new EventEmitter<any>();

    /** stores patient details */
    @Input() patient: any;

    /** stores attachment details */
    @Input() attachment: any;
    /** stores fileURL details */
    @Input() fileURL: any;

    /** stores credit note details */
    @Input() creditnote: any;

    /** receives patient observable */
    @Input() patientObservable?: any;

    /**
     * Defines loading state
     */
    loading: boolean = false;

    /**
     * Defines loading pdf state
     */
    @Input() loadingDocument: boolean = true;

    /** model for rejection reason */
    rejectionReason: string = '';

    /** diplays error if */
    isRejectionReason: boolean = false;

    /** determines if document is being rejected */
    rejected: boolean = false;

    /** stores rejected attachment object */
    rejectedAttachment: any;

    /**
     * full screen
     */
    fullscreen: boolean;

    /** holds HTML element */
    private element: any;
    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    /** is success  */
    isSuccess: boolean = false;

    /** is reuploading */
    reuploadingComplete: boolean = false;

    reUploading: boolean = false;
    /**
     * Used to override default form configurations
     */
    formConfig: { checkExpressionOn: string };

    /**
     * Time used to show a toast
     */
    toastTime = 7000;

    /** is work list state*/
    isWorklist: boolean = false;

    /**
     * Component constructor
     * @param dataLayer - Connects to the datalayer service
     * @param errorHandler - Connects to the error handler service
     */
    /**
     *
     * @param el - holds instance of element
     * @param dataLayer - Connects to the datalayer service
     * @param errorHandler - Connects to the error handler service
     */
    constructor(
        private el: ElementRef,
        private dataLayer: SilStoresService,
        public uiglobals: UIRouterGlobals,
        protected toastrService: NbToastrService,
        private errorHandler: ErrorHandlerService
    ) {
        this.element = el.nativeElement;
    }

    /**
     * closes custom bootstrap modal
     */
    closeModal() {
        const element = document.getElementById('exampleModal');
        const a = new (window as any).bootstrap.Modal(element);
        const modal = document.getElementById('document_modal');
        modal.classList.remove('modal-fullscreen');
        a.hide();
        a.dispose();
        this.fullscreen = false;
        this.rejected = false;
        this.isRejectionReason = false;
        this.rejectionReason = '';
        this.loading = false;
    }

    /**
     * previews document on a new tab
     * @param data prev
     */
    previewDocument(data) {
        const link = document.createElement('a');
        link.setAttribute('download', data.title);
        link.setAttribute('target', '_blank');
        link.href = data['data'];
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    getPatientInfo() {
        this.setPatientInfo.emit();
    }

    visitPatientObservable() {
        this.setVisitPatientObservable.emit(event);
    }

    /**
     * toggles modal to fullscreen
     */
    toggleFullScreen() {
        const modal = document.getElementById('document_modal');
        this.fullscreen = !this.fullscreen;
        this.fullscreen
            ? modal.classList.add('modal-fullscreen')
            : modal.classList.remove('modal-fullscreen');
    }

    /** patch request to update file number */
    editDocument(attachment?) {
        return attachment;
    }

    /** opens rejects reason field */
    openRejectReasonField() {
        this.rejected = true;
    }

    /** cancel rejects document */
    cancelRejectDocument() {
        this.rejected = false;
        this.loading = false;
        this.isRejectionReason = false;
        this.rejectionReason = '';
    }

    /** open modal reupload documents/attachments */
    toggleModal(context, attachment?) {
        this.formConfig = {
            checkExpressionOn: 'modelChange',
        };
        const element = document.getElementById('close-modal');
        element.click();
        this.toggle[context] = !this.toggle[context];
        this.rejectedAttachment = attachment;
        if (!attachment) {
            this.rejectedAttachment = null;
        }
    }

    /** rejects document */
    rejectDocument(attachment?) {
        if (this.rejectionReason.trim().length === 0) {
            // validate rejection reason is given
            this.isRejectionReason = true;
            return;
        } else {
            // if reason is given make rejection requestion
            this.isRejectionReason = false;
            this.loading = true;
            this.isSuccess = false;
            const params = attachment.id;
            let status = null;
            if (attachment.document_status === 'PENDING') {
                status = 'REJECTED';
            }
            const formData = new FormData();
            formData.append('document_status', status);
            formData.append('rejection_reason', this.rejectionReason);
            this.showProcessingModal();
            this.dataLayer
                .update('patient-documents', params, formData)
                .subscribe({
                    next: () => {
                        this.loading = false;
                        this.isSuccess = true;
                        this.isSuccess = true;
                        this.rejectionReason = '';
                        this.refreshDocumentList.emit(
                            'Document has been rejected'
                        );
                    },
                    error: err => {
                        this.loading = false;
                        this.errorHandler.handleError(err, this);
                    },
                });
        }
    }

    /** approves document */
    approveDocument(attachment?) {
        this.loading = true;
        this.isSuccess = false;
        const params = attachment.id;
        let status = null;
        if (attachment.document_status === 'PENDING') {
            status = 'APPROVED';
        }
        const formData = new FormData();
        formData.append('document_status', status);
        this.dataLayer.update('patient-documents', params, formData).subscribe({
            next: () => {
                this.loading = false;
                this.isSuccess = true;
                this.refreshDocumentList.emit('Document has been approved');
            },
            error: err => {
                this.loading = false;
                this.isSuccess = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /** archives document and reuploads patient document*/
    reuploadPatientDocument(postData) {
        this.reUploading = true;
        this.reuploadingComplete = false;
        const params = this.rejectedAttachment.id;
        let status = null;
        if (this.rejectedAttachment.document_status === 'REJECTED') {
            status = 'ARCHIVED';
        }
        const formData = new FormData();
        formData.append('document_status', status);
        this.dataLayer.update('patient-documents', params, formData).subscribe({
            next: () => {
                this.uploadDocument(postData);
                this.toggleModal('attachment');
            },
            error: err => {
                this.reUploading = false;
                this.isSuccess = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * Adds patient's attachments
     */
    uploadDocument(postData) {
        this.reUploading = true;
        const formData = new FormData();
        formData.append('patient', this.rejectedAttachment.patient);
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
        this.showProcessingModal();
        this.dataLayer.create('patient-documents', formData).subscribe({
            next: () => {
                this.reUploading = false;
                this.reuploadingComplete = true;
                this.closeModal();
                this.refreshDocumentList.emit('Document has been uploaded');
            },
            error: err => {
                this.reUploading = false;
                this.isSuccess = false;
                this.reuploadingComplete = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    /**
     * show confirm modal
     */
    showProcessingModal() {
        const element = document.getElementById('confirmModal');
        const a = new (window as any).bootstrap.Modal(element);
        a.show();
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

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'modelChange',
        };
        this.fullscreen = false;
        this.isWorklist = this.uiglobals?.current?.name.includes('worklist');
    }
}

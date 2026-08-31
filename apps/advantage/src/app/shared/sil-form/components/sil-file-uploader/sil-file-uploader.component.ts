import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    ViewChild,
} from '@angular/core';
import { UIRouterGlobals, StateService } from '@uirouter/angular';
import { read, utils } from 'xlsx';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import {
    NbToastrService,
    NbStepChangeEvent,
    NbStepperComponent,
} from '@nebular/theme';
import { StepperService } from '../../../../shared/component-services/stepper.service';

@Component({
    selector: 'sil-file-uploader',
    templateUrl: './sil-file-uploader.component.html',
    styleUrl: './sil-file-uploader.component.scss',
    standalone: false,
})
export class SilFileUploaderComponent implements OnInit {
    /**
     * event emitter to indicate upload is complete
     */
    @Output() uploadComplete: EventEmitter<any> = new EventEmitter<any>();

    /**
     * allow upload of more than a single file
     */
    @Input() allowMultiple: boolean = false;

    /**
     * list of accepted file types
     */
    @Input() acceptedFileTypes: string = '';

    /**
     * check whether file validation is required before upload
     */
    @Input() validateAgainstTemplate: boolean = false;

    /**
     * Saves the file path of the Excel template
     */
    @Input() templateFilePath: string = '';

    /**
     * check whether file preview is required before upload
     */
    @Input() requirePreview: boolean = false;

    /**
     *
     * Saves the store name to upload the file to the API end point
     */
    @Input() store: string = '';

    /**
     * Saves the redirect URL after file upload
     */
    @Input() redirectURL: string;

    /**
     * Determines whether to include the previous step button
     */
    @Input() previousStepBtn: boolean = false;

    /** Mapings - field:header */
    @Input() fieldMappings = {};

    /** Mapings - field:header */
    @Input() nestedPrimaryKey: string;

    @Input() nestedPostFixURL: string;

    /**
     * stores the uploaded file
     */
    file: any;

    /**
     * stores the file upload instance
     */
    uploadedFileInstance: any;

    /**
     * error message
     */
    errorMessage: any;

    /**
     * file reader
     */
    reader: any;

    /**
     * stores the preview data from excel file
     */
    previewData: any[];

    /**
     * stores the preview data as rows
     */
    tableData: any[] = [];

    /**
     * defines the loading state
     */
    loading: boolean = false;

    /**
     * stores template sheet column headers
     */
    templateColumnHeaders: any[];

    /**
     * contains missing header
     */
    missingHeaders: any[];

    /**
     * stepper
     */
    stepper: any;

    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        public toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public stepperService: StepperService
    ) {}

    @ViewChild('stepper', { static: false }) set content(
        content: NbStepperComponent
    ) {
        // initially setter gets called with undefined
        this.stepper = content;
    }

    /**
     * method used to display a toastr
     */
    showToast(position, status, title, message) {
        const duration = 7000;
        this.toastrService.show(message, title, {
            position,
            status,
            duration,
        });
    }

    /**
     * handle the file
     */
    handleFile(event) {
        const files = event.target.files;
        const uploadedFile = files[0];
        const supportedFormat = this.acceptedFileTypes
            .split(',')
            .map(type => type.trim())
            .includes(uploadedFile.type.trim());
        if (!supportedFormat) {
            this.errorMessage = 'Unsupported file format';
        } else {
            this.file = uploadedFile;
            this.reader = new FileReader();
            this.reader.readAsArrayBuffer(this.file);

            /** content extraction for excel sheets */
            if (
                this.file.type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                this.file.type === 'application/vnd.ms-excel'
            ) {
                /** parse file contents */
                this.reader.onload = e => {
                    const fileContent = e.target.result;

                    const wb = read(fileContent, { type: 'array' });
                    /**
                     * get first worksheet
                     */
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];

                    /**
                     * get the column names--pending for now
                     */
                    this.extractPreviewData(ws);

                    /**
                     * ensure the uploaded file matches the given template
                     */
                    this.validateColumnHeaders(
                        this.templateColumnHeaders,
                        this.previewData[0]
                    );
                };
            }
        }
    }

    /**
     * extract preview data
     */
    extractPreviewData(ws) {
        this.previewData = [];

        /**
         * format rowData as raw rows rather than key-value pairs
         */
        const rowData: any[][] = utils.sheet_to_json(ws, { header: 1 });
        this.previewData = rowData;
    }

    /**
     * extract column headers from template  sheet
     */
    async extractTemplateHeaders() {
        try {
            const response = await fetch(this.templateFilePath);

            const arrayBuffer = await response.arrayBuffer();

            const workbook = read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const columnsRange = utils.decode_range(worksheet['!ref']).e.c + 1;

            const headers: string[] = [];

            for (let i = 0; i < columnsRange; i++) {
                const cellAddress = utils.encode_col(i) + '1';
                const cell = worksheet[cellAddress];
                headers.push(cell?.v);
            }

            this.templateColumnHeaders = headers;
        } catch (error) {
            this.errorHandler.handleError(
                'Sorry, the system encountered some issues extracting headers:',
                error
            );
        }
    }

    /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
    formatBytes(bytes, decimals?) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const dp = decimals <= 0 ? 0 : decimals || 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dp)) + ' ' + sizes[i]
        );
    }

    /**
     * validates that the the uploaded file has column
     * headers matching those of template
     */
    validateColumnHeaders(
        requiredHeaders: string[],
        uploadedFileHeaders: string[]
    ): void {
        this.missingHeaders = requiredHeaders?.filter(
            header => !uploadedFileHeaders?.includes(header)
        );
    }

    /**
     * upload file
     */
    uploadFile() {
        this.loading = true;

        /**
         * create formdata object to send data to the backend
         */
        const formData = new FormData();
        formData.append('file', this.file);
        for (const [key, value] of Object.entries(this.fieldMappings)) {
            formData.append(`${key}`, `${value}`);
        }

        if (this.nestedPrimaryKey) {
            const id = this.nestedPrimaryKey;
            const uploadStore = this.dataLayer.createNested(
                this.store,
                this.nestedPostFixURL,
                id,
                formData
            );
            this.processUpload(uploadStore);
        } else {
            const uploadStore = this.dataLayer.create(this.store, formData);
            this.processUpload(uploadStore);
        }
    }

    processUpload(uploadStore) {
        uploadStore.subscribe({
            next: file => {
                const msg = 'File has been uploaded successfully';
                this.showToast('bottom-right', 'success', 'File uploaded', msg);
                this.loading = false;
                this.uploadComplete.emit(file);

                if (this.redirectURL) {
                    this.$state.go(this.redirectURL);
                }
            },
            error: err => {
                this.loading = false;
                this.errorHandler.handleError(err, this);
            },
        });
    }

    handleStepChange(e: NbStepChangeEvent): void {
        this.stepperService.handleStepChange(e, this.stepper);
        const params = this.uiglobals.params;
        (params.step = e.index),
            this.$state.transitionTo(this.uiglobals.current.name, params, {
                reload: false,
                notify: false,
            });
    }

    previousStep() {
        const params = this.uiglobals.params;
        this.stepperService.previousStep(this.stepper, params);
    }

    clearFile() {
        this.file = null;
        this.uploadedFileInstance = null;
        this.errorMessage = null;
        this.previewData = [];
    }

    /**
     * download template excel sheet for bulk uploads
     */
    downloadTemplateFile() {
        const a = document.createElement('a');
        a.href = '../../../../../' + this.templateFilePath;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    ngOnInit() {
        this.extractTemplateHeaders();
    }
}

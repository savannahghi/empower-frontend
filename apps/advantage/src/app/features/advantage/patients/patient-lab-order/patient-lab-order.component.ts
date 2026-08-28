import { Component, OnInit } from '@angular/core';
import {
    NbSpinnerModule,
    NbToastrService,
    NbGlobalPosition,
} from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { SectionTitleComponent } from '../../visits/visit-patient-screening/screening-report/section-title/section-title.component';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../../@theme/theme.module';
import { NbButtonModule, NbCardModule, NbToastrModule } from '@nebular/theme';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkikaLayoutModule } from '../../../../shared/sil-layout/sil-layout.module';
import { SkikaFormModule } from '../../../../shared/sil-form/sil-form.module';
import { NgPipesModule } from 'ngx-pipes';
import { NbTagModule, NbTooltipModule } from '@nebular/theme';
import { StatusColorPipe } from '../../../../@theme/pipes';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
import {
    testResults,
    ScreeningOption,
} from '../../visits/visit-patient-screening/screening-record/screening-options';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'ngx-patient-lab-order',
    templateUrl: './patient-lab-order.component.html',
    styleUrls: ['./patient-lab-order.component.scss'],
    imports: [
        SectionTitleComponent,
        CommonModule,
        ThemeModule,
        NbButtonModule,
        NbCardModule,
        NbToastrModule,
        NgxSkeletonLoaderModule,
        SkikaLayoutModule,
        SkikaFormModule,
        NgPipesModule,
        NbTagModule,
        NbTooltipModule,
        StatusColorPipe,
        NgxExtendedPdfViewerModule,
        NbSpinnerModule,
    ],
})
/**
 * PatientLabOrderComponent component class
 * Implements OnInit when intializing the class
 */
export class PatientLabOrderComponent implements OnInit {
    /**
     * The component constructor
     * @param uiglobals instance of UIRouterGlobals
     * @param toastrService Connects to the toast service
     * @param dataLayer Service for making REST API calls
     * @param errorHandler Service for handling errors
     * @param stateService UIRouter StateService for state transitions
     * @param transition Current transition information
     * @param analytics Service for tracking analytics events
     */
    constructor(
        public uiglobals: UIRouterGlobals,
        protected toastrService: NbToastrService,
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        public stateService: StateService,
        private transition: Transition,
        public analytics: AnalyticsService
    ) {
        // Store the previous state information when component is created
        this.previousState = this.transition.from();
    }
    /**
     * Used to display different toggle modals
     * information
     */
    toggle: Record<string, boolean> = {};
    /**
     * Boolean used to hide add attachment button
     */
    hideAddAttachmentButton: boolean = true;
    /**
     * Stores the previous state information for back navigation
     */
    previousState: any;
    /**
     * Toggles the modal
     */
    toggleModal(context: string) {
        this.toggle[context] = !this.toggle[context];
    }
    /**
     * Used to display the loader when data is being submitted
     */
    loading: boolean = false;

    /**
     * Boolean used to define if the form data is being submitted
     */
    savingResult: boolean = false;

    /**
     * indicates loading attachment
     * */
    loadingAttachments: { [key: string]: boolean } = {};

    /**
     * Used to store the selected result item
     * */
    selectedResultItem: any;

    /**
     * Used to store the encounter details
     */
    encounterId: any;

    /**
     * use to load when upload file
     */
    uploadingFile: boolean = false;

    /**
     *
     * Test results of the birads type of tests (Ultrasound, Mammogram, MRI)
     */
    testResults: { [key: string]: ScreeningOption[] } = testResults;

    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted: boolean = false;
    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Stores the form model data
     */
    model: Object = {};

    /**
     * Lab Order details
     */
    labOrderDetails: any;

    /**
     * Contains id, name and url returned from server after file upload
     */
    mediaData: any[] = [];

    /**
     * holds the form data
     */
    formData: any;

    /**
     *  detectModelChange
     * fetches model data from formly
     */
    detectModelChange(model: any) {
        this.formData = model;
        return this.formData;
    }

    /**
     * Function used to get the referral details
     */

    get submitButtonLabel() {
        return this.uploadingFile ? 'Uploading File' : 'Add Result';
    }

    /**
     * Fetches lab order details
     */
    fetchLabOrderDetails() {
        if (this.uiglobals.params.serviceRequestId) {
            this.loading = true;

            this.dataLayer
                .get(
                    'lab-orders',
                    `/${this.uiglobals.params.serviceRequestId}`,
                    {}
                )
                .subscribe({
                    next: response => {
                        this.labOrderDetails = response;
                        this.loading = false;
                        this.encounterId = this.labOrderDetails?.encounter?.id;
                    },
                    error: this.errorHandlerFxn,
                });
        }
    }

    /** Deals with error */
    errorHandlerFxn = (error: any) => {
        this.errorHandler.handleError(error, this, 'clinical');
        this.loading = false;
    };

    /**
     * Fetches attachments for a lab order
     * @param serviceRequestId The service request ID
     * @param encounterId The encounter ID
     * @param resultId The result ID
     */
    fetchLabOrderAttachments(
        serviceRequestId: string,
        encounterId: string,
        resultId: string
    ) {
        this.loadingAttachments[resultId] = true;

        const params = {
            serviceRequestID: serviceRequestId,
            encounterID: encounterId,
            limit: 10,
        };

        this.dataLayer.list('upload', params).subscribe({
            next: (response: any) => {
                this.loadingAttachments[resultId] = false;
                if (response?.edges?.[0]?.node?.mediaLink) {
                    const mediaLink = response.edges[0].node.mediaLink;
                    window.open(mediaLink, '_blank');
                }
            },
            error: error => {
                this.errorHandler.handleError(error, this, 'clinical');
                this.loadingAttachments[resultId] = false;
            },
        });
    }

    /**
     * Method used to display a toast error message
     */
    showToastError(
        position: NbGlobalPosition,
        status: string,
        msg: string,
        context: string
    ) {
        const duration = 7000;
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Submit test
     */
    async submitTest() {
        const model = this.formData;
        try {
            if (model.attachment) {
                await this.uploadFile(model.file);
            }
            await this.recordTestResults(model);
        } catch (err) {
            this.errorHandler.handleError(err, this);
            this.errorHandler.handleError(err, this, 'clinical');
        }
    }

    /**
     * Function used to upload file to server
     * @param file file to be uploaded
     */
    uploadFile(file: File): Promise<void> {
        return new Promise((resolve, reject) => {
            const model = this.formData;
            const formData = new FormData();
            formData.append('encounterID', this.encounterId);
            formData.append(
                'serviceRequestID',
                this.uiglobals.params.serviceRequestId
            );
            formData.append('file', file);
            this.uploadingFile = true;
            this.mediaData = [];

            this.dataLayer.create('upload', formData).subscribe({
                next: response => {
                    const data = (response as any[])[0];
                    this.mediaData.push({
                        id: data?.id,
                        name: data?.name,
                        mediaLink: data?.mediaLink,
                    });
                    this.analytics.logEvent('diagnostic_result_upload_created');
                    this.uploadingFile = false;
                    this.savingResult = true;
                    resolve();
                },
                error: err => {
                    this.uploadingFile = false;
                    this.errorHandler.handleError(err, this);
                    reject(err);
                },
            });
            model.attachment = null;
        });
    }

    /**
     * Record test results
     */
    recordTestResults(model?: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this.loading = true;
            const formData = model ?? this.formData;

            const payload = {
                entry: {
                    encounterID: this.labOrderDetails.encounter.id,
                    findings: formData.selected_result,
                    note: formData.remarks,
                    ...(this.mediaData.length > 0
                        ? { media: this.mediaData }
                        : {}),
                },
                serviceRequestID: this.uiglobals.params.serviceRequestId,
            };

            this.dataLayer.create('test-results', payload).subscribe({
                next: () => {
                    this.showToast(
                        'bottom-right' as NbGlobalPosition,
                        'success',
                        'Success',
                        'Test results recorded successfully'
                    );
                    this.loading = false;
                    this.fetchLabOrderDetails();
                    this.analytics.logEvent('diagnostic_result_created');
                    this.toggleModal('addResult');
                    this.mediaData = [];
                    this.formData = {};
                    resolve();
                },
                error: error => {
                    this.errorHandler.handleError(error, this, 'clinical');
                    this.loading = false;
                    reject(error);
                },
            });
        });
    }

    /**
     * Handles navigation back to the previous screen based on the user's journey
     */
    navigateBack() {
        if (this.previousState && this.previousState.name) {
            this.stateService.go(
                this.previousState.name,
                this.previousState.params
            );
        } else {
            this.stateService.go('app.advantage.lab_orders');
        }
    }

    /**
     * Get test results based on the order code
     */
    getTestResultsByCode(code: string): ScreeningOption[] {
        return this.testResults[code] || [];
    }

    /**
     * Used to display a toast using the nebular toast service
     * @param position
     * @param status
     * @param msg
     * @param context
     */
    showToast(
        position: NbGlobalPosition,
        status: string,
        msg: string,
        context: string
    ) {
        const duration = 7000;
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Component lifecycle used after the component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
        this.fetchLabOrderDetails();
    }
}

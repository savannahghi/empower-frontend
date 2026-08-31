import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbSpinnerModule,
    NbToastrService,
} from '@nebular/theme';
import { StateService, Transition } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { ThemeModule } from '../../../../@theme/theme.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkikaLayoutModule } from '../../../../shared/sil-layout/sil-layout.module';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: 'ngx-examinations-details',
    templateUrl: './examinations-details.component.html',
    styleUrls: ['./examinations-details.component.scss'],
    imports: [
        CommonModule,
        ThemeModule,
        NbButtonModule,
        NbCardModule,
        NbSpinnerModule,
        NbIconModule,
        NgxSkeletonLoaderModule,
        SkikaLayoutModule,
        ReactiveFormsModule,
        NgSelectModule,
    ],
})
export class ExaminationsDetailsComponent implements OnInit {
    /**
     * Observation ID from the route parameters
     */
    observationId: string;

    /**
     * Examination type from the route parameters
     */
    examinationType: string;

    /**
     * Time recorded from the route parameters
     */
    timeRecorded: string;

    /**
     * Usage context from the route parameters
     */
    usageContext: string;

    /**
     * Patient ID from the route parameters
     */
    patientId: string;

    /**
     * Observation data from the route parameters
     */
    observationData: any;

    /**
     * Loading state for data fetching
     */
    loading: boolean = false;

    /**
     * Stores the previous state information for back navigation
     */
    previousState: any;

    /**
     * Examination details data
     */
    examinationDetails: any = {};

    /**
     * Used to display different toggle modals
     */
    toggle: Object = {};

    /**
     * Selected examination for edit/delete operations
     */
    selectedExamination: any;

    /**
     * Form group for examination edit modal
     */
    editExaminationForm: FormGroup;

    /**
     * Current preview result value
     */
    previewResult: string;

    /**
     * Options for examination results
     */
    resultOptions: any[] = [];

    /**
     * Time used to show a toast
     */
    toastTime = 5000;

    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     * @param dataLayer - Connects to the datalayer service
     * @param $state - Connects to the state service
     * @param errorHandler - Connects to the error handler service
     * @param transition - Connects to the transition service
     * @param fb - Form builder for reactive forms
     */
    constructor(
        public toastrService: NbToastrService,
        public dataLayer: SilStoresService,
        public $state: StateService,
        public errorHandler: ErrorHandlerService,
        private transition: Transition,
        private fb: FormBuilder
    ) {
        // Store the previous state information when component is created
        this.previousState = this.transition.from();

        // Get route parameters
        const params = this.transition.params();
        this.observationId = params.observationId;
        this.examinationType = params.examinationType;
        this.timeRecorded = params.timeRecorded;
        this.patientId = params.patientId;
        this.observationData = params.observationData;
        this.usageContext = params.usageContext;
    }

    /**
     * Component lifecycle hook that runs after component initialization
     */
    ngOnInit(): void {
        this.editExaminationForm = this.fb.group({
            selectedResult: [null, Validators.required],
        });

        this.resultOptions = this.getResultOptionsForExamination(
            this.usageContext
        );

        if (this.observationData) {
            this.processExaminationData(this.observationData);
        } else if (this.observationId) {
            this.fetchExaminationDetails();
        } else {
            this.toastrService.danger(
                'Missing required examination information',
                'Error'
            );
        }
    }

    /**
     * Fetches examination details from the API
     */
    fetchExaminationDetails(): void {
        this.loading = true;
        this.dataLayer
            .list('observations', {
                id: this.observationId,
                use_context: 'SCREENING_EXAMINATIONS',
            })
            .subscribe({
                next: (response: any) => {
                    this.loading = false;

                    let foundExamination = null;

                    if (response?.edges && response.edges.length > 0) {
                        foundExamination = response.edges.find(edge => {
                            const node = edge.node || edge.Node;
                            return node && node.id === this.observationId;
                        });

                        if (foundExamination) {
                            const nodeData =
                                foundExamination.node || foundExamination.Node;
                            this.processExaminationData(nodeData);
                        } else {
                            this.toastrService.warning(
                                'Specific examination not found.',
                                'Not Found'
                            );
                        }
                    } else if (
                        response?.results &&
                        response.results.length > 0
                    ) {
                        foundExamination = response.results.find(
                            result => result.id === this.observationId
                        );

                        if (foundExamination) {
                            this.processExaminationData(foundExamination);
                        } else {
                            this.toastrService.warning(
                                'Specific examination not found.',
                                'Not Found'
                            );
                        }
                    } else {
                        this.toastrService.warning(
                            'Examination details not found.',
                            'Not Found'
                        );
                    }
                },
                error: err => {
                    this.loading = false;
                    this.errorHandler.handleError(err, this);
                    this.toastrService.danger(
                        'Failed to fetch examination details.',
                        'Error'
                    );
                },
            });
    }

    /**
     * Processes the examination data and organizes it for display
     * @param data The examination data to process
     */
    processExaminationData(data: any): void {
        this.examinationDetails = {
            id: data.id || this.observationId,
            name: data.name || this.examinationType,
            status: data.status || 'Unknown',
            value: data.value || 'Not specified',
            category: data.category || 'Not specified',
            patientId: data.patientID || this.patientId,
            timeRecorded: data.timeRecorded || this.timeRecorded,
            performer: data.performer || null,
            notes: data.notes || 'No notes available',
            components: data.components || [],
            findings: this.extractFindings(data),
        };
    }

    /**
     * Extracts findings from examination data
     * @param data The examination data
     * @returns Array of findings
     */
    extractFindings(data: any): any[] {
        const findings = [];

        if (data.components && Array.isArray(data.components)) {
            data.components.forEach(component => {
                findings.push({
                    name: component.name || 'Unnamed finding',
                    value: component.value || 'Not specified',
                    interpretation: component.interpretation || 'Not specified',
                });
            });
        }

        if (findings.length === 0 && data.interpretation) {
            findings.push({
                name: 'General finding',
                value: data.value || 'Not specified',
                interpretation: data.interpretation,
            });
        }

        return findings;
    }

    /**
     * Navigates back to the previous page
     */
    navigateBack(): void {
        if (this.previousState && this.previousState.name) {
            this.$state.go(this.previousState.name, this.previousState.params);
        } else {
            this.$state.go('app.advantage.screenings.list');
        }
    }

    /**
     * Formats a date string for display
     * @param dateString The date string to format
     * @returns Formatted date string
     */
    formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    }

    /**
     * Toggles the visibility of a modal
     * @param context The modal context to toggle
     */
    toggleModal(context: string): void {
        this.toggle[context] = !this.toggle[context];

        if (context === 'editExamination' && !this.toggle[context]) {
            this.editExaminationForm.reset();
            this.previewResult = null;
        }
    }

    /**
     * Sets the selected examination for edit/delete operations
     * @param examination The examination to select
     */
    setSelectedExamination(examination: any): void {
        this.selectedExamination = examination;

        if (examination.value) {
            const matchingOption = this.resultOptions.find(
                option =>
                    option.value.toLowerCase() ===
                    examination.value.toLowerCase()
            );

            if (matchingOption) {
                this.editExaminationForm.patchValue({
                    selectedResult: matchingOption.value,
                });
            }
        }

        this.toggleModal('editExamination');
    }

    /**
     * Confirms deletion of an examination
     * @param examination The examination to delete
     */
    confirmDeleteExamination(examination: any): void {
        this.selectedExamination = examination;
        this.toggleModal('deleteExamination');
    }

    /**
     * Deletes the selected examination
     */
    deleteExamination(): void {
        if (!this.selectedExamination || !this.selectedExamination.id) {
            this.toastrService.danger(
                'No examination selected for deletion',
                'Error'
            );
            return;
        }

        this.loading = true;
        this.dataLayer
            .remove('observations', `/${this.selectedExamination.id}`)
            .subscribe({
                next: () => {
                    this.loading = false;
                    this.toggleModal('deleteExamination');
                    this.showToast(
                        'top-right',
                        'success',
                        'Examination deleted successfully',
                        'Deleted'
                    );

                    this.navigateBack();
                },
                error: err => {
                    this.loading = false;
                    this.errorHandler.handleError(err, this);
                    this.toastrService.danger(
                        'Failed to delete examination.',
                        'Error'
                    );
                },
            });
    }

    /**
     * Handles change events from the result dropdown
     * @param event The selected result event
     */
    onResultChange(event: any): void {
        if (event && event.value) {
            this.previewResult = event.value;
        }
    }

    /**
     * Updates the examination result with the selected value
     */
    updateExaminationResult(): void {
        const selectedResult = this.editExaminationForm.value.selectedResult;

        if (
            !selectedResult ||
            !this.selectedExamination ||
            !this.selectedExamination.id
        ) {
            this.toastrService.warning(
                'Please select a valid result',
                'Warning'
            );
            return;
        }

        this.loading = true;

        const updateData = {
            value: selectedResult,
        };

        this.dataLayer
            .update(
                'observations',
                `/${this.selectedExamination.id}`,
                updateData,
                null,
                true
            )
            .subscribe({
                next: () => {
                    this.loading = false;
                    this.toggleModal('editExamination');
                    this.showToast(
                        'top-right',
                        'success',
                        'Examination result updated successfully',
                        'Updated'
                    );

                    this.examinationDetails.value = selectedResult;
                    this.examinationDetails.status = 'final';
                },
                error: () => {
                    this.loading = false;
                    this.toastrService.danger(
                        'Failed to update examination result.',
                        'Error'
                    );
                },
            });
    }

    /**
     * Get appropriate result options based on examination name
     * @param examinationName the name of the examination
     * @returns array of result options
     */
    getResultOptionsForExamination(examinationName: string): any[] {
        const defaultOptions = [
            { title: 'Normal', value: 'Normal' },
            { title: 'Abnormal', value: 'Abnormal' },
        ];

        const examinationOptions = {
            breast_cancer_screening: [
                {
                    title: 'Normal',
                    value: 'Normal',
                },
                {
                    title: 'Benign Findings - Not Suspicious For CA',
                    value: 'Benign Findings - Not Suspicious For CA',
                },
                {
                    title: 'Discrete Palpable Mass - Suspicious For CA',
                    value: 'Discrete Palpable Mass - Suspicious For CA',
                },
                {
                    title: 'Blood, Or Serious Nipple Discharge',
                    value: 'Blood, Or Serious Nipple Discharge',
                },
                {
                    title: 'Nipple/Areola Scaliness',
                    value: 'Nipple/Areola Scaliness',
                },
                {
                    title: 'Skin Dimpling Or Retraction',
                    value: 'Skin Dimpling Or Retraction',
                },
                {
                    title: 'Focal Pain Or Tenderness',
                    value: 'Focal Pain Or Tenderness',
                },
                {
                    title: 'Nipple Inversion',
                    value: 'Nipple Inversion',
                },
            ],
            cervical_cancer_screening: [
                {
                    title: 'Negative',
                    value: 'negative',
                },
                {
                    title: 'Positive',
                    value: 'positive',
                },
                {
                    title: 'Suspicious for cancer',
                    value: 'suspicious_for_cancer',
                },
            ],
            prostate_cancer_screening: [
                {
                    title: 'Normal PSA levels (<4ng/ml)',
                    value: 'normal_psa_levels',
                },
                {
                    title: 'Raised PSA levels',
                    value: 'raised_psa_levels',
                },
            ],
        };

        const normalizedName = examinationName
            ?.toLowerCase()
            .replace(/ /g, '_');

        return examinationOptions[normalizedName] || defaultOptions;
    }

    /**
     * Text and colors that are rendered based on the screening results
     */
    pageText: any = {
        breast: {
            normal: {
                label: 'Normal',
                badgeColor: '#83AE04',
                badgeBackgroundColor: '#83AE0426',
            },
            abnormal: {
                label: 'Abnormal',
                badgeColor: '#DA0A15',
                badgeBackgroundColor: '#DA0A1526',
            },
        },
        cervical: {
            negative: {
                label: 'Negative',
                badgeColor: '#83AE04',
                badgeBackgroundColor: '#83AE0426',
            },
            positive: {
                label: 'Positive',
                badgeColor: '#DA0A15',
                badgeBackgroundColor: '#DA0A1526',
            },
            suspicious: {
                label: 'Suspicious for cancer',
                badgeColor: '#FFB573',
                badgeBackgroundColor: '#FCF7E8',
            },
        },
        prostate: {
            normal: {
                label: 'Normal',
                badgeColor: '#83AE04',
                badgeBackgroundColor: '#83AE0426',
            },
            abnormal: {
                label: 'Abnormal',
                badgeColor: '#DA0A15',
                badgeBackgroundColor: '#DA0A1526',
            },
        },
    };

    /**
     * Function used to determine the style properties of the badge
     * @param value Value of the examination result
     * @returns css properties
     */
    getBadgeStyle(value: string): any {
        if (!value) return {};

        const lowerValue = value.toLowerCase();

        let badgeStyle = {
            backgroundColor: '#0095ff26',
            color: '#0095ff',
        };

        if (lowerValue.includes('abnormal')) {
            badgeStyle = {
                backgroundColor: '#DA0A1526',
                color: '#DA0A15',
            };
        } else if (lowerValue.includes('normal')) {
            badgeStyle = {
                backgroundColor: '#83AE0426',
                color: '#83AE04',
            };
        } else if (lowerValue.includes('positive')) {
            badgeStyle = {
                backgroundColor: '#DA0A1526',
                color: '#DA0A15',
            };
        } else if (lowerValue.includes('negative')) {
            badgeStyle = {
                backgroundColor: '#83AE0426',
                color: '#83AE04',
            };
        } else if (lowerValue.includes('suspicious')) {
            badgeStyle = {
                backgroundColor: '#FCF7E8',
                color: '#9E7C15',
            };
        }

        return badgeStyle;
    }

    /**
     * Method used to display a toast
     * @param position position where toast should appear
     * @param status status type of toast
     * @param msg message to display in toast
     * @param context context label for the toast message
     */
    showToast(position, status, msg, context): void {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { UIRouterGlobals } from '@uirouter/angular';
import { NbToastrService } from '@nebular/theme';
import moment from 'moment';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

/**
 * Component that is used to create the Patient Post Screenings Page
 *
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-followup-details',
    templateUrl: './followup-details.component.html',
    styleUrls: ['./followup-details.component.scss'],
    standalone: false,
})
/**
 * Class that creates the Patient Post Screenings component
 */
export class FollowupDetailsComponent implements OnInit {
    /**
     * The component constructor
     * @param uiglobals instance of UIRouterGlobals
     * @param toastService Connects to the toast service
     * @param errorHandler injects instance of errorhandler service
     */
    constructor(
        public uiglobals: UIRouterGlobals,
        private toastrService: NbToastrService,
        private errorHandler: ErrorHandlerService,
        public dataLayer: SilStoresService
    ) {}

    /**
     * Selected scheduled date
     */
    nextDueDate: string = '';
    /**
     * selected return date
     * @param event
     */
    handleNextDueDateChange(event) {
        this.nextDueDate = event;
    }
    /**
     * Stores the minimum date
     */
    min: Object = moment();
    /**
     * Used to display the loader when data is being submitted
     */
    loading: boolean = false;

    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted: boolean = false;
    /**
     * Used to display the loader when data is being submitted
     */
    loading2: boolean = false;

    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted2: boolean = false;
    /**
     * Used to display the loader when data is being submitted
     */
    loading3: boolean = false;

    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted3: boolean = false;
    /**
     * Used to override default form configurations
     */
    formConfig: any;
    /**
     * Boolean used to hide add attachment button
     */
    hideAddAttachmentButton: boolean = true;

    /**
     * Used to display different toggle modals
     * information
     */
    toggle: Object = {};
    /**
     * Toggles the modal
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }
    /**
     * Defines form fetch loading state
     */
    loadingDataFetch: boolean;
    /**
     * Task Completion details
     */
    completeTaskDetails: any;

    /**
     * Unfulfilled Task details
     */
    unfulfilledTaskDetails: any;

    /**
     * Function used to determine style class to be used based on post screening status
     * @param type element to be styled
     * @param status post screening status
     * @returns style class
     */
    statusStyleMapFn(type: string, status: string) {
        const statusMap = {
            card: {
                completed: 'item-card-success',
                cancelled: 'item-card-neutral',
                default: 'item-card-gray',
            },
            image: {
                completed:
                    '../../../../../assets/images/screening-consented.svg',
                cancelled: '../../../../../assets/images/unfulfilled-task.svg',
                default: '../../../../../assets/images/consent-task-grey.svg',
            },
            p: {
                completed: 'success-color',
                cancelled: 'neutral-color',
                default: 'default-color',
            },
        };

        const validStatus = ['completed', 'cancelled'].includes(status)
            ? status
            : 'default';
        return statusMap[type][validStatus];
    }

    /**
     * Function to set Badge Colors
     * @param status status value
     * @returns color code
     */
    setBadgeBackgroundColor(status) {
        const backGroundColors = {
            urgent: '#fce7e8',
            routine: '#f4eae1',
            pending: '#f4eae1',
            requested: '#f4eae1',
            completed: '#e9f1e6',
            cancelled: '#fce7e8',
            default: '#f6f4f9',
        };

        if (!status) {
            return backGroundColors.default;
        }

        const normalizedStatus = status.toLowerCase();

        return backGroundColors[normalizedStatus] || backGroundColors.default;
    }

    /**
     * Function to set Badge Colors
     * @param status status value
     * @returns color code
     */
    setBadgeColor(status) {
        const badgeColors = {
            urgent: '#da0a15',
            routine: '#a5550b',
            pending: '#a5550b',
            requested: '#a5550b',
            completed: '#2d7310',
            cancelled: '#db3737',
            default: '#a6a5a8',
        };

        if (!status) {
            return badgeColors.default;
        }

        const normalizedStatus = status.toLowerCase();

        return badgeColors[normalizedStatus] || badgeColors.default;
    }
    /**
     * Post screening report data
     */
    postScreeningData: any;
    /**
     * Note details
     */
    noteDetails: any;
    /**
     * Submit note
     */
    submitNote(model: any) {
        this.noteDetails = model;
    }
    /**
     * Function used to get the screening report
     */
    fetchReport() {
        this.loadingDataFetch = true;

        const taskId = this.uiglobals.params.taskId;

        this.dataLayer.get('patient-follow-ups', `/${taskId}`, {}).subscribe({
            next: this.responseFunction,
            error: this.errorHandlerFxn,
        });
    }

    /** Deals with error */
    errorHandlerFxn = error => {
        this.errorHandler.handleError(error, this, 'clinical');
        this.loadingDataFetch = false;
    };
    /**
     * Resolves the fetchReport data fetching observable
     * @param data screening report data object
     */
    responseFunction = response => {
        this.loadingDataFetch = false;
        this.postScreeningData = response;
    };

    /**
     * should patch the record
     * */
    updateFollowUpTask(model: any, status: string) {
        this.loading2 = true;
        const inputData: any = {
            status: status === 'addNote' ? undefined : status,
            updateReason: model.other_reason
                ? model.other_reason
                : model.returned_results_task,
            notes: model.other_reason,
        };

        if (this.nextDueDate) {
            inputData.dueDate = this.nextDueDate;
        }

        this.dataLayer
            .update(
                'clinical-task',
                this.uiglobals.params.taskId,
                inputData,
                null,
                true
            )
            .subscribe({
                next: () => this.taskResponseFunctionWithStatus(status),
                error: err => {
                    this.loading2 = false;
                    this.errorHandlerFxn(err);
                },
            });
    }

    /**
     * Function used to handle the next callback
     * @param status status value used to close the modal
     * @returns
     */
    taskResponseFunctionWithStatus = status => response => {
        this.loading2 = false;
        this.submitted2 = true;
        this.toggleModal(
            status === 'cancelled'
                ? 'markUnfulfilled'
                : status === 'completed'
                ? 'completeTask'
                : status === 'addNote'
                ? 'addNote'
                : null
        );
        if (response.data) {
            this.showToast(
                'bottom-right',
                'success',
                'Successful',
                `Task has been updated`
            );
            this.fetchReport();
            return;
        }
    };

    /** Used to display toast */
    showToast(position, status, msg, context) {
        const duration = 7000;
        const message = `${context} successfully`;
        this.toastrService.show(message, msg, { position, status, duration });
    }

    /**
     * Component lifecycle used after the component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        this.fetchReport();
    }
}

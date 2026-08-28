import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-waiting-result',
    templateUrl: './waiting-result.component.html',
    styleUrls: ['./waiting-result.component.scss'],
    standalone: false,
})

/**
 * Class that renders the Waiting Result Component
 */
export class WaitingResultComponent implements OnInit {
    /**
     * Id of waiting result task
     */
    @Input() taskId: string;
    /**
     * Referral Task object
     */
    @Input() screeningTasksData: any;

    /**
     * Complete task data object
     */
    completeTaskDetails: any = {};
    /**
     * Emitter that emits event used to trigger function that moves to stepper's previous step
     */
    @Output() previousStepRequested: EventEmitter<void> = new EventEmitter();
    /**
     * Emitter that emtimes event used to trigger function that sets the test results as ready
     */
    @Output() updateTestStatus: EventEmitter<void> = new EventEmitter();
    /**
     * The component constructor
     * @param toastService Connects to the toast service
     * @param screeningService injects instance of the screening service
     * @param errorHandler injects instance of errorhandler service
     */
    constructor(
        protected toastService: NbToastrService,
        private errorHandler: ErrorHandlerService,
        public dataLayer: SilStoresService
    ) {}
    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * Defines loading state as screening ends and appointment is being made
     */
    loading: boolean;
    /**
     * Boolean used to define if the form data has been submitted
     */
    submitted: boolean = false;
    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Used to display different toggle modals
     * information
     */
    toggle: Object = {};
    /**
     * Toggles the modal
     *
     * @param context the modal context to toggle.
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }
    /**
     * Method used to display a toast
     *
     * @param position position of the toast message.
     * @param status status of the toast message.
     * @param msg the message to display.
     * @param context additional context for the message.
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
     * Function used to handle the next callback
     * @param response server response containing operation results
     * @returns void
     */
    taskResponseFunctionWithStatus = () => {
        this.loading = false;
        this.submitted = true;
        this.toggleModal('completeTask');

        this.showToast(
            'bottom-right',
            'success',
            'Successful',
            `Task has been updated`
        );
        this.updateTestStatus.emit();
        return;
    };

    /**
     * OnClick function used to trigger nextStep emitter
     */
    requestPreviousStep() {
        this.previousStepRequested.emit();
    }
    /**
     * Function used to update results task to completed
     *
     * @param model data model for the task.
     * @param status new task status.
     */
    updateFollowUpTask(model: any, status: string) {
        const data = Object.assign({
            status: status,
            updateReason: model.returned_results_task,
            dueDate: '',
            notes: model.other_reason,
        });
        this.dataLayer
            .update('clinical-task', this.taskId, data, null, true)
            .subscribe({
                next: () => this.taskResponseFunctionWithStatus(),
                error: () => {
                    this.loading = false;
                    this.errorHandler.handleError(
                        'Sorry, an error occurred while completing task. Please try again.',
                        this,
                        'clinical'
                    );
                },
            });
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }
}

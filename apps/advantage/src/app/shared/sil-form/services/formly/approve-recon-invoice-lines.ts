import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines add transfer item form controls, methods
 */
export class ApproveReconInvoiceLinesService {
    /**
     * Used to access a formly fielconstructord
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */

    fields() {
        return [
            {
                key: 'adjudication_reason',
                type: 'textarea',
                className: 'col-12',
                props: {
                    placeholder: 'Add your reason here..',
                    label: 'Adjudication Reason',
                    required: true,
                },
            },
            {
                key: 'template',
                type: 'template',
                className: 'col-12 mb-1',
                props: {
                    template: `
                    <div
                        class="mt-2 p-4"
                        style="background-color: rgba(187, 117, 252, 0.1); border-radius: 12px;">
                        <div class="d-flex justify-content-start align-items-center">
                            <img
                                src="../../assets/images/warning.svg"
                                height="50" alt="Warning" />
                            <div class="ms-3">
                                <p class="fs-6 fw-medium mb-0" style="color: rgb(91, 4, 173);">
                                  By clicking on the Approve button below, you confirm that the entire pending amount for all selected invoices will be fully adjudicated, and no further adjustments or negotiations will be permitted.
                                </p>
                            </div>
                        </div>  
                    </div>`,
                },
            },
        ];
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

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
export class ProcessInvoiceFormService {
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

    single_invoice: any;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */

    fields() {
        return [
            {
                key: 'approved_amount',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Approved Amount',
                    placeholder: 'Enter amount approved',
                    required: true,
                    type: 'number',
                },
                validators: {
                    approved_amount: {
                        expression: (control, field) => {
                            const model = field?.parent?.model || {};
                            return control.value <= model.unpaid_amount;
                        },
                    },
                },
            },
            {
                type: 'template',
                className: 'col-12 mb-3',
                expressionProperties: {
                    'props.template': model => {
                        if (model.approved_amount > model.unpaid_amount) {
                            return `<div class="text-danger">
                                        Approved amount cannot exceed unpaid amount (${model.unpaid_amount}).
                                    </div>`;
                        }
                        if (model.approved_amount <= 0) {
                            return `<div class="text-warning">
                                        Approved amount should be greater than zero.
                                    </div>`;
                        }
                        return '';
                    },
                },
            },
            {
                key: 'adjudication_reason',
                type: 'textarea',
                className: 'col-12 mt-2',
                props: {
                    placeholder: 'Add your reason here..',
                    label: 'Adjudication Reason',
                    required: true,
                },
            },
            {
                key: 'template',
                type: 'template',
                className: 'col-12 mb-4',
                props: {
                    template: `
                    <div
                        class="mt-2 mb-4 p-4"
                        style="background-color: rgba(187, 117, 252, 0.1); border-radius: 12px;">
                        <div class="d-flex justify-content-start align-items-center">
                            <img
                                src="../../assets/images/warning.svg"
                                height="50" alt="Warning" />
                            <div class="ms-3">
                                <p class="fs-6 fw-medium mb-0" style="color: rgb(91, 4, 173);">
                                    If you check the box below, you confirm that this is the final adjudicated amount for the invoice, and no further adjustments or negotiations will be accepted. 
                                    <br><br>
                                    If you choose not to check the box, you may continue with your submission, but be aware that future adjustments or discussions may still be possible.
                                </p>
                            </div>
                        </div>  
                    </div>`,
                },
            },
            {
                key: 'is_final',
                type: 'checkbox',
                className: 'col-12 mb-3',
                defaultValue: false,
                props: {
                    label: 'I confirm that this is the final adjudicated amount.',
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

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
export class FinalizeInvoiceFormService {
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
                key: 'template',
                type: 'template',
                className: 'col-12',
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
                                    Are you sure you want to finalize this invoice? 
                                    <br />
                                    <small>
                                        Once finalized, the invoice will be permanently closed, and you won't be able to reopen it for adjustments.
                                    </small>
                                </p>
                            </div>
                        </div>  
                    </div>`,
                },
            },
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

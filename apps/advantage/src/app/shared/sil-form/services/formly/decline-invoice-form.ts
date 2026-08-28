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
export class DeclineInvoiceFormService {
    /**
     * Used to access a formly field
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
                                    Are you sure you want to decline this invoice line? 
                                    <br />
                                    <small>
                                      Once you decline, this action is permanent, and no further adjustments can be made.
                                    </small>
                                </p>
                            </div>
                        </div>  
                    </div>`,
                },
            },
            {
                key: 'adjudication_reasons',
                type: 'select',
                className: 'col-12',
                props: {
                    placeholder: 'Enter adjudication reason',
                    label: 'Adjudication reason',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Additional Diagnosis Provided',
                            value: 'diagnosis',
                        },
                        {
                            title: 'Additional Medicine Provided',
                            value: 'medicine',
                        },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: false,
                    multiple: true,
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
                expressions: {},
            },

            {
                key: 'adjudication_reason',
                type: 'textarea',
                className: 'col-12',
                props: {
                    placeholder: 'Add description here..',
                    label: 'Description',
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

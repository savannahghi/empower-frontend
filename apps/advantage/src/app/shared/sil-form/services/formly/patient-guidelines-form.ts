import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the cancel appointment service
 */
export class PatientGuidelinesService {
    /**
     * Component reference to SilFormComponent
     * @returns fields field information
     */
    component: any;

    /**
     * object to store the patient categories
     */
    PATIENT_CATEGORIES = [
        {
            label: 'Patient Manual',
            value: 'PATIENT_MANUAL',
        },
        {
            label: 'Community Health Worker Manual',
            value: 'CHW_MANUAL',
        },
    ];

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'name',
                type: 'input',
                className: 'col-12 ',
                props: {
                    label: 'Name',
                    required: true,
                },
            },
            {
                key: 'source_url',
                type: 'input',
                className: 'col-12 ',
                props: {
                    label: 'Source URL',
                    required: true,
                },
            },
            {
                key: 'source_name',
                type: 'input',
                className: 'col-12 ',
                props: {
                    label: 'Source name',
                    required: true,
                },
            },
            {
                key: 'publication_year',
                type: 'input',
                className: 'col-12 ',
                props: {
                    label: 'Publication Year',
                    type: 'date',
                    required: true,
                },
            },
            {
                key: 'guideline_type',
                type: 'select',
                className: 'col-12',
                props: {
                    label: 'Category',
                    placeholder: 'Category',
                    options: this.PATIENT_CATEGORIES,
                    bindLabel: 'label',
                    bindValue: 'value',
                    required: true,
                    closeOnSelect: true,
                },
            },
            {
                key: 'content',
                type: 'textarea',
                className: 'col-12 ',
                props: {
                    label: 'Content',
                    required: true,
                    rows: 7,
                },
            },
        ];
    }

    /**
     * setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

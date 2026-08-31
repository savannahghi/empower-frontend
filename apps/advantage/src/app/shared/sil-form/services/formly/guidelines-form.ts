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
export class GuidelinesService {
    /**
     * Component reference to SilFormComponent
     * @returns fields field information
     */
    component: any;

    /**
     * object to store the clinical categories
     */
    CLINICAL_CATEGORIES = [
        {
            label: 'Kenyan Ministry of Health',
            value: 'KENYAN_MOH',
        },
        {
            label: 'Kenyan Other',
            value: 'KENYAN_NON_MOH',
        },
        {
            label: 'World Health Organisation',
            value: 'INTERNATIONAL_WHO',
        },
        {
            label: 'International Other',
            value: 'INTERNATIONAL_NON_WHO',
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
                key: 'category',
                type: 'select',
                className: 'col-12',
                props: {
                    label: 'Category',
                    placeholder: 'Category',
                    options: this.CLINICAL_CATEGORIES,
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

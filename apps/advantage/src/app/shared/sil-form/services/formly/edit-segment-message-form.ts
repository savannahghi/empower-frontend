import { Injectable } from '@angular/core';

/**
 * Allows service to be injectable into formly commponent
 */
@Injectable({
    providedIn: 'root',
})

/** Class that defines edit segment message form controls */
export class EditSegmentMessageService {
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
                type: 'textarea',
                className: 'ms-1 mb-2 col-6 w-100',
                props: {
                    placeholder: 'Message',
                    label: 'Message',
                    required: true,
                },
                expressions: {
                    'model.template': field => {
                        return field.model.message.template;
                    },
                },
            },
            {
                key: 'template_en',
                type: 'textarea',
                className: 'ms-1 mb-2 col-6 w-100',
                props: {
                    placeholder: 'Enter message in English',
                    label: 'Message Translation (English)',
                },
                expressions: {
                    'model.template_en': field => {
                        return field.model.message.template_en;
                    },
                },
            },
            {
                key: 'template_sw',
                type: 'textarea',
                className: 'ms-1 mb-2 col-6 w-100',
                props: {
                    placeholder: 'Enter message in Swahili',
                    label: 'Message Translation (Swahili)',
                },
                expressions: {
                    'model.template_sw': field => {
                        return field.model.message.template_sw;
                    },
                },
            },
            {
                key: 'template_fr',
                type: 'textarea',
                className: 'ms-1 mb-2 col-6 w-100',
                props: {
                    placeholder: 'Enter message in French',
                    label: 'Message Translation (French)',
                },
                expressions: {
                    'model.template_fr': field => {
                        return field.model.message.template_fr;
                    },
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

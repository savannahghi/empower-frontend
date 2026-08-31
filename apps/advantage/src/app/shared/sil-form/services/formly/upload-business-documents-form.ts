import { Injectable } from '@angular/core';

/**
 * Allows service to be injectable into formly commponent
 */
@Injectable({
    providedIn: 'root',
})

/** Class that definesform controls */
export class BusinessDocumentsUploadService {
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
                key: 'document',
                type: 'file',
                className: 'col-12',
                props: {
                    placeholder: 'Upload document',
                    label: 'Upload document',
                    fileEvent: (eventfile, model) => {
                        const file = eventfile;
                        model.fileEvent = file;
                    },
                },
                expressions: {
                    'model.document': field => {
                        if (field?.model?.document) {
                            return field?.model?.document;
                        }
                    },
                },
            },
            {
                key: 'title',
                type: 'input',
                className: 'col-12',
                props: {
                    placeholder: 'Enter the title of the document e.g KRA PIN',
                    label: 'Document Title',
                    required: true,
                },
                expressions: {
                    'model.title': field => {
                        if (field?.model?.title) {
                            return field?.model?.title;
                        }
                    },
                },
            },
            {
                key: 'description',
                type: 'textarea',
                className: 'col-12',
                props: {
                    placeholder: 'Enter the description for the document',
                    label: 'Description',
                },
                expressions: {
                    'model.description': field => {
                        if (field?.model?.description) {
                            return field?.model?.description;
                        }
                    },
                },
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

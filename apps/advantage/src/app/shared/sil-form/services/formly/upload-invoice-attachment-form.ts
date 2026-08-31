/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines billing form controls, methods
 */
export class UploadInvoiceAttachmentService {
    /**
     * Used to control loading for search
     */
    loading: boolean = false;
    /**
     * Stores the search term
     */
    term: string;
    /**
     * Stores instance of the form component
     */
    component: any;
    /**
     * Stores the form model data
     */
    model: Object;

    /** determines reuploading of rejected documents */
    isRejectedDocument: boolean = false;

    /** stores rejected document */
    rejectedDocument: any;

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public auth: AuthenticationService
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */

    fields() {
        return [
            {
                key: 'data',
                type: 'file',
                className: `col-12`,
                props: {
                    placeholder: 'Upload document',
                    label: 'Upload document',
                    fileEvent: (eventfile, model) => {
                        const file = eventfile;
                        model.fileEvent = file;
                        // Capture and store the file type
                        model.file_type = file.type;
                    },
                    addFile: model => {
                        model['fileEvent'] = model.file;
                    },
                    required: true,
                },
                expressions: {
                    'model.data': field => {
                        if (field.model.data) {
                            return field.model.data;
                        }
                    },
                },
            },

            {
                key: 'title',
                type: 'input',
                className: `col-12`,
                props: {
                    placeholder: 'Enter the name of the document',
                    label: 'Document Name',
                    required: true,
                },
                expressions: {
                    'model.title': field => {
                        if (field.model.fileEvent) {
                            return field.model.fileEvent.name;
                        }
                    },
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },

            {
                key: 'file_type',
                type: 'input',
                className: 'hidden',
                expressions: {
                    'model.file_type': field => {
                        return field.model.file_type;
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

/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import _ from 'underscore';
import moment from 'moment';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines billing form controls, methods
 */
export class PatientAttachmentFieldsService {
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
                key: 'document_type',
                type: 'select',
                className: 'col-12 mb-3',
                props: {
                    placeholder: 'Choose the type of document',
                    label: 'Document type',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Clinical note',
                            value: 'CLINICAL_NOTES',
                        },
                        { title: 'Prescription', value: 'PRESCRIPTION' },
                        { title: 'Lab result', value: 'LAB_RESULTS' },
                        {
                            title: 'Procedure result',
                            value: 'PROCEDURE_RESULTS',
                        },
                        { title: 'Imaging result', value: 'RADIOLOGY_RESULTS' },
                        {
                            title: 'Medical report',
                            value: 'MEDICAL_REPORT',
                        },
                        { title: 'Interim bill', value: 'INTERIM_BILL' },
                        { title: 'Final bill', value: 'FINAL_BILL' },
                        {
                            title: 'Preauthorization form',
                            value: 'PRE_AUTHORIZATION_FORM',
                        },
                        {
                            title: 'Discharge Summary',
                            value: 'DISCHARGE_SUMMARY',
                        },
                        { title: 'Other', value: 'OTHER' },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.document_type': field => {
                        if (field?.model?.document_type) {
                            return field?.model?.document_type;
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
                key: 'description',
                type: 'textarea',
                className: 'col-12',
                hideExpression: this.isRejectedDocument,
                props: {
                    placeholder: 'Enter the description for the document',
                    label: 'Description',
                },
                expressions: {
                    'model.description': field => {
                        return field.model.description;
                    },
                },
            },
            {
                key: 'fileEvent',
                type: 'input',
                className: 'hidden',
                expressions: {
                    'model.fileEvent': field => {
                        return field.model.fileEvent;
                    },
                },
            },
            {
                key: 'visit_date',
                className: `col-12`,
                type: 'datepicker',
                props: {
                    type: 'text',
                    placeholder: 'Choose the day the document was created',
                    label: 'Visit date',
                    dateFormat: 'YYYY-MM-DD',
                    required: true,
                    max: moment(),
                },
                expressions: {
                    'model.visit_date': field => {
                        if (field.formControl.pristine === false) {
                            this.model = field.model;
                            if (
                                !_.isUndefined(field.model.visit_date) &&
                                field.formControl.touched === true &&
                                field.defaultValue !== field.model.visit_date
                            ) {
                                field.formControl.markAsPristine();
                                return moment(field.model.visit_date);
                            } else {
                                return this.model['visit_date'];
                            }
                        } else if (field.model.visit_date !== null) {
                            return moment(field.model.visit_date);
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
        ];
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        if (this.component.secondaryData.document_status === 'REJECTED') {
            this.rejectedDocument = this.component.secondaryData;
            this.isRejectedDocument = true;
        } else {
            this.isRejectedDocument = false;
        }
    }
}

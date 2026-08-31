import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../../sil-http-services/sil_datalayer.service';
import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the form breast cancer examination screening service
 */
export class BreastCancerExaminationService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     *
     * Tests to be done
     */
    tests: Array<any> = [];

    /**
     *
     * Test results of the regular tests
     */
    regularTestResults: Array<any> = [];
    /**
     * Stores form data from api
     */
    model: any = {};

    /**
     * Imports datalayer for service calls
     * @param dataLayer gives access to the datalayer service
     */
    constructor(public dataLayer: SilStoresService) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                className: 'width-100p',
                fieldGroup: [
                    {
                        key: 'screening_type',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        defaultValue: 'First time screening',
                        props: {
                            label: 'Select the type of screening',
                            placeholder: 'Select screening type',
                            required: true,
                            bindLabel: 'value',
                            bindValue: 'value',
                            closeOnSelect: true,
                            searchable: false,
                            options: [
                                {
                                    value: 'First time screening',
                                },
                                {
                                    value: 'Re-screening',
                                },
                                {
                                    value: 'Post-treatment screening',
                                },
                            ],
                        },
                        expressions: {
                            'model.screening_type': field => {
                                field.props.model = field.model?.screening_type;
                                return field.model?.screening_type;
                            },
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 100,
                            },
                        },
                    },
                    {
                        key: 'selected_test',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        defaultValue: 'CBE',
                        props: {
                            label: 'Select test performed',
                            placeholder: 'Select test',
                            required: false,
                            bindLabel: 'title',
                            searchable: false,
                            closeOnSelect: true,
                            bindValue: 'value',
                            options: [...this.tests],
                        },
                        expressions: {
                            'model.selected_test': field => {
                                field.props.model = field.model?.selected_test;
                                return field.model?.selected_test;
                            },
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 100,
                            },
                        },
                    },
                    {
                        key: 'selected_result',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Screening result',
                            placeholder: 'Select result',
                            bindLabel: 'title',
                            required: true,
                            bindValue: 'value',
                            closeOnSelect: true,
                            options: [...this.regularTestResults],
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model ||
                                    field.model.screening_type === undefined
                                );
                            },
                            'model.selected_result': field => {
                                return field.model?.selected_result;
                            },
                        },
                        modelOptions: {
                            updateOn: 'change',
                            debounce: {
                                default: 10,
                            },
                        },
                    },
                    {
                        key: 'attachment',
                        type: 'file',
                        className: 'my-4 col-12',
                        props: {
                            label: 'Upload attachment',
                            placeholder: '',
                            required: false,
                            bindLabel: 'value',
                            bindValue: 'value',
                            addFile: model => {
                                this.model['file'] = model.file;
                            },
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model ||
                                    field.model.screening_type === undefined ||
                                    field.model.selected_test === undefined
                                );
                            },
                            'model.attachment': field => {
                                return field.model?.attachment;
                            },
                            'model.file': () => {
                                return this.model.file;
                            },
                        },
                        modelOptions: {
                            updateOn: 'change',
                            debounce: {
                                default: 10,
                            },
                        },
                    },
                    {
                        key: 'clinical_notes',
                        type: 'textarea',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Clinical notes from test',
                            placeholder:
                                'E.g. No palpable masses or abnormalities observed during examination',
                            required: false,
                            className: 'label',
                            rows: 5,
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model ||
                                    field.model.screening_type === undefined ||
                                    field.model.selected_test === undefined
                                );
                            },
                            'model.clinical_notes': field => {
                                return field.model?.clinical_notes;
                            },
                        },
                        modelOptions: {
                            updateOn: 'change',
                            debounce: {
                                default: 10,
                            },
                        },
                    },
                ],
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;

        this.tests = [
            {
                title: 'CBE(Clinical Breast Exam)',
                value: 'CBE',
            },
        ];

        this.regularTestResults = [
            {
                title: 'Normal',
                value: 'Normal',
            },
            {
                title: 'Benign Findings - Not Suspicious For CA',
                value: 'Benign Findings - Not Suspicious For CA',
            },
            {
                title: 'Discrete Palpable Mass - Suspicious For CA',
                value: 'Discrete Palpable Mass - Suspicious For CA',
            },
            {
                title: 'Blood, Or Serious Nipple Discharge',
                value: 'Blood, Or Serious Nipple Discharge',
            },
            {
                title: 'Nipple/Areola Scaliness',
                value: 'Nipple/Areola Scaliness',
            },
            {
                title: 'Skin Dimpling Or Retraction',
                value: 'Skin Dimpling Or Retraction',
            },
            {
                title: 'Focal Pain Or Tenderness',
                value: 'Focal Pain Or Tenderness',
            },
            {
                title: 'Nipple Inversion',
                value: 'Nipple Inversion',
            },
        ];
    }
}

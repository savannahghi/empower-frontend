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
 * Class for the form cervical cancer examination service
 */
export class CervicalCancerExaminationsService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;
    /**
     * Component reference to SilFormComponent
     */
    component: any;

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
                        defaultValue: 'VIA',
                        props: {
                            label: 'Select test performed',
                            placeholder: 'Select test',
                            required: true,
                            bindLabel: 'value',
                            searchable: false,
                            closeOnSelect: true,
                            bindValue: 'value',
                            options: [
                                {
                                    value: 'VIA',
                                },
                                {
                                    value: 'VIA/VILI',
                                },
                                {
                                    value: 'HPV PCR DNA',
                                },
                            ],
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
                            required: true,
                            bindLabel: 'title',
                            bindValue: 'value',
                            closeOnSelect: true,
                            options: [
                                {
                                    title: 'Negative',
                                    value: 'negative',
                                },
                                {
                                    title: 'Positive',
                                    value: 'positive',
                                },
                                {
                                    title: 'Suspicious for cancer',
                                    value: 'suspicious_for_cancer',
                                },
                            ],
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
                        key: 'additional_notes',
                        type: 'textarea',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Clinical Notes from Test',
                            placeholder: 'Enter test notes here',
                            required: false,
                            rows: 5,
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model ||
                                    field.model.screening_type === undefined
                                );
                            },
                            'model.additional_notes': field => {
                                return field.model?.additional_notes;
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
    }
}

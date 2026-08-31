import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class OrgSettingsService {
    /**
     *  component
     * @returns fields field information
     */
    component: any;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                className: 'col-12 row',
                expressionProperties: {
                    template: model => {
                        if (
                            !model.default ||
                            model.setting_type === 'bool' ||
                            model.name === 'patients:patient_full_name'
                        ) {
                            return;
                        }
                        const template = `<div class="row ms-2">
                        <label class="col-sm-12 mb-2 ms-2 label">
                          Setting:
                        </label>
                        <div class="col-sm-12 mb-4 ms-2">
                          ${model.description}
                        </div>
                        <label class="col-sm-12 mb-2 ms-2 label">
                          Default Setting:
                        </label>
                        <div class="col-sm-12 ms-2 mb-2">
                          ${model.default}
                        </div>
                    </div>`;
                        return template;
                    },
                },
            },

            {
                key: 'setting_type',
                type: 'input',
                className: 'd-none',
                props: {
                    label: 'Type',
                    required: true,
                    disabled: true,
                },
                expressions: {
                    'model.value': field => {
                        return field.model.value;
                    },
                },
            },

            {
                className: 'col-12 row ',
                hideExpression: 'model.setting_type!=="bool"',
                expressionProperties: {
                    template: model => {
                        const template = `<div class="row ms-2 ">
                        <label class="col-sm-12 ms-2 label">
                          Setting:
                        </label>
                        <div class="col-sm-12 mb-2 ms-2">
                          ${model.description}
                        </div>
                    </div>`;
                        return template;
                    },
                },
            },
            {
                key: 'value',
                hideExpression: 'model.setting_type!=="bool"',
                type: 'checkbox',
                className: 'col-12 row ms-1 mb-3 mt-2',
                props: {
                    label: 'Tick to set to "Yes", Untick to sets to "No"',
                },
                expressions: {
                    'model.value': field => {
                        return field.model.value;
                    },
                },
            },
            {
                key: 'value',
                hideExpression:
                    'model.setting_type!=="list" || model.name ==="visit:document_number_format"',
                type: 'input',
                className: 'col-12 row ms-1 mt-3',
                props: {
                    type: 'number',
                    label: 'Current Setting',
                    required: true,
                },
                expressions: {
                    'model.value': field => {
                        if (field.model.value.length === 1) {
                            return field.model.value[0];
                        } else {
                            return field.model.value;
                        }
                    },
                },
            },
            {
                key: 'value',
                hideExpression:
                    'model.name!=="scheduling:preferred_patient_scheduling_method"',
                type: 'select',
                className: 'col-12 row ms-1 mt-3',
                props: {
                    defaultValue: 'APPOINTMENT BOOKING',
                    label: 'Select preferred setting',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'APPOINTMENT BOOKING',
                            value: 'APPOINTMENT BOOKING',
                        },
                        {
                            title: 'CHECK-IN SCHEDULING',
                            value: 'CHECK-IN SCHEDULING',
                        },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.value': field => {
                        return field.model.value;
                    },
                },
            },

            {
                key: 'custom_input_value',
                type: 'input',
                hideExpression: 'model.name!=="visit:document_number_format"',
                className: 'col-12 mt-3',
                props: {
                    label: 'Custom Value (The custom value that you want to appear on the invoice)',
                    required: false,
                },
            },

            {
                className: 'col-12 row',
                hideExpression: 'model.name!=="visit:document_number_format"',
                expressionProperties: {
                    template: () => {
                        const template = `<div class="row ms-1">
                        <label class="col-sm-12">
                        <strong>Set how the invoice document number will appear</strong>
                        </label>
                    </div>`;
                        return template;
                    },
                },
            },

            {
                key: 'custom_input',
                hideExpression: 'model.name!=="visit:document_number_format"',
                type: 'select',
                className: 'col-2 row ms-1 mt-1 mb-3',
                props: {
                    defaultValue: 'custom_input',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [],
                    searchable: false,
                    closeOnSelect: true,
                },
                expressions: {
                    'model.value': field => {
                        return field.model.value;
                    },
                    'model.onFocus': field => {
                        field.props.options = this.getFilteredOptions();
                    },
                },
            },
            {
                className:
                    'row ms-1 mt-1 mb-3 d-flex align-items-center justify-content-center',
                hideExpression: 'model.name!=="visit:document_number_format"',
                expressionProperties: {
                    template: () => {
                        const template = `<div>/</div>`;
                        return template;
                    },
                },
            },
            {
                key: 'org',
                hideExpression: 'model.name!=="visit:document_number_format"',
                type: 'select',
                className: 'col-2 row ms-1 mt-1 mb-3',
                props: {
                    defaultValue: 'org',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [],
                    searchable: false,
                    closeOnSelect: true,
                },
                expressions: {
                    'model.value': field => {
                        return field.model.value;
                    },
                    'model.onFocus': field => {
                        field.props.options = this.getFilteredOptions();
                    },
                },
            },
            {
                className:
                    'row ms-1 mt-1 mb-3 d-flex align-items-center justify-content-center',
                hideExpression: 'model.name!=="visit:document_number_format"',
                expressionProperties: {
                    template: () => {
                        const template = `<div>/</div>`;
                        return template;
                    },
                },
            },
            {
                key: 'branch',
                hideExpression: 'model.name!=="visit:document_number_format"',
                type: 'select',
                className: 'col-2 row ms-1 mt-1 mb-3',
                props: {
                    defaultValue: 'branch',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [],
                    searchable: false,
                    closeOnSelect: true,
                },
                expressions: {
                    'model.value': field => {
                        return field.model.value;
                    },
                    'model.onFocus': field => {
                        field.props.options = this.getFilteredOptions();
                    },
                },
            },
            {
                className:
                    'row ms-1 mt-1 mb-3 d-flex align-items-center justify-content-center',
                hideExpression: 'model.name!=="visit:document_number_format"',
                expressionProperties: {
                    template: () => {
                        const template = `<div>/</div>`;
                        return template;
                    },
                },
            },
            {
                key: 'year',
                hideExpression: 'model.name!=="visit:document_number_format"',
                type: 'select',
                className: 'col-2 row ms-1 mt-1 mb-3',
                props: {
                    defaultValue: 'Year',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [],
                    searchable: false,
                    closeOnSelect: true,
                },
                expressions: {
                    'model.value': field => {
                        return field.model.value;
                    },
                    'model.onFocus': field => {
                        field.props.options = this.getFilteredOptions();
                    },
                },
            },
            {
                className:
                    'row ms-1 mt-2 mb-3 d-flex align-items-center justify-content-center dynamic-document-slash',
                hideExpression: 'model.name!=="visit:document_number_format"',
                expressionProperties: {
                    template: () => {
                        const template = `<div>/</div>`;
                        return template;
                    },
                },
            },
            {
                key: 'seq',
                hideExpression: 'model.name!=="visit:document_number_format"',
                type: 'select',
                className: 'col-2 row ms-1 mt-1 mb-3',
                props: {
                    defaultValue: 'seq',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [],
                    searchable: false,
                    closeOnSelect: true,
                },
                expressions: {
                    'model.value': field => {
                        return field.model.value;
                    },
                    'model.onFocus': field => {
                        field.props.options = this.getFilteredOptions();
                    },
                },
            },

            {
                key: 'value',
                hideExpression:
                    'model.setting_type!=="str" || model.name==="scheduling:preferred_patient_scheduling_method"',
                type: 'textarea',
                className: 'col-12 row ms-1 mt-3',
                props: {
                    label: 'Current Setting',
                    required: true,
                },
                expressions: {
                    'model.value': field => {
                        return this.updateValue(field);
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

    /**
     *  getFilteredOptions
     * Updates the select options of visit:document_number_format
     */
    getFilteredOptions() {
        const formFields = this.getFormFields();

        const options = [
            {
                title: 'Custom Input',
                value: 'custom_input',
            },
            {
                title: 'Organization Name',
                value: 'org',
            },
            {
                title: 'Branch',
                value: 'branch',
            },
            {
                title: 'Year',
                value: 'year',
            },
            {
                title: 'Sequence',
                value: 'seq',
            },
        ];

        const filteredOptions = options.filter(
            option => !formFields.includes(option.value)
        );

        return filteredOptions;
    }
    /**
     *  getFormFields
     * Gets the form values of visit:document_number_format
     */
    getFormFields() {
        const formValues = this.component.form.value;
        const formFields = [];

        for (const key in formValues) {
            if (formValues.hasOwnProperty(key)) {
                const value = formValues[key];

                if (key !== 'value') {
                    formFields.push(value);
                }
            }
        }
        return formFields;
    }

    updateValue = field => {
        const formValues = this.component.form.value;
        const parts = [];

        if (formValues.custom_input) {
            parts.push(`{${formValues.custom_input}}`);
        }

        if (formValues.org) {
            parts.push(`{${formValues.org}}`);
        }

        if (formValues.branch) {
            parts.push(`{${formValues.branch}}`);
        }

        if (formValues.year) {
            parts.push(`{${formValues.year}}`);
        }

        if (formValues.seq) {
            parts.push(`{${formValues.seq}}`);
        }
        if (formValues.custom_input_value && parts.includes('{custom_input}')) {
            const prefixIndex = parts.findIndex(
                part => part === '{custom_input}'
            );
            if (prefixIndex !== -1 && formValues.custom_input_value) {
                parts[prefixIndex] = `{${formValues.custom_input_value}}`;
            }
        }
        if (parts.length === 0) {
            return field.model.value;
        }
        return parts.join('/');
    };
}

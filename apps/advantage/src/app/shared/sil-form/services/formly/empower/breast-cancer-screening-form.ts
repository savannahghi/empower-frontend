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
 * Class for the form breast cancer screening service
 */
export class BreastCancerScreeningService {
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
     * Test results of the birads type of tests (Ultrasound, Mammogram, MRI)
     */
    biradsTestResults: Array<any> = [];

    /**
     * test results for IHC
     */
    ihcTestResults: Array<any> = [];

    /**
     * ihc options
     */
    ihcOptions: Array<any> = [];

    /**
     *
     * Test results of the regular tests (Biopsy)
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
                        key: 'test_action',
                        type: 'custom-radio',
                        className: 'col-12 pe-sm-3 gap-2',
                        templateOptions: {
                            type: 'custom-radio',
                            label: '',
                            name: 'test_action',
                            className: `col-12 col-sm-6 pe-sm-3`,
                            options: [
                                {
                                    label: 'Perform in house',
                                    value: 'add_results',
                                    key: 'Perform In house',
                                },
                                {
                                    label: 'Refer to external facility',
                                    value: 'test_referral',
                                    key: 'Refer to external facility',
                                },
                            ],
                        },
                        defaultValue: 'add_results',
                        expressions: {
                            'model.test_action': field => {
                                field.props.model = field.model?.test_action;
                                return field.model?.test_action;
                            },
                        },
                        hooks: {
                            onInit: field => {
                                field.formControl.valueChanges.subscribe(
                                    value => {
                                        const fieldsToReset = [
                                            'selected_test',
                                            'selected_result',
                                            'attachment',
                                            'facility',
                                            'clinical_notes',
                                            'referral_notes',
                                        ];
                                        fieldsToReset.forEach(fieldKey => {
                                            const fieldControl =
                                                field.form?.get(fieldKey);
                                            if (fieldControl) {
                                                fieldControl.reset();
                                            }
                                        });
                                        if (
                                            value === 'add_results' &&
                                            field.model
                                        ) {
                                            field.model.selected_test =
                                                'Mammogram';
                                        }
                                    }
                                );
                            },
                        },
                    },
                    {
                        key: 'selected_test',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        defaultValue: 'Mammogram',
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
                            hide: field => {
                                return !field.model?.test_action;
                            },
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
                            label: 'Test result',
                            placeholder: 'Select result',
                            bindLabel: 'title',
                            bindValue: 'value',
                            closeOnSelect: true,
                            options: [...this.regularTestResults],
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model?.test_action ||
                                    field.model.test_action !== 'add_results' ||
                                    !['Biopsy'].includes(
                                        field.model.selected_test
                                    )
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
                        key: 'ihc_test',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'IHC test to be performed',
                            placeholder: 'Select result',
                            required: false,
                            bindLabel: 'title',
                            bindValue: 'value',
                            closeOnSelect: true,
                            options: [...this.ihcOptions],
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model?.test_action ||
                                    !['IHC'].includes(field.model.selected_test)
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
                        key: 'selected_result',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Test result',
                            placeholder: 'Select result',
                            required: false,
                            bindLabel: 'title',
                            bindValue: 'value',
                            closeOnSelect: true,
                            options: [...this.ihcTestResults],
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model?.test_action ||
                                    field.model.test_action !== 'add_results' ||
                                    !['IHC'].includes(
                                        field.model.selected_test
                                    ) ||
                                    !field.model.ihc_test ||
                                    field.model.ihc_test === 'IHC_KI67'
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
                        key: 'selected_result',
                        type: 'input',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'KI-67 proliferation index (%)',
                            placeholder: 'Enter percentage (1–100)',
                            required: false,
                            type: 'number',
                            min: 1,
                            max: 100,
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model?.test_action ||
                                    field.model.test_action !== 'add_results' ||
                                    !['IHC'].includes(
                                        field.model.selected_test
                                    ) ||
                                    field.model.ihc_test !== 'IHC_KI67'
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
                        key: 'selected_result',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Test result',
                            placeholder: 'Select result',
                            required: false,
                            bindLabel: 'title',
                            bindValue: 'value',
                            closeOnSelect: true,
                            options: [...this.biradsTestResults],
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model?.test_action ||
                                    field.model.test_action !== 'add_results' ||
                                    ![
                                        'Ultrasound',
                                        'MRI',
                                        'Mammogram',
                                    ].includes(field.model.selected_test)
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
                        key: 'date',
                        type: 'input',
                        className: 'col-12',
                        defaultValue: new Date().toISOString().split('T')[0],
                        props: {
                            label: 'Date',
                            type: 'date',
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model?.test_action ||
                                    field.model?.test_action !== 'add_results'
                                );
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
                                    !field.model?.test_action ||
                                    field.model.test_action !== 'add_results'
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
                        key: 'facility',
                        type: 'combobox',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            store: 'organisations',
                            responseKey: 'results',
                            clearSearchOnAdd: false,
                            minTermLength: 0,
                            label: 'Referred to',
                            placeholder: 'Search a facility....',
                            bindGroupLabel: [
                                {
                                    key: 'organisation_name',
                                },
                                {
                                    key: 'postal_address',
                                },
                            ],
                            bindLabel: [
                                {
                                    key: 'organisation_name',
                                    newline: true,
                                    label: 'Name',
                                    class: 'fw-lighter me-1 mb-1',
                                },
                                {
                                    key: 'postal_address',
                                    label: 'Postal Address',
                                    class: 'text-muted fs-13px',
                                    newline: true,
                                },
                                {
                                    key: 'phone_number',
                                    label: 'Phone number',
                                    class: 'fs-13px',
                                    newline: true,
                                },
                            ],
                            options: [],
                            dropdownPosition: 'bottom',
                            closeOnSelect: true,
                            multiple: false,
                            loadingText: 'Searching facilities...',
                            typeToSearchText:
                                'Please enter 3 or more characters',
                            searchable: true,
                            hideSelected: true,
                            required: true,
                            virtualScroll: true,
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model?.test_action ||
                                    field.model.test_action !== 'test_referral'
                                );
                            },
                            'model.facility': field => {
                                return {
                                    tenant_id: field.model?.facility?.tenant_id,
                                    organisation_name:
                                        field.model?.facility
                                            ?.organisation_name,
                                    phone_number:
                                        field.model?.facility?.phone_number,
                                    postal_address:
                                        field.model?.facility?.postal_address,
                                    slade_code:
                                        field.model?.facility?.slade_code,
                                    email_address:
                                        field.model?.facility?.email_address,
                                };
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
                                    !field.model?.test_action ||
                                    field.model.test_action !== 'add_results'
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
                    {
                        key: 'referral_notes',
                        type: 'textarea',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Referral notes',
                            placeholder: 'Enter test notes here',
                            required: false,
                            className: 'label',
                            rows: 5,
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model?.test_action ||
                                    !['test_referral'].includes(
                                        field.model.test_action
                                    )
                                );
                            },
                            'model.referral_notes': field => {
                                return field.model?.referral_notes;
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
                title: 'Mammogram',
                value: 'Mammogram',
            },
            {
                title: 'Biopsy',
                value: 'Biopsy',
            },
            {
                title: 'Ultrasound',
                value: 'Ultrasound',
            },
            {
                title: 'MRI',
                value: 'MRI',
            },
            {
                title: 'IHC',
                value: 'IHC',
            },
        ];

        this.biradsTestResults = [
            {
                title: 'Incomplete (BIRADS 0)',
                value: 'Incomplete (BIRADS 0)',
            },
            {
                title: 'Negative (BIRADS 1)',
                value: 'Negative (BIRADS 1)',
            },
            {
                title: 'Benign (BIRADS 2)',
                value: 'Benign (BIRADS 2)',
            },
            {
                title: 'Probably benign (BIRADS 3)',
                value: 'Probably benign (BIRADS 3)',
            },
            {
                title: 'Suspicious abnormality (BIRADS 4)',
                value: 'Suspicious abnormality (BIRADS 4)',
            },
            {
                title: 'Highly suggestive of maliganancy (BIRADS 5)',
                value: 'Highly suggestive of maliganancy (BIRADS 5)',
            },
            {
                title: 'Known proven malignancy (BIRADS 6)',
                value: 'Known proven malignancy (BIRADS 6)',
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

        this.ihcTestResults = [
            {
                title: 'Negative',
                value: 'Negative',
            },
            {
                title: 'Positive',
                value: 'Positive',
            },
            {
                title: 'Equivocal',
                value: 'Equivocal',
            },
            {
                title: 'Unsatisfactory',
                value: 'Unsatisfactory',
            },
        ];

        this.ihcOptions = [
            {
                title: 'IHC(Progresterone)',
                value: 'IHC_PROGESTERONE_RECEPTOR',
            },

            {
                title: 'IHC(Oestrogen)',
                value: 'IHC_ESTROGEN_RECEPTOR',
            },
            {
                title: 'IHC(HER2)',
                value: 'IHC_HER2',
            },
            {
                title: 'IHC(KI-67)',
                value: 'IHC_KI67',
            },
        ];
    }
}

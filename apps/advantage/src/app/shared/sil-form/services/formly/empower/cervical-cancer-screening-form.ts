import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../../sil-http-services/sil_datalayer.service';
import { FormlyFieldConfig } from '@ngx-formly/core';

export interface Facility {
    id: string;
    name: string;
    facility_type: string;
    county: string;
    status: string;
}
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the form cervical cancer screening service
 */
export class CervicalCancerScreeningService {
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
                    },
                    {
                        key: 'selected_test',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        defaultValue: 'Pap smear/cytology',
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
                                    value: 'Pap smear/cytology',
                                },
                                {
                                    value: 'HPV ONCOPROTEIN',
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
                            label: 'Results from HPV test',
                            placeholder: 'Select result',
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
                                    field.model.selected_test === undefined ||
                                    field.model.selected_test !== 'HPV' ||
                                    field.model.test_action === undefined ||
                                    !['add_results'].includes(
                                        field.model.test_action
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
                        key: 'selected_result',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Results from Pap smear/cytology test',
                            placeholder: 'Select result',
                            required: false,
                            bindLabel: 'value',
                            bindValue: 'value',
                            closeOnSelect: true,
                            options: [
                                {
                                    value: 'Normal',
                                },
                                {
                                    value: 'ASCUS or greater',
                                },
                            ],
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model ||
                                    field.model.selected_test === undefined ||
                                    field.model.selected_test !==
                                        'Pap smear/cytology' ||
                                    field.model.test_action === undefined ||
                                    !['add_results'].includes(
                                        field.model.test_action
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
                        key: 'selected_result',
                        type: 'select',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Results from HPV test',
                            placeholder: 'Select result',
                            required: false,
                            bindLabel: 'value',
                            bindValue: 'value',
                            closeOnSelect: true,
                            options: [
                                {
                                    value: 'Negative',
                                },
                                {
                                    value: 'Positive',
                                },
                                {
                                    value: 'Suspicious for cancer',
                                },
                            ],
                        },
                        // hide field for pap smear test
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model ||
                                    field.model.selected_test === undefined ||
                                    field.model.selected_test ===
                                        'Pap smear/cytology' ||
                                    field.model.test_action === undefined ||
                                    !['add_results'].includes(
                                        field.model.test_action
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
                                    !field.model ||
                                    field.model.selected_test === undefined ||
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
                                    field.model.selected_test === undefined ||
                                    field.model.test_action === undefined ||
                                    !['test_referral'].includes(
                                        field.model.test_action
                                    )
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
                    {
                        key: 'referral_notes',
                        type: 'textarea',
                        className:
                            'col-12 input-flex-one display-grid pad-t-12',
                        props: {
                            label: 'Clinical notes from test',
                            placeholder: 'Enter test notes here',
                            required: false,
                            className: 'label',
                            rows: 5,
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model ||
                                    field.model.test_action === undefined ||
                                    field.model.test_action !== 'add_results'
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
    }
}

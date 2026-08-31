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
 * Class for the cancer screening follow up form service
 */
export class ScreeningFollowUpService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;
    /**
     * Stores instance of the form component
     */
    component: any;
    /**
     * Stores form data from api
     */
    model: Object;
    /**
     *
     * Test the referral options
     */
    referralOptions: Array<any> = [];

    /**
     *
     * Tests to be done
     */
    tests: Array<any> = [];

    /**
     * Imports datalayer for service calls
     * @param dataLayer gives access to the datalayer service
     */
    constructor(public dataLayer: SilStoresService) {}
    /**
     * Fields loaded in the formly
     * Imports datalayer for service calls
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'referral_type',
                type: 'select',
                className: 'col-12 input-flex-one display-grid pad-t-12',
                defaultValue: '',
                props: {
                    label: 'Select the type of referral',
                    placeholder: 'Select referral type',
                    required: true,
                    bindLabel: 'label',
                    bindValue: 'value',
                    closeOnSelect: true,
                    searchable: false,
                    options: this.referralOptions,
                },
                expressions: {
                    'model.referral_type': field => {
                        field.props.model = field.model?.referral_type;
                        return field.model?.referral_type;
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
                className: 'col-12 input-flex-one display-grid pad-t-12',
                props: {
                    label: 'Test to be Done',
                    placeholder: 'Select test to be done',
                    required: true,
                    bindLabel: 'value',
                    searchable: false,
                    closeOnSelect: true,
                    bindValue: 'value',
                    options: [...this.tests],
                },
                expressions: {
                    hide: field => {
                        return (
                            !field.model ||
                            field.model.referral_type === undefined ||
                            field.model.referral_type !== 'diagnosis_referral'
                        );
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
                key: 'specialist',
                type: 'input',
                className: 'col-12 input-flex-one display-grid pad-t-12',
                defaultValue: '',
                props: {
                    label: 'Specialist',
                    placeholder: 'Enter specialist to be referred to',
                    required: true,
                    min: 3,
                    minLength: 3,
                    closeOnSelect: true,
                },
                expressions: {
                    hide: field => {
                        return (
                            !field.model ||
                            field.model.referral_type === undefined ||
                            field.model.referral_type !== 'specialist_referral'
                        );
                    },
                    'model.specialist': field => {
                        field.props.model = field.model?.specialist;
                        return field.model?.specialist;
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
                key: 'facility',
                type: 'combobox',
                className: 'col-12 input-flex-one display-grid pad-t-12',
                defaultValue: '',
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
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                },
                expressions: {
                    hide: field => {
                        return (
                            !field.model ||
                            field.model.referral_type === undefined
                        );
                    },
                    'model.facility': field => {
                        return {
                            tenant_id: field.model?.facility?.tenant_id,
                            organisation_name:
                                field.model?.facility?.organisation_name,
                            phone_number: field.model?.facility?.phone_number,
                            postal_address:
                                field.model?.facility?.postal_address,
                            slade_code: field.model?.facility?.slade_code,
                            email_address: field.model?.facility?.email_address,
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
                key: 'referral_note',
                type: 'textarea',
                className: 'col-12 input-flex-one display-grid pad-t-12',
                props: {
                    label: 'Additional referral notes',
                    placeholder: 'Enter referral notes here',
                    required: false,
                    className: 'label',
                    rows: 5,
                },
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.referralOptions = [
            {
                label: 'Refer patient to specialist for further evaluation',
                value: 'specialist_referral',
            },
            {
                label: 'Refer patient for treatment',
                value: 'treatment_referral',
            },
        ];
        this.tests =
            this.component.secondaryData[0] === 'cervical'
                ? [
                      {
                          value: 'VIA',
                      },
                      {
                          value: 'VIA/VILI',
                      },
                      {
                          value: 'HPV',
                      },
                      {
                          value: 'Pap smear/cytology',
                      },
                  ]
                : [
                      {
                          title: 'CBE(Clinical Breast Exam)',
                          value: 'CBE',
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
                          title: 'Mammogram',
                          value: 'Mammogram',
                      },
                  ];
    }
}

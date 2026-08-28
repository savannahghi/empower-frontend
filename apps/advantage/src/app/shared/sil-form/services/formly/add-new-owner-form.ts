import { Injectable } from '@angular/core';
import moment from 'moment';

/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the add MOH Certificate service
 */
export class AddNewOwnerService {
    /**
     * Stores instance of the form component
     */
    component: any;
    model: any;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                className: 'w-100',

                fieldGroup: [
                    {
                        key: 'title',
                        type: 'select',
                        className: 'col-md-3',
                        props: {
                            label: 'Title',
                            bindLabel: 'title',
                            bindValue: 'value',
                            options: [
                                { title: 'Mr', value: 'Mr' },
                                { title: 'Mrs', value: 'Mrs' },
                                { title: 'Miss', value: 'Ms' },
                                { title: 'Dr', value: 'Dr' },
                                { title: 'Prof', value: 'Prof' },
                                { title: 'Rev', value: 'Rev' },
                                { title: 'Sr', value: 'Sr' },
                                { title: 'Br', value: 'Br' },
                            ],
                            searchable: false,
                            multiple: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'change',
                            debounce: {
                                default: 1000,
                            },
                        },
                    },
                    {
                        className: 'col-md-5 ms-auto',
                        type: 'input',
                        key: 'full_name',
                        props: {
                            label: 'Full Name',
                            required: true,
                            placeholder: 'Full Name',
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 1000,
                            },
                        },
                    },
                    {
                        key: 'gender',
                        type: 'select',
                        className: 'col-md-3 ms-auto',
                        props: {
                            label: 'Gender',
                            bindLabel: 'title',
                            bindValue: 'value',
                            options: [
                                { title: 'Male', value: 'MALE' },
                                { title: 'Female', value: 'FEMALE' },
                            ],
                            searchable: false,
                            multiple: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'change',
                            debounce: {
                                default: 1000,
                            },
                        },
                    },
                ],
            },

            {
                className: 'col',
                fieldGroup: [
                    {
                        key: 'phone_number',
                        type: 'input',
                        className: 'col-5',
                        props: {
                            label: 'Phone Contact',
                            type: 'text',
                            placeholder: '+254712345678',
                            required: true,
                        },

                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 1000,
                            },
                        },
                    },
                    {
                        type: 'input',
                        key: 'email',
                        className: 'col-5 ms-auto',
                        props: {
                            label: 'Email',
                            pattern: '.+@.+..+',
                            placeholder: 'Email address',
                            required: true,
                        },

                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 1000,
                            },
                        },
                    },
                ],
            },
            {
                type: 'datepicker',
                key: 'dob',
                className: 'col-12 w-100',
                props: {
                    label: 'Date of Birth',
                    dateFormat: 'DD MMM, YYYY',
                    required: true,
                    max: moment(),
                },
            },
            {
                key: 'document_type',
                type: 'radio',
                className: 'col-12 mb-3',
                props: {
                    label: 'ID DOCUMENT TYPE',

                    inline: true,
                    required: true,
                    bindValue: 'value',
                    options: [
                        {
                            label: 'National ID',
                            value: 'nationalId',
                        },
                        {
                            label: 'Passport',
                            value: 'passportNumber',
                        },
                    ],
                },
            },
            {
                className: 'col-12',
                hideExpression: 'model.document_type !== "nationalId"',
                fieldGroup: [
                    {
                        type: 'file',
                        key: 'id_doc',
                        className: 'col-5',
                        props: {
                            label: 'National ID Document',
                            required: true,
                        },
                    },

                    {
                        type: 'input',
                        key: 'national_id',
                        className: 'col-5 ms-auto',
                        props: {
                            label: 'National ID',
                            required: true,
                        },

                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 1000,
                            },
                        },
                    },
                ],
            },
            {
                className: 'col-12',
                hideExpression: 'model.document_type !== "passportNumber"',
                fieldGroup: [
                    {
                        type: 'file',
                        key: 'passport_doc',
                        className: 'col-5',
                        props: {
                            label: 'PASSPORT DOCUMENT',
                            required: true,
                        },
                    },
                    {
                        type: 'input',
                        key: 'passport_no',
                        className: 'col-5 ms-auto',
                        props: {
                            label: 'Passport Number',
                            required: true,
                        },

                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 1000,
                            },
                        },
                    },
                ],
            },
            {
                className: 'col-12',
                fieldGroup: [
                    {
                        type: 'file',
                        key: 'kra_doc',
                        className: 'col-5',
                        props: {
                            label: 'KRA PIN DOCUMENT',
                            required: true,
                        },
                        modelOptions: {
                            debounce: {
                                default: 1000,
                            },
                        },
                    },
                    {
                        type: 'input',
                        key: 'kra_pin',
                        className: 'col-5 ms-auto',
                        props: {
                            label: 'KRA PIN NUMBER',
                            required: true,
                        },

                        modelOptions: {
                            updateOn: 'change',
                            debounce: {
                                default: 1000,
                            },
                        },
                    },
                ],
            },
            {
                type: 'button',
                key: 'deactivate',
                props: {
                    label: 'Deactivate Owner',
                    status: 'danger',
                    disabled: !this.component.model?.id,
                },
            },
        ];
    }
    /**
     * setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

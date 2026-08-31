import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable({
    providedIn: 'root',
})
export class MinimalPatientRegistrationFormFieldsService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Organisation ID
     */
    organisationID: string;

    fields() {
        return [
            {
                className: 'col-12 ms-0',
                fieldGroup: [
                    {
                        key: 'person.first_name',
                        type: 'input',
                        className: 'col-sm-12 p-sm-1',
                        props: {
                            label: 'First Name',
                            placeholder: 'Enter First Name',
                            required: true,
                            minLength: 3,
                        },
                        validation: {
                            messages: {
                                minLength: 'Name is too short',
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
                        key: 'person.last_name',
                        type: 'input',
                        className: 'col-sm-12 p-sm-1',
                        props: {
                            label: 'Last Name',
                            placeholder: 'Enter Last Name',
                            required: true,
                            minLength: 3,
                        },
                        validation: {
                            messages: {
                                minLength: 'Name is too short',
                            },
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                ],
            },
            {
                key: 'person.gender',
                type: 'select',
                className: 'col-7 me-2',
                props: {
                    placeholder: 'Gender',
                    label: 'Gender',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        { title: 'Male', value: 'MALE' },
                        { title: 'Female', value: 'FEMALE' },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },

            {
                key: 'person.person_contacts',
                type: 'repeat',
                fieldArray: {
                    fieldGroup: [
                        {
                            key: 'contact_type',
                            type: 'select',
                            className: 'd-none',
                            defaultValue: 'phone_number',
                            props: {
                                placeholder: 'Phone or Email',
                                label: 'Contact Type',
                                bindLabel: 'title',
                                bindValue: 'value',
                                options: [
                                    { title: 'Email', value: 'email' },
                                    {
                                        title: 'Phone Number',
                                        value: 'phone_number',
                                    },
                                ],
                                required: true,
                            },
                        },
                        {
                            key: 'contact',
                            type: 'phonenumber',
                            className: 'col-4',
                            props: {
                                label: 'Phone number',
                                placeholder: 'Enter phone number',
                                required: true,
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
            },
        ];
    }

    /**
     * Sets the form component
     */
    setComponent(component) {
        this.component = component;
    }
}

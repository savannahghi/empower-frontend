import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the form registration service
 */
export class FacilityContactFieldsService {
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     * Stores form data from api
     */
    model: Object;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'contact_type',
                type: 'select',
                className: 'col-12 pb-4',
                defaultValue: 'PHONE_NUMBER',
                props: {
                    label: 'Contact Type',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        { title: 'Email', value: 'EMAIL' },
                        {
                            title: 'Phone Number',
                            value: 'PHONE_NUMBER',
                        },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.contact_type': field => {
                        field.props.model = field.model?.contact_type;
                        return field.model?.contact_type;
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
                key: 'contact_value',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Contact',
                    placeholder: 'Enter Contact',
                    required: true,
                    type: 'email',
                },
                expressions: {
                    hide: field => {
                        return (
                            !field.model ||
                            field.model.contact_type === 'PHONE_NUMBER'
                        );
                    },
                    'model.contact_value': field => {
                        return field.model?.contact_value;
                    },
                },
                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 500,
                    },
                },
            },
            {
                key: 'contact_value',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Enter phone number',
                    placeholder: '+254000000000',
                    required: true,
                },
                expressions: {
                    hide: field => {
                        return (
                            !field.model || field.model.contact_type === 'EMAIL'
                        );
                    },
                    'model.contact_value': field => {
                        return field.model?.contact_value;
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
                key: 'role',
                type: 'select',
                className: 'col-12',
                defaultValue: '',
                props: {
                    label: 'Role',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        { title: 'Choose the role of the contact', value: '' },
                        {
                            title: 'Primary Contact',
                            value: 'PRIMARY_CONTACT',
                        },
                        {
                            title: 'Secondary Contact',
                            value: 'SECONDARY_CONTACT',
                        },
                    ],
                    searchable: true,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.role': field => {
                        field.props.model = field.model?.role;
                        return field.model?.role;
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
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

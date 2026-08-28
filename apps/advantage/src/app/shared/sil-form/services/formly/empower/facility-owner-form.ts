import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the form onboarding service
 */
export class FacilityOwnerService {
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     * Stores form data from api
     */
    model: any = {};

    /**
     * A list of professional user roles
     */
    specialists: Array<{ title: string; value: string }> = [];

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
                        key: 'first_name',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2',
                        props: {
                            label: 'First Name',
                            placeholder: 'Enter your first Name',
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
                        key: 'last_name',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2',
                        props: {
                            label: 'Last Name',
                            placeholder: 'Enter your last name',
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
                className: 'width-100p',
                fieldGroup: [
                    {
                        key: 'email',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2',
                        props: {
                            label: 'Email',
                            placeholder: 'Enter email',
                            required: true,
                            type: 'email',
                        },
                        expressions: {
                            'model.email': field => {
                                return field.model?.email;
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
                        key: 'phone',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2',
                        props: {
                            label: 'Phone number',
                            placeholder: '+254000000000',
                            required: true,
                            mask: '000 000 000',
                            prefix: '+254 ',
                        },
                        modelOptions: {
                            updateOn: 'change',
                            debounce: { default: 10 },
                        },
                        parsers: [
                            (value: string) => {
                                // Remove any formatting and return clean number
                                return value?.replace(/\s+/g, '') || '';
                            },
                        ],
                        hooks: {
                            onInit: field => {
                                const val = field.formControl?.value;
                                if (val && val.startsWith('+254')) {
                                    field.formControl.setValue(
                                        val.replace('+254', '').trim()
                                    );
                                }
                            },
                        },
                    },
                ],
            },
            {
                key: 'role',
                type: 'select',
                className: 'col-12 col-sm-6 px-sm-2',
                props: {
                    placeholder: 'Select your professional role',
                    label: 'Your Role',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [...this.specialists],
                    searchable: false,
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

        this.specialists = [
            { title: 'Doctor', value: 'DOCTOR' },
            { title: 'Nurse', value: 'NURSE' },
            { title: 'Clinical Officer', value: 'CO' },
            { title: 'Laboratory Technician', value: 'LT' },
            { title: 'Pharmacist', value: 'PHARMACIST' },
            { title: 'Physiotherapist', value: 'PHYSIO' },
            { title: 'Nutritionist', value: 'NU' },
            { title: 'Administrator', value: 'ADM' },
        ];
    }
}

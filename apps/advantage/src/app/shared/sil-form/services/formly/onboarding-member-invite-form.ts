import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the member invitation form service
 */
export class MemberInvitationService {
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
                key: 'member_email',
                type: 'input',
                className: 'col-12 col-sm-9 px-sm-2',
                props: {
                    label: 'Email',
                    placeholder: "Enter the member's email address",
                    required: true,
                    type: 'email',
                },
                expressions: {
                    'model.member_email': field => {
                        field.props.model = field.model?.member_email;
                        return field.model?.member_email;
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
                key: 'user_type',
                type: 'select',
                className: 'col-12 col-sm-3 px-sm-2',
                defaultValue: 'ADMIN',
                props: {
                    label: 'User type',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        { title: 'Choose the role of the contact', value: '' },
                        { title: 'Admin', value: 'ADMIN' },
                        {
                            title: 'Manager',
                            value: 'MANAGER',
                        },
                        {
                            title: 'Assitant',
                            value: 'ASSISTANT',
                        },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.user_type': field => {
                        field.props.model = field.model?.user_type;
                        return field.model?.user_type;
                    },
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 100,
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

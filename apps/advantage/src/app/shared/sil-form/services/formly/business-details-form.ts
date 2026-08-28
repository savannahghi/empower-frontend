import { Injectable } from '@angular/core';

export class BusinessDetailsRegistrationService {
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
     * Injectable for the form service
     */
    @Injectable({
        providedIn: 'root',
    })

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
                        key: 'business_type',
                        type: 'select',
                        className: 'col-12 col-sm-4 px-sm-2',
                        props: {
                            label: 'Business Type',
                            placeholder: 'Enter your business type',
                            bindLabel: 'title',
                            bindValue: 'value',
                            options: [
                                {
                                    title: 'LIMITED LIABILITY',
                                    value: 'LIMITED LIABILITY',
                                },
                                {
                                    title: 'PRIVATE PUBLIC PARTNERSHIP',
                                    value: 'PRIVATE PUBLIC PARTNERSHIP',
                                },
                                { title: 'GOVERNMENT', value: 'GOVERNMENT' },
                                {
                                    title: 'SOLE PROPRIETOR',
                                    value: 'SOLE PROPRIETOR',
                                },
                                { title: 'OTHER', value: 'OTHER' },
                            ],
                            searchable: false,
                            closeOnSelect: true,
                        },
                        expressions: {
                            'model.business_type': field => {
                                if (field?.model?.business_type) {
                                    return field?.model?.business_type;
                                }
                            },
                        },
                    },
                    {
                        key: 'ownership',
                        type: 'select',
                        className: 'col-12 col-sm-4 px-sm-2',

                        props: {
                            label: 'Ownership Type',
                            placeholder: 'Enter your ownership type',
                            bindLabel: 'title',
                            bindValue: 'value',
                            options: [
                                {
                                    title: 'PRIVATE FOR PROFIT',
                                    value: 'PRIVATE FOR PROFIT',
                                },
                                { title: 'PUBLIC', value: 'PUBLIC' },
                                {
                                    title: 'PRIVATE FOR NON PROFIT',
                                    value: 'PRIVATE FOR NON PROFIT',
                                },
                                { title: 'FAITH BASED', value: 'FAITH BASED' },
                                { title: 'NGO', value: 'NGO' },
                            ],
                            searchable: false,
                            closeOnSelect: true,
                        },
                        expressions: {
                            'model.ownership': field => {
                                if (field?.model?.ownership) {
                                    return field?.model?.ownership;
                                }
                            },
                        },
                    },

                    {
                        key: 'revenue_authority_pin',
                        type: 'input',
                        className:
                            'col-12 col-sm-4 px-sm-2 d-flex align-items-center',
                        props: {
                            label: 'Company KRA Pin',
                            placeholder: 'Enter KRA pin',
                        },
                    },
                    {
                        key: 'business_partner',
                        type: 'input',
                        className: 'hidden',
                        expressions: {
                            'model.business_partner': field => {
                                if (field?.model?.business_partner) {
                                    return field?.model?.business_partner;
                                }
                            },
                        },
                    },
                ],
            },
            {
                key: 'business_documents',
                type: 'table',
                className: 'col-12 col-sm-12 px-sm-2 pad-t-12 width-100p',
                props: {
                    label: 'Business Documents',
                    btnText: 'Add Business Documents',
                    description:
                        'Here we will collect information on the facility owners',
                },
            },
            {
                className: 'width-100p',
                fieldGroup: [
                    {
                        key: 'bank_name',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2 pad-t-12',
                        props: {
                            label: 'Bank Name',
                            placeholder: 'Enter your bank name',
                        },
                        expressions: {
                            'model.bank_name': field => {
                                if (field?.model?.bank_name) {
                                    return field?.model?.bank_name;
                                }
                            },
                        },
                    },
                    {
                        key: 'bank_branch',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2 pad-t-12 ',
                        props: {
                            label: 'Bank Branch Name',
                            placeholder: 'Enter your bank branch name',
                        },
                        expressions: {
                            'model.bank_branch': field => {
                                if (field?.model?.bank_branch) {
                                    return field?.model?.bank_branch;
                                }
                            },
                        },
                    },
                    {
                        key: 'account_name',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2 pad-t-12',
                        props: {
                            label: 'Bank Account Name',
                            placeholder: 'Enter your bank account name',
                        },
                        expressions: {
                            'model.account_name': field => {
                                if (field?.model?.account_name) {
                                    return field?.model?.account_name;
                                }
                            },
                        },
                    },
                    {
                        key: 'account_number',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2 pad-t-12',
                        props: {
                            label: 'Bank Account Number',
                            placeholder: 'Enter your bank account number',
                        },
                        expressions: {
                            'model.account_number': field => {
                                if (field?.model?.account_number) {
                                    return field?.model?.account_number;
                                }
                            },
                        },
                    },
                ],
            },
            {
                className: 'width-100p',
                fieldGroup: [
                    {
                        key: 'bank_documents',
                        type: 'table',
                        className: 'col-12 col-sm-12 px-sm-2 pad-t-12',
                        props: {
                            label: 'Bank Documents',
                            btnText: 'Add Bank Documents',
                            description:
                                'Here we will collect information on the facility payment details',
                        },
                    },
                ],
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}

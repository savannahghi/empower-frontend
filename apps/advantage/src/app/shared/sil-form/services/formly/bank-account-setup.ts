import { Injectable } from '@angular/core';

/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})
export class BankDetailsSetupService {
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
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'account_name',
                type: 'input',
                className: 'col-12 col-sm-12 px-sm-2 pad-t-12 width-100p',
                props: {
                    label: 'Account Name',
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
                key: 'account_description',
                type: 'input',
                className: 'col-12 col-sm-12 px-sm-2 pad-t-12 width-100p',
                props: {
                    label: 'Account Description',
                },
                expressions: {
                    'model.account_description': field => {
                        if (field?.model?.account_description) {
                            return field?.model?.account_description;
                        }
                    },
                },
            },
            {
                key: 'bank_name',
                type: 'input',
                className: 'col-12 col-sm-12 px-sm-2 pad-t-12 width-100p',
                props: {
                    label: 'Bank Name',
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
                key: 'branch',
                type: 'input',
                className: 'col-12 col-sm-12 px-sm-2 pad-t-12 width-100p',
                props: {
                    label: 'Bank Branch',
                },
                expressions: {
                    'model.branch': field => {
                        if (field?.model?.branch) {
                            return field?.model?.branch;
                        }
                    },
                },
            },
            {
                key: 'account_number',
                type: 'input',
                className: 'col-12 col-sm-12 px-sm-2 pad-t-12 width-100p',
                props: {
                    label: 'Account Number',
                },
                expressions: {
                    'model.account_number': field => {
                        if (field?.model?.account_number) {
                            return field?.model?.account_number;
                        }
                    },
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}

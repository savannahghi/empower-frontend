import { Injectable } from '@angular/core';

/**
 * Allows service to be injectable into formly commponent
 */
@Injectable({
    providedIn: 'root',
})

/** Class that definesform controls */
export class AddBankDetailsFormService {
    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'bank_name',
                type: 'input',
                className: 'col-6',
                props: {
                    label: 'Bank Name',
                    placeholder: 'Enter your bank name',
                },
            },
            {
                key: 'bank_branch',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    label: 'Bank Branch Name',
                    placeholder: 'Enter your bank branch name',
                },
            },
            {
                key: 'bank_account_name',
                type: 'input',
                className: 'col-6',
                props: {
                    label: 'Bank Account Name',
                    placeholder: 'Enter your bank account name',
                },
            },
            {
                key: 'account_number',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    label: 'Bank Account Number',
                    placeholder: 'Enter your bank account number',
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

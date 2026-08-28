import { Injectable } from '@angular/core';

/**
 * Allows service to be injectable into formly commponent
 */
@Injectable({
    providedIn: 'root',
})

/** Class that definesform controls */
export class AddBusinessDetailsFormService {
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
                key: 'legal_type',
                type: 'select',
                defaultValue: 'partnership',
                className: 'col-6',
                props: {
                    placeholder: 'Enter Legal Type',
                    label: 'Legal Type',
                    required: true,
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
                    bindValue: 'value',
                    bindLabel: 'title',
                    closeOnSelect: true,
                },
            },
            {
                key: 'ownership_type',
                type: 'select',
                defaultValue: 'private',
                className: 'ps-3 col-6',
                props: {
                    placeholder: 'Enter Ownership Type',
                    label: 'Ownership Type',
                    required: true,
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
                    bindValue: 'value',
                    bindLabel: 'title',
                    closeOnSelect: true,
                },
            },
            {
                key: 'legal_status',
                type: 'select',
                className: 'col-6',
                props: {
                    label: 'Legal Status',
                    placeholder: 'Enter legal status',
                    options: [
                        {
                            name: 'Licensed',
                            value: 'licensed',
                        },
                        {
                            name: 'Unlicensed',
                            value: 'unlicensed',
                        },
                        {
                            name: 'Suspended',
                            value: 'suspended',
                        },
                        {
                            name: 'Revoked',
                            value: 'revoked',
                        },
                        {
                            name: 'Pending Approval',
                            value: 'pending_approval',
                        },
                        {
                            name: 'Inactive',
                            value: 'inactive',
                        },
                        {
                            name: 'Probation',
                            value: 'probation',
                        },
                    ],
                    bindValue: 'value',
                    bindLabel: 'name',
                    closeOnSelect: true,
                },
            },
            {
                key: 'kra_pin',
                type: 'input',
                className: 'ps-3 col-6',
                props: {
                    label: 'Company KRA PIN',
                    placeholder: 'Enter company KRA PIN',
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

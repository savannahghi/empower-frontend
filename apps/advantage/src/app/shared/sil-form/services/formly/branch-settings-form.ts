import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class BranchSettingsService {
    /**
     *  component
     * @returns fields field information
     */
    component: any;

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                className: 'col-12 row',
                expressionProperties: {
                    template: model => {
                        const template = `<div class="row ms-2">
                        <label class="col-sm-12 mb-2 ms-1 label">
                          Setting:
                        </label>
                        <div class="col-sm-12 mb-4  ms-1">
                          ${model.description}
                        </div>
                        <label class="col-sm-12 mb-2 ms-1 label">
                          Default Setting:
                        </label>
                        <div class="col-sm-12 ms-1 mb-3">
                          ${model.default}
                        </div>
                    </div>`;
                        return template;
                    },
                },
            },
            {
                key: 'senderid',
                type: 'combobox',
                className: 'col-sm-12 mb-2',
                hideExpression: `model.name!=="billing:promotional_sender_id"`,
                props: {
                    placeholder: 'Search for SenderId',
                    label: 'SenderId Search',
                    store: 'sender-ids',
                    responseKey: 'results',
                    bindLabel: [
                        {
                            key: 'name',
                            class: 'me-1 mb-1',
                        },
                        {
                            key: 'sender_type',
                            label: 'Sender Type',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                    ],
                    extendParams: {
                        sender_type: 'PROMOTION',
                    },
                    bindValue: 'name',
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    clearSearchOnAdd: false,
                    loadingText: 'Searching senderid..',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                },
            },
            {
                key: 'senderid',
                type: 'combobox',
                className: 'col-sm-12 mb-2',
                hideExpression: `model.name!=="billing:transactional_sender_id"`,
                props: {
                    placeholder: 'Search for SenderId',
                    label: 'SenderId Search',
                    store: 'sender-ids',
                    responseKey: 'results',
                    bindLabel: [
                        {
                            key: 'name',
                            class: 'me-1 mb-1',
                        },
                        {
                            key: 'sender_type',
                            label: 'Sender Type',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                    ],
                    extendParams: {
                        sender_type: 'TRANSACTION',
                    },
                    bindValue: 'name',
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    clearSearchOnAdd: false,
                    loadingText: 'Searching senderid..',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                },
            },
            {
                key: 'value',
                bindValue: 'name',
                hideExpression: `model.name==="billing:transactional_sender_id" || model.name==="billing:promotional_sender_id" || model.name==="scheduling:appointment_reminder_timings" `,
                type: 'textarea',
                className: 'col-sm-12 mb-2',
                props: {
                    label: 'Current Setting',
                    required: true,
                },
            },
            {
                key: 'value',
                hideExpression: 'model.setting_type!=="list"',
                type: 'input',
                className: 'col-12 row ms-1 mt-3',
                props: {
                    type: 'number',
                    label: 'Current Setting',
                    required: true,
                },
                expressions: {
                    'model.value': field => {
                        if (field.model.value.length === 1) {
                            return field.model.value[0];
                        } else {
                            return field.model.value;
                        }
                    },
                },
            },
        ];
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

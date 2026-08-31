import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable({
    providedIn: 'root',
})
export class BillPatientFormFieldsService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores form data from api
     */
    model: Object;

    /**
     * Organisation ID
     */
    organisationID: string;

    /**
     * Fields loaded in formly form
     * @returns fileds used in the formly field form component
     */
    fields() {
        return [
            {
                key: 'patient',
                type: 'combobox',
                className: 'col-sm-12 mb-3',
                props: {
                    placeholder: 'Search for patient',
                    label: 'Patient Search (search by Name, Phone Number or ID)',
                    store: 'patients',
                    responseKey: 'results',
                    objectLabel: 'person',
                    bindLabel: [
                        {
                            key: 'person_display',
                            class: 'me-1 mb-1',
                        },
                        {
                            key: 'gender',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                        {
                            key: 'phone_number',
                            label: 'Phone number',
                            class: 'fs-13px',
                        },
                    ],
                    bindValue: null,
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    clearSearchOnAdd: false,
                    loadingText: 'Searching patients..',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                    modifyItemNotFound: true,
                    buttonText: 'Register New Patient',
                    buttonEvent: () => {
                        this.component.refresh?.emit();
                    },
                },
            },
            {
                key: 'queue',
                type: 'combobox',
                className: 'col-sm-12',
                props: {
                    placeholder: 'Select the billing point',
                    label: 'Select the billing point',
                    store: 'queues',
                    responseKey: 'results',
                    bindLabel: [
                        {
                            key: 'name',
                            class: 'me-1 mb-1',
                            newline: true,
                        },
                        {
                            key: 'queue_type',
                            label: 'Type',
                            class: 'text-muted fs-13px',
                        },
                    ],
                    bindValue: null,
                    hideSelected: true,
                    required: true,
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    loadingText: 'Searching billing points..',
                    typeToSearchText: 'Please enter 3 or more characters',
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

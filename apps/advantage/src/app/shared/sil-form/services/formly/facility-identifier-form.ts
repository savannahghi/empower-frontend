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
export class FacilityIdentifierFieldsService {
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
                key: 'identifier_type',
                type: 'select',
                className: 'col-12 col-sm-3 ps-sm-2',
                defaultValue: '',
                props: {
                    label: 'Identifier Type',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Select the type of identifier',
                            value: '',
                        },
                        { title: 'MFL Code', value: 'MFL_CODE' },
                        {
                            title: 'Slade Code',
                            value: 'SLADE_CODE',
                        },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.identifier_type': field => {
                        field.props.model = field.model?.identifier_type;
                        return field.model?.identifier_type;
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
                key: 'identifier_value',
                type: 'input',
                className: 'col-12 col-sm-3 px-sm-2',
                props: {
                    label: 'Identifier',
                    placeholder: 'Enter Identifier Value',
                    required: true,
                    type: 'text',
                },
                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 500,
                    },
                },
            },
            {
                key: 'valid_from',
                type: 'input',
                className: 'col-12 col-sm-3 px-sm-2',
                props: {
                    label: 'Valid from Date',
                    type: 'date',
                },
            },
            {
                key: 'valid_to',
                type: 'input',
                className: 'col-12 col-sm-3 pe-sm-2',
                props: {
                    label: 'Valid To date',
                    type: 'date',
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

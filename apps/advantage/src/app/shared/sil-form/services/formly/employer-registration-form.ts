import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})
export class EmployerRegistrationService {
    /**
     * Component reference to SilFormComponet
     * @returns fields information
     */
    component: any;

    /**
     * Stores form data from api
     */
    model: any = {};

    /**
     * payer types details input resolved from state
     */
    employerTypeDetails: any;

    constructor(public dataLayer: SilStoresService) {}

    /**
     * Fields loaded in the formly
     * @returns fields usedin the formly component
     */
    fields() {
        return [
            {
                className: 'width-100p',
                fieldGroup: [
                    {
                        key: 'name',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2',
                        props: {
                            label: 'Name',
                            placeholder: 'Enter name of employer',
                            required: true,
                        },
                        expressions: {
                            'model.name': field => {
                                if (field?.model?.name) {
                                    return field?.model?.name;
                                }
                            },
                        },
                    },
                    {
                        key: 'employer_type',
                        type: 'select',
                        className: 'col-12 col-sm-6 px-sm-2',
                        placeholder: 'Select the type of employer',
                        props: {
                            label: 'Employer Type',
                            options: [],
                            bindLabel: 'name',
                            bindValue: 'value',
                            required: true,
                            closeOnSelect: true,
                        },
                        expressions: {
                            'props.options': (field: FormlyFieldConfig) => {
                                field.props.options = this.employerTypeDetails;
                            },
                            'model.employer_type': field => {
                                if (field?.model?.employer_type) {
                                    return field?.model?.employer_type;
                                }
                            },
                        },
                    },
                ],
            },
            {
                key: 'description',
                type: 'textarea',
                className:
                    'col-12 input-flex-one px-sm-2 display-grid pad-t-12',
                props: {
                    label: 'Description',
                    placeholder: 'Enter the definition of the employer',
                    required: true,
                    className: 'label',
                    rows: 5,
                },
                expressions: {
                    'model.description': field => {
                        if (field?.model?.description) {
                            return field?.model?.description;
                        }
                    },
                },
            },
            {
                type: 'repeat',
                key: 'contacts',
                className: 'width-100p',
                fieldArray: {
                    fieldGroupClassName: 'col-12 m-0',
                    props: {
                        btnText: 'Add Contact',
                        hasIcon: true,
                        min: 1,
                        model: [],
                    },
                    fieldGroup: [
                        {
                            key: 'contact_type',
                            type: 'select',
                            className: 'col-12 col-sm-5 ps-sm-2',
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
                                    field.props.model =
                                        field.model?.contact_type;
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
                            className: 'col-12 col-sm-5 px-sm-2',
                            props: {
                                label: 'Enter email',
                                placeholder: 'Enter email',
                                required: true,
                                type: 'email',
                            },
                            expressions: {
                                hide: field => {
                                    return (
                                        !field.model ||
                                        field.model.contact_type ===
                                            'PHONE_NUMBER'
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
                            className: 'col-12 col-sm-5 px-sm-2',
                            props: {
                                label: 'Phone number',
                                placeholder: '+254000000000',
                                required: true,
                            },
                            expressions: {
                                hide: field => {
                                    return (
                                        !field.model ||
                                        field.model.contact_type === 'EMAIL'
                                    );
                                },
                                'model.contact_value': field => {
                                    return field.model?.contact_value;
                                },
                            },
                        },
                        {
                            key: 'role',
                            type: 'select',
                            className: 'col-12 col-sm-4 pe-sm-2',
                            props: {
                                label: 'Contact Role',
                                bindLabel: 'title',
                                bindValue: 'value',
                                placeholder: 'Select the role of the contact',
                                options: [
                                    {
                                        title: 'Primary Contact',
                                        value: 'PRIMARY_CONTACT',
                                    },
                                    {
                                        title: 'Secondary Contact',
                                        value: 'SECONDARY_CONTACT',
                                    },
                                ],
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
                        },
                    ],
                },
            },
            {
                type: 'repeat',
                key: 'identifiers',
                className: 'width-100p',
                fieldArray: {
                    fieldGroupClassName: 'col-12 m-0',
                    props: {
                        btnText: 'Add Identifier',
                        hasIcon: true,
                        min: 1,
                        model: [],
                    },
                    fieldGroup: [
                        {
                            key: 'identifier_type',
                            type: 'select',
                            className: 'col-12 col-sm-5 ps-sm-2',
                            defaultValue: 'SLADE_CODE',
                            props: {
                                label: 'Identifier Type',
                                bindLabel: 'title',
                                bindValue: 'value',
                                options: [
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
                                    field.props.model =
                                        field.model?.identifier_type;
                                    return field.model?.identifier_type;
                                },
                            },
                        },
                        {
                            key: 'identifier_value',
                            type: 'input',
                            className: 'col-12 col-sm-5 ps-sm-2',
                            props: {
                                label: 'Identifier',
                                placeholder: 'Enter Identifier Value',
                                required: true,
                                type: 'text',
                            },
                        },
                    ],
                },
            },
            {
                key: 'address',
                type: 'input',
                className: 'col-12 input-flex-one mb-4 display-grid pad-t-12',
                props: {
                    label: 'Payers Address',
                },
                expressions: {
                    'model.address': field => {
                        if (field?.model?.address) {
                            return field?.model?.address;
                        }
                    },
                },
            },
            {
                key: 'coordinates',
                type: 'coordinates',
                className: 'col-12 input-flex-one mt-4 display-grid pad-t-12',
                props: {
                    label: 'Update the facility location via dragging the red pin',
                    addMarker: model => {
                        this.model['latitude'] = model.lat;
                        this.model['longitude'] = model.lng;
                        this.model['coordinates'] = {
                            lat: model.lat,
                            lng: model.lng,
                        };
                    },
                },
                _expressionProperties: {
                    'model.latitude': {
                        expression: () => {
                            return this.model?.latitude;
                        },
                    },
                },
            },
            {
                className: 'width-100p',
                fieldGroup: [
                    {
                        key: 'latitude',
                        type: 'input',
                        className: 'col-12 col-sm-4 px-sm-2',
                        props: {
                            label: 'Latitude',
                            placeholder: 'Latitude',
                        },
                        expressions: {
                            'model.latitude': () => {
                                return this.model.latitude;
                            },
                        },
                    },
                    {
                        key: 'longitude',
                        type: 'input',
                        className: 'col-12 col-sm-4 px-sm-2',
                        props: {
                            label: 'Longitude',
                            placeholder: 'Longitude',
                        },
                        expressions: {
                            'model.longitude': () => {
                                return this.model.longitude;
                            },
                        },
                    },
                ],
            },
        ];
    }
    setComponent(component) {
        this.component = component;
        this.getEmployerTypes();
    }

    /**
     * getEmployerTypes
     * get employer types from api
     */
    getEmployerTypes() {
        this.dataLayer.list('category-elements').subscribe({
            next: (response: any) => {
                const employerTypeElements = response.results.filter(
                    element => {
                        return element.categories.some(
                            category => category.name === 'EMPLOYER TYPE'
                        );
                    }
                );

                this.employerTypeDetails = employerTypeElements.map(element => {
                    return { name: element.name, value: element.id };
                });
            },
        });
    }
}

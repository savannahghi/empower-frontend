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
export class FacilityRegistrationService {
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
     * A list of available counties
     */
    counties: Array<{ name: string; title: string }> = [];

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
                        key: 'name',
                        type: 'input',
                        className: 'col-12 col-sm-4 px-sm-2',
                        props: {
                            label: 'Name',
                            placeholder: 'Enter Facility Name',
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
                        key: 'facility_type',
                        type: 'select',
                        className: 'col-12 col-sm-4 px-sm-2',
                        placeholder: 'Select the type of facility',
                        props: {
                            label: 'Facility Type',
                            bindLabel: 'title',
                            bindValue: 'value',
                            options: [
                                { title: 'Hospital', value: 'HOSPITAL' },
                                { title: 'Clinic', value: 'CLINIC' },
                            ],
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            'model.facility_type': field => {
                                field.props.model = field.model?.facility_type;
                                return field.model?.facility_type;
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
                        key: 'categories',
                        type: 'select',
                        className: 'col-12 col-sm-4 px-sm-2',
                        placeholder: 'Select the categories of the facility',
                        props: {
                            label: 'Facility Categories',
                            multiple: true,
                            bindLabel: 'title',
                            bindValue: 'value',
                            options: [{ title: 'Empower', value: 'EMPOWER' }],
                            searchable: true,
                            closeOnSelect: true,
                            required: false,
                        },
                        expressions: {
                            'model.categories': field => {
                                field.props.model = field.model?.categories;
                                return field.model?.categories;
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
                key: 'description',
                type: 'textarea',
                className:
                    'col-12 input-flex-one px-sm-2 display-grid pad-t-12',
                props: {
                    label: 'Description',
                    placeholder: 'Enter the definition of the facility',
                    required: true,
                    className: 'label',
                    rows: 5,
                },
            },
            {
                type: 'repeat',
                key: 'contacts',
                className: 'width-100p',
                fieldArray: {
                    fieldGroupClassName: 'col-12 m-0',
                    props: {
                        btnText: 'Add Facility Contact',
                        min: 1,
                        model: [],
                    },
                    fieldGroup: [
                        {
                            key: 'contact_type',
                            type: 'select',
                            className: 'col-12 col-sm-4 ps-sm-2',
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
                            className: 'col-12 col-sm-4 px-sm-2',
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
                            className: 'col-12 col-sm-4 px-sm-2',
                            props: {
                                label: 'Enter phone number',
                                placeholder: '+254000000000',
                                required: true,
                                mask: '000 000 000',
                                prefix: '+254 ',
                            },
                            expressions: {
                                hide: field =>
                                    !field.model ||
                                    field.model.contact_type === 'EMAIL',
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
                            modelOptions: {
                                updateOn: 'blur',
                                debounce: {
                                    default: 2000,
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
                        btnText: 'Add Facility Identifier',
                        min: 1,
                        model: [],
                    },
                    fieldGroup: [
                        {
                            key: 'identifier_type',
                            type: 'select',
                            className: 'col-12 col-sm-3 ps-sm-2',
                            defaultValue: 'MFL_CODE',
                            props: {
                                label: 'Identifier Type',
                                bindLabel: 'title',
                                bindValue: 'value',
                                options: [
                                    { title: 'MFL Code', value: 'MFL_CODE' },
                                    {
                                        title: 'Slade Code',
                                        value: 'SLADE_CODE',
                                    },
                                    {
                                        title: 'SHA Slade Code',
                                        value: 'SHA_SLADE_CODE',
                                    },
                                    {
                                        title: 'Facility ID Code',
                                        value: 'FID_CODE',
                                    },
                                    {
                                        title: 'Facility Registry Code',
                                        value: 'FR_CODE',
                                    },
                                    {
                                        title: 'KMPDC Registration Number',
                                        value: 'KMPDC_REG_NUMBER',
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
                    ],
                },
            },
            {
                key: 'country',
                type: 'select',
                defaultValue: 'KE',
                className: 'col-12 col-sm-4 px-sm-2',
                props: {
                    label: 'Facility Country',
                    bindLabel: 'title',
                    bindValue: 'value',
                    placeholder: 'Select the Country',
                    options: [
                        { title: 'Kenya', value: 'KE' },
                        {
                            title: 'Tanzania',
                            value: 'TZ',
                        },
                        {
                            title: 'Uganda',
                            value: 'UG',
                        },
                    ],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.country': field => {
                        field.props.model = field.model?.country;
                        return field.model?.country;
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
                key: 'county',
                type: 'select',
                className: 'col-12 col-sm-4 px-sm-2',
                props: {
                    label: 'Facility County',
                    placeholder: 'Enter the facility county',
                    bindLabel: 'title',
                    bindValue: 'name',
                    options: this.counties,
                    searchable: true,
                    closeOnSelect: true,
                    required: true,
                },
                expressions: {
                    'model.county': field => {
                        field.props.model = field.model?.county;
                        return field.model?.county;
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
                key: 'address',
                type: 'input',
                className: 'col-12 col-sm-4 px-sm-2',
                props: {
                    label: 'Address',
                    placeholder: 'Enter the address of the facility',
                    required: true,
                },
                validation: {
                    messages: {
                        minLength: 'Address is too short',
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
                            required: true,
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
                            required: true,
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

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;

        this.counties = [
            {
                name: 'NAIROBI',
                title: 'Nairobi',
            },
            {
                name: 'NYAMIRA',
                title: 'Nyamira',
            },
            {
                name: 'KISII',
                title: 'Kisii',
            },
            {
                name: 'MIGORI',
                title: 'Migori',
            },
            {
                name: 'HOMA BAY',
                title: 'Homa Bay',
            },
            {
                name: 'KISUMU',
                title: 'Kisumu',
            },
            {
                name: 'SIAYA',
                title: 'Siaya',
            },
            {
                name: 'BUSIA',
                title: 'Busia',
            },
            {
                name: 'BUNGOMA',
                title: 'Bungoma',
            },
            {
                name: 'VIHIGA',
                title: 'Vihiga',
            },
            {
                name: 'KAKAMEGA',
                title: 'Kakamega',
            },
            {
                name: 'BOMET',
                title: 'Bomet',
            },
            {
                name: 'KERICHO',
                title: 'Kericho',
            },
            {
                name: 'KAJIADO',
                title: 'Kajiado',
            },
            {
                name: 'NAROK',
                title: 'Narok',
            },
            {
                name: 'NAKURU',
                title: 'Nakuru',
            },
            {
                name: 'LAIKIPIA',
                title: 'Laikipia',
            },
            {
                name: 'BARINGO',
                title: 'Baringo',
            },
            {
                name: 'NANDI',
                title: 'Nandi',
            },
            {
                name: 'ELGEYO MARAKWET',
                title: 'Elgeyo Marakwet',
            },
            {
                name: 'UASIN GISHU',
                title: 'Uasin Gishu',
            },
            {
                name: 'TRANS NZOIA',
                title: 'Trans Nzoia',
            },
            {
                name: 'SAMBURU',
                title: 'Samburu',
            },
            {
                name: 'WEST POKOT',
                title: 'West Pokot',
            },
            {
                name: 'TURKANA',
                title: 'Turkana',
            },
            {
                name: 'KIAMBU',
                title: 'Kiambu',
            },
            {
                name: 'MURANGA',
                title: 'Muranga',
            },
            {
                name: 'KIRINYAGA',
                title: 'Kirinyaga',
            },
            {
                name: 'NYERI',
                title: 'Nyeri',
            },
            {
                name: 'NYANDARUA',
                title: 'Nyandarua',
            },
            {
                name: 'MAKUENI',
                title: 'Makueni',
            },
            {
                name: 'MACHAKOS',
                title: 'Machakos',
            },
            {
                name: 'KITUI',
                title: 'Kitui',
            },
            {
                name: 'EMBU',
                title: 'Embu',
            },
            {
                name: 'THARAKA NITHI',
                title: 'Tharaka Nithi',
            },
            {
                name: 'MERU',
                title: 'Meru',
            },
            {
                name: 'ISIOLO',
                title: 'Isiolo',
            },
            {
                name: 'MARSABIT',
                title: 'Marsabit',
            },
            {
                name: 'MANDERA',
                title: 'Mandera',
            },
            {
                name: 'WAJIR',
                title: 'Wajir',
            },
            {
                name: 'GARISSA',
                title: 'Garissa',
            },
            {
                name: 'TAITA TAVETA',
                title: 'Taita Taveta',
            },
            {
                name: 'LAMU',
                title: 'Lamu',
            },
            {
                name: 'TANA RIVER',
                title: 'Tana River',
            },
            {
                name: 'KILIFI',
                title: 'Kilifi',
            },
            {
                name: 'Kwale',
                title: 'Kwale',
            },
            {
                name: 'MOMBASA',
                title: 'Mombasa',
            },
        ];
    }
}

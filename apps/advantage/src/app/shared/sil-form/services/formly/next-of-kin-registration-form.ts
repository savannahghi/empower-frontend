/**
 * List of import used in the injectable
 */
import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})
export class NextofKinRegistrationService {
    /**
     * Stores the loading state, with false as initial state
     */
    loading: boolean = false;

    /**
     * Stores the optionsLoaded state, with false as initial state
     */
    optionsLoaded: boolean = false;

    /**
     * Routing service
     */
    router: Router;

    /**
     * Stores form data from api
     */
    model: Object;

    /**
     * Stores user
     */
    user: Object;

    /** Used to calculate age */
    calculateAge: any;

    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     *
     * @param authConfig   Authorization service
     * @param _router  Router instance
     * @param datalayer datalayer service
     */

    constructor(
        public authConfig: Authorization,
        protected _router: Router,
        public datalayer: SilStoresService,
        public auth: AuthenticationService
    ) {
        this.router = _router;
        this.user = this.authConfig.getUser();
    }

    /**
     * object to store the relationships
     */
    RELATIONSHIP = [
        {
            title: 'CHILD',
            value: 'CHILD',
        },
        {
            title: 'PARENT',
            value: 'PRN',
        },
        {
            title: 'SPOUSE',
            value: 'SPS',
        },
        {
            title: 'SIBLING',
            value: 'SIB',
        },
        {
            title: 'COUSIN',
            value: 'COUSN',
        },
        {
            title: 'GRANDCHILD',
            value: 'GRNDCHILD',
        },
        {
            title: 'GRANDPARENT',
            value: 'GRPRN',
        },
        {
            title: 'GREAT GRANDPARENT',
            value: 'GGRPRN',
        },
        {
            title: 'FAMILY MEMBER',
            value: 'FAMMEMB',
        },
        {
            title: 'IN LAW',
            value: 'INLAW',
        },
        {
            title: 'DOMESTIC PARTNER',
            value: 'DOMPART',
        },
        {
            title: 'SIGNIFICANT OTHER',
            value: 'SIGOTHR',
        },
        {
            title: 'UNRELATED FRIEND',
            value: 'FRND',
        },
        {
            title: 'UNKNOWN',
            value: 'U',
        },
    ];

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                className: 'row col-12 ms-0',
                fieldGroup: [
                    {
                        key: 'first_name',
                        type: 'input',
                        className: 'col-12 col-sm col-xs-12 p-sm-1',
                        props: {
                            label: 'First Name',
                            placeholder: 'Enter First Name',
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
                        key: 'other_names',
                        type: 'input',
                        className: 'col-12 col-sm col-xs-12 p-sm-1',
                        props: {
                            label: 'Other Names',
                            placeholder: 'Enter Other Name(s)',
                            required: this.auth.checkSetting(
                                'patients:patient_full_name'
                            ),
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
                        key: 'last_name',
                        type: 'input',
                        className: 'col-12 col-sm col-xs-12 p-sm-1',
                        props: {
                            label: 'Last Name',
                            placeholder: 'Enter Last Name',
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
                ],
            },
            {
                className: 'row col-12 ms-0',
                fieldGroup: [
                    {
                        key: 'age',
                        className: 'col-12 col-xs-12 col-sm-4',
                        type: 'input',
                        props: {
                            type: 'number',
                            label: 'Age in years',
                            placeholder: 'Age',
                            required: false,
                        },
                        expressions: {
                            'model.date_of_birth': field => {
                                if (
                                    field.formControl.pristine === false &&
                                    field.model?.age
                                ) {
                                    this.calculateAge = {};
                                    this.calculateAge.yearNow = moment().year();
                                    this.calculateAge.yearOfBirth =
                                        this.calculateAge.yearNow -
                                        parseInt(field.model.age, 10);
                                    this.calculateAge.dob =
                                        this.calculateAge.yearOfBirth +
                                        '-01-01';
                                    return moment(this.calculateAge.dob);
                                }
                            },
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            helpText: 'Add age and the Dob will be calculated',
                            debounce: {
                                default: 10,
                            },
                        },
                    },
                    {
                        key: 'date_of_birth',
                        className: 'col-12 col-xs-12 col-sm-4 ps-sm-4',
                        type: 'datepicker',
                        props: {
                            type: 'text',
                            label: 'Date of Birth',
                            dateFormat: 'YYYY-MM-DD',
                            placeholder: 'YYYY-MM-DD',
                            required: false,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                    {
                        key: 'gender',
                        type: 'select',
                        className: 'ps-sm-4 col-12 col-xs-12 col-sm-4',
                        props: {
                            placeholder: 'Gender',
                            label: 'Gender',
                            bindLabel: 'title',
                            bindValue: 'value',
                            options: [
                                { title: 'Male', value: 'MALE' },
                                { title: 'Female', value: 'FEMALE' },
                            ],
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            'model.gender': field => {
                                this.model = field.model;
                                field.props.model = field.model.gender;
                                return field.model?.gender;
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
                className: 'row col-12 ms-0 mb-4',
                fieldGroup: [
                    {
                        key: 'relationship',
                        type: 'select',
                        className: 'col-12 col-xs-12 col-sm-4',
                        props: {
                            label: 'Relationship Status',
                            placeholder: 'Relationship',
                            bindLabel: 'title',
                            bindValue: 'value',
                            required: true,
                            options: this.RELATIONSHIP,
                            closeOnSelect: true,
                        },
                        expressions: {
                            'model.relationship': field => {
                                this.model = field.model;
                                field.props.model = field.model.relationship;
                                return field.model?.relationship;
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
                type: 'repeat',
                key: 'person_contacts',
                className: 'ms-2 width-100p',
                fieldArray: {
                    fieldGroupClassName: 'col-12 m-0',
                    props: {
                        btnText: `Add Related Person's Contact`,
                        min: 1,
                        model: [],
                    },
                    fieldGroup: [
                        {
                            key: 'contact_type',
                            type: 'select',
                            className: 'col-12 col-sm-4 ps-sm-1 pe-sm-2',
                            defaultValue: 'phone_number',
                            props: {
                                placeholder: 'Phone or Email',
                                label: 'Contact Type',
                                bindLabel: 'title',
                                bindValue: 'value',
                                options: [
                                    { title: 'Email', value: 'email' },
                                    {
                                        title: 'Phone Number',
                                        value: 'phone_number',
                                    },
                                ],
                                searchable: false,
                                closeOnSelect: true,
                                required: false,
                            },
                            expressions: {
                                'model.contact_type': field => {
                                    field.props.model =
                                        field.model?.contact_type;
                                    return field.model?.contact_type;
                                },
                                'props.disabled': field => {
                                    return field.parent.key === '0';
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
                            key: 'contact',
                            type: 'input',
                            className: 'col-12 col-sm-5 pe-sm-2',
                            props: {
                                label: 'Email',
                                placeholder: 'Enter Email',
                                required: false,
                                type: 'email',
                            },
                            expressions: {
                                hide: field => {
                                    return (
                                        !field.model ||
                                        field.model.contact_type ===
                                            'phone_number'
                                    );
                                },
                                'model.contact': field => {
                                    this.model = field.model;
                                    return field.model?.contact;
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
                            key: 'contact',
                            type: 'phonenumber',
                            className: 'col-12 col-sm-5 pe-sm-2',
                            props: {
                                label: 'Phone number',
                                placeholder: 'Enter phone number',
                                required: false,
                            },
                            expressions: {
                                hide: field => {
                                    return (
                                        !field.model ||
                                        field.model.contact_type === 'email'
                                    );
                                },
                                'model.contact': field => {
                                    this.model = field.model;
                                    /** First process in formating the number */
                                    if (field.model && field.model.contact) {
                                        return field.model?.contact;
                                    }
                                },
                            },
                            modelOptions: {
                                updateOn: 'change',
                                debounce: {
                                    default: 10,
                                },
                            },
                        },
                    ],
                },
            },
        ];
    }

    /**
     * Sets the form component
     */
    setComponent(component) {
        this.component = component;
    }
}

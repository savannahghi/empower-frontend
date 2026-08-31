/**
 * List of import used in the injectable
 */
import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { ErrorHandlerService } from '../../../sil-http-services/error-handler';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})
export class PractitionerRegistrationService {
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
     * clinic types details input resolved from state
     */
    clinicTypeDetails: any;

    /**
     * Stores the selectedclinic type
     */
    clinicType: any;

    /**
     *
     * @param authConfig   Authorization service
     * @param _router  Router instance
     * @param datalayer datalayer service
     */
    constructor(
        public authConfig: Authorization,
        protected _router: Router,
        public dataLayer: SilStoresService,
        public auth: AuthenticationService,
        private errorHandler: ErrorHandlerService
    ) {
        this.router = _router;
        this.user = this.authConfig.getUser();
    }

    /**
     * Male titles array
     */
    maleTitles = ['Mr'];

    /**
     * Female titles array
     */
    femaleTitles = ['Ms', 'Miss', 'Mrs', 'Sister'];

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
                        key: 'person.title',
                        type: 'select',
                        className: 'col-12 col-sm-2 col-xs-12 p-sm-1',
                        props: {
                            placeholder: 'Title',
                            label: 'Title',
                            bindLabel: 'title',
                            bindValue: 'value',
                            options: [
                                { title: 'Mr', value: 'Mr' },
                                { title: 'Ms', value: 'Ms' },
                                { title: 'Mrs', value: 'Mrs' },
                                { title: 'Miss', value: 'Miss' },
                                { title: 'Dr', value: 'Dr' },
                                { title: 'Prof', value: 'Prof' },
                            ],
                            searchable: false,
                            closeOnSelect: true,
                            required: false,
                        },
                        expressions: {
                            'model.title': field => {
                                this.model = field.model;
                                field.props.model = field.model.title;
                                return field.model.person?.title;
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
                        key: 'person.first_name',
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
                        key: 'person.other_names',
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
                        key: 'person.last_name',
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
                        key: 'qualification',
                        type: 'select',
                        className: 'col-12 p-sm-1',
                        props: {
                            placeholder: 'Please select the clinic type',
                            label: 'Clinic Type',
                            required: true,
                            options: [],
                            bindLabel: 'clinic',
                            bindValue: 'value',
                            searchable: true,
                            closeOnSelect: true,
                        },
                        expressions: {
                            'props.options': (field: FormlyFieldConfig) => {
                                field.props.options = this.clinicTypeDetails;
                            },
                            'model.qualification': field => {
                                this.model = field.model;
                                field.props.model = field.model.qualification;
                                return field.model.qualification;
                            },
                        },
                    },
                ],
            },
            {
                type: 'repeat',
                key: 'person.person_contacts',
                className: 'row col-12 ms-2 width-100p',
                fieldArray: {
                    fieldGroupClassName: 'col-12 m-0',
                    props: {
                        btnText: 'Add Practitioner Contact',
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
                                required: true,
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
                                required: true,
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
                                    if (field.model && field.model.contact) {
                                        return field.model?.contact;
                                    }
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
                                required: true,
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
        this.getClinicTypes();
    }

    /**
     * getClinicTypes
     * Gets the clinic types from the api
     */
    getClinicTypes() {
        this.dataLayer.list('specialties').subscribe({
            next: (response: any) => {
                const arr = response;
                this.clinicTypeDetails = arr.map(value => {
                    return { clinic: value, value: value };
                });
            },
        });
    }
}

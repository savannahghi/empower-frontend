import { Injectable } from '@angular/core';
import { Observable, Subject, concat, of } from 'rxjs';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    startWith,
    switchMap,
    tap,
} from 'rxjs/operators';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';

/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the form sign up service
 */
export class SigningUpService {
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
     * Used to control loading for search
     */
    loading: boolean = false;

    /**
     * Observable that loads the facilityType
     */
    facilityType$: Observable<any>;

    /**
     * Subject that checks the facility type
     */
    facilityTypeInput$ = new Subject<string>();

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(private dataLayer: SilStoresService) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                className: 'width-100p mb-1',
                fieldGroup: [
                    {
                        key: 'facility_name',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-4',
                        props: {
                            label: 'Facility Name',
                            placeholder: 'Equity Afia',
                            required: true,
                        },
                        expressions: {
                            'model.facility_name': field => {
                                field.props.model = field.model?.facility_name;
                                return field.model?.facility_name;
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
                        className: 'col-12 col-sm-6 px-sm-4',
                        props: {
                            label: 'Facility Type',
                            placeholder: 'Select your facility type',
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
                ],
            },
            {
                className: 'width-100p mb-2',
                fieldGroup: [
                    {
                        key: 'email_address',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-4',
                        props: {
                            label: 'Email Address',
                            placeholder: 'Enter your email address',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 2000,
                            },
                        },
                        expressions: {
                            'model.email_address': field => {
                                field.props.model = field.model?.email_address;
                                return field.model?.email_address;
                            },
                        },
                    },
                    {
                        key: 'phone_number',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-4',
                        props: {
                            label: 'Phone Number',
                            placeholder: 'Enter your phone number',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 2000,
                            },
                        },
                        expressions: {
                            'model.phone_number': field => {
                                field.props.model = field.model?.phone_number;
                                return field.model?.phone_number;
                            },
                        },
                    },
                ],
            },
            {
                className: 'width-100p mb-2',
                fieldGroup: [
                    {
                        key: 'first_name',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-4',
                        props: {
                            label: 'First Name',
                            placeholder: 'Enter your first name',
                            required: true,
                        },
                        expressions: {
                            'model.first_name': field => {
                                field.props.model = field.model?.first_name;
                                return field.model?.first_name;
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
                        className: 'col-12 col-sm-6 px-sm-4',
                        props: {
                            label: 'Last Name',
                            placeholder: 'Enter your last name',
                            required: true,
                        },
                        expressions: {
                            'model.last_name': field => {
                                field.props.model = field.model?.last_name;
                                return field.model?.last_name;
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
                className: 'width-100p mb-2',
                fieldGroup: [
                    {
                        key: 'password',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-4',
                        props: {
                            label: 'Create Password',
                            placeholder: 'Enter your password',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 2000,
                            },
                        },
                        expressions: {
                            'model.password': field => {
                                field.props.model = field.model?.password;
                                return field.model?.password;
                            },
                        },
                    },
                    {
                        key: 'confirm_password',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-4',
                        props: {
                            label: 'Confirm Password',
                            placeholder: 'Repeat your password',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 2000,
                            },
                        },
                        expressions: {
                            'model.confirm_password': field => {
                                field.props.model =
                                    field.model?.confirm_password;
                                return field.model?.confirm_password;
                            },
                        },
                    },
                ],
            },
            {
                key: 'terms',
                type: 'checkbox',
                className: 'col-12 row px-sm-4',
                props: {
                    label: 'I agree to the Privacy Policy & Terms and Conditions',
                    required: true,
                },
                expressions: {
                    'model.terms': field => {
                        return field.model.terms;
                    },
                },
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.loadFacilityTypes();
    }

    /**
     *  tapFunction
     * Shows that the typeahead is loading
     */
    tapFunction = () => (this.loading = true);

    /**
     *  tapLoading
     * Shows that the typeahead has stopped loading
     */
    tapLoading = () => (this.loading = false);

    /**
     *  responseFunction
     * Returns the results from patients api
     */
    responseFunction = resp => resp['results'];

    /**
     *  catchErrorFunction
     * Catches the error from the typeahead
     */
    catchErrorFunction = () => of([]);

    /**
     *  switchMapFacilityTypeFunction
     * Gets the facility types using the getFacilityTypes function
     */
    switchMapFacilityTypesFunction = () =>
        this.getFacilityTypes().pipe(
            catchError(this.catchErrorFunction), // empty list on error
            tap(this.tapLoading)
        );

    /**
     *  getFacilityTypes
     * Gets the facility types from the api
     */
    getFacilityTypes(): Observable<any> {
        const params = {};
        return this.dataLayer
            .list('business-partners', params)
            .pipe(map(this.responseFunction));
    }

    /**
     *  loadFacilityTypes
     * Loads the facility types using a subject and term searched by
     */
    loadFacilityTypes() {
        this.facilityType$ = concat(
            of([' ']), // default items
            this.facilityTypeInput$.pipe(
                startWith(''),
                distinctUntilChanged(),
                debounceTime(800),
                tap(this.tapFunction),
                switchMap(this.switchMapFacilityTypesFunction)
            )
        );
    }
}

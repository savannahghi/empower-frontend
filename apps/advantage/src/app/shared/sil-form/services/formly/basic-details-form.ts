import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
export class BasicDetailsService {
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
     * Observable that loads the businessPartners
     */
    businessPartners$: Observable<any>;

    /**
     * Subject that checks the provider search
     */
    businessPartnersInput$ = new Subject<string>();

    /**
     * Toggle is loading businessPartners
     */
    loadingbusinessPartners: any;

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
                className: 'width-100p',
                fieldGroup: [
                    {
                        key: 'provider_name',
                        type: 'input',
                        className: 'col-12 col-sm-4 px-sm-2',
                        props: {
                            label: 'Provider Name',
                            placeholder: 'Enter the provider name',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                    {
                        key: 'branch',
                        type: 'input',
                        className: 'col-12 col-sm-4 px-sm-2',
                        props: {
                            label: 'Branch',
                            placeholder: 'Enter the provider branch',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                    {
                        key: 'provider_email',
                        type: 'input',
                        className: 'col-12 col-sm-4 px-sm-2',
                        props: {
                            label: 'Provider Email',
                            placeholder: 'Enter your email',
                            required: true,
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
                className: 'width-100p',
                fieldGroup: [
                    {
                        key: 'phone_contact',
                        type: 'input',
                        className: 'col-12 col-sm-4 px-sm-2',
                        props: {
                            label: 'Phone Contact',
                            placeholder: 'Enter the provider contact',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                    {
                        key: 'legal_status',
                        type: 'input',
                        className: 'col-12 col-sm-4 px-sm-2',
                        props: {
                            label: 'Legal Status',
                            placeholder: 'Enter your legal status',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                    {
                        key: 'ownership_type',
                        type: 'input',
                        className: 'col-12 col-sm-4 px-sm-2',
                        props: {
                            label: 'Ownership Type',
                            placeholder: 'Enter your ownership type',
                            required: true,
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
                className: 'width-100p mt-4',
                fieldGroup: [
                    {
                        key: 'facility_type',
                        type: 'input',
                        className: 'col-12 col-sm-4 px-sm-2',
                        props: {
                            label: 'Facility Type',
                            placeholder: 'Enter your facility type',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                    {
                        key: 'county',
                        type: 'input',
                        className: 'col-12 col-sm-4 px-sm-2',
                        props: {
                            label: 'County',
                            placeholder: 'Enter your county',
                            required: true,
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                    {
                        key: 'provider_logo',
                        type: 'input',
                        className: 'col-12 col-sm-4 px-sm-2',
                        props: {
                            label: 'Provider Logo',
                            placeholder: 'Choose file',
                            required: true,
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
                        className: 'col-12 input-flex-one mt-4',
                        props: {
                            label: 'Update the facility location via dragging the red pin',
                            class: 'ps-2 pe-3',
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
                            },
                            {
                                key: 'longitude',
                                type: 'input',
                                className: 'col-12 col-sm-4 px-sm-2',
                                props: {
                                    label: 'Longitude',
                                    placeholder: 'Longitude',
                                },
                            },
                        ],
                    },
                ],
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
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}

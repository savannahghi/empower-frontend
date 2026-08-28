import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the form onboarding service
 */
export class FacilityOnboardingService {
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
     * A list of professional user roles
     */
    specialists: Array<{ title: string; value: string }> = [];

    // Check if all required fields are valid
    validateRequiredFields(form: any): boolean {
        if (!form) return false;

        const requiredFields = [
            'first_name',
            'last_name',
            'user_email',
            'user_phone_number',
            'role',
            'facility_name',
            'mfl_code',
            'facility_type',
            'county',
        ];

        for (const field of requiredFields) {
            const control = form.get(field);
            const isValid = control && !control.invalid && control.value;
            if (!isValid) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get the Terms of Service URL dynamically based on the current application URL
     * @returns The Terms of Service URL
     */
    getTosUrl(): string {
        const origin = window.location.origin;

        return `${origin}/tos/document`;
    }

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'section_heading',
                type: 'template',
                template: `<h6 class="fw-bold pb-1 my-4 mx-2">
                        <span class="me-1"><i class="fas fa-user"></i></span>
                        Personal Information
                    </h6>`,
                className: 'col-12',
            },
            {
                className: 'width-100p',
                fieldGroup: [
                    {
                        key: 'first_name',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2',
                        props: {
                            label: 'First Name',
                            placeholder: 'Enter your first Name',
                            required: true,
                            minLength: 3,
                        },
                        validation: {
                            messages: {
                                minLength: 'Name is too short',
                                required: 'First name is required',
                            },
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 500,
                            },
                        },
                    },
                    {
                        key: 'last_name',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2',
                        props: {
                            label: 'Last Name',
                            placeholder: 'Enter your last name',
                            required: true,
                            minLength: 3,
                        },
                        validation: {
                            messages: {
                                minLength: 'Name is too short',
                                required: 'Last name is required',
                            },
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 500,
                            },
                        },
                    },
                ],
            },
            {
                className: 'width-100p',
                fieldGroup: [
                    {
                        key: 'user_email',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2',
                        props: {
                            label: 'Email',
                            placeholder: 'Enter email',
                            required: true,
                            type: 'email',
                        },
                        validators: {
                            email: {
                                expression: (c: FormControl) => {
                                    if (!c.value) return true;
                                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                        c.value
                                    );
                                },
                                message: 'Please enter a valid email address',
                            },
                        },
                        validation: {
                            messages: {
                                required: 'Email is required',
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
                        key: 'user_phone_number',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2',
                        props: {
                            label: 'Phone number',
                            placeholder: '+254000000000',
                            required: true,
                            mask: '000 000 000',
                            prefix: '+254 ',
                        },
                        validation: {
                            messages: {
                                required: 'Phone number is required',
                            },
                        },
                        modelOptions: {
                            updateOn: 'change',
                            debounce: { default: 10 },
                        },
                        parsers: [
                            (value: string) => {
                                return value?.replace(/\s+/g, '') || '';
                            },
                        ],
                    },
                ],
            },
            {
                key: 'role',
                type: 'select',
                className: 'col-12 col-sm-6 px-sm-2',
                props: {
                    placeholder: 'Select your professional role',
                    label: 'Your Role',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [...this.specialists],
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                },
                validation: {
                    messages: {
                        required: 'Role is required',
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
                key: 'section_heading',
                type: 'template',
                template:
                    '<hr class="mt-3 mb-5 mx-2"><h6 class="fw-bold pb-1 my-4 mx-2"><span class="me-1"><i class="fas fa-hospital"></i></span>Facility Information</h6>',
                className: 'col-12',
            },
            {
                className: 'width-100p',
                fieldGroup: [
                    {
                        key: 'facility_name',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2',
                        props: {
                            label: 'Facility Name',
                            placeholder: 'Enter Facility Name',
                            required: true,
                            minLength: 3,
                        },
                        validation: {
                            messages: {
                                minLength: 'Name is too short',
                                required: 'Facility name is required',
                            },
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            debounce: {
                                default: 500,
                            },
                        },
                    },
                    {
                        key: 'mfl_code',
                        type: 'input',
                        className: 'col-12 col-sm-6 px-sm-2',
                        props: {
                            label: 'MFL Code',
                            placeholder: 'Enter MFL code',
                            required: true,
                            type: 'text',
                        },
                        validation: {
                            messages: {
                                required: 'MFL code is required',
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
                        key: 'facility_type',
                        type: 'select',
                        className: 'col-12 col-sm-6 px-sm-2',
                        props: {
                            label: 'Facility Type',
                            placeholder: 'Select facility type',
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
                        validation: {
                            messages: {
                                required: 'Facility type is required',
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
                        key: 'county',
                        type: 'select',
                        className: 'col-12 col-sm-6 px-sm-2',
                        props: {
                            label: 'Facility County',
                            placeholder: 'Select the facility county',
                            bindLabel: 'title',
                            bindValue: 'name',
                            options: this.counties,
                            searchable: true,
                            closeOnSelect: true,
                            required: true,
                        },
                        validation: {
                            messages: {
                                required: 'County is required',
                            },
                        },
                        modelOptions: {
                            updateOn: 'change',
                            debounce: {
                                default: 500,
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
                    placeholder: 'Please describe the facility',
                    required: false,
                    className: 'label',
                    rows: 5,
                },
            },
            {
                key: 'terms_section_heading',
                type: 'template',
                props: {
                    template: `<hr class="mt-3 mb-5 mx-2 fw-semibold">
                    <h6 class="pb-1 my-4 mx-2">
                    <a
                        class="text-decoration-none text-primary"
                        status="primary"
                        role="button"
                        target="_blank"
                        href="${this.getTosUrl()}"
                        ><span class="me-1"><i class="fas fa-file"></i></span>Terms and Conditions</a
                    >
                    </h6>
                    `,
                },
                className: 'col-12',
            },
            {
                key: 'agreed_to_terms',
                type: 'checkbox',
                className: 'col-12 mx-2',
                props: {
                    label: 'I have read and agree to the terms and conditions above',
                    required: true,
                },
                hooks: {
                    onInit: field => {
                        if (field.form) {
                            field.form.valueChanges.subscribe(() => {
                                const isFormValidInSubscription =
                                    this.validateRequiredFields(field.form);
                                field.props.disabled =
                                    !isFormValidInSubscription;

                                field.options.detectChanges?.();
                            });

                            const isFormValid = this.validateRequiredFields(
                                field.form
                            );
                            field.props.disabled = !isFormValid;
                        }
                    },
                },
                expressions: {
                    'props.change':
                        'model.agreed_to_terms !== undefined ? (field.options.parentComponent.onTermsChange({checked: model.agreed_to_terms})) : null',
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;

        this.counties = [
            { name: 'NAIROBI', title: 'Nairobi' },
            { name: 'NYAMIRA', title: 'Nyamira' },
            { name: 'KISII', title: 'Kisii' },
            { name: 'MIGORI', title: 'Migori' },
            { name: 'HOMA BAY', title: 'Homa Bay' },
            { name: 'KISUMU', title: 'Kisumu' },
            { name: 'SIAYA', title: 'Siaya' },
            { name: 'BUSIA', title: 'Busia' },
            { name: 'BUNGOMA', title: 'Bungoma' },
            { name: 'VIHIGA', title: 'Vihiga' },
            { name: 'KAKAMEGA', title: 'Kakamega' },
            { name: 'BOMET', title: 'Bomet' },
            { name: 'KERICHO', title: 'Kericho' },
            { name: 'KAJIADO', title: 'Kajiado' },
            { name: 'NAROK', title: 'Narok' },
            { name: 'NAKURU', title: 'Nakuru' },
            { name: 'LAIKIPIA', title: 'Laikipia' },
            { name: 'BARINGO', title: 'Baringo' },
            { name: 'NANDI', title: 'Nandi' },
            { name: 'ELGEYO MARAKWET', title: 'Elgeyo Marakwet' },
            { name: 'UASIN GISHU', title: 'Uasin Gishu' },
            { name: 'TRANS NZOIA', title: 'Trans Nzoia' },
            { name: 'SAMBURU', title: 'Samburu' },
            { name: 'WEST POKOT', title: 'West Pokot' },
            { name: 'TURKANA', title: 'Turkana' },
            { name: 'KIAMBU', title: 'Kiambu' },
            { name: 'MURANGA', title: 'Muranga' },
            { name: 'KIRINYAGA', title: 'Kirinyaga' },
            { name: 'NYERI', title: 'Nyeri' },
            { name: 'NYANDARUA', title: 'Nyandarua' },
            { name: 'MAKUENI', title: 'Makueni' },
            { name: 'MACHAKOS', title: 'Machakos' },
            { name: 'KITUI', title: 'Kitui' },
            { name: 'EMBU', title: 'Embu' },
            { name: 'THARAKA NITHI', title: 'Tharaka Nithi' },
            { name: 'MERU', title: 'Meru' },
            { name: 'ISIOLO', title: 'Isiolo' },
            { name: 'MARSABIT', title: 'Marsabit' },
            { name: 'MANDERA', title: 'Mandera' },
            { name: 'WAJIR', title: 'Wajir' },
            { name: 'GARISSA', title: 'Garissa' },
            { name: 'TAITA TAVETA', title: 'Taita Taveta' },
            { name: 'LAMU', title: 'Lamu' },
            { name: 'TANA RIVER', title: 'Tana River' },
            { name: 'KILIFI', title: 'Kilifi' },
            { name: 'Kwale', title: 'Kwale' },
            { name: 'MOMBASA', title: 'Mombasa' },
        ];

        this.specialists = [
            { title: 'Doctor', value: 'DOCTOR' },
            { title: 'Nurse', value: 'NURSE' },
            { title: 'Clinical Officer', value: 'CO' },
            { title: 'Laboratory Technician', value: 'LT' },
            { title: 'Pharmacist', value: 'PHARMACIST' },
            { title: 'Physiotherapist', value: 'PHYSIO' },
            { title: 'Nutritionist', value: 'NU' },
            { title: 'Administrator', value: 'ADM' },
        ];
    }
}

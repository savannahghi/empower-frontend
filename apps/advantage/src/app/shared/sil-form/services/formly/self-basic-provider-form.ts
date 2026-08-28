import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { ErrorHandlerService } from '../../../sil-http-services/error-handler';
import _ from 'underscore';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { ProviderOnboardingService } from '../../../../features/onboarding/onboarding-stepper/onboarding-stepper.service';

@Injectable({
    providedIn: 'root',
})
export class BasicProviderFieldsService {
    minTermLength: number;
    checkHappening: boolean;
    loading: boolean = false;
    branchesLoading: boolean = false;
    optionsLoaded: boolean = false;
    patchLoading: boolean = false;
    user: Object;
    field: FormlyFieldConfig;
    term: string;
    model: Object;
    component: any;

    constructor(
        private dataLayer: SilStoresService,
        public authConfig: Authorization,
        private errorHandler: ErrorHandlerService,
        public onboardingService: ProviderOnboardingService
    ) {
        this.user = this.authConfig.getUser();
    }

    fields() {
        return [
            {
                key: 'slade_code',
                type: 'input',
                className: 'hidden',
                props: {
                    label: 'Slade code',
                    disabled: true,
                    placeholder: 'Slade code',
                },
                defaultValue: this.authConfig.getUser().business_partner,
            },
            {
                className: 'col-12 row ps-3  pt-3',
                fieldGroup: [
                    {
                        key: 'name',
                        type: 'input',
                        className: 'col-sm-7',
                        props: {
                            label: 'Organisation Name',
                            placeholder: 'Organisation Name',
                        },
                    },
                    {
                        key: 'branch_name',
                        type: 'input',
                        className: 'px-4 pe-0 col-sm-5',
                        props: {
                            label: 'Branch Name',
                            type: 'text',
                            placeholder: 'Branch',
                            required: true,
                        },
                        expressions: {
                            'model.branch_name': field => {
                                if (
                                    field.formControl.pristine === false &&
                                    field.formControl.touched === true
                                ) {
                                    // checks if defaultValue has been set
                                    if (
                                        !_.isUndefined(
                                            field.model[field.key]
                                        ) &&
                                        field.defaultValue !==
                                            field.model[field.key]
                                    ) {
                                        this.patchField(field.model);
                                        field.formControl.markAsUntouched();
                                        return field.model.branch_name;
                                    }
                                } else {
                                    // set model if it already defined
                                    if (field.model[field.key]) {
                                        return field.model[field.key];
                                    }
                                }
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
                className: 'col-12 row ps-3 ',
                fieldGroup: [
                    {
                        type: 'input',
                        key: 'email_address',
                        className: 'col-sm-6',
                        props: {
                            label: 'Organisation Email',
                            pattern: '.+@.+..+',
                            placeholder: 'Email address',
                            required: true,
                        },
                        expressions: {
                            'model.email_address': field => {
                                this.model = field.model;
                                if (field.formControl.pristine === false) {
                                    if (
                                        !_.isUndefined(
                                            field.model.email_address
                                        ) &&
                                        field.formControl.touched === true &&
                                        field.defaultValue !==
                                            field.model.email_address
                                    ) {
                                        this.patchOrgField(field.model);
                                        field.formControl.markAsPristine();
                                        return field.model.email_address;
                                    }
                                    if (
                                        field.email_address &&
                                        !field.model.email_address
                                    ) {
                                        this.patchOrgField(field.model);
                                        return field.model.email_address;
                                    }
                                } else {
                                    return field.model.email_address;
                                }
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
                        key: 'preferred_contact',
                        type: 'input',
                        className: 'px-4 pe-0 col-sm-6',
                        props: {
                            label: 'Preferred Phone Contact',
                            type: 'text',
                            placeholder: '+254712345678',
                            required: true,
                        },
                        expressions: {
                            'model.preferred_contact': field => {
                                if (field.formControl.pristine === false) {
                                    if (
                                        !_.isUndefined(
                                            field.model.preferred_contact
                                        ) &&
                                        field.formControl.touched === true &&
                                        field.defaultValue !==
                                            field.model.preferred_contact
                                    ) {
                                        this.patchField(field.model);
                                        field.formControl.markAsPristine();
                                        return field.model.preferred_contact;
                                    }
                                    if (
                                        field.preferred_contact &&
                                        !field.model.preferred_contact
                                    ) {
                                        this.patchField(field.model);
                                        return field.model.preferred_contact;
                                    }
                                } else {
                                    return field.model.preferred_contact;
                                }
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
                className: 'col-12 row ps-3 ',
                fieldGroup: [
                    {
                        key: 'county_name',
                        type: 'select',
                        className: 'col-sm-6',
                        props: {
                            label: 'County',
                            bindLabel: 'title',
                            bindValue: 'name',
                            options: [
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
                            ],
                            searchable: true,
                            multiple: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            'model.county_name': field => {
                                this.determineModelAction(field.model, field);
                            },
                        },
                        modelOptions: {
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                    {
                        key: 'physical_address',
                        type: 'input',
                        className: 'px-4 pe-0 col-sm-6',
                        props: {
                            label: 'Physical Address',
                            placeholder: 'Enter your physical address...',
                            required: true,
                        },
                        expressions: {
                            'model.physical_address': field => {
                                this.model = field.model;
                                if (field.formControl.pristine === false) {
                                    if (
                                        !_.isUndefined(
                                            field.model.physical_address
                                        ) &&
                                        field.formControl.touched === true &&
                                        field.defaultValue !==
                                            field.model.physical_address
                                    ) {
                                        this.patchOrgField(field.model);
                                        field.formControl.markAsPristine();
                                        return field.model.physical_address;
                                    }
                                    if (
                                        field.physical_address &&
                                        !field.model.physical_address
                                    ) {
                                        this.patchOrgField(field.model);
                                        return field.model.physical_address;
                                    }
                                } else {
                                    return field.model.physical_address;
                                }
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
                className: 'col-12 row ps-3 ',
                fieldGroup: [
                    {
                        key: 'legal_status',
                        type: 'select',
                        className: 'col-sm-6',
                        props: {
                            label: 'Legal Status',
                            bindLabel: 'title',
                            bindValue: 'value',
                            options: [
                                {
                                    title: 'Sole Proprietor',
                                    value: 'SOLE PROPRIETOR',
                                },
                                {
                                    title: 'Limited Liability',
                                    value: 'LIMITED LIABILITY',
                                },
                                {
                                    title: 'Private Public Partnership',
                                    value: 'PRIVATE PUBLIC PARTNERSHIP',
                                },
                                { title: 'Government', value: 'GOVERNMENT' },
                                { title: 'Other', value: 'OTHER' },
                            ],
                            searchable: false,
                            multiple: false,
                            closeOnSelect: true,
                            required: false,
                        },
                        expressions: {
                            'model.legal_status': field => {
                                if (field.formControl.touched === true) {
                                    this.onboardingService.refreshComponent(
                                        field.model
                                    );
                                }
                                this.determineModelAction(field.model, field);
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
                        key: 'ownership_type',
                        type: 'select',
                        className: 'px-4 pe-0 col-sm-6',
                        props: {
                            label: 'Ownership Type',
                            bindLabel: 'title',
                            bindValue: 'value',
                            options: [
                                { title: 'Public', value: 'Public' },
                                {
                                    title: 'Private For Profit',
                                    value: 'Private For Profit',
                                },
                                {
                                    title: 'Private Not For Profit',
                                    value: 'Private Not For Profit',
                                },
                                { title: 'Faith Based', value: 'Faith Based' },
                                { title: 'NGO', value: 'NGO' },
                            ],
                            searchable: false,
                            multiple: false,
                            closeOnSelect: true,
                            required: false,
                        },
                        expressions: {
                            'model.ownership_type': field => {
                                this.determineModelAction(field.model, field);
                            },
                        },
                        modelOptions: {
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                ],
            },
            {
                className: 'col-12 row ps-3 mt-4',
                fieldGroup: [
                    {
                        key: 'facility_type',
                        type: 'select',
                        className: 'col-sm-4',
                        props: {
                            label: 'Facility Type',
                            bindLabel: 'title',
                            bindValue: 'value',
                            options: [
                                {
                                    title: 'Dental Clinic',
                                    value: 'Dental Clinic',
                                    helpText:
                                        'This is an Outpatient for dental services',
                                },
                                {
                                    title: 'Diagnostic Centre',
                                    value: 'Diagnostic Centre',
                                    helpText:
                                        'Outpatient centre only dealing with radiological examinations',
                                },
                                {
                                    title: 'Eye Clinic',
                                    value: 'Eye Clinic',
                                    helpText:
                                        'This is an Outpatient eye clinic',
                                },
                                {
                                    title: 'Health Centre',
                                    value: 'Health Centre',
                                    helpText:
                                        'Primary healthcare services and outpatient mostly offering primary healthcare',
                                },
                                {
                                    title: 'Maternity Home',
                                    value: 'Maternity Home',
                                    helpText:
                                        'Outpatient/Inpatient services but mostly conducts deliveries',
                                },
                                {
                                    title: 'Nursing Home',
                                    value: 'Nursing Home',
                                    helpText:
                                        'Outpatient/Inpatient and maternity services',
                                },
                                {
                                    title: 'Outpatient Centre',
                                    value: 'Outpatient Centre',
                                    helpText: `Outpatient services including radiology, specialists services
                                        (Peaditric, Gynecology)`,
                                },
                                {
                                    title: 'Pharmacy',
                                    value: 'Pharmacy',
                                    helpText: 'Outlet for drug dispensing',
                                },
                                {
                                    title: 'Primary Hospital',
                                    value: 'Primary Hospital',
                                    helpText: `Principal referal hospital complimenting primary healthcare
                                        services offered at lower level (dispensary, healthcentre etc)`,
                                },
                                {
                                    title: 'Secondary Hospital',
                                    value: 'Secondary Hospital',
                                    helpText: `Principal referal hospital complimenting primary healthcare services
                                        offered at Primary Hospital. Offer services to provincial hospitals and
                                        provide specialised care involving skills and competence not in lower levels.
                                        They offer medicine and general surgery / theatre etc`,
                                },
                                {
                                    title: 'Tertiary Hospital',
                                    value: 'Tertiary Hospital',
                                    helpText: `Topmost centres of excellence referral hospital with highly skilled
                                         and specialised personel. They have high concentration of equipment and
                                         highly expensive to run. They support training for Healthcare workers`,
                                },
                                {
                                    title: 'Training Institution',
                                    value: 'Training Institution',
                                    helpText:
                                        'Teaching and training institution for healthcare workers.',
                                },
                            ],
                            searchable: false,
                            multiple: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            'model.facility_type': field => {
                                this.determineModelAction(field.model, field);
                            },
                        },
                        modelOptions: {
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                    {
                        key: 'location_type',
                        type: 'select',
                        className: 'px-4 pe-0 col-sm-4',
                        props: {
                            label: 'Location Type',
                            bindLabel: 'title',
                            bindValue: 'value',
                            options: [
                                { title: 'Urban', value: 'Urban' },
                                { title: 'Rural', value: 'Rural' },
                            ],
                            searchable: false,
                            multiple: false,
                            closeOnSelect: true,
                            required: false,
                        },
                        expressions: {
                            'model.location_type': field => {
                                this.determineModelAction(field.model, field);
                            },
                        },
                        modelOptions: {
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                    {
                        key: 'internet_connectivity',
                        type: 'select',
                        className: 'px-4 pe-0 col-sm-4',
                        props: {
                            label: 'Internet Connectivity',
                            bindLabel: 'title',
                            bindValue: 'value',
                            options: [
                                { title: '2G', value: '2G' },
                                { title: '3G', value: '3G' },
                                { title: '4G', value: '4G' },
                                { title: 'Wired Connection', value: 'WIMAX' },
                                { title: 'Fibre Connection', value: 'FIBRE' },
                            ],
                            searchable: false,
                            multiple: false,
                            closeOnSelect: true,
                            required: false,
                        },
                        expressions: {
                            'model.internet_connectivity': field => {
                                this.determineModelAction(field.model, field);
                            },
                        },
                        modelOptions: {
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                ],
            },
            {
                key: 'coordinates',
                type: 'coordinates',
                className: 'col-12 mt-4',
                props: {
                    label: 'Update the facility location via dragging the red pin',
                    addMarker: model => {
                        this.model['latitude'] = model.lat.toFixed(16);
                        this.model['longitude'] = model.lng.toFixed(16);
                        this.model['coordinates'] = {
                            lat: parseFloat(model.lat.toFixed(16)),
                            lng: parseFloat(model.lng.toFixed(16)),
                        };
                        this.patchField(this.model);
                    },
                    latLngKeys: {
                        lat: 'latitude',
                        lng: 'longitude',
                    },
                },
            },
            {
                className: 'col-12 row ps-3 ',
                fieldGroup: [
                    {
                        key: 'latitude',
                        type: 'input',
                        className: 'col-sm-6',
                        props: {
                            label: 'Latitude',
                            placeholder: 'Latitude',
                        },
                    },
                    {
                        key: 'longitude',
                        type: 'input',
                        className: 'px-4 pe-0 col-sm-6',
                        props: {
                            label: 'Longitude',
                            placeholder: 'Longitude',
                        },
                    },
                ],
            },
        ];
    }

    setModel(field, model) {
        this.model = model;
        if (
            field.defaultValue !== '' &&
            field.defaultValue !== undefined &&
            !field.props.model
        ) {
            field.props.model = field.defaultValue;
        }
        if (field.defaultValue === undefined) {
            field.props.model = model[field.key];
            return model[field.key];
        }
    }

    determineModelAction(model, field) {
        if (
            field.formControl.pristine === true &&
            field.formControl.touched === false
        ) {
            this.setModel(field, model);
        } else if (field.formControl.touched === true) {
            this.patchField(model);
            field.formControl.markAsUntouched();
        }
    }

    setComponent(component) {
        this.model = {};
        this.component = component;
    }

    patchField(model) {
        const params = {
            slade_code: this.authConfig.getUser().business_partner,
        };
        const patchModel = _.pick(model, [
            'name',
            'branch_name',
            'preferred_contact',
            'county_name',
            'legal_status',
            'facility_type',
            'ownership_type',
            'location_type',
            'internet_connectivity',
            'longitude',
            'latitude',
        ]);
        if (patchModel.latitude !== undefined && patchModel.latitude !== null) {
            patchModel.latitude = patchModel.latitude.toString();
            patchModel.longitude = patchModel.longitude.toString();
        }
        this.dataLayer
            .customUpdate('onboard-provider', patchModel, params)
            .subscribe({
                next: (response: any) => {
                    this.patchLoading = false;
                    this.component.providerData = response;
                },
                error: err => {
                    this.errorHandler.handleError(err, this.component);
                    this.patchLoading = false;
                },
            });
    }

    patchOrgField(model) {
        const orgId = this.authConfig.getOrganisation().organisation_id;
        const patchModel = _.pick(model, ['email_address', 'physical_address']);
        this.dataLayer.update('organisations', orgId, patchModel).subscribe({
            next: (response: any) => {
                this.patchLoading = false;
                this.component.providerData = this.component.providerData
                    ? this.component.providerData
                    : {};
                this.component.providerData['email_address'] =
                    response.email_address;
                this.component.providerData['physical_address'] =
                    response.physical_address;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                this.patchLoading = false;
            },
        });
    }
}

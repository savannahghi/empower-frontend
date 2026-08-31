/**
 * List of import used in the injectable
 */
import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import _ from 'underscore';
import moment from 'moment';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { FeatureFlagService } from '../../../../@core/utils/feature.service';
import {
    bugeseraSectors,
    bureraSectors,
    easternProvinceDistricts,
    gakenkeSectors,
    gasaboSectors,
    gatsiboSectors,
    gicumbiSectors,
    gisagaraSectors,
    huyeSectors,
    kamonyiSectors,
    karongiSectors,
    kayonzaSectors,
    kicukiroSectors,
    kigaliDistricts,
    kireheSectors,
    muhangaSectors,
    musanzeSectors,
    ngomaSectors,
    ngororeroSectors,
    northernProvinceDistricts,
    nyagatareSectors,
    nyahibuSectors,
    nyamagabeSectors,
    nyamashekeSectors,
    nyanzaSectors,
    nyarugengeSectors,
    nyaruguruSectors,
    rubavuSectors,
    ruhangoSectors,
    rulindoSectors,
    rusiziSectors,
    rutsiroSectors,
    rwamaganaSectors,
    rwandaProvinces,
    southernProviceDistricts,
    westernProvinceDistricts,
} from './form-options/rwanda-admin';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PatientRegistrationService {
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

    /**
     * Stores country
     */
    country: string;

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
     * variant of the app
     */
    variant = environment.variant;

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
        public auth: AuthenticationService,
        public flagService: FeatureFlagService,
        private toastrService: NbToastrService
    ) {
        this.router = _router;
        this.user = this.authConfig.getUser();
        const erpOrg = this.authConfig.getErpOrganisation();
        this.country = erpOrg?.organisation_country;
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
                className: 'col-12 ms-0',
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
                                { title: 'Rev', value: 'Rev' },
                                { title: 'Sister', value: 'Sister' },
                                { title: 'Bishop', value: 'Bishop' },
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
                        key: 'person.age',
                        className: 'col-12 col-xs-12 col-sm-4',
                        type: 'input',
                        props: {
                            type: 'number',
                            label: 'Age in years',
                            placeholder: 'Age',
                            required: false,
                            min: '0',
                            max: '150',
                        },
                        expressions: {
                            'model.person.date_of_birth': field => {
                                if (
                                    field.formControl.pristine === false &&
                                    field.model?.person?.age
                                ) {
                                    this.calculateAge = {};
                                    this.calculateAge.yearNow = moment().year();
                                    this.calculateAge.yearOfBirth =
                                        this.calculateAge.yearNow -
                                        parseInt(field.model.person.age, 10);
                                    this.calculateAge.dob =
                                        this.calculateAge.yearOfBirth +
                                        '-01-01';
                                    return moment(this.calculateAge.dob);
                                } else if (
                                    this.component.model?.person?.age?.years
                                ) {
                                    return this.component.model?.person
                                        ?.date_of_birth;
                                }
                            },
                        },
                        validation: {
                            messages: {
                                max: 'Max age is 150 years',
                            },
                        },
                        modelOptions: {
                            updateOn: 'blur',
                            helpText: 'Add age and the Dob will be calculated',
                            debounce: {
                                default: 2000,
                            },
                        },
                    },
                    {
                        key: 'person.date_of_birth',
                        className: 'col-12 col-xs-12 col-sm-4 ps-sm-4',
                        type: 'datepicker',
                        props: {
                            type: 'text',
                            label: 'Date of Birth',
                            dateFormat: 'YYYY-MM-DD',
                            placeholder: 'YYYY-MM-DD',
                            required: true,
                            max: moment(),
                        },
                        expressions: {
                            'model.date_of_birth': field => {
                                if (field.formControl.pristine === false) {
                                    this.model = field.model;
                                    if (
                                        !_.isUndefined(
                                            field.model.date_of_birth
                                        ) &&
                                        field.formControl.touched === true &&
                                        field.defaultValue !==
                                            field.model.date_of_birth
                                    ) {
                                        field.formControl.markAsPristine();
                                        return moment(
                                            field.model.date_of_birth
                                        );
                                    } else {
                                        return this.model['date_of_birth'];
                                    }
                                } else if (field.model.date_of_birth !== null) {
                                    return moment(field.model.date_of_birth);
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
                        key: 'person.gender',
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
                                if (
                                    field.model.title &&
                                    this.maleTitles.includes(field.model.title)
                                ) {
                                    return 'MALE';
                                } else if (
                                    field.model.title &&
                                    this.femaleTitles.includes(
                                        field.model.title
                                    )
                                ) {
                                    return 'FEMALE';
                                }
                                return field.model.person?.gender;
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
                        key: 'person.metadata.administrative_units.province',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select province',
                            label: 'Province',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: rwandaProvinces,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: () => {
                                return !(this.country === 'RWA');
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.district',
                        type: 'select',
                        className: 'col-12 col-sm-6 ps-sm-1 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select Kigali district',
                            label: 'Kigali District',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: kigaliDistricts,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isKigali;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.province
                                ) {
                                    const province =
                                        field.model.person.metadata
                                            .administrative_units.province;
                                    isKigali = province === 'Kigali';
                                    return !isKigali;
                                }
                                return !isKigali;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.district',
                        type: 'select',
                        className: 'col-12 col-sm-6 ps-sm-1 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select Northern Province district',
                            label: 'Northern Province District',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: northernProvinceDistricts,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isNorthernProvince;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.province
                                ) {
                                    const province =
                                        field.model.person.metadata
                                            .administrative_units.province;
                                    isNorthernProvince =
                                        province === 'Northern Province';
                                    return !isNorthernProvince;
                                }
                                return !isNorthernProvince;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.district',
                        type: 'select',
                        className: 'col-12 col-sm-6 ps-sm-1 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select district',
                            label: 'Southern Province District',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: southernProviceDistricts,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isSouthernProvince;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.province
                                ) {
                                    const province =
                                        field.model.person.metadata
                                            .administrative_units.province;
                                    isSouthernProvince =
                                        province === 'Southern Province';
                                    return !isSouthernProvince;
                                }
                                return !isSouthernProvince;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.district',
                        type: 'select',
                        className: 'col-12 col-sm-6 ps-sm-1 col-xs-12',
                        props: {
                            placeholder: 'Select district',
                            label: 'Eastern Province District',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: easternProvinceDistricts,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isEasternProvince;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.province
                                ) {
                                    const province =
                                        field.model.person.metadata
                                            .administrative_units.province;
                                    isEasternProvince =
                                        province === 'Eastern Province';
                                    return !isEasternProvince;
                                }
                                return !isEasternProvince;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.district',
                        type: 'select',
                        className: 'col-12 col-sm-6 ps-sm-1 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select district',
                            label: 'Western Province District',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: westernProvinceDistricts,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isWesternProvince;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.province
                                ) {
                                    const province =
                                        field.model.person.metadata
                                            .administrative_units.province;
                                    isWesternProvince =
                                        province === 'Western Province';
                                    return !isWesternProvince;
                                }
                                return !isWesternProvince;
                            },
                        },
                    },
                    // Kigali Sectors
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Gasabo District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: gasaboSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Gasabo';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Kicukiro District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: kicukiroSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Kicukiro';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Nyarugenge District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: nyarugengeSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Nyarugenge';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    // Northern Province Sectors
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Burera District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: bureraSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Burera';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Gakenke District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: gakenkeSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Gakenke';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Musanze District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: musanzeSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Musanze';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Rulindo District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: rulindoSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Rulindo';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Gicumbi District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: gicumbiSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Gicumbi';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    // Southern Province Sectors
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Gisagara District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: gisagaraSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Gisagara';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Huye District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: huyeSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Huye';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Kamonyi District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: kamonyiSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Kamonyi';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Muhanga District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: muhangaSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Muhanga';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Nyamagabe District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: nyamagabeSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Nyamagabe';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Nyanza District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: nyanzaSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Nyanza';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Nyaruguru District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: nyaruguruSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Nyaruguru';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Ruhango District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: ruhangoSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Ruhango';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    // Western Province Sectors
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Karongi District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: karongiSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Karongi';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Ngororero District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: ngororeroSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Ngororero';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Nyahibu District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: nyahibuSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Nyahibu';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Nyamasheke District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: nyamashekeSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Nyamasheke';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Rubavu District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: rubavuSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Rubavu';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Rusizi District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: rusiziSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Rusizi';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Rutsiro District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: rutsiroSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Rutsiro';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    // Eastern Province Sectors
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Bugesera District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: bugeseraSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Bugesera';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Gatsibo District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: gatsiboSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Gatsibo';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Kayonza District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: kayonzaSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Kayonza';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Kirehe District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: kireheSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Kirehe';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Ngoma District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: ngomaSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Ngoma';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Nyagatare District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: nyagatareSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Nyagatare';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.sector',
                        type: 'select',
                        className: 'col-12 col-sm-6 col-xs-12 mb-3',
                        props: {
                            placeholder: 'Select sector',
                            label: 'Rwamagana District Sector',
                            bindLabel: 'value',
                            bindValue: 'value',
                            options: rwamaganaSectors,
                            searchable: false,
                            closeOnSelect: true,
                            required: true,
                        },
                        expressions: {
                            hide: field => {
                                let isDistrict;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.district
                                ) {
                                    const district =
                                        field.model.person.metadata
                                            .administrative_units.district;
                                    isDistrict = district === 'Rwamagana';
                                    return !isDistrict;
                                }
                                return !isDistrict;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.cell',
                        type: 'input',
                        className: 'ps-sm-1 col-12 col-sm-6 col-xs-12',
                        props: {
                            label: 'Cell',
                            placeholder: 'Enter cell',
                            required: true,
                            minLength: 3,
                        },
                        expressions: {
                            hide: field => {
                                let sector;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.sector
                                ) {
                                    sector =
                                        field.model.person.metadata
                                            .administrative_units.sector;
                                    return !sector;
                                }
                                return !sector;
                            },
                        },
                    },
                    {
                        key: 'person.metadata.administrative_units.village',
                        type: 'input',
                        className: 'col-12 col-sm-6 col-xs-12',
                        props: {
                            label: 'Village',
                            placeholder: 'Enter village',
                            required: true,
                            minLength: 3,
                        },
                        expressions: {
                            hide: field => {
                                let cell;
                                if (
                                    field.model.person?.metadata
                                        ?.administrative_units?.cell
                                ) {
                                    cell =
                                        field.model.person.metadata
                                            .administrative_units.cell;
                                    return !cell;
                                }
                                return !cell;
                            },
                        },
                    },
                ],
            },
            {
                type: 'repeat',
                key: 'person.person_contacts',
                fieldArray: {
                    props: {
                        btnText: 'Add a contact',
                        hasIcon: true,
                        min: 1,
                        model: [],
                    },
                    fieldGroup: [
                        {
                            key: 'contact_type',
                            type: 'select',
                            className:
                                'col-12 col-sm-4 pe-2 height-65p mb-3 w-50',
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
                            className: 'col-12 col-sm-5 height-65p',
                            props: {
                                label: 'Email',
                                placeholder: 'Enter Email',
                                required: true,
                                type: 'email',
                                pattern: `[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$`,
                            },
                            validation: {
                                messages: {
                                    pattern: 'Ensure the Email is valid',
                                },
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
                            className: 'col-12 col-sm-5 pe-sm-2 height-65p',
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
            {
                className: 'row col-12 ms-0',
                fieldGroup: [
                    {
                        key: 'person.id_document_type',
                        type: 'select',
                        defaultValue: 'nationalID',
                        className: 'col-12 col-xs-12 col-sm-4',
                        props: {
                            label: 'ID Type',
                            bindLabel: 'title',
                            bindValue: 'value',
                            required: false,
                            options: [
                                { title: 'National ID', value: 'nationalID' },
                                {
                                    title: 'Passport Number',
                                    value: 'passportID',
                                },
                                { title: 'Military ID', value: 'militaryID' },
                                { title: 'Alien ID', value: 'alienID' },
                                { title: 'KRA PIN', value: 'kraPIN' },
                            ],
                            closeOnSelect: true,
                        },
                        expressions: {
                            'model.id_document_type': field => {
                                this.model = field.model;
                                field.props.model =
                                    field.model.id_document_type;
                                return field.model.person?.id_document_type;
                            },
                        },
                    },
                    {
                        key: 'person.id_value',
                        className: 'col-12 ps-sm-4 col-xs-12 col-sm-8',
                        type: 'input',
                        props: {
                            label: 'ID Number',
                            placeholder: 'Enter ID Number',
                            required: false,
                        },
                        expressions: {
                            'props.maxLength': field => {
                                return field.model.id_document_type ===
                                    'nationalID'
                                    ? 14
                                    : null;
                            },
                        },
                        validation: {
                            messages: {
                                maxLength:
                                    'National ID must not exceed 14 characters',
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
                        key: 'person.channel',
                        hideExpression: this.flagService.getForcedValue(
                            'prov_displayChannelAttributionInPatientForm'
                        ),
                        className: 'col-12 col-xs-12',
                        type: 'select',
                        props: {
                            label: 'How did you hear about us',
                            required: this.flagService.getForcedValue(
                                'prov_channelAttributionInPatientFormRequired'
                            ),
                            options: [
                                {
                                    title: 'Clinic Launch Event',
                                    value: 'Clinic Launch Event',
                                },
                                {
                                    title: 'Community Event',
                                    value: 'Community Event',
                                },
                                {
                                    title: 'Facebook, Instagram, Twitter',
                                    value: 'Facebook, Instagram, Twitter',
                                },
                                {
                                    title: 'Website',
                                    value: 'Website',
                                },
                                {
                                    title: 'Radio',
                                    value: 'Radio',
                                },
                                {
                                    title: 'SMS',
                                    value: 'SMS',
                                },
                                {
                                    title: 'Signage',
                                    value: 'Signage',
                                },
                                {
                                    title: 'mDaktari Chat',
                                    value: 'mDaktari Chat',
                                },
                                {
                                    title: 'Ask Nivi Chat',
                                    value: 'Ask Nivi Chat',
                                },
                                {
                                    title: 'Whatsapp',
                                    value: 'Whatsapp',
                                },
                                {
                                    title: 'Referral from local business/vendor',
                                    value: 'Referral from local business/vendor',
                                },
                                {
                                    title: 'Referral from another clinic/hospital',
                                    value: 'Referral from another clinic/hospital',
                                },
                                {
                                    title: 'Referral by CHP - CODE',
                                    value: 'Referral by CHP - CODE',
                                },
                                {
                                    title: 'Referred by family member/friend',
                                    value: 'Referred by family member/friend',
                                },
                                {
                                    title: 'Listed in insurance panel',
                                    value: 'Listed in insurance panel',
                                },
                            ],
                            bindLabel: 'title',
                            bindValue: 'value',
                            closeOnSelect: true,
                            dropdownPosition: 'bottom',
                        },
                    },
                ],
            },
            {
                className: 'col-12 mb-2',
                hideExpression: !this.flagService.checkVariantFlag(
                    'prov_displayOperatingRegionInPatientForm'
                ),
                template:
                    '<div class="fw-medium border-bottom pb-2 mt-2">Geographical Information</div>',
            },
            {
                className: 'col-12 pe-3 mb-2',
                hideExpression: !this.flagService.checkVariantFlag(
                    'prov_displayOperatingRegionInPatientForm'
                ),
                fieldGroup: [
                    {
                        key: 'person.associated_region',
                        type: 'combobox',
                        defaultValue: false,
                        className: 'col-12 mt-2 ms-0',
                        props: {
                            label: 'Select Geographical Region',
                            store: 'operating-regions',
                            responseKey: 'results',
                            placeholder: 'Select region of the client',
                            required: false,
                            bindLabel: [
                                {
                                    key: 'name',
                                    class: 'me-1 mb-1',
                                },
                            ],
                            bindValue: 'id',
                            options: [],
                            dropdownPosition: 'bottom',
                            closeOnSelect: true,
                            multiple: false,
                        },
                        modelOptions: {
                            updateOn: 'change',
                            debounce: {
                                default: 500,
                            },
                        },
                        expressions: {
                            'model.associated_region': field => {
                                this.model = field.model;
                                field.props.model =
                                    field.model.associated_region;
                                return field.model.person?.associated_region;
                            },
                        },
                    },
                ],
            },
            {
                className: 'col-12 mb-2',
                hideExpression: !this.flagService.checkVariantFlag(
                    'prov_displayParentInfoInPatientForm'
                ),
                template:
                    '<div class="fw-medium border-bottom pb-2 mt-2">Parental Information</div>',
            },
            {
                className: 'ps-1 col-12 mb-3',
                hideExpression: !this.flagService.checkVariantFlag(
                    'prov_displayParentInfoInPatientForm'
                ),
                fieldGroup: [
                    {
                        key: 'person.is_expectant',
                        type: 'checkbox',
                        defaultValue: false,
                        className: 'col-12 mt-2 ms-0 ps-sm-2',
                        props: {
                            label: 'Client is expecting a child',
                            required: false,
                        },
                        modelOptions: {
                            updateOn: 'change',
                            debounce: {
                                default: 500,
                            },
                        },
                        expressions: {
                            'model.is_expectant': field => {
                                this.model = field.model;
                                field.props.model = field.model.is_expectant;
                                return field.model.person?.is_expectant;
                            },
                        },
                    },
                    {
                        key: 'pregnancy_weeks',
                        className: 'ms-5 mt-2 ms-0 ps-sm-2',
                        type: 'input',
                        props: {
                            type: 'number',
                            label: 'Pregnancy Weeks',
                            required: false,
                            min: '0',
                            max: '40',
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model ||
                                    !field.model.is_expectant === true
                                );
                            },
                            'model.expected_delivery_date': field => {
                                if (
                                    field.formControl.pristine === false &&
                                    field.model?.pregnancy_weeks
                                ) {
                                    const remainingWeeks =
                                        40 - field.model.pregnancy_weeks;
                                    const remainingDays = remainingWeeks * 7;
                                    field.formControl.markAsPristine();
                                    return moment().add(remainingDays, 'day');
                                } else {
                                    return moment(
                                        field.model.expected_delivery_date
                                    );
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
                        key: 'expected_delivery_date',
                        className: 'ms-5 mt-2 ms-0 ps-sm-2',
                        type: 'datepicker',
                        props: {
                            type: 'text',
                            label: 'Expected Delivery Date',
                            dateFormat: 'YYYY-MM-DD',
                            placeholder: 'YYYY-MM-DD',
                            required: false,
                            min: moment(),
                            max: moment().add(10, 'months'),
                        },
                        expressions: {
                            hide: field => {
                                return (
                                    !field.model ||
                                    !field.model.is_expectant === true
                                );
                            },
                            'model.expected_delivery_date': field => {
                                if (field.formControl.pristine === false) {
                                    this.model = field.model;
                                    if (
                                        !_.isUndefined(
                                            field.model.expected_delivery_date
                                        ) &&
                                        field.formControl.touched === true &&
                                        field.defaultValue !==
                                            field.model.expected_delivery_date
                                    ) {
                                        field.formControl.markAsPristine();
                                        return moment(
                                            field.model.expected_delivery_date
                                        );
                                    } else {
                                        return this.model[
                                            'expected_delivery_date'
                                        ];
                                    }
                                } else if (
                                    field.model.expected_delivery_date !== null
                                ) {
                                    return moment(
                                        field.model.expected_delivery_date
                                    );
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
                className: 'col-12 mb-3',
                hideExpression: '!model.id',
                template:
                    '<div class="fw-medium border-bottom pb-2 mt-2">Deactivation</div>',
            },
            {
                key: 'person.deceased',
                type: 'checkbox',
                hideExpression: '!model.id',
                className:
                    'col-12 col-sm col-xs-12 mt-2 ms-2 ps-sm-1 pe-sm-2 mb-5 mt-2',
                props: {
                    label: 'Inactive',
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
                expressions: {
                    'model.deceased': field => {
                        if (!field.model?.person?.deceased) {
                            field.model.person.deceased = false;
                            return field.model.person.deceased;
                        } else {
                            return field.model.person.deceased;
                        }
                    },
                    'model.active': field => {
                        if (!field.model?.person?.deceased) {
                            field.model.person.deceased = false;
                            return !field.model.person.deceased;
                        } else {
                            return !field.model.person.deceased;
                        }
                    },
                },
            },
            {
                className: 'col-12 mb-2',
                hideExpression: !this.flagService.checkVariantFlag(
                    'prov_displayLanguagePreferenceInPatientForm'
                ),
                template:
                    '<div class="fw-medium border-bottom pb-2 mt-2">Communication Preferences</div>',
            },
            {
                className: 'row col-12 ms-0 mt-2',
                hideExpression: !this.flagService.checkVariantFlag(
                    'prov_displayLanguagePreferenceInPatientForm'
                ),
                fieldGroup: [
                    {
                        key: 'person.language',
                        type: 'select',
                        defaultValue: 'language',
                        className: 'col-12 col-xs-12 col-sm-4',
                        props: {
                            label: 'Preferred Language',
                            bindLabel: 'title',
                            bindValue: 'value',
                            required: false,
                            placeholder: 'Select preferred language',
                            options: [
                                { title: 'English', value: 'en' },
                                {
                                    title: 'Swahili',
                                    value: 'sw',
                                },
                            ],
                            closeOnSelect: true,
                        },
                        expressions: {
                            'model.language': field => {
                                this.model = field.model;
                                field.props.model = field.model.language;
                                return field.model.person?.language;
                            },
                        },
                    },
                ],
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

import { PatientRegistrationService } from './patient-registration-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../../app-config.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormControl } from '@angular/forms';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { VariantPipe } from '../../../../@theme/pipes/variant/variant.pipe';

class SilStoresServiceStub {
    customUpdate() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
}

class AuthenticationServiceStub {
    checkSetting(string) {
        return string === 'string';
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthorizationConfigStub {
    getUser() {
        const stringified = JSON.stringify({
            business_partner: 1,
            client_types: ['PROVIDER'],
        });
        return stringified;
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
            organisation_country: 'RWA',
        };
    }
}

describe('PatientRegistrationService', () => {
    let service: PatientRegistrationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                PatientRegistrationService,
                VariantPipe,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(PatientRegistrationService);
    });

    it('should test fields', () => {
        const comp = {
            model: {
                business_partner: 1,
                person: {
                    age: { years: 31 },
                    date_of_birth: '1992-07-19',
                },
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        const model = {
            date_of_birth: 'null',
        };

        // test first nested branch dob
        const field = {
            model: {
                date_of_birth: '12-12-2022',
                id_document_type: 'nationalID',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[0].fieldGroup[0]['expressions']['model.title'](field);
        fields[1].fieldGroup[0]['expressions']['model.person.date_of_birth'](
            field
        );
        fields[1].fieldGroup[1]['expressions']['model.date_of_birth'](field);

        // test second nested branch dob
        const field2 = {
            date_of_birth: '12-12-2022',
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            model: model,
            defaultValue: undefined,
        };
        fields[1].fieldGroup[0]['expressions']['model.person.date_of_birth'](
            field2
        );
        fields[1].fieldGroup[1]['expressions']['model.date_of_birth'](field2);
        expect(service.fields).toHaveBeenCalled();

        // test third nested branch dob
        const field3 = {
            date_of_birth: '12-12-2022',
            formControl: {
                pristine: false,
                touched: false,
            },
            model: {
                date_of_birth: '12-12-2022',
                person: {
                    age: '4',
                },
            },
            defaultValue: undefined,
        };
        fields[1].fieldGroup[0]['expressions']['model.person.date_of_birth'](
            field3
        );
        fields[1].fieldGroup[1]['expressions']['model.date_of_birth'](field3);

        // test second branch dob
        const model2 = {
            date_of_birth: '12-12-2022',
            person: {
                date_of_birth: '12-12-2022',
                age: '6',
            },
        };
        const field4 = {
            date_of_birth: '12-12-2022',
            formControl: {
                pristine: true,
                markAsPristine: () => {},
                touched: true,
            },
            model: model2,
            defaultValue: undefined,
        };
        fields[1].fieldGroup[1]['expressions']['model.date_of_birth'](field4);

        // test third branch dob
        const model3 = {
            date_of_birth: null,
            gender: 'MALE',
            id_document_type: 'nationalID',
            person: {
                age: '6',
                date_of_birth: null,
                gender: 'MALE',
                id_document_type: 'nationalID',
            },
        };
        field4.model = model3;
        fields[1].fieldGroup[0]['expressions']['model.person.date_of_birth'](
            field4
        );
        fields[1].fieldGroup[1]['expressions']['model.date_of_birth'](field4);

        // test gender and id document type
        const field5 = {
            date_of_birth: '12-12-2022',
            id_document_type: 'nationalID',
            formControl: {
                pristine: true,
                markAsPristine: () => {},
                touched: false,
            },
            model: {},
            props: {
                model: undefined,
            },
            defaultValue: 'John',
        };
        field5.model = model3;
        fields[1].fieldGroup[2]['expressions']['model.gender'](field5);
        const genderField = {
            date_of_birth: '12-12-2022',
            id_document_type: 'nationalID',
            formControl: {
                pristine: true,
                markAsPristine: () => {},
                touched: false,
            },
            model: {
                title: 'Mr',
            },
            props: {
                model: undefined,
            },
            defaultValue: 'John',
        };
        fields[1].fieldGroup[2]['expressions']['model.gender'](genderField);
        genderField.model.title = 'Mrs';
        fields[1].fieldGroup[2]['expressions']['model.gender'](genderField);

        const model4 = {
            business_partner: undefined,
            gender: undefined,
            id_document_type: undefined,
            person: {
                phone_number: undefined,
            },
        };

        field5.model = model4;

        fields[1].fieldGroup[2]['expressions']['model.gender'](field5);

        // Test ID document types
        fields[4].fieldGroup[0]['expressions']['model.id_document_type'](
            field5
        );

        const field6 = {
            date_of_birth: '12-12-2022',
            id_document_type: 'nationalID',
            formControl: {
                pristine: true,
                markAsPristine: () => {},
                touched: false,
            },
            props: {
                model: {
                    field: {
                        defaultValue: 'John',
                    },
                },
            },
        };

        field6['model'] = model3;
        fields[4].fieldGroup[0]['expressions']['model.id_document_type'](
            field6
        );

        // Test ID document value
        const idValueField = fields[4].fieldGroup.find(
            f => f.key === 'person.id_value'
        );

        const maxLengthFn = idValueField?.expressions?.['props.maxLength'];

        expect(maxLengthFn({ model: { id_document_type: 'nationalID' } })).toBe(
            14
        );
        expect(maxLengthFn({ model: { id_document_type: 'passportID' } })).toBe(
            null
        );

        /** test if patient is deceased */
        const deceasedFieldUndefined: FormlyFieldConfig = {
            model: {
                person: {
                    deceased: undefined,
                },
            },
            props: {},
            formControl: new FormControl({
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            }),
            defaultValue: undefined,
        };
        fields[10]['expressions']['model.deceased'](deceasedFieldUndefined);
        fields[10]['expressions']['model.active'](deceasedFieldUndefined);
        const deceasedFieldDefault = {
            model: {
                person: {
                    deceased: true,
                },
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
        };
        fields[10]['expressions']['model.deceased'](deceasedFieldDefault);
        fields[10]['expressions']['model.active'](deceasedFieldDefault);

        expect(service.fields).toHaveBeenCalled();
    });

    it('should test admin units', () => {
        const comp = {
            model: {
                business_partner: 1,
                person: {
                    age: { years: 31 },
                    date_of_birth: '1992-07-19',
                },
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        // test admin units
        const field = {
            model: {
                date_of_birth: '12-12-2022',
                id_document_type: 'nationalID',
                person: {
                    metadata: {
                        administrative_units: {},
                    },
                },
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        service.country = 'RWA';
        service.variant = 'default';
        fields[2].fieldGroup[0]['expressions']['hide'](field);
        fields[2].fieldGroup[1]['expressions']['hide'](field);
        fields[2].fieldGroup[2]['expressions']['hide'](field);
        fields[2].fieldGroup[3]['expressions']['hide'](field);
        fields[2].fieldGroup[4]['expressions']['hide'](field);
        fields[2].fieldGroup[5]['expressions']['hide'](field);
        fields[2].fieldGroup[6]['expressions']['hide'](field);
        fields[2].fieldGroup[7]['expressions']['hide'](field);
        fields[2].fieldGroup[8]['expressions']['hide'](field);
        fields[2].fieldGroup[9]['expressions']['hide'](field);
        fields[2].fieldGroup[10]['expressions']['hide'](field);
        fields[2].fieldGroup[11]['expressions']['hide'](field);
        fields[2].fieldGroup[12]['expressions']['hide'](field);
        fields[2].fieldGroup[13]['expressions']['hide'](field);
        fields[2].fieldGroup[14]['expressions']['hide'](field);
        fields[2].fieldGroup[15]['expressions']['hide'](field);
        fields[2].fieldGroup[16]['expressions']['hide'](field);
        fields[2].fieldGroup[17]['expressions']['hide'](field);
        fields[2].fieldGroup[18]['expressions']['hide'](field);
        fields[2].fieldGroup[19]['expressions']['hide'](field);
        fields[2].fieldGroup[20]['expressions']['hide'](field);
        fields[2].fieldGroup[21]['expressions']['hide'](field);
        fields[2].fieldGroup[22]['expressions']['hide'](field);
        fields[2].fieldGroup[23]['expressions']['hide'](field);
        fields[2].fieldGroup[24]['expressions']['hide'](field);
        fields[2].fieldGroup[25]['expressions']['hide'](field);
        fields[2].fieldGroup[26]['expressions']['hide'](field);
        fields[2].fieldGroup[27]['expressions']['hide'](field);
        fields[2].fieldGroup[28]['expressions']['hide'](field);
        fields[2].fieldGroup[29]['expressions']['hide'](field);
        fields[2].fieldGroup[30]['expressions']['hide'](field);
        fields[2].fieldGroup[31]['expressions']['hide'](field);
        fields[2].fieldGroup[32]['expressions']['hide'](field);
        fields[2].fieldGroup[33]['expressions']['hide'](field);
        fields[2].fieldGroup[34]['expressions']['hide'](field);
        fields[2].fieldGroup[35]['expressions']['hide'](field);
        fields[2].fieldGroup[36]['expressions']['hide'](field);
        fields[2].fieldGroup[37]['expressions']['hide'](field);
        field.model.person.metadata.administrative_units['province'] = 'Kigali';
        field.model.person.metadata.administrative_units['district'] =
            'Ruhango';
        field.model.person.metadata.administrative_units['sector'] = 'Sector';
        field.model.person.metadata.administrative_units['cell'] = 'Village';
        fields[2].fieldGroup[1]['expressions']['hide'](field);
        fields[2].fieldGroup[2]['expressions']['hide'](field);
        fields[2].fieldGroup[3]['expressions']['hide'](field);
        fields[2].fieldGroup[4]['expressions']['hide'](field);
        fields[2].fieldGroup[5]['expressions']['hide'](field);
        fields[2].fieldGroup[6]['expressions']['hide'](field);
        fields[2].fieldGroup[7]['expressions']['hide'](field);
        fields[2].fieldGroup[8]['expressions']['hide'](field);
        fields[2].fieldGroup[9]['expressions']['hide'](field);
        fields[2].fieldGroup[10]['expressions']['hide'](field);
        fields[2].fieldGroup[11]['expressions']['hide'](field);
        fields[2].fieldGroup[12]['expressions']['hide'](field);
        fields[2].fieldGroup[13]['expressions']['hide'](field);
        fields[2].fieldGroup[14]['expressions']['hide'](field);
        fields[2].fieldGroup[15]['expressions']['hide'](field);
        fields[2].fieldGroup[16]['expressions']['hide'](field);
        fields[2].fieldGroup[17]['expressions']['hide'](field);
        fields[2].fieldGroup[18]['expressions']['hide'](field);
        fields[2].fieldGroup[19]['expressions']['hide'](field);
        fields[2].fieldGroup[20]['expressions']['hide'](field);
        fields[2].fieldGroup[21]['expressions']['hide'](field);
        fields[2].fieldGroup[22]['expressions']['hide'](field);
        fields[2].fieldGroup[23]['expressions']['hide'](field);
        fields[2].fieldGroup[24]['expressions']['hide'](field);
        fields[2].fieldGroup[25]['expressions']['hide'](field);
        fields[2].fieldGroup[26]['expressions']['hide'](field);
        fields[2].fieldGroup[27]['expressions']['hide'](field);
        fields[2].fieldGroup[28]['expressions']['hide'](field);
        fields[2].fieldGroup[29]['expressions']['hide'](field);
        fields[2].fieldGroup[30]['expressions']['hide'](field);
        fields[2].fieldGroup[31]['expressions']['hide'](field);
        fields[2].fieldGroup[32]['expressions']['hide'](field);
        fields[2].fieldGroup[33]['expressions']['hide'](field);
        fields[2].fieldGroup[34]['expressions']['hide'](field);
        fields[2].fieldGroup[35]['expressions']['hide'](field);
        fields[2].fieldGroup[36]['expressions']['hide'](field);
        fields[2].fieldGroup[37]['expressions']['hide'](field);
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test repeat field', () => {
        const comp = {
            model: {
                business_partner: 1,
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        service.variant = 'default';

        // test person_contacts
        const field = {
            model: {
                contact_type: 'email',
            },
            parent: {
                key: '0',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        // contact type input
        fields[3].fieldArray.fieldGroup[0]['expressions']['model.contact_type'](
            field
        );
        fields[3].fieldArray.fieldGroup[0]['expressions']['props.disabled'](
            field
        );
        // email input
        fields[3].fieldArray.fieldGroup[1]['expressions']['hide'](field);
        fields[3].fieldArray.fieldGroup[1]['expressions']['model.contact'](
            field
        );
        // phone number input
        fields[3].fieldArray.fieldGroup[2]['expressions']['hide'](field);
        fields[3].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            field
        );
        const fieldStartWith254 = {
            model: {
                contact_type: 'email',
                contact: '+25423323',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        // phone number input
        fields[3].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            fieldStartWith254
        );
        fieldStartWith254.model['id'] = '1';
        fields[3].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            fieldStartWith254
        );
        const fieldStartWith254WithModelId = {
            model: {
                contact_type: 'email',
                contact: '+25423323',
                id: '1',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        expect(service.fields).toHaveBeenCalled();
        fields[3].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            fieldStartWith254WithModelId
        );
    });

    it('should test repeat field for empower variant', () => {
        const comp = {
            model: {
                business_partner: 1,
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        service.variant = 'empower';

        // test person_contacts
        const field = {
            model: {
                contact_type: 'email',
            },
            parent: {
                key: '0',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        // contact type input
        fields[3].fieldArray.fieldGroup[0]['expressions']['model.contact_type'](
            field
        );
        fields[3].fieldArray.fieldGroup[0]['expressions']['props.disabled'](
            field
        );
        // email input
        fields[3].fieldArray.fieldGroup[1]['expressions']['hide'](field);
        fields[3].fieldArray.fieldGroup[1]['expressions']['model.contact'](
            field
        );
        // phone number input
        fields[3].fieldArray.fieldGroup[2]['expressions']['hide'](field);
        fields[3].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            field
        );
        const fieldStartWith254 = {
            model: {
                contact_type: 'email',
                contact: '+25423323',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        // phone number input
        fields[3].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            fieldStartWith254
        );
        fieldStartWith254.model['id'] = '1';
        fields[3].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            fieldStartWith254
        );
        const fieldStartWith254WithModelId = {
            model: {
                contact_type: 'email',
                contact: '+25423323',
                id: '1',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        expect(service.fields).toHaveBeenCalled();
        fields[3].fieldArray.fieldGroup[2]['expressions']['model.contact'](
            fieldStartWith254WithModelId
        );
    });

    it('should test uzazi fields', () => {
        const comp = {
            model: {
                business_partner: 1,
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        service.variant = 'uzazisalama';

        // associated region person undefined
        const regionfield = {
            model: {
                associated_region: 'guid',
                person: {},
            },
            props: {},
            defaultValue: undefined,
        };
        fields[6].fieldGroup[0]['expressions']['model.associated_region'](
            regionfield
        );

        // region person is defined
        const regionfield2 = {
            model: {
                associated_region: 'guid',
                person: undefined,
            },
            props: {},
            defaultValue: undefined,
        };
        fields[6].fieldGroup[0]['expressions']['model.associated_region'](
            regionfield2
        );

        // is expectant person undefined
        const expectantfield = {
            model: {
                associated_region: 'guid',
                person: {},
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[8].fieldGroup[0]['expressions']['model.is_expectant'](
            expectantfield
        );

        // is expectant person is defined
        const expectantfield2 = {
            model: {
                associated_region: 'guid',
                person: undefined,
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[8].fieldGroup[0]['expressions']['model.is_expectant'](
            expectantfield2
        );

        // display expectant field if patient has edd
        const expectantfield3 = {
            model: {
                expected_delivery_date: 'date value',
                person: undefined,
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[8].fieldGroup[0]['expressions']['model.is_expectant'](
            expectantfield3
        );

        // edd person undefined
        const field = {
            model: {
                associated_region: 'guid',
                person: {},
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[8].fieldGroup[2]['expressions']['model.expected_delivery_date'](
            field
        );

        // edd person is defined
        const field2 = {
            model: {
                associated_region: 'guid',
                person: undefined,
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[8].fieldGroup[2]['expressions']['model.expected_delivery_date'](
            field2
        );
        // hide expression
        const hideField = {};
        fields[8].fieldGroup[1]['expressions']['hide'](hideField);
        const hideField2 = { model: {} };
        fields[8].fieldGroup[1]['expressions']['hide'](hideField2);
        expect(fields).toBeDefined();
    });

    it('should test expected delivery date field', () => {
        const comp = {
            model: {
                business_partner: 1,
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        service.variant = 'uzazisalama';

        // edd person defined: pristine is true
        const field = {
            model: {
                associated_region: 'guid',
                person: {},
            },
            props: {},
            formControl: {
                pristine: true,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[8].fieldGroup[2]['expressions']['hide'](field);
        fields[8].fieldGroup[2]['expressions']['model.expected_delivery_date'](
            field
        );

        /** Test pregnancy weeks */
        fields[8].fieldGroup[1]['expressions']['model.expected_delivery_date'](
            field
        );

        // edd person defined: pristine is false
        const field2 = {
            model: {
                pregnancy_weeks: 20,
                expected_delivery_date: 'date value',
                person: {},
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[8].fieldGroup[2]['expressions']['model.expected_delivery_date'](
            field2
        );

        /** Test pregnancy weeks */
        fields[8].fieldGroup[1]['expressions']['model.expected_delivery_date'](
            field2
        );
        expect(fields).toBeDefined();
    });
    it('should test language field', () => {
        const comp = {
            model: {
                business_partner: 1,
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        service.variant = 'uzazisalama';

        // Find the language field group index
        const languageFieldIndex = fields.findIndex(
            field => field.fieldGroup?.[0]?.key === 'person.language'
        );

        // Verify field exists before testing
        expect(languageFieldIndex).toBeGreaterThan(-1);

        // Test language field expressions
        const languageField = {
            model: {
                person: {},
                language: undefined,
            },
            props: {
                model: undefined,
            },
        };
        fields[languageFieldIndex].fieldGroup[0]['expressions'][
            'model.language'
        ](languageField);

        // Test with model containing language
        const languageField2 = {
            model: {
                language: 'en',
                person: {
                    language: 'en',
                },
            },
            props: {
                model: undefined,
            },
        };
        fields[languageFieldIndex].fieldGroup[0]['expressions'][
            'model.language'
        ](languageField2);

        // Test with different language value
        const languageField3 = {
            model: {
                language: 'sw',
                person: {
                    language: 'sw',
                },
            },
            props: {
                model: undefined,
            },
        };
        fields[languageFieldIndex].fieldGroup[0]['expressions'][
            'model.language'
        ](languageField3);

        expect(service.fields).toHaveBeenCalled();
    });
});

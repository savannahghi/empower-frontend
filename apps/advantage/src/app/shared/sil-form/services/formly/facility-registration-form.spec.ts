import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { FacilityRegistrationService } from './facility-registration-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getUser() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

describe('FacilityRegistrationForm', () => {
    let service: FacilityRegistrationService;
    let phoneNumberField: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                FacilityRegistrationService,
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
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(FacilityRegistrationService);

        const fields = service.fields();
        const contactsField = fields.find(f => f.key === 'contacts');
        phoneNumberField = (contactsField.fieldArray.fieldGroup as any[]).find(
            f =>
                f.key === 'contact_value' &&
                f.props?.label === 'Enter phone number'
        );
    });

    it('should test fields', fakeAsync(() => {
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

        service.fields();
        expect(service.fields).toHaveBeenCalled();
    }));

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

        fields[0].fieldGroup[1].expressions['model.facility_type'](field);
        fields[0].fieldGroup[2].expressions['model.categories'](field);

        // contact type input
        fields[2].fieldArray.fieldGroup[0].expressions['model.contact_type'](
            field
        );

        // email input
        fields[2].fieldArray.fieldGroup[1].expressions['hide'](field);
        if (
            fields[2].fieldArray.fieldGroup[1].expressions[
                'model.contact_value'
            ]
        ) {
            fields[2].fieldArray.fieldGroup[1].expressions[
                'model.contact_value'
            ](field);
        }
        // phone number input
        fields[2].fieldArray.fieldGroup[2].expressions['hide'](field);
        if (
            fields[2].fieldArray.fieldGroup[2].expressions[
                'model.contact_value'
            ]
        ) {
            fields[2].fieldArray.fieldGroup[2].expressions[
                'model.contact_value'
            ](field);
        }
        // contact role
        fields[2].fieldArray.fieldGroup[3].expressions['model.role'](field);

        // identifier type input
        fields[3].fieldArray.fieldGroup[0]['expressions'][
            'model.identifier_type'
        ](field);
        // Country type input
        fields[4]['expressions']['model.country'](field);
        // County type input
        fields[5]['expressions']['model.county'](field);
        const fieldStartWith254 = {
            model: {
                contact_type: 'email',
                contact_value: '+25423323',
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
        const expr =
            fields[2].fieldArray.fieldGroup[2].expressions?.[
                'model.contact_value'
            ];
        if (typeof expr === 'function') {
            expr(fieldStartWith254);
        }

        fieldStartWith254.model['id'] = '1';

        const expr2 =
            fields[2].fieldArray.fieldGroup[2]['expressions'][
                'model.contact_value'
            ];
        if (typeof expr === 'function') {
            expr2(fieldStartWith254);
        }

        const fieldStartWith254WithModelId = {
            model: {
                contact_type: 'email',
                contact_value: '+25423323',
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

        const expr3 =
            fields[2].fieldArray.fieldGroup[2]['expressions'][
                'model.contact_value'
            ];
        if (typeof expr === 'function') {
            expr3(fieldStartWith254WithModelId);
        }

        const fieldWithContactValue = {
            model: {
                contact_type: 'phone_number',
                contact_value: '+254 233 23',
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

        const expr4 =
            fields[2].fieldArray.fieldGroup[2]['expressions'][
                'model.contact_value'
            ];
        if (typeof expr === 'function') {
            expr4(fieldWithContactValue);
        }

        const fieldWithContactRole = {
            model: {
                role: 'phone_number',
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
        fields[2].fieldArray.fieldGroup[3]['expressions']['model.role'](
            fieldWithContactRole
        );
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test address fields', () => {
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

        // setup model
        service.model = {};

        // _expressionProperties: county_name
        const field = {
            model: {
                county_name: 'Nairobi',
                legal_status: 'Company',
            },
            props: {},
            defaultValue: 'Nairobi',
            formControl: {
                pristine: false,
                touched: true,
            },
        };

        const event = {
            lat: 12.121212,
            lng: 36.23423423,
        };
        // coordinates tests
        fields[7].props.addMarker(event);
        fields[7]._expressionProperties['model.latitude']['expression']();

        // coordinates tests
        field.model['latitude'] = 12.223123;
        fields[7]._expressionProperties['model.latitude']['expression']();

        // latitude/longitude tests
        fields[8].fieldGroup[0].expressions['model.latitude'](field);
        fields[8].fieldGroup[1].expressions['model.longitude'](field);

        field.model['longitude'] = 12.223123;
        fields[8].fieldGroup[1].expressions['model.longitude'](field);
        expect(service.fields).toHaveBeenCalled();
    });

    it('should have correct field configuration', () => {
        expect(phoneNumberField).toBeDefined();
        expect(phoneNumberField.type).toBe('input');
        expect(phoneNumberField.props.label).toBe('Enter phone number');
        expect(phoneNumberField.props.placeholder).toBe('+254000000000');
        expect(phoneNumberField.props.required).toBeTrue();
        expect(phoneNumberField.props.mask).toBe('000 000 000');
        expect(phoneNumberField.props.prefix).toBe('+254 ');
        expect(phoneNumberField.modelOptions.updateOn).toBe('change');
        expect(phoneNumberField.modelOptions.debounce.default).toBe(10);
    });

    it('should hide when contact_type is EMAIL or model is undefined', () => {
        const testCases = [
            { model: undefined, shouldHide: true },
            { model: { contact_type: 'EMAIL' }, shouldHide: true },
            { model: { contact_type: 'PHONE_NUMBER' }, shouldHide: false },
            { model: { contact_type: null }, shouldHide: false },
        ];

        testCases.forEach(({ model, shouldHide }) => {
            const field = { model };
            const result = phoneNumberField.expressions.hide(field);
            expect(result).toBe(shouldHide);
        });
    });

    it('should clean phone number formatting with parser', () => {
        const testCases = [
            { input: '123 456 789', expected: '123456789' },
            { input: ' 123 456 789 ', expected: '123456789' },
            { input: undefined, expected: '' },
            { input: null, expected: '' },
        ];

        testCases.forEach(({ input, expected }) => {
            const result = phoneNumberField.parsers[0](input);
            expect(result).toBe(expected);
        });
    });

    it('should handle initial value in onInit hook', () => {
        const mockFormControl = {
            value: '+254 123 456 789',
            setValue: jasmine.createSpy('setValue'),
        };

        const field = {
            formControl: mockFormControl,
            model: { contact_type: 'PHONE_NUMBER' },
        };

        phoneNumberField.hooks.onInit(field);

        expect(mockFormControl.setValue).toHaveBeenCalledWith('123 456 789');
    });

    it('should not modify non-254 numbers in onInit hook', () => {
        const mockFormControl = {
            // Tanzania number
            value: '+255 123 456 789',
            setValue: jasmine.createSpy('setValue'),
        };

        const field = {
            formControl: mockFormControl,
            model: { contact_type: 'PHONE_NUMBER' },
        };

        phoneNumberField.hooks.onInit(field);
        expect(mockFormControl.setValue).not.toHaveBeenCalled();
    });
});

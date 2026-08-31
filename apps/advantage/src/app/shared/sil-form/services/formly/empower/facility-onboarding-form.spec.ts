import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../../app-config.service';
import { SilStoresService } from '../../../../sil-http-services/sil_datalayer.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { FacilityOnboardingService } from './facility-onboarding-form';
import { FormlyFieldConfig } from '@ngx-formly/core';

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

describe('FacilityOnboardingService', () => {
    let service: FacilityOnboardingService;
    let phoneNumberField: FormlyFieldConfig;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                FacilityOnboardingService,
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

        service = TestBed.inject(FacilityOnboardingService);

        const comp = {
            model: {},
            fields: [],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);

        const fields = service.fields();
        phoneNumberField = fields[2].fieldGroup?.[1] as FormlyFieldConfig;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should test setComponent method', () => {
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

        expect(service.component).toBe(comp);
        expect(service.counties.length).toBeGreaterThan(0);
        expect(service.specialists.length).toBeGreaterThan(0);
    });

    it('should test fields method returns form fields', fakeAsync(() => {
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
        expect(service.fields).toHaveBeenCalled();
        expect(fields).toBeDefined();
        expect(Array.isArray(fields)).toBe(true);
        expect(fields.length).toBeGreaterThan(0);
    }));

    it('should test validateRequiredFields method', () => {
        // Test with null form
        expect(service.validateRequiredFields(null)).toBe(false);

        // Test with invalid form
        const invalidForm = new FormGroup({
            first_name: new FormControl(''),
            last_name: new FormControl('Test'),
        });
        expect(service.validateRequiredFields(invalidForm)).toBe(false);

        const validForm = new FormGroup({
            first_name: new FormControl('John'),
            last_name: new FormControl('Doe'),
            user_email: new FormControl('john@example.com'),
            user_phone_number: new FormControl('712345678'),
            role: new FormControl('DOCTOR'),
            facility_name: new FormControl('Test Facility'),
            mfl_code: new FormControl('12345'),
            facility_type: new FormControl('HOSPITAL'),
            county: new FormControl('NAIROBI'),
        });
        expect(service.validateRequiredFields(validForm)).toBe(true);
    });

    it('should have correct phone number field configuration', () => {
        expect(phoneNumberField).toBeDefined();
        expect(phoneNumberField.type).toBe('input');
        expect(phoneNumberField.props?.label).toBe('Phone number');
        expect(phoneNumberField.props?.placeholder).toBe('+254000000000');
        expect(phoneNumberField.props?.required).toBeTrue();
        expect(phoneNumberField.props?.mask).toBe('000 000 000');
        expect(phoneNumberField.props?.prefix).toBe('+254 ');
        expect(phoneNumberField.modelOptions?.updateOn).toBe('change');
        expect(phoneNumberField.modelOptions?.debounce?.default).toBe(10);
    });

    it('should clean phone number formatting with parser', () => {
        const testCases = [
            { input: '123 456 789', expected: '123456789' },
            { input: ' 123 456 789 ', expected: '123456789' },
            { input: undefined, expected: '' },
            { input: null, expected: '' },
            { input: '', expected: '' },
        ];

        if (phoneNumberField.parsers && phoneNumberField.parsers.length > 0) {
            testCases.forEach(({ input, expected }) => {
                const parser = phoneNumberField.parsers?.[0];
                if (parser) {
                    const result = parser(input);
                    expect(result).toBe(expected);
                } else {
                    fail('Parser function not found at index 0');
                }
            });
        } else {
            fail('Phone number field parsers not defined.');
        }
    });

    it('should have correct email field validation', () => {
        const fields = service.fields();
        const emailField = fields[2].fieldGroup?.[0] as FormlyFieldConfig;

        expect(emailField.key).toBe('user_email');
        expect(emailField.type).toBe('input');
        expect(emailField.props?.type).toBe('email');
        expect(emailField.props?.required).toBe(true);

        const formControl = new FormControl('');
        if (emailField.props?.type === 'email' && emailField.props?.required) {
            formControl.setValidators([Validators.required, Validators.email]);
        }

        formControl.setValue('invalid-email');
        expect(formControl.valid).toBe(false);
        expect(formControl.hasError('email')).toBe(true);

        formControl.setValue('valid@email.com');
        expect(formControl.valid).toBe(true);

        formControl.setValue('');
        expect(formControl.valid).toBe(false);
        expect(formControl.hasError('required')).toBe(true);
    });

    it('should have correct facility fields', () => {
        const fields = service.fields();

        const facilityFieldGroup = fields.find(
            field =>
                field.fieldGroup &&
                field.fieldGroup.some(f => f.key === 'facility_name')
        ) as FormlyFieldConfig;

        expect(facilityFieldGroup).toBeDefined();

        const facilityNameField = facilityFieldGroup.fieldGroup?.find(
            f => f.key === 'facility_name'
        ) as FormlyFieldConfig;
        const mflCodeField = facilityFieldGroup.fieldGroup?.find(
            f => f.key === 'mfl_code'
        ) as FormlyFieldConfig;
        const facilityTypeField = facilityFieldGroup.fieldGroup?.find(
            f => f.key === 'facility_type'
        ) as FormlyFieldConfig;
        const countyField = facilityFieldGroup.fieldGroup?.find(
            f => f.key === 'county'
        ) as FormlyFieldConfig;

        expect(facilityNameField.props?.required).toBe(true);
        expect(mflCodeField.props?.required).toBe(true);
        expect(facilityTypeField.props?.required).toBe(true);
        expect(countyField.props?.required).toBe(true);

        expect((facilityTypeField.props as any).options).toEqual([
            { title: 'Hospital', value: 'HOSPITAL' },
            { title: 'Clinic', value: 'CLINIC' },
        ]);
    });

    it('should have terms and conditions field', () => {
        const fields = service.fields();
        const termsField = fields.find(
            field => field.key === 'agreed_to_terms'
        ) as FormlyFieldConfig;

        expect(termsField).toBeDefined();
        expect(termsField.type).toBe('checkbox');
        expect(termsField.props?.required).toBe(true);
        expect(termsField.props?.label).toContain(
            'I have read and agree to the terms'
        );
    });

    it('should initialize counties and specialists on setComponent', () => {
        const comp = { model: {}, fields: [], cd: { detectChanges: () => {} } };

        service.setComponent(comp);

        expect(service.counties).toContain({
            name: 'NAIROBI',
            title: 'Nairobi',
        });
        expect(service.counties).toContain({
            name: 'MOMBASA',
            title: 'Mombasa',
        });

        expect(service.specialists).toContain({
            title: 'Doctor',
            value: 'DOCTOR',
        });
        expect(service.specialists).toContain({
            title: 'Nurse',
            value: 'NURSE',
        });
    });

    it('should handle terms field hooks correctly', () => {
        const fields = service.fields();
        const termsField = fields.find(
            field => field.key === 'agreed_to_terms'
        ) as FormlyFieldConfig;

        expect(termsField.hooks).toBeDefined();
        expect(termsField.hooks?.onInit).toBeDefined();
    });

    it('should test email validator expression with null/empty value', () => {
        const fields = service.fields();
        const emailField = fields[2].fieldGroup?.[0] as FormlyFieldConfig;

        const emailValidator = emailField.validators?.email?.expression;
        expect(emailValidator).toBeDefined();

        const nullControl = new FormControl(null);
        expect(emailValidator(nullControl)).toBe(true);

        const emptyControl = new FormControl('');
        expect(emailValidator(emptyControl)).toBe(true);

        const validControl = new FormControl('test@example.com');
        expect(emailValidator(validControl)).toBe(true);

        const invalidControl = new FormControl('not-an-email');
        expect(emailValidator(invalidControl)).toBe(false);
    });

    it('should test terms field hooks with form changes', () => {
        const fields = service.fields();
        const termsField = fields.find(
            field => field.key === 'agreed_to_terms'
        ) as FormlyFieldConfig;

        const mockForm = new FormGroup({
            first_name: new FormControl('John'),
            last_name: new FormControl('Doe'),
        });

        const mockField = {
            form: mockForm,
            props: { disabled: false },
            options: {
                detectChanges: jasmine.createSpy('detectChanges'),
                parentComponent: {
                    onTermsChange: jasmine.createSpy('onTermsChange'),
                },
            },
        };

        spyOn(service, 'validateRequiredFields').and.returnValue(false);

        termsField.hooks?.onInit?.(mockField as any);

        mockForm.patchValue({ first_name: 'Jane' });

        expect(service.validateRequiredFields).toHaveBeenCalledWith(mockForm);

        expect(mockField.props.disabled).toBe(true);

        expect(mockField.options.detectChanges).toHaveBeenCalled();

        service.validateRequiredFields = jasmine
            .createSpy()
            .and.returnValue(true);

        termsField.hooks?.onInit?.(mockField as any);

        expect(mockField.props.disabled).toBe(false);
    });

    it('should test expressions in terms field', () => {
        const fields = service.fields();
        const termsField = fields.find(
            field => field.key === 'agreed_to_terms'
        ) as FormlyFieldConfig;

        expect(termsField).toBeDefined();
        expect(termsField.expressions).toBeDefined();
        expect(termsField.expressions?.['props.change']).toBe(
            'model.agreed_to_terms !== undefined ? (field.options.parentComponent.onTermsChange({checked: model.agreed_to_terms})) : null'
        );
    });

    it('should get the correct Terms of Service URL', () => {
        const expectedUrl = `${(window.location as any).origin}/tos/document`;

        const tosUrl = service.getTosUrl();

        expect(tosUrl).toBe(expectedUrl);
    });

    it('should include the correct Terms of Service URL in the terms section template', () => {
        const expectedUrl = `${(window.location as any).origin}/tos/document`;

        const fields = service.fields();
        const termsField = fields.find(f => f.key === 'terms_section_heading');
        expect(termsField).toBeDefined();
        expect(termsField?.props?.template).toContain(`href="${expectedUrl}"`);
    });
});

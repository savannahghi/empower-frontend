import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
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
import { FacilityOwnerService } from './facility-owner-form';

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

describe('FacilityOwnerForm', () => {
    let service: FacilityOwnerService;
    let phoneNumberField: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                FacilityOwnerService,
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

        service = TestBed.inject(FacilityOwnerService);

        const fields = service.fields();
        phoneNumberField = fields[1].fieldGroup[1];
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

        // test role
        const field = {
            model: {
                role: 'DOCTOR',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };

        fields[1].fieldGroup[0]['expressions']['model.email'](field);
        fields[2].expressions['model.role'](field);
        expect(service.fields).toHaveBeenCalled();
    });

    it('should have correct field configuration', () => {
        expect(phoneNumberField).toBeDefined();
        expect(phoneNumberField.type).toBe('input');
        expect(phoneNumberField.props.label).toBe('Phone number');
        expect(phoneNumberField.props.placeholder).toBe('+254000000000');
        expect(phoneNumberField.props.required).toBeTrue();
        expect(phoneNumberField.props.mask).toBe('000 000 000');
        expect(phoneNumberField.props.prefix).toBe('+254 ');
        expect(phoneNumberField.modelOptions.updateOn).toBe('change');
        expect(phoneNumberField.modelOptions.debounce.default).toBe(10);
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

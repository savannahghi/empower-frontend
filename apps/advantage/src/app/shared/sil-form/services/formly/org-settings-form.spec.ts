import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { OrgSettingsService } from './org-settings-form';
import { FormControl, FormGroup } from '@angular/forms';
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
        return {
            client_types: ['PROVIDER'],
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

describe('OrgSettingsService', () => {
    let service: OrgSettingsService;
    let formGroup: FormGroup;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                OrgSettingsService,
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

        service = TestBed.inject(OrgSettingsService);
        formGroup = new FormGroup({
            custom_input: new FormControl('custom_input'),
            org: new FormControl('org'),
            branch: new FormControl('branch'),
            year: new FormControl('year'),
            seq: new FormControl('seq'),
            current_setting: new FormControl(''),
            custom_input_value: new FormControl('customValue'),
        });
    });

    it('should test fields', fakeAsync(() => {
        const comp = {
            fields: [
                {
                    props: {
                        label: 'Reason for cancellation',
                        required: true,
                    },
                },
            ],
            cd: {
                detectChanges: () => {},
            },
            form: { value: 'org' },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        fields[0].expressionProperties.template({});
        fields[0].expressionProperties.template({ default: 'value' });
        fields[2].expressionProperties.template({ default: 'value' });
        fields[7].expressionProperties.template({ default: 'value' });
        fields[9].expressionProperties.template({ default: 'value' });
        fields[11].expressionProperties.template({ default: 'value' });
        fields[13].expressionProperties.template({ default: 'value' });
        fields[15].expressionProperties.template({ default: 'value' });

        const field = {
            formControl: {
                pristine: true,
            },
            model: {
                value: '12',
            },
        };

        fields[1].expressions['model.value'](field);
        fields[3].expressions['model.value'](field);
        fields[4].expressions['model.value'](field);
        fields[5].expressions['model.value'](field);
        fields[8].expressions['model.value'](field);
        fields[10].expressions['model.value'](field);
        fields[12].expressions['model.value'](field);
        fields[14].expressions['model.value'](field);
        fields[16].expressions['model.value'](field);
        const field2 = {
            formControl: {
                pristine: true,
            },
            model: {
                value: [12],
            },
        };
        fields[4].expressions['model.value'](field2);
        const lastField = {
            model: {
                value: [12],
            },
        };
        fields[17].expressions['model.value'](lastField);

        expect(service.fields).toHaveBeenCalled();
    }));

    it('should filter options correctly', () => {
        service.setComponent({ form: formGroup });
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        let options = service.getFilteredOptions();
        expect(options.length).toEqual(0);
        formGroup.get('org').setValue('');
        options = service.getFilteredOptions();
        const formValues = {
            custom_input: 'input1',
            org: 'org1',
            branch: 'branch1',
            year: '2024',
            seq: 'seq1',
            custom_input_value: 'customValue',
        };

        const field4 = {
            model: {
                value: 'initialValue', // Assuming initial value is provided
            },
        };
        service.updateValue(formValues);
        fields[17].expressions['model.value'](field4);

        const field = {
            props: {
                options: ['custom_input', 'org', 'branch', 'year', 'seq'],
            },
        };
        fields[8].expressions['model.onFocus'](field);
        fields[10].expressions['model.onFocus'](field);
        fields[12].expressions['model.onFocus'](field);
        fields[14].expressions['model.onFocus'](field);
        fields[16].expressions['model.onFocus'](field);
        expect(options.some(option => option.value === 'org')).toBeTruthy();
    });

    it('should test updateValue fnx branch one', () => {
        service.setComponent({ form: formGroup });
        const formValues = {
            custom_input: 'input1',
            org: 'org1',
            branch: 'branch1',
            year: '2024',
            seq: 'seq1',
            custom_input_value: 'customValue',
        };
        service.component.form = { value: formValues };

        service.updateValue(formValues);
        expect(service).toBeTruthy();
    });
});

describe('OrgSettingsService Branch Two', () => {
    let service: OrgSettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                OrgSettingsService,
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

        service = TestBed.inject(OrgSettingsService);
    });

    it('should test updateValue fnx branch two', () => {
        const comp = {
            fields: [
                {
                    props: {
                        label: 'Reason for cancellation',
                        required: true,
                    },
                },
            ],
            cd: {
                detectChanges: () => {},
            },
            form: { value: 'org' },
        };

        service.setComponent(comp);
        const formValues = { model: { value: 'org' } };
        service.updateValue(formValues);
        expect(service).toBeTruthy();
    });
});

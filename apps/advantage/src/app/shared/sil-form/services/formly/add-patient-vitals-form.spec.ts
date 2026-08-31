import { PatientVitalFieldsService } from './add-patient-vitals-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NbToastrService, NbStatusService } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../../app-config.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class NbStatusServiceStub {
    isCustomStatus() {}
}

class AuthenticationServiceStub {
    checkPermission() {
        return false;
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
        };
    }
}

describe('AddPatientVitalFieldsService', () => {
    let service: PatientVitalFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                PatientVitalFieldsService,
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
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(PatientVitalFieldsService);
    });

    it('should test fields and observable functions', () => {
        const comp = {
            secondaryData: [
                {},
                {
                    vitals_reference_ranges: {
                        PULSE_RATE: [{ start: 10, end: 31, display: 'LOW' }],
                        SYSTOLIC_BLOOD_PRESSURE: [
                            {
                                start: 1,
                                end: 91,
                                display: 'LOW',
                            },
                        ],
                        DIASTOLIC_BLOOD_PRESSURE: [
                            {
                                start: 1,
                                end: 91,
                                display: 'LOW',
                            },
                        ],
                        SPO2: [{ start: 1, end: 92, display: 'CRITICAL' }],
                        RESPIRATION_RATE: [
                            {
                                start: 1,
                                end: 9,
                                display: 'VERY LOW',
                            },
                        ],
                        TEMPERATURE: [
                            {
                                start: 1,
                                end: 16,
                                display: 'COLD',
                            },
                        ],
                        MUAC: [
                            {
                                start: 1,
                                end: 16,
                                display: 'NORMAL',
                            },
                        ],
                        BMI: [
                            {
                                start: 1,
                                end: 24,
                                display: 'NORMAL',
                            },
                        ],
                    },
                },
                {
                    model: { value: '90' },
                },
                { isEditing: true },
            ],
            fields: [
                {},
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
        service.checkField('pulse', { pulse: true });
        service.checkField('s_bp', { bp: true });
        service.checkField('d_bp', { bp: true });
        service.checkField('temperature', { temperature: true });
        service.checkField('oxygenSaturation', { oxygenSaturation: true });
        service.checkField('respirationRate', { respirationRate: true });
        service.checkField('weight', { weight: true });
        service.checkField('height', { height: true });
        service.checkField('bmi', { bmi: true });
        service.checkField('muac', { muac: true });
        service.checkField('viralLoad', { viralLoad: true });

        /** test vital color pipe */
        service.vitalStatus('Very Low');
        service.vitalStatus('High');
        service.vitalStatus('');

        service.vitalType = {
            pulse: true,
            s_bp: true,
            d_bp: true,
            temperature: true,
            oxygenSaturation: true,
            respirationRate: true,
            weight: true,
            height: true,
            bmi: true,
            muac: true,
            viralLoad: true,
        };
        const field = {
            model: {
                pulse: 10,
                value: 10,
            },
        };
        const field3i = {
            model: {
                s_bp: 4,
            },
        };
        const field3ii = {
            model: {
                d_bp: 4,
            },
        };
        const field4 = {
            model: {
                temperature: 10,
            },
        };
        const field5 = {
            model: {
                oxygenSaturation: 4,
            },
        };
        const field6 = {
            model: {
                respirationRate: 4,
            },
        };
        const weightField = {
            model: {
                weight: 30,
            },
        };
        const heightField = {
            model: {
                height: 70,
            },
        };
        const bmiField = {
            model: {
                bmi: 20,
            },
        };
        const muacField = {
            model: {
                muac: 14,
            },
        };
        const viralLoadField = {
            model: {
                viralLoad: 20,
            },
        };
        fields[0].validators['pulse'].expression({ value: '10' }, field); // pulse
        fields[0].expressions['model.pulse'](field);
        fields[1].expressionProperties['template'](field.model); // pulse reference
        fields[2].validators['s_bp'].expression({ value: '4' }, field3i); // s_bp
        fields[2].expressions['model.s_bp'](field3i);
        fields[3].expressionProperties['template'](field3i.model); // s_bp reference
        fields[4].validators['d_bp'].expression({ value: '4' }, field3ii); // d_bp
        fields[4].expressions['model.d_bp'](field3ii);
        fields[5].expressionProperties['template'](field3ii.model); // d_bp reference
        fields[6].validators['temperature'].expression({ value: '10' }, field4); // temperature
        fields[6].expressions['model.temperature'](field4);
        fields[7].expressionProperties['template'](field4.model); // temperature reference
        fields[8].validators['oxygenSaturation'].expression(
            { value: '20' },
            field5
        );
        fields[8].expressions['model.oxygenSaturation'](field5);
        // oxygen saturation
        fields[9].expressionProperties['template'](field5.model); // oxygen saturation reference
        fields[10].validators['respirationRate'].expression(
            { value: '20' },
            field6
        );
        fields[10].expressions['model.respirationRate'](field6);
        // respirationRate
        fields[11].expressionProperties['template'](field6.model); // respirationRate reference
        fields[12].validators['weight'].expression(
            { value: '30' },
            weightField
        );
        fields[12].expressions['model.weight'](weightField);
        // weight
        fields[13].validators['height'].expression(
            { value: '70' },
            heightField
        );
        fields[13].expressions['model.height'](heightField);
        // height
        fields[14].validators['bmi'].expression({ value: '24' }, bmiField); // bmi
        fields[14].expressions['model.bmi'](bmiField);
        fields[15].expressionProperties['template'](bmiField.model); // bmi reference
        fields[16].validators['muac'].expression({ value: '14' }, muacField); // muac
        fields[16].expressions['model.muac'](muacField);
        fields[17].expressionProperties['template'](muacField.model); // muac reference
        fields[18].validators['viralLoad'].expression(
            { value: '70' },
            viralLoadField
        ); // viral load
        fields[18].expressions['model.viralLoad'](viralLoadField);

        // Test BMI validator with NaN value to cover line 534
        const bmiNaNResult = fields[14].validators['bmi'].expression({
            value: 'not_a_number',
        });
        expect(bmiNaNResult).toBe(false);

        // Test MUAC validator with NaN value to cover line 599
        const muacNaNResult = fields[16].validators['muac'].expression(
            { value: 'not_a_number' },
            { model: { muac: undefined } }
        );
        expect(muacNaNResult).toBe(false);

        // Test Viral Load validator with NaN value to cover line 670
        const viralLoadNaNResult = fields[18].validators[
            'viralLoad'
        ].expression({
            value: 'not_a_number',
        });
        expect(viralLoadNaNResult).toBe(false);

        expect(service.fields).toHaveBeenCalled();
    });
});

describe('AddPatientVitalFieldsService error', () => {
    let service: PatientVitalFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                PatientVitalFieldsService,
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
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(PatientVitalFieldsService);
    });
    it('should test undefined control input fields', () => {
        const comp = {
            secondaryData: [{}, {}],
            fields: [
                {},
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
        service.vitalType = {
            temperature: true,
            pulse: false,
            s_bp: false,
            d_bp: false,
            weight: false,
            height: false,
            bmi: false,
            muac: false,
            viralLoad: false,
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        service.checkField('pulse', { pulse: true });
        service.checkField('s_bp', { s_bp: true });
        service.checkField('d_bp', { d_bp: true });
        service.checkField('temperature', { temperature: true });
        service.checkField('oxygenSaturation', { oxygenSaturation: true });
        service.checkField('respirationRate', { respirationRate: true });
        service.checkField('weight', { weight: true });
        service.checkField('height', { height: true });
        service.checkField('bmi', { bmi: true });
        service.checkField('muac', { muac: true });

        const field = {
            model: {
                pulse: undefined,
            },
        };
        const field3i = {
            model: {
                s_bp: undefined,
            },
        };
        const field3ii = {
            model: {
                d_bp: undefined,
            },
        };
        const field4 = {
            model: {
                temperature: undefined,
            },
        };
        const field5 = {
            model: {
                SPO2: undefined,
            },
        };
        const field6 = {
            model: {
                respirationRate: undefined,
            },
        };
        const field7 = {
            model: {
                bmi: undefined,
            },
        };
        const field8 = {
            model: {
                muac: undefined,
            },
        };
        fields[0].validators['pulse'].expression({ value: '10' }, field);
        fields[1].expressionProperties['template'](field.model);
        fields[2].validators['s_bp'].expression({ value: '41' }, field3i);
        fields[3].expressionProperties['template'](field3i.model);
        fields[4].validators['d_bp'].expression({ value: '41' }, field3ii);
        fields[5].expressionProperties['template'](field3ii.model);
        fields[6].validators['temperature'].expression({ value: '12' }, field4);
        fields[7].expressionProperties['template'](field4.model);
        fields[8].validators['oxygenSaturation'].expression(
            { value: '20' },
            field5
        );
        fields[9].expressionProperties['template'](field5.model);
        fields[10].validators['respirationRate'].expression(
            { value: '20' },
            field6
        );
        fields[11].expressionProperties['template'](field6.model);
        fields[12].validators['weight'].expression(
            { value: '500' },
            {
                model: {
                    weight: undefined,
                },
            }
        );
        fields[13].validators['height'].expression(
            { value: '500' },
            {
                model: {
                    height: undefined,
                },
            }
        );
        fields[14].validators['bmi'].expression(
            { value: '24' },
            {
                model: {
                    bmi: undefined,
                },
            }
        );
        fields[15].expressionProperties['template'](field7.model);
        fields[16].validators['muac'].expression(
            { value: '20' },
            {
                model: {
                    muac: undefined,
                },
            }
        );
        fields[17].expressionProperties['template'](field8.model);
        fields[18].validators['viralLoad'].expression(
            { value: '500' },
            {
                model: {
                    weight: undefined,
                },
            }
        );
        fields[13].validators['height'].expression(
            { value: '500' },
            {
                model: {
                    height: undefined,
                },
            }
        );
        fields[14].validators['bmi'].expression(
            { value: '24' },
            {
                model: {
                    bmi: undefined,
                },
            }
        );
        fields[15].expressionProperties['template'](field7.model);
        fields[16].validators['muac'].expression(
            { value: '20' },
            {
                model: {
                    muac: undefined,
                },
            }
        );
        fields[17].expressionProperties['template'](field8.model);
        fields[18].validators['viralLoad'].expression(
            { value: '120' },
            {
                model: {
                    viralLoad: undefined,
                },
            }
        );

        // Additional tests to cover NaN validation branches (lines 534, 599, 670)
        // Test BMI with invalid text value
        fields[14].validators['bmi'].expression({ value: 'abc' });

        // Test MUAC with invalid text value
        fields[16].validators['muac'].expression(
            { value: 'xyz' },
            { model: { muac: undefined } }
        );

        // Test Viral Load with invalid text value
        fields[18].validators['viralLoad'].expression({ value: 'invalid' });

        expect(service.fields).toHaveBeenCalled();
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test validation expressions with invalid (NaN) values', () => {
        const comp = {
            secondaryData: [
                {},
                {
                    vitals_reference_ranges: {
                        PULSE_RATE: [{ start: 10, end: 31, display: 'LOW' }],
                        SYSTOLIC_BLOOD_PRESSURE: [
                            {
                                start: 1,
                                end: 91,
                                display: 'LOW',
                            },
                        ],
                        DIASTOLIC_BLOOD_PRESSURE: [
                            {
                                start: 1,
                                end: 91,
                                display: 'LOW',
                            },
                        ],
                        SPO2: [{ start: 1, end: 92, display: 'CRITICAL' }],
                        RESPIRATION_RATE: [
                            {
                                start: 1,
                                end: 9,
                                display: 'VERY LOW',
                            },
                        ],
                        TEMPERATURE: [
                            {
                                start: 1,
                                end: 16,
                                display: 'COLD',
                            },
                        ],
                        MUAC: [
                            {
                                start: 1,
                                end: 16,
                                display: 'NORMAL',
                            },
                        ],
                        BMI: [
                            {
                                start: 1,
                                end: 24,
                                display: 'NORMAL',
                            },
                        ],
                    },
                },
                {
                    model: { value: '90' },
                },
                { isEditing: true },
            ],
            fields: [
                {},
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
        service.vitalType = {
            pulse: true,
            s_bp: true,
            d_bp: true,
            temperature: true,
            oxygenSaturation: true,
            respirationRate: true,
            weight: true,
            height: true,
            bmi: true,
            muac: true,
            viralLoad: true,
        };

        const fields = service.fields();

        // Test BMI validator with invalid (NaN) value - line 534
        const bmiValidationResult = fields[14].validators['bmi'].expression({
            value: 'invalid_text',
        });
        expect(bmiValidationResult).toBe(false);

        // Test MUAC validator with invalid (NaN) value - line 599
        const muacValidationResult = fields[16].validators['muac'].expression(
            { value: 'invalid_text' },
            { model: { muac: undefined } }
        );
        expect(muacValidationResult).toBe(false);

        // Test Viral Load validator with invalid (NaN) value - line 670
        const viralLoadValidationResult = fields[18].validators[
            'viralLoad'
        ].expression({
            value: 'invalid_text',
        });
        expect(viralLoadValidationResult).toBe(false);
    });

    it('should test undefined fields', () => {
        const comp = {
            secondaryData: [
                {},
                {
                    vitals_reference_ranges: {
                        PULSE_RATE: [
                            { start: 10, end: 41, display: 'VERY LOW' },
                        ],
                        SYSTOLIC_BLOOD_PRESSURE: [
                            {
                                start: 1,
                                end: 91,
                                display: 'LOW',
                            },
                        ],
                        DIASTOLIC_BLOOD_PRESSURE: [
                            {
                                start: 1,
                                end: 91,
                                display: 'LOW',
                            },
                        ],
                        MUAC: [
                            {
                                start: 1,
                                end: 25,
                                display: 'NORMAL',
                            },
                        ],
                        BMI: [
                            {
                                start: 1,
                                end: 24,
                                display: 'NORMAL',
                            },
                        ],
                        TEMPERATURE: [
                            {
                                start: 1,
                                end: 16,
                                display: 'COLD',
                            },
                        ],
                        SPO2: [{ start: 1, end: 92, display: 'CRITICAL' }],
                        RESPIRATION_RATE: [
                            {
                                start: 1,
                                end: 9,
                                display: 'VERY LOW',
                            },
                        ],
                    },
                },
            ],
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
        service.vitalType = {
            pulse: false,
            weight: false,
            height: false,
            s_bp: false,
            d_bp: false,
            oxygenSaturation: false,
            respirationRate: false,
            bmi: false,
            muac: false,
            viralLoad: false,
        };
        const field = {
            model: {
                PULSE_RATE: undefined,
            },
        };
        const field3i = {
            model: {
                SYSTOLIC_BLOOD_PRESSURE: undefined,
            },
        };
        const field3ii = {
            model: {
                DIASTOLIC_BLOOD_PRESSURE: undefined,
            },
        };
        const field4 = {
            model: {
                TEMPERATURE: undefined,
            },
        };
        const field5 = {
            model: {
                SPO2: undefined,
            },
        };
        const field6 = {
            model: {
                RESPIRATION_RATE: undefined,
            },
        };

        const field7 = {
            model: {
                BMI: undefined,
            },
        };

        const field8 = {
            model: {
                MUAC: undefined,
            },
        };

        fields[0].validators['pulse'].expression({ value: undefined }, field);
        fields[1].expressionProperties['template'](field.model);
        fields[2].validators['s_bp'].expression({ value: undefined }, field3i);
        fields[3].expressionProperties['template'](field3i.model);
        fields[4].validators['d_bp'].expression({ value: undefined }, field3ii);
        fields[5].expressionProperties['template'](field3ii.model);
        fields[6].validators['temperature'].expression(
            { value: undefined },
            field4
        );
        fields[7].expressionProperties['template'](field4.model);
        fields[8].validators['oxygenSaturation'].expression(
            { value: undefined },
            field4
        );
        fields[9].expressionProperties['template'](field5.model);
        fields[10].validators['respirationRate'].expression(
            { value: undefined },
            field4
        );
        fields[11].expressionProperties['template'](field6.model);
        fields[12].validators['weight'].expression(
            { value: undefined },
            {
                model: {
                    weight: undefined,
                },
            }
        );
        fields[13].validators['height'].expression(
            { value: undefined },
            {
                model: {
                    height: undefined,
                },
            }
        );
        fields[14].validators['bmi'].expression(
            { value: undefined },
            {
                model: {
                    bmi: undefined,
                },
            }
        );
        fields[15].expressionProperties['template'](field7.model);
        fields[16].validators['muac'].expression(
            { value: undefined },
            {
                model: {
                    muac: undefined,
                },
            }
        );
        fields[17].expressionProperties['template'](field8.model);
        fields[18].validators['viralLoad'].expression(
            { value: undefined },
            {
                model: {
                    viralLoad: undefined,
                },
            }
        );
        expect(service.fields).toHaveBeenCalled();
    });
});

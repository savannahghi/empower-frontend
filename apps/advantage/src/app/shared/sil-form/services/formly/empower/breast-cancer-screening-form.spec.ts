import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../../app-config.service';
import { SilStoresService } from '../../../../sil-http-services/sil_datalayer.service';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BreastCancerScreeningService } from './breast-cancer-screening-form';
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

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
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

describe('BreastCancerScreeningForm', () => {
    let service: BreastCancerScreeningService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                BreastCancerScreeningService,
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

        service = TestBed.inject(BreastCancerScreeningService);
    });

    it('should test fields', () => {
        const comp = {
            fields: [{}, {}, {}],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        service.fields();
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields and have values', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
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
        const fields = service.fields();

        const field = {
            model: {
                cancer_test: [
                    {
                        selected_test: 'Mammogram',
                        test_type: 'Add results',
                        selected_result: 'Negative',
                        additional_notes: 'N/A',
                        data: '',
                    },
                    {
                        selected_test: 'Ultrasound',
                        test_type: 'Add results',
                        selected_result: 'Negative',
                        additional_notes: 'N/A',
                        data: '',
                    },
                    {
                        selected_test: 'MRI',
                        test_type: 'Add results',
                        selected_result: 'Negative',
                        additional_notes: 'N/A',
                        data: '',
                    },
                    {
                        selected_test: 'Mammogram',
                        test_type: 'Add results',
                        selected_result: 'Negative',
                        additional_notes: 'N/A',
                        data: '',
                    },
                ],
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'Mammogram',
        };

        fields[0].fieldGroup[0]['expressions']['model.test_action'](field);
        fields[0].fieldGroup[1]['expressions']['model.selected_test'](field);
        fields[0].fieldGroup[2]['expressions']['model.selected_result'](field);
        fields[0].fieldGroup[3]['expressions']['model.selected_result'](field);
        fields[0].fieldGroup[4]['expressions']['model.selected_result'](field);
        fields[0].fieldGroup[5]['expressions']['model.selected_result'](field);
        fields[0].fieldGroup[6]['expressions']['model.selected_result'](field);
        fields[0].fieldGroup[8]['expressions']['model.attachment'](field);
        fields[0].fieldGroup[8]['expressions']['model.attachment'](field);

        fields[0].fieldGroup[8].props.addFile(field.model);

        fields[0].fieldGroup[8]['expressions']['model.file']();
        fields[0].fieldGroup[9]['expressions']['model.facility'](field);
        fields[0].fieldGroup[10]['expressions']['model.clinical_notes'](field);
        fields[0].fieldGroup[11]['expressions']['model.referral_notes'](field);
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields and hide', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
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
        const fields = service.fields();

        const field = {
            model: {
                test_action: 'add_results',
                selected_test: 'Mammogram',
                selected_result: 'Negative',
                additional_notes: 'N/A',
                data: '',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'Mammogram',
        };

        const fieldSelectedTest = {
            model: {
                test_action: 'test_referral',
                selected_test: 'CBE',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[0].fieldGroup[0]['expressions']['model.test_action'](field);
        fields[0].fieldGroup[1]['expressions']['model.selected_test'](field);
        fields[0].fieldGroup[1]['expressions']['hide'](field);
        fields[0].fieldGroup[2]['expressions']['hide'](field);
        fields[0].fieldGroup[3]['expressions']['hide'](field);
        fields[0].fieldGroup[4]['expressions']['hide'](field);
        fields[0].fieldGroup[5]['expressions']['hide'](fieldSelectedTest);
        fields[0].fieldGroup[6]['expressions']['hide'](field);
        fields[0].fieldGroup[7]['expressions']['hide'](fieldSelectedTest);
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields and hide when files are undefined', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
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
        const fields = service.fields();

        const field = {
            model: {
                test_action: 'add_results',
                selected_test: 'Mammogram',
                selected_result: 'Negative',
                additional_notes: 'N/A',
                data: '',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'Mammogram',
        };
        fields[0].fieldGroup[1]['expressions']['hide'](field);
        fields[0].fieldGroup[0]['expressions']['model.test_action'](field);
        fields[0].fieldGroup[2]['expressions']['hide'](field);
        fields[0].fieldGroup[3]['expressions']['hide'](field);
        fields[0].fieldGroup[4]['expressions']['hide'](field);
        fields[0].fieldGroup[5]['expressions']['hide'](field);
        fields[0].fieldGroup[6]['expressions']['hide'](field);
        fields[0].fieldGroup[7]['expressions']['hide'](field);
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields and show referral_notes', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
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
        service.setComponent(comp);
        expect(service.fields).toHaveBeenCalled();
        const fields = service.fields();

        const field = {
            model: {
                test_action: 'add_results',
                selected_test: 'Mammogram',
                selected_result: 'Negative',
                additional_notes: 'N/A',
                data: '',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'Mammogram',
        };

        const fieldSelectedTest = {
            model: {
                test_action: 'add_results',
                selected_test: 'Ultrasound',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[0].fieldGroup[1]['expressions']['model.selected_test'](
            fieldSelectedTest
        );
        const fieldResultsAction = {
            model: {
                test_action: 'add_results',
                selected_test: undefined,
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[0].fieldGroup[1]['expressions']['hide'](field);

        fields[0].fieldGroup[2]['expressions']['hide'](fieldResultsAction);
        fields[0].fieldGroup[3]['expressions']['hide'](field);
        fields[0].fieldGroup[4]['expressions']['hide'](field);
        fields[0].fieldGroup[5]['expressions']['hide'](field);
        fields[0].fieldGroup[6]['expressions']['hide'](field);
        fields[0].fieldGroup[7]['expressions']['hide'](fieldResultsAction);
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields and show facility', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
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
        const fields = service.fields();

        const field = {
            model: {
                test_action: 'add_results',
                selected_test: 'Immunohistochemistry',
                selected_result: 'Negative',
                additional_notes: 'N/A',
                data: '',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'Mammogram',
        };

        const fieldSelectedTest = {
            model: {
                test_action: 'add_results',
                selected_test: 'MRI',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[0].fieldGroup[1]['expressions']['model.selected_test'](
            fieldSelectedTest
        );
        const fieldResultsAction = {
            model: {
                test_action: 'test_referral',
                selected_test: 'MRI',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        fields[0].fieldGroup[1]['expressions']['hide'](fieldResultsAction);
        fields[0].fieldGroup[0]['expressions']['model.test_action'](
            fieldResultsAction
        );
        fields[0].fieldGroup[2]['expressions']['hide'](fieldResultsAction);
        fields[0].fieldGroup[3]['expressions']['hide'](fieldResultsAction);
        fields[0].fieldGroup[4]['expressions']['hide'](fieldResultsAction);
        fields[0].fieldGroup[5]['expressions']['hide'](field);
        fields[0].fieldGroup[6]['expressions']['hide'](fieldResultsAction);
        fields[0].fieldGroup[7]['expressions']['hide'](fieldResultsAction);
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test test_action hook resets fields and sets Mammogram default when switching to add_results', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        const fields = service.fields();

        const selectedTestResetSpy = jasmine.createSpy('selectedTestReset');
        const selectedResultResetSpy = jasmine.createSpy('selectedResultReset');
        const attachmentResetSpy = jasmine.createSpy('attachmentReset');
        const facilityResetSpy = jasmine.createSpy('facilityReset');
        const clinicalNotesResetSpy = jasmine.createSpy('clinicalNotesReset');
        const referralNotesResetSpy = jasmine.createSpy('referralNotesReset');

        const mockForm = {
            get: (key: string) => {
                void key;
                const resetSpies = {
                    selected_test: selectedTestResetSpy,
                    selected_result: selectedResultResetSpy,
                    attachment: attachmentResetSpy,
                    facility: facilityResetSpy,
                    clinical_notes: clinicalNotesResetSpy,
                    referral_notes: referralNotesResetSpy,
                };
                return { reset: resetSpies[key] };
            },
        };

        const field = {
            model: {
                selected_test: 'Biopsy',
            },
            formControl: {
                valueChanges: of('add_results'),
            },
            form: mockForm,
            options: {},
        };

        fields[0].fieldGroup[0].hooks.onInit(field);

        expect(selectedTestResetSpy).toHaveBeenCalled();
        expect(selectedResultResetSpy).toHaveBeenCalled();
        expect(attachmentResetSpy).toHaveBeenCalled();
        expect(facilityResetSpy).toHaveBeenCalled();
        expect(clinicalNotesResetSpy).toHaveBeenCalled();
        expect(referralNotesResetSpy).toHaveBeenCalled();
        expect(field.model.selected_test).toBe('Mammogram');
    });

    it('should test test_action hook resets fields but does not set Mammogram default when switching to test_referral', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        const fields = service.fields();

        const selectedTestResetSpy = jasmine.createSpy('selectedTestReset');
        const selectedResultResetSpy = jasmine.createSpy('selectedResultReset');
        const attachmentResetSpy = jasmine.createSpy('attachmentReset');
        const facilityResetSpy = jasmine.createSpy('facilityReset');
        const clinicalNotesResetSpy = jasmine.createSpy('clinicalNotesReset');
        const referralNotesResetSpy = jasmine.createSpy('referralNotesReset');

        const mockForm = {
            get: (key: string) => {
                void key;
                const resetSpies = {
                    selected_test: selectedTestResetSpy,
                    selected_result: selectedResultResetSpy,
                    attachment: attachmentResetSpy,
                    facility: facilityResetSpy,
                    clinical_notes: clinicalNotesResetSpy,
                    referral_notes: referralNotesResetSpy,
                };
                return { reset: resetSpies[key] };
            },
        };

        const field = {
            model: {
                selected_test: 'Mammogram',
            },
            formControl: {
                valueChanges: of('test_referral'),
            },
            form: mockForm,
            options: {},
        };

        fields[0].fieldGroup[0].hooks.onInit(field);

        expect(selectedTestResetSpy).toHaveBeenCalled();
        expect(selectedResultResetSpy).toHaveBeenCalled();
        expect(attachmentResetSpy).toHaveBeenCalled();
        expect(facilityResetSpy).toHaveBeenCalled();
        expect(clinicalNotesResetSpy).toHaveBeenCalled();
        expect(referralNotesResetSpy).toHaveBeenCalled();
        expect(field.model.selected_test).toBe('Mammogram');
    });

    it('should test test_action hook when fieldControl is missing and model is undefined', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        const fields = service.fields();

        const mockForm = {
            get: () => undefined,
        };

        const field = {
            model: undefined,
            formControl: {
                valueChanges: of('add_results'),
            },
            form: mockForm,
            options: {},
        };

        expect(() => fields[0].fieldGroup[0].hooks.onInit(field)).not.toThrow();
    });

    it('should test selected_result fields for Biopsy', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        const fields = service.fields();

        const field = {
            model: {
                test_action: 'add_results',
                selected_test: 'Biopsy',
            },
            props: {},
        };

        const firstResultHide =
            fields[0].fieldGroup[2]['expressions']['hide'](field);
        expect(firstResultHide).toBeFalse();

        const secondResultHide =
            fields[0].fieldGroup[3]['expressions']['hide'](field);
        expect(secondResultHide).toBeTrue();
    });

    it('should test selected_result fields for Mammogram', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        const fields = service.fields();

        const field = {
            model: {
                test_action: 'add_results',
                selected_test: 'Mammogram',
            },
            props: {},
        };

        const firstResultHide =
            fields[0].fieldGroup[2]['expressions']['hide'](field);
        expect(firstResultHide).toBeTrue();

        const secondResultHide =
            fields[0].fieldGroup[6]['expressions']['hide'](field);
        expect(secondResultHide).toBeFalse();
    });

    it('should test selected_result fields for Ultrasound', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        const fields = service.fields();

        const field = {
            model: {
                test_action: 'add_results',
                selected_test: 'Ultrasound',
            },
            props: {},
        };

        const firstResultHide =
            fields[0].fieldGroup[2]['expressions']['hide'](field);
        expect(firstResultHide).toBeTrue();

        const secondResultHide =
            fields[0].fieldGroup[6]['expressions']['hide'](field);
        expect(secondResultHide).toBeFalse();
    });

    it('should test selected_result fields for MRI', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        const fields = service.fields();

        const field = {
            model: {
                test_action: 'add_results',
                selected_test: 'MRI',
            },
            props: {},
        };

        const firstResultHide =
            fields[0].fieldGroup[2]['expressions']['hide'](field);
        expect(firstResultHide).toBeTrue();

        const secondResultHide =
            fields[0].fieldGroup[6]['expressions']['hide'](field);
        expect(secondResultHide).toBeFalse();
    });

    it('should test selected_result fields hidden when not add_results', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        const fields = service.fields();

        const field = {
            model: {
                test_action: 'test_referral',
                selected_test: 'Mammogram',
            },
            props: {},
        };

        const firstResultHide =
            fields[0].fieldGroup[2]['expressions']['hide'](field);
        const secondResultHide =
            fields[0].fieldGroup[3]['expressions']['hide'](field);
        expect(firstResultHide).toBeTrue();
        expect(secondResultHide).toBeTrue();
    });

    it('should test selected_test field hidden when no test_action', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        const fields = service.fields();

        const field = {
            model: {},
            props: {},
        };

        const hideResult =
            fields[0].fieldGroup[1]['expressions']['hide'](field);
        expect(hideResult).toBeTrue();
    });

    it('should test ihc_test and IHC selected_result fields hide expressions', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        const fields = service.fields();

        const ihcTestField = fields[0].fieldGroup[3];
        const ihcResultField = fields[0].fieldGroup[4];
        const ki67ResultField = fields[0].fieldGroup[5];

        expect(ihcTestField['expressions']['hide']({ model: {} })).toBeTrue();
        expect(
            ihcTestField['expressions']['hide']({
                model: { test_action: 'add_results', selected_test: 'MRI' },
            })
        ).toBeTrue();
        expect(
            ihcTestField['expressions']['hide']({
                model: { test_action: 'add_results', selected_test: 'IHC' },
            })
        ).toBeFalse();

        expect(ihcResultField['expressions']['hide']({ model: {} })).toBeTrue();
        expect(
            ihcResultField['expressions']['hide']({
                model: { test_action: 'test_referral', selected_test: 'IHC' },
            })
        ).toBeTrue();
        expect(
            ihcResultField['expressions']['hide']({
                model: { test_action: 'add_results', selected_test: 'MRI' },
            })
        ).toBeTrue();
        expect(
            ihcResultField['expressions']['hide']({
                model: {
                    test_action: 'add_results',
                    selected_test: 'IHC',
                    ihc_test: undefined,
                },
            })
        ).toBeTrue();
        expect(
            ihcResultField['expressions']['hide']({
                model: {
                    test_action: 'add_results',
                    selected_test: 'IHC',
                    ihc_test: 'IHC_KI67',
                },
            })
        ).toBeTrue();
        expect(
            ihcResultField['expressions']['hide']({
                model: {
                    test_action: 'add_results',
                    selected_test: 'IHC',
                    ihc_test: 'IHC_HER2',
                },
            })
        ).toBeFalse();

        expect(
            ki67ResultField['expressions']['hide']({ model: {} })
        ).toBeTrue();
        expect(
            ki67ResultField['expressions']['hide']({
                model: { test_action: 'test_referral', selected_test: 'IHC' },
            })
        ).toBeTrue();
        expect(
            ki67ResultField['expressions']['hide']({
                model: { test_action: 'add_results', selected_test: 'MRI' },
            })
        ).toBeTrue();
        expect(
            ki67ResultField['expressions']['hide']({
                model: {
                    test_action: 'add_results',
                    selected_test: 'IHC',
                    ihc_test: 'IHC_HER2',
                },
            })
        ).toBeTrue();
        expect(
            ki67ResultField['expressions']['hide']({
                model: {
                    test_action: 'add_results',
                    selected_test: 'IHC',
                    ihc_test: 'IHC_KI67',
                },
            })
        ).toBeFalse();
    });

    it('should test date, attachment, facility, clinical_notes and referral_notes fields hide expressions', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        const fields = service.fields();

        const dateField = fields[0].fieldGroup[7];
        const attachmentField = fields[0].fieldGroup[8];
        const facilityField = fields[0].fieldGroup[9];
        const clinicalNotesField = fields[0].fieldGroup[10];
        const referralNotesField = fields[0].fieldGroup[11];

        expect(dateField['expressions']['hide']({ model: {} })).toBeTrue();
        expect(
            dateField['expressions']['hide']({
                model: { test_action: 'test_referral' },
            })
        ).toBeTrue();
        expect(
            dateField['expressions']['hide']({
                model: { test_action: 'add_results' },
            })
        ).toBeFalse();

        expect(
            attachmentField['expressions']['hide']({ model: {} })
        ).toBeTrue();
        expect(
            attachmentField['expressions']['hide']({
                model: { test_action: 'test_referral' },
            })
        ).toBeTrue();
        expect(
            attachmentField['expressions']['hide']({
                model: { test_action: 'add_results' },
            })
        ).toBeFalse();

        expect(facilityField['expressions']['hide']({ model: {} })).toBeTrue();
        expect(
            facilityField['expressions']['hide']({
                model: { test_action: 'add_results' },
            })
        ).toBeTrue();
        expect(
            facilityField['expressions']['hide']({
                model: { test_action: 'test_referral' },
            })
        ).toBeFalse();

        expect(
            clinicalNotesField['expressions']['hide']({ model: {} })
        ).toBeTrue();
        expect(
            clinicalNotesField['expressions']['hide']({
                model: { test_action: 'test_referral' },
            })
        ).toBeTrue();
        expect(
            clinicalNotesField['expressions']['hide']({
                model: { test_action: 'add_results' },
            })
        ).toBeFalse();

        expect(
            referralNotesField['expressions']['hide']({ model: {} })
        ).toBeTrue();
        expect(
            referralNotesField['expressions']['hide']({
                model: { test_action: 'add_results' },
            })
        ).toBeTrue();
        expect(
            referralNotesField['expressions']['hide']({
                model: { test_action: 'test_referral' },
            })
        ).toBeFalse();
    });

    it('should test test_action model expression when model is undefined', () => {
        const comp = {
            fields: [
                { props: {} },
                { props: {} },
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        const fields = service.fields();

        const testActionField = fields[0].fieldGroup[0];
        const result = testActionField['expressions']['model.test_action']({
            props: {},
        });

        expect(result).toBeUndefined();
    });

    it('should test setComponent initializes test data', () => {
        const comp = {
            fields: [],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);

        expect(service.tests.length).toBe(5);
        expect(service.biradsTestResults.length).toBe(7);
        expect(service.regularTestResults.length).toBe(8);
        expect(service.tests[0].title).toBe('Mammogram');
        expect(service.biradsTestResults[0].title).toBe(
            'Incomplete (BIRADS 0)'
        );
        expect(service.regularTestResults[0].title).toBe('Normal');
    });
});

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
import { BreastCancerExaminationService } from './breast-cancer-examinations-form';
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

describe('BreastCancerExaminationServiceForm', () => {
    let service: BreastCancerExaminationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                BreastCancerExaminationService,
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

        service = TestBed.inject(BreastCancerExaminationService);
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
                        screening_type: 'First time screening',
                        selected_test: 'CBE(Clinical Breast Exam)',
                        test_type: 'Add results',
                        selected_result: 'Negative',
                        additional_notes: 'N/A',
                        data: '',
                    },
                    {
                        screening_type: 'First time screening',
                        selected_test: 'Ultrasound',
                        test_type: 'Add results',
                        selected_result: 'Negative',
                        additional_notes: 'N/A',
                        data: '',
                    },
                    {
                        screening_type: 'First time screening',
                        selected_test: 'MRI',
                        test_type: 'Add results',
                        selected_result: 'Negative',
                        additional_notes: 'N/A',
                        data: '',
                    },
                    {
                        screening_type: 'First time screening',
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
            defaultValue: 'CBE(Clinical Breast Exam)',
        };

        fields[0].fieldGroup[0]['expressions']['model.screening_type'](field);
        fields[0].fieldGroup[1]['expressions']['model.selected_test'](field);
        fields[0].fieldGroup[2]['expressions']['model.selected_result'](field);
        fields[0].fieldGroup[3]['expressions']['model.attachment'](field);

        fields[0].fieldGroup[3].props.addFile(field.model);

        fields[0].fieldGroup[3]['expressions']['model.file']();
        fields[0].fieldGroup[4]['expressions']['model.clinical_notes'](field);
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
                screening_type: 'First time screening',
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
            defaultValue: 'CBE(Clinical Breast Exam)',
        };

        fields[0].fieldGroup[0]['expressions']['model.screening_type'](field);
        fields[0].fieldGroup[1]['expressions']['model.selected_test'](field);
        fields[0].fieldGroup[2]['expressions']['hide'](field);
        fields[0].fieldGroup[3]['expressions']['hide'](field);
        fields[0].fieldGroup[4]['expressions']['hide'](field);
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
                screening_type: 'First time screening',
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
        fields[0].fieldGroup[2]['expressions']['hide'](field);
        fields[0].fieldGroup[3]['expressions']['hide'](field);
        fields[0].fieldGroup[4]['expressions']['hide'](field);
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
                screening_type: 'First time screening',
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
            defaultValue: 'CBE(Clinical Breast Exam)',
        };

        fields[0].fieldGroup[0]['expressions']['model.screening_type'](field);
        const fieldSelectedTest = {
            model: {
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

        fields[0].fieldGroup[2]['expressions']['hide'](fieldResultsAction);
        fields[0].fieldGroup[3]['expressions']['hide'](field);
        fields[0].fieldGroup[4]['expressions']['hide'](field);
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
                screening_type: 'First time screening',
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
            defaultValue: 'CBE(Clinical Breast Exam)',
        };

        fields[0].fieldGroup[0]['expressions']['model.screening_type'](field);
        const fieldSelectedTest = {
            model: {
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
        fields[0].fieldGroup[2]['expressions']['hide'](fieldResultsAction);
        fields[0].fieldGroup[3]['expressions']['hide'](fieldResultsAction);
        fields[0].fieldGroup[4]['expressions']['hide'](fieldResultsAction);
        expect(service.fields).toHaveBeenCalled();
    });
});

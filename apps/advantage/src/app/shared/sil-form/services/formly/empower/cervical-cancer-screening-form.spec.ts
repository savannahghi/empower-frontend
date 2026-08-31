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
import { CervicalCancerScreeningService } from './cervical-cancer-screening-form';
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

describe('CervicalCancerScreeningForm', () => {
    let service: CervicalCancerScreeningService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                CervicalCancerScreeningService,
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

        service = TestBed.inject(CervicalCancerScreeningService);
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
                selected_test: 'Pap smear/cytology',
                test_action: 'add_results',
                selected_result: 'Negative',
                additional_notes: 'N/A',
                facility: 'Savannah',
                referral_notes: 'notes',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'Pap smear/cytology',
        };

        fields[0].fieldGroup[0]['expressions']['model.test_action'](field);
        fields[0].fieldGroup[1]['expressions']['model.selected_test'](field);
        fields[0].fieldGroup[2]['expressions']['model.selected_result'](field);
        fields[0].fieldGroup[3]['expressions']['model.selected_result'](field);
        fields[0].fieldGroup[4]['expressions']['model.selected_result'](field);

        fields[0].fieldGroup[5]['expressions']['model.facility'](field);
        fields[0].fieldGroup[6]['expressions']['model.additional_notes'](field);
        fields[0].fieldGroup[7]['expressions']['model.referral_notes'](field);

        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields if test is Pap smear', () => {
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
                selected_test: 'Pap smear/cytology',
                test_action: 'add_results',
                selected_result: 'Negative',
                additional_notes: 'N/A',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'Pap smear/cytology',
        };

        fields[0].fieldGroup[1]['expressions']['model.selected_test'](field);

        fields[0].fieldGroup[2]['expressions']['hide'](field);
        fields[0].fieldGroup[3]['expressions']['hide'](field);
        fields[0].fieldGroup[4]['expressions']['hide'](field);
        fields[0].fieldGroup[5]['expressions']['hide'](field);
        fields[0].fieldGroup[6]['expressions']['hide'](field);

        fields[0].fieldGroup[7]['expressions']['hide'](field);

        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields if test is HPV', () => {
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
                selected_test: 'HPV',
                test_action: 'add_results',
                selected_result: 'Negative',
                additional_notes: 'N/A',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'Pap smear/cytology',
        };

        fields[0].fieldGroup[1]['expressions']['model.selected_test'](field);

        fields[0].fieldGroup[2]['expressions']['hide'](field);
        fields[0].fieldGroup[3]['expressions']['hide'](field);
        fields[0].fieldGroup[4]['expressions']['hide'](field);
        fields[0].fieldGroup[5]['expressions']['hide'](field);
        fields[0].fieldGroup[6]['expressions']['hide'](field);

        fields[0].fieldGroup[7]['expressions']['hide'](field);

        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields if is a referral', () => {
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
                selected_test: 'Pap smear/cytology',
                test_action: 'test_referral',
                selected_result: 'Negative',
                additional_notes: 'N/A',
                facility: 'Savannah',
                referral_notes: 'N/A',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'Pap smear/cytology',
        };

        fields[0].fieldGroup[0]['expressions']['model.test_action'](field);
        fields[0].fieldGroup[1]['expressions']['model.selected_test'](field);
        fields[0].fieldGroup[2]['expressions']['model.selected_result'](field);
        fields[0].fieldGroup[3]['expressions']['model.selected_result'](field);
        fields[0].fieldGroup[4]['expressions']['model.selected_result'](field);

        fields[0].fieldGroup[5]['expressions']['model.facility'](field);
        fields[0].fieldGroup[6]['expressions']['model.additional_notes'](field);
        fields[0].fieldGroup[7]['expressions']['model.referral_notes'](field);

        expect(service.fields).toHaveBeenCalled();
    });
});
